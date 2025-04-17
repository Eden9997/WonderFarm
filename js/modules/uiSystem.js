import { config } from './config.js';
import { gameState } from './gameState.js';
import { plantCrop } from './plantSystem.js';
import { playSound } from './audioSystem.js';
import { getPlantDisplayName } from './utils.js';
import { renderQuestsList } from './questSystem.js';
import { renderAchievementsList } from './achievementSystem.js';
import { renderLeaderboard } from './leaderboardSystem.js';
import { applySeedPriceDiscount } from './characterSystem.js';
import { renderShopItems } from './shopSystem.js';

// DOM elements
const farmGrid = document.getElementById('farm-grid');
const plantMenu = document.getElementById('plant-menu');
const closeMenuBtn = document.getElementById('close-menu');
const plantItems = document.querySelectorAll('.plant-item');
const playerMoneyDisplay = document.getElementById('player-money');

// DOM elements for tabs
const showQuestsBtn = document.getElementById('show-quests');
const showAchievementsBtn = document.getElementById('show-achievements');
const showLeaderboardBtn = document.getElementById('show-leaderboard');
const showShopBtn = document.getElementById('show-shop');
const questsPanel = document.getElementById('quests-panel');
const achievementsPanel = document.getElementById('achievements-panel');
const leaderboardPanel = document.getElementById('leaderboard-panel');
const shopPanel = document.getElementById('shop-panel');
const closeQuestsBtn = document.getElementById('close-quests');
const closeAchievementsBtn = document.getElementById('close-achievements');
const closeLeaderboardBtn = document.getElementById('close-leaderboard');
const closeShopBtn = document.getElementById('close-shop');

// Theo dõi popup hiện tại đang mở
let currentOpenPopup = null;

// Biến kiểm soát hướng màn hình
let isPortraitMode = true;

/**
 * Khởi tạo các cài đặt đặc biệt cho Telegram Mini App
 */
export function initTelegramApp() {
    // Kiểm tra nếu đang chạy trong Telegram Mini App
    if (window.Telegram && window.Telegram.WebApp) {
        console.log("Phát hiện Telegram Mini App");
        
        // Khai báo rằng ứng dụng đã sẵn sàng để hiển thị
        window.Telegram.WebApp.ready();
        
        // Thiết lập các thuộc tính chính
        window.Telegram.WebApp.MainButton.hide();
        
        // Thiết lập theme màu sắc từ Telegram
        applyTelegramTheme();
        
        // Đặt background color đúng với theme
        if (window.Telegram.WebApp.colorScheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        // Thiết lập các tham số mở rộng
        setupTelegramViewport();
        
        // Xử lý các sự kiện đặc biệt
        window.addEventListener('focus', applyTelegramTheme);
        window.addEventListener('blur', applyTelegramTheme);
    }
    
    // Gắn sự kiện xử lý khi thay đổi hướng màn hình
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', checkOrientation);
    
    // Kiểm tra hướng màn hình khởi đầu
    checkOrientation();
}

/**
 * Kiểm tra và xử lý hướng màn hình
 */
function checkOrientation() {
    // Xác định hướng màn hình là dọc hay ngang
    isPortraitMode = window.innerHeight > window.innerWidth;
    
    if (!isPortraitMode) {
        // Hiển thị cảnh báo nếu ở chế độ ngang
        showOrientationWarning(true);
    } else {
        // Ẩn cảnh báo nếu ở chế độ dọc
        showOrientationWarning(false);
    }
    
    // Tối ưu hóa layout dựa trên kích thước màn hình
    optimizeLayoutForScreenSize();
}

/**
 * Xử lý sự kiện khi thay đổi hướng màn hình
 */
function handleOrientationChange() {
    setTimeout(checkOrientation, 300); // Đợi 300ms để đảm bảo kích thước đã cập nhật
}

/**
 * Áp dụng theme từ Telegram
 */
function applyTelegramTheme() {
    if (window.Telegram && window.Telegram.WebApp) {
        const themeParams = window.Telegram.WebApp.themeParams;
        
        if (themeParams) {
            document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color || '#222222');
            document.documentElement.style.setProperty('--tg-theme-hint-color', themeParams.hint_color || '#999999');
            document.documentElement.style.setProperty('--tg-theme-link-color', themeParams.link_color || '#2481cc');
            document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color || '#3390ec');
            document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color || '#ffffff');
        }
    }
}

