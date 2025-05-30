import { type Page , type Locator, expect} from '@playwright/test'

export class homePage{
    public page: Page

    inquire: Locator
    call : Locator
    update: Locator
    long_term: Locator
    japanese: Locator
    news: Locator
    news1: Locator
    more: Locator

    constructor(page: Page) {
        this.page = page

        this.inquire = this.page.getByRole('link', { name: 'Inquire as Corporate' })
        this.call = this.page.getByRole('link', { name: 'Inquiry through Call' })
        this.update = this.page.getByRole('link', { name: 'Update your Booking' })
        this.long_term = this.page.getByRole('link', { name: 'For Long-term Rental/Lease' })
        this.japanese = this.page.getByRole('link', { name: '日系企業・日本人のお客様はこちらから' })
        this.news = this.page.locator('astro-blog-item-small').filter({ hasText: 'Apr 04, 2025 • News Toyota' }).getByRole('link')
        this.news1 = this.page.locator('astro-blog-item-small').filter({ hasText: 'Mar 31, 2025 • Announcement' }).getByRole('link')
        this.more = this.page.locator("(//div[@class='w-full flex justify-between items-center'])")
    }

    async clickInquire(){
        await expect(this.inquire).toBeVisible()
        await this.inquire.click()
    }

    async clickCall(){
        await this.call.click()
    }

    async clickUpdate(){
        await this.update.click()
    }

    async clickLongTerm(){
        await this.long_term.click()
    }

    async clickJapaneseContent(){
        await this.japanese.click()
    }

    // async clickNews(){
    //     await this.news.click()
    // }

    // async clickNews1(){
    //     await this.news1.click()
    // }

    async moreAbout(title: string){
        const moreButton = this.more.filter({hasText: title})
        await expect(moreButton).toBeVisible()
        await moreButton.click()
    }

}