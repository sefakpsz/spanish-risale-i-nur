import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type GestureResponderEvent } from "react-native";
import { DefaultTheme, NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Book, books, findBook } from "./src/data/books";
import { ReadingProvider, useReading } from "./src/state/reading";
import { LanguageProvider, useLanguage } from "./src/state/language";
import { ThemeProvider, useAppTheme, type ThemePreference } from "./src/state/theme";
import { categoryName, CopyKey, t } from "./src/i18n/strings";
import { ArabicRichText } from "./src/components/ArabicRichText";
import { BookmarkIcon } from "./src/components/BookmarkIcon";
import { ThemeIcon } from "./src/components/ThemeIcon";
import { isPointHeading } from "./src/content/pointHeadings";

type RootStack = { Tabs: undefined; Detail: { bookId: string }; Reader: { bookId: string; chapterIndex?: number } };
type Tabs = { Home: undefined; Library: undefined; Saved: undefined };
const Stack = createNativeStackNavigator<RootStack>();
const Tab = createBottomTabNavigator<Tabs>();
const LIGHT = { ink: "#172628", paper: "#F2F5F2", card: "#FFFFFF", muted: "#52645E", teal: "#16474A", mint: "#DCE9E3", line: "#D6DED8", gold: "#80632F", button: "#16474A", onButton: "#FFFFFF" };
const DARK: typeof LIGHT = { ink: "#F1F4EF", paper: "#101918", card: "#1B2824", muted: "#AFC5BB", teal: "#A6D7C9", mint: "#2C4540", line: "#3B5049", gold: "#D9BB7C", button: "#346E68", onButton: "#FFFFFF" };
const readerSerif = Platform.OS === "android" ? "serif" : "Georgia";
function useUi() {
  const { scheme } = useAppTheme();
  return scheme === "dark" ? darkUi : lightUi;
}
function useLocale() {
  const locale = useLanguage();
  const text = useCallback((key: CopyKey) => t(locale.language, key), [locale.language]);
  return { ...locale, text };
}

function Label({ children, style }: React.PropsWithChildren<{ style?: object }>) {
  const { s } = useUi();
  return <Text style={[s.label, style]}>{children}</Text>;
}

function Cover({ book, large = false }: { book: Book; large?: boolean }) {
  const { s } = useUi();
  const { text } = useLocale();
  return <View style={[s.cover, large && s.coverLarge, { backgroundColor: book.cover.background }]}>
    <View style={[s.coverInset, { borderColor: `${book.cover.accent}77` }]} />
    <View style={s.coverTitleWrap}>
      <Text numberOfLines={2} style={[s.coverTitle, large && s.coverTitleLarge]}>{book.title}</Text>
      <View style={[s.coverRule, { backgroundColor: book.cover.accent }]} />
      <Text numberOfLines={2} style={[s.coverSubtitle, { color: `${book.cover.accent}DD` }]}>{book.subtitle}</Text>
    </View>
    <Text style={[s.coverMark, { color: book.cover.accent }]}>{book.cover.mark}</Text>
    <Text style={[s.coverFooter, { color: `${book.cover.accent}BB` }]}>{text("sampleCover")}</Text>
  </View>;
}

function BookCard({ book, onPress }: { book: Book; onPress: () => void }) {
  const { s, d } = useUi();
  const { progress } = useReading();
  const { language, text } = useLocale();
  const total = book.chapters.length;
  const current = progress[book.id] ?? 0;
  const percent = total && progress[book.id] !== undefined ? Math.round(((current + 1) / total) * 100) : 0;
  return <Pressable accessibilityRole="button" accessibilityLabel={`${text("openBook")} ${book.title}`} onPress={onPress} style={({ pressed }) => [s.bookCard, d.libraryRow, pressed && s.pressed]}>
    <Cover book={book} />
    <View style={s.bookInfo}>
      <Label style={s.category}>{categoryName(language, book.category)}</Label>
      <Text style={s.bookTitle}>{book.title}</Text>
      <Text style={s.bookMeta}>{book.author}</Text>
      <Text style={s.bookMeta}>{`${book.chapters.length} ${text(book.chapters[0]?.pageIndex ? "pageCount" : "chapterCount")}`}</Text>
      {percent > 0 && <View style={s.progressTrack}><View style={[s.progressFill, { width: `${percent}%` }]} /></View>}
    </View>
  </Pressable>;
}

function SlidingPreferenceIcon<T extends string>({ value, renderIcon }: { value: T; renderIcon: (value: T) => React.ReactNode }) {
  const { s } = useUi();
  const [visibleValue, setVisibleValue] = useState(value);
  const [outgoingValue, setOutgoingValue] = useState<T | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const visibleRef = useRef(value);
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (value === visibleRef.current) return;
    const previousValue = visibleRef.current;
    visibleRef.current = value;
    if (reduceMotion) {
      setOutgoingValue(null);
      setVisibleValue(value);
      progress.setValue(1);
      return;
    }
    setOutgoingValue(previousValue);
    setVisibleValue(value);
    progress.setValue(0);
    const animation = Animated.timing(progress, { toValue: 1, duration: 210, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    animation.start(({ finished }) => { if (finished) setOutgoingValue(null); });
    return () => animation.stop();
  }, [value, reduceMotion, progress]);

  const incomingStyle = { opacity: progress, transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [11, 0] }) }] };
  const outgoingStyle = { opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, -11] }) }] };
  return <View style={s.preferenceIconSlot} accessible={false}>
    {outgoingValue !== null && <Animated.View style={[s.preferenceIconLayer, outgoingStyle]}>{renderIcon(outgoingValue)}</Animated.View>}
    <Animated.View style={[s.preferenceIconLayer, incomingStyle]}>{renderIcon(visibleValue)}</Animated.View>
  </View>;
}

