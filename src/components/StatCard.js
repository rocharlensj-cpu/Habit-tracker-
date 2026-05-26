import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants';

export default function StatCard({ label, value, icon, color = Colors.primary, small }) {
  return (
    <View style={[styles.card, small && styles.smallCard]}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  smallCard: {
    padding: 12,
  },
  icon: {
    fontSize: 22,
    marginBottom: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
