// Storage Layer - LocalStorage wrapper

const Storage = {
    KEYS: {
        EXERCISES: 'sta_exercises',
        PLANS: 'sta_plans',
        SETTINGS: 'sta_settings',
        INITIALIZED: 'sta_initialized'
    },

    /**
     * Get data from localStorage
     */
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading from storage:', e);
            return null;
        }
    },

    /**
     * Set data in localStorage
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to storage:', e);
            return false;
        }
    },

    /**
     * Remove data from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from storage:', e);
            return false;
        }
    },

    /**
     * Check if app has been initialized
     */
    isInitialized() {
        return this.get(this.KEYS.INITIALIZED) === true;
    },

    /**
     * Mark app as initialized
     */
    setInitialized() {
        this.set(this.KEYS.INITIALIZED, true);
    },

    /**
     * Get all exercises
     */
    getExercises() {
        return this.get(this.KEYS.EXERCISES) || [];
    },

    /**
     * Save exercises
     */
    saveExercises(exercises) {
        return this.set(this.KEYS.EXERCISES, exercises);
    },

    /**
     * Get all plans
     */
    getPlans() {
        return this.get(this.KEYS.PLANS) || [];
    },

    /**
     * Save plans
     */
    savePlans(plans) {
        return this.set(this.KEYS.PLANS, plans);
    },

    /**
     * Get settings
     */
    getSettings() {
        return this.get(this.KEYS.SETTINGS) || {
            darkMode: false,
            audioEnabled: true
        };
    },

    /**
     * Save settings
     */
    saveSettings(settings) {
        return this.set(this.KEYS.SETTINGS, settings);
    },

    /**
     * Export all data
     */
    exportData() {
        return {
            exercises: this.getExercises(),
            plans: this.getPlans(),
            settings: this.getSettings(),
            initialized: this.get(this.KEYS.INITIALIZED),
            exportDate: new Date().toISOString(),
            version: '1.1'
        };
    },

    /**
     * Import data (overwrites existing data)
     */
    importData(data) {
        try {
            if (data.exercises) this.saveExercises(data.exercises);
            if (data.plans) this.savePlans(data.plans);
            if (data.settings) this.saveSettings(data.settings);
            if (data.initialized !== undefined) this.set(this.KEYS.INITIALIZED, data.initialized);
            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    },

    /**
     * Clear all app data
     */
    clearAll() {
        Object.values(this.KEYS).forEach(key => this.remove(key));
    }
};
