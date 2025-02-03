import { TimerInput } from 'components/rapporteringskalender/timerinput/TimerInput';
import { MeldeperiodeUke } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale/nb';

import { BodyShort, Heading } from '@navikt/ds-react';

import styles from 'components/rapporteringskalender/ukerad/UkeRapportering.module.css';
import { UtfyllingAvTimerError } from 'components/flyt/innsending/steg/timerarbeidet/Utfylling';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  felterIUken: MeldeperiodeUke;
  errors: UtfyllingAvTimerError[];
}

export const UkeRapportering = ({ felterIUken, errors }: Props) => {
  return (
    <div className={styles.rad}>
      <div className={styles.heading}>
        <Heading size={'medium'} level={'3'}>
          Uke {felterIUken.ukeNummer}
        </Heading>
        <BodyShort>
          {formaterDatoForFrontend(felterIUken.ukeStart)} - {formaterDatoForFrontend(felterIUken.ukeSlutt)}
        </BodyShort>
      </div>
      <div className={styles.ukerad}>
        {felterIUken.felter.map((felt) => {
          return (
            <BodyShort size={'small'} aria-hidden weight={'semibold'} key={felt.dag}>
              {formaterUkedag(felt.dag)}
            </BodyShort>
          );
        })}

        {felterIUken.felter.map((field, index) => {
          const dagINummer = format(new Date(field.dag), 'd');
          return (
            <BodyShort key={index} size={'medium'} aria-hidden>
              {dagINummer}
            </BodyShort>
          );
        })}

        {felterIUken.felter.map((field) => (
          <TimerInput
            key={field.id}
            index={field.index}
            harError={Boolean(errors.find((error) => error.index === field.index)?.harError)}
            label={format(new Date(field.dag), 'eeee do MMMM', { locale: nb })}
          />
        ))}
      </div>
    </div>
  );
};

function formaterUkedag(date: string): string {
  const formatter = new Intl.DateTimeFormat('nb-NO', { weekday: 'short' });
  return formatter.format(new Date(date)).slice(0, 2) + '.';
}
