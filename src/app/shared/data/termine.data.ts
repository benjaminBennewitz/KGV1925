/* src/app/shared/data/termine.data.ts */

export interface TerminEintrag {
  slug: string;
  titel: string;
  datum: string;
  zeit: string;
  ort: string;
  kurztext: string;
  kategorie: string;
}

export const TERMINE: TerminEintrag[] = [
  {
    slug: 'laubenabend-03-juli-2026',
    titel: 'Laubenabend',
    datum: 'Fr, 03. Juli 2026',
    zeit: 'ab 17:00 Uhr · Ende offen',
    ort: 'Vereinsanlage',
    kurztext: 'Der neue Freitagstreff für Vereinsmitglieder, Nachbarschaft und Gartenfreunde mit Getränken und mehr.',
    kategorie: 'Vereinsleben',
  },
  {
    slug: '75-kleingartenwettbewerb-2026',
    titel: '75. Kleingartenwettbewerb',
    datum: 'Do, 09. Juli bis So, 12. Juli 2026',
    zeit: 'ganztägig',
    ort: 'Mönchengladbach',
    kurztext: 'Bewertungszeitraum des 75. Kleingartenwettbewerbs in Mönchengladbach.',
    kategorie: 'Wettbewerb',
  },
  {
    slug: 'siegerehrung-kleingartenwettbewerb-2026',
    titel: 'Ergebnisse und Siegerehrung',
    datum: 'So, 19. Juli 2026',
    zeit: 'Uhrzeit nach Bekanntgabe',
    ort: 'Mönchengladbach',
    kurztext: 'Bekanntgabe der Ergebnisse und Siegerehrung zum 75. Kleingartenwettbewerb.',
    kategorie: 'Wettbewerb',
  },
  {
    slug: 'ehrung-platzierte-vereine-2026',
    titel: 'Offizielle Ehrung der platzierten Vereine',
    datum: 'Do, 24. September 2026',
    zeit: 'Uhrzeit nach Bekanntgabe',
    ort: 'Mönchengladbach',
    kurztext: 'Offizielle Ehrung der platzierten Vereine, unter anderem in Kooperation mit der mags AöR.',
    kategorie: 'Wettbewerb',
  },
  {
    slug: 'sommerfest-2026',
    titel: 'Sommerfest 2026',
    datum: 'Sa, 27. Juni 2026',
    zeit: '14:00–22:00 Uhr',
    ort: 'Vereinsanlage',
    kurztext: 'Sommerfest auf der Vereinsanlage mit Begegnung, Gemeinschaft und Gartenatmosphäre.',
    kategorie: 'Rückblick',
  },
];
