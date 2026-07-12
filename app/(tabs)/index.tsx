import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { useAuth } from '@clerk/clerk-expo';
import { PrimaryButton } from '@/components/Buttons';
import { UploadZone, FileCard } from '@/components/UploadZone';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { analyzeCall, ApiError } from '@/services/api';
import { CallerType } from '@/types/analysis';
import { Colors, Radius, Spacing, Type } from '@/constants/theme';

const CALLER_OPTIONS: CallerType[] = ['Familiar', 'Amigo', 'Empresa', 'Desconocido'];

function formatBytes(bytes?: number) {
  if (!bytes) return undefined;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds?: number) {
  if (!seconds) return undefined;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')} min`;
}

export default function InicioScreen() {
  const { userId } = useAuth();
  const {
    pendingFile,
    callerType,
    description,
    setPendingFile,
    setCallerType,
    setDescription,
    resetUploadForm,
    setCurrentAnalysis,
  } = useAnalysisStore();

  const [analyzing, setAnalyzing] = useState(false);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/*'],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    let durationSeconds: number | undefined;
    try {
      const { sound, status } = await Audio.Sound.createAsync({ uri: asset.uri });
      if (status.isLoaded && status.durationMillis) {
        durationSeconds = status.durationMillis / 1000;
      }
      await sound.unloadAsync();
    } catch {
      // duration is optional — backend also returns it after analysis
    }

    setPendingFile({
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType,
      sizeBytes: asset.size ?? undefined,
      durationSeconds,
    });
  };

  const onAnalyze = async () => {
    if (!pendingFile) {
      Alert.alert('Selecciona un audio', 'Debes subir una grabación antes de analizar.');
      return;
    }
    setAnalyzing(true);
    try {
      const { data } = await analyzeCall({
        fileUri: pendingFile.uri,
        fileName: pendingFile.name,
        mimeType: pendingFile.mimeType,
        callerType: callerType ?? undefined,
        description: description || undefined,
        userId: userId ?? undefined,
      });
      setCurrentAnalysis(data, pendingFile.name);
      resetUploadForm();
      router.push('/result');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Ocurrió un error inesperado durante el análisis.';
      Alert.alert('No se pudo analizar el audio', message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.eyebrow}>ConfIA</Text>
        <Text style={styles.title}>Analizar llamada</Text>

        {pendingFile ? (
          <FileCard
            name={pendingFile.name}
            durationLabel={formatDuration(pendingFile.durationSeconds)}
            sizeLabel={formatBytes(pendingFile.sizeBytes)}
            onRemove={() => setPendingFile(null)}
          />
        ) : (
          <UploadZone onPress={pickFile} />
        )}

        <Text style={styles.label}>¿Quién realiza la llamada? (opcional)</Text>
        <View style={styles.chipsRow}>
          {CALLER_OPTIONS.map((opt) => {
            const active = callerType === opt;
            return (
              <Pressable
                key={opt}
                onPress={() => setCallerType(active ? null : opt)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Agrega contexto sobre la llamada (opcional)"
          placeholderTextColor={Colors.inkFaint}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <PrimaryButton
          label={analyzing ? 'Analizando...' : 'Analizar audio'}
          icon={analyzing ? undefined : 'sparkles-outline'}
          loading={analyzing}
          onPress={onAnalyze}
          style={{ marginTop: Spacing.lg }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  eyebrow: {
    fontSize: 12,
    color: Colors.signalDeep,
    letterSpacing: 1,
    textTransform: 'uppercase',
    ...Type.bodySemi,
  },
  title: {
    fontSize: 26,
    color: Colors.navy,
    marginTop: 4,
    marginBottom: Spacing.xl,
    ...Type.display,
  },
  label: {
    fontSize: 13,
    color: Colors.inkMuted,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    ...Type.bodyMedium,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  chipText: { fontSize: 13, color: Colors.ink, ...Type.bodyMedium },
  chipTextActive: { color: Colors.white },
  textArea: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: 14,
    color: Colors.ink,
    minHeight: 96,
    textAlignVertical: 'top',
    ...Type.body,
  },
});
