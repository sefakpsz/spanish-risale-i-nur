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
    .replace(/﷽/g, "بسم الله الرحمن الرحيم")
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[\u0640]/g, "")
    .replace(/[،؛؟.,:;!?…]/g, "")
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
add("شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ هُدًى لِلنَّاسِ وَبَيِّنَاتٍ مِنَ الْهُدَىٰ وَالْفُرْقَانِ", "ramadan-2-185", "El mes de Ramadán es aquel en el que fue revelado el Corán como guía para la gente, con pruebas claras de la guía y del criterio.");
add("كُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا", "moderation-7-31", "Comed y bebed, pero no derrochéis.");
add("وَإِنْ مِنْ شَيْءٍ إِلَّا يُسَبِّحُ بِحَمْدِهِ", "praise-17-44", "No hay nada que no proclame Su gloria con alabanzas.");
add("مِنْ حَيْثُ لَا يَحْتَسِبُ", "unexpected-provision-65-3", "De donde no lo espera.");
add("شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ", "ramadan-2-185-opening", "El mes de Ramadán en el que fue revelado el Corán.");
add("أَنْتَ رَبِّيَ الرَّحِيمُ وَأَنَا عَبْدُكَ الْعَاجِزُ", "humble-servant", "Tú eres mi Señor misericordioso y yo soy Tu siervo impotente.");
add("اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلَاةً تَكُونُ لَكَ رِضَاءً وَلِحَقِّهِ أَدَاءً بِعَدَدِ ثَوَابِ قِرَاءَةِ حُرُوفِ الْقُرْآنِ فِي شَهْرِ رَمَضَانَ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ", "ramadan-blessing", "Oh Allah, bendice y concede paz a nuestro señor Muhammad con una bendición que Te complazca y cumpla su derecho, tantas veces como recompensas por recitar las letras del Corán durante Ramadán; y bendice a su familia y compañeros.");
add("سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ وَسَلَامٌ عَلَى الْمُرْسَلِينَ وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ آمِينَ", "closing-praise", "Gloria a tu Señor, Señor del poder, por encima de cuanto Le atribuyen. Paz a los mensajeros y alabado sea Allah, Señor de los mundos. Amén.");
add("قُمْ بِإِذْنِ اللَّهِ", "rise-with-permission", "Levántate con el permiso de Allah.");
add("لَا يَعُولُ مَنِ اقْتَصَدَ", "moderation-hadith", "Quien es moderado no caerá en la indigencia.");
add("إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ", "provider-51-58", "Allah es el Proveedor, dueño de una fuerza firme.");
add("وَمَا مِنْ دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا", "provision-11-6", "No hay criatura en la tierra cuyo sustento no corresponda a Allah.");
add("إِنَّ الضَّرُورَةَ تُقَدَّرُ بِقَدْرِهَا", "necessity-rule", "La necesidad se mide según su justa medida.");
add("لَا إِسْرَافَ فِي الْخَيْرِ كَمَا لَا خَيْرَ فِي الْإِسْرَافِ", "no-excess", "No hay derroche en el bien, como no hay bien en el derroche.");
add("الْحَرِيصُ خَائِبٌ خَاسِرٌ", "greed-proverb", "El codicioso queda frustrado y pierde.");
add("عَزَّ مَنْ قَنِعَ ذَلَّ مَنْ طَمِعَ", "contentment-hadith", "Se ennoblece quien se contenta y se humilla quien codicia.");
add("جَمَعْتُ الطِّبَّ فِي الْبَيْتَيْنِ جَمْعًا وَحُسْنُ الْقَوْلِ فِي قِصَرِ الْكَلَامِ فَقَلِّلْ إِنْ أَكَلْتَ وَبَعْدَ أَكْلٍ تَجَنَّبْ وَالشِّفَاءُ فِي الِانْهِضَامِ وَلَيْسَ عَلَى النُّفُوسِ أَشَدُّ حَالًا مِنْ إِدْخَالِ الطَّعَامِ عَلَى الطَّعَامِ", "ibn-sina-verses", "La medicina se resume en pocas palabras: come poco y deja tiempo entre comidas; la curación está en la digestión. Nada perjudica más que comer una comida tras otra.");
add("سُبْحَانَكَ لَا عِلْمَ لَنَا إِلَّا مَا عَلَّمْتَنَا إِنَّكَ أَنْتَ الْعَلِيمُ الْحَكِيمُ", "knowledge-2-32", "Gloria a Ti. No sabemos sino lo que Tú nos has enseñado. Tú eres el Omnisciente, el Sabio.");
add("أَفَلَا يَشْكُرُونَ", "will-they-not-give-thanks", "¿Acaso no darán gracias?");
add("وَسَنَجْزِي الشَّاكِرِينَ", "reward-grateful", "Y recompensaremos a quienes dan gracias.");
add("لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ", "increase-grateful", "Si sois agradecidos, os daré más.");
add("بَلِ اللَّهَ فَاعْبُدْ وَكُنْ مِنَ الشَّاكِرِينَ", "worship-and-thank", "Adora a Allah y sé de los agradecidos.");
add("فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ", "rahman-refrain", "¿Cuál de los favores de vuestro Señor negaréis?");
add("اللَّهُمَّ اجْعَلْنَا مِنَ الشَّاكِرِينَ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ", "grateful-prayer", "Oh Allah, haznos de los agradecidos por Tu misericordia, oh Tú, el Más Misericordioso.");
add("بِاسْمِهِ سُبْحَانَهُ", "in-his-name", "En Su nombre, glorificado sea Él.");
add("وَهَلُمَّ جَرًّا", "and-so-on", "Y así sucesivamente.");
add("أَيْنَمَا تُوَلُّوا فَثَمَّ وَجْهُ اللَّهِ", "wherever-you-turn-2-115", "Adondequiera que os volváis, allí está el rostro de Allah.");
add("وَسَخَّرَ لَكُمُ الشَّمْسَ وَالْقَمَرَ وَسَخَّرَ لَكُمْ مَا فِي الْبَرِّ وَالْبَحْرِ", "creation-made-serviceable", "Puso a vuestro servicio el sol y la luna, y lo que hay en la tierra y en el mar.");
add("الْحَمْدُ لِلَّهِ", "alhamdulillah", "Alabado sea Allah.");
add("الْحَمْدُ مِنَ اللَّهِ بِاللَّهِ عَلَى اللَّهِ لِلَّهِ", "praise-from-allah", "La alabanza procede de Allah, es por Allah, recae sobre Allah y pertenece a Allah.");
add("وَلَهُ الْحَمْدُ", "to-him-praise", "Y a Él pertenece la alabanza.");

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
