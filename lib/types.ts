export interface Meldeperiode {
  referanse: string;
  periode: { fom: string; tom: string };
}

export interface InnsendingMeldeperiode {
  referanse: string;
  dager: Dag[];
}

export interface Dag {
  dato: string;
  timer: number;
}
/**
 * API
 *
 * GET
 * meldekort/meldeperioder - returnerer et array med perioder som ikke er besvart
 *
 *  POST
 *  meldekort/innsending - Innsending for å sende inn en gitt periode
 */

/**
 *
 * Pages
 *
 * baseUrl = localhost:3000
 * aktivtSteg - dynamisk
 *
 * Forside - baseUrl
 * Periodeside - baseUrl/referanse/${aktivtSteg}
 * Utfylling - baseUrl/referanse/${aktivtSteg}
 * Oppsummering - baseUrl/referanse/oppsummering
 */
