import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createRC68CSV } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_001: E2E Happy Path - Upload valid RC68 CSV & Execute Execution', () => {
  test('Upload valid RC68 CSV, select all rows, confirm proceed, and verify execution success', async ({ page }) => {
    // 1. Authenticate as Internal Admin
    await loginAsInternalAdmin(page);

    // 2. Prepare dynamic valid CSV payload
    const csvPath = createRC68CSV([], 'tc_auto_001_valid.csv');

    // 3. Navigate to Insert RC68 Page
    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);
    await expect(page).toHaveURL(/.*\/tools\/insert-rc68/);

    // 4. Upload valid CSV file to dropzone
    await rc68Page.uploadFile(csvPath);

    // 5. Verify file card is visible and Import button is enabled
    await expect(rc68Page.importButton).toBeEnabled();

    // 6. Click Import
    await rc68Page.clickImport();

    // 7. Verify rows rendered in List Transaction RC68 table
    await expect(rc68Page.rowCheckboxes.first()).toBeVisible({ timeout: 15000 });
    const rowCount = await rc68Page.rowCheckboxes.count();
    expect(rowCount).toBeGreaterThanOrEqual(1);

    // 8. Select master checkbox on header
    await rc68Page.selectMasterCheckbox();
    await expect(rc68Page.proceedButton).toBeEnabled();

    // 9. Click Proceed to trigger Confirm Modal
    await rc68Page.clickProceed();
    await expect(rc68Page.confirmModal).toBeVisible();
    await expect(rc68Page.modalMessage).toBeVisible();

    // 10. Confirm and execute by clicking Process
    await rc68Page.confirmModalProcess();

    // 11. Verify "Process Completed" floating popup appears
    await expect(rc68Page.processCompletedPopup).toBeVisible({ timeout: 15000 });
    await expect(rc68Page.popupSuccessBadge).toBeVisible();

    // 12. Take screenshot evidence
    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_001_success.png', fullPage: true });
  });
});
