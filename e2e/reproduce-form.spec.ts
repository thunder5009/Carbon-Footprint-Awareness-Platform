import { test, expect } from '@playwright/test';

test('reproduce form not proceeding', async ({ page }) => {
  await page.goto('http://localhost:3000/calculator');
  
  // Wait for the form to appear
  await expect(page.getByText('Transport')).toBeVisible();

  // Click hasCar
  await page.getByLabel(/Do you drive a car/i).check();

  // Fill car miles
  await page.fill('input[name="transport.milesPerYear"]', '12000');
  
  // Select fuel type
  await page.selectOption('select[name="transport.fuelType"]', 'gasoline');
  
  // Fill bus miles
  await page.fill('input[name="transport.busMiles"]', '500');

  // Click Next
  await page.getByRole('button', { name: /Next/i }).click();

  // Check if it moved to Energy
  await expect(page.getByText('Energy')).toBeVisible();
});
