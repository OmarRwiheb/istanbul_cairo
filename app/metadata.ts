"use server";

import { Provider } from "@/lib/types";

export type SongMetadata = {
  provider: Provider;
  title: string;
  artist: string;
  artworkUrl: string | null;
};

export type FetchMetadataResult =
  | { error: string; metadata: null }
  | { error: null; metadata: SongMetadata };

function detectProvider(url: URL): Provider | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host === "open.spotify.com") return "spotify";
  if (host === "music.youtube.com" || host === "youtube.com" || host === "youtu.be") {
    return "youtube_music";
  }
  return null;
}

function splitArtistTitle(raw: string, fallbackArtist: string) {
  const separators = [" - ", " – ", " — "];
  for (const sep of separators) {
    if (raw.includes(sep)) {
      const [artist, ...rest] = raw.split(sep);
      return { artist: artist.trim(), title: rest.join(sep).trim() };
    }
  }
  return { artist: fallbackArtist, title: raw.trim() };
}

export async function fetchSongMetadata(
  rawUrl: string
): Promise<FetchMetadataResult> {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return { error: "Please paste a valid URL.", metadata: null };
  }

  const provider = detectProvider(url);
  if (!provider) {
    return {
      error: "That doesn't look like a Spotify or YouTube Music link.",
      metadata: null,
    };
  }

  try {
    if (provider === "spotify") {
      const res = await fetch(
        `https://open.spotify.com/oembed?url=${encodeURIComponent(url.toString())}`
      );
      if (!res.ok) throw new Error("lookup failed");
      const data = await res.json();
      const { artist, title } = splitArtistTitle(data.title ?? "", "");
      return {
        error: null,
        metadata: {
          provider,
          title: title || data.title || "",
          artist,
          artworkUrl: data.thumbnail_url ?? null,
        },
      };
    }

    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url.toString())}&format=json`
    );
    if (!res.ok) throw new Error("lookup failed");
    const data = await res.json();
    const { artist, title } = splitArtistTitle(
      data.title ?? "",
      data.author_name ?? ""
    );
    return {
      error: null,
      metadata: {
        provider,
        title: title || data.title || "",
        artist: artist || data.author_name || "",
        artworkUrl: data.thumbnail_url ?? null,
      },
    };
  } catch {
    return {
      error: "Couldn't fetch details for that link. Try again or check it.",
      metadata: null,
    };
  }
}
