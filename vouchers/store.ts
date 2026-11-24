import postgres from 'postgres';

let connection: ReturnType<typeof postgres> | undefined;

export function voucherDb() {
  const url = process.env.VOUCHER_DATABASE_URL;
  if (!url) throw new Error('Missing voucher database');
  return connection ??= postgres(url, { max: 1, idle_timeout: 20, connect_timeout: 6 });
}
