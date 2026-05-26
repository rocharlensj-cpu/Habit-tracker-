import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Colors } from '../constants';
import { getLast30Days } from '../utils/streaks';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function StreakCalendar({ habitId, checkIns, color = Colors.primary }) {
  const days = getLast30Days();
  const habitCheckIns = checkIns[habitId] || {};

  const weeks = [];
  let week = [];

  // Pad the first week with blanks
  const firstDow = days[0].date.getDay();
  for (let i = 0; i < firstDow; i++) {
    week.push(null);
  }

  days.forEach(({ date, key }) => {
    week.push({ date, key, checked: !!habitCheckIns[key] });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return (
    <View style={styles.container}>
      <View style={styles.dayLabels}>
        {DAY_LABELS.map(d => (
          <Text key={d} style={styles.dayLabel}>{d}</Text>
        ))}
      </View>
      {weeks.map((w, wi) => (
        <View key={wi} style={styles.week}>
          {w.map((day, di) => (
            <View key={di} style={styles.dayCell}>
              {day ? (
                <View
                  style={[
                    styles.dot,
                    day.checked
                      ? { backgroundColor: color }
                      : { backgroundColor: Colors.border },
                  ]}
                />
              ) : (
                <View style={[styles.dot, { backgroundColor: 'transparent' }]} />
              )}
            </View>
          ))}
        </View>
      ))}
      <View style={styles.legend}>
        <View style={[styles.legendDot, { backgroundColor: Colors.border }]} />
        <Text style={styles.legendText}>Missed</Text>
        <View style={[styles.legendDot, { backgroundColor: color, marginLeft: 12 }]} />
        <Text style={styles.legendText}>Completed</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  dayLabels: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  week: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
