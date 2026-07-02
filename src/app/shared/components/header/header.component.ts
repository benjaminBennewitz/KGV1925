/* src/app/shared/components/header/header.component.ts */

import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HAUPTNAVIGATION } from '../../data/navigation.data';
import { MitgliederSessionService } from '../../services/mitglieder-session.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly navigation = HAUPTNAVIGATION;
  protected readonly istMenueOffen = signal(false);
  protected readonly mitgliederSession = inject(MitgliederSessionService);

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

  /**
   * Meldet die aktive Sitzung direkt über den Header ab.
   */
  protected abmelden(): void {
    this.mitgliederSession.abmelden();
    this.schliesseMenue();
  }
}
