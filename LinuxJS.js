// ======================== MATRIX RAIN BACKGROUND ========================
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*';
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(2, 4, 6, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 35);

// ======================== FLAG DATA WITH DETAILED INFO ========================
const flags = [
    { id: 1, name: 'Guest Access', code: 'CTF{Gue5t_Acc3ss_Gr4nted}', points: 10,
      desc: 'Found in the guest home directory using `cat user.txt`.<br><br><strong>Learn:</strong> Home directories (~) store user files.<br><strong>Real scenario:</strong> Initial access often reveals user notes or flags.',
      hint: 'cat /home/guest/user.txt' },
    { id: 2, name: 'Bash History', code: 'CTF{H1story_R3v3als_A11}', points: 10,
      desc: 'Hidden in `.bash_history` file.<br><br><strong>Learn:</strong> Hidden files start with "." and store command history.<br><strong>Real scenario:</strong> Admins run sensitive commands — history leaks them.',
      hint: 'cat /home/guest/.bash_history' },
    { id: 3, name: 'System Logs', code: 'CTF{L0gs_D0nt_L13}', points: 15,
      desc: 'Located in `/var/log/syslog`.<br><br><strong>Learn:</strong> System logs record events and errors.<br><strong>Real scenario:</strong> Misconfigured apps sometimes dump secrets into logs.',
      hint: 'cat /var/log/syslog' },
    { id: 4, name: 'Temporary Secret', code: 'CTF{Tmp_F1l3s_Ar3_Risky}', points: 10,
      desc: 'Found in `/tmp` directory.<br><br><strong>Learn:</strong> `/tmp` is world-readable/writable.<br><strong>Real scenario:</strong> Scripts or admins leave sensitive data here temporarily.',
      hint: 'ls -la /tmp && cat /tmp/sticky_note' },
    { id: 5, name: 'Mail Spool', code: 'CTF{Y0u_H4v3_M41l}', points: 10,
      desc: 'Check `/var/spool/mail/guest`.<br><br><strong>Learn:</strong> Local mail spools store user emails.<br><strong>Real scenario:</strong> System alerts or forgotten messages contain credentials.',
      hint: 'cat /var/spool/mail/guest' },
    { id: 6, name: 'Network Config', code: 'CTF{N3tw0rk_M4st3r}', points: 15,
      desc: 'Hidden in comments of `/etc/network/interfaces`.<br><br><strong>Learn:</strong> Config files often have commented-out secrets.<br><strong>Real scenario:</strong> Admins leave internal notes.',
      hint: 'cat /etc/network/interfaces' },
    { id: 7, name: 'Project Chimera', code: 'CTF{Ch1m3ra_P0rt0c0l_Act1vated}', points: 20,
      desc: 'In `/opt/system_secrets/secret_project.conf`.<br><br><strong>Learn:</strong> `/opt` holds third-party or custom software configs.<br><strong>Real scenario:</strong> Poorly secured project files leak keys.',
      hint: 'cat /opt/system_secrets/secret_project.conf' },
    { id: 8, name: 'Binary Analysis', code: 'CTF{B1nary_H1dd3n_Str1ngs}', points: 20,
      desc: 'Embedded in script at `/usr/bin/script.sh`.<br><br><strong>Learn:</strong> Scripts may contain hardcoded secrets.<br><strong>Real scenario:</strong> Developers forget to remove debug flags.',
      hint: 'cat /usr/bin/script.sh' },
    { id: 9, name: 'Backup Shadow', code: 'CTF{B4ckup_F41lur3}', points: 25,
      desc: 'Forgotten backup at `/etc/backups/shadow.bak`.<br><br><strong>Learn:</strong> Old backups often have weak permissions.<br><strong>Real scenario:</strong> Exposed password hashes = privilege escalation.',
      hint: 'cat /etc/backups/shadow.bak' },
    { id: 10, name: 'Root Privilege', code: 'CTF{R00t_Acc3ss_Is_M1n3}', points: 50,
      desc: 'Ultimate flag in `/root/root.txt`.<br><br><strong>Learn:</strong> Use `su root` with leaked password to escalate.<br><strong>Real scenario:</strong> Weak or reused passwords allow full compromise.',
      hint: 'su root → password: admin_pass_2025 → cat /root/root.txt' }
];

