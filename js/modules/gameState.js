// Trạng thái game
export const gameState = {
    selectedCell: null,
    plants: [], 
    plantImages: {},
    money: 100,
    totalHarvested: 0,
    totalEarned: 0,
    harvestedCrops: {
        Beetroot: 0,
        Broccoli: 0,
        Chili: 0,
        Cucumber: 0,
        Pineapple: 0,
        Potato: 0,
        Pumpkin: 0,
        Strawberry: 0,
        Watermelon: 0
    },
    achievements: {
        unlocked: []
    },
    combo: 0,
    comboTimeout: null,
    comboMultiplier: 1,
    lastAction: 0,
    
    // Thêm inventory array để lưu trữ các trang bị đã mua
    inventory: [],
    
    dailyQuests: {
        lastRefresh: null,
        active: [],
        completed: [],
        dailyStats: {
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
        }
    },
    
    loginStreak: {
        days: 0,
        lastLogin: null,
        claimed: false
    },
    
    leaderboard: {
        lastSubmission: null,
        playerName: ''
    },
    
    maxCombo: 0,
    plantsPlanted: 0
};