import { expect, type Page, type Locator } from '@playwright/test'
import { expectLocatorTobeVisible, expectToContainText } from 'e2e/utils/helper'

export class bookingFeatures {
    public page: Page
    selfDriveButton: Locator
    date: Locator
    calendar: Locator
    time: Locator
    errorLabels: Locator
    vehicle: Locator
    option: Locator
    checkButton: Locator
    hour: Locator
    minutes: Locator
    vehicleAvailability: Locator
    itemCard: Locator
    reserve: Locator
    securityMechanics: Locator
    codingMechanics: Locator
    refresh: Locator
    refund: Locator
    accountName: Locator
    accountNumber: Locator
    submit: Locator
    payOnline: Locator
    payCounter: Locator
    readDocs: Locator
    proceedReservation: Locator
    seeBooking: Locator
    past: Locator
    yearItemCard: Locator
    learnMore: Locator


    // Chauffeur Driven
    chauffeur: Locator
    pickup: Locator
    dropoff: Locator
    location: Locator
    contact: Locator

    //Self Drive with Car Delivery
    carDeliveryButton: Locator
    collectCar: Locator
    return: Locator

    //Inquiry
    services: Locator
    inquire: Locator
    inquirecar: Locator
    sendInquiry: Locator


    constructor(page: Page) {
        this.page = page
        this.selfDriveButton = this.page.getByRole('button', { name: 'Self-Drive', exact: true })
        this.date = this.page.getByRole('textbox', { name: /Ex \w+ \d{1,2}, \d{4}/ })
        this.calendar = this.page.locator('.flatpickr-calendar.open').first();
        this.time = this.page.getByRole('textbox', { name: 'Time' })
        this.errorLabels = this.page.locator("(//div[@class='error-label'])")
        this.vehicle = this.page.getByLabel('Vehicle Type')
        this.option = this.vehicle.locator('option')
        this.checkButton = this.page.getByRole('button', { name: 'Check Availability Now' })
        this.hour = this.page.getByRole('spinbutton', { name: 'Hour' })
        this.minutes = this.page.getByRole('spinbutton', { name: 'Minute' })
        this.vehicleAvailability = this.page.locator('//ul[@id="vehicle-availability-list"]//div[@id="vehicle-model"]');
        this.itemCard = this.page.locator("(//div[@id='main-item-card'])")
        this.yearItemCard = this.page.locator("(//ul[@id='vehicle-availability-list'][1]//div[@id='main-item-card'])")
        this.reserve = this.page.getByRole('link', { name: "Reserve This Car" })
        this.securityMechanics = this.page.locator("//li[contains(text(),'Security deposit is required (refundable after ren')]//a[@class='font-semibold underline'][normalize-space()='here']")
        this.codingMechanics = this.page.locator("(//a[contains(text(),'here')])[2]")
        this.refresh = this.page.locator("//button[@id='hard-refresh-page']")
        this.refund = this.page.getByRole('listbox')
        this.accountName = this.page.getByRole('textbox', { name: 'Account Name', exact: true })
        this.accountNumber = this.page.getByRole('textbox', { name: 'Account Number', exact: true })
        this.submit = this.page.locator('#submit-info')
        this.payOnline = this.page.locator('#payment-online')
        this.payCounter = this.page.locator('#payment-counter')
        this.readDocs = this.page.locator('#i-have-read-docs')
        this.proceedReservation = this.page.locator('#proceed-reservation')
        this.seeBooking = this.page.getByRole('link', { name: 'See Booking List' })
        this.past = this.page.getByRole('link', { name: 'Past Bookings', exact: true })
        this.learnMore = page.getByRole('link', { name: 'To learn more about, please go to this page.', exact: true })

        //Chauffeur-Driven
        this.chauffeur = this.page.getByRole('button', { name: "Chauffeur-Driven" })
        this.pickup = this.page.locator("//input[@id='pickup-location']")
        this.dropoff = this.page.locator("//input[@id='dropoff-location']")
        this.location = this.page.locator("button.w-full.py-2.px-2.hover\\:bg-gray-100.text-start.cursor-pointer")
        this.contact = this.page.getByRole('checkbox', { name: "I am the contact person" })

        //Self Drive with Car Delivery
        this.carDeliveryButton = this.page.getByRole('button', { name: "Self-Drive with Car Delivery" })
        this.collectCar = this.page.getByRole('checkbox', { name: "Collect the car after rent." })
        this.return = this.page.locator('#return-location')

        this.services = this.page.locator('#dropdown-special-service')
        this.inquire = this.page.getByRole('link', { name: 'Inquire Now', exact: true })
        this.inquirecar = this.page.getByRole('link', { name: "Inquire This Car" })
        this.sendInquiry = this.page.getByRole('button', { name: 'Confirm & Send Inquiry', exact: true })
    }

