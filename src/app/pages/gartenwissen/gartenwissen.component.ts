/* src/app/pages/gartenwissen/gartenwissen.component.ts */

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GARTENWISSEN_BEITRAEGE, GARTENWISSEN_KATEGORIEN, GARTENWISSEN_MONATSCHECK, GartenwissenBeitrag, GartenwissenKategorie } from '../../shared/data/gartenwissen.data';
import { AdminContentService } from '../../shared/services/admin-content.service';

@Component({
  selector: 'app-gartenwissen',
  imports: [RouterLink],
  templateUrl: './gartenwissen.component.html',
  styleUrl: './gartenwissen.component.scss',
})
export class GartenwissenComponent {
  private readonly adminContent = inject(AdminContentService);

  protected readonly kategorien = GARTENWISSEN_KATEGORIEN;
  protected readonly monatscheck = GARTENWISSEN_MONATSCHECK;
  protected aktiveKategorie: GartenwissenKategorie | 'Alle' = 'Alle';
  protected suchbegriff = '';
  protected ausgewaehlterBeitrag = GARTENWISSEN_BEITRAEGE[0];

  protected get beitraege(): GartenwissenBeitrag[] {
    return this.adminContent.gartenwissen();
  }

  protected get gefilterteBeitraege(): GartenwissenBeitrag[] {
    const suche = this.suchbegriff.trim().toLowerCase();

    return this.beitraege.filter((beitrag) => {
      const passtZurKategorie = this.aktiveKategorie === 'Alle' || beitrag.kategorie === this.aktiveKategorie;
      const suchText = `${beitrag.titel} ${beitrag.kurztext} ${beitrag.kategorie} ${beitrag.tags.join(' ')}`.toLowerCase();
      const passtZurSuche = !suche || suchText.includes(suche);

      return passtZurKategorie && passtZurSuche;
    });
  }

  /**
   * Setzt die aktive Wissenskategorie und hält die Detailansicht im sichtbaren Ergebnisbereich.
   */
  protected setzeKategorie(kategorie: GartenwissenKategorie | 'Alle'): void {
    this.aktiveKategorie = kategorie;
    this.aktualisiereAuswahlNachFilter();
  }

  /**
   * Bereinigt die Sucheingabe auf unkritische Zeichen und aktualisiert anschließend die Ergebnisliste.
   */
  protected aktualisiereSuche(event: Event): void {
    const eingabe = event.target as HTMLInputElement;
    const bereinigterWert = eingabe.value.replace(/[^A-Za-zÄÖÜäöüß0-9\s\-]/g, '').slice(0, 50);

    this.suchbegriff = bereinigterWert;
    eingabe.value = bereinigterWert;
    this.aktualisiereAuswahlNachFilter();
  }

  /**
   * Öffnet den ausgewählten Wissensbeitrag in der Detailansicht.
   */
  protected zeigeBeitrag(beitrag: GartenwissenBeitrag): void {
    this.ausgewaehlterBeitrag = beitrag;
  }

  /**
   * Prüft, ob eine Karte aktuell in der Detailansicht geöffnet ist.
   */
  protected istAusgewaehlt(beitrag: GartenwissenBeitrag): boolean {
    return this.ausgewaehlterBeitrag.slug === beitrag.slug;
  }

  /**
   * Stellt sicher, dass nach Suche oder Filter eine passende Detailkarte aktiv bleibt.
   */
  private aktualisiereAuswahlNachFilter(): void {
    const ergebnisse = this.gefilterteBeitraege;

    if (!ergebnisse.length) {
      this.ausgewaehlterBeitrag = this.beitraege[0] ?? this.ausgewaehlterBeitrag;
      return;
    }

    if (!ergebnisse.some((beitrag) => beitrag.slug === this.ausgewaehlterBeitrag.slug)) {
      this.ausgewaehlterBeitrag = ergebnisse[0];
    }
  }
}
