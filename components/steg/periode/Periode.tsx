import { Form } from 'components/form/Form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { JaEllerNeiOptions } from 'lib/utils/form';
import { PeriodeType } from 'components/rapporteringskalender/Rapporteringskalender';
import { useSteg } from 'hooks/StegHook';
import { BodyShort, Heading, HGrid, ReadMore } from '@navikt/ds-react';
import { getISOWeek } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  periode: PeriodeType;
}

interface FormFields {
  harArbeidet: string;
}

export const Periode = ({ periode }: Props) => {
  const { setSteg } = useSteg();
  const { form, formFields } = useConfigForm<FormFields>({
    harArbeidet: {
      type: 'radio',
      options: JaEllerNeiOptions,
      label: 'Har du arbeidet i perioden?',
      rules: { required: 'Du må svare på om du har arbeidet i perioden' },
    },
  });

  const fraDato = new Date(periode.periode.fraDato);
  const tilDato = new Date(periode.periode.tilDato);

  const fraDatoUkenummer = getISOWeek(fraDato);
  const tilDatoUkenummer = getISOWeek(tilDato);
  return (
    <Form
      forrigeSteg={'INTRO'}
      nesteStegKnappTekst={'Til utfylling'}
      onSubmit={form.handleSubmit(() => setSteg('UTFYLLING'))}
    >
      <HGrid columns={1} gap={'4'}>
        <Heading level={'2'} size={'medium'}>
          Nåværende periode
        </Heading>
        <BodyShort>{`Uke ${fraDatoUkenummer} - ${tilDatoUkenummer} (${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)})`}</BodyShort>
        <ReadMore header={'Les mer om hva som skal fylles ut'}>Her kommer det noe tekst</ReadMore>
        <FormField form={form} formField={formFields.harArbeidet} />
      </HGrid>
    </Form>
  );
};
