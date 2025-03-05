import { BodyShort, Detail, Heading, VStack } from '@navikt/ds-react';
import { TextFieldWrapper } from 'components/textfieldwrapper/TextFieldWrapper';
import { MeldepliktFormFields, replaceCommasWithDots } from 'components/flyt/steg/utfylling/Utfylling';
import { XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { format } from 'date-fns';
import { useSkjermBredde } from 'hooks/skjermbreddeHook';
import { useFormContext } from 'react-hook-form';
import { FieldArrayWithIndex } from 'components/rapporteringskalender/Rapporteringskalender';
import { storForbokstav } from 'lib/utils/string';

import styles from './UkeDag.module.css';

interface Props {
  dag: Date;
  felterMap: Map<string, FieldArrayWithIndex>;
  erSisteFeltiRaden: boolean;
  radHarError: boolean;
}

export const UkeDag = ({ dag, felterMap, erSisteFeltiRaden, radHarError }: Props) => {
  const form = useFormContext<MeldepliktFormFields>();
  const { erLitenSkjerm } = useSkjermBredde();
  const dagStr = format(dag, 'yyyy-MM-dd');
  const dagINummer = format(new Date(dag), 'dd.MM');
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
              <Detail>{formaterUkedag(dag)}</Detail>
              <Heading size={'small'}>{dagINummer}</Heading>
            </VStack>
            {eksisterendeFelt && (
              <TextFieldWrapper
                control={form.control}
                id={`dager${eksisterendeFelt.index}timer`}
                name={`dager.${eksisterendeFelt.index}.timer`}
                label={'Arbeid'}
                className={harFeilmelding ? 'navds-text-field--error' : ''}
                rules={{
                  validate: (value) => {
                    if (!value || value === '') {
                      return true;
                    }

                    const valueAsNumber = Number(replaceCommasWithDots(value as string));

                    if (isNaN(valueAsNumber) || valueAsNumber < 0 || valueAsNumber > 24) {
                      return `Du kan bare skrive tall mellom 0 og 24 (${dagINummer}).`;
                    } else if ((valueAsNumber * 10) % 5 !== 0) {
                      return `Du kan bare skrive inn hele eller halve timer (${dagINummer}).`;
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
    const formatter = new Intl.DateTimeFormat('nb-NO', { weekday: 'long' });
    return erLitenSkjerm
      ? storForbokstav(formatter.format(new Date(date)))
      : storForbokstav(formatter.format(new Date(date))).substring(0, 2) + '.';
  }
};
