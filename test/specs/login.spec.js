const LoginScreen = require('../pageobjects/LoginScreen');
const HomeScreen = require('../pageobjects/HomeScreen');

describe('Login Screen', () => {
    beforeEach(async () => {
        await driver.execute('mobile: activateApp', { appId: 'com.aseca.billeterasecamobile' });
    });

    it('debería mostrar mensaje de error con credenciales inválidas', async () => {
        await LoginScreen.login('usuario@invalido.com', 'password123');
        await expect(await LoginScreen.errorMessage).toBeDisplayed();
        await expect(await LoginScreen.errorMessage).toHaveText('Credenciales inválidas');
    });

    it('debería iniciar sesión exitosamente con credenciales válidas', async () => {
        await LoginScreen.login('usuario@valido.com', 'password123');
        
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

    it('debería navegar a la pantalla de registro', async () => {
        await LoginScreen.goToRegister();
        // TODO: Agregar verificación cuando tengamos el Page Object de RegisterScreen
    });
}); 