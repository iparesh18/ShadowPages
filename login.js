// login.js
const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const res = await fetch("./api/supabase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        data: { email, password },
      }),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Login successful!");
      window.location.href = "main.html"; // Redirect to main page
    } else {
      alert(`Login Error: ${result.error}`);
    }
  } catch (err) {
    alert("Unexpected error: " + err.message);
  }
});
