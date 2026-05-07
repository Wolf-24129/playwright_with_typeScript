# Playwright Automation - Environment Configuration

## Environment Variables

You can set these environment variables to customize test execution:

```bash
# Test Environment
BASE_URL=https://www.saucedemo.com

# Timeouts
TIMEOUT=30000

# Execution
HEADLESS=true
SLOW_MO=0
RETRIES=0
WORKERS=4

# CI/CD
CI=true
```

## Usage Examples

### Run tests against different environment
```bash
BASE_URL=https://staging.saucedemo.com npm test
```

### Run tests with slower execution (useful for debugging)
```bash
SLOW_MO=1000 npm test
```

### Run with custom retries
```bash
RETRIES=3 npm test
```

### Run with specific number of workers (parallel execution)
```bash
WORKERS=2 npm test
```

### CI/CD Execution
```bash
CI=true npm test
```

## Default Values

- BASE_URL: https://www.saucedemo.com
- TIMEOUT: 30000ms
- HEADLESS: true
- SLOW_MO: 0ms
- RETRIES: 0
- WORKERS: 4
- CI: false
