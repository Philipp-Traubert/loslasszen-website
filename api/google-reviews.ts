/**
 * Serverless function to fetch all reviews via Business Profile, with Places fallback.
 *
 * Deploy targets:
 *   - Vercel:  works out of the box (files in /api are auto-deployed)
 *   - Netlify: move to netlify/functions/google-reviews.ts and adjust handler
 *
 * Required environment variables:
 *   GOOGLE_PLACE_ID         – Place ID, e.g. "ChIJ9yYdjDJ2sUcRrEkGbMbTwuw"
 *   GOOGLE_PLACES_API_KEY   – Places API (New) key from Google Cloud Console
 *
 * Optional:
 *   GOOGLE_BUSINESS_NAME    – Fallback: business name for text search
 *                             e.g. "loslasszen Körperarbeit"
 */

// ─── Types ───────────────────────────────────────────────────────────────────
interface NewApiReview {
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string };
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
    uri?: string;
  };
  publishTime?: string;
}

interface NewApiPlace {
  id?: string;
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  reviews?: NewApiReview[];
  error?: { message?: string; code?: number };
}

// ─── In-memory cache ─────────────────────────────────────────────────────────
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 3_600_000; // 1 hour

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalisePlaceToPayload(place: NewApiPlace) {
  const reviews = (place.reviews ?? []).map((r, i) => ({
    author_name: r.authorAttribution?.displayName ?? 'Unbekannt',
    profile_photo_url: r.authorAttribution?.photoUri ?? undefined,
    author_url: r.authorAttribution?.uri ?? undefined,
    rating: r.rating ?? 5,
    text: r.text?.text ?? '',
    relative_time_description: r.relativePublishTimeDescription ?? '',
    time: r.publishTime
      ? Math.floor(new Date(r.publishTime).getTime() / 1000)
      : Math.floor(Date.now() / 1000) - i * 86400,
  }));

  return {
    platform: 'google',
    averageRating: place.rating ?? null,
    totalReviews: place.userRatingCount ?? reviews.length,
    reviews,
    fetchedAt: new Date().toISOString(),
  };
}

const NEW_API_FIELD_MASK = 'id,displayName,rating,userRatingCount,reviews';

async function fetchPlaceById(placeId: string, apiKey: string): Promise<NewApiPlace | null> {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': NEW_API_FIELD_MASK,
      'Accept-Language': 'de',
    },
  });
  if (!res.ok) return null;
  const data = await res.json() as NewApiPlace;
  if (data.error) return null;
  return data;
}

async function searchPlaceByName(name: string, apiKey: string): Promise<NewApiPlace | null> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': `places.${NEW_API_FIELD_MASK}`,
      'Content-Type': 'application/json',
      'Accept-Language': 'de',
    },
    body: JSON.stringify({ textQuery: name, languageCode: 'de' }),
  });
  if (!res.ok) return null;
  const data = await res.json() as { places?: NewApiPlace[] };
  return data.places?.[0] ?? null;
}

// Business Profile returns every review; Places is limited to five.
interface BusinessProfileReview {
  reviewer?: { displayName?: string; profilePhotoUrl?: string };
  starRating?: string;
  comment?: string;
  createTime: string;
}

interface BusinessProfileReviewsPage {
  reviews?: BusinessProfileReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
}

