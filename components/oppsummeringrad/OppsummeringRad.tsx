import styles from './OppsummeringRad.module.css';
import { BodyShort, HStack, Label } from '@navikt/ds-react';

interface Props {
  label: string;
  value: string;
}

export const OppsummeringRad = ({ label, value }: Props) => {
  return (
    <HStack className={styles.oppsummering} justify={'space-between'}>
      <Label size={'medium'}>{label}</Label>
      <BodyShort size={'medium'}>{value}</BodyShort>
    </HStack>
  );
};
