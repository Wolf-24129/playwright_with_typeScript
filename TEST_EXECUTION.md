# Test Execution Guide

Quick reference for running tests in different scenarios.

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# View Allure report
npm run allure:report
```

## Test Execution Commands

### By Scope

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:login` | Run only login tests |
| `npm run test:cart` | Run only cart tests |

### By Category

| Command | Description |
|---------|-------------|
| `npm run test:smoke` | Run @smoke tagged tests |
| `npm run test:regression` | Run @regression tagged tests |

### By Browser

| Command | Description |
|---------|-------------|
| `npm run test:chromium` | Run on Chromium |
| `npm run test:firefox` | Run on Firefox |
| `npm run test:webkit` | Run on WebKit |

### By Mode

| Command | Description |
|---------|-------------|
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Run in debug mode |
| `npm test -- --ui` | Run in UI mode |

### By Parallelization

| Command | Description |
|---------|-------------|
| `npm run test:parallel` | Run with 4 workers (default) |
| `npm run test:serial` | Run tests one by one |

## Combined Examples

```bash
# Run login tests in debug mode
npm run test:login -- --debug

# Run smoke tests in headed mode
npm run test:smoke -- --headed

# Run regression tests on Firefox
npm run test:regression -- --project=firefox

# Run specific test
npx playwright test tests/login.spec.ts -g "LOGIN-001"

# Run tests matching pattern
npx playwright test -g "valid"
```

## Report Generation

```bash
# Generate Allure report
npm run allure:generate

# View Allure report
npm run allure:open

# Generate and open in one command
npm run allure:report

# View Playwright HTML report
npm run report:html
```

## Environment Variables

```bash
# Run against different environment
BASE_URL=https://staging.saucedemo.com npm test

# Run with slow motion (1000ms delay between actions)
SLOW_MO=1000 npm test

# Run with custom timeout
TIMEOUT=60000 npm test

# CI mode with retries
CI=true npm test
```

## Test Output

### Console Output
- ✓ PASSED (green)
- ✗ FAILED (red)
- ⊝ SKIPPED (yellow)

### Screenshots & Videos
- Saved in `test-results/` directory
- Generated only on test failure
- Automatically included in Allure report

### Trace Files
- Saved in `test-results/` directory
- Generated on first retry
- View with: `npx playwright show-trace path/to/trace.zip`

## Troubleshooting Test Execution

### Tests timing out
```bash
# Increase timeout
TIMEOUT=60000 npm test
```

### Flaky tests
```bash
# Run with retries
npx playwright test --retries=3
```

### Want to see what's happening
```bash
# Run in headed mode
npm run test:headed

# Or use debug mode
npm run test:debug
```

### Clear test artifacts
```bash
rm -rf test-results/ allure-results/ allure-report/
```

## CI/CD Execution

Automatic execution on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

Configuration: `.github/workflows/playwright.yml`

## Performance Optimization

### Parallel Execution (default)
```bash
npm test
# Runs on 4 workers by default
```

### Custom Workers
```bash
npm test -- --workers=8
```

### Disable Parallelization
```bash
npm run test:serial
```

## Test Report Artifacts

Generated files:
- `test-results/` - Playwright HTML reports
- `allure-results/` - Raw test data for Allure
- `allure-report/` - HTML Allure report

## Best Practices for Test Execution

✓ Run smoke tests on every commit  
✓ Run regression tests before release  
✓ Run all tests on all browsers in CI  
✓ Check Allure report for detailed failures  
✓ Use debug mode for intermittent failures  
✓ Clean test artifacts between runs  

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Test Guide](https://playwright.dev/docs/intro)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
