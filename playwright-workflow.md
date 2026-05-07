# GitHub Actions Workflow for Playwright Tests

This document describes the GitHub Actions workflow defined in `.github/workflows/playwright.yml`.

## Purpose

The `playwright.yml` workflow installs dependencies, installs Playwright browsers, runs Playwright tests, and uploads Playwright report artifacts.

## Triggers

The workflow runs on:

- `push` to the `main` and `master` branches
- `pull_request` targeting `main` and `master`

## Job: `test`

The job runs on `ubuntu-latest` and has a 60-minute timeout.

## Steps

1. Checkout repository
2. Setup Node.js using `actions/setup-node@v4`
3. Install dependencies with `npm ci`
4. Install Playwright browsers with `npx playwright install --with-deps`
5. Install the Allure CLI with `npm install -g allure-commandline`
6. Run Playwright tests with `npx playwright test --workers=4 --reporter=list`
7. Generate the Allure report from `allure-results`
8. Upload the generated `playwright-report/` and `allure-report/` artifacts10. Publish the Allure report to the `gh-pages` branch via `simple-elf/allure-report-action@master`

## Important notes

- `npm ci` requires a lock file (`package-lock.json`, `npm-shrinkwrap.json`, or `yarn.lock`) to be present in the repository.
- The workflow currently does not use a browser matrix.
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"` is set in the workflow environment.

## Workflow contents

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Install Allure CLI
        run: npm install -g allure-commandline

      - name: Run Playwright tests
        run: npx playwright test --workers=4 --reporter=list

      - name: Generate Allure Report
        if: always()
        run: allure generate allure-results --clean -o allure-report

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-report
          path: allure-report/
          retention-days: 30

      - name: Publish Allure Report
        if: always()
        uses: simple-elf/allure-report-action@master
        with:
          allure_results: allure-results
          gh_pages: gh-pages
          allure_history: allure-history
          keep_reports: 20
```
