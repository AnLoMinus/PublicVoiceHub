// FixCry - Custom JavaScript

// Global variables
let issuesData = [];
let statsData = {};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    loadIssues();
    loadStatistics();
    setupEventListeners();
    setupSmoothScrolling();
}

// Load issues from GitHub API
async function loadIssues() {
    try {
        const response = await fetch('https://api.github.com/repos/AnLoMinus/FixCry/issues?state=open&per_page=10');
        const issues = await response.json();
        
        issuesData = issues;
        displayIssues(issues);
    } catch (error) {
        console.error('Error loading issues:', error);
        displayError('שגיאה בטעינת התיקים. אנא נסה שוב מאוחר יותר.');
    }
}

// Display issues in the UI
function displayIssues(issues) {
    const container = document.getElementById('issues-container');
    
    if (issues.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-inbox text-muted" style="font-size: 3rem;"></i>
                <h4 class="text-muted mt-3">אין תיקים פתוחים כרגע</h4>
                <p class="text-muted">היה הראשון לדווח על בעיה!</p>
            </div>
        `;
        return;
    }
    
    const issuesHTML = issues.map(issue => createIssueCard(issue)).join('');
    container.innerHTML = issuesHTML;
}

// Create issue card HTML
function createIssueCard(issue) {
    const statusClass = getStatusClass(issue.state);
    const priorityClass = getPriorityClass(issue.labels);
    const category = getCategory(issue.labels);
    const createdDate = new Date(issue.created_at).toLocaleDateString('he-IL');
    
    return `
        <div class="card issue-card fade-in">
            <div class="issue-header">
                <div class="d-flex justify-content-between align-items-start">
                    <h5 class="card-title mb-2">
                        <a href="${issue.html_url}" target="_blank" class="text-decoration-none">
                            ${issue.title}
                        </a>
                    </h5>
                    <span class="status-badge ${statusClass}">${getStatusText(issue.state)}</span>
                </div>
                <div class="d-flex flex-wrap gap-2 mb-2">
                    ${category ? `<span class="category-badge bg-primary text-white">${category}</span>` : ''}
                    ${getPriorityBadge(issue.labels)}
                </div>
            </div>
            <div class="issue-body">
                <p class="card-text">${truncateText(issue.body, 200)}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                        <i class="fas fa-calendar me-1"></i>
                        ${createdDate}
                    </small>
                    <small class="text-muted">
                        <i class="fas fa-user me-1"></i>
                        ${issue.user.login}
                    </small>
                </div>
            </div>
            <div class="issue-footer">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex gap-2">
                        <a href="${issue.html_url}" target="_blank" class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-external-link-alt me-1"></i>
                            צפה בתיק
                        </a>
                        <button class="btn btn-sm btn-outline-secondary" onclick="shareIssue('${issue.html_url}', '${issue.title}')">
                            <i class="fas fa-share me-1"></i>
                            שתף
                        </button>
                    </div>
                    <div class="d-flex gap-1">
                        <span class="badge bg-light text-dark">
                            <i class="fas fa-comment me-1"></i>
                            ${issue.comments}
                        </span>
                        <span class="badge bg-light text-dark">
                            <i class="fas fa-tag me-1"></i>
                            ${issue.labels.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load statistics
async function loadStatistics() {
    try {
        const [issuesResponse, contributorsResponse] = await Promise.all([
            fetch('https://api.github.com/repos/AnLoMinus/FixCry/issues?state=all'),
            fetch('https://api.github.com/repos/AnLoMinus/FixCry/contributors')
        ]);
        
        const issues = await issuesResponse.json();
        const contributors = await contributorsResponse.json();
        
        statsData = {
            total: issues.length,
            open: issues.filter(issue => issue.state === 'open').length,
            resolved: issues.filter(issue => issue.state === 'closed').length,
            contributors: contributors.length
        };
        
        updateStatistics();
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Update statistics display
function updateStatistics() {
    document.getElementById('total-issues').textContent = statsData.total || 0;
    document.getElementById('open-issues').textContent = statsData.open || 0;
    document.getElementById('resolved-issues').textContent = statsData.resolved || 0;
    document.getElementById('contributors').textContent = statsData.contributors || 0;
    
    // Animate numbers
    animateNumbers();
}

// Animate number counting
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    numbers.forEach(number => {
        const target = parseInt(number.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            number.textContent = Math.floor(current);
        }, 30);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Report button click
    const reportBtn = document.querySelector('a[href="#report"]');
    if (reportBtn) {
        reportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('report').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Issues button click
    const issuesBtn = document.querySelector('a[href="#issues"]');
    if (issuesBtn) {
        issuesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('issues').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Refresh button (if exists)
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadIssues);
    }
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Utility functions
function getStatusClass(state) {
    switch (state) {
        case 'open': return 'status-open';
        case 'closed': return 'status-closed';
        default: return 'status-open';
    }
}

function getStatusText(state) {
    switch (state) {
        case 'open': return 'פתוח';
        case 'closed': return 'סגור';
        default: return 'פתוח';
    }
}

function getPriorityClass(labels) {
    const urgentLabels = labels.filter(label => 
        label.name.includes('urgent') || label.name.includes('דחוף')
    );
    return urgentLabels.length > 0 ? 'priority-urgent' : 'priority-normal';
}

function getPriorityBadge(labels) {
    const urgentLabels = labels.filter(label => 
        label.name.includes('urgent') || label.name.includes('דחוף')
    );
    
    if (urgentLabels.length > 0) {
        return '<span class="category-badge priority-urgent">דחוף</span>';
    }
    
    const highLabels = labels.filter(label => 
        label.name.includes('high') || label.name.includes('גבוה')
    );
    
    if (highLabels.length > 0) {
        return '<span class="category-badge priority-high">גבוה</span>';
    }
    
    return '<span class="category-badge priority-normal">רגיל</span>';
}

function getCategory(labels) {
    const categoryLabels = labels.filter(label => 
        ['transport', 'health', 'education', 'welfare', 'environment', 'security', 'housing', 'government'].includes(label.name)
    );
    
    if (categoryLabels.length > 0) {
        const categoryMap = {
            'transport': 'תחבורה',
            'health': 'בריאות',
            'education': 'חינוך',
            'welfare': 'רווחה',
            'environment': 'סביבה',
            'security': 'ביטחון',
            'housing': 'דיור',
            'government': 'ממשל'
        };
        return categoryMap[categoryLabels[0].name];
    }
    
    return null;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function displayError(message) {
    const container = document.getElementById('issues-container');
    container.innerHTML = `
        <div class="alert alert-danger text-center">
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
        </div>
    `;
}

// Share issue function
function shareIssue(url, title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'צפה בתיק זה ב-FixCry',
            url: url
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('הקישור הועתק ללוח');
        });
    }
}

// Search functionality (if needed)
function searchIssues(query) {
    if (!query) {
        displayIssues(issuesData);
        return;
    }
    
    const filteredIssues = issuesData.filter(issue => 
        issue.title.toLowerCase().includes(query.toLowerCase()) ||
        issue.body.toLowerCase().includes(query.toLowerCase())
    );
    
    displayIssues(filteredIssues);
}

// Filter by category
function filterByCategory(category) {
    if (!category) {
        displayIssues(issuesData);
        return;
    }
    
    const filteredIssues = issuesData.filter(issue => 
        issue.labels.some(label => label.name === category)
    );
    
    displayIssues(filteredIssues);
}

// Export functions for global access
window.FixCry = {
    loadIssues,
    loadStatistics,
    searchIssues,
    filterByCategory,
    shareIssue
};
