// ==================== API CONFIGURATION ==============
const API_BASE_URL = 'http://localhost:4565/api';
const AUTH_API = `${API_BASE_URL}/auth`;

// ==================== API HELPER CLASS ==============
class AuthAPI {
  // Send OTP
  static async sendOTP(email) {
    try {
      const response = await fetch(`${AUTH_API}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { error: error.message };
    }
  }

  // Verify OTP & Register
  static async verifyOTP(email, otp, username, password, firstName, lastName, phone, areasOfInterest) {
    try {
      const response = await fetch(`${AUTH_API}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          otp,
          username,
          password,
          firstName,
          lastName,
          phone,
          areasOfInterest,
        }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { error: error.message };
    }
  }

  // Login
  static async login(email, password) {
    try {
      const response = await fetch(`${AUTH_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      return { error: error.message };
    }
  }

  // Logout
  static async logout() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${AUTH_API}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return await response.json();
    } catch (error) {
      console.error('Error logging out:', error);
      return { error: error.message };
    }
  }

  // Forgot Password
  static async forgotPassword(email) {
    try {
      const response = await fetch(`${AUTH_API}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending reset email:', error);
      return { error: error.message };
    }
  }

  // Reset Password
  static async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${AUTH_API}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, newPassword }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error: error.message };
    }
  }

  // Get Current User
  static async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${AUTH_API}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      return { error: error.message };
    }
  }

  // Update Profile
  static async updateProfile(firstName, lastName, phone, areasOfInterest) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${AUTH_API}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, phone, areasOfInterest }),
      });
      const data = await response.json();
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: error.message };
    }
  }

  // Check Auth Status
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get Auth Token
  static getAuthToken() {
    return localStorage.getItem('token');
  }
}

// ==================== DARK MODE ==================== 
const darkModeBtn = document.getElementById('darkModeBtn');

// Load dark mode preference from localStorage
document.addEventListener('DOMContentLoaded', () => {
    // ==================== HAMBURGER MENU ==================== 
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('.nav-link, .auth-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeBtn.textContent = '☀️';
        createCyberGlowEffect();
    } else {
        document.body.classList.remove('dark-mode');
        darkModeBtn.textContent = '🌙';
    }
});

// Toggle dark mode
if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        darkModeBtn.textContent = isDarkMode ? '☀️' : '🌙';
        darkModeBtn.style.animation = 'spin 0.5s ease';
        
        // Create particle burst effect when toggling
        if (isDarkMode) {
            createParticleBurst(event);
            createCyberGlowEffect();
        }
        
        setTimeout(() => {
            darkModeBtn.style.animation = '';
        }, 500);
    });
}

// ==================== UNIQUE PARTICLE BURST EFFECT ==================== 
function createParticleBurst(e) {
    const colors = ['#00f3ff', '#ff10f0', '#0080ff', '#39ff14'];
    const x = e ? e.clientX : window.innerWidth / 2;
    const y = e ? e.clientY : window.innerHeight / 2;
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 12;
        const velocity = 5 + Math.random() * 5;
        let life = 1;
        
        const animate = () => {
            life -= 0.02;
            const distance = velocity * (1 - life);
            particle.style.left = (x + Math.cos(angle) * distance) + 'px';
            particle.style.top = (y + Math.sin(angle) * distance) + 'px';
            particle.style.opacity = life;
            
            if (life > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// ==================== CYBER GLOW MOUSE EFFECT ==================== 
function createCyberGlowEffect() {
    if (document.body.classList.contains('dark-mode')) {
        const mouseGlow = document.createElement('div');
        mouseGlow.id = 'mouseGlow';
        mouseGlow.style.position = 'fixed';
        mouseGlow.style.width = '20px';
        mouseGlow.style.height = '20px';
        mouseGlow.style.background = 'radial-gradient(circle, rgba(0, 243, 255, 0.6) 0%, rgba(0, 243, 255, 0) 70%)';
        mouseGlow.style.borderRadius = '50%';
        mouseGlow.style.pointerEvents = 'none';
        mouseGlow.style.zIndex = '999';
        mouseGlow.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.8)';
        mouseGlow.style.mixBlendMode = 'screen';
        
        document.body.appendChild(mouseGlow);
        
        document.addEventListener('mousemove', (e) => {
            mouseGlow.style.left = (e.clientX - 10) + 'px';
            mouseGlow.style.top = (e.clientY - 10) + 'px';
        });
    }
}

// Remove glow effect when switching to light mode
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
        const glow = document.getElementById('mouseGlow');
        if (!document.body.classList.contains('dark-mode') && glow) {
            glow.remove();
        } else if (document.body.classList.contains('dark-mode') && !glow) {
            createCyberGlowEffect();
        }
    });
    
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});

