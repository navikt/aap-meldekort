import { Steg } from 'lib/types/types';
import { redirect } from 'i18n/routing';
import { hentUtfylling } from 'lib/services/meldekortservice';
import { Introduksjon } from 'components/flyt/steg/introduksjon/Introduksjon';
import { Spørsmål } from 'components/flyt/steg/spørsmål/Spørsmål';
import { Utfylling } from 'components/flyt/steg/utfylling/Utfylling';
import { Bekreft } from 'components/flyt/steg/bekreft/Bekreft';
import { KvitteringMedDataFetching } from 'components/flyt/steg/kvittering/KvitteringMedDataFetching';

interface Props {
  params: Promise<{
    referanse: string;
    aktivtSteg: string;
    innsendingtype: string;
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

    const aktivtStegFinnesIkkeIStegArray = aktivtStegIndex === -1;
    const aktivtStegErLengreFremEnnBackendSteg = aktivtStegIndex > backendStegIndex;

    return aktivtStegFinnesIkkeIStegArray || aktivtStegErLengreFremEnnBackendSteg;
  }

  if (skalRedirecteTilAktivtSteg()) {
    redirect({
      href: `/${params.innsendingtype}/${referanse}/${utfylling.tilstand.aktivtSteg}`,
      locale: params.locale,
    });
  }

  return (
    <>
      {aktivtSteg === 'INTRODUKSJON' && <Introduksjon utfylling={utfylling} />}
      {aktivtSteg === 'SPØRSMÅL' && <Spørsmål utfylling={utfylling} />}
      {aktivtSteg === 'UTFYLLING' && <Utfylling utfylling={utfylling} />}
      {aktivtSteg === 'BEKREFT' && <Bekreft utfylling={utfylling} />}
      {aktivtSteg === 'KVITTERING' && <KvitteringMedDataFetching utfylling={utfylling} />}
    </>
  );
};

export default AktivtStegPage;
