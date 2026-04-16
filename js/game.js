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
        total: 0,
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
        backstabPenalty: 1.0,
        coffeeBonus: 1.0,
        randomizeEffects: false,
    }
};

/**
 * 限制数值在范围内
 * @param {number} value - 数值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number}
 */
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

/**
 * 应用运势修正到效果数值
 * @param {object} effects - 原始效果 { sanity, stress, money }
 * @param {string[]} tags - 事件标签
 * @returns {object} 修正后的效果
 */
function applyModifier(effects, tags) {
    const result = { ...effects };
    const mod = gameState.fortuneModifier;

    // 1. 随机化效果（优先级最高）
    if (mod.randomizeEffects) {
        const randomFactor = () => 0.5 + Math.random() * 0.5;
        result.sanity = Math.floor(result.sanity * randomFactor());
        result.stress = Math.floor(result.stress * randomFactor());
        result.money = Math.floor(result.money * randomFactor());
        return result;
    }

    // 2. 应用标签专属加成
    if (tags.includes('slack_off') && mod.slackBonus !== 1.0) {
        result.sanity = Math.floor(result.sanity * mod.slackBonus);
        result.stress = Math.floor(result.stress * mod.slackBonus);
        result.money = Math.floor(result.money * mod.slackBonus);
    }

    if (tags.includes('backstab') && mod.backstabPenalty !== 1.0) {
        result.sanity = Math.floor(result.sanity * mod.backstabPenalty);
        result.stress = Math.floor(result.stress * mod.backstabPenalty);
        result.money = Math.floor(result.money * mod.backstabPenalty);
    }

    if (tags.includes('coffee') && mod.coffeeBonus !== 1.0) {
        result.sanity = Math.floor(result.sanity * mod.coffeeBonus);
        result.stress = Math.floor(result.stress * mod.coffeeBonus);
    }

    // 3. 应用全局倍率
    if (mod.sanityMultiplier !== 1.0) {
        result.sanity = Math.floor(result.sanity * mod.sanityMultiplier);
    }
    if (mod.stressMultiplier !== 1.0) {
        result.stress = Math.floor(result.stress * mod.stressMultiplier);
    }
    if (mod.moneyMultiplier !== 1.0) {
        result.money = Math.floor(result.money * mod.moneyMultiplier);
    }

    return result;
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
    // 1. 先应用运势修正
    let modified = applyModifier({ sanity: sanityDelta, stress: stressDelta, money: moneyDelta }, tags);

    // 2. 再应用成就奖励修正
    modified = applyAchievementModifier(modified, tags);

    // 更新数值
    gameState.sanity = clamp(gameState.sanity + modified.sanity, 0, gameState.maxSanity);
    gameState.stress = clamp(gameState.stress + modified.stress, 0, gameState.maxStress);
    gameState.money = clamp(gameState.money + modified.money, 0, gameState.maxMoney);

    // 更新历史最高压力
    if (gameState.stress > gameState.maxStressEver) {
        gameState.maxStressEver = gameState.stress;
    }

    // 统计事件
    gameState.eventCount.total++;
    tags.forEach(tag => {
        if (gameState.eventCount[tag] !== undefined) {
            gameState.eventCount[tag]++;
        }
    });

    return {
        sanity: modified.sanity,
        stress: modified.stress,
        money: modified.money
    };
}

/**
 * 应用成就奖励修正到效果数值
 * @param {object} effects - 原始效果 { sanity, stress, money }
 * @param {string[]} tags - 事件标签
 * @returns {object} 修正后的效果
 */
function applyAchievementModifier(effects, tags) {
    const result = { ...effects };

    // 摸鱼宗师奖励：摸鱼时所有收益+50%
    if (tags.includes('slack_off') && gameState.achievements.slack_master) {
        result.sanity = Math.floor(result.sanity * 1.5);
        result.stress = Math.floor(result.stress * 1.5);
        result.money = Math.floor(result.money * 1.5);
    }

    // 背锅侠奖励：背锅时压力惩罚减少50%
    if (tags.includes('backstab') && gameState.achievements.backstab_king) {
        result.stress = Math.floor(result.stress * 0.5);
    }

    // 加班战神奖励：加班获得额外金钱+20
    if (tags.includes('overtime') && gameState.achievements.overtime_warrior) {
        result.money += 20;
    }

    // 咖啡中毒奖励：咖啡效果翻倍（在原有效果基础上再增加100%）
    if (tags.includes('coffee') && gameState.achievements.coffee_addict) {
        result.sanity += result.sanity;
        result.stress += result.stress;
    }

    // 小目标达成奖励：存款正收益时额外+10%
    if (gameState.achievements.millionaire && result.money > 0) {
        result.money += Math.floor(result.money * 0.1);
    }

    return result;
}

/**
 * 检查结局
 * @returns {object|null} 结局对象 { type: string, isGood: boolean } 或 null
 */
export function checkEnding() {
    if (gameState.sanity <= CONFIG.ENDING_SANITY_ZERO) {
        return { type: 'sanity_zero', isGood: false };
    }
    if (gameState.money <= CONFIG.ENDING_MONEY_ZERO) {
        return { type: 'money_zero', isGood: false };
    }
    if (gameState.stress >= CONFIG.ENDING_STRESS_MAX) {
        return { type: 'stress_max', isGood: false };
    }
    if (gameState.sanity >= CONFIG.ENDING_SANITY_MAX) {
        return { type: 'sanity_max', isGood: true };
    }
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
            total: 0,
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
            backstabPenalty: 1.0,
            coffeeBonus: 1.0,
            randomizeEffects: false,
        }
    };
    return gameState;
}
