import { Heading } from '@navikt/ds-react';

import styles from './page.module.css';
import { Introduksjon } from 'components/steg/introduksjon/Introduksjon';

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
        <Introduksjon />
      </div>
    </main>
  );
}
