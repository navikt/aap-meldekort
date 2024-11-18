import { BodyShort, Heading } from '@navikt/ds-react';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.heading}>
        <Heading level={'1'} size={'large'}>
          Meldekort - AAP
        </Heading>
        <div className={styles.grønnlinje} />
      </div>
      <div>
        <BodyShort>Her kommer det innhold..</BodyShort>
      </div>
    </main>
  );
}
