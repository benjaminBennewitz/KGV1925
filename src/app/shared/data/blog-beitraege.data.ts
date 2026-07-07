/* src/app/shared/data/blog-beitraege.data.ts */

export interface BlogBeitrag {
  slug: string;
  titel: string;
  kategorie: string;
  datum: string;
  zeit?: string;
  ort?: string;
  lesezeit: string;
  kurztext: string;
  bild: string;
  bildAlt: string;
  akzent?: 'salbei' | 'lavendel' | 'sand' | 'nacht';
  abschnitte: string[];
  details?: string[];
  downloadUrl?: string;
  downloadLabel?: string;
  downloadDateiname?: string;
}

export const BLOG_BEITRAEGE: BlogBeitrag[] = [
  {
    slug: 'laubenabend-03-juli-2026',
    titel: 'Laubenabend am 03. Juli 2026',
    kategorie: 'Vereinsleben',
    datum: '03. Juli 2026',
    zeit: 'Ab 17 Uhr · Ende offen',
    ort: 'Vereinsanlage',
    lesezeit: '2 Min.',
    kurztext: 'Der neue Freitagstreff für Vereinsmitglieder, Nachbarschaft und Gartenfreunde startet ab 17 Uhr mit Getränken und mehr.',
    bild: '/angular-projects/1925/assets/img/aktuelles/laubenabend-2026.webp',
    bildAlt: 'Flyer zum Laubenabend am 03. Juli 2026 mit Lichterkette, Abendmotiv und Getränken',
    akzent: 'nacht',
    abschnitte: [
      'Am Freitag, den 03. Juli 2026, findet ab 17 Uhr unser Laubenabend statt. Das Ende ist offen, sodass der Abend in entspannter Atmosphäre ausklingen kann.',
      'Der Laubenabend ist als neuer Freitagstreff für Vereinsmitglieder, Nachbarschaft und Gartenfreunde gedacht. Es gibt Getränke und weitere kleine Angebote vor Ort.',
      'Alle Gäste werden gebeten, die Hinweise zur Anlage, die Ruhezeiten und die Rücksichtnahme auf angrenzende Gärten zu beachten.',
    ],
    details: ['03.07.2026', 'ab 17 Uhr', 'Ende offen', 'Getränke & mehr'],
  },
  {
    slug: '8-vorstandssitzung-07-juli-2026',
    titel: '8. Vorstandssitzung',
    kategorie: 'Vorstand',
    datum: '07. Juli 2026',
    zeit: '19 Uhr',
    ort: 'Vereinshaus',
    lesezeit: '2 Min.',
    kurztext: 'Am 07. Juli 2026 tagt der Vorstand um 19 Uhr. Auf der Tagesordnung stehen das Sommerfest, die Begehung und Sonstiges.',
    bild: '/angular-projects/1925/assets/img/aktuelles/vorstandssitzung-2026-07-07.webp',
    bildAlt: 'Grafik zur 8. Vorstandssitzung am 07. Juli 2026 mit den Themen Nachbesprechung Sommerfest, Planung Begehung und Sonstiges',
    akzent: 'salbei',
    abschnitte: [
      'Am Dienstag, den 07. Juli 2026, findet um 19 Uhr die 8. Vorstandssitzung statt.',
      'Besprochen werden die Nachbereitung des Sommerfestes, die Planung der anstehenden Begehung und weitere Punkte unter Sonstiges.',
      'Hinweise oder Anliegen für den Vorstand können wie gewohnt über die bekannten Ansprechpartner oder die Kontaktseite eingereicht werden.',
    ],
    details: ['07.07.2026', '19 Uhr', 'Nachbesprechung Sommerfest', 'Planung Begehung', 'Sonstiges'],
  },
  {
    slug: '75-kleingartenwettbewerb-moenchengladbach-2026',
    titel: '75. Kleingartenwettbewerb in Mönchengladbach',
    kategorie: 'Wettbewerb',
    datum: '09.–12. Juli 2026',
    zeit: 'Ergebnisse am 19. Juli 2026',
    ort: 'Mönchengladbach',
    lesezeit: '2 Min.',
    kurztext: 'Der 75. Kleingartenwettbewerb findet vom 09. bis 12. Juli statt. Ergebnisse und Siegerehrung folgen am 19. Juli.',
    bild: '/angular-projects/1925/assets/img/aktuelles/gartenwettbewerb-2026.webp',
    bildAlt: 'Gestaltete Übersicht zum 75. Kleingartenwettbewerb 2026 mit Terminen und Lavendelmotiv',
    akzent: 'lavendel',
    abschnitte: [
      'Der 75. Kleingartenwettbewerb in Mönchengladbach findet vom 09. bis 12. Juli 2026 statt. In diesem Zeitraum werden die teilnehmenden Anlagen bewertet.',
      'Die Bekanntgabe der Ergebnisse und die Siegerehrung erfolgen am Sonntag, den 19. Juli 2026.',
      'Die offizielle Ehrung der platzierten Vereine, unter anderem in Kooperation mit der mags AöR, ist für den 24. September 2026 angesetzt.',
    ],
    details: ['09.–12.07.2026', 'Ergebnisse am 19.07.2026', 'Ehrung am 24.09.2026'],
  },
  {
    slug: 'gemeinschaftsarbeit-2026',
    titel: 'Gemeinschaftsarbeit 2026',
    kategorie: 'Mitgliederhinweis',
    datum: '2026',
    zeit: 'samstags 9:00–12:00 Uhr',
    ort: 'Vereinsanlage',
    lesezeit: '3 Min.',
    kurztext: 'Die Gemeinschaftsarbeitsplanung zeigt die Termine, Gruppen und zugeordneten Gartennummern für die Arbeitseinsätze 2026.',
    bild: '/angular-projects/1925/assets/img/aktuelles/gemeinschaftsarbeit-uebersicht.webp',
    bildAlt: 'Digital erstellte Gemeinschaftsarbeitsplanung 2026 mit Terminen, Gruppen und zugeordneten Gartennummern',
    akzent: 'sand',
    abschnitte: [
      'Die Gemeinschaftsarbeitsplanung 2026 zeigt, welche Gartennummern an welchem Samstag eingeteilt sind. Die Einsätze finden samstags von 9:00 bis 12:00 Uhr statt.',
      'Die Übersicht ist nach den Gruppen A, B, C und D gegliedert. Mitglieder können ihre Gartennummer in der Tabelle prüfen und den zugehörigen Termin vormerken.',
      'Nicht geleistete Gemeinschaftsarbeit wird mit 60,00 Euro pro Stunde in Rechnung gestellt. Im Falle einer Verhinderung ist dies dem Gartenfachberater unter 0173-2836684 oder 02161-5777173 mitzuteilen.',
    ],
    details: ['samstags 9:00–12:00 Uhr', 'Gruppen A bis D', '60,00 Euro/Std. bei nicht geleisteter Arbeit', 'Rückmeldung bei Verhinderung'],
    downloadUrl: '/angular-projects/1925/assets/downloads/gemeinschaftsarbeit-2026.pdf',
    downloadLabel: 'Plan als PDF herunterladen',
    downloadDateiname: 'gemeinschaftsarbeit-2026.pdf',
  },
  {
    slug: 'sommerfest-2026',
    titel: 'Sommerfest 2026',
    kategorie: 'Rückblick',
    datum: '27. Juni 2026',
    zeit: '14–22 Uhr',
    ort: 'Vereinsanlage',
    lesezeit: '2 Min.',
    kurztext: 'Unser Sommerfest stand unter dem Motto: vorbeikommen, einen Tag voller Spaß erleben und Gemeinschaft genießen.',
    bild: '/angular-projects/1925/assets/img/aktuelles/sommerfest-2026.webp',
    bildAlt: 'Flyer zum Sommerfest 2026 mit Blumen, Vögeln und Gartenmotiv',
    akzent: 'salbei',
    abschnitte: [
      'Am 27. Juni 2026 fand unser Sommerfest von 14 bis 22 Uhr auf der Vereinsanlage statt.',
      'Der Tag stand im Zeichen von Gemeinschaft, Gesprächen und einem offenen Miteinander auf unserer Anlage.',
      'Der Flyer fasst die Stimmung gut zusammen: vorbeikommen, einen Tag voller Spaß erleben und Gemeinschaft genießen.',
    ],
    details: ['27.06.2026', '14–22 Uhr', 'Sommerfest auf der Anlage'],
  },
];
