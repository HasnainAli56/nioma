/* ==========================================================================
   NIIOMA HORIZONTAL SCROLL & ANIMATED 3D ARROW NAVIGATION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const track = document.getElementById('horizontal-track');
    const panels = gsap.utils.toArray('.section-panel');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.getElementById('progress-bar');
    const arrowPrev = document.getElementById('arrow-prev');
    const arrowNext = document.getElementById('arrow-next');

    let currentIndex = 0;
    let isTransitioning = false;

    const getTotalScrollWidth = () => (panels.length - 1) * window.innerWidth;

    // Main Horizontal ScrollTrigger Tween
    const horizontalTween = gsap.to(panels, {
        x: () => -getTotalScrollWidth(),
        ease: "none",
        scrollTrigger: {
            trigger: "#horizontal-track",
            pin: true,
            scrub: 0.2,
            start: "top top",
            end: () => "+=" + getTotalScrollWidth(),
            onUpdate: (self) => {
                const progress = self.progress;

                // Update Progress Bar
                if (progressBar) {
                    progressBar.style.width = (progress * 100) + '%';
                }

                // Update 3D Camera Flight Path
                if (typeof updateThreeCameraPosition === 'function') {
                    updateThreeCameraPosition(progress);
                }

                // Update Active Nav Link & Arrow states
                const newIndex = Math.min(
                    Math.floor(progress * panels.length + 0.1),
                    panels.length - 1
                );
                
                if (newIndex !== currentIndex) {
                    currentIndex = newIndex;
                    updateActiveNavLink(currentIndex);
                    updateArrowStates(currentIndex);
                }
            }
        }
    });

    function updateActiveNavLink(index) {
        navLinks.forEach((link, idx) => {
            if (idx === index) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function updateArrowStates(index) {
        if (arrowPrev) {
            if (index === 0) arrowPrev.classList.add('disabled');
            else arrowPrev.classList.remove('disabled');
        }
        if (arrowNext) {
            if (index === panels.length - 1) arrowNext.classList.add('disabled');
            else arrowNext.classList.remove('disabled');
        }
    }

    // ANIMATED 3D SECTION TRANSITION HELPER FOR ARROW CLICKS & NAV LINKS (FAST & SNAPPY)
    window.scrollToSection = function(targetIndex) {
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex >= panels.length) targetIndex = panels.length - 1;
        if (isTransitioning) return;

        isTransitioning = true;
        const currentPanel = panels[currentIndex];
        const targetPanel = panels[targetIndex];
        
        const currentCard = currentPanel ? currentPanel.querySelector('.glass-card') : null;
        const targetCard = targetPanel ? targetPanel.querySelector('.glass-card') : null;

        const direction = targetIndex > currentIndex ? 1 : -1;

        // 1. 3D Out Animation on Current Card (Fast)
        if (currentCard) {
            gsap.to(currentCard, {
                scale: 0.94,
                rotateY: direction * -8,
                opacity: 0.6,
                duration: 0.15,
                ease: "power2.in"
            });
        }

        // 2. High-Speed Scroll to Target Section
        const scrollStart = horizontalTween.scrollTrigger.start;
        const scrollEnd = horizontalTween.scrollTrigger.end;
        const targetProgress = targetIndex / (panels.length - 1);
        const targetScrollY = scrollStart + (scrollEnd - scrollStart) * targetProgress;

        gsap.to(window, {
            scrollTo: { y: targetScrollY, autoKill: false },
            duration: 0.45,
            ease: "power2.out",
            onComplete: () => {
                isTransitioning = false;
                currentIndex = targetIndex;
                updateActiveNavLink(currentIndex);
                updateArrowStates(currentIndex);

                // 3. 3D In Animation on Target Card (Fast)
                if (targetCard) {
                    gsap.fromTo(targetCard, 
                        { scale: 0.94, rotateY: direction * 8, opacity: 0.6 },
                        { scale: 1.0, rotateY: 0, opacity: 1.0, duration: 0.3, ease: "back.out(1.2)" }
                    );
                }
            }
        });
    };

    // 5. Connect Navigation Arrow Buttons Click Events
    if (arrowPrev) {
        arrowPrev.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentIndex > 0) {
                window.scrollToSection(currentIndex - 1);
            }
        });
    }

    if (arrowNext) {
        arrowNext.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentIndex < panels.length - 1) {
                window.scrollToSection(currentIndex + 1);
            }
        });
    }

    // Setup Header & Button Click Handlers
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetIndex = parseInt(link.getAttribute('data-index'), 10);
            if (!isNaN(targetIndex)) {
                window.scrollToSection(targetIndex);
            }
        });
    });

    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => window.scrollToSection(0));
    }

    const heroBtns = document.querySelectorAll('.hero-actions a, .btn-linearity-sm, .btn-panel-action');
    heroBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const href = btn.getAttribute('href');
            if (href === '#register') window.scrollToSection(5);
            else if (href === '#about') window.scrollToSection(1);
        });
    });

    // Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            if (currentIndex < panels.length - 1) {
                window.scrollToSection(currentIndex + 1);
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                window.scrollToSection(currentIndex - 1);
            }
        }
    });

    // Mouse Drag-to-Scroll (with strict release handlers)
    let isDragging = false;
    let startX = 0;
    let startScrollY = 0;

    const stopDragging = () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = 'default';
        }
    };

    window.addEventListener('mousedown', (e) => {
        if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A', 'SVG', 'PATH', 'OPTION'].includes(e.target.tagName)) return;
        isDragging = true;
        startX = e.clientX;
        startScrollY = window.scrollY;
        document.body.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = startX - e.clientX;
        // Only scroll if user actively drags more than 10px
        if (Math.abs(deltaX) > 10) {
            window.scrollTo(0, startScrollY + deltaX * 1.5);
        }
    });

    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('mouseleave', stopDragging);

    // Touch Swipe Navigation for Mobile Devices
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // Trigger horizontal section navigation if swipe horizontal displacement > 45px
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
            if (diffX < 0 && currentIndex < panels.length - 1) {
                window.scrollToSection(currentIndex + 1);
            } else if (diffX > 0 && currentIndex > 0) {
                window.scrollToSection(currentIndex - 1);
            }
        }
    }, { passive: true });

    updateArrowStates(0);
    console.log("3D Animated Navigation Arrows & Touch Gestures active!");
});
