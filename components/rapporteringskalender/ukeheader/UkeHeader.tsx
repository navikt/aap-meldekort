import { BodyShort } from '@navikt/ds-react';
import styles from './UkeHeader.module.css';

export const UkeHeader = () => {
  return (
    <div className={styles.header}>
      <BodyShort size={'large'}>Man.</BodyShort>
      <BodyShort size={'large'}>Tir.</BodyShort>
      <BodyShort size={'large'}>Tor.</BodyShort>
      <BodyShort size={'large'}>Ons.</BodyShort>
      <BodyShort size={'large'}>Tor.</BodyShort>
      <BodyShort size={'large'}>Fre.</BodyShort>
      <BodyShort size={'large'}>Lør.</BodyShort>
      <BodyShort size={'large'}>Søn.</BodyShort>
    </div>
  );
};
