import { expectLocatorTobeVisible, generateRandomPassword, headerToHaveText } from 'e2e/utils/helper'
import { test, expect } from '../utils/fixtures'
import { getLatestOTP, getLatestResetPassword, waitForNewOTP } from 'e2e/utils/mailosaurHelper'

const emailAddress = 'taken-plane@shtah1xf.mailosaur.net'
const password = 'Bfte9136!'

test.beforeEach(async ({ login, context }) => {
    await context.clearCookies()
    await login.loginPage()
    await login.acceptCookies()
})

test.describe('Login Test', () => {
    test('User Login with valid credentials @smoke', async ({ login }) => {
        await login.enterEmail(emailAddress)
        await login.enterPassword(password)
        await login.clickLogin()

        await login.page.waitForLoadState('load')
        await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Toyota RentαCar')
    })

    test('Invalid Email Format', async ({ login }) => {
        await login.enterEmail('test@.com')
        await login.errorLabelHandler('Email format is invalid.')
    })

    test('Empty Email and Password', async ({ login }) => {
        await login.enterEmail('test@.com')
        await login.email.clear()
        await login.clickLogin()
        await login.errorLabelHandler('Email is required')

        await login.enterPassword('Bfte')
        await login.password.clear()
        await login.clickLogin()
        await login.errorLabelHandler('Password is required')
    })

    test('Email with Whitespace', async ({ login }) => {
        await login.enterEmail('test @example.com')
        await login.clickLogin()
        await login.errorLabelHandler('Email format is invalid.')
    })

    test('Reject missing domain part', async ({ login }) => {
        await login.enterEmail('test@')
        await login.clickLogin()
        await login.errorLabelHandler('Email format is invalid.')
    })

    test('Click Reset Password', async ({ login }) => {
        await login.clickReset()
        await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Reset Password')

        await login.enterEmail('taken-plane@shtah1xf.mailosaur.net')
        await login.clickResetButton()

        expectLocatorTobeVisible(login.successfulReset)
    })

    test('Click Register Now', async ({ login }) => {
        await login.clickRegister()
        await expectLocatorTobeVisible(login.page.getByText("Register for an Individual account. If you're a corporate client, click here for a custom registration."))
    })

    test('Use OTP to Login', async ({ login }) => {
        await login.clickOTP()
        await login.enterEmail('taken-plane@shtah1xf.mailosaur.net')
        await login.clickSendOTP()

        await expectLocatorTobeVisible(login.page.getByText("Input 6 digit code sent from your email and clicks “Submit OTP”."))
    })

    test('OTP Login: Invalid Email Format', async ({ login }) => {
        await login.clickOTP()
        await login.enterEmail('test@.com')

        await login.errorLabelHandler('Email format is invalid.')
    })

    test('OTP Login: Email left blank', async ({ login }) => {
        await login.clickOTP()
        await login.enterEmail('unregistered@example.com')
        await login.email.clear()

        await login.errorLabelHandler('Email is required')
    })

    test('OTP Login: Use Unregistered Email', async ({ login }) => {
        await login.clickOTP()
        await login.enterEmail('unregistered@example.com')
        await login.clickSendOTP()

        await expectLocatorTobeVisible(login.page.getByText("Email does not exist or is not verified"))
    })

    test('Use Password Instead', async ({ login }) => {
        await login.clickOTP()
        await login.usePass()

        await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Login')
    })

    // For OTP Test
    test('OTP Required Field', async ({ login }) => {
        await login.OTPFunction(emailAddress)
        await login.submitOTPCode()
        await expectLocatorTobeVisible(login.page.getByText("OTP must be at least 6 characters long"))
    })

    test('Unregistered email for reset password', async ({ login }) => {
        await login.clickReset()
        await login.page.waitForLoadState('load')
        await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Reset Password')

        await login.enterEmail('kosakionodera71@gmail.com')
        await login.clickResetButton()

        await expectLocatorTobeVisible(login.page.getByText("Your request for password reset failed. Please try again."))
    })

    test('Valid OTP for Login @smoke', async ({ login }) => {
        await login.OTPFunction(emailAddress)

        //Wait for the email to be sent
        await login.page.waitForTimeout(3000)
        const otpCode = await getLatestOTP(emailAddress)

        await login.otpInput(otpCode)
        await login.submitOTPCode()

        await login.page.waitForLoadState('load')
        await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Toyota RentαCar')
    })

    test('Resend OTP Functionality', async ({ login }) => {
        test.slow()
        const emailAddress = 'test-mb7jgxnv-xIX9uayV@shtah1xf.mailosaur.net'
        await login.OTPFunction(emailAddress)

        const First_OTP = await getLatestOTP(emailAddress)

        await login.page.waitForTimeout(5000)
        await login.clickResendOTP()

        const Second_OTP = await waitForNewOTP(emailAddress, First_OTP)

        await login.otpInput(Second_OTP)
        await login.submitOTPCode()

        //Email address is successfully confirmed
        await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Toyota RentαCar')

    })

    test('Successful Reset Password and Used/Expired link', async ({ login }) => {
        test.slow()
        const emailAddress = 'test-mb7k5fdi-atjNJ3BU@shtah1xf.mailosaur.net'
        const password = generateRandomPassword(12)
        //Open Reset Password
        await login.clickReset()
        await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Reset Password')

        await login.enterEmail(emailAddress)
        await login.clickResetButton()
        await login.page.waitForTimeout(3000)

        expectLocatorTobeVisible(login.successfulReset)
        const otplink = await getLatestResetPassword(emailAddress)

        await login.page.goto(otplink)

        await login.enterPassword(await password)
        await login.enterConfirmPass(await password)
        await login.resetPassButton()

        //Verify Password Reset Successfull
        await expectLocatorTobeVisible(login.page.getByText('Password Reset Successfully'))
        await login.page.waitForTimeout(3000)

        //Verify used/expired link
        await login.page.goto(otplink)
        await expectLocatorTobeVisible(login.page.getByText('Password Reset Failed'))
    })

    test.describe('Logged-In user Functions', () => {
        test.beforeEach(async ({ login }) => {
            await login.enterEmail('test-mb7jgxnv-xIX9uayV@shtah1xf.mailosaur.net')
            await login.enterPassword('Bfte9136!')
            await login.clickLogin()

            await login.page.waitForTimeout(3000)
            await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Toyota RentαCar')

            await login.page.waitForTimeout(3000)
            await login.clickUserDropdown()
        })

        test('Booking Functionality', async ({ login }) => {
            await login.dropdownOptions('Booking')
            await login.page.waitForTimeout(5000)

            expectLocatorTobeVisible(login.page.getByText('Self-Drive', { exact: true }))
        })

        test('Manage Booking Functionality', async ({ login }) => {
            await login.dropdownOptions('Manage Bookings')

            expect(login.page.url()).toContain('/manage/upcoming')
        })

        test('Empty Upcoming Booking List', async ({ login }) => {
            await login.dropdownOptions('Manage Bookings')

            await login.clickUpcoming()
            await expectLocatorTobeVisible(login.page.getByText('You have no upcoming bookings.'))
            await expectLocatorTobeVisible(login.page.getByText('If you booked a car right now, then you will see it here.'))
        })

        test('Empty Past Booking List', async ({ login }) => {
            await login.dropdownOptions('Manage Bookings')

            await login.clickPast()
            await expectLocatorTobeVisible(login.page.getByText('You have no past bookings.'))
            await expectLocatorTobeVisible(login.page.getByText('If you booked a car right now, then you will see it here.'))
        })

        test('Test Logout', async ({ login }) => {
            await login.dropdownOptions('Logout')

            await login.confirmLogout()

            await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Toyota RentαCar')
        })
    })

})