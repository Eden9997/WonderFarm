// Import các module
import { config } from './modules/config.js';
import { gameState } from './modules/gameState.js';
import { plantCrop } from './modules/plantSystem.js';
import { createGrid, preloadPlantImages, setupEventListeners, updateMoneyDisplay, initTelegramApp } from './modules/uiSystem.js';
import { initCharacter, initCharacterScene } from './modules/characterSystem.js';
import { initDailyQuests } from './modules/questSystem.js';
import { renderAchievementsList } from './modules/achievementSystem.js';
import { initLeaderboard } from './modules/leaderboardSystem.js';
import { initShop } from './modules/shopSystem.js';
import { initHoneyBeeSystem } from './modules/honeyBeeSystem.js';
import { initToolbar } from './modules/toolbarSystem.js';

// Initialize Telegram WebApp
const telegramWebApp = window.Telegram ? window.Telegram.WebApp : null;
if (telegramWebApp) {
    telegramWebApp.expand();
    telegramWebApp.enableClosingConfirmation();
    
    // Thêm class cho body để định dạng theo Telegram Mini App
    document.body.classList.add('telegram-app');
    
    // Theo dõi trạng thái chủ đề
    if (telegramWebApp.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Đặt hướng dọc cho game
function forcePortraitMode() {
    if (window.screen && window.screen.orientation) {
        try {
            // Cố định hướng dọc cho màn hình nếu được hỗ trợ
            window.screen.orientation.lock('portrait').catch(e => {
                console.log('Không thể khóa hướng màn hình:', e);
            });
        } catch (e) {
            console.log('Trình duyệt không hỗ trợ khóa hướng màn hình');
        }
    }
}

// Initialize game
function initGame() {
    // Cố định hướng dọc
    forcePortraitMode();
    
    // Khởi tạo tối ưu hóa cho Telegram Mini App và hiển thị màn hình dọc
    initTelegramApp();
    
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
    
    // Khởi tạo thanh công cụ trượt lên
    initToolbar();
}

// Khởi động game khi trang web đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Khởi động game
    initGame();
    
    // Thêm event listener để khởi tạo lại character scene khi popup hiển thị
    document.getElementById('character-avatar').addEventListener('click', function() {
        console.log("Avatar clicked - ensuring character scene is initialized");
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