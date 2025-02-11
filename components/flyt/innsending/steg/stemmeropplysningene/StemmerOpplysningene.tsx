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
      <VStack gap={'6'}>
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
          <BodyShort>{`Uke ${hentUkeNummerForPeriode(fraDato, tilDato)}`}</BodyShort>
          <BodyShort>{`${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)}`}</BodyShort>
        </VStack>

        <VStack gap={'1'}>
          <Label>Har du vært i arbeid de siste 14 dagene?</Label>
          <BodyShort>{meldekort.meldekort.harDuJobbet ? 'Ja' : 'Nei'}</BodyShort>
          <MeldekortLenke label={'Endre om du har jobbet disse ukene'} href={`/${referanse}/SPØRSMÅL`} />
        </VStack>
        <VStack gap={'1'}>
          <Label>Har du deltatt på tiltak eller kurs/utdanning de siste 14 dagene?</Label>
          <BodyShort>{meldekort.meldekort.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning ? 'Ja' : 'Nei'}</BodyShort>
          <MeldekortLenke
            label={'Endre om du har deltatt på tiltak eller kurs/utdanning'}
            href={`/${referanse}/SPØRSMÅL`}
          />
        </VStack>
        <VStack gap={'1'}>
          <Label>
            Har du vært forhindret fra å ta arbeid, delta på tiltak eller være arbeidssøker fordi du har vært for syk de
            siste 14 dagene?
          </Label>
          <BodyShort>{meldekort.meldekort.harDuVærtSyk ? 'Ja' : 'Nei'}</BodyShort>
          <MeldekortLenke label={'Endre om du har vært syk'} href={`/${referanse}/SPØRSMÅL`} />
        </VStack>
        <VStack gap={'1'}>
          <Label>
            Har du hatt ferie eller fravær slik at du ikke har kunnet ta arbeid, delta på tiltak eller være arbeidssøker
            de siste 14 dagene?
          </Label>
          <BodyShort>{meldekort.meldekort.harDuHattFerie ? 'Ja' : 'Nei'}</BodyShort>
          <MeldekortLenke label={'Endre om du har hatt ferie'} href={`/${referanse}/SPØRSMÅL`} />
        </VStack>

        {meldekort.meldekort.harDuJobbet && (
          <VStack gap={'1'}>
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
