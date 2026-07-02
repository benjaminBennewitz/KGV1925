/* src/app/shared/services/mitglieder-session.service.ts */

import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type MitgliederRolle = 'Mitglied' | 'Vorstand' | 'Admin';

export type ZaehlerTyp = 'strom' | 'wasser';

export interface MitgliederSession {
  benutzername: string;
  gartennummer: string;
  vorname: string;
  nachname: string;
  rolle: MitgliederRolle;
  istAdmin: boolean;
}

export interface EingereichterZaehlerstand {
  id: string;
  gartennummer: string;
  name: string;
  typ: ZaehlerTyp;
  wert: string;
  datum: string;
  status: 'neu' | 'gesehen';
}

@Injectable({
  providedIn: 'root',
})
export class MitgliederSessionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly istBrowser = isPlatformBrowser(this.platformId);
  private readonly sessionKey = 'kgv1925.mitgliederbereich.session';
  private readonly zaehlerKey = 'kgv1925.mitgliederbereich.zaehlerstaende';
  private readonly sessionSignal = signal<MitgliederSession | null>(this.leseSession());
  private readonly zaehlerstaendeSignal = signal<EingereichterZaehlerstand[]>(this.leseZaehlerstaende());

  readonly session = this.sessionSignal.asReadonly();
  readonly zaehlerstaende = this.zaehlerstaendeSignal.asReadonly();

  /**
   * Speichert die aktuelle Sitzung im lokalen Browser-Speicher.
   */
  anmelden(session: MitgliederSession): void {
    this.sessionSignal.set(session);

    if (!this.istBrowser) {
      return;
    }

    localStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  /**
   * Entfernt die gespeicherte Sitzung aus dem lokalen Browser-Speicher.
   */
  abmelden(): void {
    this.sessionSignal.set(null);

    if (!this.istBrowser) {
      return;
    }

    localStorage.removeItem(this.sessionKey);
  }

  /**
   * Speichert einen neuen Zählerstand für die Admin-Übersicht.
   */
  zaehlerstandEintragen(eintrag: EingereichterZaehlerstand): void {
    const neueListe = [eintrag, ...this.zaehlerstaendeSignal()];
    this.zaehlerstaendeSignal.set(neueListe);

    if (!this.istBrowser) {
      return;
    }

    localStorage.setItem(this.zaehlerKey, JSON.stringify(neueListe));
  }

  /**
   * Liest eine gespeicherte Sitzung aus dem lokalen Browser-Speicher.
   */
  private leseSession(): MitgliederSession | null {
    if (!this.istBrowser) {
      return null;
    }

    const gespeicherteSession = localStorage.getItem(this.sessionKey);

    if (!gespeicherteSession) {
      return null;
    }

    try {
      return JSON.parse(gespeicherteSession) as MitgliederSession;
    } catch {
      localStorage.removeItem(this.sessionKey);
      return null;
    }
  }

  /**
   * Liest gespeicherte Zählerstände aus dem lokalen Browser-Speicher.
   */
  private leseZaehlerstaende(): EingereichterZaehlerstand[] {
    if (!this.istBrowser) {
      return [];
    }

    const gespeicherteZaehlerstaende = localStorage.getItem(this.zaehlerKey);

    if (!gespeicherteZaehlerstaende) {
      return this.erstelleStartZaehlerstaende();
    }

    try {
      return JSON.parse(gespeicherteZaehlerstaende) as EingereichterZaehlerstand[];
    } catch {
      localStorage.removeItem(this.zaehlerKey);
      return [];
    }
  }


  /**
   * Erstellt beispielhafte Eingangsmeldungen für die Admin-Ansicht.
   */
  private erstelleStartZaehlerstaende(): EingereichterZaehlerstand[] {
    return [
      {
        id: 'strom-25-start',
        gartennummer: '25',
        name: 'Benjamin Bennewitz',
        typ: 'strom',
        wert: '1604',
        datum: '02.07.2026, 18:20',
        status: 'neu',
      },
      {
        id: 'wasser-25-start',
        gartennummer: '25',
        name: 'Benjamin Bennewitz',
        typ: 'wasser',
        wert: '51',
        datum: '02.07.2026, 18:22',
        status: 'neu',
      },
      {
        id: 'wasser-42-start',
        gartennummer: '42',
        name: 'Lars Andersen',
        typ: 'wasser',
        wert: '66',
        datum: '01.07.2026, 17:45',
        status: 'neu',
      },
    ];
  }

}
