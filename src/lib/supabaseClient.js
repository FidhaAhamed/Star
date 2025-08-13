import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://daidizoyljiswsjgrexj.supabase.co';       // ← Paste here
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaWRpem95bGppc3dzamdyZXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTE1MzUsImV4cCI6MjA2OTU2NzUzNX0.Jkbj6mCSmr-ZOpAZk8LeLN-6uPXc9RlhZsgHcsGB-AI';                          // ← Paste here

export const supabase = createClient(supabaseUrl, supabaseKey);
