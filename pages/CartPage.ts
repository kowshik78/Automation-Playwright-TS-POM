import { expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

export class CartPage {
    constructor(private page: Page) {
        this.page = page;
}

async productVSurlChecker(url: string) {
    let productPart;
    if (url.includes('/products/')) {
        let productPartWithoutUrl = url.split('/products/')[1];
        productPart = productPartWithoutUrl.split('-').join(' ');
    }
    else if (url.includes('/search?q=')) {
        let productPartWithoutUrl = url.split('/search?q=')[1];
        productPart = productPartWithoutUrl.split('+').join(' ');
    }
    else{
        productPart = null;
    }


    return productPart;
    
}

async verifyCart() {
    const cart = await this.page.locator('//*[@id="cart_block"]');
        await cart.waitFor({state:"visible"});
        await cart.click({ force: true });
        await this.page.locator('#cart-sidebar div').filter({ hasText: 'Your Basket' }).getByRole('link').click();
        
        return await cart.isVisible();
    }
    
    async productClickFromHomepage(productIndex:String){
        const product = this.page.locator('.indiv-product').first();
        const productName = await product.locator('.indiv-product-title-text').textContent();
        const homePage = new HomePage(this.page);
        let newUrl;
        
        let productOldPrice = "No discount available";
        if (await product.locator('span.money.nosto-list-price').isVisible()) {
            productOldPrice = (await product.locator('span.money.nosto-list-price').textContent()) ?? "No discount available";
        }
        
        const productLivePrice = await product.locator('span.money.nosto-price').textContent();
        //console.log(productName+" "+productOldPrice+" "+productLivePrice);
        
          const initialUrl = this.page.url();
          await product.waitFor({state:"visible"});
          await product.click({ force: true });
          newUrl = await homePage.navigate(this.page.url());
          await this.page.waitForLoadState('domcontentloaded', { timeout: 120000 });

        
        const pageReloaded = await initialUrl !== newUrl;
        return { pageReloaded, newUrl, productName, productOldPrice, productLivePrice };
    }
    
    async addToCartFromDetails(url:string){
        const homePage = new HomePage(this.page);
        homePage.navigate(url);
        
        const DetailsLocator = await this.page.locator('.summary.entry-summary h2.name');
        await DetailsLocator.waitFor({state:'visible'});
        const isVisible = await DetailsLocator.isVisible();

        const description = await DetailsLocator.first().textContent();

        const livePrice = await this.page.locator('.summary.entry-summary #price').textContent();
        //console.log(" "+description+" "+livePrice);

        const addBasket= await this.page.locator('//*[@class="add_to_cart clearfix "]//input[@type="submit"]');
        addBasket.waitFor({state:'visible'});
        await addBasket.click({force: true});
        await this.page.waitForLoadState('load');
        await this.page.locator('//*[@class="cart-window"]//a[@class="close-cart"]').waitFor({state:'visible'});
        
        return {description, livePrice};
    }
}