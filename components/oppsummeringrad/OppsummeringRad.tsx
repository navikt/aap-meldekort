import styles from './OppsummeringRad.module.css';
import { BodyShort, Label } from '@navikt/ds-react';

interface Props {
  heading: string;
  label: string;
  value: string;
  backgroundColor: 'green' | 'white' | 'blue';
}

export const OppsummeringRad = ({ heading, label, value, backgroundColor }: Props) => {
  const backgroudColorClassName = () => {
    switch (backgroundColor) {
      case 'white':
        return styles.white;
      case 'blue':
        return styles.blue;
      case 'green':
        return styles.green;
    }
  };

  return (
    <div className={`${styles.oppsummering} `}>
      <BodyShort size={'small'} className={styles.heading}>
        {heading}
      </BodyShort>
      <div className={`${styles.oppsummeringrad} ${backgroudColorClassName()}`}>
        <Label size={'medium'}>{label}</Label>
        <BodyShort size={'medium'}>{value}</BodyShort>
      </div>
    </div>
  );
};