/**
 * Thiết lập viewport cho Telegram Mini App
 */
function setupTelegramViewport() {
    if (window.Telegram && window.Telegram.WebApp) {
        // Đặt viewport để tránh lỗi zoom trên iOS
        const viewportMeta = document.querySelector('meta[name=viewport]');
        if (viewportMeta) {
            viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
        
        // Đặt viewport height
        document.documentElement.style.setProperty('--tg-viewport-height', `${window.Telegram.WebApp.viewportHeight}px`);
        document.documentElement.style.setProperty('--tg-viewport-stable-height', `${window.Telegram.WebApp.viewportStableHeight}px`);
    }
}

/**
 * Hiển thị/ẩn cảnh báo hướng màn hình
 * @param {boolean} show - Có hiển thị cảnh báo hay không
 */
function showOrientationWarning(show) {
    let orientationWarning = document.getElementById('orientation-warning');
    
    if (show) {
        if (!orientationWarning) {
            orientationWarning = document.createElement('div');
            orientationWarning.id = 'orientation-warning';
            orientationWarning.className = 'orientation-warning';
            orientationWarning.innerHTML = `
                <div class="warning-content">
                    <div class="warning-icon">📱</div>
                    <div class="warning-text">Vui lòng xoay thiết bị sang chế độ dọc để trải nghiệm tốt nhất</div>
                </div>
            `;
            document.body.appendChild(orientationWarning);
        }
        orientationWarning.style.display = 'flex';
    } else if (orientationWarning) {
        orientationWarning.style.display = 'none';
    }
}

/**
 * Tối ưu hóa layout dựa trên kích thước màn hình hiện tại
 */
function optimizeLayoutForScreenSize() {
    // Kích thước màn hình
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Lấy các phần tử chính cần điều chỉnh
    const gameContainer = document.querySelector('.game-container');
    const gameBackground = document.querySelector('.game-background');
    const farmGrid = document.querySelector('.farm-grid');
    const farmCharacter = document.querySelector('.farm-character-container');
    
    // Đảm bảo game không bị tràn màn hình
    if (gameContainer && gameBackground) {
        if (width < 400) {
            // Màn hình nhỏ
            gameBackground.style.width = '100vw';
            gameBackground.style.height = 'calc(100vh - 60px)';
            
            if (farmGrid) {
                // Điều chỉnh lưới trang trại cho màn hình nhỏ
                farmGrid.style.width = '90%';
                farmGrid.style.height = '50%';
                farmGrid.style.marginTop = '20%';
            }
            
            if (farmCharacter) {
                // Điều chỉnh vị trí nhân vật cho màn hình nhỏ
                farmCharacter.style.bottom = '20%';
            }
        } else if (width < 768) {
            // Màn hình vừa
            gameBackground.style.width = '100vw';
            gameBackground.style.height = 'calc(100vh - 60px)';
            
            if (farmGrid) {
                farmGrid.style.width = '90%';
                farmGrid.style.height = '55%';
                farmGrid.style.marginTop = '15%';
            }
            
            if (farmCharacter) {
                farmCharacter.style.bottom = '15%';
            }
        } else {
            // Màn hình lớn - giữ nguyên thiết kế
            gameBackground.style.width = '';
            gameBackground.style.height = '';
            
            if (farmGrid) {
                farmGrid.style.width = '';
                farmGrid.style.height = '';
                farmGrid.style.marginTop = '';
            }
            
            if (farmCharacter) {
                farmCharacter.style.bottom = '';
            }
        }
    }
    
    // Điều chỉnh kích thước font chữ
    adjustFontSizes(width);
}

/**
 * Điều chỉnh kích thước font chữ theo kích thước màn hình
 * @param {number} screenWidth - Chiều rộng màn hình
 */
function adjustFontSizes(screenWidth) {
    // Xác định hệ số điều chỉnh dựa trên chiều rộng màn hình
    let scaleFactor = 1;
    
    if (screenWidth < 360) {
        // Điện thoại rất nhỏ
        scaleFactor = 0.8;
    } else if (screenWidth < 480) {
        // Điện thoại nhỏ
        scaleFactor = 0.9;
    } else if (screenWidth < 768) {
        // Điện thoại/máy tính bảng
        scaleFactor = 1;
    } else {
        // Màn hình lớn
        scaleFactor = 1.1;
    }
    
    // Áp dụng hệ số cho font-size gốc
    document.documentElement.style.setProperty('--base-font-size', `${16 * scaleFactor}px`);
    
    // Điều chỉnh kích thước các phần tử cụ thể nếu cần
    if (screenWidth < 400) {
        document.querySelectorAll('.shop-item-title, .quest-item-title, .achievement-item-title').forEach(el => {
            el.style.fontSize = '14px';
        });
        
        document.querySelectorAll('.shop-item-description, .quest-item-description, .achievement-item-description').forEach(el => {
            el.style.fontSize = '12px';
        });
    } else {
        document.querySelectorAll('.shop-item-title, .quest-item-title, .achievement-item-title').forEach(el => {
            el.style.fontSize = '';
        });
        
        document.querySelectorAll('.shop-item-description, .quest-item-description, .achievement-item-description').forEach(el => {
            el.style.fontSize = '';
        });
    }
}

export function createGrid() {
    farmGrid.innerHTML = '';
    let index = 1;
    
    for (let row = 0; row < config.gridHeight; row++) {
        for (let col = 0; col < config.gridWidth; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell', 'empty');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.dataset.index = index++;
            farmGrid.appendChild(cell);
        }
    }
}

export function updatePlantMenuImages() {
    const plantTypes = [
        'Beetroot', 'Broccoli', 'Chili', 'Cucumber', 'Pineapple', 
        'Potato', 'Pumpkin', 'Strawberry', 'Watermelon'
    ];
    
    plantTypes.forEach(plantType => {
        const menuItem = document.querySelector(`.plant-item[data-plant="${plantType}"] img`);
        if (menuItem) {
            menuItem.style.backgroundImage = `url(img/plant/${plantType}.png)`;
            menuItem.style.backgroundSize = `${config.growthStages * 100}% 100%`;
            menuItem.style.backgroundPosition = '100% 0';
            menuItem.style.backgroundRepeat = 'no-repeat';
            menuItem.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }
    });
}

export function preloadPlantImages() {
    const plantTypes = [
        'Beetroot', 'Broccoli', 'Chili', 'Cucumber', 'Pineapple', 
        'Potato', 'Pumpkin', 'Strawberry', 'Watermelon'
    ];
    
    let loadedImages = 0;
    const totalImages = plantTypes.length;
    
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Đang tải hình ảnh...';
    document.body.appendChild(loadingIndicator);
    
    const menuImageElements = {};
    
    plantTypes.forEach(plantType => {
        const menuItem = document.querySelector(`.plant-item[data-plant="${plantType}"] img`);
        if (menuItem) {
            menuImageElements[plantType] = menuItem;
            const originalSrc = menuItem.src;
            gameState.plantImages[plantType] = [];
            
            for (let i = 0; i < config.growthStages; i++) {
                const img = new Image();
                img.src = originalSrc;
                gameState.plantImages[plantType][i] = img;
            }
        }
    });
    
    updatePlantMenuImages();
    
    loadedImages = totalImages;
    loadingIndicator.remove();
}

export function setupEventListeners() {
    // Sự kiện click trên ô đất
    farmGrid.addEventListener('click', (e) => {
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        
        if (cell.classList.contains('planted')) {
            showMessage("Cây đang phát triển !");
            playSound('error');
            return;
        }
        
        // Cập nhật ô đất đã chọn
        gameState.selectedCell = cell;
        
        // Mở menu cây trồng
        openPlantMenu();
        
        // Ngăn chặn việc lan truyền sự kiện đến document
        e.stopPropagation();
    });
    
    closeMenuBtn.addEventListener('click', (e) => {
        closePlantMenu();
        e.stopPropagation(); // Ngăn chặn lan truyền
    });
    
    // Các sự kiện cho các mục cây trồng
    plantItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const plantType = item.dataset.plant;
            if (gameState.selectedCell && plantType) {
                // Apply seed price discount from character equipment
                const basePrice = config.seedPrice[plantType];
                const discountedPrice = applySeedPriceDiscount(basePrice);
                
                if (gameState.money >= discountedPrice) {
                    gameState.money -= discountedPrice;
                    updateMoneyDisplay();
                    
                    plantCrop(gameState.selectedCell, plantType);
                    closePlantMenu();
                    
                    // Update message to show discounted price
                    if (discountedPrice < basePrice) {
                        showMessage(`Đã mua ${getPlantDisplayName(plantType)} với giá ${discountedPrice} xu (Giảm ${basePrice - discountedPrice} xu)`);
                    } else {
                        showMessage(`Đã mua ${getPlantDisplayName(plantType)} với giá ${discountedPrice} xu`);
                    }
                } else {
                    showMessage(`Không đủ tiền! Cần ${discountedPrice} xu để mua ${getPlantDisplayName(plantType)}`);
                    playSound('error');
                }
            }
            e.stopPropagation(); // Ngăn chặn lan truyền
        });
    });

    // Sự kiện cho các nút mở panel
    showQuestsBtn.addEventListener('click', (e) => {
        // Đóng các popup khác trước khi mở popup nhiệm vụ
        closeAllPopups();
        questsPanel.classList.add('show');
        renderQuestsList();
        currentOpenPopup = questsPanel;
        e.stopPropagation(); // Ngăn chặn lan truyền
    });

    closeQuestsBtn.addEventListener('click', (e) => {
        questsPanel.classList.remove('show');
        currentOpenPopup = null;
        e.stopPropagation(); // Ngăn chặn lan truyền
    });

    showAchievementsBtn.addEventListener('click', (e) => {
        // Đóng các popup khác trước khi mở popup thành tích
        closeAllPopups();
        achievementsPanel.classList.add('show');
        renderAchievementsList();
        currentOpenPopup = achievementsPanel;
        e.stopPropagation(); // Ngăn chặn lan truyền
    });

    closeAchievementsBtn.addEventListener('click', (e) => {
        achievementsPanel.classList.remove('show');
        currentOpenPopup = null;
        e.stopPropagation(); // Ngăn chặn lan truyền
    });

    showLeaderboardBtn.addEventListener('click', (e) => {
        // Đóng các popup khác trước khi mở popup bảng xếp hạng
        closeAllPopups();
        leaderboardPanel.classList.add('show');
        renderLeaderboard();
        currentOpenPopup = leaderboardPanel;
        e.stopPropagation(); // Ngăn chặn lan truyền
    });

    closeLeaderboardBtn.addEventListener('click', (e) => {
        leaderboardPanel.classList.remove('show');
        currentOpenPopup = null;
        e.stopPropagation(); // Ngăn chặn lan truyền
    });
    
    // Thêm xử lý sự kiện cho nút Shop và đóng Shop
    showShopBtn.addEventListener('click', (e) => {
        // Đóng các popup khác trước khi mở popup cửa hàng
        closeAllPopups();
        shopPanel.classList.add('show');
        renderShopItems(); // Hàm này sẽ được gọi từ shopSystem.js
        currentOpenPopup = shopPanel;
        e.stopPropagation(); // Ngăn chặn lan truyền
    });

    closeShopBtn.addEventListener('click', (e) => {
        shopPanel.classList.remove('show');
        currentOpenPopup = null;
        e.stopPropagation(); // Ngăn chặn lan truyền
    });

    // Sự kiện click trên document để đóng các popup khi click ra ngoài
    document.addEventListener('click', (e) => {
        // Bỏ qua nếu click là trên các nút mở popup
        if (e.target === showQuestsBtn || e.target === showAchievementsBtn || e.target === showLeaderboardBtn || e.target === showShopBtn ||
            showQuestsBtn.contains(e.target) || showAchievementsBtn.contains(e.target) || showLeaderboardBtn.contains(e.target) || showShopBtn.contains(e.target)) {
            return;
        }
        
        // Kiểm tra các phần tử grid-cell
        if (e.target.closest('.grid-cell')) {
            return; // Không đóng popup nếu click vào ô đất
        }

        // Đóng popup hiện tại nếu click ra ngoài
        if (currentOpenPopup && !currentOpenPopup.contains(e.target)) {
            if (currentOpenPopup === questsPanel) {
                questsPanel.classList.remove('show');
            } else if (currentOpenPopup === achievementsPanel) {
                achievementsPanel.classList.remove('show');
            } else if (currentOpenPopup === leaderboardPanel) {
                leaderboardPanel.classList.remove('show');
            } else if (currentOpenPopup === shopPanel) {
                shopPanel.classList.remove('show');
            } else if (currentOpenPopup === plantMenu) {
                closePlantMenu();
            }
            currentOpenPopup = null;
        }
    });

    // Ngăn sự kiện click trên các panel lan ra ngoài
    questsPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    achievementsPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    leaderboardPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    shopPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    plantMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Hàm đóng tất cả các popup
