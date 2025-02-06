import { TimerInput } from 'components/rapporteringskalender/timerinput/TimerInput';
import { MeldeperiodeUke } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale/nb';

import { BodyShort, Heading } from '@navikt/ds-react';

import styles from 'components/rapporteringskalender/ukerapportering/UkeRapportering.module.css';
import { UtfyllingAvTimerError } from 'components/flyt/innsending/steg/timerarbeidet/TimerArbeidet';
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
            <div key={felt.id} className={styles.felt}>
              <BodyShort size={'small'} aria-hidden weight={'semibold'} key={felt.dag}>
                {formaterUkedag(felt.dag)} {format(new Date(felt.dag), 'd')}.
              </BodyShort>
              <TimerInput
                index={felt.index}
                harError={Boolean(errors.find((error) => error.index === felt.index)?.harError)}
                label={format(new Date(felt.dag), 'eeee do MMMM', { locale: nb })}
                isSmallScreen={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function formaterUkedag(date: string): string {
  const formatter = new Intl.DateTimeFormat('nb-NO', { weekday: 'short' });
  return formatter.format(new Date(date)).slice(0, 2) + '.';
}
