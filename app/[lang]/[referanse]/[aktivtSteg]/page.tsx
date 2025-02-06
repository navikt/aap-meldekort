import { HarDuArbeidetMedDataFetching } from 'components/flyt/innsending/steg/harduarbeidet/HarDuArbeidetMedDataFetching';
import { TimerArbeidetMedDataFetching } from 'components/flyt/innsending/steg/timerarbeidet/TimerArbeidetMedDataFetching';
import { Steg } from 'lib/types/types';
import { IntroduksjonMedDataFetching } from 'components/flyt/innsending/steg/introduksjon/IntroduksjonMedDataFetching';
import { KvitteringInnsendingMedDataFetching } from 'components/flyt/innsending/steg/kvittering/KvitteringInnsendingMedDataFetching';
import { hentMeldekort } from 'lib/services/meldekortservice';
import { redirect } from 'next/navigation';
import { StemmerOpplysningeneMedDataFetching } from 'components/flyt/innsending/steg/stemmeropplysningene/StemmerOpplysningeneMedDataFetching';

interface Props {
  params: Promise<{
    referanse: string;
    aktivtSteg: string;
  }>;
}

const AktivtStegPage = async (props: Props) => {
  const params = await props.params;
  const aktivtSteg = decodeURI(params.aktivtSteg) as Steg;
  const referanse = params.referanse;
  const meldekort = await hentMeldekort(referanse);

  function skalRedirecteTilAktivtSteg() {
    const steg: Steg[] = [
      'BEKREFT_SVARER_ÆRLIG',
      'JOBBET_I_MELDEPERIODEN',
      'TIMER_ARBEIDET',
      'STEMMER_OPPLYSNINGENE',
      'KVITTERING',
    ];

    const aktivtStegIndex = steg.indexOf(aktivtSteg);
    const backendStegIndex = steg.indexOf(meldekort.steg);

    return aktivtStegIndex === -1 || aktivtStegIndex > backendStegIndex;
  }

  if (skalRedirecteTilAktivtSteg()) {
    redirect(`/${referanse}/${meldekort.steg}`);
  }

  return (
    <>
      {aktivtSteg === 'BEKREFT_SVARER_ÆRLIG' && <IntroduksjonMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'JOBBET_I_MELDEPERIODEN' && <HarDuArbeidetMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'TIMER_ARBEIDET' && <TimerArbeidetMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'STEMMER_OPPLYSNINGENE' && <StemmerOpplysningeneMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'KVITTERING' && <KvitteringInnsendingMedDataFetching referanse={referanse} />}
    </>
  );
};

export default AktivtStegPage;
