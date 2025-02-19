import { BodyShort } from '@navikt/ds-react';

import styles from 'components/meldekortstatus/MeldekortStatus.module.css';
import { Status } from 'lib/types/types';
import { storForbokstav } from 'lib/utils/string';

interface Props {
  status: Status;
}

export const MeldekortStatus = ({ status }: Props) => {
  const hentClassnameForStatus = () => {
    switch (status) {
      case 'ARENA_INNSENDT':
        return styles.innsendt;
      case 'ARENA_FEILET':
        return styles.feilet;
      case 'ARENA_FERDIG':
        return styles.ferdig;
      case 'KELVIN':
        return styles.ferdig;
    }
  };

  return (
    <div className={`${hentClassnameForStatus()} ${styles.status}`}>
      <BodyShort>{storForbokstav(status)}</BodyShort>
    </div>
  );
};
