import { expectLocatorTobeVisible } from '../utils/helper'
import { test, expect } from '../utils/fixtures'

test.use({ storageState: '.auth/login.json' })

test.describe('Self Driven Test', () => {
    // test.slow()
    test.beforeEach(async ({ book }) => {
        await book.homepage()
    })

    test.describe('Test Payment Options and Functionality', () => {
        test.beforeEach(async ({ book }) => {
            await book.selfDriveProcess(
                'September', 10, '11:00',
                'September', 11, '11:00',
                'All Types'
            )

            await book.choosePickVehicle()
            await book.reserveCar()
            await expectLocatorTobeVisible(book.page.getByText("Booking Summary"))
        })

        test('Reserve a Car as LoggedIn User', async ({ book }) => {
            expect(book.page.url()).toContain('/booking/payment?')
        })

        test('Disable Button for Incomplete Refund Account ', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.accountNumber.clear()

            await book.clickOnline()
            await expect(book.submit).toBeDisabled({ timeout: 5000 })

            await book.clickCounter()
            await expect(book.submit).toBeDisabled({ timeout: 5000 })
        })

        test('Confirm Reservation Uncheckedbox', async ({ book }) => {
            await book.refundProcess(
                'GCash',
                'Spongbob Squarepants',
                '09111174636'
            )
            await expect(book.proceedReservation).toBeDisabled({ timeout: 5000 })
        })

        test('Payment Options: Pay Online', async ({ book }) => {
            await book.refundProcess(
                'GCash',
                'Spongbob Squarepants',
                '09111174636'
            )
            await book.checkDocs()
            await book.clickProceed()
        })

        test('Payment Options: Pay Counter', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.enterAccountNumber('09111174636')

            await book.clickCounter()
            await book.clickSubmit()
            await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

            await book.checkDocs()
            await book.clickProceed()
        })

        test('Payment Gateway: Using Credit Card Payment', async ({ book }) => {
            await book.refundProcess(
                'GCash',
                'Spongbob Squarepants',
                '09111174636'
            )

            await book.checkDocs();
            await book.clickProceed();

            await book.paymentGatewayMethod(
                'Credit Card Payment',
                '4111-1111-1111-1111-',
                '11/30',
                '123',
                'Spongebob Squarepants',
                'spongebob@gmail.com',
                '123456'
            )
        })

        test('Payment Gateway: Using Counter Payment', async ({ book }) => {
            await book.refundProcessCounter(
                'GCash',
                'Spongbob Squarepants',
                '09111174636'
            )

            await book.checkDocs();
            await book.clickProceed();
        })
    })

})

