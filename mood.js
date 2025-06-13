const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let animationFrameId;
let currentMood = 'rainy';
let particles = [];
let time = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createRain() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 5 + 2,
            length: Math.random() * 20 + 10,
            width: Math.random() * 2 + 1
        });
    }
}

function createSunshine() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            angle: Math.random() * Math.PI * 2,
            length: Math.random() * 100 + 50,
            opacity: Math.random() * 0.5 + 0.2,
            speed: Math.random() * 0.02 + 0.01
        });
    }
}

function createStars() {
    particles = [];
    for (let i = 0; i < 200; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.5,
            twinkleSpeed: Math.random() * 0.05 + 0.02
        });
    }
}

function createPetals() {
    particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 2,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: Math.random() * 0.8 + 0.8,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 0.8 + 0.4,
            amplitude: Math.random() * 15 + 8,
            frequency: Math.random() * 0.012 + 0.006,
            color: ['#f9a8d4', '#f472b6', '#fef2f2'][Math.floor(Math.random() * 3)]
        });
    }
}

function drawSpringBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#fce7f3');
    gradient.addColorStop(1, '#f9a8d4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animateRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    particles.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length);
        ctx.lineWidth = p.width;
        ctx.stroke();
        p.y += p.speed;
        if (p.y > canvas.height) {
            p.y = -p.length;
            p.x = Math.random() * canvas.width;
        }
    });
    animationFrameId = requestAnimationFrame(animateRain);
}

function animateSunshine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    particles.forEach(p => {
        ctx.beginPath();
        const endX = p.x + Math.cos(p.angle) * p.length;
        const endY = p.y + Math.sin(p.angle) * p.length;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(endX, endY);
        ctx.globalAlpha = p.opacity;
        ctx.stroke();
        p.angle += p.speed;
    });
    ctx.globalAlpha = 1;
    animationFrameId = requestAnimationFrame(animateSunshine);
}

function drawCrescentMoon() {
    const moonX = canvas.width - 140;
    const moonY = 140;
    const moonRadius = 50;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 224, 0.9)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + 20, moonY - 5, moonRadius * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fill();
    ctx.shadowColor = 'rgba(255, 255, 224, 0.5)';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 224, 0.9)';
    ctx.fill();
    ctx.shadowBlur = 0;
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCrescentMoon();
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
        p.opacity += Math.sin(Date.now() * p.twinkleSpeed) * 0.02;
        if (p.opacity < 0) p.opacity = 0;
        if (p.opacity > 1) p.opacity = 1;
    });
    animationFrameId = requestAnimationFrame(animateStars);
}

function animatePetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpringBackground();
    time += 0.03;
    particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius, p.radius / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
        p.x += p.speedX + p.amplitude * Math.sin(time * p.frequency);
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height + p.radius || p.x < -p.radius || p.x > canvas.width + p.radius) {
            p.y = -p.radius;
            p.x = Math.random() * canvas.width;
            p.speedX = (Math.random() - 0.5) * 0.4;
            p.rotation = Math.random() * 360;
            p.rotationSpeed = Math.random() * 0.8 + 0.4;
            p.amplitude = Math.random() * 15 + 8;
            p.frequency = Math.random() * 0.012 + 0.006;
        }
    });
    animationFrameId = requestAnimationFrame(animatePetals);
}

const moodButtons = document.querySelectorAll('.mood-btn');
const toggleSoundBtn = document.querySelector('#toggle-sound');
let isSoundPlaying = false;

const audioRainy = document.getElementById('audio-rainy');
const audioSunny = document.getElementById('audio-sunny');
const audioNight = document.getElementById('audio-night');

function stopAllAudio() {
    [audioRainy, audioSunny, audioNight].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function playCurrentMoodAudio() {
    if (!isSoundPlaying) return;
    stopAllAudio();
    if (currentMood === 'rainy') {
        audioRainy.play();
    } else if (currentMood === 'sunny') {
        audioSunny.play();
    } else if (currentMood === 'night') {
        audioNight.play();
    }
}

moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        moodButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.body.className = `mood-${btn.dataset.mood}`;
        currentMood = btn.dataset.mood;
        stopAllAudio();
        playCurrentMoodAudio();

        cancelAnimationFrame(animationFrameId);
        if (currentMood === 'rainy') {
            createRain();
            animateRain();
        } else if (currentMood === 'sunny') {
            createSunshine();
            animateSunshine();
        } else if (currentMood === 'night') {
            createStars();
            animateStars();
        } else if (currentMood === 'spring') {
            createPetals();
            animatePetals();
        }
    });
});

toggleSoundBtn.addEventListener('click', () => {
    isSoundPlaying = !isSoundPlaying;
    toggleSoundBtn.textContent = isSoundPlaying ? 'Pause Sound' : 'Play Sound';
    if (isSoundPlaying) {
        playCurrentMoodAudio();
    } else {
        stopAllAudio();
    }
});

createRain();
animateRain();