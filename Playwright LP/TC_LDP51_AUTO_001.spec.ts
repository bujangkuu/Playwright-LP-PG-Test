import { test, expect } from '@playwright/test';
import path from 'path';
import { loginAsInternalAdmin } from './helpers/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';

test.describe('LDP-51 Insert RC68 - TC_LDP51_AUTO_001', () => {
  test('TC_LDP51_AUTO_001: E2E Happy Path - Upload valid RC68 CSV, select all rows, confirm proceed, and verify execution success', async ({ page }) => {
    // 1. Login as Internal Admin
    await loginAsInternalAdmin(page);

    // 2. Open Insert RC68 page
    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto();

    // 3. Upload valid CSV RC68 file
    const sampleCsv = path.resolve('test-data/TC_LDP51_RES_003/TC_LDP51_RES_003.csv');
    await rc68Page.uploadFile(sampleCsv);

    // 4. Click Import
    await rc68Page.clickImport();

    // 5. Select all transaction rows via Master Checkbox
    await rc68Page.toggleMasterCheckbox();

    // 6. Click Proceed to open Confirm modal dialog
    await rc68Page.clickProceed();
    await expect(page.locator('text="Are you sure you want to process this transactions?"')).toBeVisible();

    // 7. Click Process in Confirm dialog
    await rc68Page.confirmProcess();

    // 8. Assert Success indicators & Popup
    await expect(page.locator('text="Process Completed", text="Execute Insert RC68"').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text="Successful"').first()).toBeVisible();
  });
});
