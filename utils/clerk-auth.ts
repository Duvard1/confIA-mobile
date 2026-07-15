import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

const WEB_CALLBACK_PATH = '/sso-callback';
const WEB_SUCCESS_PATH = '/(tabs)';

export function getClerkRedirectUrls() {
  if (Platform.OS === 'web') {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:8081';

    return {
      redirectUrl: `${origin}${WEB_CALLBACK_PATH}`,
      redirectUrlComplete: `${origin}${WEB_SUCCESS_PATH}`,
    };
  }

  return {
    redirectUrl: AuthSession.makeRedirectUri({
      scheme: 'confiamobile',
      path: 'sso-callback',
    }),
  };
}