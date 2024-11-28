'use client';

import { Form } from 'components/form/Form';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';
import { Alert, BodyLong, Heading, ReadMore } from '@navikt/ds-react';
import { eachDayOfInterval } from 'date-fns';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { FormProvider } from 'react-hook-form';
import { JaEllerNei } from 'lib/utils/form';
import { useState } from 'react';
import { Meldeperiode } from 'lib/types';
import { useRouter } from 'next/navigation';

interface Props {
  meldeperiode: Meldeperiode;
}

export interface MeldepliktFormFields {
  dager: Dag[];
  opplysningerStemmer: string;
}

interface Dag {
  dag: string;
  timer?: string;
}

export interface MeldepliktError {
  index: number;
  harError: boolean;
}

export const Utfylling = ({ meldeperiode }: Props) => {
  const router = useRouter();
  const [errors, setErrors] = useState<MeldepliktError[]>([]);

  const fraDato = new Date(meldeperiode.periode.fom);
  const tilDato = new Date(meldeperiode.periode.tom);

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
        onSubmit={form.handleSubmit((data) => {
          setErrors([]);
          const errors: MeldepliktError[] = [];
          data.dager.map((dag, index) => {
            if (!erGyldigTimer(dag.timer)) {
              errors.push({ index: index, harError: true });
            }
          });
          setErrors(errors);

          if (errors.length === 0) {
            router.push(`/${meldeperiode.referanse}/oppsummering`);
          }
        })}
      >
        <div className={'flex-column'}>
          <Heading size={'large'} level={'2'}>
            Fyll ut meldekortet
          </Heading>
          <BodyLong>
            Fyll inn timene du har arbeidet i perioden. Timer skrives med desimal til nærmeste halvtime. 7 timer og 30
            min = 7,5 timer. 30 min = 0,50 timer
          </BodyLong>
          <ReadMore header={'Les mer om hva som skal fylles ut'}>Her kommer det informasjon</ReadMore>
          <Rapporteringskalender meldeperiode={meldeperiode} errors={errors} />
          {errors.length > 0 && (
            <Alert variant={'error'}>
              Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer
            </Alert>
          )}

          <FormField form={form} formField={formFields.opplysningerStemmer} size={'medium'} />
        </div>
      </Form>
    </FormProvider>
  );
};

function erGyldigTimer(value?: string): boolean {
  if (!value || value === '') {
    return true;
  }

  const valueAsNumber = Number(replaceCommasWithDots(value));

  if (isNaN(valueAsNumber) || valueAsNumber < 0 || valueAsNumber > 24) {
    return false;
  } else if ((valueAsNumber * 10) % 5 !== 0) {
    return false;
  } else {
    return true;
  }
}

function replaceCommasWithDots(input: string): string {
  return input.replace(/,/g, '.');
}
