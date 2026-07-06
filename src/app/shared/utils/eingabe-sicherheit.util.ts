/* src/app/shared/utils/eingabe-sicherheit.util.ts */

const SUCH_ERSETZEN = /[^A-Za-zÄÖÜäöüß0-9 .,\-:\/]/g;
const TEXT_ERSETZEN = /[^A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:]/g;
const MEHRZEILIGER_TEXT_ERSETZEN = /[^A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:\n\r]/g;
const ADMIN_TEXT_ERSETZEN = /[^A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:€&\n\r]/g;
const EMAIL_ERSETZEN = /[^A-Za-z0-9._+\-@]/g;
const TELEFON_ERSETZEN = /[^0-9 +()\/-]/g;
const INTERNE_ROUTE_ERSETZEN = /[^a-z0-9\/-]/g;
const MEHRFACHE_LEERZEICHEN = /[ \t]+/g;
const MEHRFACHE_ZEILEN = /\n{3,}/g;

export const ADMIN_TEXT_MUSTER = /^[A-Za-zÄÖÜäöüß0-9 .,!?#*()\/\-:€&\n\r]{2,900}$/;

export interface BereinigteEingabe {
  wert: string;
  hatteUnerlaubteZeichen: boolean;
}

/**
 * Normalisiert einzeilige Texte ohne Zeilenumbrüche.
 */
export function normalisiereEinzeiligenText(wert: string): string {
  return `${wert ?? ''}`.replace(/[\r\n]+/g, ' ').replace(MEHRFACHE_LEERZEICHEN, ' ');
}

/**
 * Normalisiert mehrzeilige Texte und reduziert auffällige Leerbereiche.
 */
export function normalisiereMehrzeiligenText(wert: string): string {
  return `${wert ?? ''}`.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[ \t]+/g, ' ').replace(MEHRFACHE_ZEILEN, '\n\n');
}

/**
 * Liefert neben dem bereinigten Wert auch, ob Zeichen entfernt wurden.
 */
export function erstelleBereinigteEingabe(originalWert: string, bereinigterWert: string): BereinigteEingabe {
  return {
    wert: bereinigterWert,
    hatteUnerlaubteZeichen: `${originalWert ?? ''}` !== bereinigterWert,
  };
}

/**
 * Bereinigt Suchwerte auf ungefährliche Zeichen und begrenzt die Länge.
 */
export function bereinigeSuchwert(wert: string, maxLaenge = 80): string {
  return bereinigeSuchwertMitStatus(wert, maxLaenge).wert;
}

/**
 * Bereinigt Suchwerte und meldet entfernte Zeichen zurück.
 */
export function bereinigeSuchwertMitStatus(wert: string, maxLaenge = 80): BereinigteEingabe {
  const originalWert = `${wert ?? ''}`;
  const bereinigterWert = normalisiereEinzeiligenText(originalWert).replace(SUCH_ERSETZEN, '').slice(0, maxLaenge);

  return erstelleBereinigteEingabe(originalWert, bereinigterWert);
}

/**
 * Normalisiert Suchwerte für robuste Vergleiche.
 */
export function normalisiereSuchwert(wert: string): string {
  return bereinigeSuchwert(wert, 160).toLocaleLowerCase('de-DE').trim();
}

/**
 * Bereinigt ein allgemeines Formular-Textfeld.
 */
export function bereinigeFormularText(wert: string, maxLaenge = 80): string {
  return bereinigeFormularTextMitStatus(wert, maxLaenge).wert;
}

/**
 * Bereinigt ein allgemeines Formular-Textfeld und meldet entfernte Zeichen zurück.
 */
export function bereinigeFormularTextMitStatus(wert: string, maxLaenge = 80): BereinigteEingabe {
  const originalWert = `${wert ?? ''}`;
  const bereinigterWert = normalisiereEinzeiligenText(originalWert).replace(TEXT_ERSETZEN, '').slice(0, maxLaenge);

  return erstelleBereinigteEingabe(originalWert, bereinigterWert);
}

/**
 * Bereinigt ein mehrzeiliges Formular-Textfeld.
 */
export function bereinigeMehrzeiligenFormularText(wert: string, maxLaenge = 800): string {
  return bereinigeMehrzeiligenFormularTextMitStatus(wert, maxLaenge).wert;
}

