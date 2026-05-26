import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

export async function loadHabits() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
  return raw ? JSON.parse(raw) : [];
}

export async function saveHabits(habits) {
  await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

export async function loadCheckIns() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.CHECK_INS);
  return raw ? JSON.parse(raw) : {};
}

export async function saveCheckIns(checkIns) {
  await AsyncStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(checkIns));
}
