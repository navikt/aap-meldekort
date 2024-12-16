import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MeldekortRequest } from 'lib/types/types';
import { gåTilNesteStegClient } from 'lib/client/clientApi';

export function useLøsStegOgGåTilNesteSteg(referanse: string): {
  isLoading: boolean;
  løsStegOgGåTilNeste: (meldekort: MeldekortRequest) => void;
  errorMessage?: string;
} {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const løsStegOgGåTilNeste = async (meldekort: MeldekortRequest) => {
    setIsLoading(true);
    const meldekortResponse = await gåTilNesteStegClient(referanse, meldekort);

    if (meldekortResponse) {
      router.push(`/${referanse}/${meldekortResponse.steg}`);
    } else {
      setErrorMessage('Kunne ikke gå videre til neste steg. Prøv igjen.');
    }
  };

  return { isLoading, løsStegOgGåTilNeste, errorMessage };
}
