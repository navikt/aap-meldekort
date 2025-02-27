import styles from './OppsummeringRad.module.css';
import { BodyShort, Label } from '@navikt/ds-react';

interface Props {
  label: string;
  value: string;
}

export const OppsummeringRad = ({ label, value }: Props) => {
  return (
    <div className={styles.oppsummering}>
      <Label size={'medium'}>{label}</Label>
      <BodyShort size={'medium'}>{value}</BodyShort>
    </div>
  );
};
