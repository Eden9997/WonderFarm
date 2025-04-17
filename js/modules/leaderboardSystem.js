import { config } from './config.js';
import { gameState } from './gameState.js';

export function initLeaderboard() {
    renderLeaderboardTabs();
    updateLeaderboard('total_harvested');
}

function renderLeaderboardTabs() {
    const tabsContainer = document.getElementById('leaderboard-tabs');
    tabsContainer.innerHTML = '';
    
    config.leaderboard.categories.forEach(category => {
        const tab = document.createElement('div');
        tab.classList.add('leaderboard-tab');
        tab.dataset.category = category.id;
        tab.textContent = category.name;
        
        tab.addEventListener('click', () => {
            document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateLeaderboard(category.id);
        });
        
        tabsContainer.appendChild(tab);
    });
    
    // Activate first tab by default
    tabsContainer.firstChild?.classList.add('active');
}

// Đổi tên hàm này thành renderLeaderboard để dễ dàng sử dụng từ bên ngoài
export function renderLeaderboard(category = 'total_harvested') {
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    updateLeaderboard(category);
}

// Cập nhật bảng xếp hạng (hàm này sử dụng nội bộ trong module)
function updateLeaderboard(category) {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    // Tạm thời sử dụng dữ liệu mẫu
    const sampleData = generateSampleData(category);
    
    if (sampleData.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('leaderboard-empty');
        emptyMessage.textContent = 'Chưa có dữ liệu';
        leaderboardList.appendChild(emptyMessage);
        return;
    }
    
    sampleData.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('leaderboard-item');
        
        const rank = document.createElement('div');
        rank.classList.add('leaderboard-rank');
        rank.textContent = index + 1;
        
        const player = document.createElement('div');
        player.classList.add('leaderboard-player');
        player.textContent = item.name;
        
        const score = document.createElement('div');
        score.classList.add('leaderboard-score');
        score.textContent = formatScore(item.score, category);
        
        itemElement.appendChild(rank);
        itemElement.appendChild(player);
        itemElement.appendChild(score);
        
        leaderboardList.appendChild(itemElement);
    });
}

function generateSampleData(category) {
    // Mô phỏng dữ liệu xếp hạng
    const names = ['Nông dân A', 'Nông dân B', 'Nông dân C', 'Nông dân D', 'Nông dân E'];
    let data = [];
    
    switch(category) {
        case 'total_harvested':
            data = names.map(name => ({
                name,
                score: Math.floor(Math.random() * 1000)
            }));
            break;
            
        case 'money_earned':
            data = names.map(name => ({
                name,
                score: Math.floor(Math.random() * 10000)
            }));
            break;
            
        case 'max_combo':
            data = names.map(name => ({
                name,
                score: Math.floor(Math.random() * 20)
            }));
            break;
    }
    
    return data.sort((a, b) => b.score - a.score);
}

function formatScore(score, category) {
    switch(category) {
        case 'total_harvested':
            return `${score} cây`;
            
        case 'money_earned':
            return `${score} xu`;
            
        case 'max_combo':
            return `x${score}`;
            
        default:
            return score.toString();
    }
}

export function submitScore(category) {
    const now = new Date();
    const lastSubmission = gameState.leaderboard.lastSubmission 
        ? new Date(gameState.leaderboard.lastSubmission)
        : null;
    
    // Chỉ cho phép gửi điểm mỗi giờ một lần
    if (lastSubmission && (now - lastSubmission) < 3600000) {
        return false;
    }
    
    let score = 0;
    switch(category) {
        case 'total_harvested':
            score = gameState.totalHarvested;
            break;
        case 'money_earned':
            score = gameState.totalEarned;
            break;
        case 'max_combo':
            score = gameState.maxCombo;
            break;
    }
    
    // Cập nhật thời gian gửi điểm gần nhất
    gameState.leaderboard.lastSubmission = now.toISOString();
    
    return true;
}