function LanguageToggle() {
  const { s, C } = useUi();
  const { language, setLanguage, text } = useLocale();
  return <Pressable accessibilityRole="button" accessibilityLabel={language === "en" ? text("switchToSpanish") : text("switchToEnglish")} onPress={() => setLanguage(language === "en" ? "es" : "en")} style={s.preferenceCircle}>
    <SlidingPreferenceIcon value={language} renderIcon={(value) => <Text style={[s.languageIcon, { color: C.onButton }]}>{value === "en" ? "EN" : "ES"}</Text>} />
  </Pressable>;
}

function ThemeToggle() {
  const { s, C } = useUi();
  const { preference, setPreference } = useAppTheme();
  const { text } = useLocale();
  const next: ThemePreference = preference === "system" ? "light" : preference === "light" ? "dark" : "system";
  const mode = text(preference === "system" ? "themeSystem" : preference === "light" ? "themeLight" : "themeDark");
  return <Pressable accessibilityRole="button" accessibilityLabel={`${text("appearance")}: ${mode}`} accessibilityHint={text("themeCycleHint")} onPress={() => setPreference(next)} style={s.preferenceCircle}>
    <SlidingPreferenceIcon value={preference} renderIcon={(value) => <ThemeIcon mode={value} color={C.onButton} />} />
  </Pressable>;
}

