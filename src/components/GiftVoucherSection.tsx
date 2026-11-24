import { GlassPanel } from './GlassPanel';
import { GradientButton } from './GradientButton';
import './gift-voucher-section.css';

export function GiftVoucherSection() {
  return (
    <section id="gutscheine" className="full-width-section gift-shop" aria-labelledby="gift-shop-title">
      <GlassPanel className="full-width-glass-panel">
        <div className="space-y-6">
          <header>
            <h2 id="gift-shop-title" className="heading-lg">Körperarbeit verschenken</h2>
            <div className="separator" aria-hidden="true" />
            <p className="text-body">Verschenke Zeit zum Ankommen, Spüren und Loslassen.</p>
          </header>
          <GradientButton href="/gutscheine">Gutscheine ansehen</GradientButton>
        </div>
      </GlassPanel>
    </section>
  );
}
