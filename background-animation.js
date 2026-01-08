const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let w, h, cx, cy;
let points = [];
const pointCount = 400;
let globeRadius = 0;
let angleX = 0;
let angleY = 0;
let mouse = { x: null, y: null };

window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => {
    // Basic interaction: normalize mouse position -1 to 1
    // to control rotation speed or direction
    if (w > 0 && h > 0) {
        mouse.x = (e.clientX - cx) * 0.0001;
        mouse.y = (e.clientY - cy) * 0.0001;
    }
});

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cx = w / 2;
    cy = h / 2;
    // Radius fits on screen but large enough to look grand
    globeRadius = Math.min(w, h) * 0.4;
    initPoints();
}

class Point3D {
    constructor() {
        // Random point on sphere surface
        // Uses spherical coordinates
        // theta: 0 to 2PI (around Y axis)
        // phi: 0 to PI (from North pole to South pole)

        // Uniform distribution on sphere requires acos
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        this.x = globeRadius * Math.sin(phi) * Math.cos(theta);
        this.y = globeRadius * Math.sin(phi) * Math.sin(theta);
        this.z = globeRadius * Math.cos(phi);

        // Store original for resilience
        this.baseX = this.x;
        this.baseY = this.y;
        this.baseZ = this.z;

        this.color = Math.random() > 0.5 ? "rgba(65, 105, 225, 0.8)" : "rgba(0, 191, 255, 0.8)";
    }

    project(rotX, rotY) {
        // 1. Rotate around Y axis
        let x1 = this.x * Math.cos(rotY) - this.z * Math.sin(rotY);
        let z1 = this.z * Math.cos(rotY) + this.x * Math.sin(rotY);

        // 2. Rotate around X axis
        let y1 = this.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = z1 * Math.cos(rotX) + this.y * Math.sin(rotX);

        // 3. Project to 2D
        // Simple perspective
        const scale = 400 / (400 - z2); // 400 is camera distance
        const projX = x1 * scale + cx;
        const projY = y1 * scale + cy;

        return { x: projX, y: projY, scale: scale, z: z2 };
    }
}

function initPoints() {
    points = [];
    for (let i = 0; i < pointCount; i++) {
        points.push(new Point3D());
    }
}

function animate() {
    ctx.clearRect(0, 0, w, h);

    // Auto-rotate + Mouse influence
    angleY += 0.003 + (mouse.x || 0);
    angleX += 0.003 + (mouse.y || 0);

    // Calculate projected positions first
    let projectedPoints = points.map(p => {
        // Apply the rotation permanently to the point? 
        // No, usually we rotate from base setup every frame for stability,
        // OR we rotate the camera. Let's rotate the 'model' conceptually by passing changing angles.
        // Actually, to get continuous rotation we can't just pass 'angleY' to base coords if we want cumulative interaction.
        // But generating fresh from base with incrementing angle is easiest.

        // Update the "current" pos isn't needed if we compute from base every time.
        // Let's modify the class to just return projection of base coordinates rotated by global angle.

        // Recalculate projection based on Base coords + current global Angle
        // 1. Rotate Base around Y (angleY)
        let x1 = p.baseX * Math.cos(angleY) - p.baseZ * Math.sin(angleY);
        let z1 = p.baseZ * Math.cos(angleY) + p.baseX * Math.sin(angleY);

        // 2. Rotate around X (angleX)
        let y1 = p.baseY * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = z1 * Math.cos(angleX) + p.baseY * Math.sin(angleX);

        const scale = 800 / (800 - z2); // increased camera dist for flatter look
        return {
            x: x1 * scale + cx,
            y: y1 * scale + cy,
            scale: scale,
            z: z2,
            color: p.color
        };
    });

    // Draw Connections
    // Only connect points roughly close to each other in 3D would be expensive O(N^2)
    // We can connect close points in 2D for the "Plexus" effect, it looks cool and "glitchy"
    // optimizing: only check subset? 400 points is small enough for N^2/2 (80k checks), JS can handle it on modern machines.
    // Let's restrict line drawing to limit performance hit.

    ctx.lineWidth = 0.5;
    for (let i = 0; i < projectedPoints.length; i++) {
        let p1 = projectedPoints[i];
        // Draw Point
        const size = Math.max(0.5, 2 * p1.scale);
        const alpha = (p1.z + globeRadius) / (2 * globeRadius); // Fade back points

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.fill();

        // Connections (Limit to nearest 10 or just dist check)
        // Optimization: Only connect if 'i' is small? or just do all.
        // Let's connect p[i] to p[j] where j > i

        for (let j = i + 1; j < projectedPoints.length; j++) {
            let p2 = projectedPoints[j];
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 40) { // Threshold for connection
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = "rgba(65, 105, 225, 0.15)";
                ctx.stroke();
            }
        }
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(animate);
}

resize();
animate();
