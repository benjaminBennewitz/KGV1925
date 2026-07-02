/* src/app/pages/kontakt/kontakt.component.ts */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type KontaktFeld = keyof KontaktFormular;

interface KontaktFormular {
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
  aktionZiel: string;
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
export class KontaktComponent {
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
      aktionLabel: 'Anfrage an den Vorstand',
      aktionZiel: '#kontaktformular',
    },
    {
      rolle: '2. Vorsitz',
      name: 'Lars Andersen',
      beschreibung: 'Ansprechpartner für organisatorische Abstimmungen, laufende Vereinsthemen und Vertretung des Vorsitzes.',
      icon: 'diversity_3',
      telefonnummern: [],
      aktionLabel: 'Anfrage an den Vorstand',
      aktionZiel: '#kontaktformular',
    },
    {
      rolle: 'Gartenfachberater',
      name: 'Peter Grefkes',
      beschreibung: 'Ansprechpartner für Gemeinschaftsarbeit, Gemeinschaftsflächen, gärtnerische Fragen und Rückmeldungen bei Verhinderung.',
      icon: 'local_florist',
      telefonnummern: ['0173-2836684', '02161-5777173'],
      aktionLabel: 'Telefonisch kontaktieren',
      aktionZiel: 'tel:01732836684',
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

  protected kontaktFormular: KontaktFormular = {
    name: '',
    email: '',
    telefon: '',
    gartennummer: '',
    betreff: '',
    nachricht: '',
  };

  protected feldHinweise: Record<KontaktFeld, string> = {
    name: '',
    email: '',
    telefon: '',
    gartennummer: '',
    betreff: '',
    nachricht: '',
  };

  protected formularStatus = '';

  protected telefonHref(telefonnummer: string): string {
    return `tel:${telefonnummer.replace(/[^0-9+]/g, '')}`;
  }

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

  protected hatFeldHinweis(feld: KontaktFeld): boolean {
    return this.feldHinweise[feld].length > 0;
  }

  protected istKontaktFormularGueltig(): boolean {
    const pflichtfelder: KontaktFeld[] = ['name', 'email', 'betreff', 'nachricht'];
    const optionaleFelder: KontaktFeld[] = ['telefon', 'gartennummer'];
    const pflichtfelderGueltig = pflichtfelder.every((feld) => this.kontaktFormular[feld].trim().length > 0 && !this.validiereKontaktFeld(feld, this.kontaktFormular[feld]));
    const optionaleFelderGueltig = optionaleFelder.every((feld) => this.kontaktFormular[feld].trim().length === 0 || !this.validiereKontaktFeld(feld, this.kontaktFormular[feld]));

    return pflichtfelderGueltig && optionaleFelderGueltig;
  }

  protected kontaktSenden(): void {
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
    this.kontaktFormular = {
      name: '',
      email: '',
      telefon: '',
      gartennummer: '',
      betreff: '',
      nachricht: '',
    };
  }

  private bereinigeKontaktWert(feld: KontaktFeld, wert: string): string {
    if (feld === 'email') {
      return wert.replace(this.emailErsetzen, '').slice(0, 120);
    }

    if (feld === 'telefon') {
      return wert.replace(this.telefonErsetzen, '').slice(0, 30);
    }

    if (feld === 'gartennummer') {
      return wert.replace(/[^0-9]/g, '').slice(0, 2);
    }

    if (feld === 'nachricht') {
      return wert.replace(this.nachrichtErsetzen, '').slice(0, 800);
    }

    return wert.replace(this.textErsetzen, '').slice(0, 80);
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
