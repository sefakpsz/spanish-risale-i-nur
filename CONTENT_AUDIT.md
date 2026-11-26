# Local Spanish PDF transcription audit

Source: `ESP Ramazan İktisad Şükür Risalesi 105x160 2024 Ko_260627_210246.pdf` (local fixture; do not distribute).

## Paragraph boundaries

The selectable PDF text contains printed line breaks, but does not encode all paragraph breaks. PDF page geometry identifies 240 indented first lines across 77 content pages. Their exact source-line anchors are recorded in the local `src/data/ramadanParagraphStarts.json`; the reader uses those anchors before joining printed lines. In particular, PDF page 6 starts a paragraph at “Allah Todopoderoso creó…” after “siguiente:”. This is shared content for iOS and Android.

The earlier importer also guessed paragraph starts whenever a printed line ended in a full stop or question mark and the next started with a capital letter. An audit found 80 such breaks without an indent in the source, including “Ellos responden…” on page 6, so that guess has been removed.

The line anchors were checked against the extracted page text. This geometry pass covers the recurring indented prose style; centered headings, footnotes, and special layouts still require visual comparison with the source. Do not equate this pass with a fully proofread book.

## Arabic text

The PDF text layer contains no Arabic Unicode characters. A visual scan found Arabic on physical PDF pages **5, 6, 14, 23, 25, 30, 31, 33, 35, 41, 42, 46, 48, 49, 51, 52, 53, 61, 62, 68, 69, 75, 76, 81, 82, and 83**. The local `src/data/ramadanArabicLocal.ts` map now restores those passages at their Spanish text anchors, including inline and standalone Arabic. The same map runs on iOS and Android. Every restored Arabic run resolves to a Spanish entry in `src/data/arabicTranslations.ts`.

OCR was used to locate candidate passages, and each source page was visually inspected. Religious text and its translations still merit an independent editorial proofread before publication, especially long passages on PDF pages 23 and 49. The source PDF and this extracted content remain local development fixtures pending publisher permission.

## Other extraction defects noticed

Some extracted page-footers are glued directly to the preceding word (for example PDF pages 5 and 14). The reader removes those footer strings. At least page 42 also has a Unicode replacement character (`�`) in extracted text. These need a source comparison before claiming transcription fidelity.
