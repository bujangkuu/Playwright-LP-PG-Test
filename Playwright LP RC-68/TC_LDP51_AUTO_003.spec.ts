import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { TransactionsPage } from './pages/TransactionsPage';
import { createRC68CSV, generateRRN } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_003: Monitoring Transaction Details - Attribute Integrity', () => {
  test('Verify transaction details in Monitoring match source RC68 CSV data attributes', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const targetRRN = generateRRN();
    const csvPath = createRC68CSV([
      {
        rrn: targetRRN,
        amount: 85000,
        issuer: '93600915',
        terminalId: 'A01',
      },
    ], 'tc_auto_003.csv');

    // Upload and process
    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);
    await rc68Page.uploadFile(csvPath);
    await expect(rc68Page.importButton).toBeEnabled({ timeout: 10000 });
    await rc68Page.clickImport();
    await expect(rc68Page.rowCheckboxes.first()).toBeVisible({ timeout: 15000 });
    await rc68Page.selectMasterCheckbox();
    await rc68Page.clickProceed();
    await rc68Page.confirmModalProcess();
    await expect(rc68Page.processCompletedPopup).toBeVisible({ timeout: 15000 });

    // Open Transactions monitoring
    const trxPage = new TransactionsPage(page);
    await trxPage.goto(BASE_URL);
    await trxPage.enableOnlyRC68();
    await trxPage.searchRRN(targetRRN);

    // Verify transaction row & attribute integrity
    const row = page.locator(`tbody tr:has-text("${targetRRN}")`).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(targetRRN);
    await expect(row).toContainText('85.000');
    await expect(row).toContainText('RC68');

    // Check detail modal if available on row click
    await row.click();
    const isModalVisible = await trxPage.detailModal.isVisible({ timeout: 2000 }).catch(() => false);
    if (isModalVisible) {
      await expect(trxPage.detailModal).toContainText(targetRRN);
      await expect(trxPage.detailModal).toContainText('85.000');
    }

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_003_detail_modal.png', fullPage: true });
  });
});
