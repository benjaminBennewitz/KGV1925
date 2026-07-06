/* src/app/app.ts */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { AccessibilityModeComponent } from './shared/components/accessibility-mode/accessibility-mode.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ScrollToTopComponent } from './shared/components/scroll-to-top/scroll-to-top.component';
import { RevealService } from './shared/services/reveal.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AccessibilityModeComponent, ScrollToTopComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly revealService = inject(RevealService);
  private readonly router = inject(Router);
  private initialeNavigationAktiv = true;

  /**
   * Initialisiert globale Reveal-Animationen und kontrolliert die Scrollposition bei Routenwechseln.
   */
  public ngOnInit(): void {
    this.deaktiviereBrowserScrollWiederherstellung();
    this.revealService.initialisiere();

    this.router.events.subscribe((ereignis) => {
      if (ereignis instanceof NavigationStart) {
        this.starteRoutenwechsel(ereignis.url);
        return;
      }

      if (ereignis instanceof NavigationEnd) {
        this.beendeRoutenwechsel(ereignis.urlAfterRedirects);
        return;
      }

      if (ereignis instanceof NavigationCancel || ereignis instanceof NavigationError) {
        this.beendeAbgebrochenenRoutenwechsel();
      }
    });
  }

  /**
   * Blendet nur echte In-App-Routenwechsel aus und setzt die Scrollposition unsichtbar zurück.
   */
  private starteRoutenwechsel(zielUrl: string): void {
    if (!this.istBrowser() || this.initialeNavigationAktiv || this.istSprungmarkenNavigation(zielUrl)) {
      return;
    }

    const root = this.document.documentElement;
    const fenster = this.document.defaultView;

    root.classList.add('kgv-route-switching', 'kgv-route-switching--instant');
    this.springeZumSeitenanfang();

    fenster?.requestAnimationFrame(() => {
      root.classList.remove('kgv-route-switching--instant');
    });
  }

  /**
   * Zeigt die neue Route erst nach Top-Reset weich wieder an und aktualisiert danach die Reveals.
   */
  private beendeRoutenwechsel(zielUrl: string): void {
    if (!this.istBrowser()) {
      return;
    }

    if (this.initialeNavigationAktiv) {
      this.beendeInitialeNavigation(zielUrl);
      return;
    }

    if (this.istSprungmarkenNavigation(zielUrl)) {
      this.beendeRoutenTransition();
      this.revealService.aktualisiere();
      return;
    }

    const fenster = this.document.defaultView;

    if (!fenster) {
      this.beendeRoutenTransition();
      this.revealService.aktualisiere();
      return;
    }

    this.springeZumSeitenanfang();

    fenster.requestAnimationFrame(() => {
      this.springeZumSeitenanfang();

      fenster.requestAnimationFrame(() => {
        this.springeZumSeitenanfang();
        this.beendeRoutenTransition();
        this.revealService.aktualisiere();

        fenster.setTimeout(() => {
          this.revealService.aktualisiere();
        }, 90);
      });
    });
  }


  /**
   * Beendet den ersten Router-Durchlauf ohne sichtbare Route-Transition beim Browser-Reload.
   */
  private beendeInitialeNavigation(zielUrl: string): void {
    this.initialeNavigationAktiv = false;
    this.beendeRoutenTransition();

    if (!this.istSprungmarkenNavigation(zielUrl)) {
      this.springeZumSeitenanfang();
    }

    this.revealService.aktualisiere();

    const fenster = this.document.defaultView;

    fenster?.setTimeout(() => {
      this.revealService.aktualisiere();
    }, 120);
  }

  /**
   * Hebt die Transition wieder auf, falls Angular eine Navigation abbricht.
   */
  private beendeAbgebrochenenRoutenwechsel(): void {
    if (!this.istBrowser()) {
      return;
    }

    this.beendeRoutenTransition();
  }

  /**
   * Entfernt die Hilfsklassen für den sichtbaren Routenwechsel.
   */
  private beendeRoutenTransition(): void {
    this.document.documentElement.classList.remove('kgv-route-switching', 'kgv-route-switching--instant');
  }

  /**
   * Prüft, ob die Navigation gezielt zu einer Sprungmarke führen soll.
   */
  private istSprungmarkenNavigation(url: string): boolean {
    return url.includes('#');
  }

  /**
   * Springt hart an den Seitenanfang, ohne eine sichtbare Scrollbewegung auszulösen.
   */
  private springeZumSeitenanfang(): void {
    const fenster = this.document.defaultView;

    fenster?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    this.document.documentElement.scrollTop = 0;
    this.document.body.scrollTop = 0;
  }

  /**
   * Verhindert automatische Scrollwiederherstellung des Browsers zwischen Seiten.
   */
  private deaktiviereBrowserScrollWiederherstellung(): void {
    const fenster = this.document.defaultView;

    if (!fenster || !('scrollRestoration' in fenster.history)) {
      return;
    }

    fenster.history.scrollRestoration = 'manual';
  }

  /**
   * Prüft, ob Browser-APIs sicher verfügbar sind.
   */
  private istBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
