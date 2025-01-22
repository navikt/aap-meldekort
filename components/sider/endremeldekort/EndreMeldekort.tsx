'use client';

import { HistoriskMeldekortDetaljer } from 'lib/types/types';
import { BodyShort, Button, Checkbox, CheckboxGroup, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { useState } from 'react';
import { JaEllerNei } from 'lib/utils/form';

import styles from './EndreMeldekort.module.css';

interface Props {
  meldekort: HistoriskMeldekortDetaljer;
}

export const EndreMeldekort = ({ meldekort }: Props) => {
  const [endrer, setEndrer] = useState(false);

  return (
    <VStack gap={'4'}>
      <Heading size={'medium'} level={'2'}>
        Se og endre meldekort
      </Heading>
      <BodyShort>
        Du kan endre tidligere innsendte meldekort X antall uker tilbake i tid. Husk at endret meldekort kan påvirke
        utbetalingen du fikk.
      </BodyShort>
      <ReadMore header={'Les mer om hvordan endre et meldekort'}>Her kommer det noe tekst</ReadMore>
      <CheckboxGroup
        legend={'Ønsker du å endre meldekortet?'}
        hideLegend
        onChange={(value) => setEndrer(value.includes(JaEllerNei.Ja))}
      >
        <Checkbox value={JaEllerNei.Ja}>Endre meldekort</Checkbox>
      </CheckboxGroup>
      {endrer ? (
        <div>Nå endrer jeg</div>
      ) : (
        <OppsummeringKalender timerArbeidet={meldekort.timerArbeidet} periode={meldekort.meldeperiode} />
      )}
      <div className={styles.buttons}>
        <Button variant={'secondary'} onClick={() => console.log('heheh')}>
          Tilbake
        </Button>
        <Button disabled={!endrer}>Neste</Button>
      </div>
    </VStack>
  );
};
