/**
 * 今日运势系统
 */
import { gameState } from "./game.js";
import { getFortuneData, saveFortuneGenerated, isFortuneAppliedToday } from "./storage.js";

/**
 * 运势数据
 */
const fortunes = [
    { id: "fortune_001", text: "今天宜摸鱼，忌开会", buff: "摸鱼收益+50%", debuff: "", multiplier: { slackBonus: 1.5 } },
    { id: "fortune_002", text: "老板心情不错，可以适当划水", buff: "压力减少+30%", debuff: "", multiplier: { stressMultiplier: 0.7 } },
    { id: "fortune_003", text: "周五了，摸鱼无罪！", buff: "所有收益+30%", debuff: "", multiplier: { sanityMultiplier: 1.3, stressMultiplier: 0.7, moneyMultiplier: 1.3 } },
    { id: "fortune_004", text: "今天咖啡半价，多喝点☕", buff: "咖啡效果+50%", debuff: "", multiplier: { coffeeBonus: 1.5 } },
    { id: "fortune_005", text: "今天适合表现自己✨", buff: "金钱收益+30%", debuff: "", multiplier: { moneyMultiplier: 1.3 } },
    { id: "fortune_006", text: "财神眷顾，今天财运不错💰", buff: "存款收益+50%", debuff: "", multiplier: { moneyMultiplier: 1.5 } },
    { id: "fortune_007", text: "今天心情特别好😊", buff: "理智恢复+50%", debuff: "", multiplier: { sanityMultiplier: 1.5 } },
    { id: "fortune_008", text: "老板出差了，今天自由啦🎉", buff: "摸鱼自由，压力自动减少", debuff: "", multiplier: { slackBonus: 2.0, stressMultiplier: 0.5 } },
    { id: "fortune_009", text: "黑色星期一，小心背锅", buff: "", debuff: "背锅概率+50%", multiplier: { backstabPenalty: 1.5 } },
    { id: "fortune_010", text: "今天不宜上班，建议请假😴", buff: "", debuff: "所有事件惩罚+20%", multiplier: { sanityMultiplier: 0.8, stressMultiplier: 1.2, moneyMultiplier: 0.8 } },
    { id: "fortune_011", text: "老板今天心情不好，离远点😠", buff: "", debuff: "压力增加+50%", multiplier: { stressMultiplier: 1.5 } },
    { id: "fortune_012", text: "今天不宜消费，小心钱包💸", buff: "", debuff: "存款减少+30%", multiplier: { moneyMultiplier: 0.7 } },
    { id: "fortune_013", text: "水逆来袭，诸事不顺🌊", buff: "", debuff: "所有收益-20%，惩罚+20%", multiplier: { sanityMultiplier: 0.8, stressMultiplier: 1.2, moneyMultiplier: 0.8, backstabPenalty: 1.2 } },
    { id: "fortune_014", text: "今天容易犯困，效率低下😪", buff: "", debuff: "理智消耗+30%", multiplier: { sanityMultiplier: 0.7 } },
    { id: "fortune_015", text: "老板出差了，但被安排了远程汇报", buff: "摸鱼自由+50%", debuff: "汇报压力+30%", multiplier: { slackBonus: 1.5, stressMultiplier: 1.3 } },
    { id: "fortune_016", text: "今天是发薪日，但信用卡也要还", buff: "存款+200", debuff: "压力+10", multiplier: { instantMoney: 200, instantStress: 10 } },
    { id: "fortune_017", text: "同事请喝奶茶，但热量爆炸🧋", buff: "理智+10", debuff: "压力+5", multiplier: { instantSanity: 10, instantStress: 5 } },
    { id: "fortune_018", text: "今天开会特别多，但可以摸鱼", buff: "摸鱼收益+30%", debuff: "压力+15", multiplier: { slackBonus: 1.3, instantStress: 15 } },
    { id: "fortune_019", text: "欧皇附体！今天运气爆棚🍀", buff: "所有正面效果翻倍", debuff: "", multiplier: { sanityMultiplier: 2.0, stressMultiplier: 0.5, moneyMultiplier: 2.0, slackBonus: 2.0 } },
    { id: "fortune_020", text: "今天不适合做任何决定🤔", buff: "", debuff: "所有选择后果随机化", multiplier: { randomizeEffects: true } },
];

