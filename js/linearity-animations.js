/* ==========================================================================
   LINEARITY.IO-STYLE 3D ANIMATIONS & MOTION ENGINE
   - 3D Card Mouse Perspective Tilt (RotateX / RotateY)
   - Dynamic Mouse Cursor Radial Spotlight Trail
   - Dynamic Ambient Background Glow Color Shift
   - Floating 3D Parallax Layer Badges
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Linearity 3D Card Tilt & Cursor Spotlight Effect
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        const spotlight = card.querySelector('.spotlight-overlay');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt angles (-10deg to +10deg)
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            // Apply 3D perspective tilt
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

            // Update Spotlight overlay position
            if (spotlight) {
                spotlight.style.background = `radial-gradient(500px circle at ${x}px ${y}px, rgba(0, 242, 254, 0.15), transparent 45%)`;
                spotlight.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            // Reset tilt on mouse leave
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
            if (spotlight) {
                spotlight.style.opacity = '0';
            }
        });
    });

    // 2. Dynamic Ambient Glow Color Shift on Horizontal Scroll
    const glow1 = document.getElementById('glow-1');
    const glow2 = document.getElementById('glow-2');

    // Glow Color Palette per Section
    const sectionGlows = [
        { g1: '#00f2fe', g2: '#7000ff' }, // Hero: Cyan & Purple
        { g1: '#7000ff', g2: '#00f2fe' }, // Values: Purple & Cyan
        { g1: '#ff007f', g2: '#7000ff' }, // AI for Good: Magenta & Purple
        { g1: '#00f2fe', g2: '#ff007f' }, // Capabilities: Cyan & Magenta
        { g1: '#7000ff', g2: '#ff007f' }, // Ecosystem: Purple & Pink
        { g1: '#00f2fe', g2: '#7000ff' }  // Register: Cyan & Purple
    ];

    window.addEventListener('scroll', () => {
        const scrollWidth = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollWidth > 0 ? window.scrollY / scrollWidth : 0;
        const sectionIndex = Math.min(
            Math.floor(progress * sectionGlows.length),
            sectionGlows.length - 1
        );

        const colors = sectionGlows[sectionIndex];
        if (glow1 && glow2 && colors) {
            glow1.style.background = `radial-gradient(circle, ${colors.g1}, transparent)`;
            glow2.style.background = `radial-gradient(circle, ${colors.g2}, transparent)`;
        }
    });

    // 3. Floating 3D Parallax Elements
    const floatingElements = document.querySelectorAll('.floating-3d-element');

    window.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 40;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 40;

        floatingElements.forEach((el, idx) => {
            const depth = (idx + 1) * 0.4;
            el.style.transform = `translate3d(${mouseX * depth}px, ${mouseY * depth}px, 30px)`;
        });
    });

    console.log("Linearity.io 3D Card Tilt, Spotlight & Glow Engine initialized!");
});
