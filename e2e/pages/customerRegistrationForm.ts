import { type Page, type Locator } from '@playwright/test'
import { expectLocatorTobeVisible } from 'e2e/utils/helper'

export class CustomerRegistrationForm {
    public page: Page

    fname: Locator
    lname: Locator
    sex: Locator
    dateOfBirth: Locator
    mobile: Locator
    TIN: Locator
    country: Locator
    zip: Locator
    province: Locator
    address1: Locator
    address2: Locator
    govID: Locator
    errorLabels: Locator
    hereButton: Locator
    checking: Locator
    govError: Locator
    complete: Locator
    edit: Locator

    //Under add Company Information
    addCompanyInfo: Locator
    companyVisibility: Locator
    removeButton: Locator
    companyInvoice: Locator
    companyName: Locator
    companyTIN: Locator
    companyCountry: Locator
    companyZIP: Locator
    companyProvince: Locator
    companyAddress1: Locator
    companyAddress2: Locator
    companySecRegistration: Locator
    companyBir: Locator
    companyID: Locator
    secError: Locator
    birError: Locator
    IDError: Locator

    //Radio Button
    newsAccept: Locator
    newsReject: Locator
    next_button: Locator

    constructor(page: Page) {
        this.page = page
        this.fname = this.page.getByRole('textbox', { name: "first-name", exact: true })
        this.lname = this.page.getByRole('textbox', { name: "last-name", exact: true })
        this.sex = this.page.locator("#sex")
        this.dateOfBirth = this.page.getByRole('textbox', { name: "birthday", exact: true })
        this.mobile = this.page.getByRole('textbox', { name: 'Ex. XXX' })
        this.TIN = this.page.getByRole('textbox', { name: "tin", exact: true })
        this.country = this.page.locator("#country")
        this.zip = this.page.getByRole('textbox', { name: "zip-code", exact: true })
        this.province = this.page.getByRole('textbox', { name: "province", exact: true })
        this.address1 = this.page.getByRole('textbox', { name: "address-1", exact: true })
        this.address2 = this.page.getByRole('textbox', { name: "address-2", exact: true })
        this.govID = this.page.locator('#government-id')
        this.hereButton = this.page.locator("(//a[normalize-space()='here'])")
        this.checking = this.page.getByText('Checking card')
        this.newsAccept = this.page.locator("#news-email-accept")
        this.newsReject = this.page.locator("#news-email-reject")
        this.addCompanyInfo = this.page.getByRole("button", { name: "Add Company Information", exact: true })
        this.companyVisibility = this.page.getByText("Company Information:", { exact: true })
        this.removeButton = this.page.locator("#remove-button")
        this.companyInvoice = this.page.getByRole("checkbox", { name: "I need invoice or official receipt under my company name", exact: true })
        this.companyName = this.page.getByRole('textbox', { name: "company-name", exact: true })
        this.companyTIN = this.page.getByRole('textbox', { name: "company-tin", exact: true })
        this.companyCountry = this.page.locator("#country")
        this.companyZIP = this.page.getByRole('textbox', { name: "company-zip-code", exact: true })
        this.companyProvince = this.page.getByRole('textbox', { name: "company-province", exact: true })
        this.companyAddress1 = this.page.getByRole('textbox', { name: "company-address-1", exact: true })
        this.companyAddress2 = this.page.getByRole('textbox', { name: "company-address-2", exact: true })
        this.companySecRegistration = this.page.locator('#sec-registration')
        this.companyBir = this.page.locator("#bir-2303")
        this.companyID = this.page.locator("#company-id")
        this.next_button = this.page.getByRole("button", { name: "Next", exact: true })
        this.errorLabels = this.page.locator("(//div[@class='error-label'])")
        this.govError = this.page.locator('#government-id-error')
        this.secError = this.page.locator('#sec-registration-error')
        this.birError = this.page.locator('#bir-2303-error')
        this.IDError = this.page.locator('#company-id-error')
        this.complete = this.page.getByRole('button', { name: 'Complete Registration', exact: true })
        this.edit = this.page.getByRole('button', { name: 'Let me edit first', exact: true })
    }

