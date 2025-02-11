'use client';

import { TimerInput } from 'components/rapporteringskalender/timerinput/TimerInput';
import { MeldeperiodeUke } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale/nb';

import { BodyShort, Checkbox, Heading, HStack, Label } from '@navikt/ds-react';

import styles from 'components/rapporteringskalender/ukerapportering/small/UkeRapporteringSmall.module.css';
import { UtfyllingAvTimerError } from 'components/flyt/innsending/steg/utfylling/Utfylling';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';
import { useFormContext } from 'react-hook-form';
import { JaEllerNei } from 'lib/utils/form';
import { CheckboxWrapper } from 'components/CheckboxWrapper';

interface Props {
  felterIUken: MeldeperiodeUke;
  errors: UtfyllingAvTimerError[];
}

export const UkeRapporteringSmall = ({ felterIUken, errors }: Props) => {
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
              <BodyShort size={'large'} aria-hidden weight={'semibold'}>
                {`${formaterUkedag(field.dag)} ${dagINummer}`}
              </BodyShort>
              <CheckboxWrapper
                name={`dager.${field.index}.harVærtPåtiltakKursEllerUtdanning`}
                control={form.control}
                // TODO label={formField.label}
                hideLabel={true}
                // TODO rules={formField.rules}
                size={'medium'}
              >
                <Checkbox value={JaEllerNei.Ja}>Tiltak</Checkbox>
              </CheckboxWrapper>
              <CheckboxWrapper
                name={`dager.${field.index}.harVærtSyk`}
                control={form.control}
                // TODO label={formField.label}
                hideLabel={true}
                // TODO rules={formField.rules}
                size={'medium'}
              >
                <Checkbox value={JaEllerNei.Ja}>Syk</Checkbox>
              </CheckboxWrapper>
              <CheckboxWrapper
                name={`dager.${field.index}.harVærtPåFerie`}
                control={form.control}
                // TODO label={formField.label}
                hideLabel={true}
                // TODO rules={formField.rules}
                size={'medium'}
              >
                <Checkbox value={JaEllerNei.Ja}>Ferie</Checkbox>
              </CheckboxWrapper>

              <HStack gap={'2'} align={'center'}>
                <Label>Fyll timer: </Label>
                <TimerInput
                  index={field.index}
                  harError={Boolean(errors.find((error) => error.index === field.index)?.harError)}
                  label={format(new Date(field.dag), 'eeee do MMMM', { locale: nb })}
                  isSmallScreen={true}
                />
              </HStack>
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
