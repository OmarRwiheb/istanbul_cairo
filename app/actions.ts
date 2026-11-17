"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Provider } from "@/lib/types";

export type AddSongResult = { error: string } | { error: null };

export async function addSong(formData: FormData): Promise<AddSongResult> {
  const title = String(formData.get("title") ?? "").trim();
  const artist = String(formData.get("artist") ?? "").trim();
  const provider = String(formData.get("provider") ?? "").trim() as Provider;
  const url = String(formData.get("url") ?? "").trim();
  const artworkUrl = String(formData.get("artwork_url") ?? "").trim();

  if (!title || !provider || !url) {
    return { error: "Please fill in all required fields." };
  }

  if (provider !== "spotify" && provider !== "youtube_music") {
    return { error: "Invalid music service." };
  }

  try {
    new URL(url);
    if (artworkUrl) new URL(artworkUrl);
  } catch {
    return { error: "Please enter valid URLs." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("songs").insert({
    title,
    artist,
    added_by: "Shared",
    provider,
    url,
    artwork_url: artworkUrl || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { error: null };
}
