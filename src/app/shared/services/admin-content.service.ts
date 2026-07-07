/* src/app/shared/services/admin-content.service.ts */

import { Injectable, computed, signal } from '@angular/core';
import { GARTENWISSEN_BEITRAEGE, GartenwissenBeitrag } from '../data/gartenwissen.data';
import { TERMINE, TerminEintrag } from '../data/termine.data';

export type VereinshausBelegungsArt = 'vermietung' | 'sperrung';

export type KalenderBereich = 'termine' | 'vereinshaus';

export interface KalenderEintrag {
  id: string;
  bereich: KalenderBereich;
  datumISO: string;
  datumEndeISO?: string;
  titel: string;
  kurztext: string;
  zeit: string;
  typ: string;
  kalenderKurz: string;
  akzent: string;
}


export interface VereinshausBelegung {
  id: string;
  datumISO: string;
  datumEndeISO?: string;
  titel: string;
  kurztext: string;
  zeit: string;
  typ: string;
  kalenderKurz: string;
  art: VereinshausBelegungsArt;
}

export interface StartseitenPopup {
  id: string;
  aktiv: boolean;
  kicker: string;
  titel: string;
  text: string;
  datumISO: string;
  gueltigBisISO: string;
  buttonText: string;
  buttonRoute: string;
  bild: string;
  bildAlt: string;
  jahr: string;
}

const VEREINSHAUS_BELEGUNGEN: VereinshausBelegung[] = [
  {
    id: 'vermietung-2026-07-11',
    datumISO: '2026-07-11',
    titel: 'Vermietet',
    kurztext: 'Das Vereinshaus ist an diesem Tag vermietet.',
    zeit: '16:00 bis 23:00 Uhr',
    typ: 'Vermietung',
    kalenderKurz: 'Vermietet',
    art: 'vermietung',
  },
  {
    id: 'sperrung-2026-07-21',
    datumISO: '2026-07-21',
    titel: 'Vereinshaus gesperrt',
    kurztext: 'Das Vereinshaus ist wegen Pflegearbeiten nicht verfügbar.',
    zeit: 'ganztägig',
    typ: 'Sperrung',
    kalenderKurz: 'Gesperrt',
    art: 'sperrung',
  },
  {
    id: 'vermietung-2026-08-08',
    datumISO: '2026-08-08',
    titel: 'Vermietet',
    kurztext: 'Das Vereinshaus ist an diesem Tag vermietet.',
    zeit: '15:00 bis 23:00 Uhr',
    typ: 'Vermietung',
    kalenderKurz: 'Vermietet',
    art: 'vermietung',
  },
  {
    id: 'sperrung-renovierung-2026-08-15',
    datumISO: '2026-08-15',
    datumEndeISO: '2026-08-16',
    titel: 'Renovierung Vereinshaus',
    kurztext: 'Das Vereinshaus ist wegen Renovierungsarbeiten über mehrere Tage gesperrt.',
    zeit: 'ganztägig',
    typ: 'Sperrung',
    kalenderKurz: 'Gesperrt',
    art: 'sperrung',
  },
  {
    id: 'vermietung-2026-09-12',
    datumISO: '2026-09-12',
    titel: 'Vermietet',
    kurztext: 'Das Vereinshaus ist an diesem Tag vermietet.',
    zeit: '15:00 bis 22:00 Uhr',
    typ: 'Vermietung',
    kalenderKurz: 'Vermietet',
    art: 'vermietung',
  },
  {
    id: 'sperrung-2026-12-18',
    datumISO: '2026-12-18',
    titel: 'Vereinshaus gesperrt',
    kurztext: 'Das Vereinshaus ist für den Jahresabschluss vorbereitet und nicht vermietbar.',
    zeit: 'ab 12:00 Uhr',
    typ: 'Sperrung',
    kalenderKurz: 'Gesperrt',
    art: 'sperrung',
  },
];