    async homepage() {
        await this.page.goto('/')
    }

    async acceptCookies() {
        await expectLocatorTobeVisible(this.page.getByText('"Accept Cookies"'))
        await this.page.getByRole('button', { name: 'Cookie icon Accept Cookies' }).click();
    }

    async pickDate(month: String, day: Number) {
        await this.date.first().click();

        const calendar = this.calendar
        await expect(calendar).toBeVisible({ timeout: 5000 });

        const monthNameToNumber = async (name: String): Promise<number> => {
            return new Date(`${name} 1, 2025`).getMonth();
        }

        const num = await monthNameToNumber(month)

        await calendar.getByLabel('Month').selectOption(num.toString());
        await calendar.getByLabel(`${month} ${day},`).click();
    }

    async returnDate(month: String, day: Number) {
        await this.date.nth(1).click();

        const calendar = this.calendar
        await expect(calendar).toBeVisible({ timeout: 5000 });

        const monthNameToNumber = async (name: String): Promise<number> => {
            return new Date(`${name} 1, 2025`).getMonth();
        }

        const num = await monthNameToNumber(month)

        await calendar.getByLabel('Month').selectOption(num.toString());
        await calendar.getByLabel(`${month} ${day},`).click();
    }

    async disabledDate(month: String, day: Number) {
        await this.date.nth(1).click();

        const calendar = this.calendar
        await expect(calendar).toBeVisible({ timeout: 5000 });

        const monthNameToNumber = async (name: String): Promise<number> => {
            return new Date(`${name} 1, 2025`).getMonth();
        }

        const num = await monthNameToNumber(month)

        calendar.getByLabel('Month').selectOption(num.toString());
        calendar.getByLabel(`${month}`)

        // Find the specific date element
        const dateLocator = calendar.locator(`//span[contains(@class, 'flatpickr-day') and text()="${day}"]`).first();

        // Expect the class to include 'flatpickr-disabled'
        await expect(dateLocator).toHaveAttribute('class', /flatpickr-disabled/);
    }

    async pickTime(timeString: string) {
        const [input_hour, input_minutes] = timeString.split(':')
        await this.time.first().click();
        await this.hour.fill(input_hour);
        await this.minutes.fill(input_minutes);
        await this.minutes.press('Enter');
    }

    async returnTime(timeString: string) {
        const [input_hour, input_minutes] = timeString.split(':')
        await this.time.nth(1).click();
        await this.hour.fill(input_hour);
        await this.minutes.fill(input_minutes);
        await this.minutes.press('Enter');
    }

    async verifyVehicleDropdown(expectedValues: { value: string, text: string }[]) {
        await this.vehicle.click()
        for (let i = 0; i < expectedValues.length; i++) {
            const currentOption = this.option.nth(i)
            await expect.soft(currentOption).toHaveAttribute('value', expectedValues[i].value)
            await expect.soft(currentOption).toHaveText(expectedValues[i].text)
            console.log(expectedValues[i].text)
        }
    }

