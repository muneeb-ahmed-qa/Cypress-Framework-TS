import { defineConfig } from 'cypress';
import { execSync } from 'child_process';

export default defineConfig({
  e2e: {
    baseUrl: 'https://example.cypress.io',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    watchForFileChanges: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      apiUrl: 'https://jsonplaceholder.typicode.com',
      environment: 'staging',
      // Test tagging configuration
      TAGS: process.env.CYPRESS_TAGS || '',
      EXCLUDE_TAGS: process.env.CYPRESS_EXCLUDE_TAGS || '',
      REQUIRE_ALL_TAGS: process.env.CYPRESS_REQUIRE_ALL_TAGS || 'false',
      // Load environment variables from .env file
      ...process.env,
    },
    setupNodeEvents(on, config) {
      // Code coverage plugin
      // require('@cypress/code-coverage/task')(on, config);

      // Mochawesome reporter
      // require('cypress-mochawesome-reporter/plugin')(on);

      // Custom tasks
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        logError(message) {
          console.error(message);
          return null;
        },
        generateTimestamp() {
          return new Date().toISOString();
        },
        // Execute shell command
        exec(command: string) {
          try {
            return execSync(command, { encoding: 'utf-8' });
          } catch (error) {
            return null;
          }
        },
      });

      // Environment-specific configurations
      const environment = config.env.environment || 'staging';
      config.env.envFile = `cypress/config/${environment}.json`;

      return config;
    },
    specPattern: 'cypress/e2e/**/*.spec.{ts,js}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    downloadsFolder: 'cypress/downloads',
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.spec.{ts,js}',
    supportFile: 'cypress/support/component.ts',
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
    cypressMochawesomeReporterReporterOptions: {
      reportDir: 'cypress/reports/html',
      charts: true,
      reportPageTitle: 'Cypress Test Report',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
      overwrite: true,
      html: true,
      json: true,
    },
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/reports/junit/results-[hash].xml',
      toConsole: true,
      attachments: true,
      outputs: true,
      testCaseSwitchClassnameAndName: false,
      suiteTitleSeparatedBy: ' › ',
      useFullSuiteTitle: true,
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      rootSuiteTitle: 'Cypress Tests',
    },
  },
});

