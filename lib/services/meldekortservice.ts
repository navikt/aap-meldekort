import { fetcher } from 'lib/services/fetchProxy';
import { InnsendingMeldeperiode, Meldeperiode } from 'lib/types';

const meldeKortBaseUrl = process.env.BEHANDLING_API_BASE_URL;

const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';

export async function hentMeldeperioder(): Promise<Meldeperiode[]> {
  if (isLocal()) {
    return [
      {
        referanse: 'hetf3-gekdt5-joeh6-jdjfk7',
        periode: { fom: '2024-11-11', tom: '2024-11-24' },
      },
    ];
  }
  const url = `${meldeKortBaseUrl}/api/meldeperioder`;
  return fetcher<Meldeperiode[]>(url, 'GET');
}

export async function hentMeldeperiode(): Promise<Meldeperiode> {
  if (isLocal()) {
    return {
      referanse: 'hetf3-gekdt5-joeh6-jdjfk7',
      periode: { fom: '2024-11-11', tom: '2024-11-24' },
    };
  }
  const url = `${meldeKortBaseUrl}/api/meldeperiode`;
  return fetcher<Meldeperiode>(url, 'GET');
}

export async function sendInnMeldekort(meldeperiode: InnsendingMeldeperiode) {
  const url = `${meldeKortBaseUrl}/api/meldeperioder`;
  return fetcher(url, 'POST', meldeperiode);
}
