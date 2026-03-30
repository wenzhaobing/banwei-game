/**
 * 今日运势系统
 */
import { gameState } from './game.js';

/**
 * 运势数据
 */
const fortunes = [
    { text: "今天宜摸鱼，忌开会", buff: "摸鱼收益+50%", debuff: "", multiplier: { slackBonus: 1.5 } },
    { text: "老板心情不错，可以适当划水", buff: "压力减少+30%", debuff: "", multiplier: { stressMultiplier: 0.7 } },
    { text: "周五了，摸鱼无罪！", buff: "所有收益+30%", debuff: "", multiplier: { sanityMultiplier: 1.3, moneyMultiplier: 1.3 } },
    { text: "黑色星期一，小心背锅", buff: "", debuff: "背锅概率+50%", multiplier: { backstabPenalty: 1.5 } },
    { text: "今天适合喝咖啡☕", buff: "咖啡效果提升", debuff: "", multiplier: { coffeeEffect: 1.5 } },
    { text: "水逆期，建议低调行事", buff: "", debuff: "全属性-10%", multiplier: { allDebuff: 0.9 } },
    { text: "luckyday！好事连连", buff: "收益翻倍", debuff: "", multiplier: { allBonus: 2.0 } },
    { text: "又是周一，心累...", buff: "", debuff: "理智-10%", multiplier: { sanityDebuff: 0.9 } }
];

/**
 * 获取今日运势
 * @returns {object}
 */
export function getDailyFortune() {
    // 使用日期作为种子，保证每天运势相同
    const seed = new Date().toDateString();
    const index = seed.length % fortunes.length;
    return fortunes[index];
}

/**
 * 应用今日运势
 * @returns {object}
 */
export function applyDailyFortune() {
    const fortune = getDailyFortune();

    // 重置修正值
    gameState.fortuneModifier = {
        sanityMultiplier: 1.0,
        stressMultiplier: 1.0,
        moneyMultiplier: 1.0,
        slackBonus: 1.0,
        backstabPenalty: 1.0
    };

    // 应用运势修正
    const mult = fortune.multiplier || {};

    if (mult.slackBonus) {
        gameState.fortuneModifier.slackBonus = mult.slackBonus;
    }
    if (mult.stressMultiplier) {
        gameState.fortuneModifier.stressMultiplier = mult.stressMultiplier;
    }
    if (mult.moneyMultiplier) {
        gameState.fortuneModifier.moneyMultiplier = mult.moneyMultiplier;
    }
    if (mult.backstabPenalty) {
        gameState.fortuneModifier.backstabPenalty = mult.backstabPenalty;
    }
    if (mult.allBonus) {
        gameState.fortuneModifier.sanityMultiplier *= mult.allBonus;
        gameState.fortuneModifier.moneyMultiplier *= mult.allBonus;
    }
    if (mult.allDebuff) {
        // 减少所有正面收益，增加压力
        gameState.fortuneModifier.sanityMultiplier *= mult.allDebuff;
        gameState.fortuneModifier.stressMultiplier *= (2 - mult.allDebuff);
        gameState.fortuneModifier.moneyMultiplier *= mult.allDebuff;
    }
    if (mult.sanityDebuff) {
        gameState.fortuneModifier.sanityMultiplier *= mult.sanityDebuff;
    }

    return fortune;
}

/**
 * 渲染运势弹窗内容
 * @returns {string} HTML字符串
 */
export function renderFortuneModal() {
    const fortune = getDailyFortune();

    return `
        <div class="fortune-icon">🔮</div>
        <div class="fortune-text">"${fortune.text}"</div>
        ${fortune.buff ? `<div class="buff-badge">✨ ${fortune.buff}</div>` : ''}
        ${fortune.debuff ? `<div class="buff-badge debuff-badge">💀 ${fortune.debuff}</div>` : ''}
        <button class="option-btn" id="closeFortuneModalBtn" style="margin-top: 20px;">摸鱼去咯 🐟</button>
    `;
}
