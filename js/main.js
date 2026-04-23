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
import { EventGenerator } from './utils/event-generator.js';

// 当前事件
let currentEvent = null;

// 上一次事件ID（用于避免连续重复）
let lastEventId = null;

// 游戏是否结束
let isGameOver = false;

/**
 * 更新轮数进度条
 */
function updateRoundProgress() {
    const roundText = document.getElementById('roundText');
    
    const current = gameState.rounds || 1;
    const max = gameState.maxRounds || 20;
    
    if (roundText) {
        roundText.textContent = `${current}/${max}`;
    }
}

/**
 * 初始化运势提示交互
 */
function initFortuneTipInteraction() {
    const fortuneTrigger = document.getElementById('fortuneTrigger');
    const fortunePanel = document.getElementById('fortuneEffectPanel');
    
    if (!fortuneTrigger || !fortunePanel) return;
    
    let isOpen = false;
    let autoCloseTimer = null;
    
    // 点击💡图标切换显示/隐藏
    fortuneTrigger.addEventListener('click', () => {
        if (isOpen) {
            closeFortunePanel();
        } else {
            openFortunePanel();
        }
    });
    
    /**
     * 打开运势提示面板
     */
    function openFortunePanel() {
        isOpen = true;
        
        // 计算弹窗位置
        const triggerRect = fortuneTrigger.getBoundingClientRect();
        const panelWidth = 280; // 弹窗宽度
        const gap = 12; // 间距
        
        // 先设置display为flex，让弹窗渲染
        fortunePanel.style.display = 'flex';
        
        // 等待下一帧，确保弹窗已经渲染
        requestAnimationFrame(() => {
            // 设置位置
            fortunePanel.style.top = `${triggerRect.top + triggerRect.height / 2}px`;
            fortunePanel.style.left = `${triggerRect.left - panelWidth - gap}px`;
            
            fortunePanel.classList.remove('hide');
            fortunePanel.classList.add('show');
        });
        
        // 清除之前的定时器
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
        }
        
        // 设置自动关闭（5秒后）
        autoCloseTimer = setTimeout(() => {
            closeFortunePanel();
        }, 5000);
    }
    
    /**
     * 关闭运势提示面板
     */
    function closeFortunePanel() {
        isOpen = false;
        fortunePanel.classList.remove('show');
        fortunePanel.classList.add('hide');
        
        // 清除定时器
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
        }
        
        // 动画结束后隐藏元素
        setTimeout(() => {
            if (!isOpen) {
                fortunePanel.style.display = 'none';
                fortunePanel.classList.remove('hide');
            }
        }, 300);
    }
}

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

    // 禁用所有选项按钮，防止重复点击
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.6';
    });

    soundManager.click();

    const rect = btnElement.getBoundingClientRect();
    const { effects, feedback, tags } = opt;

    const changes = updateStats(
        effects.sanity || 0,
        effects.stress || 0,
        effects.money || 0,
        tags
    );

    // 增加轮数计数
    gameState.rounds++;
    updateRoundProgress();

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
        // 设置结局上下文（游戏状态和轮数）
        setEndingContext(gameState, gameState.rounds);
        showEnding(ending.type, () => {
            resetGameState();
            isGameOver = false;
            updateStatsUI(gameState, false);
            updateRoundProgress();
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

    // 随机选择一个事件配置
    const eventConfig = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    
    // 使用事件生成器动态生成完整事件（方案2）
    currentEvent = EventGenerator.generateEvent(eventConfig);
    
    // 随机打乱选项顺序（方案1）
    currentEvent.options = EventGenerator.shuffleOptions(currentEvent.options);

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
    
    // 重新启用所有选项按钮
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
    });
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
        // 不在这里设置 display，让交互函数控制显示/隐藏
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
    soundManager.click();
    const modal = document.getElementById('achievementModal');
    document.getElementById('achievementContent').innerHTML = renderAchievements();
    modal.style.display = 'flex';
}

/**
 * 重置游戏
 */
function resetGame() {
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
        updateRoundProgress();
        loadRandomEvent();
        resetFeedback('人生重启，开始新的摸鱼之旅！');
        immediateSave();
        showToast('游戏已重置', '🔄');
    };
}

function showSettings() {
    soundManager.click();
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'flex';
}

function initSettings() {
    const settings = loadSettings();

    soundManager.setEnabled(settings.sound);

    const soundSwitch = document.getElementById('soundSwitch');

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
        // 确保轮数存在
        if (gameState.rounds === undefined) {
            gameState.rounds = 1;
        }
        if (gameState.maxRounds === undefined) {
            gameState.maxRounds = 20;
        }
    }

    initDailyFortune();

    const offlineRewards = applyOfflineRewards();
    if (offlineRewards) {
        const msg = `离线${offlineRewards.hours}小时，获得 ${offlineRewards.rewards.sanity > 0 ? '+' : ''}${offlineRewards.rewards.sanity}💖 ${offlineRewards.rewards.stress < 0 ? '' : '+'}${offlineRewards.rewards.stress}😫 ${offlineRewards.rewards.money > 0 ? '+' : ''}${offlineRewards.rewards.money}💰`;
        showToast(msg, '🎁');
    }

    updateStatsUI(gameState, false);
    updateRoundProgress();
    loadRandomEvent();

    showFortune();
    updateFortuneEffectDisplay();

    document.getElementById('achievementBtn').onclick = showAchievements;
    document.getElementById('settingsBtn').onclick = showSettings;

    initSettings();
    
    // 初始化运势提示交互
    initFortuneTipInteraction();

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
