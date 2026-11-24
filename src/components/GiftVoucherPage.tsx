import { euro, voucherOffers, voucherSessionSummary, type VoucherOffer } from '../voucher-offers';
import { voucherCheckoutUrl, voucherSalesEnabled } from '../voucher-checkout';
import { Footer } from './Footer';
import { GlassPanel } from './GlassPanel';
import { GradientButton } from './GradientButton';
import { Layout } from './Layout';
import { TopNav } from './TopNav';
import './gift-voucher-section.css';

function GiftOffer({ offer }: { offer: VoucherOffer }) {
  const featured = offer.id === 'sitzung';
  const regularValue = offer.intro * 60 + offer.standard * 120;
  const checkoutUrl = voucherSalesEnabled ? voucherCheckoutUrl(offer.id) : undefined;
  const buyLabel = `${offer.name}: Gutschein kaufen`;

  return (
    <article className={`gift-shop-offer${featured ? ' gift-shop-featured' : ''}`}>
      <div>
        <h3 className={featured ? 'heading-lg' : 'heading-md'}>{offer.name}</h3>
        <div className="text-body">
          <p className="gift-shop-detail">{voucherSessionSummary(offer)}</p>
          <p>{offer.description}</p>
          {offer.intro > 0 && <p className="gift-shop-detail">Nur für Menschen, die zum ersten Mal zu mir kommen.</p>}
        </div>
      </div>
      <div className="gift-shop-order">
        <p className={featured ? 'heading-lg' : 'heading-md'}>{euro(offer.price)}</p>
        {regularValue > offer.price && <p className="gift-shop-detail text-body">Einzeln {euro(regularValue)}</p>}
        {checkoutUrl && (featured ? (
          <GradientButton href={checkoutUrl}>Volle Sitzung verschenken</GradientButton>
        ) : (
          <a href={checkoutUrl} aria-label={buyLabel}>Gutschein kaufen</a>
        ))}
        {!checkoutUrl && import.meta.env.DEV && (
          <a href={`/gutschein/${offer.id}`} aria-label={`${offer.name}: Muster ansehen`}>Muster ansehen</a>
        )}
      </div>
    </article>
  );
}

export function GiftVoucherPage() {
  return (
    <Layout fixedBlossoms={false}>
      <TopNav hideBooking />
      <main className="full-width-section gift-shop gift-shop-page" lang="de">
        <GlassPanel className="full-width-glass-panel">
          <div className="space-y-12">
            <section id="weihnachten" aria-labelledby="gift-shop-title">
              <header className="gift-shop-copy">
                <h1 id="gift-shop-title" className="heading-xl">Gutscheine</h1>
                <div className="separator" aria-hidden="true" />
                <div className="text-body">
                  <p>Schenke loslasszen. Dir oder deinen Liebsten.</p>
                  <p>Wähle eine volle Sitzung für 120 € oder eine Kennenlern-Sitzung für 60 €.</p>
                  <p><a className="gift-shop-link" href="#einloesebedingungen">Gültigkeit und Einlösebedingungen</a></p>
                </div>
              </header>
              <div className="gift-shop-singles">
                {voucherOffers.slice(0, 2).map(offer => <GiftOffer key={offer.id} offer={offer} />)}
              </div>
            </section>

            <section className="gift-shop-packages" aria-labelledby="gift-packages-title">
              <h2 id="gift-packages-title" className="heading-lg">Für Menschen, die sich eine längere Begleitung wünschen</h2>
              {voucherOffers.slice(2).map(offer => <GiftOffer key={offer.id} offer={offer} />)}
            </section>

            <section id="einloesebedingungen" className="gift-shop-copy gift-shop-how" aria-labelledby="gift-terms-title">
              <h2 id="gift-terms-title" className="heading-lg">Gültigkeit und Einlösebedingungen</h2>
              <dl className="text-body">
                <dt>Gutschein erhalten</dt>
                <dd>Nach der Zahlung erhältst du den Gutschein per E-Mail. Du kannst ihn weiterleiten oder ausdrucken.</dd>
                <dt>Gültigkeit</dt>
                <dd>Der Gutschein ist bis zum Ende des dritten Kalenderjahres nach dem Kauf einlösbar. Das genaue Datum steht auf dem Gutschein.</dd>
                <dt>Weitergeben</dt>
                <dd>Du kannst den Gutschein verschenken und vor der ersten Einlösung weitergeben. Ein Paket ist für eine Person gedacht.</dd>
                <dt>Termin vereinbaren</dt>
                <dd>Öffne den Buchungslink auf dem Gutschein und gib den Code ein. Du zahlst keine weitere Anzahlung. Der Termin ist verbindlich, sobald ich ihn bestätigt habe.</dd>
                <dt>Einlösen</dt>
                <dd>Der Gutschein gilt für die genannten Sitzungen in Eberswalde. Bei einem Paket buchst du die Sitzungen einzeln. Angebote mit Kennenlern-Sitzung sind für Neukund:innen.</dd>
              </dl>
              <p className="gift-shop-detail text-body">Körperarbeit ersetzt keine medizinische oder psychotherapeutische Behandlung. Sie kann diese persönlich begleiten und ergänzen.</p>
            </section>
          </div>
        </GlassPanel>
      </main>
      <Footer />
    </Layout>
  );
}
