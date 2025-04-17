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
import { 
    loadGameFromTelegramCloud, 
    saveAllGameData,
    handleMultipleDeviceLogin,
    registerSession,
    isOfflineMode,
    detectPlatform
} from './modules/utils.js';

// Initialize Telegram WebApp
const telegramWebApp = window.Telegram.WebApp;
telegramWebApp.expand();

// Mảng các mẹo chơi game
const gameTips = [
    "Thu hoạch cây liên tục để nhận thêm điểm combo!",
    "Mua trang bị từ cửa hàng để tăng hiệu suất làm việc.",
    "Hoàn thành nhiệm vụ hàng ngày để nhận thưởng.",
    "Mở khóa thành tựu để nhận được tiền thưởng đặc biệt.",
    "Nhấn vào nhân vật để tùy chỉnh trang bị.",
    "Trang bị giày giúp giảm chi phí mua hạt giống.",
    "Trang bị mũ giúp cây phát triển nhanh hơn.",
    "Mỗi loại cây có tốc độ phát triển và giá trị khác nhau.",
    "Cánh thiên thần mang lại nhiều lợi ích cho nông dân.",
    "Sử dụng phân bón cao cấp để cây phát triển nhanh hơn."
];

// Khởi tạo game
async function initGame() {
    // Hiển thị màn hình loading và bắt đầu quá trình tải
    showLoadingScreen();
    
    try {
        // Thiết lập chu kỳ chuyển đổi mẹo ngẫu nhiên
        startRandomTips();
        
        // Cập nhật thanh tiến trình loading: 10%
        updateLoadingProgress(10, "Đang kết nối với Telegram...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Kiểm tra xem game có đang chạy trên thiết bị khác không
        updateLoadingProgress(15, "Đang kiểm tra phiên đăng nhập...");
        const isMultiDevice = await handleMultipleDeviceLogin();
        
        if (isMultiDevice) {
            updateLoadingProgress(20, "Phát hiện phiên đăng nhập trên thiết bị khác!");
            showOfflineNotification();
            
            // Hiển thị thông báo đếm ngược và tự thoát sau 20 giây
            startExitCountdown(20);
            
            // Không tiếp tục quá trình khởi tạo game
            return;
        } else {
            // Đăng ký phiên hiện tại
            updateLoadingProgress(20, "Đăng ký phiên hiện tại...");
            await registerSession();
        }
        
        // Thử tải game từ Telegram Cloud
        updateLoadingProgress(30, `Đang tải dữ liệu ${isOfflineMode() ? 'từ bộ nhớ cục bộ' : 'từ Telegram Cloud'}...`);
        const cloudData = await loadGameFromTelegramCloud();
        
        if (cloudData) {
            // Nếu có dữ liệu trên cloud, áp dụng vào gameState
            Object.assign(gameState, cloudData);
            updateLoadingProgress(40, "Dữ liệu đã được tải thành công");
            await new Promise(resolve => setTimeout(resolve, 300));
        } else {
            updateLoadingProgress(30, "Không tìm thấy dữ liệu, sử dụng dữ liệu mặc định");
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // Cập nhật thanh tiến trình loading: 50%
        updateLoadingProgress(50, "Đang khởi tạo hệ thống game...");
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Khởi tạo grid
        createGrid();
        
        // Cập nhật thanh tiến trình loading: 60%
        updateLoadingProgress(60, "Đang tải hình ảnh cây trồng...");
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Tải hình ảnh
        preloadPlantImages();
        
        // Cập nhật thanh tiến trình loading: 70%
        updateLoadingProgress(70, "Đang thiết lập tương tác người chơi...");
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Thiết lập event listeners
        setupEventListeners();
        
        // Cập nhật thanh tiến trình loading: 80%
        updateLoadingProgress(80, "Đang khởi tạo nhân vật và dữ liệu người chơi...");
        
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
        
        // Cập nhật thanh tiến trình loading: 90%
        updateLoadingProgress(90, "Đang khởi tạo cửa hàng và hệ thống ong mật...");
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Khởi tạo cửa hàng
        initShop();
        
        // Khởi tạo hệ thống ong mật
        initHoneyBeeSystem();
        
        // Cập nhật tiến trình hoàn tất: 100%
        const platform = detectPlatform();
        const mode = isOfflineMode() ? "CHẾ ĐỘ OFFLINE" : "CHẾ ĐỘ ONLINE";
        updateLoadingProgress(100, `Đã sẵn sàng! (${platform.toUpperCase()} | ${mode})`);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Hiển thị thông báo ở chế độ offline nếu cần
        if (isOfflineMode()) {
            showGameOfflineBanner();
        }
        
    } catch (e) {
        console.error('Lỗi khi khởi tạo game:', e);
        updateLoadingProgress(100, "Đã xảy ra lỗi, đang thử lại...");
        await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
        // Ẩn màn hình loading nếu không phải trường hợp phát hiện đăng nhập trên thiết bị khác
        if (!isOfflineMode()) {
            hideLoadingScreen();
        }
    }
}

/**
 * Hiển thị thông báo đếm ngược và thoát game sau thời gian chỉ định
 * @param {number} seconds - Số giây trước khi thoát
 */
function startExitCountdown(seconds) {
    // Tạo và hiển thị thông báo đếm ngược
    const countdownElement = document.createElement('div');
    countdownElement.className = 'exit-countdown';
    countdownElement.innerHTML = `
        <div class="countdown-title">TÀI KHOẢN ĐANG ĐƯỢC SỬ DỤNG</div>
        <div class="countdown-message">Game đang được mở trên thiết bị khác.</div>
        <div class="countdown-timer">Game sẽ tự đóng sau <span id="countdown-seconds">${seconds}</span> giây</div>
        <button class="exit-now-button">Đóng ngay</button>
    `;
    document.body.appendChild(countdownElement);
    
    // Thêm CSS cho thông báo đếm ngược
    const style = document.createElement('style');
    style.textContent = `
    .exit-countdown {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(220, 53, 69, 0.95);
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        z-index: 10001;
        text-align: center;
        width: 90%;
        max-width: 400px;
        animation: fadeIn 0.5s, pulse 2s infinite alternate;
        font-family: 'Press Start 2P', 'VT323', monospace;
    }
    .countdown-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
    }
    .countdown-message {
        font-size: 14px;
        margin-bottom: 20px;
    }
    .countdown-timer {
        font-size: 14px;
        margin-bottom: 20px;
    }
    #countdown-seconds {
        font-weight: bold;
        font-size: 16px;
    }
    .exit-now-button {
        background-color: white;
        color: #dc3545;
        border: none;
        border-radius: 5px;
        padding: 8px 20px;
        cursor: pointer;
        font-weight: bold;
        font-family: 'Press Start 2P', 'VT323', monospace;
        font-size: 12px;
        transition: all 0.2s;
    }
    .exit-now-button:hover {
        background-color: #f8f9fa;
        transform: scale(1.05);
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
    @keyframes pulse {
        0% {
            box-shadow: 0 5px 20px rgba(220, 53, 69, 0.5);
        }
        100% {
            box-shadow: 0 5px 30px rgba(220, 53, 69, 0.8);
        }
    }
    `;
    document.head.appendChild(style);
    
    // Button để thoát ngay
    const exitNowButton = countdownElement.querySelector('.exit-now-button');
    exitNowButton.addEventListener('click', () => {
        exitGame();
    });
    
    // Đếm ngược và tự thoát khi đạt đến 0
    let timeLeft = seconds;
    const countdownInterval = setInterval(() => {
        timeLeft--;
        const countdownSecondsElement = document.getElementById('countdown-seconds');
        if (countdownSecondsElement) {
            countdownSecondsElement.textContent = timeLeft;
        }
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            exitGame();
        }
    }, 1000);
}

/**
 * Thoát khỏi game (đóng Telegram WebApp)
 */
function exitGame() {
    console.log('Thoát game do phát hiện đăng nhập từ thiết bị khác');
    
    // Sử dụng Telegram WebApp API để đóng mini app
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.close();
    } else {
        // Fallback nếu không có API của Telegram
        window.close();
    }
}

