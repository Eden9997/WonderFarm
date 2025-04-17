import { config } from './config.js';
import { gameState } from './gameState.js';
import { playSound } from './audioSystem.js';
import { updateMoneyDisplay, showMessage, showComboEffect, createPixelHarvestEffect } from './uiSystem.js';
import { checkAchievements } from './achievementSystem.js';
import { updateDailyQuestProgress } from './questSystem.js';
import { getPlantDisplayName, saveAllGameData } from './utils.js';
import { applyGrowthTimeReduction, applyHarvestValueBonus, applyHarvestTimeReduction } from './characterSystem.js';

export function plantCrop(cell, plantType) {
    if (cell.classList.contains('planted')) {
        showMessage("Cây đang phát triển !");
        playSound('error');
        return;
    }

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    cell.classList.remove('empty');
    cell.classList.add('planted');

    const plantElement = document.createElement('div');
    plantElement.classList.add('plant');
    cell.appendChild(plantElement);

    // Apply growth time reduction bonus from character equipment
    const baseGrowthTime = config.growthTime[plantType] * 1000;
    const reducedGrowthTime = applyGrowthTimeReduction(baseGrowthTime);
    
    const plant = {
        type: plantType,
        element: plantElement,
        row: row,
        col: col,
        stage: 0,
        plantedTime: Date.now(),
        growthTime: reducedGrowthTime,
        baseGrowthTime: baseGrowthTime // Store base time for reference
    };
    
    gameState.plants.push(plant);
    gameState.plantsPlanted++;
    
    // Cập nhật nhiệm vụ hàng ngày
    updateDailyQuestProgress('plant_amount', 1);
    
    renderPlantStage(plant);
    startGrowthAnimation(plant);
    playSound('plant');
    showPlantingEffect(cell, plantType);
    
    // Lưu dữ liệu game lên Telegram Cloud sau khi trồng cây
    saveAllGameData(gameState);
}

export function harvestPlant(plant) {
    const cell = plant.element.parentNode;
    const plantIndex = gameState.plants.findIndex(p => p === plant);
    if (plantIndex !== -1) {
        gameState.plants.splice(plantIndex, 1);
    }

    if (plant.growthInterval) {
        clearInterval(plant.growthInterval);
    }

    const plantType = plant.type;
    gameState.totalHarvested++;
    gameState.harvestedCrops[plantType]++;

    // Apply harvest value bonus from character equipment
    let baseValue = config.harvestValue[plantType];
    baseValue = applyHarvestValueBonus(baseValue);
    
    let comboBonus = 0;
    const currentTime = Date.now();
    const timeSinceLastAction = currentTime - gameState.lastAction;

    if (timeSinceLastAction < 3000) {
        gameState.combo++;
        gameState.comboMultiplier = 1 + Math.min(5, gameState.combo) * 0.1;

        if (gameState.comboTimeout) {
            clearTimeout(gameState.comboTimeout);
        }

        gameState.comboTimeout = setTimeout(() => {
            gameState.combo = 0;
            gameState.comboMultiplier = 1;
        }, 3000);
    } else {
        gameState.combo = 1;
        gameState.comboMultiplier = 1.1;

        if (gameState.comboTimeout) {
            clearTimeout(gameState.comboTimeout);
        }

        gameState.comboTimeout = setTimeout(() => {
            gameState.combo = 0;
            gameState.comboMultiplier = 1;
        }, 3000);
    }

    gameState.lastAction = currentTime;
    const harvestValue = Math.floor(baseValue * gameState.comboMultiplier);
    comboBonus = harvestValue - baseValue;

    gameState.money += harvestValue;
    gameState.totalEarned += harvestValue;
    updateMoneyDisplay();

    plant.element.style.display = 'none';
    createPixelHarvestEffect(cell, plantType, harvestValue);
    playSound('harvest');

    let message = `Thu hoạch ${getPlantDisplayName(plantType)}: +${harvestValue} xu`;
    if (comboBonus > 0) {
        message += ` (COMBO x${gameState.combo}: +${comboBonus})`;
    }
    showMessage(message);

    if (gameState.combo > 1) {
        showComboEffect(gameState.combo);
    }

    setTimeout(() => {
        cell.innerHTML = '';
        cell.classList.remove('planted');
        cell.classList.add('empty');
    }, 1000);

    checkAchievements();
    updateDailyQuestProgress('harvest_amount', 1);
    updateDailyQuestProgress('harvest_crop', 1, plant.type);
    updateDailyQuestProgress('consecutive_harvests', 1);
    updateDailyQuestProgress('earn_coins', harvestValue); // Update with actual value earned
    
    // Lưu dữ liệu game lên Telegram Cloud sau khi thu hoạch
    saveAllGameData(gameState);
}

function renderPlantStage(plant) {
    if (plant.stage < config.growthStages) {
        const plantType = plant.type;
        const src = `img/plant/${plantType}.png`;
        const stagePercentage = (plant.stage / (config.growthStages - 1)) * 100;

        plant.element.style.backgroundImage = `url(${src})`;
        plant.element.style.backgroundSize = `${config.growthStages * 100}% 100%`;
        plant.element.style.backgroundPosition = `${stagePercentage}% 0%`;
        plant.element.style.backgroundRepeat = 'no-repeat';

        plant.element.style.filter = 'brightness(1.2)';
        setTimeout(() => {
            plant.element.style.filter = 'brightness(1)';
        }, 300);
    }
}

function startGrowthAnimation(plant) {
    const stageTime = plant.growthTime / config.growthStages;

    renderPlantStage(plant);

    const growthInterval = setInterval(() => {
        plant.stage++;

        if (plant.stage >= config.growthStages) {
            clearInterval(growthInterval);
            plant.stage = config.growthStages - 1;
            renderPlantStage(plant);
            playSound('ready');

            plant.element.classList.add('fully-grown');
            plant.element.style.cursor = 'pointer';
            plant.element.title = 'Nhấp để thu hoạch';

            plant.element.addEventListener('click', (e) => {
                e.stopPropagation();
                harvestPlant(plant);
            });
        } else {
            renderPlantStage(plant);
            playSound('grow');
        }
    }, stageTime);

    plant.growthInterval = growthInterval;
}

function showPlantingEffect(cell, plantType) {
    const rays = document.createElement('div');
    rays.classList.add('planting-rays');
    cell.appendChild(rays);

    setTimeout(() => {
        if (rays.parentNode === cell) {
            cell.removeChild(rays);
        }
    }, 1000);
}