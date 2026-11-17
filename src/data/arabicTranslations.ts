/**
 * Editorial translation memory for Arabic passages in book text.
 *
 * Keys are normalized so spacing and Arabic vowel marks from PDF extraction do
 * not create duplicate entries. Add reviewed Spanish translations here when a
 * new Arabic passage is approved for a book.
 */
export type ArabicTranslation = { id: string; spanish: string };

export function normalizeArabic(source: string): string {
  return source
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[\u0640]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

export const arabicTranslations: Record<string, ArabicTranslation> = {};
const reviewedTranslations = arabicTranslations;

function add(source: string, id: string, spanish: string) {
  reviewedTranslations[normalizeArabic(source)] = { id, spanish };
}

add("سُبْحَانَكَ لَا إِلٰهَ إِلَّا أَنْتَ", "tasbih-yunus", "Gloria a Ti; no hay dios sino Tú.");
add("حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ", "hasbuna-allah", "Allah nos basta; Él es el mejor protector.");
add("لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيمِ", "hawqala", "No hay poder ni fuerza sino en Allah, el Altísimo, el Magnífico.");
add("الْحَمْدُ لِلّٰهِ عَلَى كُلِّ حَالٍ", "praise-in-all-states", "Alabado sea Allah en toda situación.");
add("فَنَادَى فِي الظُّلُمَاتِ أَنْ لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", "prayer-of-yunus", "Entonces invocó en las tinieblas: «No hay dios sino Tú. Gloria a Ti; ciertamente fui de los injustos.»");
add("أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ", "prayer-of-ayyub", "Me ha tocado la aflicción, y Tú eres el más misericordioso de los misericordiosos.");
add("فَإِنْ تَوَلَّوْا فَقُلْ حَسْبِيَ اللَّهُ لَا إِلٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", "trust-in-allah", "Si se apartan, di: «Allah me basta; no hay dios sino Él. En Él confío, y Él es el Señor del Trono magnífico.»");
add("يَا بَاقِي أَنْتَ الْبَاقِي", "ya-baqi", "¡Oh, Eterno! Tú eres el que permanece.");
add("رَبِّ زِدْنِي عِلْمًا", "increase-my-knowledge", "¡Señor mío, aumenta mi conocimiento!");
add("لِلَّذِينَ آمَنُوا هُدًى وَشِفَاءٌ", "guidance-and-healing", "Para quienes creen, es guía y curación.");
add("بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ", "bismillah", "En el nombre de Allah, el Compasivo, el Misericordioso.");

const pendingTranslation: ArabicTranslation = {
  id: "pending-editorial-review",
  spanish: "Traducción al español pendiente de revisión editorial.",
};

export function translationForArabic(source: string): ArabicTranslation {
  const normalized = normalizeArabic(source);
  const exact = reviewedTranslations[normalized];
  if (exact) return exact;

  // PDF text extraction can insert spaces between Arabic letters, so recognize
  // the most common devotional phrases after normalization as a fallback.
  if (normalized.includes(normalizeArabic("سبحانك لا إله إلا أنت"))) return reviewedTranslations[normalizeArabic("سُبْحَانَكَ لَا إِلٰهَ إِلَّا أَنْتَ")];
  if (normalized.includes(normalizeArabic("حسبنا الله ونعم الوكيل"))) return reviewedTranslations[normalizeArabic("حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ")];
  if (normalized.includes(normalizeArabic("فنادَى في الظلمات أن لا إله إلا أنت سبحانك إني كنت من الظالمين"))) return reviewedTranslations[normalizeArabic("فَنَادَى فِي الظُّلُمَاتِ أَنْ لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ")];
  if (normalized.includes(normalizeArabic("أني مسني الضر وأنت أرحم الراحمين"))) return reviewedTranslations[normalizeArabic("أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ")];
  if (normalized.includes(normalizeArabic("فإن تولوا فقل حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم"))) return reviewedTranslations[normalizeArabic("فَإِنْ تَوَلَّوْا فَقُلْ حَسْبِيَ اللَّهُ لَا إِلٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ")];
  if (normalized.includes(normalizeArabic("يا باقي أنت الباقي"))) return reviewedTranslations[normalizeArabic("يَا بَاقِي أَنْتَ الْبَاقِي")];
  if (normalized.includes(normalizeArabic("رب زدني علما"))) return reviewedTranslations[normalizeArabic("رَبِّ زِدْنِي عِلْمًا")];
  // The supplied PDF has occasional letter substitutions in its extracted
  // text. These keyword checks keep recognizable sentences translatable until
  // an authorized, clean Spanish edition replaces the fixture.
  if (normalized.includes("الظلمات") && normalized.includes("الظالمين") && normalized.includes("سبحانك")) return reviewedTranslations[normalizeArabic("فَنَادَى فِي الظُّلُمَاتِ أَنْ لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ")];
  if (normalized.includes("مسني") && normalized.includes("الضر") && normalized.includes("أرحم")) return reviewedTranslations[normalizeArabic("أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ")];
  if (normalized.includes("تولوا") && normalized.includes("حسبي") && normalized.includes("العرش")) return reviewedTranslations[normalizeArabic("فَإِنْ تَوَلَّوْا فَقُلْ حَسْبِيَ اللَّهُ لَا إِلٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ")];
  return pendingTranslation;
}