/**
 * 根据ID获取运势对象
 * @param {string} fortuneId
 * @returns {object|null}
 */
function getFortuneById(fortuneId) {
    return fortunes.find(f => f.id === fortuneId) || null;
}

/**
 * 生成随机运势
 * @returns {object}
 */
function generateRandomFortune() {
    return fortunes[Math.floor(Math.random() * fortunes.length)];
}

/**
 * 获取今日运势（从localStorage读取，如果没有则返回null）
 * @returns {object|null}
 */
export function getDailyFortune() {
    const data = getFortuneData();
    if (!data) return null;
    return getFortuneById(data.fortuneId);
}

/**
 * 初始化今日运势
 * - 如果今日已生成运势，应用倍率（不应用即时效果）
 * - 如果今日未生成运势，生成新运势并保存
 */
export function initDailyFortune() {
    const data = getFortuneData();

    if (data) {
        // 今日已生成运势，从localStorage读取并应用倍率
        const fortune = getFortuneById(data.fortuneId);
        if (fortune) {
            applyFortuneMultiplier(fortune);
        }
    } else {
        // 今日未生成运势，生成新运势并保存
        const fortune = generateRandomFortune();
        saveFortuneGenerated(fortune.id);
        applyFortuneMultiplier(fortune);
    }
}

/**
 * 应用运势即时效果（点击关闭按钮时调用）
 */
export function applyFortuneInstantEffect() {
    // 检查是否已应用过
    if (isFortuneAppliedToday()) {
        return;
    }

    const fortune = getDailyFortune();
    if (!fortune) return;

    const mult = fortune.multiplier || {};
    if (mult.instantSanity) {
        gameState.sanity = Math.min(gameState.sanity + mult.instantSanity, gameState.maxSanity);
    }
    if (mult.instantStress) {
        gameState.stress = Math.min(gameState.stress + mult.instantStress, gameState.maxStress);
    }
    if (mult.instantMoney) {
        gameState.money = Math.min(gameState.money + mult.instantMoney, gameState.maxMoney);
    }
}

/**
 * 应用运势倍率
 * @param {object} fortune
 */
function applyFortuneMultiplier(fortune) {
    const mult = fortune.multiplier || {};

    // 重置修正值
    gameState.fortuneModifier = {
        sanityMultiplier: 1.0,
        stressMultiplier: 1.0,
        moneyMultiplier: 1.0,
        slackBonus: 1.0,
        backstabPenalty: 1.0,
        coffeeBonus: 1.0,
        randomizeEffects: false,
    };

    // 应用全局倍率
    if (mult.sanityMultiplier) {
        gameState.fortuneModifier.sanityMultiplier = mult.sanityMultiplier;
    }
    if (mult.stressMultiplier) {
        gameState.fortuneModifier.stressMultiplier = mult.stressMultiplier;
    }
    if (mult.moneyMultiplier) {
        gameState.fortuneModifier.moneyMultiplier = mult.moneyMultiplier;
    }

    // 应用标签专属加成
    if (mult.slackBonus) {
        gameState.fortuneModifier.slackBonus = mult.slackBonus;
    }
    if (mult.backstabPenalty) {
        gameState.fortuneModifier.backstabPenalty = mult.backstabPenalty;
    }
    if (mult.coffeeBonus) {
        gameState.fortuneModifier.coffeeBonus = mult.coffeeBonus;
    }

    // 应用随机化效果标记
    if (mult.randomizeEffects) {
        gameState.fortuneModifier.randomizeEffects = true;
    }
}

/**
 * 渲染运势弹窗内容
 * @returns {string} HTML字符串
 */
export function renderFortuneModal() {
    const fortune = getDailyFortune();
    if (!fortune) return '';

    return `
        <div class="fortune-icon">🔮</div>
        <div class="fortune-text">"${fortune.text}"</div>
        ${fortune.buff ? `<div class="buff-badge">✨ ${fortune.buff}</div>` : ""}
        ${fortune.debuff ? `<div class="buff-badge debuff-badge">💀 ${fortune.debuff}</div>` : ""}
        <button class="btn-primary-bounce" id="closeFortuneModalBtn">摸鱼去咯 🐟</button>
        <div class="fortune-note">📅 今日运势已固定，明日自动刷新</div>
    `;
}
