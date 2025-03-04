import { Alert, BodyShort, Button, HStack, Modal, VStack } from '@navikt/ds-react';
import { RefObject, useState } from 'react';
import { slettMeldekortUtfyllingClient } from 'lib/client/clientApi';
import { useParamsMedType } from 'lib/utils/url';
import { useRouter } from 'i18n/routing';
import { CheckmarkCircleFillIcon, TrashIcon } from '@navikt/aksel-icons';

interface Props {
  ref: RefObject<HTMLDialogElement | null>;
}

export const SlettMeldekortModal = ({ ref }: Props) => {
  const params = useParamsMedType();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isDeleted, setIsDeleted] = useState(false);

  return (
    <Modal
      ref={ref}
      header={
        isDeleted
          ? { heading: 'Meldekortet er slettet', icon: <CheckmarkCircleFillIcon color={'green'} /> }
          : { heading: 'Vil du avbryte og slette utfyllingen av meldekortet?', icon: <TrashIcon /> }
      }
      closeOnBackdropClick={true}
    >
      <Modal.Body>
        {!isDeleted ? (
          <VStack gap={'4'}>
            <BodyShort>Kanskje noe tekst her?</BodyShort>
            {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
            <HStack gap={'2'}>
              <Button
                type={'button'}
                loading={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  const slettGikkFint = await slettMeldekortUtfyllingClient(params.referanse);
                  if (slettGikkFint) {
                    setIsDeleted(true);
                  } else {
                    setErrorMessage('Noe gikk galt ved sletting av meldekort.');
                  }
                  setIsLoading(false);
                }}
              >
                Ja, avbryt og slett utfylling
              </Button>
              <Button type={'button'} variant={'secondary'}>
                Nei, ikke avbryt og slett
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack gap={'4'}>
            <BodyShort>Kanskje noe tekst her?</BodyShort>
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
