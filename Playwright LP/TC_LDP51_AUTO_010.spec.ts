import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { loginAsInternalAdmin } from './helpers/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';

test.describe('LDP-51 Insert RC68 - TC_LDP51_AUTO_010', () => {
  test('TC_LDP51_AUTO_010: Verify empty CSV file (0 KB or header-only without data rows) is rejected', async ({ page }) => {
    await loginAsInternalAdmin(page);
    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto();

    // Create 0 KB empty CSV
    const emptyCsv = path.resolve('test-data/temp_empty.csv');
    fs.writeFileSync(emptyCsv, '');

    try {
      await rc68Page.uploadFile(emptyCsv);
      const isImportEnabled = await rc68Page.importButton.isEnabled();
      if (isImportEnabled) {
        await rc68Page.clickImport();
      }

      // Assert error indicator or that Import remains disabled / empty state
      const emptyAlert = page.locator('text="empty", text="no data", text="kosong", [role="alert"]').first();
      if (await emptyAlert.count() > 0) {
        await expect(emptyAlert).toBeVisible();
      } else {
        expect(isImportEnabled).toBe(false);
      }
    } finally {
      if (fs.existsSync(emptyCsv)) {
        fs.unlinkSync(emptyCsv);
      }
    }
  });
});
