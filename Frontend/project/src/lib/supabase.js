import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'sb_publishable_xV15ZayJN7D5dcj5nw7y5g_CIynfB3h'
const supabaseAnonKey = 'sb_publishable_xV15ZayJN7D5dcj5nw7y5g_CIynfB3h'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)