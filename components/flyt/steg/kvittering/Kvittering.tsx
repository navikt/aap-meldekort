'use client';

import { Accordion, Alert, Button, List, VStack } from '@navikt/ds-react';
import { KommendeMeldekort, UtfyllingResponse } from 'lib/types/types';
import { Link, useRouter } from 'i18n/routing';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';
import { InnsendingType, useParamsMedType } from 'lib/utils/url';
import { useTranslations } from 'next-intl';
import { startInnsendingClient } from 'lib/client/clientApi';

interface Props {
  utfylling: UtfyllingResponse;
  kommendeMeldeperiode?: KommendeMeldekort;
}

export const Kvittering = ({ utfylling, kommendeMeldeperiode }: Props) => {
  const t = useTranslations();
  const { innsendingtype } = useParamsMedType();
  const router = useRouter();

  return (
    <VStack gap={'8'}>
      <Alert variant="success">
        {innsendingtype === InnsendingType.INNSENDING
          ? t('client.steg.kvittering.alert.innsending.label')
          : t('client.steg.kvittering.alert.korrigering.label')}
      </Alert>

      <List>
        <List.Item>{t('client.steg.kvittering.bulletList.items.1')}</List.Item>
        <List.Item>{t('client.steg.kvittering.bulletList.items.2')}</List.Item>
      </List>

      <Accordion>
        <Accordion.Item>
          <Accordion.Header>{t('client.steg.kvittering.seHvaDuSendteInn')}</Accordion.Header>
          <Accordion.Content>
            <SkjemaOppsummering utfylling={utfylling} />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>

      <VStack gap={'8'} align={'center'}>
        {innsendingtype === InnsendingType.INNSENDING && kommendeMeldeperiode?.nesteMeldeperiode && (
          <Button
            onClick={async () => {
              if (kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode) {
                const startInnsendingAvMeldekortResponse = await startInnsendingClient(
                  kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode
                );

                if (!startInnsendingAvMeldekortResponse?.feil && startInnsendingAvMeldekortResponse) {
                  router.push(
                    `/${InnsendingType.INNSENDING}/${startInnsendingAvMeldekortResponse.metadata?.referanse}/${startInnsendingAvMeldekortResponse.tilstand?.aktivtSteg}`
                  );
                }
              }
            }}
          >
            {t('client.steg.kvittering.nesteMeldekortKnapp')}
          </Button>
        )}

        {t.rich('client.steg.kvittering.linkTilOversikt', {
          a: (chunks) => {
            return <Link href={`/`}>{chunks}</Link>;
          },
        })}
      </VStack>
    </VStack>
  );
};
