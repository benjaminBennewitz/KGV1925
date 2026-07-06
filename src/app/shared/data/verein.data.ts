/* src/app/shared/data/verein.data.ts */

export type GartenStatus = 'frei' | 'verpachtet';

export type GartenFilter = 'alle' | GartenStatus;

export interface Vorstandsmitglied {
  vorname: string;
  nachname: string;
  position: string;
  typ: 'geschaeftsfuehrend' | 'beisitz';
  icon: string;
  taetigkeitsbeschreibung: string;
}

export interface AnlagenInfo {
  icon: string;
  titel: string;
  text: string;
  hinweis: string;
  punkte?: string[];
  downloadLabel?: string;
  downloadUrl?: string;
  downloadDateiname?: string;
}

export interface DetailBild {
  pfad: string;
  alt: string;
}

export interface GartenParzelle {
  nummer: number;
  titel: string;
  status: GartenStatus;
  bild: string;
  alt: string;
  bilder: DetailBild[];
  groesse: string;
  lage: string;
  beschreibung: string;
  statusHinweis: string;
  merkmale: string[];
}

export interface VereinshausDetail {
  titel: string;
  eyebrow: string;
  icon: string;
  bilder: DetailBild[];
  beschreibung: string;
  groesse: string;
  lage: string;
  nutzung: string;
  hinweis: string;
  merkmale: string[];
}

const GARTEN_DETAIL_BILDER: DetailBild[] = [
  {
    pfad: 'assets/img/hero-vereinsgarten-mock.webp',
    alt: 'Grüner Weg durch die Kleingartenanlage am Steinberg',
  },
  {
    pfad: 'assets/img/aktuelles/gartenwettbewerb-2026.webp',
    alt: 'Gepflegte Gartenparzelle mit Beetflächen und Sommerbepflanzung',
  },
  {
    pfad: 'assets/img/aktuelles/gemeinschaftsarbeit-uebersicht.webp',
    alt: 'Gemeinschaftsfläche mit Werkzeugen und gepflegten Wegen',
  },
  {
    pfad: 'assets/img/aktuelles/sommerfest-2026.webp',
    alt: 'Einladender Außenbereich der Gartenanlage im Sommer',
  },
  {
    pfad: 'assets/img/aktuelles/laubenabend-2026.webp',
    alt: 'Stimmungsvolle Laubenansicht innerhalb der Kleingartenanlage',
  },
  {
    pfad: 'assets/img/aktuelles/vorstandssitzung-2026-07-07.webp',
    alt: 'Vereinsnaher Blick auf Treffpunkt und Organisation der Anlage',
  },
];

export const VEREINSHAUS_DETAIL: VereinshausDetail = {
  titel: 'Vereinshaus am Steinberg',
  eyebrow: 'Detailansicht Vereinshaus',
  icon: 'home_work',
  bilder: [
    {
      pfad: 'assets/img/aktuelles/sommerfest-2026.webp',
      alt: 'Vereinshaus und Außenbereich während einer sommerlichen Veranstaltung',
    },
    {
      pfad: 'assets/img/hero-vereinsgarten-mock.webp',
      alt: 'Weg durch die Gartenanlage in Richtung Vereinshaus',
    },
    {
      pfad: 'assets/img/aktuelles/laubenabend-2026.webp',
      alt: 'Stimmungsvolle Abendansicht rund um das Vereinshaus',
    },
    {
      pfad: 'assets/img/aktuelles/gemeinschaftsarbeit-uebersicht.webp',
      alt: 'Gemeinschaftsbereich rund um Vereinsarbeit und Anlage',
    },
    {
      pfad: 'assets/img/aktuelles/vorstandssitzung-2026-07-07.webp',
      alt: 'Vereinsorganisation und Treffpunkt im Umfeld des Vereinshauses',
    },
    {
      pfad: 'assets/img/aktuelles/gartenwettbewerb-2026.webp',
      alt: 'Gepflegte Anlage als Rahmen für kleinere Feiern und Treffen',
    },
  ],
  beschreibung: 'Das Vereinshaus ist der zentrale Treffpunkt für Vereinsleben, Versammlungen, kleinere private Feiern und gemeinschaftliche Veranstaltungen.',
  groesse: 'geeignet für kleine bis mittlere Anlässe',
  lage: 'mittlerer Anlagenbereich am Hauptweg',
  nutzung: 'private Feiern, Vorstandstermine, Vereinsabende und Abstimmungen',
  hinweis: 'Freie Termine können über die Vereinshausvermietung angefragt werden.',
  merkmale: ['Zentraler Treffpunkt', 'Direkter Anlagenbezug', 'Anfrage über Kalender möglich', 'Für Mitglieder und Gäste planbar'],
};

