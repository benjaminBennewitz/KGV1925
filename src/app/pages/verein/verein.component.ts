/* src/app/pages/verein/verein.component.ts */

import { Component } from '@angular/core';

@Component({
  selector: 'app-verein',
  templateUrl: './verein.component.html',
  styleUrl: './verein.component.scss',
})
export class VereinComponent {
  protected readonly themen = ['Geschichte seit 1925', 'Gemeinschaft und Nachbarschaft', 'Anlage und Parzellen', 'Vorstand und Organisation'];
}
