import { Accordion, Alert, Button } from '@navikt/ds-react';

export const Oppsummering = () => {
  return (
    <div>
      <Alert variant="success">
        Meldekortet ditt er sendt til Nav, du får beskjed hvis vi trenger noe mer fra deg.
      </Alert>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>Se hva du sendte inn</Accordion.Header>
          <Accordion.Content>Her kommer det innhold</Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <Button variant="primary" type="button" as={'a'}>
        Gå til Mine AAP
      </Button>
    </div>
  );
};
