import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Book, books, findBook } from "./src/data/books";
import { ReadingProvider, useReading } from "./src/state/reading";
import { LanguageProvider, useLanguage } from "./src/state/language";
import { bookDescription, bookSubtitle, categoryName, CopyKey, t } from "./src/i18n/strings";
import { ArabicRichText } from "./src/components/ArabicRichText";


type RootStack = { Tabs: undefined; Detail: { bookId: string }; Reader: { bookId: string; chapterIndex?: number } };
type Tabs = { Home: undefined; Library: undefined; Saved: undefined };
const Stack = createNativeStackNavigator<RootStack>();
const Tab = createBottomTabNavigator<Tabs>();
const C = { ink: "#172628", paper: "#F4F4EF", card: "#FFFFFF", muted: "#737C78", teal: "#16474A", mint: "#DCE9E3", line: "#E5E8E2", gold: "#C6A76B", warm: "#F2E8D4" };
function useLocale() {
  const locale = useLanguage();
  const text = useCallback((key: CopyKey) => t(locale.language, key), [locale.language]);
  return { ...locale, text };
}

function Label({ children, style }: React.PropsWithChildren<{ style?: object }>) { return <Text style={[s.label, style]}>{children}</Text>; }

function Cover({ book, large = false }: { book: Book; large?: boolean }) {
  const { language, text } = useLocale();
  return <View style={[s.cover, large && s.coverLarge, { backgroundColor: book.cover.background }]}>
    <View style={[s.coverInset, { borderColor: `${book.cover.accent}77` }]} />
    <Text style={[s.coverBrand, { color: book.cover.accent }]}>LUMBRE</Text>
    <View style={s.coverTitleWrap}>
      <Text numberOfLines={2} style={[s.coverTitle, large && s.coverTitleLarge]}>{book.title}</Text>
      <View style={[s.coverRule, { backgroundColor: book.cover.accent }]} />
      <Text numberOfLines={2} style={[s.coverSubtitle, { color: `${book.cover.accent}DD` }]}>{bookSubtitle(language, book.id, book.subtitle)}</Text>
    </View>
    <Text style={[s.coverMark, { color: book.cover.accent }]}>{book.cover.mark}</Text>
    <Text style={[s.coverFooter, { color: `${book.cover.accent}BB` }]}>{text("sampleCover")}</Text>
  </View>;
}

function BookCard({ book, compact = false, onPress }: { book: Book; compact?: boolean; onPress: () => void }) {
  const { progress } = useReading();
  const { language, text } = useLocale();
  const total = book.chapters.length;
  const current = progress[book.id] ?? 0;
  const percent = total ? Math.round((current === 0 ? 0 : (current + 1) / total) * 100) : 0;
  return <Pressable accessibilityRole="button" accessibilityLabel={`${text("openBook")} ${book.title}`} onPress={onPress} style={({ pressed }) => [compact ? s.compactCard : s.bookCard, pressed && s.pressed]}>
    <Cover book={book} />
    <View style={s.bookInfo}>
      <Label style={s.category}>{categoryName(language, book.category)}</Label>
      <Text style={s.bookTitle}>{book.title}</Text>
      <Text style={s.bookMeta}>{text("sampleAuthor")}</Text>
      <Text style={s.bookMeta}>{`${book.readingMinutes} ${text("minutes")} · ${book.chapters.length} ${text("chapterCount")}`}</Text>
      {percent > 0 && <View style={s.progressTrack}><View style={[s.progressFill, { width: `${percent}%` }]} /></View>}
    </View>
  </Pressable>;
}

function LanguageToggle() {
  const { language, setLanguage, text } = useLocale();
  return <View style={s.languageToggle} accessibilityRole="tablist" accessibilityLabel={text("interfaceLanguage")}>
    {(["en", "es"] as const).map((option) => <Pressable key={option} accessibilityRole="tab" accessibilityState={{ selected: language === option }} accessibilityLabel={option === "en" ? text("switchToEnglish") : text("switchToSpanish")} onPress={() => setLanguage(option)} style={[s.languageOption, language === option && s.languageOptionActive]}>
      <Text style={[s.languageOptionText, language === option && s.languageOptionTextActive]}>{option === "en" ? text("languageEnglish") : text("languageSpanish")}</Text>
    </Pressable>)}
  </View>;
}

