import { format, getISOWeek, startOfWeek } from 'date-fns';
import { BodyShort, Heading, Label, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { OppsummeringUkeRad } from 'components/oppsummeringkalender/oppsummeringukerad/OppsummeringUkeRad';

import styles from './OppsummeringKalender.module.css';
import { HistoriskMeldekortType, Periode, DagerInfo } from 'lib/types/types';
import { Link } from 'i18n/routing';
import { ReactNode } from 'react';

interface Props {
  periode: Periode;
  heading?: string;
  children?: ReactNode;
  dager?: DagerInfo[] | null;
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
  heading,
  dager,
  children,
  visPeriode = true,
  kanEndres = false,
}: Props) => {
  const fraDato = new Date(periode.fom);
  const tilDato = new Date(periode.tom);

  const fraDatoUkenummer = getISOWeek(fraDato);
  const tilDatoUkenummer = getISOWeek(tilDato);

  const grupperteFelter: Record<string, Dag[]> = {};

  dager?.forEach((dag) => {
    const ukestart = format(startOfWeek(dag.dato, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    if (!grupperteFelter[ukestart]) {
      grupperteFelter[ukestart] = [];
    }

    grupperteFelter[ukestart].push({ dag: new Date(dag.dato), timer: dag.timerArbeidet ?? 0 });
  });

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('fom', periode.fom);
  urlSearchParams.append('tom', periode.tom);
  const url = `/innsendt/periode/korriger?${urlSearchParams}`;

  return (
    <div className={`${styles.fullBleed} ${styles.oppsummeringkalender}`}>
      {visPeriode && (
        <div className={styles.heading}>
          {heading && (
            <Heading size={'medium'} level={'3'}>
              {heading}
            </Heading>
          )}
          <Label>{`Uke ${fraDatoUkenummer} - ${tilDatoUkenummer}`}</Label>
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
        {children}
      </div>
    </div>
  );
};
