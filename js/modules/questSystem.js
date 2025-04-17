import { config } from './config.js';
import { gameState } from './gameState.js';
import { playSound } from './audioSystem.js';
import { updateMoneyDisplay, showMessage } from './uiSystem.js';
import { isNewDay, shuffleArray } from './utils.js';

export function initDailyQuests() {
    checkAndRefreshDailyQuests();
    playSound('open');
}

export function updateDailyQuestProgress(questType, amount, cropType = null) {
    // Cập nhật thống kê hàng ngày
    switch(questType) {
        case 'harvest_amount':
            gameState.dailyQuests.dailyStats.harvested += amount;
            break;
        case 'plant_amount':
            gameState.dailyQuests.dailyStats.planted += amount;
            break;
        case 'earn_coins':
            gameState.dailyQuests.dailyStats.earned += amount;
            break;
        case 'harvest_crop':
            if (cropType) {
                gameState.dailyQuests.dailyStats.harvestedByType[cropType] += amount;
            }
            break;
        case 'consecutive_harvests':
            gameState.dailyQuests.dailyStats.maxCombo = Math.max(
                gameState.dailyQuests.dailyStats.maxCombo,
                gameState.combo
            );
            gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
            break;
    }
    
    // Kiểm tra và cập nhật tiến độ nhiệm vụ
    gameState.dailyQuests.active.forEach(quest => {
        if (quest.completed) return;
        
        let progress = 0;
        let target = quest.target;
        
        switch(quest.type) {
            case 'harvest_amount':
                if (questType === 'harvest_amount') {
                    quest.progress += amount;
                }
                progress = quest.progress;
                break;
            case 'plant_amount':
                if (questType === 'plant_amount') {
                    quest.progress += amount;
                }
                progress = quest.progress;
                break;
            case 'earn_coins':
                if (questType === 'earn_coins') {
                    quest.progress += amount;
                }
                progress = quest.progress;
                break;
            case 'harvest_crop':
                if (questType === 'harvest_crop' && cropType === quest.cropType) {
                    quest.progress += amount;
                }
                progress = quest.progress;
                break;
            case 'consecutive_harvests':
                if (questType === 'consecutive_harvests') {
                    quest.progress = Math.max(quest.progress, gameState.combo);
                }
                progress = quest.progress;
                break;
        }
        
        if (progress >= target) {
            completeQuest(quest);
        }
    });
    
    if (document.querySelector('.quests-panel.show')) {
        renderQuestsList();
    }
}

function completeQuest(quest) {
    if (quest.completed) return;
    
    quest.completed = true;
    
    if (!gameState.dailyQuests.completed.includes(quest.id)) {
        gameState.dailyQuests.completed.push(quest.id);
    }
    
    if (!quest.notified) {
        showQuestNotification(quest);
        quest.notified = true;
    }
    
    renderQuestsList();
}

