// Honey Bee Animation System
import { gameState } from './gameState.js';

// Configuration for honey bee behavior
const BEE_CONFIG = {
    // Timing settings in milliseconds
    spawnInterval: { min: 10000, max: 30000 }, // How often bees appear (10-30 seconds)
    flyDuration: { min: 8000, max: 15000 },   // How long bees fly around (8-15 seconds)
    hoverDuration: { min: 3000, max: 7000 },  // How long bees hover on a plant (3-7 seconds)
    frameSpeed: 150,                          // How fast wings flap (animation speed)
    
    // Movement settings
    moveSpeed: { min: 1, max: 3 },            // Pixels per movement update
    movementUpdateInterval: 50,               // How often the bee updates position
    
    // Behavior settings
    plantedCellPreference: 0.8,               // 80% chance to favor planted cells
    maxActiveBees: 2,                         // Maximum number of bees active at once
    
    // Click behavior
    cooldownAfterClick: 5000,                 // Time before a new bee can spawn after clicking one (5 seconds)
    
    // Spawn probability based on farm state (%)
    spawnProbability: {
        noPlants: 0,                          // 0% chance when no plants
        growingPlants: { min: 10, max: 30 },  // 10-30% chance when plants are growing
        readyToHarvest: 50                    // 50% chance when plants are ready to harvest
    }
};

// Store active bees
const activeBees = [];

// Tracks the timer for spawning new bees
let beeSpawnTimer = null;

// Track the last time a bee was clicked
let lastBeeClickTime = 0;

/**
 * Initialize the honey bee system
 */
export function initHoneyBeeSystem() {
    console.log('Initializing honey bee animation system');
    // Start the bee spawn cycle
    scheduleNextBeeSpawn();
}

/**
 * Get the current farm state for bee spawn probability calculation
 * @returns {Object} Information about the farm's current state
 */
function getFarmState() {
    const plantedCells = Array.from(document.querySelectorAll('.grid-cell.planted'));
    const readyToHarvestCells = Array.from(document.querySelectorAll('.grid-cell.planted.ready'));
    
    return {
        totalPlantedCells: plantedCells.length,
        readyToHarvestCells: readyToHarvestCells.length,
        growingCells: plantedCells.length - readyToHarvestCells.length
    };
}

/**
 * Calculate spawn probability based on farm state
 * @returns {Object} Spawn probability and related farm info
 */
function calculateSpawnProbability() {
    const farmState = getFarmState();
    
    let probability = 0;
    let state = 'noPlants';
    
    if (farmState.totalPlantedCells === 0) {
        // No plants at all
        probability = BEE_CONFIG.spawnProbability.noPlants;
        state = 'noPlants';
    } else if (farmState.readyToHarvestCells > 0) {
        // Some plants are ready to harvest
        probability = BEE_CONFIG.spawnProbability.readyToHarvest;
        state = 'readyToHarvest';
    } else {
        // Plants are growing but none are ready
        probability = getRandomValue(
            BEE_CONFIG.spawnProbability.growingPlants.min,
            BEE_CONFIG.spawnProbability.growingPlants.max
        );
        state = 'growingPlants';
    }
    
    return {
        probability,
        state,
        farmState
    };
}

/**
 * Schedule the next bee to spawn
 */
function scheduleNextBeeSpawn() {
    // Clear any existing timer
    if (beeSpawnTimer) {
        clearTimeout(beeSpawnTimer);
    }
    
    // Calculate spawn probability based on farm state
    const { probability, state } = calculateSpawnProbability();
    
    // Calculate random interval time, but respect click cooldown
    const timeSinceLastClick = Date.now() - lastBeeClickTime;
    let nextSpawnTime;
    
    if (timeSinceLastClick < BEE_CONFIG.cooldownAfterClick) {
        // If we're in cooldown after a click, use the remaining cooldown time
        nextSpawnTime = BEE_CONFIG.cooldownAfterClick - timeSinceLastClick;
    } else {
        // Normal random spawn time
        nextSpawnTime = getRandomValue(BEE_CONFIG.spawnInterval.min, BEE_CONFIG.spawnInterval.max);
    }
    
    // Set the timer
    beeSpawnTimer = setTimeout(() => {
        // Only try to spawn if there's a chance based on probability
        if (Math.random() * 100 < probability) {
            spawnBee();
        }
        
        // Always schedule the next check regardless of whether we spawned a bee
        scheduleNextBeeSpawn();
    }, nextSpawnTime);
    
    console.log(`Scheduled next bee check in ${nextSpawnTime/1000}s with ${probability}% spawn chance (${state})`);
}

