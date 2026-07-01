/* src/app/shared/data/blog-beitraege.data.ts */

export interface BlogBeitrag {
  slug: string;
  titel: string;
  kategorie: string;
  datum: string;
  lesezeit: string;
  kurztext: string;
  bild: string;
  abschnitte: string[];
}

export const BLOG_BEITRAEGE: BlogBeitrag[] = [
  {
    slug: 'fruehjahrsbepflanzung-voller-erfolg',
    titel: 'Frühjahrsbepflanzung – ein voller Erfolg',
    kategorie: 'Vereinsleben',
    datum: '12. Mai 2024',
    lesezeit: '3 Min.',
    kurztext: 'Bei bestem Wetter haben viele fleißige Helfer unsere Gemeinschaftsflächen verschönert.',
    bild: 'assets/img/lavendel-1_aquarell.webp',
    abschnitte: [
      'Unsere Frühjahrsbepflanzung hat gezeigt, wie stark die Gemeinschaft im Verein ist. Viele Mitglieder haben gemeinsam angepackt und die Wege, Beete und Aufenthaltsbereiche gepflegt.',
      'Besonders wichtig war uns eine ruhige und naturnahe Gestaltung, die zur Anlage passt und zugleich pflegeleicht bleibt.',
      'In den kommenden Wochen prüfen wir, welche Pflanzen sich an den jeweiligen Standorten besonders gut entwickeln.',
    ],
  },
  {
    slug: 'wasser-anstellen-am-18-mai',
    titel: 'Wasser anstellen am 18. Mai',
    kategorie: 'Hinweis',
    datum: '8. Mai 2024',
    lesezeit: '2 Min.',
    kurztext: 'Am Samstag, den 18. Mai, wird das Wasser auf der gesamten Anlage angestellt.',
    bild: 'assets/img/lavendel-2_aquarell.webp',
    abschnitte: [
      'Das Wasser wird am Samstagvormittag auf der gesamten Anlage angestellt. Bitte kontrolliert vorher eure Anschlüsse und stellt sicher, dass alle Hähne geschlossen sind.',
      'Sollte an einer Parzelle ein Schaden sichtbar werden, meldet euch bitte direkt beim Vorstand.',
    ],
  },
  {
    slug: 'gemeinschaftsarbeit-im-sommer',
    titel: 'Gemeinschaftsarbeit im Sommer',
    kategorie: 'Termin',
    datum: '25. Mai 2024',
    lesezeit: '2 Min.',
    kurztext: 'Die nächste Gemeinschaftsarbeit widmet sich Wegen, Hecken und gemeinsamen Grünflächen.',
    bild: 'assets/img/lavendel-4_aquarell.webp',
    abschnitte: [
      'Die nächste Gemeinschaftsarbeit steht im Zeichen der Sommerpflege. Gemeinsam kümmern wir uns um Wege, Hecken und zentrale Grünflächen.',
      'Bitte bringt nach Möglichkeit eigene Handschuhe mit. Weitere Geräte werden vor Ort abgestimmt.',
    ],
  },
];
