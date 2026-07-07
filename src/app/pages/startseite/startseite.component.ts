/* src/app/pages/startseite/startseite.component.ts */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_BEITRAEGE } from '../../shared/data/blog-beitraege.data';
import { AdminContentService, StartseitenPopup } from '../../shared/services/admin-content.service';
import { DialogA11yDirective } from '../../shared/directives/dialog-a11y.directive';

interface StartseitenAnlagenHinweis {
  icon: string;
  titel: string;
  text: string;
  punkte: string[];
  linkText?: string;
  pfad?: string;
}

@Component({
  selector: 'app-startseite',
  imports: [RouterLink, DialogA11yDirective],
  templateUrl: './startseite.component.html',
  styleUrl: './startseite.component.scss',
})
export class StartseiteComponent implements OnInit, OnDestroy {
  private readonly adminContent = inject(AdminContentService);

  protected readonly aktuelleBeitraege = BLOG_BEITRAEGE.slice(0, 2);
  protected istStartseitenPopupSichtbar = true;
  protected istStartseitenPopupBereit = false;
  private popupTimerId: ReturnType<typeof setTimeout> | null = null;

  protected get naechsterTermin() {
    return [...this.adminContent.termine()].sort((erster, zweiter) => erster.datumISO.localeCompare(zweiter.datumISO))[0];
  }

  protected get startseitenPopup(): StartseitenPopup | null {
    if (!this.istStartseitenPopupSichtbar || !this.istStartseitenPopupBereit) {
      return null;
    }

    return this.adminContent.aktivesStartseitenPopup(this.heutigesDatumISO());
  }
  protected readonly heroBild = {
    pfad: '/angular-projects/1925/assets/img/hero-vereinsgarten-mock.webp',
    alt: 'Blick in eine grüne Kleingartenanlage mit Vereinshaus und bepflanztem Weg',
  };
  protected readonly heroKurzinfos = [
    {
      icon: 'groups',
      titel: 'Gemeinschaft',
      text: 'Miteinander erleben',
    },
    {
      icon: 'eco',
      titel: 'Naturverbunden',
      text: 'Nachhaltig gärtnern',
    },
    {
      icon: 'favorite',
      titel: 'Tradition',
      text: 'Seit 1925',
    },
  ];
  protected readonly funktionskarten = [
    {
      icon: 'campaign',
      titel: 'Aktuelles',
      text: 'Neuigkeiten, Hinweise und Wissenswertes aus unserem Verein.',
      linkText: 'Zu den Nachrichten',
      pfad: '/aktuelles',
    },
    {
      icon: 'calendar_month',
      titel: 'Termine',
      text: 'Alle anstehenden Veranstaltungen und wichtige Daten im Überblick.',
      linkText: 'Kalender öffnen',
      pfad: '/termine',
    },
    {
      icon: 'menu_book',
      titel: 'Gartenwissen',
      text: 'Tipps, Anleitungen und Inspiration für deinen Garten.',
      linkText: 'Wissensbereich entdecken',
      pfad: '/gartenwissen',
    },
    {
      icon: 'inventory_2',
      titel: 'Service',
      text: 'Formulare, Downloads und Infos für unsere Mitglieder.',
      linkText: 'Zum Servicebereich',
      pfad: '/service',
    },
  ];

  protected readonly anlagenHinweise: StartseitenAnlagenHinweis[] = [
    {
      icon: 'schedule',
      titel: 'Öffnungszeiten beachten',
      text: 'Die Anlage ist für Mitglieder jederzeit rund um die Uhr nutzbar. Für Gäste und Besucher gelten die ausgewiesenen Zeiten.',
      punkte: ['Gartensaison: 9 Uhr bis Sonnenuntergang, spätestens 22 Uhr', 'Herbst, Winter und Frühjahr: 9 bis 19 Uhr'],
      linkText: 'Infos zur Anlage',
      pfad: '/verein',
    },
    {
      icon: 'pets',
      titel: 'Hunde an die Leine',
      text: 'Hunde sind auf der gesamten Anlage an der Leine zu führen. So bleiben Wege, Gärten und Begegnungen für alle entspannt.',
      punkte: ['Rücksicht auf Mitglieder und Gäste', 'Wege und Gemeinschaftsflächen freihalten'],
    },
    {
      icon: 'do_not_step',
      titel: 'Ruhe und Wege respektieren',
      text: 'Fahrrad- und Rollerfahren ist auf den Wegen nicht erlaubt. Die Mittagsruhe gilt nach städtischer Regelung von 13 bis 15 Uhr.',
      punkte: ['Mittagsruhe: 13 bis 15 Uhr', 'Kein Fahrrad- oder Rollerfahren auf den Wegen'],
    },
  ];

  protected readonly kennzahlen = [
    {
      icon: 'campaign',
      wert: '1925',
      label: 'Gegründet',
    },
    {
      icon: 'groups',
      wert: '65',
      label: 'Mitglieder',
    },
    {
      icon: 'park',
      wert: '48',
      label: 'Parzellen',
    },
    {
      icon: 'favorite',
      wert: '1',
      label: 'Gemeinschaft',
    },
  ];


  /**
   * Startet das verzögerte Einblenden des Startseiten-Pop-ups.
   */
  ngOnInit(): void {
    this.popupTimerId = setTimeout(() => {
      this.istStartseitenPopupBereit = true;
      this.popupTimerId = null;
    }, 2000);
  }

  /**
   * Räumt den offenen Timer beim Verlassen der Startseite auf.
   */
  ngOnDestroy(): void {
    if (this.popupTimerId !== null) {
      clearTimeout(this.popupTimerId);
    }
  }

  /**
   * Schließt das aktuelle Startseiten-Pop-up lokal für die laufende Ansicht.
   */
  protected startseitenPopupSchliessen(): void {
    this.istStartseitenPopupSichtbar = false;
  }

  /**
   * Formatiert ein ISO-Datum für das Pop-up.
   */
  protected formatierePopupDatum(datumISO: string): string {
    return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${datumISO}T12:00:00`));
  }

  private heutigesDatumISO(): string {
    const heute = new Date();
    const monat = `${heute.getMonth() + 1}`.padStart(2, '0');
    const tag = `${heute.getDate()}`.padStart(2, '0');

    return `${heute.getFullYear()}-${monat}-${tag}`;
  }

}
