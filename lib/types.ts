export type Provider = "spotify" | "youtube_music";

export type Song = {
  id: string;
  title: string;
  artist: string;
  added_by: string;
  provider: Provider;
  url: string;
  artwork_url: string | null;
  created_at: string;
};

export const CONTRIBUTORS = ["Cairo", "Istanbul"] as const;
