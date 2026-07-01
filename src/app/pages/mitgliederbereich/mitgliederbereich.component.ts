/* src/app/pages/mitgliederbereich/mitgliederbereich.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mitgliederbereich',
  imports: [RouterLink],
  templateUrl: './mitgliederbereich.component.html',
  styleUrl: './mitgliederbereich.component.scss',
})
export class MitgliederbereichComponent {
  protected readonly icon = 'lock';
}
