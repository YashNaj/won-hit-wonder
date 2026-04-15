import { supabase } from "@/lib/supabase";

export const updateProfileQAAnswer = async (
  qaId: string,
  answer: string,
): Promise<void> => {
  const { error } = await supabase
    .from("profile_qas")
    .update({ answer })
    .eq("id", qaId);

  if (error) throw error;
};
