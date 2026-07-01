/* src/app/shared/components/header/header.component.ts */

import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HAUPTNAVIGATION } from '../../data/navigation.data';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly navigation = HAUPTNAVIGATION;
  protected readonly istMenueOffen = signal(false);

  /**
   * Öffnet oder schließt die mobile Navigation.
   */
  protected schalteMenue(): void {
    this.istMenueOffen.update((istOffen) => !istOffen);
  }

  /**
   * Schließt die mobile Navigation nach einer Auswahl.
   */
  protected schliesseMenue(): void {
    this.istMenueOffen.set(false);
  }
}
