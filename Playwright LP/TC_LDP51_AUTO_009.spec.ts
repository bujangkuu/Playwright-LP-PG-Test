import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { loginAsInternalAdmin } from './helpers/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';

test.describe('LDP-51 Insert RC68 - TC_LDP51_AUTO_009', () => {
  test('TC_LDP51_AUTO_009: Verify CSV file with invalid header / missing required columns is rejected', async ({ page }) => {
    await loginAsInternalAdmin(page);
    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto();

    // Create a temporary corrupted header CSV
    const invalidHeaderCsv = path.resolve('test-data/temp_invalid_header.csv');
    fs.writeFileSync(invalidHeaderCsv, 'WrongCol1,WrongCol2,WrongCol3\n1,2,3');

    try {
      await rc68Page.uploadFile(invalidHeaderCsv);
      if (await rc68Page.importButton.isEnabled()) {
        await rc68Page.clickImport();
      }

      // Assert error notification or alert
      const errorIndicator = page.locator('text="Invalid", text="header", text="format", text="column", [role="alert"]').first();
      await expect(errorIndicator).toBeVisible({ timeout: 5000 });
    } finally {
      if (fs.existsSync(invalidHeaderCsv)) {
        fs.unlinkSync(invalidHeaderCsv);
      }
    }
  });
});
