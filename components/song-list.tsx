import { Song } from "@/lib/types";
import { SongItem } from "@/components/song-item";

export function SongList({ songs }: { songs: Song[] }) {
  if (songs.length === 0) {
    return (
      <p className="py-12 text-center text-[#8a8a92]">
        No songs yet. Add the first one.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {songs.map((song) => (
        <li key={song.id}>
          <SongItem song={song} />
        </li>
      ))}
    </ul>
  );
}
