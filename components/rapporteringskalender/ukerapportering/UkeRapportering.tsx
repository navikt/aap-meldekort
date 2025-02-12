'use client';

import { TimerInput } from 'components/rapporteringskalender/timerinput/TimerInput';
import { MeldeperiodeUke } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale/nb';

import { BodyShort, Checkbox, Heading, Label } from '@navikt/ds-react';

import { UtfyllingAvTimerError } from 'components/flyt/innsending/steg/utfylling/Utfylling';
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
  errors: UtfyllingAvTimerError[];
}

export const UkeRapportering = ({ felterIUken, errors, meldekort }: Props) => {
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
                <div className={`${styles.felter} ${styles.felterBlue}`}>
                  <Label>Arbeid</Label>
                  <TimerInput
                    index={field.index}
                    harError={Boolean(errors.find((error) => error.index === field.index)?.harError)}
                    label={format(new Date(field.dag), 'eeee do MMMM', { locale: nb })}
                    isSmallScreen={true}
                  />
                </div>
              )}

              {meldekort.meldekort.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning && (
                <div className={`${styles.felter} ${styles.felterYellow}`}>
                  <Label>Tiltak/kurs/utdanning </Label>
                  <CheckboxWrapper
                    name={`dager.${field.index}.harVærtPåtiltakKursEllerUtdanning`}
                    control={form.control}
                    // TODO label={formField.label}
                    hideLabel={true}
                    size={'medium'}
                  >
                    <Checkbox value={JaEllerNei.Ja} hideLabel>
                      Tiltak/kurs/utdanning
                    </Checkbox>
                  </CheckboxWrapper>
                </div>
              )}

              {meldekort.meldekort.harDuHattFerie && (
                <div className={`${styles.felter} ${styles.felterPurple}`}>
                  <Label>Ferie og annet fravær enn sykdom</Label>
                  <CheckboxWrapper
                    name={`dager.${field.index}.harVærtPåFerie`}
                    control={form.control}
                    // TODO label={formField.label}
                    hideLabel={true}
                    size={'medium'}
                  >
                    <Checkbox value={JaEllerNei.Ja} hideLabel>
                      Ferie og annet fravær enn sykdom
                    </Checkbox>
                  </CheckboxWrapper>
                </div>
              )}

              {meldekort.meldekort.harDuVærtSyk && (
                <div className={`${styles.felter} ${styles.felterGreen}`}>
                  <Label>Syk</Label>
                  <CheckboxWrapper
                    name={`dager.${field.index}.harVærtSyk`}
                    control={form.control}
                    // TODO label={formField.label}
                    hideLabel={true}
                    size={'medium'}
                  >
                    <Checkbox value={JaEllerNei.Ja} hideLabel>
                      Syk
                    </Checkbox>
                  </CheckboxWrapper>
                </div>
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
