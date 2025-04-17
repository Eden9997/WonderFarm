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

// Initialize Telegram WebApp
const telegramWebApp = window.Telegram.WebApp;
telegramWebApp.expand();

// Initialize game
function initGame() {
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