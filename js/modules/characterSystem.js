// Character system module - implements character customization & equipment bonuses
import { gameState } from './gameState.js';
import { updateMoneyDisplay } from './uiSystem.js';
import { config } from './config.js';

// Character state management
export const characterState = {
    // Equipment state: what items are equipped
    aprons: false,
    hat: false, 
    gloves: false,
    wings: false,
    effect: false,
    boots: false,
    
    // Các trang bị mũ mới
    armetHat_Gold: false,
    legionHat_Gold: false,
    maximusHat_Gold: false,
    pirateHat_Blue: false,
    
    // Trang bị găng tay mới
    gloves_Black: false,
    
    // Trang bị giày mới
    sandals: false,
    
    // Trang bị quần áo mới
    legionArmor_Gold: false,
    maximusArmor_Gold: false,
    stretchyClothes_Black: false,
    
    // Equipment stats/bonuses
    equipmentBonuses: {
        growthTimeReduction: 0,
        harvestValueBonus: 0,
        seedPriceDiscount: 0,
        harvestTimeReduction: 0
    },
    
    // Equipment definitions
    equipment: {
        aprons: {
            name: "Tạp dề",
            type: "aprons",
            description: "Tạp dề bảo vệ giúp tăng sản lượng thu hoạch",
            effects: {
                harvestValueBonus: 10
            },
            image: "Aprons.png"
        },
        legionArmor_Gold: {
            name: "Áo giáp chiến binh",
            type: "aprons",
            description: "Áo giáp chiến binh vàng giúp bạn trở thành người nông dân chiến binh",
            effects: {
                harvestValueBonus: 20, 
                harvestTimeReduction: 15
            },
            image: "LegionArmor_Gold.png"
        },
        maximusArmor_Gold: {
            name: "Áo giáp hoàng đế",
            type: "aprons",
            description: "Áo giáp của hoàng đế, đem lại sự tôn quý trong công việc làm vườn",
            effects: {
                harvestValueBonus: 25, 
                growthTimeReduction: 15, 
                seedPriceDiscount: 10
            },
            image: "MaximusArmor_Gold.png"
        },
        stretchyClothes_Black: {
            name: "Đồ đen co giãn",
            type: "aprons",
            description: "Bộ đồ đen co giãn giúp bạn dễ dàng di chuyển khi làm việc",
            effects: {
                harvestTimeReduction: 25, 
                growthTimeReduction: 10
            },
            image: "StretchyClothes_Black.png"
        },
        hat: {
            name: "Mũ làm vườn",
            type: "hat",
            description: "Mũ chống nắng giúp cây phát triển nhanh hơn",
            effects: {
                growthTimeReduction: 15
            },
            image: "Hat.png"
        },
        armetHat_Gold: {
            name: "Mũ giáp vàng",
            type: "hat",
            description: "Mũ giáp làm bằng vàng, giúp tăng hiệu suất trồng trọt",
            effects: {
                growthTimeReduction: 18,
                harvestValueBonus: 8
            },
            image: "ArmetHat_Gold.png"
        },
        legionHat_Gold: {
            name: "Mũ chiến binh",
            type: "hat",
            description: "Mũ chiến binh bằng vàng, tạo cho bạn cảm giác mạnh mẽ khi trồng trọt",
            effects: {
                growthTimeReduction: 20,
                harvestTimeReduction: 10
            },
            image: "LegionHat_Gold.png"
        },
        maximusHat_Gold: {
            name: "Mũ hoàng đế",
            type: "hat",
            description: "Mũ hoàng đế làm từ vàng nguyên chất, đem lại quyền năng trồng trọt vô hạn",
            effects: {
                growthTimeReduction: 25,
                harvestValueBonus: 15,
                seedPriceDiscount: 10
            },
            image: "MaximusHat_Gold.png"
        },
        pirateHat_Blue: {
            name: "Mũ hải tặc",
            type: "hat",
            description: "Mũ hải tặc mang lại sự tự do và tinh thần phiêu lưu trong làm vườn",
            effects: {
                harvestTimeReduction: 20,
                seedPriceDiscount: 15
            },
            image: "PirateHat_Blue.png"
        },
        gloves: {
            name: "Găng tay làm vườn",
            type: "gloves",
            description: "Găng tay bảo vệ giúp thu hoạch nhanh hơn",
            effects: {
                harvestTimeReduction: 20
            },
            image: "Gloves.png"
        },
        gloves_Black: {
            name: "Găng tay đen",
            type: "gloves",
            description: "Găng tay đen cao cấp giúp thu hoạch và trồng trọt hiệu quả",
            effects: {
                harvestTimeReduction: 30,
                growthTimeReduction: 10
            },
            image: "Gloves_Black.png"
        },
        wings: {
            name: "Cánh dơi",
            type: "wings",
            subtype: "wings",
            description: "Cánh dơi thần kỳ giúp giảm thời gian trồng cây",
            effects: {
                growthTimeReduction: 10,
                harvestTimeReduction: 5
            },
            image: "Wings.png"
        },
        blackWings: {
            name: "Cánh rồng",
            type: "wings",
            subtype: "blackWings",
            description: "Cánh rồng huyền thoại mang lại sức mạnh của loài rồng",
            effects: {
                growthTimeReduction: 25,
                harvestTimeReduction: 20,
                harvestValueBonus: 20,
                seedPriceDiscount: 15
            },
            image: "BlackWings.png"
        },
        whiteWings: {
            name: "Cánh thiên thần",
            type: "wings",
            subtype: "whiteWings",
            description: "Cánh thiên thần mang lại nhiều lợi ích cho nông dân",
            effects: {
                growthTimeReduction: 15,
                harvestTimeReduction: 10,
                harvestValueBonus: 10
            },
            image: "WhiteWings.png"
        },
        boots: {
            name: "Giày làm vườn",
            type: "boots",
            description: "Giày đặc biệt giúp tiết kiệm chi phí mua hạt giống",
            effects: {
                seedPriceDiscount: 15
            },
            image: "Boots.png"
        },
        sandals: {
            name: "Giày xăng đan",
            type: "boots",
            description: "Giày xăng đan thoáng mát giúp làm việc hiệu quả hơn",
            effects: {
                seedPriceDiscount: 20,
                harvestTimeReduction: 15
            },
            image: "Sandals.png"
        }
    },
    
    // Inventory - all items player has (khởi đầu là rỗng, người chơi cần mua từ shop)
    inventory: [],
    
    // Keep track of which subtype of wing is equipped
    equippedWingType: null
};

// Phaser scene for character rendering
export class CharacterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterScene' });
    }

    preload() {
        console.log("Character Scene preload started");
        
        // Thử load direct từ URL tuyệt đối để đảm bảo file được tìm thấy
        const baseUrl = window.location.origin;
        const characterPath = `${baseUrl}/img/Character/Character_base.png`;
        this.load.image('character_base', characterPath);
        
        console.log("Loading character from:", characterPath);
        
        // Hiển thị thông báo lỗi khi không tải được file
        this.load.on('loaderror', (fileObj) => {
            console.error('Load error for:', fileObj.key, fileObj.url);
        });
        
        // Thông báo khi tải thành công
        this.load.on('filecomplete', (key) => {
            console.log('Successfully loaded:', key);
        });
        
        // Load all equipment items with absolute URLs
        Object.keys(characterState.equipment).forEach(key => {
            const item = characterState.equipment[key];
            const equipPath = `${baseUrl}/img/Character/${item.image}`;
            this.load.image(item.type, equipPath);
            console.log("Loading equipment from:", equipPath);
        });
        
        console.log("Character Scene preload completed");
    }

    create() {
        console.log("Character Scene create started");
        
        // Set bright background color for easier debugging
        this.cameras.main.setBackgroundColor('#2c3e50');
        
        // Create a debug text to confirm scene is working
        this.add.text(10, 10, "Character Scene Active", {
            font: "12px Arial",
            fill: "#ffffff"
        });
        
        // Draw placeholder rectangle to ensure rendering is working
        const graphics = this.add.graphics();
        graphics.fillStyle(0xff0000, 1);  // Red color
        graphics.fillRect(60, 60, 72, 72); // Draw at center
        
        // Create sprite for character base with error handling
        try {
            this.characterBase = this.add.sprite(96, 96, 'character_base');
            console.log("Character base added successfully");
            
            // Check if texture exists and has a valid frame
            if (this.characterBase.texture.key === '__MISSING') {
                console.error("Character texture is missing!");
                // Draw fallback
                const g = this.add.graphics();
                g.fillStyle(0x00ff00, 1);
                g.fillRect(76, 76, 40, 40);
            }
        } catch (error) {
            console.error("Error creating character sprite:", error);
        }
        
        // Create equipment sprites
        this.equipmentSprites = {};
        
        try {
            // Create sprites in the correct layering order
            this.createEquipmentSprite('wings');
            this.createEquipmentSprite('aprons');
            this.createEquipmentSprite('boots');
            this.createEquipmentSprite('gloves');
            this.createEquipmentSprite('hat');
            
            // Update equipment visibility
            this.updateEquipmentVisibility();
        } catch (error) {
            console.error("Error creating equipment sprites:", error);
        }
        
        console.log("Character Scene create completed");
    }
    
    createEquipmentSprite(type) {
        try {
            const sprite = this.add.sprite(96, 96, type);
            sprite.visible = false;
            this.equipmentSprites[type] = sprite;
            console.log(`Created equipment sprite: ${type}`);
        } catch (error) {
            console.error(`Error creating ${type} sprite:`, error);
        }
    }
    
    updateEquipmentVisibility() {
        console.log("Updating equipment visibility:", characterState);
        
        // Update each equipment sprite visibility based on equipped state
        Object.keys(this.equipmentSprites).forEach(type => {
            const isEquipped = characterState[type];
            this.equipmentSprites[type].visible = isEquipped;
            console.log(`Equipment ${type} visibility set to: ${isEquipped}`);
        });
        
        // Update wing subtype visibility
        if (characterState.equippedWingType) {
            this.equipmentSprites.wings.setTexture(characterState.equippedWingType);
            this.equipmentSprites.wings.visible = true;
        } else {
            this.equipmentSprites.wings.visible = false;
        }
    }
}

