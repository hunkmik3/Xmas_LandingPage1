// Snow effect for mobile
document.addEventListener('DOMContentLoaded', function() {
    const bannerOverlay = document.querySelector('.banner-overlay');
    const statusTimeElement = document.getElementById('status-time');
    const statusGiftsElement = document.getElementById('status-gifts');
    const bodyElement = document.body;
    const DEFAULT_GIFT_COUNT = 50;
    const APP_SCRIPT_CONFIG = {
        /**
         * URL Web App đã deploy từ Apps Script (Execute as: Me, Access: Anyone)
         * Ví dụ: https://script.google.com/macros/s/XXX/exec
         */
        endpoint: '',
        /**
         * SECRET_KEY phải trùng với hằng số trong Apps Script (ví dụ: 'parcmall12')
         */
        secretKey: ''
    };
    if (bannerOverlay) {
        const changeover = new Date(2025, 11, 7, 0, 0, 0); // 7 Dec 2025 local time
        bannerOverlay.src = new Date() < changeover ? 'images/1.png' : 'images/2.png';
    }

    setLoadingState(true);
    hydrateGiftCount();

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

    async function hydrateGiftCount() {
        setLoadingState(true);
        try {
            const count = await fetchGiftCount();
            updateGiftState(count);
            updateTimeStamp();
        } finally {
            setLoadingState(false);
        }
    }

    function updateGiftState(count) {
        const parsedCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : DEFAULT_GIFT_COUNT;
        if (statusGiftsElement) {
            statusGiftsElement.textContent = `Quà còn lại: ${parsedCount}`;
        }
        bodyElement.classList.toggle('sold-out-active', parsedCount <= 0);
    }

    function setLoadingState(isLoading) {
        bodyElement.classList.toggle('loading-gifts', isLoading);
    }

    async function fetchGiftCount() {
        const { endpoint, secretKey } = APP_SCRIPT_CONFIG;
        if (!endpoint || !secretKey) {
            console.warn('APP_SCRIPT_CONFIG chưa cấu hình endpoint/secretKey, dùng mặc định.');
            return DEFAULT_GIFT_COUNT;
        }
        try {
            const url = buildAppScriptUrl(endpoint, secretKey);
            // Dùng fetch GET đơn giản để tránh preflight CORS
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`App Script error: ${response.status}`);
            }
            const payload = await response.json();
            const value = extractGiftCountFromAppScript(payload);
            return Number.isFinite(value) ? value : DEFAULT_GIFT_COUNT;
        } catch (error) {
            console.error('Không thể lấy dữ liệu từ Apps Script:', error);
            return DEFAULT_GIFT_COUNT;
        }
    }

    function extractGiftCountFromAppScript(payload) {
        if (!payload || typeof payload !== 'object') {
            return DEFAULT_GIFT_COUNT;
        }
        if (typeof payload.giftsLeft === 'number') {
            return payload.giftsLeft;
        }
        const numeric = Number(payload.giftsLeft);
        return Number.isFinite(numeric) ? numeric : DEFAULT_GIFT_COUNT;
    }

    function buildAppScriptUrl(endpoint, secretKey) {
        const base = endpoint.trim();
        const hasQuery = base.includes('?');
        const sep = hasQuery ? '&' : '?';
        const cb = Date.now();
        return `${base}${sep}key=${encodeURIComponent(secretKey)}&cb=${cb}`;
    }

    function updateTimeStamp() {
        if (!statusTimeElement) return;
        const now = new Date();
        const two = (n) => n.toString().padStart(2, '0');
        const time = `${two(now.getHours())}:${two(now.getMinutes())}`;
        const date = `${two(now.getDate())}/${two(now.getMonth() + 1)}/${now.getFullYear()}`;
        statusTimeElement.textContent = `${time} ${date}`;
    }
});
