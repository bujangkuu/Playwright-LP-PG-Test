import { Page, Locator, expect } from '@playwright/test';

export class InsertRC68Page {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly fileInput: Locator;
  readonly dropzoneArea: Locator;
  readonly fileCard: Locator;
  readonly removeFileButton: Locator;
  readonly importButton: Locator;
  readonly transactionTable: Locator;
  readonly masterCheckbox: Locator;
  readonly rowCheckboxes: Locator;
  readonly proceedButton: Locator;
  readonly cancelButton: Locator;

  // Confirm Modal
  readonly confirmModal: Locator;
  readonly modalTitle: Locator;
  readonly modalMessage: Locator;
  readonly modalCancelButton: Locator;
  readonly modalProcessButton: Locator;

  // Floating Popup "Process Completed"
  readonly processCompletedPopup: Locator;
  readonly popupSuccessBadge: Locator;
  readonly popupFailedBadge: Locator;
  readonly popupCloseButton: Locator;

  // Tabs & Result Tables
  readonly successfulTab: Locator;
  readonly failedTab: Locator;
  readonly toastAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1, h2, h3, [class*="title"]:has-text("Insert RC68")').first();
    this.fileInput = page.locator('input[type="file"]').first();
    this.dropzoneArea = page.locator('[class*="dropzone" i], [class*="upload" i], div:has-text("Drag and drop")').first();
    this.removeFileButton = page.locator('button[title="Remove file"], button[title*="remove" i], button[aria-label*="remove" i], button:has(svg.lucide-x)').first();
    this.importButton = page.locator('button:has-text("Import")').first();
    this.transactionTable = page.locator('table').first();
    this.masterCheckbox = page.getByRole('checkbox', { name: /select all/i }).or(page.locator('thead [role="checkbox"], th [role="checkbox"], thead input[type="checkbox"]')).first();
    this.rowCheckboxes = page.getByRole('checkbox', { name: /select row/i }).or(page.locator('tbody [role="checkbox"], tbody input[type="checkbox"]'));
    this.proceedButton = page.locator('button:has-text("Proceed")').first();
    this.cancelButton = page.locator('button:has-text("Cancel")').first();

    // Confirm Modal
    this.confirmModal = page.locator('[role="dialog"], [class*="modal" i], div:has-text("Are you sure you want to process")').first();
    this.modalTitle = this.confirmModal.locator('h2, h3, [class*="title" i]').first();
    this.modalMessage = this.confirmModal.locator('text=/Are you sure you want to process this transactions/i').first();
    this.modalCancelButton = this.confirmModal.locator('button:has-text("Cancel")').first();
    this.modalProcessButton = this.confirmModal.locator('button:has-text("Process")').first();

    // Floating Popup
    this.processCompletedPopup = page.locator('div, [class*="notification" i], [class*="toast" i]').filter({ hasText: 'Process Completed' }).first();
    this.popupSuccessBadge = this.processCompletedPopup.getByText('Successful', { exact: false }).first();
    this.popupFailedBadge = this.processCompletedPopup.getByText('Failed', { exact: false }).first();
    this.popupCloseButton = this.processCompletedPopup.getByRole('button', { name: /close/i }).or(this.processCompletedPopup.locator('button:has-text("×"), svg')).first();

    // Result Headings & Tables
    this.successfulTab = page.locator('h2, h3, button, [role="tab"]').filter({ hasText: /Successful/i }).first();
    this.failedTab = page.locator('h2, h3, button, [role="tab"]').filter({ hasText: /Failed/i }).first();
    this.toastAlert = page.locator('[role="alert"], [class*="toast" i], [class*="alert" i], [class*="message" i]').first();
  }

  async goto(baseURL: string = 'https://pg-dashboard-dev.lintaspay.com') {
    await this.page.goto(`${baseURL}/tools/insert-rc68`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.waitForTimeout(1000);
  }

  async uploadFile(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(500);
  }

  async removeSelectedFile() {
    await this.removeFileButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickImport() {
    await this.importButton.click();
    await this.page.waitForTimeout(1500);
  }

  async selectMasterCheckbox() {
    const isChecked = (await this.masterCheckbox.getAttribute('data-state')) === 'checked' || (await this.masterCheckbox.getAttribute('aria-checked')) === 'true' || await this.masterCheckbox.isChecked().catch(() => false);
    if (!isChecked) {
      await this.masterCheckbox.click();
    }
    await this.page.waitForTimeout(300);
  }

  async unselectMasterCheckbox() {
    const isChecked = (await this.masterCheckbox.getAttribute('data-state')) === 'checked' || (await this.masterCheckbox.getAttribute('aria-checked')) === 'true' || await this.masterCheckbox.isChecked().catch(() => false);
    if (isChecked) {
      await this.masterCheckbox.click();
    }
    await this.page.waitForTimeout(300);
  }

  async selectRow(index: number = 0) {
    const row = this.rowCheckboxes.nth(index);
    const isChecked = (await row.getAttribute('data-state')) === 'checked' || (await row.getAttribute('aria-checked')) === 'true' || await row.isChecked().catch(() => false);
    if (!isChecked) {
      await row.click();
    }
    await this.page.waitForTimeout(300);
  }

  async unselectRow(index: number = 0) {
    const row = this.rowCheckboxes.nth(index);
    const isChecked = (await row.getAttribute('data-state')) === 'checked' || (await row.getAttribute('aria-checked')) === 'true' || await row.isChecked().catch(() => false);
    if (isChecked) {
      await row.click();
    }
    await this.page.waitForTimeout(300);
  }

  async clickProceed() {
    await this.proceedButton.click();
    await this.confirmModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickTableCancel() {
    await this.cancelButton.click();
    await this.page.waitForTimeout(500);
  }

  async confirmModalProcess() {
    await this.modalProcessButton.click();
    await this.page.waitForTimeout(2000);
  }

  async cancelModal() {
    await this.modalCancelButton.click();
    await this.confirmModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
  }
}