function HomeScreen() {
  const navigation = useNavigation<any>();
  const { progress } = useReading();
  const { language, text } = useLocale();
  const [query, setQuery] = useState("");
  const featured = books[0];
  const filtered = useMemo(() => books.filter((book) => `${book.title} ${bookSubtitle(language, book.id, book.subtitle)} ${book.category} ${categoryName(language, book.category)}`.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es"))), [language, query]);
  const resumeId = Object.keys(progress).find((id) => progress[id] > 0) ?? featured.id;
  const resume = findBook(resumeId) ?? featured;
  const resumeChapter = progress[resume.id] ?? 0;
  return <ScrollView style={s.screen} contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
    <View style={s.topline}><View><Text style={s.brand}>LUMBRE</Text><Text style={s.brandSub}>{text("tagline")}</Text></View><LanguageToggle /></View>
    <View style={s.welcome}><Label style={s.eyebrow}>{text("welcomeEyebrow")}</Label><Text style={s.heading}>{text("welcomeTitle")}</Text><Text style={s.welcomeBody}>{text("welcomeBody")}</Text></View>
    <View style={s.searchBox}><Text style={s.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder={text("searchHome")} placeholderTextColor="#8E9691" style={s.searchInput} returnKeyType="search" accessibilityLabel={text("searchHome")} /></View>
    {query.length > 0 ? <><SectionTitle title={text("resultsTitle")} hint={`${filtered.length} ${text("results")}`} />{filtered.length ? filtered.map((book) => <BookCard key={book.id} book={book} compact onPress={() => navigation.navigate("Detail", { bookId: book.id })} />) : <Text style={s.emptyText}>{text("noResults")}</Text>}</> : <>
      <View style={s.featuredHeader}><SectionTitle title={text("featured")} hint={text("featuredBadge")} /></View>
      <Pressable style={({ pressed }) => [s.hero, pressed && s.pressed]} onPress={() => navigation.navigate("Detail", { bookId: featured.id })} accessibilityRole="button" accessibilityLabel={`${text("discoverBookAccessibility")} ${featured.title}`}>
        <View style={s.heroCopy}><Label style={s.heroEyebrow}>{text("pause")}</Label><Text style={s.heroTitle}>{featured.title}</Text><Text style={s.heroText}>{bookSubtitle(language, featured.id, featured.subtitle)}</Text><View style={s.heroAction}><Text style={s.heroActionText}>{text("discoverBook")}</Text><Text style={s.heroArrow}>↗</Text></View></View>
        <View style={s.heroArt}><Cover book={featured} /></View>
        <View style={s.heroIndex}><Text style={s.heroIndexText}>L / 01</Text></View>
      </Pressable>
      <View style={s.resumePanel}><View style={s.resumeIcon}><Text style={s.resumeGlyph}>↗</Text></View><View style={s.resumeCopy}><Label>{text("continueReading").toLocaleUpperCase(language)}</Label><Text style={s.resumeTitle}>{resume.title}</Text><Text style={s.resumeMeta}>{resume.chapters[resumeChapter]?.title}</Text></View><Pressable onPress={() => navigation.navigate("Reader", { bookId: resume.id, chapterIndex: resumeChapter })} style={s.resumeButton} accessibilityLabel={text("continueReading")}><Text style={s.resumeButtonText}>›</Text></Pressable></View>
      <SectionTitle title={text("library")} hint={`${books.length} ${text("titles")}`} action={() => navigation.navigate("Library")} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.shelf}>{books.map((book) => <BookCard key={book.id} book={book} compact onPress={() => navigation.navigate("Detail", { bookId: book.id })} />)}</ScrollView>
    </>}
    <View style={s.demoNote}><Text style={s.demoNoteText}>{text("demoIssue")}</Text></View>
  </ScrollView>;
}

function SectionTitle({ title, hint, action }: { title: string; hint?: string; action?: () => void }) {
  const { text } = useLocale();
  return <View style={s.sectionTitleRow}><Text style={s.sectionTitle}>{title}</Text>{action ? <Pressable onPress={action}><Text style={s.sectionAction}>{text("seeAll")}</Text></Pressable> : hint ? <Text style={s.sectionHint}>{hint}</Text> : null}</View>;
}

function LibraryScreen() {
  const navigation = useNavigation<any>();
  const { language, text } = useLocale();
  const [query, setQuery] = useState("");
  const filtered = books.filter((book) => `${book.title} ${bookSubtitle(language, book.id, book.subtitle)} ${book.author} ${book.category} ${categoryName(language, book.category)}`.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")));
  return <ScrollView style={s.screen} contentContainerStyle={s.page}>
    <Label style={s.eyebrow}>{text("exploreAtPace")}</Label><Text style={s.pageHeading}>{text("library")}</Text><Text style={s.welcomeBody}>{text("eachBook")}</Text>
    <View style={[s.searchBox, s.librarySearch]}><Text style={s.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder={text("searchLibrary")} placeholderTextColor="#8E9691" style={s.searchInput} accessibilityLabel={text("searchLibrary")} /></View>
    <View style={s.chip}><Text style={s.chipText}>{text("allBooks")}</Text><Text style={s.chipCount}>{filtered.length}</Text></View>
    {filtered.length ? filtered.map((book) => <BookCard key={book.id} book={book} onPress={() => navigation.navigate("Detail", { bookId: book.id })} />) : <Text style={s.emptyText}>{text("noResults")}</Text>}
    <View style={s.demoNote}><Text style={s.demoNoteText}>{text("fictionalNotice")}</Text></View>
  </ScrollView>;
}

function SavedScreen() {
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
  return <ScrollView style={s.screen} contentContainerStyle={s.page}><Label style={s.eyebrow}>{text("yourMarks")}</Label><Text style={s.pageHeading}>{text("saved")}</Text><Text style={s.welcomeBody}>{text("savedBody")}</Text>
    {saved.length ? saved.map(({ book, chapter }) => <Pressable key={`${book.id}:${chapter.id}`} style={s.savedCard} onPress={() => navigation.navigate("Reader", { bookId: book.id, chapterIndex: book.chapters.findIndex((item) => item.id === chapter.id) })} accessibilityRole="button" accessibilityLabel={`${chapter.title}, ${text("fromBook")} ${book.title}`}><View style={[s.savedMark, { backgroundColor: book.cover.background }]}><Text style={[s.savedMarkText, { color: book.cover.accent }]}>✳</Text></View><View style={s.savedCopy}><Text style={s.savedTitle}>{chapter.title}</Text><Text style={s.savedMeta}>{book.title}</Text></View><Text style={s.savedArrow}>›</Text></Pressable>) : <View style={s.emptyCard}><Text style={s.emptyGlyph}>✳</Text><Text style={s.emptyTitle}>{text("collectionStarts")}</Text><Text style={s.emptyText}>{text("saveChapterHint")}</Text><Pressable onPress={() => navigation.navigate("Library")} style={s.outlineButton}><Text style={s.outlineButtonText}>{text("browseLibrary")}</Text></Pressable></View>}
  </ScrollView>;
}

function DetailScreen({ route, navigation }: NativeStackScreenProps<RootStack, "Detail">) {
  const book = findBook(route.params.bookId);
  const { progress } = useReading();
  const { language, text } = useLocale();
  useEffect(() => { navigation.setOptions({ title: text("detailHeader"), headerBackTitle: text("back") }); }, [language, navigation, text]);
  if (!book) return <View style={s.screen}><Text style={s.emptyText}>{text("unavailableBook")}</Text></View>;
  const chapterIndex = progress[book.id] ?? 0;
  return <ScrollView style={s.screen} contentContainerStyle={s.detailPage}>
    <View style={s.detailTop}><Cover book={book} large /><View style={s.detailIntro}><Label style={s.category}>{categoryName(language, book.category)}</Label><Text style={s.detailTitle}>{book.title}</Text><Text style={s.detailSubtitle}>{bookSubtitle(language, book.id, book.subtitle)}</Text><Text style={s.bookMeta}>{text("sampleAuthor")}</Text><View style={s.detailStats}><Text style={s.stat}>{book.chapters.length} {text("chapterCount")}</Text><Text style={s.statDot}>·</Text><Text style={s.stat}>{book.readingMinutes} {text("minutes")}</Text></View></View></View>
    <Text style={s.detailDescription}>{bookDescription(language, book.id, book.description)}</Text><View style={s.sampleBanner}><Text style={s.sampleBannerText}>{text(book.testOnly ? "testOnly" : "demoContent")}</Text></View><Text style={s.contentLanguageNote}>{text(book.testOnly ? "developmentTextNote" : "contentLanguageNote")}</Text>
    <Pressable style={s.primaryButton} onPress={() => navigation.navigate("Reader", { bookId: book.id, chapterIndex })}><Text style={s.primaryButtonText}>{chapterIndex > 0 ? text("continueReading") : text("startReading")}</Text><Text style={s.primaryButtonText}>→</Text></Pressable>
    <SectionTitle title={text("inThisBook")} hint={`${book.chapters.length} ${text("chapterCount")}`} />
    {book.chapters.map((chapter, index) => <Pressable key={chapter.id} style={s.chapterRow} onPress={() => navigation.navigate("Reader", { bookId: book.id, chapterIndex: index })}><Text style={s.chapterNumber}>{String(index + 1).padStart(2, "0")}</Text><Text style={s.chapterTitle}>{chapter.title}</Text><Text style={s.chapterArrow}>↗</Text></Pressable>)}
  </ScrollView>;
}

function ReaderScreen({ route, navigation }: NativeStackScreenProps<RootStack, "Reader">) {
  useFonts({ AmiriBismillah: require("@expo-google-fonts/amiri/400Regular/Amiri_400Regular.ttf") });
  const book = findBook(route.params.bookId);
  const { progress, ready, setProgress, toggleBookmark, isBookmarked } = useReading();
  const { language, text } = useLocale();
  const [fontSize, setFontSize] = useState(19);
  const [index, setIndex] = useState(() => Math.min(route.params.chapterIndex ?? progress[route.params.bookId] ?? 0, (book?.chapters.length ?? 1) - 1));
  const [resolved, setResolved] = useState(false);
  const chapter = book?.chapters[index];
  useEffect(() => { navigation.setOptions({ title: text("readingHeader"), headerBackTitle: text("back") }); }, [language, navigation, text]);
  useEffect(() => {
    if (!ready || resolved || !book) return;
    setIndex(Math.min(route.params.chapterIndex ?? progress[book.id] ?? 0, book.chapters.length - 1));
    setResolved(true);
  }, [book, progress, ready, resolved, route.params.chapterIndex]);
  useEffect(() => { if (ready && resolved && book) setProgress(book.id, index); }, [book, index, ready, resolved, setProgress]);
  if (!book || !chapter) return <View style={s.screen}><Text style={s.emptyText}>{text("unavailableChapter")}</Text></View>;
  if (!ready || !resolved) return <View style={s.readerScreen}><Text style={s.emptyText}>{text("preparing")}</Text></View>;
  const bookmarked = isBookmarked(book.id, chapter.id);
  const preservesSourcePlacement = Boolean(chapter.inlineTitle);
  const move = (next: number) => {
    if (next < 0 || next >= book.chapters.length) return;
    setIndex(next);
    setProgress(book.id, next);
  };
  return <View style={s.readerScreen}>
    <View style={s.readerTop}><View><Text style={s.readerBook}>{book.title.toLocaleUpperCase("es")}</Text><Text style={s.readerChapter}>{chapter.sourcePageNumber ? `${text("pdfPage")} ${chapter.sourcePageNumber}` : `${text("chapter")} ${String(index + 1).padStart(2, "0")}`} · {book.chapters.length}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={bookmarked ? text("removeBookmark") : text("addBookmark")} onPress={() => toggleBookmark(book.id, chapter.id)} style={[s.bookmarkButton, bookmarked && s.bookmarkActive]}><Text style={[s.bookmarkGlyph, bookmarked && s.bookmarkGlyphActive]}>{bookmarked ? "✳" : "＋"}</Text></Pressable></View>
    <ScrollView key={chapter.id} style={s.readingScroll} contentContainerStyle={[s.readingPage, preservesSourcePlacement && s.sourcePlacementPage]}>
      {!preservesSourcePlacement && <><View style={s.readingOrnament}><Text style={s.ornamentText}>✳</Text></View><Text style={s.readerTitle}>{chapter.title}</Text><View style={s.titleRule} /></>}
      {chapter.text.split("\n\n").map((paragraph, i) => <React.Fragment key={i}>
        <ArabicRichText text={paragraph} translationLabel={text("spanishTranslation")} style={[s.paragraph, { fontSize, lineHeight: Math.round(fontSize * 1.72) }]} />
        {chapter.inlineTitle?.afterParagraph === i && <Text style={s.inlineLemalarTitle}>{chapter.inlineTitle.value}</Text>}
      </React.Fragment>)}
      <View style={s.endMark}><View style={s.endLine} /><Text style={s.endGlyph}>✳</Text><View style={s.endLine} /></View>
    </ScrollView>
    <View style={s.readerControls}><Pressable accessibilityLabel={text("previousChapter")} onPress={() => move(index - 1)} disabled={index === 0} style={s.pageButton}><Text style={[s.pageButtonText, index === 0 && s.disabled]}>←</Text></Pressable><View style={s.fontControls}><Pressable accessibilityLabel={text("decreaseText")} onPress={() => setFontSize((size) => Math.max(16, size - 1))} style={s.fontButton}><Text style={s.fontSmall}>A−</Text></Pressable><Text style={s.controlDivider}>│</Text><Pressable accessibilityLabel={text("increaseText")} onPress={() => setFontSize((size) => Math.min(26, size + 1))} style={s.fontButton}><Text style={s.fontLarge}>A+</Text></Pressable></View><Pressable accessibilityLabel={text("nextChapter")} onPress={() => move(index + 1)} disabled={index === book.chapters.length - 1} style={s.pageButton}><Text style={[s.pageButtonText, index === book.chapters.length - 1 && s.disabled]}>→</Text></Pressable></View>
    <View style={s.progressRail}><View style={[s.progressRailFill, { width: `${Math.round(((index + 1) / book.chapters.length) * 100)}%` }]} /></View>
  </View>;
}

function TabsRoot() {
  const { text } = useLocale();
  return <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: C.teal, tabBarInactiveTintColor: "#89918D", tabBarStyle: s.tabBar, tabBarLabelStyle: s.tabLabel, tabBarHideOnKeyboard: true }}>
    <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: text("homeTab"), tabBarIcon: ({ color }) => <Text style={[s.tabGlyph, { color }]}>⌂</Text> }} />
    <Tab.Screen name="Library" component={LibraryScreen} options={{ tabBarLabel: text("libraryTab"), tabBarIcon: ({ color }) => <Text style={[s.tabGlyph, { color }]}>▤</Text> }} />
    <Tab.Screen name="Saved" component={SavedScreen} options={{ tabBarLabel: text("saved"), tabBarIcon: ({ color }) => <Text style={[s.tabGlyph, { color }]}>✳</Text> }} />
  </Tab.Navigator>;
}

