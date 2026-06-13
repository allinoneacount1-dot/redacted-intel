import { useCallback } from 'react';
import { useWaitlist } from './useWaitlist';

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
      await base.submit(email, level);

      // Lazy import Supabase only when needed (avoids build-time issues)
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          'https://yidevainhzdpkjwrcoaz.supabase.co',
          'sb_publishable_9gzbHSYgPorHdmfFQzScJw_DGia32R2'
        );
        const { error: supabaseError } = await supabase.from('waitlist').insert({
          email,
          level,
          created_at: new Date().toISOString(),
          source: 'website',
        });
        if (supabaseError) {
          console.warn('[Supabase] Insert failed (non-blocking):', supabaseError);
        }
      } catch (err) {
        console.warn('[Supabase] Error (non-blocking):', err);
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
