/* src/app/pages/mitgliederbereich/mitgliederbereich.component.ts */

import { Component, OnDestroy, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GARTENWISSEN_KATEGORIEN, GartenwissenBeitrag, GartenwissenKategorie } from '../../shared/data/gartenwissen.data';
import { TERMIN_KATEGORIEN, TERMIN_KATEGORIE_AKZENTE, TerminAkzent, TerminEintrag, TerminKategorie } from '../../shared/data/termine.data';
import { GARTEN_PARZELLEN } from '../../shared/data/verein.data';
import { AdminContentService, StartseitenPopup, VereinshausBelegung, VereinshausBelegungsArt } from '../../shared/services/admin-content.service';
import { EingereichterZaehlerstand, MitgliederRolle, MitgliederSession, MitgliederSessionService, ZaehlerTyp } from '../../shared/services/mitglieder-session.service';

type MitgliederAnsicht = 'uebersicht' | 'rechnungen' | 'zaehlerstaende' | 'admin';
type AdminBereich = 'gaerten' | 'termine' | 'vereinshaus' | 'gartenwissen' | 'popup';
type CrudModus = 'erstellen' | 'bearbeiten';
type LoginFeld = keyof LoginDaten;
type RechnungUploadFeld = keyof RechnungUpload;
type TerminFormularFeld = keyof TerminFormular;
type VereinshausFormularFeld = keyof VereinshausFormular;
type GartenwissenFormularFeld = keyof GartenwissenFormular;
type PopupFormularFeld = keyof PopupFormular;

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

interface AdminNavigationsEintrag {
  id: AdminBereich;
  titel: string;
  text: string;
  icon: string;
  route: string;
}

interface TerminFormular {
  slug: string;
  titel: string;
  datumISO: string;
  datumEndeISO: string;
  zeit: string;
  ort: string;
  kurztext: string;
  kategorie: TerminKategorie;
  kalenderKurz: string;
  akzent: TerminAkzent;
}

interface VereinshausFormular {
  id: string;
  datumISO: string;
  datumEndeISO: string;
  titel: string;
  kurztext: string;
  zeit: string;
  typ: string;
  kalenderKurz: string;
  art: VereinshausBelegungsArt;
}

interface GartenwissenFormular {
  slug: string;
  kategorie: GartenwissenKategorie;
  icon: string;
  titel: string;
  kurztext: string;
  saison: string;
  aufwand: 'Leicht' | 'Mittel';
  dauer: string;
  merksatz: string;
  schritteText: string;
  hinweiseText: string;
  tagsText: string;
  bild: string;
  bildAlt: string;
}

