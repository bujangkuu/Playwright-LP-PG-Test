import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { TransactionsPage } from './pages/TransactionsPage';
import { createRC68CSV, generateRRN } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_002: Monitoring Transactions - Only RC68 Toggle Filter', () => {
  test('Verify processed RC68 transactions appear in Monitoring > Transactions with Only RC68 toggle enabled', async ({ page }) => {
    // 1. Authenticate as Internal Admin
    await loginAsInternalAdmin(page);

    // 2. Prepare transaction with unique RRN
    const targetRRN = generateRRN();
    const csvPath = createRC68CSV([{ rrn: targetRRN, amount: 75000 }], 'tc_auto_002.csv');

    // 3. Upload and execute transaction in Insert RC68
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

    // 4. Navigate to Monitoring > Transactions
    const trxPage = new TransactionsPage(page);
    await trxPage.goto(BASE_URL);
    await expect(page).toHaveURL(/.*\/monitoring\/transactions/);

    // 5. Enable "Only RC68" toggle filter
    await trxPage.enableOnlyRC68();

    // 6. Search for target RRN
    await trxPage.searchRRN(targetRRN);

    // 7. Verify transaction row appears in table
    await expect(page.locator(`tbody tr:has-text("${targetRRN}")`)).toBeVisible({ timeout: 10000 });

    // 8. Capture screenshot evidence
    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_002_transactions_toggle.png', fullPage: true });
  });
});
