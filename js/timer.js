// Timer Module - Accurate timing even when tab is backgrounded

const Timer = {
    intervalId: null,
    startTime: null,
    duration: 0,
    remaining: 0,
    isPaused: false,
    onTick: null,
    onComplete: null,
    isActive: false,

    /**
     * Start a timer
     * @param {number} seconds - Duration in seconds
     * @param {function} onTick - Callback called every second with remaining time
     * @param {function} onComplete - Callback called when timer completes
     */
    start(seconds, onTick, onComplete) {
        this.stop(); // Clear any existing timer
        
        this.duration = seconds;
        this.remaining = seconds;
        this.startTime = Date.now();
        this.isActive = true;
        this.isPaused = false;
        this.onTick = onTick;
        this.onComplete = onComplete;

        if (this.onTick) {
            this.onTick(this.remaining);
        }

        this.intervalId = setInterval(() => {
            this.tick();
        }, 100); // Check every 100ms for accuracy
    },

    /**
     * Tick function - calculates remaining time based on timestamps
     */
    tick() {
        if (this.isPaused) return;

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.remaining = Math.max(0, this.duration - elapsed);

        if (this.onTick) {
            this.onTick(this.remaining);
        }

        if (this.remaining <= 0) {
            this.complete();
        }
    },

    /**
     * Pause the timer
     */
    pause() {
        this.isPaused = true;
        // Store how much time was remaining
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.remaining = Math.max(0, this.duration - elapsed);
    },

    /**
     * Resume the timer
     */
    resume() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        // Adjust start time to account for pause
        this.duration = this.remaining;
        this.startTime = Date.now();
    },

    /**
     * Stop the timer
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.startTime = null;
        this.duration = 0;
        this.remaining = 0;
        this.isPaused = false;
        this.isActive = false;
    },

    /**
     * Complete the timer
     */
    complete() {
        this.stop();
        if (this.onComplete) {
            this.onComplete();
        }
    },

    /**
     * Get remaining time
     */
    getRemaining() {
        if (this.isPaused) {
            return this.remaining;
        }
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        return Math.max(0, this.duration - elapsed);
    },

    /**
     * Check if timer is running
     */
    isRunning() {
        return this.intervalId !== null && !this.isPaused;
    },

    /**
     * Toggle pause
     */
    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    },

    /**
     * Adjust remaining time
     */
    adjust(seconds) {
        if (!this.isActive) return;
        
        // Adjust duration to effectively change remaining time
        this.duration += seconds;
        
        // Ensure remaining doesn't go below 0
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        if (this.duration - elapsed < 0) {
            this.duration = elapsed;
        }
        
        if (this.onTick) {
            this.onTick(this.getRemaining());
        }
    }
};
