/**
 * Main Application Controller
 */
const App = {
    currentPlan: null,
    currentSession: null,
    workoutExercises: [],
    currentExerciseIndex: 0,
    currentSet: 1,
    sessionOverrides: {},
    currentEditingExercise: null,
    currentEditingPlan: null,

    /**
     * Initialize the app
     */
    init() {
        DataManager.init();
        UI.init();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        UI.renderPlans();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Home screen
        document.getElementById('managePlansBtn').addEventListener('click', () => {
            UI.renderManagePlans();
            UI.showScreen('managePlansScreen');
        });

        document.getElementById('manageExercisesBtn').addEventListener('click', () => {
            UI.renderManageExercises();
            UI.showScreen('manageExercisesScreen');
        });



        document.getElementById('settingsBtn').addEventListener('click', () => {
            UI.renderSettings();
            UI.showScreen('settingsScreen');
        });

        document.getElementById('darkModeToggle').addEventListener('click', () => {
            UI.toggleDarkMode();
        });

        // Pre-workout screen
        document.getElementById('backToHome').addEventListener('click', () => {
            UI.showScreen('homeScreen');
        });

        document.getElementById('startWorkoutBtn').addEventListener('click', () => {
            this.startWorkout();
        });

        // Workout runner
        document.getElementById('pauseWorkoutBtn').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('completeSetBtn').addEventListener('click', () => {
            this.completeSet();
        });

        document.getElementById('nextSetBtn').addEventListener('click', () => {
            this.nextSet();
        });

        document.getElementById('prevSetBtn').addEventListener('click', () => {
            this.previousSet();
        });

        document.getElementById('skipExerciseBtn').addEventListener('click', () => {
            this.skipExercise();
        });

        document.getElementById('finishWorkoutBtn').addEventListener('click', () => {
            this.finishWorkout();
        });

        document.getElementById('restMinus10').addEventListener('click', () => {
            Timer.adjust(-10);
        });

        document.getElementById('restPlus10').addEventListener('click', () => {
            Timer.adjust(10);
        });

        // Summary screen
        document.getElementById('finishSessionBtn').addEventListener('click', () => {
            UI.showScreen('homeScreen');
        });

        // Manage plans
        document.getElementById('backToHomeFromPlans').addEventListener('click', () => {
            UI.showScreen('homeScreen');
        });

        document.getElementById('addPlanBtn').addEventListener('click', () => {
            this.createNewPlan();
        });

        // Manage exercises
        document.getElementById('backToHomeFromExercises').addEventListener('click', () => {
            UI.showScreen('homeScreen');
        });

        document.getElementById('addExerciseBtn').addEventListener('click', () => {
            this.createNewExercise();
        });

        // Back buttons for edit screens
        document.getElementById('backToManagePlans').addEventListener('click', () => {
            UI.renderManagePlans();
            UI.showScreen('managePlansScreen');
        });

        document.getElementById('backToManageExercises').addEventListener('click', () => {
            UI.renderManageExercises();
            UI.showScreen('manageExercisesScreen');
        });

        document.getElementById('backToHomeFromSettings').addEventListener('click', () => {
            UI.showScreen('homeScreen');
        });

        // Form submissions
        document.getElementById('editExerciseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveExercise();
        });

        document.getElementById('editPlanForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePlan();
        });

        document.getElementById('deleteExerciseBtn').addEventListener('click', () => {
            this.deleteExercise(this.currentEditingExercise.id);
        });

        document.getElementById('deletePlanBtn').addEventListener('click', () => {
            this.deletePlan(this.currentEditingPlan.id);
        });

        document.getElementById('addExerciseToPlan').addEventListener('click', () => {
            this.addExerciseToPlanForm();
        });

        document.getElementById('addStretchToPlan').addEventListener('click', () => {
            this.addStretchToPlanForm();
        });

        document.getElementById('exerciseEquipment').addEventListener('input', (e) => {
            UI.renderEquipmentTags(e.target.value);
        });

        // Settings
        document.getElementById('audioEnabledToggle').addEventListener('change', (e) => {
            DataManager.updateSettings({ audioEnabled: e.target.checked });
        });

        document.querySelectorAll('.exportDataBtn').forEach(btn => {
            btn.addEventListener('click', () => this.exportData());
        });

        document.querySelectorAll('.importDataBtn').forEach(btn => {
            btn.addEventListener('click', () => document.getElementById('importFileInput').click());
        });

        document.getElementById('importFileInput').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        document.getElementById('resetDataBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all data? This will delete all your custom plans and exercises.')) {
                Storage.clearAll();
                location.reload();
            }
        });
    },

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const currentScreen = document.querySelector('.screen.active');
            if (!currentScreen || currentScreen.id !== 'workoutScreen') return;

            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePause();
            } else if (e.code === 'Enter') {
                e.preventDefault();
                this.completeSet();
            } else if (e.code === 'Backspace') {
                e.preventDefault();
                this.previousSet();
            }
        });
    },

    // --- Workout Logic ---

    selectPlan(id) {
        this.currentPlan = DataManager.getPlan(id);
        if (this.currentPlan) {
            this.sessionOverrides = {};
            UI.renderPreWorkout(this.currentPlan);
            UI.showScreen('preWorkoutScreen');
        }
    },

    updateOverride(index, field, value) {
        if (!this.sessionOverrides[index]) {
            this.sessionOverrides[index] = {};
        }
        this.sessionOverrides[index][field] = value;
    },

    startWorkout() {
        // Build workout exercises list
        this.workoutExercises = [];
        const planExercises = UI.getPlanExercises(this.currentPlan);
        
        // Add main exercises
        planExercises.forEach((item, index) => {
            const exercise = DataManager.getExercise(item.exerciseId);
            if (!exercise) return;

            const overrides = this.sessionOverrides[index] || {};
            
            this.workoutExercises.push({
                exercise: exercise,
                sets: overrides.sets !== undefined ? overrides.sets : (item.sets !== undefined ? item.sets : exercise.defaultSets),
                reps: overrides.reps !== undefined ? overrides.reps : (item.reps !== undefined ? item.reps : exercise.defaultReps),
                workSeconds: overrides.workSeconds !== undefined ? overrides.workSeconds : (item.workSeconds !== undefined ? item.workSeconds : exercise.defaultWorkSeconds),
	                restSeconds: overrides.restSeconds !== undefined ? overrides.restSeconds : (item.restSeconds !== undefined ? item.restSeconds : exercise.defaultRestSeconds),
	                restAfterSeconds: overrides.restAfterSeconds !== undefined ? overrides.restAfterSeconds : (item.restAfterSeconds !== undefined ? item.restAfterSeconds : exercise.defaultRestAfterSeconds),
	                completedSets: 0,
                isStretch: false,
                weights: []
            });
        });

        // Add cool-down stretches at the end
        if (this.currentPlan.coolDownStretches) {
            this.currentPlan.coolDownStretches.forEach(stretchId => {
                const stretch = DataManager.getExercise(stretchId);
                if (stretch) {
                    this.workoutExercises.push({
                        exercise: stretch,
                        sets: stretch.defaultSets || 1,
                        reps: stretch.defaultReps || 0,
                        workSeconds: stretch.defaultWorkSeconds || 30,
                        restSeconds: stretch.defaultRestSeconds || 0,
                        restAfterSeconds: 0,
                        completedSets: 0,
                        isStretch: true,
                        weights: []
                    });
                }
            });
        }

        // Initialize session
        this.currentSession = {
            id: Utils.generateId(),
            planId: this.currentPlan.id,
            date: new Date().toISOString(),
            startTime: Date.now(),
            exercises: [],
            totalSets: 0,
            completed: false
        };

        this.currentExerciseIndex = 0;
        this.currentSet = 1;

        UI.showScreen('workoutScreen');
        this.updateWorkoutDisplay();
    },

    updateWorkoutDisplay() {
        const current = this.workoutExercises[this.currentExerciseIndex];
        if (!current) return;

        // Progress bar
        const totalSetsInWorkout = this.workoutExercises.reduce((acc, ex) => acc + ex.sets, 0);
        const completedSetsInWorkout = this.workoutExercises.slice(0, this.currentExerciseIndex).reduce((acc, ex) => acc + ex.sets, 0) + (this.currentSet - 1);
        const progressPercent = (completedSetsInWorkout / totalSetsInWorkout) * 100;
        document.getElementById('workoutProgressBarFill').style.width = `${progressPercent}%`;

        document.getElementById('currentExerciseNum').textContent = this.currentExerciseIndex + 1;
        document.getElementById('totalExercises').textContent = this.workoutExercises.length;
        document.getElementById('currentExerciseName').textContent = (current.isStretch ? '🧘 ' : '') + current.exercise.name;
        document.getElementById('currentExerciseInstructions').textContent = current.exercise.instructions || '';
        document.getElementById('currentSet').textContent = this.currentSet;
        document.getElementById('totalSets').textContent = current.sets;

        // Weight input
        const weightInput = document.getElementById('currentWeight');
        weightInput.value = (current.weights && current.weights[this.currentSet - 1]) || '';

        // Set target display
        const targetEl = document.getElementById('setTarget');
        if (current.workSeconds > 0) {
            targetEl.textContent = `${current.workSeconds}s work`;
        } else {
            targetEl.textContent = `${current.reps} reps`;
        }

        // Update timer display
        if (Timer.isActive) {
            document.getElementById('timerDisplay').classList.add('active');
            document.getElementById('completeSetBtn').textContent = 'Skip Rest';
            document.getElementById('restAdjustControls').style.display = 'flex';
            
            // Next preview
            const nextIdx = this.currentExerciseIndex + 1;
            if (this.currentSet === current.sets && nextIdx < this.workoutExercises.length) {
                document.getElementById('nextExercisePreview').style.display = 'block';
                document.getElementById('nextExerciseName').textContent = this.workoutExercises[nextIdx].exercise.name;
            } else {
                document.getElementById('nextExercisePreview').style.display = 'none';
            }
        } else {
            document.getElementById('timerDisplay').classList.remove('active');
            document.getElementById('completeSetBtn').textContent = 'Complete Set';
            document.getElementById('timerValue').textContent = '00:00';
            document.getElementById('timerLabel').textContent = 'Rest';
            document.getElementById('restAdjustControls').style.display = 'none';
            document.getElementById('nextExercisePreview').style.display = 'none';
        }
    },

    completeSet() {
        const current = this.workoutExercises[this.currentExerciseIndex];
        
        if (Timer.isActive) {
            Timer.stop();
            this.advanceWorkout();
        } else {
            // Save weight
            const weight = document.getElementById('currentWeight').value;
            if (weight) {
                current.weights[this.currentSet - 1] = weight;
            }

            current.completedSets++;
            this.currentSession.totalSets++;
            
            // Record in session
            if (!this.currentSession.exercises[this.currentExerciseIndex]) {
                this.currentSession.exercises[this.currentExerciseIndex] = {
                    exerciseId: current.exercise.id,
                    sets: []
                };
            }
            this.currentSession.exercises[this.currentExerciseIndex].sets.push({
                reps: current.reps,
                weight: weight || null
            });

            if (current.completedSets < current.sets) {
                this.startRest(current.restSeconds);
            } else {
                if (current.restAfterSeconds > 0 && this.currentExerciseIndex < this.workoutExercises.length - 1) {
                    this.startRest(current.restAfterSeconds, true);
                } else {
                    this.nextExercise();
                }
            }
        }
    },

    startRest(seconds, isAfterLastSet = false) {
        Timer.start(seconds, (remaining) => {
            document.getElementById('timerValue').textContent = Utils.formatTime(remaining);
        }, () => {
            if (DataManager.getSettings().audioEnabled) {
                Utils.playBeep();
            }
            if (isAfterLastSet) {
                this.nextExercise();
            } else {
                this.nextSet();
            }
        });
        this.updateWorkoutDisplay();
    },

    advanceWorkout() {
        const current = this.workoutExercises[this.currentExerciseIndex];
        if (current.completedSets < current.sets) {
            this.nextSet();
        } else {
            this.nextExercise();
        }
    },

    nextSet() {
        this.currentSet++;
        this.updateWorkoutDisplay();
    },

    nextExercise() {
        this.currentExerciseIndex++;
        if (this.currentExerciseIndex < this.workoutExercises.length) {
            this.currentSet = 1;
            this.updateWorkoutDisplay();
        } else {
            this.finishWorkout();
        }
    },

    previousSet() {
        Timer.stop();
        if (this.currentSet > 1) {
            this.currentSet--;
            this.workoutExercises[this.currentExerciseIndex].completedSets--;
            this.currentSession.totalSets--;
        } else if (this.currentExerciseIndex > 0) {
            this.currentExerciseIndex--;
            this.currentSet = this.workoutExercises[this.currentExerciseIndex].sets;
            this.workoutExercises[this.currentExerciseIndex].completedSets--;
            this.currentSession.totalSets--;
        }
        this.updateWorkoutDisplay();
    },

    skipExercise() {
        if (confirm('Skip this exercise?')) {
            Timer.stop();
            this.nextExercise();
        }
    },

    togglePause() {
        if (Timer.isActive) {
            Timer.togglePause();
            document.getElementById('pauseWorkoutBtn').textContent = Timer.isPaused ? 'Resume' : 'Pause';
        }
    },

    finishWorkout() {
        Timer.stop();
        this.currentSession.endTime = Date.now();
        this.currentSession.duration = Math.floor((this.currentSession.endTime - this.currentSession.startTime) / 1000);
        this.currentSession.completed = true;
        
        UI.renderSummary(this.currentSession, this.workoutExercises);
        UI.showScreen('summaryScreen');
    },

    // --- Management Logic ---

    createNewExercise() {
        this.currentEditingExercise = {
            id: Utils.generateId(),
            name: '',
            category: 'push',
            instructions: '',
            defaultSets: 3,
            defaultReps: 12,
            defaultWorkSeconds: 0,
            defaultRestSeconds: 60,
            defaultRestAfterSeconds: 90,
            equipment: ''
        };
        this.showExerciseForm();
    },

    editExercise(id) {
        this.currentEditingExercise = { ...DataManager.getExercise(id) };
        this.showExerciseForm();
    },

    showExerciseForm() {
        document.getElementById('editExerciseTitle').textContent = 
            this.currentEditingExercise.name ? 'Edit Exercise' : 'Create Exercise';
        document.getElementById('exerciseName').value = this.currentEditingExercise.name;
        document.getElementById('exerciseCategory').value = this.currentEditingExercise.category;
        document.getElementById('exerciseInstructions').value = this.currentEditingExercise.instructions || '';
        document.getElementById('exerciseDefaultSets').value = this.currentEditingExercise.defaultSets;
        document.getElementById('exerciseDefaultReps').value = this.currentEditingExercise.defaultReps;
        document.getElementById('exerciseWorkSeconds').value = this.currentEditingExercise.defaultWorkSeconds || 0;
        document.getElementById('exerciseRest').value = this.currentEditingExercise.defaultRestSeconds || 60;
        document.getElementById('exerciseRestAfter').value = this.currentEditingExercise.defaultRestAfterSeconds || 90;
        document.getElementById('exerciseEquipment').value = this.currentEditingExercise.equipment || '';
        
        UI.renderEquipmentTags(this.currentEditingExercise.equipment || '');
        UI.showScreen('editExerciseScreen');
    },

    saveExercise() {
        const exerciseData = {
            id: this.currentEditingExercise.id,
            name: document.getElementById('exerciseName').value,
            category: document.getElementById('exerciseCategory').value,
            instructions: document.getElementById('exerciseInstructions').value,
            defaultSets: parseInt(document.getElementById('exerciseDefaultSets').value),
            defaultReps: parseInt(document.getElementById('exerciseDefaultReps').value),
            defaultWorkSeconds: parseInt(document.getElementById('exerciseWorkSeconds').value),
            defaultRestSeconds: parseInt(document.getElementById('exerciseRest').value),
            defaultRestAfterSeconds: parseInt(document.getElementById('exerciseRestAfter').value),
            equipment: document.getElementById('exerciseEquipment').value
        };
        DataManager.saveExercise(exerciseData);
        UI.renderManageExercises();
        UI.showScreen('manageExercisesScreen');
    },

    deleteExercise(id) {
        if (confirm('Delete this exercise? It will be removed from all plans.')) {
            DataManager.deleteExercise(id);
            UI.renderManageExercises();
            UI.showScreen('manageExercisesScreen');
        }
    },

    createNewPlan() {
        this.currentEditingPlan = {
            id: Utils.generateId(),
            name: 'New Plan',
            description: '',
            planItems: [],
            coolDownStretches: []
        };
        this.showPlanForm();
    },

    editPlan(id) {
        this.currentEditingPlan = JSON.parse(JSON.stringify(DataManager.getPlan(id)));
        this.showPlanForm();
    },

    showPlanForm() {
        document.getElementById('editPlanTitle').textContent = 
            this.currentEditingPlan.name === 'New Plan' ? 'Create Plan' : 'Edit Plan';
        document.getElementById('planName').value = this.currentEditingPlan.name;
        this.renderPlanExercisesList();
        this.renderPlanStretchesList();
        UI.showScreen('editPlanScreen');
    },

    renderPlanExercisesList() {
        const container = document.getElementById('planExercisesList');
        container.innerHTML = '';

        this.currentEditingPlan.planItems.forEach((item, index) => {
            const exercise = DataManager.getExercise(item.exerciseId);
            if (!exercise) return;

            const div = document.createElement('div');
            div.className = 'plan-exercise-item';
            div.draggable = true;
            
            div.innerHTML = `
                <div class="drag-handle">⋮⋮</div>
                <div class="plan-exercise-info">
                    <h5>${exercise.name}</h5>
                    <p>${exercise.category}</p>
                </div>
                <div class="plan-exercise-actions">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="App.removePlanExercise(${index})">Remove</button>
                </div>
            `;

            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                div.classList.add('dragging');
            });
            div.addEventListener('dragend', () => div.classList.remove('dragging'));
            div.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingItem = container.querySelector('.dragging');
                const nextItem = this.getDragNextItem(container, e.clientY);
                if (nextItem) container.insertBefore(draggingItem, nextItem);
                else container.appendChild(draggingItem);
            });
            div.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = Array.from(container.children).indexOf(div);
                const [movedItem] = this.currentEditingPlan.planItems.splice(fromIndex, 1);
                this.currentEditingPlan.planItems.splice(toIndex, 0, movedItem);
                this.renderPlanExercisesList();
            });
            
            container.appendChild(div);
        });
    },

    getDragNextItem(container, y) {
        const draggableElements = [...container.querySelectorAll('.plan-exercise-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
            else return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    },

    renderPlanStretchesList() {
        const container = document.getElementById('planStretchesList');
        container.innerHTML = '';
        this.currentEditingPlan.coolDownStretches.forEach((stretchId, index) => {
            const exercise = DataManager.getExercise(stretchId);
            if (!exercise) return;
            const div = document.createElement('div');
            div.className = 'plan-exercise-item';
            div.innerHTML = `
                <div class="plan-exercise-info"><h5>${exercise.name}</h5></div>
                <div class="plan-exercise-actions">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="App.removePlanStretch(${index})">Remove</button>
                </div>
            `;
            container.appendChild(div);
        });
    },

    addExerciseToPlanForm() {
        UI.renderExerciseSelect((id) => {
            this.currentEditingPlan.planItems.push({ exerciseId: id });
            this.renderPlanExercisesList();
        }, 'push,pull,legs,core');
    },

    addStretchToPlanForm() {
        UI.renderExerciseSelect((id) => {
            this.currentEditingPlan.coolDownStretches.push(id);
            this.renderPlanStretchesList();
        }, 'stretch');
    },

    removePlanExercise(index) {
        this.currentEditingPlan.planItems.splice(index, 1);
        this.renderPlanExercisesList();
    },

    removePlanStretch(index) {
        this.currentEditingPlan.coolDownStretches.splice(index, 1);
        this.renderPlanStretchesList();
    },

    savePlan() {
        this.currentEditingPlan.name = document.getElementById('planName').value;
        DataManager.savePlan(this.currentEditingPlan);
        UI.renderPlans();
        UI.renderManagePlans();
        UI.showScreen('managePlansScreen');
    },

    deletePlan(id) {
        if (confirm('Delete this plan?')) {
            DataManager.deletePlan(id);
            UI.renderPlans();
            UI.renderManagePlans();
            UI.showScreen('managePlansScreen');
        }
    },

    // --- Data ---

    exportData() {
        const data = DataManager.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        a.download = `strength_training_backup_${timestamp}.json`;
        a.click();
    },

    importData(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (DataManager.importData(data)) {
                    alert('Data imported successfully!');
                    location.reload();
                } else {
                    alert('Invalid backup file.');
                }
            } catch (err) {
                alert('Error reading file.');
            }
        };
        reader.readAsText(file);
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => App.init());
