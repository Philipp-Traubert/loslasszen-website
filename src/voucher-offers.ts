export const voucherSessions = {
  kennenlernen: {
    name: 'Kennenlern-Sitzung',
    infoPath: '/kennenlernen',
  },
  sitzung: {
    name: 'Volle Sitzung',
    infoPath: '/sitzung',
  },
};

export type VoucherSession = keyof typeof voucherSessions;

export const voucherOffers = [
  {
    id: 'sitzung', name: 'Volle Sitzung', price: 120, intro: 0, standard: 1,
    description: 'Zeit für dich und deinen Körper. Wir widmen uns deinen aktuellen Themen und richten die Körperarbeit danach aus, was du gerade brauchst.',
  },
  {
    id: 'kennenlernen', name: 'Kennenlern-Sitzung', price: 60, intro: 1, standard: 0,
    description: 'Lerne meine Arbeit kennen. Wir schauen gemeinsam, was dich gerade bewegt und was dein Körper braucht.',
  },
  {
    id: 'ankommen-und-vertiefen', name: 'Ankommen und Vertiefen', price: 270, intro: 1, standard: 2,
    description: 'Lerne die Körperarbeit kennen und gib dir Zeit, das Erlebte in zwei weiteren Sitzungen zu vertiefen.',
  },
  {
    id: 'vertiefung', name: 'Vertiefung', price: 500, intro: 0, standard: 5,
    description: 'Lass dich über einen längeren Zeitraum begleiten und nimm dir Zeit für Themen, die dich wiederholt beschäftigen.',
  },
  {
    id: 'intensive-begleitung', name: 'Intensive Begleitung', price: 960, intro: 0, standard: 10,
    description: 'Für Menschen, die sich regelmäßig Zeit für ihren Körper und ihre persönlichen Themen nehmen möchten.',
  },
] as const;

export const christmasVoucherOffer = {
  id: 'weihnachten', name: 'Ankommen und Vertiefen', price: 150, intro: 1, standard: 1,
  description: 'Eine Kennenlern-Sitzung und eine volle Körperarbeits-Sitzung.',
} as const;

export type VoucherOffer = (typeof voucherOffers)[number] | typeof christmasVoucherOffer;

export function voucherSessionSummary({ intro, standard }: VoucherOffer) {
  if (intro && standard) return `${intro} Kennenlern-Sitzung + ${standard} ${standard === 1 ? 'volle Sitzung' : 'volle Sitzungen'}`;
  if (standard > 1) return `${standard} volle Sitzungen · je 60 Minuten`;
  return '60 Minuten Körperarbeit';
}

export function euro(price: number) {
  return `${price.toLocaleString('de-DE')} €`;
}
