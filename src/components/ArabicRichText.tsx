import React, { useMemo, useState } from "react";
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { normalizeArabic, translationForArabic } from "../data/arabicTranslations";

const ARABIC_CHARACTERS = "\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF";
// Spaces belong inside a sentence; line breaks do not. Keeping a line as a
// separate tap target lets its translation appear immediately beneath it.
const ARABIC_RUN = new RegExp(`[${ARABIC_CHARACTERS}][${ARABIC_CHARACTERS}\\u064B-\\u065F\\u0670\\u06D6-\\u06ED \\t،؛؟«»()\\[\\]{}.,:;!?\\-]*`, "gu");

type Piece = { text: string; arabic: boolean };
const bismillah = normalizeArabic("بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ");

function splitText(source: string): Piece[] {
  const pieces: Piece[] = [];
  let cursor = 0;
  for (const match of source.matchAll(ARABIC_RUN)) {
    const start = match.index ?? 0;
    const value = match[0];
    if (start > cursor) pieces.push({ text: source.slice(cursor, start), arabic: false });
    pieces.push({ text: value.trimEnd(), arabic: true });
    cursor = start + value.length;
  }
  if (cursor < source.length) pieces.push({ text: source.slice(cursor), arabic: false });
  return pieces.length ? pieces : [{ text: source, arabic: false }];
}

export function ArabicRichText({ text, style, containerStyle, translationLabel = "Traducción al español" }: { text: string; style?: StyleProp<TextStyle>; containerStyle?: StyleProp<ViewStyle>; translationLabel?: string }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const pieces = useMemo(() => splitText(text), [text]);
  const selected = selectedIndex === null ? null : pieces[selectedIndex];
  const translation = selected?.arabic ? translationForArabic(selected.text) : null;

  return <View style={[styles.container, containerStyle]}>
    {pieces.map((piece, index) => piece.arabic
      ? <View key={`${index}-${piece.text}`} style={styles.arabicBlock}>
          <Pressable accessibilityRole="button" accessibilityLabel={translationLabel} accessibilityState={{ expanded: selectedIndex === index }} onPress={() => setSelectedIndex(selectedIndex === index ? null : index)} hitSlop={8} style={({ pressed }) => [styles.arabicButton, pressed && styles.arabicPressed]}>
            <Text style={[style, styles.segment, styles.arabic, normalizeArabic(piece.text) === bismillah && styles.bismillah, selectedIndex === index && styles.arabicSelected]}>{piece.text}</Text>
          </Pressable>
          {selectedIndex === index && translation && <View style={styles.bubbleFrame}>
            <View style={styles.bubble}>
              <View style={styles.bubbleMarker}><Text style={styles.bubbleMarkerText}>◆</Text></View>
              <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={() => setSelectedIndex(null)} hitSlop={8} style={styles.closeButton}><Text style={styles.closeText}>×</Text></Pressable>
              <View style={styles.bubbleRule}><Text style={styles.bubbleRuleMark}>◆</Text></View>
              <Text style={styles.bubbleText}>{translation.spanish}</Text>
            </View>
          </View>}
        </View>
      : <Text key={`${index}-${piece.text}`} selectable style={[style, styles.segment]}>{piece.text}</Text>)}
  </View>;
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", marginBottom: 18 },
  segment: { marginBottom: 0 },
  arabicBlock: { width: "100%", alignItems: "center" },
  arabicButton: { alignSelf: "center" },
  arabicPressed: { opacity: 0.72 },
  arabic: { color: "#E1261C", fontSize: 25, lineHeight: 42 },
  // The source uses a separate Bismillah calligraphy image. Keep it visually
  // distinct from the wine-red Arabic quotations while preserving its
  // selectable text and translation behavior.
  bismillah: { color: "#17120D", fontFamily: "AmiriBismillah", fontSize: 50, lineHeight: 70, letterSpacing: 0.15, marginTop: 7, marginBottom: 26 },
  arabicSelected: { opacity: 0.76 },
  bubbleFrame: { width: "94%", backgroundColor: "#FCFCF8", borderColor: "#C6A76B", borderWidth: 2, borderRadius: 22, padding: 5, marginTop: 11, marginBottom: 12 },
  bubble: { minHeight: 92, borderColor: "#C6A76B", borderWidth: 1, borderRadius: 16, paddingHorizontal: 29, paddingVertical: 25, justifyContent: "center" },
  bubbleMarker: { position: "absolute", top: -15, left: "50%", transform: [{ translateX: -11 }], backgroundColor: "#FCFCF8", width: 22, height: 22, alignItems: "center", justifyContent: "center" },
  bubbleMarkerText: { color: "#C6A76B", fontSize: 18, lineHeight: 22 },
  closeButton: { position: "absolute", top: 9, right: 12, width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  closeText: { color: "#81745D", fontSize: 30, lineHeight: 30, fontWeight: "300" },
  bubbleRule: { height: 1, backgroundColor: "#C6A76B", width: "100%", marginBottom: 18, alignItems: "center", justifyContent: "center" },
  bubbleRuleMark: { color: "#C6A76B", backgroundColor: "#FCFCF8", fontSize: 11, paddingHorizontal: 8, lineHeight: 14 },
  bubbleText: { color: "#2B2A24", fontFamily: "Georgia", fontSize: 19, lineHeight: 28, textAlign: "center" },
});
