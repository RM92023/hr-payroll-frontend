// Karma configuration file
module.exports = function (config) {
  const isCI = String(process.env.CI).toLowerCase() === 'true' || process.env.CI === '1';

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage')
    ],
    client: {
      jasmine: {},
      clearContext: false
    },
    jasmineHtmlReporter: { suppressAll: true },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/hr-payroll-ui'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    },
    reporters: ['progress', 'kjhtml'],

    // GitHub Actions needs '--no-sandbox'
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
      }
    },
    // In CI we want a clean, one-shot run (avoid hanging due to file watchers/coverage output)
    browsers: [isCI ? 'ChromeHeadlessNoSandbox' : 'ChromeHeadless'],
    singleRun: isCI,
    restartOnFileChange: !isCI,
    browserNoActivityTimeout: 60000,
    captureTimeout: 120000
  });
};
