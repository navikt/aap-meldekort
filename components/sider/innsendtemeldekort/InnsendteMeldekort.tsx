'use client';

import { Alert, BodyLong, Heading, LinkCard, VStack } from '@navikt/ds-react';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { HistoriskMeldeperiode } from 'lib/types/types';
import { startKorrigeringClient } from 'lib/client/clientApi';
import { useRouter } from 'i18n/routing';
import { InnsendingType } from 'lib/utils/url';
import { useTranslations } from 'next-intl';

interface Props {
  innsendteMeldeperioder: HistoriskMeldeperiode[];
}

export const InnsendteMeldekort = ({ innsendteMeldeperioder }: Props) => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <VStack gap={'space-32'}>
      <MeldekortLenke label={t('client.link.gåTilOversikten')} href={`/`} />
      <VStack gap={'space-16'}>
        <Heading size={'large'} level={'2'}>
          {t('client.innsendteMeldekort.heading')}
        </Heading>
        <BodyLong>{t('client.innsendteMeldekort.info')}</BodyLong>
      </VStack>

      <VStack gap={'space-16'}>
        {innsendteMeldeperioder.length > 0 ? (
          <>
            {innsendteMeldeperioder.map((innsendtMeldekort, key) => {
              return (
                <LinkCard
                  key={key}
                  onClick={async () => {
                    const startInnsendingAvMeldekortResponse = await startKorrigeringClient(
                      innsendtMeldekort.meldeperiode
                    );

                    if (!startInnsendingAvMeldekortResponse?.feil && startInnsendingAvMeldekortResponse) {
                      router.push(
                        `/${InnsendingType.KORRIGERING}/${startInnsendingAvMeldekortResponse.metadata?.referanse}/${startInnsendingAvMeldekortResponse.tilstand?.aktivtSteg}`
                      );
                    }
                  }}
                >
                  <LinkCard.Title>
                    {t('client.innsendteMeldekort.innsendtMeldekort.title', {
                      uker: hentUkeNummerForPeriode(
                        new Date(innsendtMeldekort.meldeperiode.fom),
                        new Date(innsendtMeldekort.meldeperiode.tom)
                      ),
                    })}
                  </LinkCard.Title>
                  <LinkCard.Description>
                    {`${formaterDatoMedÅrForFrontend(innsendtMeldekort.meldeperiode.fom)} - ${formaterDatoMedÅrForFrontend(innsendtMeldekort.meldeperiode.tom)}`}
                  </LinkCard.Description>
                  <LinkCard.Footer>
                    {t('client.innsendteMeldekort.innsendtMeldekort.description', {
                      timer: innsendtMeldekort.antallTimerArbeidetIPerioden,
                    })}
                  </LinkCard.Footer>
                </LinkCard>
              );
            })}
          </>
        ) : (
          <Alert variant={'info'}>{t('client.innsendteMeldekort.ingenInnsendteMeldekort')}</Alert>
        )}
      </VStack>
    </VStack>
  );
};
