const MARVEL_BASE = 'https://lereacteur-marvel-api.herokuapp.com';

export async function proxyFetch(path: string): Promise<unknown> {
  const url = `${MARVEL_BASE}${path}${path.includes('?') ? '&' : '?'}apiKey=${process.env.MARVEL_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Marvel API error: ${response.status}`);
  }

  return response.json();
}
