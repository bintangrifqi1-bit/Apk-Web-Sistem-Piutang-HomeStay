// Login / logout memakai Supabase Authentication.
async function login() {
  const { error } = await db.auth.signInWithPassword({ email: $("email").value, password: $("password").value });
  if (error) { $("login-error").textContent = "Login gagal: " + error.message; return; }
  showApp();
}
async function logout() { await db.auth.signOut(); location.reload(); }
async function showApp() {
  $("login-view").style.display = "none";
  $("app-view").style.display = "flex";
  $("user-email").textContent = "Mode Demo";
  go("dashboard");
}
