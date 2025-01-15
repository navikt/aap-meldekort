import { Meldeperiode } from 'lib/types/types';

export function hentEldsteUbesvarteMeldeperiode(meldeperioder: Meldeperiode[]): Meldeperiode | undefined {
  return meldeperioder
    ?.sort((a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime())
    ?.find((meldeperiode) => meldeperiode.type === 'VANLIG' && meldeperiode.klarForInnsending);
}

export function nåværendeMeldeperiode(meldeperioder: Meldeperiode[]): Meldeperiode | undefined {
  return meldeperioder.find((meldeperiode) => meldeperiode.type === 'VANLIG' && meldeperiode.klarForInnsending);
}

export function meldeperioderSomKanEtterregistreres(meldeperioder: Meldeperiode[]): Meldeperiode[] | undefined {
  return meldeperioder.filter((meldeperiode) => meldeperiode.type === 'ETTERREGISTRERING');
}

export function hentInnsendteMeldeperioder(meldeperioder: Meldeperiode[]): Meldeperiode[] | undefined {
  return meldeperioder.filter((meldeperiode) => meldeperiode.type === 'VANLIG');
}
