import { expectInputValue, expectLocatorTobeVisible, headerToHaveText } from '../utils/helper'
import { test, expect } from '../utils/fixtures'

const expectedValues = [
    { value: 'SEDAN', text: 'Sedan' },
    { value: 'SUV', text: 'SUV' },
    { value: 'MPV', text: 'MPV' },
    { value: 'VAN', text: 'Van' },
    { value: 'ALL_TYPES', text: 'All Types' }
]

const vehicles = [
    { type: 'Sedan', vehicle: ['VIOS', 'CAMRY'] },
    { type: 'SUV', vehicle: ['COROLLA CROSS', 'FORTUNER'] },
    { type: 'MPV', vehicle: ['INNOVA'] },
    { type: 'VAN', vehicle: ['HIACE COMMUTER', 'HIACE GL GRANDIA', 'HIACE SUPER GRANDIA ELITE', 'SUPER GRANDIA ELITE', 'ALPHARD'] },
    { type: 'All Types', vehicle: ['VIOS', 'CAMRY', 'COROLLA CROSS', 'FORTUNER', 'INNOVA', 'HIACE COMMUTER', 'HIACE GL GRANDIA', 'HIACE SUPER GRANDIA ELITE', 'SUPER GRANDIA ELITE', 'ALPHARD'] },
]

const engine = [
    { type: 'Gas', vehicle: ['VIOS', 'ALPHARD'] },
    { type: 'Diesel', vehicle: ['FORTUNER', 'INNOVA', 'HIACE GL GRANDIA', 'HIACE SUPER GRANDIA ELITE', 'SUPER GRANDIA ELITE'] },
    { type: 'Hybrid', vehicle: ['CAMRY', 'COROLLA CROSS'] }
]

const transmission = [
    { type: 'M/T', vehicle: ['HIACE COMMUTER'] },
    { type: 'A/T', vehicle: ['VIOS', 'CAMRY', 'COROLLA CROSS', 'FORTUNER', 'INNOVA', 'HIACE GL GRANDIA', 'HIACE SUPER GRANDIA ELITE', 'SUPER GRANDIA ELITE', 'ALPHARD'] },
]

const year_model = [
    { year: '2020' },
    { year: '2021' },
    { year: '2022' },
    { year: '2023' }
]

const coding = [
    { day: 'Monday', date: 25 },
    { day: 'Tuesday', date: 26 },
    { day: 'Wednesday', date: 27 },
    { day: 'Thursday', date: 28 },
    { day: 'Friday', date: 29 }
]

