import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ghoczdbsfughpfogypkm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdob2N6ZGJzZnVnaHBmb2d5cGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTAxMzQsImV4cCI6MjA0ODI4NjEzNH0.4xKrpRFMDGDT-s1Ol_JlBWzNcYo34Px0nEpOUJy1PdY';

export const supabase = createClient(supabaseUrl, supabaseKey);