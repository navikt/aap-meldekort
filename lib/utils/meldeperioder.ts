import { Meldeperiode } from 'lib/types/types';

export function hentEldsteUbesvarteMeldeperiode(meldeperioder: Meldeperiode[]): Meldeperiode | undefined {
  return meldeperioder
    ?.sort((a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime())
    ?.find((meldeperiode) => meldeperiode.type === 'VANLIG' && meldeperiode.klarForInnsending);
}

export function hentNåværendeMeldeperiode(meldeperioder: Meldeperiode[]): Meldeperiode | undefined {
  return meldeperioder.find((meldeperiode) => meldeperiode.type === 'VANLIG');
}

export function hentMeldeperioderSomKanEtterregistreres(meldeperioder: Meldeperiode[]): Meldeperiode | undefined {
  return meldeperioder.find((meldeperiode) => meldeperiode.type === 'ETTERREGISTRERING');
}
