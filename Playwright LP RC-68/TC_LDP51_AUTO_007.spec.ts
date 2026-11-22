import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createRC68CSV } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_007: Cancellation Workflow - Table & Confirm Modal', () => {
  test('Verify Cancel button resets checked rows and Modal Cancel closes confirmation dialog without execution', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);

    // Upload & Import CSV
    const csvPath = createRC68CSV([], 'tc_auto_007.csv');
    await rc68Page.uploadFile(csvPath);
    await expect(rc68Page.importButton).toBeEnabled({ timeout: 10000 });
    await rc68Page.clickImport();
    await expect(rc68Page.rowCheckboxes.first()).toBeVisible({ timeout: 15000 });

    // 1. Test Modal Cancel: Click Proceed to open confirm modal, then click Cancel
    await rc68Page.selectMasterCheckbox();
    await expect(rc68Page.proceedButton).toBeEnabled();
    await rc68Page.clickProceed();
    await expect(rc68Page.confirmModal).toBeVisible();

    // Click Cancel in modal
    await rc68Page.cancelModal();
    await expect(rc68Page.confirmModal).toBeHidden();

    // Verify rows remain selected and popup "Process Completed" did not appear
    await expect(rc68Page.rowCheckboxes.first()).toBeChecked();
    await expect(rc68Page.proceedButton).toBeEnabled();
    await expect(rc68Page.processCompletedPopup).not.toBeVisible();

    // 2. Test Table Cancel: Click Cancel button below table to discard session
    await rc68Page.clickTableCancel();
    await expect(rc68Page.dropzoneArea).toBeVisible({ timeout: 5000 });
    await expect(rc68Page.importButton).toBeDisabled();

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_007_cancel_workflow.png', fullPage: true });
  });
});
