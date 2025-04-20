const form = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-link");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const logoutBtn = document.getElementById("logout-btn");

let isLogin = false;

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

  toggleLoading(true);

  try {
    const res = await fetch("/api/supabase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: isLogin ? "login" : "signup",
        data: { email, password }
      })
    });

    const result = await res.json();

    if (!res.ok) {
      alert((isLogin ? "Login" : "Signup") + " failed: " + result.error);
      return;
    }

    if (isLogin) {
      alert("✅ Logged in! Redirecting...");
      setTimeout(() => window.location.href = "main.html", 1000);
    } else {
      alert("✅ Signup successful! Check your email and come back to log in.");
      setTimeout(() => window.location.href = "login.html", 1500);
    }
  } catch (err) {
    alert("Unexpected error: " + err.message);
  } finally {
    toggleLoading(false);
  }
});

// 🔚 Logout (if ever shown)
logoutBtn.addEventListener("click", async () => {
  const res = await fetch("/api/supabase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "logout" })
  });

  const result = await res.json();

  if (!res.ok) {
    alert("Logout failed: " + result.error);
  } else {
    alert("Logged out!");
    logoutBtn.style.display = "none";
  }
});
