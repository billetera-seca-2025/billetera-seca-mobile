import { expect } from '@wdio/globals'
import WelcomePage from '../pageobjects/welcomePage'

describe('Welcome view', () => {
    it('should display the welcome text', async () => {
        await expect(WelcomePage.welcomeText).toBeDisplayed()
        await expect(WelcomePage.welcomeText).toHaveText('Always take control')
    })

    it('should navigate to the login page when clicking the get started button', async () => {
        await WelcomePage.clickGetStarted()
    })
})