function HomeScreen() {
  const { s, d, C } = useUi();
  const { scheme } = useAppTheme();
  const navigation = useNavigation<any>();
  const { progress, lastBookId } = useReading();
  const { language, text } = useLocale();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => books.filter((book) => `${book.title} ${book.subtitle} ${book.category} ${categoryName(language, book.category)}`.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es"))), [language, query]);
  const resumeId = lastBookId && findBook(lastBookId) ? lastBookId : Object.keys(progress).find((id) => Boolean(findBook(id)));
  const resume = resumeId ? findBook(resumeId) : undefined;
  const resumeChapter = resume ? progress[resume.id] ?? 0 : 0;
  return <ScrollView style={s.screen} contentContainerStyle={[s.page, d.page]} keyboardShouldPersistTaps="handled">
    <View style={s.topline}><Text style={s.brand}>Risale-i Nur</Text><View style={s.headerActions}>{__DEV__ && <LanguageToggle />}<ThemeToggle /></View></View>
    <View style={s.searchBox}><Text style={s.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder={text("searchHome")} placeholderTextColor={C.muted} keyboardAppearance={scheme} style={s.searchInput} returnKeyType="search" accessibilityLabel={text("searchHome")} /></View>
    {query.length > 0 ? <><SectionTitle title={text("resultsTitle")} hint={`${filtered.length} ${text("results")}`} />{filtered.length ? filtered.map((book) => <BookCard key={book.id} book={book} onPress={() => navigation.navigate("Detail", { bookId: book.id })} />) : <Text style={s.emptyText}>{text(books.length ? "noResults" : "noBooksAvailable")}</Text>}</> : <>
      {resume && <View style={s.resumePanel}><View style={s.resumeIcon}><Text style={s.resumeGlyph}>↗</Text></View><View style={s.resumeCopy}><Label>{text("continueReading").toLocaleUpperCase(language)}</Label><Text style={s.resumeTitle}>{resume.title}</Text><Text style={s.resumeMeta}>{resume.chapters[resumeChapter]?.title}</Text></View><Pressable onPress={() => navigation.navigate("Reader", { bookId: resume.id, chapterIndex: resumeChapter })} style={s.resumeButton} accessibilityLabel={text("continueReading")}><Text style={s.resumeButtonText}>›</Text></Pressable></View>}
      {books.length > 0 ? <><SectionTitle title={text("library")} action={books.length > 1 ? () => navigation.navigate("Library") : undefined} />
        {books.map((book) => <BookCard key={book.id} book={book} onPress={() => navigation.navigate("Detail", { bookId: book.id })} />)}</> : <Text style={s.emptyText}>{text("noBooksAvailable")}</Text>}
    </>}
  </ScrollView>;
}

function SectionTitle({ title, hint, action }: { title: string; hint?: string; action?: () => void }) {
  const { s } = useUi();
  const { text } = useLocale();
  return <View style={s.sectionTitleRow}><Text style={s.sectionTitle}>{title}</Text>{action ? <Pressable onPress={action} hitSlop={10} accessibilityRole="button"><Text style={s.sectionAction}>{text("seeAll")}</Text></Pressable> : hint ? <Text style={s.sectionHint}>{hint}</Text> : null}</View>;
}

function LibraryScreen() {
  const { s, d, C } = useUi();
  const { scheme } = useAppTheme();
  const navigation = useNavigation<any>();
  const { language, text } = useLocale();
  const [query, setQuery] = useState("");
  const filtered = books.filter((book) => `${book.title} ${book.subtitle} ${book.author} ${book.category} ${categoryName(language, book.category)}`.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")));
  return <ScrollView style={s.screen} contentContainerStyle={[s.page, d.page]}>
    <Text style={s.pageHeading}>{text("library")}</Text>
    <View style={[s.searchBox, s.librarySearch]}><Text style={s.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder={text("searchLibrary")} placeholderTextColor={C.muted} keyboardAppearance={scheme} style={s.searchInput} accessibilityLabel={text("searchLibrary")} /></View>
    <View style={s.chip}><Text style={s.chipText}>{text("allBooks")}</Text><Text style={s.chipCount}>{filtered.length}</Text></View>
    {filtered.length ? filtered.map((book) => <BookCard key={book.id} book={book} onPress={() => navigation.navigate("Detail", { bookId: book.id })} />) : <Text style={s.emptyText}>{text(books.length ? "noResults" : "noBooksAvailable")}</Text>}
  </ScrollView>;
}

function SavedScreen() {
  const { s, d, C } = useUi();
  const navigation = useNavigation<any>();
  const { bookmarks } = useReading();
  const { text } = useLocale();
  type SavedItem = { book: Book; chapter: Book["chapters"][number] };
  const saved: SavedItem[] = bookmarks.flatMap((key): SavedItem[] => {
    const [bookId, chapterId] = key.split(":");
    const book = findBook(bookId);
    const chapter = book?.chapters.find((item) => item.id === chapterId);
    return book && chapter ? [{ book, chapter }] : [];
  });
  return <ScrollView style={s.screen} contentContainerStyle={[s.page, d.page]}><Label style={s.eyebrow}>{text("yourMarks")}</Label><Text style={s.pageHeading}>{text("saved")}</Text><Text style={s.welcomeBody}>{text("savedBody")}</Text>
    {saved.length ? saved.map(({ book, chapter }) => <Pressable key={`${book.id}:${chapter.id}`} style={[s.savedCard, d.savedRow]} onPress={() => navigation.navigate("Reader", { bookId: book.id, chapterIndex: book.chapters.findIndex((item) => item.id === chapter.id) })} accessibilityRole="button" accessibilityLabel={`${chapter.title}, ${text("fromBook")} ${book.title}`}><View style={[s.savedMark, { backgroundColor: book.cover.background }]}><BookmarkIcon size={22} color={book.cover.accent} filled /></View><View style={s.savedCopy}><Text style={s.savedTitle}>{chapter.title}</Text><Text style={s.savedMeta}>{book.title}</Text></View><Text style={s.savedArrow}>›</Text></Pressable>) : <View style={s.emptyCard}><View style={{ marginBottom: 10 }}><BookmarkIcon size={30} color={C.gold} /></View><Text style={s.emptyTitle}>{text("collectionStarts")}</Text><Text style={s.emptyText}>{text("saveChapterHint")}</Text><Pressable onPress={() => navigation.navigate("Library")} style={s.outlineButton}><Text style={s.outlineButtonText}>{text("browseLibrary")}</Text></Pressable></View>}
  </ScrollView>;
}

function DetailScreen({ route, navigation }: NativeStackScreenProps<RootStack, "Detail">) {
  const { s, d } = useUi();
  const book = findBook(route.params.bookId);
  const { progress } = useReading();
  const { language, text } = useLocale();
  useEffect(() => { navigation.setOptions({ title: text("detailHeader"), headerBackTitle: text("back") }); }, [language, navigation, text]);
  if (!book) return <View style={s.screen}><Text style={s.emptyText}>{text("unavailableBook")}</Text></View>;
  const chapterIndex = progress[book.id] ?? 0;
  const sections = book.chapters.map((chapter, index) => ({ chapter, index })).filter(({ chapter }) => chapter.isSectionStart);
  return <ScrollView style={s.screen} contentContainerStyle={[s.detailPage, d.detailPage]}>
    <View style={[s.detailTop, d.detailTop]}><Cover book={book} large /><View style={s.detailIntro}><Label style={s.category}>{categoryName(language, book.category)}</Label><Text style={[s.detailTitle, d.detailTitle]}>{book.title}</Text><Text style={s.detailSubtitle}>{book.subtitle}</Text><Text style={s.bookMeta}>{book.author}</Text><View style={s.detailStats}><Text style={s.stat}>{book.chapters.length} {text(book.chapters[0]?.pageIndex ? "pageCount" : "chapterCount")}</Text></View></View></View>
    <Text style={s.detailDescription}>{book.description}</Text>
    <Pressable style={s.primaryButton} onPress={() => navigation.navigate("Reader", { bookId: book.id, chapterIndex })}><Text style={s.primaryButtonText}>{chapterIndex > 0 ? text("continueReading") : text("startReading")}</Text><Text style={s.primaryButtonText}>→</Text></Pressable>
    <SectionTitle title={text("inThisBook")} hint={`${sections.length} ${text("chapterCount")}`} />
    {sections.map(({ chapter, index }, sectionIndex) => <Pressable key={chapter.id} style={s.chapterRow} onPress={() => navigation.navigate("Reader", { bookId: book.id, chapterIndex: index })}><Text style={s.chapterNumber}>{String(sectionIndex + 1).padStart(2, "0")}</Text><Text style={s.chapterTitle}>{chapter.title}</Text><Text style={s.chapterArrow}>↗</Text></Pressable>)}
  </ScrollView>;
}

function ImprintPage({ source, fontSize }: { source: string; fontSize: number }) {
  const { s } = useUi();
  const lines = source.split("\n");
  const [originalLabel, firstTitleLine] = lines[0].split(" : ");
  const copy = { fontSize, lineHeight: Math.round(fontSize * 1.45) };
  return <View style={s.imprintPage}>
    <Text style={[s.imprintText, copy]}>{originalLabel} : <Text style={s.imprintBold}>{firstTitleLine}{"\n"}{lines[1]}</Text></Text>
    <Text style={[s.imprintText, copy]}>{lines[2]}{"\n"}<Text style={s.imprintBold}>{lines[3]}</Text></Text>
    <Text style={[s.imprintText, copy]}>{lines[4]}{"\n"}<Text style={s.imprintBold}>{lines[5]}</Text></Text>
    <Text style={[s.imprintText, copy]}>{lines.slice(6, 8).join("\n")}</Text>
    <Text style={[s.imprintText, copy]}>{lines.slice(8, 12).join(" ")}</Text>
    <Text style={[s.imprintText, copy]}>{lines[12]}{"\n"}<Text style={s.imprintBold}>{lines[13]}</Text>{"\n"}{lines[14]}</Text>
  </View>;
}

function PageScrubber({ value, count, onChange, label, pageLabel }: { value: number; count: number; onChange: (index: number) => void; label: string; pageLabel: string }) {
  const { s } = useUi();
  const [draft, setDraft] = useState(value);
  const [width, setWidth] = useState(22);
  const [dragging, setDragging] = useState(false);
  // Keep the released position visible while the page-turn animation catches up.
  // Sync only when the active page actually changes; ending a drag must not
  // momentarily snap the dot back to the previous page.
  useEffect(() => { setDraft(value); }, [value]);
  const railWidth = Math.max(1, width - 22);
  const at = (event: GestureResponderEvent) => Math.max(0, Math.min(count - 1, Math.round(((event.nativeEvent.locationX - 11) / railWidth) * (count - 1))));
  const fraction = count > 1 ? draft / (count - 1) : 0;
  const dotCenter = 11 + railWidth * fraction;
  const hintLeft = Math.max(0, Math.min(width - 44, dotCenter - 22));
  return <View
    accessibilityRole="adjustable"
    accessibilityLabel={label}
    accessibilityValue={{ min: 1, max: count, now: draft + 1, text: `${pageLabel} ${draft + 1} / ${count}` }}
    accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
    onAccessibilityAction={(event) => onChange(Math.max(0, Math.min(count - 1, value + (event.nativeEvent.actionName === "increment" ? 1 : -1))))}
    onLayout={(event) => setWidth(Math.max(22, event.nativeEvent.layout.width))}
    onStartShouldSetResponder={() => true}
    onMoveShouldSetResponder={() => true}
    onResponderGrant={(event) => { setDragging(true); setDraft(at(event)); }}
    onResponderMove={(event) => setDraft(at(event))}
    onResponderRelease={(event) => { const next = at(event); setDraft(next); setDragging(false); onChange(next); }}
    onResponderTerminate={() => { setDragging(false); setDraft(value); }}
    style={s.scrubberDock}
  >
    {dragging && <View pointerEvents="none" style={[s.scrubberPageHint, { left: hintLeft }]}><Text style={s.scrubberPageHintText}>{draft + 1}</Text></View>}
    <View pointerEvents="none" style={[s.scrubberDot, dragging && s.scrubberDotActive, { left: dotCenter - 8 }]} />
  </View>;
}

const ReaderPage = React.memo(function ReaderPage({ chapter, fontSize }: { chapter: Book["chapters"][number]; fontSize: number }) {
  const { s } = useUi();
  const { text } = useLocale();
  const preservesSourcePlacement = Boolean(chapter.inlineTitle);
  const bodyFontSize = fontSize - 2;

  return <View style={[s.readingPage, preservesSourcePlacement && s.sourcePlacementPage]}>
      {!preservesSourcePlacement && chapter.showTitleInReader !== false && <><View style={s.readingOrnament}><Text style={s.ornamentText}>✳</Text></View><Text style={s.readerTitle}>{chapter.title}</Text><View style={s.titleRule} /></>}
      {chapter.openingHeadingImage === "title-page" ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.artworkZoomRow} onTouchStart={(event) => event.stopPropagation()} onTouchEnd={(event) => event.stopPropagation()}>
        <Image source={require("./assets/RamadanTitlePage-local.png")} accessibilityLabel={chapter.artworkAccessibilityLabel ?? chapter.title} resizeMode="contain" style={{ width: Math.round(310 * fontSize / 19), height: Math.round(460 * fontSize / 19) }} />
      </ScrollView> : chapter.openingHeadingImage && <Image
        source={chapter.openingHeadingImage === "ramadan" ? require("./assets/RamadanHeading-local.png") : chapter.openingHeadingImage === "frugalidad" ? require("./assets/FrugalidadHeading-local.png") : require("./assets/AgradecimientoHeading-local.png")}
        accessibilityLabel={chapter.artworkAccessibilityLabel ?? chapter.title}
        resizeMode="contain"
        style={[s.sourceHeadingImage, chapter.openingHeadingImage === "frugalidad" && s.sourceHeadingImageShort]}
      />}
      {chapter.imprintPage && <ImprintPage source={chapter.text} fontSize={fontSize} />}
      {!chapter.imprintPage && chapter.text.split("\n\n").map((paragraph, i) => <React.Fragment key={i}>
        {isPointHeading(paragraph)
          ? <Text accessibilityRole="header" selectable style={[s.pointHeading, { fontSize: bodyFontSize + 3, lineHeight: Math.round((bodyFontSize + 3) * 1.45) }]}>{paragraph}</Text>
          : <ArabicRichText text={paragraph} translationLabel={text("spanishTranslation")} closeLabel={text("close")} style={[s.paragraph, { fontSize: bodyFontSize, lineHeight: Math.round(bodyFontSize * 1.68) }]} />}
        {chapter.inlineTitle?.afterParagraph === i && <Text style={s.inlineSourceTitle}>{chapter.inlineTitle.value}</Text>}
      </React.Fragment>)}
      {chapter.text.trim().length > 0 && !chapter.imprintPage && <View style={s.endMark}><View style={s.endLine} /><View style={s.endLine} /></View>}
  </View>;
});

function ReaderScreen({ route, navigation }: NativeStackScreenProps<RootStack, "Reader">) {
  const { s, C } = useUi();
  const book = findBook(route.params.bookId);
  const { progress, ready, setProgress, toggleBookmark, isBookmarked } = useReading();
  const { text } = useLocale();
  const [fontSize, setFontSize] = useState(19);
  const [index, setIndex] = useState(() => Math.min(route.params.chapterIndex ?? progress[route.params.bookId] ?? 0, (book?.chapters.length ?? 1) - 1));
  const [resolved, setResolved] = useState(false);
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const pageHeights = useRef<number[]>([]);
  const pendingPosition = useRef<number | null>(null);
  const awaitingTextLayout = useRef(false);
  const positionFrame = useRef<number | null>(null);
  const visibleIndex = useRef(index);
  const [viewportHeight, setViewportHeight] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const chapter = book?.chapters[index];
  useEffect(() => {
    if (!ready || resolved || !book) return;
    const start = Math.max(0, Math.min(route.params.chapterIndex ?? progress[book.id] ?? 0, book.chapters.length - 1));
    pendingPosition.current = start;
    visibleIndex.current = start;
    setIndex(start);
    setResolved(true);
  }, [book, progress, ready, resolved, route.params.chapterIndex]);
  useEffect(() => { if (ready && resolved && book) setProgress(book.id, index); }, [book, index, ready, resolved, setProgress]);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => subscription.remove();
  }, []);
  const pageOffset = useCallback((target: number) => {
    if (target < 0 || pageHeights.current[target] === undefined) return;
    let offset = 0;
    for (let i = 0; i < target; i += 1) {
      const height = pageHeights.current[i];
      if (height === undefined) return;
      offset += height;
    }
    return offset;
  }, []);
  const positionPendingPage = useCallback(() => {
    if (pendingPosition.current === null || awaitingTextLayout.current || positionFrame.current !== null) return;
    positionFrame.current = requestAnimationFrame(() => {
      positionFrame.current = null;
      const target = pendingPosition.current;
      if (target === null || !viewportHeight || !scroll.current) return;
      const offset = pageOffset(target);
      if (offset === undefined) return;
      pendingPosition.current = null;
      scroll.current.scrollTo({ y: offset, animated: false });
    });
  }, [pageOffset, viewportHeight]);
  useEffect(positionPendingPage, [positionPendingPage]);
  useEffect(() => () => {
    if (positionFrame.current !== null) cancelAnimationFrame(positionFrame.current);
  }, []);
  if (!book || !chapter) return <View style={s.screen}><Text style={s.emptyText}>{text("unavailableChapter")}</Text></View>;
  if (!ready || !resolved) return <View style={s.readerScreen}><Text style={s.emptyText}>{text("preparing")}</Text></View>;
  const bookmarked = isBookmarked(book.id, chapter.id);
  const displayedPageNumber = chapter.displayPageNumber ?? chapter.sourcePageNumber ?? chapter.pageIndex;
  const currentSectionTitle = book.chapters.slice(0, index + 1).reduce<string | undefined>((title, item) => item.isSectionStart ? item.title : title, undefined);
  const turnTo = (next: number, trigger: "button" | "swipe" | "slider") => {
    const offset = pageOffset(next);
    if (offset === undefined || next === visibleIndex.current) return;
    pendingPosition.current = null;
    scroll.current?.scrollTo({ y: offset, animated: !reduceMotion && trigger !== "slider" });
  };
  const followScroll = (offset: number) => {
    if (pendingPosition.current !== null) return;
    // A page becomes current as its top crosses the reading area's top edge.
    let next = 0;
    let boundary = 0;
    while (next < book.chapters.length - 1) {
      const height = pageHeights.current[next];
      if (height === undefined || boundary + height > offset + 1) break;
      boundary += height;
      next += 1;
    }
    if (next !== visibleIndex.current) {
      visibleIndex.current = next;
      setIndex(next);
    }
  };
  const resizeText = (delta: number) => {
    const next = Math.max(16, Math.min(26, fontSize + delta));
    if (next === fontSize) return;
    pendingPosition.current = visibleIndex.current;
    awaitingTextLayout.current = true;
    setFontSize(next);
  };
  const onReaderTouchEnd = (x: number, y: number) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = x - start.x;
    const dy = y - start.y;
    if (Math.abs(dx) >= 75 && Math.abs(dx) > Math.abs(dy) * 1.4) turnTo(visibleIndex.current + (dx < 0 ? 1 : -1), "swipe");
  };
  return <View style={s.readerScreen}>
    <ExpoStatusBar style="dark" />
    <SafeAreaView edges={["top"]} style={s.readerHeaderSafe}>
      <View style={s.readerTop}>
        <Pressable accessibilityRole="button" accessibilityLabel={text("back")} onPress={() => navigation.goBack()} hitSlop={4} style={({ pressed }) => [s.readerBackButton, pressed && s.readerBackButtonPressed]}><Text style={s.readerBackIcon}>‹</Text></Pressable>
        <View style={s.readerHeaderCopy}>
          <Text numberOfLines={2} style={s.readerBook}>{book.title}</Text>
          {currentSectionTitle && <View style={s.readerSectionRow}><View style={s.readerSectionRule} /><Text numberOfLines={2} style={s.readerSectionTitle}>{currentSectionTitle}</Text></View>}
        </View>
        <Text style={s.readerChapter}>{displayedPageNumber ? `${text("pdfPage")} ${displayedPageNumber}` : `${text("chapter")} ${String(index + 1).padStart(2, "0")}`} · {book.chapters.length}</Text>
      </View>
    </SafeAreaView>
    <ScrollView
      ref={scroll}
      style={s.readingScroll}
      scrollEventThrottle={16}
      onLayout={({ nativeEvent }) => setViewportHeight(nativeEvent.layout.height)}
      onContentSizeChange={() => {
        awaitingTextLayout.current = false;
        positionPendingPage();
      }}
      onScroll={({ nativeEvent }) => followScroll(nativeEvent.contentOffset.y)}
      onTouchStart={({ nativeEvent }) => { touchStart.current = { x: nativeEvent.pageX, y: nativeEvent.pageY }; }}
      onTouchEnd={({ nativeEvent }) => onReaderTouchEnd(nativeEvent.pageX, nativeEvent.pageY)}
      onTouchCancel={() => { touchStart.current = null; }}
      onScrollBeginDrag={() => { touchStart.current = null; pendingPosition.current = null; }}
    >
      {book.chapters.map((item, pageIndex) => <View
        key={item.id}
        style={pageIndex === book.chapters.length - 1 ? { minHeight: viewportHeight } : undefined}
        onLayout={({ nativeEvent }) => {
          pageHeights.current[pageIndex] = nativeEvent.layout.height;
          positionPendingPage();
        }}
      >
        <ReaderPage chapter={item} fontSize={fontSize} />
      </View>)}
    </ScrollView>
    <View style={s.readerFooter}>
      {book.chapters.length > 1 && <PageScrubber value={index} count={book.chapters.length} onChange={(next) => turnTo(next, "slider")} label={text("pageSlider")} pageLabel={text("pdfPage")} />}
      <SafeAreaView edges={["bottom"]} style={s.readerFooterSafe}><View style={s.readerControls}><Pressable accessibilityLabel={text(displayedPageNumber ? "previousPage" : "previousChapter")} onPress={() => turnTo(index - 1, "button")} disabled={index === 0} style={s.pageButton}><Text style={[s.pageButtonText, index === 0 && s.disabled]}>←</Text></Pressable><View style={s.fontControls}><Pressable accessibilityLabel={text("decreaseText")} onPress={() => resizeText(-1)} style={s.fontButton}><Text style={s.fontSmall}>A−</Text></Pressable><Text style={s.controlDivider}>│</Text><Pressable accessibilityLabel={text("increaseText")} onPress={() => resizeText(1)} style={s.fontButton}><Text style={s.fontLarge}>A+</Text></Pressable></View><Pressable accessibilityRole="button" accessibilityState={{ selected: bookmarked }} accessibilityLabel={bookmarked ? text("removeBookmark") : text("addBookmark")} onPress={() => toggleBookmark(book.id, chapter.id)} style={s.pageButton}><BookmarkIcon size={23} color={C.teal} filled={bookmarked} /></Pressable><Pressable accessibilityLabel={text(displayedPageNumber ? "nextPage" : "nextChapter")} onPress={() => turnTo(index + 1, "button")} disabled={index === book.chapters.length - 1} style={s.pageButton}><Text style={[s.pageButtonText, index === book.chapters.length - 1 && s.disabled]}>→</Text></Pressable></View></SafeAreaView>
    </View>
  </View>;
}