// Update character state and refresh bonuses
export function updateCharacterState(newState) {
    // Xử lý nhóm cánh (wings)
    if ('wings' in newState) {
        // Đây là logic khi cố gắng trang bị hoặc tháo cánh
        if (newState.wings === false) {
            // Tháo cánh - Set equippedWingType về null và wings về false
            // Lưu lại loại cánh đang trang bị trước khi tháo
            const prevEquippedWingType = characterState.equippedWingType;
            
            // Đặt các thuộc tính về cánh thành false
            characterState.equippedWingType = null;
            characterState.wings = false;
            
            // Tìm và đánh dấu cánh đang được trang bị là đã tháo
            // KHÔNG xóa khỏi inventory
            if (prevEquippedWingType) {
                const equippedKey = Object.keys(characterState.equipment).find(key => {
                    const item = characterState.equipment[key];
                    return item.type === 'wings' && item.subtype === prevEquippedWingType;
                });
                
                if (equippedKey) {
                    // Đặt trạng thái trang bị thành false nhưng vẫn giữ trong inventory
                    characterState[equippedKey] = false;
                    
                    // Đảm bảo cánh vẫn có trong inventory
                    if (!characterState.inventory.includes(equippedKey)) {
                        characterState.inventory.push(equippedKey);
                        console.log(`Added ${equippedKey} back to inventory after unequipping`);
                    }
                }
            }
        } else if (typeof newState.wings === 'string') {
            // Trang bị một loại cánh mới - newState.wings chứa tên của loại cánh cần trang bị
            const wingType = newState.wings;
            const newWingItem = characterState.equipment[wingType];
            
            // Chỉ xử lý nếu đây là một loại cánh hợp lệ
            if (newWingItem && newWingItem.type === 'wings') {
                console.log(`Đang trang bị cánh: ${wingType}, subtype: ${newWingItem.subtype}`);
                
                // Nếu đã trang bị một loại cánh khác, tháo nó ra trước
                if (characterState.equippedWingType) {
                    // Tìm và tháo cánh đang mặc, không tháo tất cả cánh
                    const currentWingKey = Object.keys(characterState.equipment).find(key => {
                        const item = characterState.equipment[key];
                        return item.type === 'wings' && item.subtype === characterState.equippedWingType;
                    });
                    
                    if (currentWingKey) {
                        // Đặt trạng thái trang bị thành false
                        characterState[currentWingKey] = false;
                        
                        // Đảm bảo cánh cũ vẫn có trong inventory
                        if (!characterState.inventory.includes(currentWingKey)) {
                            characterState.inventory.push(currentWingKey);
                            console.log(`Added ${currentWingKey} back to inventory after switching wings`);
                        }
                    }
                }
                
                // Cập nhật loại cánh đang trang bị
                characterState.equippedWingType = newWingItem.subtype || 'wings';
                characterState.wings = true;
                characterState[wingType] = true;
                console.log(`Đã trang bị cánh ${wingType} với subtype ${characterState.equippedWingType}`);
                
                // Đảm bảo tất cả các loại cánh khác đều được đánh dấu là không trang bị
                Object.keys(characterState.equipment).forEach(key => {
                    const item = characterState.equipment[key];
                    if (item.type === 'wings' && key !== wingType) {
                        characterState[key] = false;
                    }
                });
            }
        } else if (newState.wings === true) {
            // Trường hợp wings: true nhưng không chỉ định loại cánh cụ thể
            console.log('Cố gắng trang bị cánh nhưng không chỉ định loại cánh cụ thể');
            // Không làm gì cả, cần chỉ định loại cánh cụ thể
        }
    }
    
    // Đảm bảo equippedWingType được cập nhật đúng khi trang bị cánh đặc biệt
    if (newState.hasOwnProperty('blackWings') && newState.blackWings) {
        characterState.wings = true;
        characterState.equippedWingType = 'blackWings';
        console.log('Equipped black dragon wings');
    }
    
    if (newState.hasOwnProperty('whiteWings') && newState.whiteWings) {
        characterState.wings = true;
        characterState.equippedWingType = 'whiteWings';
        console.log('Equipped white angel wings');
    }

    // Xử lý nhóm mũ (hat)
    if (newState.hasOwnProperty('hat') && newState.hat) {
        // Tắt tất cả các mũ khác
        characterState.armetHat_Gold = false;
        characterState.legionHat_Gold = false;
        characterState.maximusHat_Gold = false;
        characterState.pirateHat_Blue = false;
        console.log('Equipped basic hat, unequipped all other hats');
    } else if (newState.hasOwnProperty('hat') && newState.hat === false) {
        // Nếu tháo mũ cơ bản, đảm bảo nó được thêm vào inventory nếu không có
        if (!characterState.inventory.includes('hat')) {
            characterState.inventory.push('hat');
            console.log('Added hat back to inventory after unequipping');
        }
    }

    // Xử lý các loại mũ mới
    const hatTypes = ['armetHat_Gold', 'legionHat_Gold', 'maximusHat_Gold', 'pirateHat_Blue'];
    hatTypes.forEach(hatType => {
        if (newState.hasOwnProperty(hatType)) {
            if (newState[hatType]) {
                // Nếu mặc mũ mới, tắt tất cả các mũ khác
                characterState.hat = false;
                hatTypes.forEach(otherHat => {
                    if (otherHat !== hatType) {
                        characterState[otherHat] = false;
                    }
                });
                console.log(`Equipped ${hatType}, unequipped all other hats`);
            } else if (newState[hatType] === false) {
                // Nếu tháo mũ, đảm bảo nó được thêm vào inventory nếu không có
                if (!characterState.inventory.includes(hatType)) {
                    characterState.inventory.push(hatType);
                    console.log(`Added ${hatType} back to inventory after unequipping`);
                }
            }
        }
    });

    // Xử lý nhóm găng tay (gloves)
    if (newState.hasOwnProperty('gloves') && newState.gloves) {
        // Tắt tất cả các găng tay khác
        characterState.gloves_Black = false;
        console.log('Equipped basic gloves, unequipped all other gloves');
    } else if (newState.hasOwnProperty('gloves') && newState.gloves === false) {
        // Nếu tháo găng tay cơ bản, đảm bảo nó được thêm vào inventory nếu không có
        if (!characterState.inventory.includes('gloves')) {
            characterState.inventory.push('gloves');
            console.log('Added gloves back to inventory after unequipping');
        }
    }

    // Xử lý găng tay mới
    if (newState.hasOwnProperty('gloves_Black')) {
        if (newState.gloves_Black) {
            // Nếu mặc găng tay mới, tắt găng tay cơ bản
            characterState.gloves = false;
            console.log('Equipped gloves_Black, unequipped basic gloves');
        } else if (newState.gloves_Black === false) {
            // Nếu tháo găng tay mới, đảm bảo nó được thêm vào inventory nếu không có
            if (!characterState.inventory.includes('gloves_Black')) {
                characterState.inventory.push('gloves_Black');
                console.log('Added gloves_Black back to inventory after unequipping');
            }
        }
    }

    // Xử lý nhóm giày (boots)
    if (newState.hasOwnProperty('boots') && newState.boots) {
        // Tắt tất cả các giày khác
        characterState.sandals = false;
        console.log('Equipped basic boots, unequipped all other boots');
    } else if (newState.hasOwnProperty('boots') && newState.boots === false) {
        // Nếu tháo giày cơ bản, đảm bảo nó được thêm vào inventory nếu không có
        if (!characterState.inventory.includes('boots')) {
            characterState.inventory.push('boots');
            console.log('Added boots back to inventory after unequipping');
        }
    }

    // Xử lý giày mới
    if (newState.hasOwnProperty('sandals')) {
        if (newState.sandals) {
            // Nếu mặc giày mới, tắt giày cơ bản
            characterState.boots = false;
            console.log('Equipped sandals, unequipped basic boots');
        } else if (newState.sandals === false) {
            // Nếu tháo giày mới, đảm bảo nó được thêm vào inventory nếu không có
            if (!characterState.inventory.includes('sandals')) {
                characterState.inventory.push('sandals');
                console.log('Added sandals back to inventory after unequipping');
            }
        }
    }

    // Xử lý nhóm quần áo (aprons)
    if (newState.hasOwnProperty('aprons') && newState.aprons) {
        // Tắt tất cả các quần áo khác
        characterState.legionArmor_Gold = false;
        characterState.maximusArmor_Gold = false;
        characterState.stretchyClothes_Black = false;
        console.log('Equipped basic aprons, unequipped all other armors');
    } else if (newState.hasOwnProperty('aprons') && newState.aprons === false) {
        // Nếu tháo quần áo cơ bản, đảm bảo nó được thêm vào inventory nếu không có
        if (!characterState.inventory.includes('aprons')) {
            characterState.inventory.push('aprons');
            console.log('Added aprons back to inventory after unequipping');
        }
    }

    // Xử lý các loại quần áo mới
    const armorTypes = ['legionArmor_Gold', 'maximusArmor_Gold', 'stretchyClothes_Black'];
    armorTypes.forEach(armorType => {
        if (newState.hasOwnProperty(armorType)) {
            if (newState[armorType]) {
                // Nếu mặc quần áo mới, tắt tất cả các quần áo khác
                characterState.aprons = false;
                armorTypes.forEach(otherArmor => {
                    if (otherArmor !== armorType) {
                        characterState[otherArmor] = false;
                    }
                });
                console.log(`Equipped ${armorType}, unequipped all other armors`);
            } else if (newState[armorType] === false) {
                // Nếu tháo quần áo, đảm bảo nó được thêm vào inventory nếu không có
                if (!characterState.inventory.includes(armorType)) {
                    characterState.inventory.push(armorType);
                    console.log(`Added ${armorType} back to inventory after unequipping`);
                }
            }
        }
    });

    // Cập nhật các trạng thái trang bị
    for (const item in newState) {
        if (item !== 'wings' && typeof characterState[item] !== 'undefined') {
            characterState[item] = newState[item];
        }
    }
    
    // Recalculate bonuses
    calculateEquipmentBonuses();
    
    // Update direct DOM display of character
    updateDirectCharacterDisplay();
    
    // Update the animated character preview
    updateCharacterPreview();
    
    // Update the farm character display
    updateFarmCharacterDisplay();
    
    // Update stats display
    updateStatsDisplay();
    
    // Update equipment slots display
    refreshEquipmentSlots();
    
    // Update inventory display
    refreshInventoryDisplay();
}

