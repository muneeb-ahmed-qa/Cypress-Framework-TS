#!/usr/bin/env node

/**
 * Script to run tests with specific tags
 * 
 * Usage:
 *   node scripts/run-tagged-tests.js --tags smoke,critical
 *   node scripts/run-tagged-tests.js --exclude-tags slow,flaky
 *   node scripts/run-tagged-tests.js --preset smoke
 *   node scripts/run-tagged-tests.js --list-tags
 */

const { execSync } = require('child_process');
const path = require('path');

// Available tag presets
const presets = {
  smoke: ['smoke', 'critical'],
  regression: ['regression', 'comprehensive'],
  critical: ['critical', 'high-priority'],
  api: ['api', 'backend'],
  ui: ['ui', 'frontend'],
  visual: ['visual', 'screenshot'],
  fast: { exclude: ['slow', 'performance'] },
  stable: { exclude: ['flaky', 'unstable'] },
  e2e: ['e2e', 'integration'],
  performance: ['performance', 'slow']
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    tags: [],
    excludeTags: [],
    preset: null,
    listTags: false,
    browser: 'chrome',
    headless: true,
    spec: null,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--tags':
        if (args[i + 1]) {
          options.tags = args[i + 1].split(',').map(tag => tag.trim());
          i++;
        }
        break;
      case '--exclude-tags':
        if (args[i + 1]) {
          options.excludeTags = args[i + 1].split(',').map(tag => tag.trim());
          i++;
        }
        break;
      case '--preset':
        if (args[i + 1]) {
          options.preset = args[i + 1];
          i++;
        }
        break;
      case '--list-tags':
        options.listTags = true;
        break;
      case '--browser':
        if (args[i + 1]) {
          options.browser = args[i + 1];
          i++;
        }
        break;
      case '--headed':
        options.headless = false;
        break;
      case '--spec':
        if (args[i + 1]) {
          options.spec = args[i + 1];
          i++;
        }
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

// Display help information
function showHelp() {
  console.log(`
🧪 Cypress Tagged Test Runner

Usage:
  node scripts/run-tagged-tests.js [options]

Options:
  --tags <tags>           Comma-separated list of tags to include
  --exclude-tags <tags>   Comma-separated list of tags to exclude
  --preset <preset>       Use predefined tag preset
  --list-tags             List all available tags and presets
  --browser <browser>     Browser to use (chrome, firefox, edge)
  --headed                Run in headed mode (show browser)
  --spec <pattern>        Run specific test files
  --help, -h              Show this help message

Presets:
  smoke                   Run smoke tests (smoke, critical)
  regression              Run regression tests (regression, comprehensive)
  critical                Run critical tests (critical, high-priority)
  api                     Run API tests (api, backend)
  ui                      Run UI tests (ui, frontend)
  visual                  Run visual tests (visual, screenshot)
  fast                    Run fast tests (exclude slow, performance)
  stable                  Run stable tests (exclude flaky, unstable)
  e2e                     Run E2E tests (e2e, integration)
  performance             Run performance tests (performance, slow)

Examples:
  node scripts/run-tagged-tests.js --preset smoke
  node scripts/run-tagged-tests.js --tags smoke,critical --browser firefox
  node scripts/run-tagged-tests.js --exclude-tags slow,flaky --headed
  node scripts/run-tagged-tests.js --tags api --spec "cypress/e2e/api/**/*.spec.ts"
  `);
}

// List available tags and presets
function listTags() {
  console.log('\n🏷️  Available Tags:');
  console.log('  smoke, regression, critical, integration, api, ui, visual');
  console.log('  slow, flaky, e2e, unit, frontend, backend, comprehensive');
  console.log('  high-priority, low-priority, performance, security, accessibility');
  console.log('  responsive, mobile, desktop, data-generation, unit');
  
  console.log('\n📋 Available Presets:');
  Object.entries(presets).forEach(([name, config]) => {
    if (Array.isArray(config)) {
      console.log(`  ${name.padEnd(12)} - ${config.join(', ')}`);
    } else {
      console.log(`  ${name.padEnd(12)} - exclude: ${config.exclude.join(', ')}`);
    }
  });
}

// Build Cypress command
function buildCypressCommand(options) {
  const cypressPath = path.join(__dirname, '..', 'node_modules', '.bin', 'cypress');
  const command = [cypressPath, 'run'];
  
  // Add browser
  command.push('--browser', options.browser);
  
  // Add headless mode
  if (options.headless) {
    command.push('--headless');
  }
  
  // Add spec pattern
  if (options.spec) {
    command.push('--spec', options.spec);
  }
  
  // Add environment variables
  const envVars = [];
  
  if (options.tags.length > 0) {
    envVars.push(`TAGS=${options.tags.join(',')}`);
  }
  
  if (options.excludeTags.length > 0) {
    envVars.push(`EXCLUDE_TAGS=${options.excludeTags.join(',')}`);
  }
  
  if (envVars.length > 0) {
    command.push('--env', envVars.join(';'));
  }
  
  return command.join(' ');
}

// Run tests
function runTests(options) {
  const command = buildCypressCommand(options);
  
  console.log('🚀 Running Cypress tests...');
  console.log(`Command: ${command}`);
  console.log('');
  
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('\n✅ Tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Tests failed!');
    process.exit(1);
  }
}

// Main function
function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    return;
  }
  
  if (options.listTags) {
    listTags();
    return;
  }
  
  // Apply preset if specified
  if (options.preset) {
    if (!presets[options.preset]) {
      console.error(`❌ Unknown preset: ${options.preset}`);
      console.log('Available presets:', Object.keys(presets).join(', '));
      process.exit(1);
    }
    
    const preset = presets[options.preset];
    if (Array.isArray(preset)) {
      options.tags = preset;
    } else {
      options.excludeTags = preset.exclude;
    }
  }
  
  // Validate options
  if (options.tags.length === 0 && options.excludeTags.length === 0 && !options.preset) {
    console.log('ℹ️  No tags specified, running all tests');
  }
  
  runTests(options);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { parseArgs, buildCypressCommand, runTests, presets };
