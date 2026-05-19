'use client';

import { Form } from 'components/form/Form';
import { getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { BodyShort, Heading, Label, Link, Radio, ReadMore, VStack } from '@navikt/ds-react';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { UtfyllingResponse } from 'lib/types/types';
import { InnsendingType, useGåTilSteg, useParamsMedType } from 'lib/utils/url';
import { useMellomlagring } from 'hooks/mellomlagreMeldekortHook';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { isSameDay } from 'date-fns';
import { useFeatureFlag } from 'context/UnleashContext';

interface Props {
  utfylling: UtfyllingResponse;
}

interface FormFields {
  harDuJobbet: JaEllerNei;
}

export const Spørsmål = ({ utfylling }: Props) => {
  const visTekstendringer = useFeatureFlag('MeldekortTekstendringer');
  const t = useTranslations();
  const { referanse, innsendingtype } = useParamsMedType();
  const { gåTilSteg } = useGåTilSteg();
  const { isLoading, løsStegOgGåTilNeste, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const { mellomlagreMeldekort, sistLagret } = useMellomlagring();

  const form = useForm<FormFields>({
    defaultValues: {
      harDuJobbet: getJaNeiEllerUndefined(utfylling.tilstand.svar.harDuJobbet),
    },
  });

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  const harDuJobbetValue = useWatch({ control: form.control, name: 'harDuJobbet' });

  useEffect(() => {
    if (harDuJobbetValue !== null) {
      mellomlagreMeldekort({
        nyTilstand: {
          aktivtSteg: 'SPØRSMÅL',
          svar: {
            ...utfylling.tilstand.svar,
            harDuJobbet: harDuJobbetValue === JaEllerNei.Ja,
          },
        },
      });
    }
  }, [harDuJobbetValue]);

  return (
    <Form
      forrigeStegOnClick={innsendingtype === InnsendingType.INNSENDING ? () => gåTilSteg('INTRODUKSJON') : undefined}
      sistLagret={sistLagret}
      onSubmit={form.handleSubmit(async (data) => {
        løsStegOgGåTilNeste({
          nyTilstand: {
            aktivtSteg: 'SPØRSMÅL',
            svar: {
              ...utfylling.tilstand.svar,
              dager: utfylling.tilstand.svar.dager.map((dag) => {
                return {
                  dato: dag.dato,
                  timerArbeidet: data.harDuJobbet === JaEllerNei.Nei ? 0 : dag.timerArbeidet,
                  fravær: utfylling.tilstand.svar.dager.find((tilstandDag) => isSameDay(tilstandDag.dato, dag.dato))
                    ?.fravær,
                };
              }),
              harDuJobbet: data.harDuJobbet === JaEllerNei.Ja,
            },
          },
        });
      })}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <VStack gap={'space-32'}>
        <VStack gap={'space-8'}>
          <Heading level={'2'} size={'large'}>
            {innsendingtype === InnsendingType.INNSENDING
              ? t('client.steg.spørsmål.innsending.heading')
              : t('client.steg.spørsmål.korrigering.heading')}
          </Heading>
          <BodyShort>
            {t('client.steg.spørsmål.periode', {
              uker: hentUkeNummerForPeriode(fraDato, tilDato),
              periode: `${formaterDatoMedÅrForFrontend(fraDato)} - ${formaterDatoMedÅrForFrontend(tilDato)}`,
            })}
          </BodyShort>
          {visTekstendringer && (
            <>
              <BodyShort>{t('client.steg.spørsmål.hvaErArbeid')}</BodyShort>
              <VStack>
                <Label>{t('client.steg.spørsmål.siste14.label')}</Label>
                <BodyShort>{t('client.steg.spørsmål.siste14.description')}</BodyShort>
                <ReadMore header={t('client.steg.spørsmål.siste14.readmore.header')}>
                  <VStack gap={'space-8'}>
                    <BodyShort>{t.rich('client.steg.spørsmål.siste14.readmore.body', {
                      br: () => <br />,
                      a: (chunks) => (
                        <Link href="https://www.nav.no/send-meldekort-aap#arbeid" target="_blank">
                          {chunks}
                        </Link>)
                    })}</BodyShort>
                  </VStack>
                </ReadMore>
              </VStack>
            </>
          )}
        </VStack>
        <RadioGroupWrapper
          name={'harDuJobbet'}
          control={form.control}
          label={t('client.steg.spørsmål.skjema.felter.harDuArbeidet.label')}
          size={'medium'}
          rules={{ required: t('client.steg.spørsmål.skjema.felter.harDuArbeidet.error') }}
        >
          <Radio value={JaEllerNei.Ja}>Ja</Radio>
          <Radio value={JaEllerNei.Nei}>Nei</Radio>
        </RadioGroupWrapper>
      </VStack>
    </Form>
  );
};
