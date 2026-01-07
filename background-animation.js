const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let w, h;
let particles = [];
const particleCount = 200;
let mouse = { x: 0, y: 0 };

window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initParticles();
}

class Dust {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.2; // Very slow horizontal drift
        this.vy = (Math.random() - 0.5) * 0.2; // Very slow vertical drift
        this.size = Math.random() * 2; // Small dust motes
        this.baseAlpha = Math.random() * 0.5 + 0.1; // Varied opacity
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.02;
        this.twinkleDir = 1;
    }

    update() {
        // Parallax effect: Move opposite to mouse
        // Calculate offset from center
        const dx = (mouse.x - w / 2) * 0.005; // Sensitivity
        const dy = (mouse.y - h / 2) * 0.005;

        this.x += this.vx - dx * this.size; // Larger particles move more (closer)
        this.y += this.vy - dy * this.size;

        // Wrap around
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;

        // Twinkle
        this.alpha += this.twinkleSpeed * this.twinkleDir;
        if (this.alpha > this.baseAlpha + 0.2 || this.alpha < this.baseAlpha - 0.2) {
            this.twinkleDir *= -1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${Math.max(0, this.alpha)})`; // Pale Blue-White
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Dust());
    }
}

function animate() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

resize();
animate();
