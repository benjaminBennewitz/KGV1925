/* src/app/pages/rechtliches/rechtliches.component.ts */

import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

/**
 * Erlaubte Kennungen der rechtlichen Inhaltsseiten.
 */
type RechtlicheSeitenId = 'impressum' | 'datenschutz' | 'barrierefreiheit';

/**
 * Beschreibt eine kurze Übersichtskarte im Kopfbereich.
 */
interface RechtlichesKartenElement {
  icon: string;  // Material-Symbol der Karte.
  titel: string; // Überschrift der Karte.
  text: string;  // Kurzbeschreibung der Karte.
}

/**
 * Beschreibt einen internen oder externen Aktionslink.
 */
interface RechtlichesAktionsLink {
  label: string;           // Sichtbare Linküberschrift.
  text: string;            // Ergänzender Linktext.
  icon: string;            // Material-Symbol des Links.
  pfad?: string;           // Optionaler interner Router-Pfad.
  fragment?: string;       // Optionaler Sprunganker für interne Links.
  href?: string;           // Optionaler externer Link oder Protokoll-Link.
  hervorgehoben?: boolean; // Markiert besonders wichtige Kontaktwege.
}

/**
 * Beschreibt einen vollständigen Inhaltsabschnitt der rechtlichen Seiten.
 */
interface RechtlichesAbschnitt {
  titel: string;                         // Überschrift des Abschnitts.
  text: string[];                        // Textabsätze des Abschnitts.
  liste?: string[];                      // Optionale Zusatzliste.
  aktionen?: RechtlichesAktionsLink[];   // Optionale Handlungslinks.
  accessButtonDemo?: boolean;            // Aktiviert die Button-Darstellung im Barrierefreiheitsbereich.
  designerCredit?: boolean;              // Blendet den Designer-Credit als hervorgehobenen Link ein.
}

/**
 * Beschreibt eine komplette rechtliche Seite inklusive Navigation und Content.
 */
interface RechtlicheSeite {
  id: RechtlicheSeitenId;                // Technische Seitenkennung.
  eyebrow: string;                       // Kleine Bereichskennzeichnung.
  titel: string;                         // Hauptüberschrift.
  subline: string;                       // Einleitung unterhalb der Hauptüberschrift.
  stand: string;                         // Aktualitätsangabe der Seite.
  meta: string[];                        // Kurze Metainformationen im Hero.
  hinweisTitel: string;                  // Überschrift der Infokarte.
  hinweis: string;                       // Text der Infokarte.
  karten: RechtlichesKartenElement[];    // Übersichtskarten im Kopfbereich.
  abschnitte: RechtlichesAbschnitt[];    // Hauptinhalt der Seite.
  kontaktLinks: RechtlichesAktionsLink[]; // Sidebar-Links und Kontaktwege.
}

const VEREINSNAME = 'Kleingartenverein am Steinberg e.V. 1925';                 // Vollständiger Vereinsname.
const VEREINSADRESSE = 'Klagenfurter Straße 47, 41063 Mönchengladbach';          // Vereinsanschrift.
const VEREINSMAIL = 'kgvamsteinberg@gmail.com';                                 // Zentrale Vereinsmailadresse.
const VEREINSTEL = '015234027333';                                               // Zentrale Telefonnummer.

/**
 * Zentraler Kontaktformular-Link für rechtliche Seiten.
 */
const KONTAKTFORMULAR_LINK: RechtlichesAktionsLink = {
  label: 'Kontaktformular öffnen',
  text: 'Direkt zur Kontaktseite springen und eine Nachricht an den Verein senden.',
  icon: 'forward_to_inbox',
  pfad: '/kontakt',
  fragment: 'kontaktformular',
  hervorgehoben: true,
};

