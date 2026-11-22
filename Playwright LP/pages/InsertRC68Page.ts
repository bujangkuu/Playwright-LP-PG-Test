import { Page, Locator, expect } from '@playwright/test';
import { AUTH_CONFIG } from '../helpers/auth';

export class InsertRC68Page {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly fileInput: Locator;
  readonly importButton: Locator;
  readonly proceedButton: Locator;
  readonly cancelButton: Locator;
  readonly masterCheckbox: Locator;
  readonly tableRows: Locator;
  readonly confirmModal: Locator;
  readonly confirmProcessButton: Locator;
  readonly confirmCancelButton: Locator;
  readonly processCompletedPopup: Locator;
  readonly successfulTab: Locator;
  readonly failedTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1:has-text("Insert RC68"), h2:has-text("Insert RC68"), span:has-text("Insert RC68")').first();
    this.pageDescription = page.locator('text="Manage RC68 data to support the validation and reconciliation of transactions."').first();
    this.fileInput = page.locator('input[type="file"]').first();
    this.importButton = page.locator('button:has-text("Import")').first();
    this.proceedButton = page.locator('button:has-text("Proceed")').first();
    this.cancelButton = page.locator('button:has-text("Cancel")').first();
    this.masterCheckbox = page.locator('thead input[type="checkbox"], thead button[role="checkbox"]').first();
    this.tableRows = page.locator('tbody tr');
    this.confirmModal = page.locator('div[role="dialog"]:has-text("Confirm"), div[data-slot="dialog"]:has-text("Confirm"), div:has-text("Are you sure you want to process this transactions?")').first();
    this.confirmProcessButton = page.locator('div[role="dialog"] button:has-text("Process"), button:has-text("Process")').first();
    this.confirmCancelButton = page.locator('div[role="dialog"] button:has-text("Cancel")').first();
    this.processCompletedPopup = page.locator('div:has-text("Process Completed"), div:has-text("Execute Insert RC68")').first();
    this.successfulTab = page.locator('button:has-text("Successful"), div[role="tab"]:has-text("Successful")').first();
    this.failedTab = page.locator('button:has-text("Failed"), div[role="tab"]:has-text("Failed")').first();
  }

  async goto(): Promise<void> {
    await this.page.goto(`${AUTH_CONFIG.baseUrl}/monitoring/insert-rc68`);
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(500);
  }

  async clickImport(): Promise<void> {
    await expect(this.importButton).toBeEnabled();
    await this.importButton.click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async toggleMasterCheckbox(): Promise<void> {
    await this.masterCheckbox.click();
    await this.page.waitForTimeout(300);
  }

  async toggleRowCheckbox(index: number): Promise<void> {
    const row = this.tableRows.nth(index);
    const checkbox = row.locator('input[type="checkbox"], button[role="checkbox"]').first();
    await checkbox.click();
    await this.page.waitForTimeout(300);
  }

  async clickProceed(): Promise<void> {
    await expect(this.proceedButton).toBeEnabled();
    await this.proceedButton.click();
    await this.page.waitForTimeout(500);
  }

  async confirmProcess(): Promise<void> {
    await expect(this.confirmProcessButton).toBeVisible();
    await this.confirmProcessButton.click();
    await this.page.waitForTimeout(1000);
  }

  async confirmCancel(): Promise<void> {
    await expect(this.confirmCancelButton).toBeVisible();
    await this.confirmCancelButton.click();
    await this.page.waitForTimeout(500);
  }
}
