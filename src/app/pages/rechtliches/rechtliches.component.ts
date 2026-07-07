/* src/app/pages/rechtliches/rechtliches.component.ts */

import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

type RechtlicheSeitenId = 'impressum' | 'datenschutz' | 'barrierefreiheit';

interface RechtlichesKartenElement {
  icon: string;
  titel: string;
  text: string;
}

interface RechtlichesAbschnitt {
  titel: string;
  text: string[];
  liste?: string[];
}

interface RechtlichesKontaktLink {
  label: string;
  pfad: string;
  text: string;
}

interface RechtlicheSeite {
  id: RechtlicheSeitenId;
  eyebrow: string;
  titel: string;
  subline: string;
  stand: string;
  hinweis: string;
  karten: RechtlichesKartenElement[];
  abschnitte: RechtlichesAbschnitt[];
  kontaktLinks: RechtlichesKontaktLink[];
}

const RECHTLICHE_SEITEN: Record<RechtlicheSeitenId, RechtlicheSeite> = {
  impressum: {
    id: 'impressum',
    eyebrow: 'Rechtliches',
    titel: 'Impressum',
    subline: 'Anbieterkennzeichnung für die Website des Kleingartenverein am Steinberg e.V. 1925.',
    stand: 'Stand: Juli 2026',
    hinweis: 'Bitte Vereinsanschrift, Registerdaten, vertretungsberechtigte Personen und Kontaktdaten vor Veröffentlichung final prüfen und einsetzen.',
    karten: [
      {
        icon: 'badge',
        titel: 'Vereinsangaben',
        text: 'Die Seite bündelt die Pflichtangaben zum Verein, zur Vertretung und zur Kontaktaufnahme.',
      },
      {
        icon: 'verified_user',
        titel: 'Verantwortung',
        text: 'Inhaltliche Verantwortlichkeiten und redaktionelle Hinweise sind transparent aufgeführt.',
      },
      {
        icon: 'edit_note',
        titel: 'Platzhalter prüfen',
        text: 'Offene Angaben sind sichtbar markiert und können vor dem Livegang sauber ersetzt werden.',
      },
    ],
    abschnitte: [
      {
        titel: 'Angaben gemäß § 5 DDG',
        text: [
          'Kleingartenverein am Steinberg e.V. 1925',
          '[Straße und Hausnummer ergänzen]',
          '[PLZ und Ort ergänzen]',
          'Deutschland',
        ],
      },
      {
        titel: 'Vertreten durch den Vorstand',
        text: [
          'Der Verein wird durch den Vorstand nach § 26 BGB vertreten.',
          '1. Vorsitzende/r: [Name ergänzen]',
          '2. Vorsitzende/r: [Name ergänzen]',
        ],
      },
      {
        titel: 'Kontakt',
        text: [
          'Telefon: [Telefonnummer ergänzen]',
          'E-Mail: [E-Mail-Adresse ergänzen]',
          'Kontaktformular: erreichbar über die Kontaktseite dieser Website',
        ],
      },
      {
        titel: 'Registerangaben',
        text: [
          'Eintragung im Vereinsregister: [Registergericht ergänzen]',
          'Registernummer: [VR-Nummer ergänzen]',
        ],
      },
      {
        titel: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
        text: [
          '[Name der verantwortlichen Person ergänzen]',
          '[Anschrift ergänzen, falls abweichend von der Vereinsanschrift]',
        ],
      },
      {
        titel: 'Haftung für Inhalte',
        text: [
          'Die Inhalte dieser Website werden mit Sorgfalt erstellt und regelmäßig gepflegt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann dennoch keine Gewähr übernommen werden.',
          'Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.',
        ],
      },
      {
        titel: 'Haftung für Links',
        text: [
          'Diese Website kann Links zu externen Websites enthalten. Auf deren Inhalte haben wir keinen Einfluss. Für fremde Inhalte übernehmen wir daher keine Gewähr.',
          'Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar. Bei Bekanntwerden entsprechender Rechtsverletzungen entfernen wir solche Links umgehend.',
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
      {
        label: 'Kontaktseite öffnen',
        pfad: '/kontakt',
        text: 'Für Rückfragen zum Verein oder zu den Angaben im Impressum.',
      },
      {
        label: 'Datenschutz lesen',
        pfad: '/datenschutz',
        text: 'Informationen zur Verarbeitung personenbezogener Daten.',
      },
    ],
  },
  datenschutz: {
    id: 'datenschutz',
    eyebrow: 'Datenschutz',
    titel: 'Datenschutzerklärung',
    subline: 'Klare Information darüber, welche Daten auf dieser Website verarbeitet werden und welche bewusst nicht erhoben werden.',
    stand: 'Stand: Juli 2026',
    hinweis: 'Der finale Hostinganbieter muss nach Vertragsschluss verbindlich ergänzt werden. Bis dahin ist Hetzner als voraussichtlicher Anbieter kenntlich gemacht.',
    karten: [
      {
        icon: 'cookie_off',
        titel: 'Keine Cookies',
        text: 'Die Website ist ohne Tracking, Werbenetzwerke, externe Schriftanbieter und nicht notwendige Cookies geplant.',
      },
      {
        icon: 'mail_lock',
        titel: 'Eigene Formulare',
        text: 'Kontakt- und Anfrageformulare übermitteln nur die Angaben, die Besucher aktiv absenden.',
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
          'Kleingartenverein am Steinberg e.V. 1925',
          '[Straße und Hausnummer ergänzen]',
          '[PLZ und Ort ergänzen]',
          'E-Mail: [E-Mail-Adresse ergänzen]',
        ],
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
          'Die Website wird voraussichtlich bei Hetzner Online GmbH gehostet. Der endgültige Hostinganbieter wird nach Vertragsabschluss an dieser Stelle aktualisiert.',
        ],
        liste: [
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse an einer sicheren und funktionsfähigen Website.',
          'Speicherdauer: Server-Logfiles werden nur so lange gespeichert, wie es für technische Sicherheit und Fehleranalyse erforderlich ist. Die konkrete Speicherdauer richtet sich nach der finalen Hostingkonfiguration.',
        ],
      },
      {
        titel: 'Kontaktformular und E-Mail-Kommunikation',
        text: [
          'Wenn Besucher das Kontaktformular oder ein Anfrageformular nutzen, verarbeiten wir die dort eingegebenen Angaben. Dazu können Name, E-Mail-Adresse, Telefonnummer, Nachrichtentext und weitere freiwillige Angaben zum Anliegen gehören.',
          'Die Daten werden ausschließlich zur Bearbeitung der Anfrage, zur Rückmeldung und zur vereinsbezogenen Kommunikation verwendet. Die Nachricht kann als E-Mail an die zuständigen Personen des Vereins weitergeleitet werden. Dabei werden die Daten technisch über den E-Mail- beziehungsweise Hostinganbieter verarbeitet.',
          'Nicht abgesendete Formulareingaben werden nicht dauerhaft gespeichert.',
        ],
        liste: [
          'Rechtsgrundlage bei allgemeinen Anfragen: Art. 6 Abs. 1 lit. f DSGVO.',
          'Rechtsgrundlage bei konkreten Anfragen zur Vereinshausvermietung oder vorvertraglichen Anliegen: Art. 6 Abs. 1 lit. b DSGVO.',
          'Speicherdauer: Anfragen werden gelöscht, sobald sie abschließend bearbeitet sind und keine gesetzlichen oder vereinsorganisatorischen Aufbewahrungsgründe entgegenstehen.',
        ],
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
      {
        label: 'Kontakt aufnehmen',
        pfad: '/kontakt',
        text: 'Für Datenschutzfragen oder Auskunftsanfragen an den Verein.',
      },
      {
        label: 'Impressum öffnen',
        pfad: '/impressum',
        text: 'Alle Anbieter- und Kontaktangaben an einer Stelle.',
      },
    ],
  },
  barrierefreiheit: {
    id: 'barrierefreiheit',
    eyebrow: 'Barrierefreiheit',
    titel: 'Erklärung zur Zugänglichkeit',
    subline: 'Gärten, Vereinsleben und digitale Informationen sollen für möglichst viele Menschen verständlich und erreichbar sein.',
    stand: 'Stand: Juli 2026',
    hinweis: 'Diese Seite ist als allgemeines Barrierefreiheitsstatement formuliert. Eine formale Prüfung nach WCAG beziehungsweise BFSG sollte vor dem Livegang zusätzlich dokumentiert werden.',
    karten: [
      {
        icon: 'accessibility_new',
        titel: 'Zugang für alle',
        text: 'Barrierefreiheit bedeutet für uns verständliche Informationen, klare Wege und respektvolle Teilhabe.',
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
          'Über den Accessibility-Button der Website können unterstützende Darstellungen aktiviert werden. Der Modus soll die Nutzung erleichtern, wenn Besucher stärkere Kontraste, reduzierte visuelle Reize oder eine klarere Darstellung bevorzugen.',
          'Der Button ist als zusätzliche Hilfe gedacht und ersetzt keine saubere barrierearme Grundgestaltung. Deshalb werden Kontraste, Fokuszustände, Formularhinweise und mobile Bedienbarkeit direkt im Design berücksichtigt.',
        ],
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
      },
    ],
    kontaktLinks: [
      {
        label: 'Barriere melden',
        pfad: '/kontakt',
        text: 'Hinweise zu Problemen, Formularen oder schwer lesbaren Bereichen senden.',
      },
      {
        label: 'Servicebereich öffnen',
        pfad: '/service',
        text: 'Downloads, Formulare und zentrale Unterlagen des Vereins finden.',
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
