import styles from './OppsummeringRad.module.css';
import { BodyShort, HStack } from '@navikt/ds-react';

interface Props {
  label: string;
  value: string;
}

export const OppsummeringRad = ({ label, value }: Props) => {
  return (
    <HStack className={styles.oppsummering} justify={'space-between'}>
      <BodyShort size={'medium'} weight={'semibold'}>
        {label}
      </BodyShort>
      <BodyShort size={'medium'}>{value}</BodyShort>
    </HStack>
  );
};
