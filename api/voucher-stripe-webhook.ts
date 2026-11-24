import { randomBytes } from 'node:crypto';
import Stripe from 'stripe';
import { christmasVoucherOffer, voucherOffers } from '../src/voucher-offers';
import { voucherDb } from '../vouchers/store';
import { voucherEmail, voucherEmailFrom, voucherReplyTo } from '../vouchers/email';

function id(value: string | { id: string } | null) {
  return typeof value === 'string' ? value : value?.id;
}

async function handleWebhook(req: Request) {
  if (req.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.VOUCHER_STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get('stripe-signature');
  if (!stripeKey || !webhookSecret) return new Response(null, { status: 503 });
  if (!signature) return new Response(null, { status: 400 });

  const stripe = new Stripe(stripeKey);
  let event: Stripe.Event;
  try {
    const body = Buffer.from(await req.arrayBuffer());
    if (body.length > 1024 * 1024) return new Response(null, { status: 413 });
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (event.livemode !== /^(sk|rk)_live_/.test(stripeKey)) return new Response(null, { status: 400 });

  try {
    if (event.type === 'charge.refunded') {
      const intent = id(event.data.object.payment_intent);
      if (intent) {
        const stripeIntent = await stripe.paymentIntents.retrieve(intent);
        if (stripeIntent.metadata.loslasszen_voucher === 'true') {
          await voucherDb()`INSERT INTO voucher_refunds (payment_intent) VALUES (${intent}) ON CONFLICT DO NOTHING`;
        }
      }
    } else if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      if (session.mode === 'payment' && session.payment_status === 'paid') {
        await issueVoucher(stripe, session, new Date(event.created * 1000));
      }
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Voucher webhook failed', event.id, error instanceof Error ? error.name : 'UnknownError');
    return new Response(null, { status: 500 });
  }
}

export default { fetch: handleWebhook };

async function issueVoucher(stripe: Stripe, session: Stripe.Checkout.Session, issuedAt: Date) {
  const link = id(session.payment_link);
  if (!link) return;
  const paymentLinks = JSON.parse(process.env.VOUCHER_STRIPE_LINK_IDS || '{}') as Record<string, string>;
  if (Object.values(paymentLinks).filter(value => value === link).length > 1) throw new Error('Ambiguous voucher payment link');
  const testOffer = paymentLinks.weihnachten_test === link;
  const christmasOffer = paymentLinks.weihnachten === link || testOffer;
  const offer = christmasOffer ? christmasVoucherOffer : voucherOffers.find(item => paymentLinks[item.id] === link);
  if (!offer) return;
  const intent = id(session.payment_intent);
  const buyer = session.customer_details?.email;
  const amount = testOffer ? 100 : offer.price * 100;
  if (!intent || !buyer || session.currency !== 'eur' || session.amount_total !== amount) {
    throw new Error('Unexpected voucher payment');
  }

  const payment = await stripe.paymentIntents.retrieve(intent, { expand: ['latest_charge'] });
  if (payment.metadata.loslasszen_voucher !== 'true') throw new Error('Missing voucher payment marker');
  if (typeof payment.latest_charge !== 'object' || !payment.latest_charge) throw new Error('Missing charge');
  if (payment.latest_charge.amount_refunded > 0) return;

  const sender = process.env.VOUCHER_EMAIL_FROM || voucherEmailFrom;
  const resendKey = process.env.RESEND_API_KEY;
  const origin = process.env.VOUCHER_SITE_ORIGIN;
  if (!resendKey || !origin) throw new Error('Missing voucher delivery configuration');

  const sql = voucherDb();
  const code = 'LLZ-' + randomBytes(10).toString('hex').toUpperCase().replace(/(.{5})(?=.)/g, '$1-');
  const year = Number(new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', year: 'numeric' }).format(issuedAt));
  const validThrough = `${year + 3}-12-31`;
  await sql`
    INSERT INTO vouchers (checkout_id, payment_intent, code, offer_id, intro_count, standard_count, issued_at, valid_through)
    VALUES (${session.id}, ${intent}, ${code}, ${offer.id}, ${offer.intro}, ${offer.standard}, ${issuedAt}, ${validThrough})
    ON CONFLICT (checkout_id) DO NOTHING
  `;
  const [voucher] = await sql<{ code: string; valid_through: string; delivery_expired: boolean }[]>`
    SELECT code, to_char(valid_through, 'DD.MM.YYYY') AS valid_through,
      delivery_started_at < now() - interval '23 hours' AS delivery_expired
    FROM vouchers WHERE checkout_id = ${session.id} AND delivery_id IS NULL
    AND NOT EXISTS (SELECT 1 FROM voucher_refunds WHERE payment_intent = ${intent})
  `;
  if (!voucher) return;
  if (voucher.delivery_expired) throw new Error('Delivery requires manual review');

  const url = new URL(`/gutschein/${offer.id}`, origin);
  url.hash = voucher.code;
  const email = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `loslasszen-voucher/${session.id}`,
    },
    body: JSON.stringify({
      from: sender,
      reply_to: voucherReplyTo,
      to: [buyer],
      ...voucherEmail({ offer, code: voucher.code, validThrough: voucher.valid_through, url: url.href, logoUrl: new URL('/email/loslasszen-logo.png', origin).href }),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!email.ok) throw new Error('Voucher delivery failed');
  const delivery = await email.json() as { id?: string };
  if (!delivery.id) throw new Error('Missing email delivery id');
  await sql`UPDATE vouchers SET delivery_id = ${delivery.id} WHERE checkout_id = ${session.id}`;
}
