import { useEffect, useMemo, useState } from 'react';
import { seedWishes } from '../data';
import type { Wish } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function readJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`服务器返回了非 JSON 内容，HTTP 状态码 ${response.status}。`);
  }
}

export function useWishes() {
  const [wishes, setWishes] = useState<Wish[]>(seedWishes);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWishes() {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/wishes`);
        const payload = await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(payload?.error ?? '读取祝福失败。');
        }

        setError(null);
        setWishes(Array.isArray(payload) ? payload : []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : '读取祝福失败。');
        setWishes(seedWishes);
      } finally {
        setIsLoading(false);
      }
    }

    void loadWishes();
  }, []);

  const energy = useMemo(() => Math.min(100, wishes.length * 12), [wishes.length]);

  async function addWish(wish: Omit<Wish, 'id' | 'createdAt'>) {
    const response = await fetch(`${API_BASE_URL}/api/wishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname: wish.nickname,
        message: wish.message,
        type: wish.type,
      }),
    });
    const payload = await readJsonResponse(response);

    if (!response.ok) {
      const message = payload?.error ?? '提交祝福失败。';
      setError(message);
      throw new Error(message);
    }

    setWishes((current) => [payload, ...current]);
    setError(null);
    return payload as Wish;
  }

  return { wishes, energy, addWish, isLoading, error };
}
