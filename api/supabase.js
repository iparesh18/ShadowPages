import { createClient } from '@supabase/supabase-js';

let supabase;

function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, data } = req.body;

  try {
    const supabase = getSupabaseClient();

    switch (action) {
      case 'signup':
        return handleSignup(supabase, data, res);
      case 'login':
        return handleLogin(supabase, data, res);
      case 'getUser':
        return handleGetUser(supabase, res);
      case 'logout':
        return handleLogout(supabase, res);
      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (err) {
    console.error("API Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

async function handleSignup(supabase, { email, password }, res) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return res.status(200).json({ user: data.user });
}

async function handleLogin(supabase, { email, password }, res) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return res.status(200).json({ session: data.session, user: data.user });
}

async function handleGetUser(supabase, res) {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return res.status(200).json({ user: data.user });
}

async function handleLogout(supabase, res) {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return res.status(200).json({ success: true });
}