/**
 * Spawn a new bee if we're under the max limit
 */
function spawnBee() {
    // Only spawn if we're under the max limit
    if (activeBees.length < BEE_CONFIG.maxActiveBees) {
        // Get planted cells to target
        const farmState = getFarmState();
        
        // If there are no planted cells, don't spawn a bee (redundant check)
        if (farmState.totalPlantedCells === 0) {
            return;
        }
        
        // Get cells to target (all planted cells)
        const plantedCells = Array.from(document.querySelectorAll('.grid-cell.planted'));
        
        // Get ready to harvest cells
        const readyToHarvestCells = Array.from(document.querySelectorAll('.grid-cell.planted.ready'));
        
        // Decide which cells to prioritize
        const targetCells = readyToHarvestCells.length > 0 
            ? [...readyToHarvestCells, ...plantedCells] // Duplicate ready cells to increase their chance
            : plantedCells;
        
        // Create the bee
        createBeeElement(targetCells);
        
        console.log(`Spawned bee (${activeBees.length}/${BEE_CONFIG.maxActiveBees})`);
    }
}

/**
 * Create and animate a new bee element
 */
function createBeeElement(plantedCells) {
    // Create container element
    const beeContainer = document.createElement('div');
    beeContainer.className = 'honey-bee-container';
    
    // Create bee element
    const beeElement = document.createElement('div');
    beeElement.className = 'honey-bee frame-1';
    beeContainer.appendChild(beeElement);
    
    // Add to the game background
    const gameBackground = document.querySelector('.game-background');
    gameBackground.appendChild(beeContainer);
    
    // Set initial position (starting from an edge)
    setInitialPosition(beeContainer);
    
    // Start frame animation
    const frameInterval = startFrameAnimation(beeElement);
    
    // Generate a flight plan
    const flightPlan = generateFlightPlan(plantedCells);
    
    // Start bee movement
    const movementData = {
        container: beeContainer,
        element: beeElement,
        frameInterval: frameInterval,
        flightPlan: flightPlan,
        currentTargetIndex: 0,
        isFlying: true
    };
    
    // Add to active bees list
    activeBees.push(movementData);
    
    // Add click event to make the bee fly away
    beeContainer.addEventListener('click', (e) => {
        // Prevent the click from propagating to elements below
        e.stopPropagation();
        
        // Record click time for cooldown
        lastBeeClickTime = Date.now();
        
        // Make the bee fly away
        makeBeesFlyAway(movementData);
    });
    
    // Start movement
    startBeeMovement(movementData);
}

/**
 * Make a bee fly away when clicked
 */
function makeBeesFlyAway(movementData) {
    const { container, element, frameInterval } = movementData;
    
    // Stop regular animations
    container.classList.remove('honey-bee-flying-right', 'honey-bee-flying-left', 'honey-bee-hovering');
    
    // Determine random direction to fly away (either left or right)
    const flyRight = Math.random() > 0.5;
    
    // Apply the appropriate fleeing animation
    if (flyRight) {
        container.classList.add('honey-bee-fleeing-right');
    } else {
        container.classList.add('honey-bee-fleeing-left');
    }
    
    // Stop movement
    movementData.isFlying = false;
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        removeBee(movementData);
    }, 1500); // Match the animation duration from CSS (1.5s)
}

/**
 * Set initial position for the bee (start from an edge)
 */
