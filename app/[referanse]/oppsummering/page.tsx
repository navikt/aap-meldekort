import { hentMeldeperiode } from 'lib/services/meldekortservice';
import { Oppsummering } from 'components/steg/oppsummering/Oppsummering';

interface Props {
  params: Promise<{
    referanse: string;
  }>;
}

const OppsummeringPage = async (props: Props) => {
  const params = await props.params;
  console.log(params);

  const meldeperiode = await hentMeldeperiode();

  return <Oppsummering meldeperiode={meldeperiode} />;
};

export default OppsummeringPage;
