import { BodyShort } from '@navikt/ds-react';

import styles from 'components/meldekortstatus/MeldekortStatus.module.css';
import { Status } from 'lib/types/types';

interface Props {
  status: Status;
}

export const MeldekortStatus = ({ status }: Props) => {
  const className = () => {
    switch (status) {
      case 'INNSENDT':
        return styles.innsendt;
      case 'FEILET':
        return styles.feilet;
      case 'FERDIG':
        return styles.ferdig;
      case 'KORRIGERT':
        return styles.korrigert;
    }
  };

  return (
    <div className={className()}>
      <BodyShort>{status}</BodyShort>
    </div>
  );
};
