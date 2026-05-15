import { createClient } from '@supabase/supabase-js';
import type { WishType } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : null;

export type WishRow = {
  id: string;
  nickname: string;
  message: string;
  type: WishType;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      wishes: {
        Row: WishRow;
        Insert: {
          nickname: string;
          message: string;
          type: WishType;
        };
        Update: Partial<{
          nickname: string;
          message: string;
          type: WishType;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
