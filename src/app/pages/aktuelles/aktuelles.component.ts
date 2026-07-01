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
}
