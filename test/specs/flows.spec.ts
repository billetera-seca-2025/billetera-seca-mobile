import {browser, driver, expect} from '@wdio/globals';

const TIMEOUT = 1000;

describe('Register Screen', () => {
    beforeEach(async () => {
        await moveToRegisterScreen(browser, driver);
    });

    it('should register successfully with valid data and show balance', async () => {
        const email = `test1@example.com`;
        const password = 'password123';

        await fillRegistrationForm(browser, email, password, password);

        const [homeTitle] = await Promise.all([browser.$('~home-title')]);
        await homeTitle.waitForDisplayed({timeout: TIMEOUT * 3});
        expect(await homeTitle.getText()).toBe('BilleteraSeca');
    });

    it('should show error with existing user', async () => {
        const email = `test1@example.com`;
        const password = 'password123';

        await fillRegistrationForm(browser, email, password, password);

        const [errorMessage] = await Promise.all([browser.$('~error-message')]);
        await errorMessage.waitForDisplayed({timeout: TIMEOUT});
        expect(await errorMessage.getText()).toContain('No se pudo crear la cuenta');
    });

    it('should show error with incomplete fields', async () => {
        const [registerButton] = await Promise.all([browser.$('~register-button')]);
        await registerButton.waitForDisplayed({timeout: TIMEOUT});
        await registerButton.click();

        const [errorMessage] = await Promise.all([browser.$('~error-message')]);
        await errorMessage.waitForDisplayed({timeout: TIMEOUT});
        expect(await errorMessage.getText()).toContain('Por favor completa todos los campos');

        const [emailInput] = await Promise.all([browser.$('~register-email')]);
        await emailInput.waitForDisplayed({timeout: TIMEOUT});
        await emailInput.setValue('test@example.com');

        await registerButton.click();
        await errorMessage.waitForDisplayed({timeout: TIMEOUT});
        expect(await errorMessage.getText()).toContain('Por favor completa todos los campos');
    });

    it('should show error with invalid email format', async () => {
        const invalidEmails = [
            'invalid-email',
            'test@',
            '@example.com',
            'test@example',
            'test.example.com'
        ];
        const password = 'password123';

        for (const email of invalidEmails) {
            await fillRegistrationForm(browser, email, password, password);

            const [errorMessage] = await Promise.all([browser.$('~error-message')]);
            await errorMessage.waitForDisplayed({timeout: TIMEOUT});
            expect(await errorMessage.getText()).toContain('email');
        }
    });
});

