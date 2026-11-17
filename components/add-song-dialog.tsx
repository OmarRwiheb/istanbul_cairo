"use client";

import { useRef, useState, useTransition } from "react";
import { addSong } from "@/app/actions";
import { fetchSongMetadata, SongMetadata } from "@/app/metadata";
import { Provider } from "@/lib/types";

const PROVIDER_LABEL: Record<Provider, string> = {
  spotify: "Spotify",
  youtube_music: "YouTube Music",
};

export function AddSongDialog() {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [metadata, setMetadata] = useState<SongMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, startFetching] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function reset() {
    setLink("");
    setMetadata(null);
    setError(null);
    formRef.current?.reset();
  }

  function handleLookup() {
    setError(null);
    startFetching(async () => {
      const result = await fetchSongMetadata(link);
      if (result.error) {
        setError(result.error);
        setMetadata(null);
        return;
      }
      setMetadata(result.metadata);
    });
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startSaving(async () => {
      const result = await addSong(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      reset();
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-[#8a5cf6] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Add a song
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#141417] p-6 shadow-2xl">
            <h2 className="mb-4 font-serif text-xl text-white">
              Add a song
            </h2>

            {!metadata ? (
              <div className="flex flex-col gap-3">
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Paste a Spotify or YouTube Music link"
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-[#7a7a82] outline-none focus:border-[#8a5cf6]"
                />

                {error ? (
                  <p className="text-sm text-[#ff6e6e]">{error}</p>
                ) : null}

                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setOpen(false);
                    }}
                    className="rounded-full px-4 py-2 text-sm text-[#a5a5ad] hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleLookup}
                    disabled={!link || isFetching}
                    className="rounded-full bg-[#8a5cf6] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {isFetching ? "Looking up…" : "Continue"}
                  </button>
                </div>
              </div>
            ) : (
              <form
                ref={formRef}
                action={handleSubmit}
                className="flex flex-col gap-3"
              >
                <input type="hidden" name="url" value={link} />
                <input
                  type="hidden"
                  name="provider"
                  value={metadata.provider}
                />
                <input
                  type="hidden"
                  name="artwork_url"
                  value={metadata.artworkUrl ?? ""}
                />

                <div className="flex items-center gap-3 rounded-md bg-white/5 p-3">
                  {metadata.artworkUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={metadata.artworkUrl}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-md object-cover"
                    />
                  ) : null}
                  <p className="text-xs text-[#a5a5ad]">
                    {PROVIDER_LABEL[metadata.provider]} link detected
                  </p>
                </div>

                <input
                  name="title"
                  defaultValue={metadata.title}
                  placeholder="Song title"
                  required
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-[#7a7a82] outline-none focus:border-[#8a5cf6]"
                />
                <input
                  name="artist"
                  defaultValue={metadata.artist}
                  placeholder="Artist"
                  required
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-[#7a7a82] outline-none focus:border-[#8a5cf6]"
                />

                {error ? (
                  <p className="text-sm text-[#ff6e6e]">{error}</p>
                ) : null}

                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setMetadata(null)}
                    className="rounded-full px-4 py-2 text-sm text-[#a5a5ad] hover:bg-white/5"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-full bg-[#8a5cf6] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {isSaving ? "Saving…" : "Save song"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
