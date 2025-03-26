import { BodyShort, Detail, Heading, VStack } from '@navikt/ds-react';
import { TextFieldWrapper } from 'components/textfieldwrapper/TextFieldWrapper';
import { MeldepliktFormFields, replaceCommasWithDots } from 'components/flyt/steg/utfylling/Utfylling';
import { XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { format } from 'date-fns';
import { useSkjermBredde } from 'hooks/skjermbreddeHook';
import { useFormContext } from 'react-hook-form';
import { FieldArrayWithIndex } from 'components/utfyllingkalender/UtfyllingKalender';

import styles from './UkeDag.module.css';
import { useTranslations } from 'next-intl';
import { formaterDatoMedMånedIBokstaver, formaterDatoUtenÅrForFrontend } from 'lib/utils/date';
import { nb } from 'date-fns/locale';

interface Props {
  dag: Date;
  felterMap: Map<string, FieldArrayWithIndex>;
  erSisteFeltiRaden: boolean;
  radHarError: boolean;
}

export const UkeDag = ({ dag, felterMap, erSisteFeltiRaden, radHarError }: Props) => {
  const t = useTranslations();
  const form = useFormContext<MeldepliktFormFields>();
  const { erLitenSkjerm } = useSkjermBredde();

  const dagStr = format(dag, 'yyyy-MM-dd');
  const dagINummer = formaterDatoUtenÅrForFrontend(dag);
  const eksisterendeFelt = felterMap.get(dagStr);
  const harFeilmelding =
    eksisterendeFelt?.index !== undefined ? form.formState.errors?.dager?.[eksisterendeFelt.index]?.timer : undefined;

  if (erLitenSkjerm && !eksisterendeFelt) {
    return null;
  }

  const harVerdi = form.watch(`dager.${eksisterendeFelt?.index!}.timer`);

  const containerClassNames = [
    !eksisterendeFelt && styles.ikkeeksisterendefelt,
    harVerdi && styles.erutfylt,
    harFeilmelding && styles.harFeilmelding,
    radHarError ? styles.dagcontainerharerror : styles.dagcontainer,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassNames}>
      <div className={erSisteFeltiRaden ? styles.inputwrapperutenborder : styles.inputwrapper}>
        <div className={styles.dag}>
          <div className={styles.timerinput}>
            <VStack>
              <Detail>
                {erLitenSkjerm ? formaterDatoMedMånedIBokstaver(dag) : formaterDatoUtenÅrForFrontend(dag)}
              </Detail>
              <Heading size={'small'}>{formaterUkedag(dag)}</Heading>
            </VStack>
            {eksisterendeFelt && (
              <TextFieldWrapper
                control={form.control}
                id={`dager${eksisterendeFelt.index}timer`}
                name={`dager.${eksisterendeFelt.index}.timer`}
                label={'Arbeid'}
                className={`${styles.tekstfelt} ${harFeilmelding ? 'navds-text-field--error' : ''}`}
                rules={{
                  validate: (value) => {
                    if (!value || value === '') {
                      return true;
                    }

                    const valueAsNumber = Number(replaceCommasWithDots(value as string));

                    if (isNaN(valueAsNumber) || valueAsNumber < 0 || valueAsNumber > 24) {
                      return t('client.steg.utfylling.skjema.felter.dager.validering.bareNummer', {
                        dato: dagINummer,
                      });
                    } else if ((valueAsNumber * 10) % 5 !== 0) {
                      return t('client.steg.utfylling.skjema.felter.dager.validering.heleHalveTimer', {
                        dato: dagINummer,
                      });
                    }
                  },
                }}
              />
            )}
          </div>
          {harFeilmelding && erLitenSkjerm && (
            <div className={styles.error}>
              <XMarkOctagonFillIcon className={styles.errorIcon} fontSize={'2rem'} />
              <BodyShort size={'small'}>{harFeilmelding.message}</BodyShort>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function formaterUkedag(date: string | Date): string {
    const dato = new Date(date);
    const ukedag = format(dato, 'EEEE', { locale: nb });

    return erLitenSkjerm ? ukedag : ukedag.substring(0, 2) + '.';
  }
};
