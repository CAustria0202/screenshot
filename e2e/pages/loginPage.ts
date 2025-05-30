import { expect, type Page, type Locator } from '@playwright/test'
import { expectLocatorTobeVisible } from '../utils/helper'

export class loginPage {
    public page: Page
    email: Locator
    password: Locator
    errorLabel: Locator
    loginButton: Locator
    otpLogin: Locator
    reset: Locator
    register: Locator
    resetButton: Locator
    successfulReset: Locator
    sendOTP: Locator
    usePassword: Locator
    submitOTP: Locator
    resendOTP: Locator
    userDropdown: Locator
    upcoming: Locator
    past: Locator
    logout: Locator
    confirmPassword: Locator
    resetPassword: Locator

    constructor(page: Page) {
        this.page = page
        this.email = this.page.getByRole('textbox', { name: 'email', exact: true })
        this.password = this.page.getByRole('textbox', { name: 'password', exact: true })
        this.errorLabel = this.page.locator("(//div[@class='error-label'])")
        this.loginButton = this.page.getByRole('button', { name: 'Login', exact: true })
        this.otpLogin = this.page.getByRole('link', { name: "Use OTP instead", exact: true })
        this.reset = this.page.getByRole('link', { name: 'Reset password' })
        this.resetPassword = this.page.getByRole('button', { name: 'Reset Password' })
        this.register = this.page.getByRole('link', { name: "Register now", exact: true })
        this.successfulReset = this.page.locator('#result-success-message')
        this.resetButton = this.page.getByRole('button', { name: "Reset Password" })
        this.sendOTP = this.page.getByRole('button', { name: 'Send OTP' })
        this.usePassword = this.page.getByRole('link', { name: "Use password instead", exact: true })
        this.submitOTP = this.page.getByRole('button', { name: "Submit OTP", exact: true })
        this.resendOTP = this.page.getByRole('button', { name: 'Resend OTP', exact: true })
        this.userDropdown = this.page.locator("(//div[contains(@class,'mt-[1px]')])")
        this.upcoming = this.page.getByRole('link', { name: 'Upcoming' })
        this.past = this.page.getByRole('link', { name: 'Past Bookings' })
        this.logout = this.page.locator('#pop-button-accept')
        this.confirmPassword = this.page.getByRole('textbox', { name: 'confirm-password' })
    }

    async loginPage() {
        await this.page.goto('/auth/login')
    }

    async acceptCookies() {
        await expectLocatorTobeVisible(this.page.getByText('"Accept Cookies"'))
        await this.page.getByRole('button', { name: 'Cookie icon Accept Cookies' }).click();
    }

    async enterEmail(email: string) {
        await this.email.fill(email)
    }

    async enterPassword(password: string) {
        await this.password.fill(password)
    }

    async enterConfirmPass(password: string) {
        await this.confirmPassword.fill(password)
    }

    async errorLabelHandler(expectedText: string) {
        await expect(this.errorLabel.filter({ hasText: expectedText })).toBeVisible({ timeout: 5000 })
    }

    async clickLogin() {
        await expectLocatorTobeVisible(this.loginButton)
        await this.loginButton.click()
    }

    async clickOTP() {
        await expectLocatorTobeVisible(this.otpLogin)
        await this.otpLogin.click()
    }

    async clickReset() {
        await this.reset.click()
    }

    async clickResetButton() {
        await this.resetButton.click()
    }

    async clickRegister() {
        await this.register.click()
    }

    async clickSendOTP() {
        await this.sendOTP.click()
    }

    async usePass() {
        await this.usePassword.click()
    }

    async submitOTPCode() {
        await this.submitOTP.click()
    }

    async otpInput(otpCode: string) {
        for (let i = 0; i < otpCode.length; i++) {
            await this.page.fill(`#code-field-${i}`, otpCode[i])
        }
    }

    async clickResendOTP() {
        await this.resendOTP.click()
    }

    async clickUserDropdown() {
        await this.userDropdown.click()
    }

    async dropdownOptions(option: string) {
        await this.page.getByRole('link', { name: option }).nth(0).click();
    }

    async clickUpcoming() {
        await this.upcoming.click()
    }

    async clickPast() {
        await this.past.click()
    }

    async confirmLogout() {
        await this.logout.click()
    }

    async resetPassButton() {
        await this.resetPassword.click()
    }

    async OTPFunction(email: string) {
        await this.clickOTP()
        await this.enterEmail(email)
        await this.clickSendOTP()

        await expectLocatorTobeVisible(this.page.getByText("Input 6 digit code sent from your email and clicks “Submit OTP”."))

    }

}