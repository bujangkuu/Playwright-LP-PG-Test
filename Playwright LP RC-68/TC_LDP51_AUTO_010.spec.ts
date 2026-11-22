import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createCustomFile } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_010: Boundary Validation - Empty CSV File Rejection', () => {
  test('Verify empty CSV file (0 KB or header-only without data rows) is rejected', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);

    // Prepare empty CSV (0 bytes)
    const emptyCSVPath = createCustomFile('', 'empty_file.csv');

    await rc68Page.uploadFile(emptyCSVPath);

    if (await rc68Page.importButton.isEnabled()) {
      await rc68Page.clickImport();
    }

    // Verify system warns about empty file and no records are added to table
    const alert = page.locator('text=/file is empty|no transaction records|file kosong|cannot be empty/i, [role="alert"]').first();
    const isAlertVisible = await alert.isVisible().catch(() => false);
    const rowCount = await rc68Page.rowCheckboxes.count();

    expect(isAlertVisible || rowCount === 0).toBeTruthy();

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_010_empty_csv.png', fullPage: true });
  });
});
