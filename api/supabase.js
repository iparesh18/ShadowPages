import { createClient } from '@supabase/supabase-js';

// Ensure that the supabase client is initialized correctly before using it
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, data } = req.body;

  try {
    switch (action) {
      case 'signup':
        return handleSignup(data, res);
      case 'login':
        return handleLogin(data, res);
      case 'getUser':
        return handleGetUser(res);
      case 'logout':
        return handleLogout(res);
      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleSignup({ email, password }, res) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return res.status(200).json(data);
}

async function handleLogin({ email, password }, res) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return res.status(200).json(data);
}

async function handleGetUser(res) {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return res.status(200).json(data);
}

async function handleLogout(res) {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return res.status(200).json({ success: true });
}
