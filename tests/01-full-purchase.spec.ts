import { test, expect } from '@playwright/test';

test('ST-01: User ซื้อสินค้าตั้งแต่ Login จน Finish ได้สำเร็จ', async ({ page }) => {

    // =====================================================
    // Step 1: Open System
    // =====================================================
    await page.goto('https://www.saucedemo.com/');

    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(page.locator('#user-name')).toBeVisible();

    // =====================================================
    // Step 2: Login
    // =====================================================
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();

    // =====================================================
    // Step 3: Check Inventory
    // =====================================================
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // =====================================================
    // Step 4: Add Product to Cart
    // =====================================================
    await page
        .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
        .click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // =====================================================
    // Step 5: Open Cart
    // =====================================================
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/cart\.html/);

    await expect(
        page.locator('.inventory_item_name')
            .filter({ hasText: 'Sauce Labs Backpack' })
    ).toBeVisible();

    // =====================================================
    // Step 6: Start Checkout
    // =====================================================
    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // =====================================================
    // Step 7: Fill Customer Information
    // =====================================================
    await page.locator('[data-test="firstName"]').fill('Ornpreeya');
    await page.locator('[data-test="lastName"]').fill('Chumphu');
    await page.locator('[data-test="postalCode"]').fill('50200');

    await page.locator('[data-test="continue"]').click();

    // =====================================================
    // Step 8: Check Checkout Overview
    // =====================================================
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await expect(
        page.locator('.inventory_item_name')
            .filter({ hasText: 'Sauce Labs Backpack' })
    ).toBeVisible();

    // =====================================================
    // Step 9: Finish Order
    // =====================================================
    await page.locator('[data-test="finish"]').click();

    // =====================================================
    // Step 10: Verify Order Complete
    // =====================================================
    await expect(page).toHaveURL(/checkout-complete\.html/);

    await expect(page.locator('.complete-header'))
        .toHaveText('Thank you for your order!');
});

