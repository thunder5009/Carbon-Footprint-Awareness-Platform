import { test, expect } from '@playwright/test';

test.describe('Critical Path: Landing -> Calculator -> Results', () => {
  test('User can navigate the landing page and start calculator', async ({ page }) => {
    await page.goto('/');
    
    // Verify Landing Hero
    await expect(page.getByRole('heading', { name: /carbon footprint/i, level: 1 })).toBeVisible();
    
    // Click CTA to start
    await page.getByRole('link', { name: /calculate now/i }).click();
    
    // Ensure we reached the calculator page
    await expect(page).toHaveURL(/.*\/calculator/);
  });

  test('User can complete the calculator and see results', async ({ page }) => {
    await page.goto('/calculator');
    
    // Step 1: Transport
    await page.getByRole('button', { name: 'Go to next step' }).click();
    
    // Step 2: Energy
    await page.getByLabel(/electricity/i).fill('900');
    await page.getByRole('button', { name: 'Go to next step' }).click();
    
    // Step 3: Food
    await page.getByRole('button', { name: 'Go to next step' }).click();
    
    // Step 4: Waste
    await page.getByRole('button', { name: /calculate/i }).click();
    
    // Ensure we reached results
    await expect(page).toHaveURL(/.*\/results/);
    
    // Wait for Recharts to render the breakdown donut chart
    await expect(page.getByRole('region', { name: /carbon footprint breakdown/i })).toBeVisible();
    
    // Visual Regression Capture for Results
    await expect(page).toHaveScreenshot('results-breakdown-chart.png', {
      maxDiffPixels: 100, // Handle slight aliasing differences
      fullPage: true
    });
  });
});