// ==================== CARD DETAILS DATA ==================== 
const cardDetailsData = {
    learn: {
        title: 'Learn & Grow',
        description: 'Expand your knowledge with our comprehensive learning programs.',
        details: `
            <h3>Why Join Our Learning Program?</h3>
            <p>Our learning initiatives are designed to help developers of all levels master cutting-edge technologies and best practices.</p>
            <h3>What You'll Learn:</h3>
            <ul>
                <li><strong>Web Development:</strong> Modern frameworks like React, Vue, and Angular</li>
                <li><strong>Cloud Technologies:</strong> Google Cloud Platform, Firebase, and microservices</li>
                <li><strong>Mobile Development:</strong> Flutter, React Native, and native development</li>
                <li><strong>AI/ML:</strong> Machine learning basics and practical applications</li>
                <li><strong>DevOps & Backend:</strong> Kubernetes, Docker, and backend architectures</li>
            </ul>
            <h3>Workshop Format:</h3>
            <p>Hands-on sessions led by industry experts covering theory and practical implementation with real-world examples.</p>
        `
    },
    connect: {
        title: 'Build Your Network',
        description: 'Connect with like-minded developers and professionals.',
        details: `
            <h3>Our Community</h3>
            <p>Google Developer Groups are vibrant communities where developers of all backgrounds come together to learn, collaborate, and innovate.</p>
            <h3>Networking Opportunities:</h3>
            <ul>
                <li><strong>Meetups:</strong> Monthly gatherings to network and discuss trends</li>
                <li><strong>Events:</strong> Conferences, workshops, and hackathons</li>
                <li><strong>Online Forums:</strong> Connect with global developer community</li>
                <li><strong>Mentorship:</strong> Get guidance from experienced developers</li>
                <li><strong>Collaboration:</strong> Find teammates for your projects</li>
            </ul>
            <h3>Community Values:</h3>
            <p>We believe in diversity, inclusion, and creating a welcoming environment for all developers regardless of experience level.</p>
        `
    },
    build: {
        title: 'Create Amazing Projects',
        description: 'Showcase your skills and build impactful applications.',
        details: `
            <h3>Build With Us</h3>
            <p>Transform your ideas into reality with support from our community and resources.</p>
            <h3>Project Opportunities:</h3>
            <ul>
                <li><strong>Hackathons:</strong> Intensive building events with exciting challenges</li>
                <li><strong>Open Source:</strong> Contribute to community-driven projects</li>
                <li><strong>Case Studies:</strong> Learn from real-world project implementations</li>
                <li><strong>Portfolio Building:</strong> Showcase your work to potential employers</li>
                <li><strong>Funding & Support:</strong> Access resources for your startup ideas</li>
            </ul>
            <h3>Tools & Resources:</h3>
            <p>Get access to Google Cloud credits, development tools, and technical documentation to accelerate your projects.</p>
        `
    }
};

// ==================== CARD CLICK HANDLER ==================== 
function setupCardClickHandlers() {
    const aboutCards = document.querySelectorAll('.about-card');
    aboutCards.forEach(card => {
        card.addEventListener('click', () => {
            const cardId = card.getAttribute('data-card-id');
            if (cardDetailsData[cardId]) {
                showCardDetailsModal(cardDetailsData[cardId]);
            }
        });
    });
}

