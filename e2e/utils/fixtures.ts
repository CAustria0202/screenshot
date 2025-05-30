import {test as base} from '@playwright/test'
import { RegisterPage } from '../pages/registrationPage'
import { CustomerRegistrationForm } from '../pages/customerRegistrationForm'
import { homePage } from 'e2e/pages/homePage'
import { navBar_Guest } from 'e2e/pages/navBarGuest'
import { FooterModule } from 'e2e/pages/footer'
import { bookingFeatures } from 'e2e/pages/bookingFeatures'
import { loginPage } from 'e2e/pages/loginPage'


type MyFixtures = {
    regPage: RegisterPage
    customerRegPage: CustomerRegistrationForm
    homePage: homePage
    navBar: navBar_Guest
    footer: FooterModule
    book: bookingFeatures
    login: loginPage
}

export const test = base.extend<MyFixtures>({
    regPage: async ({page}, use) => {
        await use(new RegisterPage(page))
    },

    customerRegPage: async ({page}, use) => {
        await use(new CustomerRegistrationForm(page))
    },

    homePage: async ({page}, use) => {
        await use(new homePage(page))
    },

    navBar: async ({page}, use) => {
        await use(new navBar_Guest(page))
    },

    footer: async ({page}, use) => {
        await use(new FooterModule(page))
    },

    book: async ({page}, use) => {
        await use(new bookingFeatures(page))
    },

    login: async ({ page }, use) => {
        await use(new loginPage(page))
    }
})

export { expect } from '@playwright/test'