export type Chapter = {
  id: string;
  title: string;
  text: string;
  sourcePageNumber?: string;
  pageIndex?: number;
  displayPageNumber?: number;
  /** A heading whose source position is within the page content. */
  inlineTitle?: { value: string; afterParagraph: number };
  showTitleInReader?: boolean;
  openingHeadingImage?: "title-page" | "ramadan" | "frugalidad" | "agradecimiento";
  artworkAccessibilityLabel?: string;
  imprintPage?: boolean;
  isSectionStart?: boolean;
};

import { ramadanLocalBook } from "./ramadanLocal";
export type Book = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  description: string;
  cover: { background: string; accent: string; mark: string };
  chapters: Chapter[];
  kind?: "chapters" | "pdf";
  pageCount?: number;
  testOnly?: boolean;
};

// The Spanish edition is a local development preview until distribution permission is documented.
export const books: Book[] = __DEV__ ? [ramadanLocalBook] : [];
export const findBook = (id: string) => books.find((book) => book.id === id);