function closeAllPopups() {
    // Đóng tất cả các popup hiện có
    if (plantMenu.classList.contains('show')) {
        closePlantMenu();
    }
    
    questsPanel.classList.remove('show');
    achievementsPanel.classList.remove('show');
    leaderboardPanel.classList.remove('show');
    shopPanel.classList.remove('show');
    
    currentOpenPopup = null;
}

export function openPlantMenu() {
    // Đóng các popup khác trước khi mở menu cây trồng
    closeAllPopups();
    
    const gameBackground = document.querySelector('.game-background');
    const backgroundRect = gameBackground.getBoundingClientRect();
    
    // Thay vì xóa class 'hidden', chúng ta thêm class 'show'
    plantMenu.classList.add('show');
    plantMenu.classList.remove('hidden');
    
    plantMenu.style.maxWidth = `${backgroundRect.width}px`;
    plantMenu.style.width = `${backgroundRect.width}px`;
    
    plantMenu.style.left = `${backgroundRect.left}px`;
    plantMenu.style.bottom = `${window.innerHeight - backgroundRect.bottom}px`;
    
    updatePlantMenuPrices();
    playSound('open');
    
    currentOpenPopup = plantMenu;
}

export function closePlantMenu() {
    // Thay vì thêm class 'hidden', chúng ta xóa class 'show'
    plantMenu.classList.remove('show');
    plantMenu.classList.add('hidden');
    
    playSound('close');
    gameState.selectedCell = null;
    
    if (currentOpenPopup === plantMenu) {
        currentOpenPopup = null;
    }
}

