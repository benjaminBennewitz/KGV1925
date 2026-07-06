/* src/app/pages/termine/termine.component.ts */

import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FeiertagEintrag, feiertagNrwFuerDatum } from '../../shared/data/feiertage-nrw.data';
import { TERMIN_KATEGORIEN, TERMIN_KATEGORIE_AKZENTE, TerminEintrag, TerminKategorie } from '../../shared/data/termine.data';
import { AdminContentService } from '../../shared/services/admin-content.service';
import { bereinigeSuchwert, normalisiereSuchwert } from '../../shared/utils/eingabe-sicherheit.util';

interface KalenderTag {
  datumISO: string;
  tagZahl: number;
  istAktuellerMonat: boolean;
  istHeute: boolean;
  istWochenende: boolean;
  feiertag: FeiertagEintrag | null;
  termine: TerminEintrag[];
}

interface KalenderKurzinfo {
  label: string;
  wert: string;
}

@Component({
  selector: 'app-termine',
  imports: [FormsModule, RouterLink],
  templateUrl: './termine.component.html',
  styleUrl: './termine.component.scss',
})
export class TermineComponent {
  private readonly dokument = inject(DOCUMENT);
  private readonly adminContent = inject(AdminContentService);

  protected readonly jahr = 2026;
  protected readonly terminKategorien = TERMIN_KATEGORIEN;
  protected aktiverMonatIndex = 6;
  protected terminSuche = '';

