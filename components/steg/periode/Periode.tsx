'use client';

import { Form } from 'components/form/Form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { BodyShort, Heading, HGrid, ReadMore } from '@navikt/ds-react';
import { getISOWeek } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useRouter } from 'next/navigation';
import { MeldekortResponse } from 'lib/types/types';
import { gåTilNesteStegClient } from 'lib/client/clientApi';

interface Props {
  meldekort: MeldekortResponse;
  referanse: string;
}

interface FormFields {
  harArbeidet: string;
}

export const Periode = ({ meldekort, referanse }: Props) => {
  const router = useRouter();
  const { form, formFields } = useConfigForm<FormFields>({
    harArbeidet: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(meldekort.meldekort.harDuJobbet),
      label: 'Har du arbeidet i perioden?',
      rules: { required: 'Du må svare på om du har arbeidet i perioden' },
    },
  });

  const fraDato = new Date(meldekort.periode.fom);
  const tilDato = new Date(meldekort.periode.tom);

  const fraDatoUkenummer = getISOWeek(fraDato);
  const tilDatoUkenummer = getISOWeek(tilDato);

  return (
    <Form
      forrigeSteg={'BEKREFT_SVARER_ÆRLIG'}
      referanse={referanse}
      nesteStegKnappTekst={'Til utfylling'}
      onSubmit={form.handleSubmit(async (data) => {
        const meldekortResponse = await gåTilNesteStegClient(referanse, {
          meldekort: { ...meldekort.meldekort, harDuJobbet: data.harArbeidet === JaEllerNei.Ja },
          nåværendeSteg: 'JOBBET_I_MELDEPERIODEN',
        });

        if (meldekortResponse) {
          router.push(`/${referanse}/${meldekortResponse.steg}`);
        } else {
          // Håndtere error
        }
      })}
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
