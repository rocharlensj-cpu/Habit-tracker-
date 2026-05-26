import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants';
import { calculateStreak, isCheckedToday } from '../utils/streaks';
import { useHabits } from '../context/HabitContext';

export default function HabitCard({ habit, onPress, onLongPress }) {
  const { checkIns, toggleCheckIn } = useHabits();
  const checked = isCheckedToday(habit.id, checkIns);
  const streak = calculateStreak(habit.id, checkIns, habit);
  const color = habit.color || Colors.primary;

  function handleCheck() {
    toggleCheckIn(habit.id);
  }

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.85}
    >
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={habit.icon || 'star'} size={24} color={color} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
        {habit.description ? (
          <Text style={styles.desc} numberOfLines={1}>{habit.description}</Text>
        ) : null}
        <View style={styles.meta}>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakFire}>🔥</Text>
              <Text style={styles.streakText}>{streak} day{streak !== 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.checkBtn, checked && { backgroundColor: Colors.success }]}
        onPress={handleCheck}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {checked ? (
          <MaterialIcons name="check" size={22} color="#fff" />
        ) : (
          <MaterialIcons name="radio-button-unchecked" size={22} color={Colors.textMuted} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.streakLight,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  streakFire: {
    fontSize: 12,
    marginRight: 2,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.streak,
  },
  checkBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt,
  },
});