export function updatePlantMenuPrices() {
    plantItems.forEach(item => {
        const plantType = item.dataset.plant;
        // Apply seed price discount from character equipment
        const basePrice = config.seedPrice[plantType];
        const discountedPrice = applySeedPriceDiscount(basePrice);
        const harvestValue = config.harvestValue[plantType];
        const growthTime = config.growthTime[plantType];
        
        let priceLabel = item.querySelector('.price-label');
        if (!priceLabel) {
            priceLabel = document.createElement('div');
            priceLabel.classList.add('price-label');
            item.appendChild(priceLabel);
        }
        
        // Display discounted price
        priceLabel.textContent = `${discountedPrice} 🪙`;
        
        // If there's a discount, show original price struck through
        if (discountedPrice < basePrice) {
            priceLabel.innerHTML = `<span style="text-decoration: line-through; font-size: 8px;">${basePrice}</span> ${discountedPrice} 🪙`;
        }
        
        let infoContainer = item.querySelector('.plant-info');
        if (!infoContainer) {
            infoContainer = document.createElement('div');
            infoContainer.classList.add('plant-info');
            item.appendChild(infoContainer);
            
            const timeRow = document.createElement('div');
            timeRow.classList.add('info-row');
            
            const timeLabel = document.createElement('span');
            timeLabel.classList.add('info-label');
            timeLabel.textContent = 'Thời gian:';
            
            const timeValue = document.createElement('span');
            timeValue.classList.add('info-value', 'growth-time');
            timeValue.textContent = `${growthTime}s`;
            
            timeRow.appendChild(timeLabel);
            timeRow.appendChild(timeValue);
            infoContainer.appendChild(timeRow);
            
            const valueRow = document.createElement('div');
            valueRow.classList.add('info-row');
            
            const valueLabel = document.createElement('span');
            valueLabel.classList.add('info-label');
            valueLabel.textContent = 'Thu hoạch:';
            
            const valueAmount = document.createElement('span');
            valueAmount.classList.add('info-value', 'harvest-value');
            valueAmount.textContent = `+${harvestValue} 🪙`;
            
            valueRow.appendChild(valueLabel);
            valueRow.appendChild(valueAmount);
            infoContainer.appendChild(valueRow);
        }
        
        // Compare against discounted price for affordability check
        if (gameState.money < discountedPrice) {
            item.classList.add('cannot-afford');
        } else {
            item.classList.remove('cannot-afford');
        }
    });
}

