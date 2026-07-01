/* src/app/pages/termine/termine.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-termine',
  imports: [RouterLink],
  templateUrl: './termine.component.html',
  styleUrl: './termine.component.scss',
})
export class TermineComponent {
  protected readonly icon = 'calendar_month';
}