    async errorLabelHandlers(expectedText: string) {
        const errorLabels = this.errorLabels.filter({ hasText: expectedText });

        // Ensure each matching error label is visible
        const count = await errorLabels.count();
        for (let i = 0; i < count; i++) {
            const label = errorLabels.nth(i);
            await expect(label).toBeVisible();
        }
    }

    async vehicleType(vehicle: string) {
        const vehicleCount = await this.vehicle.count()
        for (let i = 0; i < vehicleCount; i++) {
            const vehicleDropdown = this.vehicle.nth(i);

            if (await vehicleDropdown.isVisible()) {
                await vehicleDropdown.selectOption(vehicle);
                break
            }
        }
    }

    async checkAvailabilityNow() {
        await this.checkButton.click()
    }

    async learnMoreAbout() {
        await this.learnMore.click()
    }

    async chooseVehicle() {
        const models = ['VIOS', 'CAMRY', 'COROLLA CROSS', 'FORTUNER', 'INNOVA',
            'HIACE COMMUTER', 'HIACE GL GRANDIA', 'HIACE SUPER GRANDIA ELITE',
            'SUPER GRANDIA ELITE', 'ALPHARD'];
        await this.page.waitForTimeout(5000);

        // Loop through each vehicle model
        for (const model of models) {
            // Loop through all the item cards
            const itemCards = await this.page.locator("//div[@id='main-item-card']").all();

            for (const card of itemCards) {
                // Notice: no leading //, just .// to make it relative
                const modelName = await card.locator("//div[@id='vehicle-model']").innerText();
                const isFullyBooked = await card.getByText('Fully Booked').count();

                if (modelName === model && isFullyBooked === 0) {
                    await card.click();
                    return;  // Exit once we click an available vehicle
                }
            }
        }
    }

    async filter(filter: string, type: string) {
        const button = this.page.getByRole('button', { name: filter })
        const isExpanded = await button.getAttribute('aria-expanded')
        if (isExpanded !== 'true') {
            await button.click()
        }

        const checkbox = this.page.getByRole('checkbox', { name: type })
        await checkbox.waitFor({ state: 'visible' })
        await checkbox.check()
    }

    async payment(reference: string) {
        await this.securityMechanics.click()
        const newPage = await this.page.context().waitForEvent('page')
        await newPage.waitForLoadState()
        const currentURL = new URL(newPage.url())
        expect(currentURL.href).toBe(reference)
    }

    async coding(reference: string) {
        await this.codingMechanics.click()
        const newPage = await this.page.context().waitForEvent('page')
        await newPage.waitForLoadState()
        const currentURL = new URL(newPage.url())
        expect(currentURL.href).toBe(reference)
    }

    async reserveCar() {
        await this.reserve.click()
    }

    async hardRefresh() {
        const refresh = this.refresh
        await refresh.isVisible({ timeout: 5000 })
        await refresh.click()
        await this.page.reload({ waitUntil: 'load' })
    }

    async refundOptions(text: string) {
        await this.refund.click()
        await this.page.getByRole('treeitem', { name: text }).click();
    }

    async enterAccountName(name: string) {
        await this.accountName.fill(name)
    }

    async enterAccountNumber(number: string) {
        await this.accountNumber.fill(number)
    }

    async clickOnline() {
        await this.payOnline.click()
    }

    async clickCounter() {
        await this.payCounter.click()
    }
    async checkDocs() {
        await this.readDocs.click()
    }

    async clickProceed() {
        await this.proceedReservation.click()
    }

    async itemcard(day: string) {
        const count = await this.itemCard.filter({ hasNotText: 'Fully Booked' }).count()

        for (let i = 0; i < count; i++) {
            const card = this.itemCard.nth(i)
            await card.click()
            const container = await this.page.locator("//div[@id='pop-container']//li").count()
            for (let x = 1; x < container + 1; x++) {
                await expect(this.page.locator(`//div[@id='pop-container']//li[${x}]`)).not.toContainText(day)
            }
            await this.page.locator("div[class='size-6 text-gray-900'] svg").click()
        }
    }

