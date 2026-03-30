/**
 * 存档系统 - LocalStorage存储
 */
import { gameState, resetGameState } from './game.js';
import { CONFIG } from './config.js';

const STORAGE_KEY = 'banweiGame';

/**
 * 保存游戏到本地存储
 */
export function saveGame() {
    const saveData = {
        gameState: { ...gameState },
        saveTime: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
}

/**
 * 从本地存储加载游戏
 * @returns {object|null}
 */
export function loadGame() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try {
        const data = JSON.parse(saved);
        return data.gameState;
    } catch (e) {
        console.error('加载存档失败:', e);
        return null;
    }
}

/**
 * 计算离线收益
 * @returns {object|null}
 */
export function calculateOfflineRewards() {
    const now = Date.now();
    const offlineMs = now - gameState.lastPlayTime;
    const offlineHours = Math.min(
        CONFIG.OFFLINE_HOUR_LIMIT,
        Math.floor(offlineMs / (1000 * 60 * 60))
    );

    if (offlineHours <= 0) return null;

    return {
        hours: offlineHours,
        rewards: {
            sanity: CONFIG.OFFLINE_SANITY_PER_HOUR * offlineHours,
            stress: CONFIG.OFFLINE_STRESS_PER_HOUR * offlineHours,
            money: CONFIG.OFFLINE_MONEY_PER_HOUR * offlineHours
        }
    };
}

/**
 * 应用离线收益
 * @returns {object|null}
 */
export function applyOfflineRewards() {
    const offline = calculateOfflineRewards();
    if (offline) {
        // 更新数值（不超出范围）
        gameState.sanity = Math.min(
            gameState.maxSanity,
            gameState.sanity + offline.rewards.sanity
        );
        gameState.stress = Math.max(
            0,
            gameState.stress + offline.rewards.stress
        );
        gameState.money = Math.min(
            gameState.maxMoney,
            gameState.money + offline.rewards.money
        );
        gameState.lastPlayTime = Date.now();
        saveGame();
        return offline;
    }
    return null;
}

/**
 * 清除存档
 */
export function clearSave() {
    localStorage.removeItem(STORAGE_KEY);
}
