import { BodyShort } from '@navikt/ds-react';

import styles from './Status.module.css';

interface Props {
  status: 'INNSENDT';
}

export const Status = ({ status }: Props) => {
  return (
    <div className={styles.status}>
      <BodyShort>{status}</BodyShort>
    </div>
  );
};
