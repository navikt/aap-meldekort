import { BodyShort, Button, Modal, VStack } from '@navikt/ds-react';
import { RefObject } from 'react';
import { useRouter } from 'i18n/routing';
import { useTranslations } from 'next-intl';

import styles from './FortsettSenereModal.module.css';

interface Props {
  ref: RefObject<HTMLDialogElement | null>;
}

export const FortsettSenereModal = ({ ref }: Props) => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Modal
      ref={ref}
      header={{
        heading: t('client.fortsettSenere.heading'),
      }}
    >
      <Modal.Body>
        <VStack gap={'8'}>
          <BodyShort>{t('client.fortsettSenere.content')}</BodyShort>
          <div className={styles.knapperWrapper}>
            <Button
              type={'button'}
              onClick={async () => {
                router.push('/');
              }}
            >
              {t('client.fortsettSenere.gåTilOversikt')}
            </Button>
            <Button type={'button'} variant={'secondary'} onClick={() => ref.current?.close()}>
              {t('client.fortsettSenere.fortsettUtfylling')}
            </Button>
          </div>
        </VStack>
      </Modal.Body>
    </Modal>
  );
};
