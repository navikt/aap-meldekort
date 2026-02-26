'use client';

import { BodyShort, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { RegistrerFraværDialog } from 'components/flyt/steg/fraværutfylling/RegistrerFraværDialog';
import { Form } from 'components/form/Form';
import { DagSvar, Fravær, UtfyllingResponse } from 'lib/types/types';
import {
  formaterDatoMedMånedIBokstaverOgÅr,
  formaterDatoMedÅrForFrontend,
  fullDag,
  hentUkeNummerForPeriode,
} from 'lib/utils/date';
import { useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { useGåTilSteg, useParamsMedType } from 'lib/utils/url';
import { FormEvent, useState } from 'react';
import { isSameDay } from 'date-fns';

import styles from './FraværUtfyllings.module.css';
import { storForbokstav } from 'lib/utils/string';

interface Props {
  utfylling: UtfyllingResponse;
}

interface Dag {
  dato: Date;
  fravær: Fravær;
}

export interface FraværFormFields {
  dager: Dag[];
}

export const FraværUtfylling = ({ utfylling }: Props) => {
  const { referanse } = useParamsMedType();
  const [visDialog, setVisDialog] = useState(false);
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const { gåTilSteg } = useGåTilSteg();

  const t = useTranslations();

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);
  console.log(utfylling);
  const form = useForm<FraværFormFields>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'dager',
  });

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

      console.log('dagerMedFravær', dagerMedFravær);

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

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
        forrigeStegOnClick={() => gåTilSteg('SPØRSMÅL')}
      >
        <VStack gap={'space-32'}>
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
            <BodyShort>{t('client.steg.fraværutfylling.description')}</BodyShort>
          </VStack>
          <VStack gap={'space-32'}>
            <Heading size="medium" level={'3'}>
              Dager du var borte
            </Heading>
            {fields.map((felt, index) => (
              <HStack justify={'space-between'} align={'center'} key={felt.id} className={styles.fravær}>
                <VStack gap={'space-8'}>
                  <BodyShort
                    weight={'semibold'}
                  >{`${storForbokstav(fullDag(felt.dato))} ${formaterDatoMedMånedIBokstaverOgÅr(felt.dato)}`}</BodyShort>
                  <BodyShort>{felt.fravær}</BodyShort>
                </VStack>

                <Button onClick={() => remove(index)} type={'button'} variant={'tertiary'}>
                  Fjern
                </Button>
              </HStack>
            ))}
          </VStack>
        </VStack>
        <div>
          <Button onClick={() => setVisDialog(true)} variant={'secondary'} type={'button'}>
            Legg til dag
          </Button>
        </div>
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
