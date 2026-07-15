import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';

import BackgroundAuth from '@/components/BackgroundMain';
import { Type } from '@/constants/theme';
import { analyzeCall, ApiError } from '@/services/api';
import { useAnalysisStore } from '@/store/useAnalysisStore';

const BLUE = '#168BFF';
const LIGHT_BLUE = '#73B7FF';
const PINK = '#FF2D6F';
const WHITE = '#FFFFFF';

const WAVE_HEIGHTS = [18, 30, 43, 34, 23];
const ANALYSIS_STAGES = [
  {
    title: 'Preparando el audio...',
    subtitle: 'Validando formato y calidad de la grabación.',
    icon: 'musical-notes-outline',
    progress: 15,
  },
  {
    title: 'Analizando biometría de voz...',
    subtitle: 'Buscando señales de clonación o generación artificial.',
    icon: 'mic-outline',
    progress: 40,
  },
  {
    title: 'Verificando ingeniería social...',
    subtitle: 'Analizando el contenido y las intenciones de la llamada.',
    icon: 'chatbubbles-outline',
    progress: 65,
  },
  {
    title: 'Evaluando propiedades físicas...',
    subtitle: 'Procesando frecuencia, energía, silencios y variaciones.',
    icon: 'analytics-outline',
    progress: 85,
  },
  {
    title: 'Calculando el nivel de riesgo...',
    subtitle: 'Consolidando los resultados de todos los motores.',
    icon: 'shield-checkmark-outline',
    progress: 96,
  },
] as const;

