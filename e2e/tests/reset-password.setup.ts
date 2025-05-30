import { headerToHaveText } from 'e2e/utils/helper'
import { test as setup, expect } from '../utils/fixtures'
import { getLatestResetPassword } from 'e2e/utils/mailosaurHelper'
import fs from 'fs'
import path from 'path'

const emailAddress = 'test-mb7k8m7d-o6Vcxgtf@shtah1xf.mailosaur.net'

setup('Reset Password', async ({ login }) => {

    //Open Reset Password
    await login.loginPage()
    await login.acceptCookies()
    await login.clickReset()
    await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Reset Password')

    await login.enterEmail(emailAddress)
    await login.clickResetButton()
    await login.page.waitForTimeout(3000)

    expect(login.successfulReset).toBeVisible({ timeout: 5000 })
    const otplink = await getLatestResetPassword(emailAddress)

    // Save the link to a file
    const authDir = path.resolve('.auth')
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir)
    }
    const filePath = path.join(authDir, 'reset-link.json')
    fs.writeFileSync(filePath, JSON.stringify({ otplink }))

    await login.page.goto(otplink)

    await login.page.context().storageState({ path: '.auth/reset-password.json' })

    await login.page.close()
})