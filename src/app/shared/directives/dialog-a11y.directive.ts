/* src/app/shared/directives/dialog-a11y.directive.ts */

import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, inject, NgZone, OnDestroy, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appDialogA11y]',
  standalone: true,
})
export class DialogA11yDirective implements AfterViewInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ngZone = inject(NgZone);
  private vorherAktivesElement: HTMLElement | null = null;
  private fokusTimerId: number | null = null;

  @Output() readonly dialogEscape = new EventEmitter<void>();

  /**
   * Merkt sich den vorherigen Fokus und setzt den Startfokus in den Dialog.
   */
  ngAfterViewInit(): void {
    this.vorherAktivesElement = this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null;

    this.ngZone.runOutsideAngular(() => {
      this.fokusTimerId = this.document.defaultView?.setTimeout(() => this.fokussiereStartElement(), 0) ?? null;
    });
  }

  /**
   * Entfernt offene Fokus-Timer und gibt den Fokus an das auslösende Element zurück.
   */
  ngOnDestroy(): void {
    if (this.fokusTimerId !== null) {
      this.document.defaultView?.clearTimeout(this.fokusTimerId);
    }

    this.stelleVorherigenFokusWiederHer();
  }

  /**
   * Schließt den Dialog per Escape und hält die Tab-Navigation innerhalb des Dialogs.
   */
  @HostListener('document:keydown', ['$event'])
  protected pruefeTastatur(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.dialogEscape.emit();
      return;
    }

    if (event.key === 'Tab') {
      this.halteFokusImDialog(event);
    }
  }

  /**
   * Setzt den Fokus auf das erste sinnvolle Element im Dialog.
   */
  private fokussiereStartElement(): void {
    const dialogElement = this.elementRef.nativeElement;
    const fokusZiel = dialogElement.querySelector<HTMLElement>('[autofocus]') ?? this.ermittleFokussierbareElemente()[0] ?? dialogElement;

    fokusZiel.focus({ preventScroll: true });
  }

  /**
   * Verhindert, dass der Fokus beim Tabben aus dem Dialog springt.
   */
  private halteFokusImDialog(event: KeyboardEvent): void {
    const dialogElement = this.elementRef.nativeElement;
    const aktiveElement = this.document.activeElement;
    const fokusElemente = this.ermittleFokussierbareElemente();

    if (!fokusElemente.length) {
      event.preventDefault();
      dialogElement.focus({ preventScroll: true });
      return;
    }

    const erstesFokusElement = fokusElemente[0];
    const letztesFokusElement = fokusElemente[fokusElemente.length - 1];
    const fokusLiegtImDialog = aktiveElement instanceof Node && dialogElement.contains(aktiveElement);

    if (event.shiftKey && (!fokusLiegtImDialog || aktiveElement === erstesFokusElement)) {
      event.preventDefault();
      letztesFokusElement.focus({ preventScroll: true });
      return;
    }

    if (!event.shiftKey && aktiveElement === letztesFokusElement) {
      event.preventDefault();
      erstesFokusElement.focus({ preventScroll: true });
    }
  }

  /**
   * Ermittelt alle aktuell sichtbaren und nutzbaren Fokuselemente innerhalb des Dialogs.
   */
  private ermittleFokussierbareElemente(): HTMLElement[] {
    const fokusSelektor = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    return Array.from(this.elementRef.nativeElement.querySelectorAll<HTMLElement>(fokusSelektor)).filter((element) => this.istFokussierbar(element));
  }

  /**
   * Prüft, ob ein Element sichtbar und nicht für Assistive Technologien versteckt ist.
   */
  private istFokussierbar(element: HTMLElement): boolean {
    const istVersteckt = element.hidden || element.getAttribute('aria-hidden') === 'true';
    const istSichtbar = Boolean(element.getClientRects().length);

    return !istVersteckt && istSichtbar;
  }

  /**
   * Stellt den Fokus wieder her, wenn das auslösende Element noch im Dokument vorhanden ist.
   */
  private stelleVorherigenFokusWiederHer(): void {
    if (!this.vorherAktivesElement || this.vorherAktivesElement === this.document.body || !this.document.body.contains(this.vorherAktivesElement)) {
      return;
    }

    this.vorherAktivesElement.focus({ preventScroll: true });
  }
}
