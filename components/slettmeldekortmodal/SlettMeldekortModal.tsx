import { Alert, BodyShort, Button, HStack, Modal, VStack } from '@navikt/ds-react';
import { RefObject, useState } from 'react';
import { slettMeldekortUtfyllingClient } from 'lib/client/clientApi';
import { InnsendingType, useParamsMedType } from 'lib/utils/url';
import { useRouter } from 'i18n/routing';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
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
  const [isDeleted, setIsDeleted] = useState(false);

  return (
    <Modal
      ref={ref}
      header={
        isDeleted
          ? {
              heading: t('client.slettUtfylling.utfyllingSlettet.heading'),
              icon: <CheckmarkCircleFillIcon color={'green'} />,
              closeButton: false,
            }
          : {
              heading:
                innsendingtype === InnsendingType.INNSENDING
                  ? t('client.slettUtfylling.innsending.heading')
                  : t('client.slettUtfylling.korrigering.heading'),
            }
      }
    >
      <Modal.Body>
        {!isDeleted ? (
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
                    setIsDeleted(true);
                  } else {
                    setErrorMessage(t('client.slettUtfylling.error'));
                  }
                  setIsLoading(false);
                }}
              >
                {innsendingtype === InnsendingType.INNSENDING
                  ? t('client.slettUtfylling.innsending.avbrytKnappTekst')
                  : t('client.slettUtfylling.korrigering.avbrytKnappTekst')}
              </Button>
              <Button type={'button'} variant={'secondary'} onClick={() => ref.current?.close()}>
                {t('client.slettUtfylling.forstettKnappTekst')}
              </Button>
            </div>
          </VStack>
        ) : (
          <VStack gap={'8'}>
            <BodyShort>Gå tilbake til oversikten for å sende meldekortet på nytt.</BodyShort>
            <HStack gap={'2'}>
              <Button type={'button'} loading={isLoading} onClick={() => router.push('/')}>
                Gå tilbake til oversikt
              </Button>
            </HStack>
          </VStack>
        )}
      </Modal.Body>
    </Modal>
  );
};