function showCardDetailsModal(cardData) {
    const modal = document.getElementById('cardDetailsModal');
    const modalBody = document.getElementById('cardModalBody');
    
    if (modal && modalBody) {
        modalBody.innerHTML = `
            <h2>${cardData.title}</h2>
            ${cardData.details}
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCardDetailsModal() {
    const modal = document.getElementById('cardDetailsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('cardDetailsModal');
    if (modal && e.target === modal) {
        closeCardDetailsModal();
    }
});

// ==================== EVENTS DATA ==================== 
const eventsData = [
    {
        id: 1,
        title: "Web Development Workshop",
        date: "March 15, 2026",
        time: "2:00 PM",
        category: "workshop",
        icon: "💻",
        description: "Learn modern web development with HTML, CSS, and JavaScript",
        attendees: "245",
        location: "Community Hall, Room 101",
        duration: "3 hours",
        level: "Beginner to Intermediate",
        details: [
            "Master HTML5 semantic markup",
            "CSS Flexbox and Grid layouts",
            "Interactive JavaScript components",
            "Responsive web design techniques",
            "Live project building session"
        ]
    },
    {
        id: 2,
        title: "Cloud Computing 101",
        date: "March 18, 2026",
        time: "3:30 PM",
        category: "talk",
        icon: "☁️",
        description: "Introduction to cloud platforms and microservices architecture",
        attendees: "180",
        location: "Virtual (Zoom Meeting)",
        duration: "2 hours",
        level: "Beginner",
        details: [
            "Cloud computing fundamentals",
            "AWS, Azure, and GCP overview",
            "Microservices architecture patterns",
            "Scalability and cost optimization",
            "Q&A session with industry experts"
        ]
    },
    {
        id: 3,
        title: "AI/ML Meetup",
        date: "March 22, 2026",
        time: "5:00 PM",
        category: "networking",
        icon: "🤖",
        description: "Connect with AI/ML enthusiasts and discuss the latest trends",
        attendees: "320",
        location: "Tech Hub Downtown",
        duration: "2.5 hours",
        level: "All Levels",
        details: [
            "Latest AI/ML trends and breakthroughs",
            "Real-world ML project showcases",
            "Networking with data scientists",
            "Career opportunities in AI/ML",
            "Hands-on demonstrations"
        ]
    },
    {
        id: 4,
        title: "Firebase Workshop",
        date: "March 25, 2026",
        time: "2:00 PM",
        category: "workshop",
        icon: "🔥",
        description: "Build scalable apps with Firebase and Firestore",
        attendees: "150",
        location: "Community Hall, Room 202",
        duration: "3 hours",
        level: "Intermediate",
        details: [
            "Firebase authentication setup",
            "Real-time database with Firestore",
            "Cloud Functions deployment",
            "Firebase hosting and CDN",
            "Building a complete app together"
        ]
    },
    {
        id: 5,
        title: "Mobile App Development",
        date: "March 28, 2026",
        time: "3:00 PM",
        category: "talk",
        icon: "📱",
        description: "Cross-platform mobile development with Flutter and React Native",
        attendees: "280",
        location: "Virtual (Google Meet)",
        duration: "2 hours",
        level: "Intermediate to Advanced",
        details: [
            "Flutter vs React Native comparison",
            "Native module integration",
            "Performance optimization tips",
            "App store publishing guide",
            "Real-world success stories"
        ]
    },
    {
        id: 6,
        title: "DevOps & CI/CD",
        date: "April 1, 2026",
        time: "4:00 PM",
        category: "workshop",
        icon: "⚙️",
        description: "Master DevOps practices and continuous integration pipelines",
        attendees: "200",
        location: "Community Hall, Room 301",
        duration: "3.5 hours",
        level: "Intermediate to Advanced",
        details: [
            "Docker containerization essentials",
            "Kubernetes orchestration basics",
            "CI/CD pipeline setup with Jenkins",
            "Infrastructure as Code (IaC)",
            "Monitoring and logging strategies"
        ]
    }
];

// ==================== DOM ELEMENTS ==================== 
const eventsContainer = document.getElementById('eventsContainer');
const filterButtons = document.querySelectorAll('.filter-btn');
const loginToggle = document.getElementById('loginToggle');
const signupToggle = document.getElementById('signupToggle');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const newsletterForm = document.getElementById('newsletterForm');

let currentFilter = 'all';

// ==================== INITIALIZE ==================== 
document.addEventListener('DOMContentLoaded', () => {
    if (eventsContainer) {
        renderEvents('all');
    }
    setupFilterButtons();
    setupAuthToggle();
    setupNewsletterForm();
    setupScrollAnimations();
    setupCardClickHandlers();
});

// ==================== EVENT RENDERING ==================== 
function renderEvents(filter) {
    currentFilter = filter;
    eventsContainer.innerHTML = '';

    const filteredEvents = filter === 'all' 
        ? eventsData 
        : eventsData.filter(event => event.category === filter);

    filteredEvents.forEach((event, index) => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);

        // Stagger animation
        setTimeout(() => {
            eventCard.classList.add('show');
        }, index * 100);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.setAttribute('data-category', event.category);
    card.setAttribute('data-event-id', event.id);

    card.innerHTML = `
        <div class="event-image">${event.icon}</div>
        <div class="event-content">
            <span class="event-tag">${capitalizeFirstLetter(event.category)}</span>
            <h3>${event.title}</h3>
            <div class="event-date">
                📅 ${event.date} at ${event.time}
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-footer">
                <span class="event-attendees">👥 ${event.attendees} attending</span>
                <button class="event-btn" onclick="registerEvent(${event.id})">Register</button>
            </div>
        </div>
    `;

    // Add click handler to open event details
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('event-btn')) {
            showEventModal(event);
        }
    });

    return card;
}

// ==================== EVENT MODAL FUNCTIONALITY ==================== 
function showEventModal(event) {
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('eventModalBody');
    
    if (modal && modalBody) {
        const detailsList = event.details.map(detail => `<li>${detail}</li>`).join('');
        
        modalBody.innerHTML = `
            <div class="event-modal-header">
                <div class="event-modal-icon">${event.icon}</div>
                <h2 class="event-modal-title">${event.title}</h2>
            </div>
            
            <div class="event-modal-meta">
                <div class="event-modal-meta-item">
                    <span class="event-modal-meta-label">📅 Date & Time</span>
                    <span class="event-modal-meta-value">${event.date}</span>
                    <span class="event-modal-meta-value">${event.time}</span>
                </div>
                <div class="event-modal-meta-item">
                    <span class="event-modal-meta-label">📍 Location</span>
                    <span class="event-modal-meta-value">${event.location}</span>
                </div>
                <div class="event-modal-meta-item">
                    <span class="event-modal-meta-label">⏱️ Duration</span>
                    <span class="event-modal-meta-value">${event.duration}</span>
                </div>
                <div class="event-modal-meta-item">
                    <span class="event-modal-meta-label">👥 Attendees</span>
                    <span class="event-modal-meta-value">${event.attendees}</span>
                </div>
            </div>
            
            <div class="event-modal-description">
                <strong>📝 About this event:</strong>
                <p>${event.description}</p>
            </div>
            
            <div class="event-modal-details">
                <h4>🎯 What You'll Learn</h4>
                <ul>
                    ${detailsList}
                </ul>
            </div>
            
            <div class="event-modal-details">
                <h4>ℹ️ Event Details</h4>
                <p><strong>Category:</strong> ${capitalizeFirstLetter(event.category)}</p>
                <p><strong>Level:</strong> ${event.level}</p>
            </div>
            
            <div class="event-modal-footer">
                <button class="btn btn-primary" onclick="registerEvent(${event.id})">Register Now 🚀</button>
                <button class="btn btn-secondary" onclick="closeEventModal()">Close</button>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close event modal when clicking outside
document.addEventListener('click', (e) => {
    const eventModal = document.getElementById('eventModal');
    if (eventModal && e.target === eventModal) {
        closeEventModal();
    }
});

// ==================== FILTER FUNCTIONALITY ====================
function setupFilterButtons() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            renderEvents(filter);
        });
    });
}