function setInitialPosition(beeContainer) {
    const gameBackground = document.querySelector('.game-background');
    const rect = gameBackground.getBoundingClientRect();
    
    // Choose a side to enter from (0: top, 1: right, 2: bottom, 3: left)
    const side = Math.floor(Math.random() * 4);
    
    let x, y;
    
    switch (side) {
        case 0: // Top
            x = Math.random() * rect.width;
            y = -30;
            break;
        case 1: // Right
            x = rect.width + 30;
            y = Math.random() * rect.height;
            break;
        case 2: // Bottom
            x = Math.random() * rect.width;
            y = rect.height + 30;
            break;
        case 3: // Left
            x = -30;
            y = Math.random() * rect.height;
            break;
    }
    
    beeContainer.style.left = `${x}px`;
    beeContainer.style.top = `${y}px`;
}

/**
 * Start frame animation for the bee's wings
 */
function startFrameAnimation(beeElement) {
    let currentFrame = 1;
    
    const interval = setInterval(() => {
        // Remove all frame classes
        beeElement.classList.remove('frame-1', 'frame-2', 'frame-3');
        
        // Add current frame class
        currentFrame = currentFrame % 3 + 1;
        beeElement.classList.add(`frame-${currentFrame}`);
    }, BEE_CONFIG.frameSpeed);
    
    return interval;
}

/**
 * Generate a flight plan for the bee
 */
function generateFlightPlan(plantedCells) {
    const gameBackground = document.querySelector('.game-background');
    const rect = gameBackground.getBoundingClientRect();
    
    // Number of waypoints in the flight plan
    const waypoints = 3 + Math.floor(Math.random() * 3); // 3-5 waypoints
    
    const flightPlan = [];
    
    for (let i = 0; i < waypoints; i++) {
        // Decide if this waypoint should be on a planted cell
        const targetPlantedCell = Math.random() < BEE_CONFIG.plantedCellPreference && plantedCells.length > 0;
        
        let waypoint;
        
        if (targetPlantedCell) {
            // Pick a random planted cell
            const randomCell = plantedCells[Math.floor(Math.random() * plantedCells.length)];
            const cellRect = randomCell.getBoundingClientRect();
            
            waypoint = {
                x: cellRect.left - rect.left + cellRect.width / 2,
                y: cellRect.top - rect.top + cellRect.height / 2,
                isPlanted: true,
                hovering: true
            };
        } else {
            // Random position within the game background
            waypoint = {
                x: 20 + Math.random() * (rect.width - 40),
                y: 20 + Math.random() * (rect.height - 40),
                isPlanted: false,
                hovering: false
            };
        }
        
        flightPlan.push(waypoint);
    }
    
    // Add exit point (outside the visible area)
    const exitSide = Math.floor(Math.random() * 4);
    let exitPoint;
    
    switch (exitSide) {
        case 0: // Top
            exitPoint = {
                x: Math.random() * rect.width,
                y: -30,
                isPlanted: false,
                hovering: false
            };
            break;
        case 1: // Right
            exitPoint = {
                x: rect.width + 30,
                y: Math.random() * rect.height,
                isPlanted: false,
                hovering: false
            };
            break;
        case 2: // Bottom
            exitPoint = {
                x: Math.random() * rect.width,
                y: rect.height + 30,
                isPlanted: false,
                hovering: false
            };
            break;
        case 3: // Left
            exitPoint = {
                x: -30,
                y: Math.random() * rect.height,
                isPlanted: false,
                hovering: false
            };
            break;
    }
    
    flightPlan.push(exitPoint);
    
    return flightPlan;
}

/**
 * Start the bee movement based on the flight plan
 */
