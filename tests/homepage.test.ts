import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import TestData from '../data/testData.ts';


test('Go to Homepage,logo verify, search for product, choose from dropdown', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const { url, searchProduct,dropdownSuggested, emptyCart } = TestData.pageData;
    
    await homePage.navigate(url);  
    expect(page.url()).toBe(url);
    const logo = await homePage.isLogoVisible();   
    expect(logo).toBeTruthy();
    
    const dropdownProductUrl = await homePage.searchByProductNameSuggestion(searchProduct, dropdownSuggested);
    await homePage.navigate(dropdownProductUrl);
    const productUrlVerify = await cartPage.productVSurlChecker(dropdownProductUrl);
    expect(productUrlVerify.toLowerCase()).toContain(dropdownSuggested.toLowerCase());
    
    console.log("______TEST 1______ " + dropdownProductUrl);
});

test('Go to Homepage,logo verify, search for product wise Category', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const{url, searchProduct} = TestData.pageData;

    await homePage.navigate(url);      
    expect(page.url()).toBe(url);
    const logo = await homePage.isLogoVisible();  
    expect(logo).toBeTruthy();

    const productUrl = await homePage.searchByProductCategory(searchProduct);
    const productUrlVerify = await cartPage.productVSurlChecker(productUrl);
    expect(productUrlVerify).toContain(searchProduct);
    
    console.log("_____TEST 2_____" + productUrlVerify+" > "+productUrl);
});

test('Go to Homepage,Navbar, Homepage product add to cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const{url, searchProduct,productIndex,expectedMenuItems} = TestData.pageData;

    await homePage.navigate(url);      expect(page.url()).toBe(url);
    const logo = await homePage.isLogoVisible();  expect(logo).toBeTruthy();

    const menu = await homePage.navbar(expectedMenuItems);
    expect(menu).toEqual(expectedMenuItems);

    const isCartVisible = await cartPage.verifyCart();
    expect(isCartVisible).toBeTruthy();

    const { pageReloaded, newUrl, productName, productOldPrice, productLivePrice } = await cartPage.productClickFromHomepage(productIndex);
    expect(pageReloaded).toBe(true);

    const {description, livePrice} = await cartPage.addToCartFromDetails(newUrl);
    expect(productName).toBe(description);
    expect(productLivePrice?.trim()).toBe(livePrice?.trim());

    await homePage.openCart();

    console.log("_______TEST 3______" + description + " > " + livePrice);
});