// ==================== AUTH PAGE TOGGLE ==================== 
function setupAuthToggle() {
    if (loginToggle && signupToggle) {
        loginToggle.addEventListener('click', () => {
            
            toggleAuthForm('login');
        });

        signupToggle.addEventListener('click', () => {
            toggleAuthForm('signup');
        });
    }
}

function toggleAuthForm(type) {
    const forms = document.querySelectorAll('.auth-form');
    const toggles = document.querySelectorAll('.toggle-btn');

    forms.forEach(form => form.classList.remove('active'));
    toggles.forEach(toggle => toggle.classList.remove('active'));

    if (type === 'login') {
        loginForm.classList.add('active');
        loginToggle.classList.add('active');
    } else {
        signupForm.classList.add('active');
        signupToggle.classList.add('active');
    }
}

// ==================== FORM VALIDATION ==================== 
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// ==================== SOCIAL LOGIN HANDLER ==================== 
function handleSocialLogin(provider) {
    const providerNames = {
        'google': 'Google',
        'github': 'GitHub',
        'facebook': 'Facebook'
    };
    
    // Show success modal with provider name
    const modal = document.getElementById('successModal');
    if (modal) {
        document.getElementById('modalTitle').textContent = `${providerNames[provider]} Login`;
        document.getElementById('modalMessage').textContent = `Connecting to ${providerNames[provider]}... You will be redirected shortly.`;
        modal.classList.add('active');
        
        // Simulate login and redirect
        setTimeout(() => {
            modal.classList.remove('active');
            // In a real app, this would redirect to the provider's OAuth endpoint
            alert(`${providerNames[provider]} login would redirect to their authentication page`);
        }, 2000);
    }
}

