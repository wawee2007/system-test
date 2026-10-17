import { test, expect } from '@playwright/test';

test('ST-04: Cart รักษาสถานะสินค้าได้ถูกต้อง', async ({ page }) => {
  // =====================================================
  // Login
  // =====================================================
  await page.goto('/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);

  // =====================================================
  // Add 2 Products
  // =====================================================
  await page
    .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    .click();

  await page
    .locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
    .click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // =====================================================
  // Open Cart
  // =====================================================
  await page.locator('.shopping_cart_link').click();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator('.cart_item')).toHaveCount(2);

  // =====================================================
  // Remove Bike Light
  // =====================================================
  await page
    .locator('[data-test="remove-sauce-labs-bike-light"]')
    .click();

  // =====================================================
  // Verify Cart State
  // =====================================================
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  await expect(page.locator('.cart_item')).toHaveCount(1);

  await expect(page.locator('.inventory_item_name'))
    .toHaveText('Sauce Labs Backpack');

  await expect(page.getByText('Sauce Labs Bike Light', { exact: true }))
    .toHaveCount(0);
});