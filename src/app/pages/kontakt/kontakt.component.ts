/* src/app/pages/kontakt/kontakt.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-kontakt',
  imports: [RouterLink],
  templateUrl: './kontakt.component.html',
  styleUrl: './kontakt.component.scss',
})
export class KontaktComponent {
  protected readonly icon = 'mail';
}
