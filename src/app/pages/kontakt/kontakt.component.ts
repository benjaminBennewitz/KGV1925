/* src/app/pages/kontakt/kontakt.component.ts */

import { DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BereinigteEingabe, bereinigeEmailMitStatus, bereinigeFormularText, bereinigeFormularTextMitStatus, bereinigeMehrzeiligenFormularTextMitStatus, bereinigeTelefonMitStatus, bereinigeZiffernMitStatus, enthaeltBotSignal } from '../../shared/utils/eingabe-sicherheit.util';

type KontaktFeld = Exclude<keyof KontaktFormular, 'zuHaenden'>;

interface KontaktFormular {
  zuHaenden: string;
  name: string;
  email: string;
  telefon: string;
  gartennummer: string;
  betreff: string;
  nachricht: string;
}

interface Kontaktperson {
  rolle: string;
  name: string;
  beschreibung: string;
  icon: string;
  telefonnummern: string[];
  aktionLabel: string;
  formularKontakt: boolean;
}

interface KontaktInfo {
  titel: string;
  text: string;
  icon: string;
}

@Component({
  selector: 'app-kontakt',
  imports: [FormsModule, RouterLink],
  templateUrl: './kontakt.component.html',
  styleUrl: './kontakt.component.scss',
})
export class KontaktComponent implements OnInit {
  private readonly dokument = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  private readonly textMuster = /^[A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:]{2,80}$/;
  private readonly nachrichtMuster = /^[A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:\n\r]{10,800}$/;
  private readonly emailMuster = /^[A-Za-z0-9._+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
  private readonly telefonMuster = /^[0-9 +()\/-]{6,30}$/;
  private readonly gartennummerMuster = /^(0?[1-9]|[1-4][0-9]|50)$/;

  protected readonly kontaktpersonen: Kontaktperson[] = [
    {
      rolle: '1. Vorsitz',
      name: 'Bülent Kaplan',
      beschreibung: 'Ansprechpartner für übergeordnete Vereinsthemen, Vereinsleitung und offizielle Anliegen.',
      icon: 'verified_user',
      telefonnummern: [],
      aktionLabel: 'Anfrage an Bülent Kaplan',
      formularKontakt: true,
    },
    {
      rolle: '2. Vorsitz',
      name: 'Lars Andersen',
      beschreibung: 'Ansprechpartner für organisatorische Abstimmungen, laufende Vereinsthemen und Vertretung des Vorsitzes.',
      icon: 'diversity_3',
      telefonnummern: [],
      aktionLabel: 'Anfrage an Lars Andersen',
      formularKontakt: true,
    },
    {
      rolle: 'Gartenfachberater',
      name: 'Peter Grefkes',
      beschreibung: 'Ansprechpartner für Gemeinschaftsarbeit, Gemeinschaftsflächen, gärtnerische Fragen und Rückmeldungen bei Verhinderung.',
      icon: 'local_florist',
      telefonnummern: ['0173-2836684', '02161-5777173'],
      aktionLabel: 'Telefonisch kontaktieren',
      formularKontakt: false,
    },
  ];

  protected readonly kontaktInfos: KontaktInfo[] = [
    {
      titel: 'Adresse der Anlage',
      text: 'Klagenfurter Str. 47 · 41063 Mönchengladbach',
      icon: 'location_on',
    },
    {
      titel: 'Kontaktformular',
      text: 'Anfragen zu Verein, Anlage, Mitgliedschaft, Dokumenten und Vereinshaus werden über das Formular gebündelt.',
      icon: 'mail',
    },
    {
      titel: 'Mitgliedsanliegen',
      text: 'Bitte Gartennummer angeben, damit Rückfragen und Anliegen schneller zugeordnet werden können.',
      icon: 'yard',
    },
  ];

  protected kontaktFormular: KontaktFormular = this.erstelleLeeresKontaktFormular();
  protected kontaktHoneypot = '';
  protected feldHinweise: Record<KontaktFeld, string> = this.erstelleLeereKontaktHinweise();
  protected formularStatus = '';
  private kontaktFormularGestartetAm = Date.now();

  /**
   * Übernimmt optionale Vorbelegungen aus der URL, falls Kontaktlinks gezielt auf Formularfelder verweisen.
   */
  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((parameter) => {
      const zuHaenden = parameter.get('zhd');
      const email = parameter.get('email');
      let formularFokussieren = false;

      if (zuHaenden) {
        this.setzeFormularEmpfaenger(zuHaenden, false);
      }

      if (email) {
        formularFokussieren = this.uebernehmeEmailAusUrl(email);
      }

      if (formularFokussieren) {
        this.scrolleZumKontaktformular('kontakt-email');
      }
    });
  }

  /**
   * Erstellt einen bereinigten Telefon-Link.
   */
  protected telefonHref(telefonnummer: string): string {
    return `tel:${telefonnummer.replace(/[^0-9+]/g, '')}`;
  }