interface PopupFormular {
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

interface AdminCrudStatus {
  text: string;
  typ: 'ok' | 'fehler' | '';
}

@Component({
  selector: 'app-mitgliederbereich',
  imports: [FormsModule, RouterLink],
  templateUrl: './mitgliederbereich.component.html',
  styleUrl: './mitgliederbereich.component.scss',
})
export class MitgliederbereichComponent implements OnDestroy {
  private readonly mitgliederSession = inject(MitgliederSessionService);
  private readonly adminContent = inject(AdminContentService);
  private readonly router = inject(Router);
  private readonly erlaubteLoginZeichen = /^[A-Za-z0-9!?#*]{1,50}$/;
  private readonly erlaubteLoginZeichenErsetzen = /[^A-Za-z0-9!?#*]/g;
  private readonly erlaubteRechnungsZeichen = /^[A-Za-z0-9!?#*]{1,50}$/;
  private readonly erlaubteRechnungsZeichenErsetzen = /[^A-Za-z0-9!?#*]/g;
  private readonly zaehlerstandMuster = /^\d{1,6}([,.]\d{1,2})?$/;
  private readonly pdfMaxGroesse = 5 * 1024 * 1024;
  private readonly adminTextErsetzen = /[^A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:€&\n\r]/g;
  private readonly adminSlugErsetzen = /[^a-z0-9-]/g;
  private readonly adminTextMuster = /^[A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:€&\n\r]{2,900}$/;
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

  protected readonly adminBereiche: AdminNavigationsEintrag[] = [
    {
      id: 'gaerten',
      titel: 'Gärten',
      text: 'Rechnungen und Zählerstände je Parzelle.',
      icon: 'yard',
      route: '/mitgliederbereich/admin',
    },
    {
      id: 'termine',
      titel: 'Termine',
      text: 'Vereinstermine und interne Veranstaltungen.',
      icon: 'event_note',
      route: '/mitgliederbereich/admin/termine',
    },
    {
      id: 'vereinshaus',
      titel: 'Vereinshaus',
      text: 'Belegte Miettage und interne Reservierungen.',
      icon: 'house',
      route: '/mitgliederbereich/admin/vereinshaus',
    },
    {
      id: 'gartenwissen',
      titel: 'Gartenwissen',
      text: 'Wissensbeiträge erstellen und pflegen.',
      icon: 'local_florist',
      route: '/mitgliederbereich/admin/gartenwissen',
    },
    {
      id: 'popup',
      titel: 'Startseiten-Pop-up',
      text: 'Aktuelles Pop-up für die Startseite pflegen.',
      icon: 'select_window',
      route: '/mitgliederbereich/admin/popup',
    },
  ];

  protected readonly terminKategorien = TERMIN_KATEGORIEN;
  protected readonly terminAkzente: TerminAkzent[] = ['salbei', 'lavendel', 'sand', 'nacht'];
  protected readonly vereinshausArten: VereinshausBelegungsArt[] = ['vermietung', 'sperrung'];
  protected readonly gartenwissenKategorien = GARTENWISSEN_KATEGORIEN.filter((kategorie): kategorie is GartenwissenKategorie => kategorie !== 'Alle');
  protected readonly gartenwissenAufwand: Array<'Leicht' | 'Mittel'> = ['Leicht', 'Mittel'];

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
  protected aktiverAdminBereich: AdminBereich = 'gaerten';
  protected terminModus: CrudModus = 'erstellen';
  protected vereinshausModus: CrudModus = 'erstellen';
  protected gartenwissenModus: CrudModus = 'erstellen';
  protected popupModus: CrudModus = 'erstellen';
  protected terminOriginalSlug = '';
  protected vereinshausOriginalId = '';
  protected gartenwissenOriginalSlug = '';
  protected popupOriginalId = '';
  protected terminSuche = '';
  protected vereinshausSuche = '';
  protected terminFormular: TerminFormular = this.erstelleLeeresTerminFormular();
  protected vereinshausFormular: VereinshausFormular = this.erstelleLeeresVereinshausFormular();
  protected gartenwissenFormular: GartenwissenFormular = this.erstelleLeeresGartenwissenFormular();
  protected popupFormular: PopupFormular = this.erstelleLeeresPopupFormular();
  protected terminStatus: AdminCrudStatus = { text: '', typ: '' };
  protected vereinshausStatus: AdminCrudStatus = { text: '', typ: '' };
  protected gartenwissenStatus: AdminCrudStatus = { text: '', typ: '' };
  protected popupStatus: AdminCrudStatus = { text: '', typ: '' };
  protected terminHinweise: Record<TerminFormularFeld, string> = this.erstelleTerminHinweise();
  protected vereinshausHinweise: Record<VereinshausFormularFeld, string> = this.erstelleVereinshausHinweise();
  protected gartenwissenHinweise: Record<GartenwissenFormularFeld, string> = this.erstelleGartenwissenHinweise();
  protected popupHinweise: Record<PopupFormularFeld, string> = this.erstellePopupHinweise();

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
   * Wechselt innerhalb des Adminbereichs in eine Verwaltungsansicht.
   */
  protected adminBereichWechseln(bereich: AdminBereich): void {
    this.router.navigateByUrl(this.routeFuerAdminBereich(bereich));
  }

  /**
   * Gibt die Route für einen Admin-Unterbereich zurück.
   */
  protected routeFuerAdminBereich(bereich: AdminBereich): string {
    return this.adminBereiche.find((eintrag) => eintrag.id === bereich)?.route ?? '/mitgliederbereich/admin';
  }

  /**
   * Gibt alle verwalteten Vereinstermine aus dem lokalen Admin-Store zurück.
   */
  protected verwalteteTermine(): TerminEintrag[] {
    return this.adminContent.termine();
  }

  /**
   * Gibt die gefilterten Termine für die Admin-Liste zurück.
   */
  protected verwalteteTermineGefiltert(): TerminEintrag[] {
    const suche = this.normalisiereSuche(this.terminSuche);

    if (!suche) {
      return this.verwalteteTermine();
    }

    return this.verwalteteTermine().filter((termin) => this.passtTerminZurSuche(termin, suche));
  }

  /**
   * Aktualisiert die Termin-Suche im Adminbereich.
   */
  protected terminSucheAktualisieren(wert: string): void {
    this.terminSuche = this.bereinigeAdminText(wert, 80);
  }

  /**
   * Gibt alle verwalteten Vereinshausbelegungen aus dem lokalen Admin-Store zurück.
   */
  protected verwalteteVereinshausBelegungen(): VereinshausBelegung[] {
    return this.adminContent.vereinshausBelegungen();
  }

  /**
   * Gibt die gefilterten Vereinshausbelegungen für die Admin-Liste zurück.
   */
  protected verwalteteVereinshausBelegungenGefiltert(): VereinshausBelegung[] {
    const suche = this.normalisiereSuche(this.vereinshausSuche);

    if (!suche) {
      return this.verwalteteVereinshausBelegungen();
    }

    return this.verwalteteVereinshausBelegungen().filter((belegung) => this.passtVereinshausBelegungZurSuche(belegung, suche));
  }

  /**
   * Aktualisiert die Vereinshaus-Suche im Adminbereich.
   */
  protected vereinshausSucheAktualisieren(wert: string): void {
    this.vereinshausSuche = this.bereinigeAdminText(wert, 80);
  }

  /**
   * Gibt alle verwalteten Gartenwissen-Beiträge aus dem lokalen Admin-Store zurück.
   */
  protected verwalteteGartenwissen(): GartenwissenBeitrag[] {
    return this.adminContent.gartenwissen();
  }

  /**
   * Gibt alle verwalteten Startseiten-Pop-ups aus dem lokalen Admin-Store zurück.
   */
  protected verwalteteStartseitenPopups(): StartseitenPopup[] {
    return this.adminContent.startseitenPopups();
  }

  /**
   * Formatiert ein ISO-Datum für kompakte Admin-Listen.
   */
  protected formatiereDatumKurz(datumISO: string): string {
    if (!this.istDatumGueltig(datumISO)) {
      return datumISO || 'ohne Datum';
    }

    return new Date(`${datumISO}T12:00:00`).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  /**
   * Formatiert einen Datumsbereich für kompakte Admin-Listen.
   */
  protected formatiereDatumsbereichKurz(startISO: string, endeISO = ''): string {
    if (!endeISO || endeISO === startISO) {
      return this.formatiereDatumKurz(startISO);
    }

    return `${this.formatiereDatumKurz(startISO)} bis ${this.formatiereDatumKurz(endeISO)}`;
  }

  /**
   * Setzt das Terminformular in den Erstellen-Modus zurück.
   */
  protected terminNeu(): void {
    this.terminModus = 'erstellen';
    this.terminOriginalSlug = '';
    this.terminFormular = this.erstelleLeeresTerminFormular();
    this.terminHinweise = this.erstelleTerminHinweise();
    this.terminStatus = { text: '', typ: '' };
  }

  /**
   * Lädt einen vorhandenen Termin in das Bearbeitungsformular.
   */
  protected terminBearbeiten(termin: TerminEintrag): void {
    this.terminModus = 'bearbeiten';
    this.terminOriginalSlug = termin.slug;
    this.terminFormular = this.erstelleTerminFormularAusEintrag(termin);
    this.terminHinweise = this.erstelleTerminHinweise();
    this.terminStatus = { text: `Termin „${termin.titel}“ wird bearbeitet.`, typ: 'ok' };
  }

  /**
   * Aktualisiert und bereinigt ein Feld im Terminformular.
   */
  protected terminFeldAktualisieren(feld: TerminFormularFeld, wert: string): void {
    const bereinigterWert = feld === 'slug' ? this.bereinigeSlug(wert) : feld === 'datumISO' || feld === 'datumEndeISO' ? wert.slice(0, 10) : this.bereinigeAdminText(wert, feld === 'kurztext' ? 220 : 80);
    this.terminFormular = {
      ...this.terminFormular,
      [feld]: bereinigterWert,
    };
    this.terminHinweise[feld] = this.validiereTerminFeld(feld, bereinigterWert);
    this.terminStatus = { text: '', typ: '' };
  }

  /**
   * Setzt die vordefinierte Terminkategorie und weist automatisch die passende Farbe zu.
   */
  protected terminKategorieSetzen(kategorie: TerminKategorie): void {
    this.terminFormular = {
      ...this.terminFormular,
      kategorie,
      akzent: this.terminAkzentFuerKategorie(kategorie),
      kalenderKurz: this.terminFormular.kalenderKurz || kategorie,
    };
    this.terminHinweise.kategorie = this.validiereTerminFeld('kategorie', kategorie);
    this.terminStatus = { text: '', typ: '' };
  }

  /**
   * Gibt die automatisch hinterlegte Akzentfarbe einer Kategorie zurück.
   */
  protected terminAkzentFuerKategorie(kategorie: TerminKategorie): TerminAkzent {
    return TERMIN_KATEGORIE_AKZENTE[kategorie];
  }

  /**
   * Setzt den visuellen Akzent für den Termin.
   */
  protected terminAkzentSetzen(akzent: TerminAkzent): void {
    this.terminFormular = {
      ...this.terminFormular,
      akzent,
    };
  }

  /**
   * Prüft alle Pflichtfelder des Terminformulars.
   */
  protected istTerminFormularGueltig(): boolean {
    const pflichtfelder: TerminFormularFeld[] = ['slug', 'titel', 'datumISO', 'zeit', 'ort', 'kurztext', 'kategorie', 'kalenderKurz'];
    const felderGueltig = pflichtfelder.every((feld) => !this.validiereTerminFeld(feld, this.terminFormular[feld]));
    const endeGueltig = !this.terminFormular.datumEndeISO || !this.validiereTerminFeld('datumEndeISO', this.terminFormular.datumEndeISO);
    const slugEindeutig = !this.verwalteteTermine().some((termin) => termin.slug === this.terminFormular.slug && termin.slug !== this.terminOriginalSlug);

    return felderGueltig && endeGueltig && slugEindeutig;
  }

  /**
   * Speichert den Termin lokal im Admin-Store.
   */
  protected terminSpeichern(): void {
    this.aktualisiereTerminHinweise();

    if (!this.istTerminFormularGueltig()) {
      this.terminStatus = { text: 'Bitte alle Terminangaben prüfen. Slugs müssen eindeutig sein.', typ: 'fehler' };
      return;
    }

    const eintrag: TerminEintrag = {
      slug: this.terminFormular.slug,
      titel: this.terminFormular.titel.trim(),
      datum: this.baueTerminDatumText(this.terminFormular.datumISO, this.terminFormular.datumEndeISO),
      datumISO: this.terminFormular.datumISO,
      datumEndeISO: this.terminFormular.datumEndeISO || undefined,
      zeit: this.terminFormular.zeit.trim(),
      ort: this.terminFormular.ort.trim(),
      kurztext: this.terminFormular.kurztext.trim(),
      kategorie: this.terminFormular.kategorie,
      kalenderKurz: this.terminFormular.kalenderKurz.trim(),
      akzent: this.terminAkzentFuerKategorie(this.terminFormular.kategorie),
    };

    if (this.terminOriginalSlug && this.terminOriginalSlug !== eintrag.slug) {
      this.adminContent.terminLoeschen(this.terminOriginalSlug);
    }

    this.adminContent.terminSpeichern(eintrag);
    this.terminStatus = { text: `Termin „${eintrag.titel}“ wurde lokal gespeichert.`, typ: 'ok' };
    this.terminModus = 'bearbeiten';
    this.terminOriginalSlug = eintrag.slug;
    this.terminFormular = this.erstelleTerminFormularAusEintrag(eintrag);
  }

  /**
   * Entfernt einen Termin aus der lokalen Verwaltung.
   */
  protected terminLoeschen(slug: string): void {
    this.adminContent.terminLoeschen(slug);

    if (this.terminOriginalSlug === slug) {
      this.terminNeu();
    }

    this.terminStatus = { text: 'Termin wurde lokal gelöscht.', typ: 'ok' };
  }

  /**
   * Setzt das Vereinshausformular in den Erstellen-Modus zurück.
   */
  protected vereinshausNeu(): void {
    this.vereinshausModus = 'erstellen';
    this.vereinshausOriginalId = '';
    this.vereinshausFormular = this.erstelleLeeresVereinshausFormular();
    this.vereinshausHinweise = this.erstelleVereinshausHinweise();
    this.vereinshausStatus = { text: '', typ: '' };
  }

  /**
   * Lädt eine vorhandene Vereinshausbelegung in das Bearbeitungsformular.
   */
  protected vereinshausBearbeiten(belegung: VereinshausBelegung): void {
    this.vereinshausModus = 'bearbeiten';
    this.vereinshausOriginalId = belegung.id;
    this.vereinshausFormular = this.erstelleVereinshausFormularAusEintrag(belegung);
    this.vereinshausHinweise = this.erstelleVereinshausHinweise();
    this.vereinshausStatus = { text: `Belegung „${belegung.titel}“ wird bearbeitet.`, typ: 'ok' };
  }

  /**
   * Aktualisiert und bereinigt ein Feld im Vereinshausformular.
   */
  protected vereinshausFeldAktualisieren(feld: VereinshausFormularFeld, wert: string): void {
    const bereinigterWert = feld === 'datumISO' || feld === 'datumEndeISO' ? wert.slice(0, 10) : feld === 'id' ? this.bereinigeSlug(wert) : this.bereinigeAdminText(wert, feld === 'kurztext' ? 220 : 80);
    this.vereinshausFormular = {
      ...this.vereinshausFormular,
      [feld]: bereinigterWert,
    };
    this.vereinshausHinweise[feld] = this.validiereVereinshausFeld(feld, bereinigterWert);
    this.vereinshausStatus = { text: '', typ: '' };
  }

  /**
   * Setzt die Art der Vereinshausbelegung.
   */
  protected vereinshausArtSetzen(art: VereinshausBelegungsArt): void {
    this.vereinshausFormular = {
      ...this.vereinshausFormular,
      art,
      titel: art === 'vermietung' ? 'Vermietet' : 'Vereinshaus gesperrt',
      kurztext: art === 'vermietung' ? 'Das Vereinshaus ist an diesem Tag vermietet.' : 'Das Vereinshaus ist in diesem Zeitraum nicht verfügbar.',
      zeit: art === 'vermietung' ? '15:00 bis 22:00 Uhr' : 'ganztägig',
      typ: art === 'vermietung' ? 'Vermietung' : 'Sperrung',
      kalenderKurz: art === 'vermietung' ? 'Vermietet' : 'Gesperrt',
    };
    this.vereinshausStatus = { text: '', typ: '' };
  }

  /**
   * Prüft alle Pflichtfelder des Vereinshausformulars.
   */
  protected istVereinshausFormularGueltig(): boolean {
    const pflichtfelder: VereinshausFormularFeld[] = ['datumISO', 'titel', 'zeit', 'typ', 'kalenderKurz', 'kurztext'];
    const felderGueltig = pflichtfelder.every((feld) => !this.validiereVereinshausFeld(feld, this.vereinshausFormular[feld]));
    const endeGueltig = !this.vereinshausFormular.datumEndeISO || !this.validiereVereinshausFeld('datumEndeISO', this.vereinshausFormular.datumEndeISO);
    const zeitraumFrei = !this.ueberschneidetVereinshausZeitraum(this.vereinshausFormular.datumISO, this.vereinshausFormular.datumEndeISO || this.vereinshausFormular.datumISO, this.vereinshausOriginalId);

    return felderGueltig && endeGueltig && zeitraumFrei;
  }

  /**
   * Speichert eine Vereinshausbelegung lokal im Admin-Store.
   */
  protected vereinshausSpeichern(): void {
    this.aktualisiereVereinshausHinweise();

    if (!this.istVereinshausFormularGueltig()) {
      this.vereinshausStatus = { text: 'Bitte alle Vereinshausangaben prüfen. Pro Datum ist nur eine Belegung vorgesehen.', typ: 'fehler' };
      return;
    }

    const id = this.vereinshausOriginalId || `${this.vereinshausFormular.art}-${this.vereinshausFormular.datumISO}-${Date.now()}`;
    const eintrag: VereinshausBelegung = {
      id,
      datumISO: this.vereinshausFormular.datumISO,
      datumEndeISO: this.vereinshausFormular.datumEndeISO || undefined,
      titel: this.vereinshausFormular.titel.trim(),
      kurztext: this.vereinshausFormular.kurztext.trim(),
      zeit: this.vereinshausFormular.zeit.trim(),
      typ: this.vereinshausFormular.art === 'vermietung' ? 'Vermietung' : 'Sperrung',
      kalenderKurz: this.vereinshausFormular.art === 'vermietung' ? 'Vermietet' : 'Gesperrt',
      art: this.vereinshausFormular.art,
    };

    this.adminContent.vereinshausBelegungSpeichern(eintrag);
    this.vereinshausStatus = { text: `Vereinshausbelegung „${eintrag.titel}“ wurde lokal gespeichert.`, typ: 'ok' };
    this.vereinshausModus = 'bearbeiten';
    this.vereinshausOriginalId = eintrag.id;
    this.vereinshausFormular = this.erstelleVereinshausFormularAusEintrag(eintrag);
  }

  /**
   * Entfernt eine Vereinshausbelegung aus der lokalen Verwaltung.
   */
  protected vereinshausLoeschen(id: string): void {
    this.adminContent.vereinshausBelegungLoeschen(id);

    if (this.vereinshausOriginalId === id) {
      this.vereinshausNeu();
    }

    this.vereinshausStatus = { text: 'Vereinshausbelegung wurde lokal gelöscht.', typ: 'ok' };
  }

  /**
   * Setzt das Gartenwissenformular in den Erstellen-Modus zurück.
   */
  protected gartenwissenNeu(): void {
    this.gartenwissenModus = 'erstellen';
    this.gartenwissenOriginalSlug = '';
    this.gartenwissenFormular = this.erstelleLeeresGartenwissenFormular();
    this.gartenwissenHinweise = this.erstelleGartenwissenHinweise();
    this.gartenwissenStatus = { text: '', typ: '' };
  }

  /**
   * Lädt einen vorhandenen Gartenwissen-Beitrag in das Bearbeitungsformular.
   */
  protected gartenwissenBearbeiten(beitrag: GartenwissenBeitrag): void {
    this.gartenwissenModus = 'bearbeiten';
    this.gartenwissenOriginalSlug = beitrag.slug;
    this.gartenwissenFormular = this.erstelleGartenwissenFormularAusEintrag(beitrag);
    this.gartenwissenHinweise = this.erstelleGartenwissenHinweise();
    this.gartenwissenStatus = { text: `Beitrag „${beitrag.titel}“ wird bearbeitet.`, typ: 'ok' };
  }

  /**
   * Aktualisiert und bereinigt ein Feld im Gartenwissenformular.
   */
  protected gartenwissenFeldAktualisieren(feld: GartenwissenFormularFeld, wert: string): void {
    const bereinigterWert = feld === 'slug' ? this.bereinigeSlug(wert) : this.bereinigeAdminText(wert, this.adminMaxLaengeFuerGartenwissen(feld));
    this.gartenwissenFormular = {
      ...this.gartenwissenFormular,
      [feld]: bereinigterWert,
    };
    this.gartenwissenHinweise[feld] = this.validiereGartenwissenFeld(feld, bereinigterWert);
    this.gartenwissenStatus = { text: '', typ: '' };
  }

  /**
   * Setzt die Kategorie eines Gartenwissen-Beitrags.
   */
  protected gartenwissenKategorieSetzen(kategorie: GartenwissenKategorie): void {
    this.gartenwissenFormular = {
      ...this.gartenwissenFormular,
      kategorie,
    };
  }

  /**
   * Setzt den Aufwand eines Gartenwissen-Beitrags.
   */
  protected gartenwissenAufwandSetzen(aufwand: 'Leicht' | 'Mittel'): void {
    this.gartenwissenFormular = {
      ...this.gartenwissenFormular,
      aufwand,
    };
  }

  /**
   * Prüft alle Pflichtfelder des Gartenwissenformulars.
   */
  protected istGartenwissenFormularGueltig(): boolean {
    const pflichtfelder: GartenwissenFormularFeld[] = ['slug', 'titel', 'kurztext', 'saison', 'dauer', 'merksatz', 'schritteText', 'hinweiseText', 'tagsText', 'bild', 'bildAlt', 'icon'];
    const felderGueltig = pflichtfelder.every((feld) => !this.validiereGartenwissenFeld(feld, this.gartenwissenFormular[feld]));
    const slugEindeutig = !this.verwalteteGartenwissen().some((beitrag) => beitrag.slug === this.gartenwissenFormular.slug && beitrag.slug !== this.gartenwissenOriginalSlug);

    return felderGueltig && slugEindeutig;
  }

  /**
   * Speichert einen Gartenwissen-Beitrag lokal im Admin-Store.
   */
  protected gartenwissenSpeichern(): void {
    this.aktualisiereGartenwissenHinweise();

    if (!this.istGartenwissenFormularGueltig()) {
      this.gartenwissenStatus = { text: 'Bitte alle Gartenwissen-Angaben prüfen. Slugs müssen eindeutig sein.', typ: 'fehler' };
      return;
    }

    const eintrag: GartenwissenBeitrag = {
      slug: this.gartenwissenFormular.slug,
      kategorie: this.gartenwissenFormular.kategorie,
      icon: this.gartenwissenFormular.icon.trim(),
      titel: this.gartenwissenFormular.titel.trim(),
      kurztext: this.gartenwissenFormular.kurztext.trim(),
      saison: this.gartenwissenFormular.saison.trim(),
      aufwand: this.gartenwissenFormular.aufwand,
      dauer: this.gartenwissenFormular.dauer.trim(),
      merksatz: this.gartenwissenFormular.merksatz.trim(),
      schritte: this.textZuZeilen(this.gartenwissenFormular.schritteText),
      hinweise: this.textZuZeilen(this.gartenwissenFormular.hinweiseText),
      tags: this.textZuTags(this.gartenwissenFormular.tagsText),
      bild: this.gartenwissenFormular.bild.trim(),
      bildAlt: this.gartenwissenFormular.bildAlt.trim(),
    };

    if (this.gartenwissenOriginalSlug && this.gartenwissenOriginalSlug !== eintrag.slug) {
      this.adminContent.gartenwissenLoeschen(this.gartenwissenOriginalSlug);
    }

    this.adminContent.gartenwissenSpeichern(eintrag);
    this.gartenwissenStatus = { text: `Gartenwissen-Beitrag „${eintrag.titel}“ wurde lokal gespeichert.`, typ: 'ok' };
    this.gartenwissenModus = 'bearbeiten';
    this.gartenwissenOriginalSlug = eintrag.slug;
    this.gartenwissenFormular = this.erstelleGartenwissenFormularAusEintrag(eintrag);
  }

  /**
   * Entfernt einen Gartenwissen-Beitrag aus der lokalen Verwaltung.
   */
  protected gartenwissenLoeschen(slug: string): void {
    this.adminContent.gartenwissenLoeschen(slug);

    if (this.gartenwissenOriginalSlug === slug) {
      this.gartenwissenNeu();
    }

    this.gartenwissenStatus = { text: 'Gartenwissen-Beitrag wurde lokal gelöscht.', typ: 'ok' };
  }

  /**
   * Setzt das Pop-up-Formular in den Erstellen-Modus zurück.
   */
  protected popupNeu(): void {
    this.popupModus = 'erstellen';
    this.popupOriginalId = '';
    this.popupFormular = this.erstelleLeeresPopupFormular();
    this.popupHinweise = this.erstellePopupHinweise();
    this.popupStatus = { text: '', typ: '' };
  }

  /**
   * Lädt ein vorhandenes Pop-up in das Bearbeitungsformular.
   */
  protected popupBearbeiten(popup: StartseitenPopup): void {
    this.popupModus = 'bearbeiten';
    this.popupOriginalId = popup.id;
    this.popupFormular = this.erstellePopupFormularAusEintrag(popup);
    this.popupHinweise = this.erstellePopupHinweise();
    this.popupStatus = { text: `Pop-up „${popup.titel}“ wird bearbeitet.`, typ: 'ok' };
  }

  /**
   * Aktualisiert und bereinigt ein Feld im Pop-up-Formular.
   */
  protected popupFeldAktualisieren(feld: PopupFormularFeld, wert: string): void {
    const bereinigterWert = this.bereinigePopupFeld(feld, wert);
    this.popupFormular = {
      ...this.popupFormular,
      [feld]: bereinigterWert,
    };
    this.popupHinweise[feld] = this.validierePopupFeld(feld, bereinigterWert);
    this.popupStatus = { text: '', typ: '' };
  }

  /**
   * Setzt, ob ein Startseiten-Pop-up aktiv angezeigt werden soll.
   */
  protected popupAktivSetzen(aktiv: boolean): void {
    this.popupFormular = {
      ...this.popupFormular,
      aktiv,
    };
  }

  /**
   * Prüft alle Pflichtfelder des Pop-up-Formulars.
   */
  protected istPopupFormularGueltig(): boolean {
    const pflichtfelder: PopupFormularFeld[] = ['id', 'kicker', 'titel', 'text', 'datumISO', 'gueltigBisISO', 'buttonText', 'buttonRoute', 'bild', 'bildAlt', 'jahr'];
    const felderGueltig = pflichtfelder.every((feld) => !this.validierePopupFeld(feld, this.popupFormular[feld]));
    const idEindeutig = !this.verwalteteStartseitenPopups().some((popup) => popup.id === this.popupFormular.id && popup.id !== this.popupOriginalId);

    return felderGueltig && idEindeutig;
  }

  /**
   * Speichert ein Startseiten-Pop-up lokal im Admin-Store.
   */
  protected popupSpeichern(): void {
    this.aktualisierePopupHinweise();

    if (!this.istPopupFormularGueltig()) {
      this.popupStatus = { text: 'Bitte alle Pop-up-Angaben prüfen. IDs müssen eindeutig sein.', typ: 'fehler' };
      return;
    }

    const eintrag: StartseitenPopup = {
      id: this.popupFormular.id,
      aktiv: this.popupFormular.aktiv,
      kicker: this.popupFormular.kicker.trim(),
      titel: this.popupFormular.titel.trim(),
      text: this.popupFormular.text.trim(),
      datumISO: this.popupFormular.datumISO,
      gueltigBisISO: this.popupFormular.gueltigBisISO,
      buttonText: this.popupFormular.buttonText.trim(),
      buttonRoute: this.popupFormular.buttonRoute.trim(),
      bild: this.popupFormular.bild.trim(),
      bildAlt: this.popupFormular.bildAlt.trim(),
      jahr: this.popupFormular.jahr.trim(),
    };

    if (this.popupOriginalId && this.popupOriginalId !== eintrag.id) {
      this.adminContent.startseitenPopupLoeschen(this.popupOriginalId);
    }

    this.adminContent.startseitenPopupSpeichern(eintrag);
    this.popupStatus = { text: `Pop-up „${eintrag.titel}“ wurde lokal gespeichert.`, typ: 'ok' };
    this.popupModus = 'bearbeiten';
    this.popupOriginalId = eintrag.id;
    this.popupFormular = this.erstellePopupFormularAusEintrag(eintrag);
  }

  /**
   * Entfernt ein Startseiten-Pop-up aus der lokalen Verwaltung.
   */
  protected popupLoeschen(id: string): void {
    this.adminContent.startseitenPopupLoeschen(id);

    if (this.popupOriginalId === id) {
      this.popupNeu();
    }

    this.popupStatus = { text: 'Startseiten-Pop-up wurde lokal gelöscht.', typ: 'ok' };
  }


  /**
   * Nutzt ein vorhandenes Pop-up als neue Vorlage für das Folgejahr.
   */
  protected popupAlsVorlageNutzen(popup: StartseitenPopup): void {
    const folgejahr = this.ermittleFolgejahr(popup);
    const jahresDifferenz = Number(folgejahr) - Number(popup.jahr || popup.datumISO.slice(0, 4));

    this.popupModus = 'erstellen';
    this.popupOriginalId = '';
    this.popupFormular = {
      ...this.erstellePopupFormularAusEintrag(popup),
      id: this.erstellePopupVorlagenId(popup.id, folgejahr),
      aktiv: true,
      kicker: this.ersetzeJahrInText(popup.kicker, folgejahr),
      titel: this.ersetzeJahrInText(popup.titel, folgejahr),
      text: this.ersetzeJahrInText(popup.text, folgejahr),
      datumISO: this.verschiebeDatumUmJahre(popup.datumISO, jahresDifferenz),
      gueltigBisISO: this.verschiebeDatumUmJahre(popup.gueltigBisISO, jahresDifferenz),
      bild: this.ersetzeJahrInText(popup.bild, folgejahr),
      bildAlt: this.ersetzeJahrInText(popup.bildAlt, folgejahr),
      jahr: folgejahr,
    };
    this.popupHinweise = this.erstellePopupHinweise();
    this.popupStatus = { text: `Pop-up „${popup.titel}“ wurde als Vorlage für ${folgejahr} geladen.`, typ: 'ok' };
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
   * Erstellt ein leeres Terminformular mit sinnvollen Standardwerten.
   */
  private erstelleLeeresTerminFormular(): TerminFormular {
    const datumISO = this.heutigesDatumISO();
    const kategorie: TerminKategorie = 'Vereinsleben';

    return {
      slug: '',
      titel: '',
      datumISO,
      datumEndeISO: '',
      zeit: '18:00 Uhr',
      ort: 'Vereinsanlage',
      kurztext: '',
      kategorie,
      kalenderKurz: '',
      akzent: this.terminAkzentFuerKategorie(kategorie),
    };
  }

  /**
   * Erstellt ein Terminformular aus einem vorhandenen Termineintrag.
   */
  private erstelleTerminFormularAusEintrag(termin: TerminEintrag): TerminFormular {
    const kategorie = this.normalisiereTerminKategorie(termin.kategorie);

    return {
      slug: termin.slug,
      titel: termin.titel,
      datumISO: termin.datumISO,
      datumEndeISO: termin.datumEndeISO ?? '',
      zeit: termin.zeit,
      ort: termin.ort,
      kurztext: termin.kurztext,
      kategorie,
      kalenderKurz: termin.kalenderKurz,
      akzent: this.terminAkzentFuerKategorie(kategorie),
    };
  }

  /**
   * Erstellt ein leeres Vereinshausformular mit sinnvollen Standardwerten.
   */
  private erstelleLeeresVereinshausFormular(): VereinshausFormular {
    return {
      id: '',
      datumISO: this.heutigesDatumISO(),
      datumEndeISO: '',
      titel: 'Vermietet',
      kurztext: 'Das Vereinshaus ist an diesem Tag vermietet.',
      zeit: '15:00 bis 22:00 Uhr',
      typ: 'Vermietung',
      kalenderKurz: 'Vermietet',
      art: 'vermietung',
    };
  }

  /**
   * Erstellt ein Vereinshausformular aus einer vorhandenen Belegung.
   */
  private erstelleVereinshausFormularAusEintrag(belegung: VereinshausBelegung): VereinshausFormular {
    return {
      id: belegung.id,
      datumISO: belegung.datumISO,
      datumEndeISO: belegung.datumEndeISO ?? '',
      titel: belegung.titel,
      kurztext: belegung.kurztext,
      zeit: belegung.zeit,
      typ: belegung.typ,
      kalenderKurz: belegung.kalenderKurz,
      art: belegung.art,
    };
  }

  /**
   * Erstellt ein leeres Gartenwissenformular mit sinnvollen Standardwerten.
   */
  private erstelleLeeresGartenwissenFormular(): GartenwissenFormular {
    return {
      slug: '',
      kategorie: 'Saison',
      icon: 'local_florist',
      titel: '',
      kurztext: '',
      saison: 'Ganzjährig',
      aufwand: 'Leicht',
      dauer: '15 Minuten',
      merksatz: '',
      schritteText: '',
      hinweiseText: '',
      tagsText: '',
      bild: 'assets/img/lavendel-1_aquarell.webp',
      bildAlt: 'Lavendelzweige als ruhiges Gartenmotiv',
    };
  }

  /**
   * Erstellt ein Gartenwissenformular aus einem vorhandenen Beitrag.
   */
  private erstelleGartenwissenFormularAusEintrag(beitrag: GartenwissenBeitrag): GartenwissenFormular {
    return {
      slug: beitrag.slug,
      kategorie: beitrag.kategorie,
      icon: beitrag.icon,
      titel: beitrag.titel,
      kurztext: beitrag.kurztext,
      saison: beitrag.saison,
      aufwand: beitrag.aufwand,
      dauer: beitrag.dauer,
      merksatz: beitrag.merksatz,
      schritteText: beitrag.schritte.join('\n'),
      hinweiseText: beitrag.hinweise.join('\n'),
      tagsText: beitrag.tags.join(', '),
      bild: beitrag.bild,
      bildAlt: beitrag.bildAlt,
    };
  }


  /**
   * Erstellt ein leeres Pop-up-Formular mit sinnvollen Standardwerten.
   */
  private erstelleLeeresPopupFormular(): PopupFormular {
    return {
      id: 'naechster-laubenabend',
      aktiv: true,
      kicker: 'Laubenabend',
      titel: 'Nächster Laubenabend',
      text: 'Am Freitag, den 03.07.2026, laden wir zum nächsten Laubenabend ein. Kommt vorbei, bringt gute Laune mit und lasst uns den Abend gemeinsam auf der Anlage ausklingen.',
      datumISO: '2026-07-03',
      gueltigBisISO: '2026-07-31',
      buttonText: 'Termine ansehen',
      buttonRoute: '/termine',
      bild: 'assets/img/aktuelles/laubenabend-2026.webp',
      bildAlt: 'Gemütlicher Laubenabend im Kleingartenverein mit warmem Licht',
      jahr: '2026',
    };
  }

  /**
   * Erstellt ein Pop-up-Formular aus einem vorhandenen Eintrag.
   */
  private erstellePopupFormularAusEintrag(popup: StartseitenPopup): PopupFormular {
    return {
      id: popup.id,
      aktiv: popup.aktiv,
      kicker: popup.kicker,
      titel: popup.titel,
      text: popup.text,
      datumISO: popup.datumISO,
      gueltigBisISO: popup.gueltigBisISO,
      buttonText: popup.buttonText,
      buttonRoute: popup.buttonRoute,
      bild: popup.bild,
      bildAlt: popup.bildAlt,
      jahr: popup.jahr,
    };
  }

  /**
   * Erstellt leere Hinweisfelder für das Terminformular.
   */
  private erstelleTerminHinweise(): Record<TerminFormularFeld, string> {
    return {
      slug: '',
      titel: '',
      datumISO: '',
      datumEndeISO: '',
      zeit: '',
      ort: '',
      kurztext: '',
      kategorie: '',
      kalenderKurz: '',
      akzent: '',
    };
  }

  /**
   * Erstellt leere Hinweisfelder für das Vereinshausformular.
   */
  private erstelleVereinshausHinweise(): Record<VereinshausFormularFeld, string> {
    return {
      id: '',
      datumISO: '',
      datumEndeISO: '',
      titel: '',
      kurztext: '',
      zeit: '',
      typ: '',
      kalenderKurz: '',
      art: '',
    };
  }

  /**
   * Erstellt leere Hinweisfelder für das Gartenwissenformular.
   */
  private erstelleGartenwissenHinweise(): Record<GartenwissenFormularFeld, string> {
    return {
      slug: '',
      kategorie: '',
      icon: '',
      titel: '',
      kurztext: '',
      saison: '',
      aufwand: '',
      dauer: '',
      merksatz: '',
      schritteText: '',
      hinweiseText: '',
      tagsText: '',
      bild: '',
      bildAlt: '',
    };
  }


  /**
   * Erstellt leere Hinweisfelder für das Pop-up-Formular.
   */
  private erstellePopupHinweise(): Record<PopupFormularFeld, string> {
    return {
      id: '',
      aktiv: '',
      kicker: '',
      titel: '',
      text: '',
      datumISO: '',
      gueltigBisISO: '',
      buttonText: '',
      buttonRoute: '',
      bild: '',
      bildAlt: '',
      jahr: '',
    };
  }

  /**
   * Aktualisiert alle Termin-Hinweise auf Basis des aktuellen Formulars.
   */
  private aktualisiereTerminHinweise(): void {
    Object.keys(this.terminHinweise).forEach((feld) => {
      const terminFeld = feld as TerminFormularFeld;
      this.terminHinweise[terminFeld] = this.validiereTerminFeld(terminFeld, this.terminFormular[terminFeld]);
    });
  }

  /**
   * Aktualisiert alle Vereinshaus-Hinweise auf Basis des aktuellen Formulars.
   */
  private aktualisiereVereinshausHinweise(): void {
    Object.keys(this.vereinshausHinweise).forEach((feld) => {
      const vereinshausFeld = feld as VereinshausFormularFeld;
      this.vereinshausHinweise[vereinshausFeld] = this.validiereVereinshausFeld(vereinshausFeld, this.vereinshausFormular[vereinshausFeld]);
    });
  }

  /**
   * Aktualisiert alle Gartenwissen-Hinweise auf Basis des aktuellen Formulars.
   */
  private aktualisiereGartenwissenHinweise(): void {
    Object.keys(this.gartenwissenHinweise).forEach((feld) => {
      const wissenFeld = feld as GartenwissenFormularFeld;
      this.gartenwissenHinweise[wissenFeld] = this.validiereGartenwissenFeld(wissenFeld, this.gartenwissenFormular[wissenFeld]);
    });
  }


  /**
   * Aktualisiert alle Pop-up-Hinweise auf Basis des aktuellen Formulars.
   */
  private aktualisierePopupHinweise(): void {
    Object.keys(this.popupHinweise).forEach((feld) => {
      const popupFeld = feld as PopupFormularFeld;
      this.popupHinweise[popupFeld] = this.validierePopupFeld(popupFeld, this.popupFormular[popupFeld]);
    });
  }

  /**
   * Ermittelt den aktiven Admin-Unterbereich aus der aktuellen Route.
   */
  private adminBereichAusUrl(url: string): AdminBereich {
    const route = url.split('?')[0].split('#')[0];

    if (route.endsWith('/termine')) {
      return 'termine';
    }

    if (route.endsWith('/vereinshaus')) {
      return 'vereinshaus';
    }

    if (route.endsWith('/gartenwissen')) {
      return 'gartenwissen';
    }

    if (route.endsWith('/popup')) {
      return 'popup';
    }

    return 'gaerten';
  }

  /**
   * Bereinigt einen Admin-Text auf erlaubte Zeichen und eine maximale Länge.
   */
  private bereinigeAdminText(wert: string, maxLaenge: number): string {
    return `${wert ?? ''}`.replace(this.adminTextErsetzen, '').slice(0, maxLaenge);
  }

  /**
   * Bereinigt ein einzelnes Pop-up-Feld passend zum Feldtyp.
   */
  private bereinigePopupFeld(feld: PopupFormularFeld, wert: string): string {
    if (feld === 'id') {
      return this.bereinigeSlug(wert);
    }

    if (feld === 'datumISO' || feld === 'gueltigBisISO') {
      return wert.slice(0, 10);
    }

    if (feld === 'jahr') {
      return `${wert ?? ''}`.replace(/[^0-9]/g, '').slice(0, 4);
    }

    if (feld === 'bild') {
      return `${wert ?? ''}`.replace(/[^A-Za-zÄÖÜäöüß0-9._\/-]/g, '').slice(0, 180);
    }

    if (feld === 'bildAlt') {
      return this.bereinigeAdminText(wert, 160);
    }

    return this.bereinigeAdminText(wert, feld === 'text' ? 520 : 120);
  }

  /**
   * Bereinigt einen Slug auf Kleinbuchstaben, Ziffern und Bindestriche.
   */
  private bereinigeSlug(wert: string): string {
    return `${wert ?? ''}`.toLowerCase().replace(/\s+/g, '-').replace(this.adminSlugErsetzen, '').replace(/-+/g, '-').slice(0, 80);
  }

  /**
   * Ermittelt das Folgejahr für die Wiederverwendung eines Pop-ups.
   */
  private ermittleFolgejahr(popup: StartseitenPopup): string {
    const basisjahr = Number(popup.jahr || popup.datumISO.slice(0, 4));

    return `${Number.isFinite(basisjahr) ? basisjahr + 1 : new Date().getFullYear() + 1}`;
  }

  /**
   * Erstellt eine neue ID für eine wiederverwendete Pop-up-Vorlage.
   */
  private erstellePopupVorlagenId(id: string, jahr: string): string {
    const idMitJahr = /20\d{2}/.test(id) ? id.replace(/20\d{2}/g, jahr) : `${id}-${jahr}`;
    const basisId = this.bereinigeSlug(idMitJahr);

    if (!this.verwalteteStartseitenPopups().some((popup) => popup.id === basisId)) {
      return basisId;
    }

    return this.bereinigeSlug(`${basisId}-neu`);
  }

  /**
   * Ersetzt Jahreszahlen in Texten durch ein neues Jahr.
   */
  private ersetzeJahrInText(wert: string, jahr: string): string {
    return `${wert ?? ''}`.replace(/20\d{2}/g, jahr);
  }

  /**
   * Verschiebt ein ISO-Datum um eine Anzahl von Jahren.
   */
  private verschiebeDatumUmJahre(datumISO: string, jahre: number): string {
    if (!this.istDatumGueltig(datumISO) || !Number.isFinite(jahre)) {
      return datumISO;
    }

    const datum = new Date(`${datumISO}T12:00:00`);
    datum.setFullYear(datum.getFullYear() + jahre);
    const monat = `${datum.getMonth() + 1}`.padStart(2, '0');
    const tag = `${datum.getDate()}`.padStart(2, '0');

    return `${datum.getFullYear()}-${monat}-${tag}`;
  }

  /**
   * Validiert ein Terminformularfeld.
   */
  private validiereTerminFeld(feld: TerminFormularFeld, wert: string): string {
    if (feld === 'datumEndeISO' && !wert) {
      return '';
    }

    if (feld === 'datumISO' || feld === 'datumEndeISO') {
      if (!this.istDatumGueltig(wert)) {
        return 'Bitte ein gültiges Datum wählen.';
      }

      if (feld === 'datumEndeISO' && this.terminFormular.datumISO && wert < this.terminFormular.datumISO) {
        return 'Das Enddatum darf nicht vor dem Startdatum liegen.';
      }

      return '';
    }

    if (feld === 'slug') {
      if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(wert)) {
        return 'Bitte einen eindeutigen Slug mit Kleinbuchstaben, Zahlen und Bindestrichen eintragen.';
      }

      if (this.verwalteteTermine().some((termin) => termin.slug === wert && termin.slug !== this.terminOriginalSlug)) {
        return 'Dieser Slug wird bereits verwendet.';
      }

      return '';
    }

    if (feld === 'akzent') {
      return '';
    }

    if (feld === 'kategorie') {
      return this.terminKategorien.includes(wert as TerminKategorie) ? '' : 'Bitte eine vordefinierte Kategorie wählen.';
    }

    if (!this.adminTextMuster.test(wert)) {
      return 'Bitte 2 bis 900 erlaubte Zeichen eintragen.';
    }

    return '';
  }

  /**
   * Validiert ein Vereinshausformularfeld.
   */
  private validiereVereinshausFeld(feld: VereinshausFormularFeld, wert: string): string {
    if (feld === 'id') {
      return '';
    }

    if (feld === 'art') {
      return '';
    }

    if (feld === 'datumISO' || feld === 'datumEndeISO') {
      if (feld === 'datumEndeISO' && !wert) {
        return '';
      }

      if (!this.istDatumGueltig(wert)) {
        return 'Bitte ein gültiges Datum wählen.';
      }

      if (feld === 'datumEndeISO' && this.vereinshausFormular.datumISO && wert < this.vereinshausFormular.datumISO) {
        return 'Das Enddatum darf nicht vor dem Startdatum liegen.';
      }

      const start = feld === 'datumISO' ? wert : this.vereinshausFormular.datumISO;
      const ende = feld === 'datumEndeISO' ? wert : this.vereinshausFormular.datumEndeISO || wert;

      if (start && ende && this.ueberschneidetVereinshausZeitraum(start, ende, this.vereinshausOriginalId)) {
        return 'Für diesen Zeitraum gibt es bereits eine Belegung oder Sperrung.';
      }

      return '';
    }

    if (!this.adminTextMuster.test(wert)) {
      return 'Bitte 2 bis 900 erlaubte Zeichen eintragen.';
    }

    return '';
  }

  /**
   * Validiert ein Gartenwissenformularfeld.
   */
  private validiereGartenwissenFeld(feld: GartenwissenFormularFeld, wert: string): string {
    if (feld === 'kategorie' || feld === 'aufwand') {
      return '';
    }

    if (feld === 'slug') {
      if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(wert)) {
        return 'Bitte einen eindeutigen Slug mit Kleinbuchstaben, Zahlen und Bindestrichen eintragen.';
      }

      if (this.verwalteteGartenwissen().some((beitrag) => beitrag.slug === wert && beitrag.slug !== this.gartenwissenOriginalSlug)) {
        return 'Dieser Slug wird bereits verwendet.';
      }

      return '';
    }

    if ((feld === 'schritteText' || feld === 'hinweiseText') && this.textZuZeilen(wert).length === 0) {
      return 'Bitte mindestens eine Zeile eintragen.';
    }

    if (feld === 'tagsText' && this.textZuTags(wert).length === 0) {
      return 'Bitte mindestens ein Tag eintragen.';
    }

    if (!this.adminTextMuster.test(wert)) {
      return 'Bitte 2 bis 900 erlaubte Zeichen eintragen.';
    }

    return '';
  }

  /**
   * Validiert ein Pop-up-Formularfeld.
   */
  private validierePopupFeld(feld: PopupFormularFeld, wert: string | boolean): string {
    if (feld === 'aktiv') {
      return '';
    }

    const textwert = `${wert ?? ''}`;

    if (feld === 'datumISO' || feld === 'gueltigBisISO') {
      if (!this.istDatumGueltig(textwert)) {
        return 'Bitte ein gültiges Datum wählen.';
      }

      if (feld === 'gueltigBisISO' && this.popupFormular.datumISO && textwert < this.popupFormular.datumISO) {
        return 'Die Gültigkeit darf nicht vor dem Pop-up-Datum enden.';
      }

      return '';
    }

    if (feld === 'id') {
      if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(textwert)) {
        return 'Bitte eine eindeutige ID mit Kleinbuchstaben, Zahlen und Bindestrichen eintragen.';
      }

      if (this.verwalteteStartseitenPopups().some((popup) => popup.id === textwert && popup.id !== this.popupOriginalId)) {
        return 'Diese ID wird bereits verwendet.';
      }

      return '';
    }

    if (feld === 'buttonRoute' && !/^\/[a-z0-9\/-]{1,80}$/.test(textwert)) {
      return 'Bitte eine interne Route wie /termine eintragen.';
    }

    if (feld === 'jahr') {
      return /^[0-9]{4}$/.test(textwert) ? '' : 'Bitte ein vierstelliges Jahr eintragen.';
    }

    if (feld === 'bild') {
      return /^assets\/img\/[A-Za-zÄÖÜäöüß0-9._\/-]+\.(webp|png|jpg|jpeg)$/.test(textwert) ? '' : 'Bitte einen lokalen Bildpfad wie assets/img/aktuelles/bild.webp eintragen.';
    }

    if (!this.adminTextMuster.test(textwert)) {
      return 'Bitte 2 bis 900 erlaubte Zeichen eintragen.';
    }

    return '';
  }

  /**
   * Gibt die maximale Feldlänge für Gartenwissen-Felder zurück.
   */
  private adminMaxLaengeFuerGartenwissen(feld: GartenwissenFormularFeld): number {
    if (feld === 'kurztext' || feld === 'merksatz') {
      return 240;
    }

    if (feld === 'schritteText' || feld === 'hinweiseText') {
      return 900;
    }

    if (feld === 'tagsText') {
      return 180;
    }

    return 120;
  }

  /**
   * Prüft, ob ein Termin zur aktuellen Suchanfrage passt.
   */
  private passtTerminZurSuche(termin: TerminEintrag, suche: string): boolean {
    return [termin.titel, termin.datum, termin.datumISO, this.formatiereDatumKurz(termin.datumISO), termin.datumEndeISO ? this.formatiereDatumKurz(termin.datumEndeISO) : ''].some((wert) => this.normalisiereSuche(wert).includes(suche));
  }

  /**
   * Prüft, ob eine Vereinshausbelegung zur aktuellen Suchanfrage passt.
   */
  private passtVereinshausBelegungZurSuche(belegung: VereinshausBelegung, suche: string): boolean {
    return [belegung.titel, belegung.datumISO, belegung.datumEndeISO ?? '', this.formatiereDatumsbereichKurz(belegung.datumISO, belegung.datumEndeISO), belegung.typ].some((wert) => this.normalisiereSuche(wert).includes(suche));
  }

  /**
   * Normalisiert Suchtexte für einfache Vergleiche.
   */
  private normalisiereSuche(wert: string): string {
    return `${wert ?? ''}`.toLocaleLowerCase('de-DE').replace(/\s+/g, ' ').trim();
  }

  /**
   * Normalisiert externe oder alte Kategorien auf die vordefinierten Kategorien.
   */
  private normalisiereTerminKategorie(kategorie: string): TerminKategorie {
    if (this.terminKategorien.includes(kategorie as TerminKategorie)) {
      return kategorie as TerminKategorie;
    }

    if (kategorie === 'Vorstand') {
      return 'Vorstandssitzung';
    }

    return 'Vereinsleben';
  }

  /**
   * Prüft, ob ein Vereinshaus-Zeitraum bestehende Belegungen überschneidet.
   */
  private ueberschneidetVereinshausZeitraum(startISO: string, endeISO: string, ignorierteId: string): boolean {
    if (!this.istDatumGueltig(startISO) || !this.istDatumGueltig(endeISO)) {
      return false;
    }

    return this.verwalteteVereinshausBelegungen().some((belegung) => {
      if (belegung.id === ignorierteId) {
        return false;
      }

      const belegungStart = belegung.datumISO;
      const belegungEnde = belegung.datumEndeISO || belegung.datumISO;

      return startISO <= belegungEnde && endeISO >= belegungStart;
    });
  }

  /**
   * Erstellt den deutschen Datumsbereich für einen Termineintrag.
   */
  private baueTerminDatumText(startISO: string, endeISO: string): string {
    const start = this.formatiereDatumKurz(startISO);

    if (!endeISO || endeISO === startISO) {
      return start;
    }

    return `${start} bis ${this.formatiereDatumKurz(endeISO)}`;
  }

  /**
   * Wandelt mehrzeiligen Text in eine saubere Liste um.
   */
  private textZuZeilen(wert: string): string[] {
    return `${wert ?? ''}`.split(/\r?\n/).map((zeile) => zeile.trim()).filter(Boolean).slice(0, 12);
  }

  /**
   * Wandelt kommagetrennte oder mehrzeilige Tags in eine Liste um.
   */
  private textZuTags(wert: string): string[] {
    return `${wert ?? ''}`.split(/[,\n]/).map((tag) => tag.trim()).filter(Boolean).slice(0, 10);
  }

  /**
   * Erzeugt das heutige Datum als ISO-String für neue Admin-Formulare.
   */
  private heutigesDatumISO(): string {
    const heute = new Date();
    const monat = `${heute.getMonth() + 1}`.padStart(2, '0');
    const tag = `${heute.getDate()}`.padStart(2, '0');

    return `${heute.getFullYear()}-${monat}-${tag}`;
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
      this.aktiverAdminBereich = this.adminBereichAusUrl(this.router.url);
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

    if (route.startsWith('/mitgliederbereich/admin')) {
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
