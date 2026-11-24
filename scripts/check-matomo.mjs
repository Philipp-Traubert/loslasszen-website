import { fileURLToPath } from 'node:url';

try {
  process.loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url)));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is missing. Add it to .env.`);
  return value;
};

try {
  const token = required('MATOMO_TOKEN_AUTH');
  const siteId = required('MATOMO_SITE_ID');
  const baseUrl = new URL(required('MATOMO_URL'));

  if (baseUrl.protocol !== 'https:') {
    throw new Error('MATOMO_URL must use HTTPS so the auth token stays protected.');
  }

  const apiUrl = new URL('index.php', baseUrl);
  const callMatomo = async (method, parameters = {}) => {
    const body = new URLSearchParams({
      module: 'API',
      method,
      format: 'JSON',
      token_auth: token,
      ...parameters,
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Matomo returned HTTP ${response.status} with invalid JSON.`);
    }

    if (!response.ok || data?.result === 'error') {
      const message = String(data?.message || `HTTP ${response.status}`).replaceAll(
        token,
        '[redacted]',
      );
      throw new Error(`Matomo API error: ${message}`);
    }

    return data;
  };

  const version = await callMatomo('API.getMatomoVersion');
  const summary = await callMatomo('VisitsSummary.get', {
    idSite: siteId,
    period: 'day',
    date: 'today',
    columns: 'nb_visits,nb_uniq_visitors,nb_actions,nb_visits_converted',
  });

  console.log(`Matomo connection OK (version ${version}, site ${siteId}).`);
  console.log(
    JSON.stringify(
      {
        date: 'today',
        visits: summary.nb_visits ?? 0,
        uniqueVisitors: summary.nb_uniq_visitors ?? 0,
        actions: summary.nb_actions ?? 0,
        convertedVisits: summary.nb_visits_converted ?? 0,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
