'use client';

import { BodyShort, Heading, Link } from '@navikt/ds-react';
import { Form } from 'components/form/Form';
import { JaEllerNei } from 'lib/utils/form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Meldeperiode } from 'lib/types';
import {useRouter} from "next/navigation";

interface Props {
  meldeperiode: Meldeperiode;
}

interface FormFields {
  godkjent: JaEllerNei;
}

export const Introduksjon = ({ meldeperiode }: Props) => {
  const router = useRouter();

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
    <Form onSubmit={form.handleSubmit(() => router.push(`/${meldeperiode.referanse}/PERIODE`))}>
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
            <Link href={'https://www.nav.no/endringer'}>Les mer om viktigheten av å gi riktige opplysninger</Link>
          </BodyShort>
        </div>

        <FormField form={form} formField={formFields.godkjent} size={'medium'} />
      </section>
    </Form>
  );
};
