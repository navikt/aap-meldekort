'use client';

import { Alert, BodyShort, Button, Heading, Link, ReadMore, VStack } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { HistoriskMeldekortDetaljer } from 'lib/types/types';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';

interface Props {
  historiskeMeldekortDetaljer: HistoriskMeldekortDetaljer[];
}

export const OppsummeringMeldekort = ({ historiskeMeldekortDetaljer }: Props) => {
  const router = useRouter();

  const kanEndres = historiskeMeldekortDetaljer.some((meldekort) => meldekort.kanEndres);

  return (
    <VStack gap={'4'}>
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
              timerArbeidet={historiskMeldekort.timerArbeidet}
              periode={historiskMeldekort.meldeperiode}
              utbetalt={historiskMeldekort.bruttoBeløp}
              innsendtDato={historiskMeldekort.innsendtDato}
              kanEndres={historiskMeldekort.kanEndres}
            />
          );
        })}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant={'secondary'}
            iconPosition={'left'}
            icon={<ArrowLeftIcon />}
            onClick={() => router.push('/arena/innsendt')}
          >
            Tilbake
          </Button>
        </div>
      </VStack>
    </VStack>
  );
};
