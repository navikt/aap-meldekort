import { slettMock } from 'databasemock/meldekort';

export async function GET() {
  await slettMock();
}
