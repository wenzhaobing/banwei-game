/**
 * 成就系统
 */
import { achievements } from './events.js';
import { gameState } from './game.js';
import { showToast } from './ui.js';

/**
 * 检查并解锁成就
 * @returns {array} 已解锁的成就列表
 */
export function checkAchievements() {
    const unlocked = [];
    for (const [id, ach] of Object.entries(achievements)) {
        if (!gameState.achievements[id] && ach.condition(gameState)) {
            gameState.achievements[id] = true;
            unlocked.push(ach);
            showToast(`解锁成就：${ach.name}`, ach.icon);
        }
    }
    return unlocked;
}

/**
 * 渲染成就墙
 * @returns {string} HTML字符串
 */
export function renderAchievements() {
    const unlockedCount = Object.values(gameState.achievements).filter(v => v).length;
    const totalCount = Object.keys(achievements).length;
    const percent = Math.floor(unlockedCount / totalCount * 100);

    let html = `
        <div class="achievement-stats">
            <h4>🏆 成就进度</h4>
            <div class="progress-bar-container">
                <div class="progress-fill" style="width: ${percent}%"></div>
            </div>
            <div>${unlockedCount} / ${totalCount} (${percent}%)</div>
        </div>
        <div class="achievement-grid">
    `;

    for (const [id, ach] of Object.entries(achievements)) {
        const unlocked = gameState.achievements[id];
        const current = ach.current(gameState);

        html += `
            <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-name">${ach.name}</div>
                <div class="achievement-desc">${ach.desc}</div>
                ${!unlocked ? `<div class="achievement-progress">📊 ${current}/${ach.target}</div>` : ''}
                <div class="achievement-reward">🎁 ${ach.reward}</div>
            </div>
        `;
    }

    return html + '</div>';
}
