import { BodyShort, Button, Heading, Link } from '@navikt/ds-react';

import styles from 'components/steg/introduksjon/Introduksjon.module.css';
import { JaEllerNei } from 'lib/utils/form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { ArrowRightIcon } from '@navikt/aksel-icons';

interface FormFields {
  godkjent: JaEllerNei;
}

export const Introduksjon = () => {
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

      <form onSubmit={form.handleSubmit((data) => console.log(data))} className={'flex-column'}>
        <FormField form={form} formField={formFields.godkjent} size={'medium'} />
        <Button icon={<ArrowRightIcon />} iconPosition={'right'} className={styles.button}>
          Neste
        </Button>
      </form>
    </section>
  );
};
