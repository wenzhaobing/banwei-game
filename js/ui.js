/**
 * UI更新函数
 */
import { gameState } from './game.js';

/**
 * 数值滚动动画
 * @param {HTMLElement} element - 要更新的元素
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} duration - 动画时长(ms)
 * @param {string} suffix - 后缀文本
 */
function animateValue(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    const diff = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + diff * easeProgress);
        element.textContent = `${current}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * 更新状态栏UI
 * @param {object} state - 游戏状态
 * @param {boolean} animate - 是否播放动画
 */
export function updateStatsUI(state = gameState, animate = true) {
    const displayStress = Math.max(0, state.stress);

    if (animate) {
        const oldSanity = parseInt(document.getElementById('sanityValue').textContent.split('/')[0]) || 0;
        const oldStress = parseInt(document.getElementById('stressValue').textContent.split('/')[0]) || 0;
        const oldMoney = parseInt(document.getElementById('moneyValue').textContent.split('/')[0]) || 0;

        animateValue(document.getElementById('sanityValue'), oldSanity, state.sanity, 400, `/${state.maxSanity}`);
        animateValue(document.getElementById('stressValue'), oldStress, displayStress, 400, `/${state.maxStress}`);
        animateValue(document.getElementById('moneyValue'), oldMoney, state.money, 400, `/${state.maxMoney}`);
    } else {
        document.getElementById('sanityValue').textContent = `${state.sanity}/${state.maxSanity}`;
        document.getElementById('stressValue').textContent = `${displayStress}/${state.maxStress}`;
        document.getElementById('moneyValue').textContent = `${state.money}/${state.maxMoney}`;
    }

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
 * 显示数值飘起动画 - 飘向对应状态栏并高亮
 * @param {number} value - 数值变化
 * @param {number} x - X坐标（按钮中心）
 * @param {number} y - Y坐标（按钮顶部）
 * @param {string} statType - 属性类型 (sanity/stress/money)
 */
export function showNumberPop(value, x, y, statType) {
    let targetId;
    if (statType === 'sanity') {
        targetId = 'sanityValue';
    } else if (statType === 'stress') {
        targetId = 'stressValue';
    } else if (statType === 'money') {
        targetId = 'moneyValue';
    } else {
        return;
    }
    
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    const popup = document.createElement('div');
    popup.className = `number-popup ${value >= 0 ? 'positive' : 'negative'}`;

    const icon = statType === 'sanity' ? '💖' : statType === 'stress' ? '😫' : '💰';
    popup.textContent = `${value >= 0 ? '+' : ''}${value}${icon}`;

    popup.style.position = 'fixed';
    popup.style.zIndex = '9999';
    popup.style.pointerEvents = 'none';
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.transform = 'translate(-50%, -100%)';
    popup.style.opacity = '1';
    popup.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    document.body.appendChild(popup);

    requestAnimationFrame(() => {
        popup.style.left = `${targetX}px`;
        popup.style.top = `${targetY}px`;
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.opacity = '0';
    });

    setTimeout(() => {
        popup.remove();
        highlightStatItem(statType);
    }, 600);
}

/**
 * 高亮状态栏条目 - 冲击效果
 * @param {string} statType - 属性类型
 */
function highlightStatItem(statType) {
    const valueEl = document.getElementById(
        statType === 'sanity' ? 'sanityValue' : statType === 'stress' ? 'stressValue' : 'moneyValue'
    );
    if (!valueEl) return;

    valueEl.classList.add('stat-highlight');
    setTimeout(() => {
        valueEl.classList.remove('stat-highlight');
    }, 300);
}

/**
 * 设置反馈区域内容
 * @param {string} feedbackText - 反馈文本
 * @param {string} changes - 数值变化
 */
export function setFeedback(feedbackText, changes) {
    const feedbackDiv = document.getElementById('feedbackArea');
    const changesHtml = changes ? `<span>${changes}</span>` : '';
    feedbackDiv.innerHTML = `<span>✨</span><span>${feedbackText}</span>${changesHtml}`;
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
