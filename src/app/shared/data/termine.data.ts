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
    slug: 'gemeinschaftsarbeit-mai',
    titel: 'Gemeinschaftsarbeit',
    datum: 'Sa, 25. Mai 2024',
    zeit: '09:00 Uhr',
    ort: 'Vereinsanlage',
    kurztext: 'Gemeinsame Pflege von Wegen, Grünflächen und zentralen Bereichen.',
    kategorie: 'Vereinsleben',
  },
  {
    slug: 'wasser-anstellen',
    titel: 'Wasser anstellen',
    datum: 'Sa, 18. Mai 2024',
    zeit: '10:00 Uhr',
    ort: 'Gesamte Anlage',
    kurztext: 'Das Wasser wird auf der gesamten Anlage angestellt.',
    kategorie: 'Hinweis',
  },
];
