// signup.js

// Import the Supabase credentials from api/supabase.js
import { supabaseUrl, supabaseAnonKey } from './api/supabase.js';

const form = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-link");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const logoutBtn = document.getElementById("logout-btn");

let isLogin = false;

// Initialize Supabase client
const { createClient } = supabase;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🔁 Toggle between Sign Up and Login modes
toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "Log In" : "Sign Up";
  submitBtn.textContent = isLogin ? "Log In" : "Sign Up";
  toggleLink.textContent = isLogin ? "Sign Up" : "Log In";
  toggleLink.parentElement.firstChild.textContent = isLogin
    ? "Don't have an account? "
    : "Already have an account? ";
});

// 🔄 Loading screen toggle
function toggleLoading(show) {
  const overlay = document.getElementById("loading-overlay");
  if (!overlay) return;
  overlay.classList.toggle("hidden", !show);
}

// 🚀 Handle form submission (signup/login)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  // Optional email validation using a regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  toggleLoading(true);

  try {
    let result;
    if (isLogin) {
      // Log in the user
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    } else {
      // Sign up the user
      result = await supabase.auth.signUp({
        email,
        password,
      });
    }

    if (result.error) {
      alert(`${isLogin ? "Login" : "Signup"} failed: ${result.error.message}`);
      return;
    }

    if (isLogin) {
      alert("✅ Logged in! Redirecting...");
      setTimeout(() => window.location.href = "main.html", 1000); // Redirect to main page
    } else {
      alert("✅ Signup successful! Check your email and come back to log in.");
      setTimeout(() => window.location.href = "login.html", 1500); // Redirect to login page
    }
  } catch (err) {
    alert("Unexpected error: " + err.message);
  } finally {
    toggleLoading(false);
  }
});

// 🔚 Logout (if ever shown)
logoutBtn.addEventListener("click", async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Logout failed: " + error.message);
    } else {
      alert("Logged out!");
      logoutBtn.style.display = "none";  // Hide the logout button after successful logout
    }
  } catch (err) {
    alert("Unexpected error: " + err.message);
  }
});
