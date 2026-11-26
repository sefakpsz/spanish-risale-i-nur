# Reader interface design

The library should feel like a well-kept reading room. It uses restrained deep teal for navigation and primary actions, white surfaces for controls, cool light neutrals for the surrounding interface, and a small brass accent. The warm paper colors inside imported books remain part of their source-specific layouts.

## Type and hierarchy

- Georgia gives book titles and main headings a literary voice. System sans-serif keeps navigation, metadata, search, and actions easy to scan.
- Small interface copy uses readable sizes and dark green-gray text. Book artwork and source-specific typography are handled separately from the app shell.
- Real page numbers and book information may be shown; decorative sequence numbers are avoided.

## Layout and components

- Home shows search, an optional continue-reading shortcut, and the active book. It has no promotional hero or development notice footer.
- The full library uses the same quiet rows. Book details show bibliographic information and reading actions; publication-rights tracking remains in project documentation.
- Bookmarks use one slim ribbon outline across the tab, saved list, and reader. The mark fills when a page is saved or the tab is active, keeping its shape and color consistent across devices.
- In local development, Home shows two circular controls at the top right: EN/ES for the interface language and a monitor/sun/moon icon for System, Light, and Dark appearance. Both icons slide when changed, unless reduced motion is requested. TestFlight and store builds hide the language control; the appearance control remains visible.
- Book details list only actual section openings. The reader uses a printed running-head hierarchy: the book title may wrap to two lines, a short gold rule introduces the current real section name, and the page position stays right-aligned. The reader owns its entire safe-area header up to the Dynamic Island, with an icon-only 44-point back control inside the filled header instead of a separate native navigation title. Generic page titles are never presented as chapter names. Reader arrows and the page scrubber reach every visible page. Its dot is anchored to the footer seam rather than a fixed screen offset and drags horizontally without opening a panel. A small anchored page number appears only while dragging.
- The reader keeps its source paper and protected Bismillah and heading treatments.
- Reader prose defaults to 17 points with denser line spacing; Arabic quotations, Bismillah, title artwork, and the structured imprint page keep their independent protected sizing.
- Standalone Punto labels are centered bold book headings, slightly larger than body text. They stay at their source positions and follow the reader's type-size control.
- System appearance is the default. Light and Dark overrides change the app shell, navigation, lists, and controls; the source-colored book page remains light for PDF fidelity. Theme choice is stored on-device.

## Motion

- Previous and next buttons crossfade between pages.
- Slider jumps fade with a slight movement toward the next page; a jump to the current page does not replay the transition.
- Horizontal swipes move the page a short distance in the reading direction with a fade. Vertical scrolling remains available for long pages.
- Device reduced-motion settings switch all page transitions to an immediate page change.
- Translation bubbles fade and settle into place below their Arabic sentence; reduced-motion settings reveal them immediately.
- Footer tabs crossfade with a short ease-out transition.
