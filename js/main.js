/**
 * 游戏主入口
 */
import { gameState, updateStats, checkEnding, resetGameState } from './game.js';
import { events } from './events.js';
import { saveGame, loadGame, applyOfflineRewards, isFortuneAppliedToday, saveFortuneApplied, loadSettings, updateSetting, debouncedSave, immediateSave } from './storage.js';
import { updateStatsUI, showNumberPop, setFeedback, resetFeedback, showToast, scheduleUIUpdate } from './ui.js';
import { checkAchievements, renderAchievements } from './achievements.js';
import { showEnding, setEndingContext } from './endings.js';
import { renderFortuneModal, initDailyFortune, applyFortuneInstantEffect, getFortuneTip } from './fortune.js';
import { soundManager } from './sound.js';
import { vibrationManager } from './vibration.js';

// 当前事件
let currentEvent = null;

// 上一次事件ID（用于避免连续重复）
let lastEventId = null;

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

    vibrationManager.click();
    soundManager.click();

    const rect = btnElement.getBoundingClientRect();
    const { effects, feedback, tags } = opt;

    const changes = updateStats(
        effects.sanity || 0,
        effects.stress || 0,
        effects.money || 0,
        tags
    );

    const changeEntries = Object.entries(changes).filter(([, value]) => value !== 0);
    changeEntries.forEach(([stat, value], index) => {
        const statType = stat;
        setTimeout(() => {
            showNumberPop(value, rect.left + rect.width / 2, rect.top, statType);
        }, index * 150);
    });

    const animationDuration = 600 + (changeEntries.length - 1) * 150;

    // 动画结束后使用批量UI更新
    setTimeout(() => {
        scheduleUIUpdate(gameState);
    }, animationDuration);

    setFeedback(feedback, '');

    // 常规操作使用防抖保存
    debouncedSave();

    if (tags && tags.includes('slack_off')) {
        soundManager.slack();
    }

    const ending = checkEnding();
    if (ending) {
        isGameOver = true;
        soundManager.ending(ending.isGood);
        vibrationManager.ending();
        // 设置结局上下文（游戏状态和轮数）
        setEndingContext(gameState, gameState.eventCount?.total || 0);
        showEnding(ending.type, () => {
            resetGameState();
            isGameOver = false;
            updateStatsUI(gameState, false);
            loadRandomEvent();
            resetFeedback('人生重启，开始新的摸鱼之旅！');
            immediateSave();
        });
    } else {
        setTimeout(loadRandomEvent, 1500);
    }
}

/**
 * 加载随机事件（避免连续重复）
 */
