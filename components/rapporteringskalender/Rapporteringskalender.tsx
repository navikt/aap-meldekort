'use client';

import { endOfWeek, format, getISOWeek, startOfWeek } from 'date-fns';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';

import { MeldepliktFormFields, replaceCommasWithDots } from 'components/flyt/steg/utfylling/Utfylling';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';
import { UkeRapportering } from 'components/rapporteringskalender/ukerapportering/UkeRapportering';

import styles from './Rapporteringskalender.module.css';

export type FieldArrayWithIndex = FieldArrayWithId<MeldepliktFormFields> & {
  index: number;
};

export interface MeldeperiodeUke {
  ukeStart: Date;
  ukeSlutt: Date;
  ukeNummer: number;
  felter: FieldArrayWithIndex[];
}

export const Rapporteringskalender = () => {
  const form = useFormContext<MeldepliktFormFields>();

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

  return (
    <div className={styles.rapporteringskalender}>
      <div className={styles.kalender}>
        {Object.entries(meldeperiodeUker).map(([ukeStart, felterIUken]) => (
          <UkeRapportering key={ukeStart} felterIUken={felterIUken} />
        ))}
      </div>

      <OppsummeringTimer
        timer={form
          .watch('dager')
          .reduce((acc, curr) => acc + (curr.timer ? Number(replaceCommasWithDots(curr.timer)) : 0), 0)}
      />
    </div>
  );
};
