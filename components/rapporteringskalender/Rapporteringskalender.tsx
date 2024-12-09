'use client';

import { format, getISOWeek, startOfWeek } from 'date-fns';
import { BodyShort, Heading } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';

import styles from './Rapporteringskalender.module.css';
import { UkeRad } from 'components/rapporteringskalender/ukerad/UkeRad';
import { UkeHeader } from './ukeheader/UkeHeader';
import { MeldepliktError, MeldepliktFormFields } from 'components/steg/utfylling/Utfylling';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';
import { MeldekortResponse } from 'lib/types/types';

interface Props {
  meldeperiode: MeldekortResponse;
  errors: MeldepliktError[];
}

export type FieldArrayWithIndex = FieldArrayWithId<MeldepliktFormFields> & {
  index: number;
};

export const Rapporteringskalender = ({ meldeperiode, errors }: Props) => {
  const fraDato = new Date(meldeperiode.periode.fom);
  const tilDato = new Date(meldeperiode.periode.tom);

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
            {formaterDatoForFrontend(meldeperiode.periode.fom)} - {formaterDatoForFrontend(meldeperiode.periode.tom)}
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
