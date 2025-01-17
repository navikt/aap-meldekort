import { InnsendteMeldekort, InnsendteMeldekortType } from 'components/sider/innsendtemeldekort/InnsendteMeldekort';

export default async function InnsendtPage() {
  const innsendteMeldekort: InnsendteMeldekortType = {
    meldekort: {
      periode: { fom: '2024-11-18', tom: '2024-12-01' },
      meldekort: {
        timerArbeidet: [
          { dato: '2024-11-18', timer: 5 },
          { dato: '2024-11-19' },
          { dato: '2024-11-20' },
          { dato: '2024-11-21', timer: 8 },
          { dato: '2024-11-22' },
          { dato: '2024-11-23' },
          { dato: '2024-11-24' },
          { dato: '2024-11-25' },
          { dato: '2024-11-26' },
          { dato: '2024-11-27' },
          { dato: '2024-11-28' },
          { dato: '2024-11-29' },
          { dato: '2024-11-30' },
          { dato: '2024-12-01' },
        ],
      },
      steg: 'TIMER_ARBEIDET',
    },
    meldeperiode: {
      kanEndres: false,
      klarForInnsending: false,
      meldekortId: 1234567,
      periode: { fom: '2024-11-18', tom: '2024-12-01' },
      type: 'VANLIG',
    },
  };

  return <InnsendteMeldekort innsendteMeldeperioder={[innsendteMeldekort]} />;
}
