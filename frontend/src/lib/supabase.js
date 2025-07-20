import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cvstznvwfaznjerqtiae.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c3R6bnZ3ZmF6bmplcnF0aWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTI4MjcsImV4cCI6MjA2ODE2ODgyN30.BnwA-Pl_dSqVxaILtnkAjwXdw3Egj0D2OgYP0YF9xPg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage, // Explicitly use localStorage
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  // Add retry logic for network issues
  global: {
    headers: {
      'x-application-name': 'students-for-students'
    }
  }
});