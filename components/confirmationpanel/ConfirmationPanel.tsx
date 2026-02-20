import styles from './ConfirmationPanel.module.css';
import { BodyShort, Checkbox, HStack, VStack } from '@navikt/ds-react';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

interface Props {
  checked: boolean;
  label: string;
  onChange: () => void;
  error?: string;
}

export const ConfirmationPanel = ({ checked, label, onChange, error }: Props) => {
  const hasError = error !== undefined;
  const panelBackgroundClassName = getPanelBackgroundClassName(checked, hasError);

  return (
    <VStack>
      <div className={`${styles.confirmationpanel} ${panelBackgroundClassName}`}>
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

function getPanelBackgroundClassName(checked: boolean, error: boolean) {
  if (error) {
    return styles.confirmationPanelError;
  }

  if (checked) {
    return styles.confirmationPanelChecked;
  }

  return styles.confirmationPanelNotChecked;
}
