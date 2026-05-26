import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants';
import { useHabits } from '../context/HabitContext';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import {
  calculateStreak,
  calculateLongestStreak,
  completionRate,
  isCheckedToday,
} from '../utils/streaks';

function HabitStatRow({ habit, checkIns }) {
  const color = habit.color || Colors.primary;
  const streak = calculateStreak(habit.id, checkIns);
  const rate = completionRate(habit.id, checkIns, 7);
  const checked = isCheckedToday(habit.id, checkIns);

  return (
    <View style={styles.habitRow}>
      <View style={[styles.rowIcon, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={habit.icon || 'star'} size={20} color={color} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{habit.name}</Text>
        <Text style={styles.rowMeta}>7-day rate: {rate}%</Text>
      </View>
      <View style={styles.rowRight}>
        {streak > 0 && (
          <Text style={styles.rowStreak}>🔥 {streak}</Text>
        )}
        {checked && (
          <MaterialIcons name="check-circle" size={18} color={Colors.success} style={{ marginTop: 2 }} />
        )}
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const { habits, checkIns } = useHabits();

  const { totalCompleted, bestStreak, avgRate } = useMemo(() => {
    let totalCompleted = 0;
    let bestStreak = 0;
    let totalRate = 0;

    habits.forEach(h => {
      if (isCheckedToday(h.id, checkIns)) totalCompleted++;
      const s = calculateStreak(h.id, checkIns);
      const l = calculateLongestStreak(h.id, checkIns);
      bestStreak = Math.max(bestStreak, l);
      totalRate += completionRate(h.id, checkIns, 7);
    });

    return {
      totalCompleted,
      bestStreak,
      avgRate: habits.length ? Math.round(totalRate / habits.length) : 0,
    };
  }, [habits, checkIns]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Stats</Text>

      {habits.length === 0 ? (
        <EmptyState
          emoji="📊"
          title="No data yet"
          subtitle="Add some habits and start tracking to see your stats here."
        />
      ) : (
        <>
          <View style={styles.statsRow}>
            <StatCard label="Done Today" value={`${totalCompleted}/${habits.length}`} icon="✅" color={Colors.success} />
            <StatCard label="Best Streak" value={`${bestStreak}🔥`} icon="🏆" color={Colors.streak} />
            <StatCard label="7-day Avg" value={`${avgRate}%`} icon="📈" color={Colors.primary} />
          </View>

          <Text style={styles.sectionTitle}>Habit Breakdown</Text>
          <FlatList
            data={habits}
            keyExtractor={h => h.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <HabitStatRow habit={item} checkIns={checkIns} />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  rowMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  rowStreak: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.streak,
  },
});
