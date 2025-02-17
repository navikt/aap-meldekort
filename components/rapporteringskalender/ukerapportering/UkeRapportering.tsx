'use client';

import { MeldeperiodeUke } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';

import { BodyShort, Heading } from '@navikt/ds-react';

import { formaterDatoForFrontend } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';

import styles from 'components/rapporteringskalender/ukerapportering/UkeRapportering.module.css';
import { TextFieldWrapper } from '@navikt/aap-felles-react';
import { erGyldigTimer } from 'components/flyt/steg/utfylling/Utfylling';
import { useFormContext } from 'react-hook-form';

interface Props {
  felterIUken: MeldeperiodeUke;
}

export const UkeRapportering = ({ felterIUken }: Props) => {
  const form = useFormContext();

  return (
    <div className={styles.rad}>
      <div className={styles.heading}>
        <Heading size={'medium'} level={'3'}>
          Uke {felterIUken.ukeNummer}
        </Heading>
        <BodyShort>
          {formaterDatoForFrontend(felterIUken.ukeStart)} - {formaterDatoForFrontend(felterIUken.ukeSlutt)}
        </BodyShort>
      </div>
      <div className={styles.ukerad}>
        {felterIUken.felter.map((field) => {
          const dagINummer = format(new Date(field.dag), 'dd.MM');

          return (
            <div key={field.dag} className={styles.dag}>
              <Heading size={'small'} aria-hidden level={'3'} spacing>
                {`${formaterUkedag(field.dag)} ${dagINummer}`}
              </Heading>
              <TextFieldWrapper
                control={form.control}
                name={`dager.${field.index}.timer`}
                type={'text'}
                size={'medium'}
                label={'Arbeid'}
                rules={{
                  validate: (value) => {
                    if (!erGyldigTimer(value)) {
                      return 'Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer';
                    }
                  },
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

function formaterUkedag(date: string): string {
  const formatter = new Intl.DateTimeFormat('nb-NO', { weekday: 'long' });
  return storForbokstav(formatter.format(new Date(date)));
}
