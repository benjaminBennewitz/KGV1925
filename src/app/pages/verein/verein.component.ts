/* src/app/pages/verein/verein.component.ts */

import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ANLAGEN_INFOS, DetailBild, GARTEN_PARZELLEN, GartenFilter, GartenParzelle, GartenStatus, VEREINSHAUS_DETAIL, VereinshausDetail, VORSTANDSMITGLIEDER, Vorstandsmitglied } from '../../shared/data/verein.data';

@Component({
  selector: 'app-verein',
  imports: [RouterLink],
  templateUrl: './verein.component.html',
  styleUrl: './verein.component.scss',
})
export class VereinComponent {
  protected aktiveGartenFilter: GartenFilter = 'alle';
  protected ausgewaehlterGarten: GartenParzelle | null = null;
  protected ausgewaehltesVereinshaus: VereinshausDetail | null = null;
  protected aktiverBildIndex = 0;
  protected readonly anlagenInfos = ANLAGEN_INFOS;
  protected readonly gartenFilter: GartenFilter[] = ['alle', 'frei', 'verpachtet'];
  protected readonly gaerten = GARTEN_PARZELLEN;
  protected readonly vereinshausDetail = VEREINSHAUS_DETAIL;
  protected readonly geschaeftsfuehrenderVorstand = VORSTANDSMITGLIEDER.filter((mitglied) => mitglied.typ === 'geschaeftsfuehrend');
  protected readonly beisitzende = VORSTANDSMITGLIEDER.filter((mitglied) => mitglied.typ === 'beisitz');
  protected readonly lageplanObereReihe = this.ermittleGaertenNachNummern([48, 47, 46, 45, 44, 43, 42]);
  protected readonly lageplanQuerreihe = this.ermittleGaertenNachNummern([38, 39, 40, 41]);
  protected readonly lageplanWestBlock = this.ermittleGaertenNachNummern([27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37]);
  protected readonly lageplanMittelBlock = this.ermittleGaertenNachNummern([26, 25, 24, 23, 22, 21]);
  protected readonly lageplanHausBlock = this.ermittleGaertenNachNummern([13, 14, 15, 16, 17, 18, 19, 20]);
  protected readonly lageplanOstBlock = this.ermittleGaertenNachNummern([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

  protected get gefilterteGaerten(): GartenParzelle[] {
    if (this.aktiveGartenFilter === 'alle') {
      return this.gaerten;
    }

    return this.gaerten.filter((garten) => garten.status === this.aktiveGartenFilter);
  }

  protected get freieGaerten(): number {
    return this.gaerten.filter((garten) => garten.status === 'frei').length;
  }

  protected get verpachteteGaerten(): number {
    return this.gaerten.filter((garten) => garten.status === 'verpachtet').length;
  }

  /**
   * Schließt Detailfenster, sobald die Escape-Taste genutzt wird.
   */
  @HostListener('document:keydown.escape')
  protected schliesseModalPerTaste(): void {
    this.schliesseDetailModal();
  }

  /**
   * Setzt den sichtbaren Filter für die Parzellenübersicht.
   */
  protected setzeGartenFilter(filter: GartenFilter): void {
    this.aktiveGartenFilter = filter;
  }

  /**
   * Öffnet die Detailansicht für eine ausgewählte Parzelle.
   */
  protected oeffneGartenModal(garten: GartenParzelle): void {
    this.aktiverBildIndex = 0;
    this.ausgewaehltesVereinshaus = null;
    this.ausgewaehlterGarten = garten;
  }

  /**
   * Öffnet die Detailansicht für das Vereinshaus.
   */
  protected oeffneVereinshausModal(): void {
    this.aktiverBildIndex = 0;
    this.ausgewaehlterGarten = null;
    this.ausgewaehltesVereinshaus = this.vereinshausDetail;
  }

  /**
   * Schließt alle Detailansichten.
   */
  protected schliesseDetailModal(): void {
    this.ausgewaehlterGarten = null;
    this.ausgewaehltesVereinshaus = null;
    this.aktiverBildIndex = 0;
  }

  /**
   * Schließt die Detailansicht der Parzelle.
   */
  protected schliesseGartenModal(): void {
    this.schliesseDetailModal();
  }

  /**
   * Springt in der Bildergalerie zum vorherigen Bild.
   */
  protected vorherigesModalBild(bilder: DetailBild[]): void {
    this.aktiverBildIndex = bilder.length ? (this.aktiverBildIndex - 1 + bilder.length) % bilder.length : 0;
  }

  /**
   * Springt in der Bildergalerie zum nächsten Bild.
   */
  protected naechstesModalBild(bilder: DetailBild[]): void {
    this.aktiverBildIndex = bilder.length ? (this.aktiverBildIndex + 1) % bilder.length : 0;
  }

  /**
   * Setzt das aktive Bild der Detailgalerie.
   */
  protected setzeModalBild(index: number): void {
    this.aktiverBildIndex = Math.max(0, index);
  }

  /**
   * Gibt das aktive Bild einer Detailgalerie zurück.
   */
  protected ermittleAktivesBild(bilder: DetailBild[]): DetailBild {
    return bilder[this.aktiverBildIndex] ?? bilder[0];
  }

  /**
   * Gibt die lesbare Beschriftung für einen Gartenfilter zurück.
   */
  protected ermittleFilterText(filter: GartenFilter): string {
    const texte: Record<GartenFilter, string> = {
      alle: 'Alle Gärten',
      frei: 'Freie Gärten',
      verpachtet: 'Verpachtete Gärten',
    };

    return texte[filter];
  }

  /**
   * Gibt die lesbare Beschriftung für einen Gartenstatus zurück.
   */
  protected ermittleStatusText(status: GartenStatus): string {
    return status === 'frei' ? 'Frei' : 'Verpachtet';
  }

  /**
   * Gibt das passende Symbol für einen Gartenstatus zurück.
   */
  protected ermittleStatusIcon(status: GartenStatus): string {
    return status === 'frei' ? 'check_circle' : 'lock';
  }

  /**
   * Formatiert eine Parzellennummer zweistellig.
   */
  protected formatiereGartennummer(nummer: number): string {
    return nummer.toString().padStart(2, '0');
  }

  /**
   * Baut den vollständigen Namen eines Vorstandsmitglieds auf.
   */
  protected ermittleVorstandsname(mitglied: Vorstandsmitglied): string {
    return `${mitglied.vorname} ${mitglied.nachname}`;
  }

  /**
   * Ermittelt Parzellen in einer gezielten Reihenfolge für den schematischen Lageplan.
   */
  private ermittleGaertenNachNummern(nummern: number[]): GartenParzelle[] {
    return nummern
      .map((nummer) => this.gaerten.find((garten) => garten.nummer === nummer))
      .filter((garten): garten is GartenParzelle => Boolean(garten));
  }
}