function formatBytes(bytes?: number) {
  if (!bytes) return '';

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds?: number) {
  if (!seconds) return '';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, '0')} min`;
}

export default function InicioScreen() {
  const { userId } = useAuth();
  const { user, isLoaded } = useUser();
  

  const {
    pendingFile,
    callerType,
    description,
    setPendingFile,
    resetUploadForm,
    setCurrentAnalysis,
  } = useAnalysisStore();

  const [analyzing, setAnalyzing] = useState(false);
const [analysisStage, setAnalysisStage] = useState(0);

useEffect(() => {
  if (!analyzing) {
    setAnalysisStage(0);
    return;
  }

  const timers = [
    setTimeout(() => setAnalysisStage(1), 1200),
    setTimeout(() => setAnalysisStage(2), 3200),
    setTimeout(() => setAnalysisStage(3), 5600),
    setTimeout(() => setAnalysisStage(4), 8000),
  ];

  return () => {
    timers.forEach((timer) => clearTimeout(timer));
  };
}, [analyzing]);

const currentStage = ANALYSIS_STAGES[analysisStage];

const userName =
  user?.fullName ||
  user?.firstName ||
  user?.username ||
  user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
  'Usuario';

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];

      let durationSeconds: number | undefined;

      try {
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: asset.uri },
          { shouldPlay: false }
        );

        if (status.isLoaded && status.durationMillis) {
          durationSeconds = status.durationMillis / 1000;
        }

        await sound.unloadAsync();
      } catch {
        // La duración es opcional.
        // El backend también puede calcularla.
      }

      setPendingFile({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType,
        sizeBytes: asset.size ?? undefined,
        durationSeconds,
      });
    } catch {
      Alert.alert(
        'No se pudo seleccionar el audio',
        'Ocurrió un problema al abrir los archivos del dispositivo.'
      );
    }
  };

  const onAnalyze = async () => {
    if (!pendingFile) {
      Alert.alert(
        'Selecciona un audio',
        'Primero debes seleccionar un archivo de audio.'
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
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Ocurrió un error inesperado durante el análisis.';

      Alert.alert('No se pudo analizar el audio', message);
    } finally {
      setAnalyzing(false);
    }
  };

  const fileInformation = [
    formatDuration(pendingFile?.durationSeconds),
    formatBytes(pendingFile?.sizeBytes),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
  <BackgroundAuth>
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/* Nombre de la aplicación */}
        <Text style={styles.brand}>
          Guard<Text style={styles.brandIA}>IA</Text>n
        </Text>
        {/* Mensaje de bienvenida */}
        <Text style={styles.welcome}>
          Bienvenido{' '}
          <Text style={styles.userName}>
            {isLoaded ? userName : ''}
          </Text>
        </Text>

        <Text style={styles.description}>
          Selecciona un audio para analizarlo con IA
        </Text>

        {/* Apartado para seleccionar audio */}
        <Pressable
          onPress={pickFile}
          disabled={analyzing}
          style={({ pressed }) => [
            styles.uploadCard,
            pressed && styles.uploadCardPressed,
          ]}
        >
          <View style={styles.audioCircle}>
            <View style={styles.documentContainer}>
              <Ionicons
                name="document-outline"
                size={112}
                color={LIGHT_BLUE}
              />

              <View style={styles.waveform}>
                {WAVE_HEIGHTS.map((height, index) => (
                  <View
                    key={index}
                    style={[
                      styles.waveBar,
                      {
                        height,
                        opacity: index === 2 ? 1 : 0.85,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.uploadIcon}>
                <Ionicons
                  name="arrow-up"
                  size={38}
                  color={LIGHT_BLUE}
                />
              </View>
            </View>
          </View>

          <Text style={styles.uploadTitle}>
            {pendingFile
              ? 'Audio seleccionado'
              : 'Selecciona un audio'}
          </Text>

          {pendingFile ? (
            <>
              <Text
                style={styles.selectedFileName}
                numberOfLines={1}
              >
                {pendingFile.name}
              </Text>

              {!!fileInformation && (
                <Text style={styles.fileInformation}>
                  {fileInformation}
                </Text>
              )}

              <Text style={styles.changeFileText}>
                Toca para cambiar el archivo
              </Text>
            </>
          ) : (
            <Text style={styles.formats}>
              .mp3, .m4a, .wav, .aac
            </Text>
          )}
        </Pressable>

        {/* Botón que aparece después de seleccionar el audio */}
        {pendingFile && (
          <Pressable
            onPress={onAnalyze}
            disabled={analyzing}
            style={({ pressed }) => [
              styles.analyzeButton,
              pressed && !analyzing && styles.analyzeButtonPressed,
              analyzing && styles.analyzeButtonDisabled,
            ]}
          >
            {analyzing ? (
              <>
                <ActivityIndicator
                  size="small"
                  color={WHITE}
                />

                <Text style={styles.analyzeButtonText}>
                  Analizando audio...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="sparkles-outline"
                  size={21}
                  color={WHITE}
                />

                <Text style={styles.analyzeButtonText}>
                  Analizar audio
                </Text>
              </>
            )}
          </Pressable>
        )}

        {/* Mensaje de privacidad */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyIconContainer}>
            <Ionicons
              name="shield-outline"
              size={58}
              color="#FF2D55"
            />

            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#FF2D55"
              style={styles.lockIcon}
            />
          </View>

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              Tu privacidad es nuestra prioridad
            </Text>

            <Text style={styles.privacyDescription}>
              Tus audios se analizan de forma segura,
              confidencial y sin compartir con terceros.
            </Text>
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </BackgroundAuth>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingTop: 42,
    paddingBottom: 28,
  },

  brand: {
  alignSelf: 'flex-start',
  marginLeft: 2,
  fontSize: 28,
  color: WHITE,
  textAlign: 'left',
  ...Type.display,
},

  brandIA: {
  color: '#FF2D55',
},

  welcome: {
  marginTop: 20,
  fontSize: 25,
  lineHeight: 32,
  color: WHITE,
  textAlign: 'center',
  ...Type.display,
},

  userName: {
  fontFamily: 'Sora_700Bold',
  fontSize: 24,
  lineHeight: 31,
  color: '#FFF4EA',
},

  description: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 15,
    lineHeight: 20,
    color: '#FFF4EA',
    textAlign: 'center',
    ...Type.body,
  },

  uploadCard: {
    position: 'relative',
    width: '100%',
    minHeight: 312,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 25,
    backgroundColor: 'rgba(8,12,20,0.45)',
  },

  uploadCardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  pinkRightBorder: {
    position: 'absolute',
    top: 22,
    right: 0,
    bottom: 22,
    width: 1.5,
    backgroundColor: '#FF2D55',
  },

  pinkBottomBorder: {
    position: 'absolute',
    right: 22,
    bottom: 0,
    left: 56,
    height: 1.5,
    backgroundColor: BLUE,
  },

  audioCircle: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 95,
    backgroundColor: 'rgba(4,18,43,0.88)',
    shadowColor: BLUE,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 7,
  },

  documentContainer: {
    width: 135,
    height: 135,
    alignItems: 'center',
    justifyContent: 'center',
  },

  waveform: {
    position: 'absolute',
    top: 50,
    left: 41,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
safeArea: {
  flex: 1,
},
  waveBar: {
    width: 5,
    borderRadius: 5,
    backgroundColor: BLUE,
  },

  uploadIcon: {
    position: 'absolute',
    right: 1,
    bottom: 0,
    width: 61,
    height: 61,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: LIGHT_BLUE,
    borderRadius: 31,
    backgroundColor: '#06357B',
  },

 uploadTitle: {
  marginTop: 10,
  fontFamily: 'Sora_700Bold',
  fontSize: 22,
  lineHeight: 30,
  color: WHITE,
  textAlign: 'center',
},

  formats: {
  marginTop: 7,
  fontFamily: 'Sora_400Regular',
  fontSize: 14,
  lineHeight: 20,
  color: 'rgba(175,198,230,0.74)',
  textAlign: 'center',
},

  selectedFileName: {
    width: '90%',
    marginTop: 7,
    fontSize: 14,
    color: LIGHT_BLUE,
    textAlign: 'center',
    ...Type.bodyMedium,
  },

  fileInformation: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    ...Type.body,
  },

  changeFileText: {
    marginTop: 4,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    ...Type.body,
  },

  analyzeButton: {
    width: '100%',
    minHeight: 54,
    marginTop: 14,
    flexDirection: 'row',
    gap: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,

    backgroundColor: '#E53935',

    shadowColor: '#E53935',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
},

  analyzeButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },

  analyzeButtonDisabled: {
  opacity: 0.68,
  shadowOpacity: 0.12,
},

  analyzeButtonText: {
    fontSize: 15,
    color: WHITE,
    ...Type.bodySemi,
  },

  privacyCard: {
    width: '100%',
    minHeight: 84,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: 'rgba(103,151,211,0.34)',
    borderRadius: 16,
    backgroundColor: 'rgba(4,18,36,0.82)',
  },

  privacyIconContainer: {
    position: 'relative',
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 33,
    backgroundColor: 'rgba(15,86,170,0.13)',
    shadowColor: BLUE,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.65,
    shadowRadius: 12,
    elevation: 6,
  },

  lockIcon: {
    position: 'absolute',
  },

  privacyContent: {
    flex: 1,
  },

  privacyTitle: {
    fontSize: 13,
    lineHeight: 18,
    color: WHITE,
    ...Type.bodySemi,
  },

  privacyDescription: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(188,213,247,0.8)',
    ...Type.body,
  },
});