function startBeeMovement(movementData) {
    // Skip if bee is no longer flying (e.g., was clicked)
    if (!movementData.isFlying) return;
    
    const { container, element, flightPlan, currentTargetIndex } = movementData;
    
    // Get current and target positions
    const currentTarget = flightPlan[currentTargetIndex];
    
    // Set current position
    const rect = container.getBoundingClientRect();
    const currentX = parseInt(container.style.left) || rect.left;
    const currentY = parseInt(container.style.top) || rect.top;
    
    // If hovering at a plant, add hovering class and stay for a while
    if (currentTarget.hovering) {
        // Stop regular flying animations
        container.classList.remove('honey-bee-flying-right', 'honey-bee-flying-left');
        
        // Add hovering animation
        container.classList.add('honey-bee-hovering');
        
        // Keep hovering for a random duration
        const hoverTime = getRandomValue(BEE_CONFIG.hoverDuration.min, BEE_CONFIG.hoverDuration.max);
        
        setTimeout(() => {
            // Skip if bee is no longer flying (e.g., was clicked)
            if (!movementData.isFlying) return;
            
            // Resume flying after hovering
            container.classList.remove('honey-bee-hovering');
            
            // Move to next waypoint
            movementData.currentTargetIndex++;
            
            // If we finished all waypoints, remove the bee
            if (movementData.currentTargetIndex >= flightPlan.length) {
                removeBee(movementData);
            } else {
                // Continue to next waypoint
                startBeeMovement(movementData);
            }
        }, hoverTime);
        
        return;
    }
    
    // Calculate direction and distance
    const dx = currentTarget.x - currentX;
    const dy = currentTarget.y - currentY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If we're close enough to the target, move to the next one
    if (distance < 5) {
        movementData.currentTargetIndex++;
        
        // If we finished all waypoints, remove the bee
        if (movementData.currentTargetIndex >= flightPlan.length) {
            removeBee(movementData);
            return;
        }
        
        // Continue to next waypoint
        startBeeMovement(movementData);
        return;
    }
    
    // Set flying direction animation
    if (dx > 0) {
        container.classList.remove('honey-bee-flying-left');
        container.classList.add('honey-bee-flying-right');
    } else {
        container.classList.remove('honey-bee-flying-right');
        container.classList.add('honey-bee-flying-left');
    }
    
    // Calculate speed based on distance
    const speedFactor = Math.min(1, distance / 100); // Slow down as we approach target
    const speed = getRandomValue(
        BEE_CONFIG.moveSpeed.min, 
        BEE_CONFIG.moveSpeed.max
    ) * speedFactor;
    
    // Calculate movement step
    const stepX = (dx / distance) * speed;
    const stepY = (dy / distance) * speed;
    
    // Move the bee one step
    container.style.left = `${currentX + stepX}px`;
    container.style.top = `${currentY + stepY}px`;
    
    // Schedule next movement if still flying
    if (movementData.isFlying) {
        setTimeout(() => {
            if (movementData.isFlying) {
                startBeeMovement(movementData);
            }
        }, BEE_CONFIG.movementUpdateInterval);
    }
}

/**
 * Remove a bee from the active bees
 */
function removeBee(movementData) {
    const { container, frameInterval } = movementData;
    
    // Stop animations
    clearInterval(frameInterval);
    movementData.isFlying = false;
    
    // Remove from DOM with a fade-out effect
    container.style.transition = 'opacity 0.5s ease-out';
    container.style.opacity = '0';
    
    // Remove from active bees array
    const index = activeBees.indexOf(movementData);
    if (index !== -1) {
        activeBees.splice(index, 1);
    }
    
    // Remove element after animation completes
    setTimeout(() => {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }, 500);
}

/**
 * Get random value between min and max
 */
function getRandomValue(min, max) {
    return min + Math.random() * (max - min);
}

/**
 * Handle cleanup when leaving the game or changing screens
 */
export function cleanupHoneyBeeSystem() {
    // Clear the spawn timer
    if (beeSpawnTimer) {
        clearTimeout(beeSpawnTimer);
        beeSpawnTimer = null;
    }
    
    // Remove all active bees
    activeBees.forEach(removeBee);
}

// Reset the system for testing
export function resetHoneyBeeSystem() {
    cleanupHoneyBeeSystem();
    initHoneyBeeSystem();
}