// Calculate total bonuses from equipped items
function calculateEquipmentBonuses() {
    // Reset bonuses
    const bonuses = characterState.equipmentBonuses;
    bonuses.growthTimeReduction = 0;
    bonuses.harvestValueBonus = 0;
    bonuses.seedPriceDiscount = 0;
    bonuses.harvestTimeReduction = 0;
    
    // Add bonus from each equipped item
    Object.keys(characterState.equipment).forEach(key => {
        if (characterState[key]) {
            const effects = characterState.equipment[key].effects;
            
            // Add each effect from this equipment
            Object.keys(effects).forEach(effect => {
                bonuses[effect] += effects[effect];
            });
        }
    });
}

// Update avatar display in the header
function updateAvatarDisplay() {
    const avatarContainer = document.querySelector('#character-avatar');
    if (!avatarContainer) return;
    
    // Xóa nội dung hiện tại
    avatarContainer.innerHTML = '';
    
    // Tạo một div mới để hiển thị nhân vật với frame thứ 2
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'character-avatar character-base-sprite equipment-frame-2';
    avatarContainer.appendChild(avatarDiv);
    
    // Nếu có trang bị nào được mặc, sau này có thể thêm các lớp khác lên trên
    // để hiển thị nhân vật với đầy đủ trang bị
}

// Update stats display in character panel
function updateStatsDisplay() {
    const bonuses = characterState.equipmentBonuses;
    
    // Update stat displays
    document.getElementById('stat-growth-time').textContent = `${bonuses.growthTimeReduction}%`;
    document.getElementById('stat-harvest-bonus').textContent = `${bonuses.harvestValueBonus}%`;
    document.getElementById('stat-seed-discount').textContent = `${bonuses.seedPriceDiscount}%`;
    document.getElementById('stat-harvest-time').textContent = `${bonuses.harvestTimeReduction}%`;
}

// Initialize character system
export function initCharacter() {
    // Setup DOM event listeners
    setupCharacterUI();
    
    // Initial calculation of bonuses
    calculateEquipmentBonuses();
    
    // Update stats
    updateStatsDisplay();
    
    // Create character Phaser scene
    initCharacterScene();
    
    // Initialize farm character display
    updateFarmCharacterDisplay();
    
    // Render initial character frames
    renderCharacterFrames();
}

// Set up character UI and event listeners
function setupCharacterUI() {
    const characterPanel = document.getElementById('character-panel');
    const characterAvatar = document.getElementById('character-avatar');
    const closeCharacter = document.getElementById('close-character');
    
    // Character panel open/close
    characterAvatar.addEventListener('click', () => {
        characterPanel.classList.add('show');
        
        // Synchronize inventory with gameState before refreshing
        syncInventoryWithGameState();
        
        // Refresh equipment slots display
        refreshEquipmentSlots();
        
        // Refresh inventory display
        refreshInventoryDisplay();
        
        // Update direct DOM display of character
        updateDirectCharacterDisplay();
        
        // Re-initialize the character scene when panel is opened
        initCharacterScene();
    });
    
    closeCharacter.addEventListener('click', () => {
        characterPanel.classList.remove('show');
    });
    
    // Setup equipment slots click handlers
    const equipmentSlots = document.querySelectorAll('.equipment-slot');
    equipmentSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const type = slot.getAttribute('data-type');
            
            // If item is equipped, show detail with unequip option
            if (characterState[type]) {
                showEquipmentDetail(type, true);
            }
        });
    });
    
    // Setup equipment detail popup close
    document.getElementById('close-detail').addEventListener('click', () => {
        document.getElementById('equipment-detail').classList.remove('show');
    });
    
    // Initialize equipment slots
    refreshEquipmentSlots();
    
    // Initialize inventory display
    refreshInventoryDisplay();
}

// Export hàm initCharacterScene để có thể gọi từ bên ngoài
export function initCharacterScene() {
    // Set up the animated character display using CSS animations
    setupAnimatedCharacterPreview();
    
    // Update the display
    updateDirectCharacterDisplay();
    updateCharacterPreview();
}

