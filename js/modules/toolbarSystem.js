// Quản lý thanh công cụ nhanh trượt lên và điều khiển cử chỉ
import { showMessage } from './uiSystem.js';
import { gameState } from './gameState.js';
import { initCharacterScene } from './characterSystem.js';

let startY = 0;
let currentY = 0;
let isSwiping = false;
let headerButtons = null;
let headerVisible = true;
const TOOLBAR_STATE_KEY = 'wonder_farm_toolbar_state';

// Khởi tạo thanh công cụ
export function initToolbar() {
    const toolbar = document.getElementById('quick-toolbar');
    const toolbarHandle = document.getElementById('toolbar-handle');
    headerButtons = document.querySelector('.header-buttons');
    
    if (!toolbar || !toolbarHandle) {
        console.error('Không tìm thấy thanh công cụ hoặc tay cầm thanh công cụ');
        return;
    }
    
    // Kiểm tra trạng thái đã lưu
    checkSavedToolbarState();
    
    // Xử lý sự kiện khi nhấp vào phần tay cầm
    toolbarHandle.addEventListener('click', () => {
        toggleToolbar();
    });
    
    // Xử lý sự kiện vuốt
    setupSwipeHandlers();
    
    // Gắn sự kiện cho các nút trên thanh công cụ
    setupToolbarButtons();
    
    // Điều chỉnh thanh công cụ cho các thiết bị khác nhau
    adjustToolbarForDevice();
    
    // Xử lý sự kiện thay đổi kích thước màn hình
    window.addEventListener('resize', () => {
        adjustToolbarForDevice();
    });
}

// Chuyển đổi hiển thị thanh công cụ
function toggleToolbar() {
    const toolbar = document.getElementById('quick-toolbar');
    const toolbarHandle = document.getElementById('toolbar-handle');
    
    const isExpanded = toolbar.classList.toggle('expanded');
    toolbarHandle.setAttribute('aria-expanded', isExpanded);
    
    // Lưu trạng thái hiện tại
    saveToolbarState(isExpanded);
    
    // Hiển thị/Ẩn các nút trong header
    toggleHeaderButtons(!isExpanded);
}

