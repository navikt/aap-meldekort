import { eachDayOfInterval, format, getISOWeek, startOfWeek } from 'date-fns';
import { BodyShort, Heading } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { UkeHeader } from 'components/rapporteringskalender/ukeheader/UkeHeader';
import { OppsummeringUkeRad } from 'components/oppsummeringkalender/oppsummeringukerad/OppsummeringUkeRad';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';

import styles from './OppsummeringKalender.module.css';
import { MeldekortResponse } from 'lib/types/types';

interface Props {
  meldekort: MeldekortResponse;
}

export interface Dag {
  dag: Date;
  timer: number;
}

export const OppsummeringKalender = ({ meldekort }: Props) => {
  const fraDato = new Date(meldekort.periode.fom);
  const tilDato = new Date(meldekort.periode.tom);

  const fraDatoUkenummer = getISOWeek(fraDato);
  const tilDatoUkenummer = getISOWeek(tilDato);

  const grupperteFelter: Record<string, Dag[]> = {};

  eachDayOfInterval({ start: fraDato, end: tilDato }).forEach((field) => {
    const ukeStart = format(startOfWeek(field, { weekStartsOn: 1 }), 'yyyy-MM-dd');

    if (!grupperteFelter[ukeStart]) {
      grupperteFelter[ukeStart] = [];
    }
    grupperteFelter[ukeStart].push({ dag: field, timer: 0 });
  });

  const timer = Object.values(grupperteFelter)
    .flat()
    .reduce((acc, curr) => acc + Number(curr.timer), 0);

  return (
    <div className={styles.oppsummeringkalender}>
      <div className={styles.heading}>
        <Heading size={'medium'} level={'3'}>
          Uke {fraDatoUkenummer} - {tilDatoUkenummer}
        </Heading>
        <BodyShort>
          {formaterDatoForFrontend(meldekort.periode.fom)} - {formaterDatoForFrontend(meldekort.periode.tom)}
        </BodyShort>
      </div>
      <div className={styles.kalender}>
        <UkeHeader />
        {Object.entries(grupperteFelter).map(([ukeStart, felterIUken]) => (
          <OppsummeringUkeRad key={ukeStart} felterIUken={felterIUken} />
        ))}

        <OppsummeringTimer timer={timer} className={styles.oppsummering} />
      </div>
    </div>
  );
};