const STARTSEITEN_POPUPS: StartseitenPopup[] = [
  {
    id: 'naechster-laubenabend-2026-07-03',
    aktiv: true,
    kicker: 'Laubenabend',
    titel: 'Nächster Laubenabend',
    text: 'Am Freitag, den 03.07.2026, laden wir zum nächsten Laubenabend ein. Kommt vorbei, bringt gute Laune mit und lasst uns den Abend gemeinsam auf der Anlage ausklingen.',
    datumISO: '2026-07-03',
    gueltigBisISO: '2026-07-31',
    buttonText: 'Termine ansehen',
    buttonRoute: '/termine',
    bild: '/angular-projects/1925/assets/img/aktuelles/laubenabend-2026.webp',
    bildAlt: 'Gemütlicher Laubenabend im Kleingartenverein mit warmem Licht',
    jahr: '2026',
  },
  {
    id: 'sommerfest-2026',
    aktiv: false,
    kicker: 'Vereinsleben',
    titel: 'Sommerfest 2026',
    text: 'Unser Sommerfest bringt Mitglieder, Familien und Gäste auf der Anlage zusammen. Der Eintrag bleibt als Vorlage erhalten und kann für 2027 erneut veröffentlicht werden.',
    datumISO: '2026-08-22',
    gueltigBisISO: '2026-08-23',
    buttonText: 'Alle Termine öffnen',
    buttonRoute: '/termine',
    bild: '/angular-projects/1925/assets/img/aktuelles/sommerfest-2026.webp',
    bildAlt: 'Sommerfest im Kleingartenverein mit gedeckten Tischen im Grünen',
    jahr: '2026',
  },
];

@Injectable({ providedIn: 'root' })
export class AdminContentService {
  readonly termine = signal<TerminEintrag[]>(this.sortiereTermine(TERMINE));
  readonly vereinshausBelegungen = signal<VereinshausBelegung[]>(this.sortiereVereinshausBelegungen(VEREINSHAUS_BELEGUNGEN));
  readonly gartenwissen = signal<GartenwissenBeitrag[]>([...GARTENWISSEN_BEITRAEGE]);
  readonly startseitenPopups = signal<StartseitenPopup[]>(this.sortiereStartseitenPopups(STARTSEITEN_POPUPS));
  readonly kalenderEintraege = computed(() => this.sortiereKalenderEintraege([
    ...this.termine().map((termin) => this.mappeTerminZuKalenderEintrag(termin)),
    ...this.vereinshausBelegungen().map((belegung) => this.mappeVereinshausZuKalenderEintrag(belegung)),
  ]));



  /**
   * Gibt Kalenderdaten für einen Bereich zurück. Die spätere API kann dadurch einen gemeinsamen Kalender liefern.
   */
  kalenderEintraegeFuerBereich(bereich: KalenderBereich): KalenderEintrag[] {
    return this.kalenderEintraege().filter((eintrag) => eintrag.bereich === bereich);
  }

  /**
   * Speichert einen Vereinstermin lokal und ersetzt einen vorhandenen Eintrag mit gleichem Slug.
   */
  terminSpeichern(eintrag: TerminEintrag): void {
    this.termine.update((eintraege) => this.sortiereTermine([eintrag, ...eintraege.filter((termin) => termin.slug !== eintrag.slug)]));
  }

  /**
   * Entfernt einen Vereinstermin aus der lokalen Verwaltung.
   */
  terminLoeschen(slug: string): void {
    this.termine.update((eintraege) => eintraege.filter((termin) => termin.slug !== slug));
  }

  /**
   * Speichert eine Vereinshausbelegung lokal und ersetzt einen vorhandenen Eintrag mit gleicher ID.
   */
  vereinshausBelegungSpeichern(eintrag: VereinshausBelegung): void {
    this.vereinshausBelegungen.update((eintraege) => this.sortiereVereinshausBelegungen([eintrag, ...eintraege.filter((belegung) => belegung.id !== eintrag.id)]));
  }

  /**
   * Entfernt eine Vereinshausbelegung aus der lokalen Verwaltung.
   */
  vereinshausBelegungLoeschen(id: string): void {
    this.vereinshausBelegungen.update((eintraege) => eintraege.filter((belegung) => belegung.id !== id));
  }

