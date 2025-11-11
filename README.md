

# OneOrbit

**OneOrbit** is a modern all-in-one web app for student life management focused on productivity, wellness, and accountability. Built with React and powered by Firebase, it includes:

- **Task Orbit:** Organize tasks (Assignments, Personal, Health, Projects)
- **Learning Orbit:** Track topics, mastery, and streaks
- **Finance Orbit:** Manage weekly budgets and expenses
- **Health Orbit:** Log sleep, water, stress, and calculate energy scores
- **Reflect Orbit:** Weekly journals for self-reflection
- **Connect Orbit:** Social trios for accountability and motivation
- **Portfolio (Proof of Work):** Show skills, projects, and public achievements
- **Light/Dark Modes:** Iridescent and animated backgrounds

***

## 🚀 Getting Started

### 1. **Clone the repo**

```bash
git clone https://github.com/your-username/oneorbit.git
cd oneorbit
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Configure Firebase**

Create a `.env.local` file in the project root:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

*(Replace all values with your actual Firebase credentials from the Firebase Console → Project Settings → Web App)*

***

### 4. **Run locally**

```bash
npm run dev
```

Open your browser to [http://localhost:5173](http://localhost:5173/) (or as shown in the terminal).

***

### 5. **Build for Production**

```bash
npm run build
```

### 6. **Preview Production Build**

```bash
npm run preview
```

***

### 7. **Deploy to Firebase Hosting**

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

***

## ✅ Development & Testing Checklist

- [ ] Firebase credentials added in `.env.local`
- [ ] App loads with no errors (`npm run dev`)
- [ ] Tasks, learning, finance, and health modules function properly
- [ ] Light/dark theme switch works
- [ ] Deployment succeeds (`firebase deploy`)
- [ ] Console messages show 
***

## ℹ️ Attribution

- Built by NitishVellanki
- UI uses OGL and Three.js for backgrounds

***

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

***
