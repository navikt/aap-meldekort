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
          <VStack gap={'1'}>
            <Label>Har du deltatt på tiltak eller kurs/utdanning de siste 14 dagene?</Label>
            <BodyShort>
              {meldekort.meldekort.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning ? 'Ja' : 'Nei'}
            </BodyShort>
          </VStack>
          <VStack gap={'1'}>
            <Label>
              Har du vært forhindret fra å ta arbeid, delta på tiltak eller være arbeidssøker fordi du har vært for syk
              de siste 14 dagene?
            </Label>
            <BodyShort>{meldekort.meldekort.harDuVærtSyk ? 'Ja' : 'Nei'}</BodyShort>
          </VStack>
          <VStack gap={'1'}>
            <Label>
              Har du hatt ferie eller fravær slik at du ikke har kunnet ta arbeid, delta på tiltak eller være
              arbeidssøker de siste 14 dagene?
            </Label>
            <BodyShort>{meldekort.meldekort.harDuHattFerie ? 'Ja' : 'Nei'}</BodyShort>
          </VStack>
          <MeldekortLenke label={'Endre svar på spørsmålene'} href={`/${referanse}/SPØRSMÅL`} />
        </VStack>

        <VStack gap={'8'}>
          {Object.entries(meldeperiodeUker).map(([ukeStart, uke]) => {
            return (
              <VStack gap={'4'} key={ukeStart}>
                <VStack gap={'2'}>
                  <BodyShort weight={'semibold'}>{`Uke ${uke.ukeNummer}`}</BodyShort>
                  <BodyShort>{`${formaterDatoForFrontend(uke.ukeStart)} - ${formaterDatoForFrontend(uke.ukeSlutt)}`}</BodyShort>
                </VStack>
                <div>
                  {uke.dager
                    .filter(
                      (dag) =>
                        dag.harVærtSyk ||
                        dag.harVærtPåFerie ||
                        dag.harVærtPåtiltakKursEllerUtdanning ||
                        dag.timerArbeidet
                    )
                    .map((dag) => {
                      return (
                        <HStack gap={'2'} key={dag.dato}>
                          <BodyShort weight={'semibold'}>{formaterDatoForFrontend(dag.dato)}:</BodyShort>
                          <BodyShort>{hentUtfyllingSomString(dag)}</BodyShort>
                        </HStack>
                      );
                    })}
                </div>
              </VStack>
            );
          })}
          <MeldekortLenke label={'Endre utfylling'} href={`/${referanse}/UTFYLLING`} />
        </VStack>

        <FormField form={form} formField={formFields.opplysningerStemmer} size={'medium'} />
      </VStack>
    </Form>
  );
};

function hentUtfyllingSomString(dagInfo: DagerInfo): string {
  const timerArbeidet = dagInfo.timerArbeidet ? `Arbeid ${dagInfo.timerArbeidet}` : undefined;
  const harVærtSyk = dagInfo.harVærtSyk ? 'Syk' : undefined;
  const harVærtPåTiltakKurkEllerUtdanning = dagInfo.harVærtPåtiltakKursEllerUtdanning
    ? 'Tiltak/Kurs/Utdanning'
    : undefined;
  const harVærtPåFerie = dagInfo.harVærtPåFerie ? 'Ferie' : undefined;

  return [timerArbeidet, harVærtSyk, harVærtPåTiltakKurkEllerUtdanning, harVærtPåFerie].filter(Boolean).join(', ');
}
