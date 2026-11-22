import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createRC68CSV, generateRRN, generateMTN } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_012: Financial Idempotency - Duplicate Transaction Deduplication', () => {
  test('Verify duplicate transaction upload (same RRN & MTN) is rejected/deduplicated', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);

    const duplicateRRN = generateRRN();
    const duplicateMTN = generateMTN();

    // 1. First Run: Process initial transaction
    const initialCSV = createRC68CSV([{ rrn: duplicateRRN, mtn: duplicateMTN, amount: 60000 }], 'tc_auto_012_first.csv');
    await rc68Page.uploadFile(initialCSV);
    await rc68Page.clickImport();
    await rc68Page.selectMasterCheckbox();
    await rc68Page.clickProceed();
    await rc68Page.confirmModalProcess();
    await expect(rc68Page.processCompletedPopup).toBeVisible({ timeout: 15000 });

    // 2. Second Run: Upload duplicate transaction with the exact same RRN and MTN
    await rc68Page.goto(BASE_URL);
    const duplicateCSV = createRC68CSV([{ rrn: duplicateRRN, mtn: duplicateMTN, amount: 60000 }], 'tc_auto_012_duplicate.csv');
    await rc68Page.uploadFile(duplicateCSV);
    await rc68Page.clickImport();
    await rc68Page.selectMasterCheckbox();

    // Listen for the import API response during confirmation
    const importResponsePromise = page.waitForResponse(
      res => res.url().includes('/api/v1/rc68/import'),
      { timeout: 15000 }
    ).catch(() => null);

    await rc68Page.clickProceed();
    await rc68Page.confirmModalProcess();

    const importResponse = await importResponsePromise;
    const responseStatus = importResponse ? importResponse.status() : 0;
    const responseBody = importResponse ? await importResponse.text().catch(() => '') : '';

    // Check for duplicate rejection toast / error banner
    const duplicateAlert = page.locator('text=/duplicate|gagal|failed|already exists|conflict/i, [role="alert"]').first();
    const isDuplicateAlertVisible = await duplicateAlert.isVisible().catch(() => false);

    // 3. Verify deduplication handling:
    // Backend rejects with HTTP 409 Conflict / duplicate file checksum error,
    // OR UI displays duplicate error banner,
    // OR Process Completed popup appears with Failed badge/tab
    const isProcessPopupVisible = await rc68Page.processCompletedPopup.isVisible().catch(() => false);
    const hasFailedBadge = await rc68Page.popupFailedBadge.isVisible().catch(() => false);
    const hasFailedTab = await rc68Page.failedTab.isVisible().catch(() => false);

    const isRejectedOrDeduplicated =
      responseStatus === 409 ||
      responseBody.includes('duplicate') ||
      isDuplicateAlertVisible ||
      (isProcessPopupVisible && (hasFailedBadge || hasFailedTab));

    expect(isRejectedOrDeduplicated).toBeTruthy();

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_012_duplicate_deduplicated.png', fullPage: true });
  });
});
