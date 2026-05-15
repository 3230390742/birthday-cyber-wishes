import { useEffect, useMemo, useState } from 'react';
import { seedWishes } from '../data';
import { isSupabaseConfigured, supabase, type WishRow } from '../lib/supabase';
import type { Wish } from '../types';

function toWish(row: WishRow): Wish {
  return {
    id: row.id,
    nickname: row.nickname,
    message: row.message,
    type: row.type,
    createdAt: row.created_at,
  };
}

export function useWishes() {
  const [wishes, setWishes] = useState<Wish[]>(seedWishes);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(
    isSupabaseConfigured ? null : '还没有配置 Supabase URL 和 publishable key，当前显示的是示例祝福。',
  );

  useEffect(() => {
    if (!supabase) return;

    async function loadWishes() {
      setIsLoading(true);
      const { data, error: loadError } = await supabase!
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (loadError) {
        setError(loadError.message);
        setWishes(seedWishes);
      } else {
        setError(null);
        setWishes(data.map(toWish));
      }

      setIsLoading(false);
    }

    void loadWishes();
  }, []);

  const energy = useMemo(() => Math.min(100, wishes.length * 12), [wishes.length]);

  async function addWish(wish: Omit<Wish, 'id' | 'createdAt'>) {
    if (!supabase) {
      const newWish: Wish = {
        ...wish,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setWishes((current) => [newWish, ...current]);
      return newWish;
    }

    const { data, error: insertError } = await supabase
      .from('wishes')
      .insert({
        nickname: wish.nickname,
        message: wish.message,
        type: wish.type,
      })
      .select('*')
      .single();

    if (insertError) {
      setError(insertError.message);
      throw insertError;
    }

    const newWish = toWish(data);
    setWishes((current) => [newWish, ...current]);
    setError(null);
    return newWish;
  }

  return { wishes, energy, addWish, isLoading, error };
}
