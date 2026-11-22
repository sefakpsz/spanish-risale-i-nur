const POINT_HEADING = /^(?:Primer|Segundo|Tercer|Cuarto|Quinto|Sexto|Séptimo|Octavo|Noveno|Décimo)\s+Punto[.:]?$/iu;

export function isPointHeading(text: string): boolean {
  return POINT_HEADING.test(text.trim());
}

/** Keep a printed point heading as its own block without moving it. */
export function isolatePointHeadingLines(source: string): string {
  return source
    .split("\n")
    .map((line) => isPointHeading(line) ? `\n\n${line.trim()}\n\n` : line)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}
