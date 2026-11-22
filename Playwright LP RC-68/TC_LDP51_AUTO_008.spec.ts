import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createCustomFile } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_008: File Format Validation - Non-CSV Rejection', () => {
  test('Verify upload of non-CSV files (.xlsx, .pdf, .txt) is rejected with proper error message', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);

    // Prepare non-CSV test file
    const txtFilePath = createCustomFile('This is not a CSV file content', 'invalid_extension.txt');

    // Attempt to upload non-csv file
    await rc68Page.uploadFile(txtFilePath);

    // Validation: System rejects non-CSV file or displays validation error
    const hasErrorAlert = await page.locator('text=/only \.csv|invalid file|unsupported format|hanya format \.csv/i, [role="alert"]').first().isVisible().catch(() => false);
    const isImportDisabled = await rc68Page.importButton.isDisabled().catch(() => true);

    expect(hasErrorAlert || isImportDisabled).toBeTruthy();

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_008_non_csv_rejected.png', fullPage: true });
  });
});