// Refresh equipment slots with equipped items
function refreshEquipmentSlots() {
    const slots = document.querySelectorAll('.equipment-slot');
    
    slots.forEach(slot => {
        const type = slot.getAttribute('data-type');
        
        // Skip for effect slot (không phải trang bị thực sự)
        if (type === 'effect') return;
        
        // Kiểm tra xem đã có img hoặc div background chưa, nếu chưa thì tạo mới
        let equipmentDisplay = slot.querySelector('.equipment-image');
        if (!equipmentDisplay) {
            equipmentDisplay = document.createElement('div');
            equipmentDisplay.className = 'equipment-image';
            slot.insertBefore(equipmentDisplay, slot.querySelector('.equipment-name'));
        }
        
        // Reset class
        slot.classList.remove('equipped');
        
        // Lưu trữ loại trang bị thực sự đang được trang bị
        let actualEquippedItem = null;
        
        // Check if this equipment type is equipped
        if (type === 'wings' && characterState.wings) {
            // Xử lý đặc biệt cho ô trang bị cánh
            if (characterState.equippedWingType) {
                equipmentDisplay.className = `equipment-image ${characterState.equippedWingType}-icon`;
                console.log(`Hiển thị cánh: ${characterState.equippedWingType}-icon`);
                equipmentDisplay.style.opacity = '1'; // Đảm bảo hiển thị rõ nét
                slot.classList.add('equipped');
                
                // Xác định loại cánh thực sự đang được trang bị
                actualEquippedItem = characterState.equippedWingType;
            } else {
                equipmentDisplay.className = `equipment-image wings-icon`;
                console.log('Hiển thị cánh thường');
                equipmentDisplay.style.opacity = '1'; 
                slot.classList.add('equipped');
                
                // Cánh thường
                actualEquippedItem = 'wings';
            }
        } else if (type === 'hat' && (characterState.hat || characterState.armetHat_Gold || characterState.legionHat_Gold || characterState.maximusHat_Gold || characterState.pirateHat_Blue)) {
            // Xử lý cho ô trang bị mũ
            let equippedHat = 'hat';
            if (characterState.armetHat_Gold) equippedHat = 'armetHat_Gold';
            else if (characterState.legionHat_Gold) equippedHat = 'legionHat_Gold';
            else if (characterState.maximusHat_Gold) equippedHat = 'maximusHat_Gold';
            else if (characterState.pirateHat_Blue) equippedHat = 'pirateHat_Blue';
            
            equipmentDisplay.className = `equipment-image ${equippedHat}-icon`;
            equipmentDisplay.style.opacity = '1';
            slot.classList.add('equipped');
            console.log(`Hiển thị mũ: ${equippedHat}-icon`);
            
            // Lưu loại mũ thực sự đang trang bị
            actualEquippedItem = equippedHat;
        } else if (type === 'gloves' && (characterState.gloves || characterState.gloves_Black)) {
            // Xử lý cho ô trang bị găng tay
            let equippedGloves = 'gloves';
            if (characterState.gloves_Black) equippedGloves = 'gloves_Black';
            
            equipmentDisplay.className = `equipment-image ${equippedGloves}-icon`;
            equipmentDisplay.style.opacity = '1';
            slot.classList.add('equipped');
            console.log(`Hiển thị găng tay: ${equippedGloves}-icon`);
            
            // Lưu loại găng tay thực sự đang trang bị
            actualEquippedItem = equippedGloves;
        } else if (type === 'boots' && (characterState.boots || characterState.sandals)) {
            // Xử lý cho ô trang bị giày
            let equippedBoots = 'boots';
            if (characterState.sandals) equippedBoots = 'sandals';
            
            equipmentDisplay.className = `equipment-image ${equippedBoots}-icon`;
            equipmentDisplay.style.opacity = '1';
            slot.classList.add('equipped');
            console.log(`Hiển thị giày: ${equippedBoots}-icon`);
            
            // Lưu loại giày thực sự đang trang bị
            actualEquippedItem = equippedBoots;
        } else if (type === 'aprons' && (characterState.aprons || characterState.legionArmor_Gold || characterState.maximusArmor_Gold || characterState.stretchyClothes_Black)) {
            // Xử lý cho ô trang bị quần áo
            let equippedAprons = 'aprons';
            if (characterState.legionArmor_Gold) equippedAprons = 'legionArmor_Gold';
            else if (characterState.maximusArmor_Gold) equippedAprons = 'maximusArmor_Gold';
            else if (characterState.stretchyClothes_Black) equippedAprons = 'stretchyClothes_Black';
            
            equipmentDisplay.className = `equipment-image ${equippedAprons}-icon`;
            equipmentDisplay.style.opacity = '1';
            slot.classList.add('equipped');
            console.log(`Hiển thị quần áo: ${equippedAprons}-icon`);
            
            // Lưu loại quần áo thực sự đang trang bị
            actualEquippedItem = equippedAprons;
        } else {
            // Trường hợp không có trang bị nào được mặc
            equipmentDisplay.className = 'equipment-image ' + type + '-icon';
            equipmentDisplay.style.opacity = '0.3'; // Show with low opacity when not equipped
            slot.classList.remove('equipped');
        }
        
        // Xoá tất cả các sự kiện click hiện tại (nếu có)
        const newSlot = slot.cloneNode(true);
        slot.parentNode.replaceChild(newSlot, slot);
        
        // Thêm lại sự kiện click nếu có trang bị được trang bị
        if (actualEquippedItem) {
            newSlot.addEventListener('click', () => {
                // Hiển thị popup chi tiết với trang bị thực sự đang được trang bị
                showEquipmentDetail(actualEquippedItem, true);
            });
        }
    });
}

// Refresh inventory display
function refreshInventoryDisplay() {
    const inventoryContainer = document.getElementById('inventory-items');
    inventoryContainer.innerHTML = '';
    
    // Add each inventory item - filter out equipped items
    characterState.inventory.forEach(itemType => {
        // Kiểm tra xem vật phẩm có đang được trang bị hay không
        let isEquipped = false;
        
        // Xử lý đặc biệt cho các loại cánh
        if (itemType === 'wings' || itemType === 'blackWings' || itemType === 'whiteWings') {
            // Vật phẩm là cánh, chỉ ẩn nếu đúng loại cánh này đang được trang bị
            isEquipped = characterState.wings && characterState.equippedWingType === itemType;
        } else {
            // Các vật phẩm khác, kiểm tra bình thường
            isEquipped = characterState[itemType];
        }
        
        // Skip if this item is equipped
        if (isEquipped) return;
        
        const item = characterState.equipment[itemType];
        
        // Create inventory item element
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.setAttribute('data-type', itemType);
        
        // Tạo div cho icon trang bị - sử dụng class để hiển thị icon
        const itemImage = document.createElement('div');
        itemImage.className = `item-image ${itemType}-icon`;
        
        // Add item name
        const itemName = document.createElement('div');
        itemName.className = 'item-name';
        itemName.textContent = item.name;
        
        // Add to DOM
        itemElement.appendChild(itemImage);
        itemElement.appendChild(itemName);
        inventoryContainer.appendChild(itemElement);
        
        // Add click handler
        itemElement.addEventListener('click', () => {
            // Khi nhấp vào vật phẩm trong túi đồ, luôn truyền isEquipped=false
            // để đảm bảo hiển thị thông tin của chính vật phẩm đó, không phải vật phẩm đang trang bị
            showEquipmentDetail(itemType, false);
        });
    });
    
    console.log('Đã cập nhật hiển thị túi đồ với các loại cánh được xử lý riêng biệt');
}

