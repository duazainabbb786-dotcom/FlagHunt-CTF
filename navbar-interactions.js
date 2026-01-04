// FlagHunt Navbar Interactions
// Handles profile dropdown, notifications, search, and access machines

document.addEventListener('DOMContentLoaded', () => {
    initializeNavbarInteractions();
});

function initializeNavbarInteractions() {
    // Profile Dropdown
    const userProfile = document.querySelector('.user-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');

    if (userProfile && profileDropdown) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
            // Close other panels
            closeNotifications();
            closeSearch();
        });
    }

    // Notifications Panel
    const notificationIcon = document.querySelector('.notification-icon');
    const notificationsPanel = document.querySelector('.notifications-panel');

    if (notificationIcon && notificationsPanel) {
        notificationIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationsPanel.classList.toggle('active');
            // Close other panels
            closeProfileDropdown();
            closeSearch();
        });
    }

    // Search Modal
    const searchIcon = document.querySelector('.search-icon');
    const searchModal = document.querySelector('.search-modal');
    const searchInput = document.querySelector('.search-input');

    if (searchIcon && searchModal) {
        searchIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            searchModal.classList.toggle('active');
            if (searchModal.classList.contains('active')) {
                searchInput.focus();
            }
            // Close other panels
            closeProfileDropdown();
            closeNotifications();
        });
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }

    // Access Machines Button
    const accessMachinesBtn = document.querySelector('.access-machines-btn');
    const machinesModal = document.querySelector('#machines-modal');
    const modalOverlay = document.querySelector('.modal-overlay');

    if (accessMachinesBtn && machinesModal) {
        accessMachinesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showMachinesModal();
        });
    }

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-profile') && !e.target.closest('.profile-dropdown')) {
            closeProfileDropdown();
        }
        if (!e.target.closest('.notification-icon') && !e.target.closest('.notifications-panel')) {
            closeNotifications();
        }
        if (!e.target.closest('.search-icon') && !e.target.closest('.search-modal')) {
            closeSearch();
        }
    });

    // Close modal overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            closeAllModals();
        });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
            closeProfileDropdown();
            closeNotifications();
            closeSearch();
        }
    });
}

// Helper functions
function closeProfileDropdown() {
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown) {
        profileDropdown.classList.remove('active');
    }
}

function closeNotifications() {
    const notificationsPanel = document.querySelector('.notifications-panel');
    if (notificationsPanel) {
        notificationsPanel.classList.remove('active');
    }
}

function closeSearch() {
    const searchModal = document.querySelector('.search-modal');
    if (searchModal) {
        searchModal.classList.remove('active');
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    const overlay = document.querySelector('.modal-overlay');

    modals.forEach(modal => modal.classList.remove('active'));
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Search functionality
function performSearch(query) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    if (query.length < 2) {
        searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">Type to search...</div>';
        return;
    }

    // Search data (can be expanded)
    const searchData = [
        { title: 'Beginner - Identity & Access', type: 'Level', url: 'Levels.html#level-1' },
        { title: 'Intermediate - Web Security', type: 'Level', url: 'Levels.html#level-2' },
        { title: 'Advanced - Security Operations', type: 'Level', url: 'Levels.html#level-3' },
        { title: 'Phishing Awareness', type: 'Quiz', url: 'Phishing-Quiz.html' },
        { title: 'Malware Detection', type: 'Quiz', url: 'Malware-Quiz.html' },
        { title: 'Password Security', type: 'Quiz', url: 'StrongPassword-Quiz.html' },
        { title: 'Web Basics', type: 'Challenge', url: 'WebBasics.html' },
        { title: 'Crypto Challenges', type: 'Challenge', url: 'crypto.html' },
        { title: 'HTML Challenges', type: 'Challenge', url: 'html-level.html' },
        { title: 'System Security Guide', type: 'Guide', url: 'SystemSecurity Guide.html' },
        { title: 'Virus Detection Guide', type: 'Guide', url: 'Virus Detection.html' },
        { title: 'Phishing Guide', type: 'Guide', url: 'Phishing Guide.html' },
        { title: 'Password Safety Guide', type: 'Guide', url: 'Password Safety.html' },
        { title: 'Network Security Guide', type: 'Guide', url: 'Network Security.html' },
        { title: 'Social Media Security', type: 'Guide', url: 'Social Media Security.html' }
    ];

    const results = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
        searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">No results found</div>';
        return;
    }

    searchResults.innerHTML = results.map(result => `
        <div class="search-result-item" onclick="window.location.href='${result.url}'">
            <div style="color: white; font-weight: 600; margin-bottom: 5px;">${result.title}</div>
            <div style="color: var(--text-muted); font-size: 12px;">${result.type}</div>
        </div>
    `).join('');
}

// Access Machines Modal
function showMachinesModal() {
    const modal = document.querySelector('#machines-modal');
    const overlay = document.querySelector('.modal-overlay');
    const progressBar = document.querySelector('#machine-progress');
    const statusText = document.querySelector('#machine-status');

    if (!modal || !overlay) return;

    modal.classList.add('active');
    overlay.classList.add('active');

    // Simulate deployment
    let progress = 0;
    statusText.textContent = 'Initializing virtual machine...';

    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = progress + '%';

        if (progress === 30) {
            statusText.textContent = 'Configuring network...';
        } else if (progress === 60) {
            statusText.textContent = 'Loading environment...';
        } else if (progress === 90) {
            statusText.textContent = 'Almost ready...';
        } else if (progress >= 100) {
            statusText.textContent = '✓ Machine deployed successfully!';
            statusText.style.color = 'var(--success)';
            clearInterval(interval);
        }
    }, 300);
}

// Close modal function
function closeModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    const overlay = document.querySelector('.modal-overlay');

    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// Mark notification as read
function markNotificationRead(element) {
    element.classList.remove('unread');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any stored data
        localStorage.clear();
        // Redirect to home
        window.location.href = 'CyberSecurity Awareness.html';
    }
}
