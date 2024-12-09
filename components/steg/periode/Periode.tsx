'use client';

import { Form } from 'components/form/Form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { JaEllerNeiOptions } from 'lib/utils/form';
import { BodyShort, Heading, HGrid, ReadMore } from '@navikt/ds-react';
import { getISOWeek } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useRouter } from 'next/navigation';
import { MeldekortResponse } from 'lib/types/types';

interface Props {
  meldeperiode: MeldekortResponse;
}

interface FormFields {
  harArbeidet: string;
}

export const Periode = ({ meldeperiode }: Props) => {
  const router = useRouter();
  const { form, formFields } = useConfigForm<FormFields>({
    harArbeidet: {
      type: 'radio',
      options: JaEllerNeiOptions,
      label: 'Har du arbeidet i perioden?',
      rules: { required: 'Du må svare på om du har arbeidet i perioden' },
    },
  });

  const fraDato = new Date(meldeperiode.periode.fom);
  const tilDato = new Date(meldeperiode.periode.tom);

  const fraDatoUkenummer = getISOWeek(fraDato);
  const tilDatoUkenummer = getISOWeek(tilDato);

  return (
    <Form
      forrigeStegUrl={`/`}
      nesteStegKnappTekst={'Til utfylling'}
      onSubmit={form.handleSubmit(() => router.push('et eller annet sted'))}
    >
      <HGrid columns={1} gap={'4'}>
        <Heading level={'2'} size={'medium'}>
          Nåværende periode
        </Heading>
        <BodyShort>{`Uke ${fraDatoUkenummer} - ${tilDatoUkenummer} (${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)})`}</BodyShort>
        <ReadMore header={'Les mer om hva som skal fylles ut'}>Her kommer det noe tekst</ReadMore>
        <FormField form={form} formField={formFields.harArbeidet} size={'medium'} />
      </HGrid>
    </Form>
  );
};