// Show equipment detail popup
function showEquipmentDetail(itemType, isEquipped) {
    const detailPopup = document.getElementById('equipment-detail');
    
    // Xử lý đặc biệt cho cánh - chỉ áp dụng khi đang xem ô trang bị (isEquipped=true)
    // và không áp dụng khi xem vật phẩm trong túi đồ (isEquipped=false)
    let actualItemType = itemType;
    if (itemType === 'wings' && characterState.equippedWingType && isEquipped) {
        // Tìm loại cánh thực sự đang được trang bị - chỉ khi đang xem ô trang bị
        const equippedWingKey = Object.keys(characterState.equipment).find(key => {
            const item = characterState.equipment[key];
            return item.type === 'wings' && item.subtype === characterState.equippedWingType;
        });
        
        if (equippedWingKey) {
            actualItemType = equippedWingKey;
            console.log(`Hiển thị chi tiết của cánh đang trang bị: ${actualItemType} thay vì wings`);
        }
    }
    
    const item = characterState.equipment[actualItemType];
    
    if (!item) return;
    
    // Update detail content
    document.getElementById('detail-title').textContent = 'Chi tiết trang bị';
    
    const detailImageContainer = document.getElementById('detail-image-container');
    detailImageContainer.innerHTML = '';
    
    const newDetailImage = document.createElement('div');
    newDetailImage.className = `detail-image ${actualItemType}-icon`;
    newDetailImage.id = 'detail-image';
    detailImageContainer.appendChild(newDetailImage);
    
    document.getElementById('detail-name').textContent = item.name;
    document.getElementById('detail-type').textContent = getEquipmentTypeName(actualItemType);
    document.getElementById('detail-description').textContent = item.description;
    
    // Update effects list
    const effectsContainer = document.getElementById('detail-effects');
    effectsContainer.innerHTML = '';
    
    // Add each effect
    Object.keys(item.effects).forEach(effectKey => {
        const effectValue = item.effects[effectKey];
        
        const effectItem = document.createElement('div');
        effectItem.className = 'effect-item';
        effectItem.textContent = formatEffectText(effectKey, effectValue);
        
        effectsContainer.appendChild(effectItem);
    });
    
    // Update actions
    const actionsContainer = document.getElementById('detail-actions');
    actionsContainer.innerHTML = '';
    
    // Tìm kiếm thông tin trang bị trong shopEquipmentItems để lấy giá
    import('./shopSystem.js').then(shopModule => {
        const shopItem = shopModule.getEquipmentItemById(actualItemType);
        const price = shopItem ? shopItem.price : 100;
        
        // Kiểm tra xem trang bị có đang được trang bị hay không
        let itemIsEquipped = false;
        
        // Xử lý đặc biệt cho các loại cánh
        if (item.type === 'wings') {
            if (actualItemType === 'wings' && characterState.wings && characterState.equippedWingType === 'wings') {
                itemIsEquipped = true;
            } else if (actualItemType === 'blackWings' && characterState.wings && characterState.equippedWingType === 'blackWings') {
                itemIsEquipped = true;
            } else if (actualItemType === 'whiteWings' && characterState.wings && characterState.equippedWingType === 'whiteWings') {
                itemIsEquipped = true;
            }
        } else {
            // Cho các loại trang bị khác
            itemIsEquipped = characterState[actualItemType] === true;
        }
        
        if (isEquipped) {
            // Đang xem trang bị trong ô trang bị (đang mặc)
            const unequipButton = document.createElement('button');
            unequipButton.className = 'unequip-btn';
            unequipButton.textContent = 'Tháo trang bị';
            unequipButton.addEventListener('click', () => {
                if (item.type === 'wings') {
                    updateCharacterState({ wings: false });
                } else {
                    updateCharacterState({ [itemType]: false });
                }
                detailPopup.classList.remove('show');
            });
            
            // Chỉ hiển thị nút bán khi trang bị không được mặc
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-group';
            buttonContainer.appendChild(unequipButton);
            
            actionsContainer.appendChild(buttonContainer);
        } else {
            // Đang xem trang bị trong túi đồ (chưa mặc)
            
            // Tạo container cho các nút
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-group';
            
            // Nút trang bị
            const equipButton = document.createElement('button');
            equipButton.className = 'equip-btn';
            equipButton.textContent = 'Trang bị';
            equipButton.addEventListener('click', () => {
                if (item.type === 'wings') {
                    // Xử lý đặc biệt cho các loại cánh
                    if (item.subtype === 'blackWings' || item.subtype === 'whiteWings') {
                        // Đối với cánh đặc biệt, cập nhật trực tiếp subtype
                        updateCharacterState({ 
                            [item.subtype]: true
                        });
                        console.log(`Trang bị cánh đặc biệt: ${item.subtype}`);
                    } else {
                        // Cánh thường - cập nhật trực tiếp wings
                        // Sử dụng actualItemType thay vì itemType để đảm bảo trang bị đúng loại cánh
                        updateCharacterState({ 
                            wings: actualItemType
                        });
                        console.log(`Trang bị cánh thường: ${actualItemType}`);
                    }
                } else {
                    updateCharacterState({ [itemType]: true });
                }
                detailPopup.classList.remove('show');
            });
            
            // Nút bán trang bị
            const sellButton = document.createElement('button');
            sellButton.className = 'sell-btn';
            
            // Giá bán là 30% giá mua
            const sellPrice = Math.floor(price * 0.3);
            
            // Tạo nội dung nút bán với icon xu
            const coinIcon = document.createElement('span');
            coinIcon.className = 'coin-icon';
            coinIcon.textContent = '🪙';
            
            const sellText = document.createElement('span');
            sellText.textContent = `Bán ${sellPrice}`;
            
            // Thêm icon và text vào nút
            sellButton.appendChild(coinIcon);
            sellButton.appendChild(sellText);
            
            sellButton.addEventListener('click', () => {
                // Gọi hàm bán trang bị
                shopModule.sellEquipment(shopItem);
                detailPopup.classList.remove('show');
            });
            
            // Thêm các nút vào container
            buttonContainer.appendChild(equipButton);
            buttonContainer.appendChild(sellButton);
            actionsContainer.appendChild(buttonContainer);
        }
    }).catch(err => {
        console.error("Error importing shop system:", err);
        
        // Fallback nếu không thể import shopSystem
        if (isEquipped) {
            // Show unequip button without sell button
            const actionButton = document.createElement('button');
            actionButton.className = 'unequip-btn';
            actionButton.textContent = 'Tháo trang bị';
            actionButton.addEventListener('click', () => {
                if (item.type === 'wings') {
                    updateCharacterState({ wings: false });
                } else {
                    updateCharacterState({ [itemType]: false });
                }
                detailPopup.classList.remove('show');
            });
            actionsContainer.appendChild(actionButton);
        } else {
            // Show equip button
            const actionButton = document.createElement('button');
            actionButton.className = 'equip-btn';
            actionButton.textContent = 'Trang bị';
            actionButton.addEventListener('click', () => {
                if (item.type === 'wings') {
                    if (item.subtype === 'blackWings' || item.subtype === 'whiteWings') {
                        updateCharacterState({ [item.subtype]: true });
                    } else {
                        updateCharacterState({ wings: actualItemType });
                    }
                } else {
                    updateCharacterState({ [itemType]: true });
                }
                detailPopup.classList.remove('show');
            });
            actionsContainer.appendChild(actionButton);
        }
    });
    
    // Show the popup
    detailPopup.classList.add('show');
}

// Get formatted type name
function getEquipmentTypeName(type) {
    const typeNames = {
        'aprons': 'Quần áo',
        'hat': 'Mũ',
        'gloves': 'Găng tay',
        'wings': 'Cánh',
        'blackWings': 'Cánh rồng',
        'whiteWings': 'Cánh thiên thần',
        'boots': 'Giày'
    };
    
    return typeNames[type] || type;
}

// Format effect text
function formatEffectText(effectKey, value) {
    const effectTexts = {
        'growthTimeReduction': `Giảm ${value}% thời gian trồng cây`,
        'harvestValueBonus': `Tăng ${value}% sản lượng thu hoạch`,
        'seedPriceDiscount': `Giảm ${value}% giá hạt giống`,
        'harvestTimeReduction': `Giảm ${value}% thời gian thu hoạch`
    };
    
    return effectTexts[effectKey] || `${effectKey}: ${value}`;
}

// Apply growth time reduction bonus
export function applyGrowthTimeReduction(baseTime) {
    const reductionPercent = characterState.equipmentBonuses.growthTimeReduction;
    return baseTime * (1 - reductionPercent / 100);
}

// Apply harvest value bonus
export function applyHarvestValueBonus(baseValue) {
    const bonusPercent = characterState.equipmentBonuses.harvestValueBonus;
    return Math.floor(baseValue * (1 + bonusPercent / 100));
}

// Apply seed price discount
export function applySeedPriceDiscount(basePrice) {
    const discountPercent = characterState.equipmentBonuses.seedPriceDiscount;
    return Math.floor(basePrice * (1 - discountPercent / 100));
}

// Apply harvest time reduction
export function applyHarvestTimeReduction(baseTime) {
    const reductionPercent = characterState.equipmentBonuses.harvestTimeReduction;
    return baseTime * (1 - reductionPercent / 100);
}

// Phương thức render các frames cho character avatar
function renderCharacterFrames() {
    // Đảm bảo cập nhật nhân vật và hiển thị một lần khi trang vừa được tải
    setTimeout(() => {
        // Cập nhật hiển thị trực tiếp bằng DOM
        updateDirectCharacterDisplay();
        
        // Cập nhật nhân vật trong Phaser scene nếu đã khởi tạo
        if (window.characterScene) {
            console.log("Force updating character visibility");
            window.characterScene.updateEquipmentVisibility();
        }
    }, 500);
}

