import { expect, Page } from '@playwright/test';


export class HomePage {
    constructor(private page: Page) {
    this.page = page;
}

async navigate(url: string) {
    try{
        await this.page.goto(url,{waitUntil:'load'});
    }catch(error){
        console.log("Error in navigating to URL: "+url);
    }
    return url;
}

async isLogoVisible() {
    const logo = await this.page.locator('#shopify-section-header-main-new').getByRole('link', { name: 'logo' });
    return logo.isVisible();
}

async navbar(expectedNavbar: string[]) {
    const menuAllItems: string[] = [];
    for(const item of expectedNavbar){
        const menuItem = await this.page.locator('li.megamenu-item',{ hasText:item });
        await expect(menuItem).toBeVisible();  
        await menuItem.hover({force:true});
        await this.page.waitForLoadState('domcontentloaded');
        const dropDown = await menuItem.locator('.menu-box');
        menuAllItems.push(await menuItem.innerText());
    }
    return menuAllItems;
}

async searchByProductCategory(category: string) {
    const searchBox=this.page.locator('input[type="text"]').first();
    await searchBox.fill(category);
    while (!await this.page.url().includes('search')) {
        await searchBox.click();
        await searchBox.press('Enter');
        await this.page.waitForTimeout(1000);
    }    
    const currentUrl = await this.page.url();
    return currentUrl;
}
 
async searchByProductNameSuggestion(product: string, dropdown: string) {
    const searchBox= this.page.locator('input[type="text"]').first();
    searchBox.fill(product);
    await searchBox.click();    
    await this.page.waitForSelector('li.boost-pfs-search-suggestion-header-suggestions',{state: 'visible'});
    const products = await this.page.locator('.boost-pfs-search-suggestion-product-title').all();
    for (const product of products) {
        const productText = await product.textContent();
        if (productText && productText.trim().toLowerCase() === dropdown.trim().toLowerCase()) {
            await product.click();
            break;
        }
    }
    await this.page.waitForLoadState('load');
    
    const currentUrl = await this.page.url();
    return currentUrl;
}

async openCart() {
    await this.page.locator('#cart_block').click({force:true});
    let cartStatus = this.page.locator('div[class="empty"]');
    if(await cartStatus.isVisible()){
        await this.page.locator('a.close-cart').first().click();
        return null;
    }
    else{
        const currentUrl = await this.page.url();
        return currentUrl;
        // cartStatus = this.page.locator('div.cart-total');
        // console.log("SOEMTHING  "+ cartStatus.innerText());
        }
    }
}
