import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadHabits, saveHabits, loadCheckIns, saveCheckIns } from '../utils/storage';
import { todayKey } from '../utils/streaks';

const HabitContext = createContext(null);

const initialState = {
  habits: [],
  checkIns: {},
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, habits: action.habits, checkIns: action.checkIns, loading: false };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.habit] };
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(h => (h.id === action.habit.id ? action.habit : h)),
      };
    case 'DELETE_HABIT': {
      const checkIns = { ...state.checkIns };
      delete checkIns[action.id];
      return { ...state, habits: state.habits.filter(h => h.id !== action.id), checkIns };
    }
    case 'TOGGLE_CHECK_IN': {
      const { habitId, dateKey: key } = action;
      const habitCheckIns = state.checkIns[habitId] || {};
      const updated = {
        ...state.checkIns,
        [habitId]: { ...habitCheckIns, [key]: !habitCheckIns[key] },
      };
      return { ...state, checkIns: updated };
    }
    default:
      return state;
  }
}

export function HabitProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function init() {
      const [habits, checkIns] = await Promise.all([loadHabits(), loadCheckIns()]);
      dispatch({ type: 'LOAD', habits, checkIns });
    }
    init();
  }, []);

  useEffect(() => {
    if (!state.loading) {
      saveHabits(state.habits);
    }
  }, [state.habits, state.loading]);

  useEffect(() => {
    if (!state.loading) {
      saveCheckIns(state.checkIns);
    }
  }, [state.checkIns, state.loading]);

  const addHabit = useCallback((habit) => {
    dispatch({ type: 'ADD_HABIT', habit });
  }, []);

  const updateHabit = useCallback((habit) => {
    dispatch({ type: 'UPDATE_HABIT', habit });
  }, []);

  const deleteHabit = useCallback((id) => {
    dispatch({ type: 'DELETE_HABIT', id });
  }, []);

  const toggleCheckIn = useCallback((habitId, key = todayKey()) => {
    dispatch({ type: 'TOGGLE_CHECK_IN', habitId, dateKey: key });
  }, []);

  return (
    <HabitContext.Provider value={{ ...state, addHabit, updateHabit, deleteHabit, toggleCheckIn }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used inside HabitProvider');
  return ctx;
}
