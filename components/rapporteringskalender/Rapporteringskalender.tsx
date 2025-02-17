'use client';

import { endOfWeek, format, getISOWeek, startOfWeek } from 'date-fns';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';

import { MeldepliktFormFields, replaceCommasWithDots } from 'components/flyt/steg/utfylling/Utfylling';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';
import { useEffect, useState } from 'react';
import { UkeRapportering } from 'components/rapporteringskalender/ukerapportering/UkeRapportering';
import { MeldekortResponse } from 'lib/types/types';

import styles from './Rapporteringskalender.module.css';
import { OppsummeringRad } from 'components/oppsummeringrad/OppsummeringRad';

interface Props {
  meldekort: MeldekortResponse;
}

export type FieldArrayWithIndex = FieldArrayWithId<MeldepliktFormFields> & {
  index: number;
};

export interface MeldeperiodeUke {
  ukeStart: Date;
  ukeSlutt: Date;
  ukeNummer: number;
  felter: FieldArrayWithIndex[];
}

export const Rapporteringskalender = ({ meldekort }: Props) => {
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

  console.log(width);

  return (
    <div className={styles.rapporteringskalender}>
      <div className={styles.kalender}>
        {Object.entries(meldeperiodeUker).map(([ukeStart, felterIUken]) => (
          <UkeRapportering key={ukeStart} felterIUken={felterIUken} meldekort={meldekort} />
        ))}
      </div>

      {meldekort.meldekort.harDuJobbet && (
        <OppsummeringTimer
          timer={form
            .watch('dager')
            .reduce((acc, curr) => acc + (curr.timer ? Number(replaceCommasWithDots(curr.timer)) : 0), 0)}
        />
      )}
      {meldekort.meldekort.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning && (
        <OppsummeringRad
          heading={'Tiltak/kurs/utdanning'}
          label={'Dager'}
          value={form
            .watch('dager')
            .filter((dag) => dag.harVærtPåtiltakKursEllerUtdanning)
            .length.toString()}
          backgroundColor={'orange'}
        />
      )}

      {meldekort.meldekort.harDuHattFerie && (
        <OppsummeringRad
          heading={'Ferie og annet fravær enn sykdom'}
          label={'Dager'}
          value={form
            .watch('dager')
            .filter((dag) => dag.harVærtPåFerie)
            .length.toString()}
          backgroundColor={'purple'}
        />
      )}

      {meldekort.meldekort.harDuVærtSyk && (
        <OppsummeringRad
          heading={'Syk'}
          label={'Dager'}
          value={form
            .watch('dager')
            .filter((dag) => dag.harVærtSyk)
            .length.toString()}
          backgroundColor={'green'}
        />
      )}
    </div>
  );
};
