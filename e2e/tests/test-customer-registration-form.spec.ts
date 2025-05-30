import path from 'path'
import { test, expect } from '../utils/fixtures'
import { expectInputValue, expectLocatorTobeVisible, expectNotToHaveValue, expectToContainText } from 'e2e/utils/helper'

test.use({ storageState: '.auth/register.json' })

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('Personal Information Section', () => {
    test('Valid First Name', async ({ customerRegPage }) => {
        await customerRegPage.firstName('John')
        await expectInputValue(customerRegPage.fname, 'John')
    })

    test('Invalid Characters in First Name', async ({ customerRegPage }) => {
        await customerRegPage.firstName('@hn!')
        await customerRegPage.errorLabelHandler("The First Name should only contain letters, numbers, spaces, and the characters ., ' ")
    })

    test('Empty First Name Field', async ({ customerRegPage }) => {
        await customerRegPage.firstName('John')
        await customerRegPage.fname.clear()
        await customerRegPage.errorLabelHandler("First Name is required")
    })

    test('Valid Last Name', async ({ customerRegPage }) => {
        await customerRegPage.lastName('Dela Cruz')
        await expectInputValue(customerRegPage.lname, 'Dela Cruz')
    })

    test('Invalid Characters in Last Name', async ({ customerRegPage }) => {
        await customerRegPage.lastName('#ruz#')
        await customerRegPage.errorLabelHandler("The Last Name should only contain letters, numbers, spaces, and the characters ., ' ")
    })

    const options = [
        { selectedOptions: 'Male' },
        { selectedOptions: 'Female' }
    ]
    options.forEach(({ selectedOptions }) => {
        test(`Select Valid Sex Option: ${selectedOptions}`, async ({ customerRegPage }) => {
            await customerRegPage.sexSelect(selectedOptions)
            await expectToContainText(customerRegPage.sex, selectedOptions)
        })
    })

    test('Valid Date of Birth', async ({ customerRegPage }) => {
        await customerRegPage.birth('1990-11-02')
        await expectInputValue(customerRegPage.dateOfBirth, '1990-11-02')
    })

    test('Future Date of Birth', async ({ customerRegPage }) => {
        await customerRegPage.birth('2030-12-01')
        await expectNotToHaveValue(customerRegPage.dateOfBirth, '2030-12-01')
    })

    test('Valid Mobile Number (PH)', async ({ customerRegPage }) => {
        await customerRegPage.mobileNumber('9171234567')
        await expectInputValue(customerRegPage.mobile, '9171234567')
    })

    test('Invalid Mobile Length', async ({ customerRegPage }) => {
        await customerRegPage.mobileNumber('0917')
        await customerRegPage.errorLabelHandler('Invalid mobile number length.')
    })

    test('Valid TIN Number', async ({ customerRegPage }) => {
        await customerRegPage.tinNumber('123456789')
        await expectInputValue(customerRegPage.TIN, '123456789')
    })

    test('Invalid TIN Number', async ({ customerRegPage }) => {
        await customerRegPage.tinNumber('ABC-123@#')
        await customerRegPage.errorLabelHandler("The TIN should contain numbers only.")
    })

    test('Country Dropdown Selected', async ({ customerRegPage }) => {
        await customerRegPage.inputCountry('Philippines')
        await expectToContainText(customerRegPage.country, 'Philippines')
    })

    test('Valid Zip Code', async ({ customerRegPage }) => {
        await customerRegPage.zipCode('1234')
        await expectInputValue(customerRegPage.zip, '1234')
    })

    test('Invalid Zip Code', async ({ customerRegPage }) => {
        await customerRegPage.zipCode('12@#')
        await customerRegPage.errorLabelHandler("The Zip Code should only contain letters, numbers and spaces")
    })

    test('Valid Province', async ({ customerRegPage }) => {
        await customerRegPage.inputProvince('Laguna')
        await expect(customerRegPage.province).toHaveValue('Laguna')
    })

    test('Invalid Province Input', async ({ customerRegPage }) => {
        await customerRegPage.inputProvince('$Lagun@')
        await customerRegPage.errorLabelHandler("The Province should only contain letters and spaces")
    })

    test('Valid Address 1', async ({ customerRegPage }) => {
        await customerRegPage.inputAddress1('123 Main St')
        await expectInputValue(customerRegPage.address1, '123 Main St')
    })

    test('Empty Address 1', async ({ customerRegPage }) => {
        await customerRegPage.inputAddress1('123 Main St')
        await customerRegPage.address1.clear()
        await customerRegPage.errorLabelHandler('Building/Blk/House No., Street/Road is required')
    })

    test('Address 2 is Optional', async ({ customerRegPage }) => {
        await customerRegPage.inputAddress2('Apt 3B')
        await expectInputValue(customerRegPage.address2, 'Apt 3B')
    })

    test('Invalid Address 1', async ({ customerRegPage }) => {
        await customerRegPage.inputAddress1("123 Main $t")
        await customerRegPage.errorLabelHandler("The Building/Blk/House No., Street/Road should only contain letters, numbers, spaces and some essential characters.")
    })

    test('Invalid Address 2', async ({ customerRegPage }) => {
        await customerRegPage.inputAddress2("123 Main $t")
        await customerRegPage.errorLabelHandler("The City/Municipality should only contain letters, numbers, spaces and some essential characters.")
    })

    test('Accept Valid Government ID (JPG/PNG)', async ({ customerRegPage }) => {
        const imagePath = path.resolve('e2e/data/sample.jpg');
        await customerRegPage.governmentID(imagePath);

        // Check file type
        const fileType = await customerRegPage.getUploadedFileType(customerRegPage.govID);
        expect(['image/png', 'image/jpeg', 'image/jpg']).toContain(fileType);
    })

    test('Reject other file types', async ({ customerRegPage }) => {
        const imagePath = path.resolve('e2e/data/sample.pdf');
        await customerRegPage.governmentID(imagePath);

        await expectLocatorTobeVisible(customerRegPage.govError.filter({ hasText: "Error validating ID, please try again." }))
    })

    test('Reject Invalid Gov’t ID File Types', async ({ customerRegPage }) => {
        const imagePath = path.resolve('e2e/data/invalid_sample.jpg');
        await customerRegPage.governmentID(imagePath);

        await expectLocatorTobeVisible(customerRegPage.govError.filter({ hasText: "ID is not valid" }))
    })

    test('First Name Length Input', async ({ customerRegPage }) => {
        await customerRegPage.firstName("A".repeat(151))
        await customerRegPage.errorLabelHandler("Maximum characters(150) have reached")
    })

    test('Last Name Length Input', async ({ customerRegPage }) => {
        await customerRegPage.lastName("b".repeat(151))
        await customerRegPage.errorLabelHandler("Maximum characters(150) have reached")
    })

    test('Tax Identification Number Length Input', async ({ customerRegPage }) => {
        await customerRegPage.tinNumber("1".repeat(33))
        await customerRegPage.errorLabelHandler("Maximum input length of 32 characters is reached.")
    })

    test('Zip Length Input', async ({ customerRegPage }) => {
        await customerRegPage.zipCode("b".repeat(10))
        await customerRegPage.errorLabelHandler("Maximum of 9 characters only")
    })

    test('Province Length Input', async ({ customerRegPage }) => {
        await customerRegPage.inputProvince("b".repeat(51))
        await customerRegPage.errorLabelHandler("Maximum characters(50) have reached")
    })


    test('Address 1 Length Input', async ({ customerRegPage }) => {
        await customerRegPage.inputAddress1("b".repeat(151))
        await customerRegPage.errorLabelHandler("Maximum characters(150) have reached")
    })


    test('Address 2 Length Input', async ({ customerRegPage }) => {
        await customerRegPage.inputAddress2("b".repeat(151))
        await customerRegPage.errorLabelHandler("Maximum characters(150) have reached")
    })
})

