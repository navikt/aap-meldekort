import { Form } from 'components/form/Form';
import { PeriodeType, Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';
import { BodyLong, Heading, ReadMore } from '@navikt/ds-react';
import { eachDayOfInterval } from 'date-fns';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { FormProvider } from 'react-hook-form';
import { JaEllerNei } from 'lib/utils/form';
import { useSteg } from 'hooks/StegHook';

interface Props {
  periode: PeriodeType;
}

export interface MeldepliktFormFields {
  dager: Dag[];
  opplysningerStemmer: string;
}

interface Dag {
  dag: string;
  timer?: string;
}

export const Utfylling = ({ periode }: Props) => {
  const { setSteg } = useSteg();
  const fraDato = new Date(periode.fraDato);
  const tilDato = new Date(periode.tilDato);

  const { form, formFields } = useConfigForm<MeldepliktFormFields>({
    dager: {
      type: 'fieldArray',
      defaultValue: eachDayOfInterval({ start: fraDato, end: tilDato }).map((date) => {
        return {
          dag: date.toString(),
          timer: '',
        };
      }),
    },
    opplysningerStemmer: {
      type: 'checkbox',
      label: 'Bekreft at opplysningene stemmer',
      hideLabel: true,
      options: [{ label: 'Jeg bekrefter at disse opplysningene stemmer', value: JaEllerNei.Ja }],
      rules: { required: 'Du må bekrefte at disse opplysningene stemmer' },
    },
  });

  return (
    <FormProvider {...form}>
      <Form
        forrigeSteg={'PERIODE'}
        nesteStegKnappTekst={'Send inn'}
        onSubmit={form.handleSubmit(() => setSteg('OPPSUMMERING'))}
      >
        <Heading size={'large'} level={'2'}>
          Fyll ut meldekortet
        </Heading>
        <BodyLong>
          Fyll inn timene du har arbeidet i perioden. Timer skrives med desimal til nærmeste kvarter. 7 timer og 30 min
          = 7,5 timer. 15 min = 0,25 timer
        </BodyLong>
        <ReadMore header={'Les mer om hva som skal fylles ut'}>Her kommer det informasjon</ReadMore>
        <Rapporteringskalender periode={periode} />

        <FormField form={form} formField={formFields.opplysningerStemmer} size={'medium'} />
      </Form>
    </FormProvider>
  );
};