// ==================== OTP LOGIN STATE ==============
let otpLoginState = {
    email: '',
    otpSent: false,
    otpTimer: null,
    resendTimer: null,
    otpAttempts: 0
};

// ==================== SEND OTP FOR LOGIN ==============
async function sendOTPForLogin() {
    const email = document.getElementById('login-email').value.trim();
    const btn = document.getElementById('sendOtpBtn');
    
    if (!email || !validateEmail(email)) {
        showFormError('login-email-error', 'Please enter a valid email');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
        const response = await AuthAPI.sendOTP(email);
        
        if (response.error) {
            showFormError('login-email-error', response.error || 'Failed to send OTP');
            btn.disabled = false;
            btn.textContent = 'Send OTP';
            return;
        }

        // OTP sent successfully
        otpLoginState.email = email;
        otpLoginState.otpSent = true;
        otpLoginState.otpAttempts = 0;

        // Show OTP input step
        document.getElementById('loginStep1').classList.remove('active');
        document.getElementById('loginStep2').classList.add('active');
        document.getElementById('otpEmail').textContent = email;

        // Start OTP expiry timer (10 minutes)
        startOTPTimer();
        startResendTimer();

        btn.disabled = false;
        btn.textContent = 'Send OTP';

    } catch (error) {
        console.error('Error sending OTP:', error);
        showFormError('login-email-error', 'Error sending OTP. Please try again.');
        btn.disabled = false;
        btn.textContent = 'Send OTP';
    }
}

// ==================== START OTP TIMER ==============
function startOTPTimer() {
    let timeLeft = 600; // 10 minutes in seconds
    const timerEl = document.getElementById('otpTimer');

    if (otpLoginState.otpTimer) clearInterval(otpLoginState.otpTimer);

    otpLoginState.otpTimer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(otpLoginState.otpTimer);
            showFormError('login-otp-error', 'OTP has expired. Please request a new one.');
            goBackToEmail();
        }
    }, 1000);
}

// ==================== START RESEND TIMER ==============
function startResendTimer() {
    let timeLeft = 30; // 30 seconds
    const resendBtn = document.getElementById('resendBtn');
    const resendTimer = document.getElementById('resendTimer');

    if (otpLoginState.resendTimer) clearInterval(otpLoginState.resendTimer);

    resendBtn.disabled = true;

    otpLoginState.resendTimer = setInterval(() => {
        timeLeft--;
        resendTimer.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(otpLoginState.resendTimer);
            resendBtn.disabled = false;
            resendTimer.textContent = '30';
        }
    }, 1000);
}

// ==================== RESEND OTP ==============
async function resendOTP() {
    const btn = document.getElementById('resendBtn');
    btn.disabled = true;
    btn.textContent = 'Resending...';

    try {
        const response = await AuthAPI.sendOTP(otpLoginState.email);

        if (response.error) {
            showFormError('login-otp-error', 'Failed to resend OTP');
            btn.disabled = false;
            btn.textContent = 'Resend OTP'
            return;
        }

        clearFormError('login-otp-error');
        startOTPTimer();
        startResendTimer();
        btn.textContent = 'Resend OTP';

    } catch (error) {
        console.error('Error resending OTP:', error);
        showFormError('login-otp-error', 'Error resending OTP');
        btn.disabled = false;
        btn.textContent = 'Resend OTP';
    }
}

