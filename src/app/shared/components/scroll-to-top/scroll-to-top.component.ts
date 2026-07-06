/* src/app/shared/components/scroll-to-top/scroll-to-top.component.ts */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.scss',
})
export class ScrollToTopComponent {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly istSichtbar = signal(false);

  /**
   * Prüft beim Scrollen, ob der Button sichtbar sein soll.
   */
  @HostListener('window:scroll')
  protected pruefeScrollPosition(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.istSichtbar.set(window.scrollY > 520);
  }

  /**
   * Scrollt zum Seitenanfang und berücksichtigt die aktive Bewegungseinstellung.
   */
  protected scrollNachOben(): void {
    this.scrollZuSeitenanfang(this.ermittleScrollVerhalten());
  }

  /**
   * Führt den eigentlichen Scrollvorgang nur im Browser aus.
   */
  private scrollZuSeitenanfang(verhalten: ScrollBehavior): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: verhalten,
    });
  }

  /**
   * Ermittelt das passende Scrollverhalten aus dem Access-Modus.
   */
  private ermittleScrollVerhalten(): ScrollBehavior {
    const rootElement = this.document.documentElement;
    const bewegung = rootElement.getAttribute('data-kgv-motion');
    const komfort = rootElement.getAttribute('data-kgv-comfort');

    if (bewegung === 'voll' && komfort === 'standard') {
      return 'smooth';
    }

    return 'auto';
  }
}
