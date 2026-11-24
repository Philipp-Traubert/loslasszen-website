import type { VoucherOffer, VoucherSession } from './voucher-offers';

const paymentLinks: Partial<Record<VoucherOffer['id'], string | undefined>> = {
  sitzung: import.meta.env.VITE_VOUCHER_STRIPE_STANDARD_URL,
  kennenlernen: import.meta.env.VITE_VOUCHER_STRIPE_INTRO_URL,
  'ankommen-und-vertiefen': import.meta.env.VITE_VOUCHER_STRIPE_ANKOMMEN_URL,
  vertiefung: import.meta.env.VITE_VOUCHER_STRIPE_VERTIEFUNG_URL,
  'intensive-begleitung': import.meta.env.VITE_VOUCHER_STRIPE_INTENSIV_URL,
};

function stripePaymentUrl(value: string | undefined) {
  try {
    const url = new URL(value ?? '');
    if (url.origin !== 'https://buy.stripe.com' || !/^\/[a-z0-9_]+$/i.test(url.pathname)) return;
    if (import.meta.env.PROD && url.pathname.startsWith('/test_')) return;
    return url.href;
  } catch {
    return undefined;
  }
}

export function voucherCheckoutUrl(id: VoucherOffer['id']) {
  return stripePaymentUrl(paymentLinks[id]);
}

export function voucherChristmasCheckoutUrl() {
  return stripePaymentUrl(import.meta.env.VITE_VOUCHER_STRIPE_CHRISTMAS_URL);
}

const bookingLinks: Record<VoucherSession, string | undefined> = {
  kennenlernen: import.meta.env.VITE_VOUCHER_CAL_INTRO_URL,
  sitzung: import.meta.env.VITE_VOUCHER_CAL_STANDARD_URL,
};

export function voucherBookingUrl(type: VoucherSession) {
  try {
    const url = new URL(bookingLinks[type] ?? '');
    if (['https://cal.com', 'https://cal.eu'].includes(url.origin) && /^\/[^/]+\/[^/]+/.test(url.pathname)) return url.href;
  } catch {
    return undefined;
  }
}

const checkouts = Object.keys(paymentLinks).map(id => voucherCheckoutUrl(id as VoucherOffer['id']));
export const voucherSalesEnabled = import.meta.env.VITE_VOUCHER_SALES_ENABLED === 'true'
  && checkouts.every(Boolean) && new Set(checkouts).size === checkouts.length
  && Boolean(voucherBookingUrl('kennenlernen') && voucherBookingUrl('sitzung'))
  && voucherBookingUrl('kennenlernen') !== voucherBookingUrl('sitzung');

export const voucherChristmasSalesEnabled = import.meta.env.VITE_VOUCHER_SALES_ENABLED === 'true'
  && Date.now() < Date.parse('2026-12-23T23:00:00Z')
  && Boolean(voucherChristmasCheckoutUrl() && voucherCheckoutUrl('kennenlernen'))
  && voucherChristmasCheckoutUrl() !== voucherCheckoutUrl('kennenlernen')
  && Boolean(voucherBookingUrl('kennenlernen') && voucherBookingUrl('sitzung'))
  && voucherBookingUrl('kennenlernen') !== voucherBookingUrl('sitzung');
