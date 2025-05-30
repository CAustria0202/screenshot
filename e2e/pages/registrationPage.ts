import { expect, type Page, type Locator } from '@playwright/test'
import { expectLocatorTobeVisible } from '../utils/helper'

export class RegisterPage {
    public page: Page
    email: Locator
    confirmEmail: Locator
    password: Locator
    confirmPassword: Locator
    privacy: Locator
    terms: Locator
    buttonAccept: Locator
    submit: Locator
    errorLabels: Locator
    exists: Locator
    close: Locator
    otp: Locator
    resend: Locator
    successful: Locator
    expiredOTP: Locator // after resending otp
    emptyOTP: Locator

    constructor(page: Page) {
        this.page = page
        this.email = this.page.getByRole('textbox', { name: 'email', exact: true })
        this.confirmEmail = this.page.getByRole('textbox', { name: 'confirm-email', exact: true })
        this.password = page.getByRole('textbox', { name: 'password', exact: true })
        this.confirmPassword = page.getByRole('textbox', { name: 'confirm-password' })
        this.privacy = this.page.getByRole('checkbox', { name: 'I read and agree with the Privacy Policy' })
        this.terms = this.page.getByRole('checkbox', { name: 'I read and agree with the Terms and Condition' })
        this.buttonAccept = this.page.getByRole('button', { name: 'Agree' })
        this.submit = this.page.locator("#submit-button")
        this.errorLabels = this.page.locator("(//div[@class='error-label'])")
        this.exists = this.page.getByText("Email already exists", { exact: true })
        this.close = this.page.getByRole('button', { name: 'Close' })
        this.otp = this.page.getByText("One Time Password is Sent", { exact: true })
        this.resend = this.page.getByRole('button', ({ name: "Resend OTP", exact: true }))
        this.successful = this.page.getByText("Email address is successfully confirmed", { exact: true })
        this.expiredOTP = this.page.getByText("The OTP provided is not valid. Please double check the OTP from your email and try again.", { exact: true })
        this.emptyOTP = this.page.getByText("OTP must be 6 digits", { exact: true })
    }

    async gotoRegisterPage() {
        await this.page.goto('/auth/register')
    }

    async acceptCookies() {
        await expectLocatorTobeVisible(this.page.getByText('"Accept Cookies"'))
        await this.page.getByRole('button', { name: 'Cookie icon Accept Cookies' }).click();
    }

    async enterEmail(email_input: string) {
        await this.email.fill(email_input)
    }

    async enterConfirmEmail(confirm_email_input: string) {
        await this.confirmEmail.fill(confirm_email_input)
    }

    async enterPassword(password_input: string) {
        await this.password.fill(password_input)
    }

    async enterConfirmPassword(confirm_password_input: string) {
        await this.confirmPassword.fill(confirm_password_input)
    }

    async privacyButton() {
        await this.privacy.click();
        await this.buttonAccept.click();
    }

    async termsButton() {
        await this.terms.click();
        await this.buttonAccept.click();
    }

    async submitButton() { //Can be used for submit button on Register Page and OTP Page
        const submit = this.submit
        await expect(submit).toBeEnabled({ timeout: 3000 })
        await submit.click()
    }

    async errorLabelHandler(expectedText: string) {
        await expect(this.errorLabels.filter({ hasText: expectedText })).toBeVisible()
    }

    async emailAlreadyExist() {
        await expectLocatorTobeVisible(this.exists)
        await this.close.click()
    }

    async otpInput(otpCode: string) {
        for (let i = 0; i < otpCode.length; i++) {
            await this.page.fill(`#code-field-${i}`, otpCode[i])
        }
    }

    async resendOtp() {
        await expect(this.resend).toBeVisible({ timeout: 30000 })
        await expect(this.resend).toBeEnabled()
        await this.resend.click()
    }

    async registrationForm(
        email: string,
        confirm_email: string,
        password: string,
        confirm_password: string,
        checkboxes: boolean = true
    ) {
        await this.enterEmail(email)
        await this.enterConfirmEmail(confirm_email)
        await this.enterPassword(password)
        await this.enterConfirmPassword(confirm_password)

        if (checkboxes) {
            await this.privacyButton()
            await this.termsButton()
        }
    }

    async completeRegistrationForm(
        email: string,
        confirm_email: string,
        password: string,
        confirm_password: string,
        checkboxes: boolean = true
    ) {
        await this.enterEmail(email)
        await this.enterConfirmEmail(confirm_email)
        await this.enterPassword(password)
        await this.enterConfirmPassword(confirm_password)

        if (checkboxes) {
            await this.privacyButton()
            await this.termsButton()
        }

        await this.submitButton()
        await expectLocatorTobeVisible(this.otp)
    }

    async otpCodeVerification(code: string) {
        await this.page.waitForTimeout(2000)
        await this.otpInput(code)
        await this.page.waitForTimeout(2000)
        await this.submitButton()

        await expectLocatorTobeVisible(this.successful)
    }
}