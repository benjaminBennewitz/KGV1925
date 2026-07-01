/* src/app/shared/components/scroll-to-top/scroll-to-top.component.ts */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.scss',
})
export class ScrollToTopComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  protected readonly istSichtbar = signal(false);

  public constructor() {
    this.router.events.pipe(filter((ereignis) => ereignis instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.scrollZuSeitenanfang('auto');
      this.istSichtbar.set(false);
    });
  }

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