function TabsRoot() {
  const { s, C } = useUi();
  const { text } = useLocale();
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => subscription.remove();
  }, []);
  return <SafeAreaView edges={["top"]} style={s.tabsSafeArea}><Tab.Navigator screenOptions={{ headerShown: false, animation: reduceMotion ? "none" : "fade", transitionSpec: { animation: "timing", config: { duration: 210, easing: Easing.out(Easing.cubic) } }, tabBarActiveTintColor: C.teal, tabBarInactiveTintColor: C.muted, tabBarStyle: s.tabBar, tabBarLabelStyle: s.tabLabel, tabBarHideOnKeyboard: true }}>
    <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: text("homeTab"), tabBarIcon: ({ color }) => <Text style={[s.tabGlyph, { color }]}>⌂</Text> }} />
    <Tab.Screen name="Library" component={LibraryScreen} options={{ tabBarLabel: text("libraryTab"), tabBarIcon: ({ color }) => <Text style={[s.tabGlyph, { color }]}>▤</Text> }} />
    <Tab.Screen name="Saved" component={SavedScreen} options={{ tabBarLabel: text("saved"), tabBarIcon: ({ color, focused }) => <BookmarkIcon size={23} color={color} filled={focused} /> }} />
  </Tab.Navigator></SafeAreaView>;
}

