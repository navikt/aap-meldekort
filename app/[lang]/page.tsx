'use client';

import { Button, Heading, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <VStack gap={'4'}>
      <Heading size={'large'}>Hva ønsker du å teste?</Heading>
      <div className={'flex-row'}>
        <Button onClick={() => router.push('/arena')}>Arena-meldekort</Button>
        <Button onClick={() => router.push('/kelvin')}>Kelvin-meldekort</Button>
      </div>
    </VStack>
  );
}
