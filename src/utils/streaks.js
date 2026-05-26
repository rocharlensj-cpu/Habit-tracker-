import { format, subDays } from 'date-fns';

export function todayKey() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function dateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

export function isCheckedToday(habitId, checkIns) {
  return !!(checkIns[habitId] && checkIns[habitId][todayKey()]);
}

export function calculateStreak(habitId, checkIns) {
  const habitCheckIns = checkIns[habitId] || {};
  let streak = 0;
  let current = new Date();

  // If not checked in today, start counting from yesterday
  if (!habitCheckIns[dateKey(current)]) {
    current = subDays(current, 1);
  }

  while (true) {
    const key = dateKey(current);
    if (!habitCheckIns[key]) break;
    streak++;
    current = subDays(current, 1);
  }

  return streak;
}

export function calculateLongestStreak(habitId, checkIns) {
  const habitCheckIns = checkIns[habitId] || {};
  const dates = Object.keys(habitCheckIns)
    .filter(k => habitCheckIns[k])
    .sort();

  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

export function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return { date: d, key: dateKey(d) };
  });
}

export function getLast30Days() {
  return Array.from({ length: 30 }, (_, i) => {
    const d = subDays(new Date(), 29 - i);
    return { date: d, key: dateKey(d) };
  });
}

export function completionRate(habitId, checkIns, days = 7) {
  const habitCheckIns = checkIns[habitId] || {};
  let count = 0;
  for (let i = 0; i < days; i++) {
    const key = dateKey(subDays(new Date(), i));
    if (habitCheckIns[key]) count++;
  }
  return Math.round((count / days) * 100);
}
