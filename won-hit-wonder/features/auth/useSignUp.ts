import { useState } from "react";

import { supabase } from "@/lib/supabase";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    setIsLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: displayName } },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    // Update the public.users row with display name
    if (data.user) {
      await supabase
        .from("users")
        .update({ display_name: displayName })
        .eq("id", data.user.id);
    }

    setIsLoading(false);
  };

  return { signUp, isLoading, error, clearError: () => setError(null) };
};
