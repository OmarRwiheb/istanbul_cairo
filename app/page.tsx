import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Song } from "@/lib/types";
import { SongList } from "@/components/song-list";
import { AddSongDialog } from "@/components/add-song-dialog";

export const dynamic = "force-dynamic";

const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Home() {
  let songList: Song[] = [];

  if (isSupabaseConfigured) {
    const supabase = createSupabaseServerClient();
    const { data: songs } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Song[]>();

    songList = songs ?? [];
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-14">
      <div className="rounded-[28px] border border-white/10 bg-[#141417]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <header className="mb-6 flex flex-col items-center text-center">
          <h1 className="font-serif text-7xl font-bold text-[#a78bfa]">
            Cairo and Istanbul
          </h1>
          <p className="mt-3 text-sm text-[#8a8a92]">
            {songList.length} {songList.length === 1 ? "song" : "songs"}
          </p>
        </header>

        {!isSupabaseConfigured ? (
          <p className="mb-6 rounded-xl bg-white/5 px-4 py-3 text-center text-sm text-[#a5a5ad]">
            Add your Supabase URL and anon key to <code>.env.local</code> to
            connect the song list.
          </p>
        ) : null}

        <div className="mb-6 flex justify-center">
          <AddSongDialog />
        </div>

        <SongList songs={songList} />
      </div>
    </main>
  );
}
