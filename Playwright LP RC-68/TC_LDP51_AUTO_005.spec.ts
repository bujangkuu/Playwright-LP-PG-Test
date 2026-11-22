import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createRC68CSV } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_005: UI Interlock - Proceed Button State', () => {
  test('Verify Proceed button state interlock (disabled on 0 rows selected, enabled on >=1 rows selected)', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);

    // Upload & import CSV to populate table
    const csvPath = createRC68CSV([], 'tc_auto_005.csv');
    await rc68Page.uploadFile(csvPath);
    await expect(rc68Page.importButton).toBeEnabled({ timeout: 10000 });
    await rc68Page.clickImport();
    await expect(rc68Page.rowCheckboxes.first()).toBeVisible({ timeout: 15000 });

    // 1. Initial State (0 rows checked): Uncheck all rows, Proceed button must be disabled
    await rc68Page.unselectMasterCheckbox();
    await expect(rc68Page.proceedButton).toBeDisabled();

    // 2. Select 1 row: Proceed button must become enabled
    await rc68Page.selectRow(0);
    await expect(rc68Page.proceedButton).toBeEnabled();

    // 3. Unselect row: Proceed button must return to disabled
    await rc68Page.unselectRow(0);
    await expect(rc68Page.proceedButton).toBeDisabled();

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_005_proceed_interlock.png', fullPage: true });
  });
});
