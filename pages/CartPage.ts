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
        const [response] = await Promise.all([
          product.waitFor({state:"visible"}),
          product.click({ force: true }),
          newUrl = homePage.navigate(this.page.url()),
          this.page.waitForLoadState('load')
        ]);
        
        const pageReloaded = await initialUrl !== newUrl;
        return { pageReloaded, newUrl, productName, productOldPrice, productLivePrice };
    }
    
    async addToCartFromDetails(url:string){
        const homePage = new HomePage(this.page);
        homePage.navigate(url);
        
        const descriptionLocator = await this.page.locator('//*[@id="quickview_product"]/div[2]/div/div/h2');
        await descriptionLocator.waitFor({state:'visible'});
        const description = await descriptionLocator.first().textContent();

        const livePrice = await this.page.locator('.summary.entry-summary #price').textContent();
        //console.log(" "+description+" "+livePrice);

        const addBasket= await this.page.locator('//*[@id="AddToCart-template--15432921153587__main"]');
        addBasket.waitFor({state:'visible'});
        await addBasket.click({force: true});
        await this.page.locator('//*[@id="cart-sidebar"]/div[3]/div/a').waitFor({state:'visible'});
        
        return {description, livePrice};
    }
}