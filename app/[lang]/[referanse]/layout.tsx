import { ReactNode } from 'react';
import { HjemKnapp } from 'components/hjemknapp/HjemKnapp';
import { VStack } from '@navikt/ds-react';

interface Props {
  children: ReactNode;
}

export default async function innsendingLayout(props: Props) {
  return (
    <VStack gap={'4'}>
      <HjemKnapp label={'Tilbake til oversikten'} href={`/`} />
      {props.children}
    </VStack>
  );
}
