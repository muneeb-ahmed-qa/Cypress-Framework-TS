#!/usr/bin/env node

/**
 * Report Generation Script
 * Generates multiple types of reports from test results
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Report types
const REPORT_TYPES = {
  HTML: 'html',
  JUNIT: 'junit',
  JSON: 'json',
  ALL: 'all'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`, 'green');
  }
}

function cleanReports() {
  const reportDirs = [
    'cypress/reports/html',
    'cypress/reports/junit',
    'cypress/reports/json'
  ];

  log('🧹 Cleaning existing reports...', 'yellow');
  
  reportDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        if (file !== '.gitkeep') {
          fs.unlinkSync(path.join(dir, file));
        }
      });
    }
  });
  
  log('✅ Reports cleaned successfully', 'green');
}

function generateHTMLReport() {
  log('📊 Generating HTML report...', 'blue');
  
  try {
    // Merge JSON reports
    execSync('npx mochawesome-merge cypress/reports/json/*.json -o cypress/reports/merged-report.json', { stdio: 'inherit' });
    
    // Generate HTML report
    execSync('npx marge cypress/reports/merged-report.json --reportDir cypress/reports/html --inline', { stdio: 'inherit' });
    
    log('✅ HTML report generated successfully', 'green');
    log(`📁 Report location: cypress/reports/html/`, 'cyan');
  } catch (error) {
    log(`❌ Error generating HTML report: ${error.message}`, 'red');
    process.exit(1);
  }
}

function generateJUnitReport() {
  log('📋 JUnit XML reports are generated automatically during test execution', 'blue');
  log(`📁 JUnit reports location: cypress/reports/junit/`, 'cyan');
}

function generateJSONReport() {
  log('📄 JSON reports are generated automatically during test execution', 'blue');
  log(`📁 JSON reports location: cypress/reports/json/`, 'cyan');
}

function generateAllReports() {
  log('🚀 Generating all reports...', 'magenta');
  
  cleanReports();
  generateHTMLReport();
  generateJUnitReport();
  generateJSONReport();
  
  log('🎉 All reports generated successfully!', 'green');
  logReportSummary();
}

function logReportSummary() {
  log('\n📊 Report Summary:', 'bright');
  log('================', 'bright');
  
  const reportDirs = {
    'HTML Reports': 'cypress/reports/html',
    'JUnit XML Reports': 'cypress/reports/junit',
    'JSON Reports': 'cypress/reports/json'
  };
  
  Object.entries(reportDirs).forEach(([name, dir]) => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(file => file !== '.gitkeep');
      log(`${name}: ${files.length} files`, 'cyan');
      files.forEach(file => {
        log(`  - ${file}`, 'reset');
      });
    } else {
      log(`${name}: No files found`, 'yellow');
    }
  });
  
  log('\n🔗 Quick Access:', 'bright');
  log('HTML Report: file://' + path.resolve('cypress/reports/html') + '/', 'green');
  log('JUnit Reports: file://' + path.resolve('cypress/reports/junit') + '/', 'green');
}

function showHelp() {
  log('\n📊 Cypress Report Generator', 'bright');
  log('============================', 'bright');
  log('\nUsage: node scripts/generate-reports.js [options]', 'cyan');
  log('\nOptions:', 'yellow');
  log('  --type <type>    Report type: html, junit, json, all (default: all)', 'reset');
  log('  --clean          Clean existing reports before generating', 'reset');
  log('  --help, -h       Show this help message', 'reset');
  log('\nExamples:', 'yellow');
  log('  node scripts/generate-reports.js --type html', 'reset');
  log('  node scripts/generate-reports.js --type all --clean', 'reset');
  log('  node scripts/generate-reports.js --help', 'reset');
}

function main() {
  const args = process.argv.slice(2);
  let reportType = REPORT_TYPES.ALL;
  let cleanFirst = false;
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--type':
        if (args[i + 1] && Object.values(REPORT_TYPES).includes(args[i + 1])) {
          reportType = args[i + 1];
          i++;
        } else {
          log('❌ Invalid report type. Use: html, junit, json, or all', 'red');
          process.exit(1);
        }
        break;
      case '--clean':
        cleanFirst = true;
        break;
      case '--help':
      case '-h':
        showHelp();
        return;
      default:
        log(`❌ Unknown option: ${arg}`, 'red');
        showHelp();
        process.exit(1);
    }
  }
  
  // Ensure directories exist
  ensureDirectoryExists('cypress/reports/html');
  ensureDirectoryExists('cypress/reports/junit');
  ensureDirectoryExists('cypress/reports/json');
  
  // Clean if requested
  if (cleanFirst) {
    cleanReports();
  }
  
  // Generate reports based on type
  switch (reportType) {
    case REPORT_TYPES.HTML:
      generateHTMLReport();
      break;
    case REPORT_TYPES.JUNIT:
      generateJUnitReport();
      break;
    case REPORT_TYPES.JSON:
      generateJSONReport();
      break;
    case REPORT_TYPES.ALL:
    default:
      generateAllReports();
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateHTMLReport, generateJUnitReport, generateAllReports };
