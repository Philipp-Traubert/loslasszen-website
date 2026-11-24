import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { christmasVoucherOffer, voucherOffers, voucherSessions, type VoucherSession } from '../voucher-offers';
import { GiftVoucherCard } from './GiftVoucherCard';
import { GiftVoucherQr } from './GiftVoucherQr';
import { GlassPanel } from './GlassPanel';
import { voucherBookingUrl } from '../voucher-checkout';

function VoucherLinks({ type, count }: { type: VoucherSession; count: number }) {
  const { name, infoPath } = voucherSessions[type];
  const booking = voucherBookingUrl(type);

  return (
    <section className="gift-recipient-session" aria-label={name}>
      <h2 className="heading-sm">{count === 1 ? name : `${count} volle Sitzungen`}</h2>
      <div className="gift-recipient-actions">
        <a className="gift-screen-only gift-text-link" href={infoPath}>Mehr Infos</a>
        <GiftVoucherQr url={new URL(infoPath, 'https://loslasszen.de').href} label="Mehr Infos" />
        {booking ? (
          <>
            <a className="gift-screen-only gift-text-link" href={booking}>Termin direkt buchen</a>
            <GiftVoucherQr url={booking} label="Termin direkt buchen" />
          </>
        ) : <p className="gift-booking-pending">Termin direkt buchen: Buchungslink noch nicht eingerichtet.</p>}
      </div>
    </section>
  );
}

export function GiftVoucherRecipient({ offerId }: { offerId: string }) {
  const code = window.location.hash.slice(1);
  const sample = import.meta.env.DEV && !code;
  const [details, setDetails] = useState<{ offerId: string; validThrough: string }>();
  const [status, setStatus] = useState<'loading' | 'invalid' | 'error'>(code ? 'loading' : 'invalid');
  const offer = [...voucherOffers, christmasVoucherOffer].find(item => item.id === (sample ? offerId : details?.offerId));

  useEffect(() => {
    if (!code) return;
    const abort = new AbortController();
    fetch('/api/voucher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
      signal: abort.signal,
    }).then(async response => {
      if (response.status === 400 || response.status === 404) return setStatus('invalid');
      if (!response.ok) return setStatus('error');
      setDetails(await response.json());
    }).catch(() => {
      if (!abort.signal.aborted) setStatus('error');
    });
    return () => abort.abort();
  }, [code]);

  return (
    <div className="gift-page gift-recipient">
      <header className="gift-header gift-wrap gift-screen-only">
        <a className="gift-home" href="/" aria-label="loslasszen, zur Startseite">
          <img src={logo} alt="loslasszen" width="1024" height="558" />
        </a>
        {offer && <button type="button" className="gift-text-link" onClick={() => window.print()}>Gutschein drucken</button>}
      </header>

      <main className="gift-wrap gift-recipient-main">
        <GlassPanel className="full-width-glass-panel gift-content-panel">
          {offer ? (
            <>
              <h1 className="gift-recipient-title heading-lg">Dein Geschenkgutschein</h1>
              <GiftVoucherCard offer={offer} issued={Boolean(details)} />
              <div className="gift-recipient-copy text-body">
                <p>Gutscheincode: <strong>{details ? code : 'MUSTER'}</strong></p>
                {details && <p>Einlösbar bis einschließlich {details.validThrough}.</p>}
                <p>Gib deinen Gutscheincode bei der Buchung ein.{offer.standard > 1 && ' Buche jede Sitzung einzeln und gib denselben Code an.'}</p>
                {offer.intro > 0 && offer.id !== 'weihnachten' && <p>Die Kennenlern-Sitzung ist für Menschen, die zum ersten Mal zu mir kommen.</p>}
              </div>
              {offer.intro > 0 && <VoucherLinks type="kennenlernen" count={offer.intro} />}
              {offer.standard > 0 && <VoucherLinks type="sitzung" count={offer.standard} />}
            </>
          ) : (
            <>
              <h1 className="gift-recipient-title heading-lg">{status === 'loading' ? 'Gutschein wird geladen' : status === 'error' ? 'Gutschein konnte nicht geladen werden' : 'Kein gültiger Gutschein gefunden'}</h1>
              {status === 'error' && <p className="text-body">Lade die Seite erneut. Wenn es weiter nicht klappt, schreib mir an <a href="mailto:jetzt@loslasszen.de">jetzt@loslasszen.de</a>.</p>}
            </>
          )}
        </GlassPanel>
      </main>
    </div>
  );
}
