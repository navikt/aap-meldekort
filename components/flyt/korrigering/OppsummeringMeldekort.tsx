'use client';

import { Alert, BodyShort, Button, Heading, Link, ReadMore, VStack } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { HistoriskMeldekortDetaljer } from 'lib/types/types';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';
import { OppsummeringRad } from 'components/oppsummeringrad/OppsummeringRad';
import { formaterTilNok } from 'lib/utils/string';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { regnUtTimer } from 'lib/utils/meldekort';

interface Props {
  historiskeMeldekortDetaljer: HistoriskMeldekortDetaljer[];
}

export const OppsummeringMeldekort = ({ historiskeMeldekortDetaljer }: Props) => {
  const router = useRouter();

  const kanEndres = historiskeMeldekortDetaljer.some((meldekort) => meldekort.kanEndres);

  return (
    <VStack gap={'4'}>
      <MeldekortLenke label={'Tilbake til oversikten'} href={`/innsendt`} />
      <Heading size={'medium'} level={'2'}>
        Se og endre meldekort
      </Heading>
      <VStack gap={'4'}>
        <BodyShort>
          Du kan endre tidligere innsendte meldekort X antall uker tilbake i tid. Husk at endret meldekort kan påvirke
          utbetalingen du fikk.
        </BodyShort>
        <ReadMore header={'Les mer om hvordan endre et meldekort'}>Her kommer det noe tekst</ReadMore>
        {!kanEndres && (
          <Alert variant={'info'}>
            <BodyShort spacing weight={'semibold'} size={'large'}>
              Dette meldekortet kan ikke endres
            </BodyShort>
            <BodyShort spacing>
              <Link href="https://www.nav.no/kontaktoss" target="_blank">
                Kontakt Nav (Åpnes i ny fane)
              </Link>{' '}
              om du trenger å endre dette meldekortet.
            </BodyShort>
          </Alert>
        )}

        {historiskeMeldekortDetaljer.map((historiskMeldekort, index) => {
          return (
            <OppsummeringKalender
              key={index}
              timerArbeidet={historiskMeldekort.dager}
              periode={historiskMeldekort.meldeperiode}
              kanEndres={historiskMeldekort.kanEndres}
              type={historiskMeldekort.type}
            >
              <VStack gap={'4'}>
                <OppsummeringTimer timer={regnUtTimer(historiskMeldekort?.dager)} />
                {historiskMeldekort.bruttoBeløp !== null && historiskMeldekort.bruttoBeløp !== undefined && (
                  <OppsummeringRad
                    heading={'Utbetalt for perioden'}
                    label={'Utbetalt'}
                    value={`${formaterTilNok(historiskMeldekort.bruttoBeløp)}`}
                    backgroundColor={'green'}
                  />
                )}
                {historiskMeldekort.innsendtDato && (
                  <OppsummeringRad
                    heading={historiskMeldekort.type === 'KORRIGERING' ? 'Korrigert' : 'Innsendt av innbygger'}
                    label={'Dato'}
                    value={formaterDatoForFrontend(historiskMeldekort.innsendtDato)}
                    backgroundColor={'white'}
                  />
                )}
              </VStack>
            </OppsummeringKalender>
          );
        })}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant={'secondary'}
            iconPosition={'left'}
            icon={<ArrowLeftIcon />}
            onClick={() => router.push('/innsendt')}
          >
            Tilbake
          </Button>
        </div>
      </VStack>
    </VStack>
  );
};
