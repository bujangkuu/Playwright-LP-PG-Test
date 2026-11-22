import { test, expect } from '@playwright/test';
import { BASE_URL, API_BASE_URL } from './fixtures/auth';

test.describe('TC_LDP51_AUTO_016: Authentication Guard - Unauthenticated Request Redirected', () => {
  test('Verify unauthenticated request without session cookie is redirected to login', async ({ browser }) => {
    // 1. Create a brand new clean context without cookies
    const cleanContext = await browser.newContext();
    const guestPage = await cleanContext.newPage();

    // 2. Direct navigation to protected route
    await guestPage.goto(`${BASE_URL}/monitoring/insert-rc68`, { waitUntil: 'domcontentloaded' });
    await guestPage.waitForTimeout(2000);

    // 3. Verify automatic redirection to /auth/login
    await expect(guestPage).toHaveURL(/.*\/auth\/login/);

    // 4. Test direct unauthenticated API request
    const apiRes = await cleanContext.request.post(`${API_BASE_URL}/api/v1/reconciliations/rc68/execute`, {
      headers: {
        'Origin': BASE_URL,
      },
      data: {},
    });

    // API should reject unauthenticated request with 401 (or 403)
    expect([401, 403, 404]).toContain(apiRes.status());

    await guestPage.screenshot({ path: 'test-results/TC_LDP51_AUTO_016_guest_redirect.png', fullPage: true });
    await cleanContext.close();
  });
});
