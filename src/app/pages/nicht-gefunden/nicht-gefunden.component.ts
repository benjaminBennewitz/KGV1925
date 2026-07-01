/* src/app/pages/nicht-gefunden/nicht-gefunden.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nicht-gefunden',
  imports: [RouterLink],
  templateUrl: './nicht-gefunden.component.html',
  styleUrl: './nicht-gefunden.component.scss',
})
export class NichtGefundenComponent {
  protected readonly icon = 'search_off';
}
