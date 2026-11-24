import { encode } from 'uqr';
import logo from '../assets/logo.png';

const border = 4;

export function GiftVoucherQr({ url, label }: { url: string; label: string }) {
  const { size, data } = encode(url, { border, ecc: 'H' });
  const center = size / 2;
  const end = size - border;
  const radius = (size - border * 2) * .13;
  const logoWidth = radius * 3.25;
  const logoHeight = logoWidth * 558 / 1024;

  return (
    <figure className="gift-print-qr">
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`QR-Code: ${label}`}>
        <rect width={size} height={size} fill="#fff" />
        {data.flatMap((row, y) => row.map((dark, x) => {
          if (!dark || Math.hypot(x + .5 - center, y + .5 - center) < radius) return null;
          const left = x >= border && x < border + 7;
          const top = y >= border && y < border + 7;
          const finder = (top && (left || x >= end - 7)) || (left && y >= end - 7);
          return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" rx=".4" fill={finder ? '#c91445' : '#1a1a1a'} />;
        }))}
        <image href={logo} x={center - logoWidth / 2} y={center - logoHeight / 2} width={logoWidth} height={logoHeight} />
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
