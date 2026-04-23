/**
 * 今日运势系统 - 版本2.0
 * 基于周几 + 特殊节日的运势系统
 */
import { gameState } from "./game.js";
import { getFortuneData, saveFortuneGenerated, isFortuneAppliedToday } from "./storage.js";
import { specialDateFortunes, weekdayFortunes, fortunes } from './data/fortunes.js';

/**
 * 获取星期几名称
 * @param {number} weekday - 星期几 (0-6, 0=周日)
 * @returns {string}
 */
function getWeekdayName(weekday) {
    const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return names[weekday];
}

/**
 * 检查特殊日期（节日/纪念日）
 * @returns {object|null}
 */
function checkSpecialDate() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const key = `${month}-${day}`;
    
    return specialDateFortunes[key] || null;
}

/**
 * 获取星期运势
 * @returns {object|null}
 */
function getWeekdayFortune() {
    const now = new Date();
    const weekday = now.getDay();
    const weekdayName = getWeekdayName(weekday);
    
    const dayFortunes = weekdayFortunes[weekdayName];
    if (!dayFortunes || dayFortunes.length === 0) return null;
    
    // 随机选择一条运势
    const randomIndex = Math.floor(Math.random() * dayFortunes.length);
    const fortune = { ...dayFortunes[randomIndex] };
    
    // 添加星期前缀
    fortune.text = `【${weekdayName}】${fortune.text}`;
    
    return fortune;
}

/**
 * 根据ID获取运势对象
 * @param {string} fortuneId
 * @returns {object|null}
 */
function getFortuneById(fortuneId) {
    return fortunes.find(f => f.id === fortuneId) || null;
}

/**
 * 生成今日运势（基于周几 + 特殊节日）
 * @returns {object}
 */
function generateDailyFortune() {
    // 1. 优先检查特殊日期（节日优先于星期）
    const special = checkSpecialDate();
    if (special) {
        return { ...special };
    }
    
    // 2. 生成星期运势
    const weekdayFortune = getWeekdayFortune();
    if (weekdayFortune) {
        return weekdayFortune;
    }
    
    // 3. 默认运势（兜底）
    return {
        id: 'default',
        type: 'neutral',
        text: '今天是个普通的一天',
        buff: '',
        debuff: '',
        advice: '今天正常发挥就好。',
        icon: '📅',
        multiplier: {}
    };
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
        const fortune = generateDailyFortune();
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
 * 获取运势类型标题
 * @param {string} type - 运势类型
 * @returns {string}
 */
function getFortuneTypeTitle(type) {
    const titles = {
        good: '大吉',
        bad: '水逆',
        neutral: '平平'
    };
    return titles[type] || '平平';
}

/**
 * 渲染运势弹窗内容
 * @returns {string} HTML字符串
 */
export function renderFortuneModal() {
    const fortune = getDailyFortune();
    if (!fortune) return '';

    const type = fortune.type || 'neutral';
    const typeTitle = getFortuneTypeTitle(type);
    const icon = fortune.icon || '🔮';

    return `
        <div class="fortune-modal-content fortune-${type}">
            <div class="fortune-icon">${icon}</div>
            <div class="fortune-type-title">今日运势 · ${typeTitle}</div>
            <div class="fortune-text">"${fortune.text}"</div>
            <div class="fortune-effects">
                ${fortune.buff ? `<span class="buff-badge">✨ ${fortune.buff}</span>` : ""}
                ${fortune.debuff ? `<span class="debuff-badge">💀 ${fortune.debuff}</span>` : ""}
            </div>
            <div class="fortune-advice">
                💡 小贴士：${fortune.advice || '今天正常发挥就好。'}
            </div>
            <button class="fortune-btn fortune-btn-${type}" id="closeFortuneModalBtn">
                ${type === 'good' ? '开始摸鱼 🐟' : type === 'bad' ? '知道了，保重 💪' : '开始上班 💼'}
            </button>
            <div class="fortune-note">📅 今日运势已固定，明日自动刷新</div>
        </div>
    `;
}

/**
 * 获取运势小提示内容（用于选项卡片上方显示）
 * @returns {object|null} { type, icon, text, detail }
 */
export function getFortuneTip() {
    const fortune = getDailyFortune();
    if (!fortune) return null;

    const type = fortune.type || 'neutral';
    const icons = {
        good: '🍀',
        bad: '🌊',
        neutral: '📅'
    };

    // 生成效果详情
    let detail = '';
    if (fortune.buff && fortune.debuff) {
        detail = `${fortune.buff} · ${fortune.debuff}`;
    } else if (fortune.buff) {
        detail = fortune.buff;
    } else if (fortune.debuff) {
        detail = fortune.debuff;
    } else {
        detail = '无特殊效果';
    }

    return {
        type,
        icon: fortune.icon || icons[type],
        text: fortune.advice || '今天正常发挥就好。',
        detail
    };
}
