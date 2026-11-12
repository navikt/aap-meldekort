'use client';

import { Alert, BodyShort, Heading, Link, List, VStack } from '@navikt/ds-react';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import {
  formaterDatoMedDagOgMånedIBokstaver,
  formaterDatoMedMånedIBokstaver,
  formaterDatoMedÅrForFrontend,
  hentUkeNummerForPeriode,
} from 'lib/utils/date';
import { UtfyllingResponse } from 'lib/types/types';
import { useTranslations } from 'next-intl';
import { Form } from 'components/form/Form';
import { InnsendingType, useParamsMedType } from 'lib/utils/url';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { Opplysningsinformasjon } from 'components/Opplysningsinformasjon/Opplysningsinformasjon';
import { useFeatureFlag } from 'context/UnleashContext';
import { addDays, isBefore, parseISO } from 'date-fns';

interface Props {
  utfylling: UtfyllingResponse;
}

export const Introduksjon = ({ utfylling }: Props) => {
  const t = useTranslations();
  const visJuletekst = useFeatureFlag('InformerOmTidligMeldedag16Des26IMeldekortflaten');
  const { innsendingtype, referanse } = useParamsMedType();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  /**
   * Justering av helligdagsunntak gjøres i aap-meldekort-backend
   *
   * Når Helligdagunntak.kt i backend oppdateres med nye meldedagunntak vil
   * utfylling.tidligsteInnsendingstidspunkt bli justert til unntaket
   *
   * Det samme vil skje i påsken, så her kan det generaliseres til erTidligVarselAktuelt() og benytte samme logikk,
   * men dropper aktuellMånde-sjekk. Noen er tekstene nevner jul, men det burde antagelig også generaliseres.
   * Slik at alle tidligere utbetalinger kan legges til i back-end og vi minimerer manuelle tilpasninger i frontend.
   */
  function erJulevarselAktuelt(tidligsteInnsendingstidspunkt: string, periodeTom: string) {
    const tidligsteInnsendingsdag = parseISO(tidligsteInnsendingstidspunkt);
    const normalInnsendingsdag = addDays(parseISO(periodeTom), 1);
    const aktuellMåned = tidligsteInnsendingsdag.getMonth();
    const erNovemberEllerDesember = aktuellMåned === 10 || aktuellMåned === 11;

    return visJuletekst && erNovemberEllerDesember && isBefore(tidligsteInnsendingsdag, normalInnsendingsdag);
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();

        løsStegOgGåTilNeste({
          nyTilstand: {
            aktivtSteg: 'INTRODUKSJON',
            svar: {
              ...utfylling.tilstand.svar,
              vilSvareRiktig: true,
            },
          },
        });
      }}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <VStack gap={'space-32'}>
        <MeldekortLenke label={t('client.steg.introduksjon.link')} href={'/'} />
        {innsendingtype === InnsendingType.INNSENDING && utfylling.metadata.antallUbesvarteMeldeperioder > 0 && (
          <Alert variant={'info'}>
            {t('client.steg.introduksjon.flereMeldekortAlert', {
              antallMeldekort: utfylling.metadata.antallUbesvarteMeldeperioder,
            })}
          </Alert>
        )}
        <VStack gap={'space-16'}>
          <VStack gap={'space-8'}>
            <Heading level={'2'} size={'large'}>
              {t('client.steg.introduksjon.heading', {
                uker: hentUkeNummerForPeriode(fraDato, tilDato),
              })}
            </Heading>

            <BodyShort
              size={'large'}
            >{`${formaterDatoMedÅrForFrontend(fraDato)} - ${formaterDatoMedÅrForFrontend(tilDato)}`}</BodyShort>
          </VStack>
          <List size={'medium'}>
            {innsendingtype === InnsendingType.INNSENDING &&
              utfylling.metadata.fristForInnsending &&
              utfylling.metadata.tidligsteInnsendingstidspunkt &&
              (erJulevarselAktuelt(utfylling.metadata.tidligsteInnsendingstidspunkt, utfylling.metadata.periode.tom) ? (
                <>
                  <List.Item>{t('client.steg.introduksjon.bulletListJulen.item.1')}</List.Item>
                  <List.Item>
                    {t('client.steg.introduksjon.bulletListJulen.item.2', {
                      tidligsteDato: formaterDatoMedMånedIBokstaver(utfylling.metadata.tidligsteInnsendingstidspunkt),
                      periodeTomDato: formaterDatoMedMånedIBokstaver(utfylling.metadata.periode.tom),
                    })}
                  </List.Item>
                  <List.Item>
                    {t('client.steg.introduksjon.bulletListJulen.item.3', {
                      tidligsteDato: formaterDatoMedDagOgMånedIBokstaver(
                        utfylling.metadata.tidligsteInnsendingstidspunkt
                      ),
                      senesteDato: formaterDatoMedMånedIBokstaver(utfylling.metadata.fristForInnsending),
                    })}
                  </List.Item>
                </>
              ) : (
                <>
                  <List.Item>
                    {t('client.steg.introduksjon.bulletList.item.1', {
                      tidligsteDato: formaterDatoMedMånedIBokstaver(
                        new Date(utfylling.metadata.tidligsteInnsendingstidspunkt)
                      ),
                      senesteDato: formaterDatoMedMånedIBokstaver(new Date(utfylling.metadata.fristForInnsending)),
                    })}
                  </List.Item>
                  {utfylling.metadata.harBrukerVedtakIKelvin && (
                    <List.Item>{t('client.steg.introduksjon.bulletList.item.2')}</List.Item>
                  )}
                </>
              ))}
          </List>
        </VStack>

        <Opplysningsinformasjon />

        <VStack gap={'space-8'}>
          <BodyShort weight={'semibold'}>
            {t('client.steg.introduksjon.informasjonOmRiktigeOpplysninger.heading')}
          </BodyShort>
          {t.rich('client.steg.introduksjon.informasjonOmRiktigeOpplysninger.link', {
            a: (chunks) => (
              <Link href={'https://www.nav.no/endringer'} target="_blank">
                {chunks}
              </Link>
            ),
          })}
        </VStack>
      </VStack>
    </Form>
  );
};
