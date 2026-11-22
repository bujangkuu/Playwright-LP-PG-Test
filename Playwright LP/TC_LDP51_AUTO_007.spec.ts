import { test, expect } from '@playwright/test';
import path from 'path';
import { loginAsInternalAdmin } from './helpers/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';

test.describe('LDP-51 Insert RC68 - TC_LDP51_AUTO_007', () => {
  test('TC_LDP51_AUTO_007: Verify Cancel button resets checked rows and Modal Cancel closes dialog without execution', async ({ page }) => {
    await loginAsInternalAdmin(page);
    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto();

    const sampleCsv = path.resolve('test-data/TC_LDP51_RES_003/TC_LDP51_RES_003.csv');
    await rc68Page.uploadFile(sampleCsv);
    await rc68Page.clickImport();

    // 1. Select row and click Cancel on table
    await rc68Page.toggleRowCheckbox(0);
    await expect(rc68Page.proceedButton).toBeEnabled();
    await rc68Page.cancelButton.click();

    // Proceed should be disabled after table cancel
    await expect(rc68Page.proceedButton).toBeDisabled();

    // 2. Select row, click Proceed to open modal, then click Cancel in modal
    await rc68Page.toggleRowCheckbox(0);
    await rc68Page.clickProceed();
    await expect(rc68Page.confirmModal).toBeVisible();

    await rc68Page.confirmCancel();
    await expect(rc68Page.confirmModal).not.toBeVisible();
  });
});
