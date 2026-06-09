import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ndtbbjpopysomtcucgni.supabase.co'
const supabaseKey = 'sb_publishable_yiG1bhMDyM_cZ5c79Hj_Uw_gPCniJD7'

export const supabase = createClient(supabaseUrl, supabaseKey)