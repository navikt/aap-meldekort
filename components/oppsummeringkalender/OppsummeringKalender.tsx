import React from 'react';
import { PeriodeType } from 'components/rapporteringskalender/Rapporteringskalender';
import { eachDayOfInterval, format, getISOWeek, startOfWeek } from 'date-fns';
import { BodyShort, Heading } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { UkeHeader } from 'components/rapporteringskalender/ukeheader/UkeHeader';
import { OppsummeringUkeRad } from 'components/oppsummeringkalender/oppsummeringukerad/OppsummeringUkeRad';

import styles from './OppsummeringKalender.module.css';

interface Props {
  periode: PeriodeType;
}

export interface Dag {
  dag: Date;
  timer: number;
}

export const OppsummeringKalender = ({ periode }: Props) => {
  const fraDato = new Date(periode.fraDato);
  const tilDato = new Date(periode.tilDato);

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

  return (
    <div className={styles.oppsummeringkalender}>
      <div className={styles.heading}>
        <Heading size={'medium'} level={'3'}>
          Uke {fraDatoUkenummer} - {tilDatoUkenummer}
        </Heading>
        <BodyShort>
          {formaterDatoForFrontend(periode.fraDato)} - {formaterDatoForFrontend(periode.tilDato)}
        </BodyShort>
      </div>
      <div className={styles.kalender}>
        <UkeHeader />
        {Object.entries(grupperteFelter).map(([ukeStart, felterIUken]) => (
          <OppsummeringUkeRad key={ukeStart} felterIUken={felterIUken} />
        ))}
      </div>
    </div>
  );
};
