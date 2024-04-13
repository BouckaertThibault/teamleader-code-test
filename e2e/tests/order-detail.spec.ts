import { test, expect } from '@playwright/test';
test.describe('orde-detail', () => {
  test('it should click customer Jeroens order, add a screwdriver and palce the order', async ({
    page,
  }) => {
    // Go to page
    await page.goto('http://localhost:4200/');

    // Select Jeroens order
    await page.getByRole('cell', { name: 'Jeroen De Wit' }).click();

    // Add screwdriver
    await page.locator('button').filter({ hasText: 'add' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Product$/ })
      .first()
      .click();
    await page
      .getByRole('option', { name: 'Screwdriver', exact: true })
      .click();
    await page.getByRole('button', { name: 'Add' }).click();

    // Check total price
    await expect(page.getByRole('cell', { name: '78.75' })).toHaveText('78.75');

    // Place order and check confirmation + page url
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.locator('mat-snack-bar-container')).toHaveText(
      'Order 3 with a price total of 78.75 has been placed!'
    );
    await expect(page).toHaveURL('http://localhost:4200/orders');
  });
});
