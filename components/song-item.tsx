import { Song } from "@/lib/types";

const PROVIDER_LABEL: Record<Song["provider"], string> = {
  spotify: "Spotify",
  youtube_music: "YouTube Music",
};

const GRADIENTS = [
  "from-[#ff8fb3] via-[#c17bff] to-[#6f9bff]",
  "from-[#ffd36e] via-[#ff8f6e] to-[#ff5c8a]",
  "from-[#7ee8c4] via-[#5ec6ff] to-[#5c7bff]",
  "from-[#ffb86e] via-[#ff6ea3] to-[#b46eff]",
  "from-[#6ef0d1] via-[#6ec8ff] to-[#9b6eff]",
];

function gradientFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

export function SongItem({ song }: { song: Song }) {
  return (
    <a
      href={song.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
    >
      <div
        className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${gradientFor(
          song.id
        )}`}
      >
        {song.artwork_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={song.artwork_url}
            alt={`${song.title} artwork`}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-semibold text-white">
          {song.title}
        </p>
        <p className="truncate text-sm text-[#9a9aa2]">
          By <span className="text-[#c9c9ce]">{song.artist}</span>
        </p>
      </div>

      <span className="hidden shrink-0 text-xs text-[#7a7a82] sm:inline">
        {PROVIDER_LABEL[song.provider]}
      </span>

      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="ml-0.5 h-3.5 w-3.5 fill-[#0b0b0d]"
          aria-hidden="true"
        >
          <path d="M6 4.5v15l14-7.5z" />
        </svg>
      </span>
    </a>
  );
}
