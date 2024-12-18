import { Meldeperiode } from 'lib/types/types';

export async function hentEldsteUbesvarteMeldeperiode(
  meldeperioder: Meldeperiode[]
): Promise<Meldeperiode | undefined> {
  return meldeperioder
    ?.sort((a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime())
    ?.find((meldeperiode) => meldeperiode.type === 'ORDINÆRT' && meldeperiode.klarForInnsending);
}
