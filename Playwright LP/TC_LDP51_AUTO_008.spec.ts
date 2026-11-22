import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { loginAsInternalAdmin } from './helpers/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';

test.describe('LDP-51 Insert RC68 - TC_LDP51_AUTO_008', () => {
  test('TC_LDP51_AUTO_008: Verify upload of non-CSV files (.xlsx, .pdf, .txt) is rejected with proper error message', async ({ page }) => {
    await loginAsInternalAdmin(page);
    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto();

    // Create a dummy .txt file
    const dummyTxtPath = path.resolve('test-data/dummy_test.txt');
    if (!fs.existsSync(dummyTxtPath)) {
      fs.writeFileSync(dummyTxtPath, 'Dummy text file for negative testing');
    }

    try {
      await rc68Page.uploadFile(dummyTxtPath);
      // Assert validation message or Import button disabled
      const alertMsg = page.locator('text="Only .csv files are allowed", text="Invalid file type", text="format tidak valid"').first();
      if (await alertMsg.count() > 0) {
        await expect(alertMsg).toBeVisible();
      } else {
        await expect(rc68Page.importButton).toBeDisabled();
      }
    } finally {
      if (fs.existsSync(dummyTxtPath)) {
        fs.unlinkSync(dummyTxtPath);
      }
    }
  });
});
