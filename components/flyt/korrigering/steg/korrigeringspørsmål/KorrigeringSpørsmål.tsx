'use client';

import { Form } from 'components/form/Form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { BodyShort, Heading, HGrid } from '@navikt/ds-react';
import { formaterDatoForFrontend, hentUkeNummerForDato } from 'lib/utils/date';
import { useRouter, useSearchParams } from 'next/navigation';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';

interface FormFields {
  harDuJobbet: JaEllerNei;
  harDuGjennomførtAvtaltAktivitetKursEllerUtdanning: JaEllerNei;
  harDuVærtSyk: JaEllerNei;
  harDuHattFerie: JaEllerNei;
}

export const KorrigeringSpørsmål = () => {
  const { korrigering, setKorrigering } = useKorrigerMeldekort();
  const searchParams = useSearchParams();

  const { form, formFields } = useConfigForm<FormFields>({
    harDuJobbet: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(korrigering.meldekort.harDuJobbet),
      label: 'Har du arbeidet i perioden?',
      rules: { required: 'Du må svare på om du har arbeidet i perioden' },
    },
    harDuVærtSyk: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(korrigering.meldekort.harDuVærtSyk),
      label: 'Har du vært forhindret fra å ta arbeid eller gjennomføre avtalt aktivitet fordi du har vært for syk?',
      rules: {
        required:
          'Du må svare på om du har vært forhindret fra å ta arbeid eller gjennomføre avtalt aktivitet fordi du har vært for syk',
      },
    },
    harDuHattFerie: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(korrigering.meldekort.harDuHattFerie),
      label: 'Har du hatt ferie eller fravær slik at du ikke har kunnet ta arbeid eller gjennomføre avtalt aktivitet?',
      rules: {
        required:
          'Du må svar på om du har hatt ferie eller fravær slik at du ikke har kunnet ta arbeid eller gjennomføre avtalt aktivitet',
      },
    },
    harDuGjennomførtAvtaltAktivitetKursEllerUtdanning: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(korrigering.meldekort.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning),
      label: 'Har du gjennomført avtalt aktivitet eller deltatt på kurs/utdanning?',
      rules: { required: 'Du må svare på om du har gjennomført avtalt aktivitet eller deltatt på kurs/utdanning?' },
    },
  });

  const fraDato = new Date(korrigering.meldekort.meldeperiode.fom);
  const tilDato = new Date(korrigering.meldekort.meldeperiode.fom);

  const router = useRouter();

  return (
    <Form
      forrigeStegKnappTekst={'Avbryt'}
      forrigeStegOnClick={() => router.push(`/innsendt/periode?${searchParams}`)}
      isLoading={false}
      onSubmit={form.handleSubmit((data) => {
        const skalFylleUtNoe = [
          data.harDuJobbet,
          data.harDuHattFerie,
          data.harDuVærtSyk,
          data.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning,
        ].includes(JaEllerNei.Ja);
        setKorrigering({
          ...korrigering,
          steg: skalFylleUtNoe ? 'FYLL_TIMER' : 'SE_OVER_TIMER',
          endrerMeldekort: true,
          meldekort: {
            ...korrigering.meldekort,
            harDuVærtSyk: data.harDuVærtSyk === JaEllerNei.Ja,
            harDuHattFerie: data.harDuHattFerie === JaEllerNei.Ja,
            harDuJobbet: data.harDuJobbet === JaEllerNei.Ja,
            harDuGjennomførtAvtaltAktivitetKursEllerUtdanning:
              data.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning === JaEllerNei.Ja,
          },
        });
      })}
    >
      <HGrid gap={'8'}>
        <MeldekortLenke label={'Tilbake'} href={`/innsendt/periode?${searchParams}`} />
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
