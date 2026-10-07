// « Captain Marvel (Carol Danvers) » → nom « Captain Marvel », précision « Carol Danvers ».
export function splitCharacterName(name: string) {
  const match = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return match ? { name: match[1]!, detail: match[2]! } : { name, detail: null };
}