// Lưu trạng thái thanh công cụ
function saveToolbarState(isExpanded) {
    try {
        localStorage.setItem(TOOLBAR_STATE_KEY, JSON.stringify({
            expanded: isExpanded,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.error('Không thể lưu trạng thái thanh công cụ:', e);
    }
}

// Kiểm tra trạng thái đã lưu
function checkSavedToolbarState() {
    try {
        const savedState = localStorage.getItem(TOOLBAR_STATE_KEY);
        if (savedState) {
            const { expanded, timestamp } = JSON.parse(savedState);
            const toolbar = document.getElementById('quick-toolbar');
            const toolbarHandle = document.getElementById('toolbar-handle');
            
            // Chỉ áp dụng trạng thái nếu lưu trong vòng 24 giờ
            const isRecent = (Date.now() - timestamp) < 24 * 60 * 60 * 1000;
            
            if (expanded && isRecent) {
                toolbar.classList.add('expanded');
                toolbarHandle.setAttribute('aria-expanded', true);
                toggleHeaderButtons(false);
            } else {
                toolbar.classList.remove('expanded');
                toolbarHandle.setAttribute('aria-expanded', false);
                toggleHeaderButtons(true);
            }
        }
    } catch (e) {
        console.error('Lỗi khi đọc trạng thái thanh công cụ:', e);
    }
}

// Hiển thị/Ẩn các nút trong header
function toggleHeaderButtons(show) {
    if (!headerButtons) return;
    
    headerVisible = show;
    headerButtons.style.opacity = show ? '1' : '0';
    headerButtons.style.visibility = show ? 'visible' : 'hidden';
    headerButtons.style.transform = show ? 'translateY(0)' : 'translateY(15px)';
    
    // Vô hiệu hóa tương tác khi ẩn
    const buttons = headerButtons.querySelectorAll('.header-button');
    buttons.forEach(button => {
        button.style.pointerEvents = show ? 'auto' : 'none';
    });
}

// Điều chỉnh thanh công cụ cho các thiết bị khác nhau
function adjustToolbarForDevice() {
    const toolbar = document.getElementById('quick-toolbar');
    const gameBackground = document.querySelector('.game-background');
    
    if (toolbar && gameBackground) {
        // Đảm bảo thanh công cụ nằm trong phạm vi của game
        const rect = gameBackground.getBoundingClientRect();
        toolbar.style.width = `${rect.width}px`;
        toolbar.style.left = `${rect.left}px`;
        
        // Điều chỉnh z-index để đảm bảo hiển thị đúng
        toolbar.style.zIndex = '10000';
    }
}

// Thiết lập các nút trên thanh công cụ
function setupToolbarButtons() {
    // Cửa hàng
    const quickShopBtn = document.getElementById('quick-shop');
    if (quickShopBtn) {
        quickShopBtn.addEventListener('click', () => {
            openPanel('shop-panel');
        });
    }
    
    // Nhiệm vụ
    const quickQuestsBtn = document.getElementById('quick-quests');
    if (quickQuestsBtn) {
        quickQuestsBtn.addEventListener('click', () => {
            openPanel('quests-panel');
        });
    }
    
    // Nhân vật
    const quickCharacterBtn = document.getElementById('quick-character');
    if (quickCharacterBtn) {
        quickCharacterBtn.addEventListener('click', () => {
            openPanel('character-panel');
            // Đảm bảo khởi tạo scene nhân vật
            setTimeout(() => {
                initCharacterScene();
            }, 100);
        });
    }
    
    // Thành tựu
    const quickAchievementsBtn = document.getElementById('quick-achievements');
    if (quickAchievementsBtn) {
        quickAchievementsBtn.addEventListener('click', () => {
            openPanel('achievements-panel');
        });
    }
    
    // Bảng xếp hạng
    const quickLeaderboardBtn = document.getElementById('quick-leaderboard');
    if (quickLeaderboardBtn) {
        quickLeaderboardBtn.addEventListener('click', () => {
            openPanel('leaderboard-panel');
        });
    }
    
    // Chia sẻ
    const quickShareBtn = document.getElementById('quick-share');
    if (quickShareBtn) {
        quickShareBtn.addEventListener('click', () => {
            shareProgress();
        });
    }
    
    // Cài đặt
    const quickSettingsBtn = document.getElementById('quick-settings');
    if (quickSettingsBtn) {
        quickSettingsBtn.addEventListener('click', () => {
            showSettings();
        });
    }
    
    // Thêm hiệu ứng khi ấn vào nút (phản hồi trực quan)
    document.querySelectorAll('.toolbar-button').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('active-button');
        });
        
        button.addEventListener('touchend', function() {
            this.classList.remove('active-button');
        });
        
        button.addEventListener('mousedown', function() {
            this.classList.add('active-button');
        });
        
        button.addEventListener('mouseup', function() {
            this.classList.remove('active-button');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('active-button');
        });
    });
}

// Hiển thị cài đặt game
function showSettings() {
    try {
        // Đóng thanh công cụ trước khi mở cài đặt
        const toolbar = document.getElementById('quick-toolbar');
        if (toolbar.classList.contains('expanded')) {
            toolbar.classList.remove('expanded');
            saveToolbarState(false);
        }
        
        // Hiển thị cài đặt dựa vào Telegram Mini App nếu có
        if (window.Telegram && window.Telegram.WebApp) {
            // Hiển thị popup cài đặt
            window.Telegram.WebApp.showPopup({
                title: '⚙️ Cài đặt',
                message: 'Điều chỉnh các thiết lập game',
                buttons: [
                    {id: 'sound', type: 'default', text: '🔊 Âm thanh: ' + (gameState.settings?.sound ? 'Bật' : 'Tắt')},
                    {id: 'music', type: 'default', text: '🎵 Nhạc: ' + (gameState.settings?.music ? 'Bật' : 'Tắt')},
                    {id: 'notifications', type: 'default', text: '📢 Thông báo: ' + (gameState.settings?.notifications ? 'Bật' : 'Tắt')},
                    {id: 'reset_tutorial', type: 'default', text: '🔄 Đặt lại hướng dẫn'},
                    {id: 'close', type: 'cancel', text: 'Đóng'}
                ]
            }, function(buttonId) {
                handleSettingsOption(buttonId);
            });
        } else {
            // Fallback khi không chạy trên Telegram
            showMessage('Cài đặt sẽ sớm có mặt trong phiên bản tiếp theo!');
        }
    } catch (error) {
        console.error('Lỗi khi hiển thị cài đặt:', error);
        showMessage('Không thể mở cài đặt, hãy thử lại sau');
    }
}