test.describe('Self Drive Test', () => {
    test.beforeEach(async ({ book, context }) => {
        await context.clearCookies()
        await book.homepage()
        await book.acceptCookies()
    })

    test('Access Self-Drive Option', async ({ book }) => {
        await book.selfDriveButton.click()
        await expectLocatorTobeVisible(book.selfDriveButton)
    })

    test('Select Valid Pick-up Date and Return Date', async ({ book }) => {
        await book.pickUpDateTime('September', 10, '11:00')
        await book.returnDateTime('September', 11, '11:00')

        await expectInputValue(book.date.first(), 'September 10, 2025')
        await expectInputValue(book.date.nth(1), 'September 11, 2025')
        await expectInputValue(book.time.first(), '11:00')
        await expectInputValue(book.time.nth(1), '11:00')
    })

    test('Return Before Pick-up Date Validation', async ({ book }) => {
        await book.pickUpDateTime('September', 11, '11:00')
        await book.disabledDate('September', 10)
    })

    test('Select Return Date First and Pick-up Date ahead of Return Date', async ({ book }) => {
        await book.returnDate('September', 11)
        await book.pickDate('September', 22)

        await expectInputValue(book.date.nth(1), 'September 22, 2025')
        await expectInputValue(book.date.first(), 'September 22, 2025')
    })

    test('Select Vehicle Type', async ({ book }) => {
        await book.verifyVehicleDropdown(expectedValues)
    })

    test('Click Availability Now with blank date and time', async ({ book }) => {
        await book.checkAvailabilityNow()
        await book.errorLabelHandlers('This field is required')
    })

    test('Hover Pick-up & Drop-off Station Question Mark', async ({ book }) => {
        await book.page.locator("(//*[name()='svg'])[8]").hover()
        await expectLocatorTobeVisible(book.page.getByText('The currently supported pick-up & drop-off is GT Tower Makati. '))
        await book.learnMoreAbout()

        const newPage = book.page.context().newPage()
        await headerToHaveText(book.page.getByRole('heading', { level: 1 }), 'Stations')
    })

    test.describe('Verification of Vehicle Types', () => {
        vehicles.forEach(({ type, vehicle }) => {
            test(`Verify each Vehicle Types per Selection: ${type}`, async ({ book }) => {
                await book.selfDriveProcess(
                    'September', 10, '11:00',
                    'September', 11, '11:00',
                    type
                )
                await book.page.waitForTimeout(8000)
                for (const model of vehicle) {
                    const item = book.vehicleAvailability.getByText(model, { exact: true })
                    await expect(item).toHaveAttribute('id', 'vehicle-model')
                    await expect(item).toHaveCount(1)
                }
            })
        })
    })

    test.describe('Reserve a Car as Guest', () => {
        test.beforeEach(async ({ book }) => {
            await book.selfDriveProcess(
                'September', 10, '11:00',
                'September', 11, '11:00',
                'All Types'
            )

            await book.choosePickVehicle()
            await book.reserveCar()
            await expectLocatorTobeVisible(book.page.locator("//h2[normalize-space()='Login now to get your car']"))
        })

        test('should redirect to login page when clicking Login Instead Button', async ({ book }) => {
            await book.page.getByRole('button', { name: 'Register', exact: true }).click()
            await book.page.waitForTimeout(2000)
            await headerToHaveText(book.page.getByRole('heading', { level: 1 }), 'Register')
        })

        test('should redirect to register page when clicking Register Button', async ({ book }) => {
            await book.page.getByRole('button', { name: 'Login Instead', exact: true }).click()
            await headerToHaveText(book.page.getByRole('heading', { level: 1 }), 'Login')
        })
    })

    test.describe('Verify the usage of each Filters', () => {
        test.beforeEach(async ({ book }) => {
            await book.selfDriveProcess(
                'September', 10, '11:00',
                'September', 11, '11:00',
                'All Types'
            )
        })

        test('Select a Car from Availability', async ({ book }) => {
            await book.chooseVehicle()
            await expectLocatorTobeVisible(book.page.getByText("Please select a variant that you want to book."))
        })

        test('Hard Refresh Page Button', async ({ book }) => {
            await book.hardRefresh()

            await expectLocatorTobeVisible(book.page.getByText('Model Availability'))
        })

        engine.forEach(({ type, vehicle }) => {
            test(`Filter: Engine ${type}`, async ({ book }) => {
                await book.page.waitForTimeout(4000)
                await book.filter('Engine', type)

                for (const model of vehicle) {
                    const item = book.vehicleAvailability.getByText(model, { exact: true })
                    await expect(item).toHaveAttribute('id', 'vehicle-model')
                    await expect(item).toHaveCount(1)
                }
            })
        })

        transmission.forEach(({ type, vehicle }) => {
            test(`Filter: Transmission ${type}`, async ({ book }) => {
                await book.page.waitForTimeout(4000)
                await book.filter('Transmission', type)

                for (const model of vehicle) {
                    const item = book.vehicleAvailability.getByText(model, { exact: true })
                    await expect(item).toHaveAttribute('id', 'vehicle-model')
                    await expect(item).toHaveCount(1)
                }
            })
        })

        year_model.forEach(({ year }) => {
            test(`Filter: Vehicle Year Model ${year} `, async ({ book }) => {
                await book.page.waitForTimeout(4000)
                await book.filterYear('Year Model', year, year)
                await book.page.waitForTimeout(4000)
                await book.itemcardYearModel(year)
            })
        })

    })

    test.describe('Verify Link Reference used on Vehicle Selections', () => {
        test.beforeEach(async ({ book }) => {
            await book.selfDriveProcess(
                'September', 10, '11:00',
                'September', 11, '11:00',
                'All Types'
            )

            await book.choosePickVehicle()
        })

        test('Link reference on Security Deposit Mechanics', async ({ book }) => {
            await book.payment('https://preview.toyotacarrental-alpha.pages.dev/information/faq#:~:text=foreign%20driver%27s%20license%3F-,Payment,-What%20are%20the')
        })

        test('Link reference on Coding Mechanics', async ({ book }) => {
            await book.coding('https://preview.toyotacarrental-alpha.pages.dev/information/number-coding#:~:text=Rule%20of%20Number%20Coding')
        })
    })

    test.describe('Verify Vehicles Available: Coding Days', () => {
        coding.forEach(({ day, date }) => {
            test(`Verify Vehicles that have Coding Day on ${day} will not be available`, async ({ book }) => {
                await book.selfDriveProcess(
                    'August', date, '07:00',
                    'August', date, '19:00',
                    'All Types'
                )
                await book.page.waitForTimeout(4000)
                await book.itemcard(day)
            })
        })

        coding.forEach(({ day }) => {
            test(`Verify Vehicles per Coding Day: ${day}`, async ({ book }) => {
                await book.selfDriveProcess(
                    'August', 16, '07:00',
                    'August', 16, '19:00',
                    'All Types'
                )
                await book.page.waitForTimeout(2500)
                await book.filter('Coding Day', day)

                await book.page.waitForTimeout(4000)
                await book.itemcardToContainText(day)
            })
        })

    })


    test('Test Inquire Functionality', async ({ book }) => {
        await book.clickServices()
        await book.informationDropdown('For Corporate Account')
        await book.clickInquire()

        await book.selfDriveButton.click()
        await expectLocatorTobeVisible(book.selfDriveButton)

        await book.selfDriveProcess(
            'September', 10, '11:00',
            'September', 11, '11:00',
            'All Types'
        )
        await book.choosePickVehicle()
        await book.inquireCar()
        await book.confirmInquiry()
    })
})


