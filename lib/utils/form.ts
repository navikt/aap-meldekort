export enum JaEllerNei {
  Ja = 'ja',
  Nei = 'nei',
}

export const getJaNeiEllerUndefined = (value?: boolean | null) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value ? JaEllerNei.Ja : JaEllerNei.Nei;
};

/**
 * Et ubesvart radiofelt har verdien `undefined` – ikke `null`. Sjekker man kun mot
 * `null` slipper ubesvarte felter gjennom, og `verdi === JaEllerNei.Ja` gir da `false`,
 * slik at «ikke svart» blir mellomlagret som «Nei». Bruk denne i stedet for egne
 * null-sjekker før du persisterer et ja/nei-svar.
 */
export const erJaNeiSpørsmålBesvart = (value?: JaEllerNei | null): value is JaEllerNei =>
  value === JaEllerNei.Ja || value === JaEllerNei.Nei;
