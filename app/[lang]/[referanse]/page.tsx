import { hentMeldekort } from 'lib/services/meldekortservice';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    referanse: string;
  }>;
}

const AktivtStegPage = async (props: Props) => {
  const params = await props.params;

  const referanse = params.referanse;

  const meldePeriode = await hentMeldekort(referanse);

  redirect(`/${referanse}/${meldePeriode.steg}`);
};

export default AktivtStegPage;
