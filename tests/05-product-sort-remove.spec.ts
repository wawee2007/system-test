
import { test, expect } from '@playwright/test';

test.describe('System Test: Product Sort and Remove', () => {

  // ST-04: เรียงราคาสินค้าจากน้อยไปมาก
  test('ST-04: Sort products by price low to high', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/inventory.html/);

    // เลือกเรียงราคาจากน้อยไปมาก
    await page.locator('[data-test="product-sort-container"]')
      .selectOption('lohi');

    // อ่านราคาสินค้าทุกชิ้น
    const priceTexts = await page.locator('.inventory_item_price')
      .allTextContents();

    const prices = priceTexts.map(price =>
      Number(price.replace('$', ''))
    );

    // ตรวจว่าราคาน้อยไปมากจริง
    expect(prices.length).toBeGreaterThan(0);
    expect(prices).toEqual(
      [...prices].sort((a, b) => a - b)
    );
  });

  // ST-05: ลบสินค้า 1 ชิ้นก่อน Checkout
  test('ST-05: Remove one product before checkout', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/inventory.html/);

    // เพิ่มสินค้า 2 ชิ้น
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // เข้า Cart แล้วลบ Backpack
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    // ต้องเหลือสินค้า 1 ชิ้น
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // เริ่ม Checkout
    await page.locator('[data-test="checkout"]').click();

    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('Student');
    await page.locator('[data-test="postalCode"]').fill('50000');

    await page.locator('[data-test="continue"]').click();

    // ตรวจหน้า Overview ว่ามีสินค้าเหลือเพียง 1 ชิ้น
    await expect(page).toHaveURL(/checkout-step-two.html/);
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name'))
      .toHaveText('Sauce Labs Bike Light');
  });

});
