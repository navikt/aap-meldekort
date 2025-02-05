import { format, getISOWeek, startOfWeek } from 'date-fns';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { OppsummeringUkeRad } from 'components/oppsummeringkalender/oppsummeringukerad/OppsummeringUkeRad';

import styles from './OppsummeringKalender.module.css';
import { HistoriskMeldekortType, Periode, TimerArbeidet } from 'lib/types/types';
import { OppsummeringRad } from 'components/oppsummeringrad/OppsummeringRad';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';
import { formaterTilNok } from 'lib/utils/string';
import Link from 'next/link';

interface Props {
  periode: Periode;
  timerArbeidet?: TimerArbeidet[] | null;
  utbetalt?: number | null;
  innsendtDato?: string | null;
  visPeriode?: boolean;
  kanEndres?: boolean;
  type?: HistoriskMeldekortType;
}

export interface Dag {
  dag: Date;
  timer: number;
}

export const OppsummeringKalender = ({
  periode,
  timerArbeidet,
  utbetalt,
  innsendtDato,
  type,
  visPeriode = true,
  kanEndres = false,
}: Props) => {
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

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('fom', periode.fom);
  urlSearchParams.append('tom', periode.tom);
  const url = `/innsendt/periode/korriger?${urlSearchParams}`;

  return (
    <div className={`${styles.fullBleed} ${styles.oppsummeringkalender}`}>
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
      <div className={`${styles.kalender}`}>
        <VStack gap={'4'}>
          {kanEndres && (
            <div className={styles.endremeldekortlink}>
              <Link href={url}>Endre meldekort</Link>
            </div>
          )}
          {Object.entries(grupperteFelter).map(([ukeStart, felterIUken]) => (
            <div key={ukeStart}>
              <OppsummeringUkeRad felterIUken={felterIUken} />
            </div>
          ))}
        </VStack>
        <VStack gap={'4'}>
          <OppsummeringTimer timer={timer} />
          {utbetalt !== null && utbetalt !== undefined && (
            <OppsummeringRad
              heading={'Utbetalt for perioden'}
              label={'Utbetalt'}
              value={`${formaterTilNok(utbetalt)}`}
              backgroundColor={'green'}
            />
          )}
          {innsendtDato && (
            <OppsummeringRad
              heading={type === 'KORRIGERING' ? 'Korrigert' : 'Innsendt'}
              label={type === 'KORRIGERING' ? 'Korrigert' : 'Innsendt'}
              value={formaterDatoForFrontend(innsendtDato)}
              backgroundColor={'white'}
            />
          )}
        </VStack>
      </div>
    </div>
  );
};
