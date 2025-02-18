import styles from './OppsummeringRad.module.css';
import { BodyShort, Label } from '@navikt/ds-react';

interface Props {
  heading: string;
  label: string;
  value: string;
  backgroundColor: 'green' | 'orange' | 'blue' | 'purple' | 'white';
}

export const OppsummeringRad = ({ heading, label, value, backgroundColor }: Props) => {
  const bakgrunnClassName = () => {
    switch (backgroundColor) {
      case 'white':
        return styles.white;
      case 'blue':
        return styles.blue;
      case 'green':
        return styles.green;
      case 'orange':
        return styles.orange;
      case 'purple':
        return styles.purple;
    }
  };

  return (
    <div className={`${styles.oppsummering} `}>
      <BodyShort size={'small'} className={styles.heading}>
        {heading}
      </BodyShort>
      <div className={`${styles.oppsummeringrad} ${bakgrunnClassName()}`}>
        <Label size={'medium'}>{label}</Label>
        <BodyShort size={'medium'}>{value}</BodyShort>
      </div>
    </div>
  );
};
