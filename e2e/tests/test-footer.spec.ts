import { expectLocatorTobeVisible, headerToHaveText } from '../utils/helper'
import { test, expect } from '../utils/fixtures'

test.beforeEach(async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/')
    await expect(page.getByText('"Accept Cookies"')).toBeVisible()
    await page.getByRole('button', { name: 'Cookie icon Accept Cookies' }).click();
})

const footerLinks = [
    { info: 'Toyota Mobility Solutions Philippines', url: 'https://www.toyota-mobilitysolutions.ph/' },
    { info: 'Mobility for People', url: 'https://www.toyota-mobilitysolutions.ph/mobility-for-people' },
    { info: 'Mobility for Goods', url: 'https://www.toyota-mobilitysolutions.ph/mobility-for-goods' },
    { info: 'Newsroom', url: 'https://www.toyota-mobilitysolutions.ph/newsroom' },
    { info: 'About Us', url: 'https://www.toyota-mobilitysolutions.ph/about-us' },
    { info: 'Careers', url: 'https://www.toyota-mobilitysolutions.ph/careers' },
    { info: 'myTOYOTA Shuttle PH', url: 'https://www.toyota-mobilitysolutions.ph/my-toyota-shuttle' },
    { info: 'Fleet Connected Services', url: 'https://www.toyota-mobilitysolutions.ph/fleet-connected-services' },
    { info: 'Fleet Management Services', url: 'https://www.toyota-mobilitysolutions.ph/fleet-management-services' },
    { info: 'KINTO One Business', url: 'https://www.toyota-mobilitysolutions.ph/kinto-one-business' },
    { info: 'Toyota Logistics Matching Services', url: 'https://toyotalogistics.com.ph/' },
    { info: 'Toyota Motor Philippines', url: 'https://toyota.com.ph/' },
    { info: 'Lexus Philippines', url: 'https://www.lexus.com.ph/en.html' },
    { info: 'Toyota Financial Services PH', url: 'https://www.toyotafinancial.ph/' },
    { info: 'myTOYOTA Wallet', url: 'https://www.toyotafinancial.ph/mytoyotawallet' },
    { info: 'myTOYOTA App', url: 'https://toyota.com.ph/mytoyota' },
    { info: 'KINTO One', url: 'https://kinto-ph.com/' },
]

const legalItems = [
    { info: 'Privacy Policy', pathname: '/legal/privacy-policy', heading: 'Privacy Policy' },
    { info: 'Terms and Conditions', pathname: '/legal/terms-conditions', heading: 'Terms and Conditions' },
    { info: 'Cookie Policy', pathname: '/legal/cookie-policy', heading: 'Cookie Policy' },
]

// Test for footer external links
footerLinks.forEach(({ info, url }) => {
    test(`Verify Footer Link: ${info}`, async ({ footer }) => {
        await footer.clickFooterLinkByText(info, url)
    })
})

// Test for internal legal links (Privacy Policy, etc.)
legalItems.forEach(({ info, pathname, heading }) => {
    test(`Verify Internal Footer Link: ${info}`, async ({ footer }) => {
        await footer.clickItem(info)
        await expect(footer.page).toHaveURL(new RegExp(pathname))
        await expectLocatorTobeVisible(footer.heading)
        await headerToHaveText(footer.heading, heading)
    })
})
