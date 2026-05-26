import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Colors } from '../constants';
import { useHabits } from '../context/HabitContext';
import HabitCard from '../components/HabitCard';
import EmptyState from '../components/EmptyState';
import { isCheckedToday } from '../utils/streaks';

export default function HomeScreen({ navigation }) {
  const { habits, checkIns, deleteHabit, loading } = useHabits();

  const todayLabel = format(new Date(), 'EEEE, MMMM d');
  const completed = useMemo(
    () => habits.filter(h => isCheckedToday(h.id, checkIns)).length,
    [habits, checkIns]
  );

  function confirmDelete(habit) {
    Alert.alert(
      'Delete Habit',
      `Remove "${habit.name}" and all its history?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{todayLabel}</Text>
          <Text style={styles.title}>My Habits</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddHabit')}
        >
          <MaterialIcons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {!loading && habits.length > 0 && (
        <View style={styles.progressBar}>
          <Text style={styles.progressText}>
            {completed}/{habits.length} done today
          </Text>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${habits.length ? (completed / habits.length) * 100 : 0}%` },
              ]}
            />
          </View>
        </View>
      )}

      <FlatList
        data={habits}
        keyExtractor={h => h.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onPress={() => navigation.navigate('HabitDetail', { habitId: item.id })}
            onLongPress={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={
          !loading && (
            <EmptyState
              emoji="🌱"
              title="No habits yet"
              subtitle="Tap + to add your first habit and start building streaks!"
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  progressBar: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  progressText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  track: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexGrow: 1,
  },
});
