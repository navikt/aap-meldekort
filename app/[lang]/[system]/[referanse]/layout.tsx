import { ReactNode } from 'react';
import { HjemKnapp } from 'components/hjemknapp/HjemKnapp';
import { VStack } from '@navikt/ds-react';

interface Props {
  params: Promise<{
    referanse: string;
    aktivtSteg: string;
    system: string;
  }>;
  children: ReactNode;
}

export default async function innsendingLayout(props: Props) {
  const params = await props.params;

  return (
    <VStack gap={'4'}>
      <HjemKnapp label={'Tilbake til oversikten'} href={`/${params.system}`} />
      {props.children}
    </VStack>
  );
}
