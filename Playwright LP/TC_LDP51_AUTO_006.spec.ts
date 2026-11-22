import { test, expect } from '@playwright/test';
import path from 'path';
import { loginAsInternalAdmin } from './helpers/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';

test.describe('LDP-51 Insert RC68 - TC_LDP51_AUTO_006', () => {
  test('TC_LDP51_AUTO_006: Verify Master Checkbox toggle selects and deselects all transaction rows in table', async ({ page }) => {
    await loginAsInternalAdmin(page);
    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto();

    const sampleCsv = path.resolve('test-data/TC_LDP51_RES_003/TC_LDP51_RES_003.csv');
    await rc68Page.uploadFile(sampleCsv);
    await rc68Page.clickImport();

    // 1. Toggle master checkbox -> All row checkboxes should be checked
    await rc68Page.toggleMasterCheckbox();
    const checkedCount1 = await page.locator('tbody input[type="checkbox"]:checked, tbody button[role="checkbox"][data-state="checked"]').count();
    const totalRows = await rc68Page.tableRows.count();
    expect(checkedCount1).toBe(totalRows);

    // 2. Toggle master checkbox again -> All row checkboxes should be unchecked
    await rc68Page.toggleMasterCheckbox();
    const checkedCount2 = await page.locator('tbody input[type="checkbox"]:checked, tbody button[role="checkbox"][data-state="checked"]').count();
    expect(checkedCount2).toBe(0);
  });
});
