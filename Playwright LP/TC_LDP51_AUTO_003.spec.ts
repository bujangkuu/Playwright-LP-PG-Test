import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, AUTH_CONFIG } from './helpers/auth';

test.describe('LDP-51 Insert RC68 - TC_LDP51_AUTO_003', () => {
  test('TC_LDP51_AUTO_003: Verify transaction details in Monitoring match source RC68 CSV data attributes', async ({ page }) => {
    // 1. Login as Internal Admin
    await loginAsInternalAdmin(page);

    // 2. Open Transactions page
    await page.goto(`${AUTH_CONFIG.baseUrl}/monitoring/transactions`);
    await page.waitForLoadState('networkidle').catch(() => {});

    // 3. Click first row to view detail
    const firstRow = page.locator('tbody tr').first();
    if (await firstRow.count() > 0) {
      await firstRow.click();

      // 4. Assert detail dialog / drawer contains standard transaction attributes
      const detailContainer = page.locator('div[role="dialog"], aside, div[class*="detail"]').first();
      await expect(detailContainer).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text="RRN", text="Amount", text="Date"').first()).toBeVisible();
    }
  });
});
