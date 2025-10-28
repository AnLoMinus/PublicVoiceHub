#!/usr/bin/env node

/**
 * FixCry Report Generator
 * Generates various types of reports from issue data
 */

const fs = require('fs');
const path = require('path');

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
                issues.push(data);
            }
        }
    } catch (error) {
        console.error('Error loading issues:', error.message);
        return [];
    }
    
    return issues;
}

/**
 * Filter issues by date range
 */
function filterByDateRange(issues, startDate, endDate) {
    return issues.filter(issue => {
        const issueDate = new Date(issue.submitted_at);
        return issueDate >= startDate && issueDate <= endDate;
    });
}

/**
 * Generate weekly report
 */
function generateWeeklyReport(issues, weekStart) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekIssues = filterByDateRange(issues, weekStart, weekEnd);
    
    // Categorize issues
    const categories = {
        'תחבורה': 0,
        'בריאות': 0,
        'חינוך': 0,
        'רווחה': 0,
        'סביבה': 0,
        'ביטחון': 0,
        'דיור': 0,
        'ממשל': 0
    };
    
    weekIssues.forEach(issue => {
        if (categories.hasOwnProperty(issue.category)) {
            categories[issue.category]++;
        }
    });
    
    // Calculate statistics
    const stats = {
        total_issues: weekIssues.length,
        open_issues: weekIssues.filter(i => i.status === 'open').length,
        resolved_issues: weekIssues.filter(i => i.status === 'resolved' || i.status === 'closed').length,
        urgent_issues: weekIssues.filter(i => i.priority === 'urgent').length,
        categories: categories
    };
    
    // Calculate average resolution time
    const resolvedIssues = weekIssues.filter(i => i.status === 'resolved' || i.status === 'closed');
    if (resolvedIssues.length > 0) {
        const totalTime = resolvedIssues.reduce((sum, issue) => {
            const created = new Date(issue.submitted_at);
            const resolved = new Date(issue.resolution?.implemented_at || issue.history[issue.history.length - 1]?.at);
            return sum + (resolved - created) / (1000 * 60 * 60 * 24); // Convert to days
        }, 0);
        stats.avg_resolution_time_days = totalTime / resolvedIssues.length;
    } else {
        stats.avg_resolution_time_days = 0;
    }
    
    return {
        id: `RPT-${weekStart.toISOString().split('T')[0]}-weekly`,
        type: 'weekly',
        period: {
            start: weekStart.toISOString().split('T')[0],
            end: weekEnd.toISOString().split('T')[0]
        },
        generated_at: new Date().toISOString(),
        generated_by: 'FixCry Report Generator',
        summary: stats,
        top_issues: weekIssues
            .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
            .slice(0, 10)
            .map(issue => ({
                id: issue.id,
                title: issue.title,
                category: issue.category,
                priority: issue.priority,
                status: issue.status,
                created_at: issue.submitted_at
            }))
    };
}

/**
 * Generate monthly report
 */
function generateMonthlyReport(issues, monthStart) {
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setDate(0); // Last day of month
    
    const monthIssues = filterByDateRange(issues, monthStart, monthEnd);
    
    // Generate weekly breakdown
    const weeks = [];
    let currentWeek = new Date(monthStart);
    
    while (currentWeek <= monthEnd) {
        const weekEnd = new Date(currentWeek);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const weekIssues = filterByDateRange(issues, currentWeek, weekEnd);
        
        weeks.push({
            week: currentWeek.toISOString().split('T')[0],
            new_issues: weekIssues.length,
            resolved_issues: weekIssues.filter(i => i.status === 'resolved' || i.status === 'closed').length
        });
        
        currentWeek.setDate(currentWeek.getDate() + 7);
    }
    
    // Calculate statistics
    const stats = {
        total_issues: monthIssues.length,
        open_issues: monthIssues.filter(i => i.status === 'open').length,
        resolved_issues: monthIssues.filter(i => i.status === 'resolved' || i.status === 'closed').length,
        urgent_issues: monthIssues.filter(i => i.priority === 'urgent').length
    };
    
    // Calculate SLA compliance
    const resolvedIssues = monthIssues.filter(i => i.status === 'resolved' || i.status === 'closed');
    const slaCompliant = resolvedIssues.filter(issue => {
        const created = new Date(issue.submitted_at);
        const resolved = new Date(issue.resolution?.implemented_at || issue.history[issue.history.length - 1]?.at);
        const daysToResolve = (resolved - created) / (1000 * 60 * 60 * 24);
        return daysToResolve <= (issue.sla?.target_fix_days || 30);
    });
    
    stats.sla_compliance = resolvedIssues.length > 0 ? 
        (slaCompliant.length / resolvedIssues.length) * 100 : 0;
    
    return {
        id: `RPT-${monthStart.toISOString().split('T')[0]}-monthly`,
        type: 'monthly',
        period: {
            start: monthStart.toISOString().split('T')[0],
            end: monthEnd.toISOString().split('T')[0]
        },
        generated_at: new Date().toISOString(),
        generated_by: 'FixCry Report Generator',
        summary: stats,
        trends: {
            weekly: weeks
        },
        top_issues: monthIssues
            .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
            .slice(0, 20)
            .map(issue => ({
                id: issue.id,
                title: issue.title,
                category: issue.category,
                priority: issue.priority,
                status: issue.status,
                created_at: issue.submitted_at
            }))
    };
}

