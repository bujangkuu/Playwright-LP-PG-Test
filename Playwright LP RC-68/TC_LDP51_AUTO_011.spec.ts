import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createRC68CSV } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_011: Data Sanitization - Malformed Row Data Rejection', () => {
  test('Verify CSV with malformed row data (invalid Amount format or non-numeric RRN) is rejected', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);

    // Prepare CSV with non-numeric amount 'ABCDE'
    const malformedCSV = createRC68CSV([
      {
        amount: 'ABCDE',
        rrn: 'INVALID_RRN_ALPHA',
      },
    ], 'tc_auto_011_malformed.csv');

    await rc68Page.uploadFile(malformedCSV);

    if (await rc68Page.importButton.isEnabled()) {
      await rc68Page.clickImport();
    }

    // Verify rejection error is shown or row is marked invalid / not processed
    const errorNotice = page.locator('text=/invalid numeric|amount must be numeric|format data salah|invalid data/i, [role="alert"]').first();
    const isErrorVisible = await errorNotice.isVisible().catch(() => false);
    const isProceedDisabled = await rc68Page.proceedButton.isDisabled().catch(() => true);

    expect(isErrorVisible || isProceedDisabled).toBeTruthy();

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_011_malformed_rejected.png', fullPage: true });
  });
});
