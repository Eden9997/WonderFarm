// Cấu hình game
export const config = {
    gridWidth: 8,
    gridHeight: 15,
    growthStages: 4,
    growthTime: {
        Beetroot: 30,
        Broccoli: 40,
        Chili: 50,
        Cucumber: 25,
        Pineapple: 60,
        Potato: 35,
        Pumpkin: 45,
        Strawberry: 20,
        Watermelon: 55
    },
    harvestValue: {
        Beetroot: 30,
        Broccoli: 40,
        Chili: 50,
        Cucumber: 25,
        Pineapple: 60,
        Potato: 35,
        Pumpkin: 45,
        Strawberry: 20,
        Watermelon: 55
    },
    seedPrice: {
        Beetroot: 10,
        Broccoli: 13,
        Chili: 17,
        Cucumber: 8,
        Pineapple: 20,
        Potato: 12,
        Pumpkin: 15,
        Strawberry: 7,
        Watermelon: 18
    },
    achievements: {
        harvests: [
            { id: 'first_harvest', name: 'Thu hoạch đầu tiên', description: 'Thu hoạch cây đầu tiên', target: 1, reward: 20 },
            { id: 'beginner_farmer', name: 'Nông dân tập sự', description: 'Thu hoạch 5 cây', target: 5, reward: 50 },
            { id: 'skilled_farmer', name: 'Nông dân lành nghề', description: 'Thu hoạch 20 cây', target: 20, reward: 100 },
            { id: 'master_farmer', name: 'Bậc thầy canh tác', description: 'Thu hoạch 50 cây', target: 50, reward: 200 },
            { id: 'farming_legend', name: 'Huyền thoại nông nghiệp', description: 'Thu hoạch 100 cây', target: 100, reward: 500 }
        ],
        money: [
            { id: 'first_coins', name: 'Xu đầu tiên', description: 'Kiếm được 100 xu', target: 100, reward: 10 },
            { id: 'small_fortune', name: 'Gia tài nhỏ', description: 'Kiếm được 500 xu', target: 500, reward: 50 },
            { id: 'money_maker', name: 'Nhà kinh doanh', description: 'Kiếm được 2000 xu', target: 2000, reward: 200 },
            { id: 'gold_hoarder', name: 'Kho báu vàng', description: 'Kiếm được 5000 xu', target: 5000, reward: 500 }
        ],
        crops: [
            { id: 'crop_variety', name: 'Đa dạng mùa màng', description: 'Thu hoạch mỗi loại cây ít nhất 1 lần', target: 9, reward: 100 },
            { id: 'strawberry_lover', name: 'Yêu thích dâu tây', description: 'Thu hoạch 10 cây dâu tây', target: 10, reward: 50, crop: 'Strawberry' },
            { id: 'pineapple_master', name: 'Chuyên gia trồng dứa', description: 'Thu hoạch 10 cây dứa', target: 10, reward: 80, crop: 'Pineapple' }
        ]
    },
    dailyQuests: {
        types: [
            { id: 'harvest_amount', name: 'Thu hoạch {amount} cây trồng', rewards: [20, 30, 50], targetAmounts: [5, 10, 15] },
            { id: 'harvest_crop', name: 'Thu hoạch {amount} {cropName}', rewards: [25, 35, 55], targetAmounts: [3, 5, 8] },
            { id: 'earn_coins', name: 'Kiếm {amount} xu', rewards: [15, 30, 60], targetAmounts: [100, 200, 400] },
            { id: 'plant_amount', name: 'Trồng {amount} cây', rewards: [20, 35, 45], targetAmounts: [3, 6, 10] },
            { id: 'consecutive_harvests', name: 'Thu hoạch liên tiếp (combo {amount})', rewards: [30, 45, 70], targetAmounts: [3, 5, 8] }
        ],
        refreshHour: 0,
        maxActive: 3
    },
    leaderboard: {
        categories: [
            { id: 'total_harvested', name: 'Cây trồng', description: 'Số lượng cây đã thu hoạch' },
            { id: 'money_earned', name: 'Tài sản', description: 'Số tiền đã kiếm được' },
            { id: 'max_combo', name: 'Combo cao nhất', description: 'Combo thu hoạch cao nhất đạt được' }
        ]
    }
};