describe('Login Screen', () => {
    beforeEach(async () => {
        // Relanzar la app antes de cada prueba
        await driver.relaunchActiveApp();

        // Asegurarse de que la pantalla de login está visible
        await browser.waitUntil(
            async () => {
                const [loginEmail] = await Promise.all([browser.$('~login-email')]);
                return await loginEmail.isDisplayed();
            },
            {
                timeout: TIMEOUT,
                timeoutMsg: 'La pantalla de login no se cargó'
            }
        );
    });

    it('should show error on incomplete fields', async () => {
        const [loginButton] = await Promise.all([browser.$('~login-button')]);
        await loginButton.waitForDisplayed({timeout: TIMEOUT});
        await loginButton.click();

        const [errorMessage] = await Promise.all([browser.$('~error-message')]);
        await errorMessage.waitForDisplayed({timeout: TIMEOUT});
        expect(await errorMessage.getText()).toContain('Por favor completa todos los campos');

        const [emailInput] = await Promise.all([browser.$('~login-email')]);
        await emailInput.waitForDisplayed();
        await emailInput.setValue('test@example.com');

        await loginButton.click();
        expect(await errorMessage.getText()).toContain('Por favor completa todos los campos');
    });

    it('should show error on non-existent user', async () => {
        const email = `nonexistentuser@example.com`;
        const password = 'wrong_password';

        await fillLoginForm(email, password);

        const [errorMessage] = await Promise.all([browser.$('~error-message')]);
        await errorMessage.waitForDisplayed({timeout: TIMEOUT});
        expect(await errorMessage.getText()).toContain('Credenciales inválidas');
    });

    it('should show error with invalid email format', async () => {
        const invalidEmails = [
            'invalid-email',
            'test@',
            '@example.com',
            'test@example',
            'test.example.com'
        ];
        const password = 'password123';

        for (const email of invalidEmails) {
            await fillLoginForm(email, password);

            const [errorMessage] = await Promise.all([browser.$('~error-message')]);
            await errorMessage.waitForDisplayed({timeout: TIMEOUT});
            expect(await errorMessage.getText()).toContain('email');
        }
    });

    it('should login successfully with existing user', async () => {
        const email = `test1@example.com`;
        const password = 'password123';

        await fillLoginForm(email, password);

        const [homeTitle] = await Promise.all([browser.$('~home-title')]);
        await homeTitle.waitForDisplayed({timeout: TIMEOUT * 3});
        expect(await homeTitle.getText()).toBe('BilleteraSeca');
    });

    async function fillLoginForm(email: string, password: string) {
        const [emailInput] = await Promise.all([browser.$('~login-email')]);
        await emailInput.waitForDisplayed({timeout: TIMEOUT});
        await emailInput.clearValue();
        await emailInput.setValue(email);

        const [passwordInput] = await Promise.all([browser.$('~login-password')]);
        await passwordInput.waitForDisplayed({timeout: TIMEOUT});
        await passwordInput.clearValue();
        await passwordInput.setValue(password);

        const [loginButton] = await Promise.all([browser.$('~login-button')]);
        await loginButton.waitForDisplayed({timeout: TIMEOUT});
        await loginButton.click();
    }
});