// ======================== FILESYSTEM (unchanged) ========================
const fs = {
    'home': {
        type: 'dir',
        children: {
            'guest': {
                type: 'dir',
                children: {
                    'user.txt': { type: 'file', content: "FLAG: CTF{Gue5t_Acc3ss_Gr4nted}" },
                    '.bash_history': { type: 'file', content: "cd /var/www\nls -la\n# FLAG: CTF{H1story_R3v3als_A11}\nexit" }
                }
            }
        }
    },
    'var': {
        type: 'dir', children: {
            'log': { type: 'dir', children: { 'syslog': { type: 'file', content: "SYSTEM_REPORT: Critical failure at unit 4.\nCRON: FLAG: CTF{L0gs_D0nt_L13} detected in memory dump." } } },
            'spool': { type: 'dir', children: { 'mail': { type: 'dir', children: { 'guest': { type: 'file', content: "From: system-admin@neoncorp.local\nSubject: Security Alert\n\nFLAG: CTF{Y0u_H4v3_M41l}\nPlease rotate your guest keys immediately." } } } } }
        }
    },
    'tmp': { type: 'dir', children: { 'sticky_note': { type: 'file', content: "TODO: Remind admin to patch the shadow backup vulnerability.\nFLAG: CTF{Tmp_F1l3s_Ar3_Risky}" } } },
    'etc': {
        type: 'dir', children: {
            'network': { type: 'dir', children: { 'interfaces': { type: 'file', content: "iface eth0 inet static\naddress 192.168.1.50\n# INTERNAL_SEC_CODE: CTF{N3tw0rk_M4st3r}" } } },
            'backups': { type: 'dir', children: { 'shadow.bak': { type: 'file', content: "root:$6$vT9UqZ1m$bGrW...:19000:0:99999:7:::\n# BACKUP_FLAG: CTF{B4ckup_F41lur3}" } } },
            'passwd': { type: 'file', content: "root:x:0:0:root:/root:/bin/bash\nguest:x:1000:1000:guest:/home/guest:/bin/bash" }
        }
    },
    'opt': { type: 'dir', children: { 'system_secrets': { type: 'dir', children: { 'secret_project.conf': { type: 'file', content: "[CHIMERA]\nstatus=active\nkey=CTF{Ch1m3ra_P0rt0c0l_Act1vated}" } } } } },
    'usr': { type: 'dir', children: { 'bin': { type: 'dir', children: { 'script.sh': { type: 'file', content: "#!/bin/bash\necho 'Running diagnostics...'\n# EMBEDDED_STR: CTF{B1nary_H1dd3n_Str1ngs}" } } } } },
    'root': { type: 'dir', permission: 'root', children: { 'root.txt': { type: 'file', content: "TOTAL_OWNAGE: CTF{R00t_Acc3ss_Is_M1n3}\nWelcome to the top tier." } } }
};

// ======================== STATE & SOUNDS ========================
let solvedIds = [];
let currentPath = ['home', 'guest'];
let user = 'guest';
let startTime = Date.now();
let timerInterval = null;
let hintsUsed = 0; // For premium hint pricing

const typingSound = document.getElementById('typingSound');
const successSound = document.getElementById('successSound');
const errorSound = document.getElementById('errorSound');

// ======================== UI ELEMENTS ========================
const termOut = document.getElementById('terminal-output');
const cmdField = document.getElementById('command-field');
const promptEl = document.getElementById('terminal-prompt');
const objContainer = document.getElementById('objective-container');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const objCountEl = document.getElementById('obj-count');

// ======================== HELPER FUNCTIONS ========================
function resolvePath(target) {
    if (!target) return currentPath;
    let parts = target.startsWith('/') ? [] : [...currentPath];
    let targets = target.split('/').filter(x => x);
    for (let t of targets) {
        if (t === '..') { if (parts.length > 0) parts.pop(); }
        else if (t !== '.') parts.push(t);
    }
    return parts;
}

