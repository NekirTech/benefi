/** "HOMEMADE SWEETS (please ask for daily cakes)" -> title + note */
export function splitNote(label: string): { title: string; note?: string } {
  const match = label.match(/^(.*?)\s*\((.+)\)\s*$/);
  if (!match || !match[1]) return { title: label.trim() };
  return { title: match[1].trim(), note: match[2].trim() };
}
