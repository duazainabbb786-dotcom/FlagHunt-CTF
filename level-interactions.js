// FlagHunt Level Interactions
// Handles AttackBox, Help, Save Room, and Options functionality

document.addEventListener('DOMContentLoaded', () => {
    initializeLevelInteractions();
});

function initializeLevelInteractions() {
    // Start AttackBox Button
    const attackBoxBtn = document.querySelector('.btn-attackbox');
    if (attackBoxBtn) {
        attackBoxBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startAttackBox();
        });
    }

    // Help Button with Dropdown
    const helpBtn = document.querySelector('.btn-help');
    const helpDropdown = document.querySelector('.help-dropdown');
    if (helpBtn && helpDropdown) {
        helpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            helpDropdown.classList.toggle('active');
            // Close other dropdowns
            closeOptionsDropdown();
        });
    }

    // Save Room Button
    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSaveRoom(saveBtn);
        });
    }

    // Options Button with Dropdown
    const optionsBtn = document.querySelector('.btn-options');
    const optionsDropdown = document.querySelector('.options-dropdown');
    if (optionsBtn && optionsDropdown) {
        optionsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            optionsDropdown.classList.toggle('active');
            // Close other dropdowns
            closeHelpDropdown();
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-help') && !e.target.closest('.help-dropdown')) {
            closeHelpDropdown();
        }
        if (!e.target.closest('.btn-options') && !e.target.closest('.options-dropdown')) {
            closeOptionsDropdown();
        }
    });

    // Check if room is already saved
    checkSavedStatus();
}

// Start AttackBox
function startAttackBox() {
    const modal = document.querySelector('#attackbox-modal');
    const overlay = document.querySelector('.modal-overlay');
    const progressBar = document.querySelector('#attackbox-progress');
    const statusText = document.querySelector('#attackbox-status');
    const attackBoxBtn = document.querySelector('.btn-attackbox');

    if (!modal || !overlay) return;

    modal.classList.add('active');
    overlay.classList.add('active');

    // Simulate deployment
    let progress = 0;
    statusText.textContent = 'Deploying AttackBox...';
    progressBar.style.width = '0%';

    const interval = setInterval(() => {
        progress += 8;
        progressBar.style.width = progress + '%';

        if (progress === 24) {
            statusText.textContent = 'Loading Kali Linux environment...';
        } else if (progress === 48) {
            statusText.textContent = 'Configuring network interface...';
        } else if (progress === 72) {
            statusText.textContent = 'Installing tools...';
        } else if (progress === 96) {
            statusText.textContent = 'Finalizing setup...';
        } else if (progress >= 100) {
            statusText.textContent = '✓ AttackBox is ready!';
            statusText.style.color = 'var(--success)';

            // Update button
            if (attackBoxBtn) {
                attackBoxBtn.innerHTML = '<i class="fas fa-check-circle"></i> AttackBox Running';
                attackBoxBtn.style.background = 'linear-gradient(135deg, var(--success), #2eb82e)';
            }

            clearInterval(interval);

            // Auto-close after 2 seconds
            setTimeout(() => {
                closeModal('attackbox-modal');
            }, 2000);
        }
    }, 250);
}

// Toggle Save Room
function toggleSaveRoom(button) {
    const roomId = 'flaghunt-training'; // Can be dynamic based on page
    const savedRooms = JSON.parse(localStorage.getItem('savedRooms') || '[]');

    if (savedRooms.includes(roomId)) {
        // Unsave
        const index = savedRooms.indexOf(roomId);
        savedRooms.splice(index, 1);
        localStorage.setItem('savedRooms', JSON.stringify(savedRooms));

        button.innerHTML = '<i class="far fa-bookmark"></i> Save Room';
        button.classList.remove('saved');
        showNotification('Room removed from saved list', 'info');
    } else {
        // Save
        savedRooms.push(roomId);
        localStorage.setItem('savedRooms', JSON.stringify(savedRooms));

        button.innerHTML = '<i class="fas fa-bookmark"></i> Room Saved';
        button.classList.add('saved');
        showNotification('Room saved successfully!', 'success');
    }
}

