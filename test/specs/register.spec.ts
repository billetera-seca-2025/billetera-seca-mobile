import { browser, expect } from '@wdio/globals';

describe('Register Screen', () => {
    before(async () => {
        await browser.reloadSession();
        
        await browser.waitUntil(
            async () => {
                const loginEmail = await browser.$('~login-email');
                return await loginEmail.isDisplayed();
            },
            {
                timeout: 10000,
                timeoutMsg: 'La pantalla de login no se cargó'
            }
        );

        const registerButton = await browser.$('~register-link');
        await registerButton.waitForDisplayed({ timeout: 10000 });
        await registerButton.click();

        await browser.waitUntil(
            async () => {
                const registerEmail = await browser.$('~register-email');
                return await registerEmail.isDisplayed();
            },
            {
                timeout: 10000,
                timeoutMsg: 'La pantalla de registro no se cargó'
            }
        );
    });

    it('should register successfully with valid data and show balance', async () => {
        const email = `test1@example.com`;
        const password = 'password123';

        const emailInput = await browser.$('~register-email');
        await emailInput.waitForDisplayed({ timeout: 10000 });
        await emailInput.setValue(email);

        const passwordInput = await browser.$('~register-password');
        await passwordInput.waitForDisplayed({ timeout: 10000 });
        await passwordInput.setValue(password);

        const confirmPasswordInput = await browser.$('~register-confirm-password');
        await confirmPasswordInput.waitForDisplayed({ timeout: 10000 });
        await confirmPasswordInput.setValue(password);

        const registerButton = await browser.$('~register-button');
        await registerButton.waitForDisplayed({ timeout: 10000 });
        await registerButton.click();
        
        const homeTitle = await browser.$('~home-title');
        await homeTitle.waitForDisplayed({ timeout: 10000 });
        expect(await homeTitle.getText()).toBe('BilleteraSeca');
    });

    it('should show error with existing user', async () => {
        const email = 'existing@example.com';
        const password = 'password123';

        const emailInput = await browser.$('~register-email');
        await emailInput.waitForDisplayed({ timeout: 10000 });
        await emailInput.setValue(email);

        const passwordInput = await browser.$('~register-password');
        await passwordInput.waitForDisplayed({ timeout: 10000 });
        await passwordInput.setValue(password);

        const confirmPasswordInput = await browser.$('~register-confirm-password');
        await confirmPasswordInput.waitForDisplayed({ timeout: 10000 });
        await confirmPasswordInput.setValue(password);

        const registerButton = await browser.$('~register-button');
        await registerButton.waitForDisplayed({ timeout: 10000 });
        await registerButton.click();

        const errorMessage = await browser.$('~register-error');
        await errorMessage.waitForDisplayed({ timeout: 10000 });
        expect(await errorMessage.getText()).toContain('usuario ya existe');
    });

    it('should show error with incomplete fields', async () => {
        // Probar con campos vacíos
        const registerButton = await browser.$('~register-button');
        await registerButton.waitForDisplayed({ timeout: 10000 });
        await registerButton.click();

        const errorMessage = await browser.$('~register-error');
        await errorMessage.waitForDisplayed({ timeout: 10000 });
        expect(await errorMessage.getText()).toContain('completar todos los campos');

        // Probar con solo email
        const emailInput = await browser.$('~register-email');
        await emailInput.waitForDisplayed({ timeout: 10000 });
        await emailInput.setValue('test@example.com');

        await registerButton.click();
        await errorMessage.waitForDisplayed({ timeout: 10000 });
        expect(await errorMessage.getText()).toContain('completar todos los campos');
    });

    it('should show error with invalid email format', async () => {
        const invalidEmails = [
            'invalid-email',
            'test@',
            '@example.com',
            'test@example',
            'test.example.com'
        ];

        for (const email of invalidEmails) {
            const emailInput = await browser.$('~register-email');
            await emailInput.waitForDisplayed({ timeout: 10000 });
            await emailInput.clearValue();
            await emailInput.setValue(email);

            const passwordInput = await browser.$('~register-password');
            await passwordInput.waitForDisplayed({ timeout: 10000 });
            await passwordInput.setValue('password123');

            const confirmPasswordInput = await browser.$('~register-confirm-password');
            await confirmPasswordInput.waitForDisplayed({ timeout: 10000 });
            await confirmPasswordInput.setValue('password123');

            const registerButton = await browser.$('~register-button');
            await registerButton.waitForDisplayed({ timeout: 10000 });
            await registerButton.click();

            const errorMessage = await browser.$('~register-error');
            await errorMessage.waitForDisplayed({ timeout: 10000 });
            expect(await errorMessage.getText()).toContain('email');
        }
    });
}); 