function getDir(pathArr) {
    let curr = fs;
    for (const p of pathArr) {
        if (curr[p] && curr[p].type === 'dir') curr = curr[p].children;
        else return null;
    }
    return curr;
}

function print(text, type = 'normal') {
    const div = document.createElement('div');
    div.innerHTML = text; // Allow <br> in descriptions
    if (type === 'error') {
        div.style.color = 'var(--accent-red)';
        errorSound.currentTime = 0;
        errorSound.play().catch(() => {});
    }
    if (type === 'success') {
        div.style.color = 'var(--accent-cyan)';
        successSound.currentTime = 0;
        successSound.play().catch(() => {});
    }
    if (type === 'dim') div.style.color = 'var(--text-dim)';
    termOut.appendChild(div);
    termOut.scrollTop = termOut.scrollHeight;
}

function updateObjectives() {
    objContainer.innerHTML = '';
    let score = 0;
    let activeFound = false;

    flags.forEach(f => {
        const isSolved = solvedIds.includes(f.id);
        if (isSolved) score += f.points;

        const div = document.createElement('div');
        div.className = 'objective-item';

        let status = 'locked';
        if (isSolved) status = 'solved';
        else if (!activeFound) { status = 'active'; activeFound = true; }

        div.classList.add(status);

        div.innerHTML = `
            <div class="obj-title">
                <span>${status === 'locked' ? '🔒 LOCKED' : (status === 'solved' ? '✅' : '🚀')} ${f.name}</span>
                <span class="obj-pts">${f.points} PTS</span>
            </div>
            <div class="obj-desc">${status !== 'locked' ? f.desc : 'Complete previous objectives to unlock'}</div>
        `;
        objContainer.appendChild(div);
    });

    scoreEl.textContent = score;
    objCountEl.textContent = `${solvedIds.length}/${flags.length}`;

    if (solvedIds.length === flags.length) {
        clearInterval(timerInterval);
        document.getElementById('success-modal').style.display = 'flex';
        document.getElementById('final-stats').textContent = `Time: ${timerEl.textContent} | Score: ${score}`;
    }
}

function updatePrompt() {
    let pathStr = '/' + currentPath.join('/');
    if (user === 'guest' && pathStr.startsWith('/home/guest')) pathStr = pathStr.replace('/home/guest', '~');
    if (user === 'root' && pathStr.startsWith('/root')) pathStr = pathStr.replace('/root', '~');
    promptEl.textContent = `${user}@linux-box:${pathStr}${user === 'root' ? '#' : '$'}`;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const diff = Date.now() - startTime;
        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        timerEl.textContent = `${h}:${m}:${s}`;
    }, 1000);
}

