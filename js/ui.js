/**
 * UI更新函数
 */
import { gameState } from './game.js';

/**
 * 更新状态栏UI
 * @param {object} state - 游戏状态
 */
export function updateStatsUI(state = gameState) {
    // 确保压力值不为负数（显示时保护）
    const displayStress = Math.max(0, state.stress);

    // 更新数值显示（格式：当前值/最大值）
    document.getElementById('sanityValue').textContent = `${state.sanity}/${state.maxSanity}`;
    document.getElementById('stressValue').textContent = `${displayStress}/${state.maxStress}`;
    document.getElementById('moneyValue').textContent = `${state.money}/${state.maxMoney}`;

    // 更新进度条
    const sanityPercent = (state.sanity / state.maxSanity) * 100;
    const stressPercent = (state.stress / state.maxStress) * 100;
    const moneyPercent = (state.money / state.maxMoney) * 100;

    document.getElementById('sanityBar').style.width = `${sanityPercent}%`;
    document.getElementById('stressBar').style.width = `${stressPercent}%`;
    document.getElementById('moneyBar').style.width = `${moneyPercent}%`;

    // 理智过低警告效果
    if (state.sanity <= 30) {
        document.getElementById('sanityValue').classList.add('blink');
    } else {
        document.getElementById('sanityValue').classList.remove('blink');
    }

    // 压力过高警告效果
    if (state.stress >= 70) {
        document.getElementById('stressValue').classList.add('shake');
        document.getElementById('gameContainer').classList.add('shake');
    } else {
        document.getElementById('stressValue').classList.remove('shake');
        document.getElementById('gameContainer').classList.remove('shake');
    }
}

/**
 * 显示数值变化浮动动画
 * @param {number} value - 变化值
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 */
export function showNumberPop(value, x, y) {
    const popup = document.createElement('div');
    popup.className = `number-popup ${value >= 0 ? 'positive' : 'negative'}`;
    popup.textContent = value >= 0 ? `+${value}` : value;

    // 设置位置
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    document.body.appendChild(popup);

    // 动画结束后移除
    setTimeout(() => {
        popup.remove();
    }, 1000);
}

/**
 * 设置反馈区域内容
 * @param {string} feedbackText - 反馈文本
 * @param {string} changes - 数值变化
 */
export function setFeedback(feedbackText, changes) {
    const feedbackDiv = document.getElementById('feedbackArea');
    feedbackDiv.innerHTML = `<span>✨</span><span>${feedbackText}</span><span>${changes}</span>`;
}

/**
 * 重置反馈区域
 * @param {string} message - 消息文本
 */
export function resetFeedback(message) {
    const feedbackDiv = document.getElementById('feedbackArea');
    feedbackDiv.innerHTML = `<span>💡</span><span>${message}</span>`;
}

/**
 * 显示Toast提示
 * @param {string} message - 消息文本
 * @param {string} icon - 图标
 */
export function showToast(message, icon = '🎉') {
    const toast = document.getElementById('toastUnlock');
    toast.textContent = `${icon} ${message}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}
