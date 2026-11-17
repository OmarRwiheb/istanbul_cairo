# Cario and Istanbul — Project Plan

## 1. Product idea

A very simple shared website for collecting songs exchanged between two people:

- One person uses Spotify.
- The other uses YouTube Music.
- Both can open the same website and see the complete song list.
- Each song shows who added it.
- Clicking a song opens its original link in Spotify or YouTube Music.

The goal is a shared musical collection, not a new music streaming service or social network.

## 2. MVP scope

### Homepage

The homepage is the product. When someone opens the website, they see:

- The playlist title: **Cario and Istanbul**
- A short subtitle: **Two worlds, one melody.**
- The total number of songs.
- A simple list of songs, newest first.

Each song displays:

- Album artwork (when available)
- Song title
- Artist
- Who added it
- A link to open it in its original music service

### Add a song

A single **Add a song** button opens a small form.

Required fields:

- Song title
- Artist
- Contributor (one of the two people)
- Music service (Spotify or YouTube Music)
- Original song URL

Optional field:

- Artwork URL

After submission, save the song to Supabase and refresh the list.

### Access and privacy

For the first version, keep access simple.

- The site is intended for two people.
- A private or unlisted URL is convenient, but a URL alone is not real access control.
- If the collection should be private, protect it with a shared password or proper authentication.
- Enable Supabase Row Level Security (RLS) and do not expose privileged database keys in the browser.

## 3. Technology

| Layer | Choice |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI components | shadcn/ui (optional; keep the interface lightweight) |
| Database | Supabase PostgreSQL |
| Hosting | Vercel |
| Music playback | Open the original Spotify / YouTube Music URL |

Use Supabase as the database. Authentication, Realtime, Storage, and external music APIs are not required for the initial MVP.

## 4. Database

Start with one `songs` table.

```sql
create table public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  added_by text not null,
  provider text not null
    check (provider in ('spotify', 'youtube_music')),
  url text not null,
  artwork_url text,
  created_at timestamptz not null default now()
);

create index songs_created_at_idx
  on public.songs (created_at desc);
```

Notes:

- `added_by` identifies which of the two people shared the song. It can initially be a simple predefined value.
- `provider` identifies the original music service.
- `url` stores the original link and is used to open the song.
- `artwork_url` is optional.
- `created_at` determines the list order.

If proper accounts are added later, replace the free-text `added_by` field with a user/profile foreign key.

## 5. Application structure

```text
app/
  page.tsx
  actions.ts
  layout.tsx
  globals.css

components/
  song-list.tsx
  song-item.tsx
  add-song-dialog.tsx

lib/
  supabase/
    server.ts
```

Keep the initial implementation small:

- `page.tsx`: load songs from Supabase and render the homepage.
- `actions.ts`: validate and insert a song, then revalidate the homepage.
- `song-list.tsx`: render the list.
- `song-item.tsx`: render one song and its external link.
- `add-song-dialog.tsx`: collect the song details.
- `server.ts`: create the Supabase server client.

## 6. Implementation steps

1. Create the Next.js project with TypeScript, App Router, and Tailwind CSS.
2. Create a Supabase project.
3. Add the Supabase URL and publishable/anon key to environment variables.
4. Create the `songs` table and index.
5. Implement the Supabase server client.
6. Build the homepage and fetch songs ordered by `created_at` descending.
7. Build the song list and individual song row.
8. Build the Add a song form.
9. Validate submitted fields and insert songs through a server action.
10. Revalidate the homepage after a successful insert.
11. Make each song open its original URL in a new tab.
12. Add basic access protection and suitable RLS policies before putting private songs online.
13. Deploy to Vercel and test on mobile and desktop.

## 7. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Use the current Supabase publishable key if the project dashboard provides one. Never put the Supabase service-role key in client-side code.

## 8. Design direction

Keep the interface warm, minimal, and personal.

- Cream or warm off-white background.
- Dark text with a restrained burgundy accent.
- Elegant serif title and simple sans-serif body text.
- Small album-art thumbnails.
- A clean vertical song list.
- One clear Add a song button.
- Responsive layout that works well on phones.

Avoid dashboards, sidebars, complex navigation, profiles, comments, reactions, and unnecessary animations.

## 9. Explicitly out of scope for the MVP

Do not build these yet:

- Spotify playlist synchronization.
- YouTube Music playlist synchronization.
- In-app audio playback.
- Spotify OAuth or YouTube authentication.
- Search and music recommendations.
- Comments and reactions.
- Multiple shared spaces.
- User profile management.
- Realtime updates.
- Monthly playlists or statistics.

The app stores song details and links; it does not stream music.

## 10. Definition of done

The MVP is complete when:

- Opening the website displays the shared song list.
- Songs are loaded from Supabase.
- The list is ordered newest first.
- A person can add a song using its title, artist, contributor, provider, and URL.
- The new song appears in the list after submission.
- Each song clearly identifies who added it.
- Clicking a song opens its original Spotify or YouTube Music link.
- The site works on mobile and desktop.
- Access is protected appropriately if the collection is intended to be private.

**Guiding principle:** Keep the product to one page and one purpose: open the website, see the songs, add a song, and listen.