// Update direct DOM display of character and equipment
function updateDirectCharacterDisplay() {
    const directPreview = document.getElementById('direct-character-preview');
    
    if (!directPreview) return;
    
    // Đảm bảo nhân vật cơ bản luôn hiển thị và có animation
    const baseCharacter = directPreview.querySelector('.character-base-sprite');
    if (baseCharacter) {
        baseCharacter.style.display = 'block';
    }
    
    // Xử lý hiển thị cho các trang bị thông thường (hat, gloves, boots, aprons)
    // và các trang bị mới (armetHat_Gold, legionHat_Gold, maximusHat_Gold, pirateHat_Blue,
    // gloves_Black, sandals, legionArmor_Gold, maximusArmor_Gold, stretchyClothes_Black)
    
    // Ẩn tất cả các sprite trang bị trước
    const allEquipmentSprites = directPreview.querySelectorAll('[class*="-sprite"]');
    allEquipmentSprites.forEach(sprite => {
        if (!sprite.classList.contains('character-base-sprite')) {
            sprite.style.display = 'none';
        }
    });
    
    // Hiển thị các trang bị mũ
    if (characterState.hat) {
        const hatSprite = directPreview.querySelector('.hat-sprite');
        if (hatSprite) hatSprite.style.display = 'block';
    } else if (characterState.armetHat_Gold) {
        const armetHatSprite = directPreview.querySelector('.armetHat_Gold-sprite');
        if (armetHatSprite) {
            armetHatSprite.style.display = 'block';
        } else {
            createEquipmentSprite(directPreview, 'armetHat_Gold');
        }
    } else if (characterState.legionHat_Gold) {
        const legionHatSprite = directPreview.querySelector('.legionHat_Gold-sprite');
        if (legionHatSprite) {
            legionHatSprite.style.display = 'block';
        } else {
            createEquipmentSprite(directPreview, 'legionHat_Gold');
        }
    } else if (characterState.maximusHat_Gold) {
        const maximusHatSprite = directPreview.querySelector('.maximusHat_Gold-sprite');
        if (maximusHatSprite) {
            maximusHatSprite.style.display = 'block';
        } else {
            createEquipmentSprite(directPreview, 'maximusHat_Gold');
        }
    } else if (characterState.pirateHat_Blue) {
        const pirateHatSprite = directPreview.querySelector('.pirateHat_Blue-sprite');
        if (pirateHatSprite) {
            pirateHatSprite.style.display = 'block';
        } else {
            createEquipmentSprite(directPreview, 'pirateHat_Blue');
        }
    }
    
    // Hiển thị các trang bị găng tay
    if (characterState.gloves) {
        const glovesSprite = directPreview.querySelector('.gloves-sprite');
        if (glovesSprite) glovesSprite.style.display = 'block';
    } else if (characterState.gloves_Black) {
        const glovesBlackSprite = directPreview.querySelector('.gloves_Black-sprite');
        if (glovesBlackSprite) {
            glovesBlackSprite.style.display = 'block';
        } else {
            createEquipmentSprite(directPreview, 'gloves_Black');
        }
    }
    
    // Hiển thị các trang bị giày
    if (characterState.boots) {
        const bootsSprite = directPreview.querySelector('.boots-sprite');
        if (bootsSprite) bootsSprite.style.display = 'block';
    } else if (characterState.sandals) {
        const sandalsSprite = directPreview.querySelector('.sandals-sprite');
        if (sandalsSprite) {
            sandalsSprite.style.display = 'block';
        } else {
            createEquipmentSprite(directPreview, 'sandals');
        }
    }
    
    // Hiển thị các trang bị áo quần
    if (characterState.aprons) {
        const apronsSprite = directPreview.querySelector('.aprons-sprite');
        if (apronsSprite) apronsSprite.style.display = 'block';
    } else if (characterState.legionArmor_Gold) {
        const legionArmorSprite = directPreview.querySelector('.legionArmor_Gold-sprite');
        if (legionArmorSprite) {
            legionArmorSprite.style.display = 'block';
        } else {
            createEquipmentSprite(directPreview, 'legionArmor_Gold');
        }
    } else if (characterState.maximusArmor_Gold) {
        const maximusArmorSprite = directPreview.querySelector('.maximusArmor_Gold-sprite');
        if (maximusArmorSprite) {
            maximusArmorSprite.style.display = 'block';
        } else {
            createEquipmentSprite(directPreview, 'maximusArmor_Gold');
        }
    } else if (characterState.stretchyClothes_Black) {
        const stretchyClothesSprite = directPreview.querySelector('.stretchyClothes_Black-sprite');
        if (stretchyClothesSprite) {
            stretchyClothesSprite.style.display = 'block';
        } else {
            createEquipmentSprite(directPreview, 'stretchyClothes_Black');
        }
    }
    
    // Xử lý hiển thị cánh - giữ nguyên logic cũ
    const allWingSprites = directPreview.querySelectorAll('.wings-sprite, .blackWings-sprite, .whiteWings-sprite');
    allWingSprites.forEach(sprite => {
        sprite.style.display = 'none';
    });
    
    // Nếu có cánh được trang bị, chỉ hiển thị loại cánh đó
    if (characterState.wings && characterState.equippedWingType) {
        console.log(`Hiển thị cánh trong direct preview: ${characterState.equippedWingType}`);
        const wingTypeSprite = directPreview.querySelector(`.${characterState.equippedWingType}-sprite`);
        if (wingTypeSprite) {
            wingTypeSprite.style.display = 'block';
            wingTypeSprite.className = `character-sprite-sheet ${characterState.equippedWingType}-sprite character-animated`;
            console.log(`Đã hiển thị cánh ${characterState.equippedWingType} trong direct preview`);
        } else {
            // Nếu không có phần tử DOM cho loại cánh này, tạo mới
            console.log(`Không tìm thấy phần tử DOM cho cánh ${characterState.equippedWingType}, tạo mới`);
            const newWingSprite = document.createElement('div');
            newWingSprite.className = `character-sprite-sheet ${characterState.equippedWingType}-sprite character-animated`;
            newWingSprite.style.display = 'block';
            directPreview.appendChild(newWingSprite);
        }
    }
}

// Hàm hỗ trợ tạo phần tử DOM mới cho trang bị
function createEquipmentSprite(container, equipmentType) {
    const sprite = document.createElement('div');
    sprite.className = `character-sprite-sheet ${equipmentType}-sprite character-animated`;
    sprite.style.display = 'block';
    container.appendChild(sprite);
    console.log(`Đã tạo mới sprite cho ${equipmentType}`);
    return sprite;
}

// Setup animated character preview using CSS animations instead of Phaser
function setupAnimatedCharacterPreview() {
    console.log('Setting up animated character preview');
    
    // Get the character preview container
    const characterPreview = document.querySelector('.character-preview');
    if (!characterPreview) {
        console.error('Character preview container not found');
        return;
    }
    
    // Clear any existing animation elements
    const existingAnimation = characterPreview.querySelector('.character-preview-animation');
    if (existingAnimation) {
        // Xóa hoàn toàn để tránh các đối tượng chồng lên nhau
        characterPreview.removeChild(existingAnimation);
    }
    
    // Tạo mới animation container
    const animationContainer = document.createElement('div');
    animationContainer.className = 'character-preview-animation';
    characterPreview.appendChild(animationContainer);
    
    // Thêm nhân vật cơ bản 
    const baseCharacter = document.createElement('div');
    baseCharacter.className = 'character-sprite-sheet character-base-sprite character-animated';
    animationContainer.appendChild(baseCharacter);
    
    // Thêm các trang bị thông thường cơ bản
    const basicEquipment = ['aprons', 'boots', 'gloves', 'hat'];
    basicEquipment.forEach(type => {
        const equipSprite = document.createElement('div');
        equipSprite.className = `character-sprite-sheet ${type}-sprite character-animated`;
        equipSprite.style.display = characterState[type] ? 'block' : 'none';
        animationContainer.appendChild(equipSprite);
    });
    
    // Thêm các trang bị mũ mới
    const newHats = ['armetHat_Gold', 'legionHat_Gold', 'maximusHat_Gold', 'pirateHat_Blue'];
    newHats.forEach(hatType => {
        const hatSprite = document.createElement('div');
        hatSprite.className = `character-sprite-sheet ${hatType}-sprite character-animated`;
        hatSprite.style.display = characterState[hatType] ? 'block' : 'none';
        animationContainer.appendChild(hatSprite);
    });
    
    // Thêm găng tay mới
    const glovesBlackSprite = document.createElement('div');
    glovesBlackSprite.className = 'character-sprite-sheet gloves_Black-sprite character-animated';
    glovesBlackSprite.style.display = characterState.gloves_Black ? 'block' : 'none';
    animationContainer.appendChild(glovesBlackSprite);
    
    // Thêm giày mới
    const sandalsSprite = document.createElement('div');
    sandalsSprite.className = 'character-sprite-sheet sandals-sprite character-animated';
    sandalsSprite.style.display = characterState.sandals ? 'block' : 'none';
    animationContainer.appendChild(sandalsSprite);
    
    // Thêm quần áo mới
    const newArmors = ['legionArmor_Gold', 'maximusArmor_Gold', 'stretchyClothes_Black'];
    newArmors.forEach(armorType => {
        const armorSprite = document.createElement('div');
        armorSprite.className = `character-sprite-sheet ${armorType}-sprite character-animated`;
        armorSprite.style.display = characterState[armorType] ? 'block' : 'none';
        animationContainer.appendChild(armorSprite);
    });
    
    // Thêm tất cả các loại cánh, nhưng chỉ hiển thị loại đang được trang bị
    // Thêm cánh thường
    const wingsSprite = document.createElement('div');
    wingsSprite.className = 'character-sprite-sheet wings-sprite character-animated';
    wingsSprite.style.display = (characterState.wings && characterState.equippedWingType === 'wings') ? 'block' : 'none';
    animationContainer.appendChild(wingsSprite);
    
    // Thêm cánh đen
    const blackWingsSprite = document.createElement('div');
    blackWingsSprite.className = 'character-sprite-sheet blackWings-sprite character-animated';
    blackWingsSprite.style.display = (characterState.wings && characterState.equippedWingType === 'blackWings') ? 'block' : 'none';
    animationContainer.appendChild(blackWingsSprite);
    
    // Thêm cánh trắng
    const whiteWingsSprite = document.createElement('div');
    whiteWingsSprite.className = 'character-sprite-sheet whiteWings-sprite character-animated';
    whiteWingsSprite.style.display = (characterState.wings && characterState.equippedWingType === 'whiteWings') ? 'block' : 'none';
    animationContainer.appendChild(whiteWingsSprite);
    
    console.log('Đã tạo tất cả các trang bị trong preview');
    
    // Update the preview when equipment changes
    updateCharacterPreview();
}

