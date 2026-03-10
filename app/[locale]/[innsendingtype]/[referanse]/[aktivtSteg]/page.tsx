import { Steg, UtfyllingResponse } from 'lib/types/types';
import { redirect, routing } from 'i18n/routing';
import { hentUtfylling } from 'lib/services/meldekortservice';
import { Introduksjon } from 'components/flyt/steg/introduksjon/Introduksjon';
import { Spørsmål } from 'components/flyt/steg/spørsmål/Spørsmål';
import { Utfylling } from 'components/flyt/steg/utfylling/Utfylling';
import { Bekreft } from 'components/flyt/steg/bekreft/Bekreft';
import { KvitteringMedDataFetching } from 'components/flyt/steg/kvittering/KvitteringMedDataFetching';
import { isError, isSuccess, SuccessResponseBody } from 'lib/utils/api';
import { Alert } from '@navikt/ds-react';

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

  if (isError(utfylling)) {
    if (utfylling.status === 404) {
      return redirect({ href: '/', locale: routing.defaultLocale });
    } else {
      return <Alert variant="error">En ukjent feil oppsto. Prøv igjen om litt.</Alert>;
    }
  }

  function skalRedirecteTilAktivtSteg() {
    const steg: StegTuple = alleSteg;

    const aktivtStegIndex = steg.indexOf(aktivtSteg);
    const backendStegIndex = steg.indexOf(
      (utfylling as SuccessResponseBody<UtfyllingResponse>).data.tilstand.aktivtSteg
    );

    const aktivtStegFinnesIkkeIStegArray = aktivtStegIndex === -1;
    const aktivtStegErLengreFremEnnBackendSteg = aktivtStegIndex > backendStegIndex;

    return aktivtStegFinnesIkkeIStegArray || aktivtStegErLengreFremEnnBackendSteg;
  }

  if (isSuccess(utfylling) && skalRedirecteTilAktivtSteg()) {
    redirect({
      href: `/${params.innsendingtype}/${referanse}/${utfylling.data.tilstand.aktivtSteg}`,
      locale: params.locale,
    });
  }

  return (
    <>
      {aktivtSteg === 'INTRODUKSJON' && <Introduksjon utfylling={utfylling.data} />}
      {aktivtSteg === 'SPØRSMÅL' && <Spørsmål utfylling={utfylling.data} />}
      {aktivtSteg === 'UTFYLLING' && <Utfylling utfylling={utfylling.data} />}
      {aktivtSteg === 'BEKREFT' && <Bekreft utfylling={utfylling.data} />}
      {aktivtSteg === 'KVITTERING' && <KvitteringMedDataFetching utfylling={utfylling.data} />}
    </>
  );
};

export default AktivtStegPage;
