'use client';

import { format, getISOWeek, startOfWeek } from 'date-fns';
import { BodyShort, Heading } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';

import styles from './Rapporteringskalender.module.css';
import { UkeRad } from 'components/rapporteringskalender/ukerad/UkeRad';
import { UkeHeader } from './ukeheader/UkeHeader';
import { UtfyllingAvTimerError, MeldepliktFormFields } from 'components/steg/timerarbeidet/Utfylling';
import { Periode } from 'lib/types/types';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';

interface Props {
  periode: Periode;
  errors: UtfyllingAvTimerError[];
}

export type FieldArrayWithIndex = FieldArrayWithId<MeldepliktFormFields> & {
  index: number;
};

export const Rapporteringskalender = ({ errors, periode }: Props) => {
  const fraDato = new Date(periode.fom);
  const tilDato = new Date(periode.tom);

  const form = useFormContext<MeldepliktFormFields>();

  const { fields } = useFieldArray({
    control: form.control,
    name: 'dager',
  });

  const fraDatoUkenummer = getISOWeek(fraDato);
  const tilDatoUkenummer = getISOWeek(tilDato);

  const grupperteFelter: Record<string, FieldArrayWithIndex[]> = {};

  fields.forEach((field, index) => {
    const ukeStart = format(startOfWeek(new Date(field.dag), { weekStartsOn: 1 }), 'yyyy-MM-dd');

    if (!grupperteFelter[ukeStart]) {
      grupperteFelter[ukeStart] = [];
    }
    grupperteFelter[ukeStart].push({ ...field, index });
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.rapporteringskalender}>
        <div className={styles.heading}>
          <Heading size={'medium'} level={'3'}>
            Uke {fraDatoUkenummer} - {tilDatoUkenummer}
          </Heading>
          <BodyShort>
            {formaterDatoForFrontend(periode.fom)} - {formaterDatoForFrontend(periode.tom)}
          </BodyShort>
        </div>
        <div className={styles.kalender}>
          <UkeHeader />
          {Object.entries(grupperteFelter).map(([ukeStart, felterIUken]) => (
            <UkeRad key={ukeStart} felterIUken={felterIUken} errors={errors} />
          ))}
        </div>
        <OppsummeringTimer timer={form.watch('dager').reduce((acc, curr) => acc + Number(curr.timer), 0)} />
      </div>
    </div>
  );
};
