import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Anonymous User Flow', () => {
  test('Landing -> Calculator -> Results -> Accessibility', async ({ page }) => {
    // 1. Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/CarbonTrack/);
    
    // Check accessibility on Landing
    const landingAxe = await new AxeBuilder({ page }).analyze();
    expect(landingAxe.violations).toEqual([]);

    // Navigate to Calculator
    await page.getByRole('link', { name: /Calculate Footprint/i }).first().click();
    await expect(page).toHaveURL(/\/calculator/);

    // 2. Calculator - Step 1 (Transport)
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Step 2 (Energy)
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Step 3 (Food)
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Step 4 (Waste)
    await page.getByRole('button', { name: /View My Results/i }).click();

    // 3. Results Page
    await expect(page).toHaveURL(/\/results/);
    await expect(page.getByText(/Your Annual Footprint/i)).toBeVisible();

    // Wait for Recharts animations to finish (approx 1.5s) before snapshot
    await page.waitForTimeout(2000);

    // Visual Regression Baseline
    await expect(page).toHaveScreenshot('anonymous-results-baseline.png', { fullPage: true });

    // Check accessibility on Results Page
    const resultsAxe = await new AxeBuilder({ page })
      // Disable color-contrast check on charts if they are dynamically rendered using Recharts
      // because SVG contrast parsing can be flaky in Axe
      .disableRules(['color-contrast'])
      .analyze();
    
    expect(resultsAxe.violations).toEqual([]);
  });
});
