/* ==========================================================================
   NIIOMA — VIDEO SPLASH SCREEN CONTROLLER
   - Autoplays ma_aik_d_website_bna_raha_hun.mp4
   - Updates video progress bar
   - Automatically fades out when video ends or when "SKIP INTRO" is clicked
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const videoSplash = document.getElementById('video-splash');
    const splashVideo = document.getElementById('splash-video');
    const skipBtn = document.getElementById('skip-splash-btn');
    const progressFill = document.getElementById('video-progress-fill');

    let splashEnded = false;

    function closeVideoSplash() {
        if (splashEnded) return;
        splashEnded = true;

        if (splashVideo) {
            splashVideo.pause();
        }

        // Fast GSAP Fade-Out Transition
        gsap.to(videoSplash, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => {
                videoSplash.style.display = 'none';
                
                // Fast 3D Camera Entry Zoom
                if (typeof camera !== 'undefined') {
                    gsap.from(camera.position, {
                        z: 13.0,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                }
            }
        });
    }

    if (splashVideo) {
        // High-Speed Playback (2.0x speed)
        splashVideo.playbackRate = 2.0;

        const enforceSpeed = () => {
            splashVideo.playbackRate = 2.0;
        };

        splashVideo.addEventListener('play', enforceSpeed);
        splashVideo.addEventListener('loadedmetadata', enforceSpeed);

        // Attempt instant autoplay without loading delay
        const playPromise = splashVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                enforceSpeed();
            }).catch(() => {
                closeVideoSplash();
            });
        }

        // Enforce 2.0x speed during playback
        splashVideo.addEventListener('timeupdate', () => {
            if (splashVideo.playbackRate !== 2.0) {
                splashVideo.playbackRate = 2.0;
            }
        });

        // Automatically close splash screen when video ends
        splashVideo.addEventListener('ended', closeVideoSplash);

        // Fallback: If video fails or has delay, close splash immediately without showing any load option
        splashVideo.addEventListener('error', () => {
            closeVideoSplash();
        });
    }

    // Skip Intro Button Click
    if (skipBtn) {
        skipBtn.addEventListener('click', closeVideoSplash);
    }
});
