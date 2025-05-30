import { test, expect } from '../utils/fixtures'

test.beforeEach( async ({page, context}) => {
    await context.clearCookies()
    await page.goto('/')
    await expect(page.getByText('"Accept Cookies"')).toBeVisible()
    await page.getByRole('button', { name: 'Cookie icon Accept Cookies' }).click();
})

test('Inquire as Corporate', async ({homePage}) => {
    await homePage.clickInquire()
    await expect(homePage.page).toHaveURL('/special-services/corporate-account')
})

test('Inquiry through call', async ({homePage}) => {
    await homePage.clickCall()
    await expect(homePage.page).toHaveURL('/booking/form')
})

test('Update your Booking', async ({homePage}) => {
    await homePage.clickUpdate()
    await expect(homePage.page).toHaveURL('/auth/login')
})

test('For Long-term Rental/Release', async ({homePage}) => {
    await homePage.clickLongTerm()
    await expect(homePage.page).toHaveURL('/special-services/long-term-rental-lease')
})

test('日系企業・日本人のお客様はこちらから', async ({homePage}) => {
    await homePage.clickJapaneseContent()
    await expect(homePage.page).toHaveURL('/special-services/japanese-customers')
})

// test('Newsroom', async ({homePage}) => {
//     await homePage.clickNews()
//     await expect(homePage.page).toHaveURL('/newsroom/2025/04/toyota-rent-car-is-now')
// })

// test('Newsroom 1', async ({homePage}) => {
//     await homePage.clickNews1()
//     await expect(homePage.page).toHaveURL('/newsroom/2025/03/new-models')
// })

test('Why Toyota RentαCar is the most "Hassle-Free" Car Rental Service in the Philippines?', async ({homePage}) => {
    await homePage.moreAbout('Why Toyota RentαCar is the most "Hassle-Free" Car Rental Service in the Philippines?')
    await expect(homePage.page).toHaveURL('/information/why-us')
})

test('How to Use Toyota RentαCar?', async ({homePage}) => {
    await homePage.moreAbout('How to Use Toyota RentαCar?')
    await expect(homePage.page).toHaveURL('/information/how-to-use-toyota-rentacar')
})

test('Service Types', async ({homePage}) => {
    await homePage.moreAbout('Service Types')
    await expect(homePage.page).toHaveURL('/information/service-types')
})

test('Vehicle Types', async ({homePage}) => {
    await homePage.moreAbout('Vehicle Types')
    await expect(homePage.page).toHaveURL('/information/vehicles/self-drive')
})

test('Vehicle for Tourism Industry', async ({homePage}) => {
    await homePage.moreAbout('Vehicle for Tourism Industry')
    await expect(homePage.page).toHaveURL('/information/special-services/car-rental-service-for-hotel-tourism-industry')
})