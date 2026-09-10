/* ==========================================================================
   NIIOMA 3D INTRO SPLASH SCREEN CONTROLLER
   - Simulates 3D Engine & Astronaut Loading Progress (0% to 100%)
   - Unlocks "ENTER 3D EXPERIENCE" button
   - Executes GSAP 3D Camera Zoom Fly-In Entry Transition
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const splashFill = document.getElementById('splash-fill');
    const splashPercent = document.getElementById('splash-percent');
    const splashStatus = document.getElementById('splash-status-text');
    const enterBtn = document.getElementById('enter-btn');

    const loadingSteps = [
        { pct: 15, msg: "INITIALIZING THREE.JS WEBGL RENDERER..." },
        { pct: 35, msg: "LOADING 3D ASTRONAUT & ZERO-G PHYSICS..." },
        { pct: 60, msg: "BUILDING 3D CYBER CORE & WAVE MATRIX..." },
        { pct: 85, msg: "GENERATING PARTICLES & 3D FLIGHT PATH..." },
        { pct: 100, msg: "3D SYSTEM READY — ENTER EXPERIENCE" }
    ];

    let currentStep = 0;

    function runSplashLoader() {
        if (currentStep >= loadingSteps.length) {
            // Loading Complete
            if (enterBtn) {
                enterBtn.removeAttribute('disabled');
                enterBtn.classList.add('ready');
            }
            return;
        }

        const step = loadingSteps[currentStep];
        if (splashFill) splashFill.style.width = step.pct + '%';
        if (splashPercent) splashPercent.textContent = step.pct + '%';
        if (splashStatus) splashStatus.textContent = step.msg;

        currentStep++;
        setTimeout(runSplashLoader, 400 + Math.random() * 300);
    }

    // Start loading sequence after short delay
    setTimeout(runSplashLoader, 300);

    // Enter Experience Click Event
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            // 1. Smooth Camera Fly-In Entry using GSAP
            if (typeof camera !== 'undefined') {
                gsap.to(camera.position, {
                    z: 9.5,
                    duration: 1.6,
                    ease: "power3.inOut"
                });
            }

            // 2. Fade out Splash Screen
            gsap.to(splashScreen, {
                opacity: 0,
                duration: 1.0,
                ease: "power2.inOut",
                onComplete: () => {
                    splashScreen.style.display = 'none';
                }
            });
        });
    }
});
