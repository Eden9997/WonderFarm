// Shop system for Wonder Farm
import { gameState } from './gameState.js';
import { config } from './config.js';
import { showMessage } from './uiSystem.js';
import { updateMoneyDisplay } from './uiSystem.js';
import { playSound } from './audioSystem.js';
import { updateCharacterState } from './characterSystem.js';

// Shop categories
const SHOP_CATEGORIES = {
    EQUIPMENTS: 'equipments',
    SPECIAL: 'special'
};

// Equipment types
const EQUIPMENT_TYPES = {
    HAT: 'hat',
    APRONS: 'aprons',
    GLOVES: 'gloves',
    BOOTS: 'boots',
    WINGS: 'wings'  // Single wings category
};

// Equipment type groups for display
const EQUIPMENT_GROUP_NAMES = {
    [EQUIPMENT_TYPES.HAT]: 'Mũ',
    [EQUIPMENT_TYPES.APRONS]: 'Quần áo',
    [EQUIPMENT_TYPES.GLOVES]: 'Găng tay',
    [EQUIPMENT_TYPES.BOOTS]: 'Giày',
    [EQUIPMENT_TYPES.WINGS]: 'Cánh'
};

// DOM Elements
const shopPanel = document.getElementById('shop-panel');
const shopTabs = document.getElementById('shop-tabs');
const shopItems = document.getElementById('shop-items');

// Current active tab
let currentShopTab = SHOP_CATEGORIES.EQUIPMENTS;

