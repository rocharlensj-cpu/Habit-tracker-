@AGENTS.md

# Habit Tracker — Project Guide

## Project Overview

A React Native (Expo) habit tracking app for iOS and Android. Users can create habits, mark daily check-ins, and view streak progress with a 30-day calendar heatmap and stats dashboard.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native via Expo SDK 56 |
| Navigation | React Navigation 7 (bottom tabs + native stack) |
| State/Storage | React Context + useReducer + AsyncStorage |
| Date math | date-fns |
| Icons | @expo/vector-icons (MaterialIcons) |
| IDs | uuid v4 |

## Project Structure

```
/
├── App.js                        # Root: GestureHandlerRootView → HabitProvider → AppNavigator
├── app.json                      # Expo config (name, icons, orientations)
├── src/
│   ├── constants/
│   │   ├── colors.js             # Color palette + HabitColors array
│   │   └── index.js              # Re-exports + STORAGE_KEYS, HABIT_FREQUENCIES, HABIT_ICONS
│   ├── context/
│   │   └── HabitContext.js       # Global state via useReducer; exposes useHabits() hook
│   ├── navigation/
│   │   └── AppNavigator.js       # Bottom tabs (Habits, Stats) wrapping a native stack
│   ├── screens/
│   │   ├── HomeScreen.js         # Habit list with daily progress bar
│   │   ├── AddHabitScreen.js     # Create / edit a habit (name, color, icon)
│   │   ├── HabitDetailScreen.js  # Per-habit stats, week row, 30-day calendar
│   │   └── StatsScreen.js        # Aggregate stats across all habits
│   ├── components/
│   │   ├── HabitCard.js          # List item with inline check-in button + streak badge
│   │   ├── StreakCalendar.js      # 30-day dot grid calendar
│   │   ├── WeekRow.js            # 7-day interactive row (tap to toggle past days)
│   │   ├── StatCard.js           # Reusable metric tile
│   │   └── EmptyState.js         # Centered emoji + text placeholder
│   └── utils/
│       ├── storage.js            # AsyncStorage load/save helpers
│       └── streaks.js            # Streak calc, date helpers, completion rate
└── assets/                       # Expo icon + splash images
```

## Data Model

**Habit object** (stored in `@habit_tracker_habits`):
```js
{
  id: string,          // uuid v4
  name: string,
  description: string,
  color: string,       // hex from HabitColors
  icon: string,        // MaterialIcons name
  createdAt: string,   // ISO date string
}
```

**Check-ins object** (stored in `@habit_tracker_checkins`):
```js
{
  [habitId]: {
    [dateKey]: boolean,  // dateKey = 'yyyy-MM-dd'
  }
}
```

## Coding Conventions

### General
- Functional components only; no class components.
- Hooks over HOCs. All shared logic lives in `src/utils/` or `src/context/`.
- No comments unless the WHY is non-obvious. Self-documenting names are preferred.
- No TypeScript — plain JS throughout for Expo Go compatibility.

### State Management
- All habit/check-in state lives in `HabitContext`. Components read via `useHabits()`.
- Mutations go through named dispatcher helpers (`addHabit`, `toggleCheckIn`, etc.).
- Persist side-effects in `useEffect` blocks inside the provider, not in components.

### Styling
- All styles via `StyleSheet.create` at the bottom of each file.
- Colors imported from `src/constants/colors.js` — no raw hex strings in component files.
- Shadow applied with both `shadow*` props (iOS) and `elevation` (Android).

### Navigation
- Stack params: `{ habitId }` for detail screen, `{ habit }` for edit mode.
- Modal presentation used for Add/Edit screen.
- Navigation is never imported in context or utils — only in screen components.

### Storage
- All AsyncStorage calls go through `src/utils/storage.js`.
- JSON parse/stringify handled in the storage module, not in context.

### Date Keys
- All date-to-string conversion uses `dateKey(date)` from `src/utils/streaks.js` (format: `yyyy-MM-dd`).
- `todayKey()` is the single source of truth for "today."

## Running Locally

```bash
npm start          # Expo dev server (scan QR with Expo Go)
npm run android    # Android emulator
npm run ios        # iOS simulator (macOS only)
npm run web        # Web browser preview
```

## Adding a New Screen

1. Create `src/screens/YourScreen.js` with a `SafeAreaView` root.
2. Register it in `src/navigation/AppNavigator.js` (stack or tab).
3. Type-check params at the top: `const { paramName } = route.params;`

## Adding a New Habit Property

1. Add it to the habit object in `AddHabitScreen` form state.
2. Pass it through `addHabit` / `updateHabit`.
3. Update `HabitCard` and `HabitDetailScreen` to display it.
4. No migration needed — AsyncStorage is schema-less; missing fields resolve to `undefined`.