// Update the character preview to show/hide equipment based on what's equipped
function updateCharacterPreview() {
    const animationContainer = document.querySelector('.character-preview-animation');
    if (!animationContainer) return;
    
    // Ẩn tất cả các sprite trang bị trước
    const allEquipmentSprites = animationContainer.querySelectorAll('[class*="-sprite"]');
    allEquipmentSprites.forEach(sprite => {
        if (!sprite.classList.contains('character-base-sprite')) {
            sprite.style.display = 'none';
            sprite.classList.remove('character-animated');
        }
    });
    
    // Hiển thị các trang bị mũ
    if (characterState.hat) {
        const hatSprite = animationContainer.querySelector('.hat-sprite');
        if (hatSprite) {
            hatSprite.style.display = 'block';
            hatSprite.classList.add('character-animated');
        }
    } else if (characterState.armetHat_Gold) {
        const armetHatSprite = animationContainer.querySelector('.armetHat_Gold-sprite');
        if (armetHatSprite) {
            armetHatSprite.style.display = 'block';
            armetHatSprite.classList.add('character-animated');
        }
    } else if (characterState.legionHat_Gold) {
        const legionHatSprite = animationContainer.querySelector('.legionHat_Gold-sprite');
        if (legionHatSprite) {
            legionHatSprite.style.display = 'block';
            legionHatSprite.classList.add('character-animated');
        }
    } else if (characterState.maximusHat_Gold) {
        const maximusHatSprite = animationContainer.querySelector('.maximusHat_Gold-sprite');
        if (maximusHatSprite) {
            maximusHatSprite.style.display = 'block';
            maximusHatSprite.classList.add('character-animated');
        }
    } else if (characterState.pirateHat_Blue) {
        const pirateHatSprite = animationContainer.querySelector('.pirateHat_Blue-sprite');
        if (pirateHatSprite) {
            pirateHatSprite.style.display = 'block';
            pirateHatSprite.classList.add('character-animated');
        }
    }
    
    // Hiển thị các trang bị găng tay
    if (characterState.gloves) {
        const glovesSprite = animationContainer.querySelector('.gloves-sprite');
        if (glovesSprite) {
            glovesSprite.style.display = 'block';
            glovesSprite.classList.add('character-animated');
        }
    } else if (characterState.gloves_Black) {
        const glovesBlackSprite = animationContainer.querySelector('.gloves_Black-sprite');
        if (glovesBlackSprite) {
            glovesBlackSprite.style.display = 'block';
            glovesBlackSprite.classList.add('character-animated');
        }
    }
    
    // Hiển thị các trang bị giày
    if (characterState.boots) {
        const bootsSprite = animationContainer.querySelector('.boots-sprite');
        if (bootsSprite) {
            bootsSprite.style.display = 'block';
            bootsSprite.classList.add('character-animated');
        }
    } else if (characterState.sandals) {
        const sandalsSprite = animationContainer.querySelector('.sandals-sprite');
        if (sandalsSprite) {
            sandalsSprite.style.display = 'block';
            sandalsSprite.classList.add('character-animated');
        }
    }
    
    // Hiển thị các trang bị áo quần
    if (characterState.aprons) {
        const apronsSprite = animationContainer.querySelector('.aprons-sprite');
        if (apronsSprite) {
            apronsSprite.style.display = 'block';
            apronsSprite.classList.add('character-animated');
        }
    } else if (characterState.legionArmor_Gold) {
        const legionArmorSprite = animationContainer.querySelector('.legionArmor_Gold-sprite');
        if (legionArmorSprite) {
            legionArmorSprite.style.display = 'block';
            legionArmorSprite.classList.add('character-animated');
        }
    } else if (characterState.maximusArmor_Gold) {
        const maximusArmorSprite = animationContainer.querySelector('.maximusArmor_Gold-sprite');
        if (maximusArmorSprite) {
            maximusArmorSprite.style.display = 'block';
            maximusArmorSprite.classList.add('character-animated');
        }
    } else if (characterState.stretchyClothes_Black) {
        const stretchyClothesSprite = animationContainer.querySelector('.stretchyClothes_Black-sprite');
        if (stretchyClothesSprite) {
            stretchyClothesSprite.style.display = 'block';
            stretchyClothesSprite.classList.add('character-animated');
        }
    }
    
    // Xử lý hiển thị cánh
    if (characterState.wings && characterState.equippedWingType) {
        console.log(`Hiển thị cánh trong character preview: ${characterState.equippedWingType}`);
        const wingTypeSprite = animationContainer.querySelector(`.${characterState.equippedWingType}-sprite`);
        if (wingTypeSprite) {
            wingTypeSprite.style.display = 'block';
            wingTypeSprite.classList.add('character-animated');
            console.log(`Đã hiển thị cánh ${characterState.equippedWingType} trong character preview với animation`);
        } else {
            console.log(`Không tìm thấy phần tử DOM cho cánh ${characterState.equippedWingType} trong character preview`);
        }
    }
}

// Synchronize character inventory with gameState
function syncInventoryWithGameState() {
    // Check if gameState has an inventory
    if (gameState.inventory && Array.isArray(gameState.inventory)) {
        // Clear existing character inventory
        characterState.inventory = [];
        
        // For each item in gameState inventory
        gameState.inventory.forEach(item => {
            // Xử lý đặc biệt cho các loại trang bị từ shop
            let equipmentType = item.type;
            
            // Ánh xạ ID trang bị từ shop sang ID trong hệ thống nhân vật
            if (item.id === 'wings_black') {
                equipmentType = 'blackWings';
            } else if (item.id === 'wings_white') {
                equipmentType = 'whiteWings';
            } else if (item.id === 'wings_basic') {
                equipmentType = 'wings';
            }
            // Ánh xạ ID của các mũ mới
            else if (item.id === 'armet_hat_gold') {
                equipmentType = 'armetHat_Gold';
            } else if (item.id === 'legion_hat_gold') {
                equipmentType = 'legionHat_Gold';
            } else if (item.id === 'maximus_hat_gold') {
                equipmentType = 'maximusHat_Gold';
            } else if (item.id === 'pirate_hat_blue') {
                equipmentType = 'pirateHat_Blue';
            }
            // Ánh xạ ID của găng tay mới
            else if (item.id === 'gloves_black') {
                equipmentType = 'gloves_Black';
            }
            // Ánh xạ ID của giày mới
            else if (item.id === 'sandals') {
                equipmentType = 'sandals';
            }
            // Ánh xạ ID của quần áo mới
            else if (item.id === 'legion_armor_gold') {
                equipmentType = 'legionArmor_Gold';
            } else if (item.id === 'maximus_armor_gold') {
                equipmentType = 'maximusArmor_Gold';
            } else if (item.id === 'stretchy_clothes_black') {
                equipmentType = 'stretchyClothes_Black';
            }
            
            // Kiểm tra nếu loại trang bị này tồn tại trong định nghĩa equipment
            if (characterState.equipment[equipmentType]) {
                // Thêm vào inventory của nhân vật nếu chưa có
                if (!characterState.inventory.includes(equipmentType)) {
                    characterState.inventory.push(equipmentType);
                    console.log(`Synchronized ${equipmentType} to character inventory`);
                }
            } else {
                console.warn(`Không tìm thấy định nghĩa cho trang bị ${item.id} -> ${equipmentType}`);
            }
        });
        
        console.log("Synchronized inventory from gameState:", characterState.inventory);
    }
}

