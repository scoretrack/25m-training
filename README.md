# 25m Pistol - ISSF Training Timer PWA

A Progressive Web App for ISSF 25m Pistol shooting training with proper timing and audio prompts.

## Features

- **Qualification Stages**
  - Precision: 30 shots, 5 minutes per 5-shot series
  - Rapid Fire: 30 shots, 3 seconds per shot

- **Finals Stages**
  - Ranking: 10 shots, 4 seconds per shot
  - Medal Match: Best of 4 series

- **Functionality**
  - Audio prompts ("Load", "Attention", "Start", "Stop")
  - Beep sounds for timing cues
  - Pause/Resume capability
  - Visual shot tracking
  - Progress indicators
  - Works offline once installed
  - Can be installed on phone home screen

## Setup Instructions

### Step 1: Generate Icons

1. Open `generate-icons.html` in your web browser
2. Right-click on the first canvas and "Save Image As..." → name it `icon-192.png`
3. Right-click on the second canvas and "Save Image As..." → name it `icon-512.png`
4. Place both icon files in the same folder as the other files

### Step 2: Deploy (Choose ONE method)

#### Option A: GitHub Pages (Recommended - Free)

1. Go to https://github.com and sign in (or create account)
2. Click "New repository"
3. Name it: `25m-pistol` (or whatever you like)
4. Make it Public
5. Click "Create repository"
6. Click "uploading an existing file"
7. Drag and drop ALL these files:
   - index.html
   - styles.css
   - app.js
   - manifest.json
   - sw.js
   - icon-192.png
   - icon-512.png
8. Click "Commit changes"
9. Go to Settings → Pages
10. Under "Source", select "Deploy from a branch"
11. Select "main" branch, "/ (root)" folder
12. Click Save
13. Wait 1-2 minutes, then visit: `https://YOUR-USERNAME.github.io/25m-pistol/`

#### Option B: Netlify (Also Free)

1. Go to https://www.netlify.com
2. Sign up / Log in
3. Click "Add new site" → "Deploy manually"
4. Drag and drop ALL the files (including both icons) into the upload area
5. Your site will be live at a random URL like `random-name-12345.netlify.app`
6. You can customize this URL in Site Settings

#### Option C: Vercel (Also Free)

1. Go to https://vercel.com
2. Sign up / Log in
3. Click "Add New" → "Project"
4. Upload all files
5. Deploy!

## Using the App

### On Mobile (iPhone/Android)

1. Open the deployed URL in Safari (iPhone) or Chrome (Android)
2. **iPhone**: Tap the Share button → "Add to Home Screen"
3. **Android**: Tap the menu (⋮) → "Add to Home Screen" or "Install App"
4. The app will now appear on your home screen like a native app!

### Desktop

1. Open the URL in Chrome, Edge, or Safari
2. Look for the install button in the address bar
3. Click to install as a desktop app

## Competition Modes

### Precision
- 6 series of 5 shots
- 5 minutes per series
- Use "Next Shot" button to manually advance if you shoot faster
- Audio: "Load" → (3 sec) → "Attention" + long beep → (3 sec) → "Start" + beep
- Audio: "Stop" + beep at end

### Rapid Fire
- 6 series of 5 shots
- 3 seconds per shot
- Random delay (4-7 sec) between "Attention" and "Start"
- Shots automatically advance every 3 seconds
- Audio: "Load" → (3 sec) → "Attention" + beep → (random 4-7 sec) → beep + "FIRE"
- Audio: "Stop" + beep at end

### Ranking
- 2 series of 5 shots
- 4 seconds per shot
- Similar to Rapid Fire but with 4 sec intervals

### Medal Match
- 4 series of 5 shots
- 3 seconds per shot
- Final competition format

## Tips

- **Volume**: Make sure your device volume is up to hear audio prompts
- **Permissions**: Allow audio if prompted
- **Offline**: Once installed, works without internet
- **Pause**: Use the pause button (⏸) anytime during practice
- **Reset**: Use the back arrow (←) to return to menu

## Troubleshooting

**No audio prompts?**
- Check device volume and mute switch
- Try clicking the start button again
- On iPhone, check that "Silent Mode" is off

**App not installing?**
- Make sure you're using a compatible browser (Safari on iPhone, Chrome on Android)
- Try opening in an Incognito/Private window first

**Timer not accurate?**
- Close other apps that might be using resources
- Restart your device if needed

## Files Included

- `index.html` - Main app page
- `styles.css` - All styling
- `app.js` - App logic and timer functionality
- `manifest.json` - PWA configuration
- `sw.js` - Service worker for offline capability
- `generate-icons.html` - Tool to create app icons
- `README.md` - This file

## Support

This app follows ISSF 25m Pistol rules as of 2024. For rule changes or feature requests, you can modify the timing values in the `app.js` file under the `initializeMode()` function.

## License

Free to use for personal training purposes.
