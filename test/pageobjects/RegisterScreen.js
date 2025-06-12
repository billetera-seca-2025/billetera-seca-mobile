class RegisterScreen {
    get nameInput() {
        return $('~name-input');
    }

    get emailInput() {
        return $('~email-input');
    }

    get passwordInput() {
        return $('~password-input');
    }

    get confirmPasswordInput() {
        return $('~confirm-password-input');
    }

    get registerButton() {
        return $('~register-button');
    }

    get loginButton() {
        return $('~login-button');
    }

    get errorMessage() {
        return $('~error-message');
    }

    async register(name, email, password, confirmPassword) {
        await this.nameInput.setValue(name);
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.confirmPasswordInput.setValue(confirmPassword);
        await this.registerButton.click();
    }

    async goToLogin() {
        await this.loginButton.click();
    }
}

module.exports = new RegisterScreen(); 