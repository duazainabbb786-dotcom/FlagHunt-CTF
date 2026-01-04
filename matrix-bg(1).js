const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
const lettersArray = letters.split('');

const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
}

function draw() {
    ctx.fillStyle = 'rgba(5, 5, 16, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0FF0FC';
    ctx.font = `${fontSize}px monospace`;
    
    for (let i = 0; i < drops.length; i++) {
        const text = lettersArray[Math.floor(Math.random() * lettersArray.length)];
        
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        ctx.fillStyle = '#0FF0FC';
        ctx.fillText(text, x, y);
        
        // Draw glow effect
        ctx.shadowColor = '#0FF0FC';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(15, 240, 252, 0.8)';
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;
        
        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        drops[i]++;
    }
}

function animate() {
    draw();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reset drops array
    const newColumns = canvas.width / fontSize;
    drops.length = 0;
    for (let i = 0; i < newColumns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
});