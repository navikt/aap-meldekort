import { BodyShort } from '@navikt/ds-react';
import styles from './UkeHeader.module.css';

export const UkeHeader = () => {
  return (
    <div className={styles.header}>
      <BodyShort size={'large'} aria-hidden>
        Man.
      </BodyShort>
      <BodyShort size={'large'} aria-hidden>
        Tir.
      </BodyShort>
      <BodyShort size={'large'} aria-hidden>
        Ons.
      </BodyShort>
      <BodyShort size={'large'} aria-hidden>
        Tor.
      </BodyShort>
      <BodyShort size={'large'} aria-hidden>
        Fre.
      </BodyShort>
      <BodyShort size={'large'} aria-hidden>
        Lør.
      </BodyShort>
      <BodyShort size={'large'} aria-hidden>
        Søn.
      </BodyShort>
    </div>
  );
};
