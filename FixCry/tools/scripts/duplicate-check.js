#!/usr/bin/env node

/**
 * FixCry Duplicate Checker
 * Checks for duplicate issues using fuzzy matching
 */

const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js');

/**
 * Load all issues from directory
 */
function loadIssues(dirPath) {
    const issues = [];
    
    try {
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(dirPath, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                issues.push({
                    ...data,
                    _file: file,
                    _path: filePath
                });
            }
        }
    } catch (error) {
        console.error('Error loading issues:', error.message);
        return [];
    }
    
    return issues;
}

/**
 * Configure Fuse.js for fuzzy matching
 */
function createFuseInstance(issues) {
    const options = {
        keys: [
            { name: 'title', weight: 0.4 },
            { name: 'description', weight: 0.3 },
            { name: 'location.city', weight: 0.2 },
            { name: 'location.street', weight: 0.1 }
        ],
        threshold: 0.3, // Lower threshold = more strict matching
        includeScore: true,
        includeMatches: true
    };
    
    return new Fuse(issues, options);
}

/**
 * Check for duplicates
 */
function findDuplicates(issues) {
    const fuse = createFuseInstance(issues);
    const duplicates = [];
    const processed = new Set();
    
    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];
        const issueId = issue.id;
        
        if (processed.has(issueId)) {
            continue;
        }
        
        // Search for similar issues
        const results = fuse.search(issue.title);
        
        // Filter out self and already processed issues
        const similarIssues = results
            .filter(result => {
                const similarIssue = result.item;
                return similarIssue.id !== issueId && 
                       !processed.has(similarIssue.id) &&
                       result.score < 0.3; // Threshold for similarity
            })
            .map(result => ({
                issue: result.item,
                score: result.score,
                matches: result.matches
            }));
        
        if (similarIssues.length > 0) {
            duplicates.push({
                original: issue,
                duplicates: similarIssues,
                confidence: Math.max(...similarIssues.map(d => d.score))
            });
            
            // Mark all issues in this group as processed
            processed.add(issueId);
            similarIssues.forEach(dup => processed.add(dup.issue.id));
        }
    }
    
    return duplicates;
}

/**
 * Generate duplicate report
 */
function generateDuplicateReport(duplicates) {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            total_groups: duplicates.length,
            total_duplicates: duplicates.reduce((sum, group) => sum + group.duplicates.length, 0)
        },
        groups: duplicates.map(group => ({
            original: {
                id: group.original.id,
                title: group.original.title,
                file: group.original._file,
                created_at: group.original.submitted_at
            },
            duplicates: group.duplicates.map(dup => ({
                id: dup.issue.id,
                title: dup.issue.title,
                file: dup.issue._file,
                created_at: dup.issue.submitted_at,
                similarity_score: dup.score,
                matching_fields: dup.matches.map(match => match.key)
            })),
            confidence: group.confidence
        }))
    };
    
    return report;
}

/**
 * Suggest merge actions
 */
function suggestMergeActions(duplicates) {
    const suggestions = [];
    
    for (const group of duplicates) {
        const original = group.original;
        const dups = group.duplicates;
        
        // Sort by creation date (keep oldest as original)
        const allIssues = [original, ...dups.map(d => d.issue)];
        allIssues.sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
        
        const keepIssue = allIssues[0];
        const mergeIssues = allIssues.slice(1);
        
        suggestions.push({
            action: 'merge',
            keep: {
                id: keepIssue.id,
                title: keepIssue.title,
                file: keepIssue._file
            },
            merge: mergeIssues.map(issue => ({
                id: issue.id,
                title: issue.title,
                file: issue._file
            })),
            reason: 'Similar content and location',
            confidence: group.confidence
        });
    }
    
    return suggestions;
}

/**
 * Save duplicate report
 */
function saveReport(report, outputPath) {
    try {
        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
        console.log(`📊 Duplicate report saved to: ${outputPath}`);
    } catch (error) {
        console.error('Error saving report:', error.message);
    }
}

/**
 * Main function
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node duplicate-check.js [options]');
        console.log('');
        console.log('Options:');
        console.log('  --input <dir>     - Input directory (default: ../../data/issues)');
        console.log('  --output <file>   - Output report file (default: duplicate-report.json)');
        console.log('  --threshold <num> - Similarity threshold (default: 0.3)');
        console.log('  --suggestions    - Generate merge suggestions');
        console.log('');
        process.exit(1);
    }
    
    // Parse arguments
    const options = {
        input: '../../data/issues',
        output: 'duplicate-report.json',
        threshold: 0.3,
        suggestions: false
    };
    
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--input':
                options.input = args[++i];
                break;
            case '--output':
                options.output = args[++i];
                break;
            case '--threshold':
                options.threshold = parseFloat(args[++i]);
                break;
            case '--suggestions':
                options.suggestions = true;
                break;
        }
    }
    
    console.log('🔍 Checking for duplicates...');
    console.log(`📁 Input directory: ${options.input}`);
    console.log(`🎯 Threshold: ${options.threshold}`);
    
    // Load issues
    const issues = loadIssues(options.input);
    console.log(`📋 Loaded ${issues.length} issues`);
    
    if (issues.length === 0) {
        console.log('❌ No issues found');
        process.exit(1);
    }
    
    // Find duplicates
    const duplicates = findDuplicates(issues);
    console.log(`🔍 Found ${duplicates.length} duplicate groups`);
    
    // Generate report
    const report = generateDuplicateReport(duplicates);
    
    if (options.suggestions) {
        report.suggestions = suggestMergeActions(duplicates);
        console.log(`💡 Generated ${report.suggestions.length} merge suggestions`);
    }
    
    // Save report
    saveReport(report, options.output);
    
    // Print summary
    console.log('\n📊 Summary:');
    console.log(`   Total groups: ${report.summary.total_groups}`);
    console.log(`   Total duplicates: ${report.summary.total_duplicates}`);
    
    if (duplicates.length > 0) {
        console.log('\n🔍 Duplicate groups found:');
        duplicates.forEach((group, index) => {
            console.log(`   ${index + 1}. ${group.original.title}`);
            console.log(`      Original: ${group.original.id} (${group.original._file})`);
            group.duplicates.forEach(dup => {
                console.log(`      Duplicate: ${dup.issue.id} (${dup.issue._file}) - Score: ${dup.score.toFixed(3)}`);
            });
        });
    } else {
        console.log('✅ No duplicates found');
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    loadIssues,
    findDuplicates,
    generateDuplicateReport,
    suggestMergeActions
};
