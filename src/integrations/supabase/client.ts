
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = 'https://zqftnjxreqyxfvtnxtrf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZnRuanhyZXF5eGZ2dG54dHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NTA5NTgsImV4cCI6MjA1OTMyNjk1OH0.4zCQ7oc2MCrmUw9P-EiWV3qZB-aca_F2ILVEL-Xs7kU'

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey
)
