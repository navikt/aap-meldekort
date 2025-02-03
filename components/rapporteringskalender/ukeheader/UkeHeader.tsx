import { BodyShort } from '@navikt/ds-react';
import styles from './UkeHeader.module.css';

export const UkeHeader = () => {
  return (
    <div className={styles.header}>
      <BodyShort size={'small'} aria-hidden>
        ma.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        ti.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        on.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        to.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        fr.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        lø.
      </BodyShort>
      <BodyShort size={'small'} aria-hidden>
        sø.
      </BodyShort>
    </div>
  );
};
