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
  downloadLabel?: string;
  downloadUrl?: string;
  downloadDateiname?: string;
}

export interface GartenParzelle {
  nummer: number;
  titel: string;
  status: GartenStatus;
  bild: string;
  alt: string;
  groesse: string;
  lage: string;
  beschreibung: string;
  statusHinweis: string;
  merkmale: string[];
}

export const VORSTANDSMITGLIEDER: Vorstandsmitglied[] = [
  {
    vorname: 'Name',
    nachname: 'folgt',
    position: '1. Vorsitz',
    typ: 'geschaeftsfuehrend',
    icon: 'verified_user',
    taetigkeitsbeschreibung: 'Koordination des Vereins, Repräsentation nach außen und Begleitung der strategischen Vereinsentwicklung.',
  },
  {
    vorname: 'Name',
    nachname: 'folgt',
    position: '2. Vorsitz',
    typ: 'geschaeftsfuehrend',
    icon: 'diversity_3',
    taetigkeitsbeschreibung: 'Unterstützung des Vorsitzes, Abstimmung laufender Vereinsthemen und Vertretung bei organisatorischen Fragen.',
  },
  {
    vorname: 'Name',
    nachname: 'folgt',
    position: 'Kassenführung',
    typ: 'geschaeftsfuehrend',
    icon: 'account_balance',
    taetigkeitsbeschreibung: 'Verwaltung der Finanzen, Beiträge, Abrechnungen und wirtschaftlichen Unterlagen des Vereins.',
  },
  {
    vorname: 'Name',
    nachname: 'folgt',
    position: 'Beisitz Anlage',
    typ: 'beisitz',
    icon: 'yard',
    taetigkeitsbeschreibung: 'Ansprechpartner für Anlage, Wege, Pflegeflächen und praktische Anliegen rund um die Parzellen.',
  },
  {
    vorname: 'Name',
    nachname: 'folgt',
    position: 'Beisitz Mitglieder',
    typ: 'beisitz',
    icon: 'handshake',
    taetigkeitsbeschreibung: 'Unterstützung bei Mitgliederanliegen, Austausch innerhalb der Gemeinschaft und organisatorischer Abstimmung.',
  },
  {
    vorname: 'Name',
    nachname: 'folgt',
    position: 'Beisitz Termine',
    typ: 'beisitz',
    icon: 'event',
    taetigkeitsbeschreibung: 'Mitwirkung bei Terminen, Veranstaltungen, Arbeitseinsätzen und saisonalen Vereinsaktivitäten.',
  },
  {
    vorname: 'Name',
    nachname: 'folgt',
    position: 'Beisitz Technik',
    typ: 'beisitz',
    icon: 'construction',
    taetigkeitsbeschreibung: 'Unterstützung bei Pflege, Instandhaltung, kleinen Reparaturen und technischen Fragen der Anlage.',
  },
  {
    vorname: 'Name',
    nachname: 'folgt',
    position: 'Beisitz Gartenordnung',
    typ: 'beisitz',
    icon: 'local_florist',
    taetigkeitsbeschreibung: 'Begleitung von Gartenthemen, Ordnung, nachhaltiger Nutzung und gemeinschaftlicher Pflege.',
  },
  {
    vorname: 'Name',
    nachname: 'folgt',
    position: 'Beisitz Kommunikation',
    typ: 'beisitz',
    icon: 'forum',
    taetigkeitsbeschreibung: 'Unterstützung bei Informationen, Aushängen, Rückfragen und Kommunikation innerhalb der Gemeinschaft.',
  },
];

export const ANLAGEN_INFOS: AnlagenInfo[] = [
  {
    icon: 'schedule',
    titel: 'Öffnungszeiten',
    text: 'Die Anlage ist für Mitglieder grundsätzlich tagsüber nutzbar. Besucherinnen und Besucher werden gebeten, Termine oder Anliegen vorher abzustimmen.',
    hinweis: 'Verbindliche Zeiten und Sonderregelungen werden über Aushang, Termine und Vereinsinformationen bekanntgegeben.',
  },
  {
    icon: 'rule',
    titel: 'Hausordnung',
    text: 'Rücksichtnahme, gepflegte Wege, Ruhezeiten und ein respektvoller Umgang bilden die Grundlage für ein gutes Miteinander in der Anlage.',
    hinweis: 'Die vollständige Haus- und Gartenordnung kann als PDF heruntergeladen und später durch die verbindliche Fassung ersetzt werden.',
    downloadLabel: 'Hausordnung als PDF herunterladen',
    downloadUrl: 'assets/downloads/hausordnung-kgv1925.pdf',
    downloadDateiname: 'hausordnung-kgv1925.pdf',
  },
  {
    icon: 'groups',
    titel: 'Gemeinschaft',
    text: 'Arbeitseinsätze, Veranstaltungen und kurze Wege zum Vorstand sorgen dafür, dass die Anlage gepflegt bleibt und lebendig genutzt wird.',
    hinweis: 'Aktuelle Termine können zusätzlich im Kalender und unter Aktuelles gepflegt werden.',
  },
];

export const GARTEN_PARZELLEN: GartenParzelle[] = Array.from({ length: 48 }, (_, index) => {
  const nummer = index + 1;
  const freieGaerten = new Set([7, 18, 31]);
  const status: GartenStatus = freieGaerten.has(nummer) ? 'frei' : 'verpachtet';
  const gartennummer = nummer.toString().padStart(2, '0');

  return {
    nummer,
    titel: `Garten ${gartennummer}`,
    status,
    bild: 'assets/img/hero-vereinsgarten-mock.webp',
    alt: `Blick in die Gartenanlage als Platzhalterbild für Garten ${gartennummer}`,
    groesse: 'ca. 250 m²',
    lage: nummer <= 16 ? 'Vorderer Anlagenbereich' : nummer <= 32 ? 'Mittlerer Anlagenbereich' : 'Hinterer Anlagenbereich',
    beschreibung: status === 'frei' ? 'Diese Parzelle ist als frei markiert und kann später mit einem Bewerbungs- oder Kontaktprozess verknüpft werden.' : 'Diese Parzelle ist aktuell verpachtet. Detaildaten können später ergänzt werden, ohne das Kartenlayout anzupassen.',
    statusHinweis: status === 'frei' ? 'Für diese Parzelle kann eine Anfrage vorbereitet werden.' : 'Aktuell besteht kein freier Bewerbungsstatus.',
    merkmale: ['Wasseranschluss geplant', 'Gemeinschaftswege erreichbar', 'Detailfoto folgt'],
  };
});
