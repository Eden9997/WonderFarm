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

/**
 * Thông tin về phiên đăng nhập
 * @typedef {Object} SessionInfo
 * @property {string} userId - ID người dùng Telegram
 * @property {string} deviceId - ID thiết bị đang chạy game
 * @property {string} platform - Nền tảng (mobile/desktop)
 * @property {string} timestamp - Thời điểm đăng nhập
 * @property {boolean} active - Trạng thái hoạt động
 */

/**
 * Khởi tạo ID thiết bị duy nhất cho phiên hiện tại
 * @returns {string} ID thiết bị ngẫu nhiên
 */
function generateDeviceId() {
    // Sử dụng kết hợp giữa timestamp, userAgent và một số ngẫu nhiên
    const timestamp = new Date().getTime();
    const randomPart = Math.floor(Math.random() * 10000000);
    const userAgent = navigator.userAgent;
    const userAgentHash = hashCode(userAgent);
    return `${timestamp}-${userAgentHash}-${randomPart}`;
}

/**
 * Tạo một mã hash đơn giản từ chuỗi
 * @param {string} str - Chuỗi cần hash
 * @returns {number} Giá trị hash
 */
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Xác định nền tảng hiện tại (mobile hoặc desktop)
 * @returns {string} 'mobile' hoặc 'desktop'
 */
export function detectPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone|opera mini|silk/i.test(userAgent);
    
    // Nếu đang trong Telegram WebApp, kiểm tra thêm các thuộc tính đặc trưng
    if (window.Telegram && window.Telegram.WebApp) {
        // Telegram mobile app thường có thuộc tính isExpanded = true
        if (window.Telegram.WebApp.isExpanded) {
            return 'mobile';
        }
        
        // Telegram desktop thường có kích thước cửa sổ lớn hơn
        if (window.innerWidth > 800 && window.innerHeight > 600) {
            return 'desktop';
        }
    }
    
    return isMobile ? 'mobile' : 'desktop';
}

// Biến lưu trạng thái phiên đăng nhập hiện tại
let currentSessionInfo = null;
let isInOfflineMode = false;

/**
 * Đăng ký phiên người dùng hiện tại lên Telegram Cloud
 * @returns {Promise<boolean>} Kết quả đăng ký
 */
export async function registerSession() {
    if (!window.Telegram || !window.Telegram.WebApp || !window.Telegram.WebApp.initDataUnsafe || !window.Telegram.WebApp.initDataUnsafe.user) {
        console.warn('Không có thông tin người dùng Telegram');
        return false;
    }
    
    try {
        // Lấy thông tin người dùng từ Telegram WebApp
        const userId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
        
        // Tạo device ID mới nếu chưa có
        if (!currentSessionInfo || !currentSessionInfo.deviceId) {
            const deviceId = generateDeviceId();
            const platform = detectPlatform();
            const timestamp = new Date().toISOString();
            
            // Lưu thông tin phiên hiện tại vào bộ nhớ
            currentSessionInfo = {
                userId,
                deviceId,
                platform,
                timestamp,
                active: true
            };
        }
        
        // Lưu thông tin phiên lên Telegram Cloud
        if (window.Telegram.WebApp.CloudStorage) {
            return new Promise((resolve) => {
                window.Telegram.WebApp.CloudStorage.setItem('wonderFarm_activeSession', 
                    JSON.stringify(currentSessionInfo), (success) => {
                        resolve(success);
                });
            });
        }
        
        return true;
    } catch (e) {
        console.error('Lỗi khi đăng ký phiên:', e);
        return false;
    }
}

/**
 * Kiểm tra xem có phiên đăng nhập từ thiết bị khác đang hoạt động không
 * @returns {Promise<boolean>} true nếu phát hiện phiên từ thiết bị khác, false nếu không
 */
