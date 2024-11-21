import { Heading } from '@navikt/ds-react';

import styles from './page.module.css';
import { Steg } from 'components/steg/Steg';

export default function Home() {
  return (
    <main>
      <div className={styles.rapporteringheader}>
        <div className={styles.innhold}>
          <Heading level={'1'} size={'xlarge'}>
            Meldekort - AAP
          </Heading>
        </div>
      </div>
      <div className={styles.rapporteringcontainer}>
        <Steg />
      </div>
    </main>
  );
}
