const MARVEL_BASE = 'https://lereacteur-marvel-api.herokuapp.com';

// Identifiant MongoDB de l'API externe (24 caractères hexadécimaux) : on refuse
// tout le reste pour qu'un ":id" ne puisse pas viser un autre chemin de l'API.
export const MARVEL_ID = /^[a-f0-9]{24}$/;

type Params = Record<string, string | number | undefined>;

export async function proxyFetch(path: string, params: Params = {}): Promise<unknown> {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') qs.set(key, String(value));
  }
  // Ajoutée en dernier et via URLSearchParams : un paramètre utilisateur ne peut ni
  // l'écraser ni injecter d'autres paramètres (tout est encodé).
  qs.set('apiKey', process.env.MARVEL_API_KEY!);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${MARVEL_BASE}${path}?${qs}`, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Marvel API error: ${response.status}`);
    }
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}
