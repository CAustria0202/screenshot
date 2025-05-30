import { expect, test as setup } from '../utils/fixtures'
import { headerToHaveText } from '../utils/helper'

const emailAddress = 'taken-plane@shtah1xf.mailosaur.net'
const password = 'Bfte9136!'
setup('User Login with valid credentials @smoke', async ({ login }) => {
    await login.loginPage()
    await login.acceptCookies()
    await login.enterEmail(emailAddress)
    await login.enterPassword(password)
    await login.clickLogin()

    await login.page.waitForLoadState('load')
    await headerToHaveText(login.page.getByRole('heading', { level: 1 }), 'Toyota RentαCar')

    await login.page.context().storageState({ path: '.auth/login.json'})

    await login.page.close()
})