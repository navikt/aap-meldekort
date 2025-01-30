'use client';

import { Alert, BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';

import styles from 'components/flyt/korrigering/steg/seover/ingenendringer/IngenEndringer.module.css';
import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';
import { ArrowLeftIcon } from '@navikt/aksel-icons';

export const IngenEndringer = () => {
  const router = useRouter();
  const { korrigering, setKorrigering } = useKorrigerMeldekort();

  return (
    <VStack gap={'4'}>
      <Alert variant={'info'}>
        <Heading level={'3'} size={'small'} spacing>
          Du har ikke endret noe
        </Heading>
        <BodyShort spacing>
          Du har klikket på at du ønsker å endre meldekortet ditt, men du har ikke endret noe.
        </BodyShort>
      </Alert>

      <BodyShort>Har du noe å endre? Trykk tilbake.</BodyShort>
      <BodyShort>
        Har du <b>ikke</b> noe å endre? Trykk avbryt.
      </BodyShort>

      <div className={styles.buttons}>
        <Button
          onClick={() => setKorrigering({ ...korrigering, steg: 'FYLL_TIMER' })}
          iconPosition={'left'}
          icon={<ArrowLeftIcon />}
        >
          Tilbake
        </Button>

        <Button onClick={() => router.push(`/innsendt`)} variant={'secondary'}>
          Avbryt
        </Button>
      </div>
    </VStack>
  );
};