function showQuestNotification(quest) {
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('quest-notification');
    
    const icon = document.createElement('div');
    icon.classList.add('quest-icon');
    icon.textContent = '📋';
    
    const content = document.createElement('div');
    content.classList.add('quest-content');
    
    const title = document.createElement('div');
    title.classList.add('quest-title');
    title.textContent = "Nhiệm vụ hoàn thành!";
    
    const description = document.createElement('div');
    description.classList.add('quest-description');
    description.textContent = quest.name;
    
    const reward = document.createElement('div');
    reward.classList.add('quest-reward');
    reward.textContent = `Phần thưởng: +${quest.reward} 🪙`;
    
    content.appendChild(title);
    content.appendChild(description);
    
    notificationElement.appendChild(icon);
    notificationElement.appendChild(content);
    
    document.body.appendChild(notificationElement);
    
    setTimeout(() => {
        notificationElement.classList.add('show');
        playSound('achievement');
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

export function claimQuestReward(questId) {
    const questIndex = gameState.dailyQuests.active.findIndex(q => q.id === questId);
    if (questIndex === -1) return;
    
    const quest = gameState.dailyQuests.active[questIndex];
    
    if (quest.completed && !quest.rewarded) {
        gameState.money += quest.reward;
        quest.rewarded = true;
        updateMoneyDisplay();
        showMessage(`Đã nhận ${quest.reward} xu từ nhiệm vụ!`);
        playSound('achievement');
        renderQuestsList();
    }
}

function checkAndRefreshDailyQuests() {
    const now = new Date();
    const lastRefresh = gameState.dailyQuests.lastRefresh ? new Date(gameState.dailyQuests.lastRefresh) : null;
    
    if (!lastRefresh || isNewDay(lastRefresh, now) || gameState.dailyQuests.active.length === 0) {
        resetDailyStats();
        generateDailyQuests();
        gameState.dailyQuests.lastRefresh = now.toISOString();
    }
}

function resetDailyStats() {
    gameState.dailyQuests.dailyStats = {
        harvested: 0,
        planted: 0,
        earned: 0,
        maxCombo: 0,
        harvestedByType: {
            Beetroot: 0,
            Broccoli: 0,
            Chili: 0,
            Cucumber: 0,
            Pineapple: 0,
            Potato: 0,
            Pumpkin: 0,
            Strawberry: 0,
            Watermelon: 0
        }
    };
    
    gameState.dailyQuests.completed = [];
}

function generateDailyQuests() {
    gameState.dailyQuests.active = [];
    
    const questTypes = config.dailyQuests.types;
    const maxQuests = config.dailyQuests.maxActive;
    
    const plantTypes = [
        'Beetroot', 'Broccoli', 'Chili', 'Cucumber', 'Pineapple', 
        'Potato', 'Pumpkin', 'Strawberry', 'Watermelon'
    ];
    
    const selectedQuestTypes = shuffleArray([...questTypes]).slice(0, maxQuests);
    
    selectedQuestTypes.forEach((questType, index) => {
        const difficulty = Math.floor(Math.random() * 3);
        const questId = `${questType.id}_${index}_${Date.now()}`;
        
        const newQuest = {
            id: questId,
            type: questType.id,
            name: questType.name,
            progress: 0,
            target: questType.targetAmounts[difficulty],
            reward: questType.rewards[difficulty],
            completed: false,
            rewarded: false,
            notified: false
        };
        
        if (questType.id === 'harvest_crop') {
            const randomPlantType = plantTypes[Math.floor(Math.random() * plantTypes.length)];
            newQuest.cropType = randomPlantType;
            newQuest.name = newQuest.name
                .replace('{amount}', newQuest.target)
                .replace('{cropName}', randomPlantType);
        } else {
            newQuest.name = newQuest.name.replace('{amount}', newQuest.target);
        }
        
        gameState.dailyQuests.active.push(newQuest);
    });
}

export function renderQuestsList() {
    const questsList = document.getElementById('quests-list');
    questsList.innerHTML = '';
    
    const questCount = gameState.dailyQuests.active.length;
    
    if (questCount === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('quests-empty');
        emptyMessage.textContent = 'Đang tải nhiệm vụ hàng ngày...';
        questsList.appendChild(emptyMessage);
        
        checkAndRefreshDailyQuests();
        return;
    }
    
    gameState.dailyQuests.active.forEach(quest => {
        const questItem = document.createElement('div');
        questItem.classList.add('quest-item');
        
        if (quest.completed) {
            questItem.classList.add('completed');
        } else {
            questItem.classList.add('active');
        }
        
        const title = document.createElement('div');
        title.classList.add('quest-item-title');
        title.textContent = quest.name;
        
        const reward = document.createElement('div');
        reward.classList.add('quest-item-reward');
        reward.textContent = `Phần thưởng: +${quest.reward} 🪙`;
        
        const progress = Math.min(quest.progress, quest.target);
        const progressPercentage = Math.floor((progress / quest.target) * 100);
        
        const progressElement = document.createElement('div');
        progressElement.classList.add('quest-progress');
        progressElement.innerHTML = `Tiến độ: <span class="quest-progress-value">${progress}/${quest.target}</span>`;
        
        const progressBar = document.createElement('div');
        progressBar.classList.add('quest-progress-bar');
        
        const progressFill = document.createElement('div');
        progressFill.classList.add('quest-progress-fill');
        progressFill.style.width = `${progressPercentage}%`;
        
        progressBar.appendChild(progressFill);
        progressElement.appendChild(progressBar);
        
        if (quest.completed && !quest.rewarded) {
            const claimButton = document.createElement('button');
            claimButton.classList.add('quest-claim-btn');
            claimButton.textContent = 'Nhận thưởng';
            claimButton.addEventListener('click', () => claimQuestReward(quest.id));
            questItem.appendChild(claimButton);
        }
        
        questItem.appendChild(title);
        questItem.appendChild(reward);
        questItem.appendChild(progressElement);
        
        questsList.appendChild(questItem);
    });
}