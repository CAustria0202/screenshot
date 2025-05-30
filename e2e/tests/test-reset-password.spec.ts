import { expectLocatorTobeVisible, headerToHaveText } from 'e2e/utils/helper'
import { test } from '../utils/fixtures'
import fs from 'fs'
import path from 'path'

let otplink: any

try {
    const filePath = path.resolve('.auth/reset-link.json')
    const data = fs.readFileSync(filePath, 'utf8')
    otplink = JSON.parse(data).otplink;
} catch (error) {
    console.error('Error reading reset link:', error)
}

test.use({ storageState: '.auth/reset-password.json' })

test.describe('Test Reset Password Functionality', () => {
    test.beforeEach(async ({ login }) => {
        await login.page.goto(otplink)
        await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Reset Password')
    })

    test('Reset Password: Password Too Short', async ({ login }) => {
        await login.enterPassword('Abcd1')
        await login.errorLabelHandler('Password is too short.')
    })

    test('Reset Password: Password does not meet Complexity', async ({ login }) => {
        await login.enterPassword('abcd1')
        await login.errorLabelHandler('Password should contain at least one lowercase letter, one uppercase letter, and one digit.')
    })

    test('Reset Password: Mismatched Password and Confirm Password', async ({ login }) => {
        await login.enterPassword('Bfte9136!')
        await login.enterConfirmPass('Bfte9136')
        await login.errorLabelHandler('Password does not match')
    })

    test('Reset Password: Password Length Input', async ({ login }) => {
        await login.enterPassword('A'.repeat(65) + '1a')
        await login.errorLabelHandler('Maximum characters(64) have reached.')
    })

    test('Reset Password: Re-use the old password', async ({ login }) => {
        await login.enterPassword('Bfte9136!')
        await login.enterConfirmPass('Bfte9136!')
        await login.resetPassButton()
        await expectLocatorTobeVisible(login.page.getByText('Your new password should not be the same as your old password.'))
    })
})