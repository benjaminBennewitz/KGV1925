/* src/app/pages/mitgliederbereich/mitgliederbereich.component.ts */

import { Component, OnDestroy, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GARTEN_PARZELLEN } from '../../shared/data/verein.data';
import { EingereichterZaehlerstand, MitgliederRolle, MitgliederSession, MitgliederSessionService, ZaehlerTyp } from '../../shared/services/mitglieder-session.service';

type MitgliederAnsicht = 'uebersicht' | 'rechnungen' | 'zaehlerstaende' | 'admin';
type LoginFeld = keyof LoginDaten;
type RechnungUploadFeld = keyof RechnungUpload;

interface LoginDaten {
  benutzername: string;
  gartennummer: string;
  passwort: string;
}

interface Mitglied {
  benutzername: string;
  gartennummer: string;
  passwort: string;
  vorname: string;
  nachname: string;
  rolle: MitgliederRolle;
  istAdmin: boolean;
}

interface Rechnung {
  datum: string;
  name: string;
  nummer: string;
  betrag: string;
  status: string;
  url: string;
  dateiname: string;
}

interface Uebersichtskarte {
  titel: string;
  text: string;
  icon: string;
  aktion: MitgliederAnsicht;
  meta: string;
}

interface GartenAdminKarte {
  gartennummer: string;
  name: string;
  lage: string;
  letzteZaehlerstaende: Record<ZaehlerTyp, string>;
}

interface RechnungUpload {
  datum: string;
  name: string;
  betrag: string;
}