describe('HomeScreen Tests', () => {
    before(async () => {
        await driver.relaunchActiveApp();

        // Simular flujo de login
        await browser.waitUntil(
            async () => {
                const [loginEmail] = await Promise.all([browser.$('~login-email')]);
                return await loginEmail.isDisplayed();
            },
            { timeout: TIMEOUT, timeoutMsg: 'La pantalla de login no se cargó' }
        );

        const [emailInput, passwordInput, loginButton] = await Promise.all([
            browser.$('~login-email'),
            browser.$('~login-password'),
            browser.$('~login-button'),
        ]);

        await emailInput.setValue('test1@example.com');
        await passwordInput.setValue('password123');
        await loginButton.click();

        const [homeTitle] = await Promise.all([browser.$('~home-title')]);
        await homeTitle.waitForDisplayed({ timeout: TIMEOUT * 3 });
        expect(await homeTitle.getText()).toBe('BilleteraSeca');
    });

    it('should display a balance of 50,000', async () => {
        const [balanceAmount] = await Promise.all([browser.$('~balance-amount')]);
        await balanceAmount.waitForDisplayed({ timeout: TIMEOUT });
        expect(await balanceAmount.getText()).toBe('$50.000');
    });

    it('should toggle balance visibility correctly when show balance button is tapped twice', async () => {
        const [showBalanceButton, balanceAmount] = await Promise.all([
            browser.$('~show-balance-button'),
            browser.$('~balance-amount'),
        ]);
        await showBalanceButton.waitForDisplayed({ timeout: TIMEOUT });

        // Primera vez: ocultar balance
        await showBalanceButton.click();
        expect(await balanceAmount.getText()).toBe('****');

        // Segunda vez: mostrar balance
        await showBalanceButton.click();
        expect(await balanceAmount.getText()).toBe('$50.000');
    });

    it('should hide the balance when show balance button is tapped', async () => {
        const [showBalanceButton, balanceAmount] = await Promise.all([
            browser.$('~show-balance-button'),
            browser.$('~balance-amount'),
        ]);
        await showBalanceButton.waitForDisplayed({ timeout: TIMEOUT });
        await showBalanceButton.click();

        expect(await balanceAmount.getText()).toBe('****');
    });

    it('should navigate to TransferScreen when transfer button is tapped and finally return', async () => {
        const [transferButton] = await Promise.all([browser.$('~transfer-button')]);
        await transferButton.waitForDisplayed({ timeout: TIMEOUT });
        await transferButton.click();

        const [transferTitle] = await Promise.all([browser.$('~transfer-title')]);
        await transferTitle.waitForDisplayed({ timeout: TIMEOUT });
        expect(await transferTitle.getText()).toBe('Transferir');

        await backToHome(browser);
    });

    it('should navigate to AddMoneyScreen when add money button is tapped and finally return', async () => {
        const [addMoneyButton] = await Promise.all([browser.$('~add-money-button')]);
        await addMoneyButton.waitForDisplayed({ timeout: TIMEOUT });
        await addMoneyButton.click();

        const [addMoneyTitle] = await Promise.all([browser.$('~add-money-title')]);
        await addMoneyTitle.waitForDisplayed({ timeout: TIMEOUT });
        expect(await addMoneyTitle.getText()).toBe('Cargar Dinero');

        await backToHome(browser);
    });

    it('should navigate to TransactionsScreen when transactions button is tapped and finally return', async () => {
        const [transactionsButton] = await Promise.all([browser.$('~transactions-button')]);
        await transactionsButton.waitForDisplayed({ timeout: TIMEOUT });
        await transactionsButton.click();

        const [transactionsTitle] = await Promise.all([browser.$('~transactions-title')]);
        await transactionsTitle.waitForDisplayed({ timeout: TIMEOUT });
        expect(await transactionsTitle.getText()).toBe('Transacciones');

        await backToHome(browser);
    });

    it('should redirect to login when logout is tapped', async () => {
        const [logoutButton] = await Promise.all([browser.$('~logout-button')]);
        await logoutButton.waitForDisplayed({ timeout: TIMEOUT });
        await logoutButton.click();

        const [loginEmail] = await Promise.all([browser.$('~login-email')]);
        await loginEmail.waitForDisplayed({ timeout: TIMEOUT });
        expect(await loginEmail.isDisplayed()).toBe(true);
    });
});

describe('Transfer Tests', () => {
    before(async () => {
        await moveToRegisterScreen(browser, driver);

        const email = `test2@example.com`;
        const password = 'password123';

        await fillRegistrationForm(browser, email, password, password);
    })

    beforeEach(async () => {
        const [homeTitle] = await Promise.all([browser.$('~home-title')]);
        await homeTitle.waitForDisplayed({ timeout: TIMEOUT * 3 });

        await goToByActions(browser, "transfer-button");
        await validateScreen(browser, "transfer-title");
    })

    afterEach(async () => {
        await backToHome(browser);
    })

    it('should does not transfer with a wrong account', async () => {
        const [amountInput] = await Promise.all([browser.$('~transfer-amount')]);
        await amountInput.waitForDisplayed({ timeout: TIMEOUT });
        await amountInput.setValue('1000');

        const [destinationInput] = await Promise.all([browser.$('~transfer-destination')]);
        await destinationInput.waitForDisplayed({ timeout: TIMEOUT });
        await destinationInput.setValue('wrong_email@mail.com');

        await clickTransferButton();

        const [errorMessage] = await Promise.all([browser.$('~error-message')]);
        await errorMessage.waitForDisplayed({ timeout: TIMEOUT });
        expect(await errorMessage.getText()).toContain('No se pudo realizar la transferencia');
    });

    it('should does not transfer with a wrong amount', async () => {
        const [amountInput] = await Promise.all([browser.$('~transfer-amount')]);
        await amountInput.waitForDisplayed({ timeout: TIMEOUT });
        await amountInput.setValue('-1000');

        const [destinationInput] = await Promise.all([browser.$('~transfer-destination')]);
        await destinationInput.waitForDisplayed({ timeout: TIMEOUT });
        await destinationInput.setValue('test1@example.com');

        await clickTransferButton();

        const [errorMessage] = await Promise.all([browser.$('~error-message')]);
        await errorMessage.waitForDisplayed({ timeout: TIMEOUT });
        expect(await errorMessage.getText()).toContain('Por favor ingresa un monto válido');
    });

    async function clickTransferButton() {
        const [transferButton] = await Promise.all([browser.$('~transfer-button')]);
        await transferButton.waitForDisplayed({ timeout: TIMEOUT });
        await transferButton.click();
    }
});