// Equipment items data
const shopEquipmentItems = [
    // Basic Equipment (Trang bị cơ bản từ characterSystem.js)
    { 
        id: 'hat_basic', 
        name: 'Mũ làm vườn', 
        type: EQUIPMENT_TYPES.HAT, 
        price: 1, 
        description: 'Mũ chống nắng giúp cây phát triển nhanh hơn',
        effects: { growth_time: 15 }, // Giảm 15% thời gian trồng cây
        image: 'Hat.png',
        rarity: 'common'
    },
    // Thêm các mũ mới
    { 
        id: 'armet_hat_gold', 
        name: 'Mũ giáp vàng', 
        type: EQUIPMENT_TYPES.HAT, 
        price: 1, 
        description: 'Mũ giáp làm bằng vàng, giúp tăng hiệu suất trồng trọt',
        effects: { growth_time: 18, harvest_bonus: 8 },
        image: 'ArmetHat_Gold.png',
        rarity: 'rare'
    },
    { 
        id: 'legion_hat_gold', 
        name: 'Mũ chiến binh', 
        type: EQUIPMENT_TYPES.HAT, 
        price: 1, 
        description: 'Mũ chiến binh bằng vàng, tạo cho bạn cảm giác mạnh mẽ khi trồng trọt',
        effects: { growth_time: 20, harvest_time: 10 },
        image: 'LegionHat_Gold.png',
        rarity: 'rare'
    },
    { 
        id: 'maximus_hat_gold', 
        name: 'Mũ hoàng đế', 
        type: EQUIPMENT_TYPES.HAT, 
        price: 1, 
        description: 'Mũ hoàng đế làm từ vàng nguyên chất, đem lại quyền năng trồng trọt vô hạn',
        effects: { growth_time: 25, harvest_bonus: 15, seed_discount: 10 },
        image: 'MaximusHat_Gold.png',
        rarity: 'legendary'
    },
    { 
        id: 'pirate_hat_blue', 
        name: 'Mũ hải tặc', 
        type: EQUIPMENT_TYPES.HAT, 
        price: 1, 
        description: 'Mũ hải tặc mang lại sự tự do và tinh thần phiêu lưu trong làm vườn',
        effects: { harvest_time: 20, seed_discount: 15 },
        image: 'PirateHat_Blue.png',
        rarity: 'rare'
    },
    { 
        id: 'aprons_basic', 
        name: 'Tạp dề', 
        type: EQUIPMENT_TYPES.APRONS, 
        price: 1, 
        description: 'Tạp dề bảo vệ giúp tăng sản lượng thu hoạch',
        effects: { harvest_bonus: 10 }, // Tăng 10% sản lượng thu hoạch
        image: 'Aprons.png',
        rarity: 'common'
    },
    // Thêm các trang phục mới
    { 
        id: 'legion_armor_gold', 
        name: 'Áo giáp chiến binh', 
        type: EQUIPMENT_TYPES.APRONS, 
        price: 1, 
        description: 'Áo giáp chiến binh vàng giúp bạn trở thành người nông dân chiến binh',
        effects: { harvest_bonus: 20, harvest_time: 15 },
        image: 'LegionArmor_Gold.png',
        rarity: 'rare'
    },
    { 
        id: 'maximus_armor_gold', 
        name: 'Áo giáp hoàng đế', 
        type: EQUIPMENT_TYPES.APRONS, 
        price: 1, 
        description: 'Áo giáp của hoàng đế, đem lại sự tôn quý trong công việc làm vườn',
        effects: { harvest_bonus: 25, growth_time: 15, seed_discount: 10 },
        image: 'MaximusArmor_Gold.png',
        rarity: 'legendary'
    },
    { 
        id: 'stretchy_clothes_black', 
        name: 'Đồ đen co giãn', 
        type: EQUIPMENT_TYPES.APRONS, 
        price: 1, 
        description: 'Bộ đồ đen co giãn giúp bạn dễ dàng di chuyển khi làm việc',
        effects: { harvest_time: 25, growth_time: 10 },
        image: 'StretchyClothes_Black.png',
        rarity: 'rare'
    },
    { 
        id: 'gloves_basic', 
        name: 'Găng tay làm vườn', 
        type: EQUIPMENT_TYPES.GLOVES, 
        price: 1, 
        description: 'Găng tay bảo vệ giúp thu hoạch nhanh hơn',
        effects: { harvest_time: 20 }, // Giảm 20% thời gian thu hoạch
        image: 'Gloves.png',
        rarity: 'common'
    },
    // Thêm găng tay mới
    { 
        id: 'gloves_black', 
        name: 'Găng tay đen', 
        type: EQUIPMENT_TYPES.GLOVES, 
        price: 1, 
        description: 'Găng tay đen cao cấp giúp thu hoạch và trồng trọt hiệu quả',
        effects: { harvest_time: 30, growth_time: 10 },
        image: 'Gloves_Black.png',
        rarity: 'rare'
    },
    { 
        id: 'boots_basic', 
        name: 'Giày làm vườn', 
        type: EQUIPMENT_TYPES.BOOTS, 
        price: 1, 
        description: 'Giày đặc biệt giúp tiết kiệm chi phí mua hạt giống',
        effects: { seed_discount: 15 }, // Giảm 15% giá hạt giống
        image: 'Boots.png',
        rarity: 'common'
    },
    // Thêm giày mới
    { 
        id: 'sandals', 
        name: 'Giày xăng đan', 
        type: EQUIPMENT_TYPES.BOOTS, 
        price: 1, 
        description: 'Giày xăng đan thoáng mát giúp làm việc hiệu quả hơn',
        effects: { seed_discount: 20, harvest_time: 15 },
        image: 'Sandals.png',
        rarity: 'rare'
    },
    { 
        id: 'wings_basic', 
        name: 'Cánh dơi', 
        type: EQUIPMENT_TYPES.WINGS, 
        price: 1, 
        description: 'Cánh dơi thần kỳ giúp giảm thời gian trồng cây',
        effects: { growth_time: 10, harvest_time: 5 }, // Giảm 10% thời gian trồng cây và 5% thời gian thu hoạch
        image: 'Wings.png',
        rarity: 'rare'
    },
    { 
        id: 'wings_white', 
        name: 'Cánh thiên thần', 
        type: EQUIPMENT_TYPES.WINGS, 
        price: 1, 
        description: 'Cánh thiên thần mang lại nhiều lợi ích cho nông dân',
        effects: { growth_time: 15, harvest_time: 10, harvest_bonus: 10 },
        image: 'WhiteWings.png',
        rarity: 'legendary'
    },
    { 
        id: 'wings_black', 
        name: 'Cánh rồng', 
        type: EQUIPMENT_TYPES.WINGS, 
        price: 1, 
        description: 'Cánh rồng huyền thoại mang lại sức mạnh của loài rồng',
        effects: { growth_time: 25, harvest_time: 20, harvest_bonus: 20, seed_discount: 15 },
        image: 'BlackWings.png',
        rarity: 'legendary'
    }
];

