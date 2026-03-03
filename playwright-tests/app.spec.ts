import { expect, test } from '@playwright/test';
import * as tekst from 'messages/nb.json';

test('Applikasjonen starter', async ({ page }) => {
  await page.goto('http://localhost:3000/aap/meldekort');
  await expect(page).toHaveTitle(/^AAP Meldekort$/);
  await expect(page.getByRole('heading', { name: 'Meldekort for AAP', level: 1 })).toBeVisible();
  await expect(page.getByText(tekst.default.client.oversikt.mottaAAP)).toBeVisible();
  await expect(page.getByRole('button', { name: /^Fyll ut meldekort for uke 6 og 7/ })).toBeVisible();
});
