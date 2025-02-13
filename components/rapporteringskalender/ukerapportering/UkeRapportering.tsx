'use client';

import { TimerInput } from 'components/rapporteringskalender/timerinput/TimerInput';
import { MeldeperiodeUke } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';

import { BodyShort, Checkbox, Heading } from '@navikt/ds-react';

import {
  erDetAvhuketSykedagOgFeriePåSammeDag,
  erDetFørtTimerOgAvhuketFeriePåSammeDag,
} from 'components/flyt/innsending/steg/utfylling/Utfylling';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';
import { useFormContext } from 'react-hook-form';
import { JaEllerNei } from 'lib/utils/form';
import { CheckboxWrapper } from 'components/CheckboxWrapper';
import { MeldekortResponse } from 'lib/types/types';

import styles from 'components/rapporteringskalender/ukerapportering/UkeRapportering.module.css';

interface Props {
  meldekort: MeldekortResponse;
  felterIUken: MeldeperiodeUke;
}

export const UkeRapportering = ({ felterIUken, meldekort }: Props) => {
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
              {meldekort.meldekort.harDuJobbet && (
                <TimerInput index={field.index} label={'Arbeid'} isSmallScreen={true} />
              )}

              {meldekort.meldekort.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning && (
                <CheckboxWrapper
                  name={`dager.${field.index}.harVærtPåtiltakKursEllerUtdanning`}
                  control={form.control}
                  hideLabel={true}
                  size={'medium'}
                >
                  <Checkbox value={JaEllerNei.Ja}>Tiltak/kurs/utdanning</Checkbox>
                </CheckboxWrapper>
              )}

              {meldekort.meldekort.harDuHattFerie && (
                <CheckboxWrapper
                  name={`dager.${field.index}.harVærtPåFerie`}
                  control={form.control}
                  hideLabel={true}
                  size={'medium'}
                  rules={{
                    validate: (value, formValues) => {
                      if (erDetAvhuketSykedagOgFeriePåSammeDag(formValues.dager[field.index])) {
                        return 'Du kan ikke å velge sykedag og ferie på samme dag.';
                      }

                      if (erDetFørtTimerOgAvhuketFeriePåSammeDag(formValues.dager[field.index])) {
                        return 'Du kan ikke angi både arbeid og ferie på samme dag.';
                      }
                    },
                  }}
                >
                  <Checkbox value={JaEllerNei.Ja}>Ferie og annet fravær enn sykdom</Checkbox>
                </CheckboxWrapper>
              )}

              {meldekort.meldekort.harDuVærtSyk && (
                <CheckboxWrapper
                  name={`dager.${field.index}.harVærtSyk`}
                  control={form.control}
                  size={'medium'}
                  rules={{
                    validate: (value, formValues) => {
                      if (erDetAvhuketSykedagOgFeriePåSammeDag(formValues.dager[field.index])) {
                        return 'Du kan ikke å velge sykedag og ferie på samme dag.';
                      }
                    },
                  }}
                >
                  <Checkbox value={JaEllerNei.Ja}>Syk</Checkbox>
                </CheckboxWrapper>
              )}
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
