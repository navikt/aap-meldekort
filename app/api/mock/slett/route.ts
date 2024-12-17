import { slettMock } from 'databasemock/meldekort';

export async function GET() {
  try {
    await slettMock();
  } catch (err) {
    console.log('Noe gikk galt i sletting av mock.');
  }
}
