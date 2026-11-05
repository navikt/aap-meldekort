'use client';

import { KommendeMeldekort, Visning } from 'lib/types/types';
import { Alert, BodyShort, Box, Heading, LinkCard, VStack } from '@navikt/ds-react';
import { NavigationPanel } from 'components/navigationpanel/NavigationPanel';
import { useTranslations } from 'next-intl';
import { startInnsendingClient } from 'lib/client/clientApi';
import { useRouter } from 'i18n/routing';
import { formaterDatoMedMånedIBokstaver, formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { ChevronRightIcon, FileTextIcon, PencilIcon, TasklistIcon } from '@navikt/aksel-icons';
import { InnsendingType } from 'lib/utils/url';
import { useSkjermBredde } from 'hooks/skjermbreddeHook';
import { useMemo } from 'react';
import { isSuccess } from 'lib/utils/api';
import { isProduction } from 'lib/utils/environments';

interface Props {
  kommendeMeldeperiode?: KommendeMeldekort;
  harInnsendteMeldeperioder: boolean;
  visning?: Visning;
}

export const Oversikt = ({ kommendeMeldeperiode, harInnsendteMeldeperioder, visning }: Props) => {
  const t = useTranslations();
  const router = useRouter();

  const { erLitenSkjerm } = useSkjermBredde();

  async function startInnsending() {
    if (kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode) {
      const response = await startInnsendingClient(kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode);

      if (isSuccess(response)) {
        router.push(
          `/${InnsendingType.INNSENDING}/${response.data.metadata?.referanse}/${response.data.tilstand?.aktivtSteg}`
        );
      }
    }
  }

  const title =
    !kommendeMeldeperiode?.manglerOpplysninger && kommendeMeldeperiode?.nesteMeldeperiode
      ? t('client.oversikt.sendMeldekort.klarTilUtfylling', {
          periode: hentUkeNummerForPeriode(
            new Date(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.fom),
            new Date(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.tom)
          ),
        })
      : t('client.oversikt.sendMeldekort.antallKlareMeldekort', {
          antallMeldekort: kommendeMeldeperiode?.antallUbesvarteMeldeperioder ?? 0,
        });

  const description = useMemo(() => {
    if (kommendeMeldeperiode?.manglerOpplysninger) {
      return `${formaterDatoMedÅrForFrontend(kommendeMeldeperiode.manglerOpplysninger.fom)} - ${formaterDatoMedÅrForFrontend(kommendeMeldeperiode.manglerOpplysninger.tom)}`;
    } else {
      return `${formaterDatoMedÅrForFrontend(kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode.fom)} - ${formaterDatoMedÅrForFrontend(kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode.tom)}`;
    }
  }, [kommendeMeldeperiode]);

  const fellesMeldekortLenke = () => {
    if (!isProduction()) {
      return 'https://meldekort-frontend-q2.intern.dev.nav.no/felles-meldekort';
    } else {
      return 'https://www.nav.no/felles-meldekort';
    }
  };

  return (
    <VStack gap={'space-32'}>
      <BodyShort spacing>{t('client.oversikt.mottaAAP')}</BodyShort>

      {visning?.type === 'BEGGE' && (
        <LinkCard>
          <Box asChild>
            <LinkCard.Icon>
              <FileTextIcon title="a11y-title" fontSize="1.5rem" />
            </LinkCard.Icon>
          </Box>
          <LinkCard.Title>
            <LinkCard.Anchor href={fellesMeldekortLenke()}>
              Meldekort sak {visning.felles.saksnummer} fra{' '}
              {formaterDatoMedÅrForFrontend(visning.felles.rettighetsperiode?.fom)} til{' '}
              {formaterDatoMedÅrForFrontend(visning.felles.rettighetsperiode?.tom)}
            </LinkCard.Anchor>
          </LinkCard.Title>
        </LinkCard>
      )}

      <VStack gap={'space-16'}>
        <Heading level={'2'} size={'medium'}>
          {t('client.oversikt.sendMeldekort.heading')}
        </Heading>
        {kommendeMeldeperiode?.nesteMeldeperiode ? (
          <>
            <NavigationPanel
              type={'button'}
              title={title}
              description={description}
              rightIcon={<ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />}
              leftIcon={erLitenSkjerm ? undefined : <TasklistIcon fontSize={'2rem'} />}
              onClick={startInnsending}
            />

            {kommendeMeldeperiode.antallUbesvarteMeldeperioder === 0 && kommendeMeldeperiode.nesteMeldeperiode && (
              <Alert variant={'info'}>
                {t('client.oversikt.infoAlert', {
                  dato: formaterDatoMedMånedIBokstaver(kommendeMeldeperiode.nesteMeldeperiode.innsendingsvindu.fom),
                })}
              </Alert>
            )}
          </>
        ) : (
          <BodyShort spacing>{t('client.oversikt.sendMeldekort.ingenMeldekort')}</BodyShort>
        )}
      </VStack>

      {harInnsendteMeldeperioder && (
        <VStack gap={'space-16'}>
          <Heading level={'2'} size={'medium'}>
            {t('client.oversikt.innsendteMeldekort.heading')}
          </Heading>
          <NavigationPanel
            type={'link'}
            title={t('client.oversikt.innsendteMeldekort.title')}
            href={`/innsendt`}
            leftIcon={erLitenSkjerm ? undefined : <PencilIcon fontSize={'2rem'} />}
            rightIcon={<ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />}
          />
        </VStack>
      )}
    </VStack>
  );
};