// Xử lý lựa chọn cài đặt
function handleSettingsOption(option) {
    // Đảm bảo gameState.settings tồn tại
    if (!gameState.settings) {
        gameState.settings = {
            sound: true,
            music: true,
            notifications: true
        };
    }
    
    switch (option) {
        case 'sound':
            // Đảo trạng thái âm thanh
            gameState.settings.sound = !gameState.settings.sound;
            showMessage(`Âm thanh đã ${gameState.settings.sound ? 'bật' : 'tắt'}`);
            break;
            
        case 'music':
            // Đảo trạng thái nhạc
            gameState.settings.music = !gameState.settings.music;
            showMessage(`Nhạc đã ${gameState.settings.music ? 'bật' : 'tắt'}`);
            break;
            
        case 'notifications':
            // Đảo trạng thái thông báo
            gameState.settings.notifications = !gameState.settings.notifications;
            showMessage(`Thông báo đã ${gameState.settings.notifications ? 'bật' : 'tắt'}`);
            break;
            
        case 'reset_tutorial':
            // Đặt lại các bước hướng dẫn đã hoàn thành
            gameState.tutorialCompleted = {};
            showMessage('Hướng dẫn đã được đặt lại. Vào lần tiếp theo bạn sẽ thấy hướng dẫn.');
            break;
    }
    
    // Lưu cài đặt
    localStorage.setItem('wonder_farm_game_state', JSON.stringify(gameState));
}

// Mở panel được chỉ định và đóng thanh công cụ
function openPanel(panelId) {
    // Đóng tất cả các panel trước
    closeAllPanels();
    
    // Mở panel được chọn
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.add('show');
        
        // Đóng thanh công cụ sau khi mở panel
        toggleHeaderButtons(true);
        const toolbar = document.getElementById('quick-toolbar');
        if (toolbar.classList.contains('expanded')) {
            toolbar.classList.remove('expanded');
            saveToolbarState(false);
        }
    }
}

// Đóng tất cả các panel
function closeAllPanels() {
    const panels = [
        'shop-panel',
        'quests-panel', 
        'character-panel', 
        'achievements-panel', 
        'leaderboard-panel'
    ];
    
    panels.forEach(id => {
        const panel = document.getElementById(id);
        if (panel && panel.classList.contains('show')) {
            panel.classList.remove('show');
        }
    });
}

