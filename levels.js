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

    showCompletionModal(message, nextUrl) {
        const modalHtml = `
            <div id="levelCompleteModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(5px);">
                <div style="background: #111; border: 1px solid #00eaff; border-radius: 12px; padding: 40px; max-width: 450px; text-align: center; box-shadow: 0 0 30px rgba(0, 234, 255, 0.3);">
                    <div style="font-size: 60px; margin-bottom: 20px;">🏆</div>
                    <h2 style="color: #00eaff; margin-bottom: 10px; font-size: 24px;">Level Complete!</h2>
                    <p style="color: #ccc; margin-bottom: 30px; font-size: 16px;">${message}</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button onclick="window.location.href='${nextUrl || 'Levels.html'}'" style="background: #00eaff; color: #000; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer;">CONTINUE TO NEXT LEVEL</button>
                        <button onclick="document.getElementById('levelCompleteModal').remove()" style="background: transparent; color: #777; border: 1px solid #333; padding: 10px; border-radius: 6px; cursor: pointer;">STAY HERE</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
};

// Initialize progress on page load
levelManager.init();
window.levelManager = levelManager;
