# Risale-i Nur

A book reader built with Expo, React Native, and TypeScript. The local development catalog contains only *Tratados Sobre Ramadán, Frugalidad y Agradecimiento*. The interface supports English and Spanish during development. On first launch it follows the device language when that language is English or Spanish; other device languages use Spanish. A manual selection is saved on the device. The language toggle appears only in development, not TestFlight or store builds. Appearance follows the system by default, with saved Light and Dark overrides. English is intended to be removed before the public release, leaving the Spanish interface.

## Run the app

1. Use the project's Node.js version (`nvm use`, currently 24.16.0), then install dependencies with `npm install`.
2. Build and launch the native development app with `npm run ios` or `npm run android` (requires Xcode or Android Studio and a device/simulator).
3. Start the development server for an already installed development app with `npm start`.
4. Check the TypeScript project with `npm run typecheck` and the Expo setup with `npm run check`.

The Spanish book and its extracted pages are for local development while publication permission is unresolved. A distributable build must use content whose rights are documented.

### Android test APK

The standalone private-test APK is `builds/risale-i-nur-standalone-test.apk` (generated locally and ignored by Git). It embeds the JavaScript and local book fixture, so it opens without an Expo development server. It is signed with the Android debug key and is not a store-ready release. Do not share this local preview publicly or upload this branch to a cloud builder while the book permissions are unresolved.

`builds/risale-i-nur-dev-debug.apk` is only for development. It requires `npm start -- --host lan`, with the phone and Mac on the same network.

For a local Android Studio emulator, start the emulator and run `npm run android`. The project launcher detects Android Studio's bundled Java runtime and the conventional Android SDK location on macOS, Linux, and Windows, then passes them to Expo without requiring global shell configuration. Run `npm run android -- --diagnose` to print the detected locations without starting a build.

## Project layout

- `src/data/books.ts`: the active book catalog.
- `src/state/reading.tsx`: locally stored reading progress and bookmarks.
- `src/state/language.tsx` and `src/i18n/strings.ts`: system-locale detection and English/Spanish interface copy.
- `src/state/theme.tsx`: system appearance with persisted Light and Dark overrides.
- `src/components/ArabicRichText.tsx`: centered reader text with wine-red, tappable Arabic runs and Spanish translation bubbles.
- `src/data/arabicTranslations.ts`: normalized editorial translation memory. Add each reviewed Arabic passage and its Spanish translation here so all books share the same annotations.
- `App.tsx`: navigation, library, book details, and chapter reader.
- `STORE_CHECKLIST.md`: permissions, store policies, privacy, and submission preparation.

The app has no account, server, ads, analytics, or digital purchases configured. Reading progress, bookmarks, language preference, and theme preference are stored on the device. The book's source-colored reading page remains light in Dark mode to preserve its PDF typography and the approved Bismillah treatment.

The local development branch contains a preview of *Tratados Sobre Ramadán, Frugalidad y Agradecimiento*. Its title is read from PDF page 3. PDF page 2 uses larger, adjustable text; page 3 retains local title artwork that can zoom with the size controls. Empty opening and ending leaves are omitted; reader pages are numbered consecutively from 1, while original PDF page numbers remain in source metadata. PDF page 93 is an unrelated sharing-app advertisement and is excluded. The PDF text layer contains the Spanish body text but omits Arabic artwork and some decorative elements; Arabic passages on all 26 visually identified source pages are restored in a local content map, with inline Spanish translation bubbles. Source-indented paragraph starts are preserved from local page geometry. See `CONTENT_AUDIT.md` for the whole-book audit and editorial proofreading limits. The PDF states that reproduction requires the editor's prior written permission. The extracted page data, Arabic map, paragraph anchors, and artwork are ignored by Git. Do not build or publish a release from this local branch: Metro can still bundle statically imported development assets even when the catalog hides them outside development mode.

The library is a fixed catalog chosen by the publisher for each app release. Readers cannot upload books, and there is no content-management service; adding titles after launch would require an app content update.

Reader navigation supports previous/next arrows, horizontal swipes, and a page scrubber for jumping across the book. The scrubber is a single dot on the seam above the footer: drag anywhere along that seam to preview a page number, then release to navigate. It never opens a panel or modal. Arrow taps use a short dissolve, scrubber jumps dissolve with a slight movement in the page direction, and horizontal swipes use a larger directional slide and fade. Footer tabs crossfade, and translation bubbles softly fade into place below their Arabic sentence. Vertical swipes continue to scroll long pages. All reading transitions become immediate when the device requests reduced motion. The bookmark control saves the current page to the Bookmarks tab, while reading progress separately remembers the last page opened. Book details list the three actual section openings, while the scrubber reaches every reader page.

## Arabic annotation rule

All chapter text is centered by the shared reader renderer. Arabic quotations are detected automatically in every book, colored wine red, and made tappable; Bismillah uses its separate dark calligraphic treatment. Tapping a run opens a Spanish translation bubble immediately below that Arabic sentence. Translation text always uses neutral dark ink, never the Arabic red. Reviewed translations belong in `src/data/arabicTranslations.ts`; unknown passages show a Spanish editorial-review placeholder instead of inventing a religious translation.

## PDF extraction rules

- Remove repeated PDF page headers and divider marks from the reader text.
- Preserve the printed page number from the source page header as reader metadata; do not treat the array position as the book's page number.
- Label PDF-derived reader entries as Page/Página. After omitting blank source pages, number the visible reader pages consecutively from 1. Keep printed and physical PDF page numbers separately as source metadata.
- Use only simple horizontal rules at the end of a reader page; do not add a star or other glyph between them.
- When a source PDF uses a Bismillah image, render the `﷽` glyph in its source position, including future books. It remains tappable and opens its Spanish translation bubble.
- Translation bubbles use a white reading-card surface with double gold borders, a centered gold marker, and a discreet close control. They contain only the translation text, without a heading.
- Preserve the source reading order and meaningful vertical placement. Keep an inline source heading between the content that precedes and follows it; never promote it to the top of the reader page.
- Treat the end of a printed PDF line as a soft break for extracted body text. Join those lines so words reflow across a phone screen; preserve true paragraphs, headings, and Arabic blocks as separate elements.
- Preserve the reading order and styling of front-matter pages such as imprint, copyright, and title pages. Use responsive, size-adjustable text when readability or font controls require it; use zoomable artwork only for typography that cannot render correctly as text.
- Keep standalone “Primer Punto”, “Segundo Punto”, and later Punto lines as separate headings in their source positions. The shared heading detector also recognizes uppercase forms and a trailing colon; render them in larger bold book type that follows the reader's font-size setting.
- Omit source pages or large vertical gaps that contain no book content. Keep the original PDF page numbers on the remaining entries. Do not add empty spacer pages in future books.
- Do not place a `+` bookmark button in the reader header. The reader header should show book and page information only.
- Match source heading appearance when it is available and licensed. Keep the `﷽` Bismillah glyph and its translation behavior consistent across source pages. See `AGENTS.md` for protected design decisions if the archived Lemalar fixture is restored later.

## Before release

Obtain and document the permissions needed for the Spanish edition, translation, annotations, images, and cover. Remove English interface strings, verify only authorized content remains, and complete the checklist in `STORE_CHECKLIST.md`. No store submission or publication has been made, and approval cannot be guaranteed.
