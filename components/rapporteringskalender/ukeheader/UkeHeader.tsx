import { BodyShort } from '@navikt/ds-react';
import styles from './UkeHeader.module.css';

export const UkeHeader = () => {
  return (
    <div className={styles.header}>
      <BodyShort size={'small'} aria-hidden>
        Man.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        Tir.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        Ons.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        Tor.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        Fre.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        Lør.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        Søn.
      </BodyShort>
    </div>
  );
};
