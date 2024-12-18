import { Kvittering } from 'components/steg/kvittering/Kvittering';
import { hentMeldekort, hentMeldeperioder } from 'lib/services/meldekortservice';
import { hentEldsteUbesvarteMeldeperiode } from 'lib/utils/meldeperioder';

interface Props {
  referanse: string;
}

export const KvitteringMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);
  const meldeperioder = await hentMeldeperioder();

  const eldsteUbesvarteMeldeperiode = await hentEldsteUbesvarteMeldeperiode(meldeperioder);

  return <Kvittering meldekort={meldekort} ubesvartMeldeperiode={eldsteUbesvarteMeldeperiode} />;
};