  protected readonly wochentage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  protected readonly monate = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];
  protected fokussierterTerminSlug: string | null = null;

  protected get alleTermine(): TerminEintrag[] {
    return this.adminContent.termine();
  }

  protected get gefilterteTermine(): TerminEintrag[] {
    const suche = this.normalisiereSuche(this.terminSuche);

    if (!suche) {
      return this.alleTermine;
    }

    return this.alleTermine.filter((termin) => this.passtTerminZurSuche(termin, suche));
  }

  protected get heroKurzinfos(): KalenderKurzinfo[] {
    return [
      {
        label: 'Kalenderjahr',
        wert: '2026',
      },
      {
        label: 'Termine',
        wert: String(this.alleTermine.length),
      },
      {
        label: 'Monatsansicht',
        wert: '12',
      },
    ];
  }

  protected get aktiverMonatName(): string {
    return `${this.monate[this.aktiverMonatIndex]} ${this.jahr}`;
  }

  protected get kalenderTage(): KalenderTag[] {
    return this.baueKalenderTage(this.aktiverMonatIndex);
  }

  protected get termineImAktivenMonat(): TerminEintrag[] {
    const monatsStart = this.erzeugeDatumString(this.jahr, this.aktiverMonatIndex, 1);
    const monatsEnde = this.erzeugeDatumString(this.jahr, this.aktiverMonatIndex, new Date(this.jahr, this.aktiverMonatIndex + 1, 0).getDate());

    return this.gefilterteTermine
      .filter((termin) => this.terminUeberschneidetZeitraum(termin, monatsStart, monatsEnde))
      .sort((erstes, zweites) => erstes.datumISO.localeCompare(zweites.datumISO));
  }

  protected get naechsteTermine(): TerminEintrag[] {
    return this.gefilterteTermine.slice(0, 4);
  }

  protected get kannVorherigerMonat(): boolean {
    return this.aktiverMonatIndex > 0;
  }

  protected get kannNaechsterMonat(): boolean {
    return this.aktiverMonatIndex < 11;
  }

  /**
   * Aktualisiert die Suche für Titel und Datum.
   */
  protected terminSucheAktualisieren(wert: string): void {
    this.terminSuche = bereinigeSuchwert(wert, 80);
    this.fokussierterTerminSlug = null;
  }

  /**
   * Gibt die automatische Farbstufe einer Terminkategorie zurück.
   */
  protected farbeFuerKategorie(kategorie: TerminKategorie): string {
    return TERMIN_KATEGORIE_AKZENTE[kategorie];
  }

  protected waehleMonat(monatIndex: number): void {
    this.aktiverMonatIndex = monatIndex;
    this.fokussierterTerminSlug = null;
  }

  protected vorherigerMonat(): void {
    if (!this.kannVorherigerMonat) {
      return;
    }

    this.aktiverMonatIndex -= 1;
    this.fokussierterTerminSlug = null;
  }

  protected naechsterMonat(): void {
    if (!this.kannNaechsterMonat) {
      return;
    }

    this.aktiverMonatIndex += 1;
    this.fokussierterTerminSlug = null;
  }

  protected fokussiereTermin(slug: string): void {
    this.fokussierterTerminSlug = slug;

    window.setTimeout(() => {
      const element = this.dokument.getElementById(`termin-${slug}`);

      if (!element) {
        return;
      }

      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      element.focus({ preventScroll: true });
    });
  }

  protected terminDauer(termin: TerminEintrag): string {
    if (!termin.datumEndeISO || termin.datumEndeISO === termin.datumISO) {
      return termin.datum;
    }

    return termin.datum;
  }

  private baueKalenderTage(monatIndex: number): KalenderTag[] {
    const tage: KalenderTag[] = [];
    const ersterTag = new Date(this.jahr, monatIndex, 1);
    const tageImMonat = new Date(this.jahr, monatIndex + 1, 0).getDate();
    const tageImVormonat = new Date(this.jahr, monatIndex, 0).getDate();
    const startOffset = (ersterTag.getDay() + 6) % 7;
    const heutigesDatum = this.erzeugeHeutigesDatum();

    for (let index = startOffset - 1; index >= 0; index -= 1) {
      const tagZahl = tageImVormonat - index;
      const datumISO = this.erzeugeDatumString(this.jahr, monatIndex - 1, tagZahl);

      tage.push(this.baueKalenderTag(datumISO, tagZahl, false, heutigesDatum));
    }

    for (let tagZahl = 1; tagZahl <= tageImMonat; tagZahl += 1) {
      const datumISO = this.erzeugeDatumString(this.jahr, monatIndex, tagZahl);

      tage.push(this.baueKalenderTag(datumISO, tagZahl, true, heutigesDatum));
    }

    let naechsterMonatTag = 1;

    while (tage.length % 7 !== 0 || tage.length < 35) {
      const datumISO = this.erzeugeDatumString(this.jahr, monatIndex + 1, naechsterMonatTag);

      tage.push(this.baueKalenderTag(datumISO, naechsterMonatTag, false, heutigesDatum));
      naechsterMonatTag += 1;
    }

    return tage;
  }

  private baueKalenderTag(datumISO: string, tagZahl: number, istAktuellerMonat: boolean, heutigesDatum: string): KalenderTag {
    const wochentag = new Date(`${datumISO}T12:00:00`).getDay();

    return {
      datumISO,
      tagZahl,
      istAktuellerMonat,
      istHeute: datumISO === heutigesDatum,
      istWochenende: wochentag === 0 || wochentag === 6,
      feiertag: istAktuellerMonat ? feiertagNrwFuerDatum(datumISO) : null,
      termine: istAktuellerMonat ? this.termineFuerTag(datumISO) : [],
    };
  }

  private termineFuerTag(datumISO: string): TerminEintrag[] {
    return this.gefilterteTermine.filter((termin) => this.terminLiegtAnDatum(termin, datumISO));
  }

  private terminLiegtAnDatum(termin: TerminEintrag, datumISO: string): boolean {
    const start = termin.datumISO;
    const ende = termin.datumEndeISO || termin.datumISO;

    return start <= datumISO && ende >= datumISO;
  }

  private terminUeberschneidetZeitraum(termin: TerminEintrag, start: string, ende: string): boolean {
    const terminStart = termin.datumISO;
    const terminEnde = termin.datumEndeISO || termin.datumISO;

    return terminStart <= ende && terminEnde >= start;
  }

  private passtTerminZurSuche(termin: TerminEintrag, suche: string): boolean {
    return [termin.titel, termin.datum, termin.datumISO, termin.datumEndeISO ?? ''].some((wert) => this.normalisiereSuche(wert).includes(suche));
  }

  private normalisiereSuche(wert: string): string {
    return normalisiereSuchwert(wert);
  }

  private erzeugeDatumString(jahr: number, monatIndex: number, tagZahl: number): string {
    const datum = new Date(jahr, monatIndex, tagZahl);
    const monat = `${datum.getMonth() + 1}`.padStart(2, '0');
    const tag = `${datum.getDate()}`.padStart(2, '0');

    return `${datum.getFullYear()}-${monat}-${tag}`;
  }

  private erzeugeHeutigesDatum(): string {
    const heute = new Date();
    const monat = `${heute.getMonth() + 1}`.padStart(2, '0');
    const tag = `${heute.getDate()}`.padStart(2, '0');

    return `${heute.getFullYear()}-${monat}-${tag}`;
  }
}
