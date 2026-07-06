/* src/app/pages/vereinshausvermietung/vereinshausvermietung.component.ts */

import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FeiertagEintrag, feiertagNrwFuerDatum } from '../../shared/data/feiertage-nrw.data';
import { AdminContentService, VereinshausBelegung } from '../../shared/services/admin-content.service';
import { BereinigteEingabe, bereinigeEmailMitStatus, bereinigeFormularTextMitStatus, bereinigeMehrzeiligenFormularTextMitStatus, bereinigeSuchwert, bereinigeTelefonMitStatus, bereinigeZiffernMitStatus, enthaeltBotSignal, normalisiereSuchwert } from '../../shared/utils/eingabe-sicherheit.util';

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
  feiertag: FeiertagEintrag | null;
  belegung: VereinshausBelegung | null;
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
  private readonly adminContent = inject(AdminContentService);
  private readonly textMuster = /^[A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:]{2,80}$/;
  private readonly textErsetzen = /[^A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:]/g;
  private readonly nachrichtMuster = /^[A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:\r\n]{10,800}$/;
  private readonly nachrichtErsetzen = /[^A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:\r\n]/g;
  private readonly emailMuster = /^[A-Za-z0-9._+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
  private readonly emailErsetzen = /[^A-Za-z0-9._+\-@]/g;
  private readonly telefonMuster = /^[0-9 +()\/-]{6,30}$/;
  private readonly telefonErsetzen = /[^0-9 +()\/-]/g;
  private readonly gaesteMuster = /^([1-9]|[1-7][0-9]|80)$/;

  protected aktivesJahr = 2026;
  protected aktiverMonatIndex = 6;
  protected fokussierteBelegung: string | null = null;
  protected vereinshausSuche = '';
  protected mietAnfrage: MietAnfrage = this.erstelleLeereMietAnfrage();
  protected mietHoneypot = '';
  protected mietFormularStatus = '';
  private mietFormularGestartetAm = Date.now();
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
    return this.baueKalenderTage(this.aktivesJahr, this.aktiverMonatIndex);
  }

  protected get belegungenImAktivenMonat(): VereinshausBelegung[] {
    const monatsStart = this.erzeugeDatumString(this.aktivesJahr, this.aktiverMonatIndex, 1);
    const monatsEnde = this.erzeugeDatumString(this.aktivesJahr, this.aktiverMonatIndex, new Date(this.aktivesJahr, this.aktiverMonatIndex + 1, 0).getDate());

    return this.gefilterteBelegungen
      .filter((belegung) => this.ueberschneidetZeitraum(belegung, monatsStart, monatsEnde))
      .sort((erste, zweite) => erste.datumISO.localeCompare(zweite.datumISO));
  }

  protected get gefilterteBelegungen(): VereinshausBelegung[] {
    const suche = this.normalisiereSuche(this.vereinshausSuche);

    if (!suche) {
      return this.adminContent.vereinshausBelegungen();
    }

    return this.adminContent.vereinshausBelegungen().filter((belegung) => this.passtBelegungZurSuche(belegung, suche));
  }

  protected get kannVorherigerMonat(): boolean {
    return true;
  }

  protected get kannNaechsterMonat(): boolean {
    return true;
  }

  /**
   * Aktualisiert die Suche für Titel und Datum.
   */
  protected vereinshausSucheAktualisieren(wert: string): void {
    this.vereinshausSuche = bereinigeSuchwert(wert, 80);
    this.fokussierteBelegung = null;
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
  protected fokussiereBelegung(belegung: VereinshausBelegung): void {
    this.fokussierteBelegung = belegung.id;

    this.dokument.defaultView?.setTimeout(() => {
      const element = this.dokument.getElementById(`mietbelegung-${belegung.id}`);

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
   * Bereinigt und validiert ein Feld der Mietanfrage direkt während der Eingabe.
   */
  protected mietFeldEingabe(feld: MietFeld, ereignis: Event): void {
    const ziel = this.leseEingabeZiel(ereignis);
    const ergebnis = this.bereinigeMietWertMitStatus(feld, ziel.value);

    ziel.value = ergebnis.wert;
    this.mietAnfrage = {
      ...this.mietAnfrage,
      [feld]: ergebnis.wert,
    };
    this.mietFeldHinweise[feld] = this.validiereMietEingabe(feld, ergebnis);
    this.mietFormularStatus = '';
  }


  /**
   * Aktualisiert das unsichtbare Honeypot-Feld der Mietanfrage.
   */
  protected mietHoneypotAktualisieren(wert: string): void {
    this.mietHoneypot = `${wert ?? ''}`.slice(0, 80);
  }

  /**
   * Prüft, ob ein Formularfeld aktuell einen Hinweis ausgeben soll.
   */
  protected hatMietFeldHinweis(feld: MietFeld): boolean {
    return this.mietFeldHinweise[feld].length > 0;
  }

  /**
   * Prüft, ob ein Mietfeld sichtbar als valide markiert werden kann.
   */
  protected istMietFeldValide(feld: MietFeld): boolean {
    const wert = this.mietAnfrage[feld].trim();

    return wert.length > 0 && !this.validiereMietFeld(feld, wert) && !this.hatMietFeldHinweis(feld);
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
    if (this.istMietAnfrageAutomatisch()) {
      this.mietFormularStatus = 'Die Mietanfrage wurde nicht verarbeitet. Bitte Formular neu laden und erneut ausfüllen.';
      return;
    }

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
    this.mietFormularGestartetAm = Date.now();
  }

  /**
   * Formatiert ein ISO-Datum in eine kurze deutsche Schreibweise.
   */
  protected formatiereDatum(datumISO: string): string {
    return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${datumISO}T12:00:00`));
  }

  /**
   * Formatiert einen Datumsbereich für die Listenansicht.
   */
  protected formatiereDatumsbereich(belegung: VereinshausBelegung): string {
    if (!belegung.datumEndeISO || belegung.datumEndeISO === belegung.datumISO) {
      return this.formatiereDatum(belegung.datumISO);
    }

    return `${this.formatiereDatum(belegung.datumISO)} bis ${this.formatiereDatum(belegung.datumEndeISO)}`;
  }

  private baueKalenderTage(jahr: number, monatIndex: number): MietKalenderTag[] {
    const tage: MietKalenderTag[] = [];
    const ersterTag = new Date(jahr, monatIndex, 1);
    const tageImMonat = new Date(jahr, monatIndex + 1, 0).getDate();
    const tageImVormonat = new Date(jahr, monatIndex, 0).getDate();
    const startOffset = (ersterTag.getDay() + 6) % 7;
    const heutigesDatum = this.erzeugeHeutigesDatum();

    for (let index = startOffset - 1; index >= 0; index -= 1) {
      const tagZahl = tageImVormonat - index;
      const datumISO = this.erzeugeDatumString(jahr, monatIndex - 1, tagZahl);

      tage.push(this.baueKalenderTag(datumISO, tagZahl, false, heutigesDatum));
    }

    for (let tagZahl = 1; tagZahl <= tageImMonat; tagZahl += 1) {
      const datumISO = this.erzeugeDatumString(jahr, monatIndex, tagZahl);

      tage.push(this.baueKalenderTag(datumISO, tagZahl, true, heutigesDatum));
    }

    let naechsterMonatTag = 1;

    while (tage.length % 7 !== 0 || tage.length < 35) {
      const datumISO = this.erzeugeDatumString(jahr, monatIndex + 1, naechsterMonatTag);

      tage.push(this.baueKalenderTag(datumISO, naechsterMonatTag, false, heutigesDatum));
      naechsterMonatTag += 1;
    }

    return tage;
  }

  private baueKalenderTag(datumISO: string, tagZahl: number, istAktuellerMonat: boolean, heutigesDatum: string): MietKalenderTag {
    const wochentag = new Date(`${datumISO}T12:00:00`).getDay();

    return {
      datumISO,
      tagZahl,
      istAktuellerMonat,
      istHeute: datumISO === heutigesDatum,
      istWochenende: wochentag === 0 || wochentag === 6,
      feiertag: istAktuellerMonat ? feiertagNrwFuerDatum(datumISO) : null,
      belegung: istAktuellerMonat ? this.belegungFuerDatum(datumISO) : null,
    };
  }

  private belegungFuerDatum(datumISO: string): VereinshausBelegung | null {
    return this.gefilterteBelegungen.find((belegung) => belegung.datumISO <= datumISO && (belegung.datumEndeISO || belegung.datumISO) >= datumISO) ?? null;
  }

  private ueberschneidetZeitraum(belegung: VereinshausBelegung, startISO: string, endeISO: string): boolean {
    const belegungStart = belegung.datumISO;
    const belegungEnde = belegung.datumEndeISO || belegung.datumISO;

    return belegungStart <= endeISO && belegungEnde >= startISO;
  }

  private passtBelegungZurSuche(belegung: VereinshausBelegung, suche: string): boolean {
    return [belegung.titel, belegung.datumISO, belegung.datumEndeISO ?? '', belegung.typ, belegung.kalenderKurz, this.formatiereDatumsbereich(belegung)].some((wert) => this.normalisiereSuche(wert).includes(suche));
  }

  private normalisiereSuche(wert: string): string {
    return normalisiereSuchwert(wert);
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

  private bereinigeMietWertMitStatus(feld: MietFeld, wert: string): BereinigteEingabe {
    if (feld === 'email') {
      return bereinigeEmailMitStatus(wert, 120);
    }

    if (feld === 'telefon') {
      return bereinigeTelefonMitStatus(wert, 30);
    }

    if (feld === 'gaeste') {
      return bereinigeZiffernMitStatus(wert, 2);
    }

    if (feld === 'nachricht') {
      return bereinigeMehrzeiligenFormularTextMitStatus(wert, 800);
    }

    return bereinigeFormularTextMitStatus(wert, 80);
  }

  /**
   * Erzeugt den passenden Live-Hinweis für eine bereinigte Mietfeld-Eingabe.
   */
  private validiereMietEingabe(feld: MietFeld, ergebnis: BereinigteEingabe): string {
    if (ergebnis.hatteUnerlaubteZeichen) {
      return this.unerlaubteMietZeichenHinweis(feld);
    }

    return this.validiereMietFeld(feld, ergebnis.wert);
  }


  /**
   * Erkennt einfache Bot-Signale vor einer späteren Backend-Prüfung.
   */
  private istMietAnfrageAutomatisch(): boolean {
    return enthaeltBotSignal(this.mietHoneypot, this.mietFormularGestartetAm);
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

  /**
   * Meldet entfernte Zeichen je nach Mietfeld verständlich zurück.
   */
  private unerlaubteMietZeichenHinweis(feld: MietFeld): string {
    if (feld === 'email') {
      return 'Entfernt: Bitte nur Buchstaben, Zahlen und . _ + - @ verwenden.';
    }

    if (feld === 'telefon') {
      return 'Entfernt: Bitte nur Ziffern, Leerzeichen, +, -, / und Klammern verwenden.';
    }

    if (feld === 'gaeste') {
      return 'Entfernt: Bitte nur Ziffern verwenden.';
    }

    return 'Entfernt: Bitte nur Buchstaben, Zahlen, Leerzeichen und sichere Satzzeichen verwenden.';
  }

  /**
   * Liest ein Textfeld aus einem Eingabeereignis.
   */
  private leseEingabeZiel(ereignis: Event): HTMLInputElement | HTMLTextAreaElement {
    return ereignis.target as HTMLInputElement | HTMLTextAreaElement;
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
