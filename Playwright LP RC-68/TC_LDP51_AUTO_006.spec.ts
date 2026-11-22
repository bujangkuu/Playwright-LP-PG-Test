import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createRC68CSV } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_006: Table Batch Selection - Master Checkbox Toggle', () => {
  test('Verify Master Checkbox toggle selects and deselects all transaction rows in table', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);

    // Upload & Import CSV with 2 rows
    const csvPath = createRC68CSV([], 'tc_auto_006.csv');
    await rc68Page.uploadFile(csvPath);
    await rc68Page.clickImport();

    const count = await rc68Page.rowCheckboxes.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // 1. Select Master Checkbox
    await rc68Page.selectMasterCheckbox();

    // Verify all row checkboxes are checked
    for (let i = 0; i < count; i++) {
      await expect(rc68Page.rowCheckboxes.nth(i)).toBeChecked();
    }
    await expect(rc68Page.proceedButton).toBeEnabled();

    // 2. Unselect Master Checkbox
    await rc68Page.unselectMasterCheckbox();

    // Verify all row checkboxes are unchecked
    for (let i = 0; i < count; i++) {
      await expect(rc68Page.rowCheckboxes.nth(i)).not.toBeChecked();
    }
    await expect(rc68Page.proceedButton).toBeDisabled();

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_006_master_checkbox.png', fullPage: true });
  });
});
