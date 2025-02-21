'use client';

import { MeldeperiodeUke } from 'components/rapporteringskalender/Rapporteringskalender';
import { eachDayOfInterval, format } from 'date-fns';

import { Detail, Heading } from '@navikt/ds-react';
import { storForbokstav } from 'lib/utils/string';

import styles from 'components/rapporteringskalender/ukerapportering/UkeRapportering.module.css';
import { TextFieldWrapper } from '@navikt/aap-felles-react';
import { erGyldigTimer } from 'components/flyt/steg/utfylling/Utfylling';
import { useFormContext } from 'react-hook-form';
import { useSkjermBredde } from 'hooks/skjermbreddeHook';

interface Props {
  felterIUken: MeldeperiodeUke;
}

export const UkeRapportering = ({ felterIUken }: Props) => {
  const form = useFormContext();
  const { erLitenSkjerm } = useSkjermBredde();

  const alleDagerIUken = eachDayOfInterval({
    start: new Date(felterIUken.ukeStart),
    end: new Date(felterIUken.ukeSlutt),
  });

  const felterMap = new Map(felterIUken.felter.map((field) => [field.dag, field]));

  return (
    <div className={styles.rad}>
      <div className={styles.heading}>
        <Heading size={'medium'} level={'3'}>
          Uke {felterIUken.ukeNummer}
        </Heading>
      </div>
      <div className={styles.ukerad}>
        {alleDagerIUken.map((dag) => {
          const dagStr = format(dag, 'yyyy-MM-dd');
          const dagINummer = format(new Date(dag), 'dd.MM');
          const eksisterendeFelt = felterMap.get(dagStr);

          const classNameForFeltSomHarBlittFyltUt = form.watch(`dager.${eksisterendeFelt?.index}.timer`)
            ? styles.harverdi
            : '';

          if (erLitenSkjerm && !eksisterendeFelt) {
            return null;
          }

          return (
            <div
              key={dag.toString()}
              className={`${styles.dag} ${!eksisterendeFelt && styles.ikkeeksisterendefelt} ${form.watch(`dager.${eksisterendeFelt?.index}.timer`) && styles.erutfylt}`}
            >
              <div className={`${styles.dagheading}`}>
                <Detail>{formaterUkedag(dag)}</Detail>
                <Heading size={'small'}>{dagINummer}</Heading>
              </div>
              {eksisterendeFelt && (
                <TextFieldWrapper
                  control={form.control}
                  name={`dager.${eksisterendeFelt.index}.timer`}
                  type={'text'}
                  size={'medium'}
                  hideLabel
                  label={'Arbeid'}
                  rules={{
                    validate: (value) => {
                      if (!erGyldigTimer(value)) {
                        return 'Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer';
                      }
                    },
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  function formaterUkedag(date: string | Date): string {
    const formatter = new Intl.DateTimeFormat('nb-NO', { weekday: 'long' });
    return erLitenSkjerm
      ? storForbokstav(formatter.format(new Date(date)))
      : storForbokstav(formatter.format(new Date(date))).substring(0, 3) + '.';
  }
};