// Thiết lập xử lý vuốt để mở/đóng thanh công cụ
function setupSwipeHandlers() {
    const toolbar = document.getElementById('quick-toolbar');
    const gameContainer = document.querySelector('.game-container');
    
    if (!toolbar || !gameContainer) {
        console.error('Không tìm thấy thanh công cụ hoặc vùng chứa game');
        return;
    }
    
    // Thêm khu vực nhận diện vuốt
    let swipeArea = document.querySelector('.swipe-area');
    if (!swipeArea) {
        swipeArea = document.createElement('div');
        swipeArea.className = 'swipe-area';
        gameContainer.appendChild(swipeArea);
    }
    
    // Sự kiện bắt đầu vuốt (touch)
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        currentY = startY;
        isSwiping = true;
    }, { passive: true });
    
    // Sự kiện vuốt di chuyển (touch)
    document.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        currentY = e.touches[0].clientY;
        const diffY = startY - currentY;
        
        // Vuốt lên trên khu vực gần đáy màn hình
        if (diffY > 40 && startY > window.innerHeight - 100) {
            toolbar.classList.add('expanded');
            toggleHeaderButtons(false);
            saveToolbarState(true);
            isSwiping = false;
        }
        // Vuốt xuống khi thanh công cụ đang mở
        else if (diffY < -40 && toolbar.classList.contains('expanded')) {
            toolbar.classList.remove('expanded');
            toggleHeaderButtons(true);
            saveToolbarState(false);
            isSwiping = false;
        }
    }, { passive: true });
    
    // Sự kiện kết thúc vuốt (touch)
    document.addEventListener('touchend', () => {
        isSwiping = false;
    }, { passive: true });
    
    // Xử lý mouse events cho trải nghiệm desktop và testing
    document.addEventListener('mousedown', (e) => {
        // Chỉ theo dõi nếu click gần dưới cùng màn hình
        if (e.clientY > window.innerHeight - 100) {
            startY = e.clientY;
            currentY = startY;
            isSwiping = true;
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isSwiping) return;
        currentY = e.clientY;
        const diffY = startY - currentY;
        
        // Vuốt lên trên khu vực gần đáy màn hình
        if (diffY > 40 && startY > window.innerHeight - 100) {
            toolbar.classList.add('expanded');
            toggleHeaderButtons(false);
            saveToolbarState(true);
            isSwiping = false;
        }
        // Vuốt xuống khi thanh công cụ đang mở
        else if (diffY < -40 && toolbar.classList.contains('expanded')) {
            toolbar.classList.remove('expanded');
            toggleHeaderButtons(true);
            saveToolbarState(false);
            isSwiping = false;
        }
    });
    
    document.addEventListener('mouseup', () => {
        isSwiping = false;
    });
}

// Chia sẻ tiến độ - tích hợp với Telegram Mini App
function shareProgress() {
    try {
        if (window.Telegram && window.Telegram.WebApp) {
            // Lấy thông tin tiến độ từ gameState
            const level = gameState.level || 1;
            const money = gameState.money || 0;
            const unlockedPlants = Object.values(gameState.unlockedPlants || {}).filter(Boolean).length;
            const harvestedCrops = gameState.stats?.harvestedCrops || 0;
            
            // Tạo thông điệp chia sẻ
            const shareMessage = `🌱 Wonder Farm 🌱\n\n👨‍🌾 Tôi đã đạt cấp độ ${level}!\n💰 Xu: ${money}\n🌽 Đã thu hoạch: ${harvestedCrops} cây trồng\n\nHãy chơi cùng tôi trên Telegram Mini App!`;
            
            // Hiển thị popup xác nhận chia sẻ
            if (window.Telegram.WebApp.showPopup) {
                window.Telegram.WebApp.showPopup({
                    title: '🌟 Chia sẻ tiến độ',
                    message: 'Bạn muốn chia sẻ tiến độ chơi game của mình với bạn bè?',
                    buttons: [
                        {id: 'share', type: 'default', text: '✨ Chia sẻ'},
                        {id: 'cancel', type: 'cancel', text: 'Hủy'}
                    ]
                }, function(buttonId) {
                    if (buttonId === 'share') {
                        // Gửi thông điệp qua Telegram
                        if (window.Telegram.WebApp.switchInlineQuery) {
                            window.Telegram.WebApp.switchInlineQuery(shareMessage, ['users', 'groups']);
                            showMessage('Đã chia sẻ tiến độ của bạn!');
                        } else {
                            showMessage('Không thể chia sẻ tiến độ, hãy thử lại sau!');
                        }
                    }
                });
            } else {
                // Fallback nếu không có popup API
                if (window.Telegram.WebApp.switchInlineQuery) {
                    window.Telegram.WebApp.switchInlineQuery(shareMessage, ['users', 'groups']);
                    showMessage('Đã chia sẻ tiến độ của bạn!');
                } else {
                    showMessage('Không thể chia sẻ tiến độ, hãy thử lại sau!');
                }
            }
        } else {
            showMessage('Tính năng chia sẻ chỉ hoạt động trong Telegram Mini App');
        }
    } catch (error) {
        console.error("Lỗi khi chia sẻ tiến độ:", error);
        showMessage('Không thể chia sẻ tiến độ ngay lúc này');
    }
}