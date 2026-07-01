/* src/app/shared/components/footer/footer.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HAUPTNAVIGATION } from '../../data/navigation.data';

interface FooterLink {
  label: string;
  pfad: string;
}

interface SocialHinweis {
  label: string;
  kurzform: string;
  hinweis: string;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly navigation = HAUPTNAVIGATION;
  protected readonly jahr = new Date().getFullYear();

  protected readonly rechtlicheLinks: FooterLink[] = [
    {
      label: 'Impressum',
      pfad: '/impressum',
    },
    {
      label: 'Datenschutz',
      pfad: '/datenschutz',
    },
    {
      label: 'Barrierefreiheit',
      pfad: '/barrierefreiheit',
    },
  ];

  protected readonly socialHinweise: SocialHinweis[] = [
    {
      label: 'Instagram',
      kurzform: 'IG',
      hinweis: 'Instagram-Profil folgt',
    },
    {
      label: 'Facebook',
      kurzform: 'FB',
      hinweis: 'Facebook-Seite folgt',
    },
    {
      label: 'YouTube',
      kurzform: 'YT',
      hinweis: 'YouTube-Kanal folgt',
    },
  ];
}
