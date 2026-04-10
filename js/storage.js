/**
 * 存档系统 - LocalStorage存储
 */
import { gameState } from './game.js';
import { CONFIG } from './config.js';

const STORAGE_KEY = 'banweiGame';
const FORTUNE_KEY = 'banweiFortune';

/**
 * 获取今日日期字符串
 * @returns {string}
 */
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

/**
 * 获取今日运势数据
 * @returns {object|null} { date, fortuneId, applied }
 */
export function getFortuneData() {
    const saved = localStorage.getItem(FORTUNE_KEY);
    if (!saved) return null;
    try {
        const data = JSON.parse(saved);
        // 检查是否是今天的数据
        if (data.date !== getTodayString()) {
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

/**
 * 检查今日运势是否已生成
 * @returns {boolean}
 */
export function isFortuneGeneratedToday() {
    return getFortuneData() !== null;
}

/**
 * 检查今日运势即时效果是否已应用
 * @returns {boolean}
 */
export function isFortuneAppliedToday() {
    const data = getFortuneData();
    return data?.applied === true;
}

/**
 * 保存今日运势（生成时调用）
 * @param {string} fortuneId - 运势ID
 */
export function saveFortuneGenerated(fortuneId) {
    const data = {
        date: getTodayString(),
        fortuneId: fortuneId,
        applied: false
    };
    localStorage.setItem(FORTUNE_KEY, JSON.stringify(data));
}

/**
 * 标记今日运势即时效果已应用（点击关闭按钮时调用）
 */
export function saveFortuneApplied() {
    const data = getFortuneData();
    if (data) {
        data.applied = true;
        localStorage.setItem(FORTUNE_KEY, JSON.stringify(data));
    }
}

/**
 * 清除今日运势状态（用于重开人生时重新随机运势）
 */
export function clearFortuneStatus() {
    localStorage.removeItem(FORTUNE_KEY);
}

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
function calculateOfflineRewards() {
    const now = Date.now();
    const offlineMs = now - gameState.lastPlayTime;
    const offlineHours = Math.min(
        CONFIG.OFFLINE_HOUR_LIMIT,
        Math.floor(offlineMs / (1000 * 60 * 60))
    );

    if (offlineHours <= 0) return null;

    const mod = gameState.fortuneModifier || {};
    const sanityMult = mod.sanityMultiplier || 1.0;
    const stressMult = mod.stressMultiplier || 1.0;
    const moneyMult = mod.moneyMultiplier || 1.0;

    return {
        hours: offlineHours,
        rewards: {
            sanity: Math.floor(CONFIG.OFFLINE_SANITY_PER_HOUR * offlineHours * sanityMult),
            stress: Math.floor(CONFIG.OFFLINE_STRESS_PER_HOUR * offlineHours * stressMult),
            money: Math.floor(CONFIG.OFFLINE_MONEY_PER_HOUR * offlineHours * moneyMult)
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
