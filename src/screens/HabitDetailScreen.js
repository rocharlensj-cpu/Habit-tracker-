import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants';
import { useHabits } from '../context/HabitContext';
import StreakCalendar from '../components/StreakCalendar';
import WeekRow from '../components/WeekRow';
import StatCard from '../components/StatCard';
import {
  calculateStreak,
  calculateLongestStreak,
  completionRate,
  isCheckedToday,
} from '../utils/streaks';

export default function HabitDetailScreen({ navigation, route }) {
  const { habitId } = route.params;
  const { habits, checkIns, toggleCheckIn } = useHabits();
  const habit = habits.find(h => h.id === habitId);

  if (!habit) return null;

  const color = habit.color || Colors.primary;
  const streak = calculateStreak(habitId, checkIns);
  const longest = calculateLongestStreak(habitId, checkIns);
  const rate7 = completionRate(habitId, checkIns, 7);
  const rate30 = completionRate(habitId, checkIns, 30);
  const checked = isCheckedToday(habitId, checkIns);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: color + '18' }]}>
          <View style={[styles.heroIcon, { backgroundColor: color + '30' }]}>
            <MaterialIcons name={habit.icon || 'star'} size={40} color={color} />
          </View>
          <Text style={[styles.heroName, { color }]}>{habit.name}</Text>
          {habit.description ? (
            <Text style={styles.heroDesc}>{habit.description}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.checkInBtn, { backgroundColor: checked ? Colors.success : color }]}
            onPress={() => toggleCheckIn(habitId)}
          >
            <MaterialIcons name={checked ? 'check-circle' : 'radio-button-unchecked'} size={22} color="#fff" />
            <Text style={styles.checkInBtnText}>
              {checked ? "Done for today!" : "Mark today's check-in"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard label="Current Streak" value={`${streak}🔥`} color={Colors.streak} />
          <StatCard label="Longest Streak" value={`${longest}`} color={Colors.primary} />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="7-day rate" value={`${rate7}%`} color={Colors.success} small />
          <StatCard label="30-day rate" value={`${rate30}%`} color={Colors.warning} small />
        </View>

        {/* Week view */}
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.card}>
          <WeekRow habitId={habitId} color={color} />
        </View>

        {/* Calendar */}
        <Text style={styles.sectionTitle}>Last 30 Days</Text>
        <StreakCalendar habitId={habitId} checkIns={checkIns} color={color} />

        {/* Edit button */}
        <TouchableOpacity
          style={[styles.editBtn, { borderColor: color }]}
          onPress={() => navigation.navigate('AddHabit', { habit })}
        >
          <MaterialIcons name="edit" size={18} color={color} />
          <Text style={[styles.editBtnText, { color }]}>Edit Habit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  hero: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkInBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
    marginTop: 6,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 8,
  },
  editBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
