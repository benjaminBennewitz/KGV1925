/* src/app/pages/vereinshausvermietung/vereinshausvermietung.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface MietInfo {
  icon: string;
  titel: string;
  text: string;
}

@Component({
  selector: 'app-vereinshausvermietung',
  imports: [RouterLink],
  templateUrl: './vereinshausvermietung.component.html',
  styleUrl: './vereinshausvermietung.component.scss',
})
export class VereinshausvermietungComponent {
  protected readonly infos: MietInfo[] = [
    {
      icon: 'event_available',
      titel: 'Termin anfragen',
      text: 'Interessierte können später direkt online einen Wunschtermin für das Vereinshaus anfragen.',
    },
    {
      icon: 'groups',
      titel: 'Anlass beschreiben',
      text: 'Die Anfrage soll Anlass, Gästezahl und gewünschte Nutzungszeit verständlich erfassen.',
    },
    {
      icon: 'assignment',
      titel: 'Prüfung durch Verein',
      text: 'Der Vorstand kann die Anfrage anschließend prüfen und per E-Mail beantworten.',
    },
  ];

  protected readonly vorbereitungsListe = ['Wunschtermin und Ausweichtermin', 'ungefähre Gästezahl', 'Anlass der Veranstaltung', 'gewünschter Zeitraum', 'Kontaktdaten für Rückfragen'];
}
