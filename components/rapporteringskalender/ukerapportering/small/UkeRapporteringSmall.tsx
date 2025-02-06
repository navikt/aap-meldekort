import { TimerInput } from 'components/rapporteringskalender/timerinput/TimerInput';
import { MeldeperiodeUke } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale/nb';

import { BodyShort, Heading } from '@navikt/ds-react';

import styles from 'components/rapporteringskalender/ukerapportering/small/UkeRapporteringSmall.module.css';
import { UtfyllingAvTimerError } from 'components/flyt/innsending/steg/timerarbeidet/TimerArbeidet';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';

interface Props {
  felterIUken: MeldeperiodeUke;
  errors: UtfyllingAvTimerError[];
}

export const UkeRapporteringSmall = ({ felterIUken, errors }: Props) => {
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
        {felterIUken.felter.map((field) => {
          const dagINummer = format(new Date(field.dag), 'dd.MM');
          return (
            <div key={field.dag} className={styles.dag}>
              <div className={styles.tekst}>
                <BodyShort size={'large'} aria-hidden weight={'semibold'}>
                  {formaterUkedag(field.dag)}
                </BodyShort>
                <BodyShort size={'large'} aria-hidden>
                  {dagINummer}
                </BodyShort>
              </div>
              <TimerInput
                index={field.index}
                harError={Boolean(errors.find((error) => error.index === field.index)?.harError)}
                label={format(new Date(field.dag), 'eeee do MMMM', { locale: nb })}
                isSmallScreen={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

function formaterUkedag(date: string): string {
  const formatter = new Intl.DateTimeFormat('nb-NO', { weekday: 'long' });
  return storForbokstav(formatter.format(new Date(date)));
}
