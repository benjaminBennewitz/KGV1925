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
 * Bereinigt Suchwerte auf ungefährliche Zeichen und begrenzt die Länge.
 */
export function bereinigeSuchwert(wert: string, maxLaenge = 80): string {
  return normalisiereEinzeiligenText(wert).replace(SUCH_ERSETZEN, '').slice(0, maxLaenge);
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
  return normalisiereEinzeiligenText(wert).replace(TEXT_ERSETZEN, '').slice(0, maxLaenge);
}

/**
 * Bereinigt ein mehrzeiliges Formular-Textfeld.
 */
export function bereinigeMehrzeiligenFormularText(wert: string, maxLaenge = 800): string {
  return normalisiereMehrzeiligenText(wert).replace(MEHRZEILIGER_TEXT_ERSETZEN, '').slice(0, maxLaenge);
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
  return normalisiereEinzeiligenText(wert).replace(EMAIL_ERSETZEN, '').slice(0, maxLaenge);
}

/**
 * Bereinigt eine Telefonnummer vor der Formularvalidierung.
 */
export function bereinigeTelefon(wert: string, maxLaenge = 30): string {
  return normalisiereEinzeiligenText(wert).replace(TELEFON_ERSETZEN, '').slice(0, maxLaenge);
}

/**
 * Bereinigt eine reine Zifferneingabe mit fester Maximallänge.
 */
export function bereinigeZiffern(wert: string, maxLaenge: number): string {
  return `${wert ?? ''}`.replace(/\D/g, '').slice(0, maxLaenge);
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
