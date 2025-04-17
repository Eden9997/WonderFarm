// Telegram Mini App Integration System
const telegramSystem = {
    // Biến lưu trữ instance của Telegram WebApp
    tg: window.Telegram.WebApp,
    
    // Khởi tạo hệ thống Telegram
    init() {
        // Kiểm tra nếu đang chạy trong Telegram Mini App
        if (this.tg.initData !== '') {
            console.log("Running inside Telegram Mini App");
            
            // Mở rộng view để sử dụng tối đa không gian có sẵn
            this.tg.expand();
            
            // Áp dụng màu nền trùng với theme của Telegram
            this.tg.setBackgroundColor('secondary_bg_color');
            
            // Sử dụng setViewportSettings nếu có sẵn (phiên bản mới)
            if (typeof this.tg.setViewportSettings === 'function') {
                this.tg.setViewportSettings({
                    is_expanded: true
                });
            }
            
            // Xử lý sự kiện khi viewport thay đổi
            this.tg.onEvent('viewportChanged', this.handleViewportChange);
            
            // Xử lý khi người dùng nhấn nút back
            this.tg.BackButton.onClick(this.handleBackButton);
            
            // Cập nhật theme dựa theo setting của Telegram
            this.applyTheme();
        } else {
            console.log("Running in browser mode");
            document.body.classList.add('browser-mode');
        }
    },
    
    // Xử lý sự kiện viewport thay đổi
    handleViewportChange() {
        console.log("Viewport changed", window.Telegram.WebApp.viewportHeight);
        // Thực hiện điều chỉnh UI nếu cần
    },
    
    // Xử lý nút back của Telegram
    handleBackButton() {
        // Đóng các popup mở nếu có
        const modals = [
            'achievements-panel',
            'quests-panel', 
            'leaderboard-panel',
            'character-panel',
            'shop-panel',
            'plant-menu',
            'equipment-detail'
        ];
        
        for (const modalId of modals) {
            const modal = document.getElementById(modalId);
            if (modal && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                window.Telegram.WebApp.BackButton.hide();
                return; // Chỉ đóng 1 popup mỗi lần
            }
        }
    },
    
    // Hiển thị nút back của Telegram
    showBackButton() {
        if (this.tg.BackButton) {
            this.tg.BackButton.show();
        }
    },
    
    // Ẩn nút back của Telegram
    hideBackButton() {
        if (this.tg.BackButton) {
            this.tg.BackButton.hide();
        }
    },
    
    // Áp dụng theme từ Telegram
    applyTheme() {
        const colorScheme = this.tg.colorScheme || 'light';
        document.body.setAttribute('data-theme', colorScheme);
        
        // Lấy các màu từ theme Telegram
        const themeParams = this.tg.themeParams || {};
        
        // Tạo style thích ứng với theme Telegram
        const cssVars = `
            :root {
                --tg-theme-bg-color: ${themeParams.bg_color || '#ffffff'};
                --tg-theme-text-color: ${themeParams.text_color || '#000000'};
                --tg-theme-hint-color: ${themeParams.hint_color || '#999999'};
                --tg-theme-link-color: ${themeParams.link_color || '#2678b6'};
                --tg-theme-button-color: ${themeParams.button_color || '#50a8eb'};
                --tg-theme-button-text-color: ${themeParams.button_text_color || '#ffffff'};
                --tg-theme-secondary-bg-color: ${themeParams.secondary_bg_color || '#f0f0f0'};
            }
        `;
        
        // Thêm style vào head
        const styleEl = document.createElement('style');
        styleEl.id = 'telegram-theme';
        styleEl.innerHTML = cssVars;
        document.head.appendChild(styleEl);
    },
    
    // Lưu game state lên Telegram Cloud Storage (nếu có)
    saveGameState(gameData) {
        if (typeof this.tg.CloudStorage !== 'undefined') {
            this.tg.CloudStorage.setItem('gameState', JSON.stringify(gameData))
                .then(() => console.log('Game state saved to Telegram Cloud'))
                .catch(err => console.error('Failed to save to Telegram Cloud:', err));
        } else {
            console.log('Telegram Cloud Storage not available');
        }
    },
    
    // Lấy game state từ Telegram Cloud Storage (nếu có)
    loadGameState() {
        return new Promise((resolve) => {
            if (typeof this.tg.CloudStorage !== 'undefined') {
                this.tg.CloudStorage.getItem('gameState')
                    .then(value => {
                        if (value) {
                            resolve(JSON.parse(value));
                        } else {
                            resolve(null);
                        }
                    })
                    .catch(err => {
                        console.error('Failed to load from Telegram Cloud:', err);
                        resolve(null);
                    });
            } else {
                console.log('Telegram Cloud Storage not available');
                resolve(null);
            }
        });
    },
    
    // Lấy thông tin người dùng Telegram
    getUserInfo() {
        // Telegram chỉ cung cấp một số thông tin cơ bản
        if (this.tg.initDataUnsafe && this.tg.initDataUnsafe.user) {
            return this.tg.initDataUnsafe.user;
        }
        return null;
    },
    
    // Hiển thị thông báo hệ thống
    showAlert(message) {
        if (typeof this.tg.showAlert === 'function') {
            this.tg.showAlert(message);
        } else {
            alert(message);
        }
    },
    
    // Hiển thị xác nhận hệ thống
    showConfirm(message, callback) {
        if (typeof this.tg.showConfirm === 'function') {
            this.tg.showConfirm(message, callback);
        } else {
            const result = confirm(message);
            callback(result);
        }
    },
    
    // Bật chế độ xác nhận trước khi đóng app
    enableClosingConfirmation() {
        if (typeof this.tg.enableClosingConfirmation === 'function') {
            this.tg.enableClosingConfirmation();
        }
    },
    
    // Tắt chế độ xác nhận trước khi đóng app
    disableClosingConfirmation() {
        if (typeof this.tg.disableClosingConfirmation === 'function') {
            this.tg.disableClosingConfirmation();
        }
    }
};

export default telegramSystem;