import { BodyShort } from '@navikt/ds-react';

import styles from './Status.module.css';

interface Props {
  status: 'INNSENDT';
}

export const Status = ({}: Props) => {
  return (
    <div className={styles.status}>
      <BodyShort>Innsendt</BodyShort>
    </div>
  );
};
