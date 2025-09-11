document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const usernameEl = document.getElementById("username");
  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");

  // errors
  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  // strength
  window.checkStrength = checkStrength; 
  const strengthBar = document.getElementById("strengthBar");
  const strengthLabel = document.getElementById("strengthLabel");

//dashboard
  const dashboard = document.getElementById("dashboard");
  const tbody = document.querySelector("#userTable tbody");
  const clearBtn = document.getElementById("clearBtn");


  renderTable();

 
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    const username = usernameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passwordEl.value; 

    let ok = true;
    if (!username) { usernameError.textContent = "Please enter username."; ok = false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { emailError.textContent = "Enter a valid email."; ok = false; }
    if (password.length < 6) { passwordError.textContent = "Password must be 6+ characters."; ok = false; }

    if (!ok) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({ username, email }); 
    localStorage.setItem("users", JSON.stringify(users));

    form.reset();
    strengthBar.style.width = "0%";
    strengthBar.style.background = "linear-gradient(90deg, rgba(16,32,58,0.06), rgba(16,32,58,0.06))";
    strengthLabel.textContent = "";

    renderTable();
    showToast("User added");
  });

  clearBtn.addEventListener("click", () => {
    if (!confirm("Remove all users?")) return;
    localStorage.removeItem("users");
    renderTable();
  });

  // Render table
  function renderTable() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    tbody.innerHTML = "";
    if (!users.length) {
      dashboard.hidden = true;
      return;
    }

    dashboard.hidden = false;

    users.forEach((u, idx) => {
      const tr = document.createElement("tr");

      // username cell
      const tdName = document.createElement("td");
      tdName.textContent = u.username;
      tdName.setAttribute("data-label", "Username");

      // email cell
      const tdEmail = document.createElement("td");
      tdEmail.textContent = u.email;
      tdEmail.setAttribute("data-label", "Email");

      // action cell
      const tdAction = document.createElement("td");
      tdAction.className = "action-col";
      tdAction.setAttribute("data-label", "Action");
      const delBtn = document.createElement("button");
      delBtn.className = "btn danger";
      delBtn.textContent = "Delete";
      delBtn.type = "button";
      delBtn.addEventListener("click", () => {
        if (!confirm(`Delete ${u.username}?`)) return;
        const arr = JSON.parse(localStorage.getItem("users") || "[]");
        arr.splice(idx, 1);
        localStorage.setItem("users", JSON.stringify(arr));
        renderTable();
      });
      tdAction.appendChild(delBtn);

      tr.appendChild(tdName);
      tr.appendChild(tdEmail);
      tr.appendChild(tdAction);
      tbody.appendChild(tr);
    });
  }

  function clearErrors() {
    usernameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
  }

function checkStrength() {
  const pwd = passwordEl.value || "";
  let score = 0;
  if (pwd.length >= 6) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const percent = (score / 4) * 100;
  strengthBar.style.width = percent + "%";

  if (score === 0) {
    strengthBar.style.background = "linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.15))";
    strengthLabel.textContent = "";
  } else if (score === 1) {
    strengthBar.style.background = "linear-gradient(90deg, #ff4b2b, #ff416c)"; 
    strengthLabel.textContent = "Weak";
  } else if (score === 2) {
    strengthBar.style.background = "linear-gradient(90deg, #f7971e, #ffd200)"; 
    strengthLabel.textContent = "Medium";
  } else if (score === 3) {
    strengthBar.style.background = "linear-gradient(90deg, #56ab2f, #a8e063)"; 
    strengthLabel.textContent = "Strong";
  } else {
    strengthBar.style.background = "linear-gradient(90deg, #00c6ff, #0072ff)";
    strengthLabel.textContent = "Very strong";
  }
}

  function showToast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.position = "fixed";
    t.style.left = "50%";
    t.style.transform = "translateX(-50%)";
    t.style.bottom = "28px";
    t.style.background = "rgba(16,32,58,0.9)";
    t.style.color = "#fff";
    t.style.padding = "10px 14px";
    t.style.borderRadius = "10px";
    t.style.boxShadow = "0 6px 18px rgba(3,102,214,0.12)";
    t.style.zIndex = 9999;
    document.body.appendChild(t);
    setTimeout(()=> t.style.opacity = "0", 1600);
    setTimeout(()=> t.remove(), 2000);
  }
});