import { DagSvar, UtfyllingResponse } from 'lib/types/types';
import { BodyShort, FormSummary, HStack } from '@navikt/ds-react';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { endOfWeek, format, getISOWeek, startOfWeek } from 'date-fns';
import { useGåTilSteg } from 'lib/utils/url';
import { formaterDatoForFrontend, hentUkeNummerForDato } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';
import { nb } from 'date-fns/locale';
import { regnUtTimer } from 'lib/utils/meldekort';

interface Props {
  utfylling: UtfyllingResponse;
  visLenkeTilbakeTilSteg?: boolean;
}

interface OppsummeringMeldeperiodeUke {
  ukeStart: Date;
  ukeSlutt: Date;
  ukeNummer: number;
  dager: DagSvar[];
}

export const SkjemaOppsummering = ({ utfylling, visLenkeTilbakeTilSteg = false }: Props) => {
  const { hentUrlForSteg } = useGåTilSteg();

  const meldeperiodeUker: Record<string, OppsummeringMeldeperiodeUke> = utfylling.tilstand.svar.dager.reduce(
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
    <FormSummary>
      <FormSummary.Header>
        <FormSummary.Heading level={'3'}>Oppsummering</FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            <HStack justify={'space-between'}>
              <BodyShort weight={'semibold'}>Har du arbeidet i perioden?</BodyShort>
              {visLenkeTilbakeTilSteg && (
                <MeldekortLenke label={'Endre'} href={hentUrlForSteg('SPØRSMÅL')} visIcon={false} />
              )}
            </HStack>
          </FormSummary.Label>
          <FormSummary.Value>{utfylling.tilstand.svar.harDuJobbet ? 'Ja' : 'Nei'}</FormSummary.Value>
        </FormSummary.Answer>

        {utfylling.tilstand.svar.harDuJobbet && (
          <FormSummary.Answer>
            <FormSummary.Label>
              <HStack justify={'space-between'}>
                <BodyShort weight={'semibold'}>Antall timer arbeidet</BodyShort>
                {visLenkeTilbakeTilSteg && (
                  <MeldekortLenke label={'Endre'} href={hentUrlForSteg('UTFYLLING')} visIcon={false} />
                )}
              </HStack>
            </FormSummary.Label>
            <FormSummary.Value>
              <FormSummary.Answers>
                {Object.entries(meldeperiodeUker).map(([, uke], index) => {
                  return (
                    <FormSummary.Answer key={index}>
                      <FormSummary.Label>{`Uke ${hentUkeNummerForDato(uke.ukeStart)} (${formaterDatoForFrontend(uke.ukeStart)} - ${formaterDatoForFrontend(uke.ukeSlutt)})`}</FormSummary.Label>
                      <FormSummary.Value>
                        {uke.dager
                          .filter((dag) => dag.timerArbeidet)
                          .map((dag) => {
                            return (
                              <HStack gap={'2'} key={dag.dato}>
                                <BodyShort>
                                  {storForbokstav(format(new Date(dag.dato), 'EEEE', { locale: nb }))}:
                                </BodyShort>
                                <BodyShort>{`${dag.timerArbeidet} timer`}</BodyShort>
                              </HStack>
                            );
                          })}
                      </FormSummary.Value>
                    </FormSummary.Answer>
                  );
                })}
                <FormSummary.Answer>
                  <FormSummary.Label>Sammenlagt for perioden</FormSummary.Label>
                  <FormSummary.Value>{`${regnUtTimer(Object.values(meldeperiodeUker).flatMap((uke) => uke.dager))} timer arbeidet`}</FormSummary.Value>
                </FormSummary.Answer>
              </FormSummary.Answers>
            </FormSummary.Value>
          </FormSummary.Answer>
        )}
      </FormSummary.Answers>
    </FormSummary>
  );
};