    async itemcardToContainText(day: string) {
        const itemCard = this.page.locator("//ul[@id='vehicle-availability-list']//div[@id='main-item-card']").filter({ hasNotText: 'Fully Booked' })
        const count = await itemCard.count()
        for (let i = 0; i < count; i++) {
            const card = itemCard.nth(i)
            await card.click()
            const container = await this.page.locator("//div[@id='pop-container']//li").count()
            for (let x = 1; x < container + 1; x++) {
                await expect(this.page.locator(`//div[@id='pop-container']//li[${x}]`)).toContainText(new RegExp(`${day}|N/A`))
            }
            await this.page.locator("div[class='size-6 text-gray-900'] svg").click()
        }
    }

    async itemcardYearModel(day: string) {
        const count = await this.yearItemCard.filter({ hasNotText: 'Fully Booked' }).count()

        for (let i = 0; i < count; i++) {
            const card = this.itemCard.nth(i)
            await card.click()
            const container = await this.page.locator("//div[@id='pop-container']//li").count()
            console.log(container)
            for (let x = 1; x < container + 1; x++) {
                await expect(this.page.locator(`//div[@id='pop-container']//li[${x}]`)).toContainText(day)
            }
            await this.page.locator("div[class='size-6 text-gray-900'] svg").click()
        }
    }

    async filterYear(filter: string, min: string, max: string) {
        const button = this.page.getByRole('button', { name: filter })
        const isExpanded = await button.getAttribute('aria-expanded')
        if (isExpanded !== 'true') {
            await button.click()
        }

        const min_year = this.page.locator('#year-model-min')
        const max_year = this.page.locator('#year-model-max')

        await min_year.fill(min)
        await min_year.press('Enter')
        await max_year.fill(max)
        await max_year.press('Enter')
    }

    async clickSubmit() {
        await this.submit.click()
    }

    //For Chauffeur Driven

    async chauffeurButton() {
        await this.chauffeur.click()
    }

    async enterPickup(pickup: string) {
        await this.pickup.first().fill(pickup)
    }

    async pickupLocation(exact_address: string) {
        await this.page.waitForTimeout(3000)
        const location = await this.location.count()

        for (let i = 0; i < location; i++) {
            await this.page.waitForTimeout(3000)

            const pickup = this.location.nth(i)

            const textContent = await pickup.textContent()

            if (textContent && textContent.trim() === exact_address) {
                console.log(textContent)
                await pickup.click()
                break
            }
        }
    }

    async enterDropoff(dropoff: string) {
        await this.dropoff.fill(dropoff)
    }

    async dropoffLocation(exact_address: string) {
        await this.page.waitForTimeout(3000)
        const location = await this.location.count()
        await this.page.waitForTimeout(3000)
        for (let i = 0; i < location; i++) {

            const pickup = this.location.nth(i)

            const textContent = await pickup.textContent()

            if (textContent && textContent.trim() === exact_address) {
                console.log(textContent)
                await pickup.click()
                break
            }
        }
    }

    async seeBookingList() {
        await this.seeBooking.click()
    }

    async ViewDetails(bookingID: string, startDate: string) {
        const viewDetails = this.page.locator("//astro-outline-box").filter({ hasText: bookingID })

        await expect(viewDetails.locator("//span[@id='rental-start-date']")).toContainText(startDate, { timeout: 10000 })

        await viewDetails.locator("(//a[contains(text(),'View Details')])").first().click()


    }

