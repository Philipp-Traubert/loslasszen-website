import { voucherSessionSummary, type VoucherOffer } from '../src/voucher-offers';

export const voucherEmailFrom = 'Philipp · loslasszen <jetzt@loslasszen.de>';
export const voucherReplyTo = 'jetzt@loslasszen.de';

function escapeHtml(value: string) {
  const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return value.replace(/[&<>"']/g, char => entities[char]);
}

export function voucherEmail({ offer, code, validThrough, url, logoUrl }: {
  offer: VoucherOffer;
  code: string;
  validThrough: string;
  url: string;
  logoUrl: string;
}) {
  const subject = 'Dein loslasszen Geschenkgutschein';
  const summary = voucherSessionSummary(offer);
  const text = `loslasszen - Lass endlich los was dein Körper schon zu lange trägt.\n\nDanke für deinen Kauf.\n\nDein Gutschein: ${offer.name}\n${summary}\nGültig bis ${validThrough}\n\nHier kannst du deinen Gutschein öffnen, ausdrucken oder den Link an die beschenkte Person weitergeben:\n${url}\n\nGutscheincode: ${code}\n\nAuf der Gutscheinseite findest du weitere Infos und den Link zur Terminbuchung. Gib den Gutscheincode bei der Buchung an.\n\nDu hast eine Frage? Antworte einfach auf diese E-Mail.\n\nIch freue mich auf die Begegnung.\nPhilipp · loslasszen\n${voucherReplyTo}\nhttps://loslasszen.de/impressum`;
  const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${subject}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap');
    @media only screen and (max-width: 600px) { .email-padding { padding: 24px !important; } }
  </style>
</head>
<body style="margin:0;padding:0;background:#faf8f5;color:#222222;font-family:'Tenor Sans',Arial,sans-serif;line-height:1.65;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Dein Gutschein für ${escapeHtml(offer.name)} ist da. Zeit zum Ankommen, Spüren und Loslassen.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf8f5;">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="width:100%;max-width:560px;">
        <tr><td align="center" style="padding:0 0 20px;"><img src="${escapeHtml(logoUrl)}" alt="loslasszen" width="160" height="87" style="display:block;width:160px;height:auto;border:0;"></td></tr>
        <tr><td class="email-padding" style="padding:40px;background:#ffffff;border:1px solid #ebebeb;border-radius:12px;">
          <p style="margin:0 0 12px;color:#c91445;font-size:13px;">Dein Geschenkgutschein</p>
          <h1 style="margin:0 0 24px;font-size:30px;font-weight:400;line-height:1.25;">loslasszen - Lass endlich los was dein Körper schon zu lange trägt.</h1>
          <p style="margin:0 0 24px;font-size:16px;">Danke, dass du einen Raum für Körperarbeit verschenkst. Dein Gutschein ist bereit.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #ebebeb;border-bottom:1px solid #ebebeb;">
            <tr><td style="padding:20px 0;">
              <h2 style="margin:0 0 4px;font-size:21px;font-weight:400;">${escapeHtml(offer.name)}</h2>
              <p style="margin:0;font-size:15px;">${escapeHtml(summary)}</p>
              <p style="margin:12px 0 0;font-size:13px;">Gutscheincode</p>
              <p style="margin:2px 0 0;font-size:15px;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(code)}</p>
              <p style="margin:8px 0 0;font-size:13px;">Gültig bis ${escapeHtml(validThrough)}</p>
            </td></tr>
          </table>
          <p style="margin:24px 0;font-size:16px;">Öffne den Gutschein, drucke ihn aus oder gib den Link an die beschenkte Person weiter.</p>
          <table role="presentation" cellspacing="0" cellpadding="0"><tr><td bgcolor="#635536" style="background:#635536;border-radius:12px;mso-padding-alt:14px 24px;">
            <a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 24px;color:#ffffff;text-decoration:none;font-size:15px;">Gutschein öffnen</a>
          </td></tr></table>
          <p style="margin:24px 0;font-size:14px;">Auf der Gutscheinseite findest du weitere Infos und den Link zur Terminbuchung. Gib den Gutscheincode bei der Buchung an.</p>
          <p style="margin:0 0 24px;font-size:14px;">Du hast eine Frage? Antworte einfach auf diese E-Mail.</p>
          <p style="margin:0;font-size:16px;">Ich freue mich auf die Begegnung.<br>Philipp</p>
        </td></tr>
        <tr><td style="padding:24px 12px;font-size:12px;">
          <p style="margin:0 0 8px;">Falls der Button nicht funktioniert, öffne diesen Link:</p>
          <a href="${escapeHtml(url)}" style="color:#222222;overflow-wrap:anywhere;word-break:break-all;">${escapeHtml(url)}</a>
          <p style="margin:20px 0 0;">loslasszen · Körperarbeit mit Philipp<br><a href="mailto:${voucherReplyTo}" style="color:#222222;">${voucherReplyTo}</a> · <a href="https://loslasszen.de/impressum" style="color:#222222;">Impressum</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  return { subject, html, text };
}
