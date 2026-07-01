/* src/app/shared/components/footer/footer.component.ts */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HAUPTNAVIGATION } from '../../data/navigation.data';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly navigation = HAUPTNAVIGATION;
  protected readonly jahr = new Date().getFullYear();
}
