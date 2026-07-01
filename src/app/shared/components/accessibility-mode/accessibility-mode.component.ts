/* src/app/shared/components/accessibility-mode/accessibility-mode.component.ts */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';

type BewegungsModus = 'voll' | 'reduziert' | 'aus';
type KomfortModus = 'standard' | 'neuro' | 'ruhig';
type KontrastModus = 'normal' | 'hoch';
type FarbModus = 'standard' | 'rot-gruen-1' | 'rot-gruen-2' | 'blau-gelb' | 'graustufen';
type LupenModus = 'aus' | 'an';
type SchriftModus = 'normal' | 'gross';

interface AccessEinstellungen {
  bewegung: BewegungsModus;
  komfort: KomfortModus;
  kontrast: KontrastModus;
  farbe: FarbModus;
  lupe: LupenModus;
  schrift: SchriftModus;
}

interface LupenPunkt {
  x: number;
  y: number;
}

@Component({
  selector: 'app-accessibility-mode',
  templateUrl: './accessibility-mode.component.html',
  styleUrl: './accessibility-mode.component.scss',
})
export class AccessibilityModeComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'kgv1925_accessibility_v1';
  private readonly feinzeigerQuery = '(pointer: fine)';
  private readonly lupenZoom = 1.9;
  private readonly lupenBreite = 450;
  private readonly lupenHoehe = 150;
  private readonly lupenRandabstand = 12;
  private readonly lupenZeigerabstand = 26;
  private readonly erlaubteWerte: { [Feld in keyof AccessEinstellungen]: readonly AccessEinstellungen[Feld][] } = {
    bewegung: ['voll', 'reduziert', 'aus'],
    komfort: ['standard', 'neuro', 'ruhig'],
    kontrast: ['normal', 'hoch'],
    farbe: ['standard', 'rot-gruen-1', 'rot-gruen-2', 'blau-gelb', 'graustufen'],
    lupe: ['aus', 'an'],
    schrift: ['normal', 'gross'],
  };

  protected readonly istGeoeffnet = signal(false);
  protected readonly einstellungen = signal<AccessEinstellungen>(this.erstelleStandardEinstellungen());

  private lupenElement: HTMLElement | null = null;
  private lupenSeitenKopie: HTMLElement | null = null;
  private lupenFixierteKopie: HTMLElement | null = null;
  private lupenBereit = false;
  private lupenTicking = false;
  private letzterLupenPunkt: LupenPunkt | null = null;

  private readonly handleLupenPointerMove = (event: PointerEvent): void => {
    this.verarbeiteLupenZeigerbewegung(event);
  };

  private readonly handleLupenPointerLeave = (): void => {
    this.blendeBildschirmlupeAus();
  };

  private readonly handleLupenScroll = (): void => {
    this.planeLupenAktualisierung();
  };

  private readonly handleLupenResize = (): void => {
    this.baueBildschirmlupeNeuAuf();
  };

  /**
   * Lädt gespeicherte Einstellungen und setzt die Ansicht beim Start.
   */
  public ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.aktualisiereEinstellungen(this.ladeGespeicherteEinstellungen(), false);
  }

  /**
   * Entfernt globale Listener und temporäre Lupenebenen beim Verlassen der Komponente.
   */
  public ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.deaktiviereBildschirmlupe();
    this.entferneBildschirmlupe();
  }

  /**
   * Öffnet oder schließt das Bedienfeld für die Barrierefreiheitsoptionen.
   */
  protected schalteBedienfeld(): void {
    this.istGeoeffnet.update((istOffen) => !istOffen);

    if (this.istGeoeffnet()) {
      this.blendeBildschirmlupeAus();
      this.fokussiereErsteOption();
    }
  }

  /**
   * Schließt das Bedienfeld.
   */
  protected schliesseBedienfeld(): void {
    this.istGeoeffnet.set(false);
  }

  /**
   * Setzt den Bewegungsmodus für Animationen und Scrollverhalten.
   */
  protected setzeBewegung(wert: BewegungsModus): void {
    this.aktualisiereEinstellungen({ ...this.einstellungen(), bewegung: wert }, true);
  }

  /**
   * Setzt den Komfortmodus für ruhigere oder reizärmere Darstellung.
   */
  protected setzeKomfort(wert: KomfortModus): void {
    const bewegung = wert === 'standard' ? this.einstellungen().bewegung : 'reduziert';
    this.aktualisiereEinstellungen({ ...this.einstellungen(), komfort: wert, bewegung }, true);
  }

  /**
   * Setzt den Kontrastmodus.
   */
  protected setzeKontrast(wert: KontrastModus): void {
    this.aktualisiereEinstellungen({ ...this.einstellungen(), kontrast: wert }, true);
  }

  /**
   * Setzt den Farbmodus für unterschiedliche Farbwahrnehmungen.
   */
  protected setzeFarbe(wert: FarbModus): void {
    this.aktualisiereEinstellungen({ ...this.einstellungen(), farbe: wert }, true);
  }

  /**
   * Setzt den Lupenmodus.
   */
  protected setzeLupe(wert: LupenModus): void {
    this.aktualisiereEinstellungen({ ...this.einstellungen(), lupe: wert }, true);
  }

  /**
   * Setzt den Schriftgrößenmodus.
   */
  protected setzeSchrift(wert: SchriftModus): void {
    this.aktualisiereEinstellungen({ ...this.einstellungen(), schrift: wert }, true);
  }

  /**
   * Aktiviert eine ruhige Sofortansicht mit reduziertem visuellen Stress.
   */
  protected aktiviereRuhigeAnsicht(): void {
    this.aktualisiereEinstellungen({ ...this.einstellungen(), bewegung: 'aus', komfort: 'ruhig', kontrast: 'hoch', farbe: 'standard', schrift: 'gross' }, true);
  }

  /**
   * Setzt alle Barrierefreiheitsoptionen auf sinnvolle Standardwerte zurück.
   */
  protected setzeZurueck(): void {
    this.aktualisiereEinstellungen(this.erstelleStandardEinstellungen(), true);
  }

  /**
   * Prüft, ob ein Bewegungsmodus aktiv ist.
   */
  protected istBewegungAktiv(wert: BewegungsModus): boolean {
    return this.einstellungen().bewegung === wert;
  }

  /**
   * Prüft, ob ein Komfortmodus aktiv ist.
   */
  protected istKomfortAktiv(wert: KomfortModus): boolean {
    return this.einstellungen().komfort === wert;
  }

  /**
   * Prüft, ob ein Kontrastmodus aktiv ist.
   */
  protected istKontrastAktiv(wert: KontrastModus): boolean {
    return this.einstellungen().kontrast === wert;
  }

  /**
   * Prüft, ob ein Farbmodus aktiv ist.
   */
  protected istFarbeAktiv(wert: FarbModus): boolean {
    return this.einstellungen().farbe === wert;
  }

  /**
   * Prüft, ob ein Lupenmodus aktiv ist.
   */
  protected istLupeAktiv(wert: LupenModus): boolean {
    return this.einstellungen().lupe === wert;
  }

  /**
   * Prüft, ob ein Schriftmodus aktiv ist.
   */
  protected istSchriftAktiv(wert: SchriftModus): boolean {
    return this.einstellungen().schrift === wert;
  }

  /**
   * Schließt das Bedienfeld bei Klick außerhalb der Komponente.
   */
  @HostListener('document:click', ['$event'])
  protected schliesseBeiAussenklick(event: MouseEvent): void {
    if (!this.istGeoeffnet()) {
      return;
    }

    const ziel = event.target instanceof Node ? event.target : null;

    if (!ziel || this.elementRef.nativeElement.contains(ziel)) {
      return;
    }

    this.schliesseBedienfeld();
  }

  /**
   * Verwaltet Escape und Tab-Fokus innerhalb des geöffneten Bedienfelds.
   */
  @HostListener('document:keydown', ['$event'])
  protected verarbeiteTastatur(event: KeyboardEvent): void {
    if (!this.istGeoeffnet()) {
      return;
    }

    if (event.key === 'Escape') {
      this.schliesseBedienfeld();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    this.halteFokusImBedienfeld(event);
  }

  /**
   * Aktualisiert Einstellungen, globale Attribute und optional den LocalStorage.
   */
  private aktualisiereEinstellungen(einstellungen: AccessEinstellungen, sollSpeichern: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const normalisierteEinstellungen = this.normalisiereEinstellungen(einstellungen);
    this.einstellungen.set(normalisierteEinstellungen);
    this.uebertrageEinstellungenAufHtml(normalisierteEinstellungen);
    this.synchronisiereBildschirmlupe(normalisierteEinstellungen);

    if (sollSpeichern) {
      this.speichereEinstellungen(normalisierteEinstellungen);
    }
  }

  /**
   * Überträgt die aktiven Einstellungen auf das HTML-Element.
   */
  private uebertrageEinstellungenAufHtml(einstellungen: AccessEinstellungen): void {
    const rootElement = this.document.documentElement;
    rootElement.setAttribute('data-kgv-motion', einstellungen.bewegung);
    rootElement.setAttribute('data-kgv-comfort', einstellungen.komfort);
    rootElement.setAttribute('data-kgv-contrast', einstellungen.kontrast);
    rootElement.setAttribute('data-kgv-color', einstellungen.farbe);
    rootElement.setAttribute('data-kgv-magnifier', einstellungen.lupe);
    rootElement.setAttribute('data-kgv-font', einstellungen.schrift);
  }

  /**
   * Speichert die aktuellen Einstellungen lokal im Browser.
   */
  private speichereEinstellungen(einstellungen: AccessEinstellungen): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(einstellungen));
    } catch (error) {}
  }

  /**
   * Lädt gespeicherte Einstellungen oder erstellt sichere Standardwerte.
   */
  private ladeGespeicherteEinstellungen(): AccessEinstellungen {
    try {
      const gespeicherteEinstellungen = JSON.parse(localStorage.getItem(this.storageKey) || '{}') as Partial<AccessEinstellungen>;
      return this.normalisiereEinstellungen(gespeicherteEinstellungen);
    } catch (error) {
      return this.erstelleStandardEinstellungen();
    }
  }

  /**
   * Erstellt Standardwerte und berücksichtigt die Systemeinstellung für reduzierte Bewegung.
   */
  private erstelleStandardEinstellungen(): AccessEinstellungen {
    if (!isPlatformBrowser(this.platformId)) {
      return {
        bewegung: 'voll',
        komfort: 'standard',
        kontrast: 'normal',
        farbe: 'standard',
        lupe: 'aus',
        schrift: 'normal',
      };
    }

    const bevorzugtReduzierteBewegung = this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;

    return {
      bewegung: bevorzugtReduzierteBewegung ? 'reduziert' : 'voll',
      komfort: 'standard',
      kontrast: 'normal',
      farbe: 'standard',
      lupe: 'aus',
      schrift: 'normal',
    };
  }

  /**
   * Normalisiert unbekannte Werte aus dem LocalStorage.
   */
  private normalisiereEinstellungen(einstellungen: Partial<AccessEinstellungen>): AccessEinstellungen {
    const fallback = this.erstelleStandardEinstellungen();

    return {
      bewegung: this.normalisiereWert('bewegung', einstellungen.bewegung, fallback.bewegung),
      komfort: this.normalisiereWert('komfort', einstellungen.komfort, fallback.komfort),
      kontrast: this.normalisiereWert('kontrast', einstellungen.kontrast, fallback.kontrast),
      farbe: this.normalisiereWert('farbe', einstellungen.farbe, fallback.farbe),
      lupe: this.normalisiereWert('lupe', einstellungen.lupe, fallback.lupe),
      schrift: this.normalisiereWert('schrift', einstellungen.schrift, fallback.schrift),
    };
  }

  /**
   * Prüft einen Einzelwert gegen die erlaubten Werte eines Einstellungsfelds.
   */
  private normalisiereWert<Feld extends keyof AccessEinstellungen>(feld: Feld, wert: unknown, fallback: AccessEinstellungen[Feld]): AccessEinstellungen[Feld] {
    const erlaubteWerte = this.erlaubteWerte[feld] as readonly string[];

    if (typeof wert === 'string' && erlaubteWerte.includes(wert)) {
      return wert as AccessEinstellungen[Feld];
    }

    return fallback;
  }

  /**
   * Fokussiert die erste Option im Panel nach dem Öffnen.
   */
  private fokussiereErsteOption(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.defaultView?.setTimeout(() => {
      const ersteOption = this.elementRef.nativeElement.querySelector<HTMLButtonElement>('.accessibility__option');
      ersteOption?.focus();
    }, 0);
  }

  /**
   * Hält den Tastaturfokus im geöffneten Bedienfeld.
   */
  private halteFokusImBedienfeld(event: KeyboardEvent): void {
    const fokussierbareElemente = Array.from(this.elementRef.nativeElement.querySelectorAll<HTMLElement>('.accessibility__panel button, .accessibility__panel [href], .accessibility__panel [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute('disabled'));

    if (fokussierbareElemente.length === 0) {
      return;
    }

    const erstesElement = fokussierbareElemente[0];
    const letztesElement = fokussierbareElemente[fokussierbareElemente.length - 1];
    const aktivesElement = this.document.activeElement;

    if (event.shiftKey && aktivesElement === erstesElement) {
      event.preventDefault();
      letztesElement.focus();
    }

    if (!event.shiftKey && aktivesElement === letztesElement) {
      event.preventDefault();
      erstesElement.focus();
    }
  }

  /**
   * Aktiviert oder deaktiviert die Bildschirmlupe anhand der Einstellungen.
   */
  private synchronisiereBildschirmlupe(einstellungen: AccessEinstellungen): void {
    const fenster = this.document.defaultView;
    const kannLupeNutzen = Boolean(fenster?.matchMedia(this.feinzeigerQuery).matches) && einstellungen.lupe === 'an';

    this.document.documentElement.classList.toggle('kgv-screen-magnifier-enabled', kannLupeNutzen);

    if (kannLupeNutzen && !this.lupenBereit) {
      this.aktiviereBildschirmlupe();
      return;
    }

    if (!kannLupeNutzen && this.lupenBereit) {
      this.deaktiviereBildschirmlupe();
      this.entferneBildschirmlupe();
    }
  }

  /**
   * Registriert die Ereignisse für die Bildschirmlupe.
   */
  private aktiviereBildschirmlupe(): void {
    const fenster = this.document.defaultView;

    if (!fenster || this.lupenBereit) {
      return;
    }

    this.lupenBereit = true;
    this.document.addEventListener('pointermove', this.handleLupenPointerMove, { passive: true });
    this.document.addEventListener('pointerleave', this.handleLupenPointerLeave, { passive: true });
    fenster.addEventListener('scroll', this.handleLupenScroll, { passive: true });
    fenster.addEventListener('resize', this.handleLupenResize, { passive: true });
  }

  /**
   * Entfernt die Ereignisse für die Bildschirmlupe.
   */
  private deaktiviereBildschirmlupe(): void {
    const fenster = this.document.defaultView;

    if (!fenster || !this.lupenBereit) {
      return;
    }

    this.lupenBereit = false;
    this.letzterLupenPunkt = null;
    this.document.removeEventListener('pointermove', this.handleLupenPointerMove);
    this.document.removeEventListener('pointerleave', this.handleLupenPointerLeave);
    fenster.removeEventListener('scroll', this.handleLupenScroll);
    fenster.removeEventListener('resize', this.handleLupenResize);
  }

  /**
   * Aktualisiert die Lupenposition anhand der Pointerposition.
   */
  private verarbeiteLupenZeigerbewegung(event: PointerEvent): void {
    if (!this.lupenBereit || event.pointerType === 'touch') {
      this.blendeBildschirmlupeAus();
      return;
    }

    const zielElement = event.target instanceof Element ? event.target : null;

    if (zielElement?.closest('app-accessibility-mode, app-scroll-to-top, .kgv-screen-magnifier')) {
      this.blendeBildschirmlupeAus();
      return;
    }

    this.letzterLupenPunkt = { x: event.clientX, y: event.clientY };
    this.planeLupenAktualisierung();
  }

  /**
   * Plant ein performantes Lupen-Update.
   */
  private planeLupenAktualisierung(): void {
    const fenster = this.document.defaultView;

    if (!fenster || !this.lupenBereit || !this.letzterLupenPunkt || this.lupenTicking) {
      return;
    }

    this.lupenTicking = true;
    fenster.requestAnimationFrame(() => {
      this.zeichneBildschirmlupe();
      this.lupenTicking = false;
    });
  }

  /**
   * Erzwingt einen frischen Lupenklon beim nächsten Update.
   */
  private baueBildschirmlupeNeuAuf(): void {
    if (!this.lupenBereit) {
      return;
    }

    this.entferneBildschirmlupe();
    this.planeLupenAktualisierung();
  }

  /**
   * Rendert die Bildschirmlupe an der aktuellen Pointerposition.
   */
  private zeichneBildschirmlupe(): void {
    const fenster = this.document.defaultView;

    if (!fenster || !this.letzterLupenPunkt) {
      return;
    }

    this.stelleBildschirmlupeSicher();

    if (!this.lupenElement || !this.lupenSeitenKopie) {
      return;
    }

    const lupenGroesse = this.ermittleLupenGroesse();
    const seitenX = this.letzterLupenPunkt.x + fenster.scrollX;
    const seitenY = this.letzterLupenPunkt.y + fenster.scrollY;
    const lupenX = this.begrenzeZahl(this.letzterLupenPunkt.x - lupenGroesse.breite / 2, this.lupenRandabstand, fenster.innerWidth - lupenGroesse.breite - this.lupenRandabstand);
    const bevorzugtesLupenY = this.letzterLupenPunkt.y - lupenGroesse.hoehe - this.lupenZeigerabstand;
    const lupenY = this.begrenzeZahl(bevorzugtesLupenY, this.lupenRandabstand, fenster.innerHeight - lupenGroesse.hoehe - this.lupenRandabstand);
    const zeigerAbstandX = this.letzterLupenPunkt.x - lupenX;
    const zeigerAbstandY = this.letzterLupenPunkt.y - lupenY;
    const kopieX = -(seitenX * this.lupenZoom - zeigerAbstandX);
    const kopieY = -(seitenY * this.lupenZoom - zeigerAbstandY);

    this.lupenElement.style.width = `${lupenGroesse.breite}px`;
    this.lupenElement.style.height = `${lupenGroesse.hoehe}px`;
    this.lupenElement.style.transform = `translate3d(${lupenX}px, ${lupenY}px, 0)`;
    this.lupenSeitenKopie.style.width = `${this.document.documentElement.scrollWidth}px`;
    this.lupenSeitenKopie.style.minHeight = `${this.document.documentElement.scrollHeight}px`;
    this.lupenSeitenKopie.style.transform = `translate3d(${kopieX}px, ${kopieY}px, 0) scale(${this.lupenZoom})`;

    if (this.lupenFixierteKopie) {
      const fixierteKopieX = -(this.letzterLupenPunkt.x * this.lupenZoom - zeigerAbstandX);
      const fixierteKopieY = -(this.letzterLupenPunkt.y * this.lupenZoom - zeigerAbstandY);
      this.lupenFixierteKopie.style.width = `${fenster.innerWidth}px`;
      this.lupenFixierteKopie.style.height = `${fenster.innerHeight}px`;
      this.lupenFixierteKopie.style.transform = `translate3d(${fixierteKopieX}px, ${fixierteKopieY}px, 0) scale(${this.lupenZoom})`;
    }

    this.lupenElement.classList.add('is-visible');
  }

  /**
   * Erstellt die Lupenebene inklusive statischem Seitenklon.
   */
  private stelleBildschirmlupeSicher(): void {
    if (this.lupenElement && this.lupenSeitenKopie) {
      return;
    }

    const seitenKopie = this.document.createElement('div');
    seitenKopie.className = 'kgv-screen-magnifier-copy kgv-screen-magnifier-copy--page';
    seitenKopie.setAttribute('aria-hidden', 'true');

    Array.from(this.document.body.children).forEach((kind) => {
      if (!(kind instanceof HTMLElement)) {
        return;
      }

      if (kind.matches('.kgv-screen-magnifier')) {
        return;
      }

      seitenKopie.appendChild(kind.cloneNode(true));
    });

    this.bereinigeLupenKopie(seitenKopie, true);

    const fixierteKopie = this.document.createElement('div');
    fixierteKopie.className = 'kgv-screen-magnifier-copy kgv-screen-magnifier-copy--fixed';
    fixierteKopie.setAttribute('aria-hidden', 'true');

    this.ermittleFixierteLupenQuellen().forEach((element) => {
      fixierteKopie.appendChild(element.cloneNode(true));
    });

    this.bereinigeLupenKopie(fixierteKopie, false);
    this.bereiteFixierteLupenEbeneVor(fixierteKopie);

    this.lupenElement = this.document.createElement('div');
    this.lupenElement.className = 'kgv-screen-magnifier';
    this.lupenElement.setAttribute('aria-hidden', 'true');
    this.lupenElement.appendChild(seitenKopie);

    if (fixierteKopie.children.length > 0) {
      this.lupenElement.appendChild(fixierteKopie);
      this.lupenFixierteKopie = fixierteKopie;
    }

    this.lupenSeitenKopie = seitenKopie;
    this.document.body.appendChild(this.lupenElement);
  }

  /**
   * Entfernt störende Elemente aus einem Lupenklon.
   */
  private bereinigeLupenKopie(kopie: HTMLElement, sollFixierteElementeEntfernen: boolean): void {
    kopie.querySelectorAll('script, iframe, app-accessibility-mode, app-scroll-to-top, .kgv-screen-magnifier').forEach((element) => element.remove());

    if (sollFixierteElementeEntfernen) {
      kopie.querySelectorAll('app-header, header, [role="banner"]').forEach((element) => element.remove());
    }

    kopie.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
    kopie.querySelectorAll('video').forEach((video) => {
      if (!(video instanceof HTMLVideoElement)) {
        return;
      }

      video.pause();
      video.removeAttribute('autoplay');
    });
  }

  /**
   * Sammelt fixierte Header-Elemente für eine separate Lupenebene.
   */
  private ermittleFixierteLupenQuellen(): HTMLElement[] {
    const kandidaten = Array.from(this.document.querySelectorAll('app-header, header, [role="banner"]')).filter((element): element is HTMLElement => element instanceof HTMLElement);
    const eindeutigeElemente: HTMLElement[] = [];

    kandidaten.forEach((element) => {
      if (eindeutigeElemente.some((auswahl) => auswahl.contains(element))) {
        return;
      }

      const verschachtelterIndex = eindeutigeElemente.findIndex((auswahl) => element.contains(auswahl));

      if (verschachtelterIndex !== -1) {
        eindeutigeElemente.splice(verschachtelterIndex, 1);
      }

      eindeutigeElemente.push(element);
    });

    return eindeutigeElemente;
  }

  /**
   * Bereitet fixierte Kopien für die Lupenansicht vor.
   */
  private bereiteFixierteLupenEbeneVor(fixierteKopie: HTMLElement): void {
    fixierteKopie.querySelectorAll('app-header, header, [role="banner"]').forEach((element) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      element.style.position = 'absolute';
      element.style.top = '0';
      element.style.left = '0';
      element.style.right = '0';
      element.style.width = '100%';
      element.style.margin = '0';
      element.style.transform = 'none';
      element.style.zIndex = '3';
    });
  }

  /**
   * Blendet die Lupenebene aus, ohne die Einstellung zu ändern.
   */
  private blendeBildschirmlupeAus(): void {
    this.lupenElement?.classList.remove('is-visible');
  }

  /**
   * Entfernt die Lupenebene vollständig aus dem DOM.
   */
  private entferneBildschirmlupe(): void {
    this.lupenElement?.remove();
    this.lupenElement = null;
    this.lupenSeitenKopie = null;
    this.lupenFixierteKopie = null;
  }

  /**
   * Ermittelt die responsive Größe der Bildschirmlupe.
   */
  private ermittleLupenGroesse(): { breite: number; hoehe: number } {
    const fenster = this.document.defaultView;
    const viewportBreite = fenster?.innerWidth ?? this.lupenBreite;

    return {
      breite: Math.min(this.lupenBreite, Math.max(210, Math.round(viewportBreite * 0.46))),
      hoehe: this.lupenHoehe,
    };
  }

  /**
   * Begrenzt einen Zahlenwert auf einen sicheren Bereich.
   */
  private begrenzeZahl(wert: number, minimum: number, maximum: number): number {
    if (maximum < minimum) {
      return minimum;
    }

    return Math.min(Math.max(wert, minimum), maximum);
  }
}
