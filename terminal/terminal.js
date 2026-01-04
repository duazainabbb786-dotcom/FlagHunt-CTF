class ForensicTerminal {
    constructor(containerId, onCommand) {
        this.container = document.getElementById(containerId);
        this.onCommand = onCommand;
        this.history = [];
        this.historyIndex = -1;
        this.currentLevel = null;
        
        this.init();
    }
    
    init() {
        this.container.innerHTML = `
            <div class="terminal-header">
                <div class="terminal-title">
                    <i class="fas fa-terminal"></i> FORENSIC ANALYSIS TERMINAL
                </div>
                <div class="terminal-controls">
                    <span class="control-btn minimize"></span>
                    <span class="control-btn maximize"></span>
                    <span class="control-btn close"></span>
                </div>
            </div>
            <div class="terminal-body">
                <div class="output" id="terminal-output"></div>
                <div class="input-line">
                    <span class="prompt">forensic@echoes:~$</span>
                    <input type="text" class="command-input" id="terminal-input" autocomplete="off" placeholder="Type 'help' for commands">
                </div>
            </div>
        `;
        
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.addWelcomeMessage();
        
        // Focus on input
        setTimeout(() => {
            this.input.focus();
        }, 100);
    }
    
    addWelcomeMessage() {
        this.printLine(`<span class="info">===================================================</span>`);
        this.printLine(`<span class="success">DIGITAL ECHOES - FORENSIC TERMINAL v2.0</span>`);
        this.printLine(`<span class="info">===================================================</span>`);
        this.printLine(`<span class="info">Type 'help' for available commands</span>`);
        this.printLine(`<span class="info">Type 'analyze' to start forensic analysis</span>`);
        this.printLine(`<span class="info">Type 'submit flag{...}' to submit your flag</span>`);
        this.printLine(``);
    }
    
    printLine(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.innerHTML = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }
    
    clear() {
        this.output.innerHTML = '';
        this.addWelcomeMessage();
    }
    
    handleKeyDown(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.executeCommand(command);
            }
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.history.length - 1 - this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.history.length - 1 - this.historyIndex];
            } else {
                this.historyIndex = -1;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Basic tab completion
            const commands = ['help', 'analyze', 'submit', 'hint', 'clear', 'ls', 'exit'];
            const current = this.input.value;
            const match = commands.find(cmd => cmd.startsWith(current));
            if (match) {
                this.input.value = match;
            }
        }
    }
    
    executeCommand(command) {
        this.printLine(`<span class="prompt">forensic@echoes:~$</span> ${command}`, 'input');
        this.history.unshift(command);
        this.historyIndex = -1;
        
        if (this.onCommand) {
            this.onCommand(command, this);
        }
    }
    
    setLevel(level) {
        this.currentLevel = level;
        this.clear();
        
        this.printLine(`<span class="success">[+] LEVEL LOADED: ${level.title}</span>`);
        this.printLine(`<span class="info">[i] ${level.description}</span>`);
        this.printLine(``);
        
        this.printLine(`<span class="info">[INVESTIGATION SCENARIO]</span>`);
        const scenarioLines = level.scenario.match(/.{1,80}(?:\s|$)/g) || [level.scenario];
        scenarioLines.forEach(line => {
            this.printLine(`  ${line}`);
        });
        this.printLine(``);
        
        this.printLine(`<span class="info">[EVIDENCE FILES AVAILABLE]</span>`);
        level.files.forEach(file => {
            this.printLine(`  📄 ${file}`);
        });
        this.printLine(``);
        
        this.printLine(`<span class="warning">[INSTRUCTIONS] Analyze the evidence and submit your flag:</span>`);
        this.printLine(`<span class="command">  submit flag{your_flag_here}</span>`);
        this.printLine(``);
        
        this.printLine(`<span class="info">[TIME REMAINING] ${Math.floor(window.game.timeLeft / 60)}:${(window.game.timeLeft % 60).toString().padStart(2, '0')}</span>`);
        this.printLine(`<span class="info">[POINTS AVAILABLE] ${level.points}</span>`);
        this.printLine(``);
    }
}