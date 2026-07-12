import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Type } from '@/constants/theme';

const CLERK_ENABLED = !!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function useClerkUser() {
  if (!CLERK_ENABLED) return { user: null, signOut: null };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { useUser, useAuth } = require('@clerk/clerk-expo');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { signOut } = useAuth();
  return { user, signOut };
}

const MENU = [
  { icon: 'shield-checkmark-outline' as const, label: 'Privacidad y seguridad' },
  { icon: 'notifications-outline' as const, label: 'Notificaciones' },
  { icon: 'help-circle-outline' as const, label: 'Ayuda y soporte' },
];

export default function PerfilScreen() {
  const { user, signOut } = useClerkUser();

  const name = user?.fullName || user?.firstName || 'Usuario de ConfIA';
  const email = user?.primaryEmailAddress?.emailAddress || 'Modo de vista previa';

  const onSignOut = async () => {
    if (signOut) {
      await signOut();
    }
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.avatarImg} />
          ) : (
            <Ionicons name="person" size={26} color={Colors.signalDeep} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {MENU.map((item) => (
          <Pressable key={item.label} style={styles.menuRow}>
            <Ionicons name={item.icon} size={20} color={Colors.navy} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.inkFaint} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.signOut} onPress={onSignOut}>
        <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
        <Text style={styles.signOutText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: Spacing.xl },
  title: { fontSize: 24, color: Colors.navy, marginBottom: Spacing.lg, ...Type.display },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.signalSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  name: { fontSize: 15, color: Colors.ink, ...Type.bodySemi },
  email: { fontSize: 12, color: Colors.inkMuted, marginTop: 2, ...Type.body },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLabel: { flex: 1, fontSize: 14, color: Colors.ink, ...Type.bodyMedium },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  signOutText: { color: Colors.danger, fontSize: 14, ...Type.bodySemi },
});
