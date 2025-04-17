// Import các module
import { config } from './modules/config.js';
import { gameState } from './modules/gameState.js';
import { plantCrop } from './modules/plantSystem.js';
import { createGrid, preloadPlantImages, setupEventListeners, updateMoneyDisplay } from './modules/uiSystem.js';
import { initCharacter, initCharacterScene } from './modules/characterSystem.js';
import { initDailyQuests } from './modules/questSystem.js';
import { renderAchievementsList } from './modules/achievementSystem.js';
import { initLeaderboard } from './modules/leaderboardSystem.js';
import { initShop } from './modules/shopSystem.js';
import { initHoneyBeeSystem } from './modules/honeyBeeSystem.js';
import telegramSystem from './modules/telegramSystem.js';

// Initialize Telegram WebApp (thay thế bằng module)
telegramSystem.init();

// Biến để lưu trạng thái loading từ cloud
let isLoadingFromCloud = false;

// Initialize game
async function initGame() {
    // Thử tải dữ liệu từ Telegram Cloud trước (nếu có)
    if (telegramSystem.tg.initData !== '') {
        isLoadingFromCloud = true;
        const cloudData = await telegramSystem.loadGameState();
        if (cloudData) {
            // Merge dữ liệu từ cloud vào gameState
            Object.assign(gameState, cloudData);
            console.log('Loaded game data from Telegram Cloud');
        }
        isLoadingFromCloud = false;
    }
    
    // Khởi tạo grid
    createGrid();
    
    // Tải hình ảnh
    preloadPlantImages();
    
    // Thiết lập event listeners
    setupEventListeners();
    
    // Cập nhật hiển thị tiền ban đầu
    updateMoneyDisplay();
    
    // Hiển thị bảng thành tựu
    renderAchievementsList();
    
    // Khởi tạo nhiệm vụ hàng ngày
    initDailyQuests();
    
    // Khởi tạo nhân vật
    initCharacter();
    
    // Khởi tạo bảng xếp hạng
    initLeaderboard();
    
    // Khởi tạo cửa hàng
    initShop();
    
    // Khởi tạo hệ thống ong mật
    initHoneyBeeSystem();
    
    // Bật xác nhận trước khi đóng app trong Telegram
    telegramSystem.enableClosingConfirmation();
    
    // Thiết lập lưu game tự động
    setInterval(() => {
        if (!isLoadingFromCloud) {
            telegramSystem.saveGameState(gameState);
        }
    }, 30000); // Lưu mỗi 30 giây
}

// Khởi động game khi trang web đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Khởi động game
    initGame();
    
    // Thêm event listener để khởi tạo lại character scene khi popup hiển thị
    document.getElementById('character-avatar').addEventListener('click', function() {
        console.log("Avatar clicked - ensuring character scene is initialized");
        // Hiển thị nút back của Telegram khi mở popup
        telegramSystem.showBackButton();
        
        // Cho phép UI hiển thị trước khi khởi tạo Phaser scene
        setTimeout(() => {
            if (document.getElementById('character-panel').classList.contains('show')) {
                console.log("Character panel is visible - initializing scene");
                // Khởi tạo lại Phaser scene
                initCharacterScene();
            }
        }, 100);
    });
});

// Cập nhật event listeners để quản lý nút Back của Telegram
const modalOpeners = [
    'show-shop',
    'show-quests',
    'show-leaderboard',
    'show-achievements'
];

modalOpeners.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('click', () => {
            telegramSystem.showBackButton();
        });
    }
});

const modalClosers = [
    'close-shop',
    'close-quests',
    'close-leaderboard',
    'close-achievements',
    'close-character',
    'close-menu',
    'close-detail'
];

modalClosers.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('click', () => {
            // Kiểm tra xem còn modal nào mở không
            const anyModalOpen = modalOpeners.some(id => {
                const correspondingPanel = document.getElementById(id.replace('show-', '') + '-panel');
                return correspondingPanel && !correspondingPanel.classList.contains('hidden');
            });
            
            if (!anyModalOpen) {
                telegramSystem.hideBackButton();
            }
        });
    }
});