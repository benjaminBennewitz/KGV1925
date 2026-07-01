/* src/app/shared/data/navigation.data.ts */

export interface Navigationspunkt {
  label: string;
  pfad: string;
  kurztext: string;
}

export const HAUPTNAVIGATION: Navigationspunkt[] = [
  {
    label: 'Startseite',
    pfad: '/',
    kurztext: 'Zur Startseite',
  },
  {
    label: 'Unser Verein',
    pfad: '/verein',
    kurztext: 'Informationen zum Verein',
  },
  {
    label: 'Aktuelles',
    pfad: '/aktuelles',
    kurztext: 'Neuigkeiten und Hinweise',
  },
  {
    label: 'Gartenwissen',
    pfad: '/gartenwissen',
    kurztext: 'Tipps und Wissenswertes',
  },
  {
    label: 'Termine',
    pfad: '/termine',
    kurztext: 'Veranstaltungen und Kalender',
  },
  {
    label: 'Galerie',
    pfad: '/galerie',
    kurztext: 'Bilder aus Gartenanlage und Vereinsleben',
  },
  {
    label: 'Service',
    pfad: '/service',
    kurztext: 'Formulare und Downloads',
  },
  {
    label: 'Kontakt',
    pfad: '/kontakt',
    kurztext: 'Kontakt zum Verein',
  },
];
