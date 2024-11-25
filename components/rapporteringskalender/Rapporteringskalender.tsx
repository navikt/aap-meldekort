'use client';

import { eachDayOfInterval, format, getISOWeek, startOfWeek } from 'date-fns';
import { BodyShort, Heading } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useConfigForm } from '@navikt/aap-felles-react';
import { FieldArrayWithId, useFieldArray } from 'react-hook-form';

import styles from './Rapporteringskalender.module.css';
import { UkeRad } from 'components/rapporteringskalender/ukerad/UkeRad';
import { UkeHeader } from './ukeheader/UkeHeader';

interface Props {
  periode: Periode;
}

export interface Periode {
  periode: { fraDato: string; tilDato: string };
}

export interface MeldepliktFormFields {
  dager: Dag[];
}

interface Dag {
  dag: string;
  timer?: string;
}

export type FieldArrayWithIndex = FieldArrayWithId<MeldepliktFormFields> & {
  index: number;
};

export const Rapporteringskalender = ({ periode }: Props) => {
  const fraDato = new Date(periode.periode.fraDato);
  const tilDato = new Date(periode.periode.tilDato);

  const { form } = useConfigForm<MeldepliktFormFields>({
    dager: {
      type: 'fieldArray',
      defaultValue: eachDayOfInterval({ start: fraDato, end: tilDato }).map((date) => {
        return {
          dag: date.toString(),
          timer: '',
        };
      }),
    },
  });

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
    <div className={styles.rapporteringskalender}>
      <div className={styles.heading}>
        <Heading size={'medium'}>
          Uke {fraDatoUkenummer} - {tilDatoUkenummer}
        </Heading>
        <BodyShort>
          {formaterDatoForFrontend(periode.periode.fraDato)} - {formaterDatoForFrontend(periode.periode.tilDato)}
        </BodyShort>
      </div>
      <div className={styles.kalender}>
        <UkeHeader />
        {Object.entries(grupperteFelter).map(([ukeStart, felterIUken]) => (
          <UkeRad key={ukeStart} felterIUken={felterIUken} form={form} />
        ))}
      </div>
    </div>
  );
};
