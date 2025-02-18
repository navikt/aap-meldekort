import { hentMeldekort } from 'lib/services/meldekortservice';
import { redirect } from 'i18n/routing';

interface Props {
  params: Promise<{
    referanse: string;
    locale: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;

  const referanse = params.referanse;

  const meldekort = await hentMeldekort(referanse);

  redirect({ href: `/${referanse}/${meldekort.steg}`, locale: params.locale });
}
