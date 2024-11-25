'use client';

import { format, getISOWeek, startOfWeek } from 'date-fns';
import { BodyShort, Heading } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';

import styles from './Rapporteringskalender.module.css';
import { UkeRad } from 'components/rapporteringskalender/ukerad/UkeRad';
import { UkeHeader } from './ukeheader/UkeHeader';
import { MeldepliktFormFields } from 'components/steg/utfylling/Utfylling';

interface Props {
  periode: PeriodeType;
  readOnly: boolean;
}

export interface PeriodeType {
  periode: { fraDato: string; tilDato: string };
}

export type FieldArrayWithIndex = FieldArrayWithId<MeldepliktFormFields> & {
  index: number;
};

export const Rapporteringskalender = ({ periode, readOnly }: Props) => {
  const fraDato = new Date(periode.periode.fraDato);
  const tilDato = new Date(periode.periode.tilDato);

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
    <div className={`${styles.rapporteringskalender} ${readOnly ? styles.readonly : ''}`}>
      <div className={styles.heading}>
        <Heading size={'medium'} level={'3'}>
          Uke {fraDatoUkenummer} - {tilDatoUkenummer}
        </Heading>
        <BodyShort>
          {formaterDatoForFrontend(periode.periode.fraDato)} - {formaterDatoForFrontend(periode.periode.tilDato)}
        </BodyShort>
      </div>
      <div className={styles.kalender}>
        <UkeHeader />
        {Object.entries(grupperteFelter).map(([ukeStart, felterIUken]) => (
          <UkeRad key={ukeStart} felterIUken={felterIUken} readOnly={readOnly} />
        ))}
      </div>
    </div>
  );
};
