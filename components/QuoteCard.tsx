import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Type } from '@/constants/theme';

export default function QuoteCard({ text }: { text: string }) {
  return (
    <View style={styles.card}>
      <Ionicons
        name="chatbox-ellipses-outline"
        size={16}
        color={Colors.signalDeep}
        style={{ marginTop: 2 }}
      />
      <Text style={styles.text}>“{text.replace(/^"|"$/g, '')}”</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.navy,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  text: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    ...Type.body,
  },
});