// Special items data
const shopSpecialItems = [
    { 
        id: 'fertilizer', 
        name: 'Phân bón cao cấp', 
        price: 200, 
        description: 'Tăng 50% tốc độ phát triển cây trồng trong 30 phút',
        image: '💩',
        rarity: 'common',
        consumable: true
    },
    { 
        id: 'super_watering', 
        name: 'Nước tưới diệu kỳ', 
        price: 300, 
        description: 'Tăng 30% sản lượng thu hoạch trong 30 phút',
        image: '💧',
        rarity: 'common',
        consumable: true
    },
    { 
        id: 'boost_pack', 
        name: 'Gói tăng tốc', 
        price: 500, 
        description: 'Thu hoạch tất cả cây trồng đã trồng ngay lập tức',
        image: '⚡',
        rarity: 'rare',
        consumable: true
    }
];

/**
 * Initialize shop tabs and items
 */
export function initShop() {
    createShopTabs();
}

/**
 * Create shop category tabs
 */
function createShopTabs() {
    shopTabs.innerHTML = '';
    
    // Create tab for each category
    const equipmentsTab = createTabElement('Trang bị', SHOP_CATEGORIES.EQUIPMENTS);
    const specialTab = createTabElement('Đặc biệt', SHOP_CATEGORIES.SPECIAL);
    
    // Add tabs to container
    shopTabs.appendChild(equipmentsTab);
    shopTabs.appendChild(specialTab);
    
    // Set default active tab
    setActiveTab(SHOP_CATEGORIES.EQUIPMENTS);
    
    // Add event listeners to tabs
    equipmentsTab.addEventListener('click', () => setActiveTab(SHOP_CATEGORIES.EQUIPMENTS));
    specialTab.addEventListener('click', () => setActiveTab(SHOP_CATEGORIES.SPECIAL));
}

/**
 * Create a tab element
 */
function createTabElement(name, category) {
    const tab = document.createElement('div');
    tab.className = 'shop-tab';
    tab.dataset.category = category;
    tab.textContent = name;
    return tab;
}

/**
 * Set the active tab
 */
