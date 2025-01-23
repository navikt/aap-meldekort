import { BodyShort } from '@navikt/ds-react';

import styles from 'components/meldekortstatus/MeldekortStatus.module.css';
import { Status } from 'lib/types/types';

interface Props {
  status: Status;
}

export const MeldekortStatus = ({ status }: Props) => {
  const hentClassnameForStatus = () => {
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
    <div className={`${hentClassnameForStatus()} ${styles.status}`}>
      <BodyShort>{storForbokstav(status)}</BodyShort>
    </div>
  );
};

function storForbokstav(tekst: string): string {
  return tekst.charAt(0).toUpperCase() + tekst.slice(1).toLowerCase();
}
