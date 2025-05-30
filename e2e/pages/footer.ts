import { expect, type Page , type Locator} from '@playwright/test'

export class FooterModule{
    public page: Page

    heading: Locator

    constructor(page: Page){
        this.page = page
        this.heading = this.page.getByRole('heading', { level: 1 })
    }

    async clickFooterLinkByText(footer: string, reference: string){
        const links = await this.page.$$("//ul//li//a[contains(@class, 'hover:underline')]")

        for (const link of links){
            const linkText = (await link.textContent())?.trim()

            if(linkText === footer){
                await link.click()

                const newPage = await this.page.context().waitForEvent('page')
                await newPage.waitForLoadState('load')

                const currentURL = new URL(newPage.url())

                expect(currentURL.href).toBe(reference)
                break;
            }
        }
    }

    async clickItem(loc: string){
        const link = this.page.getByRole('link', {name: loc, exact: true})
        await link.click()
    }  
}