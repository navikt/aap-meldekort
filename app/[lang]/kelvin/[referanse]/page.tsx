import { hentMeldekort } from 'lib/services/meldekortservice';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    referanse: string;
  }>;
}

export default async function (props: Props) {
  const params = await props.params;

  const referanse = params.referanse;

  const meldePeriode = await hentMeldekort(referanse);

  redirect(`/kelvin/${referanse}/${meldePeriode.steg}`);
}