// ==================== HANDLE OTP LOGIN ==============
async function handleOTPLogin(event) {
    event.preventDefault();

    if (!otpLoginState.otpSent) {
        // OTP not sent yet, send it
        await sendOTPForLogin();
        return;
    }

    // Verify OTP
    const otp = document.getElementById('login-otp').value.trim();

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        showFormError('login-otp-error', 'Please enter a valid 6-digit OTP');
        return;
    }

    try {
        const response = await AuthAPI.verifyOTP(
            otpLoginState.email,
            otp,
            null,
            null,
            null,
            null,
            null,
            null
        );

        if (response.error) {
            otpLoginState.otpAttempts++;
            if (otpLoginState.otpAttempts >= 3) {
                showFormError('login-otp-error', 'Too many incorrect attempts. Request a new OTP.');
                goBackToEmail();
            } else {
                showFormError('login-otp-error', `Invalid OTP. ${3 - otpLoginState.otpAttempts} attempts remaining.`);
            }
            return;
        }

        // OTP verified successfully - User is logged in
        clearFormError('login-otp-error');

        // Show success message
        showSuccessModal('Login Successful!', 'Welcome back! Redirecting...');

        setTimeout(() => {
            clearOTPLoginState();
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        console.error('Error verifying OTP:', error);
        showFormError('login-otp-error', 'Error verifying OTP. Please try again.');
    }
}

// ==================== HANDLE PASSWORD LOGIN ==============
async function handlePasswordLogin() {
    const email = document.getElementById('login-email-password').value.trim();
    const password = document.getElementById('login-password').value;

    if (!validateEmail(email)) {
        showFormError('login-email-pw-error', 'Please enter a valid email');
        return;
    }

    if (!validatePassword(password)) {
        showFormError('login-password-error', 'Password must be at least 6 characters');
        return;
    }

    try {
        const response = await AuthAPI.login(email, password);

        if (response.error) {
            if (response.requiresOTPVerification) {
                showFormError('login-email-pw-error', 'Please verify your email first. Use OTP login.');
            } else {
                showFormError('login-email-pw-error', response.error || 'Invalid credentials');
            }
            return;
        }

        // Login successful
        showSuccessModal('Login Successful!', 'Welcome back! Redirecting...');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        console.error('Error logging in:', error);
        showFormError('login-email-pw-error', 'Error logging in. Please try again.');
    }
}

// ==================== TOGGLE TO OTP LOGIN ==============
function toggleToOTPLogin() {
    clearFormError('login-email-pw-error');
    clearFormError('login-password-error');
    
    document.getElementById('loginStep1').classList.add('active');
    document.getElementById('loginStep3').classList.remove('active');
    
    clearOTPLoginState();
}

// ==================== TOGGLE TO PASSWORD LOGIN ==============
function toggleToPasswordLogin() {
    clearFormError('login-email-error');
    
    document.getElementById('loginStep1').classList.remove('active');
    document.getElementById('loginStep3').classList.add('active');
    
    clearOTPLoginState();
}

// ==================== GO BACK TO EMAIL INPUT ==============
function goBackToEmail() {
    clearFormError('login-otp-error');
    document.getElementById('login-otp').value = '';
    
    document.getElementById('loginStep1').classList.add('active');
    document.getElementById('loginStep2').classList.remove('active');
    
    clearOTPLoginState();
}

// ==================== CLEAR OTP LOGIN STATE ==============
function clearOTPLoginState() {
    if (otpLoginState.otpTimer) clearInterval(otpLoginState.otpTimer);
    if (otpLoginState.resendTimer) clearInterval(otpLoginState.resendTimer);
    
    otpLoginState = {
        email: '',
        otpSent: false,
        otpTimer: null,
        resendTimer: null,
        otpAttempts: 0
    };
}

// ==================== LEGACY LOGIN FUNCTION ==============
function handleLogin(event) {
    event.preventDefault();
    clearFormErrors('login');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    let isValid = true;

    // Validation
    if (!validateEmail(email)) {
        showFormError('login-email-error', 'Please enter a valid email');
        isValid = false;
    }

    if (!validatePassword(password)) {
        showFormError('login-password-error', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (isValid) {
        // Simulate login
        showSuccessModal('Welcome Back!', 'You have logged in successfully! Redirecting...');
        
        setTimeout(() => {
            // Store user data in localStorage
            const user = {
                email: email,
                loginTime: new Date().toLocaleString()
            };
            localStorage.setItem('gdg_user', JSON.stringify(user));
            window.location.href = 'index.html';
        }, 2000);
    }
}

function handleSignup(event) {
    event.preventDefault();
    clearFormErrors('signup');

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const terms = document.querySelector('input[name="terms"]').checked;

    let isValid = true;

    // Validation
    if (name.length < 2) {
        showFormError('signup-name-error', 'Please enter a valid name');
        isValid = false;
    }

    if (!validateEmail(email)) {
        showFormError('signup-email-error', 'Please enter a valid email');
        isValid = false;
    }

    if (!validatePassword(password)) {
        showFormError('signup-password-error', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (password !== confirm) {
        showFormError('signup-confirm-error', 'Passwords do not match');
        isValid = false;
    }

    if (!terms) {
        alert('Please accept the Terms and Conditions');
        isValid = false;
    }

    if (isValid) {
        showSuccessModal('Account Created!', 'Welcome to GDG! Redirecting to home page...');

        setTimeout(() => {
            // Store user data
            const user = {
                name: name,
                email: email,
                signupTime: new Date().toLocaleString()
            };
            localStorage.setItem('gdg_user', JSON.stringify(user));
            window.location.href = 'index.html';
        }, 2000);
    }
}

function showFormError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.animation = 'slideInUp 0.3s ease';
    }
}

function clearFormError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function clearFormErrors(formType) {
    const errors = document.querySelectorAll(`#${formType}Form .form-error`);
    errors.forEach(error => {
        error.textContent = '';
    });
}

// ==================== MODAL FUNCTIONS ==================== 
function showSuccessModal(title, message) {
    const modal = document.getElementById('successModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    if (modal) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ==================== NEWSLETTER ==================== 
function setupNewsletterForm() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;

            if (validateEmail(email)) {
                // Store subscription
                const subscribers = JSON.parse(localStorage.getItem('gdg_subscribers') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('gdg_subscribers', JSON.stringify(subscribers));
                }

                // Show feedback
                const btn = newsletterForm.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = '✓ Subscribed!';
                btn.style.background = 'var(--success-color)';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    emailInput.value = '';
                }, 2000);
            }
        });
    }
}