    async CancelBooking(bookingID: string) {
        const viewDetails = this.page.locator("//astro-outline-box").filter({ hasText: bookingID })
        await viewDetails.locator("(//button[@id='cancel-button'])").first().click()

        await this.page.getByRole('button', { name: 'Yes' }).click()
        await expect(this.page.getByText('Your booking has been successfully cancelled.')).toBeVisible()
        await this.page.getByRole('button', { name: 'Close' }).click()

        await this.past.click()
        await expect(viewDetails.locator("(//span[@id='status-cancelled-text'])[1]")).toHaveText("Cancelled", { timeout: 10000 })

    }

    async contactPerson() {
        await this.contact.click()
    }

    //Self Drive with Car Delivery
    async carDelivery() {
        await this.carDeliveryButton.click()
    }

    async carPickupDelivery(pickup: string) {
        await this.pickup.nth(1).fill(pickup)
    }

    async collectCarCheckbox() {
        await this.collectCar.check()
    }

    async returnLocation(returnLoc: string) {
        await this.return.fill(returnLoc)
    }

    //Helper functions
    async choosePickVehicle() {
        await this.chooseVehicle()
        await this.page.locator("//div[@id='pop-container']//li[1]").click()
    }

    async pickUpDateTime(month: string, day: number, time: string) {
        await this.pickDate(month, day)
        await this.pickTime(time)
    }

    async returnDateTime(month: string, day: number, time: string) {
        await this.returnDate(month, day)
        await this.returnTime(time)
    }

    async selfDriveProcess(
        pickMonth: string, pickDay: number, pickTime: string,
        returnMonth: string, returnDay: number, returnTime: string,
        type: string
    ) {
        await this.pickDate(pickMonth, pickDay)
        await this.pickTime(pickTime)
        await this.returnDate(returnMonth, returnDay)
        await this.returnTime(returnTime)

        await this.vehicleType(type)
        await this.checkAvailabilityNow()
    }

    async refundProcess(card: string, name: string, number: string) {
        await this.refundOptions(card)
        await this.enterAccountName(name)
        await this.enterAccountNumber(number)

        await this.clickOnline()
        await this.clickSubmit()

        await expect(this.page.getByText("Confirm Reservation")).toBeVisible({ timeout: 5000 })
    }

    async refundProcessCounter(card: string, name: string, number: string) {
        await this.refundOptions(card)
        await this.enterAccountName(name)
        await this.enterAccountNumber(number)

        await this.clickCounter()
        await this.clickSubmit()

        await expect(this.page.getByText("Confirm Reservation")).toBeVisible({ timeout: 5000 })
    }


    async paymentGatewayMethod(
        paymentOptions: string,
        cardNumber: string,
        expiryDate: string,
        CVV: string,
        cardName: string,
        email: string,
        otpCode: string
    ) {
        await this.page.waitForTimeout(5000);  // Wait for any initial loading

        // Reuse the frameLocator to minimize repeated contentFrame calls
        const iframeLocator = this.page.frameLocator("(//iframe[@id='payment-gateway'])[2]")

        await iframeLocator.locator('.option-label').click();
        await iframeLocator.getByText(paymentOptions).first().click();

        await iframeLocator.getByRole('textbox', { name: 'card number' }).fill(cardNumber);
        await iframeLocator.getByRole('textbox', { name: 'expiry date' }).fill(expiryDate);
        await iframeLocator.getByRole('textbox', { name: 'CVV/CVV2' }).fill(CVV);
        await iframeLocator.getByRole('textbox', { name: 'cardholder name' }).fill(cardName);
        await iframeLocator.getByRole('textbox', { name: 'Email Address' }).fill(email);

        // Payment Process
        await iframeLocator.getByRole('button', { name: 'Continue payment' }).click();
        await iframeLocator.getByRole('textbox').fill(otpCode);
        await iframeLocator.getByRole('button', { name: 'Submit' }).click();
        await iframeLocator.getByRole('button', { name: 'Return to Merchant' }).click();
        await this.page.waitForTimeout(3000)

        await expect(this.page.getByText('Reservation Success')).toBeVisible({ timeout: 12000 })
    }


