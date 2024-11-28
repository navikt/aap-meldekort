import { Meldeperiode } from 'lib/types';

export async function GET() {
  try {
    const meldeperiode: Meldeperiode = {
      referanse: 'hetf3-gekdt5-joeh6-jdjfk7',
      periode: { fom: '2024-11-11', tom: '2024-11-24' },
    };

    return new Response(JSON.stringify(meldeperiode), { status: 200 });
  } catch (error) {
    console.log('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
