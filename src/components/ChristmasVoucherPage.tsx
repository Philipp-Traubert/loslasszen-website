import { voucherCheckoutUrl, voucherChristmasSalesEnabled } from '../voucher-checkout';
import { Footer } from './Footer';
import { GlassPanel } from './GlassPanel';
import { GradientButton } from './GradientButton';
import { Layout } from './Layout';
import { TopNav } from './TopNav';
import { SumiEImage } from './SumiEImage';
import { InlineReviewsCarousel } from './reviews/InlineReviewsCarousel';
import winterBranch from '../assets/branch-winter-candles.png';
import './gift-voucher-section.css';
import './christmas-voucher.css';

export function ChristmasVoucherPage() {
  const introCheckout = voucherChristmasSalesEnabled ? voucherCheckoutUrl('kennenlernen') : undefined;

  return (
    <Layout winterBlossoms>
      <TopNav hideBooking />
      <main className="gift-shop christmas-voucher" lang="de">
        <section className="intro-shell">
          <div className="intro-sticky-stage" aria-hidden="true">
            <SumiEImage src={winterBranch} alt="" className="sumi-e-image--section" />
          </div>
          <div className="content-section intro-content-section">
            <GlassPanel className="glass-panel-custom home-intro-panel">
              <div className="space-y-12">
            <section aria-labelledby="christmas-heading" className="christmas-intro">
              <p className="text-body christmas-label">Körperarbeit in Eberswalde</p>
              <h1 id="christmas-heading" className="heading-xl">loslasszen<br />Weihnachtsgutschein</h1>
              <h3 className="heading-md christmas-subheading">Lass endlich los, was dein Körper schon zu lange trägt.</h3>
              <div className="separator" aria-hidden="true" />
              <div className="text-body christmas-copy">
                <p>Schenke dir selbst oder einem anderen Menschen, der dir wichtig ist, Zeit zum Ankommen, Spüren und Loslassen.</p>
                <h2 className="heading-lg">Weihnachtsgutschein: Ankommen &amp; Vertiefen</h2>
                <p>Eine Kennenlern-Sitzung und eine anschließende volle Körperarbeits-Sitzung.</p>
                <p className="heading-lg christmas-price">Weihnachtspreis: 150 €</p>
                <p>Wert: 180 €<br />Ersparnis: 30 €<br />Erhältlich bis 23.12.2026</p>
                <p>Der Gutschein kann vom Käufer selbst genutzt oder verschenkt werden.</p>
                <p className="gift-shop-detail">Maximal ein rabattierter Gutschein pro Person oder Haushalt. Nicht mit anderen Rabatten kombinierbar.</p>
              </div>
            </section>

            <section className="space-y-6" aria-labelledby="christmas-overview-heading">
              <h2 id="christmas-overview-heading" className="heading-lg">Auf einen Blick</h2>
              <div className="text-body">
                <ul className="pl-6 list-bullet">
                  <li>Ganzheitliche, nicht-medizinische Körperarbeit in Eberswalde.</li>
                  <li>Für Menschen, die bereit sind, ihre Schmerzen loszulassen.</li>
                  <li>Entspannung und Ausrichtung des Gewebes.</li>
                  <li>Sicherer und unterstützender Raum für alles was da ist.</li>
                  <li>Sitzungen dauern 60 Minuten.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-8" aria-labelledby="christmas-session-heading">
              <h2 id="christmas-session-heading" className="heading-lg">Was dich in einer Sitzung erwartet</h2>
              <div className="space-y-6 text-body">
                <div>
                  <h3 className="heading-sm">Kurzes Ankommen und Einchecken</h3>
                  <p className="leading-relaxed">Was beschäftigt dich heute und wo soll meine Aufmerksamkeit hingehen? Was sind länger anhaltende Themen und Muster deines Körpers?</p>
                </div>
                <div>
                  <h3 className="heading-sm">Nackenarbeit zur Entspannung</h3>
                  <p className="leading-relaxed">Jede Sitzung beginnt und endet mit Nackenarbeit. Ein entspannter Nacken entspannt den ganzen Körper.</p>
                </div>
                <div>
                  <h3 className="heading-sm">Deine individuell angepasste Sitzung</h3>
                  <p className="leading-relaxed">Den Großteil der Sitzung arbeiten wir entsprechend deiner präsenten Beschwerden oder Schmerzen.</p>
                </div>
                <div>
                  <h3 className="heading-sm">Integration in deinen Körper</h3>
                  <p className="leading-relaxed">Zum Abschluss richten wir deinen Körper neu aus, um die Arbeit nachhaltig in dein System zu integrieren.</p>
                </div>
              </div>
            </section>

              </div>
            </GlassPanel>
          </div>
        </section>

        <div className="full-width-section christmas-voucher-content">
        <GlassPanel className="full-width-glass-panel">
          <InlineReviewsCarousel />
        </GlassPanel>

        <GlassPanel className="full-width-glass-panel">
          <div className="space-y-12">
            <section aria-labelledby="christmas-how-heading">
              <h2 id="christmas-how-heading" className="heading-lg">So funktioniert es</h2>
              <ol className="text-body christmas-steps">
                <li>Gutschein kaufen und digital per E-Mail erhalten.</li>
                <li>Selbst nutzen, digital verschenken oder ausdrucken.</li>
                <li>Termin über den Link auf dem Gutschein vereinbaren und den Gutscheincode eingeben.</li>
                <li>Nach meiner Bestätigung zum Termin in Eberswalde ankommen.</li>
              </ol>
              <p className="text-body christmas-followup">Nach der ersten Sitzung kann bei passendem Bedarf gemeinsam eine regelmäßige Begleitung vereinbart werden: eine Sitzung alle vier Wochen für 110 € pro Sitzung, bei einer Mindestlaufzeit von drei Monaten. Danach ist sie monatlich kündbar.</p>
            </section>

            <section aria-labelledby="christmas-faq-heading" className="christmas-rule gift-shop-how">
              <h2 id="christmas-faq-heading" className="heading-lg">Häufige Fragen</h2>
              <div className="text-body christmas-faq">
                <details><summary>Wie lange ist der Gutschein gültig?</summary><p>Ein im Jahr 2026 gekaufter Gutschein ist bis zum 31.12.2029 einlösbar. Das genaue Datum steht auf dem Gutschein.</p></details>
                <details><summary>Kann ich den Gutschein selbst nutzen oder verschenken?</summary><p>Ja. Du kannst ihn selbst nutzen oder vor der ersten Einlösung an eine andere Person weitergeben. Das Angebot gilt für neue und bestehende Kund:innen.</p></details>
                <details><summary>Wie vereinbare ich einen Termin?</summary><p>Nach dem Kauf erhältst du den Gutschein per E-Mail. Über den Link darauf kannst du einen Termin anfragen und den Code eingeben. Der Termin ist verbindlich, sobald ich ihn bestätigt habe.</p></details>
                <details><summary>Wie wird der Gutschein eingelöst?</summary><p>Er gilt für eine Kennenlern-Sitzung und eine anschließende volle Körperarbeits-Sitzung in Eberswalde. Die Einlösung erfolgt nach Terminvereinbarung und Verfügbarkeit. Eine Barauszahlung ist nicht möglich. Das Angebot ist nicht mit anderen Rabatten kombinierbar und auf einen rabattierten Gutschein pro Person oder Haushalt begrenzt.</p></details>
              </div>
              <p className="gift-shop-detail text-body">Körperarbeit ersetzt keine medizinische oder psychotherapeutische Behandlung. Sie kann diese persönlich begleiten und ergänzen.</p>
            </section>

            <section aria-labelledby="christmas-alternative-heading" className="christmas-rule">
              <h2 id="christmas-alternative-heading" className="heading-lg">Eine Alternative zum Kennenlernen</h2>
              <p className="text-body christmas-copy">Die Kennenlern-Sitzung kostet 60 €. Sie ist für Menschen gedacht, die zum ersten Mal zu mir kommen, und kann ebenfalls als Gutschein verschenkt werden.</p>
              {introCheckout && <GradientButton href={introCheckout}>Kennenlern-Gutschein jetzt kaufen</GradientButton>}
            </section>

            <section className="christmas-rule" aria-labelledby="christmas-close-heading">
              <h2 id="christmas-close-heading" className="heading-lg">Zeit für Körperarbeit verschenken</h2>
              <p className="text-body">Eine Kennenlern-Sitzung und eine anschließende volle Körperarbeits-Sitzung für 150 € statt 180 €. Das Weihnachtsangebot ist bis zum 23.12.2026 erhältlich.</p>
            </section>
          </div>
        </GlassPanel>
        </div>
      </main>
      <Footer />
    </Layout>
  );
}
