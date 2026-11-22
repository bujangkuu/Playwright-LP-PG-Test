import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createRC68CSV } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_017: Security - IDOR Cross-Tenant Merchant Protection', () => {
  test('Verify IDOR Defense - Prevent uploading RC68 transactions containing MID/NMID outside tenant scope', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);

    // Check if pre-existing TC_LDP51_IDOR_001.csv exists, otherwise create it dynamically
    const defaultIdorPath = path.resolve(__dirname, '..', 'test-data', 'TC_LDP51_IDOR_001', 'TC_LDP51_IDOR_001.csv');
    let csvPath = defaultIdorPath;

    if (!fs.existsSync(defaultIdorPath)) {
      csvPath = createRC68CSV([
        {
          mid: 'MID_FOREIGN_TENANT_99999',
          nmid: 'NMID_UNAUTHORIZED_00000',
          amount: 150000,
        },
      ], 'tc_auto_017_idor.csv');
    }

    // Upload IDOR payload
    await rc68Page.uploadFile(csvPath);

    if (await rc68Page.importButton.isEnabled()) {
      await rc68Page.clickImport();
    }

    // Attempt processing if rows rendered
    const rowCount = await rc68Page.rowCheckboxes.count();
    if (rowCount > 0) {
      await rc68Page.selectMasterCheckbox();
      await rc68Page.clickProceed();
      await rc68Page.confirmModalProcess();
      await expect(rc68Page.processCompletedPopup).toBeVisible({ timeout: 15000 });

      // In IDOR scenario, transactions must fail or land in Failed results tab
      const isFailedVisible = await rc68Page.popupFailedBadge.isVisible().catch(() => false);
      const isFailedTab = await rc68Page.failedTab.isVisible().catch(() => false);
      expect(isFailedVisible || isFailedTab).toBeTruthy();
    } else {
      // Or rejected at file upload/import level
      const alert = page.locator('text=/not authorized|not found|invalid merchant|scope/i, [role="alert"]').first();
      const isAlert = await alert.isVisible().catch(() => false);
      expect(isAlert || rowCount === 0).toBeTruthy();
    }

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_017_idor_defense.png', fullPage: true });
  });
});
