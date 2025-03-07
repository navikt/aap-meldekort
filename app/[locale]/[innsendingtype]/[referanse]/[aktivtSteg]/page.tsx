import { SpørsmåLMedDataFetching } from 'components/flyt/steg/spørsmål/SpørsmålMedDataFetching';
import { UtfyllingMedDataFetching } from 'components/flyt/steg/utfylling/UtfyllingMedDataFetching';
import { Steg } from 'lib/types/types';
import { IntroduksjonMedDataFetching } from 'components/flyt/steg/introduksjon/IntroduksjonMedDataFetching';
import { KvitteringMedDataFetching } from 'components/flyt/steg/kvittering/KvitteringMedDataFetching';
import { redirect } from 'i18n/routing';
import { BekreftMedDataFetching } from 'components/flyt/steg/bekreft/BekreftMedDataFetching';
import { hentUtfylling } from 'lib/services/meldekortservice';

interface Props {
  params: Promise<{
    referanse: string;
    aktivtSteg: string;
    locale: string;
  }>;
}

/**
 * Denne må være lik rekkefølgen for flyten for innsending/korrigering.
 * Lager en tuple slik at typescript sier i fra dersom steg endrer seg.
 */
const alleSteg = ['INTRODUKSJON', 'SPØRSMÅL', 'UTFYLLING', 'BEKREFT', 'KVITTERING'] as const;
type StegTuple = typeof alleSteg;

const AktivtStegPage = async (props: Props) => {
  const params = await props.params;
  const aktivtSteg = decodeURI(params.aktivtSteg) as Steg;
  const referanse = params.referanse;
  const utfylling = await hentUtfylling(referanse);

  function skalRedirecteTilAktivtSteg() {
    const steg: StegTuple = alleSteg;

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
      {aktivtSteg === 'BEKREFT' && <BekreftMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'KVITTERING' && <KvitteringMedDataFetching referanse={referanse} />}
    </>
  );
};

export default AktivtStegPage;
