import { useState } from 'react';
import { voucherEmail, voucherEmailFrom, voucherReplyTo } from '../../vouchers/email';
import { voucherOffers } from '../voucher-offers';
import { GlassPanel } from './GlassPanel';
import '../styles/gift-vouchers.css';

export function GiftVoucherEmailPreview() {
  const [offerId, setOfferId] = useState('sitzung');
  const [theme, setTheme] = useState('light dark');
  const offer = voucherOffers.find(item => item.id === offerId)!;
  const email = voucherEmail({
    offer, code: 'MUSTER-NICHT-EINLOESBAR', validThrough: '31.12.2029',
    url: new URL(`/gutschein/${offer.id}`, window.location.origin).href,
    logoUrl: new URL('/email/loslasszen-logo.png', window.location.origin).href,
    darkLogoUrl: new URL('/email/loslasszen-logo-white.png', window.location.origin).href,
  });
  return (
    <main className="gift-page" lang="de" style={{ padding: '24px 12px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <GlassPanel>
          <h1 className="heading-2">E-Mail-Vorschau</h1>
          <p className="text-body">Lokales Muster. Es wird keine E-Mail versendet.</p>
          <p className="text-body">Von: {voucherEmailFrom}<br />Antworten an: {voucherReplyTo}<br />Betreff: {email.subject}</p>
          <label className="text-body">Angebot: <select value={offerId} onChange={event => setOfferId(event.target.value)}>
            {voucherOffers.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select></label>
          <label className="text-body" style={{ display: 'block', marginTop: 12 }}>Darstellung: <select value={theme} onChange={event => setTheme(event.target.value)}>
            <option value="light dark">Wie auf dem Gerät</option>
            <option value="light">Hell</option>
            <option value="dark">Dunkel</option>
          </select></label>
        </GlassPanel>
        <iframe title="Gutschein-E-Mail" srcDoc={email.html} sandbox="allow-popups allow-popups-to-escape-sandbox" style={{ colorScheme: theme, width: '100%', height: 1200, border: 0, display: 'block', marginTop: 24 }} />
      </div>
    </main>
  );
}
