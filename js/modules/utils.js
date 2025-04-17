// Chuyển đổi tên cây trồng sang tiếng Việt
export function getPlantDisplayName(plantType) {
    const nameMap = {
        'Beetroot': 'Củ dền',
        'Broccoli': 'Bông cải xanh',
        'Chili': 'Ớt',
        'Cucumber': 'Dưa chuột',
        'Pineapple': 'Dứa',
        'Potato': 'Khoai tây',
        'Pumpkin': 'Bí ngô',
        'Strawberry': 'Dâu tây',
        'Watermelon': 'Dưa hấu'
    };
    
    return nameMap[plantType] || plantType;
}

// Lấy màu sắc đặc trưng cho từng loại cây
export function getPlantColors(plantType) {
    const colorMap = {
        'Beetroot': ['#8e2043', '#d13b3b', '#4e1124', '#ff6b6b'],
        'Broccoli': ['#2e8b57', '#90ee90', '#006400', '#50c878'],
        'Chili': ['#ff4500', '#ff6347', '#8b0000', '#ff7f50'],
        'Cucumber': ['#2e8b57', '#90ee90', '#006400', '#9acd32'],
        'Pineapple': ['#ffd700', '#ffff00', '#daa520', '#f0e68c'],
        'Potato': ['#cd853f', '#8b4513', '#d2b48c', '#a0522d'],
        'Pumpkin': ['#ff7f00', '#ff8c00', '#ffa500', '#ff4500'],
        'Strawberry': ['#ff0000', '#ff69b4', '#8b0000', '#dc143c'],
        'Watermelon': ['#ff6347', '#2e8b57', '#ff0000', '#3cb371']
    };
    
    return colorMap[plantType] || ['#ffd700', '#ffff00', '#ffaa00', '#ff8c00'];
}

// Kiểm tra xem có phải ngày mới không
export function isNewDay(date1, date2) {
    return date1.getDate() !== date2.getDate() ||
           date1.getMonth() !== date2.getMonth() ||
           date1.getFullYear() !== date2.getFullYear();
}

// Xáo trộn mảng (Fisher-Yates shuffle)
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Tạo hiệu ứng pixel
export function createPixelHarvestEffect(cell, plantType, harvestValue) {
    const plantColors = getPlantColors(plantType);
    const mainColor = plantColors[0];
    
    // Tạo hiệu ứng flash
    const harvestFlash = document.createElement('div');
    harvestFlash.classList.add('harvest-flash');
    harvestFlash.style.backgroundColor = mainColor;
    harvestFlash.style.mixBlendMode = 'screen';
    cell.appendChild(harvestFlash);
    
    // Hiển thị điểm số
    const pointsElement = document.createElement('div');
    pointsElement.classList.add('points-effect');
    pointsElement.textContent = `+${harvestValue}`;
    cell.appendChild(pointsElement);
    
    // Tạo các đồng xu pixel
    createPixelCoins(cell, 5);
    
    // Tạo các sparkle
    createPixelSparkles(cell, mainColor);
}

// Tạo đồng xu pixel
export function createPixelCoins(cell, count) {
    for (let i = 0; i < count; i++) {
        const coin = document.createElement('div');
        coin.classList.add('coin-particle');
        
        const angle = (i * (360 / count)) * (Math.PI / 180);
        const distance = 30 + Math.random() * 10;
        const xOffset = Math.cos(angle) * distance;
        const yOffset = Math.sin(angle) * distance;
        
        coin.style.setProperty('--x-offset', `${xOffset}px`);
        coin.style.setProperty('--y-offset', `${yOffset < 0 ? yOffset : -20}px`);
        
        const delay = i * 0.05;
        coin.style.animationDelay = `${delay}s`;
        
        cell.appendChild(coin);
        
        setTimeout(() => {
            if (coin.parentNode === cell) {
                coin.remove();
            }
        }, 1000 + delay * 1000);
    }
}

// Tạo sparkle pixel
export function createPixelSparkles(cell, color) {
    const sparkleCount = 8;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('pixel-sparkle');
        
        sparkle.style.backgroundColor = i % 2 === 0 ? '#ffffff' : color;
        
        const size = 4 + Math.floor(Math.random() * 2) * 2;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        
        sparkle.style.top = '50%';
        sparkle.style.left = '50%';
        
        const angle = (i * (360 / sparkleCount)) * (Math.PI / 180);
        const distance = 15;
        const finalDistance = 40;
        
        sparkle.animate([
            {
                transform: 'translate(-50%, -50%)',
                opacity: 0
            },
            {
                transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px))`,
                opacity: 1
            },
            {
                transform: `translate(calc(-50% + ${Math.cos(angle) * finalDistance}px), calc(-50% + ${Math.sin(angle) * finalDistance}px))`,
                opacity: 0
            }
        ], {
            duration: 500,
            easing: 'steps(4)',
            delay: i * 50,
            fill: 'forwards'
        });
        
        cell.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode === cell) {
                sparkle.remove();
            }
        }, 600 + i * 50);
    }
}