    async firstName(fname: string) {
        await this.fname.fill(fname)
    }

    async acceptCookies() {
        await expectLocatorTobeVisible(this.page.getByText('"Accept Cookies"'))
        await this.page.getByRole('button', { name: 'Cookie icon Accept Cookies' }).click();
    }

    async lastName(lname: string) {
        await this.lname.fill(lname)
    }

    async sexSelect(sex: string) {
        await this.sex.selectOption(sex)
    }

    async birth(dob: string) {
        await this.dateOfBirth.fill(dob)
    }

    async mobileNumber(num: string) {
        await this.mobile.fill(num)
    }

    async tinNumber(tin: string) {
        await this.TIN.fill(tin)
    }

    async inputCountry(country: string) {
        await this.country.selectOption(country)
    }

    async zipCode(zip: string) {
        await this.zip.fill(zip)
    }

    async inputProvince(prov: string) {
        await this.province.fill(prov)
    }

    async inputAddress1(add: string) {
        await this.address1.fill(add)
    }

    async inputAddress2(add: string) {
        await this.address2.fill(add)
    }

    async governmentID(filePath: string) {
        await this.govID.setInputFiles(filePath)
    }

    async getUploadedFileName(category: Locator): Promise<string> {
        return await category.evaluate(input => (input as HTMLInputElement).files?.[0]?.name || '')
    }

    async getUploadedFileType(category: Locator): Promise<string> {
        return await category.evaluate(input => (input as HTMLInputElement).files?.[0]?.type || '')
    }

    async acceptNews() {
        await this.newsAccept.click()
    }

    async rejectNews() {
        await this.newsReject.click()
    }

    async companyInfo() {
        const companyInfo = this.page.getByText('Company Information:', { exact: true });
        if (!(await companyInfo.isVisible({ timeout: 3000 }))) {
            await this.addCompanyInfo.click();
        }
    }

    async removeCompanyInfo() {
        await this.removeButton.click()
    }

    async invoice() {
        await this.companyInvoice.click()
    }

    async inputCompanyName(name: string) {
        await this.companyName.fill(name)
    }

    async inputCompanyTin(tin: string) {
        await this.companyTIN.fill(tin)
    }

    async inputCompanyCountry(country: string) {
        await this.companyCountry.selectOption(country)
    }

    async inputCompanyZip(zip: string) {
        await this.companyZIP.fill(zip)
    }

    async inputCompanyProvince(prov: string) {
        await this.companyProvince.fill(prov)
    }

    async inputCompanyAddress1(add: string) {
        await this.companyAddress1.fill(add)
    }

    async inputCompanyAddress2(add: string) {
        await this.companyAddress2.fill(add)
    }

    async secRegistration(filePath: string) {
        await this.companySecRegistration.click()
        await this.companySecRegistration.setInputFiles(filePath)
    }

    async bir(filePath: string) {
        await this.companyBir.click()
        await this.companyBir.setInputFiles(filePath)
    }

    async inputCompanyID(filePath: string) {
        await this.companyID.click()
        await this.companyID.setInputFiles(filePath)
    }

    async clickNextButton() {
        await this.page.waitForTimeout(3000)
        await this.next_button.click()
    }

    async errorLabelHandler(expectedText: string) {
        await expectLocatorTobeVisible(this.errorLabels.filter({ hasText: expectedText }))
    }

    async clickHere() {
        await this.hereButton.click()
    }

    async confirmRegistration() {
        await this.page.waitForTimeout(3000)
        await this.complete.click()
    }

    async completeRegistrationProcess(
        fname: string,
        lname: string,
        sex: string,
        birth: string,
        number: string,
        tin: string,
        country: string,
        zip: string,
        prov: string,
        add1: string,
        add2: string,
        filepath: string
    ) {
        await this.firstName(fname)
        await this.lastName(lname)
        await this.sexSelect(sex)
        await this.birth(birth)
        await this.mobileNumber(number)
        await this.tinNumber(tin)
        await this.inputCountry(country)
        await this.zipCode(zip)
        await this.inputProvince(prov)
        await this.inputAddress1(add1)
        await this.inputAddress2(add2)
        await this.governmentID(filepath)
    }
}