# 🎓 Campus Cart — AI Campus Marketplace

A lightweight, high-contrast, physical campus-notebook inspired marketplace web application for college students to buy and sell used textbooks, cycles, calculators, and electronics.

---

## 🎨 Design Theme & Palette

- **Paper White**: `#FAFBFC`
- **Checked-Grid Blue**: `#C9E2F5` (graph paper pattern background)
- **Ink Navy**: `#1B3A5C` (high-contrast typography and crisp outlines)
- **Notebook Red**: `#E63946` (primary actions, highlighter marks, marker underline)
- **Sticky-Note Yellow**: `#FFD93D` (category tags, pinned badges, washi tape)

---

## 🚀 Features

1. **Hero Section**:
   - Headline: *"Sell it. Find it. Campus only."* with hand-drawn red marker underline.
   - Tilted sticky-note badges (*"2nd-hand ✓"*, *"No fees 💸"*, *"Same day pickup 🚲"*).
   - "Browse listings" CTA that smooth-scrolls directly to the live board.

2. **Sell an Item Form**:
   - Paper-white card with a dashed cut-out coupon border.
   - Tappable pill chips for **Categories** (*Books*, *Cycles*, *Electronics*, *Other*) and **Conditions** (*Like New*, *Good*, *Fair*).
   - Client-side image compression & conversion to lightweight base64 before storing.
   - Instant real-time Firestore persistence and celebratory confetti on submit.

3. **Listings Grid**:
   - **Live Step Counter**: Visibly counts up from 0 to total listings one at a time.
   - **Live Search Bar**: Paper-white pill search filtering listings in real-time by item name and description.
   - **Category Filter Chips**: Instant single-tap filtering.
   - **Favorites (LocalStorage)**: Heart doodle icon toggling saved items with a dedicated *"My favourites"* view.
   - **Pinned Cards**: Realistic corkboard rotation tilt, seller profile chips, and category doodle placeholders.
   - **Share Feature**: Paper-plane share button using the native Web Share API with clipboard fallback (`"{name} — ₹{price}, {condition}. Check it out on Campus Cart: {url}"`).

4. **Firebase Authentication (@vitstudent.ac.in)**:
   - Restricted to official student email accounts.
   - Automatic immediate logout with sticky-note notice if a non-VIT email attempts sign-in.
   - Instant 1-Click VIT Student demo login for seamless testing in preview environments.
   - *"My listings"* tab with one-click Firestore deletion.

5. **In-App Message Seller Modal**:
   - Pre-formatted campus inquiries with hostel meetup details and student email shortcuts.

---

## 🛠️ Environment Variables Setup

Create a `.env` or `.env.local` file in your root folder (or add them in your Vercel Project Settings):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

> **Note**: If Firebase environment variables are omitted, Campus Cart automatically runs in a resilient client-side storage mode with multi-tab `BroadcastChannel` real-time synchronization, allowing full testing out-of-the-box.

---

## 🚢 How to Deploy to Vercel

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial campus cart marketplace"
   git branch -M main
   git remote add origin https://github.com/your-username/campus-cart.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your repository.
   - Framework Preset: **Vite** (or Other).
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configure Environment Variables in Vercel**:
   - In the Vercel project configuration dashboard, expand **Environment Variables**.
   - Add the `VITE_FIREBASE_*` variables from your Firebase Console.

4. **Deploy**:
   - Click **Deploy**. Vercel will build and publish your app with global CDN distribution and SSL enabled.

---

## 📝 Credits

Built live at the **VinnovateIT Vibe Coding Workshop**.
