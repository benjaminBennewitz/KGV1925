/* src/app/shared/data/feiertage-nrw.data.ts */

export interface FeiertagEintrag {
  datumISO: string;
  name: string;
}

/**
 * Erzeugt die üblichen gesetzlichen Feiertage für Nordrhein-Westfalen lokal.
 */
export function feiertageNrwFuerJahr(jahr: number): FeiertagEintrag[] {
  const ostersonntag = berechneOstersonntag(jahr);

  return [
    { datumISO: baueDatumISO(jahr, 0, 1), name: 'Neujahr' },
    { datumISO: verschiebeDatum(ostersonntag, -2), name: 'Karfreitag' },
    { datumISO: verschiebeDatum(ostersonntag, 1), name: 'Ostermontag' },
    { datumISO: baueDatumISO(jahr, 4, 1), name: 'Tag der Arbeit' },
    { datumISO: verschiebeDatum(ostersonntag, 39), name: 'Christi Himmelfahrt' },
    { datumISO: verschiebeDatum(ostersonntag, 50), name: 'Pfingstmontag' },
    { datumISO: verschiebeDatum(ostersonntag, 60), name: 'Fronleichnam' },
    { datumISO: baueDatumISO(jahr, 9, 3), name: 'Tag der Deutschen Einheit' },
    { datumISO: baueDatumISO(jahr, 10, 1), name: 'Allerheiligen' },
    { datumISO: baueDatumISO(jahr, 11, 25), name: '1. Weihnachtstag' },
    { datumISO: baueDatumISO(jahr, 11, 26), name: '2. Weihnachtstag' },
  ].sort((erster, zweiter) => erster.datumISO.localeCompare(zweiter.datumISO));
}

/**
 * Sucht einen NRW-Feiertag zu einem ISO-Datum.
 */
export function feiertagNrwFuerDatum(datumISO: string): FeiertagEintrag | null {
  const jahr = Number(datumISO.slice(0, 4));

  if (!Number.isInteger(jahr)) {
    return null;
  }

  return feiertageNrwFuerJahr(jahr).find((feiertag) => feiertag.datumISO === datumISO) ?? null;
}

/**
 * Berechnet Ostersonntag nach Gaußscher Osterformel.
 */
function berechneOstersonntag(jahr: number): Date {
  const a = jahr % 19;
  const b = Math.floor(jahr / 100);
  const c = jahr % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monat = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const tag = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(jahr, monat, tag, 12, 0, 0, 0);
}

/**
 * Verschiebt ein Datum um eine Anzahl Tage und gibt ein ISO-Datum zurück.
 */
function verschiebeDatum(datum: Date, tage: number): string {
  const verschoben = new Date(datum);
  verschoben.setDate(verschoben.getDate() + tage);

  return baueDatumISO(verschoben.getFullYear(), verschoben.getMonth(), verschoben.getDate());
}

/**
 * Baut ein lokales ISO-Datum ohne Zeitzonenversatz.
 */
function baueDatumISO(jahr: number, monatIndex: number, tag: number): string {
  const monat = `${monatIndex + 1}`.padStart(2, '0');
  const tagText = `${tag}`.padStart(2, '0');

  return `${jahr}-${monat}-${tagText}`;
}
