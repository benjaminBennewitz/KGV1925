/* src/app/app.ts */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccessibilityModeComponent } from './shared/components/accessibility-mode/accessibility-mode.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ScrollToTopComponent } from './shared/components/scroll-to-top/scroll-to-top.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AccessibilityModeComponent, ScrollToTopComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
