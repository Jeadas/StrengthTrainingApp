/**
 * UI Manager
 */
const UI = {
    currentScreen: 'homeScreen',
    
    /**
     * Initialize UI
     */
    init() {
        this.showScreen('homeScreen');
        this.renderPlans();
        this.applyDarkMode();
    },

    /**
     * Show a screen
     */
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenId;
        }
        window.scrollTo(0, 0);
    },

    /**
     * Apply dark mode
     */
    applyDarkMode() {
        if (DataManager.settings.darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            document.getElementById('darkModeToggle').textContent = '🌙';
        }
    },

    toggleDarkMode() {
        DataManager.updateSettings({ darkMode: !DataManager.settings.darkMode });
        this.applyDarkMode();
    },

    /**
     * Render plans list on home screen
     */
    renderPlans() {
        const container = document.getElementById('plansList');
        container.innerHTML = '';

        DataManager.plans.forEach(plan => {
            const card = document.createElement('div');
            card.className = 'plan-card';
            
            const exerciseCount = plan.planItems.length;
            const stretchCount = plan.coolDownStretches ? plan.coolDownStretches.length : 0;
            
            card.innerHTML = `
                <h3>${plan.name}</h3>
                <div class="exercise-count">
                    ${exerciseCount} exercises${stretchCount > 0 ? ` + ${stretchCount} stretches` : ''}
                </div>
            `;
            
            card.addEventListener('click', () => {
                App.selectPlan(plan.id);
            });
            
            container.appendChild(card);
        });
    },

    /**
     * Render pre-workout screen
     */
    renderPreWorkout(plan) {
        document.getElementById('preWorkoutPlanName').textContent = plan.name;
        const container = document.getElementById('preWorkoutExercises');
        container.innerHTML = '';

        plan.planItems.forEach((item, index) => {
            const exercise = DataManager.getExercise(item.exerciseId);
            if (!exercise) return;

            const div = document.createElement('div');
            div.className = 'exercise-config-item';
            
            const sets = item.sets !== undefined ? item.sets : exercise.defaultSets;
            const reps = item.reps !== undefined ? item.reps : exercise.defaultReps;
            const workSeconds = item.workSeconds !== undefined ? item.workSeconds : exercise.defaultWorkSeconds;
            const restSeconds = item.restSeconds !== undefined ? item.restSeconds : exercise.defaultRestSeconds;

            div.innerHTML = `
                <h4>${exercise.name}</h4>
                <div class="config-inputs">
                    <div class="config-input-group">
                        <label>Sets</label>
                        <input type="number" min="1" value="${sets}" onchange="App.updateOverride(${index}, 'sets', parseInt(this.value))">
                    </div>
                    <div class="config-input-group">
                        <label>Reps</label>
                        <input type="number" min="0" value="${reps}" onchange="App.updateOverride(${index}, 'reps', parseInt(this.value))">
                    </div>
                    ${workSeconds > 0 ? `
                    <div class="config-input-group">
                        <label>Work (sec)</label>
                        <input type="number" min="0" value="${workSeconds}" onchange="App.updateOverride(${index}, 'workSeconds', parseInt(this.value))">
                    </div>
                    ` : ''}
	                    <div class="config-input-group">
	                        <label>Rest (sec)</label>
	                        <input type="number" min="0" value="${restSeconds}" onchange="App.updateOverride(${index}, 'restSeconds', parseInt(this.value))">
	                    </div>
	                    <div class="config-input-group">
	                        <label>Rest After (sec)</label>
	                        <input type="number" min="0" value="${item.restAfterSeconds !== undefined ? item.restAfterSeconds : exercise.defaultRestAfterSeconds}" onchange="App.updateOverride(${index}, 'restAfterSeconds', parseInt(this.value))">
	                    </div>
	                </div>
	            `;
            
            container.appendChild(div);
        });
    },

    getPlanExercises(plan) {
        return plan.planItems;
    },

    renderSummary(session, workoutExercises) {
        const container = document.getElementById('summaryStats');
        container.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Duration</span>
                <span class="stat-value">${Utils.formatTime(session.duration)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Total Sets</span>
                <span class="stat-value">${session.totalSets}</span>
            </div>
        `;

        const coolDownList = document.getElementById('coolDownList');
        coolDownList.innerHTML = '';
        
        workoutExercises.forEach(item => {
            if (item.isStretch) {
                const li = document.createElement('li');
                li.textContent = item.exercise.name;
                coolDownList.appendChild(li);
            }
        });
    },

    /**
     * Render manage plans screen
     */
    renderManagePlans() {
        const container = document.getElementById('plansManageList');
        container.innerHTML = '';

        DataManager.plans.forEach(plan => {
            const div = document.createElement('div');
            div.className = 'manage-item';
            
            const exerciseCount = plan.planItems.length;
            const stretchCount = plan.coolDownStretches ? plan.coolDownStretches.length : 0;
            
            div.innerHTML = `
                <div class="manage-item-info">
                    <h4>${plan.name}</h4>
                    <p>${exerciseCount} exercises${stretchCount > 0 ? ` + ${stretchCount} stretches` : ''}</p>
                </div>
            `;
            
            div.addEventListener('click', () => {
                App.editPlan(plan.id);
            });
            
            container.appendChild(div);
        });
    },

    /**
     * Render manage exercises screen
     */
    renderManageExercises() {
        const container = document.getElementById('exercisesManageList');
        container.innerHTML = '';

        const usedIds = DataManager.getUsedExerciseIds();
        const categories = ['push', 'pull', 'legs', 'core', 'stretch'];
        const categoryNames = { push: 'Push', pull: 'Pull', legs: 'Legs', core: 'Core', stretch: 'Stretch' };

        categories.forEach(category => {
            const catExercises = DataManager.exercises.filter(e => e.category === category);
            if (catExercises.length === 0) return;

            const h3 = document.createElement('h3');
            h3.textContent = categoryNames[category];
            h3.style.marginTop = '1.5rem';
            container.appendChild(h3);

            catExercises.forEach(exercise => {
                const isUnused = !usedIds.has(exercise.id);
                const div = document.createElement('div');
                div.className = `manage-item ${isUnused ? 'unused-item' : ''}`;
                
                div.innerHTML = `
                    <div class="manage-item-info">
                        <h4>${exercise.name} ${isUnused ? '<span class="badge badge-warning">Unused</span>' : ''}</h4>
                        <p>${exercise.equipment || 'No equipment'}</p>
                    </div>
                `;
                
                div.addEventListener('click', () => {
                    App.editExercise(exercise.id);
                });
                
                container.appendChild(div);
            });
        });
    },

    /**
     * Render exercise select modal
     */
    renderExerciseSelect(callback, categoryFilter = null) {
        const modal = document.getElementById('exerciseSelectModal');
        const list = document.getElementById('exerciseSelectList');
        const searchInput = document.getElementById('exerciseSearchInput');
        
        const renderList = (filter = '') => {
            list.innerHTML = '';
            
            const filtered = DataManager.exercises.filter(e => {
                const matchesSearch = e.name.toLowerCase().includes(filter.toLowerCase()) || 
                                     (e.equipment && e.equipment.toLowerCase().includes(filter.toLowerCase()));
                
                let matchesCategory = true;
                if (categoryFilter) {
                    const allowedCategories = categoryFilter.split(',');
                    matchesCategory = allowedCategories.includes(e.category);
                }
                
                return matchesSearch && matchesCategory;
            });

            filtered.forEach(exercise => {
                const div = document.createElement('div');
                div.className = 'exercise-select-item';
                
                div.innerHTML = `
                    <h5>${exercise.name}</h5>
                    <p>${exercise.category} • ${exercise.equipment || 'bodyweight'}</p>
                `;
                
                div.addEventListener('click', () => {
                    callback(exercise.id);
                    modal.classList.remove('active');
                    searchInput.value = '';
                });
                
                list.appendChild(div);
            });
        };

        searchInput.value = '';
        searchInput.oninput = (e) => renderList(e.target.value);
        
        renderList();
        modal.classList.add('active');
        
        document.getElementById('closeExerciseModal').onclick = () => {
            modal.classList.remove('active');
        };
    },

    renderSettings() {
        const settings = DataManager.getSettings();
        document.getElementById('audioEnabledToggle').checked = settings.audioEnabled;
    },



    renderEquipmentTags(currentTags = '') {
        const container = document.getElementById('equipmentTagsList');
        container.innerHTML = '';

        const allTags = DataManager.getAllEquipmentTags();
        const activeTags = currentTags.split(',').map(t => t.trim().toLowerCase());

        allTags.forEach(tag => {
            const span = document.createElement('span');
            span.className = `tag-chip ${activeTags.includes(tag) ? 'active' : ''}`;
            span.textContent = tag;
            span.addEventListener('click', () => {
                const input = document.getElementById('exerciseEquipment');
                let tags = input.value.split(',').map(t => t.trim()).filter(t => t !== '');
                
                if (tags.map(t => t.toLowerCase()).includes(tag)) {
                    tags = tags.filter(t => t.toLowerCase() !== tag);
                } else {
                    tags.push(tag);
                }
                
                input.value = tags.join(', ');
                this.renderEquipmentTags(input.value);
            });
            container.appendChild(span);
        });
    }
};
