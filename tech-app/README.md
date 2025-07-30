# Natively - Tech Learning App

A comprehensive React Native application built with Expo for learning and skill assessment in technology domains. The app provides personalized learning roadmaps, assessments, and progress tracking.

## 🚀 Features

- **User Authentication**: Secure login and user management
- **Interactive Onboarding**: Guided introduction to the app
- **Skill Assessment**: Comprehensive assessments to evaluate technical knowledge
- **Learning Roadmaps**: Personalized learning paths based on assessment results
- **Dashboard**: Progress tracking and overview of learning journey
- **User Profile**: Manage personal information and preferences
- **Cross-Platform**: Runs on iOS, Android, and Web

## 📱 Screenshots

_Screenshots will be added here_

## 🛠️ Tech Stack

### Frontend (Mobile & Web)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **UI Components**: React Native with custom styling
- **Fonts**: Inter & Poppins (Google Fonts)
- **State Management**: React Hooks
- **Development Tools**: ESLint, TypeScript, Metro bundler

### Backend API
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- MongoDB (local installation or MongoDB Atlas account)
- For mobile development:
  - iOS: Xcode (macOS only)
  - Android: Android Studio

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tech-app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up the backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your MongoDB URI and other settings
   ```

4. **Start the backend server**
   ```bash
   # In the backend directory
   npm run dev
   ```

5. **Start the frontend development server**
   ```bash
   # In the root directory
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server with tunnel
- `npm run web` - Start web development server
- `npm run android` - Start Android development server
- `npm run ios` - Start iOS development server (macOS only)
- `npm run build:web` - Build for web production
- `npm run build:android` - Prebuild for Android
- `npm run lint` - Run ESLint

## 📱 Running the App

### On Mobile Device

1. Install the Expo Go app on your phone
2. Run `npm run dev`
3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

### On Web Browser

1. Run `npm run web`
2. Open `http://localhost:8081` in your browser

### On Emulator/Simulator

- **Android**: Run `npm run android` (requires Android emulator)
- **iOS**: Run `npm run ios` (requires iOS simulator, macOS only)

## 📁 Project Structure

```
tech-app/
├── app/                    # App screens and navigation
│   ├── _layout.tsx        # Root layout and navigation setup
│   ├── index.tsx          # Home/Welcome screen
│   ├── login.tsx          # Authentication screen
│   ├── onboarding.tsx     # User onboarding flow
│   ├── assessment.tsx     # Skill assessment screen
│   ├── roadmap.tsx        # Learning roadmap screen
│   ├── dashboard.tsx      # User dashboard
│   └── profile.tsx        # User profile screen
├── assets/                # Static assets
│   └── images/           # App icons and images
├── backend/               # Backend API server
│   ├── src/              # Source code
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   └── server.js     # Main server file
│   ├── package.json      # Backend dependencies
│   └── README.md         # Backend documentation
├── components/            # Reusable UI components
│   ├── Button.tsx        # Custom button component
│   └── Icon.tsx          # Icon component
├── styles/               # Styling and themes
│   └── commonStyles.ts   # Shared styles and theme
├── utils/                # Utility functions
│   └── errorLogger.ts    # Error logging utilities
├── public/               # Web-specific assets
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # Project documentation
```

## 🎨 Design System

The app uses a consistent design system with:

- **Typography**: Inter and Poppins fonts
- **Color Scheme**: Dark theme optimized
- **Components**: Custom reusable components
- **Navigation**: Stack-based navigation with custom animations

## 🔧 Configuration

### Environment Setup

The app is configured to work across multiple platforms:

- **Web**: PWA-ready with service worker support
- **Mobile**: Optimized for iOS and Android
- **Development**: Hot reloading and debugging support

### Key Configuration Files

- `app.json` - Expo app configuration
- `tsconfig.json` - TypeScript settings
- `babel.config.js` - Babel transpilation
- `metro.config.js` - Metro bundler configuration

## 🧪 Testing

_Testing setup will be added in future versions_

## 📱 Building for Production

### Web Build
```bash
npm run build:web
```

### Mobile Builds
```bash
# Android
npm run build:android

# iOS (requires EAS Build)
expo build:ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/Arjun-Walia)

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- Contributors and testers

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](../../issues) section
2. Create a new issue if needed
3. Contact: your-email@example.com

---

Made with ❤️ using React Native and Expo
