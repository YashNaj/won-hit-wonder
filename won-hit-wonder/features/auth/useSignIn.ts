import { useState } from "react";

import { supabase } from "@/lib/supabase";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (authError) setError(authError.message);
    setIsLoading(false);
  };

  return { signIn, isLoading, error, clearError: () => setError(null) };
};
