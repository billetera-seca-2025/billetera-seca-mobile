import {browser, driver, expect} from '@wdio/globals';

const TIMEOUT = 1000;

describe('Register Screen', () => {
    beforeEach(async () => {
        await driver.relaunchActiveApp();

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
        const [registerButton] = await Promise.all([browser.$('~register-link')]);
        await registerButton.waitForDisplayed({timeout: TIMEOUT});
        await registerButton.click();

        await browser.waitUntil(
            async () => {
                const [registerEmail] = await Promise.all([browser.$('~register-email')]);
                return await registerEmail.isDisplayed();
            },
            {
                timeout: TIMEOUT,
                timeoutMsg: 'La pantalla de registro no se cargó'
            }
        );
    });

    it('should register successfully with valid data and show balance', async () => {
        const email = `test1@example.com`;
        const password = 'password123';

        await fillRegistrationForm(email, password, password);

        const [homeTitle] = await Promise.all([browser.$('~home-title')]);
        await homeTitle.waitForDisplayed({timeout: TIMEOUT * 3});
        expect(await homeTitle.getText()).toBe('BilleteraSeca');
    });

    it('should show error with existing user', async () => {
        const email = `test1@example.com`;
        const password = 'password123';

        await fillRegistrationForm(email, password, password);

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
            await fillRegistrationForm(email, password, password);

            const [errorMessage] = await Promise.all([browser.$('~error-message')]);
            await errorMessage.waitForDisplayed({timeout: TIMEOUT});
            expect(await errorMessage.getText()).toContain('email');
        }
    });

    async function fillRegistrationForm(email: string, password: string, confirmPassword: string) {
        const [emailInput] = await Promise.all([browser.$('~register-email')]);
        await emailInput.waitForDisplayed({timeout: TIMEOUT});
        await emailInput.clearValue();
        await emailInput.setValue(email);

        const [passwordInput] = await Promise.all([browser.$('~register-password')]);
        await passwordInput.waitForDisplayed({timeout: TIMEOUT});
        await passwordInput.clearValue();
        await passwordInput.setValue(password);

        const [confirmPasswordInput] = await Promise.all([browser.$('~register-confirm-password')]);
        await confirmPasswordInput.waitForDisplayed({timeout: TIMEOUT});
        await confirmPasswordInput.clearValue();
        await confirmPasswordInput.setValue(confirmPassword);

        const [registerButton] = await Promise.all([browser.$('~register-button')]);
        await registerButton.waitForDisplayed({timeout: TIMEOUT});
        await registerButton.click();
    }
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
        const password = 'wrongpassword';

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
    // Before each test, log in to navigate to the HomeScreen
    beforeEach(async () => {
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

        // Esperar a que la pantalla principal (HomeScreen) esté cargada
        const [homeTitle] = await Promise.all([browser.$('~home-title')]);
        await homeTitle.waitForDisplayed({ timeout: TIMEOUT * 3 });
        expect(await homeTitle.getText()).toBe('BilleteraSeca');
    });

    it('should redirect to login when logout is tapped', async () => {
        const [logoutButton] = await Promise.all([browser.$('~logout-button')]);
        await logoutButton.waitForDisplayed({ timeout: TIMEOUT });
        await logoutButton.click();

        // Verificar que vuelve a la pantalla de login
        const [loginEmail] = await Promise.all([browser.$('~login-email')]);
        await loginEmail.waitForDisplayed({ timeout: TIMEOUT });
        expect(await loginEmail.isDisplayed()).toBe(true);
    });

    it('should display a balance of 50,000', async () => {
        const [balanceAmount] = await Promise.all([browser.$('~balance-amount')]);
        await balanceAmount.waitForDisplayed({ timeout: TIMEOUT });
        expect(await balanceAmount.getText()).toBe('$50.000');
    });

    it('should hide the balance when show balance button is tapped', async () => {
        const [showBalanceButton, balanceAmount] = await Promise.all([
            browser.$('~show-balance-button'),
            browser.$('~balance-amount'),
        ]);
        await showBalanceButton.waitForDisplayed({ timeout: TIMEOUT });
        await showBalanceButton.click();

        // Verificar que el balance esté oculto
        expect(await balanceAmount.getText()).toBe('****');
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

    it('should navigate to TransferScreen when transfer button is tapped', async () => {
        const [transferButton] = await Promise.all([browser.$('~transfer-button')]);
        await transferButton.waitForDisplayed({ timeout: TIMEOUT });
        await transferButton.click();

        // Verificar que está en la pantalla de transferencia
        const [transferTitle] = await Promise.all([browser.$('~transfer-title')]);
        await transferTitle.waitForDisplayed({ timeout: TIMEOUT });
        expect(await transferTitle.getText()).toBe('Transferir');
    });

    it('should navigate to AddMoneyScreen when add money button is tapped', async () => {
        const [addMoneyButton] = await Promise.all([browser.$('~add-money-button')]);
        await addMoneyButton.waitForDisplayed({ timeout: TIMEOUT });
        await addMoneyButton.click();

        // Verificar que está en la pantalla de cargar dinero
        const [addMoneyTitle] = await Promise.all([browser.$('~add-money-title')]);
        await addMoneyTitle.waitForDisplayed({ timeout: TIMEOUT });
        expect(await addMoneyTitle.getText()).toBe('Cargar Dinero');
    });

    it('should navigate to TransactionsScreen when transactions button is tapped', async () => {
        const [transactionsButton] = await Promise.all([browser.$('~transactions-button')]);
        await transactionsButton.waitForDisplayed({ timeout: TIMEOUT });
        await transactionsButton.click();

        // Verificar que está en la pantalla de transacciones
        const [transactionsTitle] = await Promise.all([browser.$('~transactions-title')]);
        await transactionsTitle.waitForDisplayed({ timeout: TIMEOUT });
        expect(await transactionsTitle.getText()).toBe('Transacciones');
    });
});
