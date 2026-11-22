import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createCustomFile } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_009: Header Structure Validation - Missing Mandatory Columns', () => {
  test('Verify CSV file with invalid header / missing mandatory columns is rejected', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);

    // Prepare CSV with incomplete header (missing RRN, MID, NMID, MTN)
    const incompleteHeaderCSV = 'Date,Time,Terminal_ID,Merchant_PAN,Amount\r\n15/09/2026,08:00:00,A01,936000010000000001,50000';
    const csvPath = createCustomFile(incompleteHeaderCSV, 'invalid_header.csv');

    // Upload file
    await rc68Page.uploadFile(csvPath);

    if (await rc68Page.importButton.isEnabled()) {
      await rc68Page.clickImport();
    }

    // Verify rejection alert or error message
    const errorAlert = page.locator('text=/invalid header|required 10 columns|missing required columns|kolom tidak lengkap/i, [role="alert"], [class*="error" i]').first();
    const isErrorVisible = await errorAlert.isVisible().catch(() => false);
    const tableRows = await rc68Page.rowCheckboxes.count();

    expect(isErrorVisible || tableRows === 0).toBeTruthy();

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_009_invalid_header.png', fullPage: true });
  });
});
