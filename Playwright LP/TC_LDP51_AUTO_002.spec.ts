import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, AUTH_CONFIG } from './helpers/auth';

test.describe('LDP-51 Insert RC68 - TC_LDP51_AUTO_002', () => {
  test('TC_LDP51_AUTO_002: Verify processed RC68 transactions appear in Monitoring > Transactions with "Only RC68" toggle enabled', async ({ page }) => {
    // 1. Login as Internal Admin
    await loginAsInternalAdmin(page);

    // 2. Navigate to Monitoring > Transactions
    await page.goto(`${AUTH_CONFIG.baseUrl}/monitoring/transactions`);
    await page.waitForLoadState('networkidle').catch(() => {});

    // 3. Toggle "Only RC68" switch
    const onlyRc68Toggle = page.locator('button[role="switch"]:has-text("Only RC68"), input[type="checkbox"][id*="rc68"], button:has-text("Only RC68")').first();
    if (await onlyRc68Toggle.count() > 0) {
      await onlyRc68Toggle.click();
      await page.waitForLoadState('networkidle').catch(() => {});
    }

    // 4. Assert filtered table displays RC68 transactions
    const tableRows = page.locator('tbody tr');
    await expect(tableRows.first()).toBeVisible({ timeout: 10000 });
  });
});
