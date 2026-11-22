import { Page, Locator, expect } from '@playwright/test';

export class TransactionsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly onlyRC68Toggle: Locator;
  readonly searchRRNInput: Locator;
  readonly transactionRows: Locator;
  readonly firstRow: Locator;
  readonly detailModal: Locator;
  readonly detailRRN: Locator;
  readonly detailAmount: Locator;
  readonly detailDateTime: Locator;
  readonly detailIssuer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1, h2, h3, [class*="title"]:has-text("Transactions")').first();
    this.onlyRC68Toggle = page.locator('div').filter({ has: page.getByText('Only RC68') }).locator('button[role="switch"]').or(page.locator('label:has-text("Only RC68")')).first();
    this.searchRRNInput = page.locator('input[placeholder="Search RRN"]').or(page.locator('input[placeholder*="RRN" i]')).first();
    this.transactionRows = page.locator('tbody tr');
    this.firstRow = page.locator('tbody tr').first();
    this.detailModal = page.locator('[role="dialog"], [class*="modal" i], div:has-text("Transaction Detail")').first();
    this.detailRRN = this.detailModal.locator('text=/RRN/i + *, div:has-text("RRN")').first();
    this.detailAmount = this.detailModal.locator('text=/Amount/i + *, div:has-text("Amount")').first();
    this.detailDateTime = this.detailModal.locator('text=/Date/i + *, div:has-text("Date")').first();
    this.detailIssuer = this.detailModal.locator('text=/Issuer/i + *, div:has-text("Issuer")').first();
  }

  async goto(baseURL: string = 'https://pg-dashboard-dev.lintaspay.com') {
    await this.page.goto(`${baseURL}/monitoring/transactions`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.waitForTimeout(1000);
  }

  async enableOnlyRC68() {
    const switchBtn = this.page.locator('div').filter({ has: this.page.getByText('Only RC68') }).locator('button[role="switch"]').first();
    if (await switchBtn.count() > 0) {
      const isChecked = (await switchBtn.getAttribute('data-state')) === 'checked' || (await switchBtn.getAttribute('aria-checked')) === 'true';
      if (!isChecked) {
        await switchBtn.click();
      }
    } else {
      await this.onlyRC68Toggle.click();
    }
    await this.page.waitForTimeout(1500);
  }

  async searchRRN(rrn: string) {
    await this.searchRRNInput.fill(rrn);
    await this.searchRRNInput.press('Enter');
    await this.page.waitForTimeout(1500);
  }

  async openFirstRowDetail() {
    await this.firstRow.click();
    await this.detailModal.waitFor({ state: 'visible', timeout: 10000 });
  }
}
