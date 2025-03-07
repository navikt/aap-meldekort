import { DagSvar, UtfyllingResponse } from 'lib/types/types';
import { BodyShort, FormSummary, HStack } from '@navikt/ds-react';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { endOfWeek, format, getISOWeek, startOfWeek } from 'date-fns';
import { useGåTilSteg } from 'lib/utils/url';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForDato } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';
import { nb } from 'date-fns/locale';
import { regnUtTimer } from 'lib/utils/meldekort';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations();
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
        <FormSummary.Heading level={'3'}>{t('client.steg.bekreft.oppsummering.heading')}</FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            <HStack justify={'space-between'}>
              <BodyShort weight={'semibold'}>
                {t('client.steg.bekreft.oppsummering.harDuArbeidet.label')}
              </BodyShort>
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
                <BodyShort weight={'semibold'}>
                  {t('client.steg.bekreft.oppsummering.antallTimerArbeidet.label')}
                </BodyShort>
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
                      <FormSummary.Label>
                        {t('client.steg.bekreft.oppsummering.antallTimerArbeidet.periodeLabel', {
                          ukenummer: hentUkeNummerForDato(uke.ukeStart),
                          periode: `${formaterDatoMedÅrForFrontend(uke.ukeStart)} - ${formaterDatoMedÅrForFrontend(uke.ukeSlutt)}`,
                        })}
                      </FormSummary.Label>

                      <FormSummary.Value>
                        {uke.dager
                          .filter((dag) => dag.timerArbeidet)
                          .map((dag) => {
                            return (
                              <HStack gap={'2'} key={dag.dato}>
                                <BodyShort>
                                  {storForbokstav(format(new Date(dag.dato), 'EEEE', { locale: nb }))}:
                                </BodyShort>
                                <BodyShort>
                                  {t('client.steg.bekreft.oppsummering.antallTimerArbeidet.timerArbeidet', {
                                    timer: dag.timerArbeidet,
                                  })}
                                </BodyShort>
                              </HStack>
                            );
                          })}
                      </FormSummary.Value>
                    </FormSummary.Answer>
                  );
                })}
                <FormSummary.Answer>
                  <FormSummary.Label>
                    {t('client.steg.bekreft.oppsummering.antallTimerArbeidet.sammenlagt')}
                  </FormSummary.Label>
                  <FormSummary.Value>
                    {t('client.steg.bekreft.oppsummering.antallTimerArbeidet.timerArbeidet', {
                      timer: regnUtTimer(Object.values(meldeperiodeUker).flatMap((uke) => uke.dager)),
                    })}
                  </FormSummary.Value>
                </FormSummary.Answer>
              </FormSummary.Answers>
            </FormSummary.Value>
          </FormSummary.Answer>
        )}
      </FormSummary.Answers>
    </FormSummary>
  );
};
