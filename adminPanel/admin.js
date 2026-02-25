// ==================== ADMIN PANEL FUNCTIONALITY ====================

// Check if user is admin, if not redirect to login
document.addEventListener("DOMContentLoaded", () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  
  // Check if user is logged in and is admin
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Check if user is admin
  if (user.role !== "admin") {
    // Redirect non-admin users to home page
    alert("Access Denied: Admin privileges required");
    window.location.href = "index.html";
    return;
  }

  // Initialize admin panel
  initializeAdminPanel();
  setupFormHandlers();
  loadAllData();
});

// Initialize admin panel
function initializeAdminPanel() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  // Dark mode toggle
  const darkModeBtn = document.getElementById("darkModeBtn");
  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });

    // Load saved dark mode preference
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
    }
  }
}

// Load all data
function loadAllData() {
  loadLoggedInUsers();
  loadAllUsers();
  loadEventRegistrations();
  updateStatistics();
}

// Load and display logged in users
function loadLoggedInUsers() {
  const loggedInUsersList = document.getElementById("loggedInUsersList");
  const noLoggedInUsers = document.getElementById("noLoggedInUsers");
  
  // Get all users from localStorage - simulate logged in users
  const users = getAllUsersFromStorage();
  const loggedInUsers = users.filter(user => user.isLoggedIn !== false);

  if (loggedInUsers.length === 0) {
    if (loggedInUsersList) loggedInUsersList.style.display = "none";
    if (noLoggedInUsers) noLoggedInUsers.style.display = "block";
    return;
  }

  if (loggedInUsersList) {
    loggedInUsersList.innerHTML = loggedInUsers.map((user, index) => `
      <div class="user-item" style="animation-delay: ${index * 0.1}s;">
        <div class="user-avatar">${user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
        <div class="user-info">
          <h4>${user.name || user.username}</h4>
          <p class="user-email">${user.email}</p>
          <p class="user-role">Role: <span class="role-badge ${user.role || 'user'}">${user.role || "User"}</span></p>
        </div>
        <div class="user-actions">
          <button class="action-btn logout-btn" onclick="forceLogoutUser('${user.id}')">Logout</button>
        </div>
      </div>
    `).join("");

    if (noLoggedInUsers) noLoggedInUsers.style.display = "none";
  }
}

// Load and display all users
function loadAllUsers() {
  const allUsersList = document.getElementById("allUsersList");
  const noUsers = document.getElementById("noUsers");
  
  const users = getAllUsersFromStorage();

  if (users.length === 0) {
    if (allUsersList) allUsersList.style.display = "none";
    if (noUsers) noUsers.style.display = "block";
    return;
  }

  if (allUsersList) {
    allUsersList.innerHTML = users.map((user, index) => `
      <div class="user-item" style="animation-delay: ${index * 0.1}s;">
        <div class="user-avatar">${user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
        <div class="user-info">
          <h4>${user.name || user.username}</h4>
          <p class="user-email">${user.email}</p>
          <p class="user-meta">Joined: ${user.createdAt || "N/A"}</p>
          <p class="user-role">Role: <span class="role-badge ${user.role || 'user'}">${user.role || "User"}</span></p>
        </div>
        <div class="user-actions">
          <button class="action-btn edit-btn" onclick="editUser('${user.id}')">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
        </div>
      </div>
    `).join("");

    if (noUsers) noUsers.style.display = "none";
  }
}

// Load event registrations
function loadEventRegistrations() {
  const registrationsList = document.getElementById("eventRegistrationsList");
  const noRegistrations = document.getElementById("noRegistrations");
  
  const registrations = JSON.parse(localStorage.getItem("gdg_registrations") || "[]");

  if (registrations.length === 0) {
    if (registrationsList) registrationsList.style.display = "none";
    if (noRegistrations) noRegistrations.style.display = "block";
    return;
  }

  if (registrationsList) {
    registrationsList.innerHTML = registrations.map((reg, index) => `
      <div class="registration-item" style="animation-delay: ${index * 0.1}s;">
        <div class="registration-icon">📋</div>
        <div class="registration-info">
          <h4>${reg.name || "N/A"}</h4>
          <p class="registration-event"><strong>Event:</strong> ${reg.eventTitle}</p>
          <p class="registration-details">
            <strong>Email:</strong> ${reg.email}<br>
            <strong>Branch:</strong> ${reg.branch || "N/A"} | 
            <strong>Year:</strong> ${reg.year || "N/A"}<br>
            <strong>Department:</strong> ${reg.department || "N/A"}
          </p>
          <p class="registration-date">Registered: ${reg.registeredAt}</p>
        </div>
        <div class="registration-actions">
          <button class="action-btn delete-btn" onclick="deleteRegistration('${reg.email}', '${reg.eventId}')">Remove</button>
        </div>
      </div>
    `).join("");

    if (noRegistrations) noRegistrations.style.display = "none";
  }
}

