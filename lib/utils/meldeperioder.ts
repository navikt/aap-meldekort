import { Meldeperiode } from 'lib/types/types';

export function hentEldsteUbesvarteMeldeperiode(meldeperioder: Meldeperiode[]): Meldeperiode | undefined {
  return meldeperioder
    .sort((a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime())
    .find(
      (meldeperiode) =>
        (meldeperiode.type === 'VANLIG' || meldeperiode.type === 'ETTERREGISTRERING') && meldeperiode.klarForInnsending
    );
}

export function hentMeldeperioderSomIkkeErBesvart(meldeperioder: Meldeperiode[]): Meldeperiode[] {
  return meldeperioder.filter(
    (meldeperiode) =>
      (meldeperiode.type === 'VANLIG' || meldeperiode.type === 'ETTERREGISTRERING') && meldeperiode.klarForInnsending
  );
}

export function hentUbesvarteMeldeperioder(meldeperioder: Meldeperiode[]): Meldeperioder | undefined {
  const antallUbesvarteMeldeperioder = hentMeldeperioderSomIkkeErBesvart(meldeperioder).length;
  const eldsteUbesvarteMeldeperiode = hentEldsteUbesvarteMeldeperiode(meldeperioder);

  if (eldsteUbesvarteMeldeperiode) {
    return { antallUbesvarteMeldeperioder, eldsteUbesvarteMeldeperiode };
  } else {
    return undefined;
  }
}

interface Meldeperioder {
  antallUbesvarteMeldeperioder: number;
  eldsteUbesvarteMeldeperiode: Meldeperiode;
}
