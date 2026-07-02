/* src/app/pages/aktuelles/aktuelles.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_BEITRAEGE } from '../../shared/data/blog-beitraege.data';

@Component({
  selector: 'app-aktuelles',
  imports: [RouterLink],
  templateUrl: './aktuelles.component.html',
  styleUrl: './aktuelles.component.scss',
})
export class AktuellesComponent {
  protected readonly beitraege = BLOG_BEITRAEGE;
  protected readonly hauptbeitrag = BLOG_BEITRAEGE[0];
  protected readonly weitereBeitraege = BLOG_BEITRAEGE.slice(1);
  protected readonly heroKurzinfos = [
    {
      wert: '03.07.',
      label: 'Laubenabend',
    },
    {
      wert: '07.07.',
      label: 'Vorstandssitzung',
    },
    {
      wert: '09.–12.07.',
      label: 'Wettbewerb',
    },
  ];
}
