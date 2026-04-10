/**
 * 游戏主入口
 */
import { gameState, updateStats, checkEnding, resetGameState } from './game.js';
import { events } from './events.js';
import { saveGame, loadGame, applyOfflineRewards, isFortuneAppliedToday, clearFortuneStatus, saveFortuneApplied } from './storage.js';
import { updateStatsUI, showNumberPop, setFeedback, resetFeedback, showToast } from './ui.js';
import { checkAchievements, renderAchievements } from './achievements.js';
import { showEnding } from './endings.js';
import { renderFortuneModal, initDailyFortune, applyFortuneInstantEffect } from './fortune.js';

// 当前事件
let currentEvent = null;

// 游戏是否结束
let isGameOver = false;

/**
 * 统一设置弹窗关闭逻辑
 * @param {string} modalId - 弹窗元素ID
 * @param {string} closeBtnId - 关闭按钮元素ID（可选）
 */
function setupModalClose(modalId, closeBtnId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (closeBtnId) {
        const closeBtn = document.getElementById(closeBtnId);
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
            };
        }
    }

    modal.onclick = (e) => {
        if (e.target.id === modalId) {
            modal.style.display = 'none';
        }
    };
}

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

    // 显示数值变化动画 - 依次飘向对应状态栏
    const changeEntries = Object.entries(changes).filter(([, value]) => value !== 0);
    changeEntries.forEach(([stat, value], index) => {
        const statType = stat;  // game.js 返回的是 sanity, stress, money
        setTimeout(() => {
            showNumberPop(value, rect.left + rect.width / 2, rect.top, statType);
        }, index * 150);
    });

    // 计算所有动画完成的时间（600ms动画 + 间隔150ms * 最后一个索引）
    const animationDuration = 600 + (changeEntries.length - 1) * 150;

    // 延迟更新UI，等待飘动画完成
    setTimeout(() => {
        updateStatsUI(gameState);
    }, animationDuration);

    // 显示反馈（不显示具体数值变化，只显示反馈文本）
    setFeedback(feedback, '');

    // 保存游戏
    saveGame();

    // 检查结局
    const ending = checkEnding();
    if (ending) {
        isGameOver = true;
        showEnding(ending, () => {
            resetGameState();
            isGameOver = false;
            updateStatsUI(gameState, false);
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
        const text = opt.text.split(' ')[0] || '';

        btn.innerHTML = `
            <span class="option-emoji">${emoji}</span>
            <div class="option-text">${text}</div>
        `;

        btn.onclick = () => applyEffects(opt, btn);
        container.appendChild(btn);
    });

    // 重置反馈区域
    resetFeedback('选择你的行动...');
}

/**
 * 显示今日运势弹窗
 * - applied=false 时显示弹窗
 * - applied=true 时不显示弹窗
 */
function showFortune() {
    // 如果今日运势即时效果已应用，不显示弹窗
    if (isFortuneAppliedToday()) {
        return;
    }

    const modal = document.getElementById('fortuneModal');
    document.getElementById('fortuneContent').innerHTML = renderFortuneModal();
    modal.style.display = 'flex';

    // 绑定关闭按钮事件
    document.getElementById('closeFortuneModalBtn').onclick = () => {
        modal.style.display = 'none';
        // 应用即时效果
        applyFortuneInstantEffect();
        // 标记已应用
        saveFortuneApplied();
        // 更新UI并保存游戏
        updateStatsUI(gameState);
        saveGame();
    };
}

/**
 * 应用即时效果（已移至 fortune.js）
 * 此函数保留用于兼容
 */
function applyInstantEffects() {
    // 已迁移至 fortune.js 的 applyInstantEffect
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
        clearFortuneStatus();  // 清除运势状态
        resetGameState();
        isGameOver = false;
        initDailyFortune();  // 重新生成运势
        updateStatsUI(gameState, false);
        loadRandomEvent();
        resetFeedback('人生重启，开始新的摸鱼之旅！');
        saveGame();
        showFortune();  // 显示新运势弹窗
        showToast('游戏已重置', '🔄');
    };

    // 关闭按钮 - 关闭弹窗
    // document.getElementById('closeConfirmBtn').onclick = () => {
    //     modal.style.display = 'none';
    // };
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

    // 初始化今日运势（需要在离线收益之前，以便离线收益受到运势倍率影响）
    initDailyFortune();

    // 应用离线收益
    const offlineRewards = applyOfflineRewards();
    if (offlineRewards) {
        const msg = `离线${offlineRewards.hours}小时，获得 ${offlineRewards.rewards.sanity > 0 ? '+' : ''}${offlineRewards.rewards.sanity}💖 ${offlineRewards.rewards.stress < 0 ? '' : '+'}${offlineRewards.rewards.stress}😫 ${offlineRewards.rewards.money > 0 ? '+' : ''}${offlineRewards.rewards.money}💰`;
        showToast(msg, '🎁');
    }

    // 初始化UI
    updateStatsUI(gameState, false);
    loadRandomEvent();

    // 显示今日运势弹窗（applied=false 时才显示）
    showFortune();

    // 绑定事件监听器
    document.getElementById('fortuneBtn').onclick = showFortune;
    document.getElementById('achievementBtn').onclick = showAchievements;
    document.getElementById('resetBtn').onclick = resetGame;

    // 关闭弹窗事件
    setupModalClose('achievementModal', 'closeAchievementBtn');

    // 注册Service Worker（PWA支持）
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('Service Worker注册失败:', err);
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
