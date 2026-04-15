import { useEffect } from "react";

import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";
import { colors } from "@/constants/tokens";

import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

const ONBOARDING_KEY = "onboarding_complete";

const RootLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const {
    session,
    isLoading,
    isOnboarded,
    setSession,
    setLoading,
    setOnboarded,
  } = useAuthStore();

  // Check onboarding status
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setOnboarded(value === "true");
      } catch {
        setOnboarded(false);
      }
    };

    checkOnboarding();
  }, [setOnboarded]);

  // Subscribe to auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setLoading]);

  // Hide splash screen once we know auth + onboarding state
  useEffect(() => {
    if (!isLoading && isOnboarded !== null) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, isOnboarded]);

  // Redirect based on auth + onboarding state
  useEffect(() => {
    if (isLoading || isOnboarded === null) return;

    const inOnboarding = segments[0] === "(onboarding)";
    const inAuth = segments[0] === "(auth)";
    const inTabs = segments[0] === "(tabs)";

    if (!isOnboarded && !inOnboarding) {
      router.replace("/(onboarding)/welcome");
    } else if (isOnboarded && !session && !inAuth) {
      router.replace("/(auth)/login");
    } else if (isOnboarded && session && !inTabs) {
      router.replace("/(tabs)/home");
    }
  }, [isLoading, isOnboarded, session, segments, router]);

  if (isLoading || isOnboarded === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade",
        }}
      >
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(modals)" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="won"
          options={{ presentation: "fullScreenModal" }}
        />
        <Stack.Screen name="terms" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </QueryClientProvider>
  );
};

export default RootLayout;