test.describe('Chauffeur-Driven Test', () => {
    // test.slow()
    test.beforeEach(async ({ book }) => {
        await book.homepage()
        await book.chauffeurButton()
        await expectLocatorTobeVisible(book.chauffeur)
    })

    test.describe('Test Payment Options and Functionality', () => {
        test.beforeEach(async ({ book }) => {
            await book.pickDate('September', 10)
            await book.pickTime('08:15')
            await book.returnDate('September', 10)
            await book.returnTime('11:00')

            await book.enterPickup('Kalayaan')
            await book.pickupLocation('Kalayaan Avenue, Makati City, Metro Manila')
            await book.enterDropoff('Sm Jazz')
            await book.dropoffLocation('SM Jazz Mall, Nicanor Garcia, Makati City, Metro Manila')

            await book.vehicleType('All Types')
            await book.page.waitForTimeout(3000)
            await book.checkAvailabilityNow()

            await book.choosePickVehicle()
            await book.reserveCar()
            await expectLocatorTobeVisible(book.page.getByText("Booking Summary"))
            await book.page.waitForTimeout(3000)
        })

        test('Reserve a Car as LoggedIn User', async ({ book }) => {
            expect(book.page.url()).toContain('/booking/payment?')
        })

        test('Disable Button for Incomplete Refund Account ', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.accountNumber.clear()

            await book.clickOnline()
            await expect(book.submit).toBeDisabled({ timeout: 5000 })

            await book.clickCounter()
            await expect(book.submit).toBeDisabled({ timeout: 5000 })
        })

        test('Confirm Reservation Uncheckedbox', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.enterAccountNumber('09111174636')
            await book.contactPerson()

            await book.clickOnline()
            await book.clickSubmit()
            await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

            await expect(book.proceedReservation).toBeDisabled({ timeout: 5000 })
        })

        test('Payment Options: Pay Online', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.enterAccountNumber('09111174636')
            await book.contactPerson()

            await book.clickOnline()
            await book.clickSubmit()
            await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

            await book.checkDocs()
            await book.clickProceed()
        })

        test('Payment Options: Pay Counter', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.enterAccountNumber('09111174636')
            await book.contactPerson()

            await book.clickCounter()
            await book.clickSubmit()
            await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

            await book.checkDocs()
            await book.clickProceed()
        })

        test('Payment Gateway: Using Credit Card Payment', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.enterAccountNumber('09111174636')
            await book.contactPerson()

            await book.clickOnline()
            await book.clickSubmit()

            await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

            await book.checkDocs();
            await book.clickProceed();

            await book.paymentGatewayMethod(
                'Credit Card Payment',
                '4111-1111-1111-1111-',
                '11/30',
                '123',
                'Spongebob Squarepants',
                'spongebob@gmail.com',
                '123456'
            )
        })

        test('Payment Gateway: Using Counter Payment', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.enterAccountNumber('09111174636')
            await book.contactPerson()

            await book.clickCounter()
            await book.clickSubmit()

            await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

            await book.checkDocs();
            await book.clickProceed();
        })

    })
})

test.describe('Self-Drive with Car Delivery Test', () => {
    // test.slow()
    test.beforeEach(async ({ book }) => {
        await book.homepage()
        await book.carDelivery()
        await expectLocatorTobeVisible(book.carDeliveryButton)
    })

    test.describe('Test Payment Options and Functionality', () => {
        test.beforeEach(async ({ book }) => {
            await book.pickDate('September', 10)
            await book.pickTime('08:15')
            await book.returnDate('September', 10)
            await book.returnTime('11:00')

            await book.carPickupDelivery('Kalayaan')
            await book.pickupLocation('Kalayaan Avenue, Makati City, Metro Manila')

            await book.vehicleType('All Types')
            await book.page.waitForTimeout(3000)
            await book.checkAvailabilityNow()

            await book.choosePickVehicle()
            await book.reserveCar()
            await expectLocatorTobeVisible(book.page.getByText("Booking Summary"))
            await book.page.waitForTimeout(3000)
        })

        test('Reserve a Car as LoggedIn User', async ({ book }) => {
            expect(book.page.url()).toContain('/booking/payment?')
        })

        test('Disable Button for Incomplete Refund Account ', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.accountNumber.clear()

            await book.clickOnline()
            await expect(book.submit).toBeDisabled({ timeout: 5000 })

            await book.clickCounter()
            await expect(book.submit).toBeDisabled({ timeout: 5000 })
        })

        test('Confirm Reservation Uncheckedbox', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.enterAccountNumber('09111174636')

            await book.clickOnline()
            await book.clickSubmit()
            await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

            await expect(book.proceedReservation).toBeDisabled({ timeout: 5000 })
        })

        test('Payment Options: Pay Online', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.enterAccountNumber('09111174636')

            await book.clickOnline()
            await book.clickSubmit()
            await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

            await book.checkDocs()
            await book.clickProceed()
        })

        test('Payment Options: Pay Counter', async ({ book }) => {
            await book.refundOptions('GCash')
            await book.enterAccountName('Spongbob Squarepants')
            await book.enterAccountNumber('09111174636')

            await book.clickCounter()
            await book.clickSubmit()
            await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

            await book.checkDocs()
            await book.clickProceed()
        })

        test('Payment Gateway: Using Credit Card Payment', async ({ book }) => {
            await book.refundProcess(
                'GCash',
                'Spongbob Squarepants',
                '09111174636'
            )

            await book.checkDocs();
            await book.clickProceed();

            await book.paymentGatewayMethod(
                'Credit Card Payment',
                '4111-1111-1111-1111-',
                '11/30',
                '123',
                'Spongebob Squarepants',
                'spongebob@gmail.com',
                '123456'
            )
        })

        test('Payment Gateway: Using Counter Payment', async ({ book }) => {
            await book.refundProcessCounter(
                'GCash',
                'Spongbob Squarepants',
                '09111174636'
            )

            await book.checkDocs();
            await book.clickProceed();
        })

    })
})

