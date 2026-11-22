import { test, expect } from '@playwright/test';
import path from 'path';
import { loginAsInternalAdmin } from './helpers/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';

test.describe('LDP-51 Insert RC68 - TC_LDP51_AUTO_005', () => {
  test('TC_LDP51_AUTO_005: Verify Proceed button state interlock (disabled on 0 rows selected, enabled on >=1 rows selected)', async ({ page }) => {
    await loginAsInternalAdmin(page);
    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto();

    const sampleCsv = path.resolve('test-data/TC_LDP51_RES_003/TC_LDP51_RES_003.csv');
    await rc68Page.uploadFile(sampleCsv);
    await rc68Page.clickImport();

    // 1. When 0 rows selected -> Proceed must be disabled
    await expect(rc68Page.proceedButton).toBeDisabled();

    // 2. When 1 row selected -> Proceed must be enabled
    await rc68Page.toggleRowCheckbox(0);
    await expect(rc68Page.proceedButton).toBeEnabled();

    // 3. When unchecked back to 0 -> Proceed must be disabled again
    await rc68Page.toggleRowCheckbox(0);
    await expect(rc68Page.proceedButton).toBeDisabled();
  });
});
