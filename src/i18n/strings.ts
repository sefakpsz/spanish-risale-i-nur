import type { Language } from "../state/language";

const copy = {
  en: {
    homeTab: "Home", libraryTab: "Library", searchHome: "Search books", searchLibrary: "Title or topic", results: "results", resultsTitle: "Results", openBook: "Open", fromBook: "from", interfaceLanguage: "Language", appearance: "Appearance", themeSystem: "System", themeLight: "Light", themeDark: "Dark", themeCycleHint: "Tap to switch between System, Light, and Dark.", readings: "books", continueReading: "Continue reading", library: "Library", titles: "titles", seeAll: "See all ↗", spanishTranslation: "Spanish translation", close: "Close",
    allBooks: "ALL BOOKS", noResults: "No books match that search.", noBooksAvailable: "No books are available in this build.",
    yourMarks: "YOUR BOOKMARKS", saved: "Bookmarks", savedBody: "Return to the passages you want to keep close.", collectionStarts: "Your collection starts here", saveChapterHint: "Save a chapter while reading and it will appear here.", browseLibrary: "Browse the library", unavailableBook: "This book is unavailable.",
    detailHeader: "Book details", chapterCount: "chapters", pageCount: "pages", startReading: "Start reading", inThisBook: "In this book", unavailableChapter: "This chapter is unavailable.", preparing: "Preparing your reading…", chapter: "CHAPTER", removeBookmark: "Remove bookmark", addBookmark: "Save chapter", previousChapter: "Previous chapter", nextChapter: "Next chapter", previousPage: "Previous page", nextPage: "Next page", decreaseText: "Decrease text size", increaseText: "Increase text size", readingHeader: "Reading", back: "Back", sampleCover: "SAMPLE READING", pdfPage: "Page", pageSlider: "Go to page", openPageSlider: "Open page slider", closePageSlider: "Close page slider",
    categoryContemplation: "Contemplation", categoryDailyLife: "Everyday life", categoryStories: "Stories", categoryFaith: "Faith and reflection", languageEnglish: "English", languageSpanish: "Español", switchToEnglish: "Switch to English", switchToSpanish: "Switch to Spanish",
  },
  es: {
    homeTab: "Inicio", libraryTab: "Biblioteca", searchHome: "Buscar libros", searchLibrary: "Título o tema", results: "resultados", resultsTitle: "Resultados", openBook: "Abrir", fromBook: "de", interfaceLanguage: "Idioma", appearance: "Apariencia", themeSystem: "Sistema", themeLight: "Claro", themeDark: "Oscuro", themeCycleHint: "Toca para cambiar entre Sistema, Claro y Oscuro.", readings: "libros", continueReading: "Continuar leyendo", library: "La biblioteca", titles: "títulos", seeAll: "Ver todo ↗", spanishTranslation: "Traducción al español", close: "Cerrar",
    allBooks: "TODAS LAS LECTURAS", noResults: "No encontramos libros con ese nombre.", noBooksAvailable: "No hay libros disponibles en esta versión.",
    yourMarks: "TUS MARCAS", saved: "Marcadores", savedBody: "Vuelve a los pasajes que quieres conservar cerca.", collectionStarts: "Tu colección empieza aquí", saveChapterHint: "Guarda un capítulo mientras lees y aparecerá en esta lista.", browseLibrary: "Explorar la biblioteca", unavailableBook: "Este libro no está disponible.",
    detailHeader: "Detalles del libro", chapterCount: "capítulos", pageCount: "páginas", startReading: "Empezar a leer", inThisBook: "En este libro", unavailableChapter: "Este capítulo no está disponible.", preparing: "Preparando tu lectura…", chapter: "CAPÍTULO", removeBookmark: "Quitar de guardados", addBookmark: "Guardar capítulo", previousChapter: "Capítulo anterior", nextChapter: "Capítulo siguiente", previousPage: "Página anterior", nextPage: "Página siguiente", decreaseText: "Reducir tamaño del texto", increaseText: "Aumentar tamaño del texto", readingHeader: "Lectura", back: "Volver", sampleCover: "LECTURA DE MUESTRA", pdfPage: "Página", pageSlider: "Ir a la página", openPageSlider: "Abrir el control de páginas", closePageSlider: "Cerrar el control de páginas",
    categoryContemplation: "Contemplación", categoryDailyLife: "Vida cotidiana", categoryStories: "Relatos", categoryFaith: "Fe y reflexión", languageEnglish: "English", languageSpanish: "Español", switchToEnglish: "Cambiar a inglés", switchToSpanish: "Cambiar a español",
  },
} as const;

export type CopyKey = keyof typeof copy.en;
export function t(language: Language, key: CopyKey): string { return copy[language][key]; }
export function categoryName(language: Language, category: string): string {
  if (category === "Contemplation") return t(language, "categoryContemplation");
  if (category === "Everyday life") return t(language, "categoryDailyLife");
  if (category === "Stories") return t(language, "categoryStories");
  if (category === "Faith and reflection") return t(language, "categoryFaith");
  return category;
}