function AppShell() {
  const { C } = useUi();
  const { scheme } = useAppTheme();
  const { text } = useLocale();
  const navigationTheme = { ...DefaultTheme, dark: scheme === "dark", colors: { ...DefaultTheme.colors, primary: C.teal, background: C.paper, card: C.card, text: C.ink, border: C.line, notification: C.gold } };
  return <NavigationContainer theme={navigationTheme}><ExpoStatusBar style={scheme === "dark" ? "light" : "dark"} /><Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: C.paper }, headerTintColor: C.ink, headerShadowVisible: false, headerTitleStyle: { fontSize: 14, fontWeight: "700" }, contentStyle: { backgroundColor: C.paper } }}>
    <Stack.Screen name="Tabs" component={TabsRoot} options={{ headerShown: false }} />
    <Stack.Screen name="Detail" component={DetailScreen} options={{ title: text("detailHeader"), headerBackTitle: text("back") }} />
    <Stack.Screen name="Reader" component={ReaderScreen} options={{ headerShown: false }} />
  </Stack.Navigator></NavigationContainer>;
}

export default function App() {
  const [fontsLoaded] = useFonts({ AmiriBismillah: require("@expo-google-fonts/amiri/400Regular/Amiri_400Regular.ttf") });
  if (!fontsLoaded) return null;
  return <SafeAreaProvider><ThemeProvider><LanguageProvider><ReadingProvider><AppShell /></ReadingProvider></LanguageProvider></ThemeProvider></SafeAreaProvider>;
}

