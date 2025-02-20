import { useState } from 'react';
import { useRouter } from 'i18n/routing';
import { EndreUtfyllingRequest } from 'lib/types/types';
import { gåTilNesteStegClient } from 'lib/client/clientApi';

export function useLøsStegOgGåTilNesteSteg(referanse: string): {
  isLoading: boolean;
  løsStegOgGåTilNeste: (meldekort: EndreUtfyllingRequest) => void;
  errorMessage?: string;
} {
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
      router.push(`/${referanse}/${utfyllingResponse?.tilstand.aktivtSteg}`);
    }
  };

  return { isLoading, løsStegOgGåTilNeste, errorMessage };
}
