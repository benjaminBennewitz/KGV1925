/* src/app/pages/service/service.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ServiceKarte {
  icon: string;
  titel: string;
  text: string;
  pfad: string;
  linkText: string;
}

@Component({
  selector: 'app-service',
  imports: [RouterLink],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
})
export class ServiceComponent {
  protected readonly icon = 'inventory_2';
  protected readonly serviceKarten: ServiceKarte[] = [
    {
      icon: 'cottage',
      titel: 'Vereinshausvermietung',
      text: 'Informationen und spätere Online-Anfrage für die Vermietung des Vereinshauses.',
      pfad: '/vereinshausvermietung',
      linkText: 'Vermietung öffnen',
    },
    {
      icon: 'description',
      titel: 'Formulare und Downloads',
      text: 'Zentraler Bereich für wichtige Unterlagen, Hinweise und spätere Downloads.',
      pfad: '/service',
      linkText: 'Bereich ansehen',
    },
    {
      icon: 'contact_support',
      titel: 'Ansprechpartner',
      text: 'Schneller Weg zu Kontakt, Vorstand und passenden Zuständigkeiten.',
      pfad: '/kontakt',
      linkText: 'Kontakt öffnen',
    },
  ];
}
