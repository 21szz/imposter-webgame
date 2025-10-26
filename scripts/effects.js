// Special effects and animations
class EffectsManager {
    constructor() {
        this.particlesContainer = document.querySelector('.particles');
        this.initParticles();
    }
    
    initParticles() {
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${this.randomColor()};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.1};
            animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
        `;
        
        this.particlesContainer.appendChild(particle);
    }
    
    randomColor() {
        const colors = [
            'rgba(99, 102, 241, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    startLoadingAnimation() {
        // Add additional loading effects
        this.createLoadingParticles();
    }
    
    createLoadingParticles() {
        const loadingContainer = document.querySelector('.loading-container');
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: ${this.randomColor()};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.7 + 0.3};
                animation: loadingFloat ${Math.random() * 3 + 2}s ease-in-out infinite;
            `;
            loadingContainer.appendChild(particle);
        }
    }
}

// Global effects manager
const effectsManager = new EffectsManager();

function startLoadingAnimation() {
    effectsManager.startLoadingAnimation();
}

// Add CSS for particle animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
        50% { transform: translateY(0px) translateX(20px) rotate(180deg); }
        75% { transform: translateY(20px) translateX(10px) rotate(270deg); }
        100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
    }
    
    @keyframes loadingFloat {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
        50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
    }
`;
document.head.appendChild(style);