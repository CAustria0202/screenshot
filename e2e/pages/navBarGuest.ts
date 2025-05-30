import { type Page , type Locator} from '@playwright/test'

export class navBar_Guest{
    public page: Page
    info: Locator
    services: Locator
    login: Locator
    register: Locator

    constructor(page: Page){
        this.page = page
        this.info = this.page.locator('#dropdown-information')
        this.services = this.page.locator('#dropdown-special-service')
        this.login = this.page.getByRole('link', {name: 'Login', exact: true})
        this.register = this.page.getByRole('link', {name: 'Register', exact: true})
    }

    async clickInfomation(){
        await this.info.click()
    }

    async clickServices(){
        await this.services.click()
    }

    async clickRegister(){
        await this.register.click()
    }

    async clickLogin(){
        await this.login.click()
    }

    async informationDropdown(option: string){
        await this.page.getByRole('link', { name: option, exact: true }).nth(0).click();
    }

    async specialServicesDropdown(option: string){
        await this.page.getByRole('link', { name: option, exact: true }).nth(0).click();
    }
}