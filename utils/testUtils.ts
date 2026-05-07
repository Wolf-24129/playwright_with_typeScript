import { Page } from '@playwright/test';

/**
 * Common utility functions for tests
 */
export class TestUtils {
  /**
   * Wait for a specific text to appear on the page
   */
  static async waitForText(page: Page, text: string, timeout = 5000): Promise<void> {
    await page.locator(`text=${text}`).waitFor({ timeout });
  }

  /**
   * Check if element is visible with timeout
   */
  static async isElementVisible(page: Page, selector: string, timeout = 5000): Promise<boolean> {
    try {
      await page.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all text content from elements matching selector
   */
  static async getAllTextContent(page: Page, selector: string): Promise<string[]> {
    return await page.locator(selector).allTextContents();
  }

  /**
   * Wait for navigation and load state
   */
  static async waitForNavigation(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
  }

  /**
   * Clear localStorage and sessionStorage
   */
  static async clearStorage(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Get all cookies
   */
  static async getAllCookies(page: Page): Promise<any[]> {
    return await page.context().cookies();
  }

  /**
   * Clear all cookies
   */
  static async clearCookies(page: Page): Promise<void> {
    await page.context().clearCookies();
  }
}
