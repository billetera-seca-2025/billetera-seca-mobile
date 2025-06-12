import { expect } from '@wdio/globals';
import RegisterPage from '../pageobjects/registerPage';

describe('Register Screen', () => {
    beforeEach(async () => {
        // Asegurarse de que estamos en la pantalla de registro
        await driver.launchApp();
    });

    it('should show error with invalid email', async () => {
        await RegisterPage.register('invalid-email', 'password123', 'password123');
        expect(await RegisterPage.isErrorMessageDisplayed()).toBe(true);
        expect(await RegisterPage.getErrorMessage()).toContain('email');
    });

    it('should show error with password mismatch', async () => {
        await RegisterPage.register('test@example.com', 'password123', 'different123');
        expect(await RegisterPage.isErrorMessageDisplayed()).toBe(true);
        expect(await RegisterPage.getErrorMessage()).toContain('contraseñas');
    });

    it('should show error with short password', async () => {
        await RegisterPage.register('test@example.com', 'short', 'short');
        expect(await RegisterPage.isErrorMessageDisplayed()).toBe(true);
        expect(await RegisterPage.getErrorMessage()).toContain('contraseña');
    });

    it('should register successfully with valid data', async () => {
        await RegisterPage.register('test@example.com', 'password123', 'password123');
        // Aquí deberíamos verificar que se navega a la siguiente pantalla
        // o que se muestra un mensaje de éxito
    });
}); 