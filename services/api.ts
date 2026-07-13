import { AnalyzeResponse, CallerType, HistoryEntry } from '@/types/analysis';
import { Platform } from 'react-native';

// Set EXPO_PUBLIC_API_URL in a .env file to override.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://confia-backend.onrender.com';

export const ANALYZE_ENDPOINT = `${API_BASE_URL}/api/v1/analyze`;

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

interface AnalyzeParams {
  fileUri: string;
  fileName: string;
  mimeType?: string;
  callerType?: CallerType;
  description?: string;
  userId?: string;
  signal?: AbortSignal;
  audioSource?: 'call' | 'whatsapp';
}



/**
 * Uploads a recorded call to the ConfIA backend and returns the full
 * fraud / social-engineering / acoustic analysis.
 */
export async function analyzeCall({
  fileUri,
  fileName,
  mimeType,
  callerType,
  description,
  userId,
  signal,
  audioSource,
}: AnalyzeParams): Promise<AnalyzeResponse> {
  console.log('[analyzeCall] Iniciando análisis de llamada con parámetros:', {
    fileUri,
    fileName,
    mimeType,
    callerType,
    description,
    userId,
    platform: Platform.OS,
  });

  const form = new FormData();

  if (Platform.OS === 'web') {
    // En web, necesitamos un Blob/File real — no el formato {uri, name, type}
    // de React Native.
    try {
      console.log('[analyzeCall] Web: Intentando leer archivo desde URI...');
      const res = await fetch(fileUri);
      const blob = await res.blob();
      console.log('[analyzeCall] Web: Archivo leído como Blob:', {
        sizeBytes: blob.size,
        type: blob.type,
      });
      const file = new File([blob], fileName, { type: mimeType || 'audio/m4a' });
      form.append('audio', file);
    } catch (err) {
      console.error('[analyzeCall] Error al leer archivo en web:', err);
      throw new ApiError('No se pudo leer el archivo de audio.');
    }
  } else {
    // React Native FormData file shape
    // @ts-ignore
    const fileData = {
      uri: fileUri,
      name: fileName,
      type: mimeType || 'audio/m4a',
    };
    console.log('[analyzeCall] Nativo: Adjuntando archivo de audio:', fileData);
    // @ts-ignore
    form.append('audio', fileData);
  }

  if (callerType) {
    const contactTypeMap: Record<string, string> = {
      Familiar: 'family',
      Amigo: 'friend',
      Empresa: 'company',
      Desconocido: 'unknown',
    };
    const contactType = contactTypeMap[callerType];
    if (contactType) {
      form.append('contact_type', contactType);
    }
  }
  if (description) form.append('description', description);
  if (userId) form.append('user_id', userId);
  if (audioSource) form.append('audio_source', audioSource);

  let response: Response;
  try {
    console.log('[analyzeCall] Enviando petición POST a:', ANALYZE_ENDPOINT);
    response = await fetch(ANALYZE_ENDPOINT, {
      method: 'POST',
      body: form,
      headers: {
        Accept: 'application/json',
        // NOTE: do not set Content-Type manually — RN sets the multipart
        // boundary automatically when the body is a FormData instance.
      },
      signal,
    });
    console.log('[analyzeCall] Respuesta HTTP recibida:', {
      status: response.status,
      statusText: response.statusText,
    });
  } catch (err) {
    console.error('[analyzeCall] Error de red / conexión al enviar audio:', err);
    throw new ApiError(
      'No se pudo conectar con el servidor de análisis. Verifica tu conexión e inténtalo de nuevo.'
    );
  }

  if (!response.ok) {
    let message = `El servidor respondió con un error (${response.status}).`;
    try {
      const body = await response.json();
      // Log completo para depuración
      console.error('[analyzeCall] Error response:', JSON.stringify(body, null, 2));
      // FastAPI devuelve errores en "detail", no en "message"
      if (body?.detail) {
        if (typeof body.detail === 'string') {
          message = body.detail;
        } else if (Array.isArray(body.detail)) {
          // FastAPI 422 validation errors: [{loc, msg, type}, ...]
          message = body.detail.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join('\n');
        }
      } else if (body?.message) {
        message = body.message;
      }
    } catch {
      // ignore parse errors, keep default message
    }
    throw new ApiError(message, response.status);
  }

  const json = (await response.json()) as AnalyzeResponse;
  if (!json?.success || !json?.data) {
    throw new ApiError('La respuesta del análisis no tiene el formato esperado.');
  }
  return json;
}

export interface HistoryResponse {
  success: boolean;
  data: HistoryEntry[];
}

/**
 * Obtiene el historial de análisis guardado en la base de datos para el usuario actual.
 */
export async function fetchUserHistory(userId: string): Promise<HistoryResponse> {
  console.log('[fetchUserHistory] Obteniendo historial para el usuario:', userId);
  const endpoint = `${API_BASE_URL}/api/v1/history?user_id=${encodeURIComponent(userId)}`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    console.log('[fetchUserHistory] Respuesta HTTP recibida:', {
      status: response.status,
      statusText: response.statusText,
    });
  } catch (err) {
    console.error('[fetchUserHistory] Error de red al consultar historial:', err);
    throw new ApiError(
      'No se pudo conectar con el servidor para obtener el historial. Revisa tu conexión.'
    );
  }

  if (!response.ok) {
    let message = `El servidor respondió con un error (${response.status}).`;
    try {
      const body = await response.json();
      if (body?.detail) {
        if (typeof body.detail === 'string') {
          message = body.detail;
        } else if (Array.isArray(body.detail)) {
          message = body.detail.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join('\n');
        }
      } else if (body?.message) {
        message = body.message;
      }
    } catch {
      // ignorar error de parseo
    }
    throw new ApiError(message, response.status);
  }

  const json = (await response.json()) as HistoryResponse;
  if (!json?.success || !json?.data) {
    throw new ApiError('La respuesta del historial no tiene el formato esperado.');
  }
  return json;
}
