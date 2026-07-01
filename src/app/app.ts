/* src/app/app.ts */

import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AccessibilityModeComponent } from './shared/components/accessibility-mode/accessibility-mode.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ScrollToTopComponent } from './shared/components/scroll-to-top/scroll-to-top.component';
import { RevealService } from './shared/services/reveal.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AccessibilityModeComponent, ScrollToTopComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly revealService = inject(RevealService);
  private readonly router = inject(Router);

  /**
   * Initialisiert globale Reveal-Animationen und aktualisiert sie nach Routenwechseln.
   */
  public ngOnInit(): void {
    this.revealService.initialisiere();

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => {
      this.revealService.aktualisiere();
    });
  }
}
