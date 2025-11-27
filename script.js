// Snow effect for mobile
document.addEventListener('DOMContentLoaded', function() {
    const snowContainer = document.getElementById('snow-container');
    const snowflakes = ['❄', '❅', '❆', '✻', '✼', '❉'];
    
    // Number of snowflakes based on screen size (optimized for mobile)
    const getSnowflakeCount = () => {
        const width = window.innerWidth;
        if (width < 480) return 30; // Small mobile
        if (width < 768) return 50; // Large mobile
        return 70; // Tablet and above
    };
    
    let snowflakeCount = getSnowflakeCount();
    
    // Create snowflakes
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        
        // Random starting position
        snowflake.style.left = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 0.8 + 0.5; // 0.5em to 1.3em
        snowflake.style.fontSize = size + 'em';
        
        // Random animation duration (falling speed)
        const duration = Math.random() * 3 + 5; // 5s to 8s
        snowflake.style.animation = `snowfall ${duration}s linear infinite`;
        
        // Random delay
        snowflake.style.animationDelay = Math.random() * 2 + 's';
        
        // Random opacity
        snowflake.style.opacity = Math.random() * 0.5 + 0.5; // 0.5 to 1
        
        snowContainer.appendChild(snowflake);
        
        // Remove snowflake after animation completes
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.remove();
            }
        }, (duration + 2) * 1000);
    }
    
    // Initialize snowflakes
    function initSnow() {
        // Clear existing snowflakes
        snowContainer.innerHTML = '';
        
        // Create initial snowflakes
        for (let i = 0; i < snowflakeCount; i++) {
            setTimeout(() => {
                createSnowflake();
            }, i * 100);
        }
        
        // Continuously create new snowflakes
        setInterval(() => {
            if (snowContainer.children.length < snowflakeCount) {
                createSnowflake();
            }
        }, 500);
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            snowflakeCount = getSnowflakeCount();
            initSnow();
        }, 250);
    });
    
    // Start snow effect
    initSnow();
});
