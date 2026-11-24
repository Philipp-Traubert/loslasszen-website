import { voucherDb } from '../vouchers/store.js';

const headers = { 'Cache-Control': 'no-store' };

async function getVoucher(req: Request) {
  if (req.method !== 'POST') return new Response(null, { status: 405, headers: { ...headers, Allow: 'POST' } });
  const body = await req.json().catch(() => null);
  const code = body?.code;
  if (typeof code !== 'string' || !/^LLZ(?:-[A-F0-9]{5}){4}$/.test(code)) return new Response(null, { status: 400, headers });

  try {
    const [voucher] = await voucherDb()`
      SELECT offer_id AS "offerId", to_char(valid_through, 'DD.MM.YYYY') AS "validThrough"
      FROM vouchers WHERE code = ${code}
        AND valid_through >= (now() AT TIME ZONE 'Europe/Berlin')::date
        AND NOT EXISTS (SELECT 1 FROM voucher_refunds WHERE payment_intent = vouchers.payment_intent)
    `;
    if (!voucher) return new Response(null, { status: 404, headers });
    return Response.json(voucher, { headers });
  } catch {
    return new Response(null, { status: 503, headers });
  }
}

export default { fetch: getVoucher };