function setActiveTab(category) {
    // Remove active class from all tabs
    const tabs = shopTabs.querySelectorAll('.shop-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to selected tab
    const activeTab = shopTabs.querySelector(`.shop-tab[data-category="${category}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update current tab and render items
    currentShopTab = category;
    renderShopItems();
    
    // Play tab change sound
    playSound('click');
}

/**
 * Render shop items based on current tab
 */
export function renderShopItems() {
    shopItems.innerHTML = '';
    
    switch(currentShopTab) {
        case SHOP_CATEGORIES.EQUIPMENTS:
            renderEquipmentItems();
            break;
        case SHOP_CATEGORIES.SPECIAL:
            renderSpecialItems();
            break;
    }
}

/**
 * Render equipment items in shop
 */
function renderEquipmentItems() {
    // Danh sách loại trang bị để nhóm
    const equipmentTypeGroups = {
        [EQUIPMENT_TYPES.HAT]: { name: 'Mũ', items: [] },
        [EQUIPMENT_TYPES.APRONS]: { name: 'Quần áo', items: [] },
        [EQUIPMENT_TYPES.GLOVES]: { name: 'Găng tay', items: [] },
        [EQUIPMENT_TYPES.BOOTS]: { name: 'Giày', items: [] },
        [EQUIPMENT_TYPES.WINGS]: { name: 'Cánh', items: [] }
    };
    
    // Đảm bảo rằng gameState.inventory luôn tồn tại
    if (!gameState.inventory) {
        gameState.inventory = [];
    }
    
    // Nhóm các trang bị theo loại
    shopEquipmentItems.forEach(item => {
        // Kiểm tra xem trang bị đã có trong kho đồ của người chơi không
        const ownedItem = gameState.inventory.find(invItem => invItem.id === item.id);
        
        // Chỉ hiển thị các trang bị chưa được mua
        if (!ownedItem && equipmentTypeGroups[item.type]) {
            equipmentTypeGroups[item.type].items.push(item);
        }
    });
    
    // Hiển thị từng nhóm trang bị
    for (const [type, group] of Object.entries(equipmentTypeGroups)) {
        if (group.items.length > 0) {
            // Tạo tiêu đề cho nhóm
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'shop-category-title';
            categoryTitle.textContent = group.name;
            shopItems.appendChild(categoryTitle);
            
            // Tạo danh sách trang bị trong nhóm
            const categoryItems = document.createElement('div');
            categoryItems.className = 'shop-category-items';
            
            // Hiển thị từng trang bị
            group.items.forEach(item => {
                const shopItem = document.createElement('div');
                shopItem.className = 'shop-item';
                if (item.rarity === 'rare') shopItem.classList.add('rare');
                if (item.rarity === 'legendary') shopItem.classList.add('legendary');
                
                const imageContainer = document.createElement('div');
                imageContainer.className = 'shop-item-image';
                
                let imageElement;
                if (item.image.endsWith('.png')) {
                    // Hình ảnh thông thường
                    imageElement = document.createElement('img');
                    imageElement.src = `img/icon/${item.image}`;
                    imageElement.alt = item.name;
                } else {
                    // Emoji cho special items
                    imageElement = document.createElement('div');
                    imageElement.textContent = item.image;
                    imageElement.style.fontSize = '32px';
                    imageElement.style.lineHeight = '1';
                    imageElement.style.textAlign = 'center';
                }
                
                const details = document.createElement('div');
                details.className = 'shop-item-details';
                
                const name = document.createElement('div');
                name.className = 'shop-item-name';
                name.textContent = item.name;
                
                const type = document.createElement('div');
                type.className = 'shop-item-type';
                type.textContent = `Loại: ${group.name}`;
                
                const description = document.createElement('div');
                description.className = 'shop-item-description';
                description.textContent = item.description;
                
                const effects = document.createElement('div');
                effects.className = 'shop-item-effects';
                
                // Thêm hiệu ứng
                if (item.effects) {
                    const effectDescriptions = {
                        harvest_bonus: 'Tăng thu hoạch',
                        growth_time: 'Giảm thời gian trồng cây',
                        seed_discount: 'Giảm giá hạt giống',
                        harvest_time: 'Giảm thời gian thu hoạch'
                    };
                    
                    for (const [effect, value] of Object.entries(item.effects)) {
                        const effectElement = document.createElement('div');
                        effectElement.className = 'shop-item-effect';
                        effectElement.textContent = `${effectDescriptions[effect]}: +${value}%`;
                        effects.appendChild(effectElement);
                    }
                }
                
                const priceContainer = document.createElement('div');
                priceContainer.className = 'shop-item-price-container';
                
                const price = document.createElement('div');
                price.className = 'shop-item-price';
                
                price.innerHTML = `<span class="coin-icon">🪙</span> ${item.price}`;
                if (gameState.money < item.price) {
                    price.classList.add('not-enough');
                }
                
                const buttons = document.createElement('div');
                buttons.className = 'shop-item-buttons';
                
                const buyButton = document.createElement('button');
                buyButton.className = 'shop-buy-button';
                
                buyButton.textContent = 'Mua';
                if (gameState.money < item.price) {
                    buyButton.disabled = true;
                } else {
                    buyButton.addEventListener('click', () => {
                        buyEquipment(item);
                    });
                }
                
                imageContainer.appendChild(imageElement);
                details.appendChild(name);
                details.appendChild(type);
                details.appendChild(description);
                details.appendChild(effects);
                
                priceContainer.appendChild(price);
                buttons.appendChild(buyButton);
                priceContainer.appendChild(buttons);
                
                details.appendChild(priceContainer);
                
                shopItem.appendChild(imageContainer);
                shopItem.appendChild(details);
                
                categoryItems.appendChild(shopItem);
            });
            
            shopItems.appendChild(categoryItems);
        }
    }
}

/**
 * Render special items in shop
 */
function renderSpecialItems() {
    // Tạo tiêu đề cho danh mục đặc biệt
    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'shop-category-title';
    categoryTitle.textContent = 'Vật phẩm đặc biệt';
    shopItems.appendChild(categoryTitle);
    
    // Tạo phần mô tả
    const categoryDescription = document.createElement('div');
    categoryDescription.className = 'shop-category-description';
    categoryDescription.textContent = 'Các vật phẩm tiêu hao mang lại hiệu ứng tạm thời cho nông trại của bạn.';
    shopItems.appendChild(categoryDescription);
    
    // Tạo danh sách vật phẩm
    shopSpecialItems.forEach(item => {
        const shopItem = document.createElement('div');
        shopItem.className = 'shop-item';
        if (item.rarity === 'rare') shopItem.classList.add('rare');
        if (item.rarity === 'legendary') shopItem.classList.add('legendary');
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'shop-item-image';
        
        const image = document.createElement('div');
        image.textContent = item.image;
        image.style.fontSize = '32px';
        image.style.textAlign = 'center';
        
        const details = document.createElement('div');
        details.className = 'shop-item-details';
        
        const name = document.createElement('div');
        name.className = 'shop-item-name';
        name.textContent = item.name;
        
        const description = document.createElement('div');
        description.className = 'shop-item-description';
        description.textContent = item.description;
        
        const priceContainer = document.createElement('div');
        priceContainer.className = 'shop-item-price-container';
        
        const price = document.createElement('div');
        price.className = 'shop-item-price';
        price.innerHTML = `<span class="coin-icon">🪙</span> ${item.price}`;
        
        if (gameState.money < item.price) {
            price.classList.add('not-enough');
        }
        
        const buttons = document.createElement('div');
        buttons.className = 'shop-item-buttons';
        
        const buyButton = document.createElement('button');
        buyButton.className = 'shop-buy-button';
        buyButton.textContent = 'Mua';
        
        if (gameState.money < item.price) {
            buyButton.disabled = true;
        } else {
            buyButton.addEventListener('click', () => {
                buySpecialItem(item);
            });
        }
        
        imageContainer.appendChild(image);
        details.appendChild(name);
        details.appendChild(description);
        
        priceContainer.appendChild(price);
        buttons.appendChild(buyButton);
        priceContainer.appendChild(buttons);
        
        details.appendChild(priceContainer);
        
        shopItem.appendChild(imageContainer);
        shopItem.appendChild(details);
        
        shopItems.appendChild(shopItem);
    });
}

/**
 * Buy equipment item
 */
function buyEquipment(item) {
    if (gameState.money >= item.price) {
        // Trừ tiền
        gameState.money -= item.price;
        updateMoneyDisplay();
        
        // Thêm vào túi đồ
        const newItem = { ...item };
        
        // Nếu chưa khởi tạo mảng inventory, khởi tạo nó
        if (!gameState.inventory) {
            gameState.inventory = [];
        }
        
        gameState.inventory.push(newItem);
        
        // Lưu game state vào localStorage
        saveGameState();
        
        // Phát âm thanh và hiển thị thông báo
        playSound('buy');
        showMessage(`Đã mua ${item.name}!`);
        
        // Cập nhật lại danh sách vật phẩm trong shop
        renderShopItems();
        
        // Cập nhật nhân vật và túi đồ
        updateCharacterState({});
        
        // Import dynamically to avoid circular dependency
        import('./characterSystem.js').then(charModule => {
            // Xác định loại trang bị thực sự
            let equipmentType = item.type;
            
            // Xử lý đặc biệt cho các loại trang bị
            if (item.id === 'wings_black') {
                equipmentType = 'blackWings';
            } else if (item.id === 'wings_white') {
                equipmentType = 'whiteWings'; 
            } else if (item.id === 'wings_basic') {
                equipmentType = 'wings';
            } 
            // Xử lý cho các trang bị mũ mới
            else if (item.id === 'armet_hat_gold') {
                equipmentType = 'armetHat_Gold';
            } else if (item.id === 'legion_hat_gold') {
                equipmentType = 'legionHat_Gold';
            } else if (item.id === 'maximus_hat_gold') {
                equipmentType = 'maximusHat_Gold';
            } else if (item.id === 'pirate_hat_blue') {
                equipmentType = 'pirateHat_Blue';
            }
            // Xử lý cho găng tay mới
            else if (item.id === 'gloves_black') {
                equipmentType = 'gloves_Black';
            }
            // Xử lý cho giày mới
            else if (item.id === 'sandals') {
                equipmentType = 'sandals';
            }
            // Xử lý cho quần áo mới
            else if (item.id === 'legion_armor_gold') {
                equipmentType = 'legionArmor_Gold';
            } else if (item.id === 'maximus_armor_gold') {
                equipmentType = 'maximusArmor_Gold';
            } else if (item.id === 'stretchy_clothes_black') {
                equipmentType = 'stretchyClothes_Black';
            }
            
            // Thêm vào inventory của characterState mà không kiểm tra điều kiện thừa
            if (!charModule.characterState.inventory.includes(equipmentType)) {
                charModule.characterState.inventory.push(equipmentType);
                console.log(`Added ${equipmentType} to character inventory`);
            }
            
        }).catch(err => {
            console.error("Error importing characterSystem:", err);
        });
    } else {
        playSound('error');
        showMessage(`Không đủ tiền để mua ${item.name}`);
    }
}

/**
 * Buy a special item
 */
function buySpecialItem(item) {
    if (gameState.money >= item.price) {
        // Trừ tiền
        gameState.money -= item.price;
        updateMoneyDisplay();
        
        // Áp dụng hiệu ứng của vật phẩm dựa vào ID
        if (item.id === 'fertilizer') {
            // Tăng tốc độ phát triển
            applyGrowthSpeedBoost();
        } else if (item.id === 'super_watering') {
            // Tăng giá trị thu hoạch
            applyHarvestBoost();
        } else if (item.id === 'boost_pack') {
            // Thu hoạch ngay lập tức tất cả
            harvestAllPlants();
        }
        
        // Phát âm thanh và hiển thị thông báo
        playSound('buy');
        showMessage(`Đã sử dụng ${item.name}!`);
    } else {
        playSound('error');
        showMessage(`Không đủ tiền để mua ${item.name}`);
    }
}

/**
 * Apply growth speed boost for all plants
 */
function applyGrowthSpeedBoost() {
    // Áp dụng hiệu ứng trực quan cho các cây đang trồng
    const plants = document.querySelectorAll('.grid-cell.planted');
    plants.forEach(plant => {
        // Thêm hiệu ứng hình ảnh
        plant.classList.add('boosted');
    });
    
    // Đặt cờ hiệu cho gameState
    gameState.boosts = gameState.boosts || {};
    gameState.boosts.growthSpeed = {
        active: true,
        multiplier: 1.5,
        endTime: Date.now() + 30 * 60 * 1000  // 30 phút
    };
    
    // Lưu game state
    saveGameState();
    
    showMessage('Tốc độ phát triển cây trồng tăng 50% trong 30 phút!');
}

/**
 * Apply harvest value boost for all plants
 */
function applyHarvestBoost() {
    // Đặt cờ hiệu cho gameState
    gameState.boosts = gameState.boosts || {};
    gameState.boosts.harvestValue = {
        active: true,
        multiplier: 1.3,
        endTime: Date.now() + 30 * 60 * 1000  // 30 phút
    };
    
    // Lưu game state
    saveGameState();
    
    showMessage('Tăng 30% sản lượng thu hoạch trong 30 phút!');
}

/**
 * Instantly harvest all plants
 */
function harvestAllPlants() {
    // Gọi hàm thu hoạch từ hệ thống cây trồng
    // Đây là mã giả - cần thay thế bằng hàm thực tế trong game
    const readyPlants = document.querySelectorAll('.grid-cell.planted.ready');
    let harvestedCount = 0;
    
    readyPlants.forEach(plant => {
        // Mô phỏng thu hoạch
        plant.classList.remove('planted', 'ready');
        plant.classList.add('empty');
        plant.innerHTML = '';
        harvestedCount++;
        
        // Cộng tiền
        const randomValue = Math.floor(Math.random() * 50) + 50;
        gameState.money += randomValue;
    });
    
    // Cập nhật hiển thị tiền
    updateMoneyDisplay();
    
    if (harvestedCount > 0) {
        showMessage(`Đã thu hoạch ${harvestedCount} cây trồng!`);
    } else {
        showMessage('Không có cây nào sẵn sàng để thu hoạch.');
    }
}

/**
 * Save game state to localStorage
 */
function saveGameState() {
    try {
        localStorage.setItem('wonderFarmGameState', JSON.stringify(gameState));
    } catch (e) {
        console.error('Error saving game state:', e);
    }
}

/**
 * Show equipment detail popup
 */
function showEquipmentDetail(item, isEquipped) {
    // Tạo một popup chi tiết trang bị
    const detailPopup = document.createElement('div');
    detailPopup.className = 'equipment-detail-popup';
    
    // Tạo nội dung popup
    const header = document.createElement('div');
    header.className = 'detail-header';
    header.innerHTML = `<h3>Chi tiết trang bị</h3><button class="close-detail">×</button>`;
    
    const content = document.createElement('div');
    content.className = 'detail-content';
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'detail-image-container';
    
    let imageElement;
    if (item.image.endsWith('.png')) {
        imageElement = document.createElement('img');
        imageElement.src = `img/icon/${item.image}`;
        imageElement.alt = item.name;
        imageElement.className = 'detail-image';
    } else {
        imageElement = document.createElement('div');
        imageElement.textContent = item.image;
        imageElement.style.fontSize = '48px';
        imageElement.className = 'detail-image';
    }
    
    const infoContainer = document.createElement('div');
    infoContainer.className = 'detail-info-container';
    
    const name = document.createElement('h4');
    name.textContent = item.name;
    
    const type = document.createElement('div');
    type.className = 'detail-type';
    type.textContent = `Loại: ${EQUIPMENT_GROUP_NAMES[item.type]}`;
    
    const description = document.createElement('p');
    description.className = 'detail-description';
    description.textContent = item.description;
    
    const effects = document.createElement('div');
    effects.className = 'detail-effects';
    effects.innerHTML = '<h5>Hiệu ứng:</h5>';
    
    if (item.effects) {
        const effectList = document.createElement('ul');
        
        const effectDescriptions = {
            harvest_bonus: 'Tăng thu hoạch',
            growth_time: 'Giảm thời gian trồng cây',
            seed_discount: 'Giảm giá hạt giống',
            harvest_time: 'Giảm thời gian thu hoạch'
        };
        
        for (const [effect, value] of Object.entries(item.effects)) {
            const effectItem = document.createElement('li');
            effectItem.textContent = `${effectDescriptions[effect]}: +${value}%`;
            effectList.appendChild(effectItem);
        }
        
        effects.appendChild(effectList);
    }
    
    const actions = document.createElement('div');
    actions.className = 'detail-actions';
    
    let actionButton;
    if (isEquipped) {
        // Nếu đây là trang bị đã mua, hiển thị nút bán
        const sellPrice = Math.floor(item.price * 0.3); // 30% giá mua
        
        actionButton = document.createElement('button');
        actionButton.className = 'sell-button';
        actionButton.innerHTML = `Bán <span class="coin-icon">🪙</span> ${sellPrice}`;
        actionButton.onclick = () => {
            sellEquipment(item);
            detailPopup.remove();
        };
    } else {
        // Nếu là trang bị chưa mua, hiển thị nút mua
        actionButton = document.createElement('button');
        actionButton.className = 'buy-button';
        actionButton.innerHTML = `Mua <span class="coin-icon">🪙</span> ${item.price}`;
        
        if (gameState.money < item.price) {
            actionButton.disabled = true;
            actionButton.title = 'Không đủ tiền';
        } else {
            actionButton.onclick = () => {
                buyEquipment(item);
                detailPopup.remove();
            };
        }
    }
    
    actions.appendChild(actionButton);
    
    // Ghép các phần lại với nhau
    imageContainer.appendChild(imageElement);
    
    infoContainer.appendChild(name);
    infoContainer.appendChild(type);
    infoContainer.appendChild(description);
    infoContainer.appendChild(effects);
    
    content.appendChild(imageContainer);
    content.appendChild(infoContainer);
    content.appendChild(actions);
    
    detailPopup.appendChild(header);
    detailPopup.appendChild(content);
    
    // Thêm popup vào DOM
    document.body.appendChild(detailPopup);
    
    // Thêm event listener cho nút đóng
    const closeButton = detailPopup.querySelector('.close-detail');
    closeButton.addEventListener('click', () => {
        detailPopup.remove();
    });
}

/**
 * Sell equipment item
 */
function sellEquipment(item) {
    // Tính giá bán (30% giá mua)
    const sellPrice = Math.floor(item.price * 0.3);
    
    // Cộng tiền cho người chơi
    gameState.money += sellPrice;
    updateMoneyDisplay();
    
    // Xóa trang bị khỏi túi đồ
    const itemIndex = gameState.inventory.findIndex(invItem => invItem.id === item.id);
    if (itemIndex !== -1) {
        gameState.inventory.splice(itemIndex, 1);
    }
    
    // Đảm bảo trang bị không còn được trang bị trên nhân vật
    import('./characterSystem.js').then(charModule => {
        // Xác định loại trang bị 
        let equipmentType = item.type;
        
        // Xử lý đặc biệt cho các loại trang bị
        if (item.id === 'wings_black') {
            equipmentType = 'blackWings';
        } else if (item.id === 'wings_white') {
            equipmentType = 'whiteWings'; 
        } else if (item.id === 'wings_basic') {
            equipmentType = 'wings';
        } 
        // Xử lý cho các trang bị mũ mới
        else if (item.id === 'armet_hat_gold') {
            equipmentType = 'armetHat_Gold';
        } else if (item.id === 'legion_hat_gold') {
            equipmentType = 'legionHat_Gold';
        } else if (item.id === 'maximus_hat_gold') {
            equipmentType = 'maximusHat_Gold';
        } else if (item.id === 'pirate_hat_blue') {
            equipmentType = 'pirateHat_Blue';
        }
        // Xử lý cho găng tay mới
        else if (item.id === 'gloves_black') {
            equipmentType = 'gloves_Black';
        }
        // Xử lý cho giày mới
        else if (item.id === 'sandals') {
            equipmentType = 'sandals';
        }
        // Xử lý cho quần áo mới
        else if (item.id === 'legion_armor_gold') {
            equipmentType = 'legionArmor_Gold';
        } else if (item.id === 'maximus_armor_gold') {
            equipmentType = 'maximusArmor_Gold';
        } else if (item.id === 'stretchy_clothes_black') {
            equipmentType = 'stretchyClothes_Black';
        }
        
        // Xóa trang bị khỏi inventory của nhân vật
        const indexInCharInventory = charModule.characterState.inventory.indexOf(equipmentType);
        if (indexInCharInventory !== -1) {
            charModule.characterState.inventory.splice(indexInCharInventory, 1);
        }
        
        // Nếu trang bị đang được mặc, gỡ nó ra
        if (charModule.characterState[equipmentType]) {
            // Xử lý riêng cho cánh vì cần cập nhật equippedWingType
            if (equipmentType === 'wings' || equipmentType === 'blackWings' || equipmentType === 'whiteWings') {
                // Kiểm tra xem đúng loại cánh này đang được trang bị không
                if (charModule.characterState.wings && 
                    ((equipmentType === 'wings' && charModule.characterState.equippedWingType === 'wings') ||
                     (equipmentType === 'blackWings' && charModule.characterState.equippedWingType === 'blackWings') ||
                     (equipmentType === 'whiteWings' && charModule.characterState.equippedWingType === 'whiteWings'))) {
                    
                    charModule.updateCharacterState({ wings: false });
                }
            } else {
                // Các trang bị khác
                const updateObj = {};
                updateObj[equipmentType] = false;
                charModule.updateCharacterState(updateObj);
            }
        }
        
        // Cập nhật lại hiển thị nhân vật
        charModule.updateCharacterState({});
    });
    
    // Lưu game state
    saveGameState();
    
    // Phát âm thanh và hiển thị thông báo
    playSound('coin');
    showMessage(`Đã bán ${item.name} với giá ${sellPrice} xu!`);
    
    // Cập nhật lại shop để hiển thị trang bị mới có thể mua lại
    renderShopItems();
}

/**
 * Get equipment item by ID for use in other modules
 * @param {string} equipmentId - ID or type of the equipment
 * @returns {Object|null} - The equipment item object or null if not found
 */
export function getEquipmentItemById(equipmentId) {
    // First try to map characterSystem equipment IDs to shop equipment IDs
    let shopEquipmentId = equipmentId;
    
    // Map from characterSystem.js ID format to shopSystem.js ID format
    if (equipmentId === 'blackWings') shopEquipmentId = 'wings_black';
    else if (equipmentId === 'whiteWings') shopEquipmentId = 'wings_white';
    else if (equipmentId === 'wings') shopEquipmentId = 'wings_basic';
    else if (equipmentId === 'hat') shopEquipmentId = 'hat_basic';
    else if (equipmentId === 'armetHat_Gold') shopEquipmentId = 'armet_hat_gold';
    else if (equipmentId === 'legionHat_Gold') shopEquipmentId = 'legion_hat_gold';
    else if (equipmentId === 'maximusHat_Gold') shopEquipmentId = 'maximus_hat_gold';
    else if (equipmentId === 'pirateHat_Blue') shopEquipmentId = 'pirate_hat_blue';
    else if (equipmentId === 'gloves') shopEquipmentId = 'gloves_basic';
    else if (equipmentId === 'gloves_Black') shopEquipmentId = 'gloves_black';
    else if (equipmentId === 'boots') shopEquipmentId = 'boots_basic';
    else if (equipmentId === 'sandals') shopEquipmentId = 'sandals';
    else if (equipmentId === 'aprons') shopEquipmentId = 'aprons_basic';
    else if (equipmentId === 'legionArmor_Gold') shopEquipmentId = 'legion_armor_gold';
    else if (equipmentId === 'maximusArmor_Gold') shopEquipmentId = 'maximus_armor_gold';
    else if (equipmentId === 'stretchyClothes_Black') shopEquipmentId = 'stretchy_clothes_black';
    
    // If given a characterSystem ID, search for equivalent shopSystem ID
    for (const item of shopEquipmentItems) {
        if (item.id === shopEquipmentId) {
            return item;
        }
    }
    
    // If not found, it might be directly a shop ID
    for (const item of shopEquipmentItems) {
        if (item.id === equipmentId) {
            return item;
        }
    }
    
    console.warn(`Equipment item not found with ID: ${equipmentId}`);
    return null;
}

// Make sellEquipment available for other modules
export { sellEquipment };

// Khởi tạo shop khi module được nạp
document.addEventListener('DOMContentLoaded', initShop);