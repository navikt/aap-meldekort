'use client';

import { DagerInfo, MeldekortResponse } from 'lib/types/types';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { JaEllerNei } from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { BodyShort, Heading, HStack, Label, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { endOfWeek, format, getISOWeek, startOfWeek } from 'date-fns';
import { nb } from 'date-fns/locale';
import { storForbokstav } from 'lib/utils/string';

interface Props {
  referanse: string;
  meldekort: MeldekortResponse;
}

interface FormFields {
  opplysningerStemmer: JaEllerNei[];
}

interface OppsummeringMeldeperiodeUke {
  ukeStart: Date;
  ukeSlutt: Date;
  ukeNummer: number;
  dager: DagerInfo[];
}

export const StemmerOpplysningene = ({ referanse, meldekort }: Props) => {
  const router = useRouter();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const { form, formFields } = useConfigForm<FormFields>({
    opplysningerStemmer: {
      type: 'checkbox',
      label: 'Bekreft at opplysningene stemmer',
      hideLabel: true,
      options: [{ label: 'Jeg bekrefter at disse opplysningene stemmer', value: JaEllerNei.Ja }],
      rules: { required: 'Du må bekrefte at disse opplysningene stemmer' },
    },
  });

  const fraDato = new Date(meldekort.periode.fom);
  const tilDato = new Date(meldekort.periode.tom);

  const meldeperiodeUker: Record<string, OppsummeringMeldeperiodeUke> = meldekort.meldekort.dager.reduce(
    (acc, dag) => {
      const ukeStart = format(startOfWeek(new Date(dag.dato), { weekStartsOn: 1 }), 'yyyy-MM-dd');

      if (!acc[ukeStart]) {
        const parsedUkeStart = new Date(ukeStart);
        acc[ukeStart] = {
          dager: [],
          ukeStart: parsedUkeStart,
          ukeSlutt: endOfWeek(parsedUkeStart, { weekStartsOn: 1 }),
          ukeNummer: getISOWeek(parsedUkeStart),
        };
      }

      acc[ukeStart].dager.push({ ...dag });

      return acc;
    },
    {} as Record<string, OppsummeringMeldeperiodeUke>
  );

  return (
    <Form
      forrigeStegOnClick={() =>
        router.push(`/${referanse}/${meldekort.meldekort.harDuJobbet ? 'UTFYLLING' : 'SPØRSMÅL'}`)
      }
      nesteStegKnappTekst={'Send inn'}
      onSubmit={form.handleSubmit(async () => {
        løsStegOgGåTilNeste({
          meldekort: {
            ...meldekort.meldekort,
            stemmerOpplysningene: true,
          },
          nåværendeSteg: 'STEMMER_OPPLYSNINGENE',
        });
      })}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <VStack gap={'6'}>
        <MeldekortLenke
          label={'Tilbake'}
          href={`/${referanse}/${meldekort.meldekort.harDuJobbet ? 'UTFYLLING' : 'SPØRSMÅL'}`}
        />
        <Heading size={'large'} level={'2'} spacing>
          Se over og send inn meldekort
        </Heading>

        <BodyShort spacing>
          Se over opplysningene på meldekortet ditt og pass på at alt er riktig før du sender inn.
        </BodyShort>

        <VStack gap={'2'}>
          <BodyShort weight={'semibold'}>{`Uke ${hentUkeNummerForPeriode(fraDato, tilDato)}`}</BodyShort>
          <BodyShort>{`${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)}`}</BodyShort>
        </VStack>

        <VStack gap={'6'}>
          <VStack gap={'1'}>
            <Label>Har du vært i arbeid de siste 14 dagene?</Label>
            <BodyShort>{meldekort.meldekort.harDuJobbet ? 'Ja' : 'Nei'}</BodyShort>
          </VStack>
          <MeldekortLenke label={'Endre om du har arbeidet i perioden'} href={`/${referanse}/SPØRSMÅL`} />
        </VStack>

        {meldekort.meldekort.harDuJobbet && (
          <VStack gap={'8'}>
            {Object.entries(meldeperiodeUker).map(([ukeStart, uke]) => {
              return (
                <VStack gap={'4'} key={ukeStart}>
                  <VStack gap={'2'}>
                    <BodyShort weight={'semibold'}>{`Uke ${uke.ukeNummer}`}</BodyShort>
                    <BodyShort>{`${formaterDatoForFrontend(uke.ukeStart)} - ${formaterDatoForFrontend(uke.ukeSlutt)}`}</BodyShort>
                  </VStack>
                  <VStack gap={'2'}>
                    {uke.dager
                      .filter((dag) => dag.timerArbeidet)
                      .map((dag) => {
                        return (
                          <HStack gap={'2'} key={dag.dato}>
                            <BodyShort weight={'semibold'}>
                              {storForbokstav(format(new Date(dag.dato), 'EEEE', { locale: nb }))}:
                            </BodyShort>
                            <BodyShort>{`Arbeid ${dag.timerArbeidet} timer`}</BodyShort>
                          </HStack>
                        );
                      })}
                  </VStack>
                </VStack>
              );
            })}
            <MeldekortLenke label={'Endre antall timer arbeidet'} href={`/${referanse}/UTFYLLING`} />
          </VStack>
        )}

        <FormField form={form} formField={formFields.opplysningerStemmer} size={'medium'} />
      </VStack>
    </Form>
  );
};
