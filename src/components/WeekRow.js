import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Colors } from '../constants';
import { getLast7Days, todayKey, dateKey } from '../utils/streaks';
import { useHabits } from '../context/HabitContext';

export default function WeekRow({ habitId, color = Colors.primary }) {
  const { checkIns, toggleCheckIn } = useHabits();
  const days = getLast7Days();
  const today = todayKey();
  const habitCheckIns = checkIns[habitId] || {};

  return (
    <View style={styles.row}>
      {days.map(({ date, key }) => {
        const checked = !!habitCheckIns[key];
        const isToday = key === today;
        return (
          <TouchableOpacity
            key={key}
            style={styles.dayCol}
            onPress={() => toggleCheckIn(habitId, key)}
          >
            <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>
              {format(date, 'EEE')[0]}
            </Text>
            <View
              style={[
                styles.circle,
                checked && { backgroundColor: color },
                isToday && !checked && styles.todayCircle,
              ]}
            >
              <Text style={[styles.dayNum, checked && styles.dayNumChecked]}>
                {format(date, 'd')}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dayCol: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
    fontWeight: '600',
  },
  todayLabel: {
    color: Colors.primary,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt,
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  dayNum: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dayNumChecked: {
    color: '#fff',
  },
});
