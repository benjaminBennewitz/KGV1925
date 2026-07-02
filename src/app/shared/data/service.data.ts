/* src/app/shared/data/service.data.ts */

export interface ServiceKarte {
  icon: string;
  titel: string;
  text: string;
  pfad: string;
  linkText: string;
  istAnker?: boolean;
}

export interface ServiceDownload {
  titel: string;
  kategorie: string;
  datum: string;
  groesse: string;
  auszug: string;
  bild: string;
  bildAlt: string;
  downloadUrl: string;
  downloadDateiname: string;
  tags: string[];
}

export const SERVICE_KARTEN: ServiceKarte[] = [
  {
    icon: 'cottage',
    titel: 'Vereinshausvermietung',
    text: 'Alle Informationen zur Nutzung des Vereinshauses, zur Anfrage und zu den wichtigsten Rahmenbedingungen.',
    pfad: '/vereinshausvermietung',
    linkText: 'Vermietung öffnen',
  },
  {
    icon: 'description',
    titel: 'Formulare und Downloads',
    text: 'Wichtige Unterlagen des Vereins an einem Ort: Hausordnung, Satzung, Gartenordnung und aktuelle Pläne.',
    pfad: '#downloads',
    linkText: 'Downloads ansehen',
    istAnker: true,
  },
  {
    icon: 'contact_support',
    titel: 'Ansprechpartner',
    text: 'Der schnelle Weg zu Kontakt, Vorstand, Zuständigkeiten und Rückfragen rund um die Anlage.',
    pfad: '/kontakt',
    linkText: 'Kontakt öffnen',
  },
];

export const SERVICE_DOWNLOADS: ServiceDownload[] = [
  {
    titel: 'Hausordnung KGV1925',
    kategorie: 'Hausordnung',
    datum: 'Juli 2026',
    groesse: 'PDF',
    auszug: 'Regeln für Vereinshaus und Gartenanlage: Ruhezeiten, Nutzung, Reinigung, Hausrecht und Verhalten auf dem Gelände.',
    bild: 'assets/img/service/download-hausordnung.webp',
    bildAlt: 'Vorschau der Hausordnung als PDF-Dokument',
    downloadUrl: 'assets/downloads/Hausordnung-kgv1925__Juli-2026.pdf',
    downloadDateiname: 'Hausordnung-kgv1925__Juli-2026.pdf',
    tags: ['Hausordnung', 'Vereinshaus', 'Anlage', 'Ruhezeiten'],
  },
  {
    titel: 'Satzung Kreisverband',
    kategorie: 'Satzung',
    datum: '2021',
    groesse: 'PDF',
    auszug: 'Satzung des Kreisverbandes Mönchengladbach der Gartenfreunde e. V. mit Geschäftsordnung für das Schlichtungsverfahren.',
    bild: 'assets/img/service/download-satzung.webp',
    bildAlt: 'Vorschau der Satzung des Kreisverbandes als PDF-Dokument',
    downloadUrl: 'assets/downloads/Kreisverband_Satzung-2021.pdf',
    downloadDateiname: 'Kreisverband_Satzung-2021.pdf',
    tags: ['Satzung', 'Kreisverband', 'Schlichtung', 'Verein'],
  },
  {
    titel: 'Gartenordnung der Stadt Mönchengladbach',
    kategorie: 'Gartenordnung',
    datum: '2024',
    groesse: 'PDF',
    auszug: 'Regeln für kleingärtnerische Nutzung, Gemeinschaftsarbeit, Rücksichtnahme, bauliche Anlagen, Tiere und Pflanzen in Mönchengladbach.',
    bild: 'assets/img/service/download-gartenordnung.webp',
    bildAlt: 'Vorschau der Gartenordnung der Stadt Mönchengladbach als PDF-Dokument',
    downloadUrl: 'assets/downloads/Gartenordnung-der-Stadt-Moenchengladbach-2024.pdf',
    downloadDateiname: 'Gartenordnung-der-Stadt-Moenchengladbach-2024.pdf',
    tags: ['Gartenordnung', 'Mönchengladbach', 'Parzelle', 'Pflege'],
  },
  {
    titel: 'Gemeinschaftsarbeit 2026',
    kategorie: 'Planung',
    datum: 'Saison 2026',
    groesse: 'PDF',
    auszug: 'Übersicht der Termine, Gruppen und Gartennummern für die Gemeinschaftsarbeit in der Gartensaison 2026.',
    bild: 'assets/img/service/download-gemeinschaftsarbeit.webp',
    bildAlt: 'Vorschau der Gemeinschaftsarbeit 2026 als PDF-Dokument',
    downloadUrl: 'assets/downloads/gemeinschaftsarbeit-2026.pdf',
    downloadDateiname: 'gemeinschaftsarbeit-2026.pdf',
    tags: ['Gemeinschaftsarbeit', 'Termine', 'Gärten', 'Planung'],
  },
];
