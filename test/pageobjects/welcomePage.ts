import {$} from '@wdio/globals'

class WelcomePage {
    get welcomeText() {
        return $('#welcome-title');
    }

    get getStartedButton() {
        return $('~get-started-button');
    }

    async clickGetStarted() {
        await this.getStartedButton.click();
    }
}

export default new WelcomePage();