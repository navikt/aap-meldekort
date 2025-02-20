import { SpørsmåLMedDataFetching } from 'components/flyt/steg/spørsmål/SpørsmålMedDataFetching';
import { UtfyllingMedDataFetching } from 'components/flyt/steg/utfylling/UtfyllingMedDataFetching';
import { Steg } from 'lib/types/types';
import { IntroduksjonMedDataFetching } from 'components/flyt/steg/introduksjon/IntroduksjonMedDataFetching';
import { KvitteringMedDataFetching } from 'components/flyt/steg/kvittering/KvitteringMedDataFetching';
import { redirect } from 'i18n/routing';
import { StemmerOpplysningeneMedDataFetching } from 'components/flyt/steg/stemmeropplysningene/StemmerOpplysningeneMedDataFetching';
import { hentUtfylling } from 'lib/services/meldekortservice';

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
  const utfylling = await hentUtfylling(referanse);

  function skalRedirecteTilAktivtSteg() {
    const steg: Steg[] = ['INTRODUKSJON', 'SPØRSMÅL', 'UTFYLLING', 'BEKREFT', 'KVITTERING'];

    const aktivtStegIndex = steg.indexOf(aktivtSteg);
    const backendStegIndex = steg.indexOf(utfylling.tilstand.aktivtSteg);

    return aktivtStegIndex === -1 || aktivtStegIndex > backendStegIndex;
  }

  if (skalRedirecteTilAktivtSteg()) {
    redirect({ href: `/${referanse}/${utfylling.tilstand.aktivtSteg}`, locale: params.locale });
  }

  return (
    <>
      {aktivtSteg === 'INTRODUKSJON' && <IntroduksjonMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'SPØRSMÅL' && <SpørsmåLMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'UTFYLLING' && <UtfyllingMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'BEKREFT' && <StemmerOpplysningeneMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'KVITTERING' && <KvitteringMedDataFetching referanse={referanse} />}
    </>
  );
};

export default AktivtStegPage;
