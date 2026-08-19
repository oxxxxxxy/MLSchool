import { test, expect } from '@playwright/test';

test.describe('ML Kids Academy - Interactive Math Journey for 7th Grade', () => {
  test('should load main page and show Lesson 1', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.locator('text=ML Kids Academy')).toBeVisible();
    await expect(page.locator('text=Что такое Функция?')).toBeVisible();
  });

  test('should navigate between 5 lessons smoothly', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Click Lesson 2 in sidebar
    await page.locator('button:has-text("Урок 2")').click();
    await expect(page.locator('text=Линейная функция y = kx + b')).toBeVisible();

    // Click Lesson 3
    await page.locator('button:has-text("Урок 3")').click();
    await expect(page.locator('text=Кривые и Параболы')).toBeVisible();

    // Click Lesson 4
    await page.locator('button:has-text("Урок 4")').click();
    await expect(page.locator('text=Производная')).toBeVisible();

    // Click Lesson 5
    await page.locator('button:has-text("Урок 5")').click();
    await expect(page.locator('text=Векторы, Признаки и Граф Нейрона')).toBeVisible();
  });
});