const RECHTLICHE_SEITEN: Record<RechtlicheSeitenId, RechtlicheSeite> = {
  impressum: {
    id: 'impressum',
    eyebrow: 'Rechtliches',
    titel: 'Impressum',
    subline: 'Anbieterkennzeichnung für die Website des Kleingartenvereins am Steinberg e.V. 1925.',
    stand: 'Stand: Juli 2026',
    meta: ['Anbieterkennzeichnung', 'Verein', 'Kontakt'],
    hinweisTitel: 'Direkter Kontakt zum Verein',
    hinweis: 'Für Fragen zum Verein, zu Inhalten dieser Website oder zu rechtlichen Angaben ist der Vorstand über Telefon, E-Mail oder das Kontaktformular erreichbar.',
    karten: [
      {
        icon: 'badge',
        titel: 'Vereinsangaben',
        text: 'Name, Anschrift, Vorstand und Kontaktwege sind zentral aufgeführt.',
      },
      {
        icon: 'verified_user',
        titel: 'Verantwortung',
        text: 'Verantwortlich für die Anbieterkennzeichnung und die Vereinsinhalte ist der Verein, vertreten durch den Vorstand.',
      },
      {
        icon: 'copyright',
        titel: 'Bild- und Urheberrechte',
        text: 'Eigene Gestaltung, eigene Bilder und bereitgestellte Vereinsunterlagen werden transparent benannt.',
      },
    ],
    abschnitte: [
      {
        titel: 'Angaben gemäß § 5 DDG',
        text: [
          VEREINSNAME,
          'Klagenfurter Straße 47',
          '41063 Mönchengladbach',
          'Deutschland',
        ],
      },
      {
        titel: 'Vertreten durch den Vorstand',
        text: [
          'Der Verein wird durch den Vorstand nach § 26 BGB vertreten.',
          '1. Vorsitzender: Bülent Kaplan',
          '2. Vorsitzender: Lars Andersen',
          'Kasse: Martina Kliemann',
        ],
      },
      {
        titel: 'Kontakt',
        text: [
          `Telefon: ${VEREINSTEL}`,
          `E-Mail: ${VEREINSMAIL}`,
          'Für Nachrichten an den Verein kann zusätzlich das Kontaktformular dieser Website genutzt werden.',
        ],
        aktionen: [
          KONTAKTFORMULAR_LINK,
          {
            label: 'E-Mail schreiben',
            text: VEREINSMAIL,
            icon: 'mail',
            href: `mailto:${VEREINSMAIL}`,
          },
          {
            label: 'Telefonisch kontaktieren',
            text: VEREINSTEL,
            icon: 'call',
            href: `tel:${VEREINSTEL}`,
          },
        ],
      },
      {
        titel: 'Registerangaben',
        text: [
          'Eintragung im Vereinsregister.',
          'Registergericht: Amtsgericht Mönchengladbach',
          'Registernummer: VR 689',
        ],
      },
      {
        titel: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
        text: [
          'Bülent Kaplan',
          VEREINSNAME,
          VEREINSADRESSE,
        ],
      },
      {
        titel: 'Webdesign, technische Umsetzung und Bildmaterial',
        text: [
          'Konzeption, Webdesign, technische Umsetzung sowie eigenes Bild- und Grafikmaterial:',
          'Vereinsbezogene Inhalte, Logos, Formulare, Dokumente und bereitgestellte Unterlagen liegen beim Verein beziehungsweise bei den jeweils benannten Rechteinhabern.',
        ],
        designerCredit: true,
      },
      {
        titel: 'Haftung für Inhalte',
        text: [
          'Die Inhalte dieser Website werden mit Sorgfalt erstellt und regelmäßig gepflegt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann dennoch keine Gewähr übernommen werden.',
          'Als Diensteanbieter ist der Verein für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.',
        ],
      },
      {
        titel: 'Haftung für Links',
        text: [
          'Diese Website kann Links zu externen Websites enthalten. Auf deren Inhalte hat der Verein keinen Einfluss. Für fremde Inhalte übernimmt der Verein daher keine Gewähr.',
          'Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar. Bei Bekanntwerden entsprechender Rechtsverletzungen werden solche Links umgehend entfernt.',
        ],
      },
      {
        titel: 'Urheberrecht',
        text: [
          'Texte, Bilder, Gestaltungselemente und sonstige Inhalte dieser Website unterliegen dem Urheberrecht. Eine Verwendung außerhalb der gesetzlich zulässigen Grenzen bedarf der vorherigen Zustimmung des Vereins beziehungsweise der jeweiligen Rechteinhaber.',
          'Downloads und Formulare dürfen im Rahmen der Vereinskommunikation genutzt werden, sofern keine abweichenden Hinweise angegeben sind.',
        ],
      },
    ],
    kontaktLinks: [
      KONTAKTFORMULAR_LINK,
      {
        label: 'Datenschutz lesen',
        text: 'Informationen zur Verarbeitung personenbezogener Daten.',
        icon: 'shield_lock',
        pfad: '/datenschutz',
      },
    ],
  },
  datenschutz: {
    id: 'datenschutz',
    eyebrow: 'Datenschutz',
    titel: 'Datenschutzerklärung',
    subline: 'Klare Information darüber, welche Daten auf dieser Website verarbeitet werden und welche bewusst nicht erhoben werden.',
    stand: 'Stand: Juli 2026',
    meta: ['Datensparsam', 'Ohne Tracking', 'Eigene Formulare'],
    hinweisTitel: 'Datensparsame Website',
    hinweis: 'Die Website ist ohne Analyse-Tools, Werbetracker, externe Schriftanbieter und nicht notwendige Cookies aufgebaut. Personenbezogene Daten entstehen nur technisch beim Seitenaufruf oder durch aktiv abgesendete Formulare.',
    karten: [
      {
        icon: 'cookie_off',
        titel: 'Keine Cookies',
        text: 'Es werden keine Tracking-Cookies, Werbenetzwerke oder externen Schriftanbieter eingesetzt.',
      },
      {
        icon: 'mail_lock',
        titel: 'Eigene Formulare',
        text: 'Kontakt- und Anfrageformulare übermitteln nur Angaben, die Besucher aktiv absenden.',
      },
      {
        icon: 'dns',
        titel: 'Hosting',
        text: 'Beim Aufruf der Website entstehen technisch notwendige Serverdaten beim Hostinganbieter.',
      },
    ],
    abschnitte: [
      {
        titel: 'Verantwortlicher',
        text: [
          VEREINSNAME,
          'Klagenfurter Straße 47',
          '41063 Mönchengladbach',
          `E-Mail: ${VEREINSMAIL}`,
          `Telefon: ${VEREINSTEL}`,
        ],
        aktionen: [KONTAKTFORMULAR_LINK],
      },
      {
        titel: 'Grundsatz unserer Website',
        text: [
          'Diese Website ist datensparsam aufgebaut. Wir verwenden keine Analyse-Tools, keine Werbetracker, keine extern eingebundenen Schriften, keine Karten- oder Videodienste von Drittanbietern und keine Social-Media-Plugins, die beim Seitenaufruf automatisch Daten übertragen.',
          'Personenbezogene Daten werden nur verarbeitet, wenn dies technisch notwendig ist oder wenn Besucher sie über ein Formular aktiv an den Verein übermitteln.',
        ],
      },
      {
        titel: 'Bereitstellung der Website und Server-Logfiles',
        text: [
          'Beim Aufruf der Website verarbeitet der Webserver technisch notwendige Zugriffsdaten. Dazu können insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Datei, übertragene Datenmenge, Browser- und Betriebssysteminformationen, Referrer-URL sowie Statuscodes gehören.',
          'Diese Verarbeitung ist notwendig, um die Website auszuliefern, Stabilität und Sicherheit zu gewährleisten und technische Fehler nachvollziehen zu können.',
          'Die Website wird nach aktueller Planung bei Hetzner Online GmbH gehostet. Sollte der Verein einen anderen Hostinganbieter beauftragen, gelten die gleichen Grundsätze für technisch notwendige Serverdaten.',
        ],
        liste: [
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse an einer sicheren und funktionsfähigen Website.',
          'Speicherdauer: Server-Logfiles werden nur so lange gespeichert, wie es für technische Sicherheit und Fehleranalyse erforderlich ist.',
        ],
      },
      {
        titel: 'Kontaktformular und E-Mail-Kommunikation',
        text: [
          'Wenn Besucher das Kontaktformular oder ein Anfrageformular nutzen, verarbeiten wir die dort eingegebenen Angaben. Dazu können Name, E-Mail-Adresse, Telefonnummer, Nachrichtentext und weitere freiwillige Angaben zum Anliegen gehören.',
          'Die Daten werden ausschließlich zur Bearbeitung der Anfrage, zur Rückmeldung und zur vereinsbezogenen Kommunikation verwendet. Die Nachricht kann als E-Mail an die zuständigen Personen des Vereins weitergeleitet werden. Dabei werden die Daten technisch über den Hostinganbieter und den vom Verein verwendeten E-Mail-Dienst verarbeitet.',
          'Nicht abgesendete Formulareingaben werden nicht dauerhaft gespeichert.',
        ],
        liste: [
          'Rechtsgrundlage bei allgemeinen Anfragen: Art. 6 Abs. 1 lit. f DSGVO.',
          'Rechtsgrundlage bei konkreten Anfragen zur Vereinshausvermietung oder vorvertraglichen Anliegen: Art. 6 Abs. 1 lit. b DSGVO.',
          'Speicherdauer: Anfragen werden gelöscht, sobald sie abschließend bearbeitet sind und keine gesetzlichen oder vereinsorganisatorischen Aufbewahrungsgründe entgegenstehen.',
        ],
        aktionen: [KONTAKTFORMULAR_LINK],
      },
      {
        titel: 'Vereinshausvermietung',
        text: [
          'Für Anfragen zur Vereinshausvermietung können zusätzliche Angaben erforderlich sein, zum Beispiel gewünschtes Datum, Art der Veranstaltung, Kontaktdaten und organisatorische Hinweise. Diese Angaben werden nur zur Prüfung, Abstimmung und Durchführung der Anfrage genutzt.',
          'Kommt es zu einer verbindlichen Buchung oder Abrechnung, können gesetzliche Aufbewahrungspflichten entstehen. In diesem Fall werden die hierfür erforderlichen Daten entsprechend den gesetzlichen Fristen gespeichert.',
        ],
      },
      {
        titel: 'Mitgliederbereich',
        text: [
          'Ein Mitgliederbereich ist perspektivisch vorgesehen. Solange dieser Bereich noch nicht produktiv eingesetzt wird, findet darüber keine Verarbeitung echter Mitgliederdaten statt.',
          'Vor einer späteren Freischaltung werden die Datenschutzhinweise für Anmeldung, Sitzungen, Rechnungen, Zählerstände und technische Sicherheitsmaßnahmen ergänzt.',
        ],
      },
      {
        titel: 'Keine Weitergabe zu Werbezwecken',
        text: [
          'Personenbezogene Daten werden nicht verkauft, nicht für Werbung ausgewertet und nicht an Dritte weitergegeben, sofern dies nicht zur Bearbeitung einer Anfrage, zur technischen Bereitstellung der Website oder aufgrund gesetzlicher Pflichten erforderlich ist.',
        ],
      },
      {
        titel: 'Rechte betroffener Personen',
        text: [
          'Betroffene Personen haben nach Maßgabe der DSGVO insbesondere das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen bestimmte Verarbeitungen.',
          'Außerdem besteht das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, wenn angenommen wird, dass die Verarbeitung personenbezogener Daten gegen Datenschutzrecht verstößt.',
        ],
      },
      {
        titel: 'Aktualisierung dieser Datenschutzerklärung',
        text: [
          'Diese Datenschutzerklärung wird angepasst, sobald sich technische Funktionen, Formulare, Hostinganbieter oder rechtliche Anforderungen ändern.',
        ],
      },
    ],
    kontaktLinks: [
      KONTAKTFORMULAR_LINK,
      {
        label: 'Impressum öffnen',
        text: 'Alle Anbieter- und Kontaktangaben an einer Stelle.',
        icon: 'badge',
        pfad: '/impressum',
      },
    ],
  },
  barrierefreiheit: {
    id: 'barrierefreiheit',
    eyebrow: 'Barrierefreiheit',
    titel: 'Erklärung zur Zugänglichkeit',
    subline: 'Gärten, Vereinsleben und digitale Informationen sollen für möglichst viele Menschen verständlich und erreichbar sein.',
    stand: 'Stand: Juli 2026',
    meta: ['Zugänglichkeit', 'A11y-Modus', 'Feedback'],
    hinweisTitel: 'Zugang beginnt mit Verständlichkeit',
    hinweis: 'Der Verein möchte digitale Informationen so anbieten, dass Mitglieder, Besucher und Interessierte sie möglichst leicht finden, verstehen und nutzen können.',
    karten: [
      {
        icon: 'accessibility_new',
        titel: 'Zugang für alle',
        text: 'Barrierefreiheit bedeutet verständliche Informationen, klare Wege und respektvolle Teilhabe.',
      },
      {
        icon: 'contrast',
        titel: 'A11y-Modus',
        text: 'Der Accessibility-Button bietet unterstützende Darstellungen für bessere Lesbarkeit und Bedienbarkeit.',
      },
      {
        icon: 'feedback',
        titel: 'Feedback erwünscht',
        text: 'Hinweise zu Barrieren helfen, die Website Schritt für Schritt zu verbessern.',
      },
    ],
    abschnitte: [
      {
        titel: 'Unser Anspruch',
        text: [
          'Der Kleingartenverein am Steinberg e.V. 1925 möchte Informationen rund um Verein, Termine, Service, Gartenwissen und Kontakt möglichst verständlich und zugänglich bereitstellen.',
          'Barrierefreiheit verstehen wir nicht nur technisch. Sie bedeutet auch, dass Menschen mit unterschiedlichen Fähigkeiten, Altersgruppen und Lebenssituationen am Vereinsleben teilhaben können und die wichtigsten Informationen ohne unnötige Hürden finden.',
        ],
      },
      {
        titel: 'Digitale Zugänglichkeit',
        text: [
          'Die Website wird mit Blick auf gute Lesbarkeit, klare Struktur, responsive Darstellung, sichtbare Fokuszustände und bedienbare Formulare entwickelt.',
          'Inhalte sollen auch auf kleinen Bildschirmen gut nutzbar sein. Texte werden gegliedert, Bedienelemente erhalten verständliche Beschriftungen und wichtige Informationen werden nicht ausschließlich über Farbe vermittelt.',
        ],
        liste: [
          'Semantische Überschriften und strukturierte Seitenbereiche',
          'Tastaturbedienbare Navigation und sichtbare Fokusmarkierungen',
          'Ausreichende Kontraste und gut lesbare Schriftgrößen',
          'Beschriftete Formulare mit verständlichen Hinweisen',
          'Responsive Layouts bis zu sehr kleinen Viewports',
          'Verzicht auf unnötige Drittanbieter-Einbindungen',
        ],
      },
      {
        titel: 'Accessibility-Button',
        text: [
          'Über den Accessibility-Button der Website können unterstützende Darstellungen aktiviert werden. Der Button befindet sich am rechten Bildschirmrand im unteren Bereich oberhalb des Scroll-to-Top-Buttons.',
          'Das Symbol zeigt eine Person mit ausgestreckten Armen. Es öffnet ein Bedienfeld für größere Schrift, höheren Kontrast, reduzierte Bewegung, Farbfilter und weitere Darstellungsoptionen.',
          'Der Button ist als zusätzliche Hilfe gedacht und ersetzt keine saubere barrierearme Grundgestaltung. Deshalb werden Kontraste, Fokuszustände, Formularhinweise und mobile Bedienbarkeit direkt im Design berücksichtigt.',
        ],
        accessButtonDemo: true,
      },
      {
        titel: 'Gärten und Vereinsleben',
        text: [
          'Auch außerhalb der Website ist Zugänglichkeit wichtig. Gärten können Begegnungsorte sein: für Familien, ältere Menschen, Kinder, Menschen mit Einschränkungen und alle, die Natur erleben möchten.',
          'Nicht jede gewachsene Gartenanlage kann jede bauliche Barriere sofort vollständig abbauen. Umso wichtiger sind klare Informationen, gegenseitige Rücksichtnahme und offene Kommunikation, wenn Unterstützung benötigt wird.',
        ],
      },
      {
        titel: 'Bekannte Einschränkungen',
        text: [
          'Die Website befindet sich im Aufbau. Einzelne Inhalte, Dokumente oder spätere Funktionen können noch nicht vollständig geprüft sein.',
          'PDF-Dokumente aus externen Quellen oder älteren Vereinsunterlagen können in ihrer Barrierefreiheit eingeschränkt sein. Neue eigene Inhalte sollen nach Möglichkeit zugänglicher erstellt werden.',
        ],
      },
      {
        titel: 'Feedback zu Barrieren',
        text: [
          'Wenn eine Barriere auffällt, ein Inhalt nicht verständlich ist oder ein Formular nicht gut bedienbar ist, kann der Verein über die Kontaktseite informiert werden.',
          'Hilfreich sind dabei eine kurze Beschreibung des Problems, das genutzte Gerät, der Browser und die betroffene Seite. So können Fehler gezielter nachvollzogen und verbessert werden.',
        ],
        aktionen: [KONTAKTFORMULAR_LINK],
      },
    ],
    kontaktLinks: [
      KONTAKTFORMULAR_LINK,
      {
        label: 'Servicebereich öffnen',
        text: 'Downloads, Formulare und zentrale Unterlagen des Vereins finden.',
        icon: 'inventory_2',
        pfad: '/service',
      },
    ],
  },
};

@Component({
  selector: 'app-rechtliches',
  imports: [RouterLink],
  templateUrl: './rechtliches.component.html',
  styleUrl: './rechtliches.component.scss',
})
export class RechtlichesComponent {
  private readonly route = inject(ActivatedRoute); // Aktuelle Routendaten.

  protected readonly seite = this.leseSeite(); // Aktiver Rechtstext.

  /**
   * Liest die konfigurierte rechtliche Seite aus den Routendaten.
   */
  private leseSeite(): RechtlicheSeite {
    const seitenId = this.route.snapshot.data['rechtlicheSeite'] as RechtlicheSeitenId | undefined;

    if (!seitenId || !RECHTLICHE_SEITEN[seitenId]) {
      return RECHTLICHE_SEITEN.impressum;
    }

    return RECHTLICHE_SEITEN[seitenId];
  }
}
