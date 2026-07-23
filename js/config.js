import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://gucmvfptpknmxjdyvjxh.supabase.co";

const supabaseKey = "sb_publishable_M8nK6Jie1dl7EivLg0_baw_EaXlO8Yl";

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);