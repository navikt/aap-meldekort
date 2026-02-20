import styles from './ConfirmationPanel.module.css';
import { BodyShort, Checkbox, HStack, VStack } from '@navikt/ds-react';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

interface Props {
  label: string;
  onChange: () => void;
  error?: string;
}

export const ConfirmationPanel = ({ label, onChange, error }: Props) => {
  const hasError = error !== undefined;

  return (
    <VStack>
      <div className={`${styles.confirmationpanel} ${hasError ? styles.confirmationPanelError : ''}`}>
        <Checkbox onChange={onChange} error={hasError}>
          <BodyShort>{label}</BodyShort>
        </Checkbox>
      </div>
      {error && (
        <HStack gap={'space-4'} align={'center'} role="alert">
          <ExclamationmarkTriangleFillIcon title={'feil ved bekreftelse'} className={styles.icon} aria-hidden />
          <p className={styles.tekst}>{error}</p>
        </HStack>
      )}
    </VStack>
  );
};
