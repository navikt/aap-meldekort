import { expect, test } from '@playwright/test';

test('Applikasjonen starter', async ({ page }) => {
  await page.goto('http://localhost:3000/aap/meldekort');

  await expect(page).toHaveTitle(/^AAP Meldekort$/);
  await expect(page.getByRole('heading', { name: 'Meldekort for AAP', level: 1 })).toBeVisible();
  await expect(
    page.getByText(
      'For å motta AAP må du sende meldekort hver 14. dag. På meldekortet må du fylle ut hvor mange timer du har arbeidet.'
    )
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /^Fyll ut meldekort for uke 6 og 7/ })).toBeVisible();
});