async function goToByActions(browserWD: WebdriverIO.Browser, id: string) {
    const [navigationButton] = await Promise.all([browserWD.$(`~${id}`)]);
    await navigationButton.waitForDisplayed({ timeout: TIMEOUT });
    await navigationButton.click();
}

async function validateScreen(browserWD: WebdriverIO.Browser, id: string) {
    await browserWD.waitUntil(
        async () => {
            const [component] = await Promise.all([browserWD.$(`~${id}`)]);
            return await component.isDisplayed();
        },
        {
            timeout: TIMEOUT,
            timeoutMsg: 'La pantalla no se cargó'
        }
    );
}

async function moveToRegisterScreen(browserWD: WebdriverIO.Browser, driverWD: WebdriverIO.Browser) {
    await driverWD.relaunchActiveApp();

    await browserWD.waitUntil(
        async () => {
            const [loginEmail] = await Promise.all([browserWD.$('~login-email')]);
            return await loginEmail.isDisplayed();
        },
        {
            timeout: TIMEOUT,
            timeoutMsg: 'La pantalla de login no se cargó'
        }
    );
    const [registerButton] = await Promise.all([browserWD.$('~register-link')]);
    await registerButton.waitForDisplayed({timeout: TIMEOUT});
    await registerButton.click();

    await browserWD.waitUntil(
        async () => {
            const [registerEmail] = await Promise.all([browserWD.$('~register-email')]);
            return await registerEmail.isDisplayed();
        },
        {
            timeout: TIMEOUT,
            timeoutMsg: 'La pantalla de registro no se cargó'
        }
    );
}

async function fillRegistrationForm(
    browserWD: WebdriverIO.Browser,
    email: string,
    password: string,
    confirmPassword: string
) {
    const [emailInput] = await Promise.all([browserWD.$('~register-email')]);
    await emailInput.waitForDisplayed({timeout: TIMEOUT});
    await emailInput.clearValue();
    await emailInput.setValue(email);

    const [passwordInput] = await Promise.all([browserWD.$('~register-password')]);
    await passwordInput.waitForDisplayed({timeout: TIMEOUT});
    await passwordInput.clearValue();
    await passwordInput.setValue(password);

    const [confirmPasswordInput] = await Promise.all([browserWD.$('~register-confirm-password')]);
    await confirmPasswordInput.waitForDisplayed({timeout: TIMEOUT});
    await confirmPasswordInput.clearValue();
    await confirmPasswordInput.setValue(confirmPassword);

    const [registerButton] = await Promise.all([browserWD.$('~register-button')]);
    await registerButton.waitForDisplayed({timeout: TIMEOUT});
    await registerButton.click();
}

async function backToHome(browserWD: WebdriverIO.Browser) {
    const [transferBackButton] = await Promise.all([browserWD.$('~back-button')]);
    await transferBackButton.waitForDisplayed({ timeout: TIMEOUT });
    await transferBackButton.click();

    const [homeTitle] = await Promise.all([browserWD.$('~home-title')]);
    await homeTitle.waitForDisplayed({ timeout: TIMEOUT * 3 });
    expect(await homeTitle.getText()).toBe('BilleteraSeca');
}
