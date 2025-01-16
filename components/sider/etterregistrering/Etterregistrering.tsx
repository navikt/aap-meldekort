'use client';

import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { Meldeperiode } from 'lib/types/types';
import { LinkPanel } from 'components/linkpanel/LinkPanel';
import { useParams } from 'next/navigation';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  ettersendinger?: Meldeperiode[];
}

export const Etterregistrering = ({ ettersendinger }: Props) => {
  const params = useParams();

  return (
    <VStack gap={'4'}>
      <Heading size={'medium'} level={'2'} spacing>
        Etterregistrering av meldekort
      </Heading>
      <BodyShort>
        Her kan du se alle tilgjengelige meldekort som kan sendes inn. Du kan fylle ut meldekort ved å klikke på
        oversikten under.
      </BodyShort>

      {ettersendinger && ettersendinger.length > 0 ? (
        <div>
          {ettersendinger.map((meldeperiode) => {
            return (
              <LinkPanel
                key={meldeperiode.meldekortId}
                title={`Send meldekort for perioden (${formaterDatoForFrontend(meldeperiode.periode.fom)} - ${formaterDatoForFrontend(meldeperiode.periode.tom)})`}
                href={`/${params.system}/${meldeperiode.meldekortId}`}
              />
            );
          })}
        </div>
      ) : (
        <Alert variant={'info'}>Du har ingen tilgjengelige meldekort</Alert>
      )}
    </VStack>
  );
};