/**
 * Hiển thị thông báo phiên đăng nhập trên nhiều thiết bị
 */
function showOfflineNotification() {
    const platform = detectPlatform();
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        loadingText.style.color = '#dc3545';
        loadingText.textContent = "Game đã được mở trên thiết bị khác!";
    }
    
    const loadingTip = document.getElementById('loading-tip');
    if (loadingTip) {
        loadingTip.style.color = '#dc3545';
        loadingTip.innerHTML = `Truy cập từ ${platform.toUpperCase()} bị từ chối.<br>Game sẽ tự đóng sau 20 giây.`;
    }
}

/**
 * Hiển thị banner thông báo chế độ offline
 */
function showGameOfflineBanner() {
    // Tạo banner chế độ offline
    const offlineBanner = document.createElement('div');
    offlineBanner.className = 'offline-banner';
    offlineBanner.innerHTML = `
        <div class="offline-icon">⚠️</div>
        <div class="offline-message">
            <div class="offline-title">CHẾ ĐỘ OFFLINE</div>
            <div class="offline-description">Game đang mở trên thiết bị khác. Các thay đổi sẽ KHÔNG được lưu lên Cloud.</div>
        </div>
    `;
    document.body.appendChild(offlineBanner);
    
    // Thêm CSS cho banner
    const style = document.createElement('style');
    style.textContent = `
    .offline-banner {
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(255, 204, 0, 0.9);
        color: #000;
        padding: 8px 15px;
        border-radius: 8px;
        z-index: 9999;
        display: flex;
        align-items: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        animation: fadeInDown 0.5s, pulse 2s infinite alternate;
        font-family: 'Press Start 2P', 'VT323', monospace;
    }
    .offline-icon {
        font-size: 24px;
        margin-right: 10px;
    }
    .offline-message {
        display: flex;
        flex-direction: column;
    }
    .offline-title {
        font-weight: bold;
        margin-bottom: 3px;
        font-size: 14px;
    }
    .offline-description {
        font-size: 10px;
    }
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    @keyframes pulse {
        0% {
            opacity: 0.8;
        }
        100% {
            opacity: 1;
        }
    }
    `;
    document.head.appendChild(style);
    
    // Tự động ẩn sau 10 giây
    setTimeout(() => {
        offlineBanner.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => {
            if (offlineBanner.parentNode) {
                offlineBanner.parentNode.removeChild(offlineBanner);
            }
        }, 500);
    }, 10000);
    
    // Thêm animation fadeOut
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
    `;
    document.head.appendChild(fadeOutStyle);
}

/**
 * Kiểm tra phiên đăng nhập định kỳ
 */
function startSessionMonitor() {
    // Gửi heartbeat định kỳ để duy trì phiên
    setInterval(async () => {
        try {
            if (!isOfflineMode()) {
                // Cập nhật phiên hiện tại nếu đang online
                await registerSession();
            } else {
                // Kiểm tra xem có thể chuyển từ offline sang online không
                const stillMultiDevice = await handleMultipleDeviceLogin();
                
                // Nếu không còn tình trạng đa thiết bị
                if (!stillMultiDevice && isOfflineMode()) {
                    // Xóa trạng thái offline
                    localStorage.removeItem('wonderFarm_offlineMode');
                    
                    // Đăng ký phiên hiện tại làm phiên chính
                    await registerSession();
                    
                    // Hiển thị thông báo
                    showOnlineNotification();
                }
            }
        } catch (e) {
            console.error('Lỗi khi kiểm tra phiên đăng nhập:', e);
        }
    }, 30000); // Kiểm tra mỗi 30 giây
}

/**
 * Hiển thị thông báo đã chuyển sang chế độ online
 */
function showOnlineNotification() {
    const onlineNotification = document.createElement('div');
    onlineNotification.className = 'online-notification';
    onlineNotification.innerHTML = `
        <div class="online-icon">✅</div>
        <div class="online-message">Đã chuyển sang CHẾ ĐỘ ONLINE</div>
    `;
    document.body.appendChild(onlineNotification);
    
    // Thêm CSS cho thông báo
    const style = document.createElement('style');
    style.textContent = `
    .online-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(46, 204, 113, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        animation: slideUp 0.5s, fadeOut 0.5s 4.5s forwards;
        font-family: 'Press Start 2P', 'VT323', monospace;
        font-size: 12px;
    }
    .online-icon {
        font-size: 18px;
    }
    @keyframes slideUp {
        from {
            transform: translate(-50%, 20px);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    `;
    document.head.appendChild(style);
    
    // Xóa thông báo sau 5 giây
    setTimeout(() => {
        if (onlineNotification.parentNode) {
            onlineNotification.parentNode.removeChild(onlineNotification);
        }
    }, 5000);
    
    // Lưu game sau khi chuyển sang online
    saveAllGameData(gameState);
}

// Hiển thị màn hình loading
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
    updateLoadingProgress(0, "Đang khởi động Wonder Farm...");
}

// Ẩn màn hình loading
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        // Xóa màn hình loading sau khi hiệu ứng transition kết thúc
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                // Đừng xóa phần tử, chỉ ẩn nó để có thể dùng lại sau này nếu cần
                // loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
    }
}

// Cập nhật thanh tiến trình và thông báo
function updateLoadingProgress(percent, message) {
    const progressBar = document.getElementById('loading-progress-bar');
    const loadingText = document.getElementById('loading-text');
    
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }
    
    if (loadingText && message) {
        loadingText.textContent = message;
    }
}

// Bắt đầu chu kỳ hiển thị các mẹo ngẫu nhiên
function startRandomTips() {
    const loadingTip = document.getElementById('loading-tip');
    if (!loadingTip) return;
    
    // Hiển thị mẹo đầu tiên
    showRandomTip(loadingTip);
    
    // Thiết lập chu kỳ chuyển đổi mẹo mỗi 5 giây
    const tipInterval = setInterval(() => {
        // Kiểm tra xem màn hình loading đã ẩn chưa
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen && loadingScreen.classList.contains('hidden')) {
            clearInterval(tipInterval);
            return;
        }
        
        // Hiện hiệu ứng fade trước khi đổi mẹo
        loadingTip.style.opacity = '0';
        
        setTimeout(() => {
            showRandomTip(loadingTip);
            loadingTip.style.opacity = '1';
        }, 300);
    }, 5000);
}

// Hiển thị một mẹo ngẫu nhiên
function showRandomTip(tipElement) {
    const randomIndex = Math.floor(Math.random() * gameTips.length);
    tipElement.textContent = `Mẹo: ${gameTips[randomIndex]}`;
}

// Khởi động game khi trang web đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Khởi động game
    initGame();
    
    // Bắt đầu giám sát phiên đăng nhập
    startSessionMonitor();
    
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
    
    // Lưu dữ liệu game trước khi người dùng rời trang
    window.addEventListener('beforeunload', function() {
        saveAllGameData(gameState);
    });
    
    // Lưu dữ liệu game mỗi 5 phút để đảm bảo không mất dữ liệu
    setInterval(() => {
        console.log(`Auto-saving game data... (${isOfflineMode() ? 'OFFLINE MODE' : 'ONLINE MODE'})`);
        saveAllGameData(gameState);
    }, 5 * 60 * 1000); // 5 phút
});