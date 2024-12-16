import { hentMeldekort } from 'lib/services/meldekortservice';
import { Utfylling } from 'components/steg/utfylling/Utfylling';
import { TimerArbeidet } from 'components/steg/utfylling/TimerArbeidet';

interface Props {
  referanse: string;
}

export const UtfyllingMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);

  return meldekort.meldekort.harDuJobbet ? (
    <Utfylling meldekort={meldekort} referanse={referanse} />
  ) : (
    <TimerArbeidet meldekort={meldekort} referanse={referanse} />
  );
};
