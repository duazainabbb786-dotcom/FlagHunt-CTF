/**
 * levelManager handles the progression and state of levels in the FlagHunt platform.
 */
const levelManager = {
    storageKey: 'flaghunt_progress',

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialProgress = {
                unlockedLevels: [1],
                completedQuizzes: [],
                scores: {}
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialProgress));
        }
    },

    getProgress() {
        this.init();
        return JSON.parse(localStorage.getItem(this.storageKey));
    },

    saveProgress(progress) {
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    },

    completeQuiz(quizName, score) {
        const progress = this.getProgress();
        if (!progress.completedQuizzes.includes(quizName)) {
            progress.completedQuizzes.push(quizName);
        }
        progress.scores[quizName] = score;

        // progression logic
        const level1Quizzes = ['phishing', 'malware', 'passwords'];
        const allLevel1Done = level1Quizzes.every(q => progress.completedQuizzes.includes(q));

        if (allLevel1Done && !progress.unlockedLevels.includes(2)) {
            progress.unlockedLevels.push(2);
        }


        // Level 2 Progression (Web, Crypto, HTML)
        const level2Quizzes = ['webbasics', 'crypto', 'html'];
        const allLevel2Done = level2Quizzes.every(q => progress.completedQuizzes.includes(q));

        if (allLevel2Done && !progress.unlockedLevels.includes(3)) {
            progress.unlockedLevels.push(3);
        }

        this.saveProgress(progress);
    },

    isLevelUnlocked(levelNumber) {
        const progress = this.getProgress();
        return progress.unlockedLevels.includes(levelNumber);
    },

    isQuizCompleted(quizName) {
        const progress = this.getProgress();
        return progress.completedQuizzes.includes(quizName);
    },

    showCompletionModal(quizName, score) {
        const progress = this.getProgress();

        // Define quiz progression
        const quizProgression = {
            'phishing': { next: 'Malware-Quiz.html', message: 'Congratulations! You\'ve completed the Phishing Awareness quiz successfully!' },
            'malware': { next: 'StrongPassword-Quiz.html', message: 'Congratulations! You\'ve completed the Malware Detection quiz successfully!' },
            'passwords': { next: null, message: 'Congratulations! You are now allowed to move into the Intermediate room!' },
            'webbasics': { next: 'crypto.html', message: 'Congratulations! You\'ve completed the Web Basics challenges successfully!' },
            'crypto': { next: 'html-level.html', message: 'Congratulations! You\'ve completed the Crypto challenges successfully!' },
            'html': { next: null, message: 'Congratulations! You are now allowed to move into the Advanced room!' }
        };

        const quizInfo = quizProgression[quizName];
        if (!quizInfo) return;

        // Check if this is the last quiz of a level
        const level1Quizzes = ['phishing', 'malware', 'passwords'];
        const level2Quizzes = ['webbasics', 'crypto', 'html'];

        let nextUrl = quizInfo.next;
        let message = quizInfo.message;

        // If no next quiz, go to Levels page
        if (!nextUrl) {
            nextUrl = 'Levels.html';
        }

        const modalHtml = `
            <div id="levelCompleteModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(10px); animation: fadeIn 0.3s;">
                <div style="background: linear-gradient(135deg, var(--bg-card), var(--bg-dark)); border: 2px solid var(--primary); border-radius: 16px; padding: 50px; max-width: 500px; text-align: center; box-shadow: 0 0 50px rgba(157, 78, 221, 0.5); animation: scaleIn 0.3s;">
                    <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 0.6s;">🎉</div>
                    <h2 style="color: var(--accent); margin-bottom: 15px; font-size: 28px; text-shadow: 0 0 10px var(--accent);">Level Complete!</h2>
                    <p style="color: white; margin-bottom: 10px; font-size: 18px; font-weight: 600;">${message}</p>
                    <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 16px;">Score: ${score}%</p>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="window.location.href='${nextUrl}'" style="background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; border: none; padding: 15px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 16px; box-shadow: 0 0 20px rgba(157, 78, 221, 0.5); transition: all 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">CONTINUE TO NEXT LEVEL</button>
                        <button onclick="window.location.href='Levels.html'" style="background: transparent; color: var(--text-muted); border: 1px solid var(--border); padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.3s;" onmouseover="this.style.borderColor='var(--primary)'; this.style.color='white'" onmouseout="this.style.borderColor='var(--border)'; this.style.color='var(--text-muted)'">BACK TO LEVELS</button>
                    </div>
                </div>
            </div>
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
};

// Initialize progress on page load
levelManager.init();
window.levelManager = levelManager;