// ==================== EVENT REGISTRATION ==================== 
function registerEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (event) {
        // Store registration
        const registrations = JSON.parse(localStorage.getItem('gdg_registrations') || '[]');
        if (!registrations.find(r => r.eventId === eventId)) {
            registrations.push({
                eventId: eventId,
                eventTitle: event.title,
                registeredAt: new Date().toLocaleString()
            });
            localStorage.setItem('gdg_registrations', JSON.stringify(registrations));
        }

        // Close event modal if open
        const eventModal = document.getElementById('eventModal');
        if (eventModal && eventModal.classList.contains('active')) {
            closeEventModal();
        }

        showSuccessModal('🎉 Registration Confirmed!', `You have successfully registered for "${event.title}"`);
    }
}

// ==================== PASSWORD VISIBILITY TOGGLE ==================== 
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    }
}

// ==================== SCROLL ANIMATIONS ==================== 
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.about-card, .event-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// ==================== SMOOTH SCROLL ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
        }
    });
});

// ==================== UTILITY FUNCTIONS ==================== 
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ==================== USER STATUS ==================== 
function checkUserStatus() {
    const user = localStorage.getItem('gdg_user');
    if (user) {
        const userData = JSON.parse(user);
        console.log('Current user:', userData);
        return userData;
    }
    return null;
}

// ==================== LOGOUT FUNCTION ==================== 
function logout() {
    localStorage.removeItem('gdg_user');
    window.location.href = 'index.html';
}

// ==================== CONSOLE GREETING ==================== 
console.log('%cWelcome to Google Developer Group! 🚀', 'font-size: 20px; color: #667eea; font-weight: bold;');
console.log('%cThis is a community-driven platform for developers', 'font-size: 14px; color: #764ba2;');