test.describe('Company Information Section', () => {
    test('Enable Company Info Section', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.companyVisibility.isVisible()

    })

    test('Valid Company Name', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyName('TMSPH')
        await expectInputValue(customerRegPage.companyName, 'TMSPH')
    })

    test('Empty Company Name', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyName('TMSPH')
        await customerRegPage.companyName.clear()
        await customerRegPage.errorLabelHandler("Company name is required")
    })

    test('Company Information: Valid TIN', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyTin('123456789')
        await expectInputValue(customerRegPage.companyTIN, '123456789')
    })

    test('Company Information: Invalid TIN', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyTin('ABC-123@#')
        await customerRegPage.errorLabelHandler("The Company TIN should contain numbers only.")
    })

    test('Company Information: Country Dropdown Selected', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyCountry('Philippines')
        await expectToContainText(customerRegPage.companyCountry, 'Philippines')
    })

    test('Company Information: Valid Zip Code', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyZip('1234')
        await expectInputValue(customerRegPage.companyZIP, '1234')
    })

    test('Company Information: Invalid Zip Code', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyZip('12@#')
        await customerRegPage.errorLabelHandler("The Company Zip Code should only contain letters, numbers and spaces")
    })

    test('Company Information: Valid Province', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyProvince('Rizal')
        await expectInputValue(customerRegPage.companyProvince, 'Rizal')
    })

    test('Company Information: Valid Address 1', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyAddress1('567 Office Ave')
        await expectInputValue(customerRegPage.companyAddress1, '567 Office Ave')
    })

    test('Company Information: Optional Address 2', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyAddress2('Bldg 2')
        await expectInputValue(customerRegPage.companyAddress2, 'Bldg 2')
    })

    test('Company Information: Valid SEC Registration File', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        const filePath = path.resolve('e2e/data/sample.jpg');
        await customerRegPage.secRegistration(filePath);

        // Check file type
        const fileType = await customerRegPage.getUploadedFileType(customerRegPage.companySecRegistration);
        expect(['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']).toContain(fileType);
    })

    test('Company Information: Invalid SEC Registration File', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        const filePath = path.resolve('e2e/data/sample.xlsx');
        await customerRegPage.secRegistration(filePath);

        await expectLocatorTobeVisible(customerRegPage.secError.filter({ hasText: "File must be an image or PDF" }))
    })

    test('Company Information: Valid BIR 2303 File', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        const filePath = path.resolve('e2e/data/sample.pdf');
        await customerRegPage.bir(filePath);

        // Check file type
        const fileType = await customerRegPage.getUploadedFileType(customerRegPage.companyBir);
        expect(['application/pdf', 'image/jpeg', 'image/png']).toContain(fileType);
    })

    test('Company Information: Invalid BIR 2303 Format', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        const filePath = path.resolve('e2e/data/sample.xlsx');
        await customerRegPage.bir(filePath);

        await expectLocatorTobeVisible(customerRegPage.birError.filter({ hasText: "File must be an image or PDF" }))
    })

    test('Company Information: Valid Business Card File', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        const imagePath = path.resolve('e2e/data/sample.jpg');
        await customerRegPage.inputCompanyID(imagePath);

        // Check file type
        const fileType = await customerRegPage.getUploadedFileType(customerRegPage.companyID);
        expect(['image/png', 'image/jpeg']).toContain(fileType);
    })

    test('Company Information: Invalid Business Card File', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        const imagePath = path.resolve('e2e/data/sample.xlsx');
        await customerRegPage.inputCompanyID(imagePath);

        await expectLocatorTobeVisible(customerRegPage.IDError.filter({ hasText: "Error validating ID, please try again." }))
    })

    test('Validate display on the details on how to register.', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.clickHere()
    })

    test('Company Name Length Input', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyName("b".repeat(151))
        await customerRegPage.errorLabelHandler("Maximum characters(150) have reached")
    })


    test('Company Information: Tax Identification Number Length Input', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyTin("1".repeat(33))
        await customerRegPage.errorLabelHandler("Maximum input length of 32 characters is reached.")
    })


    test('Company Information: Zip Length Input', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyZip("b".repeat(201))
        await customerRegPage.errorLabelHandler("Maximum of 9 characters only")
    })

    test('Company Information: Province Length Input', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyProvince("b".repeat(51))
        await customerRegPage.errorLabelHandler("Maximum characters(50) have reached")
    })

    test('Company Information: Address 1 Length Input', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyAddress1("b".repeat(151))
        await customerRegPage.errorLabelHandler("Maximum characters(150) have reached")
    })

    test('Company Information: Address 2 Length Input', async ({ customerRegPage }) => {
        await customerRegPage.companyInfo()
        await customerRegPage.inputCompanyAddress2("b".repeat(151))
        await customerRegPage.errorLabelHandler("Maximum characters(150) have reached")
    })
})