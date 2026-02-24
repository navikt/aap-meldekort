'use client';

import { BodyShort, Heading, Radio, VStack } from '@navikt/ds-react';
import { Form } from 'components/form/Form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { FraværSvar, UtfyllingResponse } from 'lib/types/types';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { useParamsMedType } from 'lib/utils/url';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  utfylling: UtfyllingResponse;
}

interface FormFields {
  harDuGjennomførtAvtaltAktivitet: FraværSvar;
}

export const FraværSpørsmål = ({ utfylling }: Props) => {
  const t = useTranslations();
  const { referanse, innsendingtype } = useParamsMedType();
  const { isLoading, løsStegOgGåTilNeste, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const form = useForm<FormFields>({
    defaultValues: {
      harDuGjennomførtAvtaltAktivitet: utfylling.tilstand.svar.harDuGjennomførtAvtaltAktivitet,
    },
  });

  const harDuGjennomførtAvtaltAktivitetValue = form.watch('harDuGjennomførtAvtaltAktivitet');

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  useEffect(() => {
    if (harDuGjennomførtAvtaltAktivitetValue !== null) {
      // TODO mellomlagring her!
    }
  }, [harDuGjennomførtAvtaltAktivitetValue]);

  return (
    <Form
      // TODO hvordan håndtere forrigeSteg hvis dette blir et eget steg?
      forrigeStegOnClick={undefined}
      onSubmit={form.handleSubmit(async (data) => {
        løsStegOgGåTilNeste({
          nyTilstand: {
            aktivtSteg: 'FRAVÆR_SPØRSMÅL',
            svar: {
              ...utfylling.tilstand.svar,
              harDuGjennomførtAvtaltAktivitet: data.harDuGjennomførtAvtaltAktivitet,
            },
          },
        });
      })}
    >
      <VStack gap={'space-32'}>
        <VStack gap={'space-8'}>
          <Heading level={'2'} size={'large'}>
            {t('client.steg.fraværspørsmål.heading')}
          </Heading>
          <BodyShort>
            {t('client.steg.fraværspørsmål.periode', {
              uker: hentUkeNummerForPeriode(fraDato, tilDato),
              periode: `${formaterDatoMedÅrForFrontend(fraDato)} - ${formaterDatoMedÅrForFrontend(tilDato)}`,
            })}
          </BodyShort>
        </VStack>
        <RadioGroupWrapper
          name={'harDuGjennomførtAvtaltAktivitet'}
          control={form.control}
          label={t('client.steg.fraværspørsmål.harDuGjennomførtAvtaltAktivitet.label')}
          size={'medium'}
          rules={{ required: t('client.steg.fraværspørsmål.harDuGjennomførtAvtaltAktivitet.error') }}
        >
          <Radio value={'GJENNOMFØRT_AVTALT_AKTIVITET'}>
            {t('client.steg.fraværspørsmål.harDuGjennomførtAvtaltAktivitet.options.gjennomførtAvtaltAktivitet')}
          </Radio>
          <Radio value={'NEI_IKKE_GJENNOMFORT_AVTALT_AKTIVITET'}>
            {t('client.steg.fraværspørsmål.harDuGjennomførtAvtaltAktivitet.options.neiIkkeGjennomførtAvtaltAktivitet')}
          </Radio>
          <Radio value={'INGEN_AVTALTE_AKTIVITETER'}>
            {t('client.steg.fraværspørsmål.harDuGjennomførtAvtaltAktivitet.options.ingenAvtalteAktiviteter')}
          </Radio>
        </RadioGroupWrapper>
      </VStack>
    </Form>
  );
};