// ======================== COMMANDS ========================
const commands = {
    'help': () => {
        print('AVAILABLE COMMANDS:', 'success');
        print('  ls [-a] [path]    → List directory contents');
        print('  cd [dir]          → Change directory');
        print('  cat [file]        → View file content');
        print('  pwd               → Print current path');
        print('  whoami            → Current user');
        print('  su [user]         → Switch user');
        print('  clear             → Clear screen');
        print('  hint              → Get premium hint (costs credits)');
    },
    'clear': () => { termOut.innerHTML = ''; },
    'pwd': () => { print('/' + currentPath.join('/')); },
    'whoami': () => { print(user); },
    'ls': (args) => {
        const showHidden = args.includes('-a');
        const pathStr = args.find(a => !a.startsWith('-')) || '';
        const pathParts = resolvePath(pathStr);
        const dir = getDir(pathParts);

        if (!dir) return print(`ls: ${pathStr || '.'}: No such directory`, 'error');
        if (pathParts[0] === 'root' && user !== 'root') return print('ls: permission denied: /root', 'error');

        let out = [];
        for (let name in dir) {
            if (!showHidden && name.startsWith('.')) continue;
            out.push(dir[name].type === 'dir' ? name + '/' : name);
        }
        print(out.length ? out.join('  ') : '(empty)');
    },
    'cd': (args) => {
        const target = args[0] || (user === 'root' ? '/root' : '/home/guest');
        const testPath = resolvePath(target);
        const dir = getDir(testPath);
        if (!dir) return print(`cd: ${target}: No such directory`, 'error');
        if (testPath[0] === 'root' && user !== 'root') return print('cd: permission denied: /root', 'error');

        currentPath = testPath;
        updatePrompt();
    },
    'cat': (args) => {
        const target = args[0];
        if (!target) return print('usage: cat <file>', 'error');

        const parts = target.split('/');
        const fileName = parts.pop();
        const dirPath = parts.length > 0 ? resolvePath(parts.join('/')) : currentPath;
        const dir = getDir(dirPath);

        if (!dir) return print(`cat: ${target}: No such file or directory`, 'error');
        if (dirPath[0] === 'root' && user !== 'root') return print('cat: permission denied', 'error');

        if (dir[fileName]?.type === 'file') {
            print(dir[fileName].content);
        } else {
            print(`cat: ${target}: No such file`, 'error');
        }
    },
    'su': (args) => {
        const targetUser = args[0] || 'root';
        if (targetUser === 'root') {
            print('Password required for root access.');
            print('(HINT: Search previous flags or common locations...)', 'dim');
            print('Enter password:');
            cmdField.type = 'password';
            pendingAction = 'su_root';
        } else {
            print(`su: user ${targetUser} not found`, 'error');
        }
    },
    'hint': () => {
        const activeFlag = flags.find(f => !solvedIds.includes(f.id));
        if (!activeFlag) return print('All objectives completed!', 'success');

        const cost = Math.pow(2, hintsUsed + 1); // $2, $4, $8, $16...
        if (confirm(`Premium Hint Cost: $${cost} credits\nReveal hint for "${activeFlag.name}"?`)) {
            print(`HINT: ${activeFlag.hint}`, 'success');
            hintsUsed++;
        } else {
            print('Hint purchase cancelled.', 'dim');
        }
    }
};

let pendingAction = null;

// ======================== EVENT LISTENERS ========================
cmdField.addEventListener('keydown', (e) => {
    // Typing sound
    if (e.key.length === 1) {
        typingSound.currentTime = 0;
        typingSound.play().catch(() => {});
    }

    if (e.key === 'Enter') {
        const val = cmdField.value.trim();
        cmdField.value = '';

        if (pendingAction === 'su_root') {
            cmdField.type = 'text';
            pendingAction = null;
            if (val === 'admin_pass_2025') {
                user = 'root';
                currentPath = ['root'];
                print('Authentication successful. Root access granted.', 'success');
                updatePrompt();
            } else {
                print('su: Authentication failure', 'error');
            }
            return;
        }

        if (val) {
            print(`${promptEl.textContent} ${val}`);
            const parts = val.split(/\s+/);
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);

            if (commands[cmd]) {
                commands[cmd](args);
            } else {
                print(`${cmd}: command not found`, 'error');
            }
        }
    }
});

// ======================== FLAG SUBMISSION ========================
function checkFlag() {
    const input = document.getElementById('flag-input');
    const val = input.value.trim();
    const feedback = document.getElementById('feedback-msg');

    if (!val) return;

    const flag = flags.find(f => f.code === val);
    if (flag) {
        if (solvedIds.includes(flag.id)) {
            feedback.textContent = 'ALREADY SUBMITTED';
            feedback.style.color = 'var(--accent-cyan)';
        } else {
            solvedIds.push(flag.id);
            feedback.textContent = `CORRECT! +${flag.points} PTS`;
            feedback.style.color = 'var(--accent-green)';
            successSound.currentTime = 0;
            successSound.play();
            input.value = '';
            updateObjectives();
            print(`[SYSTEM] Flag captured: ${flag.name}`, 'success');
        }
    } else {
        feedback.textContent = 'INCORRECT FLAG';
        feedback.style.color = 'var(--accent-red)';
        errorSound.currentTime = 0;
        errorSound.play();
    }

    setTimeout(() => feedback.textContent = '', 4000);
}

// ======================== INITIALIZATION ========================
updateObjectives();
updatePrompt();
startTimer();
print('Linux Fundamentals CTF loaded. Type <strong>help</strong> for commands.', 'success');
print('Good luck, hacker.', 'dim');