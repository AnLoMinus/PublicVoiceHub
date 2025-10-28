#!/usr/bin/env node

/**
 * FixCry Data Validator
 * Validates issue data against JSON schema
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Load schemas
const issueSchema = JSON.parse(fs.readFileSync(path.join(__dirname, '../schemas/issue-schema.json'), 'utf8'));
const reportSchema = JSON.parse(fs.readFileSync(path.join(__dirname, '../schemas/report-schema.json'), 'utf8'));

// Setup AJV
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validateIssue = ajv.compile(issueSchema);
const validateReport = ajv.compile(reportSchema);

/**
 * Validate a single issue
 */
function validateIssueData(data) {
    const valid = validateIssue(data);
    
    if (!valid) {
        return {
            valid: false,
            errors: validateIssue.errors
        };
    }
    
    return { valid: true };
}

/**
 * Validate a single report
 */
function validateReportData(data) {
    const valid = validateReport(data);
    
    if (!valid) {
        return {
            valid: false,
            errors: validateReport.errors
        };
    }
    
    return { valid: true };
}

/**
 * Validate all issues in a directory
 */
function validateIssuesDirectory(dirPath) {
    const results = {
        valid: 0,
        invalid: 0,
        errors: []
    };
    
    try {
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(dirPath, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                const result = validateIssueData(data);
                
                if (result.valid) {
                    results.valid++;
                } else {
                    results.invalid++;
                    results.errors.push({
                        file: file,
                        errors: result.errors
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error reading directory:', error.message);
        return null;
    }
    
    return results;
}

/**
 * Validate all reports in a directory
 */
function validateReportsDirectory(dirPath) {
    const results = {
        valid: 0,
        invalid: 0,
        errors: []
    };
    
    try {
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(dirPath, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                const result = validateReportData(data);
                
                if (result.valid) {
                    results.valid++;
                } else {
                    results.invalid++;
                    results.errors.push({
                        file: file,
                        errors: result.errors
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error reading directory:', error.message);
        return null;
    }
    
    return results;
}

/**
 * Generate validation report
 */
function generateValidationReport(results, type) {
    const report = {
        timestamp: new Date().toISOString(),
        type: type,
        summary: {
            total: results.valid + results.invalid,
            valid: results.valid,
            invalid: results.invalid,
            success_rate: results.valid / (results.valid + results.invalid) * 100
        },
        errors: results.errors
    };
    
    return report;
}

/**
 * Main function
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node validate-data.js <command> [options]');
        console.log('');
        console.log('Commands:');
        console.log('  issue <file>           - Validate single issue file');
        console.log('  report <file>          - Validate single report file');
        console.log('  issues-dir <dir>       - Validate all issues in directory');
        console.log('  reports-dir <dir>      - Validate all reports in directory');
        console.log('  all                    - Validate all data');
        console.log('');
        process.exit(1);
    }
    
    const command = args[0];
    
    switch (command) {
        case 'issue':
            if (args.length < 2) {
                console.error('Error: Issue file path required');
                process.exit(1);
            }
            
            const issueData = JSON.parse(fs.readFileSync(args[1], 'utf8'));
            const issueResult = validateIssueData(issueData);
            
            if (issueResult.valid) {
                console.log('✅ Issue data is valid');
            } else {
                console.log('❌ Issue data is invalid:');
                console.log(JSON.stringify(issueResult.errors, null, 2));
                process.exit(1);
            }
            break;
            
        case 'report':
            if (args.length < 2) {
                console.error('Error: Report file path required');
                process.exit(1);
            }
            
            const reportData = JSON.parse(fs.readFileSync(args[1], 'utf8'));
            const reportResult = validateReportData(reportData);
            
            if (reportResult.valid) {
                console.log('✅ Report data is valid');
            } else {
                console.log('❌ Report data is invalid:');
                console.log(JSON.stringify(reportResult.errors, null, 2));
                process.exit(1);
            }
            break;
            
        case 'issues-dir':
            if (args.length < 2) {
                console.error('Error: Issues directory path required');
                process.exit(1);
            }
            
            const issuesResults = validateIssuesDirectory(args[1]);
            if (issuesResults) {
                const report = generateValidationReport(issuesResults, 'issues');
                console.log(JSON.stringify(report, null, 2));
                
                if (issuesResults.invalid > 0) {
                    process.exit(1);
                }
            }
            break;
            
        case 'reports-dir':
            if (args.length < 2) {
                console.error('Error: Reports directory path required');
                process.exit(1);
            }
            
            const reportsResults = validateReportsDirectory(args[1]);
            if (reportsResults) {
                const report = generateValidationReport(reportsResults, 'reports');
                console.log(JSON.stringify(report, null, 2));
                
                if (reportsResults.invalid > 0) {
                    process.exit(1);
                }
            }
            break;
            
        case 'all':
            console.log('🔍 Validating all data...');
            
            const issuesDir = path.join(__dirname, '../../data/issues');
            const reportsDir = path.join(__dirname, '../../data/reports');
            
            let hasErrors = false;
            
            if (fs.existsSync(issuesDir)) {
                console.log('📁 Validating issues...');
                const issuesResults = validateIssuesDirectory(issuesDir);
                if (issuesResults && issuesResults.invalid > 0) {
                    hasErrors = true;
                }
            }
            
            if (fs.existsSync(reportsDir)) {
                console.log('📊 Validating reports...');
                const reportsResults = validateReportsDirectory(reportsDir);
                if (reportsResults && reportsResults.invalid > 0) {
                    hasErrors = true;
                }
            }
            
            if (hasErrors) {
                console.log('❌ Validation failed');
                process.exit(1);
            } else {
                console.log('✅ All data is valid');
            }
            break;
            
        default:
            console.error(`Error: Unknown command "${command}"`);
            process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    validateIssueData,
    validateReportData,
    validateIssuesDirectory,
    validateReportsDirectory,
    generateValidationReport
};
