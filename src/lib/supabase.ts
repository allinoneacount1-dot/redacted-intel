import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yidevainhzdpkjwrcoaz.supabase.co';
const supabasePublishableKey = 'sb_publishable_9gzbHSYgPorHdmfFQzScJw_DGia32R2';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