// Check saved status on load
function checkSavedStatus() {
    const saveBtn = document.querySelector('.btn-save');
    if (!saveBtn) return;

    const roomId = 'flaghunt-training';
    const savedRooms = JSON.parse(localStorage.getItem('savedRooms') || '[]');

    if (savedRooms.includes(roomId)) {
        saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Room Saved';
        saveBtn.classList.add('saved');
    }
}

// Helper functions
function closeHelpDropdown() {
    const helpDropdown = document.querySelector('.help-dropdown');
    if (helpDropdown) {
        helpDropdown.classList.remove('active');
    }
}

function closeOptionsDropdown() {
    const optionsDropdown = document.querySelector('.options-dropdown');
    if (optionsDropdown) {
        optionsDropdown.classList.remove('active');
    }
}

function closeModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    const overlay = document.querySelector('.modal-overlay');

    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--primary);
        border-radius: 8px;
        padding: 15px 20px;
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(157, 78, 221, 0.5);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    if (type === 'success') {
        notification.style.borderColor = 'var(--success)';
        notification.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success); margin-right: 10px;"></i>${message}`;
    } else if (type === 'info') {
        notification.style.borderColor = 'var(--accent)';
        notification.innerHTML = `<i class="fas fa-info-circle" style="color: var(--accent); margin-right: 10px;"></i>${message}`;
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Help dropdown actions
function showHints() {
    alert('💡 Hints:\n\n1. Start with the beginner levels\n2. Read the challenge descriptions carefully\n3. Use the terminal to explore\n4. Check the guides section for help');
    closeHelpDropdown();
}

function showWalkthrough() {
    alert('📖 Walkthrough:\n\nDetailed walkthroughs are available for premium members.\n\nUpgrade to Premium to access step-by-step solutions!');
    closeHelpDropdown();
}

function reportIssue() {
    const issue = prompt('Please describe the issue you encountered:');
    if (issue) {
        showNotification('Issue reported. Thank you for your feedback!', 'success');
    }
    closeHelpDropdown();
}

// Options dropdown actions
function resetProgress() {
    if (confirm('Are you sure you want to reset your progress for this room? This action cannot be undone.')) {
        // Clear progress for this room
        const roomId = 'flaghunt-training';
        const progress = JSON.parse(localStorage.getItem('levelProgress') || '{}');
        delete progress[roomId];
        localStorage.setItem('levelProgress', JSON.stringify(progress));

        showNotification('Progress reset successfully', 'info');

        // Reload page
        setTimeout(() => location.reload(), 1500);
    }
    closeOptionsDropdown();
}

function downloadResources() {
    showNotification('Preparing download...', 'info');

    setTimeout(() => {
        alert('📥 Resources:\n\n• Challenge Files: flaghunt-challenges.zip\n• Tools: kali-tools.zip\n• Cheat Sheets: security-cheatsheets.pdf\n\nDownload links have been sent to your email!');
    }, 1000);

    closeOptionsDropdown();
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    
    .help-dropdown, .options-dropdown {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 5px;
        background: var(--bg-card);
        border: 1px solid var(--primary);
        border-radius: 8px;
        min-width: 200px;
        box-shadow: 0 8px 20px rgba(157, 78, 221, 0.4);
        z-index: 1000;
    }
    
    .help-dropdown.active, .options-dropdown.active {
        display: block;
        animation: slideDown 0.3s ease;
    }
    
    .help-dropdown a, .options-dropdown a {
        display: block;
        padding: 12px 16px;
        color: var(--text-muted);
        text-decoration: none;
        border-bottom: 1px solid rgba(157, 78, 221, 0.2);
        transition: all 0.3s;
        cursor: pointer;
    }
    
    .help-dropdown a:last-child, .options-dropdown a:last-child {
        border-bottom: none;
    }
    
    .help-dropdown a:hover, .options-dropdown a:hover {
        background: var(--primary-dark);
        color: white;
        padding-left: 20px;
    }
    
    .btn-save.saved {
        background: linear-gradient(135deg, var(--success), #2eb82e) !important;
        border-color: var(--success) !important;
    }
`;
document.head.appendChild(style);
