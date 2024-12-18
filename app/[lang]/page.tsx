import { hentMeldeperiode } from 'lib/services/meldekortservice';
import { Oversikt } from 'components/oversikt/Oversikt';
import { redirect } from 'next/navigation';

export default async function Home() {
  const meldeperioder = await hentMeldeperiode();

  const meldeperiode = meldeperioder
    ?.sort((a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime())
    ?.find((meldeperiode) => meldeperiode.type === 'ORDINÆRT' && meldeperiode.klarForInnsending);

  if (meldeperiode) {
    redirect(`/${meldeperiode.meldekortId}`);
  } else {
    return <Oversikt meldeperioder={meldeperioder} />;
  }
}
