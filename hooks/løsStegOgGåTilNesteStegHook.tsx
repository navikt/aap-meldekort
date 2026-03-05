import { useState } from 'react';
import { EndreUtfyllingRequest } from 'lib/types/types';
import { gåTilNesteStegClient } from 'lib/client/clientApi';
import { useGåTilSteg } from 'lib/utils/url';
import { useRouter } from 'i18n/routing';
import { isSuccess } from 'lib/utils/api';

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

    const utfyllingResponse = await gåTilNesteStegClient(referanse, meldekort);

    if (isSuccess(utfyllingResponse)) {
      gåTilSteg(utfyllingResponse.data.tilstand.aktivtSteg);
      router.refresh();
    } else {
      setErrorMessage('Kunne ikke gå videre på grunn av: ' + utfyllingResponse?.apiException.message);
      setIsLoading(false);
    }
  };

  return { isLoading, løsStegOgGåTilNeste, errorMessage };
}