export async function checkActiveSession() {
    if (!window.Telegram || !window.Telegram.WebApp || !window.Telegram.WebApp.CloudStorage) {
        return false;
    }
    
    try {
        // Lấy thông tin phiên hiện tại
        if (!currentSessionInfo) {
            // Nếu chưa có thông tin phiên, đăng ký phiên mới
            await registerSession();
            return false;
        }
        
        // Lấy thông tin phiên từ Cloud Storage
        return new Promise((resolve) => {
            window.Telegram.WebApp.CloudStorage.getItem('wonderFarm_activeSession', (result, error) => {
                if (error || !result) {
                    resolve(false);
                    return;
                }
                
                try {
                    const activeSession = JSON.parse(result);
                    
                    // Nếu phiên đang hoạt động khác với phiên hiện tại
                    if (activeSession.deviceId !== currentSessionInfo.deviceId) {
                        // Nếu phiên kia là desktop và phiên hiện tại là mobile, ưu tiên desktop
                        if (activeSession.platform === 'desktop' && currentSessionInfo.platform === 'mobile') {
                            resolve(true);
                        } 
                        // Nếu cả 2 đều là mobile hoặc cả 2 đều là desktop, ưu tiên phiên mới nhất
                        else if (activeSession.platform === currentSessionInfo.platform) {
                            // So sánh thời gian
                            const activeTime = new Date(activeSession.timestamp).getTime();
                            const currentTime = new Date(currentSessionInfo.timestamp).getTime();
                            
                            // Nếu phiên hiện tại mới hơn, ghi đè phiên cũ
                            if (currentTime > activeTime) {
                                registerSession(); // Cập nhật phiên mới
                                resolve(false);
                            } else {
                                resolve(true); // Phiên hiện tại cũ hơn, chuyển sang chế độ offline
                            }
                        }
                        // Nếu phiên hiện tại là desktop và phiên kia là mobile, ưu tiên phiên hiện tại
                        else if (activeSession.platform === 'mobile' && currentSessionInfo.platform === 'desktop') {
                            registerSession(); // Cập nhật phiên mới
                            resolve(false);
                        }
                    } else {
                        resolve(false); // Cùng một thiết bị
                    }
                } catch (e) {
                    console.error('Lỗi khi phân tích thông tin phiên:', e);
                    resolve(false);
                }
            });
        });
    } catch (e) {
        console.error('Lỗi khi kiểm tra phiên đăng nhập:', e);
        return false;
    }
}

/**
 * Xử lý khi phát hiện đang có phiên hoạt động từ thiết bị khác
 * @returns {Promise<boolean>} Kết quả xử lý
 */
export async function handleMultipleDeviceLogin() {
    // Kiểm tra phiên từ thiết bị khác
    const hasActiveSession = await checkActiveSession();
    
    if (hasActiveSession) {
        // Chuyển sang chế độ offline
        isInOfflineMode = true;
    } else {
        // Đảm bảo không ở chế độ offline
        isInOfflineMode = false;
        
        // Đăng ký phiên hiện tại làm phiên chính
        await registerSession();
    }
    
    return hasActiveSession;
}

/**
 * Kiểm tra xem game có đang chạy ở chế độ offline không
 * @returns {boolean} true nếu đang ở chế độ offline
 */
export function isOfflineMode() {
    return isInOfflineMode;
}

/**
 * Lưu dữ liệu game vào Telegram Cloud Storage
 * @param {Object} state - Trạng thái game cần lưu
 * @returns {Promise} - Promise giải quyết khi lưu thành công
 */
