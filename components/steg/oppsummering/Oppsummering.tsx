import { Accordion, Alert, Button, HGrid } from '@navikt/ds-react';

import styles from './Oppsummering.module.css';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';

export const Oppsummering = () => {
  return (
    <HGrid columns={'1'} gap={'4'}>
      <Alert variant="success">
        Meldekortet ditt er sendt til Nav, du får beskjed hvis vi trenger noe mer fra deg.
      </Alert>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>Se hva du sendte inn</Accordion.Header>
          <Accordion.Content>
            <OppsummeringKalender
              periode={{
                fraDato: '2024-11-18',
                tilDato: '2024-12-01',
              }}
            />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <div className={styles.knapperad}>
        <Button variant="primary" type="button" as={'a'}>
          Gå til Mine AAP
        </Button>
      </div>
    </HGrid>
  );
};
