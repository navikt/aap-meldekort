import { SpRsmLMedDataFetching } from 'components/flyt/steg/spørsmål/SpørsmålMedDataFetching';
import { UtfyllingMedDataFetching } from 'components/flyt/steg/utfylling/UtfyllingMedDataFetching';
import { Steg } from 'lib/types/types';
import { IntroduksjonMedDataFetching } from 'components/flyt/steg/introduksjon/IntroduksjonMedDataFetching';
import { KvitteringMedDataFetching } from 'components/flyt/steg/kvittering/KvitteringMedDataFetching';
import { hentMeldekort } from 'lib/services/meldekortservice';
import { redirect } from 'i18n/routing';
import { StemmerOpplysningeneMedDataFetching } from 'components/flyt/steg/stemmeropplysningene/StemmerOpplysningeneMedDataFetching';

interface Props {
  params: Promise<{
    referanse: string;
    aktivtSteg: string;
    locale: string;
  }>;
}

const AktivtStegPage = async (props: Props) => {
  const params = await props.params;
  const aktivtSteg = decodeURI(params.aktivtSteg) as Steg;
  const referanse = params.referanse;
  const meldekort = await hentMeldekort(referanse);

  function skalRedirecteTilAktivtSteg() {
    const steg: Steg[] = [
      'INTRODUKSJON',
      'SPØRSMÅL',
      'UTFYLLING',
      'STEMMER_OPPLYSNINGENE',
      'INNSENDING_VANLIG_MELDEKKORT',
      'KVITTERING',
    ];

    const aktivtStegIndex = steg.indexOf(aktivtSteg);
    const backendStegIndex = steg.indexOf(meldekort.steg);

    return aktivtStegIndex === -1 || aktivtStegIndex > backendStegIndex;
  }

  if (skalRedirecteTilAktivtSteg()) {
    redirect({ href: `/${referanse}/${meldekort.steg}`, locale: params.locale });
  }

  return (
    <>
      {aktivtSteg === 'INTRODUKSJON' && <IntroduksjonMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'SPØRSMÅL' && <SpRsmLMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'UTFYLLING' && <UtfyllingMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'STEMMER_OPPLYSNINGENE' && <StemmerOpplysningeneMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'KVITTERING' && <KvitteringMedDataFetching referanse={referanse} />}
    </>
  );
};

export default AktivtStegPage;