// Update statistics
function updateStatistics() {
  const users = getAllUsersFromStorage();
  const registrations = JSON.parse(localStorage.getItem("gdg_registrations") || "[]");
  const loggedInUsers = users.filter(user => user.isLoggedIn !== false);

  document.getElementById("totalUsersCount").textContent = users.length;
  document.getElementById("loggedInUsersCount").textContent = loggedInUsers.length;
  document.getElementById("eventRegistrationsCount").textContent = registrations.length;
  document.getElementById("totalEventsCount").textContent = "12"; // Static for now
}

// Get all users from storage
function getAllUsersFromStorage() {
  const registeredUsers = JSON.parse(localStorage.getItem("gdg_users") || "[]");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (currentUser && !registeredUsers.find(u => u.id === currentUser.id)) {
    registeredUsers.unshift(currentUser);
  }

  return registeredUsers;
}

// Toggle add user form
function toggleAddUserForm() {
  const panel = document.getElementById("addUserPanel");
  if (panel) {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    if (panel.style.display === "block") {
      panel.scrollIntoView({ behavior: "smooth" });
    }
  }
}

// Setup form handlers
function setupFormHandlers() {
  const addUserForm = document.getElementById("addUserForm");
  if (addUserForm) {
    addUserForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleAddUser();
    });
  }
}

// Handle add user
function handleAddUser() {
  const username = document.getElementById("newUsername").value.trim();
  const email = document.getElementById("newEmail").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const fullName = document.getElementById("newFullName").value.trim();
  const role = document.getElementById("newUserRole").value;

  if (!username || !email || !password) {
    alert("❌ Please fill in all required fields");
    return;
  }

  // Validate email
  if (!validateEmail(email)) {
    alert("❌ Please enter a valid email");
    return;
  }

  // Check if user already exists
  const users = getAllUsersFromStorage();
  if (users.find(u => u.email === email || u.username === username)) {
    alert("❌ User with this email or username already exists");
    return;
  }

  // Create new user
  const newUser = {
    id: generateUniqueId(),
    username: username,
    email: email,
    name: fullName || username,
    password: btoa(password), // Simple base64 encoding (not secure - for demo only)
    role: role,
    createdAt: new Date().toLocaleDateString(),
    isLoggedIn: false,
  };

  // Store user
  const storedUsers = JSON.parse(localStorage.getItem("gdg_users") || "[]");
  storedUsers.push(newUser);
  localStorage.setItem("gdg_users", JSON.stringify(storedUsers));

  // Reset form and close
  document.getElementById("addUserForm").reset();
  toggleAddUserForm();

  // Reload data
  loadAllData();

  // Show success
  showSuccessNotification(`✅ User "${username}" added successfully!`);
}

// Delete user
function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  const users = JSON.parse(localStorage.getItem("gdg_users") || "[]");
  const filteredUsers = users.filter(u => u.id !== userId);
  localStorage.setItem("gdg_users", JSON.stringify(filteredUsers));

  loadAllData();
  showSuccessNotification("✅ User deleted successfully!");
}

// Edit user (placeholder - can be implemented for more features)
function editUser(userId) {
  alert("📝 Edit functionality can be implemented with more details");
}

// Force logout user
function forceLogoutUser(userId) {
  if (!confirm("Are you sure you want to log out this user?")) return;

  const users = JSON.parse(localStorage.getItem("gdg_users") || "[]");
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].isLoggedIn = false;
    localStorage.setItem("gdg_users", JSON.stringify(users));
  }

  loadAllData();
  showSuccessNotification("✅ User logged out successfully!");
}

// Delete event registration
function deleteRegistration(email, eventId) {
  if (!confirm("Are you sure you want to remove this registration?")) return;

  const registrations = JSON.parse(localStorage.getItem("gdg_registrations") || "[]");
  const filteredRegistrations = registrations.filter(
    r => !(r.email === email && r.eventId == eventId)
  );
  localStorage.setItem("gdg_registrations", JSON.stringify(filteredRegistrations));

  loadAllData();
  showSuccessNotification("✅ Registration removed successfully!");
}

// Refresh data
function refreshData() {
  loadAllData();
  showSuccessNotification("🔄 Data refreshed!");
}

// Logout admin
function logoutAdmin() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "index.html";
}

// Generate unique ID
function generateUniqueId() {
  return "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

// Validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show success notification
function showSuccessNotification(message) {
  // Create temporary notification
  const notification = document.createElement("div");
  notification.className = "notification success-notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Toggle password visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
}
