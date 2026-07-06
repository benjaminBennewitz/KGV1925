/* src/app/pages/kontakt/kontakt.component.ts */

import { DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { bereinigeEmail, bereinigeFormularText, bereinigeMehrzeiligenFormularText, bereinigeTelefon, bereinigeZiffern, enthaeltBotSignal } from '../../shared/utils/eingabe-sicherheit.util';

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
  private readonly textErsetzen = /[^A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:]/g;
  private readonly nachrichtMuster = /^[A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:\n\r]{10,800}$/;
  private readonly nachrichtErsetzen = /[^A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:\n\r]/g;
  private readonly emailMuster = /^[A-Za-z0-9._+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
  private readonly emailErsetzen = /[^A-Za-z0-9._+\-@]/g;
  private readonly telefonMuster = /^[0-9 +()\/-]{6,30}$/;
  private readonly telefonErsetzen = /[^0-9 +()\/-]/g;
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
  private kontaktFormularGestartetAm = Date.now();

  protected feldHinweise: Record<KontaktFeld, string> = {
    name: '',
    email: '',
    telefon: '',
    gartennummer: '',
    betreff: '',
    nachricht: '',
  };

  protected formularStatus = '';

  /**
   * Übernimmt optionale Vorbelegungen aus der URL, falls Kontaktlinks gezielt auf eine Person verweisen.
   */
  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((parameter) => {
      const zuHaenden = parameter.get('zhd');

      if (!zuHaenden) {
        return;
      }

      this.setzeFormularEmpfaenger(zuHaenden, false);
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
   * Bereinigt und validiert ein Formularfeld während der Eingabe.
   */
  protected kontaktFeldAktualisieren(feld: KontaktFeld, wert: string): void {
    const bereinigterWert = this.bereinigeKontaktWert(feld, wert);
    this.kontaktFormular = {
      ...this.kontaktFormular,
      [feld]: bereinigterWert,
    };
    this.feldHinweise = {
      ...this.feldHinweise,
      [feld]: this.validiereKontaktFeld(feld, bereinigterWert),
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
   * Scrollt nach einer Personenauswahl gezielt zum Formular.
   */
  private scrolleZumKontaktformular(): void {
    const fenster = this.dokument.defaultView;

    fenster?.setTimeout(() => {
      this.dokument.getElementById('kontaktformular')?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    });
  }

  /**
   * Entfernt nicht erlaubte Zeichen je nach Feldtyp.
   */
  private bereinigeKontaktWert(feld: KontaktFeld, wert: string): string {
    if (feld === 'email') {
      return bereinigeEmail(wert, 120);
    }

    if (feld === 'telefon') {
      return bereinigeTelefon(wert, 30);
    }

    if (feld === 'gartennummer') {
      return bereinigeZiffern(wert, 2);
    }

    if (feld === 'nachricht') {
      return bereinigeMehrzeiligenFormularText(wert, 800);
    }

    return bereinigeFormularText(wert, 80);
  }

  /**
   * Gibt den konkreten Validierungshinweis für ein Feld zurück.
   */

  /**
   * Erkennt einfache Bot-Signale vor einer späteren Backend-Prüfung.
   */
  private istKontaktAnfrageAutomatisch(): boolean {
    return enthaeltBotSignal(this.kontaktHoneypot, this.kontaktFormularGestartetAm);
  }

  private validiereKontaktFeld(feld: KontaktFeld, wert: string): string {
    const getrimmterWert = wert.trim();

    if (!getrimmterWert && (feld === 'telefon' || feld === 'gartennummer')) {
      return '';
    }

    if (feld === 'email' && getrimmterWert && !this.emailMuster.test(getrimmterWert)) {
      return 'Bitte eine gültige E-Mail-Adresse ohne Sonderzeichen außerhalb von . _ + - @ eintragen.';
    }

    if (feld === 'telefon' && getrimmterWert && !this.telefonMuster.test(getrimmterWert)) {
      return 'Bitte nur Zahlen, Leerzeichen, +, -, / und Klammern verwenden.';
    }

    if (feld === 'gartennummer' && getrimmterWert && !this.gartennummerMuster.test(getrimmterWert)) {
      return 'Bitte eine Gartennummer zwischen 1 und 50 eintragen.';
    }

    if (feld === 'nachricht' && getrimmterWert && !this.nachrichtMuster.test(getrimmterWert)) {
      return 'Die Nachricht braucht 10 bis 800 Zeichen und darf nur sichere Satzzeichen verwenden.';
    }

    if ((feld === 'name' || feld === 'betreff') && getrimmterWert && !this.textMuster.test(getrimmterWert)) {
      return 'Bitte 2 bis 80 Zeichen verwenden. Erlaubt sind Buchstaben, Zahlen, Leerzeichen und sichere Satzzeichen.';
    }

    return '';
  }
}