export const VORSTANDSMITGLIEDER: Vorstandsmitglied[] = [
  {
    vorname: 'Bülent',
    nachname: 'Kaplan',
    position: '1. Vorsitz',
    typ: 'geschaeftsfuehrend',
    icon: 'verified_user',
    taetigkeitsbeschreibung: 'Leitung des Vereins, Vertretung nach außen, Koordination zentraler Vereinsthemen und Ansprechpartner für übergeordnete Anliegen.',
  },
  {
    vorname: 'Lars',
    nachname: 'Andersen',
    position: '2. Vorsitz',
    typ: 'geschaeftsfuehrend',
    icon: 'diversity_3',
    taetigkeitsbeschreibung: 'Unterstützung des Vorsitzes, organisatorische Abstimmung im laufenden Vereinsbetrieb und Vertretung bei zentralen Aufgaben.',
  },
  {
    vorname: 'Martina',
    nachname: 'Kliemann',
    position: '3. Vorsitz',
    typ: 'geschaeftsfuehrend',
    icon: 'account_balance',
    taetigkeitsbeschreibung: 'Mitwirkung im geschäftsführenden Vorstand, Begleitung organisatorischer Themen und Unterstützung der Vereinsverwaltung.',
  },
  {
    vorname: 'Benjamin',
    nachname: 'Bennewitz',
    position: 'Beisitz Digitalisierung',
    typ: 'beisitz',
    icon: 'terminal',
    taetigkeitsbeschreibung: 'Web-Development, Website-Pflege, Datenschutz, Digitalisierung sowie technische und allgemeine Unterstützung.',
  },
  {
    vorname: 'Nadin',
    nachname: 'Detering',
    position: 'Beisitz Schaukasten',
    typ: 'beisitz',
    icon: 'campaign',
    taetigkeitsbeschreibung: 'Schaukastenbeauftragte, Aktualisierung der Aushänge sowie Gestaltung von Flyern und Postern.',
  },
  {
    vorname: 'Oliver',
    nachname: 'Dahms',
    position: 'Beisitz Protokoll',
    typ: 'beisitz',
    icon: 'edit_note',
    taetigkeitsbeschreibung: 'Protokollist, allgemeine sonstige Aufgaben und Unterstützung in IT-Themen.',
  },
  {
    vorname: 'Petra',
    nachname: 'Grefkes',
    position: 'Beisitz Allgemeines',
    typ: 'beisitz',
    icon: 'volunteer_activism',
    taetigkeitsbeschreibung: 'Allgemeine Unterstützung und helfende Kraft in allen Bereichen des Vereins.',
  },
  {
    vorname: 'Peter',
    nachname: 'Grefkes',
    position: 'Beisitz Gartenfachberatung',
    typ: 'beisitz',
    icon: 'local_florist',
    taetigkeitsbeschreibung: 'Gartenfachberater, allgemeine Unterstützung in allen Bereichen, Verwaltung der Gemeinschaftsarbeit und Planung der Gemeinschaftsflächen.',
  },
];

export const ANLAGEN_INFOS: AnlagenInfo[] = [
  {
    icon: 'schedule',
    titel: 'Öffnungszeiten',
    text: 'Die Gartenanlage ist für Mitglieder jederzeit rund um die Uhr nutzbar und begehbar. Grundlage ist die Einhaltung der Hausordnung und Gartenordnung.',
    hinweis: 'Für Gäste und Besucher gelten die ausgewiesenen Öffnungszeiten der Anlage.',
    punkte: ['Gartensaison: 9 Uhr bis Sonnenuntergang, spätestens 22 Uhr', 'Saisonende, Herbst, Winter und Frühjahr: 9 bis 19 Uhr'],
  },
  {
    icon: 'rule',
    titel: 'Hausordnung',
    text: 'Rücksichtnahme, gepflegte Wege, Ruhezeiten und ein respektvoller Umgang bilden die Grundlage für ein gutes Miteinander in der Anlage.',
    hinweis: 'Die vollständige Haus- und Gartenordnung steht als PDF zum Download bereit.',
    downloadLabel: 'Hausordnung als PDF herunterladen',
    downloadUrl: 'assets/downloads/Hausordnung-kgv1925__Juli-2026.pdf',
    downloadDateiname: 'Hausordnung-kgv1925__Juli-2026.pdf',
  },
  {
    icon: 'priority_high',
    titel: 'Bitte beachten',
    text: 'Einige Regeln gelten auf der gesamten Anlage und helfen dabei, Wege, Gärten und Ruhezeiten für alle angenehm zu halten.',
    hinweis: 'Vielen Dank für Rücksichtnahme und ein umsichtiges Verhalten auf der Anlage.',
    punkte: ['Hunde sind auf der Anlage an der Leine zu führen', 'Fahrrad- und Rollerfahren ist auf den Wegen nicht erlaubt', 'Mittagsruhe nach städtischer Regelung: 13 bis 15 Uhr'],
  },
];

export const GARTEN_PARZELLEN: GartenParzelle[] = Array.from({ length: 48 }, (_, index) => {
  const nummer = index + 1;
  const freieGaerten = new Set([7, 18, 31]);
  const status: GartenStatus = freieGaerten.has(nummer) ? 'frei' : 'verpachtet';
  const gartennummer = nummer.toString().padStart(2, '0');
  const lage = nummer <= 16 ? 'Vorderer Anlagenbereich' : nummer <= 32 ? 'Mittlerer Anlagenbereich' : 'Hinterer Anlagenbereich';

  return {
    nummer,
    titel: `Garten ${gartennummer}`,
    status,
    bild: 'assets/img/hero-vereinsgarten-mock.webp',
    alt: `Blick in die Gartenanlage für Garten ${gartennummer}`,
    bilder: GARTEN_DETAIL_BILDER,
    groesse: 'ca. 250 m²',
    lage,
    beschreibung: status === 'frei' ? 'Diese Parzelle ist aktuell als frei geführt. Interessierte können sich über die Kontaktseite beim Verein melden.' : 'Diese Parzelle ist aktuell verpachtet und Teil der bestehenden Gartenanlage.',
    statusHinweis: status === 'frei' ? 'Bei Interesse bitte über die Kontaktseite melden.' : 'Diese Parzelle ist vergeben.',
    merkmale: status === 'frei' ? ['Anfrage über Kontaktseite möglich', lage, 'Teil der 48 Vereinsparzellen'] : ['Aktuell vergeben', lage, 'Teil der 48 Vereinsparzellen'],
  };
});
