import { useState } from 'react';
import logo from '../assets/logo.png';
import { euro, voucherOffers, voucherSessionSummary } from '../voucher-offers';
import { GiftVoucherCard } from './GiftVoucherCard';
import { GlassPanel } from './GlassPanel';

export function GiftVoucherPreview() {
  const [offer, setOffer] = useState(() => {
    const id = new URLSearchParams(window.location.search).get('angebot');
    return voucherOffers.find(item => item.id === id) ?? voucherOffers[0];
  });
  const [message, setMessage] = useState('');

  return (
    <div className="gift-page">
      <header className="gift-header gift-wrap">
        <a className="gift-home" href="/" aria-label="loslasszen, zur Startseite">
          <img src={logo} alt="loslasszen" width="1024" height="558" />
        </a>
        <span>Gutscheinmuster</span>
      </header>

      <main className="gift-wrap">
        <GlassPanel className="full-width-glass-panel gift-content-panel">
          <section className="gift-hero" aria-labelledby="gift-title">
            <div className="gift-intro text-body">
              <h1 id="gift-title" className="heading-xl">Zeit zum loslasszen verschenken.</h1>
              <p>Verschenke eine Sitzung oder mehrere Stunden Körperarbeit in Eberswalde.</p>

              <fieldset className="gift-options">
                <legend>Was möchtest du verschenken?</legend>
                {voucherOffers.map((item) => (
                  <label className="gift-option" key={item.id}>
                    <input type="radio" name="gift-offer" value={item.id} checked={offer.id === item.id} onChange={() => setOffer(item)} />
                    <span className="gift-option-copy">
                      <strong>{item.name}</strong>
                      <span>{voucherSessionSummary(item)}{item.intro ? ' · Für Neukund:innen' : ''}</span>
                    </span>
                    <span className="gift-price">{euro(item.price)}</span>
                  </label>
                ))}
              </fieldset>

              <label className="gift-message-label" htmlFor="gift-message">Persönliche Nachricht <span>(optional)</span></label>
              <textarea id="gift-message" rows={2} maxLength={100} value={message} onChange={(event) => setMessage(event.target.value)} />
            </div>

            <figure className="gift-preview">
              <GiftVoucherCard offer={offer} message={message} />
              <figcaption>
                <a className="gift-text-link" href={`/gutschein/${offer.id}`}>Ansicht für Beschenkte öffnen</a>
              </figcaption>
            </figure>
          </section>

          <section className="gift-how" aria-labelledby="gift-how-title">
            <h2 id="gift-how-title" className="heading-lg">So löst du den Gutschein ein</h2>
            <p className="text-body">Wähle über den Link auf dem Gutschein einen Termin und gib deinen Code ein. Nach der Prüfung erhältst du eine Bestätigung.</p>
          </section>
        </GlassPanel>
      </main>
    </div>
  );
}
