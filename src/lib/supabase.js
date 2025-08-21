import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cvstznvwfaznjerqtiae.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c3R6bnZ3ZmF6bmplcnF0aWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTI4MjcsImV4cCI6MjA2ODE2ODgyN30.BnwA-Pl_dSqVxaILtnkAjwXdw3Egj0D2OgYP0YF9xPg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce', // Explicitly set PKCE flow
    debug: process.env.NODE_ENV === 'development' // Enable debug in development
  },
  global: {
    headers: {
      'x-application-name': 'students-for-students'
    }
  }
});