function loadRandomEvent() {
    if (isGameOver) return;

    // 过滤掉上一次的事件，避免连续重复
    let availableEvents = lastEventId
        ? events.filter(e => e.id !== lastEventId)
        : events;

    // 如果过滤后没有可用事件（理论上不会发生），则使用全部事件
    if (availableEvents.length === 0) {
        availableEvents = events;
    }

    // 随机选择一个事件
    currentEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];

    // 记录当前事件ID
    lastEventId = currentEvent.id;

    // 更新事件描述
    document.getElementById('eventTitle').textContent = currentEvent.title;
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
            <div class="option-text">${text}</div>
            <span class="option-emoji">${emoji}</span>
        `;

        btn.onclick = () => applyEffects(opt, btn);
        container.appendChild(btn);
    });

    // 重置反馈区域
    resetFeedback('选择你的行动...');
}

/**
 * 更新运势小提示显示
 */
function updateFortuneEffectDisplay() {
    const panel = document.getElementById('fortuneEffectPanel');
    const tipIcon = document.getElementById('fortuneTipIcon');
    const tipText = document.getElementById('fortuneTipText');
    const tipDetail = document.getElementById('fortuneTipDetail');

    if (!panel || !tipText || !tipDetail) return;

    const tip = getFortuneTip();
    if (tip) {
        // 更新图标
        if (tipIcon) tipIcon.textContent = tip.icon;

        // 更新文本
        tipText.textContent = `今日小提示：${tip.text}`;
        tipDetail.textContent = tip.detail;

        // 更新样式类
        panel.className = `fortune-tip-panel fortune-tip-${tip.type}`;
        panel.style.display = 'flex';
    } else {
        panel.style.display = 'none';
    }
}

function showFortune() {
    if (isFortuneAppliedToday()) {
        return;
    }

    const modal = document.getElementById('fortuneModal');
    document.getElementById('fortuneContent').innerHTML = renderFortuneModal();
    modal.style.display = 'flex';

    document.getElementById('closeFortuneModalBtn').onclick = () => {
        modal.style.display = 'none';
        applyFortuneInstantEffect();
        saveFortuneApplied();
        updateStatsUI(gameState);
        immediateSave();
        updateFortuneEffectDisplay();
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
    vibrationManager.click();
    soundManager.click();
    const modal = document.getElementById('achievementModal');
    document.getElementById('achievementContent').innerHTML = renderAchievements();
    modal.style.display = 'flex';
}

/**
 * 重置游戏
 */
function resetGame() {
    vibrationManager.click();
    soundManager.click();
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'flex';

    document.getElementById('confirmCancelBtn').onclick = () => {
        modal.style.display = 'none';
    };

    document.getElementById('confirmOkBtn').onclick = () => {
        modal.style.display = 'none';
        resetGameState();
        isGameOver = false;
        updateStatsUI(gameState, false);
        loadRandomEvent();
        resetFeedback('人生重启，开始新的摸鱼之旅！');
        immediateSave();
        showToast('游戏已重置', '🔄');
    };
}

function showSettings() {
    vibrationManager.click();
    soundManager.click();
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'flex';
}

function initSettings() {
    const settings = loadSettings();

    soundManager.setEnabled(settings.sound);
    vibrationManager.setEnabled(settings.vibration);

    const vibrationSwitch = document.getElementById('vibrationSwitch');
    const soundSwitch = document.getElementById('soundSwitch');

    if (vibrationSwitch) {
        vibrationSwitch.checked = settings.vibration;
        vibrationSwitch.onchange = () => {
            const newSettings = updateSetting('vibration', vibrationSwitch.checked);
            vibrationManager.setEnabled(newSettings.vibration);
            if (newSettings.vibration) {
                vibrationManager.click();
            }
        };
    }

    if (soundSwitch) {
        soundSwitch.checked = settings.sound;
        soundSwitch.onchange = () => {
            const newSettings = updateSetting('sound', soundSwitch.checked);
            soundManager.setEnabled(newSettings.sound);
            if (newSettings.sound) {
                soundManager.click();
            }
        };
    }

    const resetBtn = document.getElementById('settingsResetBtn');
    if (resetBtn) {
        resetBtn.onclick = () => {
            const settingsModal = document.getElementById('settingsModal');
            settingsModal.style.display = 'none';
            resetGame();
        };
    }
}

function init() {
    const savedState = loadGame();
    if (savedState) {
        Object.assign(gameState, savedState);
        gameState.sanity = Math.max(0, gameState.sanity);
        gameState.stress = Math.max(0, gameState.stress);
        gameState.money = Math.max(0, gameState.money);
    }

    initDailyFortune();

    const offlineRewards = applyOfflineRewards();
    if (offlineRewards) {
        const msg = `离线${offlineRewards.hours}小时，获得 ${offlineRewards.rewards.sanity > 0 ? '+' : ''}${offlineRewards.rewards.sanity}💖 ${offlineRewards.rewards.stress < 0 ? '' : '+'}${offlineRewards.rewards.stress}😫 ${offlineRewards.rewards.money > 0 ? '+' : ''}${offlineRewards.rewards.money}💰`;
        showToast(msg, '🎁');
    }

    updateStatsUI(gameState, false);
    loadRandomEvent();

    showFortune();
    updateFortuneEffectDisplay();

    document.getElementById('achievementBtn').onclick = showAchievements;
    document.getElementById('settingsBtn').onclick = showSettings;

    initSettings();

    setupModalClose('achievementModal', 'closeAchievementBtn');
    setupModalClose('settingsModal', 'closeSettingsBtn');

    soundManager.init();

    // 暂时注释离线缓存功能
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('sw.js').catch(err => {
    //         console.log('Service Worker注册失败:', err);
    //     });
    // }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
