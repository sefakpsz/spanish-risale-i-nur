export type Chapter = {
  id: string;
  title: string;
  text: string;
  sourcePageNumber?: string;
  /** A heading whose source position is within the page content. */
  inlineTitle?: { value: string; afterParagraph: number };
};

export type Book = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  description: string;
  readingMinutes: number;
  cover: { background: string; accent: string; mark: string };
  chapters: Chapter[];
  kind?: "chapters" | "pdf";
  pageCount?: number;
  testOnly?: boolean;
};

// These original Spanish passages are demonstration content, not published editions.
const demoBooks: Book[] = [
  {
    id: "cuaderno-de-luz",
    title: "Cuaderno de luz",
    subtitle: "Apuntes para mirar despacio",
    author: "Demo content",
    category: "Contemplation",
    description: "Una lectura breve de muestra sobre la atención, la gratitud y la vida cotidiana.",
    readingMinutes: 12,
    cover: { background: "#143D43", accent: "#D4B775", mark: "L" },
    chapters: [
      { id: "atencion", title: "El arte de atender", text: "La mañana no exige respuestas. Basta abrir la ventana y dejar que el día llegue con su propio ritmo. En esa pausa sencilla, la mirada aprende a distinguir lo importante de lo urgente.\n\nAtender es ofrecer un lugar. A veces ese lugar es una mesa compartida; otras, unos minutos de silencio antes de empezar. Lo pequeño no necesita anunciarse para transformar una jornada." },
      { id: "gratitud", title: "Una gratitud serena", text: "La gratitud no borra las preguntas difíciles. Les hace sitio junto a las cosas que todavía sostienen: una voz querida, el agua fresca, el camino que conocemos de memoria.\n\nCuando nombramos lo recibido, el mundo recupera sus contornos. No se vuelve perfecto; se vuelve visible." },
      { id: "camino", title: "El camino de hoy", text: "No hace falta conocer el mapa entero para dar el siguiente paso. El camino se aclara mientras lo recorremos, y cada gesto cuidadoso deja una señal para quien venga después.\n\nAvanzar con calma también es avanzar." },
    ],
  },
  {
    id: "jardin-interior",
    title: "Jardín interior",
    subtitle: "Pequeñas meditaciones diarias",
    author: "Demo content",
    category: "Everyday life",
    description: "Textos originales de muestra para presentar la biblioteca y la experiencia de lectura.",
    readingMinutes: 9,
    cover: { background: "#35423A", accent: "#D7A56D", mark: "J" },
    chapters: [
      { id: "semillas", title: "Semillas de paciencia", text: "Hay procesos que solo se reconocen después. Una semilla trabaja en silencio mucho antes de que aparezca la primera hoja. También nosotros cambiamos a menudo sin poder medirlo todavía.\n\nLa paciencia no es quedarse inmóvil. Es cuidar lo que crece sin arrancarlo para comprobarlo." },
      { id: "mesa", title: "La mesa compartida", text: "Alrededor de una mesa, las diferencias pueden descansar un momento. Se pasan el pan, se escucha una historia y el tiempo deja de ser una carrera.\n\nCompartir no siempre resuelve. A veces, acompañar con atención ya es una forma completa de estar." },
    ],
  },
  {
    id: "cuentos-de-la-brisa",
    title: "Cuentos de la brisa",
    subtitle: "Relatos breves para descansar",
    author: "Demo content",
    category: "Stories",
    description: "Una tercera obra ficticia de muestra: relatos breves escritos para este prototipo.",
    readingMinutes: 7,
    cover: { background: "#41405B", accent: "#D0B7DC", mark: "B" },
    chapters: [
      { id: "ventana", title: "La ventana azul", text: "Cada tarde, Inés abría la ventana azul para escuchar el barrio. Nunca encontraba el mismo sonido: una bicicleta, una canción lejana, el saludo de alguien que regresaba a casa.\n\nUn día comprendió que aquella ventana no daba a la calle. Daba al momento." },
      { id: "farol", title: "El farol encendido", text: "El farol del camino no iluminaba el bosque entero. Solo mostraba los próximos pasos, y eso bastaba para que los viajeros siguieran adelante.\n\nAl amanecer, nadie recordaba su brillo. Pero todos habían llegado." },
    ],
  },
];

export const books: Book[] = demoBooks;
export const findBook = (id: string) => books.find((book) => book.id === id);
