import { useCallback } from 'react';
import { useWaitlist } from './useWaitlist';
import { supabase } from '../lib/supabase';

interface WaitlistState {
  loading: boolean;
  error: string | null;
  success: boolean;
  position: number | null;
}

interface WaitlistActions {
  submit: (email: string, level: 1 | 2 | 3) => Promise<void>;
  reset: () => void;
}

type UseWaitlistSupabaseReturn = WaitlistState & WaitlistActions;

export function useWaitlistSupabase(): UseWaitlistSupabaseReturn {
  const base = useWaitlist();

  const submit = useCallback(
    async (email: string, level: 1 | 2 | 3) => {
      // Run the base waitlist submission first
      await base.submit(email, level);

      // If base succeeded, also save to Supabase (non-blocking for user)
      try {
        const { error: supabaseError } = await supabase.from('waitlist').insert({
          email,
          level,
          created_at: new Date().toISOString(),
          source: 'website',
        });

        if (supabaseError) {
          console.warn('[useWaitlistSupabase] Supabase insert failed (non-blocking):', supabaseError);
        }
      } catch (err) {
        // Gracefully handle Supabase errors — don't block the user
        console.warn('[useWaitlistSupabase] Supabase error (non-blocking):', err);
      }
    },
    [base]
  );

  return {
    submit,
    loading: base.loading,
    error: base.error,
    success: base.success,
    position: base.position,
    reset: base.reset,
  };
}
