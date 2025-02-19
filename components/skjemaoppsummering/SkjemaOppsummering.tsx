import { DagSvar, UtfyllingResponse } from 'lib/types/types';
import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';
import { endOfWeek, format, getISOWeek, startOfWeek } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useParamsMedType } from 'lib/utils/url';

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
  const params = useParamsMedType();

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
    <VStack gap={'6'}>
      <VStack gap={'6'}>
        <VStack gap={'1'}>
          <Label>Har du vært i arbeid de siste 14 dagene?</Label>
          <BodyShort>{utfylling.tilstand.svar.harDuJobbet ? 'Ja' : 'Nei'}</BodyShort>
        </VStack>
        {visLenkeTilbakeTilSteg && (
          <MeldekortLenke label={'Endre om du har arbeidet i perioden'} href={`/${params.referanse}/SPØRSMÅL`} />
        )}
      </VStack>

      {utfylling.tilstand.svar.harDuJobbet && (
        <VStack gap={'8'}>
          {Object.entries(meldeperiodeUker).map(([ukeStart, uke]) => {
            return (
              <VStack gap={'4'} key={ukeStart}>
                <VStack gap={'2'}>
                  <BodyShort weight={'semibold'}>{`Uke ${uke.ukeNummer}`}</BodyShort>
                  <BodyShort>{`${formaterDatoForFrontend(uke.ukeStart)} - ${formaterDatoForFrontend(uke.ukeSlutt)}`}</BodyShort>
                </VStack>
                <VStack gap={'4'}>
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
              </VStack>
            );
          })}
          {visLenkeTilbakeTilSteg && (
            <MeldekortLenke label={'Endre antall timer arbeidet'} href={`/${params.referanse}/UTFYLLING`} />
          )}
        </VStack>
      )}
    </VStack>
  );
};