  /**
   * Füllt das dynamische z.Hd.-Feld für eine ausgewählte Kontaktperson.
   */
  protected waehleKontaktperson(person: Kontaktperson): void {
    this.setzeFormularEmpfaenger(person.name, true);

    if (!this.kontaktFormular.betreff.trim()) {
      this.kontaktFormular = {
        ...this.kontaktFormular,
        betreff: `Anfrage an ${person.name}`,
      };
    }
  }

  /**
   * Entfernt die gezielte Formular-Zuordnung wieder.
   */
  protected entferneFormularEmpfaenger(): void {
    this.kontaktFormular = {
      ...this.kontaktFormular,
      zuHaenden: '',
    };
    this.formularStatus = '';
  }

  /**
   * Bereinigt und validiert ein Formularfeld direkt während der Eingabe.
   */
  protected kontaktFeldEingabe(feld: KontaktFeld, ereignis: Event): void {
    const ziel = this.leseEingabeZiel(ereignis);
    const ergebnis = this.bereinigeKontaktWertMitStatus(feld, ziel.value);

    ziel.value = ergebnis.wert;
    this.kontaktFormular = {
      ...this.kontaktFormular,
      [feld]: ergebnis.wert,
    };
    this.feldHinweise = {
      ...this.feldHinweise,
      [feld]: this.validiereKontaktEingabe(feld, ergebnis),
    };
    this.formularStatus = '';
  }

  /**
   * Aktualisiert das unsichtbare Honeypot-Feld des Kontaktformulars.
   */
  protected kontaktHoneypotAktualisieren(wert: string): void {
    this.kontaktHoneypot = `${wert ?? ''}`.slice(0, 80);
  }

  /**
   * Prüft, ob ein Feld aktuell einen Hinweis ausgeben soll.
   */
  protected hatFeldHinweis(feld: KontaktFeld): boolean {
    return this.feldHinweise[feld].length > 0;
  }

  /**
   * Prüft, ob ein Feld sichtbar als valide markiert werden kann.
   */
  protected istKontaktFeldValide(feld: KontaktFeld): boolean {
    const wert = this.kontaktFormular[feld].trim();

    return wert.length > 0 && !this.validiereKontaktFeld(feld, wert) && !this.hatFeldHinweis(feld);
  }

  /**
   * Prüft alle Pflicht- und Optionalfelder vor dem vorbereiteten Absenden.
   */
  protected istKontaktFormularGueltig(): boolean {
    const pflichtfelder: KontaktFeld[] = ['name', 'email', 'betreff', 'nachricht'];
    const optionaleFelder: KontaktFeld[] = ['telefon', 'gartennummer'];
    const pflichtfelderGueltig = pflichtfelder.every((feld) => this.kontaktFormular[feld].trim().length > 0 && !this.validiereKontaktFeld(feld, this.kontaktFormular[feld]));
    const optionaleFelderGueltig = optionaleFelder.every((feld) => this.kontaktFormular[feld].trim().length === 0 || !this.validiereKontaktFeld(feld, this.kontaktFormular[feld]));

    return pflichtfelderGueltig && optionaleFelderGueltig;
  }

  /**
   * Validiert das Formular und setzt anschließend den lokalen Demo-Status zurück.
   */
  protected kontaktSenden(): void {
    if (this.istKontaktAnfrageAutomatisch()) {
      this.formularStatus = 'Die Anfrage wurde nicht verarbeitet. Bitte Formular neu laden und erneut ausfüllen.';
      return;
    }

    if (!this.istKontaktFormularGueltig()) {
      this.feldHinweise = {
        name: this.validiereKontaktFeld('name', this.kontaktFormular.name) || 'Bitte Namen eintragen.',
        email: this.validiereKontaktFeld('email', this.kontaktFormular.email) || 'Bitte E-Mail-Adresse eintragen.',
        telefon: this.validiereKontaktFeld('telefon', this.kontaktFormular.telefon),
        gartennummer: this.validiereKontaktFeld('gartennummer', this.kontaktFormular.gartennummer),
        betreff: this.validiereKontaktFeld('betreff', this.kontaktFormular.betreff) || 'Bitte Betreff eintragen.',
        nachricht: this.validiereKontaktFeld('nachricht', this.kontaktFormular.nachricht) || 'Bitte Nachricht eintragen.',
      };
      this.formularStatus = '';
      return;
    }

    this.formularStatus = 'Die Anfrage ist vollständig vorbereitet.';
    this.kontaktFormular = this.erstelleLeeresKontaktFormular();
    this.feldHinweise = this.erstelleLeereKontaktHinweise();
    this.kontaktHoneypot = '';
    this.kontaktFormularGestartetAm = Date.now();
  }

  /**
   * Erstellt den Ausgangszustand des Formulars.
   */
  private erstelleLeeresKontaktFormular(): KontaktFormular {
    return {
      zuHaenden: '',
      name: '',
      email: '',
      telefon: '',
      gartennummer: '',
      betreff: '',
      nachricht: '',
    };
  }

  /**
   * Erstellt den Ausgangszustand der Feldhinweise.
   */
  private erstelleLeereKontaktHinweise(): Record<KontaktFeld, string> {
    return {
      name: '',
      email: '',
      telefon: '',
      gartennummer: '',
      betreff: '',
      nachricht: '',
    };
  }

