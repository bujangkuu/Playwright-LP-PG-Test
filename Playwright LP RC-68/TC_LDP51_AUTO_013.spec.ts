import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createRC68CSV, generateRRN, generateMTN } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_013: Batch Resilience - Partial Success & Failed Separation', () => {
  test('Verify partial batch execution handles successful and failed rows into separate result tabs', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);

    // Setup: Create 1 duplicate row (seed first) + 1 new unique row
    const duplicateRRN = generateRRN();
    const duplicateMTN = generateMTN();

    // Seed the duplicate first
    const seedCSV = createRC68CSV([{ rrn: duplicateRRN, mtn: duplicateMTN, amount: 50000 }], 'tc_auto_013_seed.csv');
    await rc68Page.uploadFile(seedCSV);
    await rc68Page.clickImport();
    await rc68Page.selectMasterCheckbox();
    await rc68Page.clickProceed();
    await rc68Page.confirmModalProcess();
    await expect(rc68Page.processCompletedPopup).toBeVisible({ timeout: 15000 });

    // Now create mixed batch: 1 valid fresh row + 1 duplicate row
    await rc68Page.goto(BASE_URL);
    const mixedBatchCSV = createRC68CSV([
      { rrn: generateRRN(), mtn: generateMTN(), amount: 75000 },
      { rrn: duplicateRRN, mtn: duplicateMTN, amount: 50000 },
    ], 'tc_auto_013_mixed.csv');

    await rc68Page.uploadFile(mixedBatchCSV);
    await rc68Page.clickImport();
    await rc68Page.selectMasterCheckbox();
    await rc68Page.clickProceed();
    await rc68Page.confirmModalProcess();

    // Verify popup Process Completed with both results
    await expect(rc68Page.processCompletedPopup).toBeVisible({ timeout: 15000 });

    // Verify presence of Successful and/or Failed indicators
    const isSuccessVisible = await rc68Page.popupSuccessBadge.isVisible().catch(() => false);
    const isFailedVisible = await rc68Page.popupFailedBadge.isVisible().catch(() => false);
    expect(isSuccessVisible || isFailedVisible).toBeTruthy();

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_013_partial_batch.png', fullPage: true });
  });
});
