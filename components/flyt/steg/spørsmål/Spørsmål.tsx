'use client';

import { Form } from 'components/form/Form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { UtfyllingResponse } from 'lib/types/types';
import { InnsendingType, useGåTilSteg, useParamsMedType } from 'lib/utils/url';
import { useMellomlagring } from 'hooks/mellomlagreMeldekortHook';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';

interface Props {
  utfylling: UtfyllingResponse;
}

interface FormFields {
  harDuJobbet: JaEllerNei;
}

export const Spørsmål = ({ utfylling }: Props) => {
  const { referanse, innsendingtype } = useParamsMedType();
  const { gåTilSteg } = useGåTilSteg();
  const { isLoading, løsStegOgGåTilNeste, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const { mellomlagreMeldekort, sistLagret } = useMellomlagring();

  const { form, formFields } = useConfigForm<FormFields>({
    harDuJobbet: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(utfylling.tilstand.svar.harDuJobbet),
      label: 'Har du arbeidet i perioden?',
      rules: { required: 'Du må svare på om du har arbeidet i perioden' },
    },
  });

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  const harDuJobbetValue = useWatch({ control: form.control, name: 'harDuJobbet' });

  useEffect(() => {
    mellomlagreMeldekort({
      nyTilstand: {
        aktivtSteg: 'SPØRSMÅL',
        svar: {
          ...utfylling.tilstand.svar,
          harDuJobbet: harDuJobbetValue === JaEllerNei.Ja,
        },
      },
    });
  }, [harDuJobbetValue]);

  return (
    <Form
      forrigeStegOnClick={() => gåTilSteg('INTRODUKSJON')}
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
      <VStack gap={'8'}>
        <VStack gap={'2'}>
          <Heading level={'2'} size={'large'}>
            {innsendingtype === InnsendingType.INNSENDING ? 'Fyll ut meldekort' : 'Endre meldekort'}
          </Heading>
          <BodyShort>{`Uke ${hentUkeNummerForPeriode(fraDato, tilDato)} (${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)})`}</BodyShort>
        </VStack>
        <FormField form={form} formField={formFields.harDuJobbet} size={'medium'} />
      </VStack>
    </Form>
  );
};