function createUi(C: typeof LIGHT) {
const reader = LIGHT;
const s = StyleSheet.create({
  turningPage: { flex: 1 },
  tabsSafeArea: { flex: 1, backgroundColor: C.paper },
  screen: { flex: 1, backgroundColor: C.paper }, page: { paddingHorizontal: 22, paddingTop: 19, paddingBottom: 38 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  preferenceCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.button, alignItems: "center", justifyContent: "center" },
  preferenceIconSlot: { width: 28, height: 28, overflow: "hidden" },
  preferenceIconLayer: { position: "absolute", width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  languageIcon: { color: C.onButton, fontSize: 14, fontWeight: "700", letterSpacing: 0.6 },
  topline: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }, brand: { color: C.teal, fontSize: 19, fontWeight: "800", letterSpacing: 0.5 },
  label: { color: C.muted, fontSize: 10, fontWeight: "700", letterSpacing: 1.3 }, eyebrow: { color: C.teal, marginBottom: 12 }, welcomeBody: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 8 },
  searchBox: { minHeight: 48, flexDirection: "row", alignItems: "center", backgroundColor: C.card, borderColor: C.line, borderWidth: 1, paddingHorizontal: 13, borderRadius: 12, marginBottom: 29 }, searchIcon: { fontSize: 24, color: C.muted, width: 30 }, searchInput: { flex: 1, color: C.ink, fontSize: 13, paddingVertical: 10 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4, marginBottom: 13 }, sectionTitle: { fontFamily: "Georgia", fontSize: 21, color: C.ink }, sectionHint: { color: C.muted, fontSize: 11, letterSpacing: 1.2, fontWeight: "700" }, sectionAction: { color: C.teal, fontSize: 12, fontWeight: "600" },
  cover: { flex: 1, minHeight: 124, borderRadius: 3, padding: 10, overflow: "hidden", justifyContent: "space-between", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 2, height: 3 }, elevation: 2 }, coverLarge: { width: 143, height: 207, flex: 0, padding: 15 }, coverInset: { position: "absolute", top: 7, left: 7, right: 7, bottom: 7, borderWidth: 0.7, borderRadius: 1 }, coverTitleWrap: { marginTop: "auto", marginBottom: "auto" }, coverTitle: { color: "#F7F4EB", fontFamily: "Georgia", fontSize: 15, lineHeight: 17 }, coverTitleLarge: { fontSize: 21, lineHeight: 24 }, coverRule: { width: 25, height: 1, marginTop: 7, marginBottom: 6 }, coverSubtitle: { fontSize: 7, lineHeight: 10 }, coverMark: { position: "absolute", right: 10, top: 25, fontFamily: "Georgia", fontSize: 24, opacity: 0.25 }, coverFooter: { fontSize: 5, letterSpacing: 1.1 },
  resumePanel: { minHeight: 82, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, marginBottom: 29, padding: 12, flexDirection: "row", alignItems: "center" }, resumeIcon: { width: 45, height: 54, backgroundColor: C.mint, borderRadius: 7, alignItems: "center", justifyContent: "center" }, resumeGlyph: { color: C.teal, fontSize: 20 }, resumeCopy: { flex: 1, paddingHorizontal: 12 }, resumeTitle: { color: C.ink, fontSize: 14, fontWeight: "700", marginTop: 4 }, resumeMeta: { color: C.muted, fontSize: 12, marginTop: 3 }, resumeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.button, alignItems: "center", justifyContent: "center" }, resumeButtonText: { color: C.onButton, fontSize: 23, lineHeight: 25 },
  bookCard: { minHeight: 143, flexDirection: "row", alignItems: "center", gap: 17, backgroundColor: C.card, borderColor: C.line, borderWidth: 1, borderRadius: 14, padding: 11, marginBottom: 12 }, bookInfo: { flex: 1, gap: 5 }, category: { color: C.teal, fontSize: 10, letterSpacing: 1.1 }, bookTitle: { color: C.ink, fontFamily: "Georgia", fontSize: 17, lineHeight: 21 }, bookMeta: { color: C.muted, fontSize: 12 }, progressTrack: { height: 3, backgroundColor: C.line, marginTop: 5, borderRadius: 2 }, progressFill: { height: 3, backgroundColor: C.teal, borderRadius: 2 }, pressed: { opacity: 0.83, transform: [{ scale: 0.99 }] }, emptyText: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  pageHeading: { color: C.ink, fontFamily: "Georgia", fontSize: 34 }, librarySearch: { marginTop: 20, marginBottom: 20 }, chip: { flexDirection: "row", gap: 9, alignItems: "center", alignSelf: "flex-start", backgroundColor: C.mint, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 11, marginBottom: 13 }, chipText: { color: C.teal, fontSize: 10, fontWeight: "800", letterSpacing: 0.9 }, chipCount: { color: C.teal, fontSize: 11, fontWeight: "700" }, emptyCard: { backgroundColor: C.card, borderRadius: 17, padding: 24, alignItems: "center", marginTop: 22, borderWidth: 1, borderColor: C.line }, emptyTitle: { color: C.ink, fontFamily: "Georgia", fontSize: 19 }, outlineButton: { borderColor: C.teal, borderWidth: 1, borderRadius: 22, paddingVertical: 11, paddingHorizontal: 17, marginTop: 20 }, outlineButtonText: { color: C.teal, fontSize: 11, fontWeight: "700" },
  savedCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.card, borderRadius: 13, borderWidth: 1, borderColor: C.line, padding: 13, marginTop: 10 }, savedMark: { height: 45, width: 45, borderRadius: 9, alignItems: "center", justifyContent: "center" }, savedCopy: { flex: 1, paddingHorizontal: 12 }, savedTitle: { color: C.ink, fontFamily: "Georgia", fontSize: 16 }, savedMeta: { color: C.muted, fontSize: 12, marginTop: 4 }, savedArrow: { color: C.teal, fontSize: 24 },
  detailPage: { padding: 22, paddingBottom: 40 }, detailTop: { flexDirection: "row", alignItems: "center", gap: 19, marginTop: 4 }, detailIntro: { flex: 1 }, detailTitle: { fontFamily: "Georgia", fontSize: 28, lineHeight: 31, color: C.ink, marginTop: 7 }, detailSubtitle: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 6, marginBottom: 10 }, detailStats: { flexDirection: "row", gap: 8, marginTop: 12, alignItems: "center" }, stat: { color: C.teal, fontSize: 12, fontWeight: "600" }, detailDescription: { color: C.muted, fontSize: 13, lineHeight: 21, marginTop: 24 }, primaryButton: { backgroundColor: C.button, borderRadius: 11, minHeight: 50, marginVertical: 23, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, primaryButtonText: { color: C.onButton, fontSize: 13, fontWeight: "700" }, chapterRow: { minHeight: 54, flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: C.line }, chapterNumber: { width: 38, color: C.gold, fontFamily: "Georgia", fontSize: 14 }, chapterTitle: { flex: 1, color: C.ink, fontFamily: "Georgia", fontSize: 15 }, chapterArrow: { color: C.teal, fontSize: 16 },
  scrubberDock: { position: "absolute", top: -22, left: 0, right: 0, height: 44, zIndex: 2 },
  scrubberDot: { position: "absolute", top: 14, width: 16, height: 16, borderRadius: 8, backgroundColor: reader.teal, borderWidth: 2, borderColor: C.card, elevation: 2, shadowColor: "#000", shadowOpacity: 0.16, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  scrubberDotActive: { transform: [{ scale: 1.18 }], shadowOpacity: 0.24 },
  scrubberPageHint: { position: "absolute", top: -17, width: 44, height: 25, borderRadius: 13, backgroundColor: C.button, alignItems: "center", justifyContent: "center", elevation: 3, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  scrubberPageHintText: { color: C.onButton, fontSize: 12, fontWeight: "700" },
  readerScreen: { flex: 1, backgroundColor: "#F7F6F0" }, readerHeaderSafe: { backgroundColor: "#E8EEEA" }, readerTop: { minHeight: 70, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 11, backgroundColor: "#E8EEEA", borderBottomWidth: 1, borderColor: reader.line }, readerBackButton: { width: 44, height: 44, flexShrink: 0, borderRadius: 22, backgroundColor: "#D8E4DE", alignItems: "center", justifyContent: "center" }, readerBackButtonPressed: { opacity: 0.72, transform: [{ scale: 0.97 }] }, readerBackIcon: { color: reader.teal, fontSize: 34, lineHeight: 36, marginTop: -2 }, readerHeaderCopy: { flex: 1, minWidth: 0, paddingTop: 1 }, readerBook: { color: reader.teal, fontSize: 10, lineHeight: 14, fontWeight: "700", letterSpacing: 0.55 }, readerSectionRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 7 }, readerSectionRule: { width: 18, height: 1, backgroundColor: reader.gold }, readerSectionTitle: { flex: 1, color: reader.ink, fontFamily: readerSerif, fontSize: 14, lineHeight: 18 }, readerChapter: { flexShrink: 0, color: reader.muted, fontSize: 10, lineHeight: 14, letterSpacing: 0.6, textAlign: "right", paddingTop: 1 }, bookmarkButton: { width: 39, height: 39, borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, alignItems: "center", justifyContent: "center" }, bookmarkActive: { backgroundColor: C.mint, borderColor: C.mint }, bookmarkGlyph: { fontSize: 18, color: C.teal }, bookmarkGlyphActive: { color: C.teal }, readingScroll: { flex: 1 }, readingPage: { paddingHorizontal: 29, paddingTop: 34, paddingBottom: 42 }, sourcePlacementPage: { paddingTop: 94 }, readingOrnament: { alignItems: "center", marginBottom: 17 }, ornamentText: { color: reader.gold, fontSize: 16 }, readerTitle: { color: reader.ink, fontFamily: readerSerif, fontSize: 30, lineHeight: 37, textAlign: "center", marginBottom: 19 }, inlineSourceTitle: { color: "#11100D", fontFamily: readerSerif, fontSize: 38, lineHeight: 49, letterSpacing: 0, textAlign: "center", marginTop: 37, marginBottom: 12 }, titleRule: { height: 1, width: 38, backgroundColor: reader.gold, alignSelf: "center", marginBottom: 23 }, paragraph: { color: "#34413C", fontFamily: readerSerif, marginBottom: 16, letterSpacing: 0.08, textAlign: "center" }, pointHeading: { color: "#1B1916", fontFamily: readerSerif, fontWeight: "700", textAlign: "center", alignSelf: "stretch", marginBottom: 16 }, endMark: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 13, marginTop: 16 }, endLine: { width: 35, height: 1, backgroundColor: "#D7D8CE" }, endGlyph: { color: reader.gold, fontSize: 13 }, readerFooter: { position: "relative", zIndex: 1, backgroundColor: C.card }, readerFooterSafe: { backgroundColor: C.card }, readerControls: { minHeight: 64, backgroundColor: C.card, borderTopWidth: 1, borderColor: C.line, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12 }, pageButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" }, pageButtonText: { color: C.teal, fontSize: 22 }, disabled: { color: "#C3C9C3" }, fontControls: { flexDirection: "row", alignItems: "center", backgroundColor: C.paper, borderRadius: 22, height: 44 }, fontButton: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }, fontSmall: { color: C.ink, fontSize: 12 }, fontLarge: { color: C.ink, fontSize: 16 }, controlDivider: { color: C.line, fontSize: 12 },
  pdfScreen: { flex: 1, backgroundColor: "#F2F2EC" }, pdfToolbar: { minHeight: 60, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: C.card, borderBottomWidth: 1, borderColor: C.line }, pdfPageInfo: { flex: 1 }, pdfDocument: { flex: 1, backgroundColor: "#E6E7E2" }, pdfControls: { minHeight: 58, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: C.card, borderTopWidth: 1, borderColor: C.line }, pdfPageLabel: { color: C.ink, fontSize: 12, fontWeight: "600" }, pdfError: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  tabBar: { backgroundColor: C.card, borderTopColor: C.line, height: 62, paddingTop: 6, paddingBottom: 5 }, tabLabel: { fontSize: 11, fontWeight: "600" }, tabGlyph: { fontSize: 20, lineHeight: 23 },
  sourceHeadingImage: { width: "100%", height: 100, alignSelf: "center", marginBottom: 18 },
  sourceHeadingImageShort: { height: 62 },
  sourceTitlePageImage: { width: "100%", height: 460, marginBottom: 0 },
  imprintPage: { paddingTop: 10, paddingBottom: 12 },
  imprintText: { color: "#1B1916", fontFamily: "Georgia", textAlign: "left", marginBottom: 20 },
  imprintBold: { fontWeight: "700" },
  artworkZoomRow: { minWidth: "100%", justifyContent: "center" },
});

// Library entries use quiet rows; source book pages keep their own visual rules.
const d = StyleSheet.create({
  page: { paddingHorizontal: 24, paddingTop: 22 },
  detailPage: { paddingHorizontal: 24 },
  detailTop: { alignItems: "flex-start" },
  detailTitle: { fontSize: 25, lineHeight: 29 },
  libraryRow: { backgroundColor: "transparent", borderWidth: 0, borderBottomWidth: 1, borderBottomColor: C.line, borderRadius: 0, paddingHorizontal: 0, paddingVertical: 15, marginBottom: 0 },
  savedRow: { backgroundColor: "transparent", borderWidth: 0, borderBottomWidth: 1, borderBottomColor: C.line, borderRadius: 0, paddingHorizontal: 0, paddingVertical: 16, marginTop: 0 },
});
return { C, s, d };
}

const lightUi = createUi(LIGHT);
const darkUi = createUi(DARK);
