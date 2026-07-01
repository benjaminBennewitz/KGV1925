/* src/app/shared/components/accessibility-mode/accessibility-mode.component.ts */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';

@Component({
  selector: 'app-accessibility-mode',
  templateUrl: './accessibility-mode.component.html',
  styleUrl: './accessibility-mode.component.scss',
})
export class AccessibilityModeComponent {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly istGeoeffnet = signal(false);
  protected readonly grosseSchrift = signal(false);
  protected readonly hoherKontrast = signal(false);
  protected readonly reduzierteBewegung = signal(false);

  /**
   * Öffnet oder schließt das Bedienfeld für Barrierefreiheit.
   */
  protected schalteBedienfeld(): void {
    this.istGeoeffnet.update((istOffen) => !istOffen);
  }

  /**
   * Schaltet die größere Schriftansicht für die aktuelle Sitzung.
   */
  protected schalteGrosseSchrift(): void {
    this.grosseSchrift.update((istAktiv) => !istAktiv);
    this.setzeBodyKlasse('kgv-font-large', this.grosseSchrift());
  }

  /**
   * Schaltet den stärkeren Kontrast für die aktuelle Sitzung.
   */
  protected schalteKontrast(): void {
    this.hoherKontrast.update((istAktiv) => !istAktiv);
    this.setzeBodyKlasse('kgv-high-contrast', this.hoherKontrast());
  }

  /**
   * Reduziert Bewegungen und Animationen für die aktuelle Sitzung.
   */
  protected schalteBewegung(): void {
    this.reduzierteBewegung.update((istAktiv) => !istAktiv);
    this.setzeBodyKlasse('kgv-reduced-motion', this.reduzierteBewegung());
  }

  /**
   * Setzt oder entfernt eine globale Body-Klasse im Browser.
   */
  private setzeBodyKlasse(klasse: string, istAktiv: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.body.classList.toggle(klasse, istAktiv);
  }
}
