const { join } = require('path');

exports.config = {
  runner: 'local',
  port: 4723,
  path: '/wd/hub',
  specs: [
    './test/specs/**/*.spec.js'
  ],
  exclude: [],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android',
    'appium:app': './android/app/build/outputs/apk/debug/app-debug.apk',
    'appium:appPackage': 'com.aseca.billeterasecamobile',
    'appium:appActivity': 'com.aseca.billeterasecamobile.MainActivity',
    'appium:noReset': true
  }],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  appium: {
    command: 'appium'
  }
}; 