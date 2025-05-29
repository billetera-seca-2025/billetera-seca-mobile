export const config: WebdriverIO.Config = {
    runner: 'local',
    tsConfigPath: './tsconfig.json',
    specs: ['./test/specs/**/*.ts'],
    exclude: [],
    maxInstances: 10,
    capabilities: [{
        platformName: 'Android',
        'appium:app': './build/application-196d485a-2df9-49f6-8bde-28850a95974f.apk',
        'appium:deviceName': 'emulator-5554',
        'appium:platformVersion': '16.0',
        'appium:automationName': 'UiAutomator2'
    }],
    hostname: 'localhost',
    port: 4723,
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}