/**
 * Generate category report
 */
function generateCategoryReport(issues, category) {
    const categoryIssues = issues.filter(issue => issue.category === category);
    
    const stats = {
        total_issues: categoryIssues.length,
        open_issues: categoryIssues.filter(i => i.status === 'open').length,
        resolved_issues: categoryIssues.filter(i => i.status === 'resolved' || i.status === 'closed').length,
        urgent_issues: categoryIssues.filter(i => i.priority === 'urgent').length
    };
    
    // Calculate average resolution time
    const resolvedIssues = categoryIssues.filter(i => i.status === 'resolved' || i.status === 'closed');
    if (resolvedIssues.length > 0) {
        const totalTime = resolvedIssues.reduce((sum, issue) => {
            const created = new Date(issue.submitted_at);
            const resolved = new Date(issue.resolution?.implemented_at || issue.history[issue.history.length - 1]?.at);
            return sum + (resolved - created) / (1000 * 60 * 60 * 24);
        }, 0);
        stats.avg_resolution_time_days = totalTime / resolvedIssues.length;
    } else {
        stats.avg_resolution_time_days = 0;
    }
    
    return {
        id: `RPT-${new Date().toISOString().split('T')[0]}-category-${category}`,
        type: 'category',
        category: category,
        generated_at: new Date().toISOString(),
        generated_by: 'FixCry Report Generator',
        summary: stats,
        issues: categoryIssues.map(issue => ({
            id: issue.id,
            title: issue.title,
            priority: issue.priority,
            status: issue.status,
            created_at: issue.submitted_at,
            location: issue.location
        }))
    };
}

/**
 * Save report to file
 */
function saveReport(report, outputPath) {
    try {
        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
        console.log(`📊 Report saved to: ${outputPath}`);
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
        console.log('Usage: node generate-report.js <type> [options]');
        console.log('');
        console.log('Types:');
        console.log('  weekly [date]     - Generate weekly report');
        console.log('  monthly [date]    - Generate monthly report');
        console.log('  category <name>   - Generate category report');
        console.log('');
        console.log('Options:');
        console.log('  --input <dir>     - Input directory (default: ../../data/issues)');
        console.log('  --output <file>   - Output file (default: auto-generated)');
        console.log('');
        process.exit(1);
    }
    
    const type = args[0];
    const options = {
        input: '../../data/issues',
        output: null
    };
    
    // Parse options
    for (let i = 1; i < args.length; i++) {
        switch (args[i]) {
            case '--input':
                options.input = args[++i];
                break;
            case '--output':
                options.output = args[++i];
                break;
        }
    }
    
    console.log('📊 Generating report...');
    console.log(`📁 Input directory: ${options.input}`);
    
    // Load issues
    const issues = loadIssues(options.input);
    console.log(`📋 Loaded ${issues.length} issues`);
    
    if (issues.length === 0) {
        console.log('❌ No issues found');
        process.exit(1);
    }
    
    let report;
    let outputFile;
    
    switch (type) {
        case 'weekly':
            const weekDate = args[1] ? new Date(args[1]) : new Date();
            weekDate.setDate(weekDate.getDate() - weekDate.getDay()); // Start of week
            
            report = generateWeeklyReport(issues, weekDate);
            outputFile = options.output || `weekly-report-${weekDate.toISOString().split('T')[0]}.json`;
            break;
            
        case 'monthly':
            const monthDate = args[1] ? new Date(args[1]) : new Date();
            monthDate.setDate(1); // Start of month
            
            report = generateMonthlyReport(issues, monthDate);
            outputFile = options.output || `monthly-report-${monthDate.toISOString().split('T')[0]}.json`;
            break;
            
        case 'category':
            if (args.length < 2) {
                console.error('Error: Category name required');
                process.exit(1);
            }
            
            const category = args[1];
            report = generateCategoryReport(issues, category);
            outputFile = options.output || `category-report-${category}-${new Date().toISOString().split('T')[0]}.json`;
            break;
            
        default:
            console.error(`Error: Unknown report type "${type}"`);
            process.exit(1);
    }
    
    // Save report
    saveReport(report, outputFile);
    
    // Print summary
    console.log('\n📊 Report Summary:');
    console.log(`   Type: ${report.type}`);
    console.log(`   Period: ${report.period?.start || 'N/A'} - ${report.period?.end || 'N/A'}`);
    console.log(`   Total Issues: ${report.summary.total_issues}`);
    console.log(`   Open Issues: ${report.summary.open_issues}`);
    console.log(`   Resolved Issues: ${report.summary.resolved_issues}`);
    
    if (report.summary.sla_compliance !== undefined) {
        console.log(`   SLA Compliance: ${report.summary.sla_compliance.toFixed(1)}%`);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    loadIssues,
    generateWeeklyReport,
    generateMonthlyReport,
    generateCategoryReport
};
