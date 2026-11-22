import pages from "./ramadanLocalPages.json";
import paragraphStarts from "./ramadanParagraphStarts.json";
import { restoreArabicFromSource } from "./ramadanArabicLocal";
import type { Book, Chapter } from "./books";
import { isolatePointHeadingLines } from "../content/pointHeadings";

// The title comes from the book's own title page (PDF page 3).
const titleLines = pages[2].split("\n");
const titleStart = titleLines.findIndex((line) => line.startsWith("Tratados Sobre"));
const titleEnd = titleLines.findIndex((line) => line.startsWith("Bedîüzzaman"));
const title = titleLines.slice(titleStart, titleEnd).join(" ").replace(/\s+/g, " ").trim();

const sourceFooter = /(?:SOBRE EL MES DE RAMADÁN|DESTELLO DIECINUEVE|TRATADO SOBRE EL AGRADECIMIENTO)\s*\|\s*(\d+)|(?:\d+)\s*\|\s*(?:SOBRE EL MES DE RAMADÁN|DESTELLO DIECINUEVE|TRATADO SOBRE EL AGRADECIMIENTO)/gi;

function sourcePageNumber(page: string): string | undefined {
  const footer = [...page.matchAll(sourceFooter)].at(-1)?.[0];
  return footer?.match(/\d+/)?.[0];
}

function reflowExtractedText(text: string, pageNumber: number): string {
  // PDF page geometry identifies indented first lines. These are reviewed
  // source paragraph boundaries; ordinary printed line endings remain soft.
  const starts = new Set((paragraphStarts as Record<string, string[]>)[pageNumber] ?? []);
  const withParagraphs = text.split("\n").map((line, index) =>
    index > 0 && starts.has(line) ? `\n${line}` : line
  ).join("\n");
  return isolatePointHeadingLines(withParagraphs
    // Printed line endings are layout artifacts. Keep actual section and
    // paragraph breaks while letting the phone choose its own line widths.
    .replace(/(\p{L})-\n(?=\p{L})/gu, "$1"))
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n/g, " ").replace(/[ \t]{2,}/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

function readerText(page: string, pageNumber: number): string {
  if (pageNumber === 2) return page.trim(); // Structured, adjustable imprint text.
  if (pageNumber === 3) return ""; // Preserve the title-page typography as local artwork.
  let text = page.replace(sourceFooter, "").trim();
  if (pageNumber === 5) {
    text = text.replace(/^Sobre el Mes de\nRamadán\n/, "");
    text = text.replace(/\]\nPrimer Punto/, `]\n\n﷽\n\nشَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ هُدًى لِلنَّاسِ وَبَيِّنَاتٍ مِنَ الْهُدَىٰ وَالْفُرْقَانِ\n\nPrimer Punto`);
  } else if (pageNumber === 25) {
    text = text.replace(/^Destello Diecinueve\nSobre la Frugalidad\n/, "Sobre la Frugalidad\n\n﷽\n\nكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا\n\n");
  } else if (pageNumber === 52) {
    text = text.replace(/^Tratado Sobre el\nAgradecimiento\n/, "﷽\n\nوَإِنْ مِنْ شَيْءٍ إِلَّا يُسَبِّحُ بِحَمْدِهِ\n\n");
  } else if (pageNumber === 6) {
    // The PDF's selectable text skips this inline Arabic phrase entirely.
    // Soft source-line markers let the bubble open right below this sentence.
    text = text.replace("forma de: De esta forma\nse afirma", "\u2028forma de: مِنْ حَيْثُ لَا يَحْتَسِبُ De esta forma\u2028se afirma");
  }
  return reflowExtractedText(restoreArabicFromSource(pageNumber, text), pageNumber);
}

const chapters: Chapter[] = pages.slice(0, 92).flatMap((page, index): Chapter[] => {
  const pageNumber = index + 1;
  // Empty opening leaves and end leaves contain no book content.
  if (!page.replace(sourceFooter, "").trim()) return [];
  return [{
    id: `ramadan-page-${pageNumber}`,
    title: pageNumber === 3 ? title : pageNumber === 5 ? "Sobre el Mes de Ramadán" : pageNumber === 25 ? "Destello Diecinueve" : pageNumber === 52 ? "Tratado Sobre el Agradecimiento" : `Página ${pageNumber}`,
    text: readerText(page, pageNumber),
    sourcePageNumber: sourcePageNumber(page),
    pageIndex: pageNumber,
    showTitleInReader: false,
    isSectionStart: pageNumber === 5 || pageNumber === 25 || pageNumber === 52,
    ...(pageNumber === 2 ? { imprintPage: true } : {}),
    ...(pageNumber === 3 ? { openingHeadingImage: "title-page" as const, artworkAccessibilityLabel: page.replace(/\n/g, " ") } : {}),
    ...(pageNumber === 5 ? { openingHeadingImage: "ramadan" as const } : {}),
    ...(pageNumber === 25 ? { openingHeadingImage: "frugalidad" as const } : {}),
    ...(pageNumber === 52 ? { openingHeadingImage: "agradecimiento" as const } : {}),
  }];
}).map((chapter, index) => ({
  ...chapter,
  displayPageNumber: index + 1,
  title: /^Página \d+$/.test(chapter.title) ? `Página ${index + 1}` : chapter.title,
}));

export const ramadanLocalBook: Book = {
  id: "ramadan-frugalidad-agradecimiento-local",
  title,
  subtitle: "Tres tratados de la colección Risale-i Nur",
  author: "Bedîüzzaman Said Nursî",
  category: "Faith and reflection",
  description: "Edición española de Nur Ediciones, traducida por Lorena Lara.",
  cover: { background: "#342D2A", accent: "#D8C79B", mark: "ر" },
  chapters,
  testOnly: true,
};
