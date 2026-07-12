# ConfIA Mobile 🛡️

**ConfIA** es una aplicación móvil diseñada para proteger a los usuarios frente a fraudes telefónicos, técnicas de ingeniería social y voces clonadas mediante Inteligencia Artificial (Deepfakes). La aplicación permite subir grabaciones de audio de llamadas, enviarlas a un backend especializado y visualizar un reporte de riesgo detallado.

---

## 🚀 Características Principales

- **Autenticación Multiplataforma**: Integración robusta con [Clerk](https://clerk.com/) para inicio de sesión seguro con Google OAuth (soportando flujos nativos en iOS/Android y redireccionamientos en Web).
- **Análisis de Llamadas**: Carga de archivos de audio desde el almacenamiento local del dispositivo con soporte para validación de formatos.
- **Detección de Voz por IA**: Muestra la probabilidad de que la voz del interlocutor haya sido generada sintéticamente mediante técnicas de clonación de voz.
- **Análisis Semántico e Ingeniería Social**: Reporte inteligente que detecta urgencia, miedo, presión, peticiones de dinero o códigos de seguridad en la conversación.
- **Dashboard Técnico**: Visualización de métricas avanzadas incluyendo gráficos de radar de factores psicológicos, análisis de distribución Benford para anomalías acústicas y línea de tiempo del riesgo.
- **Historial Local**: Almacenamiento rápido en memoria (usando Zustand) para consultar análisis anteriores durante la sesión de uso.

---

## 🛠️ Stack Tecnológico

- **Framework**: [Expo (SDK 54)](https://expo.dev/) y [React Native](https://reactnative.dev/).
- **Navegación**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based Routing).
- **Gestión de Estado**: [Zustand](https://github.com/pmndrs/zustand).
- **Autenticación**: [@clerk/clerk-expo](https://clerk.com/docs/references/expo/overview).
- **Almacenamiento de Tokens**: `expo-secure-store` en móvil y `localStorage` en web.
- **Avanzado**: React Compiler habilitado para optimizaciones de renderizado automáticas.

---

## 📁 Estructura del Proyecto

```
confIA-mobile/
├── app/                  # Directorio de rutas de Expo Router
│   ├── (tabs)/           # Pantallas principales bajo el tab bar
│   │   ├── index.tsx     # Subir audio y configurar análisis
│   │   ├── historial.tsx # Registro de análisis realizados
│   │   ├── dashboard.tsx # Indicadores globales de uso
│   │   └── perfil.tsx    # Gestión de cuenta y cierre de sesión
│   ├── _layout.tsx       # Layout raíz, carga de fuentes y ClerkProvider
│   ├── login.tsx         # Pantalla de acceso en móviles (iOS/Android)
│   ├── login.web.tsx     # Pantalla de acceso específica para Web
│   ├── sso-callback.tsx  # Callback de autenticación SSO web de Clerk
│   └── result.tsx        # Detalle visual del reporte de riesgo
├── components/           # Componentes visuales y ui reutilizables
├── constants/            # Sistema de diseño (temas, colores, tipografía)
├── hooks/                # Hooks personalizados (esquemas de colores, etc.)
├── services/             # Integración con APIs externas (endpoints del backend)
│   └── api.ts            # Servicio de subida y análisis de audio
├── store/                # Configuración de Zustand y almacén de datos
└── types/                # Definiciones de TypeScript y modelos del backend
```

---

## ⚙️ Requisitos Previos

1. **Node.js** v18 o superior.
2. **npm** o **yarn**.
3. Una cuenta en el **Dashboard de Clerk**.
4. Un backend en ejecución compatible con el endpoint de análisis (como la instancia en Render o localmente en FastAPI).

---

## 📦 Instalación y Configuración

### 1. Clonar e Instalar Dependencias
Clona el repositorio y ejecuta el siguiente comando en la raíz del proyecto para instalar las dependencias compatibles con Expo SDK 54:

```bash
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_publishable_key_de_clerk
EXPO_PUBLIC_API_URL=https://confia-backend.onrender.com
```

### 3. Configuración en el Dashboard de Clerk

Para que el inicio de sesión funcione correctamente en todas las plataformas, debes configurar los redireccionamientos autorizados:

*   **Para pruebas en Web**:
    Ve a *Configure → Redirects* (u *Opciones de redirección*) en Clerk y añade la siguiente URI en **"Allowed redirect URIs"**:
    ```
    http://localhost:8081/sso-callback
    ```
*   **Para Google OAuth**:
    Asegúrate de tener habilitada la conexión social con Google en *Configure → Social Connections*.

---

## 🖥️ Ejecución del Proyecto

Para iniciar el servidor de desarrollo de Metro, ejecuta:

```bash
npx expo start -c
```

### Controles de Metro:
- **`a`**: Ejecuta la aplicación en un emulador o dispositivo Android conectado.
- **`w`**: Abre la aplicación en tu navegador web local (`http://localhost:8081`).
- **Escaneo QR**: Escanea el código QR que se muestra en la terminal usando la aplicación móvil **Expo Go** (Android/iOS) para probar en un celular físico.

---

## 🔌 Integración con el Backend (API)

El front-end se conecta al endpoint de análisis a través del servicio [`services/api.ts`](./services/api.ts).

### Endpoint de Análisis
`POST {EXPO_PUBLIC_API_URL}/api/v1/analyze`

#### Request Format
La petición se realiza mediante un formulario de tipo `multipart/form-data` con los siguientes campos:

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `audio` | `File` (Binary) | **Sí** | El archivo de audio a analizar (formatos estándar recomendados: `.mp3`, `.wav`, `.m4a`). |
| `user_id` | `String` | **Sí** | ID del usuario autenticado provisto por Clerk (`useAuth().userId`). |
| `caller_type` | `String` | No | Rol de quien llama (`Familiar`, `Amigo`, `Empresa`, `Desconocido`). |
| `description` | `String` | No | Contexto o descripción adicional sobre la llamada. |

#### Formato de Respuesta
El backend responde con un JSON de tipo `AnalyzeResponse` que sigue este formato estructurado:

```json
{
  "success": true,
  "data": {
    "metadata": {
      "analysis_id": "string",
      "created_at": "string",
      "processing_time_ms": 0
    },
    "audio": {
      "original_name": "audio_llamada.mp3",
      "duration_seconds": 15.5
    },
    "transcription": {
      "language": "es",
      "confidence": 0.98,
      "text": "Texto completo transcrito de la llamada..."
    },
    "semantic_analysis": {
      "summary": {
        "description": "Explicación del riesgo identificado...",
        "risk_level": "Alto"
      },
      "fraud_analysis": {
        "detected": true,
        "fraud_probability": 0.85,
        "fraud_types": ["Suplantación de Identidad"]
      },
      "social_engineering": {
        "detected": true,
        "score": 0.9,
        "techniques": []
      },
      "recommendations": [
        "No compartas códigos de seguridad.",
        "Cuelga la llamada y llama al número oficial de tu banco."
      ]
    },
    "acoustic_analysis": {
      "classification": {
        "prediction": "REAL",
        "confidence": "0.99",
        "ai_voice_probability": 0.01
      }
    },
    "overall_assessment": {
      "risk_score": 85,
      "risk_level": "Alto",
      "fraud_detected": true,
      "ai_voice_detected": false,
      "final_message": "Llamada altamente sospechosa. Se recomienda colgar de inmediato."
    }
  }
}
```
