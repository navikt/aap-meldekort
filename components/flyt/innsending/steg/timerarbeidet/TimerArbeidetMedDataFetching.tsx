import { hentMeldekort } from 'lib/services/meldekortservice';
import { TimerArbeidet } from 'components/flyt/innsending/steg/timerarbeidet/TimerArbeidet';

interface Props {
  referanse: string;
}

export const TimerArbeidetMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);

  return <TimerArbeidet meldekort={meldekort} referanse={referanse} />;
};
