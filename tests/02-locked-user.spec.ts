import { test, expect } from '@playwright/test';

test('ST-02: Locked User ไม่สามารถเข้าใช้งานระบบได้', async ({ page }) => {
  // Arrange
  await page.goto('/');

  // Act
  await page.locator('#user-name').fill('locked_out_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Assert: ระบบต้องแสดง Error
  await expect(page.locator('[data-test="error"]'))
    .toContainText('Sorry, this user has been locked out');

  // Assert: ระบบต้องไม่เข้าสู่ Inventory
  await expect(page).not.toHaveURL(/inventory\.html/);

  // Assert: Login form ยังอยู่
  await expect(page.locator('#user-name')).toBeVisible();
});