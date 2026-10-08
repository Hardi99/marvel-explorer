// L'API Marvel donne des titres bruts (« AMAZING SPIDER-MAN BY DAVID MICHELINIE & TODD
// MCFARLANE OMNIBUS HC (Hardcover) ») : on en tire un titre lisible et des infos à afficher.

const FORMATS: Record<string, string> = {
  hardcover: 'Relié',
  'trade paperback': 'Broché',
  digest: 'Digest',
  'graphic novel': 'Roman graphique',
  magazine: 'Magazine',
};

// Suffixes de format collés au titre, redondants avec la mention entre parenthèses.
const FORMAT_SUFFIX = /\s+(?:GN-TPB|TPB|HC|GN|PREMIERE HC|DM ONLY)$/i;

export interface ComicInfo {
  title: string;
  authors: string | null;
  format: string | null;
  year: string | null;
  issue: string | null;
  omnibus: boolean;
  /** Numéros réunis dans un recueil, tirés de « Collecting … » dans la description. */
  collects: string | null;
}

const isMostlyUpper = (s: string) => {
  const letters = s.replace(/[^a-zA-Z]/g, '');
  return letters.length > 0 && letters.replace(/[^A-Z]/g, '').length / letters.length > 0.7;
};

// « SPIDER-MAN » → « Spider-Man », « MCFARLANE » → « McFarlane », « VOL. 1 » → « Vol. 1 ».
export function titleCase(s: string) {
  if (!isMostlyUpper(s)) return s;
  return s
    .toLowerCase()
    .replace(/(^|[\s\-/(:"+&])([a-zà-ÿ])/g, (_, sep: string, c: string) => sep + c.toUpperCase())
    .replace(/\bMc([a-z])/g, (_, c: string) => `Mc${c.toUpperCase()}`)
    .replace(/\b(Of|The|And|In|On|A|An|To|For|By|At|Vs|From|With)\b/g, (w, _m, offset: number, str: string) =>
      offset === 0 || /[:–-]\s$/.test(str.slice(0, offset)) ? w : w.toLowerCase())
    .replace(/\b(Ii|Iii|Iv|Vi|Vii|Viii|Ix|Xi)\b/g, (w) => w.toUpperCase());
}

export function parseComic(rawTitle: string, description?: string | null): ComicInfo {
  let title = rawTitle.trim();
  let format: string | null = null;
  let year: string | null = null;
  let issue: string | null = null;

  // Mentions entre parenthèses : format, année, ou remarque éditoriale (supprimée).
  title = title.replace(/\s*\(([^)]*)\)/g, (_, inner: string) => {
    const value = inner.trim();
    if (/^\d{4}$/.test(value)) year = value;
    else if (FORMATS[value.toLowerCase()]) format = FORMATS[value.toLowerCase()]!;
    return '';
  });

  title = title.replace(/\s+#(\d+(?:\.\d+)?)\s*$/, (_, n: string) => {
    issue = n;
    return '';
  });

  const omnibus = /\bOMNIBUS\b/i.test(title);
  title = title.replace(FORMAT_SUFFIX, '').replace(/\s+OMNIBUS\b/i, '').trim();

  let authors: string | null = null;
  const by = title.match(/^(.*?)\s+BY\s+(.+)$/i);
  if (by) {
    // « BLACK PANTHER BY CHRISTOPHER PRIEST: THE COMPLETE COLLECTION » : le sous-titre suit les auteurs.
    const [names, ...subtitle] = by[2]!.replace(FORMAT_SUFFIX, '').split(':');
    title = [by[1]!.trim(), ...subtitle.map((part) => part.trim())].join(': ');
    authors = titleCase(names!.trim());
  }

  const collecting = description?.match(/Collecting\s+(.+?)(?:\.\s|\.?\s*$)/i);
  const collects = collecting ? titleCase(collecting[1]!.trim()) : null;

  return { title: titleCase(title), authors, format, year, issue, omnibus, collects };
}