@Component({
  selector: 'app-mitgliederbereich',
  imports: [FormsModule, RouterLink],
  templateUrl: './mitgliederbereich.component.html',
  styleUrl: './mitgliederbereich.component.scss',
})
export class MitgliederbereichComponent implements OnDestroy {
  private readonly mitgliederSession = inject(MitgliederSessionService);
  private readonly router = inject(Router);
  private readonly erlaubteLoginZeichen = /^[A-Za-z0-9!?#*]{1,50}$/;
  private readonly erlaubteLoginZeichenErsetzen = /[^A-Za-z0-9!?#*]/g;
  private readonly erlaubteRechnungsZeichen = /^[A-Za-z0-9!?#*]{1,50}$/;
  private readonly erlaubteRechnungsZeichenErsetzen = /[^A-Za-z0-9!?#*]/g;
  private readonly zaehlerstandMuster = /^\d{1,6}([,.]\d{1,2})?$/;
  private readonly pdfMaxGroesse = 5 * 1024 * 1024;
  private readonly gartenNamen = [
    'Anna Schneider',
    'Thomas Müller',
    'Sabrina Weber',
    'Jürgen Krüger',
    'Petra Grefkes',
    'Michael Wagner',
    'Nadin Detering',
    'Oliver Dahms',
    'Lars Andersen',
    'Martina Kliemann',
    'Bülent Kaplan',
    'Stefan Becker',
    'Karin Hofmann',
    'Daniel Schmitz',
    'Heike Braun',
    'Peter Grefkes',
    'Julia Neumann',
    'Melanie Koch',
    'Sandra Klein',
    'Frank Lange',
    'Miriam Vogel',
    'Andreas Richter',
    'Claudia Sommer',
    'Tobias Fischer',
    'Benjamin Bennewitz',
    'Sven Lehmann',
    'Birgit Schulte',
    'Ralf Zimmermann',
    'Nicole Brandt',
    'Christian Wolf',
    'Maren Stein',
    'Jan Hoffmann',
    'Ursula Peters',
    'Patrick Schröder',
    'Simone Hartmann',
    'Dirk Schäfer',
    'Anja Lorenz',
    'Markus Berg',
    'Elke Werner',
    'René Köhler',
    'Tanja Fuchs',
    'Lars Andersen',
    'Gisela Krämer',
    'Dennis Roth',
    'Monika Seidel',
    'Florian Busch',
    'Kathrin Jung',
    'Sebastian Meier',
  ];

  protected readonly mockMitglieder: Mitglied[] = [
    {
      benutzername: 'steinberg25',
      gartennummer: '25',
      passwort: 'Lavendel2026!',
      vorname: 'Benjamin',
      nachname: 'Bennewitz',
      rolle: 'Mitglied',
      istAdmin: false,
    },
    {
      benutzername: 'garten18',
      gartennummer: '18',
      passwort: 'Garten2026!',
      vorname: 'Martina',
      nachname: 'Kliemann',
      rolle: 'Vorstand',
      istAdmin: false,
    },
    {
      benutzername: 'parzelle42',
      gartennummer: '42',
      passwort: 'Steinberg42!',
      vorname: 'Lars',
      nachname: 'Andersen',
      rolle: 'Vorstand',
      istAdmin: false,
    },
    {
      benutzername: 'admin',
      gartennummer: '00',
      passwort: 'Vorstand2026!',
      vorname: 'KGV',
      nachname: 'Vorstand',
      rolle: 'Admin',
      istAdmin: true,
    },
  ];

  protected readonly rechnungen: Rechnung[] = [
    {
      datum: '15. Januar 2026',
      name: 'Jahresrechnung 2026',
      nummer: 'KGV-2026-001',
      betrag: '156,00 Euro',
      status: 'Bezahlt',
      url: 'assets/downloads/rechnungen/rechnung-kgv-2026-001.pdf',
      dateiname: 'rechnung-kgv-2026-001.pdf',
    },
    {
      datum: '12. April 2026',
      name: 'Abschlag Wasser und Strom',
      nummer: 'KGV-2026-014',
      betrag: '84,50 Euro',
      status: 'Offen',
      url: 'assets/downloads/rechnungen/rechnung-kgv-2026-014.pdf',
      dateiname: 'rechnung-kgv-2026-014.pdf',
    },
    {
      datum: '30. Juni 2026',
      name: 'Gemeinschaftsarbeit Ausgleich',
      nummer: 'KGV-2026-029',
      betrag: '60,00 Euro',
      status: 'In Prüfung',
      url: 'assets/downloads/rechnungen/rechnung-kgv-2026-029.pdf',
      dateiname: 'rechnung-kgv-2026-029.pdf',
    },
  ];

  protected readonly uebersichtskarten: Uebersichtskarte[] = [
    {
      titel: 'Rechnungen',
      text: 'Alle hinterlegten Rechnungen mit Datum, Rechnungsnummer, Betrag und PDF-Download.',
      icon: 'receipt_long',
      aktion: 'rechnungen',
      meta: '3 Dokumente',
    },
    {
      titel: 'Zählerstände',
      text: 'Strom- und Wasserzählerstand für die eigene Parzelle eintragen und sauber übermitteln.',
      icon: 'speed',
      aktion: 'zaehlerstaende',
      meta: 'Strom und Wasser',
    },
  ];

  protected readonly adminGaerten: GartenAdminKarte[] = GARTEN_PARZELLEN.map((garten, index) => {
    const gartennummer = garten.nummer.toString().padStart(2, '0');

    return {
      gartennummer,
      name: this.gartenNamen[index] ?? `Garten ${gartennummer}`,
      lage: garten.lage,
      letzteZaehlerstaende: {
        strom: `${1180 + index * 17}`,
        wasser: `${24 + index}`,
      },
    };
  });

  protected loginDaten: LoginDaten = {
    benutzername: '',
    gartennummer: '',
    passwort: '',
  };

  protected loginFeldHinweise: Record<LoginFeld, string> = {
    benutzername: '',
    gartennummer: '',
    passwort: '',
  };

  protected rechnungUploadHinweise: Record<RechnungUploadFeld, string> = {
    datum: '',
    name: '',
    betrag: '',
  };

  protected angemeldetesMitglied: Mitglied | null = null;
  protected aktuelleAnsicht: MitgliederAnsicht = 'uebersicht';
  protected loginFehler = '';
  protected loginHinweis = '';
  protected ausgewaehlterGarten: GartenAdminKarte | null = null;
  protected rechnungUpload: RechnungUpload = {
    datum: '',
    name: '',
    betrag: '',
  };
  protected ausgewaehlteRechnungDatei = '';
  protected uploadFehler = '';
  protected uploadBestaetigung = '';
  protected adminRechnungen: Record<string, Rechnung[]> = {};

  private ausgewaehlteRechnungUrl = '';
  private routerEreignisAbo: Subscription | null = null;

  protected zaehlerstaendeEingabe: Record<ZaehlerTyp, string> = {
    strom: '',
    wasser: '',
  };

  protected zaehlerBestaetigung: Record<ZaehlerTyp, string> = {
    strom: '',
    wasser: '',
  };

  protected zaehlerFehler: Record<ZaehlerTyp, string> = {
    strom: '',
    wasser: '',
  };

  protected gespeicherteZaehlerstaende: Record<ZaehlerTyp, string> = {
    strom: '1284',
    wasser: '37',
  };

  constructor() {
    this.routerEreignisAbo = this.router.events.subscribe((ereignis) => {
      if (ereignis instanceof NavigationEnd) {
        this.aktuelleRouteAuswerten();
      }
    });

    effect(() => {
      const session = this.mitgliederSession.session();
      this.angemeldetesMitglied = this.mitgliedAusSession(session);

      if (!session) {
        this.ausgewaehlterGarten = null;
        this.loginHinweis = '';
      }

      this.aktuelleRouteAuswerten();
    });
  }

  /**
   * Entfernt das Router-Abo beim Verlassen der Komponente.
   */
  ngOnDestroy(): void {
    this.routerEreignisAbo?.unsubscribe();
  }

  /**
   * Aktualisiert und bereinigt ein Login-Feld direkt bei der Eingabe.
   */
  protected loginFeldAktualisieren(feld: LoginFeld, wert: string): void {
    const bereinigterWert = feld === 'gartennummer' ? this.bereinigeGartennummer(wert) : this.bereinigeSicheresTextfeld(wert, this.erlaubteLoginZeichenErsetzen);
    this.loginDaten = {
      ...this.loginDaten,
      [feld]: bereinigterWert,
    };
    this.loginFeldHinweise[feld] = wert !== bereinigterWert ? this.loginHinweisFuerFeld(feld) : '';
    this.loginFehler = '';
  }

  /**
   * Gibt zurück, ob ein Login-Feld aktuell eine Warnung besitzt.
   */
  protected hatLoginFeldHinweis(feld: LoginFeld): boolean {
    return this.loginFeldHinweise[feld].length > 0;
  }

  /**
   * Prüft, ob die Login-Eingaben vollständig und gültig sind.
   */
  protected istLoginGueltig(): boolean {
    return this.erlaubteLoginZeichen.test(this.loginDaten.benutzername) && this.istGartennummerGueltig(this.loginDaten.gartennummer) && this.erlaubteLoginZeichen.test(this.loginDaten.passwort);
  }

  /**
   * Prüft die eingegebenen Zugangsdaten gegen die lokalen Mockdaten.
   */
  protected anmelden(): void {
    if (!this.istLoginGueltig()) {
      this.loginHinweis = '';
      this.loginFehler = 'Bitte die Eingaben prüfen. Erlaubt sind A-Z, a-z, 0-9 und !?#* mit maximal 50 Zeichen.';
      return;
    }

    const benutzername = this.loginDaten.benutzername.trim().toLowerCase();
    const gartennummer = this.loginDaten.gartennummer.trim();
    const passwort = this.loginDaten.passwort;

    const gefundenesMitglied = this.mockMitglieder.find((mitglied) => mitglied.benutzername.toLowerCase() === benutzername && mitglied.gartennummer === gartennummer && mitglied.passwort === passwort);

    if (!gefundenesMitglied) {
      this.loginHinweis = '';
      this.loginFehler = 'Die eingegebenen Zugangsdaten passen nicht zusammen.';
      return;
    }

    this.mitgliederSession.anmelden({
      benutzername: gefundenesMitglied.benutzername,
      gartennummer: gefundenesMitglied.gartennummer,
      vorname: gefundenesMitglied.vorname,
      nachname: gefundenesMitglied.nachname,
      rolle: gefundenesMitglied.rolle,
      istAdmin: gefundenesMitglied.istAdmin,
    });

    this.loginFehler = '';
    this.loginHinweis = gefundenesMitglied.istAdmin ? 'Adminbereich geöffnet.' : `Willkommen im Mitgliederbereich, ${gefundenesMitglied.vorname}.`;
    this.loginDaten.passwort = '';

    const aktuelleRoute = this.router.url.split('?')[0].split('#')[0];

    if (gefundenesMitglied.istAdmin) {
      this.router.navigateByUrl('/mitgliederbereich/admin');
      return;
    }

    if (!aktuelleRoute.startsWith('/mitgliederbereich/') || aktuelleRoute.includes('/admin')) {
      this.router.navigateByUrl('/mitgliederbereich');
      return;
    }

    this.aktuelleRouteAuswerten();
  }

  /**
   * Meldet das aktuelle Mitglied ab und setzt die Ansicht zurück.
   */
  protected abmelden(): void {
    this.mitgliederSession.abmelden();
    this.loginFehler = '';
    this.loginFeldHinweise = {
      benutzername: '',
      gartennummer: '',
      passwort: '',
    };
    this.loginDaten = {
      benutzername: '',
      gartennummer: '',
      passwort: '',
    };
    this.router.navigateByUrl('/mitgliederbereich');
  }

  /**
   * Wechselt zwischen Übersicht, Rechnungen und Zählerständen.
   */
  protected ansichtWechseln(ansicht: MitgliederAnsicht): void {
    this.router.navigateByUrl(this.routeFuerAnsicht(ansicht));
  }

  /**
   * Gibt die interne Route für eine Mitgliederansicht zurück.
   */
  protected routeFuerAnsicht(ansicht: MitgliederAnsicht): string {
    if (ansicht === 'rechnungen') {
      return '/mitgliederbereich/rechnungen';
    }

    if (ansicht === 'zaehlerstaende') {
      return '/mitgliederbereich/zaehlerstaende';
    }

    if (ansicht === 'admin') {
      return '/mitgliederbereich/admin';
    }

    return '/mitgliederbereich';
  }

  /**
   * Öffnet die Admin-Übersicht für einen Garten.
   */
  protected adminGartenAuswaehlen(garten: GartenAdminKarte): void {
    this.ausgewaehlterGarten = garten;
    this.uploadFehler = '';
    this.uploadBestaetigung = '';
  }

  /**
   * Aktualisiert und prüft eine Zählerstandseingabe.
   */
  protected zaehlerFeldAktualisieren(typ: ZaehlerTyp, wert: string): void {
    const bereinigterWert = this.bereinigeZaehlerstand(wert);
    this.zaehlerstaendeEingabe[typ] = bereinigterWert;
    this.zaehlerBestaetigung[typ] = '';

    if (wert !== bereinigterWert) {
      this.zaehlerFehler[typ] = 'Bitte nur Zahlen mit maximal zwei Nachkommastellen eintragen.';
      return;
    }

    this.zaehlerFehler[typ] = bereinigterWert && !this.istZaehlerstandGueltig(typ) ? 'Der Zählerstand darf maximal sechs Stellen und zwei Nachkommastellen haben.' : '';
  }

  /**
   * Prüft einen Zählerstand für die Übergabe.
   */
  protected istZaehlerstandGueltig(typ: ZaehlerTyp): boolean {
    return this.zaehlerstandMuster.test(this.zaehlerstaendeEingabe[typ]);
  }

  /**
   * Übernimmt den eingetragenen Zählerstand lokal in die aktuelle Ansicht.
   */
  protected zaehlerstandSenden(typ: ZaehlerTyp): void {
    const aktuellerWert = this.zaehlerstaendeEingabe[typ].trim();
    const bezeichnung = typ === 'strom' ? 'Stromzählerstand' : 'Wasserzählerstand';

    if (!aktuellerWert) {
      this.zaehlerBestaetigung[typ] = '';
      this.zaehlerFehler[typ] = `${bezeichnung} bitte eintragen.`;
      return;
    }

    if (!this.istZaehlerstandGueltig(typ)) {
      this.zaehlerBestaetigung[typ] = '';
      this.zaehlerFehler[typ] = 'Bitte einen gültigen Zahlenwert eintragen.';
      return;
    }

    if (!this.angemeldetesMitglied) {
      this.zaehlerBestaetigung[typ] = '';
      this.zaehlerFehler[typ] = 'Bitte erneut anmelden.';
      return;
    }

    this.gespeicherteZaehlerstaende[typ] = aktuellerWert.replace(',', '.');
    this.zaehlerFehler[typ] = '';
    this.zaehlerBestaetigung[typ] = `${bezeichnung} ${aktuellerWert} wurde übernommen.`;
    this.zaehlerstaendeEingabe[typ] = '';
    this.mitgliederSession.zaehlerstandEintragen({
      id: `${typ}-${this.angemeldetesMitglied.gartennummer}-${Date.now()}`,
      gartennummer: this.angemeldetesMitglied.gartennummer.padStart(2, '0'),
      name: `${this.angemeldetesMitglied.vorname} ${this.angemeldetesMitglied.nachname}`,
      typ,
      wert: aktuellerWert.replace(',', '.'),
      datum: new Date().toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'neu',
    });
  }

  /**
   * Aktualisiert und bereinigt ein Feld im Rechnungsupload.
   */
  protected rechnungUploadFeldAktualisieren(feld: RechnungUploadFeld, wert: string): void {
    const bereinigterWert = feld === 'datum' ? wert.slice(0, 10) : this.bereinigeSicheresTextfeld(wert, this.erlaubteRechnungsZeichenErsetzen);
    this.rechnungUpload = {
      ...this.rechnungUpload,
      [feld]: bereinigterWert,
    };
    this.rechnungUploadHinweise[feld] = wert !== bereinigterWert ? 'Erlaubt sind A-Z, a-z, 0-9 und !?#* mit maximal 50 Zeichen.' : '';
    this.uploadFehler = '';
  }

  /**
   * Prüft die Rechnungsfelder ohne Datei.
   */
  protected istRechnungUploadFormGueltig(): boolean {
    return this.istDatumGueltig(this.rechnungUpload.datum) && this.erlaubteRechnungsZeichen.test(this.rechnungUpload.name) && this.erlaubteRechnungsZeichen.test(this.rechnungUpload.betrag);
  }

  /**
   * Prüft das vollständige Uploadformular inklusive PDF-Datei.
   */
  protected istRechnungUploadGueltig(): boolean {
    return this.istRechnungUploadFormGueltig() && this.ausgewaehlteRechnungDatei.length > 0 && this.ausgewaehlteRechnungUrl.length > 0;
  }

  /**
   * Merkt sich die ausgewählte Rechnungsdatei für den Admin-Upload.
   */
  protected rechnungDateiAuswaehlen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const datei = input.files?.[0];

    this.uploadFehler = '';
    this.uploadBestaetigung = '';

    if (!datei) {
      this.ausgewaehlteRechnungDatei = '';
      this.ausgewaehlteRechnungUrl = '';
      return;
    }

    if (!this.istPdfDateiGueltig(datei)) {
      this.ausgewaehlteRechnungDatei = '';
      this.ausgewaehlteRechnungUrl = '';
      input.value = '';
      this.uploadFehler = 'Bitte eine PDF-Datei bis maximal 5 MB auswählen.';
      return;
    }

    this.ausgewaehlteRechnungDatei = this.bereinigeDateiname(datei.name);
    this.ausgewaehlteRechnungUrl = URL.createObjectURL(datei);
  }

  /**
   * Fügt die gewählte Rechnung der Gartenübersicht hinzu.
   */
  protected rechnungHochladen(): void {
    if (!this.ausgewaehlterGarten) {
      this.uploadFehler = 'Bitte zuerst einen Garten auswählen.';
      this.uploadBestaetigung = '';
      return;
    }

    if (!this.istRechnungUploadGueltig()) {
      this.uploadFehler = 'Bitte Datum, Bezeichnung, Betrag und PDF-Datei prüfen.';
      this.uploadBestaetigung = '';
      return;
    }

    const gartennummer = this.ausgewaehlterGarten.gartennummer;
    const neueRechnung: Rechnung = {
      datum: this.formatiereDatum(this.rechnungUpload.datum),
      name: this.rechnungUpload.name.trim(),
      nummer: `KGV-${new Date().getFullYear()}-${gartennummer}-${this.rechnungenFuerGarten(gartennummer).length + 1}`,
      betrag: this.rechnungUpload.betrag.trim(),
      status: 'Neu hinterlegt',
      url: this.ausgewaehlteRechnungUrl,
      dateiname: this.ausgewaehlteRechnungDatei,
    };

    this.adminRechnungen[gartennummer] = [neueRechnung, ...this.rechnungenFuerGarten(gartennummer)];
    this.uploadFehler = '';
    this.uploadBestaetigung = `Rechnung wurde für Garten ${gartennummer} übernommen.`;
    this.rechnungUpload = {
      datum: '',
      name: '',
      betrag: '',
    };
    this.rechnungUploadHinweise = {
      datum: '',
      name: '',
      betrag: '',
    };
    this.ausgewaehlteRechnungDatei = '';
    this.ausgewaehlteRechnungUrl = '';
  }

  /**
   * Gibt zurück, ob die aktuelle Sitzung Admin-Rechte besitzt.
   */
  protected istAdmin(): boolean {
    return this.angemeldetesMitglied?.istAdmin === true;
  }

  /**
   * Gibt alle neuen Zählerstandsmeldungen zurück.
   */
  protected neueZaehlerstaende(): EingereichterZaehlerstand[] {
    return this.mitgliederSession.zaehlerstaende().filter((eintrag) => eintrag.status === 'neu');
  }

  /**
   * Gibt die Anzahl neuer Zählerstände für einen Garten zurück.
   */
  protected adminGartenBenachrichtigung(gartennummer: string): number {
    return this.neueZaehlerEingaengeFuerGarten(gartennummer).length;
  }

  /**
   * Gibt die Rechnungen für einen Garten zurück.
   */
  protected rechnungenFuerGarten(gartennummer: string): Rechnung[] {
    return this.adminRechnungen[gartennummer] ?? this.rechnungen;
  }

  /**
   * Gibt neue Zählerstandsmeldungen für einen Garten zurück.
   */
  protected neueZaehlerEingaengeFuerGarten(gartennummer: string): EingereichterZaehlerstand[] {
    return this.mitgliederSession.zaehlerstaende().filter((eintrag) => eintrag.gartennummer === gartennummer && eintrag.status === 'neu');
  }

  /**
   * Gibt den letzten bekannten Strom- und Wasserstand für einen Garten zurück.
   */
  protected letzteZaehlerstaendeFuerGarten(garten: GartenAdminKarte): Record<ZaehlerTyp, string> {
    const eintraege = this.mitgliederSession.zaehlerstaende().filter((eintrag) => eintrag.gartennummer === garten.gartennummer);
    const strom = eintraege.find((eintrag) => eintrag.typ === 'strom');
    const wasser = eintraege.find((eintrag) => eintrag.typ === 'wasser');

    return {
      strom: strom?.wert ?? garten.letzteZaehlerstaende.strom,
      wasser: wasser?.wert ?? garten.letzteZaehlerstaende.wasser,
    };
  }

  /**
   * Synchronisiert die sichtbare Ansicht mit der aktuellen URL und Sitzung.
   */
  private aktuelleRouteAuswerten(): void {
    const ansicht = this.ansichtAusUrl(this.router.url);

    if (!this.angemeldetesMitglied) {
      this.aktuelleAnsicht = ansicht === 'admin' ? 'uebersicht' : ansicht;
      return;
    }

    if (this.angemeldetesMitglied.istAdmin) {
      this.aktuelleAnsicht = 'admin';
      this.ausgewaehlterGarten = this.ausgewaehlterGarten ?? this.adminGaerten[0] ?? null;
      return;
    }

    this.aktuelleAnsicht = ansicht === 'admin' ? 'uebersicht' : ansicht;
  }

  /**
   * Ermittelt die passende interne Ansicht aus der aktuellen Route.
   */
  private ansichtAusUrl(url: string): MitgliederAnsicht {
    const route = url.split('?')[0].split('#')[0];

    if (route.endsWith('/rechnungen')) {
      return 'rechnungen';
    }

    if (route.endsWith('/zaehlerstaende')) {
      return 'zaehlerstaende';
    }

    if (route.endsWith('/admin')) {
      return 'admin';
    }

    return 'uebersicht';
  }

  /**
   * Erstellt aus einer gespeicherten Sitzung ein Mitglied für die Ansicht.
   */
  private mitgliedAusSession(session: MitgliederSession | null): Mitglied | null {
    if (!session) {
      return null;
    }

    const mockMitglied = this.mockMitglieder.find((mitglied) => mitglied.benutzername === session.benutzername && mitglied.gartennummer === session.gartennummer);

    if (mockMitglied) {
      return mockMitglied;
    }

    return {
      benutzername: session.benutzername,
      gartennummer: session.gartennummer,
      passwort: '',
      vorname: session.vorname,
      nachname: session.nachname,
      rolle: session.rolle,
      istAdmin: session.istAdmin,
    };
  }

  /**
   * Kürzt und bereinigt ein Textfeld anhand einer Zeichen-Whitelist.
   */
  private bereinigeSicheresTextfeld(wert: string, ersetzen: RegExp): string {
    return `${wert ?? ''}`.replace(ersetzen, '').slice(0, 50);
  }

  /**
   * Bereinigt die Gartennummer für Login und Adminzugang.
   */
  private bereinigeGartennummer(wert: string): string {
    return `${wert ?? ''}`.replace(/\D/g, '').slice(0, 2);
  }

  /**
   * Gibt den Hilfetext für ein Login-Feld zurück.
   */
  private loginHinweisFuerFeld(feld: LoginFeld): string {
    if (feld === 'gartennummer') {
      return 'Bitte nur die Gartennummer von 01 bis 50 oder 00 für den Adminzugang eintragen.';
    }

    return 'Erlaubt sind A-Z, a-z, 0-9 und !?#* mit maximal 50 Zeichen.';
  }

  /**
   * Prüft die Gartennummer innerhalb des gültigen Bereichs.
   */
  private istGartennummerGueltig(wert: string): boolean {
    if (!/^\d{1,2}$/.test(wert)) {
      return false;
    }

    const nummer = Number(wert);
    return wert === '00' || (nummer >= 1 && nummer <= 50);
  }

  /**
   * Bereinigt einen Zählerstand auf Zahlen und ein Dezimaltrennzeichen.
   */
  private bereinigeZaehlerstand(wert: string): string {
    const nurZahlen = `${wert ?? ''}`.replace(/[^0-9,.]/g, '');
    const teile = nurZahlen.split(/[,.]/);
    const vorkomma = (teile[0] ?? '').slice(0, 6);
    const nachkomma = teile.length > 1 ? (teile.slice(1).join('') ?? '').slice(0, 2) : '';
    const trenner = nurZahlen.includes(',') ? ',' : nurZahlen.includes('.') ? '.' : '';

    return nachkomma || trenner ? `${vorkomma}${trenner}${nachkomma}` : vorkomma;
  }

  /**
   * Prüft das Upload-Datum auf ein gültiges HTML-Datum.
   */
  private istDatumGueltig(datum: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
      return false;
    }

    const zeit = new Date(datum).getTime();
    return !Number.isNaN(zeit);
  }

  /**
   * Prüft Dateityp, Endung und Größe der ausgewählten Rechnung.
   */
  private istPdfDateiGueltig(datei: File): boolean {
    return datei.type === 'application/pdf' && datei.name.toLowerCase().endsWith('.pdf') && datei.size > 0 && datei.size <= this.pdfMaxGroesse;
  }

  /**
   * Bereinigt den sichtbaren Dateinamen für die Listenansicht.
   */
  private bereinigeDateiname(dateiname: string): string {
    return dateiname.replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 80) || 'rechnung.pdf';
  }

  /**
   * Formatiert das Datum der Admin-Rechnung für die Listenansicht.
   */
  private formatiereDatum(datum: string): string {
    const formatiertesDatum = new Date(datum);

    if (Number.isNaN(formatiertesDatum.getTime())) {
      return datum;
    }

    return formatiertesDatum.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}
