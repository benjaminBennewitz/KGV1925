/* src/app/shared/services/reveal.service.ts */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RevealService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly revealSelector = [
    '[data-kgv-reveal]',
    '.kgv-page > section',
    '.kgv-page > article',
    '.kgv-page > aside',
    '.kgv-section',
    '.kgv-section-header',
    '.kgv-card',
    '.feature-card',
    '.news-item',
    '.stats__item',
    '.hero__content > *',
    '.hero__visual',
    '.event-card',
  ].join(',');

  private observer: IntersectionObserver | null = null;
  private readonly beobachteteElemente = new WeakSet<HTMLElement>();

  /**
   * Aktiviert das Reveal-System nach dem Browser-Start.
   */
  public initialisiere(): void {
    if (!this.istBrowser()) {
      return;
    }

    this.document.documentElement.classList.add('kgv-reveal-ready');
    this.aktualisiere();
    this.planeNachgelagerteAktualisierung(90);
    this.planeNachgelagerteAktualisierung(220);
  }

  /**
   * Sucht neue Reveal-Elemente und bindet sie an den IntersectionObserver.
   */
  public aktualisiere(): void {
    if (!this.istBrowser()) {
      return;
    }

    const fenster = this.document.defaultView;

    if (!fenster) {
      return;
    }

    fenster.requestAnimationFrame(() => {
      this.aktualisiereRevealElemente();
    });
  }

  /**
   * Prüft, ob Browser-APIs sicher genutzt werden können.
   */
  private istBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Plant zusätzliche Updates nach dem initialen Routenrendering.
   */
  private planeNachgelagerteAktualisierung(verzoegerungMs: number): void {
    const fenster = this.document.defaultView;

    if (!fenster) {
      return;
    }

    fenster.setTimeout(() => {
      this.aktualisiere();
    }, verzoegerungMs);
  }

  /**
   * Verbindet alle noch nicht erfassten Reveal-Elemente mit dem Observer.
   */
  private aktualisiereRevealElemente(): void {
    const elemente = this.findeRevealElemente();

    if (!elemente.length) {
      return;
    }

    if (this.sollBewegungDirektAnzeigen()) {
      elemente.forEach((element) => this.zeigeDirekt(element));
      return;
    }

    const observer = this.holeObserver();

    if (!observer) {
      elemente.forEach((element) => this.zeigeDirekt(element));
      return;
    }

    elemente.forEach((element) => {
      this.bereiteElementVor(element);
      observer.observe(element);
      this.beobachteteElemente.add(element);
      this.zeigeSichtbaresElement(element, observer);
    });
  }

  /**
   * Gibt alle passenden Reveal-Elemente zurück, die noch nicht beobachtet werden.
   */
  private findeRevealElemente(): HTMLElement[] {
    return Array.from(this.document.querySelectorAll<HTMLElement>(this.revealSelector)).filter((element) => {
      return !this.beobachteteElemente.has(element) && !this.istElementIgnoriert(element);
    });
  }

  /**
   * Prüft, ob ein Element nicht animiert werden soll.
   */
  private istElementIgnoriert(element: HTMLElement): boolean {
    return Boolean(element.closest('app-accessibility-mode, app-scroll-to-top, .kgv-screen-magnifier, .site-footer, [data-kgv-reveal-ignore]'));
  }

  /**
   * Legt Richtung, Delay und Startzustand für ein Reveal-Element fest.
   */
  private bereiteElementVor(element: HTMLElement): void {
    if (!element.hasAttribute('data-kgv-reveal')) {
      element.setAttribute('data-kgv-reveal', this.ermittleRichtung(element));
    }

    const delayMs = this.ermittleDelay(element);
    element.style.setProperty('--kgv-reveal-delay', `${delayMs}ms`);
  }

  /**
   * Ermittelt eine passende Bewegungsrichtung anhand der Elementrolle.
   */
  private ermittleRichtung(element: HTMLElement): string {
    if (element.matches('.hero__visual, .event-card')) {
      return 'right';
    }

    return 'up';
  }

  /**
   * Ermittelt einen dezenten Stagger-Delay für Elemente innerhalb derselben Gruppe.
   */
  private ermittleDelay(element: HTMLElement): number {
    const vorgegebenerDelay = Number(element.dataset['kgvRevealDelay'] ?? '');

    if (Number.isFinite(vorgegebenerDelay) && vorgegebenerDelay > 0) {
      return Math.min(Math.round(vorgegebenerDelay * 0.65), 360);
    }

    const parent = element.parentElement;

    if (!parent) {
      return 0;
    }

    const geschwister = Array.from(parent.children).filter((kind) => kind instanceof HTMLElement && kind.matches(this.revealSelector));
    const index = Math.max(geschwister.indexOf(element), 0);

    return Math.min(index * 70, 280);
  }

  /**
   * Erstellt oder liefert den bestehenden IntersectionObserver.
   */
  private holeObserver(): IntersectionObserver | null {
    const fenster = this.document.defaultView;

    if (!fenster || !('IntersectionObserver' in fenster)) {
      return null;
    }

    if (this.observer) {
      return this.observer;
    }

    this.observer = new fenster.IntersectionObserver(
      (eintraege, beobachter) => {
        eintraege.forEach((eintrag) => {
          if (!eintrag.isIntersecting) {
            return;
          }

          const element = eintrag.target;

          if (!(element instanceof HTMLElement)) {
            return;
          }

          element.classList.add('is-kgv-revealed');
          beobachter.unobserve(element);
        });
      },
      {
        rootMargin: '0px 0px -7% 0px',
        threshold: 0.08,
      },
    );

    return this.observer;
  }

  /**
   * Zeigt bereits sichtbare Elemente direkt im nächsten Frame an.
   */
  private zeigeSichtbaresElement(element: HTMLElement, observer: IntersectionObserver): void {
    if (!this.istElementImViewport(element)) {
      return;
    }

    const fenster = this.document.defaultView;

    if (!fenster) {
      element.classList.add('is-kgv-revealed');
      observer.unobserve(element);
      return;
    }

    fenster.requestAnimationFrame(() => {
      element.classList.add('is-kgv-revealed');
      observer.unobserve(element);
    });
  }

  /**
   * Prüft, ob ein Element schon im sichtbaren Browserbereich liegt.
   */
  private istElementImViewport(element: HTMLElement): boolean {
    const fenster = this.document.defaultView;

    if (!fenster) {
      return false;
    }

    const box = element.getBoundingClientRect();
    const viewportHoehe = fenster.innerHeight || this.document.documentElement.clientHeight;
    const viewportBreite = fenster.innerWidth || this.document.documentElement.clientWidth;

    return box.bottom >= 0 && box.right >= 0 && box.top <= viewportHoehe * 0.96 && box.left <= viewportBreite;
  }

  /**
   * Prüft, ob Bewegungen wegen System- oder Accessibility-Einstellungen vermieden werden sollen.
   */
  private sollBewegungDirektAnzeigen(): boolean {
    const fenster = this.document.defaultView;
    const root = this.document.documentElement;
    const bewegung = root.getAttribute('data-kgv-motion');
    const komfort = root.getAttribute('data-kgv-comfort');
    const systemReduziert = fenster?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;

    return systemReduziert || bewegung === 'reduziert' || bewegung === 'aus' || komfort === 'ruhig';
  }

  /**
   * Macht ein Reveal-Element sofort sichtbar.
   */
  private zeigeDirekt(element: HTMLElement): void {
    this.bereiteElementVor(element);
    element.classList.add('is-kgv-revealed');
    this.beobachteteElemente.add(element);
  }
}