test.describe('Self-Drive Full Process of Booking', () => {
    // test.slow()
    // Test Full Booking process of Self-drive asserting 
    // all inputs are accurate throughout the process of booking
    test.beforeEach(async ({ book }) => {
        await book.homepage()
        await book.selfDriveProcess(
            'September', 10, '11:00',
            'September', 11, '11:00',
            'All Types'
        )

        await book.choosePickVehicle()
        await book.reserveCar()
        await expectLocatorTobeVisible(book.page.getByText("Booking Summary"))

        await book.refundProcessCounter(
            'GCash',
            'Spongbob Squarepants',
            '09111174636'
        )

        await book.checkDocs();
        await book.clickProceed();
    })

    test('View Details Self-Drive Booking Process', async ({ book }) => {
        const bookingID = await book.page.locator("//div[@id='copy-fill']").textContent();

        if (!bookingID) {
            throw new Error("Booking ID not found!");
        }

        await book.seeBookingList();
        await book.ViewDetails(bookingID);

        await expectLocatorTobeVisible(book.page.getByText('Payment Details'))
    })

    test('Cancel Self-Drive Booking Process', async ({ book }) => {
        const bookingID = await book.page.locator("//div[@id='copy-fill']").textContent();

        if (!bookingID) {
            throw new Error("Booking ID not found!");
        }

        await book.seeBookingList();
        await book.CancelBooking(bookingID);
    })
})

// test.describe('Verify user input data is retained through the booking flow', () => {
//     test.slow()
//     test('Self-Driven @smoke', async ({ book }) => {
//         const start = 'September 23, 2025 | 08:30'
//         const end = 'September 24, 2025 | 08:30'

//         await book.homepage()
//         await book.selfDriveProcess(
//             'September', 23, '08:30',
//             'September', 24, '08:30',
//             'All Types'
//         )

//         // Verify the start and return date on Vehicle Selection
//         await book.bookingDate(start, end)
//         await book.waitForVehicleAvailabilityToLoad()
//         await book.waitForImages()
//         await book.choosePickVehicle()

//         //Store all vehicle details to verify the accuracy on Summary Details.
//         const elements = await book.page.locator("//div[@class='p-2']//div[@class='mb-3']").allTextContents();
//         const [transmission, seats, fuel, yearModel, color, codingDay] = elements;

//         await book.reserveCar()
//         await expectLocatorTobeVisible(book.page.getByText("Booking Summary"))

//         //Verify Booking Summary Details
//         await book.bookingSummaryDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)

//         await book.refundOptions('GCash')
//         await book.enterAccountName('Spongbob Squarepants')
//         await book.enterAccountNumber('09111174636')
//         await book.clickCounter()
//         await book.clickSubmit()
//         await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

//         //Verify Confirm Reservation Details
//         await book.confirmReservationDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)

//         await book.checkDocs()
//         await book.clickProceed()

//         const bookingID = await book.page.locator("//div[@id='copy-fill']").textContent();
//         const plateNumber = await book.page.locator("section[class='mt-5 flex gap-x-5 gap-y-2 flex-wrap justify-center'] div div[class='text-xl font-semibold']").textContent()

//         if (!bookingID) {
//             throw new Error("Booking ID not found!");
//         }

//         if (!plateNumber) {
//             throw new Error("Booking ID not found!");
//         }

//         await book.seeBookingList();

//         //Verify the Details on Manage Booking Page
//         await book.ViewDetails(bookingID);

