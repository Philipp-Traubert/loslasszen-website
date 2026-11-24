import type { ComponentType } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ImpressumPage } from "./components/ImpressumPage.tsx";
import { KennenlernenPage, PaidSessionPage } from "./pages.tsx";
import { voucherChristmasSalesEnabled, voucherSalesEnabled } from './voucher-checkout';
import "./styles/main.css";

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const voucherPagesVisible = import.meta.env.VITE_VOUCHER_PAGES_VISIBLE === 'true';

if (path === '/kostenlos') {
  window.location.replace('/kennenlernen');
}

if (path === '/visitenkarte') {
  window.location.replace('/kennenlernen?utm_source=visitenkarte&utm_medium=qr&utm_campaign=visitenkarte&utm_content=visitenkarte');
}

const flyerMatch = path.match(/^\/f\/(\d{1,4})$/);
if (flyerMatch) {
  const code = flyerMatch[1].padStart(3, '0');
  const target = `/kennenlernen?utm_source=flyer&utm_medium=qr&utm_campaign=flyer&utm_content=${code}`;
  window.location.replace(target);
}

const routeMap: Record<string, ComponentType> = {
  '/': App,
  '/impressum': ImpressumPage,
  '/sitzung': PaidSessionPage,
  '/kennenlernen': KennenlernenPage,
};

const Page = routeMap[path] ?? App;

const root = createRoot(document.getElementById("root")!);

if ((import.meta.env.DEV || voucherPagesVisible || voucherChristmasSalesEnabled) && path === '/weihnachtsangebot') {
  document.title = 'Weihnachtsgutschein für Körperarbeit in Eberswalde | loslasszen';
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', 'https://loslasszen.de/weihnachtsangebot');
  void import('./components/ChristmasVoucherPage').then(({ ChristmasVoucherPage }) => {
    root.render(<ChristmasVoucherPage />);
  });
} else if ((import.meta.env.DEV || voucherPagesVisible || voucherSalesEnabled) && path === '/gutscheine') {
  document.title = 'Gutscheine | loslasszen';
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', 'https://loslasszen.de/gutscheine');
  void import('./components/GiftVoucherPage').then(({ GiftVoucherPage }) => {
    root.render(<GiftVoucherPage />);
  });
} else if (import.meta.env.DEV && path === '/gutschein-email-vorschau') {
  void import('./components/GiftVoucherEmailPreview').then(({ GiftVoucherEmailPreview }) => {
    root.render(<GiftVoucherEmailPreview />);
  });
} else if (import.meta.env.DEV && path === '/gutschein-vorschau') {
  void import('./components/GiftVoucherPreview').then(({ GiftVoucherPreview }) => {
    root.render(<GiftVoucherPreview />);
  });
} else if (path.startsWith('/gutschein/')) {
  void import('./components/GiftVoucherRecipient').then(({ GiftVoucherRecipient }) => {
    root.render(<GiftVoucherRecipient offerId={path.slice('/gutschein/'.length)} />);
  });
} else {
  root.render(<Page />);
}
