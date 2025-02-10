import { SpRsmLMedDataFetching } from 'components/flyt/innsending/steg/spørsmål/SpørsmålMedDataFetching';
import { UtfyllingMedDataFetching } from 'components/flyt/innsending/steg/utfylling/UtfyllingMedDataFetching';
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
    const steg: Steg[] = ['BEKREFT_SVARER_ÆRLIG', 'SPØRSMÅL', 'UTFYLLING', 'STEMMER_OPPLYSNINGENE', 'KVITTERING'];

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
      {aktivtSteg === 'SPØRSMÅL' && <SpRsmLMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'UTFYLLING' && <UtfyllingMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'STEMMER_OPPLYSNINGENE' && <StemmerOpplysningeneMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'KVITTERING' && <KvitteringInnsendingMedDataFetching referanse={referanse} />}
    </>
  );
};

export default AktivtStegPage;
