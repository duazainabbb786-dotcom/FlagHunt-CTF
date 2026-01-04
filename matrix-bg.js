// Binary Rain Matrix Effect
class BinaryRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.drops = [];
        this.fontSize = 14;
        this.columns = 0;
        
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }
    
    init() {
        this.resize();
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = {
                y: Math.random() * -100,
                speed: Math.random() * 3 + 1,
                length: Math.floor(Math.random() * 20) + 5,
                chars: this.generateBinaryString(20)
            };
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops.length = this.columns;
    }
    
    generateBinaryString(length) {
        let binary = '';
        for (let i = 0; i < length; i++) {
            binary += Math.random() > 0.5 ? '1' : '0';
        }
        return binary;
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(10, 14, 23, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = `${this.fontSize}px 'Share Tech Mono'`;
        
        for (let i = 0; i < this.columns; i++) {
            const drop = this.drops[i];
            drop.y += drop.speed;
            
            if (drop.y > this.canvas.height + drop.length * this.fontSize) {
                drop.y = Math.random() * -100;
                drop.speed = Math.random() * 3 + 1;
                drop.chars = this.generateBinaryString(20);
            }
            
            for (let j = 0; j < drop.length; j++) {
                const charY = drop.y - j * this.fontSize;
                if (charY < -this.fontSize || charY > this.canvas.height) continue;
                
                const opacity = j === 0 ? 1 : 1 - (j / drop.length);
                
                if (j === 0) {
                    this.ctx.fillStyle = '#00ff9d';
                } else if (j === 1) {
                    this.ctx.fillStyle = '#00cc7d';
                } else if (j <= 3) {
                    this.ctx.fillStyle = '#00995c';
                } else {
                    this.ctx.fillStyle = '#00663c';
                }
                
                this.ctx.globalAlpha = opacity;
                this.ctx.fillText(drop.chars[j], i * this.fontSize, charY);
            }
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Particle System
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }
    
    init() {
        this.resize();
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle() {
        const colors = ['#00f3ff', '#b967ff', '#ff2a6d', '#00ff9d', '#ffde59'];
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.5 + 0.1
        };
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(10, 14, 23, 0.01)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fill();
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = p.color;
                    this.ctx.globalAlpha = (1 - distance / 100) * 0.2;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize effects
document.addEventListener('DOMContentLoaded', function() {
    new BinaryRain('binaryCanvas');
    new ParticleSystem('particleCanvas');
});