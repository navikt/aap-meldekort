'use client';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { slettMockClient } from 'lib/client/clientApi';
import { useRouter } from 'next/navigation';

export const SlettMockButton = () => {
  const router = useRouter();

  return (
    <Button
      icon={<TrashIcon title="a11y-title" fontSize="1.5rem" />}
      onClick={() => {
        slettMockClient();
        router.push('/');
      }}
      variant={'tertiary'}
      size={'medium'}
    >
      Slett mock
    </Button>
  );
};
