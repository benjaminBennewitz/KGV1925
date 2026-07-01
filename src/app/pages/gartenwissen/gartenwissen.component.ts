/* src/app/pages/gartenwissen/gartenwissen.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gartenwissen',
  imports: [RouterLink],
  templateUrl: './gartenwissen.component.html',
  styleUrl: './gartenwissen.component.scss',
})
export class GartenwissenComponent {
  protected readonly icon = 'menu_book';
}
