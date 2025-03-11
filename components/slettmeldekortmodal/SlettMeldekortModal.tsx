import { Alert, BodyShort, Button, Modal, VStack } from '@navikt/ds-react';
import { RefObject, useState } from 'react';
import { slettMeldekortUtfyllingClient } from 'lib/client/clientApi';
import { InnsendingType, useParamsMedType } from 'lib/utils/url';
import { useRouter } from 'i18n/routing';
import { useTranslations } from 'next-intl';

import styles from './SlettMeldekortModal.module.css';

interface Props {
  ref: RefObject<HTMLDialogElement | null>;
}

export const SlettMeldekortModal = ({ ref }: Props) => {
  const t = useTranslations();
  const { referanse, innsendingtype } = useParamsMedType();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <Modal
      ref={ref}
      header={{
        heading: t('client.slettUtfylling.heading'),
      }}
    >
      <Modal.Body>
        <VStack gap={'8'}>
          <BodyShort>
            {innsendingtype === InnsendingType.INNSENDING
              ? t('client.slettUtfylling.innsending.content')
              : t('client.slettUtfylling.korrigering.content')}
          </BodyShort>
          {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
          <div className={styles.knapperWrapper}>
            <Button
              type={'button'}
              loading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                const slettGikkFint = await slettMeldekortUtfyllingClient(referanse);
                if (slettGikkFint) {
                  router.push('/');
                } else {
                  setErrorMessage(t('client.slettUtfylling.error'));
                }
                setIsLoading(false);
              }}
            >
              {t('client.slettUtfylling.avbrytKnappTekst')}
            </Button>
            <Button type={'button'} variant={'secondary'} onClick={() => ref.current?.close()}>
              {t('client.slettUtfylling.forstettKnappTekst')}
            </Button>
          </div>
        </VStack>
      </Modal.Body>
    </Modal>
  );
};
