/* src/app/pages/galerie/galerie.component.ts */

import { Component } from '@angular/core';

interface GalerieBild {
  titel: string;
  kategorie: 'Garten' | 'Fest' | 'Gemeinschaft';
  beschreibung: string;
  bild: string;
  format: 'hoch' | 'quer' | 'gross';
}

@Component({
  selector: 'app-galerie',
  templateUrl: './galerie.component.html',
  styleUrl: './galerie.component.scss',
})
export class GalerieComponent {
  protected readonly bilder: GalerieBild[] = [
    {
      titel: 'Blühende Gartenwege',
      kategorie: 'Garten',
      beschreibung: 'Eindrücke aus der Anlage und von gepflegten Gemeinschaftsflächen.',
      bild: 'assets/img/lavendel-1_aquarell.webp',
      format: 'quer',
    },
    {
      titel: 'Sommerliches Vereinsleben',
      kategorie: 'Fest',
      beschreibung: 'Platzhalter für Bilder von Sommerfesten, Treffen und Aktionen.',
      bild: 'assets/img/lavendel-3_aquarell.webp',
      format: 'gross',
    },
    {
      titel: 'Gemeinsam im Grünen',
      kategorie: 'Gemeinschaft',
      beschreibung: 'Momente aus Gemeinschaftsarbeit, Nachbarschaft und Vereinsalltag.',
      bild: 'assets/img/lavendel-2_aquarell.webp',
      format: 'hoch',
    },
    {
      titel: 'Naturdetails',
      kategorie: 'Garten',
      beschreibung: 'Pflanzen, Wege, Beete und ruhige Ecken der Gartenanlage.',
      bild: 'assets/img/lavendel-4_aquarell.webp',
      format: 'quer',
    },
    {
      titel: 'Feste und Aktionen',
      kategorie: 'Fest',
      beschreibung: 'Späterer Platz für Fotos von Vereinsfesten und besonderen Tagen.',
      bild: 'assets/img/lavendel-1_aquarell.webp',
      format: 'hoch',
    },
    {
      titel: 'Gartenanlage',
      kategorie: 'Garten',
      beschreibung: 'Masonry-Kachel als vorbereitete Struktur für echte Gartenfotos.',
      bild: 'assets/img/lavendel-3_aquarell.webp',
      format: 'gross',
    },
  ];
}
