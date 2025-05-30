import Mailosaur from 'mailosaur'

// Mailosaur lets you automate email and SMS tests as part of software development and QA.

const apiKey = 'MEV0jyR1LE7y3tnvTI6BuAQ6uDTXz1e1'
const serverId = 'shtah1xf'
const mailosaur = new Mailosaur(apiKey)

export async function getLatestOTP(emailAddress: string){

    // Get the email from Mailosaur
    const email = await mailosaur.messages.get(serverId, {sentTo: emailAddress})

    // Check html content for the OTP
    const htmlBody = email.html?.body
    if (!htmlBody) throw new Error('No HTML body found in the email.')

        // console.log('HTML Body', htmlBody)

    // Match 6-digit OTP inside a div with class 'OTP'
    const match = htmlBody.match(/<div[^>]class=["']?otp["']?[^>]>(\d{6})<\/div>/i);
    if (!match || !match[1]) {
        throw new Error('OTP not found in HTML body.')
    }

    // Retrieve passcode from the email
    return match[1]
}

export async function waitForNewOTP(emailAddress: string, previosOtp: string, timeout = 32000) {
    const start = Date.now()

    while (Date.now() - start < timeout) {
        const newOtp = await getLatestOTP(emailAddress)
        if (newOtp !== previosOtp) {
            return newOtp
        }
    }
    throw new Error('New OTP not received within timeout')
}

export async function getLatestResetPassword(emailAddress: string) {

    // Get the email from Mailosaur
    const email = await mailosaur.messages.get(serverId, { sentTo: emailAddress })

    // Check html content for the OTP
    const htmlBody = email.html?.body
    if (!htmlBody) throw new Error('No HTML body found in the email.')

    // console.log('HTML Body', htmlBody)

    // Match 6-digit OTP inside a div with class 'OTP'
    const match = htmlBody.match(/https?:\/\/[^"' ]+\/auth\/reset\/password-new\?token=[\w\-._~+/=]+/i)
    if (!match || !match[0]) {
        throw new Error('OTP not found in HTML body.')
    }

    // Retrieve passcode from the email
    return match[0]
}