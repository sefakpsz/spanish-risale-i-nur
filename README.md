# Spanish Risale-i Nur

A multi-book reader foundation built with Expo, React Native, and TypeScript. The interface supports English and Spanish during development. On first launch it follows the device language when that language is English or Spanish; other device languages use Spanish. A manual selection is saved on the device. English is intended to be removed before the public release, leaving the Spanish interface.

## Run the app

1. Install Node.js LTS and project dependencies with `npm install`.
2. Build and launch the native development app with `npm run ios` or `npm run android` (requires Xcode or Android Studio and a device/simulator).
3. Start the development server for an already installed development app with `npm start`.
4. Check the TypeScript project with `npm run typecheck` and the Expo setup with `npm run check`.

The repository contains only original Spanish demo passages. Add authorized Spanish editions through the catalog and content-loading structure before release.

## Project layout

- `src/data/books.ts`: multi-book catalog and demo chapters.
- `src/state/reading.tsx`: locally stored reading progress and bookmarks.
- `src/state/language.tsx` and `src/i18n/strings.ts`: system-locale detection and English/Spanish interface copy.
- `src/components/ArabicRichText.tsx`: centered reader text with wine-red, tappable Arabic runs and Spanish translation bubbles.
- `src/data/arabicTranslations.ts`: normalized editorial translation memory. Add each reviewed Arabic passage and its Spanish translation here so all books share the same annotations.
- `App.tsx`: navigation, library, book details, and chapter reader.
- `STORE_CHECKLIST.md`: permissions, store policies, privacy, and submission preparation.

The sample chapter texts are original Spanish demo passages and are not editions of Risale-i Nur. The app has no account, server, ads, analytics, or digital purchases configured. Reading progress, bookmarks, and language preference are stored on the device.

The library is a fixed catalog chosen by the publisher for each app release. Readers cannot upload books, and there is no content-management service; adding titles after launch would require an app content update.

## Arabic annotation rule

All chapter text is centered by the shared reader renderer. Arabic quotations are detected automatically in every book, colored wine red, and made tappable; Bismillah uses its separate dark calligraphic treatment. Tapping a run opens a Spanish translation bubble immediately below that Arabic sentence. Translation text always uses neutral dark ink, never the Arabic red. Reviewed translations belong in `src/data/arabicTranslations.ts`; unknown passages show a Spanish editorial-review placeholder instead of inventing a religious translation.

## PDF extraction rules

- Remove repeated PDF page headers and divider marks from the reader text.
- Preserve the printed page number from the source page header as reader metadata; do not treat the array position as the book's page number.
- When a source PDF uses a Bismillah image, render `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ` in its position as a large, dark calligraphic line distinct from wine-red Arabic quotations. It remains tappable and opens a Spanish translation bubble.
- Translation bubbles use a white reading-card surface with double gold borders, a centered gold marker, and a discreet close control. They contain only the translation text, without a heading.
- Preserve the source reading order and meaningful vertical placement. Keep an inline source heading between the content that precedes and follows it; never promote it to the top of the reader page.

## Before release

Obtain and document the permissions needed for each Spanish edition and its translation, annotations, images, and cover. Remove English interface strings and the development-only Lemalar text entry, verify only authorized Spanish content remains, and complete the checklist in `STORE_CHECKLIST.md`. No store submission or publication has been made, and approval cannot be guaranteed.
