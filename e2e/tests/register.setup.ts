import { generateRandomEmail } from '../utils/helper';
import { test as setup, expect } from '../utils/fixtures'
import { getLatestOTP } from '../utils/mailosaurHelper'

export const emailAddress = generateRandomEmail()
export const password = 'Bfte9136!'

setup('Registration Setup', async ({regPage}) => {
    await regPage.gotoRegisterPage()
    await regPage.acceptCookies()
    await regPage.completeRegistrationForm(
        emailAddress, //email
        emailAddress, //confirm email
        password, //password
        password, //confirm password
        true //checkboxes
    )

    const otpCode = await getLatestOTP(emailAddress)
    await regPage.otpCodeVerification(otpCode)

    await expect(regPage.page.getByRole('heading', { level: 2})).toHaveText('Email address is successfully confirmed', {timeout: 10000})

    await regPage.page.context().storageState({ path: '.auth/register.json'})

})