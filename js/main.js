/**
 * 游戏主入口
 */
import { gameState, updateStats, checkEnding, resetGameState } from './game.js';
import { events } from './events.js';
import { saveGame, loadGame, applyOfflineRewards } from './storage.js';
import { updateStatsUI, showNumberPop, setFeedback, resetFeedback, showToast } from './ui.js';
import { checkAchievements, renderAchievements } from './achievements.js';
import { showEnding } from './endings.js';
import { renderFortuneModal, applyDailyFortune } from './fortune.js';

// 当前事件
let currentEvent = null;

// 游戏是否结束
let isGameOver = false;

/**
 * 应用选项效果
 * @param {object} opt - 选项数据
 * @param {HTMLElement} btnElement - 按钮元素
 */
function applyEffects(opt, btnElement) {
    if (isGameOver) return;

    // 获取按钮位置用于显示动画
    const rect = btnElement.getBoundingClientRect();
    const { effects, feedback, tags } = opt;

    // 更新数值
    const changes = updateStats(
        effects.sanity || 0,
        effects.stress || 0,
        effects.money || 0,
        tags
    );

    // 显示数值变化动画
    Object.entries(changes).forEach(([stat, value]) => {
        if (value !== 0) {
            showNumberPop(value, rect.left + rect.width / 2, rect.top);
        }
    });

    // 检查成就
    checkAchievements();

    // 更新UI
    updateStatsUI(gameState);

    // 显示反馈
    const changesText = Object.entries(effects)
        .map(([k, v]) => {
            const icon = k === 'sanity' ? '💖' : k === 'stress' ? '😫' : '💰';
            return `${v > 0 ? '+' : ''}${v}${icon}`;
        })
        .join(' ');
    setFeedback(feedback, changesText);

    // 保存游戏
    saveGame();

    // 检查结局
    const ending = checkEnding();
    if (ending) {
        isGameOver = true;
        showEnding(ending, () => {
            resetGameState();
            isGameOver = false;
            updateStatsUI(gameState);
            loadRandomEvent();
            resetFeedback('人生重启，开始新的摸鱼之旅！');
            saveGame();
        });
    } else {
        // 延迟加载下一个事件
        setTimeout(loadRandomEvent, 1500);
    }
}

/**
 * 加载随机事件
 */
function loadRandomEvent() {
    if (isGameOver) return;

    // 随机选择一个事件
    currentEvent = events[Math.floor(Math.random() * events.length)];

    // 更新事件描述
    document.getElementById('eventDesc').textContent = currentEvent.desc;

    // 清空并重新生成选项按钮
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    currentEvent.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';

        // 生成选项显示内容
        const emoji = opt.text.split(' ')[1] || '📌';
        const text = opt.text;

        const effectsText = Object.entries(opt.effects)
            .map(([k, v]) => {
                const icon = k === 'sanity' ? '💖' : k === 'stress' ? '😫' : '💰';
                return `${v > 0 ? '+' : ''}${v}${icon}`;
            })
            .join(' ');

        btn.innerHTML = `
            <span class="option-emoji">${emoji}</span>
            <div class="option-text">${text}</div>
            <div class="option-effect">${effectsText}</div>
        `;

        btn.onclick = () => applyEffects(opt, btn);
        container.appendChild(btn);
    });

    // 重置反馈区域
    resetFeedback('选择你的行动...');
}

/**
 * 显示今日运势弹窗
 */
function showFortune() {
    const modal = document.getElementById('fortuneModal');
    document.getElementById('fortuneContent').innerHTML = renderFortuneModal();
    modal.style.display = 'flex';

    // 绑定关闭按钮事件
    document.getElementById('closeFortuneModalBtn').onclick = () => {
        modal.style.display = 'none';
    };
}

/**
 * 显示成就墙弹窗
 */
function showAchievements() {
    const modal = document.getElementById('achievementModal');
    document.getElementById('achievementContent').innerHTML = renderAchievements();
    modal.style.display = 'flex';
}

/**
 * 重置游戏
 */
function resetGame() {
    // 显示自定义确认弹窗
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'flex';

    // 取消按钮 - 关闭弹窗
    document.getElementById('confirmCancelBtn').onclick = () => {
        modal.style.display = 'none';
    };

    // 确定按钮 - 确认重开
    document.getElementById('confirmOkBtn').onclick = () => {
        modal.style.display = 'none';
        resetGameState();
        isGameOver = false;
        updateStatsUI(gameState);
        loadRandomEvent();
        resetFeedback('人生重启，开始新的摸鱼之旅！');
        saveGame();
        showToast('游戏已重置', '🔄');
    };

    // 关闭按钮 - 关闭弹窗
    document.getElementById('closeConfirmBtn').onclick = () => {
        modal.style.display = 'none';
    };

    // 点击遮罩关闭弹窗
    modal.onclick = (e) => {
        if (e.target.id === 'confirmModal') {
            modal.style.display = 'none';
        }
    };
}

/**
 * 初始化游戏
 */
function init() {
    // 加载存档
    const savedState = loadGame();
    if (savedState) {
        Object.assign(gameState, savedState);
        // 确保数值不为负数
        gameState.sanity = Math.max(0, gameState.sanity);
        gameState.stress = Math.max(0, gameState.stress);
        gameState.money = Math.max(0, gameState.money);
    }

    // 应用离线收益
    const offlineRewards = applyOfflineRewards();
    if (offlineRewards) {
        const msg = `离线${offlineRewards.hours}小时，获得 ${offlineRewards.rewards.sanity > 0 ? '+' : ''}${offlineRewards.rewards.sanity}💖 ${offlineRewards.rewards.stress < 0 ? '' : '+'}${offlineRewards.rewards.stress}😫 ${offlineRewards.rewards.money > 0 ? '+' : ''}${offlineRewards.rewards.money}💰`;
        showToast(msg, '🎁');
    }

    // 应用今日运势
    applyDailyFortune();

    // 初始化UI
    updateStatsUI(gameState);
    loadRandomEvent();

    // 绑定事件监听器
    document.getElementById('fortuneBtn').onclick = showFortune;
    document.getElementById('achievementBtn').onclick = showAchievements;
    document.getElementById('resetBtn').onclick = resetGame;

    // 关闭弹窗事件
    document.getElementById('closeFortuneBtn').onclick = () => {
        document.getElementById('fortuneModal').style.display = 'none';
    };
    document.getElementById('closeAchievementBtn').onclick = () => {
        document.getElementById('achievementModal').style.display = 'none';
    };

    // 点击遮罩关闭弹窗
    document.getElementById('fortuneModal').onclick = (e) => {
        if (e.target.id === 'fortuneModal') {
            document.getElementById('fortuneModal').style.display = 'none';
        }
    };
    document.getElementById('achievementModal').onclick = (e) => {
        if (e.target.id === 'achievementModal') {
            document.getElementById('achievementModal').style.display = 'none';
        }
    };

    // 注册Service Worker（PWA支持）
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('Service Worker注册失败:', err);
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
