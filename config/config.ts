/**
 * Environment configuration
 * Supports environment variables with fallback to defaults
 */

export const config = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  timeout: parseInt(process.env.TIMEOUT || '30000'),
  headless: process.env.HEADLESS !== 'false',
  slowMo: parseInt(process.env.SLOW_MO || '0'),
  retries: parseInt(process.env.RETRIES || '0'),
  workers: parseInt(process.env.WORKERS || '4'),
  isCI: !!process.env.CI,
};

export default config;
