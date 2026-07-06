/* src/app/pages/service/service.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICE_DOWNLOADS, SERVICE_KARTEN, ServiceDownload } from '../../shared/data/service.data';
import { bereinigeSuchwert, normalisiereSuchwert } from '../../shared/utils/eingabe-sicherheit.util';

@Component({
  selector: 'app-service',
  imports: [RouterLink],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
})
export class ServiceComponent {
  protected readonly icon = 'inventory_2';
  protected readonly serviceKarten = SERVICE_KARTEN;
  protected readonly downloads = SERVICE_DOWNLOADS;
  protected suchbegriff = '';

  protected get gefilterteDownloads(): ServiceDownload[] {
    const suche = normalisiereSuchwert(this.suchbegriff);

    if (!suche) {
      return this.downloads;
    }

    return this.downloads.filter((download) => {
      const suchText = normalisiereSuchwert(`${download.titel} ${download.kategorie} ${download.auszug} ${download.tags.join(' ')}`);

      return suchText.includes(suche);
    });
  }

  /**
   * Scrollt ohne Routenwechsel zum Downloadbereich.
   */
  protected scrollZuDownloads(): void {
    const downloadBereich = document.getElementById('downloads');

    if (!downloadBereich) {
      return;
    }

    downloadBereich.scrollIntoView({ behavior: 'smooth', block: 'start' });
    downloadBereich.focus({ preventScroll: true });
  }

  /**
   * Bereinigt die Suchanfrage auf ungefährliche Zeichen und begrenzt die Eingabelänge.
   */
  protected aktualisiereSuche(event: Event): void {
    const eingabe = event.target as HTMLInputElement;
    const bereinigterWert = bereinigeSuchwert(eingabe.value, 50);

    this.suchbegriff = bereinigterWert;
    eingabe.value = bereinigterWert;
  }
}
