import path from 'path';
import { test, expect } from '../utils/fixtures'
import { getLatestOTP, waitForNewOTP } from 'e2e/utils/mailosaurHelper'
import { expectLocatorTobeVisible, generateRandomEmail, generateRandomNumber } from 'e2e/utils/helper';

const phoneNumber = generateRandomNumber()
const emailAddress = generateRandomEmail()
const password = 'Bfte9136!'

test.beforeEach(async ({ regPage, context }) => {
    await context.clearCookies()
    await regPage.gotoRegisterPage()
    await regPage.acceptCookies()
})

test('Complete User Registration @smoke', async ({ regPage, customerRegPage }) => {
    await regPage.completeRegistrationForm(
        emailAddress, //email
        emailAddress, //confirm email
        password, //password
        password, //confirm password
        true //checkboxes
    )

    const otpCode = await getLatestOTP(emailAddress)
    await regPage.otpCodeVerification(otpCode)

    const imagePath = path.resolve('e2e/data/sample.jpg');
    await customerRegPage.completeRegistrationProcess(
        'John',
        'Dela Cruz',
        'Male',
        '1999-12-13',
        phoneNumber,
        '123456789',
        'Philippines',
        '1234',
        'Metro Manila',
        'Makati Ave',
        'Apt 3B',
        imagePath
    )
    await customerRegPage.clickNextButton()
    await customerRegPage.confirmRegistration()
})

test('User Registration with Valid Registration', async ({ regPage }) => {
    await regPage.completeRegistrationForm(
        emailAddress, //email
        emailAddress, //confirm email
        password, //password
        password, //confirm password
        true //checkboxes
    )
})

test('Email Already Registered', async ({ regPage }) => {
    await regPage.registrationForm(
        'austriachristian1@gmail.com',
        'austriachristian1@gmail.com',
        'Bfte1234!',
        'Bfte1234!',
        true
    )
    await regPage.submitButton()
    await regPage.emailAlreadyExist()
})

test('Invalid Email Format', async ({ regPage }) => {
    await regPage.enterEmail('testingexample.com')
    await regPage.errorLabelHandler('Email format is invalid.')
})

test('Mismatched Email and Confirm Email', async ({ regPage }) => {
    await regPage.enterEmail('testingexample.com')
    await regPage.enterConfirmEmail('test1@example.com')
    await regPage.errorLabelHandler('Emails do not match.')
})

test('Email Left Blank', async ({ regPage }) => {
    await regPage.enterPassword(password)
    await regPage.enterConfirmPassword(password)
    await regPage.privacyButton()
    await regPage.termsButton()
    await expect(regPage.submit).toBeDisabled()
})

test('Password Too Short', async ({ regPage }) => {
    await regPage.enterPassword('Abcd1')
    await regPage.errorLabelHandler('Password is too short.')
})

test('Password does not meet Complexity', async ({ regPage }) => {
    await regPage.enterPassword('abcd1')
    await regPage.errorLabelHandler('Password should contain at least one lowercase letter, one uppercase letter, and one digit.')
})

test('Mismatched Password and Confirm Password', async ({ regPage }) => {
    await regPage.enterPassword(password)
    await regPage.enterConfirmPassword('Bfte9136')
    await regPage.errorLabelHandler('Password does not match')
})

test('Password Length Input', async ({ regPage }) => {
    await regPage.enterPassword("A".repeat(65) + "1a")
    await regPage.errorLabelHandler('Maximum characters(64) have reached.')
})

test('Privacy Policy Link Functionality', async ({ regPage }) => {
    await regPage.privacyButton()
    await expect(regPage.privacy).toBeChecked()
})

test('Terms and Condition Functionality', async ({ regPage }) => {
    await regPage.termsButton()
    await expect(regPage.terms).toBeChecked()
})

test('Cannot Register without Accepting Terms', async ({ regPage }) => {
    await regPage.registrationForm(
        'test@example.com',
        'test@example.com',
        password,
        password,
        false
    )
    await expect(regPage.submit).toBeDisabled()
})

test('Checkbox for Policy and Terms are Present', async ({ regPage }) => {
    await expectLocatorTobeVisible(regPage.privacy)
    await expectLocatorTobeVisible(regPage.terms)

    await expect(regPage.privacy).not.toBeChecked()
    await expect(regPage.terms).not.toBeChecked()
})

test('Reject Email longer than 64 characters', async ({ regPage }) => {
    await regPage.enterEmail("a".repeat(65) + "@example.com")
    await regPage.errorLabelHandler('Maximum characters(64) have reached')
})

test('Reject missing domain part', async ({ regPage }) => {
    await regPage.enterEmail('test@')
    await regPage.errorLabelHandler('Email format is invalid.')
})

test('Empty email field', async ({ regPage }) => {
    await regPage.enterEmail('test@example.com')
    await regPage.email.clear()
    await regPage.errorLabelHandler('Email is required.')
})

test('Empty confirm email field', async ({ regPage }) => {
    await regPage.enterConfirmEmail('test@example.com')
    await regPage.confirmEmail.clear()
    await regPage.errorLabelHandler('Email is required.')
})

test('Email with Whitespace', async ({ regPage }) => {
    await regPage.enterEmail('test@example . com')
    await regPage.errorLabelHandler('Email format is invalid.')
})

test('OTP Sent After Valid Email Submission', async ({ regPage }) => {
    await regPage.completeRegistrationForm(
        emailAddress, //email
        emailAddress, //confirm email
        password, //password
        password, //confirm password
        true //checkboxes
    )
})

test('Valid OTP verification', async ({ regPage }) => {
    await regPage.completeRegistrationForm(
        emailAddress, //email
        emailAddress, //confirm email
        password, //password
        password, //confirm password
        true //checkboxes
    )
    const otpCode = await getLatestOTP(emailAddress)
    await regPage.otpCodeVerification(otpCode)
})

test('Expired OTP Entry', async ({ regPage }) => {
    await regPage.completeRegistrationForm(
        emailAddress, //email
        emailAddress, //confirm email
        password, //password
        password, //confirm password
        true //checkboxes
    )

    const otpCode = await getLatestOTP(emailAddress)
    await regPage.page.waitForTimeout(5000)
    await regPage.resendOtp()

    await regPage.page.waitForTimeout(5000)
    await regPage.otpInput(otpCode)
    await regPage.submitButton()

    await expectLocatorTobeVisible(regPage.expiredOTP)
})

test('Resend OTP Functionality', async ({ regPage, page }) => {
    await regPage.completeRegistrationForm(
        emailAddress, //email
        emailAddress, //confirm email
        password, //password
        password, //confirm password
        true //checkboxes
    )

    //Get the First OTP
    const First_OTP = await getLatestOTP(emailAddress)
    console.log('First OTP Code: ', First_OTP)
    await regPage.page.waitForTimeout(5000)
    await regPage.resendOtp()

    const Second_OTP = await waitForNewOTP(emailAddress, First_OTP)
    console.log('Second OTP Code: ', Second_OTP)

    await page.waitForTimeout(7000);
    await regPage.otpInput(Second_OTP)
    await regPage.submitButton()

    //Email address is successfully confirmed
    await expectLocatorTobeVisible(regPage.successful)
})

test('OTP Required Field', async ({ regPage, page }) => {
    await regPage.completeRegistrationForm(
        emailAddress, //email
        emailAddress, //confirm email
        password, //password
        password, //confirm password
        true //checkboxes
    )

    await page.waitForTimeout(7000);
    //Submit button for OTP
    await regPage.submitButton()

    await expectLocatorTobeVisible(regPage.emptyOTP)
})