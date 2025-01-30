import { hentMeldekort } from 'lib/services/meldekortservice';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    referanse: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;

  const referanse = params.referanse;

  const meldekort = await hentMeldekort(referanse);

  redirect(`/${referanse}/${meldekort.steg}`);
}
