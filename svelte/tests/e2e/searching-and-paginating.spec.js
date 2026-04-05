import { test, expect } from '@playwright/test';

test.describe('Searching and Paginating', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have a page title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Free Exercise DB');
  });

  test('should expand collapsed instructions when clicking "Show more instructions"', async ({ page }) => {
    // Wait for exercises to load
    await page.waitForSelector('.exercise', { timeout: 10000 });
    
    // Find the first exercise with a "Show more instructions" button
    const firstExercise = page.locator('.exercise').first();
    const moreButton = firstExercise.locator('text=Show more instructions');
    
    // Only proceed if there's a "more" button (some exercises might not have multiple instructions)
    if (await moreButton.count() > 0) {
      await moreButton.click();
      
      // Verify the button is no longer present
      await expect(firstExercise.locator('text=Show more instructions')).toHaveCount(0);
    }
  });

  test('should filter exercises when searching', async ({ page }) => {
    // Wait for exercises to load
    await page.waitForSelector('.exercise', { timeout: 10000 });
    
    // Get initial exercise count
    const initialCount = await page.locator('.exercise').count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Search for specific exercise
    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill('bench press chains');
    
    // Wait for search results to update
    await page.waitForTimeout(500); // Give time for search to process
    
    // Check if results are filtered
    const firstExercise = page.locator('.exercise').first();
    await expect(firstExercise).toContainText('Bench Press with Chains', { timeout: 5000 });
    
    // Clear search
    await searchInput.clear();
    
    // Wait for results to reset
    await page.waitForTimeout(500);
    
    // Should show original first exercise
    await expect(page.locator('.exercise').first()).toContainText('3/4 Sit-Up', { timeout: 5000 });
  });

  test('should show 50 exercises initially', async ({ page }) => {
    // Wait for exercises to load
    await page.waitForSelector('.exercise', { timeout: 10000 });
    
    const exerciseCount = await page.locator('.exercise').count();
    expect(exerciseCount).toBe(50);
  });

  test('should load more exercises when scrolling to bottom', async ({ page }) => {
    // Wait for initial exercises to load
    await page.waitForSelector('.exercise', { timeout: 10000 });
    
    // Verify initial count
    let exerciseCount = await page.locator('.exercise').count();
    expect(exerciseCount).toBe(50);
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for new exercises to load
    await page.waitForTimeout(1000);
    
    // Check if more exercises loaded
    exerciseCount = await page.locator('.exercise').count();
    expect(exerciseCount).toBeGreaterThan(50);
    expect(exerciseCount).toBeLessThanOrEqual(100);
  });

  test('should bookmark and unbookmark exercises', async ({ page }) => {
    // Wait for exercises to load
    await page.waitForSelector('.exercise', { timeout: 10000 });
    
    // Find and click the first bookmark button
    const firstBookmarkButton = page.locator('.exercise').first().locator('button[aria-label*="bookmark"]');
    await firstBookmarkButton.click();
    
    // Check if bookmark counter appeared
    const savedButton = page.locator('button:has-text("Saved")');
    await expect(savedButton.locator('span')).toContainText('1');
    
    // Click saved button to view bookmarked exercises
    await savedButton.click();
    
    // Should now show only bookmarked exercises
    const exerciseCount = await page.locator('.exercise').count();
    expect(exerciseCount).toBe(1);
    
    // Unbookmark the exercise
    await firstBookmarkButton.click();
    
    // Should return to all exercises view
    await page.waitForTimeout(500);
    const newCount = await page.locator('.exercise').count();
    expect(newCount).toBe(50);
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    // Wait for exercises to load
    await page.waitForSelector('.exercise', { timeout: 10000 });
    
    // Search for something that doesn't exist
    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill('thisexercisedoesnotexist123');
    
    // Wait for search to process
    await page.waitForTimeout(500);
    
    // Should show "no exercises found" message
    await expect(page.locator('text=No exercises found')).toBeVisible();
  });

  test('should be responsive on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for exercises to load
    await page.waitForSelector('.exercise', { timeout: 10000 });
    
    // Verify page still works on mobile
    await expect(page.locator('h1')).toContainText('Free Exercise DB');
    
    // Test search functionality on mobile
    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill('push');
    
    // Should still filter results
    await page.waitForTimeout(500);
    const exerciseCount = await page.locator('.exercise').count();
    expect(exerciseCount).toBeGreaterThan(0);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept and block the API request to simulate network error
    await page.route('**/exercises.json', route => {
      route.abort();
    });
    
    await page.goto('/');
    
    // Should show error message
    await expect(page.locator('text=Error loading exercises')).toBeVisible({ timeout: 10000 });
    
    // Should have retry button
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
  });
});