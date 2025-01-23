import { slettMock } from 'databasemock/databasemock';

export async function GET() {
  await slettMock();
}
