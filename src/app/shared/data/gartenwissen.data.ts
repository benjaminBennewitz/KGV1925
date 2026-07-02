/* src/app/shared/data/gartenwissen.data.ts */

export type GartenwissenKategorie = 'Saison' | 'Bewässerung' | 'Boden' | 'Pflanzenschutz' | 'Obst & Gemüse' | 'Naturgarten';

export interface GartenwissenBeitrag {
  slug: string;
  kategorie: GartenwissenKategorie;
  icon: string;
  titel: string;
  kurztext: string;
  saison: string;
  aufwand: 'Leicht' | 'Mittel';
  dauer: string;
  merksatz: string;
  schritte: string[];
  hinweise: string[];
  tags: string[];
  bild: string;
  bildAlt: string;
}

export interface GartenwissenMonatscheck {
  titel: string;
  text: string;
  icon: string;
}

export const GARTENWISSEN_KATEGORIEN: Array<GartenwissenKategorie | 'Alle'> = ['Alle', 'Saison', 'Bewässerung', 'Boden', 'Pflanzenschutz', 'Obst & Gemüse', 'Naturgarten'];

export const GARTENWISSEN_BEITRAEGE: GartenwissenBeitrag[] = [
  {
    slug: 'richtig-giessen-im-sommer',
    kategorie: 'Bewässerung',
    icon: 'water_drop',
    titel: 'Richtig gießen an heißen Tagen',
    kurztext: 'Wasser kommt am besten morgens direkt an die Wurzel. So bleiben Pflanzen stabil und Verdunstung wird reduziert.',
    saison: 'Frühjahr bis Spätsommer',
    aufwand: 'Leicht',
    dauer: '10–20 Minuten',
    merksatz: 'Lieber seltener und durchdringend gießen als täglich nur die Oberfläche anfeuchten.',
    schritte: [
      'Morgens gießen, bevor sich Boden und Blätter stark aufheizen.',
      'Wasser langsam direkt an den Wurzelbereich geben.',
      'Nach dem Gießen prüfen, ob die Erde mehrere Zentimeter tief feucht ist.',
      'Kübelpflanzen separat kontrollieren, da sie schneller austrocknen.'
    ],
    hinweise: [
      'Nasse Blätter am Abend begünstigen Pilzkrankheiten.',
      'Eine Mulchschicht hält Feuchtigkeit länger im Boden.',
      'Frisch gesetzte Pflanzen brauchen regelmäßiger Wasser als eingewachsene Bestände.'
    ],
    tags: ['Gießen', 'Sommer', 'Trockenheit'],
    bild: 'assets/img/lavendel-1_aquarell.webp',
    bildAlt: 'Lavendelzweige als ruhiges Gartenmotiv'
  },
  {
    slug: 'mulchen-gegen-trockenstress',
    kategorie: 'Boden',
    icon: 'grass',
    titel: 'Mulchen gegen Trockenstress',
    kurztext: 'Rasenschnitt, Laub oder gehäckselte Pflanzenreste schützen den Boden vor Hitze, Wind und starker Verdunstung.',
    saison: 'Ganzjährig, besonders Sommer',
    aufwand: 'Leicht',
    dauer: '15 Minuten',
    merksatz: 'Ein bedeckter Boden bleibt kühler, lebendiger und trocknet deutlich langsamer aus.',
    schritte: [
      'Unkraut grob entfernen und den Boden leicht lockern.',
      'Mulchmaterial dünn und locker um die Pflanzen verteilen.',
      'Direkten Kontakt zu empfindlichen Stängeln vermeiden.',
      'Die Schicht regelmäßig nachlegen, sobald sie verrottet ist.'
    ],
    hinweise: [
      'Frischer Rasenschnitt wird nur dünn aufgetragen, damit er nicht fault.',
      'Unter Beerensträuchern funktioniert Laub- oder Häckselmulch sehr gut.',
      'Mulch ersetzt keine Bewässerung, verlängert aber die Wirkung.'
    ],
    tags: ['Boden', 'Mulch', 'Wasser sparen'],
    bild: 'assets/img/lavendel-2_aquarell.webp',
    bildAlt: 'Lavendel in zarten Aquarellfarben'
  },
  {
    slug: 'tomaten-im-gewaechshaus',
    kategorie: 'Obst & Gemüse',
    icon: 'local_florist',
    titel: 'Tomaten luftig und gesund halten',
    kurztext: 'Regelmäßiges Lüften, Ausgeizen und gezieltes Gießen senken das Risiko für Pilzkrankheiten im Gewächshaus.',
    saison: 'Mai bis September',
    aufwand: 'Mittel',
    dauer: '10 Minuten pro Kontrolle',
    merksatz: 'Tomaten mögen warme Füße, trockene Blätter und viel Luftbewegung.',
    schritte: [
      'Seitentriebe bei Stabtomaten frühzeitig mit den Fingern ausbrechen.',
      'Untere Blätter entfernen, sobald sie dauerhaft Bodenkontakt haben.',
      'Das Gewächshaus tagsüber lüften, besonders nach dem Gießen.',
      'Nur den Boden wässern und die Blätter trocken halten.'
    ],
    hinweise: [
      'Gelbe oder fleckige Blätter zeitnah entfernen.',
      'Zu dichter Wuchs trocknet nach Regen oder Gießen schlecht ab.',
      'Reife Früchte regelmäßig ernten, damit neue Früchte nachkommen.'
    ],
    tags: ['Tomaten', 'Gewächshaus', 'Lüften'],
    bild: 'assets/img/lavendel-3_aquarell.webp',
    bildAlt: 'Zarter Lavendelzweig'
  },
  {
    slug: 'obstbaeume-im-sommer-kontrollieren',
    kategorie: 'Obst & Gemüse',
    icon: 'park',
    titel: 'Obstbäume im Sommer kontrollieren',
    kurztext: 'Ein ruhiger Blick in die Krone zeigt früh, ob Früchte zu dicht hängen, Zweige reiben oder Blätter krank wirken.',
    saison: 'Juni bis August',
    aufwand: 'Mittel',
    dauer: '20–40 Minuten',
    merksatz: 'Licht und Luft in der Krone verbessern Fruchtqualität und Pflanzengesundheit.',
    schritte: [
      'Baum von außen und innen betrachten und auffällige Stellen markieren.',
      'Kranke, abgestorbene oder sich kreuzende Triebe entfernen.',
      'Sehr dichte Fruchtbüschel vorsichtig ausdünnen.',
      'Schnittmaßnahmen nur maßvoll und bei trockenem Wetter durchführen.'
    ],
    hinweise: [
      'Starker Sommerschnitt bremst das Wachstum, ersetzt aber keine gute Grundpflege.',
      'Werkzeug vor und nach dem Schnitt reinigen.',
      'Fallobst regelmäßig entfernen, damit Schädlinge weniger Angriffsfläche finden.'
    ],
    tags: ['Apfel', 'Birne', 'Sommerschnitt'],
    bild: 'assets/img/lavendel-4_aquarell.webp',
    bildAlt: 'Lavendelstrauß als dekoratives Gartenmotiv'
  },
  {
    slug: 'blattlaeuse-naturnah-reduzieren',
    kategorie: 'Pflanzenschutz',
    icon: 'pest_control',
    titel: 'Blattläuse naturnah reduzieren',
    kurztext: 'Bei leichtem Befall helfen Wasserstrahl, Nützlinge und Pflanzenstärkung oft besser als hektisches Eingreifen.',
    saison: 'Frühjahr bis Sommer',
    aufwand: 'Leicht',
    dauer: '10 Minuten',
    merksatz: 'Erst beobachten, dann gezielt handeln: Ein gesunder Garten reguliert vieles selbst.',
    schritte: [
      'Triebspitzen und Blattunterseiten kontrollieren.',
      'Leichten Befall mit Wasser abspülen oder vorsichtig abstreifen.',
      'Marienkäfer, Florfliegen und Schwebfliegen fördern.',
      'Stark befallene Triebspitzen entfernen, wenn die Pflanze darunter leidet.'
    ],
    hinweise: [
      'Ameisen können Blattläuse schützen, weil sie Honigtau nutzen.',
      'Überdüngte Pflanzen sind oft anfälliger für Läuse.',
      'Blühpflanzen in der Nähe unterstützen Nützlinge.'
    ],
    tags: ['Schädlinge', 'Nützlinge', 'Rosen'],
    bild: 'assets/img/lavendel-1_aquarell.webp',
    bildAlt: 'Lavendelzweige als ruhiges Gartenmotiv'
  },
  {
    slug: 'kompost-richtig-nutzen',
    kategorie: 'Boden',
    icon: 'compost',
    titel: 'Kompost richtig nutzen',
    kurztext: 'Reifer Kompost verbessert Bodenstruktur, versorgt Pflanzen schonend und stärkt das Bodenleben.',
    saison: 'Frühjahr und Herbst',
    aufwand: 'Leicht',
    dauer: '20 Minuten',
    merksatz: 'Kompost ist Bodenpflege, kein Ersatz für beliebig starke Düngung.',
    schritte: [
      'Nur dunklen, krümeligen und erdig riechenden Kompost verwenden.',
      'Kompost oberflächlich verteilen und leicht einarbeiten.',
      'Starkzehrer wie Tomaten, Kürbis oder Kohl gezielter versorgen.',
      'Frische Küchenreste nicht direkt an Gemüsebeete geben.'
    ],
    hinweise: [
      'Unreifer Kompost kann Pflanzenwurzeln belasten.',
      'Feine Komposterde eignet sich gut für Beerensträucher.',
      'Eine Mischung aus grünen und trockenen Materialien verbessert die Rotte.'
    ],
    tags: ['Kompost', 'Bodenleben', 'Düngung'],
    bild: 'assets/img/lavendel-2_aquarell.webp',
    bildAlt: 'Lavendel in zarten Aquarellfarben'
  },
  {
    slug: 'bienenfreundlich-durchs-jahr',
    kategorie: 'Naturgarten',
    icon: 'emoji_nature',
    titel: 'Bienenfreundlich durchs Gartenjahr',
    kurztext: 'Ein guter Mix aus Frühblühern, Sommerstauden und späten Blüten hilft Wildbienen, Hummeln und Schmetterlingen.',
    saison: 'Ganzjährig',
    aufwand: 'Mittel',
    dauer: '30 Minuten Planung',
    merksatz: 'Wichtig ist nicht nur viel Blüte, sondern Blüte über möglichst viele Monate.',
    schritte: [
      'Frühblüher wie Krokus, Traubenhyazinthe und Lungenkraut einplanen.',
      'Im Sommer Kräuter, Lavendel, Salbei und ungefüllte Stauden blühen lassen.',
      'Für den Herbst Astern, Fetthenne oder spät blühende Kräuter ergänzen.',
      'Trockene Stängel und kleine wilde Ecken über den Winter stehen lassen.'
    ],
    hinweise: [
      'Ungefüllte Blüten sind für Insekten meist wertvoller.',
      'Wasserstellen mit Ausstiegshilfe helfen an heißen Tagen.',
      'Heimische Gehölze bieten zusätzlich Nahrung und Schutz.'
    ],
    tags: ['Bienen', 'Stauden', 'Lavendel'],
    bild: 'assets/img/lavendel-3_aquarell.webp',
    bildAlt: 'Zarter Lavendelzweig'
  },
  {
    slug: 'brennesselauszug-schonend-einsetzen',
    kategorie: 'Pflanzenschutz',
    icon: 'eco',
    titel: 'Brennnesselauszug schonend einsetzen',
    kurztext: 'Ein kurzer Auszug kann Pflanzen stärken und bei leichtem Schädlingsdruck unterstützen, wenn er frisch verwendet wird.',
    saison: 'Frühjahr bis Sommer',
    aufwand: 'Leicht',
    dauer: '24 Stunden Ziehzeit',
    merksatz: 'Ein Auszug ist frisch am wirksamsten und wird nicht wie eine lange vergorene Jauche behandelt.',
    schritte: [
      'Brennnesseln grob zerkleinern und mit Wasser übergießen.',
      'Etwa 12 bis 24 Stunden ziehen lassen und gelegentlich umrühren.',
      'Pflanzenteile absieben und den Auszug zeitnah verwenden.',
      'Empfindliche Pflanzen zuerst an wenigen Blättern testen.'
    ],
    hinweise: [
      'Nicht in praller Sonne spritzen.',
      'Bei Wärme kippt ein Auszug schneller und sollte frisch genutzt werden.',
      'Für essbare Pflanzenteile immer sauber arbeiten und vor der Ernte gründlich waschen.'
    ],
    tags: ['Brennnessel', 'Auszug', 'Pflanzenstärkung'],
    bild: 'assets/img/lavendel-4_aquarell.webp',
    bildAlt: 'Lavendelstrauß als dekoratives Gartenmotiv'
  }
];

export const GARTENWISSEN_MONATSCHECK: GartenwissenMonatscheck[] = [
  {
    titel: 'Gießen prüfen',
    text: 'Kübel, junge Pflanzen und Beete mit sandigem Boden trocknen zuerst aus.',
    icon: 'water_drop'
  },
  {
    titel: 'Ernten und ausputzen',
    text: 'Reife Früchte, Verblühtes und kranke Pflanzenteile regelmäßig entfernen.',
    icon: 'yard'
  },
  {
    titel: 'Nützlinge fördern',
    text: 'Blühende Kräuter, Wasserstellen und ruhige Ecken stärken das Gleichgewicht.',
    icon: 'emoji_nature'
  }
];
