import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import { Colors, HabitColors, HABIT_ICONS } from '../constants';
import { useHabits } from '../context/HabitContext';

export default function AddHabitScreen({ navigation, route }) {
  const { addHabit, updateHabit, habits } = useHabits();
  const editingHabit = route.params?.habit;

  const [name, setName] = useState(editingHabit?.name || '');
  const [description, setDescription] = useState(editingHabit?.description || '');
  const [color, setColor] = useState(editingHabit?.color || Colors.primary);
  const [icon, setIcon] = useState(editingHabit?.icon || 'star');

  function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for your habit.');
      return;
    }

    if (editingHabit) {
      updateHabit({ ...editingHabit, name: name.trim(), description: description.trim(), color, icon });
    } else {
      addHabit({
        id: uuidv4(),
        name: name.trim(),
        description: description.trim(),
        color,
        icon,
        createdAt: new Date().toISOString(),
      });
    }
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionLabel}>Habit Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Morning Meditation"
            placeholderTextColor={Colors.textMuted}
            autoFocus
            maxLength={40}
          />

          <Text style={styles.sectionLabel}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Why does this habit matter?"
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={3}
            maxLength={120}
          />

          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.colorRow}>
            {HabitColors.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorSelected]}
                onPress={() => setColor(c)}
              >
                {color === c && <MaterialIcons name="check" size={16} color="#fff" />}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Icon</Text>
          <View style={styles.iconGrid}>
            {HABIT_ICONS.map(ic => (
              <TouchableOpacity
                key={ic}
                style={[styles.iconBtn, icon === ic && { backgroundColor: color + '30', borderColor: color }]}
                onPress={() => setIcon(ic)}
              >
                <MaterialIcons name={ic} size={24} color={icon === ic ? color : Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.preview}>
            <View style={[styles.previewIcon, { backgroundColor: color + '20' }]}>
              <MaterialIcons name={icon} size={28} color={color} />
            </View>
            <Text style={[styles.previewName, { color }]}>{name || 'Habit name'}</Text>
          </View>

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: color }]} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{editingHabit ? 'Save Changes' : 'Add Habit'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelected: {
    transform: [{ scale: 1.2 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 28,
    gap: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewName: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  saveBtn: {
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
