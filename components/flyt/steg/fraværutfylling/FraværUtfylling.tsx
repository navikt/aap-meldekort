'use client';

import { BodyShort, Button, Heading, InfoCard, VStack } from '@navikt/ds-react';
import { RegistrerFraværDialog } from 'components/flyt/steg/fraværutfylling/RegistrerFraværDialog';
import { Form } from 'components/form/Form';
import { DagSvar, Fravær, UtfyllingResponse } from 'lib/types/types';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode, sorterEtterEldsteDatoDate } from 'lib/utils/date';
import { useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { useGåTilSteg, useParamsMedType } from 'lib/utils/url';
import { FormEvent, useMemo, useState } from 'react';
import { isSameDay } from 'date-fns';
import { RegistrertFravær } from 'components/registrertfravær/RegistrertFravær';
import { useMellomlagring } from 'hooks/mellomlagreMeldekortHook';
import { InformationSquareIcon } from '@navikt/aksel-icons';

interface Props {
  utfylling: UtfyllingResponse;
}

export interface FraværDag {
  dato: Date;
  fravær: NonNullable<Fravær>;
}

export interface FraværFormFields {
  dager: FraværDag[];
}

function finnTimerForDag(dager: DagSvar[], dato: Date) {
  return dager.find((dag) => isSameDay(dag.dato, dato))?.timerArbeidet || null;
}

export const FraværUtfylling = ({ utfylling }: Props) => {
  const [visDialog, setVisDialog] = useState(false);

  const { referanse } = useParamsMedType();
  const { gåTilSteg } = useGåTilSteg();
  const { sistLagret } = useMellomlagring();
  const t = useTranslations();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const form = useForm<FraværFormFields>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'dager',
  });

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  const dagerMedFraværOgRegistrertArbeid = fields
    .filter((field) =>
      utfylling.tilstand.svar.dager.some(
        (dag) => isSameDay(dag.dato, field.dato) && dag.timerArbeidet && dag.timerArbeidet > 0
      )
    )
    .map((dag) => dag.dato);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    form.handleSubmit((data) => {
      const dagerMedFravær: DagSvar[] = utfylling.tilstand.svar.dager.map((utfyllingDag) => {
        const fravær: Fravær = data.dager.find((dag) => {
          return isSameDay(dag.dato, new Date(utfyllingDag.dato));
        })?.fravær;

        return {
          dato: utfyllingDag.dato,
          timerArbeidet: utfyllingDag.timerArbeidet,
          fravær: fravær,
        };
      });

      løsStegOgGåTilNeste({
        nyTilstand: {
          aktivtSteg: 'FRAVÆR_UTFYLLING',
          svar: {
            ...utfylling.tilstand.svar,
            dager: dagerMedFravær,
          },
        },
      });
    })(event);
  }

  const sorterteFelter = useMemo(() => {
    return [...fields].sort((a, b) => sorterEtterEldsteDatoDate(a.dato, b.dato));
  }, [fields]);

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
        forrigeStegOnClick={() => gåTilSteg('SPØRSMÅL')}
        sistLagret={sistLagret}
      >
        <VStack gap={'space-32'}>
          <VStack gap={'space-16'}>
            <VStack gap={'space-8'}>
              <Heading level={'2'} size={'large'}>
                {t('client.steg.fraværutfylling.heading')}
              </Heading>
              <BodyShort>
                {t('client.steg.fraværutfylling.periode', {
                  uker: hentUkeNummerForPeriode(fraDato, tilDato),
                  periode: `${formaterDatoMedÅrForFrontend(fraDato)} - ${formaterDatoMedÅrForFrontend(tilDato)}`,
                })}
              </BodyShort>
            </VStack>

            <BodyShort>{t('client.steg.fraværutfylling.description')}</BodyShort>
          </VStack>

          <Heading size="medium" level={'3'}>
            Dager du var borte
          </Heading>
          <VStack gap={'space-16'}>
            {sorterteFelter.map((felt) => {
              // Ettersom vi sorterer feltene så må vi utlede index fra fields
              const index = fields.findIndex((field) => field.id === felt.id);

              return (
                <RegistrertFravær
                  key={felt.id}
                  felt={felt}
                  slettFravær={() => remove(index)}
                  timerArbeidet={finnTimerForDag(utfylling.tilstand.svar.dager, felt.dato)}
                />
              );
            })}
          </VStack>
        </VStack>
        <div>
          <Button onClick={() => setVisDialog(true)} variant={'secondary'} type={'button'}>
            Legg til dag
          </Button>
        </div>
        {dagerMedFraværOgRegistrertArbeid.length > 0 && (
          <InfoCard>
            <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
              <InfoCard.Title>Du har registrert fravær på samme dato som du har ført timer</InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>
              <ul>
                {dagerMedFraværOgRegistrertArbeid.map((dag) => (
                  <li key={dag.getTime()}>{formaterDatoMedÅrForFrontend(dag)}</li>
                ))}
              </ul>
            </InfoCard.Content>
          </InfoCard>
        )}
      </Form>

      <RegistrerFraværDialog
        utfylling={utfylling}
        visDialog={visDialog}
        setVisDialog={setVisDialog}
        leggTilFravær={append}
      />
    </>
  );
};