async function fetchBusinessProfileReviews() {
  const clientId = process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_BUSINESS_PROFILE_REFRESH_TOKEN;
  const locationName = process.env.GOOGLE_BUSINESS_PROFILE_LOCATION_NAME;

  if (!clientId || !clientSecret || !refreshToken || !locationName) return null;
  if (!/^accounts\/\d+\/locations\/\d+$/.test(locationName)) {
    throw new Error('Invalid Google Business Profile location name');
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!tokenResponse.ok) {
    throw new Error(`Business Profile token refresh failed (${tokenResponse.status})`);
  }
  const token = await tokenResponse.json() as { access_token?: string };
  if (!token.access_token) throw new Error('Business Profile access token missing');

  const reviews: BusinessProfileReview[] = [];
  let pageToken = '';
  let averageRating: number | null = null;
  let totalReviews = 0;

  do {
    const url = new URL(`https://mybusiness.googleapis.com/v4/${locationName}/reviews`);
    url.searchParams.set('pageSize', '50');
    url.searchParams.set('orderBy', 'updateTime desc');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!response.ok) {
      throw new Error(`Business Profile reviews request failed (${response.status})`);
    }
    const page = await response.json() as BusinessProfileReviewsPage;
    reviews.push(...(page.reviews ?? []));
    averageRating = page.averageRating ?? averageRating;
    totalReviews = page.totalReviewCount ?? totalReviews;
    pageToken = page.nextPageToken ?? '';
  } while (pageToken);

  const ratings: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  return {
    platform: 'google',
    source: 'google-business-profile',
    averageRating,
    totalReviews,
    reviews: reviews.map((review) => {
      const rating = ratings[review.starRating ?? ''];
      if (!rating) throw new Error('Business Profile review rating missing');
      return {
        author_name: review.reviewer?.displayName ?? 'Unbekannt',
        profile_photo_url: review.reviewer?.profilePhotoUrl,
        rating,
        text: review.comment ?? '',
        relative_time_description: new Date(review.createTime).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' }),
        time: Math.floor(new Date(review.createTime).getTime() / 1000),
      };
    }),
    fetchedAt: new Date().toISOString(),
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(
  req: { method?: string },
  res: {
    status: (code: number) => {
      json: (body: unknown) => void;
      end: () => void;
    };
    setHeader: (key: string, value: string) => void;
  },
) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Return cached data if fresh
  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return res.status(200).json(cache.data);
  }

  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const businessName = process.env.GOOGLE_BUSINESS_NAME ?? 'loslasszen Körperarbeit';

  try {
    const payload = await fetchBusinessProfileReviews();
    if (payload) {
      cache = { data: payload, timestamp: now };
      return res.status(200).json(payload);
    }
  } catch (error) {
    // Keep the existing Places feed available if Business Profile needs reconnecting.
    console.warn('[Reviews] Business Profile unavailable:', error instanceof Error ? error.message : 'Unknown error');
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GOOGLE_PLACES_API_KEY env var' });
  }

  try {
    let place: NewApiPlace | null = null;

    // ── 1. Try Places API (New) with stored Place ID ──────────────────────
    if (placeId) {
      place = await fetchPlaceById(placeId, apiKey);
    }

    // ── 2. Fallback: text search by business name ─────────────────────────
    if (!place) {
      console.info('[Reviews] Place ID lookup failed – trying text search for:', businessName);
      place = await searchPlaceByName(businessName, apiKey);
    }

    if (place) {
      const payload = normalisePlaceToPayload(place);
      cache = { data: payload, timestamp: now };
      return res.status(200).json(payload);
    }

    // ── 3. Final fallback: legacy Places API ─────────────────────────────
    if (placeId) {
      const legacyUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
      legacyUrl.searchParams.set('place_id', placeId);
      legacyUrl.searchParams.set('fields', 'name,rating,user_ratings_total,reviews');
      legacyUrl.searchParams.set('key', apiKey);
      legacyUrl.searchParams.set('language', 'de');

      const legacyRes = await fetch(legacyUrl.toString());
      const legacyData = await legacyRes.json() as {
        status?: string;
        error_message?: string;
        result?: {
          rating?: number;
          user_ratings_total?: number;
          reviews?: unknown[];
        };
      };

      if (legacyData.status === 'OK') {
        const payload = {
          platform: 'google',
          averageRating: legacyData.result?.rating ?? null,
          totalReviews: legacyData.result?.user_ratings_total ?? 0,
          reviews: legacyData.result?.reviews ?? [],
          fetchedAt: new Date().toISOString(),
        };
        cache = { data: payload, timestamp: now };
        return res.status(200).json(payload);
      }
    }

    throw new Error('Could not find business via any Google Places API method');

  } catch (err: unknown) {
    console.error('Error fetching Google reviews:', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to fetch reviews',
    });
  }
}
