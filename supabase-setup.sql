create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  message text not null,
  type text not null,
  created_at timestamptz not null default now()
);

alter table public.wishes enable row level security;

drop policy if exists "Anyone can read wishes" on public.wishes;
drop policy if exists "Anyone can send wishes" on public.wishes;

create policy "Anyone can read wishes"
on public.wishes
for select
to anon
using (true);

create policy "Anyone can send wishes"
on public.wishes
for insert
to anon
with check (
  char_length(trim(nickname)) between 1 and 20
  and char_length(trim(message)) between 1 and 180
  and type in ('朋友', '家人', '同学', '神秘人')
);