  /**
   * Übernimmt einen Empfänger in das dynamische z.Hd.-Feld.
   */
  private setzeFormularEmpfaenger(wert: string, formularFokussieren: boolean): void {
    const bereinigterWert = bereinigeFormularText(wert, 80);

    if (!bereinigterWert.trim()) {
      return;
    }

    this.kontaktFormular = {
      ...this.kontaktFormular,
      zuHaenden: bereinigterWert,
    };
    this.formularStatus = '';

    if (formularFokussieren) {
      this.scrolleZumKontaktformular();
    }
  }

  /**
   * Übernimmt eine geprüfte E-Mail-Adresse aus dem Footer-Link.
   */
  private uebernehmeEmailAusUrl(wert: string): boolean {
    const ergebnis = bereinigeEmailMitStatus(wert, 120);

    if (!ergebnis.wert || ergebnis.hatteUnerlaubteZeichen || this.validiereKontaktFeld('email', ergebnis.wert)) {
      return false;
    }

    this.kontaktFormular = {
      ...this.kontaktFormular,
      email: ergebnis.wert,
    };
    this.feldHinweise = {
      ...this.feldHinweise,
      email: '',
    };

    return true;
  }

  /**
   * Scrollt nach einer Personenauswahl gezielt zum Formular.
   */
  private scrolleZumKontaktformular(fokusId?: string): void {
    const fenster = this.dokument.defaultView;

    fenster?.setTimeout(() => {
      this.dokument.getElementById('kontaktformular')?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

      if (fokusId) {
        this.dokument.getElementById(fokusId)?.focus({ preventScroll: true });
      }
    }, 80);
  }

  /**
   * Entfernt nicht erlaubte Zeichen je nach Feldtyp und meldet entfernte Zeichen zurück.
   */
  private bereinigeKontaktWertMitStatus(feld: KontaktFeld, wert: string): BereinigteEingabe {
    if (feld === 'email') {
      return bereinigeEmailMitStatus(wert, 120);
    }

    if (feld === 'telefon') {
      return bereinigeTelefonMitStatus(wert, 30);
    }

    if (feld === 'gartennummer') {
      return bereinigeZiffernMitStatus(wert, 2);
    }

    if (feld === 'nachricht') {
      return bereinigeMehrzeiligenFormularTextMitStatus(wert, 800);
    }

    return bereinigeFormularTextMitStatus(wert, 80);
  }

  /**
   * Erzeugt den passenden Live-Hinweis für eine bereinigte Eingabe.
   */
  private validiereKontaktEingabe(feld: KontaktFeld, ergebnis: BereinigteEingabe): string {
    if (ergebnis.hatteUnerlaubteZeichen) {
      return this.unerlaubteZeichenHinweis(feld);
    }

    return this.validiereKontaktFeld(feld, ergebnis.wert);
  }

  /**
   * Erkennt einfache Bot-Signale vor einer späteren Backend-Prüfung.
   */
  private istKontaktAnfrageAutomatisch(): boolean {
    return enthaeltBotSignal(this.kontaktHoneypot, this.kontaktFormularGestartetAm);
  }

  /**
   * Gibt den konkreten Validierungshinweis für ein Feld zurück.
   */
  private validiereKontaktFeld(feld: KontaktFeld, wert: string): string {
    const getrimmterWert = wert.trim();

    if (!getrimmterWert && (feld === 'telefon' || feld === 'gartennummer')) {
      return '';
    }

    if (!getrimmterWert) {
      return '';
    }

    if (feld === 'email' && !this.emailMuster.test(getrimmterWert)) {
      return 'Bitte eine vollständige E-Mail-Adresse eintragen.';
    }

    if (feld === 'telefon' && !this.telefonMuster.test(getrimmterWert)) {
      return 'Bitte 6 bis 30 Zeichen verwenden: Ziffern, Leerzeichen, +, -, / und Klammern.';
    }

    if (feld === 'gartennummer' && !this.gartennummerMuster.test(getrimmterWert)) {
      return 'Bitte eine Gartennummer zwischen 1 und 50 eintragen.';
    }

    if (feld === 'nachricht' && !this.nachrichtMuster.test(getrimmterWert)) {
      return 'Bitte 10 bis 800 Zeichen verwenden.';
    }

    if ((feld === 'name' || feld === 'betreff') && !this.textMuster.test(getrimmterWert)) {
      return 'Bitte 2 bis 80 Zeichen verwenden.';
    }

    return '';
  }

  /**
   * Meldet entfernte Zeichen je nach Feldtyp verständlich zurück.
   */
  private unerlaubteZeichenHinweis(feld: KontaktFeld): string {
    if (feld === 'email') {
      return 'Entfernt: Bitte nur Buchstaben, Zahlen und . _ + - @ verwenden.';
    }

    if (feld === 'telefon') {
      return 'Entfernt: Bitte nur Ziffern, Leerzeichen, +, -, / und Klammern verwenden.';
    }

    if (feld === 'gartennummer') {
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
}
