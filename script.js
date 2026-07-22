/**
 * Birthday surprise website script for Janapriya
 * Handles:
 * 1. Countdown timer to July 25th, 2026.
 * 2. Bypass code validation ('janapriya' / 'love') and URL preview parameter.
 * 3. HTML5 Canvas sky lanterns and cursor fireworks particle system.
 * 4. Section transitions & audio autoplay context.
 * 5. 3D Envelope opening & transition to main dashboard.
 * 6. Custom self-typing romantic letter.
 * 7. Polaroid slider gallery.
 * 8. Dynamic text floaters on action buttons.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Config
    const TARGET_DATE_STRING = "July 25, 2026 00:00:00";
    const TARGET_DATE = new Date(TARGET_DATE_STRING).getTime();
    const SECRET_KEYS = ["janapriya", "love", "janu", "happybirthday"];
    
    // Page Elements
    const countdownSec = document.getElementById("countdown-section");
    const envelopeSec = document.getElementById("envelope-section");
    const celebrationSec = document.getElementById("celebration-section");
    
    // Countdown Elements
    const dVal = document.getElementById("days");
    const hVal = document.getElementById("hours");
    const mVal = document.getElementById("minutes");
    const sVal = document.getElementById("seconds");
    const unlockBtn = document.getElementById("unlock-btn");
    
    // Bypass elements
    const bypassToggle = document.getElementById("bypass-toggle");
    const bypassForm = document.getElementById("bypass-form");
    const secretInput = document.getElementById("secret-key-input");
    const submitKeyBtn = document.getElementById("submit-key-btn");
    const errorMsg = document.getElementById("key-error-msg");
    
    // Envelope Elements
    const envelope = document.getElementById("main-envelope");
    const envelopeSeal = document.getElementById("envelope-seal");
    const readLetterBtn = document.getElementById("read-letter-btn");
    
    // Letter Elements
    const typewriterText = document.getElementById("typewriter-text");
    const letterFullText = document.getElementById("letter-full-text");
    const replayLetterBtn = document.getElementById("replay-letter-btn");
    let typewriterInterval = null;
    
    // Polaroid Gallery
    const polaroids = document.querySelectorAll(".polaroid-card");
    const prevBtn = document.getElementById("prev-polaroid-btn");
    const nextBtn = document.getElementById("next-polaroid-btn");
    const carouselIndicator = document.getElementById("carousel-indicator");
    let currentPolaroidIndex = 0;
    
    // Audio Elements
    const audio = document.getElementById("bg-audio");
    const musicWidget = document.getElementById("music-player-widget");
    const musicToggle = document.getElementById("music-toggle-btn");
    let audioInitialized = false;

    // ==========================================
    // 1. Countdown Timer Logic
    // ==========================================
    let isUnlocked = false;

    function updateCountdown() {
        if (isUnlocked) return;
        
        const now = new Date().getTime();
        const diff = TARGET_DATE - now;

        if (diff <= 0) {
            // Unlock Day!
            dVal.textContent = "00";
            hVal.textContent = "00";
            mVal.textContent = "00";
            sVal.textContent = "00";
            
            unlockBtn.disabled = false;
            unlockBtn.classList.remove("disabled");
            unlockBtn.innerHTML = `<i class="fa-solid fa-gift animate-bounce"></i> Open Janapriya's Surprise!`;
            
            // Auto hide passcode bypass
            bypassToggle.style.display = "none";
            bypassForm.classList.add("hidden");
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        dVal.textContent = String(days).padStart(2, '0');
        hVal.textContent = String(hours).padStart(2, '0');
        mVal.textContent = String(minutes).padStart(2, '0');
        sVal.textContent = String(seconds).padStart(2, '0');
    }

    // Run countdown immediately and then every second
    updateCountdown();
    const countdownTimerInterval = setInterval(updateCountdown, 1000);

    // Click on Unlock Button (available when target is reached)
    unlockBtn.addEventListener("click", () => {
        if (!unlockBtn.classList.contains("disabled")) {
            unlockSurprise();
        }
    });

    // ==========================================
    // 2. Bypass / Preview Code Logic
    // ==========================================
    
    // Check URL parameters for instant preview (e.g. ?preview=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("preview") === "true") {
        setTimeout(() => {
            unlockSurprise();
        }, 300);
    }

    // Toggle Secret Key Form Accordion
    bypassToggle.addEventListener("click", () => {
        bypassForm.classList.toggle("hidden");
        errorMsg.classList.add("hidden");
        if (!bypassForm.classList.contains("hidden")) {
            secretInput.focus();
        }
    });

    function checkPasscode() {
        const enteredVal = secretInput.value.trim().toLowerCase();
        if (SECRET_KEYS.includes(enteredVal)) {
            errorMsg.classList.add("hidden");
            unlockSurprise();
        } else {
            errorMsg.classList.remove("hidden");
            // Simple shake animation trigger
            secretInput.classList.add("shake-effect");
            setTimeout(() => secretInput.classList.remove("shake-effect"), 500);
        }
    }

    submitKeyBtn.addEventListener("click", checkPasscode);
    secretInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            checkPasscode();
        }
    });

    // Unlock flow
    function unlockSurprise() {
        isUnlocked = true;
        clearInterval(countdownTimerInterval);
        
        // Start background music
        initAudio();
        
        // Transition: Lock screen fades out
        countdownSec.style.opacity = "0";
        countdownSec.style.transform = "translateY(-20px)";
        
        setTimeout(() => {
            countdownSec.classList.remove("active-section");
            countdownSec.style.display = "none";
            
            // Envelope section fades in
            envelopeSec.style.display = "flex";
            // trigger reflow
            envelopeSec.offsetHeight;
            envelopeSec.classList.add("active-section");
        }, 800);
    }

    // ==========================================
    // 3. Audio / Music Control
    // ==========================================
    const musicTrackName = document.querySelector(".music-track-name");

    // Audio status listeners to update label dynamically
    audio.addEventListener("loadstart", () => {
        musicTrackName.textContent = "Loading Soch Na Sake... 💖";
    });

    audio.addEventListener("waiting", () => {
        musicTrackName.textContent = "Buffering Music... 💖";
    });

    audio.addEventListener("playing", () => {
        musicTrackName.textContent = "Playing Soch Na Sake... 🎵";
        musicWidget.classList.remove("hidden");
        musicToggle.classList.add("spinning");
        musicToggle.innerHTML = '<i class="fa-solid fa-compact-disc"></i>';
    });

    audio.addEventListener("pause", () => {
        musicTrackName.textContent = "Music Paused 🔇";
        musicToggle.classList.remove("spinning");
        musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    });

    audio.addEventListener("error", (e) => {
        console.error("Audio error details: ", e);
        musicTrackName.textContent = "Audio Load Error ⚠️";
    });

    function initAudio() {
        if (audioInitialized) return;
        audio.volume = 0.45;
        
        // Show widget immediately so user sees loading state
        musicWidget.classList.remove("hidden");
        
        // Play audio
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                audioInitialized = true;
            }).catch(error => {
                console.log("Audio autoplay failed, waiting for user click interaction: ", error);
                // Autoplay blocked: show instruction
                musicTrackName.textContent = "Click anywhere to play music 🎵";
                musicToggle.classList.remove("spinning");
                musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            });
        }
    }

    musicToggle.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent global click trigger
        if (audio.paused) {
            audio.play().catch(err => console.log("Failed to play on manual toggle click:", err));
        } else {
            audio.pause();
        }
    });

    // Global document-level click fallback for browsers that block autoplay
    document.addEventListener("click", () => {
        if (isUnlocked && !audioInitialized) {
            audio.play().then(() => {
                audioInitialized = true;
            }).catch(err => {
                console.log("Global click audio play promise failed:", err);
            });
        }
    });

    // ==========================================
    // 4. Envelope Opening Mechanics
    // ==========================================
    
    function triggerEnvelopeOpen() {
        if (envelope.classList.contains("open")) return;
        
        // If audio failed to autoplay, initialize it now
        if (audio.paused) {
            audio.play().then(() => {
                audioInitialized = true;
                musicToggle.classList.add("spinning");
                musicToggle.innerHTML = '<i class="fa-solid fa-compact-disc"></i>';
            }).catch(() => {});
        }
        
        envelope.classList.add("open");
    }

    envelopeSeal.addEventListener("click", (e) => {
        e.stopPropagation();
        triggerEnvelopeOpen();
    });

    envelope.addEventListener("click", triggerEnvelopeOpen);

    readLetterBtn.addEventListener("click", () => {
        // Transition: Envelope fades out
        envelopeSec.style.opacity = "0";
        envelopeSec.style.transform = "translateY(-20px)";
        
        setTimeout(() => {
            envelopeSec.classList.remove("active-section");
            envelopeSec.style.display = "none";
            
            // Celebration section fades in
            celebrationSec.style.display = "flex";
            celebrationSec.offsetHeight;
            celebrationSec.classList.add("active-section");
            
            // Trigger typewriter letter
            startTypewriter();
        }, 800);
    });

    // ==========================================
    // 5. Custom Self-Typing Letter System
    // ==========================================
    function startTypewriter() {
        // Reset container
        typewriterText.innerHTML = "";
        if (typewriterInterval) clearInterval(typewriterInterval);
        
        // Retrieve full text content
        const paragraphs = Array.from(letterFullText.querySelectorAll("p")).map(p => p.textContent);
        let currentParagraphIdx = 0;
        let currentCharIdx = 0;
        
        // Create initial paragraph element
        let pElem = document.createElement("p");
        typewriterText.appendChild(pElem);
        
        // Cursor element
        const cursor = document.createElement("span");
        cursor.className = "typewriter-cursor";
        typewriterText.appendChild(cursor);
        
        function typeNext() {
            if (currentParagraphIdx >= paragraphs.length) {
                // Done typing, cursor stays blinking
                clearInterval(typewriterInterval);
                return;
            }
            
            const currentParaText = paragraphs[currentParagraphIdx];
            if (currentCharIdx < currentParaText.length) {
                pElem.textContent += currentParaText.charAt(currentCharIdx);
                currentCharIdx++;
                // Place cursor at the end
                typewriterText.appendChild(cursor);
            } else {
                // Paragraph finished, move to next after a delay
                currentParagraphIdx++;
                currentCharIdx = 0;
                
                if (currentParagraphIdx < paragraphs.length) {
                    pElem = document.createElement("p");
                    // Insert before cursor
                    typewriterText.insertBefore(pElem, cursor);
                }
            }
        }
        
        // Typing speed: 35ms per character
        typewriterInterval = setInterval(typeNext, 35);
    }

    replayLetterBtn.addEventListener("click", () => {
        startTypewriter();
    });

    // ==========================================
    // 6. Polaroid Gallery Slider
    // ==========================================
    function updatePolaroids() {
        polaroids.forEach((card, idx) => {
            card.classList.remove("active-polaroid");
            if (idx === currentPolaroidIndex) {
                card.classList.add("active-polaroid");
            }
        });
        
        carouselIndicator.textContent = `${currentPolaroidIndex + 1} / ${polaroids.length}`;
    }

    nextBtn.addEventListener("click", () => {
        currentPolaroidIndex = (currentPolaroidIndex + 1) % polaroids.length;
        updatePolaroids();
    });

    prevBtn.addEventListener("click", () => {
        currentPolaroidIndex = (currentPolaroidIndex - 1 + polaroids.length) % polaroids.length;
        updatePolaroids();
    });

    // ==========================================
    // 7. HTML5 Canvas Sky Lanterns & Particle Fireworks Engine
    // ==========================================
    const canvas = document.getElementById("lanterns-canvas");
    const ctx = canvas.getContext("2d");
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Canvas Elements classes
    class SkyLantern {
        constructor() {
            this.reset();
            // Start at random heights initially
            this.y = Math.random() * height;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 50;
            this.size = Math.random() * 12 + 6;
            this.speedY = Math.random() * 0.4 + 0.2;
            this.speedX = Math.sin(Math.random() * 2) * 0.15;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.glowColor = Math.random() > 0.5 ? "rgba(242, 201, 76, " : "rgba(255, 101, 132, "; // gold or pink glow
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            
            // Sway slightly
            this.speedX += Math.sin(this.y * 0.01) * 0.005;
            
            // Check boundary
            if (this.y < -30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // Inner glow filter
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.glowColor + "0.8)";
            
            // Draw lantern shape (cute glowing square with trapezoid top)
            ctx.fillStyle = this.glowColor + "0.65)";
            ctx.beginPath();
            
            const w = this.size;
            const h = this.size * 1.3;
            
            // Custom rounded rectangle / lantern shape
            ctx.moveTo(this.x - w/2, this.y);
            ctx.lineTo(this.x + w/2, this.y);
            ctx.lineTo(this.x + w/3, this.y + h);
            ctx.lineTo(this.x - w/3, this.y + h);
            ctx.closePath();
            ctx.fill();
            
            // Little warm light core
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(255, 235, 150, 1)";
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.beginPath();
            ctx.arc(this.x, this.y + h * 0.7, w/4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    class FireworkParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1.5;
            
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.gravity = 0.06;
            this.opacity = 1;
            this.decay = Math.random() * 0.02 + 0.015;
            this.size = Math.random() * 3.5 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.opacity -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize systems
    const lanterns = [];
    const fireworks = [];
    const colors = ["#FF6584", "#B590E8", "#F2C94C", "#4DEEEA", "#E3859A", "#FFB6C1"];
    
    // Spawn initial lanterns
    const totalLanterns = 40;
    for (let i = 0; i < totalLanterns; i++) {
        lanterns.push(new SkyLantern());
    }

    // Animation Loop
    function animate() {
        // Clear with slight trailing opacity for beautiful firework tails
        ctx.fillStyle = "rgba(7, 9, 19, 0.15)";
        ctx.fillRect(0, 0, width, height);

        // Draw lanterns
        lanterns.forEach(lantern => {
            lantern.update();
            lantern.draw();
        });

        // Draw & update firework sparks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const p = fireworks[i];
            p.update();
            if (p.opacity <= 0) {
                fireworks.splice(i, 1);
            } else {
                p.draw();
            }
        }

        requestAnimationFrame(animate);
    }
    
    // Start animation loop
    animate();

    // Trigger fireworks on user click/tap anywhere in body
    document.body.addEventListener("click", (e) => {
        // Exclude interactive overlay buttons and panel cards
        if (e.target.closest(".glass-panel") || e.target.closest("#music-player-widget")) return;
        
        // Spawn 35-50 particles
        const particleCount = Math.floor(Math.random() * 20) + 30;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        for (let i = 0; i < particleCount; i++) {
            fireworks.push(new FireworkParticle(e.clientX, e.clientY, color));
        }
    });

    // ==========================================
    // 8. Custom wish bubble interactive triggers
    // ==========================================
    const wishButtons = document.querySelectorAll(".wish-bubble-btn");
    
    wishButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent regular fireworks burst at this specific point
            
            const emoji = btn.getAttribute("data-emoji");
            const txt = btn.getAttribute("data-text");
            
            // Trigger 15 matching color sparks right above button
            const rect = btn.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top;
            
            // Sparks
            const wishColor = btn.style.borderColor || "#FF6584";
            for (let i = 0; i < 20; i++) {
                fireworks.push(new FireworkParticle(startX, startY, wishColor));
            }
            
            // Create Floating Word Bubble
            createFloatingWish(startX, startY - 20, emoji, txt);
        });
    });

    function createFloatingWish(x, y, emoji, text) {
        const floatDiv = document.createElement("div");
        floatDiv.className = "sparkle-floating";
        floatDiv.style.left = `${x}px`;
        floatDiv.style.top = `${y}px`;
        floatDiv.innerHTML = `<span style="font-size: 2rem;">${emoji}</span> <span style="background: rgba(20,24,46,0.9); padding: 4px 10px; border-radius: 12px; font-family: var(--font-heading); font-size: 0.85rem; font-weight: 600; color: #FFFFFF; border: 1px solid var(--color-accent-pink); white-space: nowrap; margin-left: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.5)">${text}</span>`;
        
        document.body.appendChild(floatDiv);
        
        // Remove after animation finishes
        setTimeout(() => {
            floatDiv.remove();
        }, 2500);
    }
});
