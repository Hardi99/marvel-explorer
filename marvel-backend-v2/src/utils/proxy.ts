const MARVEL_BASE = 'https://lereacteur-marvel-api.herokuapp.com';

export async function proxyFetch(path: string): Promise<unknown> {
  const url = `${MARVEL_BASE}${path}${path.includes('?') ? '&' : '?'}apiKey=${process.env.MARVEL_API_KEY}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Marvel API error: ${response.status}`);
    }
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}