  /**
   * Speichert einen Gartenwissen-Eintrag lokal und ersetzt einen vorhandenen Eintrag mit gleichem Slug.
   */
  gartenwissenSpeichern(eintrag: GartenwissenBeitrag): void {
    this.gartenwissen.update((eintraege) => [eintrag, ...eintraege.filter((beitrag) => beitrag.slug !== eintrag.slug)]);
  }

  /**
   * Entfernt einen Gartenwissen-Eintrag aus der lokalen Verwaltung.
   */
  gartenwissenLoeschen(slug: string): void {
    this.gartenwissen.update((eintraege) => eintraege.filter((beitrag) => beitrag.slug !== slug));
  }

  /**
   * Speichert ein Startseiten-Pop-up lokal und ersetzt einen vorhandenen Eintrag mit gleicher ID.
   */
  startseitenPopupSpeichern(eintrag: StartseitenPopup): void {
    this.startseitenPopups.update((eintraege) => {
      const vorbereiteteEintraege = eintrag.aktiv ? eintraege.map((popup) => ({ ...popup, aktiv: false })) : eintraege;

      return this.sortiereStartseitenPopups([eintrag, ...vorbereiteteEintraege.filter((popup) => popup.id !== eintrag.id)]);
    });
  }

  /**
   * Entfernt ein Startseiten-Pop-up aus der lokalen Verwaltung.
   */
  startseitenPopupLoeschen(id: string): void {
    this.startseitenPopups.update((eintraege) => eintraege.filter((popup) => popup.id !== id));
  }

  /**
   * Gibt das aktuell aktive Startseiten-Pop-up zurück.
   */
  aktivesStartseitenPopup(heutigesDatumISO: string): StartseitenPopup | null {
    return this.startseitenPopups().find((popup) => popup.aktiv && popup.gueltigBisISO >= heutigesDatumISO) ?? null;
  }


  /**
   * Überführt einen Vereinstermin in das gemeinsame Kalenderformat.
   */
  private mappeTerminZuKalenderEintrag(termin: TerminEintrag): KalenderEintrag {
    return {
      id: termin.slug,
      bereich: 'termine',
      datumISO: termin.datumISO,
      datumEndeISO: termin.datumEndeISO,
      titel: termin.titel,
      kurztext: termin.kurztext,
      zeit: termin.zeit,
      typ: termin.kategorie,
      kalenderKurz: termin.kalenderKurz,
      akzent: termin.akzent,
    };
  }

  /**
   * Überführt eine Vereinshausbelegung in das gemeinsame Kalenderformat.
   */
  private mappeVereinshausZuKalenderEintrag(belegung: VereinshausBelegung): KalenderEintrag {
    return {
      id: belegung.id,
      bereich: 'vereinshaus',
      datumISO: belegung.datumISO,
      datumEndeISO: belegung.datumEndeISO,
      titel: belegung.titel,
      kurztext: belegung.kurztext,
      zeit: belegung.zeit,
      typ: belegung.typ,
      kalenderKurz: belegung.kalenderKurz,
      akzent: belegung.art,
    };
  }

  /**
   * Sortiert gemeinsame Kalenderdaten nach Startdatum.
   */
  private sortiereKalenderEintraege(eintraege: KalenderEintrag[]): KalenderEintrag[] {
    return [...eintraege].sort((erstes, zweites) => erstes.datumISO.localeCompare(zweites.datumISO));
  }

  /**
   * Sortiert Vereinstermine nach Startdatum.
   */
  private sortiereTermine(eintraege: TerminEintrag[]): TerminEintrag[] {
    return [...eintraege].sort((erstes, zweites) => erstes.datumISO.localeCompare(zweites.datumISO));
  }

  /**
   * Sortiert Vereinshausbelegungen nach Datum.
   */
  private sortiereVereinshausBelegungen(eintraege: VereinshausBelegung[]): VereinshausBelegung[] {
    return [...eintraege].sort((erste, zweite) => erste.datumISO.localeCompare(zweite.datumISO));
  }

  /**
   * Sortiert Startseiten-Pop-ups nach Gültigkeit.
   */
  private sortiereStartseitenPopups(eintraege: StartseitenPopup[]): StartseitenPopup[] {
    return [...eintraege].sort((erstes, zweites) => zweites.gueltigBisISO.localeCompare(erstes.gueltigBisISO));
  }
}
