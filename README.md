<h1>Playwright Automation Framework</h1>
<h2>daals.co.uk</h2>

This repository contains a Playwright-based test automation framework designed to test various product functionalities such as homepage navigation, product search, cart operations, and product customization for an e-commerce website.

## Framework Features
* Built using Playwright Test Runner and TypeScript.
* Dynamic handling of product information and user interactions.
* Integration testing for homepage interactions, product search, and cart functionalities.
* Implements the Page Object Model (POM) design pattern for scalable and maintainable test code.

## Prerequisites
* Node.js (v12 or higher)
* npm (v6 or higher)
* Playwright (v1.XX or higher)

## Project Setup
* Clone the repository
* Install playwright
* Install Playwright browsers
* Run tests using Playwright Test Runner:
```
npx playwright test
```

## Configuration Setup 
**playwright.config.ts**
```
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({ <br>
testDir: './tests', <br>
fullyParallel: true,  <br>
forbidOnly: !!process.env.CI,<br>
retries: process.env.CI ? 2 : 0,<br>
workers: process.env.CI ? 1 : undefined,<br>
timeout: 60000, <br>

use: { headless: true, navigationTimeout: 50000, trace: 'on-first-retry', <br>
viewport: { width: 1280, height: 720 }, <br>
ignoreHTTPSErrors: true, <br>
video: 'on-first-retry', }, <br>

reporter: [ ['html'], ['allure-playwright'] ],<br>
projects: [<br>
    {  name: 'chromium', use: { ...devices['Desktop Chrome'] }, },<br>
    {  name: 'firefox',  use: { ...devices['Desktop Firefox'] }, },<br>
    {  name: 'webkit',   use: { ...devices['Desktop Safari'] },  },<br>
});<br>
```

## Understanding the File Structure
**1. pages/HomePage.ts**
* Handles homepage interactions such as navigation, logo verification, navbar interactions, and product search.

**2. pages/CartPage.ts**
* Manages cart functionalities including verifying cart visibility, product URL checking, and adding products to the cart.

**3. pages/ProductCustomize.ts**
* Contains methods to customize product details. (Additional implementation may be required based on project needs.)

**4. data/testData.ts**
* Stores test data such as URLs, product names, expected navbar items, and other dynamic values.

**5. tests/**
* Contains Playwright test files that combine page objects and execute test scenarios.

## Example Test Flow
* Navigate to the homepage and verify that the logo is visible.
* Search for a product using product name suggestions or category search.
* Validate the product details and URL based on the search result.
* Add the product to the cart and verify that the cart is updated.
* Optionally, navigate to product customization if required.


## Conclusion
* This framework is designed leveraging the Playwright Test Runner and the Page Object Model (POM) design pattern, this project offers a maintainable and effective test environment.
