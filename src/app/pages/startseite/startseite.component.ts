/* src/app/pages/startseite/startseite.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_BEITRAEGE } from '../../shared/data/blog-beitraege.data';
import { TERMINE } from '../../shared/data/termine.data';

@Component({
  selector: 'app-startseite',
  imports: [RouterLink],
  templateUrl: './startseite.component.html',
  styleUrl: './startseite.component.scss',
})
export class StartseiteComponent {
  protected readonly aktuelleBeitraege = BLOG_BEITRAEGE.slice(0, 2);
  protected readonly naechsterTermin = TERMINE[0];
  protected readonly heroBild = {
    pfad: 'assets/img/hero-vereinsgarten-mock.webp',
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
}
