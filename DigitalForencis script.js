class CTFGame {
    constructor() {
        this.levels = [];
        this.currentLevel = null;
        this.solvedLevels = new Set();
        this.unlockedLevels = new Set([1]);
        this.timeLimit = 60 * 60;
        this.timeLeft = this.timeLimit;
        this.startTime = Date.now();
        this.terminal = null;
        this.flags = {};
        this.totalPoints = 0;
        
        this.init();
    }
    
    async init() {
        this.loadLevels();
        this.initTerminal();
        this.renderLevels();
        this.updateStats();
        this.startTimer();
        this.setupEventListeners();
        
        if (this.levels.length > 0) {
            this.selectLevel(this.levels[0]);
        }
    }
    
    loadLevels() {
        this.levels = [
            {
                id: 1,
                title: "LEVEL 1 — MEMORY FORENSICS",
                icon: "fa-memory",
                description: "Analyze Windows Memory Dump for Hidden Process",
                scenario: "A suspect's computer was seized during a cyber attack. The memory dump contains a hidden malicious process communicating with a C2 server. Your task is to find the hidden process and extract the flag.",
                flag: "flag{volatility_finds_all}",
                solution: "Used Volatility's psxview plugin to identify hidden svchost.exe process with parent PID 4 (System). Flag found in process memory strings.",
                files: ["memory.dmp", "volatility_profiles", "process_list.txt", "network_connections.log"],
                hints: [
                    "Use 'volatility -f memory.dmp psxview' to find hidden processes",
                    "Look for processes with False in the pslist column",
                    "Check the parent process ID of suspicious svchost.exe"
                ],
                estimatedTime: "15 minutes",
                points: 100,
                terminalCommands: {
                    "analyze": "[+] Starting memory analysis...\n[+] Loading memory.dmp (Size: 4.2GB)\n[+] Profile detected: Win10x64_19041\n[+] Running pslist plugin...\nPID    PPID   Name\n784    492    explorer.exe\n1337   4      svchost.exe  <-- SUSPICIOUS!\n[+] Process 1337 is hidden from normal enumeration",
                    "check hidden": "[+] Checking for hidden processes...\n[+] Hidden process detected: svchost.exe (PID: 1337)\n[+] Parent PID: 4 (System Process)\n[+] Memory region contains encrypted data",
                    "strings memory.dmp": "[+] Extracting strings...\n[+] Found suspicious strings:\nC2:192.168.1.100:4444\nkey: forensic2024\nflag{volatility_finds_all}  <-- FLAG FOUND!"
                }
            },
            {
                id: 2,
                title: "LEVEL 2 — DISK FORENSICS",
                icon: "fa-hdd",
                description: "Recover Deleted Sensitive Documents",
                scenario: "An employee tried to delete confidential financial reports before leaving the company. You have acquired the disk image. Recover the deleted files and find the hidden flag.",
                flag: "flag{deleted_but_not_gone}",
                solution: "Used Autopsy to analyze $MFT and found deleted file entries. Recovered confidential.pdf using file carving techniques.",
                files: ["disk.img", "mft_dump.txt", "file_signatures.db", "unallocated.bin"],
                hints: [
                    "Analyze the Master File Table ($MFT)",
                    "Look for files with ADS (Alternate Data Streams)",
                    "Use file carving tools on unallocated space"
                ],
                estimatedTime: "20 minutes",
                points: 150,
                terminalCommands: {
                    "analyze": "[+] Analyzing disk image: disk.img\n[+] Partition table detected\n[+] NTFS filesystem found\n[+] Parsing $MFT...\n[+] Found 2478 deleted file entries\n[+] Recovering deleted files...",
                    "check mft": "[+] $MFT Analysis:\n- confidential.pdf (deleted)\n- secret_keys.txt (deleted)\n- financial_report.xlsx (deleted)\n[+] Flag found in file metadata",
                    "carve unallocated": "[+] Carving unallocated space...\n[+] Found PDF header at offset 0x3A7B2C\n[+] Extracting file: confidential.pdf\n[+] Metadata contains: flag{deleted_but_not_gone}"
                }
            },
            {
                id: 3,
                title: "LEVEL 3 — NETWORK FORENSICS",
                icon: "fa-network-wired",
                description: "Analyze PCAP for Data Exfiltration",
                scenario: "A data breach was detected in the corporate network. Analyze the packet capture to identify how data was exfiltrated and find the destination server.",
                flag: "flag{dns_tunnel_detected}",
                solution: "Identified DNS tunneling with base64 encoded data in TXT records. Destination: malware.domain (185.199.108.153)",
                files: ["capture.pcapng", "protocol_stats.txt", "dns_queries.log", "http_streams.txt"],
                hints: [
                    "Filter for DNS queries with large TXT records",
                    "Look for unusual subdomain patterns",
                    "Check for base64 encoded data in packets"
                ],
                estimatedTime: "25 minutes",
                points: 200,
                terminalCommands: {
                    "analyze": "[+] Loading PCAP: capture.pcapng\n[+] 15,428 packets captured\n[+] Protocol Distribution:\n- TCP: 45%\n- UDP: 35%\n- DNS: 20% (unusually high)\n[+] Analyzing DNS traffic...",
                    "dns analysis": "[+] DNS Analysis Results:\n[!] Suspicious queries detected:\n- aHR0cHM6Ly9tYWx3YXJlLmRvbWFpbi5jb20=.evil.com\n- ZGF0YV9leGZpbHRyYXRpb24=.secret.com\n[+] Base64 decoded: malware.domain\n[+] Flag: flag{dns_tunnel_detected}",
                    "follow tcp stream": "[+] Following TCP Stream...\n[+] HTTP POST to 185.199.108.153:8080\n[+] Data: encrypted_archive.zip\n[+] Exfiltration method: DNS tunneling with TXT records"
                }
            },
            {
                id: 4,
                title: "LEVEL 4 — STEGANOGRAPHY",
                icon: "fa-image",
                description: "Extract Hidden Data from Images",
                scenario: "A suspect was sending images with hidden messages. Investigate the suspicious image files and extract concealed information.",
                flag: "flag{LSB_steghide_pass}",
                solution: "Used steghide with password 'forensic2024' extracted from EXIF data to reveal hidden archive containing flag.",
                files: ["suspicious.jpg", "exif_data.txt", "stego_tools.log", "original_image.jpg"],
                hints: [
                    "Check EXIF metadata for clues",
                    "Try LSB (Least Significant Bit) analysis",
                    "Common stego tools: steghide, outguess"
                ],
                estimatedTime: "20 minutes",
                points: 175,
                terminalCommands: {
                    "analyze": "[+] Analyzing image: suspicious.jpg\n[+] Image size: 1920x1080\n[+] File size: 2.3MB (suspiciously large)\n[+] Checking for steganography...",
                    "check exif": "[+] EXIF Metadata:\n- Camera: Canon EOS 5D\n- Software: Adobe Photoshop 2024\n- Comment: Password: forensic2024\n- GPS: Disabled\n[+] Password found in metadata!",
                    "extract hidden": "[+] Using steghide with password: forensic2024\n[+] Extracting data...\n[+] Found hidden file: secret.txt\n[+] Content: flag{LSB_steghide_pass}\n[+] Successfully extracted hidden data!"
                }
            },
            {
                id: 5,
                title: "LEVEL 5 — MOBILE FORENSICS",
                icon: "fa-mobile-alt",
                description: "Extract Evidence from Android Device",
                scenario: "Analyze an Android backup to recover deleted messages, contacts, and location data of a suspect in a criminal investigation.",
                flag: "flag{sms_backup_decrypt}",
                solution: "Decrypted SMS database using device PIN found in shared_prefs. Recovered deleted messages containing meeting location.",
                files: ["backup.ab", "sms.db", "shared_prefs.xml", "contacts.vcf", "location_data.gpx"],
                hints: [
                    "Check AndroidManifest.xml for app permissions",
                    "Look for SQLite databases in data folder",
                    "Shared preferences may contain credentials"
                ],
                estimatedTime: "30 minutes",
                points: 250,
                terminalCommands: {
                    "analyze": "[+] Analyzing Android backup: backup.ab\n[+] Backup format: Android Backup\n[+] Extracting files...\n[+] Apps found: WhatsApp, Messages, Contacts",
                    "decrypt sms": "[+] Found encrypted SMS database\n[+] Searching for encryption key...\n[+] Key found in shared_prefs: 2580\n[+] Decrypting messages...\n[+] Flag found: flag{sms_backup_decrypt}",
                    "check location": "[+] Location Data Analysis:\n- Last known: 40.7128° N, 74.0060° W (NYC)\n- Deleted location entries: 3\n- Suspicious coordinates logged"
                }
            },
            {
                id: 6,
                title: "LEVEL 6 — MALWARE ANALYSIS",
                icon: "fa-virus",
                description: "Reverse Engineer Ransomware Sample",
                scenario: "Analyze a ransomware sample to find the encryption key, C2 server address, and kill switch for the malware.",
                flag: "flag{xor_encryption_key}",
                solution: "Static analysis revealed XOR encryption with key 0x37. Found C2 server in binary strings: malware.com:8080",
                files: ["malware.exe", "strings_output.txt", "behavior_log.json", "network_capture.pcap"],
                hints: [
                    "Use strings command to find hardcoded values",
                    "Look for XOR operations in disassembly",
                    "Check network-related API calls"
                ],
                estimatedTime: "35 minutes",
                points: 300,
                terminalCommands: {
                    "analyze": "[+] Analyzing malware.exe\n[+] File type: PE32 executable\n[+] Packer detected: UPX (unpacked)\n[+] Starting behavioral analysis...",
                    "strings analysis": "[+] Strings Analysis:\n- C2: malware.com:8080\n- User-Agent: Mozilla/5.0\n- Encryption Key: 0x37\n- flag{xor_encryption_key}\n[+] Key and flag found!",
                    "check behavior": "[+] Behavioral Analysis:\n- Creates registry key: HKLM\\Software\\Malware\n- Encrypts files with .encrypted extension\n- Connects to C2 every 5 minutes\n- XOR encryption with key 0x37"
                }
            },
            {
                id: 7,
                title: "LEVEL 7 — LOG ANALYSIS",
                icon: "fa-clipboard-list",
                description: "Correlate Security Events Across Logs",
                scenario: "Investigate a security incident by analyzing Windows Event Logs, firewall logs, and web server logs to identify the attack vector.",
                flag: "flag{brute_force_detected}",
                solution: "Found 4625 events showing brute force attack from IP 203.0.113.5. Account lockouts followed by successful login.",
                files: ["security.evtx", "firewall.log", "apache_access.log", "syslog.txt", "auth.log"],
                hints: [
                    "Look for Event ID 4625 (failed login)",
                    "Check for repeated failed attempts from same IP",
                    "Correlate timestamps across different logs"
                ],
                estimatedTime: "25 minutes",
                points: 200,
                terminalCommands: {
                    "analyze": "[+] Loading security event logs...\n[+] 12,458 events in last 24 hours\n[+] Filtering for security events...",
                    "check failed logins": "[+] Event ID 4625 Analysis:\n- IP: 203.0.113.5 - 324 failed attempts\n- Time: 02:00-02:45 AM\n- Accounts: Administrator, Admin, admin\n[+] Brute force attack detected!",
                    "correlate logs": "[+] Log Correlation:\n02:00 - Firewall: Port scan from 203.0.113.5\n02:30 - Event 4625: Failed logins begin\n03:15 - Event 4624: Successful login\n[+] Flag: flag{brute_force_detected}"
                }
            },
            {
                id: 8,
                title: "LEVEL 8 — CLOUD FORENSICS",
                icon: "fa-cloud",
                description: "Investigate AWS S3 Data Breach",
                scenario: "An AWS S3 bucket containing customer PII was exposed. Determine how the breach occurred, what data was accessed, and by whom.",
                flag: "flag{s3_bucket_misconfig}",
                solution: "Found bucket policy allowing public read access. CloudTrail logs showed data access from unauthorized IP range.",
                files: ["cloudtrail.json", "s3_policies.txt", "bucket_contents.xml", "iam_roles.json", "vpc_flow.log"],
                hints: [
                    "Check bucket ACLs and policies",
                    "Look for PutObject and GetObject events",
                    "Identify anonymous access patterns"
                ],
                estimatedTime: "40 minutes",
                points: 350,
                terminalCommands: {
                    "analyze": "[+] Analyzing AWS CloudTrail logs...\n[+] Timeframe: Last 7 days\n[+] S3 events detected: 1,247\n[+] Checking bucket policies...",
                    "check bucket policy": "[+] Bucket Policy Analysis:\n[!] Policy allows: s3:GetObject *\n[!] Principal: * (PUBLIC ACCESS)\n[!] Condition: None\n[+] Misconfiguration found!",
                    "trace access": "[+] Tracing unauthorized access:\n- IP: 198.51.100.23\n- User-Agent: curl/7.68.0\n- Files accessed: customer_data.csv\n- Flag: flag{s3_bucket_misconfig}"
                }
            },
            {
                id: 9,
                title: "LEVEL 9 — KERNEL FORENSICS",
                icon: "fa-brain",
                description: "Rootkit Detection in Kernel Memory",
                scenario: "Detect and analyze a sophisticated rootkit hiding in kernel space that's intercepting system calls and hiding processes.",
                flag: "flag{ssdt_hook_uncovered}",
                solution: "Identified SSDT hook redirecting NtOpenProcess calls. Found hidden driver file and decoded its configuration.",
                files: ["memory.dmp", "ssdt_table.txt", "driver_list.sys", "kernel_objects.bin", "call_stack.log"],
                hints: [
                    "Compare SSDT with clean system baseline",
                    "Look for inline function hooks",
                    "Check loaded driver signatures"
                ],
                estimatedTime: "45 minutes",
                points: 400,
                terminalCommands: {
                    "analyze": "[+] Loading kernel memory dump...\n[+] Analyzing System Service Descriptor Table (SSDT)...\n[+] Checking for hooks...",
                    "check ssdt": "[+] SSDT Analysis:\n[!] Hook detected at NtOpenProcess\n[!] Original: 0xFFFFF80001A2B3D0\n[!] Hooked: 0xFFFFF88002A1C000\n[+] Rootkit detected in kernel space!",
                    "dump driver": "[+] Dumping malicious driver...\n[+] Driver: rootkit.sys (unsigned)\n[+] Hooks: NtOpenProcess, NtReadVirtualMemory\n[+] Flag: flag{ssdt_hook_uncovered}\n[+] Rootkit analysis complete!"
                }
            }
        ];
        
        this.initializeFlags();
    }
    
    initializeFlags() {
        this.levels.forEach(level => {
            this.flags[level.id] = {
                captured: false,
                flag: level.flag
            };
        });
    }
    
    initTerminal() {
        this.terminal = new ForensicTerminal('terminal-container', (command, terminal) => {
            this.handleCommand(command, terminal);
        });
    }
    
    renderLevels() {
        const container = document.getElementById('levels-container');
        container.innerHTML = '';
        
        this.levels.forEach(level => {
            const isUnlocked = this.unlockedLevels.has(level.id);
            const isSolved = this.solvedLevels.has(level.id);
            const isActive = this.currentLevel?.id === level.id;
            
            const levelCard = document.createElement('div');
            levelCard.className = `col-md-4 level-card ${isSolved ? 'solved' : isUnlocked ? 'unlocked' : 'locked'} ${isActive ? 'active' : ''}`;
            levelCard.dataset.id = level.id;
            
            if (isUnlocked || isSolved) {
                levelCard.addEventListener('click', () => this.selectLevel(level));
            }
            
            levelCard.innerHTML = `
                <div class="level-header">
                    <div class="level-title">
                        <i class="fas ${level.icon}"></i>
                        ${level.title}
                    </div>
                    <div class="level-badge badge-${isSolved ? 'solved' : isUnlocked ? 'unlocked' : 'locked'}">
                        ${isSolved ? 'SOLVED ✓' : isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </div>
                </div>
                
                <div class="level-scenario">
                    <strong><i class="fas fa-search"></i> Scenario:</strong><br>
                    ${level.scenario.substring(0, 120)}...
                </div>
                
                <div class="level-info">
                    <span><i class="fas fa-clock"></i> ${level.estimatedTime}</span>
                    <span><i class="fas fa-star"></i> ${level.points} Points</span>
                </div>
                
                <div class="level-icon">
                    <i class="fas ${isSolved ? 'fa-trophy' : isUnlocked ? 'fa-unlock' : 'fa-lock'}"></i>
                </div>
            `;
            
            container.appendChild(levelCard);
        });
        
        this.updateProgress();
    }
    
    selectLevel(level) {
        if (!this.unlockedLevels.has(level.id) && !this.solvedLevels.has(level.id)) {
            alert(`🔒 Level ${level.id} is locked! Complete previous levels first.`);
            return;
        }
        
        this.currentLevel = level;
        this.renderLevels();
        
        document.getElementById('current-hint').textContent = 
            level.hints[0] || 'No hints available for this level.';
        
        if (this.terminal) {
            this.terminal.setLevel(level);
        }
        
        const challengesContainer = document.getElementById('challenges-container');
        challengesContainer.innerHTML = `
            <div class="level-details">
                <h4><i class="fas ${level.icon}"></i> ${level.title}</h4>
                <p class="text-muted">${level.description}</p>
                
                <div class="scenario-box mt-3">
                    <h5><i class="fas fa-file-alt"></i> Investigation Scenario:</h5>
                    <div class="scenario-content">
                        ${level.scenario}
                    </div>
                </div>
                
                <div class="evidence-files mt-4">
                    <h5><i class="fas fa-folder-open"></i> Evidence Files:</h5>
                    <div class="file-list">
                        ${level.files.map(file => `
                            <div class="file-item">
                                <i class="fas fa-file"></i> ${file}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flag-input-container mt-4">
                    <h5><i class="fas fa-flag"></i> Submit Flag:</h5>
                    <div class="input-group">
                        <input type="text" class="flag-input" id="flag-input" 
                               placeholder="Enter flag in format: flag{...}">
                        <button class="btn btn-cyber" id="submit-flag-btn">
                            <i class="fas fa-paper-plane"></i> Submit
                        </button>
                    </div>
                </div>
                
                <div class="terminal-response mt-3" id="level-response">
                    <!-- Terminal responses will appear here -->
                </div>
            </div>
        `;
        
        document.getElementById('submit-flag-btn').addEventListener('click', () => {
            this.submitFlagFromInput();
        });
        
        document.getElementById('flag-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitFlagFromInput();
            }
        });
        
        document.getElementById('flag-input').focus();
    }
    
    submitFlagFromInput() {
        const flagInput = document.getElementById('flag-input');
        const flag = flagInput.value.trim();
        const responseDiv = document.getElementById('level-response');
        
        if (!flag) {
            responseDiv.innerHTML = `<span class="response-error">[!] Please enter a flag</span>`;
            return;
        }
        
        if (!this.currentLevel) {
            responseDiv.innerHTML = `<span class="response-error">[!] No level selected</span>`;
            return;
        }
        
        if (flag === this.currentLevel.flag) {
            this.captureFlag();
            responseDiv.innerHTML = `
                <span class="response-success">[✓] FLAG CAPTURED! Excellent work!</span><br>
                <span class="response-info">Flag: ${this.currentLevel.flag}</span><br>
                <span class="response-info">Next level unlocked!</span>
            `;
            flagInput.value = '';
            
            // Play success sound (optional)
            this.playSuccessSound();
        } else {
            responseDiv.innerHTML = `<span class="response-error">[✗] Incorrect flag. Keep investigating!</span>`;
        }
    }
    
    captureFlag() {
        if (!this.currentLevel) return;
        
        const levelId = this.currentLevel.id;
        
        if (this.solvedLevels.has(levelId)) {
            return; // Already solved
        }
        
        // Mark level as solved
        this.solvedLevels.add(levelId);
        this.flags[levelId].captured = true;
        
        // Add points
        this.totalPoints += this.currentLevel.points;
        
        // Unlock next level if exists
        const nextLevelId = levelId + 1;
        if (nextLevelId <= this.levels.length) {
            this.unlockedLevels.add(nextLevelId);
            
            // Auto-select next level if it's unlocked
            if (nextLevelId === levelId + 1) {
                setTimeout(() => {
                    const nextLevel = this.levels.find(l => l.id === nextLevelId);
                    if (nextLevel) {
                        this.selectLevel(nextLevel);
                    }
                }, 1500);
            }
        }
        
        // Update UI
        this.updateStats();
        this.renderLevels();
        this.showFlagModal();
    }
    
    handleCommand(command, terminal) {
        const parts = command.toLowerCase().split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        if (!this.currentLevel) {
            terminal.printLine(`<span class="error">[!] Select a level first</span>`);
            return;
        }
        
        if (this.currentLevel.terminalCommands && this.currentLevel.terminalCommands[cmd]) {
            const response = this.currentLevel.terminalCommands[cmd];
            terminal.printLine(`<span class="info">${response}</span>`);
            
            const responseDiv = document.getElementById('level-response');
            if (responseDiv) {
                responseDiv.innerHTML = `<span class="response-info">${response.replace(/\n/g, '<br>')}</span>`;
            }
        } else {
            switch(cmd) {
                case 'help':
                    terminal.printLine(`<span class="info">[AVAILABLE COMMANDS]</span>`);
                    terminal.printLine(`  analyze                  - Start forensic analysis`);
                    terminal.printLine(`  submit flag{...}         - Submit a flag`);
                    terminal.printLine(`  hint                     - Get a hint (costs 30s)`);
                    terminal.printLine(`  clear                    - Clear terminal`);
                    terminal.printLine(`  ls                       - List evidence files`);
                    terminal.printLine(`  exit                     - Return to level selection`);
                    break;
                    
                case 'submit':
                    const flag = args.join(' ');
                    this.submitFlag(flag, terminal);
                    break;
                    
                case 'hint':
                    this.showHint(terminal);
                    break;
                    
                case 'analyze':
                    terminal.printLine(`<span class="success">[+] Starting forensic analysis for ${this.currentLevel.title}</span>`);
                    terminal.printLine(`<span class="info">[i] Loading evidence files...</span>`);
                    
                    setTimeout(() => {
                        terminal.printLine(`<span class="success">[+] Evidence loaded successfully</span>`);
                        terminal.printLine(`<span class="info">[i] Available files: ${this.currentLevel.files.join(', ')}</span>`);
                    }, 1000);
                    break;
                    
                case 'clear':
                    terminal.clear();
                    break;
                    
                case 'ls':
                    terminal.printLine(`<span class="info">[Evidence Files]</span>`);
                    this.currentLevel.files.forEach(file => {
                        terminal.printLine(`  - ${file}`);
                    });
                    break;
                    
                case 'exit':
                    terminal.printLine(`<span class="info">[i] Returning to level selection...</span>`);
                    break;
                    
                default:
                    terminal.printLine(`<span class="error">[!] Command not found: ${cmd}</span>`);
                    terminal.printLine(`<span class="info">Type 'help' for available commands</span>`);
            }
        }
    }
    
    submitFlag(flag, terminal) {
        if (!this.currentLevel) {
            terminal.printLine(`<span class="error">[!] No level selected</span>`);
            return;
        }
        
        if (flag === this.currentLevel.flag) {
            this.captureFlag();
            terminal.printLine(`<span class="success">[✓] FLAG CAPTURED! Excellent work!</span>`);
        } else {
            terminal.printLine(`<span class="error">[✗] Incorrect flag. Keep investigating!</span>`);
        }
    }
    
    showHint(terminal) {
        if (!this.currentLevel) return;
        
        if (this.timeLeft > 30) {
            this.timeLeft -= 30;
            const hints = this.currentLevel.hints;
            const usedHints = this.currentLevel.usedHints || 0;
            
            if (usedHints < hints.length) {
                terminal.printLine(`<span class="warning">[HINT ${usedHints + 1}] ${hints[usedHints]}</span>`);
                this.currentLevel.usedHints = usedHints + 1;
                
                // Update hint display
                document.getElementById('current-hint').textContent = hints[usedHints];
            } else {
                terminal.printLine(`<span class="info">[i] No more hints available for this level</span>`);
            }
            
            terminal.printLine(`<span class="info">[i] 30 seconds deducted for hint</span>`);
            this.updateTimerDisplay();
        } else {
            terminal.printLine(`<span class="error">[!] Not enough time remaining for hint</span>`);
        }
    }
    
    showFlagModal() {
        if (!this.currentLevel) return;
        
        const modal = new bootstrap.Modal(document.getElementById('flagModal'));
        document.getElementById('flag-title').textContent = this.currentLevel.title;
        document.getElementById('captured-flag').textContent = this.currentLevel.flag;
        document.getElementById('flag-description').innerHTML = `
            <strong>Solution:</strong> ${this.currentLevel.solution}<br><br>
            <strong>Points Earned:</strong> ${this.currentLevel.points}<br>
            <strong>Total Points:</strong> ${this.totalPoints}
        `;
        modal.show();
    }
    
    updateStats() {
        const found = this.solvedLevels.size;
        document.getElementById('found-flags').textContent = found;
        document.getElementById('total-points').textContent = this.totalPoints;
        
        const flagsGrid = document.getElementById('flags-grid');
        flagsGrid.innerHTML = '';
        
        for (let i = 1; i <= 9; i++) {
            const flagItem = document.createElement('div');
            flagItem.className = `flag-item ${this.solvedLevels.has(i) ? 'solved' : ''}`;
            flagItem.innerHTML = `<i class="fas fa-${this.solvedLevels.has(i) ? 'flag-checkered' : 'flag'}"></i>`;
            flagsGrid.appendChild(flagItem);
        }
    }
    
    updateProgress() {
        const progress = (this.solvedLevels.size / this.levels.length) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        document.getElementById('level-progress-bar').style.width = `${progress}%`;
        document.getElementById('level-progress-text').textContent = 
            `Level ${this.solvedLevels.size + 1}/9`;
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update time used
        const timeUsed = Math.floor((Date.now() - this.startTime) / 1000);
        const usedMinutes = Math.floor(timeUsed / 60);
        const usedSeconds = timeUsed % 60;
        document.getElementById('time-used').textContent = 
            `${usedMinutes.toString().padStart(2, '0')}:${usedSeconds.toString().padStart(2, '0')}`;
    }
    
    startTimer() {
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.updateTimerDisplay();
                
                // Warning when 5 minutes left
                if (this.timeLeft === 300) {
                    this.showNotification("⚠️ Warning: 5 minutes remaining!");
                }
                
                // Warning when 1 minute left
                if (this.timeLeft === 60) {
                    this.showNotification("🚨 Critical: 1 minute remaining!");
                }
            } else {
                clearInterval(this.timerInterval);
                this.showNotification("⏰ Time's up! Investigation concluded.");
                this.disableAllInputs();
            }
        }, 1000);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cyber-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-bell"></i> ${message}
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    disableAllInputs() {
        document.querySelectorAll('button, input').forEach(el => {
            el.disabled = true;
        });
    }
    
    playSuccessSound() {
        // Simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log("Audio not supported");
        }
    }
    
    setupEventListeners() {
        document.getElementById('reveal-hint').addEventListener('click', () => {
            if (this.currentLevel && this.timeLeft > 30) {
                this.timeLeft -= 30;
                const hints = this.currentLevel.hints;
                const currentHint = document.getElementById('current-hint');
                
                if (hints.length > 1) {
                    currentHint.textContent = hints[1];
                } else if (hints.length > 0) {
                    currentHint.textContent = hints[0];
                }
                
                this.updateTimerDisplay();
                this.showNotification("💡 Hint revealed! 30 seconds deducted.");
            }
        });
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new CTFGame();
});