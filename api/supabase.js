// api/supabase.js
const supabase = supabase.createClient(
  'https://gohdorzuynqoiceuncjh.supabase.co',   // Replace with your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaGRvcnp1eW5xb2ljZXVuY2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTM0ODgsImV4cCI6MjA1OTgyOTQ4OH0.5dL7wLnghdIsO-IDWJMNEZhnc55hcdKvVZWQPtY2KHk'  // Replace with your Supabase anon key
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, data } = req.body;

  try {
    switch (action) {
      case 'signup':
        return handleSignup(data, res);
      case 'login':
        return handleLogin(data, res);
      case 'logout':
        return handleLogout(res);
      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Signup user
async function handleSignup({ email, password }, res) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json(user);
}

// Login user
async function handleLogin({ email, password }, res) {
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json(user);
}

// Logout user
async function handleLogout(res) {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json({ success: true });
}