    //Assertions
    async bookingDate(start: string, end: string) {
        // Select the elements by their XPath
        const date = this.page.locator("//div[@class='sm:text-base text-sm']");

        // Verify the first index (1st element)
        await expect(date.nth(0)).toHaveText(start);
        await expect(date.nth(1)).toHaveText(end);
    }

    async bookingSummaryDetails(seats: string, fuel: string, transmission: string, codingDay: string, yearModel: string, color: string, start: string, end: string) {
        const dateLocator = this.page.locator("(//div[@class='flex flex-wrap lg:gap-x-10 md:gap-x-5 sm:gap-x-7 gap-x-4 gap-y-1'])")
        const expectedValues = [
            { index: 1, value: seats },
            { index: 2, value: fuel },
            { index: 3, value: transmission },
            { index: 4, value: codingDay },
            { index: 5, value: yearModel },
            { index: 6, value: color },
        ];

        for (const { index, value } of expectedValues) {
            const locator = this.page.locator(`//div[@class=' w-fit'][${index}]`);
            await expect(locator).toContainText(value);
        }

        await expect(dateLocator).toContainText(start)
        await expect(dateLocator).toContainText(end)
    }

    async confirmReservationDetails(seats: string, fuel: string, transmission: string, codingDay: string, yearModel: string, color: string, start: string, end: string) {
        const dateLocator = this.page.locator("(//div[@class='p-5']//div[@class='flex flex-wrap lg:gap-x-10 md:gap-x-5 sm:gap-x-7 gap-x-4 gap-y-1'])")
        const expectedValues = [
            { index: 1, value: seats },
            { index: 2, value: fuel },
            { index: 3, value: transmission },
            { index: 4, value: codingDay },
            { index: 5, value: yearModel },
            { index: 6, value: color },
        ];

        for (const { index, value } of expectedValues) {
            const locator = this.page.locator(`//div[@class='p-5']//div[@class=' w-fit'][${index}]`);
            await expect(locator).toContainText(value);
        }

        await expect(dateLocator).toContainText(start)
        await expect(dateLocator).toContainText(end)
    }

    async bookingDetails(transmission: string, seats: string, fuel: string, codingDay: string, yearModel: string, plateNumber: string, start: string, end: string) {
        await expect(this.page.locator("(//div[@class='mb-3'])[1]")).toContainText(transmission)
        await expect(this.page.locator("(//div[@class='mb-3'])[2]")).toContainText(seats)
        await expect(this.page.locator("(//div[@class='mb-3'])[3]")).toContainText(fuel)
        await expect(this.page.locator("(//div[@class='mb-3'])[4]")).toContainText(codingDay)
        await expect(this.page.locator("(//div[@class='mb-3'])[5]")).toContainText(yearModel)
        await expect(this.page.locator("(//div[@id=\'up-label\'])").filter({ hasText: 'Plate Number' })).toContainText(plateNumber)

        await expect(this.page.locator("//div[@class='flex justify-center p-0 mb-20 ']//li[2]").filter({ hasText: 'Start Date:' })).toContainText(start)
        await expect(this.page.locator("//div[@class='flex justify-center p-0 mb-20 ']//li[3]").filter({ hasText: 'End Date:' })).toContainText(end)
    }

    async clickServices() {
        await this.services.click()
    }

    async informationDropdown(option: string) {
        await this.page.getByRole('link', { name: option, exact: true }).nth(0).click();
    }

    async clickInquire() {
        await this.inquire.click()
    }

    async inquireCar() {
        await this.inquirecar.click()
    }

    async confirmInquiry() {
        await this.sendInquiry.click()
        await expectToContainText(this.page.locator("//dialog[@id='pop-component']"), 'Inquiry Sent')
        await this.page.getByRole('button', { name: 'Close' }).click()
    }

    async waitForImages() {
        const images = await this.page.locator("//img[@id='vehicle-image']");
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            await expect(img).toBeVisible();
        }
    }

}
