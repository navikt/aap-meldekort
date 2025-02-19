import { hentHistoriskMeldeperiodeDetaljer } from 'lib/services/meldekortservice';
import { BodyShort, VStack } from '@navikt/ds-react';

interface Props {
  searchParams: Promise<{ fom: string; tom: string }>;
}

export default async function HistoriskMeldekortPage(props: Props) {
  const searchParams = await props.searchParams;

  const hisotriskMeldekortDetaljer = await hentHistoriskMeldeperiodeDetaljer(searchParams);

  return (
    <VStack gap={'8'}>
      <BodyShort weight={'semibold'}>Her skal vi lage noe kult med disse dataene: </BodyShort>
      <BodyShort>{JSON.stringify(hisotriskMeldekortDetaljer)}</BodyShort>
    </VStack>
  );
}
