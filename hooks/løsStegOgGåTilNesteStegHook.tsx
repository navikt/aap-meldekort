import { useState } from 'react';
import { EndreUtfyllingRequest } from 'lib/types/types';
import { gåTilNesteStegClient } from 'lib/client/clientApi';
import { useGåTilSteg } from 'lib/utils/url';
import { useRouter } from 'i18n/routing';

export function useLøsStegOgGåTilNesteSteg(referanse: string): {
  isLoading: boolean;
  løsStegOgGåTilNeste: (meldekort: EndreUtfyllingRequest) => void;
  errorMessage?: string;
} {
  const { gåTilSteg } = useGåTilSteg();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const løsStegOgGåTilNeste = async (meldekort: EndreUtfyllingRequest) => {
    setIsLoading(true);
    console.log('kaller løs steg med', meldekort);

    const utfyllingResponse = await gåTilNesteStegClient(referanse, meldekort);

    console.log('Svar fra lagre og gå til neste ', utfyllingResponse);
    if (!utfyllingResponse || utfyllingResponse?.feil) {
      setErrorMessage('Kunne ikke gå videre på grunn av: ' + utfyllingResponse?.feil);
      setIsLoading(false);
    } else {
      gåTilSteg(utfyllingResponse.tilstand.aktivtSteg);
      router.refresh();
    }
  };

  return { isLoading, løsStegOgGåTilNeste, errorMessage };
}
