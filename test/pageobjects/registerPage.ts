
class RegisterPage {
    private get emailInput() { return $('~email-input'); }
    private get passwordInput() { return $('~password-input'); }
    private get confirmPasswordInput() { return $('~confirm-password-input'); }
    private get registerButton() { return $('~register-button'); }
    private get errorMessage() { return $('~error-message'); }

    async register(email: string, password: string, confirmPassword: string) {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.confirmPasswordInput.setValue(confirmPassword);
        await this.registerButton.click();
    }

    async getErrorMessage() {
        return await this.errorMessage.getText();
    }

    async isErrorMessageDisplayed() {
        return await this.errorMessage.isDisplayed();
    }
}

export default new RegisterPage(); 