//         //Verify the Details on View Details Page of the Booking
//         await expectLocatorTobeVisible(book.page.getByText('Payment Details'))
//         await book.bookingDetails(transmission, seats, fuel, codingDay, yearModel, plateNumber, start, end)
//     })


//     test('Chauffeur-Driven @smoke', async ({ book }) => {
//         const start = 'September 09, 2025 | 07:00'
//         const end = 'September 09, 2025 | 16:00'

//         await book.homepage()
//         await book.chauffeurButton()
//         await expectLocatorTobeVisible(book.chauffeur)
//         await book.pickDate('September', 9)
//         await book.pickTime('07:00')
//         await book.returnDate('September', 9)
//         await book.returnTime('16:00')

//         await book.enterPickup('Kalayaan')
//         await book.pickupLocation('Kalayaan Avenue, Makati City, Metro Manila')
//         await book.enterDropoff('Sm Jazz')
//         await book.dropoffLocation('SM Jazz Mall, Nicanor Garcia, Makati City, Metro Manila')

//         await book.vehicleType('All Types')
//         await book.page.waitForTimeout(3000)
//         await book.checkAvailabilityNow()

//         // Verify the start and return date on Vehicle Selection
//         await book.bookingDate(start, end)
//         await book.waitForVehicleAvailabilityToLoad()
//         await book.waitForImages()
//         await book.choosePickVehicle()

//         //Store all vehicle details to verify the accuracy on Summary Details.
//         const elements = await book.page.locator("//div[@class='p-2']//div[@class='mb-3']").allTextContents();
//         const [transmission, seats, fuel, yearModel, color, codingDay] = elements;

//         await book.reserveCar()
//         await expectLocatorTobeVisible(book.page.getByText("Booking Summary"))

//         //Verify Booking Summary Details
//         await book.bookingSummaryDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)

//         await book.refundOptions('GCash')
//         await book.enterAccountName('Spongbob Squarepants')
//         await book.enterAccountNumber('09111174636')
//         await book.contactPerson()
//         await book.clickCounter()
//         await book.clickSubmit()
//         await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

//         //Verify Confirm Reservation Details
//         await book.confirmReservationDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)

//         await book.checkDocs()
//         await book.clickProceed()

//         const bookingID = await book.page.locator("//div[@id='copy-fill']").textContent();
//         const plateNumber = await book.page.locator("section[class='mt-5 flex gap-x-5 gap-y-2 flex-wrap justify-center'] div div[class='text-xl font-semibold']").textContent()

//         if (!bookingID) {
//             throw new Error("Booking ID not found!");
//         }

//         if (!plateNumber) {
//             throw new Error("Booking ID not found!");
//         }

//         await book.seeBookingList();

//         //Verify the Details on Manage Booking Page
//         await book.ViewDetails(bookingID);

//         //Verify the Details on View Details Page of the Booking
//         await expectLocatorTobeVisible(book.page.getByText('Payment Details'))
//         await book.bookingDetails(transmission, seats, fuel, codingDay, yearModel, plateNumber, start, end)
//     })

//     test('Car Delivery @smoke', async ({ book }) => {
//         const start = 'September 10, 2025 | 08:15'
//         const end = 'September 10, 2025 | 11:00'

//         await book.homepage()
//         await book.carDelivery()
//         await expectLocatorTobeVisible(book.carDeliveryButton)

//         await book.pickDate('September', 10)
//         await book.pickTime('08:15')
//         await book.returnDate('September', 10)
//         await book.returnTime('11:00')

//         await book.carPickupDelivery('Kalayaan')
//         await book.pickupLocation('Kalayaan Avenue, Makati City, Metro Manila')

//         await book.vehicleType('All Types')
//         await book.page.waitForTimeout(3000)
//         await book.checkAvailabilityNow()

//         // Verify the start and return date on Vehicle Selection
//         await book.bookingDate(start, end)
//         await book.waitForVehicleAvailabilityToLoad()
//         await book.waitForImages()
//         await book.choosePickVehicle()

//         //Store all vehicle details to verify the accuracy on Summary Details.
//         const elements = await book.page.locator("//div[@class='p-2']//div[@class='mb-3']").allTextContents();
//         const [transmission, seats, fuel, yearModel, color, codingDay] = elements;

