'use client';

import { endOfWeek, format, getISOWeek, startOfWeek } from 'date-fns';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';

import styles from './Rapporteringskalender.module.css';
import { UkeRapportering } from 'components/rapporteringskalender/ukerapportering/UkeRapportering';
import {
  MeldepliktFormFields,
  replaceCommasWithDots,
  UtfyllingAvTimerError,
} from 'components/flyt/innsending/steg/timerarbeidet/TimerArbeidet';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';
import { useEffect, useState } from 'react';
import { UkeRapporteringSmall } from 'components/rapporteringskalender/ukerapportering/small/UkeRapporteringSmall';

interface Props {
  errors: UtfyllingAvTimerError[];
}

export type FieldArrayWithIndex = FieldArrayWithId<MeldepliktFormFields> & {
  index: number;
};

export type MeldeperiodeUke = { ukeStart: Date; ukeSlutt: Date; ukeNummer: number; felter: FieldArrayWithIndex[] };

export const Rapporteringskalender = ({ errors }: Props) => {
  const form = useFormContext<MeldepliktFormFields>();
  const [width, setWidth] = useState(window.innerWidth);

  const { fields } = useFieldArray({
    control: form.control,
    name: 'dager',
  });

  const meldeperiodeUker: Record<string, MeldeperiodeUke> = fields.reduce(
    (acc, field, index) => {
      const ukeStart = format(startOfWeek(new Date(field.dag), { weekStartsOn: 1 }), 'yyyy-MM-dd');

      if (!acc[ukeStart]) {
        const parsedUkeStart = new Date(ukeStart);
        acc[ukeStart] = {
          felter: [],
          ukeStart: parsedUkeStart,
          ukeSlutt: endOfWeek(parsedUkeStart, { weekStartsOn: 1 }),
          ukeNummer: getISOWeek(parsedUkeStart),
        };
      }

      acc[ukeStart].felter.push({ ...field, index });

      return acc;
    },
    {} as Record<string, MeldeperiodeUke>
  );

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmallScreen = width < 768;

  return (
    <div className={styles.rapporteringskalender}>
      <div className={styles.kalender}>
        {Object.entries(meldeperiodeUker).map(([ukeStart, felterIUken]) =>
          isSmallScreen ? (
            <UkeRapporteringSmall key={ukeStart} felterIUken={felterIUken} errors={errors} />
          ) : (
            <UkeRapportering key={ukeStart} felterIUken={felterIUken} errors={errors} />
          )
        )}
      </div>
      <OppsummeringTimer
        timer={form
          .watch('dager')
          .reduce((acc, curr) => acc + (curr.timer ? Number(replaceCommasWithDots(curr.timer)) : 0), 0)}
      />
    </div>
  );
};