test.describe('Chauffeur-Driven Test', () => {
    test.beforeEach(async ({ book }) => {
        await book.homepage()
        await book.chauffeurButton()
        await expectLocatorTobeVisible(book.chauffeur)
    })

    test('Access Chauffeur Option', async ({ book }) => {
        book.chauffeurButton()
        expectLocatorTobeVisible(book.chauffeur)
    })

    test('Select Valid Pick-up Date and Return Date', async ({ book }) => {
        await book.pickDate('September', 10)
        await book.pickTime('07:00')
        await book.returnDate('September', 10)
        await book.returnTime('11:00')

        await expectInputValue(book.date.first(), 'September 10, 2025')
        await expectInputValue(book.date.nth(1), 'September 10, 2025')
        await expectInputValue(book.time.first(), '07:00')
        await expectInputValue(book.time.nth(1), '11:00')
    })

    test('User can only book for a max of 12 hours a day', async ({ book }) => {
        await book.pickDate('September', 11)
        await book.pickTime('7:00')
        await book.returnDate('September', 11)
        await book.returnTime('21:00')
        await book.disabledDate('September', 12)

        await expectInputValue(book.time.nth(1), '19:00')
    })

    test('Pick-up location functionality', async ({ book }) => {
        await book.enterPickup('Kalayaan')
        await book.pickupLocation('Kalayaan Avenue, Makati City, Metro Manila')

        await expectInputValue(book.pickup.first(), 'Kalayaan Avenue, Makati City, Metro Manila')
    })


    test('Drop Off location functionality', async ({ book }) => {
        await book.enterDropoff('Makati Ave')
        await book.dropoffLocation('Makati Avenue, Makati, Metro Manila')

        await expectInputValue(book.dropoff, 'Makati Avenue, Makati, Metro Manila')
    })


    test('Click Availability Now with blank date and time', async ({ book }) => {
        await book.enterPickup('Kalayaan')
        await book.pickupLocation('Kalayaan Avenue, Makati City, Metro Manila')
        await book.enterDropoff('Makati Ave')
        await book.dropoffLocation('Makati Avenue, Makati, Metro Manila')

        await book.checkAvailabilityNow()
        await book.errorLabelHandlers('This field is required')
    })

    test('Click Availability Now without pick-up and drop-off location', async ({ book }) => {
        await book.pickDate('September', 11)
        await book.pickTime('07:00')
        await book.returnDate('September', 11)
        await book.returnTime('19:00')

        await book.checkAvailabilityNow()
        await book.errorLabelHandlers('This field is required')
    })

    test('Not Selecting the Right Location', async ({ book }) => {
        await book.enterPickup('Kalayaan')
        await book.enterDropoff('Makati Ave')
        await book.checkAvailabilityNow()

        await book.errorLabelHandlers('Please select the right location')
    })

    test('Out of Coverage Location for Pick-up', async ({ book }) => {
        await book.enterPickup('Cavite')
        await expectLocatorTobeVisible(book.page.getByText('Inputted Address is Not Within Metro Manila'))
    })

    test('Out of Coverage Location for Dropoff', async ({ book }) => {
        await book.enterDropoff('Pampanga')
        await expectLocatorTobeVisible(book.page.getByText('Inputted Address is Not Within Metro Manila'))
    })
})

