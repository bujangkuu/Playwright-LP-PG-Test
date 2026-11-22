import { test, expect } from '@playwright/test';
import path from 'path';
import { loginAsInternalAdmin } from './helpers/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';

test.describe('LDP-51 Insert RC68 - TC_LDP51_AUTO_004', () => {
  test('TC_LDP51_AUTO_004: Verify Import button state interlock (disabled by default, enabled only after valid CSV selection)', async ({ page }) => {
    await loginAsInternalAdmin(page);
    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto();

    // 1. Assert Import button is disabled by default
    await expect(rc68Page.importButton).toBeDisabled();

    // 2. Upload file
    const sampleCsv = path.resolve('test-data/TC_LDP51_RES_003/TC_LDP51_RES_003.csv');
    await rc68Page.uploadFile(sampleCsv);

    // 3. Assert Import button becomes enabled
    await expect(rc68Page.importButton).toBeEnabled();
  });
});