// Update farm character display
function updateFarmCharacterDisplay() {
    const farmCharacterPreview = document.getElementById('farm-character-preview');
    if (!farmCharacterPreview) return;
    
    // Đảm bảo nhân vật cơ bản luôn hiển thị
    const baseCharacter = farmCharacterPreview.querySelector('.character-base-sprite');
    if (baseCharacter) {
        baseCharacter.style.display = 'block';
    }
    
    // Lấy tham chiếu đến phần tử bóng đổ
    const characterShadow = farmCharacterPreview.querySelector('.farm-character-shadow');
    
    // Điều chỉnh bóng đổ dựa trên trang bị
    if (characterShadow) {
        // Mặc định bóng đổ cho nhân vật không có cánh
        let shadowWidth = '80%';
        let shadowHeight = '20%';
        
        // Nếu có cánh, thay đổi kích thước bóng đổ
        if (characterState.wings) {
            // Điều chỉnh kích thước bóng đổ dựa vào loại cánh
            if (characterState.equippedWingType === 'blackWings') {
                // Cánh rồng - bóng lớn nhất
                shadowWidth = '120%';
                shadowHeight = '25%';
            } else if (characterState.equippedWingType === 'whiteWings') {
                // Cánh thiên thần - bóng to vừa
                shadowWidth = '110%';
                shadowHeight = '22%';
            } else {
                // Cánh thường - bóng to hơn một chút
                shadowWidth = '100%';
                shadowHeight = '20%';
            }
        }
        
        // Nếu có mũ lớn, cũng điều chỉnh bóng nhẹ
        if (characterState.maximusHat_Gold || characterState.armetHat_Gold) {
            // Tăng chiều rộng bóng thêm một chút
            shadowWidth = parseInt(shadowWidth) + 5 + '%';
        }
        
        // Áp dụng kích thước mới cho bóng đổ
        characterShadow.style.width = shadowWidth;
        characterShadow.style.height = shadowHeight;
    }
    
    // Ẩn tất cả các sprite trang bị trước
    const allEquipmentSprites = farmCharacterPreview.querySelectorAll('[class*="-sprite"]');
    allEquipmentSprites.forEach(sprite => {
        if (!sprite.classList.contains('character-base-sprite')) {
            sprite.style.display = 'none';
        }
    });
    
    // Hiển thị các trang bị mũ
    if (characterState.hat) {
        const hatSprite = farmCharacterPreview.querySelector('.hat-sprite');
        if (hatSprite) hatSprite.style.display = 'block';
    } else if (characterState.armetHat_Gold) {
        const armetHatSprite = farmCharacterPreview.querySelector('.armetHat_Gold-sprite');
        if (armetHatSprite) {
            armetHatSprite.style.display = 'block';
        } else {
            createFarmEquipmentSprite(farmCharacterPreview, 'armetHat_Gold');
        }
    } else if (characterState.legionHat_Gold) {
        const legionHatSprite = farmCharacterPreview.querySelector('.legionHat_Gold-sprite');
        if (legionHatSprite) {
            legionHatSprite.style.display = 'block';
        } else {
            createFarmEquipmentSprite(farmCharacterPreview, 'legionHat_Gold');
        }
    } else if (characterState.maximusHat_Gold) {
        const maximusHatSprite = farmCharacterPreview.querySelector('.maximusHat_Gold-sprite');
        if (maximusHatSprite) {
            maximusHatSprite.style.display = 'block';
        } else {
            createFarmEquipmentSprite(farmCharacterPreview, 'maximusHat_Gold');
        }
    } else if (characterState.pirateHat_Blue) {
        const pirateHatSprite = farmCharacterPreview.querySelector('.pirateHat_Blue-sprite');
        if (pirateHatSprite) {
            pirateHatSprite.style.display = 'block';
        } else {
            createFarmEquipmentSprite(farmCharacterPreview, 'pirateHat_Blue');
        }
    }
    
    // Hiển thị các trang bị găng tay
    if (characterState.gloves) {
        const glovesSprite = farmCharacterPreview.querySelector('.gloves-sprite');
        if (glovesSprite) glovesSprite.style.display = 'block';
    } else if (characterState.gloves_Black) {
        const glovesBlackSprite = farmCharacterPreview.querySelector('.gloves_Black-sprite');
        if (glovesBlackSprite) {
            glovesBlackSprite.style.display = 'block';
        } else {
            createFarmEquipmentSprite(farmCharacterPreview, 'gloves_Black');
        }
    }
    
    // Hiển thị các trang bị giày
    if (characterState.boots) {
        const bootsSprite = farmCharacterPreview.querySelector('.boots-sprite');
        if (bootsSprite) bootsSprite.style.display = 'block';
    } else if (characterState.sandals) {
        const sandalsSprite = farmCharacterPreview.querySelector('.sandals-sprite');
        if (sandalsSprite) {
            sandalsSprite.style.display = 'block';
        } else {
            createFarmEquipmentSprite(farmCharacterPreview, 'sandals');
        }
    }
    
    // Hiển thị các trang bị áo quần
    if (characterState.aprons) {
        const apronsSprite = farmCharacterPreview.querySelector('.aprons-sprite');
        if (apronsSprite) apronsSprite.style.display = 'block';
    } else if (characterState.legionArmor_Gold) {
        const legionArmorSprite = farmCharacterPreview.querySelector('.legionArmor_Gold-sprite');
        if (legionArmorSprite) {
            legionArmorSprite.style.display = 'block';
        } else {
            createFarmEquipmentSprite(farmCharacterPreview, 'legionArmor_Gold');
        }
    } else if (characterState.maximusArmor_Gold) {
        const maximusArmorSprite = farmCharacterPreview.querySelector('.maximusArmor_Gold-sprite');
        if (maximusArmorSprite) {
            maximusArmorSprite.style.display = 'block';
        } else {
            createFarmEquipmentSprite(farmCharacterPreview, 'maximusArmor_Gold');
        }
    } else if (characterState.stretchyClothes_Black) {
        const stretchyClothesSprite = farmCharacterPreview.querySelector('.stretchyClothes_Black-sprite');
        if (stretchyClothesSprite) {
            stretchyClothesSprite.style.display = 'block';
        } else {
            createFarmEquipmentSprite(farmCharacterPreview, 'stretchyClothes_Black');
        }
    }
    
    // Ẩn tất cả các loại cánh trước
    const allWingSprites = farmCharacterPreview.querySelectorAll('.wings-sprite, .blackWings-sprite, .whiteWings-sprite');
    allWingSprites.forEach(sprite => {
        sprite.style.display = 'none';
    });
    
    // Nếu có cánh được trang bị, chỉ hiển thị loại cánh đó
    if (characterState.wings && characterState.equippedWingType) {
        const wingTypeSprite = farmCharacterPreview.querySelector(`.${characterState.equippedWingType}-sprite`);
        if (wingTypeSprite) {
            wingTypeSprite.style.display = 'block';
            
            // Thêm hiệu ứng hover cho cánh nếu là cánh rồng hoặc cánh thiên thần
            if (characterState.equippedWingType === 'blackWings' || characterState.equippedWingType === 'whiteWings') {
                wingTypeSprite.classList.add('wings-hover-effect');
            } else {
                wingTypeSprite.classList.remove('wings-hover-effect');
            }
        } else {
            createFarmEquipmentSprite(farmCharacterPreview, characterState.equippedWingType);
        }
    }

    console.log("Đã cập nhật hiển thị nhân vật nông trại với tất cả trang bị mới");
}

// Hàm hỗ trợ tạo phần tử DOM mới cho trang bị ở màn hình nông trại
function createFarmEquipmentSprite(container, equipmentType) {
    const sprite = document.createElement('div');
    sprite.className = `farm-character-sprite ${equipmentType}-sprite`;
    sprite.style.display = 'block';
    container.appendChild(sprite);
    console.log(`Đã tạo mới sprite cho ${equipmentType} ở màn hình nông trại`);
    return sprite;
}