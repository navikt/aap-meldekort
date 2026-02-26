'use client';

import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { RegistrerFraværDialog } from 'components/flyt/steg/fraværutfylling/RegistrerFraværDialog';
import { UtfyllingResponse } from 'lib/types/types';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { useTranslations } from 'next-intl';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

interface Props {
  utfylling: UtfyllingResponse;
}

interface Dag {
  dag: Date | null;
  timer: string | null;
  fravær: string; // TODO
}

export interface FraværFormFields {
  dager: Dag[];
}

export const FraværUtfylling = ({ utfylling }: Props) => {
  const t = useTranslations();
  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);
  console.log(utfylling);
  const form = useForm<FraværFormFields>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'dager',
  });

  return (
    <FormProvider {...form}>
      <VStack gap={'space-32'}>
        <VStack gap={'space-8'}>
          <Heading level={'2'} size={'large'}>
            {t('client.steg.fraværutfylling.heading')}
          </Heading>
          <BodyShort>
            {t('client.steg.fraværutfylling.periode', {
              uker: hentUkeNummerForPeriode(fraDato, tilDato),
              periode: `${formaterDatoMedÅrForFrontend(fraDato)} - ${formaterDatoMedÅrForFrontend(tilDato)}`,
            })}
          </BodyShort>
          <BodyShort>{t('client.steg.fraværutfylling.description')}</BodyShort>
        </VStack>
        <div>
          {fields.map((felt) => (
            <div key={felt.id}>
              <span>
                {felt.fravær}
                {felt.dag?.toJSON()}
              </span>
            </div>
          ))}
        </div>
        <div>
          <RegistrerFraværDialog leggTilFravær={append} />
        </div>
      </VStack>
    </FormProvider>
  );
};
