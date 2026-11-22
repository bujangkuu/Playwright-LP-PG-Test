import { test, expect } from '@playwright/test';
import { loginAsInternalAdmin, BASE_URL } from './fixtures/auth';
import { InsertRC68Page } from './pages/InsertRC68Page';
import { createRC68CSV } from './fixtures/csvHelper';

test.describe('TC_LDP51_AUTO_004: UI Interlock - Import Button State', () => {
  test('Verify Import button state interlock (disabled by default, enabled on CSV selected, disabled on removal)', async ({ page }) => {
    await loginAsInternalAdmin(page);

    const rc68Page = new InsertRC68Page(page);
    await rc68Page.goto(BASE_URL);

    // 1. Initial State: Import button must be disabled
    await expect(rc68Page.importButton).toBeDisabled();

    // 2. Select file: Upload valid CSV
    const csvPath = createRC68CSV([], 'tc_auto_004.csv');
    await rc68Page.uploadFile(csvPath);

    // 3. State after selection: Import button must become enabled
    await expect(rc68Page.importButton).toBeEnabled();

    // 4. Remove file: Click 'x' button on file card
    await rc68Page.removeSelectedFile();

    // 5. State after removal: Import button must return to disabled
    await expect(rc68Page.importButton).toBeDisabled();

    await page.screenshot({ path: 'test-results/TC_LDP51_AUTO_004_import_interlock.png', fullPage: true });
  });
});
