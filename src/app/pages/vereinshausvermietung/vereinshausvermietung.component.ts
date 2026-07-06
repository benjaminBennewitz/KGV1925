/* src/app/pages/vereinshausvermietung/vereinshausvermietung.component.ts */

import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface MietInfo {
  icon: string;
  titel: string;
  text: string;
}

interface MietKalenderTag {
  datumISO: string;
  tagZahl: number;
  istAktuellerMonat: boolean;
  istHeute: boolean;
  istWochenende: boolean;
  belegung: MietBelegung | null;
}

type MietBelegungsArt = 'vermietung' | 'intern';

interface MietBelegung {
  datumISO: string;
  titel: string;
  kurztext: string;
  zeit: string;
  typ: string;
  kalenderKurz: string;
  art: MietBelegungsArt;
}

interface MietAnfrage {
  wunschdatum: string;
  name: string;
  email: string;
  telefon: string;
  gaeste: string;
  zeitraum: string;
  anlass: string;
  nachricht: string;
}

type MietFeld = Exclude<keyof MietAnfrage, 'wunschdatum'>;

@Component({
  selector: 'app-vereinshausvermietung',
  imports: [FormsModule, RouterLink],
  templateUrl: './vereinshausvermietung.component.html',
  styleUrl: './vereinshausvermietung.component.scss',
})
export class VereinshausvermietungComponent {
  private readonly dokument = inject(DOCUMENT);
  private readonly belegungsCache = new Map<string, MietBelegung[]>();
  private readonly textMuster = /^[A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:]{2,80}$/;
  private readonly textErsetzen = /[^A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:]/g;
  private readonly nachrichtMuster = /^[A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:\n\r]{10,800}$/;
  private readonly nachrichtErsetzen = /[^A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:\n\r]/g;
  private readonly emailMuster = /^[A-Za-z0-9._+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
  private readonly emailErsetzen = /[^A-Za-z0-9._+\-@]/g;
  private readonly telefonMuster = /^[0-9 +()\/-]{6,30}$/;
  private readonly telefonErsetzen = /[^0-9 +()\/-]/g;
  private readonly gaesteMuster = /^([1-9]|[1-7][0-9]|80)$/;

  protected aktivesJahr = 2026;
  protected aktiverMonatIndex = 6;
  protected fokussierteBelegung: string | null = null;
  protected mietAnfrage: MietAnfrage = this.erstelleLeereMietAnfrage();
  protected mietFormularStatus = '';
  protected readonly wochentage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  protected readonly monate = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  protected readonly mietFeldHinweise: Record<MietFeld, string> = {
    name: '',
    email: '',
    telefon: '',
    gaeste: '',
    zeitraum: '',
    anlass: '',
    nachricht: '',
  };

  protected readonly infos: MietInfo[] = [
    {
      icon: 'event_available',
      titel: 'Termin anfragen',
      text: 'Freie Tage können direkt im Kalender ausgewählt und anschließend im Formular vorbereitet werden.',
    },
    {
      icon: 'groups',
      titel: 'Anlass beschreiben',
      text: 'Die Anfrage sollte Anlass, Gästezahl und gewünschte Nutzungszeit verständlich erfassen.',
    },
    {
      icon: 'assignment',
      titel: 'Prüfung durch Verein',
      text: 'Der Vorstand prüft die Anfrage und beantwortet sie anschließend gesammelt per E-Mail.',
    },
  ];

  protected readonly vorbereitungsListe = ['Wunschtermin und Ausweichtermin', 'ungefähre Gästezahl', 'Anlass der Veranstaltung', 'gewünschter Zeitraum', 'Kontaktdaten für Rückfragen'];

  protected get aktiverMonatName(): string {
    return `${this.monate[this.aktiverMonatIndex]} ${this.aktivesJahr}`;
  }

  protected get monatsAuswahl(): number[] {
    return Array.from({ length: 12 }, (_, index) => index);
  }

  protected get kalenderTage(): MietKalenderTag[] {
    return this.baueKalenderTage(this.aktivesJahr, this.aktiverMonatIndex, this.belegungenImAktivenMonat);
  }

  protected get belegungenImAktivenMonat(): MietBelegung[] {
    return this.holeBelegungenFuerMonat(this.aktivesJahr, this.aktiverMonatIndex);
  }

  protected get kannVorherigerMonat(): boolean {
    return true;
  }

  protected get kannNaechsterMonat(): boolean {
    return true;
  }

  /**
   * Wechselt den Kalender auf einen konkreten Monat im aktiven Jahr.
   */
  protected waehleMonat(monatIndex: number): void {
    this.aktiverMonatIndex = monatIndex;
    this.fokussierteBelegung = null;
  }

  /**
   * Wechselt einen Monat zurück und springt bei Bedarf ins Vorjahr.
   */
  protected vorherigerMonat(): void {
    if (this.aktiverMonatIndex === 0) {
      this.aktivesJahr -= 1;
      this.aktiverMonatIndex = 11;
    } else {
      this.aktiverMonatIndex -= 1;
    }

    this.fokussierteBelegung = null;
  }

  /**
   * Wechselt einen Monat vor und springt bei Bedarf ins Folgejahr.
   */
  protected naechsterMonat(): void {
    if (this.aktiverMonatIndex === 11) {
      this.aktivesJahr += 1;
      this.aktiverMonatIndex = 0;
    } else {
      this.aktiverMonatIndex += 1;
    }

    this.fokussierteBelegung = null;
  }

  /**
   * Springt aus dem Kalendertag zur passenden Monatslistenkarte.
   */
  protected fokussiereBelegung(belegung: MietBelegung): void {
    this.fokussierteBelegung = belegung.datumISO;

    this.dokument.defaultView?.setTimeout(() => {
      const element = this.dokument.getElementById(`mietbelegung-${belegung.datumISO}`);

      if (!element) {
        return;
      }

      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      element.focus({ preventScroll: true });
    });
  }

  /**
   * Übernimmt einen freien Kalendertag in das Mietformular.
   */
  protected waehleMietdatum(datumISO: string): void {
    this.mietAnfrage = {
      ...this.mietAnfrage,
      wunschdatum: datumISO,
    };
    this.mietFormularStatus = '';
    this.scrolleZurMietanfrage();
  }

  /**
   * Entfernt den ausgewählten Wunschtermin aus dem Mietformular.
   */
  protected entferneMietdatum(): void {
    this.mietAnfrage = {
      ...this.mietAnfrage,
      wunschdatum: '',
    };
    this.mietFormularStatus = '';
  }

  /**
   * Bereinigt und validiert ein Feld der Mietanfrage.
   */
  protected mietFeldAktualisieren(feld: MietFeld, wert: string): void {
    const bereinigterWert = this.bereinigeMietWert(feld, wert);
    this.mietAnfrage = {
      ...this.mietAnfrage,
      [feld]: bereinigterWert,
    };
    this.mietFeldHinweise[feld] = this.validiereMietFeld(feld, bereinigterWert);
    this.mietFormularStatus = '';
  }

  /**
   * Prüft, ob ein Formularfeld aktuell einen Hinweis ausgeben soll.
   */
  protected hatMietFeldHinweis(feld: MietFeld): boolean {
    return this.mietFeldHinweise[feld].length > 0;
  }

  /**
   * Prüft alle Pflicht- und Optionalfelder der Mietanfrage.
   */
  protected istMietFormularGueltig(): boolean {
    const pflichtfelder: MietFeld[] = ['name', 'email', 'gaeste', 'zeitraum', 'anlass', 'nachricht'];
    const optionaleFelder: MietFeld[] = ['telefon'];
    const pflichtfelderGueltig = pflichtfelder.every((feld) => this.mietAnfrage[feld].trim().length > 0 && !this.validiereMietFeld(feld, this.mietAnfrage[feld]));
    const optionaleFelderGueltig = optionaleFelder.every((feld) => this.mietAnfrage[feld].trim().length === 0 || !this.validiereMietFeld(feld, this.mietAnfrage[feld]));

    return Boolean(this.mietAnfrage.wunschdatum) && pflichtfelderGueltig && optionaleFelderGueltig;
  }

  /**
   * Validiert das Formular und setzt anschließend einen lokalen Demo-Status.
   */
  protected mietAnfrageSenden(): void {
    if (!this.istMietFormularGueltig()) {
      this.mietFeldHinweise.name = this.validiereMietFeld('name', this.mietAnfrage.name) || 'Bitte Namen eintragen.';
      this.mietFeldHinweise.email = this.validiereMietFeld('email', this.mietAnfrage.email) || 'Bitte E-Mail-Adresse eintragen.';
      this.mietFeldHinweise.telefon = this.validiereMietFeld('telefon', this.mietAnfrage.telefon);
      this.mietFeldHinweise.gaeste = this.validiereMietFeld('gaeste', this.mietAnfrage.gaeste) || 'Bitte Gästezahl eintragen.';
      this.mietFeldHinweise.zeitraum = this.validiereMietFeld('zeitraum', this.mietAnfrage.zeitraum) || 'Bitte Zeitraum eintragen.';
      this.mietFeldHinweise.anlass = this.validiereMietFeld('anlass', this.mietAnfrage.anlass) || 'Bitte Anlass eintragen.';
      this.mietFeldHinweise.nachricht = this.validiereMietFeld('nachricht', this.mietAnfrage.nachricht) || 'Bitte kurze Nachricht eintragen.';
      this.mietFormularStatus = '';
      return;
    }

    this.mietFormularStatus = 'Die Mietanfrage ist vollständig vorbereitet.';
  }

  /**
   * Formatiert ein ISO-Datum in eine kurze deutsche Schreibweise.
   */
  protected formatiereDatum(datumISO: string): string {
    return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${datumISO}T12:00:00`));
  }

  private baueKalenderTage(jahr: number, monatIndex: number, belegungen: MietBelegung[]): MietKalenderTag[] {
    const tage: MietKalenderTag[] = [];
    const ersterTag = new Date(jahr, monatIndex, 1);
    const tageImMonat = new Date(jahr, monatIndex + 1, 0).getDate();
    const tageImVormonat = new Date(jahr, monatIndex, 0).getDate();
    const startOffset = (ersterTag.getDay() + 6) % 7;
    const heutigesDatum = this.erzeugeHeutigesDatum();

    for (let index = startOffset - 1; index >= 0; index -= 1) {
      const tagZahl = tageImVormonat - index;
      const datumISO = this.erzeugeDatumString(jahr, monatIndex - 1, tagZahl);

      tage.push(this.baueKalenderTag(datumISO, tagZahl, false, heutigesDatum, belegungen));
    }

    for (let tagZahl = 1; tagZahl <= tageImMonat; tagZahl += 1) {
      const datumISO = this.erzeugeDatumString(jahr, monatIndex, tagZahl);

      tage.push(this.baueKalenderTag(datumISO, tagZahl, true, heutigesDatum, belegungen));
    }

    let naechsterMonatTag = 1;

    while (tage.length % 7 !== 0 || tage.length < 35) {
      const datumISO = this.erzeugeDatumString(jahr, monatIndex + 1, naechsterMonatTag);

      tage.push(this.baueKalenderTag(datumISO, naechsterMonatTag, false, heutigesDatum, belegungen));
      naechsterMonatTag += 1;
    }

    return tage;
  }

  private baueKalenderTag(datumISO: string, tagZahl: number, istAktuellerMonat: boolean, heutigesDatum: string, belegungen: MietBelegung[]): MietKalenderTag {
    const wochentag = new Date(`${datumISO}T12:00:00`).getDay();

    return {
      datumISO,
      tagZahl,
      istAktuellerMonat,
      istHeute: datumISO === heutigesDatum,
      istWochenende: wochentag === 0 || wochentag === 6,
      belegung: istAktuellerMonat ? belegungen.find((belegung) => belegung.datumISO === datumISO) ?? null : null,
    };
  }

  private holeBelegungenFuerMonat(jahr: number, monatIndex: number): MietBelegung[] {
    const cacheKey = `${jahr}-${monatIndex}`;
    const cacheTreffer = this.belegungsCache.get(cacheKey);

    if (cacheTreffer) {
      return cacheTreffer;
    }

    const belegungen = this.baueBelegungenFuerMonat(jahr, monatIndex).sort((erste, zweite) => erste.datumISO.localeCompare(zweite.datumISO));
    this.belegungsCache.set(cacheKey, belegungen);

    return belegungen;
  }

  private baueBelegungenFuerMonat(jahr: number, monatIndex: number): MietBelegung[] {
    const belegungen: MietBelegung[] = [];
    const ersterSamstag = this.findeWochentagImMonat(jahr, monatIndex, 6, 1);
    const zweiterSamstag = this.findeWochentagImMonat(jahr, monatIndex, 6, 2);
    const dritterSamstag = this.findeWochentagImMonat(jahr, monatIndex, 6, 3);
    const letzterSamstag = this.findeLetztenWochentagImMonat(jahr, monatIndex, 6);
    const ersterDienstag = this.findeWochentagImMonat(jahr, monatIndex, 2, 1);
    const dritterMittwoch = this.findeWochentagImMonat(jahr, monatIndex, 3, 3);
    const vierterFreitag = this.findeWochentagImMonat(jahr, monatIndex, 5, 4);

    belegungen.push(this.baueInterneBelegung(this.erzeugeDatumString(jahr, monatIndex, ersterDienstag), 'Vorstandssitzung', 'Interne Abstimmung des Vorstands im Vereinshaus.', '18:00 bis 20:30 Uhr'));
    belegungen.push(this.baueVermietung(this.erzeugeDatumString(jahr, monatIndex, ersterSamstag), '16:00 bis 23:00 Uhr'));
    belegungen.push(this.baueInterneBelegung(this.erzeugeDatumString(jahr, monatIndex, dritterMittwoch), 'Vereinsversammlung', 'Interner Vereinstermin im Vereinshaus.', '18:00 bis 21:00 Uhr'));
    belegungen.push(this.baueVermietung(this.erzeugeDatumString(jahr, monatIndex, zweiterSamstag), '15:00 bis 23:00 Uhr'));
    belegungen.push(this.baueVermietung(this.erzeugeDatumString(jahr, monatIndex, vierterFreitag), '17:00 bis 23:00 Uhr'));
    belegungen.push(this.baueVermietung(this.erzeugeDatumString(jahr, monatIndex, letzterSamstag), '15:00 bis 22:00 Uhr'));

    if (dritterSamstag !== zweiterSamstag && dritterSamstag !== letzterSamstag) {
      belegungen.push(this.baueVermietung(this.erzeugeDatumString(jahr, monatIndex, dritterSamstag), '14:00 bis 20:00 Uhr'));
    }

    this.ergänzeSaisonaleBelegungen(belegungen, jahr, monatIndex);

    return this.entferneDoppelteBelegungen(belegungen);
  }

  private ergänzeSaisonaleBelegungen(belegungen: MietBelegung[], jahr: number, monatIndex: number): void {
    const saisonaleTermine: Record<string, MietBelegung> = {
      [`${jahr}-07-31`]: this.baueInterneBelegung(this.erzeugeDatumString(jahr, 6, 31), 'Vorbereitung Sommerfest', 'Aufbau und Vorbereitung im Vereinshaus.', '17:00 bis 21:00 Uhr'),
      [`${jahr}-08-01`]: this.baueInterneBelegung(this.erzeugeDatumString(jahr, 7, 1), 'Sommerfest', 'Vereinshaus und Außenbereich sind für das Sommerfest reserviert.', '10:00 bis 23:00 Uhr'),
      [`${jahr}-12-18`]: this.baueInterneBelegung(this.erzeugeDatumString(jahr, 11, 18), 'Jahresabschluss', 'Interner Jahresabschluss des Vereins.', '18:00 bis 22:00 Uhr'),
      [`${jahr}-12-31`]: this.baueVermietung(this.erzeugeDatumString(jahr, 11, 31), '18:00 bis 01:00 Uhr'),
    };

    Object.values(saisonaleTermine).forEach((belegung) => {
      const datum = new Date(`${belegung.datumISO}T12:00:00`);

      if (datum.getFullYear() === jahr && datum.getMonth() === monatIndex) {
        belegungen.push(belegung);
      }
    });
  }

  private entferneDoppelteBelegungen(belegungen: MietBelegung[]): MietBelegung[] {
    const belegungenNachDatum = new Map<string, MietBelegung>();

    belegungen.forEach((belegung) => {
      const bestehendeBelegung = belegungenNachDatum.get(belegung.datumISO);

      if (!bestehendeBelegung || bestehendeBelegung.art === 'vermietung') {
        belegungenNachDatum.set(belegung.datumISO, belegung);
      }
    });

    return Array.from(belegungenNachDatum.values());
  }

  private baueVermietung(datumISO: string, zeit: string): MietBelegung {
    return {
      datumISO,
      titel: 'Vermietet',
      kurztext: 'Das Vereinshaus ist an diesem Tag vermietet.',
      zeit,
      typ: 'Vermietung',
      kalenderKurz: 'Vermietet',
      art: 'vermietung',
    };
  }

  private baueInterneBelegung(datumISO: string, titel: string, kurztext: string, zeit: string): MietBelegung {
    return {
      datumISO,
      titel,
      kurztext,
      zeit,
      typ: 'Verein',
      kalenderKurz: 'Verein',
      art: 'intern',
    };
  }

  private findeWochentagImMonat(jahr: number, monatIndex: number, wochentag: number, vorkommen: number): number {
    const tageImMonat = new Date(jahr, monatIndex + 1, 0).getDate();
    let treffer = 0;

    for (let tagZahl = 1; tagZahl <= tageImMonat; tagZahl += 1) {
      if (new Date(jahr, monatIndex, tagZahl).getDay() === wochentag) {
        treffer += 1;
      }

      if (treffer === vorkommen) {
        return tagZahl;
      }
    }

    return tageImMonat;
  }

  private findeLetztenWochentagImMonat(jahr: number, monatIndex: number, wochentag: number): number {
    const tageImMonat = new Date(jahr, monatIndex + 1, 0).getDate();

    for (let tagZahl = tageImMonat; tagZahl >= 1; tagZahl -= 1) {
      if (new Date(jahr, monatIndex, tagZahl).getDay() === wochentag) {
        return tagZahl;
      }
    }

    return tageImMonat;
  }

  private erstelleLeereMietAnfrage(): MietAnfrage {
    return {
      wunschdatum: '',
      name: '',
      email: '',
      telefon: '',
      gaeste: '',
      zeitraum: '',
      anlass: '',
      nachricht: '',
    };
  }

  private scrolleZurMietanfrage(): void {
    this.dokument.defaultView?.setTimeout(() => {
      this.dokument.getElementById('mietanfrage')?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    });
  }

  private bereinigeMietWert(feld: MietFeld, wert: string): string {
    if (feld === 'email') {
      return wert.replace(this.emailErsetzen, '').slice(0, 120);
    }

    if (feld === 'telefon') {
      return wert.replace(this.telefonErsetzen, '').slice(0, 30);
    }

    if (feld === 'gaeste') {
      return wert.replace(/[^0-9]/g, '').slice(0, 2);
    }

    if (feld === 'nachricht') {
      return wert.replace(this.nachrichtErsetzen, '').slice(0, 800);
    }

    return wert.replace(this.textErsetzen, '').slice(0, 80);
  }

  private validiereMietFeld(feld: MietFeld, wert: string): string {
    if (!wert.trim()) {
      return '';
    }

    if (feld === 'email' && !this.emailMuster.test(wert)) {
      return 'Bitte eine gültige E-Mail-Adresse eintragen.';
    }

    if (feld === 'telefon' && !this.telefonMuster.test(wert)) {
      return 'Bitte nur Telefonnummern mit Ziffern, Leerzeichen, +, -, / und Klammern eintragen.';
    }

    if (feld === 'gaeste' && !this.gaesteMuster.test(wert)) {
      return 'Bitte eine Gästezahl zwischen 1 und 80 eintragen.';
    }

    if (feld === 'nachricht' && !this.nachrichtMuster.test(wert)) {
      return 'Bitte 10 bis 800 Zeichen ohne Sonderzeichen eintragen.';
    }

    if ((feld === 'name' || feld === 'zeitraum' || feld === 'anlass') && !this.textMuster.test(wert)) {
      return 'Bitte 2 bis 80 Zeichen ohne Sonderzeichen eintragen.';
    }

    return '';
  }

  private erzeugeDatumString(jahr: number, monatIndex: number, tagZahl: number): string {
    const datum = new Date(jahr, monatIndex, tagZahl);
    const monat = `${datum.getMonth() + 1}`.padStart(2, '0');
    const tag = `${datum.getDate()}`.padStart(2, '0');

    return `${datum.getFullYear()}-${monat}-${tag}`;
  }

  private erzeugeHeutigesDatum(): string {
    const heute = new Date();
    const monat = `${heute.getMonth() + 1}`.padStart(2, '0');
    const tag = `${heute.getDate()}`.padStart(2, '0');

    return `${heute.getFullYear()}-${monat}-${tag}`;
  }
}
