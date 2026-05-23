create table public.movies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  year integer not null,
  poster text not null default '',
  rating numeric(3,1) not null default 0,
  categories text[] not null default '{}',
  watched boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.movies enable row level security;

create policy "Users can view own movies" on public.movies
  for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own movies" on public.movies
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update own movies" on public.movies
  for update to authenticated using (auth.uid() = user_id);

create policy "Users can delete own movies" on public.movies
  for delete to authenticated using (auth.uid() = user_id);

create index movies_user_id_created_at_idx on public.movies (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger movies_set_updated_at
  before update on public.movies
  for each row execute function public.set_updated_at();