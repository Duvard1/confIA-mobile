import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import DashboardContent, { DashboardEmptyState } from '@/components/DashboardContent';
import { Colors } from '@/constants/theme';

export default function DashboardScreen() {
  const { current } = useAnalysisStore();

  return (
    <View style={styles.container}>
      {current ? <DashboardContent data={current} /> : <DashboardEmptyState />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
});
