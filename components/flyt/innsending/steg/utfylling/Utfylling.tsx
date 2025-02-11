'use client';

import { Form } from 'components/form/Form';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';
import { Alert, BodyLong, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { useConfigForm } from '@navikt/aap-felles-react';
import { FormProvider } from 'react-hook-form';
import { useState } from 'react';
import { MeldekortResponse } from 'lib/types/types';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { useRouter } from 'next/navigation';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { JaEllerNei } from 'lib/utils/form';

interface Props {
  meldekort: MeldekortResponse;
  referanse: string;
}

export interface MeldepliktFormFields {
  dager: Dag[];
}

interface Dag {
  dag: string;
  timer: string | null;
  harVærtPåtiltakKursEllerUtdanning?: JaEllerNei[];
  harVærtPåFerie?: JaEllerNei[];
  harVærtSyk?: JaEllerNei[];
}

export interface UtfyllingAvTimerError {
  index: number;
  harError: boolean;
}

export const Utfylling = ({ meldekort, referanse }: Props) => {
  const router = useRouter();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const [errors, setErrors] = useState<UtfyllingAvTimerError[]>([]);

  const { form } = useConfigForm<MeldepliktFormFields>({
    dager: {
      type: 'fieldArray',
      defaultValue: meldekort.meldekort.dager.map((dag) => ({
        dag: dag.dato,
        timer: dag.timerArbeidet == null || dag.timerArbeidet === 0 ? '' : dag.timerArbeidet.toString(),
        harVærtPåtiltakKursEllerUtdanning: dag.harVærtPåtiltakKursEllerUtdanning === true ? [JaEllerNei.Ja] : undefined,
        harVærtSyk: dag.harVærtSyk === true ? [JaEllerNei.Ja] : undefined,
        harVærtPåFerie: dag.harVærtPåFerie === true ? [JaEllerNei.Ja] : undefined,
      })),
    },
  });

  return (
    <FormProvider {...form}>
      <Form
        forrigeStegOnClick={() => router.push(`/${referanse}/SPØRSMÅL`)}
        nesteStegKnappTekst={'Neste'}
        onSubmit={form.handleSubmit(async (data) => {
          setErrors([]);
          const errors: UtfyllingAvTimerError[] = [];
          data.dager.map((dag, index) => {
            if (!erGyldigTimer(dag.timer)) {
              errors.push({ index: index, harError: true });
            }
          });
          setErrors(errors);

          if (errors.length === 0) {
            løsStegOgGåTilNeste({
              meldekort: {
                ...meldekort.meldekort,
                dager: data.dager.map((dag) => ({
                  dato: dag.dag,
                  timerArbeidet: dag.timer ? Number(replaceCommasWithDots(dag.timer)) : null,
                  harVærtPåtiltakKursEllerUtdanning: dag.harVærtPåtiltakKursEllerUtdanning?.includes(JaEllerNei.Ja),
                  harVærtPåFerie: dag.harVærtPåFerie?.includes(JaEllerNei.Ja),
                  harVærtSyk: dag.harVærtSyk?.includes(JaEllerNei.Ja),
                })),
              },
              nåværendeSteg: 'UTFYLLING',
            });
          }
        })}
        isLoading={isLoading}
        errorMessage={errorMessage}
      >
        <VStack gap={'4'}>
          <MeldekortLenke label={'Tilbake'} href={`/${referanse}/SPØRSMÅL`} />
          <Heading size={'large'} level={'2'}>
            Fyll ut meldekortet
          </Heading>
          <BodyLong>
            Fyll inn timene du har arbeidet i perioden. Timer skrives med desimal til nærmeste halvtime. 7 timer og 30
            min = 7,5 timer. 30 min = 0,50 timer
          </BodyLong>
          <ReadMore header={'Les mer om hva som skal fylles ut'}>Her kommer det informasjon</ReadMore>
          <Rapporteringskalender errors={errors} meldekort={meldekort} />
          {errors.length > 0 && (
            <Alert variant={'error'}>
              Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer
            </Alert>
          )}
        </VStack>
      </Form>
    </FormProvider>
  );
};

export function erGyldigTimer(value: string | null): boolean {
  if (!value || value === '') {
    return true;
  }

  const valueAsNumber = Number(replaceCommasWithDots(value));

  if (isNaN(valueAsNumber) || valueAsNumber < 0 || valueAsNumber > 24) {
    return false;
  } else return (valueAsNumber * 10) % 5 === 0;
}

export function replaceCommasWithDots(input: string): string {
  return input.replace(/,/g, '.');
}