export default function App() {
  return <SafeAreaProvider><LanguageProvider><ReadingProvider><NavigationContainer><ExpoStatusBar style="dark" /><Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: C.paper }, headerTintColor: C.ink, headerShadowVisible: false, headerTitleStyle: { fontSize: 14, fontWeight: "700" }, contentStyle: { backgroundColor: C.paper } }}>
    <Stack.Screen name="Tabs" component={TabsRoot} options={{ headerShown: false }} />
    <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "Book details", headerBackTitle: "Back" }} />
    <Stack.Screen name="Reader" component={ReaderScreen} options={{ title: "Reading", headerBackTitle: "Back" }} />
  </Stack.Navigator></NavigationContainer></ReadingProvider></LanguageProvider></SafeAreaProvider>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.paper }, page: { paddingHorizontal: 22, paddingTop: 19, paddingBottom: 38 },
  topline: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }, brand: { color: C.teal, fontSize: 16, fontWeight: "900", letterSpacing: 3.2 }, brandSub: { color: C.muted, fontSize: 8, letterSpacing: 1.5, marginTop: 4 }, languageToggle: { flexDirection: "row", alignItems: "center", borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, padding: 3 }, languageOption: { paddingVertical: 7, paddingHorizontal: 10, borderRadius: 16 }, languageOptionActive: { backgroundColor: C.teal }, languageOptionText: { color: C.muted, fontSize: 10, fontWeight: "700" }, languageOptionTextActive: { color: "#FFFFFF" }, languageNote: { backgroundColor: C.mint, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 17 }, languageNoteText: { color: C.teal, fontSize: 10, lineHeight: 14 }, contentLanguageNote: { color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 9 },
  label: { color: C.muted, fontSize: 9, fontWeight: "700", letterSpacing: 1.3 }, eyebrow: { color: C.teal, marginBottom: 12 }, welcome: { marginBottom: 21 }, heading: { color: C.ink, fontFamily: "Georgia", fontSize: 35, lineHeight: 41, letterSpacing: -1.1 }, welcomeBody: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  searchBox: { minHeight: 48, flexDirection: "row", alignItems: "center", backgroundColor: C.card, borderColor: C.line, borderWidth: 1, paddingHorizontal: 13, borderRadius: 12, marginBottom: 29 }, searchIcon: { fontSize: 24, color: C.muted, width: 30 }, searchInput: { flex: 1, color: C.ink, fontSize: 13, paddingVertical: 10 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4, marginBottom: 13 }, sectionTitle: { fontFamily: "Georgia", fontSize: 21, color: C.ink }, sectionHint: { color: C.muted, fontSize: 9, letterSpacing: 1.2, fontWeight: "700" }, sectionAction: { color: C.teal, fontSize: 12, fontWeight: "600" }, featuredHeader: { marginBottom: 0 },
  hero: { minHeight: 204, borderRadius: 18, backgroundColor: "#E2EAE4", padding: 20, paddingRight: 14, flexDirection: "row", overflow: "hidden", position: "relative", marginBottom: 18 }, heroCopy: { flex: 1, justifyContent: "center", zIndex: 1 }, heroEyebrow: { color: C.teal, fontSize: 8, letterSpacing: 1.4 }, heroTitle: { fontFamily: "Georgia", color: C.ink, fontSize: 27, lineHeight: 29, marginTop: 9 }, heroText: { color: "#52635E", fontSize: 10, marginTop: 8 }, heroAction: { flexDirection: "row", alignItems: "center", marginTop: 17, gap: 9 }, heroActionText: { color: C.teal, fontWeight: "700", fontSize: 10 }, heroArrow: { color: C.teal, fontSize: 14 }, heroArt: { width: 112, height: 165, transform: [{ rotate: "4deg" }], marginTop: 2, marginRight: 2, shadowColor: "#102628", shadowOpacity: 0.22, shadowRadius: 9, shadowOffset: { width: 3, height: 6 }, elevation: 4 }, heroIndex: { position: "absolute", right: 18, bottom: 12 }, heroIndexText: { color: "#6F8079", fontSize: 8, letterSpacing: 1 },
  cover: { flex: 1, minHeight: 124, borderRadius: 3, padding: 10, overflow: "hidden", justifyContent: "space-between", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 2, height: 3 }, elevation: 2 }, coverLarge: { width: 143, height: 207, flex: 0, padding: 15 }, coverInset: { position: "absolute", top: 7, left: 7, right: 7, bottom: 7, borderWidth: 0.7, borderRadius: 1 }, coverBrand: { fontSize: 6, fontWeight: "800", letterSpacing: 1.8 }, coverTitleWrap: { marginTop: "auto", marginBottom: "auto" }, coverTitle: { color: "#F7F4EB", fontFamily: "Georgia", fontSize: 15, lineHeight: 17 }, coverTitleLarge: { fontSize: 21, lineHeight: 24 }, coverRule: { width: 25, height: 1, marginTop: 7, marginBottom: 6 }, coverSubtitle: { fontSize: 7, lineHeight: 10 }, coverMark: { position: "absolute", right: 10, top: 25, fontFamily: "Georgia", fontSize: 24, opacity: 0.25 }, coverFooter: { fontSize: 5, letterSpacing: 1.1 },
  resumePanel: { minHeight: 82, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, marginBottom: 29, padding: 12, flexDirection: "row", alignItems: "center" }, resumeIcon: { width: 45, height: 54, backgroundColor: C.mint, borderRadius: 7, alignItems: "center", justifyContent: "center" }, resumeGlyph: { color: C.teal, fontSize: 20 }, resumeCopy: { flex: 1, paddingHorizontal: 12 }, resumeTitle: { color: C.ink, fontSize: 14, fontWeight: "700", marginTop: 4 }, resumeMeta: { color: C.muted, fontSize: 10, marginTop: 3 }, resumeButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.teal, alignItems: "center", justifyContent: "center" }, resumeButtonText: { color: "white", fontSize: 23, lineHeight: 25 }, shelf: { gap: 12, paddingBottom: 10 },
  bookCard: { minHeight: 143, flexDirection: "row", alignItems: "center", gap: 17, backgroundColor: C.card, borderColor: C.line, borderWidth: 1, borderRadius: 14, padding: 11, marginBottom: 12 }, compactCard: { width: 234, minHeight: 122, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: C.card, borderColor: C.line, borderWidth: 1, borderRadius: 13, padding: 9 }, bookInfo: { flex: 1, gap: 5 }, category: { color: C.teal, fontSize: 8, letterSpacing: 1.1 }, bookTitle: { color: C.ink, fontFamily: "Georgia", fontSize: 17, lineHeight: 21 }, bookMeta: { color: C.muted, fontSize: 10 }, progressTrack: { height: 3, backgroundColor: C.line, marginTop: 5, borderRadius: 2 }, progressFill: { height: 3, backgroundColor: C.teal, borderRadius: 2 }, pressed: { opacity: 0.83, transform: [{ scale: 0.99 }] }, demoNote: { borderTopWidth: 1, borderColor: C.line, marginTop: 22, paddingTop: 12, alignItems: "center" }, demoNoteText: { color: "#868F89", fontSize: 7, letterSpacing: 1.1, textAlign: "center" }, emptyText: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  pageHeading: { color: C.ink, fontFamily: "Georgia", fontSize: 34 }, librarySearch: { marginTop: 20, marginBottom: 20 }, chip: { flexDirection: "row", gap: 9, alignItems: "center", alignSelf: "flex-start", backgroundColor: C.mint, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 11, marginBottom: 13 }, chipText: { color: C.teal, fontSize: 8, fontWeight: "800", letterSpacing: 0.9 }, chipCount: { color: C.teal, fontSize: 9, fontWeight: "700" }, emptyCard: { backgroundColor: C.card, borderRadius: 17, padding: 24, alignItems: "center", marginTop: 22, borderWidth: 1, borderColor: C.line }, emptyGlyph: { color: C.gold, fontSize: 26, marginBottom: 10 }, emptyTitle: { color: C.ink, fontFamily: "Georgia", fontSize: 19 }, outlineButton: { borderColor: C.teal, borderWidth: 1, borderRadius: 22, paddingVertical: 11, paddingHorizontal: 17, marginTop: 20 }, outlineButtonText: { color: C.teal, fontSize: 11, fontWeight: "700" },
  savedCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.card, borderRadius: 13, borderWidth: 1, borderColor: C.line, padding: 13, marginTop: 10 }, savedMark: { height: 45, width: 45, borderRadius: 9, alignItems: "center", justifyContent: "center" }, savedMarkText: { fontSize: 22 }, savedCopy: { flex: 1, paddingHorizontal: 12 }, savedTitle: { color: C.ink, fontFamily: "Georgia", fontSize: 16 }, savedMeta: { color: C.muted, fontSize: 10, marginTop: 4 }, savedArrow: { color: C.teal, fontSize: 24 },
  detailPage: { padding: 22, paddingBottom: 40 }, detailTop: { flexDirection: "row", alignItems: "center", gap: 19, marginTop: 4 }, detailIntro: { flex: 1 }, detailTitle: { fontFamily: "Georgia", fontSize: 28, lineHeight: 31, color: C.ink, marginTop: 7 }, detailSubtitle: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 6, marginBottom: 10 }, detailStats: { flexDirection: "row", gap: 8, marginTop: 12, alignItems: "center" }, stat: { color: C.teal, fontSize: 10, fontWeight: "600" }, statDot: { color: C.gold }, detailDescription: { color: "#4F5A55", fontSize: 13, lineHeight: 21, marginTop: 24 }, sampleBanner: { backgroundColor: C.warm, padding: 11, borderRadius: 8, marginTop: 16 }, sampleBannerText: { color: "#7A6339", fontSize: 8, lineHeight: 13, letterSpacing: 0.6, fontWeight: "700", textAlign: "center" }, primaryButton: { backgroundColor: C.teal, borderRadius: 11, minHeight: 50, marginVertical: 23, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, primaryButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" }, chapterRow: { minHeight: 54, flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: C.line }, chapterNumber: { width: 38, color: C.gold, fontFamily: "Georgia", fontSize: 14 }, chapterTitle: { flex: 1, color: C.ink, fontFamily: "Georgia", fontSize: 15 }, chapterArrow: { color: C.teal, fontSize: 16 },
  readerScreen: { flex: 1, backgroundColor: "#F7F6F0" }, readerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 23, paddingTop: 15, paddingBottom: 13, borderBottomWidth: 1, borderColor: C.line }, readerBook: { color: C.teal, fontSize: 9, fontWeight: "800", letterSpacing: 1.4 }, readerChapter: { color: C.muted, fontSize: 8, letterSpacing: 0.8, marginTop: 5 }, bookmarkButton: { width: 39, height: 39, borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, alignItems: "center", justifyContent: "center" }, bookmarkActive: { backgroundColor: C.mint, borderColor: C.mint }, bookmarkGlyph: { fontSize: 18, color: C.teal }, bookmarkGlyphActive: { color: C.teal }, readingScroll: { flex: 1 }, readingPage: { paddingHorizontal: 29, paddingTop: 42, paddingBottom: 48 }, sourcePlacementPage: { paddingTop: 94 }, readingOrnament: { alignItems: "center", marginBottom: 17 }, ornamentText: { color: C.gold, fontSize: 16 }, readerTitle: { color: C.ink, fontFamily: "Georgia", fontSize: 30, lineHeight: 37, textAlign: "center", marginBottom: 19 }, lemalarTitle: { fontFamily: "LemalarTitle", fontSize: 49, lineHeight: 57, letterSpacing: 0, marginBottom: 23 }, lemalarTitleFont: { fontFamily: "LemalarTitle" }, inlineLemalarTitle: { color: C.ink, fontFamily: "Georgia", fontSize: 49, lineHeight: 57, letterSpacing: 0, textAlign: "center", marginTop: 57, marginBottom: 35 }, titleRule: { height: 1, width: 38, backgroundColor: C.gold, alignSelf: "center", marginBottom: 23 }, paragraph: { color: "#34413C", fontFamily: "Georgia", marginBottom: 18, letterSpacing: 0.08, textAlign: "center" }, endMark: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 13, marginTop: 16 }, endLine: { width: 35, height: 1, backgroundColor: "#D7D8CE" }, endGlyph: { color: C.gold, fontSize: 13 }, readerControls: { minHeight: 61, backgroundColor: C.card, borderTopWidth: 1, borderColor: C.line, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }, pageButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center" }, pageButtonText: { color: C.teal, fontSize: 22 }, disabled: { color: "#C3C9C3" }, fontControls: { flexDirection: "row", alignItems: "center", backgroundColor: C.paper, borderRadius: 18, paddingHorizontal: 11, height: 34 }, fontButton: { paddingHorizontal: 7 }, fontSmall: { color: C.ink, fontSize: 12 }, fontLarge: { color: C.ink, fontSize: 16 }, controlDivider: { color: C.line, fontSize: 12 }, progressRail: { height: 3, backgroundColor: "#DFE4DD" }, progressRailFill: { height: 3, backgroundColor: C.teal },
  pdfScreen: { flex: 1, backgroundColor: "#F2F2EC" }, pdfToolbar: { minHeight: 60, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: C.card, borderBottomWidth: 1, borderColor: C.line }, pdfPageInfo: { flex: 1 }, pdfDocument: { flex: 1, backgroundColor: "#E6E7E2" }, pdfControls: { minHeight: 58, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: C.card, borderTopWidth: 1, borderColor: C.line }, pdfPageLabel: { color: C.ink, fontSize: 12, fontWeight: "600" }, pdfError: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  tabBar: { backgroundColor: "#FCFCF8", borderTopColor: C.line, height: 62, paddingTop: 6, paddingBottom: 5 }, tabLabel: { fontSize: 9, fontWeight: "600" }, tabGlyph: { fontSize: 20, lineHeight: 23 },
});