/**
 * Bereinigt ein mehrzeiliges Formular-Textfeld und meldet entfernte Zeichen zurück.
 */
export function bereinigeMehrzeiligenFormularTextMitStatus(wert: string, maxLaenge = 800): BereinigteEingabe {
  const originalWert = `${wert ?? ''}`;
  const bereinigterWert = normalisiereMehrzeiligenText(originalWert).replace(MEHRZEILIGER_TEXT_ERSETZEN, '').slice(0, maxLaenge);

  return erstelleBereinigteEingabe(originalWert, bereinigterWert);
}

/**
 * Bereinigt ein Admin-Textfeld mit zusätzlich erlaubten Verwaltungszeichen.
 */
export function bereinigeAdminText(wert: string, maxLaenge: number): string {
  return normalisiereMehrzeiligenText(wert).replace(ADMIN_TEXT_ERSETZEN, '').slice(0, maxLaenge);
}

/**
 * Bereinigt eine E-Mail-Adresse vor der Formularvalidierung.
 */
export function bereinigeEmail(wert: string, maxLaenge = 120): string {
  return bereinigeEmailMitStatus(wert, maxLaenge).wert;
}

/**
 * Bereinigt eine E-Mail-Adresse und meldet entfernte Zeichen zurück.
 */
export function bereinigeEmailMitStatus(wert: string, maxLaenge = 120): BereinigteEingabe {
  const originalWert = `${wert ?? ''}`;
  const bereinigterWert = normalisiereEinzeiligenText(originalWert).replace(EMAIL_ERSETZEN, '').slice(0, maxLaenge);

  return erstelleBereinigteEingabe(originalWert, bereinigterWert);
}

/**
 * Bereinigt eine Telefonnummer vor der Formularvalidierung.
 */
export function bereinigeTelefon(wert: string, maxLaenge = 30): string {
  return bereinigeTelefonMitStatus(wert, maxLaenge).wert;
}

/**
 * Bereinigt eine Telefonnummer und meldet entfernte Zeichen zurück.
 */
export function bereinigeTelefonMitStatus(wert: string, maxLaenge = 30): BereinigteEingabe {
  const originalWert = `${wert ?? ''}`;
  const bereinigterWert = normalisiereEinzeiligenText(originalWert).replace(TELEFON_ERSETZEN, '').slice(0, maxLaenge);

  return erstelleBereinigteEingabe(originalWert, bereinigterWert);
}

/**
 * Bereinigt eine reine Zifferneingabe mit fester Maximallänge.
 */
export function bereinigeZiffern(wert: string, maxLaenge: number): string {
  return bereinigeZiffernMitStatus(wert, maxLaenge).wert;
}

/**
 * Bereinigt eine reine Zifferneingabe und meldet entfernte Zeichen zurück.
 */
export function bereinigeZiffernMitStatus(wert: string, maxLaenge: number): BereinigteEingabe {
  const originalWert = `${wert ?? ''}`;
  const bereinigterWert = originalWert.replace(/\D/g, '').slice(0, maxLaenge);

  return erstelleBereinigteEingabe(originalWert, bereinigterWert);
}

/**
 * Bereinigt eine interne Route und erzwingt einen relativen Pfad.
 */
export function bereinigeInterneRoute(wert: string, maxLaenge = 120): string {
  const bereinigterWert = normalisiereEinzeiligenText(wert).toLowerCase().replace(INTERNE_ROUTE_ERSETZEN, '').replace(/\/{2,}/g, '/').slice(0, maxLaenge);

  if (!bereinigterWert) {
    return '/';
  }

  return bereinigterWert.startsWith('/') ? bereinigterWert : `/${bereinigterWert}`;
}

/**
 * Prüft einfache Bot-Signale aus Honeypot und Formularzeit.
 */
export function enthaeltBotSignal(honeypot: string, formularGestartetAm: number, mindestDauerMs = 1800): boolean {
  const honeypotGefuellt = `${honeypot ?? ''}`.trim().length > 0;
  const zuSchnellGesendet = formularGestartetAm > 0 && Date.now() - formularGestartetAm < mindestDauerMs;

  return honeypotGefuellt || zuSchnellGesendet;
}
