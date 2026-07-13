import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import DashboardContent, { DashboardEmptyState } from '@/components/DashboardContent';
import BackgroundMain from '@/components/BackgroundMain';

export default function DashboardScreen() {
  const { current } = useAnalysisStore();

  return (
    <BackgroundMain>
      <View style={styles.container}>
        {current ? (
          <DashboardContent data={current} />
        ) : (
          <DashboardEmptyState />
        )}
      </View>
    </BackgroundMain>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});