export function updateMoneyDisplay() {
    playerMoneyDisplay.textContent = gameState.money;
}

export function showMessage(text, duration = 1500) {
    const existingMessage = document.querySelector('.game-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('game-message');
    messageElement.textContent = text;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, duration);
}

export function showComboEffect(comboCount) {
    const existingCombo = document.querySelector('.combo-effect');
    if (existingCombo) {
        existingCombo.remove();
    }
    
    const comboElement = document.createElement('div');
    comboElement.classList.add('combo-effect');
    comboElement.textContent = `COMBO x${comboCount}`;
    
    if (comboCount >= 5) {
        comboElement.classList.add('combo-max');
    } else if (comboCount >= 3) {
        comboElement.classList.add('combo-high');
    }
    
    document.body.appendChild(comboElement);
    
    setTimeout(() => {
        comboElement.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        comboElement.classList.remove('show');
        setTimeout(() => {
            if (comboElement.parentNode) {
                comboElement.parentNode.removeChild(comboElement);
            }
        }, 300);
    }, 2000);
}

export function createPixelHarvestEffect(cell, plantType, harvestValue) {
    const container = document.createElement('div');
    container.classList.add('harvest-effect-container');
    cell.appendChild(container);
    
    // Create coin particles
    const numParticles = Math.min(10, harvestValue / 10);
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('coin-particle');
        
        // Random position within the cell
        const x = Math.random() * 40 - 20;
        const y = Math.random() * 40 - 20;
        
        // Random animation duration for natural effect
        const duration = 500 + Math.random() * 500;
        
        particle.style.left = `calc(50% + ${x}px)`;
        particle.style.top = `calc(50% + ${y}px)`;
        
        // Set animation properties
        particle.style.animationDuration = `${duration}ms`;
        
        container.appendChild(particle);
    }
    
    // Create value popup
    const valuePopup = document.createElement('div');
    valuePopup.classList.add('harvest-value-popup');
    valuePopup.textContent = `+${harvestValue}`;
    container.appendChild(valuePopup);
    
    // Remove the effect after animations complete
    setTimeout(() => {
        if (container.parentNode === cell) {
            cell.removeChild(container);
        }
    }, 1500);
}