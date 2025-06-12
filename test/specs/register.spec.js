const RegisterScreen = require('../pageobjects/RegisterScreen');
const HomeScreen = require('../pageobjects/HomeScreen');

describe('Register Screen', () => {
    beforeEach(async () => {
        await driver.execute('mobile: activateApp', { appId: 'com.aseca.billeterasecamobile' });
    });

    it('debería mostrar mensaje de error con contraseñas que no coinciden', async () => {
        await RegisterScreen.register(
            'Usuario Test',
            'usuario@test.com',
            'password123',
            'password456'
        );
        await expect(await RegisterScreen.errorMessage).toBeDisplayed();
        await expect(await RegisterScreen.errorMessage).toHaveText('Las contraseñas no coinciden');
    });

    it('debería mostrar mensaje de error con email inválido', async () => {
        await RegisterScreen.register(
            'Usuario Test',
            'emailinvalido',
            'password123',
            'password123'
        );
        await expect(await RegisterScreen.errorMessage).toBeDisplayed();
        await expect(await RegisterScreen.errorMessage).toHaveText('Email inválido');
    });

    it('debería registrar exitosamente con datos válidos', async () => {
        await RegisterScreen.register(
            'Usuario Test',
            'usuario@test.com',
            'password123',
            'password123'
        );
        
        // Verificar que estamos en la pantalla principal
        await expect(await HomeScreen.balanceAmount).toBeDisplayed();
        await expect(await HomeScreen.transferButton).toBeDisplayed();
        await expect(await HomeScreen.addMoneyButton).toBeDisplayed();
        await expect(await HomeScreen.debinButton).toBeDisplayed();
        await expect(await HomeScreen.transactionsButton).toBeDisplayed();
        
        // Verificar que el balance se muestra correctamente
        const balance = await HomeScreen.getBalance();
        expect(balance).toBeGreaterThan(0);
    });

    it('debería navegar a la pantalla de login', async () => {
        await RegisterScreen.goToLogin();
        // TODO: Agregar verificación cuando tengamos el Page Object de LoginScreen
    });
}); 