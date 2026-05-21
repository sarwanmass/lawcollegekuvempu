/**
 * Rashtrakavi Kuvempu Law College - Dynamic Website Logic
 * Handles interactive tabs, live searches, responsive menu toggles, and premium theme switching.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. THEME SWITCHING (Sleek Dark Mode / Elegant Light Mode)
    // ---------------------------------------------------------
    const themeBtn = document.getElementById('theme-btn');
    const root = document.documentElement;
    
    // Check local storage for preference, default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add a smooth transition class momentarily to avoid flash of raw layout
        root.style.setProperty('transition', 'background-color 0.4s ease, color 0.4s ease');
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        setTimeout(() => {
            root.style.removeProperty('transition');
        }, 400);
    });

    function updateThemeIcon(theme) {
        const icon = themeBtn.querySelector('i');
        if (theme === 'light') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // ---------------------------------------------------------
    // 2. MOBILE NAVIGATION DRAWER
    // ---------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
            
            // Set active class visually immediately on click
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // ---------------------------------------------------------
    // 3. ACTIVE NAV LINK ON SCROLL (Intersection Observer)
    // ---------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies mid viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // ---------------------------------------------------------
    // 4. STATUTORY COMMITTEES TAB SWITCHER
    // ---------------------------------------------------------
    window.showCommittee = function(committeeId, buttonElement) {
        // Remove active class from all committee panels
        const panels = document.querySelectorAll('.committee-panel');
        panels.forEach(panel => panel.classList.remove('active'));

        // Remove active class from all committee sidebar buttons
        const buttons = document.querySelectorAll('.committee-btn');
        buttons.forEach(btn => btn.classList.remove('active'));

        // Activate matching panel & button
        const targetPanel = document.getElementById(committeeId);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
        if (buttonElement) {
            buttonElement.classList.add('active');
        }

        // Smooth scroll display panel into view on mobile devices
        if (window.innerWidth <= 992) {
            document.querySelector('.committees-display-panel').scrollIntoView({ behavior: 'smooth' });
        }
    };

    // ---------------------------------------------------------
    // 8. ADMISSIONS ENQUIRY FORM HANDLER
    // ---------------------------------------------------------
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('enquiry-name').value.trim();
            const email = document.getElementById('enquiry-email').value.trim();
            const phone = document.getElementById('enquiry-phone').value.trim();
            const category = document.getElementById('enquiry-category').value;
            const marks = document.getElementById('enquiry-marks').value.trim();
            const message = document.getElementById('enquiry-message').value.trim();
            
            if (!name || !email || !phone || !marks) {
                alert('Please fill out all required fields.');
                return;
            }
            
            const newEnquiry = {
                timestamp: new Date().toLocaleString(),
                name,
                email,
                phone,
                category,
                marks,
                message
            };
            
            // Save to localStorage
            const existingEnquiries = JSON.parse(localStorage.getItem('admissions_enquiries') || '[]');
            existingEnquiries.push(newEnquiry);
            localStorage.setItem('admissions_enquiries', JSON.stringify(existingEnquiries));
            
            // Show Success Alert
            showSuccessNotification();
            
            // Reset form
            enquiryForm.reset();
        });
    }

    function showSuccessNotification() {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '30px';
        notification.style.right = '30px';
        notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        notification.style.color = '#ffffff';
        notification.style.padding = '16px 24px';
        notification.style.borderRadius = '12px';
        notification.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
        notification.style.zIndex = '9999';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '12px';
        notification.style.fontFamily = 'var(--font-body)';
        notification.style.fontSize = '0.95rem';
        notification.style.fontWeight = '600';
        notification.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        
        notification.innerHTML = `
            <i class="fas fa-circle-check" style="font-size: 1.2rem;"></i>
            <div>
                <div style="font-weight: 700; margin-bottom: 2px;">Enquiry Submitted!</div>
                <div style="font-weight: 400; font-size: 0.85rem; opacity: 0.9;">Counseling desk will connect shortly.</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateY(30px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 400);
        }, 5000);
    }
});

// ---------------------------------------------------------
// 5. BANNER REMOVAL
// ---------------------------------------------------------
window.closeBanner = function() {
    const banner = document.getElementById('banner-notification');
    if (banner) {
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 400);
    }
};

// ---------------------------------------------------------
// 6. FACULTY LIVE SEARCH & CATEGORY FILTERING
// ---------------------------------------------------------
let currentFacultyFilter = 'all';

window.filterFaculty = function(category) {
    currentFacultyFilter = category;
    
    // Update active tab styles
    const tabs = document.querySelectorAll('.faculty-tabs .tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (category === 'all' && tab.textContent.includes('All')) tab.classList.add('active');
        if (category === 'teaching' && tab.textContent.includes('Teaching')) tab.classList.add('active');
        if (category === 'non-teaching' && tab.textContent.includes('Non-Teaching')) tab.classList.add('active');
    });

    applyFacultySearchAndFilter();
};

window.searchFaculties = function() {
    applyFacultySearchAndFilter();
};

function applyFacultySearchAndFilter() {
    const query = document.getElementById('faculty-search').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.faculty-card');
    
    cards.forEach(card => {
        const name = card.querySelector('.fac-name')?.textContent.toLowerCase() || '';
        const qual = card.querySelector('.fac-qual')?.textContent.toLowerCase() || '';
        const role = card.querySelector('.badge-role')?.textContent.toLowerCase() || '';
        const isTeaching = card.classList.contains('teaching');
        const isNonTeaching = card.classList.contains('non-teaching');

        // Check if card matches category filter
        let matchesCategory = false;
        if (currentFacultyFilter === 'all') {
            matchesCategory = true;
        } else if (currentFacultyFilter === 'teaching' && isTeaching) {
            matchesCategory = true;
        } else if (currentFacultyFilter === 'non-teaching' && isNonTeaching) {
            matchesCategory = true;
        }

        // Check if card matches search text query
        const matchesSearch = name.includes(query) || qual.includes(query) || role.includes(query);

        // Display or hide card based on evaluation
        if (matchesCategory && matchesSearch) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// ---------------------------------------------------------
// 7. STUDENT CODE OF CONDUCT LIVE KEYWORD FILTERING
// ---------------------------------------------------------
window.filterConductRules = function() {
    const query = document.getElementById('conduct-search').value.toLowerCase().trim();
    const rules = document.querySelectorAll('.rule-card');

    rules.forEach(rule => {
        const keywords = rule.getAttribute('data-keywords').toLowerCase();
        const text = rule.querySelector('.rule-content').textContent.toLowerCase();

        if (keywords.includes(query) || text.includes(query)) {
            rule.style.display = 'flex';
            rule.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
            rule.style.display = 'none';
        }
    });
};

// ---------------------------------------------------------
// 9. EXCEL COMPATIBLE CSV DOWNLOADER
// ---------------------------------------------------------
window.downloadEnquiriesCSV = function() {
    const enquiries = JSON.parse(localStorage.getItem('admissions_enquiries') || '[]');
    if (enquiries.length === 0) {
        alert('No enquiries submitted yet.');
        return;
    }
    
    // Construct CSV headers and rows
    const headers = ['Timestamp', 'Full Name', 'Email Address', 'Phone Number', 'Caste Category', 'UG Graduation %', 'Message'];
    const csvRows = [headers.join(',')];
    
    enquiries.forEach(eq => {
        const row = [
            `"${eq.timestamp || ''}"`,
            `"${(eq.name || '').replace(/"/g, '""')}"`,
            `"${(eq.email || '').replace(/"/g, '""')}"`,
            `"${(eq.phone || '').replace(/"/g, '""')}"`,
            `"${(eq.category || '').replace(/"/g, '""')}"`,
            `"${eq.marks || ''}"`,
            `"${(eq.message || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
    });
    
    // Add BOM for Microsoft Excel compatibility
    const blob = new Blob(["\ufeff" + csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Admissions_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// ---------------------------------------------------------
// 10. DYNAMIC FILE DOWNLOADS MOCK GENERATOR
// ---------------------------------------------------------
window.downloadMockFile = function(fileName, docTitle) {
    let content = "";
    if (fileName.includes("brochure") || fileName.includes("syllabus")) {
        content = `%PDF-1.4\n%âãÏÓ\n` +
            `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
            `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
            `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.275 841.889] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n` +
            `4 0 obj\n<< /Length 300 >>\nstream\n` +
            `BT\n/F1 18 Tf\n50 800 Td\n(RASHTRAKAVI KUVEMPU COLLEGE OF LAW) Tj\n` +
            `/F1 11 Tf\n0 -30 Td\n(Rashtrakavi Kuvempu Education Cultural and charitable Trust R., Bengaluru) Tj\n` +
            `0 -25 Td\n(Official Academic Document: ${docTitle}) Tj\n` +
            `0 -35 Td\n(------------------------------------------------------------------------) Tj\n` +
            `0 -25 Td\n(IMPORTANT DISCLAIMER:) Tj\n` +
            `0 -15 Td\n(Affiliation from Karnataka State Law University, Hubballi, Karnataka and) Tj\n` +
            `0 -15 Td\n(approval from the Bar Council of India, New Delhi are currently pending.) Tj\n` +
            `0 -35 Td\n(Official Registry Address:) Tj\n` +
            `0 -15 Td\n(No.10, Near Janapriya Apartment, Kadabagere, Bangalore - 562130) Tj\n` +
            `0 -25 Td\n(Principal Desk Helpline: +91 9916246833) Tj\n` +
            `0 -15 Td\n(Email Contact: murthyguru1987@gmail.com) Tj\n` +
            `ET\nendstream\nendobj\n` +
            `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n` +
            `xref\n0 6\n0000000000 65535 f\n0000000015 00000 n\n0000000068 00000 n\n0000000129 00000 n\n0000000262 00000 n\n0000000612 00000 n\n` +
            `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n692\n%%EOF`;
    } else {
        // Previous Year Board Question Exam Paper Mock
        content = `%PDF-1.4\n%âãÏÓ\n` +
            `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
            `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
            `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.275 841.889] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n` +
            `4 0 obj\n<< /Length 380 >>\nstream\n` +
            `BT\n/F1 16 Tf\n50 800 Td\n(KARNATAKA STATE LAW UNIVERSITY, HUBBALLI) Tj\n` +
            `/F1 11 Tf\n0 -25 Td\n(Rashtrakavi Kuvempu College of Law - Previous Year Question Bank) Tj\n` +
            `0 -25 Td\n(Course: 3-Year LL.B  |  Subject: ${docTitle}) Tj\n` +
            `0 -20 Td\n(Duration: 3 Hours  |  Maximum Marks: 100) Tj\n` +
            `0 -30 Td\n(------------------------------------------------------------------------) Tj\n` +
            `0 -20 Td\n(INSTRUCTIONS: Answer any FIVE full questions. All questions carry equal marks.) Tj\n` +
            `0 -30 Td\n(Q1. Explain the definition, nature and scope of the subject in detail.) Tj\n` +
            `0 -20 Td\n(Q2. Analyze the key judicial precedents and statutory frameworks that apply.) Tj\n` +
            `0 -20 Td\n(Q3. Discuss the rights, liabilities, remedies and duties under this paper.) Tj\n` +
            `0 -20 Td\n(Q4. Elaborate on the leading cases decided by the Hon'ble Supreme Court.) Tj\n` +
            `0 -20 Td\n(Q5. Write critical explanatory notes on any two of the short sub-concepts.) Tj\n` +
            `ET\nendstream\nendobj\n` +
            `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n` +
            `xref\n0 6\n0000000000 65535 f\n0000000015 00000 n\n0000000068 00000 n\n0000000129 00000 n\n0000000262 00000 n\n0000000692 00000 n\n` +
            `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n772\n%%EOF`;
    }
    
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Fire a subtle success toast
    showDownloadSuccessToast(fileName);
};

function showDownloadSuccessToast(fileName) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '30px';
    notification.style.right = '30px';
    notification.style.background = 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-hover) 100%)';
    notification.style.color = '#0a0f1d';
    notification.style.padding = '16px 24px';
    notification.style.borderRadius = '12px';
    notification.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.25)';
    notification.style.zIndex = '9999';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '12px';
    notification.style.fontFamily = 'var(--font-body)';
    notification.style.fontSize = '0.95rem';
    notification.style.fontWeight = '600';
    notification.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    notification.style.transform = 'translateY(100px)';
    notification.style.opacity = '0';
    
    notification.innerHTML = `
        <i class="fas fa-file-circle-check" style="font-size: 1.2rem;"></i>
        <div>
            <div style="font-weight: 700; margin-bottom: 2px;">Download Started!</div>
            <div style="font-weight: 400; font-size: 0.85rem; opacity: 0.85;">${fileName} compiled successfully.</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(30px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 400);
    }, 4000);
}

// ---------------------------------------------------------
// 11. TIMELINE ALERTS EXPANSION & CATEGORY FILTERING
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Accordion Expansion
    const timelineCards = document.querySelectorAll('.timeline-card');
    timelineCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent drawer toggle if clicking a button inside it
            if (e.target.closest('a') || e.target.closest('button')) return;
            
            // Toggle active class
            card.classList.toggle('active');
            
            // Expand layout
            const details = card.querySelector('.timeline-details');
            if (card.classList.contains('active')) {
                details.style.maxHeight = details.scrollHeight + 32 + 'px'; // include padding
            } else {
                details.style.maxHeight = '0';
            }
        });
    });
});

let currentTimelineFilter = 'all';
window.filterTimelineCategory = function(category, buttonElement) {
    currentTimelineFilter = category;
    
    // Update active filter button classes
    const buttons = document.querySelectorAll('.timeline-filters .tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
    
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });
};

// ---------------------------------------------------------
// 12. ADMINISTRATIVE DATABASE LEDGER DASHBOARD DESK
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('admin-ledger-table-body') || document.getElementById('admin-login-section')) {
        checkAdminAuthentication();
    }
});

window.checkAdminAuthentication = function() {
    const loginSection = document.getElementById('admin-login-section');
    const securedContent = document.getElementById('admin-secured-content');
    if (!loginSection || !securedContent) return;

    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    if (isAuthenticated) {
        loginSection.style.display = 'none';
        securedContent.style.display = 'block';
        loadAdminLedger();
    } else {
        loginSection.style.display = 'flex';
        securedContent.style.display = 'none';
    }
};

window.authenticateAdmin = function(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('admin-password');
    const errorEl = document.getElementById('login-error');
    const loginCard = document.querySelector('.login-card');
    if (!passwordInput) return;

    const password = passwordInput.value.trim();
    if (password === 'rklc@admin2026' || password === 'admin123') {
        if (errorEl) errorEl.style.display = 'none';
        sessionStorage.setItem('admin_authenticated', 'true');
        
        // Premium transition effect
        const loginSection = document.getElementById('admin-login-section');
        loginSection.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        loginSection.style.opacity = '0';
        loginSection.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            checkAdminAuthentication();
            loginSection.style.opacity = '1';
            loginSection.style.transform = 'scale(1)';
        }, 400);
    } else {
        if (errorEl) {
            errorEl.style.display = 'flex';
        }
        if (loginCard) {
            loginCard.classList.remove('shake');
            void loginCard.offsetWidth; // Trigger reflow
            loginCard.classList.add('shake');
        }
        passwordInput.value = '';
        passwordInput.focus();
    }
};

window.logoutAdmin = function() {
    if (confirm("Are you sure you want to log out of the Admissions Desk?")) {
        sessionStorage.removeItem('admin_authenticated');
        window.location.reload();
    }
};

window.loadAdminLedger = function() {
    const tableBody = document.getElementById('admin-ledger-table-body');
    if (!tableBody) return;
    
    const enquiries = JSON.parse(localStorage.getItem('admissions_enquiries') || '[]');
    
    // Render Stats Metrics
    document.getElementById('stat-total-enquiries').textContent = enquiries.length;
    
    // Caste Categories Breakdown
    let scCount = 0, stCount = 0, obcCount = 0, gmCount = 0;
    let highMeritCount = 0; // percentage > 60%
    
    enquiries.forEach(eq => {
        const cat = eq.category || 'General';
        if (cat.includes('SC')) scCount++;
        else if (cat.includes('ST')) stCount++;
        else if (cat.includes('OBC')) obcCount++;
        else gmCount++;
        
        const m = parseFloat(eq.marks) || 0;
        if (m >= 60) highMeritCount++;
    });
    
    document.getElementById('stat-sc-st-enquiries').textContent = `${scCount + stCount} candidates`;
    document.getElementById('stat-high-merit').textContent = `${highMeritCount} merit entries`;
    
    if (enquiries.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="admin-table-empty">
                    <i class="fas fa-database"></i>
                    <h3>Admissions Ledger Empty</h3>
                    <p>No admission enquiries have been submitted on index or course pages yet.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort enquiries - newest first
    enquiries.reverse();
    
    tableBody.innerHTML = '';
    enquiries.forEach((eq, index) => {
        const row = document.createElement('tr');
        row.className = 'admin-record-row';
        row.innerHTML = `
            <td style="font-weight: 600; font-size: 0.85rem; white-space: nowrap;">
                <i class="fas fa-calendar-day" style="color: var(--accent-gold); margin-right: 6px;"></i> ${eq.timestamp || 'N/A'}
            </td>
            <td style="font-weight: 700; color: var(--text-primary);"><i class="fas fa-user-tie" style="color: var(--accent-cyan); margin-right: 6px;"></i> ${escapeHtml(eq.name || '')}</td>
            <td><a href="mailto:${eq.email}" style="color: var(--accent-cyan); font-weight: 500;"><i class="fas fa-envelope" style="margin-right: 6px;"></i> ${escapeHtml(eq.email || '')}</a></td>
            <td style="font-weight: 600;"><i class="fas fa-phone" style="color: var(--color-success); margin-right: 6px;"></i> ${escapeHtml(eq.phone || '')}</td>
            <td>
                <span class="badge ${eq.category === 'General' ? 'badge-info' : 'badge-warning'}">${escapeHtml(eq.category || 'General')}</span>
            </td>
            <td style="font-weight: 700; color: var(--accent-gold); font-size: 1rem;">
                <i class="fas fa-chart-line" style="margin-right: 6px;"></i> ${eq.marks || '0'}%
            </td>
            <td style="font-size: 0.85rem; color: var(--text-secondary); max-width: 250px;">
                ${escapeHtml(eq.message || 'No custom message.')}
            </td>
        `;
        tableBody.appendChild(row);
    });
};

window.filterAdminTable = function() {
    const query = document.getElementById('admin-search').value.toLowerCase().trim();
    const catFilter = document.getElementById('admin-category-filter').value;
    const rows = document.querySelectorAll('.admin-record-row');
    
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        if (cells.length < 6) return;
        
        const timestamp = cells[0].textContent.toLowerCase();
        const name = cells[1].textContent.toLowerCase();
        const email = cells[2].textContent.toLowerCase();
        const phone = cells[3].textContent.toLowerCase();
        const category = cells[4].textContent.trim();
        const marks = cells[5].textContent.toLowerCase();
        const message = cells[6].textContent.toLowerCase();
        
        const matchesQuery = name.includes(query) || email.includes(query) || phone.includes(query) || message.includes(query) || marks.includes(query);
        const matchesCategory = catFilter === 'all' || category.includes(catFilter);
        
        if (matchesQuery && matchesCategory) {
            row.style.display = 'table-row';
            row.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
            row.style.display = 'none';
        }
    });
};

window.purgeEnquiriesDatabase = function() {
    if (confirm("CRITICAL WARNING:\n\nAre you sure you want to purge all admission enquiries? This action is permanent and cannot be undone. Please download the Excel CSV backup first!")) {
        localStorage.removeItem('admissions_enquiries');
        showSuccessNotificationPurge();
        loadAdminLedger();
    }
};

function showSuccessNotificationPurge() {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '30px';
    notification.style.right = '30px';
    notification.style.background = 'linear-gradient(135deg, var(--color-error) 0%, #b91c1c 100%)';
    notification.style.color = '#ffffff';
    notification.style.padding = '16px 24px';
    notification.style.borderRadius = '12px';
    notification.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.3)';
    notification.style.zIndex = '9999';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '12px';
    notification.style.fontFamily = 'var(--font-body)';
    notification.style.fontSize = '0.95rem';
    notification.style.fontWeight = '600';
    notification.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    notification.style.transform = 'translateY(100px)';
    notification.style.opacity = '0';
    
    notification.innerHTML = `
        <i class="fas fa-trash-can" style="font-size: 1.2rem;"></i>
        <div>
            <div style="font-weight: 700; margin-bottom: 2px;">Database Purged!</div>
            <div style="font-weight: 400; font-size: 0.85rem; opacity: 0.9;">All admissions enquiries deleted.</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(30px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 400);
    }, 4000);
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ---------------------------------------------------------
// 13. AUTOMATIC STAGGERED ENTRANCE ANIMATIONS
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Selectors to automatically apply scroll animation
    const animateSelectors = [
        '.glass-card',
        '.council-card',
        '.faculty-card',
        '.download-card',
        '.rule-card',
        '.timeline-item',
        '.section-header',
        '.president-image-wrapper',
        '.president-message-content',
        '.library-collection-card',
        '.gallery-item',
        '.enquiry-info-card',
        '.enquiry-form-card',
        '.admission-requirements',
        '.faculty-profile-grid > div',
        '.statutory-dashboard-grid > div'
    ];

    // Select all matching elements and add animation class
    animateSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('animate-on-scroll');
        });
    });

    // Stagger animation for grid layouts
    const grids = [
        '.council-grid',
        '.faculty-grid',
        '.downloads-grid',
        '.library-grid',
        '.gallery-grid',
        '.features-grid',
        '.form-group-grid',
        '.library-stats-grid'
    ];

    grids.forEach(gridSelector => {
        document.querySelectorAll(gridSelector).forEach(grid => {
            const children = Array.from(grid.children);
            children.forEach((child, index) => {
                child.classList.add('animate-on-scroll');
                // Apply stagger delay (up to 8 elements)
                const delay = (index % 8) * 80;
                if (delay > 0) {
                    child.style.transitionDelay = `${delay}ms`;
                }
            });
        });
    });

    // Initialize IntersectionObserver
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window && scrollElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -8% 0px', // Trigger when 8% in view
            threshold: 0.02
        });
        
        scrollElements.forEach(el => scrollObserver.observe(el));
    } else {
        // Fallback for older browsers
        scrollElements.forEach(el => el.classList.add('animated'));
    }

    // Hidden Administrative Gate (Easter Egg)
    // Clicking the copyright symbol in the footer redirects to the admin page
    const adminGates = document.querySelectorAll('.admin-gate');
    adminGates.forEach(gate => {
        gate.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    });

    // -----------------------------------------------------------------
    // 12. DYNAMIC MOBILE PORTAL INJECTION & RESPONSIVE MENU CLARITY
    // -----------------------------------------------------------------
    const mobileNavMenu = document.getElementById('nav-menu');
    if (mobileNavMenu) {
        if (!document.querySelector('.mobile-portal-wrapper')) {
            const portalWrapper = document.createElement('div');
            portalWrapper.className = 'mobile-portal-wrapper';
            portalWrapper.innerHTML = `
                <a href="conduct.html" class="mobile-portal-btn">
                    Student Portal
                </a>
            `;
            mobileNavMenu.appendChild(portalWrapper);
        }
    }

    // -----------------------------------------------------------------
    // 13. IMMERSIVE HERO BACKGROUND IMAGE SLIDER (HOME PAGE)
    // -----------------------------------------------------------------
    const heroEl = document.getElementById('hero');
    const heroSliderEl = document.querySelector('.hero-slider');

    if (heroEl && heroSliderEl) {
        const heroSlides = document.querySelectorAll('.hero-slide');
        const heroDots = document.querySelectorAll('.slider-dot');
        let activeSlideIdx = 0;
        let heroSliderTimer;

        function renderSlide(index) {
            if (index >= heroSlides.length) {
                activeSlideIdx = 0;
            } else if (index < 0) {
                activeSlideIdx = heroSlides.length - 1;
            } else {
                activeSlideIdx = index;
            }

            heroSlides.forEach(slide => slide.classList.remove('active'));
            heroDots.forEach(dot => dot.classList.remove('active'));

            heroSlides[activeSlideIdx].classList.add('active');
            if (heroDots[activeSlideIdx]) {
                heroDots[activeSlideIdx].classList.add('active');
            }
        }

        window.moveHeroSlide = function(direction) {
            restartHeroSliderTimer();
            renderSlide(activeSlideIdx + direction);
        };

        window.setHeroSlide = function(index) {
            restartHeroSliderTimer();
            renderSlide(index);
        };

        function startHeroSliderTimer() {
            heroSliderTimer = setInterval(() => {
                renderSlide(activeSlideIdx + 1);
            }, 5000);
        }

        function restartHeroSliderTimer() {
            clearInterval(heroSliderTimer);
            startHeroSliderTimer();
        }

        // Initialize Timer
        startHeroSliderTimer();
    }
});
