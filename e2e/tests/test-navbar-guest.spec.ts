import { expectLocatorTobeVisible, headerToHaveText } from '../utils/helper'
import { test, expect } from '../utils/fixtures'

test.beforeEach(async ({ page, context}) => {
    await context.clearCookies()
    await page.goto('/')
    await expect(page.getByText('"Accept Cookies"')).toBeVisible()
    await page.getByRole('button', { name: 'Cookie icon Accept Cookies' }).click();
})

const information = [
    { info: 'How to use Toyota RentαCar', contain: '/information/how-to-use-toyota-rentacar', h1: 'How to use ToyotaRentαCar' },
    { info: 'Service Types', contain: '/information/service-types', h1: 'Service Types' },
    { info: 'Vehicle Models', contain: '/information/vehicles/self-drive', h1: 'Vehicles' },
    { info: 'Stations', contain: '/information/stations', h1: 'Stations' },
    { info: 'FAQ', contain: '/information/faq', h1: 'Frequently Asked Questions' },
    { info: 'Check Terms of Services', contain: '/information/terms-services', h1: 'Terms of Services' },
]

const special_services = [
    { services: 'For Corporate Account', contain: '/special-services/corporate-account', h1: 'Corporate Account' },
    { services: 'For long-term rental/lease', contain: '/special-services/long-term-rental-lease', h1: 'Long-term Rental and Lease' },
    { services: 'Car Rental Service for Hotel/Tourism Industry', contain: '/special-services/car-rental-service-for-hotel-tourism-industry', h1: 'Car Rental Service for Hotel and Tourism Industry' },
    { services: '日系企業・日本人向けサービス', contain: '/special-services/japanese-customers', h1: '日系企業・日本人のお客様はこちら' }
]

information.forEach(({ info, contain, h1 }) => {
    test(`Visibility and Functionality of ${info} Dropdown Button`, async ({ navBar }) => {
        await navBar.clickInfomation()
        await navBar.informationDropdown(info)
        await expect(navBar.page).toHaveURL(new RegExp(contain))
        
        const heading = navBar.page.getByRole('heading', { level: 1 })
        await expectLocatorTobeVisible(heading)
        await headerToHaveText(heading, h1)
    })
})

special_services.forEach(({ services, contain, h1 }) => {
    test(`Visibility and Functionality of ${services} Dropdown Button`, async ({ navBar }) => {
        await navBar.clickServices()
        await navBar.informationDropdown(services)
        await expect(navBar.page).toHaveURL(new RegExp(contain))
                
        const heading = navBar.page.getByRole('heading', { level: 1 })
        await expectLocatorTobeVisible(heading)
        await headerToHaveText(heading, h1)
    })
})

test('Visibility and Functionality Register Button', async ({ navBar }) => {
    await navBar.clickRegister()
    await expect(navBar.page).toHaveURL(new RegExp('/auth/register'))

            
    const heading = navBar.page.getByRole('heading', { level: 1 })
    await expectLocatorTobeVisible(heading)
    await headerToHaveText(heading, 'Register')
})

test('Visibility and Functionality Login Button', async ({ navBar }) => {
    await navBar.clickLogin()
    await expect(navBar.page).toHaveURL(new RegExp('/auth/login'))

    const heading = navBar.page.getByRole('heading', { level: 1 })
    await expectLocatorTobeVisible(heading)
    await headerToHaveText(heading, 'Login')
})