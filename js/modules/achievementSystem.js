import { config } from './config.js';
import { gameState } from './gameState.js';
import { playSound } from './audioSystem.js';
import { updateMoneyDisplay, showMessage } from './uiSystem.js';
import { saveAllGameData } from './utils.js';

export function checkAchievements() {
    // Kiểm tra thành tựu về số lượng thu hoạch
    config.achievements.harvests.forEach(achievement => {
        if (!gameState.achievements.unlocked.includes(achievement.id) && 
            gameState.totalHarvested >= achievement.target) {
            unlockAchievement(achievement);
        }
    });
    
    // Kiểm tra thành tựu về số tiền
    config.achievements.money.forEach(achievement => {
        if (!gameState.achievements.unlocked.includes(achievement.id) && 
            gameState.totalEarned >= achievement.target) {
            unlockAchievement(achievement);
        }
    });
    
    // Kiểm tra thành tựu về loại cây
    config.achievements.crops.forEach(achievement => {
        if (!gameState.achievements.unlocked.includes(achievement.id)) {
            if (achievement.id === 'crop_variety') {
                const harvestedTypes = Object.entries(gameState.harvestedCrops)
                    .filter(([_, count]) => count > 0).length;
                
                if (harvestedTypes >= achievement.target) {
                    unlockAchievement(achievement);
                }
            } else if (achievement.crop && 
                       gameState.harvestedCrops[achievement.crop] >= achievement.target) {
                unlockAchievement(achievement);
            }
        }
    });
}

function unlockAchievement(achievement) {
    gameState.achievements.unlocked.push(achievement.id);
    gameState.money += achievement.reward;
    updateMoneyDisplay();
    showAchievementNotification(achievement);
    playSound('achievement');
    
    // Lưu dữ liệu game lên Telegram Cloud khi mở khóa thành tựu mới
    saveAllGameData(gameState);
}

function showAchievementNotification(achievement) {
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('achievement-notification');
    
    const icon = document.createElement('div');
    icon.classList.add('achievement-icon');
    icon.textContent = '🏆';
    
    const content = document.createElement('div');
    content.classList.add('achievement-content');
    
    const title = document.createElement('div');
    title.classList.add('achievement-title');
    title.textContent = achievement.name;
    
    const description = document.createElement('div');
    description.classList.add('achievement-description');
    description.textContent = achievement.description;
    
    const reward = document.createElement('div');
    reward.classList.add('achievement-reward');
    reward.textContent = `+${achievement.reward} 🪙`;
    
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(reward);
    
    notificationElement.appendChild(icon);
    notificationElement.appendChild(content);
    
    document.body.appendChild(notificationElement);
    
    setTimeout(() => {
        notificationElement.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notificationElement.classList.remove('show');
        setTimeout(() => {
            if (notificationElement.parentNode) {
                notificationElement.parentNode.removeChild(notificationElement);
            }
        }, 500);
    }, 5000);
}

// Hiển thị danh sách thành tựu
export function renderAchievementsList() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';
    
    const allAchievements = [
        ...config.achievements.harvests,
        ...config.achievements.money,
        ...config.achievements.crops
    ];
    
    allAchievements.sort((a, b) => {
        const aUnlocked = gameState.achievements.unlocked.includes(a.id);
        const bUnlocked = gameState.achievements.unlocked.includes(b.id);
        
        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        
        return a.target - b.target;
    });
    
    allAchievements.forEach(achievement => {
        const isUnlocked = gameState.achievements.unlocked.includes(achievement.id);
        
        const achievementItem = document.createElement('div');
        achievementItem.classList.add('achievement-item');
        if (isUnlocked) {
            achievementItem.classList.add('unlocked');
        }
        
        const title = document.createElement('div');
        title.classList.add('achievement-item-title');
        title.textContent = isUnlocked ? achievement.name : '??? Thành tựu ẩn ???';
        
        const description = document.createElement('div');
        description.classList.add('achievement-item-description');
        description.textContent = isUnlocked ? achievement.description : 'Tiếp tục chơi để mở khóa!';
        
        const reward = document.createElement('div');
        reward.classList.add('achievement-item-reward');
        reward.textContent = isUnlocked ? `Phần thưởng: +${achievement.reward} 🪙` : '???';
        
        if (!isUnlocked) {
            let progress = 0;
            let target = achievement.target;
            
            if (achievement.id.startsWith('first_') || achievement.id.includes('harvest')) {
                progress = gameState.totalHarvested;
            } else if (achievement.id.includes('money') || achievement.id.includes('fortune') || 
                      achievement.id.includes('gold') || achievement.id.includes('maker')) {
                progress = gameState.totalEarned;
            } else if (achievement.crop) {
                progress = gameState.harvestedCrops[achievement.crop] || 0;
            } else if (achievement.id === 'crop_variety') {
                progress = Object.entries(gameState.harvestedCrops)
                    .filter(([_, count]) => count > 0).length;
            }
            
            if (progress > 0) {
                const progressElement = document.createElement('div');
                progressElement.classList.add('achievement-progress');
                progressElement.innerHTML = `Tiến độ: <span class="progress-value">${progress}/${target}</span>`;
                
                const progressBar = document.createElement('div');
                progressBar.classList.add('progress-bar');
                
                const progressFill = document.createElement('div');
                progressFill.classList.add('progress-fill');
                progressFill.style.width = `${Math.min(100, (progress / target) * 100)}%`;
                
                progressBar.appendChild(progressFill);
                progressElement.appendChild(progressBar);
                achievementItem.appendChild(progressElement);
            }
        }
        
        achievementItem.appendChild(title);
        achievementItem.appendChild(description);
        achievementItem.appendChild(reward);
        
        achievementsList.appendChild(achievementItem);
    });
}