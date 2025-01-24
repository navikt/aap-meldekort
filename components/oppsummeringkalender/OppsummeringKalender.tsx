import { format, getISOWeek, startOfWeek } from 'date-fns';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { UkeHeader } from 'components/rapporteringskalender/ukeheader/UkeHeader';
import { OppsummeringUkeRad } from 'components/oppsummeringkalender/oppsummeringukerad/OppsummeringUkeRad';

import styles from './OppsummeringKalender.module.css';
import { Periode, TimerArbeidet } from 'lib/types/types';
import { OppsummeringRad } from 'components/oppsummeringrad/OppsummeringRad';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';

interface Props {
  periode: Periode;
  timerArbeidet?: TimerArbeidet[] | null;
  utbetalt?: number | null;
  innsendtDato?: string | null;
  visPeriode?: boolean;
}

export interface Dag {
  dag: Date;
  timer: number;
}

export const OppsummeringKalender = ({ periode, timerArbeidet, visPeriode = true, utbetalt, innsendtDato }: Props) => {
  const fraDato = new Date(periode.fom);
  const tilDato = new Date(periode.tom);

  const fraDatoUkenummer = getISOWeek(fraDato);
  const tilDatoUkenummer = getISOWeek(tilDato);

  const grupperteFelter: Record<string, Dag[]> = {};

  timerArbeidet?.forEach((timer) => {
    const ukestart = format(startOfWeek(timer.dato, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    if (!grupperteFelter[ukestart]) {
      grupperteFelter[ukestart] = [];
    }

    grupperteFelter[ukestart].push({ dag: new Date(timer.dato), timer: timer.timer ?? 0 });
  });

  const timer = Object.values(grupperteFelter)
    .flat()
    .reduce((acc, curr) => acc + Number(curr.timer), 0);

  return (
    <div className={styles.oppsummeringkalender}>
      {visPeriode && (
        <div className={styles.heading}>
          <Heading size={'medium'} level={'3'}>
            Uke {fraDatoUkenummer} - {tilDatoUkenummer}
          </Heading>
          <BodyShort>
            {formaterDatoForFrontend(periode.fom)} - {formaterDatoForFrontend(periode.tom)}
          </BodyShort>
        </div>
      )}
      <div className={styles.kalender}>
        <div>
          <UkeHeader />
          {Object.entries(grupperteFelter).map(([ukeStart, felterIUken]) => (
            <OppsummeringUkeRad key={ukeStart} felterIUken={felterIUken} />
          ))}
        </div>
        <VStack gap={'4'}>
          <OppsummeringTimer timer={timer} />
          {utbetalt && (
            <OppsummeringRad
              heading={'Utbetalt for perioden'}
              label={'Utbetalt'}
              value={`${utbetalt} kr`}
              backgroundColor={'green'}
            />
          )}
          {innsendtDato && (
            <OppsummeringRad
              heading={'Innsendt'}
              label={'Innsendt'}
              value={formaterDatoForFrontend(innsendtDato)}
              backgroundColor={'white'}
            />
          )}
        </VStack>
      </div>
    </div>
  );
};