//         await book.reserveCar()
//         await expectLocatorTobeVisible(book.page.getByText("Booking Summary"))

//         //Verify Booking Summary Details
//         await book.bookingSummaryDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)
//         await book.page.waitForTimeout(3000)

//         await book.refundProcessCounter(
//             'GCash',
//             'Spongbob Squarepants',
//             '09111174636'
//         )

//         await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

//         //Verify Confirm Reservation Details
//         await book.confirmReservationDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)

//         await book.checkDocs();
//         await book.clickProceed();

//         const bookingID = await book.page.locator("//div[@id='copy-fill']").textContent();
//         const plateNumber = await book.page.locator("section[class='mt-5 flex gap-x-5 gap-y-2 flex-wrap justify-center'] div div[class='text-xl font-semibold']").textContent()

//         if (!bookingID) {
//             throw new Error("Booking ID not found!");
//         }

//         if (!plateNumber) {
//             throw new Error("Booking ID not found!");
//         }

//         await book.seeBookingList();

//         //Verify the Details on Manage Booking Page
//         await book.ViewDetails(bookingID);

//         //Verify the Details on View Details Page of the Booking
//         await expectLocatorTobeVisible(book.page.getByText('Payment Details'))
//         await book.bookingDetails(transmission, seats, fuel, codingDay, yearModel, plateNumber, start, end)
//     })
// })
test.describe('Verify user input data is retained through the booking flow', () => {
    test.slow()
    test('Self-Driven @smoke', async ({ book }) => {
        const start = 'September 23, 2025 | 08:30'
        const end = 'September 24, 2025 | 08:30'

        await book.homepage()
        await book.selfDriveProcess(
            'September', 23, '08:30',
            'September', 24, '08:30',
            'All Types'
        )

        // Verify the start and return date on Vehicle Selection
        await book.bookingDate(start, end)
        await book.waitForVehicleAvailabilityToLoad()
        await book.waitForImages()
        await book.choosePickVehicle()

        //Store all vehicle details to verify the accuracy on Summary Details.
        const elements = await book.page.locator("//div[@class='p-2']//div[@class='mb-3']").allTextContents();
        const [transmission, seats, fuel, yearModel, color, codingDay] = elements;

        await book.reserveCar()
        await expectLocatorTobeVisible(book.page.getByText("Booking Summary"))

        //Verify Booking Summary Details
        await book.bookingSummaryDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)

        await book.refundOptions('GCash')
        await book.enterAccountName('Spongbob Squarepants')
        await book.enterAccountNumber('09111174636')
        await book.clickCounter()
        await book.clickSubmit()
        await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

        //Verify Confirm Reservation Details
        await book.confirmReservationDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)

        await book.checkDocs()
        await book.clickProceed()

        const bookingID = await book.page.locator("//div[@id='copy-fill']").textContent();
        const plateNumber = await book.page.locator("section[class='mt-5 flex gap-x-5 gap-y-2 flex-wrap justify-center'] div div[class='text-xl font-semibold']").textContent()

        if (!bookingID) {
            throw new Error("Booking ID not found!");
        }

        if (!plateNumber) {
            throw new Error("Booking ID not found!");
        }

        await book.seeBookingList();

        //Verify the Details on Manage Booking Page
        await book.ViewDetails(bookingID);
    })


    test('Chauffeur-Driven @smoke', async ({ book }) => {
        const start = 'September 09, 2025 | 07:00'
        const end = 'September 09, 2025 | 16:00'

        await book.homepage()
        await book.chauffeurButton()
        await expectLocatorTobeVisible(book.chauffeur)
        await book.pickDate('September', 9)
        await book.pickTime('07:00')
        await book.returnDate('September', 9)
        await book.returnTime('16:00')

        await book.enterPickup('Kalayaan')
        await book.pickupLocation('Kalayaan Avenue, Makati City, Metro Manila')
        await book.enterDropoff('Sm Jazz')
        await book.dropoffLocation('SM Jazz Mall, Nicanor Garcia, Makati City, Metro Manila')

        await book.vehicleType('All Types')
        await book.page.waitForTimeout(3000)
        await book.checkAvailabilityNow()

        // Verify the start and return date on Vehicle Selection
        await book.bookingDate(start, end)
        await book.waitForVehicleAvailabilityToLoad()
        await book.waitForImages()
        await book.choosePickVehicle()

        //Store all vehicle details to verify the accuracy on Summary Details.
        const elements = await book.page.locator("//div[@class='p-2']//div[@class='mb-3']").allTextContents();
        const [transmission, seats, fuel, yearModel, color, codingDay] = elements;

        await book.reserveCar()
        await expectLocatorTobeVisible(book.page.getByText("Booking Summary"))

        //Verify Booking Summary Details
        await book.bookingSummaryDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)

        await book.refundOptions('GCash')
        await book.enterAccountName('Spongbob Squarepants')
        await book.enterAccountNumber('09111174636')
        await book.contactPerson()
        await book.clickCounter()
        await book.clickSubmit()
        await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

        //Verify Confirm Reservation Details
        await book.confirmReservationDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)

        await book.checkDocs()
        await book.clickProceed()

        const bookingID = await book.page.locator("//div[@id='copy-fill']").textContent();
        const plateNumber = await book.page.locator("section[class='mt-5 flex gap-x-5 gap-y-2 flex-wrap justify-center'] div div[class='text-xl font-semibold']").textContent()

        if (!bookingID) {
            throw new Error("Booking ID not found!");
        }

        if (!plateNumber) {
            throw new Error("Booking ID not found!");
        }

        await book.seeBookingList();

        //Verify the Details on Manage Booking Page
        await book.ViewDetails(bookingID);
    })

    test('Car Delivery @smoke', async ({ book }) => {
        const start = 'September 10, 2025 | 08:15'
        const end = 'September 10, 2025 | 11:00'

        await book.homepage()
        await book.carDelivery()
        await expectLocatorTobeVisible(book.carDeliveryButton)

        await book.pickDate('September', 10)
        await book.pickTime('08:15')
        await book.returnDate('September', 10)
        await book.returnTime('11:00')

        await book.carPickupDelivery('Kalayaan')
        await book.pickupLocation('Kalayaan Avenue, Makati City, Metro Manila')

        await book.vehicleType('All Types')
        await book.page.waitForTimeout(3000)
        await book.checkAvailabilityNow()

        // Verify the start and return date on Vehicle Selection
        await book.bookingDate(start, end)
        await book.waitForVehicleAvailabilityToLoad()
        await book.waitForImages()
        await book.choosePickVehicle()

        //Store all vehicle details to verify the accuracy on Summary Details.
        const elements = await book.page.locator("//div[@class='p-2']//div[@class='mb-3']").allTextContents();
        const [transmission, seats, fuel, yearModel, color, codingDay] = elements;

        await book.reserveCar()
        await expectLocatorTobeVisible(book.page.getByText("Booking Summary"))

        //Verify Booking Summary Details
        await book.bookingSummaryDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)
        await book.page.waitForTimeout(3000)

        await book.refundProcessCounter(
            'GCash',
            'Spongbob Squarepants',
            '09111174636'
        )

        await expectLocatorTobeVisible(book.page.getByText("Confirm Reservation"))

        //Verify Confirm Reservation Details
        await book.confirmReservationDetails(seats, fuel, transmission, codingDay, yearModel, color, start, end)

        await book.checkDocs();
        await book.clickProceed();

        const bookingID = await book.page.locator("//div[@id='copy-fill']").textContent();
        const plateNumber = await book.page.locator("section[class='mt-5 flex gap-x-5 gap-y-2 flex-wrap justify-center'] div div[class='text-xl font-semibold']").textContent()

        if (!bookingID) {
            throw new Error("Booking ID not found!");
        }

        if (!plateNumber) {
            throw new Error("Booking ID not found!");
        }

        await book.seeBookingList();

        //Verify the Details on Manage Booking Page
        await book.ViewDetails(bookingID);
    })
})
