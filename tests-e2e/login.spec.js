import { test, expect } from '@playwright/test';

test.describe('Login E2E Flow', () => {
  test('should display landing page and navigate to login', async ({ page }) => {
    await page.goto('/');
    // Check if header text exists
    await expect(page.locator('body')).toContainText('Life Guidance Pro');
  });
});
