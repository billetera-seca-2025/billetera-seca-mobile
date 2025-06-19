export const config: WebdriverIO.Config = {
    runner: 'local',
    tsConfigPath: './tsconfig.json',
    specs: ['./test/specs/**/*.ts'],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:app': './build-1750308716706.apk',
        'appium:deviceName': 'Android',
        'appium:platformVersion': '16',
        'appium:automationName': 'UiAutomator2',
        'appium:noReset': false,
        'appium:newCommandTimeout': 30000
    }],
    hostname: 'localhost',
    port: 4723,
    path: '/wd/hub',
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
        cleanReferencesAfterRun: false
    }
}
