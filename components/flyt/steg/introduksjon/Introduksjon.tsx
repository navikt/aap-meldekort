'use client';

import { BodyShort, Heading, Link, List } from '@navikt/ds-react';
import { Form } from 'components/form/Form';
import { JaEllerNei } from 'lib/utils/form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { UtfyllingResponse } from 'lib/types/types';

interface Props {
  utfylling: UtfyllingResponse;
  referanse: string;
}

interface FormFields {
  godkjent: JaEllerNei[];
}

export const Introduksjon = ({ utfylling, referanse }: Props) => {
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const { form, formFields } = useConfigForm<FormFields>({
    godkjent: {
      type: 'checkbox',
      label: 'Bekrefter du at du vil fylle ut meldekortet så riktig du kan?',
      hideLabel: true,
      options: [{ label: 'Jeg bekrefter at jeg vil fylle ut meldekortet så riktig jeg kan.', value: JaEllerNei.Ja }],
      rules: { required: 'Du må bekrefte at du vil fylle ut meldekortet så riktig du kan' },
    },
  });

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  return (
    <Form
      onSubmit={form.handleSubmit(async (data) => {
        løsStegOgGåTilNeste({
          nyTilstand: {
            aktivtSteg: 'INTRODUKSJON',
            svar: { ...utfylling.tilstand.svar, vilSvareRiktig: data.godkjent.includes(JaEllerNei.Ja) },
          },
        });
      })}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <section className={'flex-column'}>
        <MeldekortLenke label={'Tilbake'} href={`/`} />
        <div>
          <Heading
            level={'2'}
            size={'medium'}
            spacing
          >{`Meldekort for uke ${hentUkeNummerForPeriode(fraDato, tilDato)}`}</Heading>
          <BodyShort
            size={'large'}
          >{`${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)}`}</BodyShort>
        </div>
        <List size={'medium'}>
          {/*<List.Item>*/}
          {/*  {`Du kan sende dette meldekortet fra ${formaterDatoForFrontend(new Date(utfylling.tidligsteInnsendingsDato))}, og senest ${formaterDatoForFrontend(getSisteInnsendingsdag(new Date(utfylling.tidligsteInnsendingsDato)))} for å unngå trekk i utbetalingen.`}*/}
          {/*</List.Item>*/}
          <List.Item>På meldekortet må du fylle ut hvor mye du har jobbet. </List.Item>
          <List.Item>For å motta AAP må du sende meldekort hver 14. dag.</List.Item>
        </List>

        <div>
          <BodyShort spacing>Det er viktig at du gir oss riktige opplysninger.</BodyShort>
          <Link href={'https://www.nav.no/endringer'} target={'_blank'}>
            Les mer om viktigheten av å gi riktige opplysninger
          </Link>
        </div>

        <FormField form={form} formField={formFields.godkjent} size={'medium'} />
      </section>
    </Form>
  );
};

// function getSisteInnsendingsdag(innsendingDato: Date) {
//   return addDays(innsendingDato, 8);
// }