test.describe('Self-Drive with Car Delivery Test', () => {
    test.beforeEach(async ({ book }) => {
        await book.homepage()
        await book.carDelivery()
        await expectLocatorTobeVisible(book.carDeliveryButton)
    })

    test('Access Self Drive with Car Delivery Option', async ({ book }) => {
        book.carDelivery
        await expectLocatorTobeVisible(book.carDeliveryButton)
    })

    test('Select Valid Deliver Date and Return Date', async ({ book }) => {
        await book.pickDate('September', 10)
        await book.pickTime('08:15')
        await book.returnDate('September', 10)
        await book.returnTime('11:00')

        await expectInputValue(book.date.first(), 'September 10, 2025')
        await expectInputValue(book.date.nth(1), 'September 10, 2025')
        await expectInputValue(book.time.first(), '08:15')
        await expectInputValue(book.time.nth(1), '11:00')
    })

    test('Return Before Deliver Date Validation', async ({ book }) => {
        await book.pickUpDateTime('September', 11, '11:00')
        await book.disabledDate('September', 10)
    })

    test('Select Return Date First and Deliver Date ahead of Return Date', async ({ book }) => {
        await book.returnDate('September', 11)
        await book.pickDate('September', 22)

        await expectInputValue(book.date.nth(1), 'September 22, 2025')
        await expectInputValue(book.date.first(), 'September 22, 2025')
    })

    test('User can only book within operating hours', async ({ book }) => {
        await book.pickDate('September', 11)
        await book.pickTime('7:00')
        await book.returnDate('September', 11)
        await book.returnTime('21:00')

        await expectInputValue(book.time.nth(1), '19:00')
    })

    test('Delivery location functionality', async ({ book }) => {
        await book.carPickupDelivery('Kalayaan')
        await book.pickupLocation('Kalayaan Avenue, Makati City, Metro Manila')

        await expectInputValue(book.pickup.nth(1), 'Kalayaan Avenue, Makati City, Metro Manila')
    })


    test('Return Car After Rent functionality', async ({ book }) => {
        await book.collectCarCheckbox()
        await book.returnLocation('Makati Ave')
        await book.dropoffLocation('Makati Avenue, Makati, Metro Manila')

        await expectInputValue(book.return, 'Makati Avenue, Makati, Metro Manila')
    })


    test('Click Availability Now with blank date and time', async ({ book }) => {
        await book.carPickupDelivery('Kalayaan')
        await book.pickupLocation('Kalayaan Avenue, Makati City, Metro Manila')

        await book.collectCarCheckbox()
        await book.returnLocation('Makati Ave')
        await book.dropoffLocation('Makati Avenue, Makati, Metro Manila')

        await book.checkAvailabilityNow()
        await book.errorLabelHandlers('This field is required')
    })

    test('Click Availability Now without Deliver Location', async ({ book }) => {
        await book.pickDate('September', 11)
        await book.pickTime('07:00')
        await book.returnDate('September', 11)
        await book.returnTime('19:00')

        await book.checkAvailabilityNow()
        await book.errorLabelHandlers('This field is required')
    })

    test('Not Selecting the Right Location', async ({ book }) => {
        await book.carPickupDelivery('Kalayaan')
        await book.collectCarCheckbox()
        await book.returnLocation('Makati Ave')
        await book.checkAvailabilityNow()

        await book.errorLabelHandlers('Please select the right location')
    })

    test('Out of Coverage Location for Pick-up', async ({ book }) => {
        await book.carPickupDelivery('Cavite')
        await expectLocatorTobeVisible(book.page.getByText('Inputted Address is Not Within Metro Manila'))
    })

    test('Out of Coverage Location for Dropoff', async ({ book }) => {
        await book.collectCarCheckbox()
        await book.returnLocation('Pampanga')
        await expectLocatorTobeVisible(book.page.getByText('Inputted Address is Not Within Metro Manila'))
    })
})