import { voucherSessionSummary, type VoucherOffer } from '../src/voucher-offers.js';

export const voucherEmailFrom = 'Philipp · loslasszen <jetzt@loslasszen.de>';
export const voucherReplyTo = 'jetzt@loslasszen.de';

function escapeHtml(value: string) {
  const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return value.replace(/[&<>"']/g, char => entities[char]);
}

export function voucherEmail({ offer, code, validThrough, url, logoUrl, darkLogoUrl }: {
  offer: VoucherOffer;
  code: string;
  validThrough: string;
  url: string;
  logoUrl: string;
  darkLogoUrl: string;
}) {
  const subject = 'Dein loslasszen Geschenkgutschein';
  const summary = voucherSessionSummary(offer);
  const text = `Dein loslasszen Gutschein\n\nLass endlich los, was dein Körper schon zu lange trägt.\n\nDanke für deinen Kauf.\n\nDein Gutschein: ${offer.name}\n${summary}\nGültig bis ${validThrough}\n\nHier kannst du deinen Gutschein öffnen, ausdrucken oder den Link an die beschenkte Person weitergeben:\n${url}\n\nGutscheincode: ${code}\n\nAuf der Gutscheinseite findest du weitere Infos und den Link zur Terminbuchung. Gib den Gutscheincode bei der Buchung an.\n\nDu hast eine Frage? Antworte einfach auf diese E-Mail.\n\nIch freue mich darauf, mit dir zu arbeiten.\nPhilipp · loslasszen\n${voucherReplyTo}\nhttps://loslasszen.de/impressum`;
  const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${subject}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap');
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    @media (prefers-color-scheme: dark) {
      .email-background { background:#191919 !important; color:#f3efe9 !important; }
      .email-card { background:#242424 !important; color:#f3efe9 !important; border-color:#45413b !important; }
      .email-divider { border-color:#45413b !important; }
      .email-link { color:#f3efe9 !important; }
      .email-logo-light { display:none !important; }
      .email-logo-dark { display:block !important; max-height:none !important; overflow:visible !important; }
    }
    /* Outlook apps that expose their message theme through data-ogsc. */
    [data-ogsc] .email-background { background:#191919 !important; color:#f3efe9 !important; }
    [data-ogsc] .email-card { background:#242424 !important; color:#f3efe9 !important; border-color:#45413b !important; }
    [data-ogsc] .email-divider { border-color:#45413b !important; }
    [data-ogsc] .email-link { color:#f3efe9 !important; }
    [data-ogsc] .email-logo-light { display:none !important; }
    [data-ogsc] .email-logo-dark { display:block !important; max-height:none !important; overflow:visible !important; }
    @media only screen and (max-width: 600px) { .email-padding { padding: 24px !important; } }
  </style>
</head>
<body class="email-background" style="margin:0;padding:0;background:#faf8f5;color:#222222;font-family:'Tenor Sans',Arial,sans-serif;line-height:1.65;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Dein Gutschein für ${escapeHtml(offer.name)} ist da. Zeit zum Ankommen, Spüren und Loslassen.</div>
  <table class="email-background" role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf8f5;">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="width:100%;max-width:560px;">
        <tr><td align="center" style="padding:0 0 20px;">
          <img class="email-logo-light" src="${escapeHtml(logoUrl)}" alt="loslasszen" width="160" height="87" style="display:block;width:160px;height:auto;border:0;">
          <!--[if !mso]><!--><div class="email-logo-dark" style="display:none;max-height:0;overflow:hidden;mso-hide:all;"><img src="${escapeHtml(darkLogoUrl)}" alt="loslasszen" width="160" height="87" style="display:block;width:160px;height:auto;border:0;"></div><!--<![endif]-->
        </td></tr>
        <tr><td class="email-padding email-card" style="padding:40px;background:#ffffff;border:1px solid #ebebeb;border-radius:12px;">
          <h1 style="margin:0;font-size:30px;font-weight:400;line-height:1.25;">Dein loslasszen Gutschein</h1>
          <div aria-hidden="true" style="width:96px;height:1px;margin:24px 0 32px;background:#c91445;opacity:0.6;font-size:0;line-height:1px;">&nbsp;</div>
          <p style="margin:0 0 24px;font-size:21px;line-height:1.4;">Lass endlich los, was dein Körper schon zu lange trägt.</p>
          <p style="margin:0 0 24px;font-size:16px;">Danke, dass du einen Raum für Körperarbeit verschenkst. Dein Gutschein ist bereit.</p>
          <table class="email-divider" role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #ebebeb;border-bottom:1px solid #ebebeb;">
            <tr><td style="padding:20px 0;">
              <h2 style="margin:0 0 4px;font-size:21px;font-weight:400;">${escapeHtml(offer.name)}</h2>
              <p style="margin:0;font-size:15px;">${escapeHtml(summary)}</p>
              <p style="margin:12px 0 0;font-size:13px;">Gutscheincode</p>
              <p style="margin:2px 0 0;font-size:15px;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(code)}</p>
              <p style="margin:8px 0 0;font-size:13px;">Gültig bis ${escapeHtml(validThrough)}</p>
            </td></tr>
          </table>
          <p style="margin:24px 0;font-size:16px;">Öffne den Gutschein, drucke ihn aus oder gib den Link an die beschenkte Person weiter.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" bgcolor="#e75172" style="background-color:#e75172;background-image:radial-gradient(circle 283px at 0 50%,#ed6a75 0%,transparent 40%);border-radius:9999px;box-shadow:0 2px 6px rgba(0,0,0,0.04),0 4px 8px rgba(0,0,0,0.10);mso-padding-alt:12px 0;">
            <a href="${escapeHtml(url)}" style="display:block;padding:12px 0;border-radius:9999px;color:#ffffff;text-align:center;text-decoration:none;font-size:15px;font-weight:500;line-height:20px;">Gutschein öffnen</a>
          </td></tr></table>
          <p style="margin:24px 0;font-size:14px;">Auf der Gutscheinseite findest du weitere Infos und den Link zur Terminbuchung. Gib den Gutscheincode bei der Buchung an.</p>
          <p style="margin:0 0 24px;font-size:14px;">Du hast eine Frage? Antworte einfach auf diese E-Mail.</p>
          <p style="margin:0;font-size:16px;">Ich freue mich darauf, mit dir zu arbeiten.<br>Philipp</p>
        </td></tr>
        <tr><td style="padding:24px 12px;font-size:12px;">
          <p style="margin:0 0 8px;">Falls der Button nicht funktioniert, öffne diesen Link:</p>
          <a class="email-link" href="${escapeHtml(url)}" style="color:#222222;overflow-wrap:anywhere;word-break:break-all;">${escapeHtml(url)}</a>
          <p style="margin:20px 0 0;">loslasszen · Körperarbeit mit Philipp<br><a class="email-link" href="mailto:${voucherReplyTo}" style="color:#222222;">${voucherReplyTo}</a> · <a class="email-link" href="https://loslasszen.de/impressum" style="color:#222222;">Impressum</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  return { subject, html, text };
}
