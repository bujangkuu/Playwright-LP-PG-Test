import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    this.loginButton = page.locator('button:has-text("Sign In"), button:has-text("Login"), button[type="submit"]').first();
    this.errorMessage = page.locator('text=/invalid username or password|required|account is locked|unauthorized/i, [class*="error" i], [role="alert" i]').first();
  }

  async goto(baseURL: string = 'https://pg-dashboard-dev.lintaspay.com') {
    await this.page.goto(`${baseURL}/auth/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });
    await this.page.waitForTimeout(300);
  }

  async login(username: string = 'internaladmin', password: string = 'password123', baseURL?: string) {
    await this.goto(baseURL);

    // If already redirected away from login (active session), return immediately
    if (!this.page.url().includes('/auth/login')) {
      return;
    }

    await this.usernameInput.click();
    await this.usernameInput.fill(username);
    await this.usernameInput.dispatchEvent('input');
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.passwordInput.dispatchEvent('input');
    await this.page.waitForTimeout(200);

    // Wait for redirect to dashboard/internal area
    await Promise.all([
      this.page.waitForURL(url => !url.pathname.includes('/auth/login'), {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      }),
      this.loginButton.click()
    ]).catch(async () => {
      // Fallback wait if already navigated
      await this.page.waitForURL(url => !url.pathname.includes('/auth/login'), {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      }).catch(() => { });
    });

    await this.page.waitForTimeout(500);
  }

  async expectError(message?: string) {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
    if (message) {
      await expect(this.errorMessage).toContainText(message, { ignoreCase: true });
    }
  }
}
