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

export const erJaNeiSpørsmålBesvart = (value?: JaEllerNei | null): value is JaEllerNei =>
  value === JaEllerNei.Ja || value === JaEllerNei.Nei;
