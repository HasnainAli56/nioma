# NIIOMA — 3D Horizontal Experience Website

A high-performance 3D horizontal scrolling website for **NIIOMA**, inspired by `linearity.io` with pure pitch-black (`#000000`) theme, video splash screen intro, interactive 3D WebGL camera flight path, and mobile responsiveness.

---

## ✨ Key Features

- **Video Splash Screen Intro**: Fullscreen intro featuring video splash playback (`ma_aik_d_website_bna_raha_hun.mp4`) with high-speed 2.0x playback rate, skip controls, and smooth GSAP fade-out transition.
- **3D WebGL Engine (Three.js)**: Interactive ambient 3D scenes including Cyber Core, Values Crystals, AI for Good Constellation, Capabilities Wave Grid, Ecosystem Portals, and Register Vortex.
- **Linearity.io 3D Card Physics**: Dynamic 3D perspective tilt on hover, glassmorphism cards (`rgba(8, 8, 14, 0.82)`), and spotlight mouse tracking.
- **Horizontal GSAP ScrollTrigger**: Smooth horizontal section navigation powered by GSAP ScrollTrigger & ScrollToPlugin with interactive 3D arrow navigation buttons and touch swipe gesture support for mobile devices.
- **Mobile Responsive**: Fully optimized for tablets and mobile smartphones (<768px & <480px breakpoints).
- **Pitch Black Aesthetic**: `#000000` pitch black background with neon cyan (`#00f2fe`) and purple (`#7000ff`) glowing highlights.

---

## 🛠️ Project Structure

```text
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── three-scene.js
│   ├── horizontal-scroll.js
│   ├── linearity-animations.js
│   └── video-splash.js
├── ma_aik_d_website_bna_raha_hun.mp4
└── Gemini_Generated_Image_8i76ww8i76ww8i76-removebg-preview.png
```

---

## 🚀 How to Run Locally

You can serve this project using any static HTTP server.

```bash
# Python 3
python -m http.server 8080
```

Open `http://localhost:8080` in your web browser.
