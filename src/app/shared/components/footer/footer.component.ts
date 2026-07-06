/* src/app/shared/components/footer/footer.component.ts */

import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HAUPTNAVIGATION } from '../../data/navigation.data';
import { BereinigteEingabe, bereinigeEmailMitStatus } from '../../utils/eingabe-sicherheit.util';

interface FooterLink {
  label: string;
  pfad: string;
}

interface SocialHinweis {
  label: string;
  kurzform: string;
  hinweis: string;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly router = inject(Router);
  private readonly emailMuster = /^[A-Za-z0-9._+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;

  protected readonly navigation = HAUPTNAVIGATION;
  protected readonly jahr = new Date().getFullYear();
  protected footerEmail = '';
  protected footerEmailHinweis = '';

  protected readonly rechtlicheLinks: FooterLink[] = [
    {
      label: 'Impressum',
      pfad: '/impressum',
    },
    {
      label: 'Datenschutz',
      pfad: '/datenschutz',
    },
    {
      label: 'Barrierefreiheit',
      pfad: '/barrierefreiheit',
    },
  ];

  protected readonly socialHinweise: SocialHinweis[] = [
    {
      label: 'Instagram',
      kurzform: 'IG',
      hinweis: 'Instagram-Profil folgt',
    },
    {
      label: 'Facebook',
      kurzform: 'FB',
      hinweis: 'Facebook-Seite folgt',
    },
    {
      label: 'YouTube',
      kurzform: 'YT',
      hinweis: 'YouTube-Kanal folgt',
    },
  ];

  /**
   * Bereinigt die Footer-E-Mail sofort während der Eingabe.
   */
  protected footerEmailAktualisieren(ereignis: Event): void {
    const ziel = ereignis.target as HTMLInputElement;
    const ergebnis = bereinigeEmailMitStatus(ziel.value, 120);

    ziel.value = ergebnis.wert;
    this.footerEmail = ergebnis.wert;
    this.footerEmailHinweis = this.validiereFooterEmail(ergebnis);
  }

  /**
   * Öffnet das Kontaktformular und übernimmt eine valide Footer-E-Mail-Adresse.
   */
  protected kontaktOeffnen(ereignis: Event): void {
    ereignis.preventDefault();

    if (!this.footerEmail.trim()) {
      void this.router.navigate(['/kontakt'], { fragment: 'kontaktformular' });
      return;
    }

    const ergebnis = bereinigeEmailMitStatus(this.footerEmail, 120);
    this.footerEmail = ergebnis.wert;
    this.footerEmailHinweis = this.validiereFooterEmail(ergebnis);

    if (this.footerEmailHinweis) {
      return;
    }

    void this.router.navigate(['/kontakt'], { queryParams: { email: this.footerEmail }, fragment: 'kontaktformular' });
  }

  /**
   * Prüft, ob die Footer-E-Mail sichtbar als valide markiert werden kann.
   */
  protected istFooterEmailValide(): boolean {
    return this.footerEmail.trim().length > 0 && !this.footerEmailHinweis && this.emailMuster.test(this.footerEmail.trim());
  }

  /**
   * Erzeugt einen kompakten Hinweis für die Footer-E-Mail.
   */
  private validiereFooterEmail(ergebnis: BereinigteEingabe): string {
    const wert = ergebnis.wert.trim();

    if (ergebnis.hatteUnerlaubteZeichen) {
      return 'Entfernt: Bitte nur Buchstaben, Zahlen und . _ + - @ verwenden.';
    }

    if (wert && !this.emailMuster.test(wert)) {
      return 'Bitte eine vollständige E-Mail-Adresse eintragen.';
    }

    return '';
  }
}
