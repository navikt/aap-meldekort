import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MeldekortRequest } from 'lib/types/types';
import { gåTilNesteStegClient } from 'lib/client/clientApi';

export function useLøsStegOgGåTilNesteSteg(referanse: string): {
  isLoading: boolean;
  løsStegOgGåTilNeste: (meldekort: MeldekortRequest) => void;
  errorMessage?: string;
} {
  const router = useRouter();
  const params = useParams<{ system: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const løsStegOgGåTilNeste = async (meldekort: MeldekortRequest) => {
    setIsLoading(true);
    const meldekortResponse = await gåTilNesteStegClient(referanse, meldekort);

    if (!meldekortResponse || meldekortResponse?.feil) {
      setErrorMessage('Kunne ikke gå videre på grunn av: ' + JSON.stringify(meldekortResponse?.feil?.innsendingFeil));
      setIsLoading(false);
    } else {
      console.log('hva skjer her?', meldekortResponse);
      router.push(`/${params.system}/${referanse}/${meldekortResponse?.steg}`);
    }
  };

  return { isLoading, løsStegOgGåTilNeste, errorMessage };
}
