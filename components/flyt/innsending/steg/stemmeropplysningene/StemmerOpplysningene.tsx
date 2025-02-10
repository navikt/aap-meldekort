'use client';

import { MeldekortResponse } from 'lib/types/types';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { JaEllerNei } from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { BodyShort, Heading, Label, VStack } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { useRouter } from 'next/navigation';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { regnUtProsent, regnUtTimer } from 'lib/utils/meldekort';

interface Props {
  referanse: string;
  meldekort: MeldekortResponse;
}

interface FormFields {
  opplysningerStemmer: JaEllerNei[];
}

export const StemmerOpplysningene = ({ referanse, meldekort }: Props) => {
  const router = useRouter();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const { form, formFields } = useConfigForm<FormFields>({
    opplysningerStemmer: {
      type: 'checkbox',
      label: 'Bekreft at opplysningene stemmer',
      hideLabel: true,
      options: [{ label: 'Jeg bekrefter at disse opplysningene stemmer', value: JaEllerNei.Ja }],
      rules: { required: 'Du må bekrefte at disse opplysningene stemmer' },
    },
  });

  const fraDato = new Date(meldekort.periode.fom);
  const tilDato = new Date(meldekort.periode.tom);

  const timer = regnUtTimer(meldekort.meldekort.dager);

  return (
    <Form
      forrigeStegOnClick={() =>
        router.push(`/${referanse}/${meldekort.meldekort.harDuJobbet ? 'UTFYLLING' : 'SPØRSMÅL'}`)
      }
      nesteStegKnappTekst={'Send inn'}
      onSubmit={form.handleSubmit(async () => {
        løsStegOgGåTilNeste({
          meldekort: {
            ...meldekort.meldekort,
            stemmerOpplysningene: true,
          },
          nåværendeSteg: 'STEMMER_OPPLYSNINGENE',
        });
      })}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <VStack gap={'8'}>
        <MeldekortLenke
          label={'Tilbake'}
          href={`/${referanse}/${meldekort.meldekort.harDuJobbet ? 'UTFYLLING' : 'SPØRSMÅL'}`}
        />
        <Heading size={'large'} level={'2'} spacing>
          Se over og send inn meldekort
        </Heading>

        <BodyShort spacing>
          Se over opplysningene på meldekortet ditt og pass på at alt er riktig før du sender inn.
        </BodyShort>

        <VStack gap={'2'}>
          <Heading size={'small'} level={'3'}>
            Jobb
          </Heading>
          <BodyShort>{`Uke ${hentUkeNummerForPeriode(fraDato, tilDato)}`}</BodyShort>
          <BodyShort>{`${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)}`}</BodyShort>
          <Label>Har du jobbet noe i disse ukene?</Label>
          <BodyShort>{meldekort.meldekort.harDuJobbet ? 'Ja' : 'Nei'}</BodyShort>
          <MeldekortLenke label={'Endre om du har jobbet disse ukene'} href={`/${referanse}/SPØRSMÅL`} />
        </VStack>

        {meldekort.meldekort.harDuJobbet && (
          <VStack gap={'2'}>
            <OppsummeringKalender
              heading={'Arbeidstimer'}
              dager={meldekort.meldekort.dager}
              periode={meldekort.periode}
            />
            <div>
              <Label>Sammenlagt jobb i de to ukene:</Label>
              <BodyShort>{timer} timer</BodyShort>
              <BodyShort>{`(${regnUtProsent(timer)}%)`}</BodyShort>
            </div>
            <MeldekortLenke label={'Endre antall timer du har jobbet'} href={`/${referanse}/UTFYLLING`} />
          </VStack>
        )}

        <FormField form={form} formField={formFields.opplysningerStemmer} size={'medium'} />
      </VStack>
    </Form>
  );
};
