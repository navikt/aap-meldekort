'use client';

import { MeldeperiodeUke } from 'components/rapporteringskalender/Rapporteringskalender';
import { eachDayOfInterval, format } from 'date-fns';

import { Alert, BodyShort, Detail, Heading, VStack } from '@navikt/ds-react';
import { storForbokstav } from 'lib/utils/string';

import styles from 'components/rapporteringskalender/ukerapportering/UkeRapportering.module.css';

import { erGyldigTimer, MeldepliktFormFields } from 'components/flyt/steg/utfylling/Utfylling';
import { useFormContext } from 'react-hook-form';
import { useSkjermBredde } from 'hooks/skjermbreddeHook';
import { TextFieldWrapper } from 'components/textfieldwrapper/TextFieldWrapper';
import { XMarkOctagonFillIcon } from '@navikt/aksel-icons';

interface Props {
  felterIUken: MeldeperiodeUke;
}

export const UkeRapportering = ({ felterIUken }: Props) => {
  const form = useFormContext<MeldepliktFormFields>();
  const { erLitenSkjerm } = useSkjermBredde();

  const alleDagerIUken = eachDayOfInterval({
    start: new Date(felterIUken.ukeStart),
    end: new Date(felterIUken.ukeSlutt),
  });

  const felterMap = new Map(felterIUken.felter.map((field) => [field.dag, field]));

  const ukeUtfyllingErrors =
    form.formState.errors?.dager && Array.isArray(form.formState.errors.dager)
      ? form.formState.errors.dager
          .filter((dag) => dag?.timer)
          .map((dag) => ({
            ref: dag.timer.ref.name,
            message: dag.timer.message,
          }))
          .filter((error) => {
            // Henter ut index fra ref (dager.3.timer)
            const index = parseInt(error.ref.split('.')[1]);
            return Array.from(felterMap.values()).some((field) => field.index === index);
          })
      : [];

  const ukeUtfyllingErrorMeldinger = Array.from(new Set(ukeUtfyllingErrors.map((error) => error.message)));

  return (
    <div className={styles.rad}>
      <div className={styles.heading}>
        <Heading size={'medium'} level={'3'}>
          Uke {felterIUken.ukeNummer}
        </Heading>
      </div>
      <VStack>
        <div className={styles.ukerad}>
          {alleDagerIUken.map((dag) => {
            const dagStr = format(dag, 'yyyy-MM-dd');
            const dagINummer = format(new Date(dag), 'dd.MM');
            const eksisterendeFelt = felterMap.get(dagStr);
            const harFeilmelding =
              eksisterendeFelt?.index !== undefined
                ? form.formState.errors?.dager?.[eksisterendeFelt.index]?.timer
                : undefined;

            if (erLitenSkjerm && !eksisterendeFelt) {
              return null;
            }

            const harVerdi = form.watch(`dager.${eksisterendeFelt?.index!}.timer`);

            return (
              <div
                key={dag.toString()}
                className={`${!eksisterendeFelt && styles.ikkeeksisterendefelt} ${harVerdi && styles.erutfylt} ${harFeilmelding && styles.harFeilmelding}`}
              >
                <div className={styles.dag}>
                  <div className={`${styles.dagheading}`}>
                    <Detail>{formaterUkedag(dag)}</Detail>
                    <Heading size={'small'}>{dagINummer}</Heading>
                  </div>
                  {eksisterendeFelt && (
                    <TextFieldWrapper
                      control={form.control}
                      name={`dager.${eksisterendeFelt.index}.timer`}
                      label={'Arbeid'}
                      className={harFeilmelding ? styles.tekstfeltFeilmelding : ''}
                      rules={{
                        validate: (value) => {
                          if (!erGyldigTimer(value as string)) {
                            return 'Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer';
                          }
                        },
                      }}
                    />
                  )}
                </div>
                {harFeilmelding && erLitenSkjerm && (
                  <div className={styles.error}>
                    <XMarkOctagonFillIcon className={styles.errorIcon} fontSize={'2rem'} />
                    <BodyShort>{harFeilmelding.message}</BodyShort>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!erLitenSkjerm && ukeUtfyllingErrors.length > 0 && (
          <Alert variant={'error'}>
            {ukeUtfyllingErrorMeldinger.map((error, index) => {
              return <BodyShort key={index}>{error}</BodyShort>;
            })}
          </Alert>
        )}
      </VStack>
    </div>
  );

  function formaterUkedag(date: string | Date): string {
    const formatter = new Intl.DateTimeFormat('nb-NO', { weekday: 'long' });
    return erLitenSkjerm
      ? storForbokstav(formatter.format(new Date(date)))
      : storForbokstav(formatter.format(new Date(date))).substring(0, 3) + '.';
  }
};
