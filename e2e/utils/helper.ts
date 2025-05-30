import { type Locator, expect } from "@playwright/test";
import crypto from 'crypto'

export async function expectLocatorTobeVisible(locator: Locator) {
    await expect(locator).toBeVisible({ timeout: 10000 })
}

export async function expectInputValue(locator: Locator, expectedValue: string) {
    await expect(locator).toHaveValue(expectedValue, { timeout: 10000 })
}

export async function expectNotToHaveValue(locator: Locator, expectedValue: string) {
    await expect(locator).not.toHaveValue(expectedValue, { timeout: 10000 })
}

export async function expectToContainText(locator: Locator, containText: string) {
    await expect(locator).toContainText(containText, { timeout: 10000 })
}

export async function headerToHaveText(locator: Locator, expectedText: string) {
    await expect(locator).toHaveText(expectedText, { timeout: 10000 })
}

export async function errorLabelHandler(locator: Locator, expectedText: string) {
    await expect(locator.filter({ hasText: expectedText })).toBeVisible({ timeout: 10000 })
}

export async function generateRandomPassword(length = 12) {
    const lettersAndNumbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const specialCharacters = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allCharacters = lettersAndNumbers + specialCharacters;

    let password = '';

    // Ensure at least one special character
    password += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));

    // Fill the rest of the password
    for (let i = 1; i < length; i++) {
        password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
    }

    // Shuffle the password so the special character isn't always at the start
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
}

export const generateRandomEmail = (): string => {
    const serverId = 'shtah1xf'
    const timestamp = Date.now().toString(36) // base36 timestamp
    const microTime = performance.now().toString(36).replace('.', '')
    const randomString = crypto.randomBytes(8).toString('base64').replace(/[+/=]/g, '').substring(0, 10) // Increased substring length for more randomness
    const uniqueId = `${timestamp}${microTime}${randomString}`
    return `test${uniqueId}@${serverId}.mailosaur.net`
}

export const generateRandomNumber = (): string => {
    let prefix = "9";
    let secondDigit = ['3', '6', '7', '8', '9'][Math.floor(Math.random() * 5)];
    let part1 = Math.floor(Math.random() * 9000 + 1000); // First 3 digits (100-999)
    let part2 = Math.floor(Math.random() * 9000 + 1000); // Last 4 digits (1000-9999)

    return `${prefix}${secondDigit}${part1}${part2}`;
}