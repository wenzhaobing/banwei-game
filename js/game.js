/**
 * 游戏核心逻辑
 */
import { CONFIG } from './config.js';

/**
 * 游戏状态
 */
export let gameState = {
    // 核心数值
    sanity: CONFIG.INIT_SANITY,
    stress: CONFIG.INIT_STRESS,
    money: CONFIG.INIT_MONEY,

    // 数值上限
    maxSanity: CONFIG.MAX_SANITY,
    maxStress: CONFIG.MAX_STRESS,
    maxMoney: CONFIG.MAX_MONEY,

    // 历史记录
    maxStressEver: 0,

    // 成就记录
    achievements: {},

    // 事件计数
    eventCount: {
        slack_off: 0,
        backstab: 0,
        overtime: 0,
        coffee: 0
    },

    // 上次游戏时间
    lastPlayTime: Date.now(),

    // 今日运势修正值
    fortuneModifier: {
        sanityMultiplier: 1.0,
        stressMultiplier: 1.0,
        moneyMultiplier: 1.0,
        slackBonus: 1.0,
        backstabPenalty: 1.0
    }
};

/**
 * 限制数值在范围内
 * @param {number} value - 数值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number}
 */
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

/**
 * 更新数值
 * @param {number} sanityDelta - 理智变化值
 * @param {number} stressDelta - 压力变化值
 * @param {number} moneyDelta - 存款变化值
 * @param {string[]} tags - 事件标签
 * @returns {object} 变化值
 */
export function updateStats(sanityDelta, stressDelta, moneyDelta, tags = []) {
    // 应用运势修正
    const modifiedSanity = Math.round(sanityDelta * gameState.fortuneModifier.sanityMultiplier);
    const modifiedStress = Math.round(stressDelta * gameState.fortuneModifier.stressMultiplier);
    const modifiedMoney = Math.round(moneyDelta * gameState.fortuneModifier.moneyMultiplier);

    // 更新数值
    gameState.sanity = clamp(gameState.sanity + modifiedSanity, 0, gameState.maxSanity);
    gameState.stress = clamp(gameState.stress + modifiedStress, 0, gameState.maxStress);
    gameState.money = clamp(gameState.money + modifiedMoney, 0, gameState.maxMoney);

    // 更新历史最高压力
    if (gameState.stress > gameState.maxStressEver) {
        gameState.maxStressEver = gameState.stress;
    }

    // 统计事件
    tags.forEach(tag => {
        if (gameState.eventCount[tag] !== undefined) {
            gameState.eventCount[tag]++;
        }
    });

    // 应用成就奖励
    applyAchievementRewards(modifiedSanity, modifiedStress, modifiedMoney, tags);

    return {
        sanity: modifiedSanity,
        stress: modifiedStress,
        money: modifiedMoney
    };
}

/**
 * 应用成就奖励
 */
function applyAchievementRewards(sanityDelta, stressDelta, moneyDelta, tags) {
    // 摸鱼宗师奖励：摸鱼时收益+50%
    if (tags.includes('slack_off') && gameState.achievements.slack_master) {
        gameState.sanity = clamp(gameState.sanity + Math.round(sanityDelta * 0.5), 0, gameState.maxSanity);
    }

    // 背锅侠奖励：背锅时压力减少
    if (tags.includes('backstab') && gameState.achievements.backstab_king) {
        gameState.stress = clamp(gameState.stress - 5, 0, gameState.maxStress);
    }

    // 加班战神奖励：加班获得额外金钱
    if (tags.includes('overtime') && gameState.achievements.overtime_warrior) {
        gameState.money = clamp(gameState.money + 20, 0, gameState.maxMoney);
    }

    // 咖啡中毒奖励：咖啡效果翻倍
    if (tags.includes('coffee') && gameState.achievements.coffee_addict) {
        gameState.sanity = clamp(gameState.sanity + Math.round(sanityDelta * 1.0), 0, gameState.maxSanity);
    }

    // 小目标达成奖励：存款利息+10%
    if (gameState.achievements.millionaire) {
        if (moneyDelta > 0) {
            gameState.money = clamp(gameState.money + Math.round(moneyDelta * 0.1), 0, gameState.maxMoney);
        }
    }
}

/**
 * 检查结局
 * @returns {string|null} 结局类型
 */
export function checkEnding() {
    if (gameState.sanity <= 0) return 'sanity_zero';
    if (gameState.money <= 0) return 'money_zero';
    if (gameState.stress >= gameState.maxStress) return 'stress_max';
    if (gameState.sanity >= gameState.maxSanity) return 'sanity_max';
    return null;
}

/**
 * 重置游戏状态
 * @returns {object} 重置后的状态
 */
export function resetGameState() {
    // 检查是否满足情绪大师成就条件（重置时）
    const zenMasterUnlocked = gameState.maxStressEver < CONFIG.ZEN_MASTER_THRESHOLD;

    gameState = {
        sanity: CONFIG.INIT_SANITY,
        stress: zenMasterUnlocked ? CONFIG.INIT_STRESS - 20 : CONFIG.INIT_STRESS,
        money: CONFIG.INIT_MONEY,
        maxSanity: CONFIG.MAX_SANITY,
        maxStress: CONFIG.MAX_STRESS,
        maxMoney: CONFIG.MAX_MONEY,
        maxStressEver: 0,
        achievements: { ...gameState.achievements },
        eventCount: {
            slack_off: 0,
            backstab: 0,
            overtime: 0,
            coffee: 0
        },
        lastPlayTime: Date.now(),
        fortuneModifier: {
            sanityMultiplier: 1.0,
            stressMultiplier: 1.0,
            moneyMultiplier: 1.0,
            slackBonus: 1.0,
            backstabPenalty: 1.0
        }
    };
    return gameState;
}

/**
 * 获取游戏状态副本
 * @returns {object}
 */
export function getGameState() {
    return { ...gameState };
}
