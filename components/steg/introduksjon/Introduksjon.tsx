'use client';

import { BodyShort, Heading, Link } from '@navikt/ds-react';
import { Form } from 'components/form/Form';
import { JaEllerNei } from 'lib/utils/form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { MeldekortResponse } from 'lib/types/types';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';

interface Props {
  meldekort: MeldekortResponse;
  referanse: string;
}

interface FormFields {
  godkjent: JaEllerNei[];
}

export const Introduksjon = ({ meldekort, referanse }: Props) => {
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const { form, formFields } = useConfigForm<FormFields>({
    godkjent: {
      type: 'checkbox',
      label: 'Er du enig?',
      hideLabel: true,
      options: [{ label: 'Jeg bekrefter at jeg vil fylle ut meldekortet så riktig jeg kan', value: JaEllerNei.Ja }],
      rules: { required: 'Du må bekrefte at du vil fylle ut meldekortet så riktig du kan' },
    },
  });

  return (
    <Form
      referanse={referanse}
      onSubmit={form.handleSubmit(async (data) => {
        løsStegOgGåTilNeste({
          meldekort: { ...meldekort.meldekort, svarerDuSant: data.godkjent.includes(JaEllerNei.Ja) },
          nåværendeSteg: 'BEKREFT_SVARER_ÆRLIG',
        });
      })}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <section className={'flex-column'}>
        <div>
          <BodyShort size={'large'} spacing>
            For å motta AAP må du sende meldekort hver 14. dag.
          </BodyShort>
          <BodyShort size={'large'} spacing>
            På meldekortet må du fylle ut hvor mye du har jobbet.
          </BodyShort>
        </div>

        <div>
          <Heading level={'2'} size={'small'} spacing>
            Takk for at du er ærlig
          </Heading>
          <BodyShort size={'large'} spacing>
            Det er viktig at du gir oss riktige opplysninger.
            <Link href={'https://www.nav.no/endringer'} target={'_blank'}>
              Les mer om viktigheten av å gi riktige opplysninger
            </Link>
          </BodyShort>
        </div>

        <FormField form={form} formField={formFields.godkjent} size={'medium'} />
      </section>
    </Form>
  );
};
