class LoginScreen {
    get emailInput() {
        return $('~email-input');
    }

    get passwordInput() {
        return $('~password-input');
    }

    get loginButton() {
        return $('~login-button');
    }

    get registerButton() {
        return $('~register-button');
    }

    get errorMessage() {
        return $('~error-message');
    }

    async login(email, password) {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.loginButton.click();
    }

    async goToRegister() {
        await this.registerButton.click();
    }
}

module.exports = new LoginScreen(); 