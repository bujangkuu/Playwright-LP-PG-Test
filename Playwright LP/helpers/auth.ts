import { Page, expect } from '@playwright/test';

export const AUTH_CONFIG = {
  baseUrl: process.env.BASE_URL || 'https://pg-dashboard-dev.lintaspay.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://pg-api-dev.lintaspay.com',
  internalAdmin: {
    username: process.env.ADMIN_USER || 'internaladmin',
    password: process.env.ADMIN_PASS || 'password123',
  },
  orgAdmin: {
    username: process.env.QA_ORG_ADMIN_USER || 'qaadminorg',
    password: process.env.QA_ORG_ADMIN_PASS || 'Pass1234',
  },
  merchantAdmin: {
    username: process.env.QA_MERCHANT_ADMIN_USER || 'qaadminmerch',
    password: process.env.QA_MERCHANT_ADMIN_PASS || 'Pass1234',
  },
};

/**
 * Login as Internal Admin using configured credentials
 */
export async function loginAsInternalAdmin(page: Page): Promise<void> {
  await page.setExtraHTTPHeaders({
    Origin: AUTH_CONFIG.baseUrl,
  });

  await page.goto(`${AUTH_CONFIG.baseUrl}/auth/login`);
  await page.waitForLoadState('domcontentloaded');

  const usernameInput = page.locator('input[type="text"], input[name="username"], input[id="username"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  const submitButton = page.locator('button[type="submit"]').first();

  await usernameInput.fill(AUTH_CONFIG.internalAdmin.username);
  await passwordInput.fill(AUTH_CONFIG.internalAdmin.password);
  await submitButton.click();

  // Wait until navigated away from login page
  await page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 15000 });
  await page.waitForLoadState('networkidle').catch(() => {});
}

/**
 * Login with custom credentials
 */
export async function loginWithCredentials(page: Page, username: string, pass: string): Promise<void> {
  await page.setExtraHTTPHeaders({
    Origin: AUTH_CONFIG.baseUrl,
  });

  await page.goto(`${AUTH_CONFIG.baseUrl}/auth/login`);
  await page.waitForLoadState('domcontentloaded');

  const usernameInput = page.locator('input[type="text"], input[name="username"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  const submitButton = page.locator('button[type="submit"]').first();

  await usernameInput.fill(username);
  await passwordInput.fill(pass);
  await submitButton.click();

  await page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 15000 });
}
