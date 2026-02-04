// Data Layer - Business logic and default data

const DataManager = {
    exercises: [],
    plans: [],
    settings: {},

    /**
     * Initialize app data
     */
    init() {
        if (!Storage.isInitialized()) {
            // First run - seed with default data
            this.exercises = this.getDefaultExercises();
            this.plans = this.getDefaultPlans();
            this.settings = {
                darkMode: false,
                audioEnabled: true
            };
            
            this.saveAll();
            Storage.setInitialized();
        } else {
            // Load existing data
            this.exercises = Storage.getExercises();
            this.plans = Storage.getPlans();
            this.settings = Storage.getSettings();
        }
    },

    /**
     * Save all data to storage
     */
    saveAll() {
        Storage.saveExercises(this.exercises);
        Storage.savePlans(this.plans);
        Storage.saveSettings(this.settings);
    },

    /**
     * Get default exercises
     */
    getDefaultExercises() {
        return [
            // Push exercises
            { id: Utils.generateId(), name: 'Push-Ups (and Variations)', category: 'push', instructions: 'Wide/narrow/diamond; incline/decline; knee option for easier variation.', defaultSets: 3, defaultReps: 12, defaultWorkSeconds: 0, defaultRestSeconds: 60, defaultRestAfterSeconds: 90, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Dumbbell Floor Press', category: 'push', instructions: 'Lie on back, press dumbbells upward.', defaultSets: 3, defaultReps: 10, defaultWorkSeconds: 0, defaultRestSeconds: 90, defaultRestAfterSeconds: 90, equipment: 'dumbbells' },
            { id: Utils.generateId(), name: 'Overhead Dumbbell Press', category: 'push', instructions: 'Standing or seated, press dumbbells overhead.', defaultSets: 3, defaultReps: 10, defaultWorkSeconds: 0, defaultRestSeconds: 90, defaultRestAfterSeconds: 90, equipment: 'dumbbells' },
            { id: Utils.generateId(), name: 'Parallel Bar Dips', category: 'push', instructions: 'Lean forward for chest emphasis; upright for triceps.', defaultSets: 3, defaultReps: 8, defaultWorkSeconds: 0, defaultRestSeconds: 90, defaultRestAfterSeconds: 90, equipment: 'parallel bars' },
            { id: Utils.generateId(), name: 'Dumbbell Lateral/Front Raises', category: 'push', instructions: 'Isolation exercise for shoulders - raise dumbbells to side or front.', defaultSets: 3, defaultReps: 12, defaultWorkSeconds: 0, defaultRestSeconds: 60, defaultRestAfterSeconds: 90, equipment: 'dumbbells' },
            { id: Utils.generateId(), name: 'Bodyweight Triceps Dips / Bench Dips', category: 'push', instructions: 'Feet outstretched to isolate triceps.', defaultSets: 3, defaultReps: 12, defaultWorkSeconds: 0, defaultRestSeconds: 60, defaultRestAfterSeconds: 90, equipment: 'bench' },

            // Pull exercises
            { id: Utils.generateId(), name: 'Pull-Ups / Chin-Ups', category: 'pull', instructions: 'Assisted or negative reps allowed if needed.', defaultSets: 3, defaultReps: 8, defaultWorkSeconds: 0, defaultRestSeconds: 90, defaultRestAfterSeconds: 90, equipment: 'pull-up bar' },
            { id: Utils.generateId(), name: 'Inverted Rows', category: 'pull', instructions: 'Under low bar, pull chest to bar.', defaultSets: 3, defaultReps: 10, defaultWorkSeconds: 0, defaultRestSeconds: 60, defaultRestAfterSeconds: 90, equipment: 'low bar' },
            { id: Utils.generateId(), name: 'One-Arm Dumbbell Row', category: 'pull', instructions: 'Bench or chair support, or free stance. Row dumbbell to hip.', defaultSets: 3, defaultReps: 10, defaultWorkSeconds: 0, defaultRestSeconds: 60, defaultRestAfterSeconds: 90, equipment: 'dumbbells, bench' },
            { id: Utils.generateId(), name: 'Renegade Rows', category: 'pull', instructions: 'Plank position with dumbbells, row each arm alternately. Optional push-up between rows.', defaultSets: 3, defaultReps: 10, defaultWorkSeconds: 0, defaultRestSeconds: 90, defaultRestAfterSeconds: 90, equipment: 'dumbbells' },
            { id: Utils.generateId(), name: 'Dumbbell Biceps Curls', category: 'pull', instructions: 'Classic curl. Include hammer curl variation for variety.', defaultSets: 3, defaultReps: 12, defaultWorkSeconds: 0, defaultRestSeconds: 60, defaultRestAfterSeconds: 90, equipment: 'dumbbells' },
            { id: Utils.generateId(), name: 'Dumbbell Bent-Over Reverse Fly', category: 'pull', instructions: 'Target rear delts and rhomboids. Bend forward, raise dumbbells to sides.', defaultSets: 3, defaultReps: 12, defaultWorkSeconds: 0, defaultRestSeconds: 60, defaultRestAfterSeconds: 90, equipment: 'dumbbells' },
            { id: Utils.generateId(), name: 'Superman / Back Extensions', category: 'pull', instructions: 'Lower back focus. Lie face down, lift arms and legs simultaneously.', defaultSets: 3, defaultReps: 15, defaultWorkSeconds: 0, defaultRestSeconds: 60, defaultRestAfterSeconds: 90, equipment: 'bodyweight' },

            // Leg exercises
            { id: Utils.generateId(), name: 'Squats', category: 'legs', instructions: 'Bodyweight or goblet squat. Tempo and single-leg options available.', defaultSets: 3, defaultReps: 12, defaultWorkSeconds: 0, defaultRestSeconds: 90, defaultRestAfterSeconds: 90, equipment: 'bodyweight, dumbbells' },
            { id: Utils.generateId(), name: 'Lunges', category: 'legs', instructions: 'Forward/reverse; lateral/curtsy options for variety.', defaultSets: 3, defaultReps: 10, defaultWorkSeconds: 0, defaultRestSeconds: 60, defaultRestAfterSeconds: 90, equipment: 'bodyweight, dumbbells' },
            { id: Utils.generateId(), name: 'Bulgarian Split Squats', category: 'legs', instructions: 'Rear foot elevated on bench or chair.', defaultSets: 3, defaultReps: 10, defaultWorkSeconds: 0, defaultRestSeconds: 90, defaultRestAfterSeconds: 90, equipment: 'bench, dumbbells' },
            { id: Utils.generateId(), name: 'Glute Bridges / Hip Thrusts', category: 'legs', instructions: 'Optional dumbbell on hips. Single-leg option for advanced.', defaultSets: 3, defaultReps: 15, defaultWorkSeconds: 0, defaultRestSeconds: 60, defaultRestAfterSeconds: 90, equipment: 'bodyweight, dumbbells' },
            { id: Utils.generateId(), name: 'Dumbbell Romanian Deadlift', category: 'legs', instructions: 'Hip hinge movement, maintain neutral back.', defaultSets: 3, defaultReps: 10, defaultWorkSeconds: 0, defaultRestSeconds: 90, defaultRestAfterSeconds: 90, equipment: 'dumbbells' },
            { id: Utils.generateId(), name: 'Calf Raises', category: 'legs', instructions: 'Single or both legs. Optional dumbbell for added load.', defaultSets: 3, defaultReps: 15, defaultWorkSeconds: 0, defaultRestSeconds: 45, defaultRestAfterSeconds: 90, equipment: 'bodyweight, dumbbells' },

            // Core exercises
            { id: Utils.generateId(), name: 'Plank (Front)', category: 'core', instructions: 'Hold front plank position, maintain straight body line.', defaultSets: 3, defaultReps: 0, defaultWorkSeconds: 45, defaultRestSeconds: 45, defaultRestAfterSeconds: 90, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Side Plank', category: 'core', instructions: 'Hold side plank position on each side.', defaultSets: 3, defaultReps: 0, defaultWorkSeconds: 30, defaultRestSeconds: 45, defaultRestAfterSeconds: 90, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Crunches / Sit-ups', category: 'core', instructions: 'Classic abdominal exercise.', defaultSets: 3, defaultReps: 15, defaultWorkSeconds: 0, defaultRestSeconds: 45, defaultRestAfterSeconds: 90, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Leg Raises', category: 'core', instructions: 'Lie on back, raise legs to 90 degrees and lower slowly.', defaultSets: 3, defaultReps: 12, defaultWorkSeconds: 0, defaultRestSeconds: 60, defaultRestAfterSeconds: 90, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Russian Twists', category: 'core', instructions: 'Seated position, twist torso side to side. Optional dumbbell for resistance.', defaultSets: 3, defaultReps: 20, defaultWorkSeconds: 0, defaultRestSeconds: 45, defaultRestAfterSeconds: 90, equipment: 'bodyweight, dumbbells' },
            { id: Utils.generateId(), name: 'Bird-Dog', category: 'core', instructions: 'On hands and knees, extend opposite arm and leg simultaneously.', defaultSets: 3, defaultReps: 10, defaultWorkSeconds: 0, defaultRestSeconds: 45, defaultRestAfterSeconds: 90, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Dead Bugs', category: 'core', instructions: 'Lie on back, extend opposite arm and leg while keeping core engaged.', defaultSets: 3, defaultReps: 10, defaultWorkSeconds: 0, defaultRestSeconds: 45, defaultRestAfterSeconds: 90, equipment: 'bodyweight' },

            // Stretches
            { id: Utils.generateId(), name: 'Doorway Chest Stretch', category: 'stretch', instructions: 'Place forearm on doorframe, gently lean forward to stretch chest.', defaultSets: 1, defaultReps: 0, defaultWorkSeconds: 30, defaultRestSeconds: 0, defaultRestAfterSeconds: 0, equipment: 'doorway' },
            { id: Utils.generateId(), name: 'Cross-Body Shoulder Stretch', category: 'stretch', instructions: 'Pull arm across body to stretch shoulder.', defaultSets: 1, defaultReps: 0, defaultWorkSeconds: 30, defaultRestSeconds: 0, defaultRestAfterSeconds: 0, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Overhead Triceps Stretch', category: 'stretch', instructions: 'Raise arm overhead, bend elbow, pull elbow with other hand.', defaultSets: 1, defaultReps: 0, defaultWorkSeconds: 30, defaultRestSeconds: 0, defaultRestAfterSeconds: 0, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Tall Kneeling Lat Stretch', category: 'stretch', instructions: 'Kneeling position, reach arms forward and down to stretch lats.', defaultSets: 1, defaultReps: 0, defaultWorkSeconds: 30, defaultRestSeconds: 0, defaultRestAfterSeconds: 0, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Child\'s Pose', category: 'stretch', instructions: 'Kneel and sit back on heels, extend arms forward on ground.', defaultSets: 1, defaultReps: 0, defaultWorkSeconds: 45, defaultRestSeconds: 0, defaultRestAfterSeconds: 0, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Doorway / Biceps Wall Stretch', category: 'stretch', instructions: 'Place palm on wall behind you, gently turn away to stretch biceps.', defaultSets: 1, defaultReps: 0, defaultWorkSeconds: 30, defaultRestSeconds: 0, defaultRestAfterSeconds: 0, equipment: 'wall' },
            { id: Utils.generateId(), name: 'Standing Quad Stretch', category: 'stretch', instructions: 'Stand on one leg, pull other foot to glutes to stretch quads.', defaultSets: 1, defaultReps: 0, defaultWorkSeconds: 30, defaultRestSeconds: 0, defaultRestAfterSeconds: 0, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Hamstring Stretch (Seated or Forward Fold)', category: 'stretch', instructions: 'Reach toward toes to stretch hamstrings.', defaultSets: 1, defaultReps: 0, defaultWorkSeconds: 30, defaultRestSeconds: 0, defaultRestAfterSeconds: 0, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Calf Wall Stretch', category: 'stretch', instructions: 'Place hands on wall, step one foot back, press heel down to stretch calf.', defaultSets: 1, defaultReps: 0, defaultWorkSeconds: 30, defaultRestSeconds: 0, defaultRestAfterSeconds: 0, equipment: 'wall' },
            { id: Utils.generateId(), name: 'Figure-4 / Glute Stretch', category: 'stretch', instructions: 'Lie on back, cross ankle over opposite knee, pull knee toward chest.', defaultSets: 1, defaultReps: 0, defaultWorkSeconds: 30, defaultRestSeconds: 0, defaultRestAfterSeconds: 0, equipment: 'bodyweight' },
            { id: Utils.generateId(), name: 'Spinal Twist', category: 'stretch', instructions: 'Lie on back, drop knees to one side while keeping shoulders flat.', defaultSets: 1, defaultReps: 0, defaultWorkSeconds: 30, defaultRestSeconds: 0, defaultRestAfterSeconds: 0, equipment: 'bodyweight' }
        ];
    },

    /**
     * Get default plans
     */
    getDefaultPlans() {
        const exercises = this.exercises;
        const findExercise = (name) => exercises.find(e => e.name === name);

        return [
            {
                id: Utils.generateId(),
                name: 'Push Day (Chest, Shoulders, Triceps)',
                description: 'Target muscles: pecs, deltoids (front/middle), triceps',
                planItems: [
                    { exerciseId: findExercise('Push-Ups (and Variations)').id },
                    { exerciseId: findExercise('Dumbbell Floor Press').id },
                    { exerciseId: findExercise('Overhead Dumbbell Press').id },
                    { exerciseId: findExercise('Parallel Bar Dips').id },
                    { exerciseId: findExercise('Dumbbell Lateral/Front Raises').id },
                    { exerciseId: findExercise('Bodyweight Triceps Dips / Bench Dips').id }
                ],
                coolDownStretches: [
                    findExercise('Doorway Chest Stretch').id,
                    findExercise('Cross-Body Shoulder Stretch').id,
                    findExercise('Overhead Triceps Stretch').id
                ]
            },
            {
                id: Utils.generateId(),
                name: 'Pull Day (Back, Biceps)',
                description: 'Target muscles: latissimus dorsi, rhomboids, trapezius, biceps, forearms',
                planItems: [
                    { exerciseId: findExercise('Pull-Ups / Chin-Ups').id },
                    { exerciseId: findExercise('Inverted Rows').id },
                    { exerciseId: findExercise('One-Arm Dumbbell Row').id },
                    { exerciseId: findExercise('Renegade Rows').id },
                    { exerciseId: findExercise('Dumbbell Biceps Curls').id },
                    { exerciseId: findExercise('Dumbbell Bent-Over Reverse Fly').id },
                    { exerciseId: findExercise('Superman / Back Extensions').id }
                ],
                coolDownStretches: [
                    findExercise('Tall Kneeling Lat Stretch').id,
                    findExercise('Child\'s Pose').id,
                    findExercise('Doorway / Biceps Wall Stretch').id
                ]
            },
            {
                id: Utils.generateId(),
                name: 'Legs + Core Day',
                description: 'Target muscles: quadriceps, hamstrings, glutes, calves, abdominals',
                planItems: [
                    { exerciseId: findExercise('Squats').id },
                    { exerciseId: findExercise('Lunges').id },
                    { exerciseId: findExercise('Bulgarian Split Squats').id },
                    { exerciseId: findExercise('Glute Bridges / Hip Thrusts').id },
                    { exerciseId: findExercise('Dumbbell Romanian Deadlift').id },
                    { exerciseId: findExercise('Calf Raises').id },
                    { exerciseId: findExercise('Plank (Front)').id },
                    { exerciseId: findExercise('Side Plank').id },
                    { exerciseId: findExercise('Dead Bugs').id }
                ],
                coolDownStretches: [
                    findExercise('Standing Quad Stretch').id,
                    findExercise('Hamstring Stretch (Seated or Forward Fold)').id,
                    findExercise('Calf Wall Stretch').id,
                    findExercise('Figure-4 / Glute Stretch').id,
                    findExercise('Spinal Twist').id
                ]
            }
        ];
    },

    /**
     * Get IDs of all exercises used in any plan (including stretches)
     */
    getUsedExerciseIds() {
        const usedIds = new Set();
        this.plans.forEach(plan => {
            plan.planItems.forEach(item => usedIds.add(item.exerciseId));
            if (plan.coolDownStretches) {
                plan.coolDownStretches.forEach(id => usedIds.add(id));
            }
        });
        return usedIds;
    },

    /**
     * Get all unique equipment tags
     */
    getAllEquipmentTags() {
        const tags = new Set();
        this.exercises.forEach(e => {
            if (e.equipment) {
                e.equipment.split(',').forEach(tag => tags.add(tag.trim().toLowerCase()));
            }
        });
        return Array.from(tags).sort();
    },

    /**
     * Update settings
     */
    updateSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        Storage.saveSettings(this.settings);
    },

    /**
     * Get settings
     */
    getSettings() {
        return this.settings;
    },

    /**
     * Export all data as a JSON object
     */
    exportData() {
        return {
            exercises: this.exercises,
            plans: this.plans,
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '1.1'
        };
    },

    /**
     * Import data from a JSON object
     */
    importData(data) {
        if (!data || !data.exercises || !data.plans) {
            throw new Error('Invalid data format');
        }

        this.exercises = data.exercises;
        this.plans = data.plans;
        this.settings = data.settings || this.settings;

        this.saveAll();
        return true;
    },

    /**
     * Get a single exercise by ID
     */
    getExercise(id) {
        return this.exercises.find(e => e.id === id);
    },

    /**
     * Get a single plan by ID
     */
    getPlan(id) {
        return this.plans.find(p => p.id === id);
    },

    /**
     * Save or update an exercise
     */
    saveExercise(exercise) {
        const index = this.exercises.findIndex(e => e.id === exercise.id);
        if (index >= 0) {
            this.exercises[index] = exercise;
        } else {
            this.exercises.push(exercise);
        }
        Storage.saveExercises(this.exercises);
    },

    /**
     * Delete an exercise
     */
    deleteExercise(id) {
        this.exercises = this.exercises.filter(e => e.id !== id);
        Storage.saveExercises(this.exercises);
    },

    /**
     * Save or update a plan
     */
    savePlan(plan) {
        const index = this.plans.findIndex(p => p.id === plan.id);
        if (index >= 0) {
            this.plans[index] = plan;
        } else {
            this.plans.push(plan);
        }
        Storage.savePlans(this.plans);
    },

    /**
     * Delete a plan
     */
    deletePlan(id) {
        this.plans = this.plans.filter(p => p.id !== id);
        Storage.savePlans(this.plans);
    }
};
