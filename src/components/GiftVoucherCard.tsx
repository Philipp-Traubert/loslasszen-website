import branch from '../assets/branch-transparent.webp';
import logo from '../assets/logo.png';
import paper from '../assets/b67594e9b3c439245fdadadaacf25076d0420eda Large.jpeg';
import { voucherSessionSummary, type VoucherOffer } from '../voucher-offers';
import '../styles/gift-vouchers.css';

export function GiftVoucherCard({ offer, message, issued = false }: { offer: VoucherOffer; message?: string; issued?: boolean }) {
  return (
    <div className="gift-paper" style={{ backgroundImage: `linear-gradient(105deg, rgba(250, 248, 245, .92), rgba(250, 248, 245, .64)), url(${paper})` }}>
      <img className="gift-branch" src={branch} alt="" width="1311" height="1311" />
      <div className="gift-paper-content">
        <img className="gift-wordmark" src={logo} alt="loslasszen" width="1024" height="558" />
        <span className="gift-card-label">Geschenkgutschein</span>
        <p className="gift-card-title">Zeit zum<br />loslasszen</p>
        <p className="gift-card-offer">{offer.name}</p>
        <p className="gift-card-message">{voucherSessionSummary(offer)}</p>
        <p className="gift-card-message">{message?.trim() || 'Zeit für dich.'}</p>
        {!issued && <p className="gift-card-code">Muster · Nicht einlösbar</p>}
      </div>
    </div>
  );
}
