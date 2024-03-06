const amount = 500;
const baseRadius = 0.5;
const FL = 500;
const defaultSpeed = 1;
let bootSpeed = 400;

let speed = defaultSpeed;
let targetSpeed = defaultSpeed;
let particles = [];
let canvasWidth, canvasHeight;
let context;
let centerX, centerY;
let mouseX, mouseY;

window.addEventListener('load', () => {
    const canvas = document.querySelector('canvas');

    const resize = () => {
        canvasWidth = canvas.width = window.innerWidth;
        canvasHeight = canvas.height = window.innerHeight;
        centerX = canvasWidth * 0.5;
        centerY = canvasHeight * 0.5;
        context = canvas.getContext('2d');
        context.fillStyle = 'white';
    }

    document.addEventListener('resize', resize());

    mouseX = centerX;
    mouseY = centerY;

    for (let i = 0; i < amount; i++) {
        particles[i] = randomizeParticle(new Particle());
        particles[i].z -= (500 * Math.random());
    }

    document.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mousedown', e => {
        targetSpeed = bootSpeed;
    });

    document.addEventListener('mouseup', e => {
        targetSpeed = defaultSpeed;
    });

    setInterval(loop, 10);
});

function loop() {
    context.save();
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.restore();

    speed += (targetSpeed - speed) * 0.01;

    let p;
    let cx, cy;
    let f, x, y, r;
    let pf, px, py, pr;
    let a, a1, a2;
    let rx, ry;

    context.beginPath();

    for (let i = 0; i < amount; i++) {
        p = particles[i];

        p.pastZ = p.z;
        p.z -= speed;

        if (p.z <= 0) {
            randomizeParticle(p);
            continue;
        }

        cx = centerX - (mouseX - centerX) * 1.25;
        cy = centerY - (mouseY - centerY) * 1.25;

        rx = p.x - cx;
        ry = p.y - cy;

        f = FL / p.z;
        x = cx + rx * f;
        y = cy + ry * f;
        r = baseRadius * f;

        pf = FL / p.pastZ;
        px = cx + rx * pf;
        py = cy + ry * pf;
        pr = baseRadius * pf;

        a = Math.atan2(py - y, px - x);
        a1 = a + (Math.PI * 0.5);
        a2 = a - (Math.PI * 0.5);

        context.moveTo(px + pr * Math.cos(a1), py + pr * Math.sin(a1));
        context.arc(px, py, pr, a1, a2, true);
        context.lineTo(x + r * Math.cos(a2), y + r * Math.sin(a2));
        context.arc(x, y, r, a2, a1, true);
        context.closePath();
    }

    context.fill();
}

function Particle(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.pastZ = 0;
}

function randomizeParticle(p) {
    p.x = Math.random() * canvasWidth;
    p.y = Math.random() * canvasHeight;
    p.z = Math.random() * 1500 + 500;
    return p;
}