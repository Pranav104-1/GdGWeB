# Google Developer Group Website

A modern, responsive website for Google Developer Group (GDG) communities built with pure HTML, CSS, and JavaScript.

## 🌟 Features

### ✨ Core Features
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern Animations** - Smooth transitions and engaging visual effects
- **Login/Signup System** - Complete authentication interface with validation
- **Events Display** - Dynamic event listing with filtering capabilities
- **Newsletter Subscription** - Email subscription functionality
- **Professional UI** - Clean and modern user interface

### 🎨 Design Features
- Gradient backgrounds and color schemes
- Smooth scrolling and scroll animations
- Floating shape animations
- Card hover effects with transitions
- Modal dialogs for user feedback
- Interactive filter buttons

### 🔧 Technical Features
- Pure HTML, CSS, and JavaScript (No frameworks)
- LocalStorage for data persistence
- Form validation with error handling
- Responsive grid layouts
- CSS animations and transitions
- Intersection Observer for scroll animations
- Mobile-first approach

## 📋 Pages

### Index Page (`index.html`)
- **Navigation Bar** - Sticky navigation with smooth transitions
- **Hero Section** - Eye-catching banner with call-to-action buttons
- **About Section** - Information about GDG with 3 key features
- **Events Section** - Upcoming events with category filters
- **Newsletter Section** - Email subscription form
- **Footer** - Links and social media

### Login/Signup Page (`login.html`)
- **Login Form** - Email and password authentication
- **Signup Form** - Registration with email confirmation
- **Password Toggle** - Show/hide password feature
- **Form Validation** - Client-side validation with error messages
- **Social Auth Buttons** - Google and GitHub login options
- **Success Modal** - Confirmation message on successful action

## 🎯 Events

The website includes 6 sample events in different categories:

### Event Categories
- **Workshop** - Hands-on learning sessions
- **Talk** - Expert talks and presentations
- **Networking** - Community meetups

### Sample Events
1. Web Development Workshop - March 15, 2026
2. Cloud Computing 101 - March 18, 2026
3. AI/ML Meetup - March 22, 2026
4. Firebase Workshop - March 25, 2026
5. Mobile App Development - March 28, 2026
6. DevOps & CI/CD - April 1, 2026

## 🎨 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive functionality
- **LocalStorage** - Data persistence
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)
- Git (for version control)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/GdG_Website.git
cd GdG_Website
```

2. Open in browser
```bash
# Simply open index.html in your browser
# Or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

## 📁 Project Structure

```
GdG_Website/
├── index.html          # Main homepage
├── login.html          # Login/Signup page
├── styles.css          # All styling and animations
├── script.js           # JavaScript functionality
├── README.md           # Project documentation
└── .gitignore          # Git ignore file
```

## 🎯 Features Breakdown

### Authentication System
- **Login** - Email and password authentication
- **Sign Up** - New user registration with validation
- **Form Validation** - Real-time error checking
- **Password Toggle** - Show/hide password visibility
- **LocalStorage** - Persistent user data

### Event Management
- **Dynamic Rendering** - Events populated from JavaScript array
- **Category Filtering** - Filter events by type
- **Event Registration** - Users can register for events
- **Staggered Animation** - Cards animate sequentially
- **Responsive Grid** - Auto-adjusts for different screen sizes

### Animations
- **Hero Section** - Floating shapes with parallax effect
- **Card Animations** - Slide-in animations on scroll
- **Hover Effects** - Interactive element feedback
- **Button Animations** - Smooth state transitions
- **Modal Animations** - Scale and fade effects
- **Logo Animation** - Continuous rotation effect

## 💾 Data Storage

The website uses browser LocalStorage to save:
- **User Data** - Login/Signup information
- **Event Registrations** - Events user registered for
- **Newsletter Subscriptions** - Subscriber emails

Data is stored in JSON format and persists across browser sessions.

## 🔐 Security Notes

⚠️ **Note**: This is a front-end only website. For production use:
- Implement proper backend authentication
- Use HTTPS for secure data transmission
- Never store sensitive data in LocalStorage
- Implement proper password hashing
- Add CSRF protection

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #1f2937;
    --secondary-color: #3b82f6;
    --accent-color: #ec4899;
    /* ... more colors ... */
}
```

### Events
Add or modify events in `script.js`:
```javascript
const eventsData = [
    {
        id: 1,
        title: "Your Event Title",
        date: "Date",
        time: "Time",
        category: "Category",
        icon: "Emoji",
        description: "Description",
        attendees: "Count"
    },
    // ... more events ...
];
```

### Images/Icons
The website uses emoji icons. You can replace them with:
- Font Awesome icons
- Custom SVG graphics
- Image files

## 📱 Responsive Breakpoints

- **Desktop** - Full layout
- **Tablet** - Optimized for medium screens (max-width: 768px)
- **Mobile** - Single column layout (max-width: 480px)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Performance

- **Fast Loading** - Pure HTML/CSS/JS, no heavy frameworks
- **Optimized Animations** - Hardware-accelerated CSS transforms
- **Lazy Loading** - Scroll-triggered animations
- **Small Footprint** - ~50KB total file size

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 Future Enhancements

- [ ] Backend integration with database
- [ ] User profile pages
- [ ] Event management dashboard
- [ ] Email notifications
- [ ] Social media integration
- [ ] Comments and reviews
- [ ] Search functionality
- [ ] Dark mode toggle

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created for Google Developer Group communities worldwide.

## 📧 Contact

For questions or suggestions, please reach out through:
- GitHub Issues
- Social media links
- Community forum

## 🙏 Credits

- Inspired by Google's design philosophy
- Built with modern web standards
- Community-driven development

---

**Happy Learning and Building! 🚀**

Made with ❤️ for the developer community
