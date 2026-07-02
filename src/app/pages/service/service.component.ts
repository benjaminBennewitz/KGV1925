/* src/app/pages/service/service.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICE_DOWNLOADS, SERVICE_KARTEN, ServiceDownload } from '../../shared/data/service.data';

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
    const suche = this.suchbegriff.trim().toLowerCase();

    if (!suche) {
      return this.downloads;
    }

    return this.downloads.filter((download) => {
      const suchText = `${download.titel} ${download.kategorie} ${download.auszug} ${download.tags.join(' ')}`.toLowerCase();

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
    const bereinigterWert = eingabe.value.replace(/[^A-Za-zÄÖÜäöüß0-9\s\-.]/g, '').slice(0, 50);

    this.suchbegriff = bereinigterWert;
    eingabe.value = bereinigterWert;
  }
}
