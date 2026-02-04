# Strength Training Assistant

A local-first, offline-capable web application for tracking strength training workouts. No accounts, no cloud, no external APIs - all your data stays on your device.

## Features

### 💪 Pre-Built Workout Plans
- **Push Day**: Chest, Shoulders, Triceps (6 exercises)
- **Pull Day**: Back, Biceps (7 exercises)
- **Legs + Core Day**: Lower body and core work (9 exercises)

### 🏋️ Workout Runner
- Real-time workout guidance with exercise instructions
- Automatic rest timers between sets
- Work timers for timed exercises (planks, etc.)
- Progress tracking (exercise X of Y, set X of Y)
- Pause/resume functionality
- Skip exercises or go back to previous sets
- Keyboard shortcuts for desktop (Space, Enter, Backspace)

### 📊 Session Tracking
- Workout duration tracking
- Sets and reps completed
- Cool-down stretch recommendations
- Session history saved locally

### ⚙️ Full Customization
- **Manage Exercises**: Add, edit, or delete exercises
- **Manage Plans**: Create custom workout plans
- **Pre-Workout Config**: Adjust sets, reps, and rest times before each workout
- Drag-and-drop exercise ordering (in plan editor)

### 🎨 User Experience
- Responsive design (mobile and desktop)
- Dark mode toggle
- Clean, modern interface
- Audio cues when timers complete (optional)

### 💾 Data Management
- All data stored locally in browser (localStorage)
- Export data as JSON for backup
- Import data from JSON file
- No internet connection required after first load

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A simple HTTP server (for local development)

### Running Locally

#### Option 1: Python (Recommended)
```bash
cd strength-training-app
python3 -m http.server 8080
```
Then open http://localhost:8080 in your browser.

#### Option 2: Node.js
```bash
cd strength-training-app
npx serve
```

#### Option 3: Any Static Server
Use any static file server to serve the `strength-training-app` directory.

### Deployment
Simply upload all files to any static web hosting service (GitHub Pages, Netlify, Vercel, etc.). No build step required.

## File Structure

```
strength-training-app/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # All styles with dark mode support
├── js/
│   ├── utils.js        # Utility functions (UUID, time formatting, audio)
│   ├── storage.js      # localStorage wrapper
│   ├── data.js         # Data layer with default exercises and plans
│   ├── timer.js        # Accurate timer implementation
│   ├── ui.js           # UI rendering and navigation
│   └── app.js          # Main application controller
└── README.md           # This file
```

## Data Storage

All data is stored in your browser's localStorage under these keys:
- `sta_exercises` - Exercise definitions
- `sta_plans` - Workout plans
- `sta_sessions` - Workout history
- `sta_settings` - App settings (dark mode, audio)
- `sta_initialized` - First-run flag

**Location**: Browser's localStorage (typically in your browser's profile directory)

**Persistence**: Data persists across browser sessions but is tied to the specific browser and domain.

**Backup**: Use the Export feature in Settings to create JSON backups of all your data.

## Keyboard Shortcuts

When in workout mode:
- **Space**: Pause/Resume timer
- **Enter**: Complete current set and advance
- **Backspace**: Go back to previous set

## Default Workout Plans

### Push Day (Chest, Shoulders, Triceps)
Target muscles: pecs, deltoids (front/middle), triceps

Exercises:
1. Push-Ups (and Variations)
2. Dumbbell Floor Press
3. Overhead Dumbbell Press
4. Parallel Bar Dips
5. Dumbbell Lateral/Front Raises
6. Bodyweight Triceps Dips / Bench Dips

Cool-down stretches:
- Doorway Chest Stretch
- Cross-Body Shoulder Stretch
- Overhead Triceps Stretch

### Pull Day (Back, Biceps)
Target muscles: latissimus dorsi, rhomboids, trapezius, biceps, forearms

Exercises:
1. Pull-Ups / Chin-Ups
2. Inverted Rows
3. One-Arm Dumbbell Row
4. Renegade Rows
5. Dumbbell Biceps Curls
6. Dumbbell Bent-Over Reverse Fly
7. Superman / Back Extensions

Cool-down stretches:
- Tall Kneeling Lat Stretch or Child's Pose
- Doorway / Biceps Wall Stretch

### Legs + Core Day
Target muscles: quadriceps, hamstrings, gluteus maximus, calves, core

Leg exercises:
1. Squats
2. Lunges
3. Bulgarian Split Squats
4. Glute Bridges / Hip Thrusts
5. Dumbbell Romanian Deadlift
6. Calf Raises

Core exercises (3 selected by default):
- Plank (Front)
- Side Plank
- Crunches / Sit-ups
- Leg Raises
- Russian Twists
- Bird-Dog
- Dead Bugs

Cool-down stretches:
- Standing Quad Stretch
- Hamstring Stretch
- Calf Wall Stretch
- Figure-4 / Glute Stretch
- Spinal Twist
- Child's Pose

## Technical Implementation Notes

### Timer Accuracy
The timer uses timestamp-based calculations rather than just `setInterval` ticks, ensuring accurate timing even when the browser tab is backgrounded or the device goes to sleep.

### Unique IDs
All exercises and plans use UUID v4 for stable, collision-free identification.

### First-Run Seeding
On first run, the app automatically seeds default exercises and plans. After initialization, user edits are never overwritten.

### Offline Capability
The app is fully functional offline after the initial page load. All resources are loaded from local files, and all data operations use localStorage.

## Browser Compatibility

Tested and working on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires:
- ES6 JavaScript support
- localStorage API
- Web Audio API (for optional beep sounds)

## Privacy & Security

- **No tracking**: Zero analytics or tracking scripts
- **No external requests**: All resources are local
- **No accounts**: No login, no user accounts, no passwords
- **Local-only data**: All data stays in your browser
- **No cookies**: Uses localStorage only

## Customization

### Adding New Exercises
1. Go to "Manage Exercises"
2. Click "+ Add New Exercise"
3. Fill in the form with exercise details
4. Save

### Creating Custom Plans
1. Go to "Manage Plans"
2. Click "+ Add New Plan"
3. Name your plan
4. Add exercises from the library
5. Reorder as needed
6. Save

### Adjusting Workout Parameters
Before starting a workout, you can adjust:
- Number of sets
- Number of reps
- Work duration (for timed exercises)
- Rest duration between sets

## Troubleshooting

### Data Not Saving
- Check that your browser allows localStorage
- Ensure you're not in private/incognito mode
- Check browser storage quota

### Timer Not Working
- Ensure JavaScript is enabled
- Check browser console for errors
- Try refreshing the page

### Audio Not Playing
- Check that audio is enabled in Settings
- Ensure browser allows audio playback
- Some browsers require user interaction before playing audio

## License

This project is provided as-is for personal use. Feel free to modify and adapt to your needs.

## Version

**v1.0** - Initial release

## Credits

Built with vanilla HTML, CSS, and JavaScript - no frameworks, no dependencies, no bloat.
