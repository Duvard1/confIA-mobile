import BackgroundMain from '@/components/BackgroundMain';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/Buttons';
import { FileCard, UploadZone } from '@/components/UploadZone';
import { Colors, Radius, Spacing, Type } from '@/constants/theme';
import { analyzeCall, ApiError } from '@/services/api';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { CallerType } from '@/types/analysis';
import { useAuth } from '@clerk/clerk-expo';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const CALLER_OPTIONS: CallerType[] = [
  'Familiar',
  'Amigo',
  'Empresa',
  'Desconocido',
];

function formatBytes(bytes?: number) {
  if (!bytes) return undefined;

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds?: number) {
  if (!seconds) return undefined;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min`;
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
  const tabBarHeight = useBottomTabBarHeight();
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    let durationSeconds: number | undefined;

    try {
      const { sound, status } = await Audio.Sound.createAsync({
        uri: asset.uri,
      });

      if (status.isLoaded && status.durationMillis) {
        durationSeconds = status.durationMillis / 1000;
      }

      await sound.unloadAsync();
    } catch {
      // La duración es opcional.
      // El backend también puede devolverla después del análisis.
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
      Alert.alert(
        'Selecciona un audio',
        'Debes subir una grabación antes de analizar.',
      );
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
        err instanceof ApiError
          ? err.message
          : 'Ocurrió un error inesperado durante el análisis.';

      Alert.alert('No se pudo analizar el audio', message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <BackgroundMain>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
  style={styles.container}
  contentContainerStyle={styles.content}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>
              Guard<Text style={styles.eyebrowIA}>IA</Text>n
            </Text>

            <Text style={styles.title}>Analizar llamada</Text>
          </View>

          {pendingFile ? (
            <FileCard
              name={pendingFile.name}
              durationLabel={formatDuration(
                pendingFile.durationSeconds,
              )}
              sizeLabel={formatBytes(pendingFile.sizeBytes)}
              onRemove={() => setPendingFile(null)}
            />
          ) : (
            <UploadZone onPress={pickFile} />
          )}

          <Text style={styles.label}>
            ¿Quién realiza la llamada?{' '}
            <Text style={styles.optionalLabel}>(opcional)</Text>
          </Text>

          <View style={styles.chipsRow}>
            {CALLER_OPTIONS.map((option) => {
              const active = callerType === option;

              return (
                <Pressable
                  key={option}
                  onPress={() =>
                    setCallerType(active ? null : option)
                  }
                  style={({ pressed }) => [
                    styles.chip,
                    active && styles.chipActive,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      active && styles.chipTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Descripción</Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Agrega contexto sobre la llamada (opcional)"
            placeholderTextColor="rgba(255,255,255,0.42)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
          />

          <PrimaryButton
            label={analyzing ? 'Analizando...' : 'Analizar audio'}
            icon={analyzing ? undefined : 'sparkles-outline'}
            loading={analyzing}
            onPress={onAnalyze}
            style={styles.analyzeButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </BackgroundMain>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
safeArea: {
  flex: 1,
},
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  content: {
  paddingHorizontal: Spacing.xl,
  paddingTop: 16,
  paddingBottom: 10,
},

  headerBlock: {
    marginBottom: Spacing.xl,
  },

  eyebrow: {
    fontSize: 21,
    color: Colors.white,
    letterSpacing: 0.8,
    fontFamily: 'Sora_700Bold',
  },

  eyebrowIA: {
    color: '#E53935',
  },

title: {
  fontFamily: 'Sora_600SemiBold',
  fontSize: 24,
  lineHeight: 30,
  color: Colors.white,
  marginTop: 10,
  marginBottom: 0,
},
  label: {
    fontSize: 15,
    color: Colors.white,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    ...Type.bodySemi,
  },

  optionalLabel: {
    color: 'rgba(255,255,255,0.58)',
    ...Type.body,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  chip: {
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  chipActive: {
    backgroundColor: 'rgba(229,57,53,0.22)',
    borderColor: '#E53935',
  },

  chipPressed: {
    opacity: 0.75,
  },

  chipText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    ...Type.bodyMedium,
  },

  chipTextActive: {
    color: Colors.white,
    ...Type.bodySemi,
  },

  textArea: {
    minHeight: 90,
    backgroundColor: 'rgba(7,10,18,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.white,
    ...Type.body,
  },

  analyzeButton: {
    marginTop: Spacing.lg,
    marginBottom: 20,
  },
});