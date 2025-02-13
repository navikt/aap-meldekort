'use client';

import { Form } from 'components/form/Form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { BodyShort, Heading, HGrid } from '@navikt/ds-react';
import { formaterDatoForFrontend, hentUkeNummerForDato } from 'lib/utils/date';
import { MeldekortResponse } from 'lib/types/types';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { useRouter } from 'next/navigation';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';

interface Props {
  meldekort: MeldekortResponse;
  referanse: string;
}

interface FormFields {
  harDuJobbet: JaEllerNei;
  harDuGjennomførtAvtaltAktivitetKursEllerUtdanning: JaEllerNei;
  harDuVærtSyk: JaEllerNei;
  harDuHattFerie: JaEllerNei;
}

export const SpRsmL = ({ meldekort, referanse }: Props) => {
  const { isLoading, løsStegOgGåTilNeste, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const { form, formFields } = useConfigForm<FormFields>({
    harDuJobbet: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(meldekort.meldekort.harDuJobbet),
      label: 'Har du arbeidet i perioden?',
      rules: { required: 'Du må svare på om du har arbeidet i perioden' },
    },
    harDuVærtSyk: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(meldekort.meldekort.harDuVærtSyk),
      label: 'Har du vært forhindret fra å ta arbeid eller gjennomføre avtalt aktivitet fordi du har vært for syk?',
      rules: {
        required:
          'Du må svare på om du har vært forhindret fra å ta arbeid eller gjennomføre avtalt aktivitet fordi du har vært for syk',
      },
    },
    harDuHattFerie: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(meldekort.meldekort.harDuHattFerie),
      label: 'Har du hatt ferie eller fravær slik at du ikke har kunnet ta arbeid eller gjennomføre avtalt aktivitet?',
      rules: {
        required:
          'Du må svar på om du har hatt ferie eller fravær slik at du ikke har kunnet ta arbeid eller gjennomføre avtalt aktivitet',
      },
    },
    harDuGjennomførtAvtaltAktivitetKursEllerUtdanning: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(meldekort.meldekort.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning),
      label: 'Har du gjennomført avtalt aktivitet eller deltatt på kurs/utdanning?',
      rules: { required: 'Du må svare på om du har gjennomført avtalt aktivitet eller deltatt på kurs/utdanning?' },
    },
  });

  const fraDato = new Date(meldekort.periode.fom);
  const tilDato = new Date(meldekort.periode.tom);

  const router = useRouter();

  return (
    <Form
      forrigeStegOnClick={() => router.push(`/${referanse}/BEKREFT_SVARER_ÆRLIG`)}
      onSubmit={form.handleSubmit(async (data) => {
        løsStegOgGåTilNeste({
          meldekort: {
            ...meldekort.meldekort,
            harDuJobbet: data.harDuJobbet === JaEllerNei.Ja,
            harDuGjennomførtAvtaltAktivitetKursEllerUtdanning:
              data.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning === JaEllerNei.Ja,
            harDuVærtSyk: data.harDuVærtSyk === JaEllerNei.Ja,
            harDuHattFerie: data.harDuHattFerie === JaEllerNei.Ja,
            dager: meldekort.meldekort.dager.map((dag) => {
              return {
                dato: dag.dato,
                timerArbeidet: data.harDuJobbet === JaEllerNei.Nei ? 0 : dag.timerArbeidet,
                harVærtPåFerie: data.harDuHattFerie === JaEllerNei.Ja ? dag.harVærtPåFerie : undefined,
                harVærtSyk: data.harDuVærtSyk === JaEllerNei.Ja ? dag.harVærtSyk : undefined,
                harVærtPåtiltakKursEllerUtdanning:
                  data.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning === JaEllerNei.Ja
                    ? dag.harVærtPåtiltakKursEllerUtdanning
                    : undefined,
              };
            }),
          },
          nåværendeSteg: 'SPØRSMÅL',
        });
      })}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <HGrid gap={'8'}>
        <MeldekortLenke label={'Tilbake'} href={`/${referanse}/BEKREFT_SVARER_ÆRLIG`} />
        <div>
          <Heading level={'2'} size={'medium'}>
            {`Arbeid i uke ${hentUkeNummerForDato(fraDato)} og ${hentUkeNummerForDato(tilDato)}`}
          </Heading>
          <BodyShort>{`${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)}`}</BodyShort>
        </div>
        <FormField form={form} formField={formFields.harDuJobbet} size={'medium'} />
        <FormField
          form={form}
          formField={formFields.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning}
          size={'medium'}
        />
        <FormField form={form} formField={formFields.harDuVærtSyk} size={'medium'} />
        <FormField form={form} formField={formFields.harDuHattFerie} size={'medium'} />
      </HGrid>
    </Form>
  );
};