export function saveGameToTelegramCloud(state) {
    return new Promise((resolve, reject) => {
        try {
            // Kiểm tra nếu đang ở chế độ offline, không lưu dữ liệu
            if (isOfflineMode()) {
                console.warn('Đang ở chế độ offline, không lưu dữ liệu');
                resolve(false);
                return;
            }

            // Kiểm tra API Telegram WebApp có khả dụng không
            if (!window.Telegram || !window.Telegram.WebApp || !window.Telegram.WebApp.CloudStorage) {
                console.warn('Telegram CloudStorage API không khả dụng');
                resolve(false);
                return;
            }

            // Chuẩn bị dữ liệu để lưu
            const gameData = JSON.stringify(state);
            
            // Sử dụng Telegram WebApp để lưu trữ
            window.Telegram.WebApp.CloudStorage.setItem('wonderFarmGameState', gameData, (success, error) => {
                if (success) {
                    console.log('Game đã lưu vào Telegram Cloud Storage thành công');
                    resolve(true);
                } else {
                    console.error('Lỗi khi lưu vào Telegram Cloud Storage:', error);
                    resolve(false);
                }
            });
        } catch (e) {
            console.error('Lỗi khi lưu dữ liệu game:', e);
            resolve(false);
        }
    });
}

/**
 * Tải dữ liệu game từ Telegram Cloud Storage
 * @returns {Promise} - Promise giải quyết với dữ liệu game được tải
 */
export function loadGameFromTelegramCloud() {
    return new Promise((resolve, reject) => {
        try {
            // Kiểm tra API Telegram WebApp có khả dụng không
            if (!window.Telegram || !window.Telegram.WebApp || !window.Telegram.WebApp.CloudStorage) {
                console.warn('Telegram CloudStorage API không khả dụng');
                resolve(null);
                return;
            }

            // Thử tải từ Telegram Cloud
            window.Telegram.WebApp.CloudStorage.getItem('wonderFarmGameState', (result, error) => {
                if (result) {
                    try {
                        const loadedState = JSON.parse(result);
                        console.log('Game đã được tải từ Telegram Cloud Storage');
                        resolve(loadedState);
                    } catch (parseError) {
                        console.error('Lỗi phân tích dữ liệu từ Telegram Cloud:', parseError);
                        resolve(null);
                    }
                } else if (error) {
                    console.error('Lỗi khi tải từ Telegram Cloud:', error);
                    resolve(null);
                } else {
                    console.log('Không tìm thấy dữ liệu trên Telegram Cloud');
                    resolve(null);
                }
            });
        } catch (e) {
            console.error('Lỗi tổng thể khi tải game:', e);
            reject(e);
        }
    });
}

/**
 * Gửi dữ liệu đến Bot Telegram để lưu trữ (phương án dự phòng)
 * @param {Object} state - Trạng thái game cần gửi
 */
export function sendGameStateToBotServer(state) {
    try {
        // Kiểm tra API Telegram WebApp có khả dụng không
        if (!window.Telegram || !window.Telegram.WebApp || !window.Telegram.WebApp.sendData) {
            console.warn('Telegram WebApp API không khả dụng, không thể gửi dữ liệu đến bot');
            return;
        }

        // Kiểm tra xem có thông tin người dùng không
        if (!window.Telegram.WebApp.initDataUnsafe || !window.Telegram.WebApp.initDataUnsafe.user) {
            console.warn('Không có thông tin người dùng Telegram, không thể gửi dữ liệu đến bot');
            return;
        }

        // Lấy Telegram user ID
        const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        
        const gameData = {
            userId: userId,
            timestamp: new Date().toISOString(),
            gameState: state
        };
        
        // Gửi dữ liệu đến Bot thông qua Telegram WebApp
        window.Telegram.WebApp.sendData(JSON.stringify({
            action: 'saveGame',
            data: gameData
        }));
        
        console.log('Đã gửi dữ liệu game đến Bot Telegram');
    } catch (e) {
        console.error('Lỗi khi gửi dữ liệu đến Bot Telegram:', e);
    }
}

// Hàm gom nhóm tất cả các chức năng lưu game
export async function saveAllGameData(state) {
    try {
        if (isOfflineMode()) {
            console.log('Không lưu dữ liệu vì đang ở chế độ offline');
            return false;
        }
        
        // Lưu vào Telegram Cloud
        return await saveGameToTelegramCloud(state);
    } catch (e) {
        console.error('Lỗi khi lưu dữ liệu game:', e);
        return false;
    }
}