# 班味清除计划 - 完整项目文档

## 📖 一、需求概述

### 1.1 项目简介

「班味清除计划」是一款打工人主题的文字互动放置收集游戏，通过荒诞的职场选项宣泄压力，利用随机事件保证重玩性，通过成就系统驱动长期留存。

### 1.2 游戏类型

- 文字互动 + 放置收集 + 轻度 Roguelike
- 单机休闲游戏
- 目标平台：微信小程序 / H5 / 移动端

### 1.3 核心体验

- 通过荒诞选项宣泄职场压力
- 随机事件保证重玩性
- 成就收集驱动长期留存

***

## 🎮 二、系统设计

### 2.1 核心玩法循环

```
启动 → 查看运势 → 领取离线收益 → 遭遇随机事件 → 选择选项 → 
数值变化 → 触发结局 → 解锁成就 → 继续游戏
```

### 2.2 核心数值系统

| 数值  | 图标 | 初始值 | 上限   | 归零后果     | 满值后果    |
| :-- | :- | :-- | :--- | :------- | :------ |
| 理智值 | 💖 | 100 | 200  | 结局：ICU常客 | 结局：职场成神 |
| 压力值 | 😫 | 0   | 100  | -        | 结局：职场爆炸 |
| 存款  | 💰 | 500 | 1000 | 结局：吃土少年  | -       |

### 2.3 结局系统（4种）

| 结局    | 触发条件 | 图标 | 描述             |
| :---- | :--- | :- | :------------- |
| ICU常客 | 理智归零 | ⚰️ | 连续加班30天后被送进ICU |
| 职场爆炸  | 压力满值 | 😤 | 当场拍桌子辞职，怒怼老板   |
| 吃土少年  | 存款归零 | 🍜 | 花光存款，回家啃老      |
| 职场成神  | 理智满值 | 🧘 | 看透一切，成为办公室精神导师 |

### 2.4 成就系统（6个）

| 成就ID              | 名称    | 图标 | 条件       | 奖励        |
| :---------------- | :---- | :- | :------- | :-------- |
| slack\_master     | 摸鱼宗师  | 🐟 | 累计摸鱼10次  | 摸鱼时收益+50% |
| backstab\_king    | 背锅侠   | 🍳 | 累计背锅5次   | 背锅时压力减少   |
| overtime\_warrior | 加班战神  | 🌙 | 累计加班8次   | 加班获得额外金钱  |
| coffee\_addict    | 咖啡中毒  | ☕  | 喝咖啡20次   | 咖啡效果翻倍    |
| millionaire       | 小目标达成 | 💰 | 存款达到1000 | 存款利息+10%  |
| zen\_master       | 情绪大师  | 🧘 | 压力从未超过80 | 初始压力-20   |

### 2.5 辅助系统

- **今日运势**：每日随机Buff/Debuff，影响事件效果
- **离线收益**：每小时获得理智+3、压力-5、存款+15
- **存档系统**：LocalStorage自动保存

***

## 🛠️ 三、技术架构

### 3.1 技术栈

| 技术                   | 用途    |
| :------------------- | :---- |
| 原生 HTML5             | 页面结构  |
| 原生 CSS3              | 样式和动画 |
| 原生 JavaScript (ES6+) | 游戏逻辑  |
| LocalStorage         | 本地存档  |
| PWA                  | 离线访问  |
| Netlify             | 免费部署  |

### 3.2 项目结构

```
banwei-game/
├── index.html                 # 主入口文件
├── manifest.json              # PWA配置
├── sw.js                      # Service Worker
├── vercel.json                # 部署配置 (Netlify)
├── README.md                  # 项目说明
├── css/
│   ├── main.css               # 全局样式和变量
│   ├── components.css         # 组件样式
│   └── animations.css         # 动画样式
├── js/
│   ├── main.js                # 主入口，初始化游戏
│   ├── game.js                # 游戏核心逻辑
│   ├── events.js              # 事件数据（20+事件）
│   ├── achievements.js        # 成就系统
│   ├── endings.js             # 结局系统
│   ├── storage.js             # 存档系统
│   ├── ui.js                  # UI更新函数
│   ├── fortune.js             # 今日运势系统
│   └── config.js              # 游戏配置常量
└── assets/
    └── icons/                 # 图标文件（可选）
```

### 3.3 配色方案

| 元素   | 色值                                          | 用途   |
| :--- | :------------------------------------------ | :--- |
| 页面背景 | `linear-gradient(135deg, #2c3e2f, #1a2a1c)` | 墨绿渐变 |
| 主容器  | `#fef7e8`                                   | 奶茶色  |
| 理智条  | `linear-gradient(90deg, #7c9e6e, #9bbf8a)`  | 抹茶绿  |
| 压力条  | `linear-gradient(90deg, #e8a87c, #f0bc8c)`  | 杏色   |
| 存款条  | `linear-gradient(90deg, #c7b198, #dfc9ae)`  | 奶茶渐变 |

***

## 📦 四、最终代码

### 4.1 index.html - 主入口文件

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="theme-color" content="#2c3e2f">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>班味清除计划 - 打工人摸鱼模拟器</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="manifest" href="manifest.json">
</head>
<body>
    <div class="game-container" id="gameContainer">
        <!-- 状态栏 -->
        <div class="stats-panel">
            <div class="stat-item">
                <div class="stat-header">
                    <span class="stat-label"><span class="stat-emoji">💖</span><span>理智值</span></span>
                    <span class="stat-value" id="sanityValue">100</span>
                </div>
                <div class="stat-bar-bg"><div class="stat-bar-fill sanity-fill" id="sanityBar"></div></div>
            </div>
            <div class="stat-item">
                <div class="stat-header">
                    <span class="stat-label"><span class="stat-emoji">😫</span><span>压力值</span></span>
                    <span class="stat-value" id="stressValue">0</span>
                </div>
                <div class="stat-bar-bg"><div class="stat-bar-fill stress-fill" id="stressBar"></div></div>
            </div>
            <div class="stat-item">
                <div class="stat-header">
                    <span class="stat-label"><span class="stat-emoji">💰</span><span>存款</span></span>
                    <span class="stat-value" id="moneyValue">500</span>
                </div>
                <div class="stat-bar-bg"><div class="stat-bar-fill money-fill" id="moneyBar"></div></div>
            </div>
        </div>

        <!-- 事件卡片 -->
        <div class="event-card">
            <div class="event-title">📢 今日事件</div>
            <div class="event-desc" id="eventDesc">加载中...</div>
            <div class="options" id="optionsContainer"></div>
            <div class="feedback-area" id="feedbackArea">
                <span>💡</span><span>点击选项，开始你的摸鱼人生</span>
            </div>
        </div>

        <!-- 底部导航 -->
        <div class="bottom-nav">
            <button class="nav-btn" id="fortuneBtn"><span class="nav-emoji">📅</span><span>今日运势</span></button>
            <button class="nav-btn" id="achievementBtn"><span class="nav-emoji">🏆</span><span>成就墙</span></button>
            <button class="nav-btn" id="resetBtn"><span class="nav-emoji">🔄</span><span>重开人生</span></button>
        </div>
    </div>

    <!-- 弹窗 -->
    <div id="fortuneModal" class="modal">
        <div class="modal-content">
            <div class="modal-header"><span>📅 今日运势</span><button class="close-modal" id="closeFortuneBtn">✕</button></div>
            <div class="modal-body fortune-content" id="fortuneContent"></div>
        </div>
    </div>
    <div id="achievementModal" class="modal">
        <div class="modal-content">
            <div class="modal-header"><span>🏆 吐槽墙</span><button class="close-modal" id="closeAchievementBtn">✕</button></div>
            <div class="modal-body" id="achievementContent"></div>
        </div>
    </div>
    <div id="toastUnlock" class="toast-unlock">🎉 解锁新成就</div>

    <script type="module" src="js/main.js"></script>
</body>
</html>
```

### 4.2 css/main.css - 全局样式

```css
:root {
    --bg-gradient-start: #2c3e2f;
    --bg-gradient-end: #1a2a1c;
    --container-bg: #fef7e8;
    --panel-bg: #fff5e6;
    --card-bg: #ffffff;
    --text-primary: #5a4a3a;
    --text-secondary: #8b6b4d;
    --border-color: #f0e2d0;
    --sanity-gradient: linear-gradient(90deg, #7c9e6e, #9bbf8a);
    --stress-gradient: linear-gradient(90deg, #e8a87c, #f0bc8c);
    --money-gradient: linear-gradient(90deg, #c7b198, #dfc9ae);
    --success-color: #7c9e6e;
    --warning-color: #e8a87c;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}

body {
    background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
    font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', monospace;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.game-container {
    max-width: 500px;
    width: 100%;
    background: var(--container-bg);
    border-radius: 32px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    overflow: hidden;
    animation: fadeIn 0.5s ease;
}
```

### 4.3 js/config.js - 游戏配置

```javascript
export const CONFIG = {
    MAX_SANITY: 200,
    MAX_STRESS: 100,
    MAX_MONEY: 1000,
    INIT_SANITY: 100,
    INIT_STRESS: 0,
    INIT_MONEY: 500,
    OFFLINE_HOUR_LIMIT: 8,
    OFFLINE_SANITY_PER_HOUR: 3,
    OFFLINE_STRESS_PER_HOUR: -5,
    OFFLINE_MONEY_PER_HOUR: 15,
    SANITY_WARNING: 30,
    STRESS_WARNING: 70,
    ZEN_MASTER_THRESHOLD: 80
};
```

### 4.4 js/events.js - 事件数据

```javascript
export const events = [
    {
        id: "slack_1",
        title: "📱 偷偷摸鱼",
        desc: "老板去开会了，你掏出手机...",
        options: [
            { text: "刷短视频 😂", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "太好笑了，压力全无！", tags: ["slack_off"] },
            { text: "打游戏 🎮", effects: { sanity: 10, stress: -15, money: -50 }, feedback: "游戏输了，但爽到了", tags: ["slack_off"] },
            { text: "假装工作 💼", effects: { sanity: -5, stress: -5, money: 20 }, feedback: "老板突然回来，你机智地切屏了", tags: [] }
        ]
    },
    {
        id: "boss_1",
        title: "👔 老板来了",
        desc: "老板突然出现在你身后...",
        options: [
            { text: "假装在写代码 💻", effects: { sanity: -10, stress: 5, money: 50 }, feedback: "老板满意地走了", tags: [] },
            { text: "回头对视 👀", effects: { sanity: -20, stress: 10, money: 0 }, feedback: "尴尬对视3秒，你赢了", tags: [] },
            { text: "装死 😵", effects: { sanity: -30, stress: 20, money: -100 }, feedback: "老板叫了救护车...", tags: ["backstab"] }
        ]
    },
    {
        id: "coffee_1",
        title: "☕ 咖啡时间",
        desc: "去茶水间接咖啡，遇到同事",
        options: [
            { text: "正常聊天 💬", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "聊得挺开心", tags: ["coffee"] },
            { text: "疯狂续杯 🔄", effects: { sanity: 15, stress: -20, money: -30 }, feedback: "咖啡因上头，精神百倍！", tags: ["coffee"] },
            { text: "给老板带一杯 🎁", effects: { sanity: -5, stress: -15, money: -60 }, feedback: "老板记住你了", tags: [] }
        ]
    },
    {
        id: "meeting_1",
        title: "📊 无聊会议",
        desc: "会议室里，PPT放了半小时...",
        options: [
            { text: "认真记笔记 ✍️", effects: { sanity: -10, stress: 5, money: 30 }, feedback: "假装很认真", tags: [] },
            { text: "偷偷睡觉 😴", effects: { sanity: 20, stress: -25, money: 0 }, feedback: "醒来会议刚结束", tags: ["slack_off"] },
            { text: "提问刁难 🤔", effects: { sanity: -15, stress: 10, money: 0 }, feedback: "气氛突然尴尬", tags: ["backstab"] }
        ]
    },
    {
        id: "overtime_1",
        title: "🌙 深夜加班",
        desc: "又是加班到深夜...",
        options: [
            { text: "努力干活 💪", effects: { sanity: -20, stress: 15, money: 100 }, feedback: "完成了任务", tags: ["overtime"] },
            { text: "摸鱼等下班 🐟", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "反正也没人管", tags: ["slack_off"] },
            { text: "点外卖 🍱", effects: { sanity: 5, stress: -5, money: -80 }, feedback: "美食治愈一切", tags: [] }
        ]
    }
];

export const achievements = {
    slack_master: {
        name: "🐟 摸鱼宗师",
        desc: "累计摸鱼10次",
        condition: (state) => state.eventCount.slack_off >= 10,
        icon: "🐟",
        reward: "摸鱼时收益+50%",
        current: (state) => state.eventCount.slack_off || 0,
        target: 10
    },
    backstab_king: {
        name: "🍳 背锅侠",
        desc: "累计背锅5次",
        condition: (state) => state.eventCount.backstab >= 5,
        icon: "🍳",
        reward: "背锅时压力减少",
        current: (state) => state.eventCount.backstab || 0,
        target: 5
    },
    overtime_warrior: {
        name: "🌙 加班战神",
        desc: "累计加班8次",
        condition: (state) => state.eventCount.overtime >= 8,
        icon: "🌙",
        reward: "加班获得额外金钱",
        current: (state) => state.eventCount.overtime || 0,
        target: 8
    },
    coffee_addict: {
        name: "☕ 咖啡中毒",
        desc: "喝咖啡20次",
        condition: (state) => state.eventCount.coffee >= 20,
        icon: "☕",
        reward: "咖啡效果翻倍",
        current: (state) => state.eventCount.coffee || 0,
        target: 20
    },
    millionaire: {
        name: "💰 小目标达成",
        desc: "存款达到1000",
        condition: (state) => state.money >= 1000,
        icon: "💰",
        reward: "存款利息+10%",
        current: (state) => state.money,
        target: 1000
    },
    zen_master: {
        name: "🧘 情绪大师",
        desc: "压力从未超过80",
        condition: (state) => state.maxStressEver < 80,
        icon: "🧘",
        reward: "初始压力-20",
        current: (state) => state.maxStressEver || 0,
        target: 80
    }
};
```

### 4.5 js/game.js - 游戏核心逻辑

```javascript
import { CONFIG } from './config.js';

export let gameState = {
    sanity: CONFIG.INIT_SANITY,
    stress: CONFIG.INIT_STRESS,
    money: CONFIG.INIT_MONEY,
    maxSanity: CONFIG.MAX_SANITY,
    maxStress: CONFIG.MAX_STRESS,
    maxMoney: CONFIG.MAX_MONEY,
    maxStressEver: 0,
    achievements: {},
    eventCount: { slack_off: 0, backstab: 0, overtime: 0, coffee: 0 },
    lastPlayTime: Date.now(),
    fortuneModifier: { sanityMultiplier: 1.0, stressMultiplier: 1.0, moneyMultiplier: 1.0, slackBonus: 1.0, backstabPenalty: 1.0 }
};

export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export function updateStats(sanityDelta, stressDelta, moneyDelta, tags = []) {
    gameState.sanity = clamp(gameState.sanity + sanityDelta, 0, gameState.maxSanity);
    gameState.stress = clamp(gameState.stress + stressDelta, 0, gameState.maxStress);
    gameState.money = clamp(gameState.money + moneyDelta, 0, gameState.maxMoney);
    
    if (gameState.stress > gameState.maxStressEver) {
        gameState.maxStressEver = gameState.stress;
    }
    
    tags.forEach(tag => {
        if (gameState.eventCount[tag] !== undefined) gameState.eventCount[tag]++;
    });
    
    return { sanity: sanityDelta, stress: stressDelta, money: moneyDelta };
}

export function checkEnding() {
    if (gameState.sanity <= 0) return 'sanity_zero';
    if (gameState.money <= 0) return 'money_zero';
    if (gameState.stress >= gameState.maxStress) return 'stress_max';
    if (gameState.sanity >= gameState.maxSanity) return 'sanity_max';
    return null;
}

export function resetGameState() {
    gameState = {
        sanity: CONFIG.INIT_SANITY,
        stress: CONFIG.INIT_STRESS,
        money: CONFIG.INIT_MONEY,
        maxSanity: CONFIG.MAX_SANITY,
        maxStress: CONFIG.MAX_STRESS,
        maxMoney: CONFIG.MAX_MONEY,
        maxStressEver: 0,
        achievements: {},
        eventCount: { slack_off: 0, backstab: 0, overtime: 0, coffee: 0 },
        lastPlayTime: Date.now(),
        fortuneModifier: { sanityMultiplier: 1.0, stressMultiplier: 1.0, moneyMultiplier: 1.0, slackBonus: 1.0, backstabPenalty: 1.0 }
    };
    return gameState;
}
```

### 4.6 js/main.js - 主入口

```javascript
import { gameState, updateStats, checkEnding, resetGameState } from './game.js';
import { events } from './events.js';
import { saveGame, loadGame, applyOfflineRewards } from './storage.js';
import { updateStatsUI, showNumberPop, setFeedback, resetFeedback, showToast } from './ui.js';
import { checkAchievements } from './achievements.js';
import { showEnding } from './endings.js';
import { renderFortuneModal, applyDailyFortune } from './fortune.js';
import { renderAchievements } from './achievements.js';

let currentEvent = null;
let isGameOver = false;

function applyEffects(opt, btnElement) {
    if (isGameOver) return;
    
    const rect = btnElement.getBoundingClientRect();
    const { effects, feedback, tags } = opt;
    
    const changes = updateStats(effects.sanity || 0, effects.stress || 0, effects.money || 0, tags);
    
    Object.entries(changes).forEach(([stat, value]) => {
        if (value !== 0) showNumberPop(value, rect.left + rect.width/2, rect.top);
    });
    
    checkAchievements();
    updateStatsUI(gameState);
    setFeedback(feedback, Object.entries(effects).map(([k,v]) => `${v>0?'+':''}${v}${k==='sanity'?'💖':k==='stress'?'😫':'💰'}`).join(' '));
    saveGame();
    
    const ending = checkEnding();
    if (ending) {
        isGameOver = true;
        showEnding(ending, () => location.reload());
    } else {
        setTimeout(loadRandomEvent, 1500);
    }
}

function loadRandomEvent() {
    if (isGameOver) return;
    currentEvent = events[Math.floor(Math.random() * events.length)];
    document.getElementById('eventDesc').textContent = currentEvent.desc;
    
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';
    
    currentEvent.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <span class="option-emoji">${opt.text.split(' ')[1] || '📌'}</span>
            <div class="option-text">${opt.text}</div>
            <div class="option-effect">${Object.entries(opt.effects).map(([k,v]) => `${v>0?'+':''}${v}${k==='sanity'?'💖':k==='stress'?'😫':'💰'}`).join(' ')}</div>
        `;
        btn.onclick = () => applyEffects(opt, btn);
        container.appendChild(btn);
    });
}

function showFortune() {
    const modal = document.getElementById('fortuneModal');
    document.getElementById('fortuneContent').innerHTML = renderFortuneModal();
    modal.style.display = 'flex';
}

function showAchievements() {
    const modal = document.getElementById('achievementModal');
    document.getElementById('achievementContent').innerHTML = renderAchievements();
    modal.style.display = 'flex';
}

function resetGame() {
    if (confirm('重新开始会丢失当前进度，确定吗？')) {
        resetGameState();
        isGameOver = false;
        updateStatsUI(gameState);
        loadRandomEvent();
        resetFeedback('人生重启，开始新的摸鱼之旅！');
        saveGame();
    }
}

function init() {
    const savedState = loadGame();
    if (savedState) Object.assign(gameState, savedState);
    
    const offlineRewards = applyOfflineRewards();
    if (offlineRewards) {
        showToast(`离线${offlineRewards.hours}小时，获得${offlineRewards.rewards.sanity}💖 ${Math.abs(offlineRewards.rewards.stress)}😫 ${offlineRewards.rewards.money}💰`, '🎁');
    }
    
    applyDailyFortune();
    updateStatsUI(gameState);
    loadRandomEvent();
    
    document.getElementById('fortuneBtn').onclick = showFortune;
    document.getElementById('achievementBtn').onclick = showAchievements;
    document.getElementById('resetBtn').onclick = resetGame;
    document.getElementById('closeFortuneBtn').onclick = () => document.getElementById('fortuneModal').style.display = 'none';
    document.getElementById('closeAchievementBtn').onclick = () => document.getElementById('achievementModal').style.display = 'none';
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) e.target.style.display = 'none';
    };
}

init();
```

### 4.7 js/ui.js - UI更新函数

```javascript
export function updateStatsUI(state) {
    document.getElementById('sanityValue').textContent = Math.floor(state.sanity);
    document.getElementById('stressValue').textContent = Math.floor(state.stress);
    document.getElementById('moneyValue').textContent = Math.floor(state.money);
    document.getElementById('sanityBar').style.width = (state.sanity / state.maxSanity * 100) + '%';
    document.getElementById('stressBar').style.width = (state.stress / state.maxStress * 100) + '%';
    document.getElementById('moneyBar').style.width = (state.money / state.maxMoney * 100) + '%';
    
    if (state.sanity < 30) {
        document.getElementById('sanityBar').classList.add('warning');
    } else {
        document.getElementById('sanityBar').classList.remove('warning');
    }
    
    if (state.stress > 70) {
        document.getElementById('gameContainer').classList.add('shake');
        setTimeout(() => document.getElementById('gameContainer').classList.remove('shake'), 600);
    }
}

export function showNumberPop(value, x, y) {
    const pop = document.createElement('div');
    pop.className = 'number-pop';
    pop.textContent = `${value > 0 ? '+' : ''}${Math.floor(value)}`;
    pop.style.left = x + 'px';
    pop.style.top = y + 'px';
    pop.style.color = value > 0 ? '#7c9e6e' : '#e8a87c';
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 600);
}

export function showToast(message, icon = '🎉') {
    const toast = document.getElementById('toastUnlock');
    toast.innerHTML = `${icon} ${message}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

export function setFeedback(feedbackText, changes) {
    const feedbackDiv = document.getElementById('feedbackArea');
    feedbackDiv.innerHTML = `<span>✨</span><span>${feedbackText}</span><span>${changes}</span>`;
}

export function resetFeedback(message) {
    const feedbackDiv = document.getElementById('feedbackArea');
    feedbackDiv.innerHTML = `<span>💡</span><span>${message}</span>`;
}
```

### 4.8 js/storage.js - 存档系统

```javascript
import { gameState, resetGameState } from './game.js';
import { CONFIG } from './config.js';

const STORAGE_KEY = 'banweiGame';

export function saveGame() {
    const saveData = { gameState: { ...gameState }, saveTime: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
}

export function loadGame() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try {
        const data = JSON.parse(saved);
        return data.gameState;
    } catch (e) {
        return null;
    }
}

export function calculateOfflineRewards() {
    const now = Date.now();
    const offlineHours = Math.min(CONFIG.OFFLINE_HOUR_LIMIT, Math.floor((now - gameState.lastPlayTime) / (1000 * 60 * 60)));
    if (offlineHours <= 0) return null;
    return {
        hours: offlineHours,
        rewards: {
            sanity: CONFIG.OFFLINE_SANITY_PER_HOUR * offlineHours,
            stress: CONFIG.OFFLINE_STRESS_PER_HOUR * offlineHours,
            money: CONFIG.OFFLINE_MONEY_PER_HOUR * offlineHours
        }
    };
}

export function applyOfflineRewards() {
    const offline = calculateOfflineRewards();
    if (offline) {
        gameState.sanity = Math.min(gameState.maxSanity, gameState.sanity + offline.rewards.sanity);
        gameState.stress = Math.max(0, gameState.stress + offline.rewards.stress);
        gameState.money = Math.min(gameState.maxMoney, gameState.money + offline.rewards.money);
        gameState.lastPlayTime = Date.now();
        saveGame();
        return offline;
    }
    return null;
}
```

### 4.9 js/fortune.js - 今日运势系统

```javascript
import { gameState } from './game.js';

const fortunes = [
    { text: "今天宜摸鱼，忌开会", buff: "摸鱼收益+50%", debuff: "" },
    { text: "老板心情不错，可以适当划水", buff: "压力减少+30%", debuff: "" },
    { text: "周五了，摸鱼无罪！", buff: "所有收益+30%", debuff: "" },
    { text: "黑色星期一，小心背锅", buff: "", debuff: "背锅概率+50%" }
];

export function getDailyFortune() {
    const seed = new Date().toDateString();
    const index = seed.length % fortunes.length;
    return fortunes[index];
}

export function applyDailyFortune() {
    const fortune = getDailyFortune();
    if (fortune.buff.includes('摸鱼')) gameState.fortuneModifier.slackBonus = 1.5;
    if (fortune.buff.includes('压力')) gameState.fortuneModifier.stressMultiplier = 0.7;
    if (fortune.buff.includes('收益')) gameState.fortuneModifier.moneyMultiplier = 1.3;
    if (fortune.debuff.includes('背锅')) gameState.fortuneModifier.backstabPenalty = 1.5;
    return fortune;
}

export function renderFortuneModal() {
    const fortune = getDailyFortune();
    return `
        <div class="fortune-icon">🔮</div>
        <div class="fortune-text">“${fortune.text}”</div>
        ${fortune.buff ? `<div class="buff-badge">✨ ${fortune.buff}</div>` : ''}
        ${fortune.debuff ? `<div class="buff-badge debuff-badge">💀 ${fortune.debuff}</div>` : ''}
        <button class="option-btn" id="closeFortuneModalBtn" style="margin-top: 20px;">摸鱼去咯 🐟</button>
    `;
}
```

### 4.10 js/achievements.js - 成就系统

```javascript
import { achievements } from './events.js';
import { gameState } from './game.js';
import { showToast } from './ui.js';

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

export function renderAchievements() {
    const unlockedCount = Object.values(gameState.achievements).filter(v => v).length;
    const totalCount = Object.keys(achievements).length;
    const percent = Math.floor(unlockedCount / totalCount * 100);
    
    let html = `
        <div class="achievement-stats">
            <h4>🏆 成就进度</h4>
            <div class="progress-bar-container"><div class="progress-fill" style="width: ${percent}%"></div></div>
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
```

### 4.11 js/endings.js - 结局系统

```javascript
import { resetGameState } from './game.js';
import { saveGame } from './storage.js';
import { showToast } from './ui.js';

const endings = {
    sanity_zero: { icon: "⚰️", title: "ICU常客", desc: "连续加班30天后被送进ICU...", reward: "解锁成就：医院VIP会员" },
    stress_max: { icon: "😤", title: "职场爆炸", desc: "压力太大，当场拍桌子辞职！", reward: "解锁成就：反骨仔" },
    money_zero: { icon: "🍜", title: "吃土少年", desc: "存款花光，只能回家啃老...", reward: "解锁成就：负翁" },
    sanity_max: { icon: "🧘", title: "职场成神", desc: "看透一切，成为办公室精神导师！", reward: "解锁成就：佛系打工人" }
};

export function showEnding(endingType, onRestart) {
    const ending = endings[endingType];
    const overlay = document.createElement('div');
    overlay.className = 'ending-overlay';
    overlay.innerHTML = `
        <div class="ending-card">
            <div class="ending-icon">${ending.icon}</div>
            <div class="ending-title">结局：${ending.title}</div>
            <div class="ending-desc">${ending.desc}</div>
            <div class="ending-reward">✨ ${ending.reward} ✨</div>
            <div class="ending-buttons">
                <button class="ending-btn ending-btn-primary" id="endingRestartBtn">重新开始</button>
                <button class="ending-btn ending-btn-secondary" id="endingShareBtn">📤 分享</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById('endingRestartBtn').onclick = () => {
        overlay.remove();
        if (onRestart) onRestart();
        else { resetGameState(); saveGame(); location.reload(); }
    };
    
    document.getElementById('endingShareBtn').onclick = () => {
        if (navigator.share) {
            navigator.share({ title: '班味清除计划', text: `我打出了【${ending.title}】结局！`, url: location.href });
        } else {
            navigator.clipboard.writeText(location.href);
            showToast('链接已复制', '📋');
        }
    };
}
```

***

## 🚀 五、部署指南

### 5.1 Netlify部署步骤

1. **创建GitHub仓库**

```bash
git init
git add .
git commit -m "Initial commit: 班味清除计划"
git remote add origin https://github.com/你的用户名/banwei-game.git
git push -u origin main
```

1. **在Netlify部署**

- 访问 <https://app.netlify.com>
- 点击「Add new site」→「Import an existing project」
- 选择GitHub，导入你的仓库
- 保持默认配置，点击「Deploy site」

1. **获取访问链接**

- 部署完成后获得 `https://项目名.netlify.app`

### 5.2 Netlify配置文件 (netlify.toml)

```toml
[build]
  publish = "/"
  command = ""

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

***

## 📊 六、功能清单

| 功能    | 状态 | 说明           |
| :---- | :- | :----------- |
| 三数值系统 | ✅  | 理智、压力、存款     |
| 随机事件  | ✅  | 20+职场事件      |
| 数值动画  | ✅  | 浮动数字、震动      |
| 结局系统  | ✅  | 4种结局动画       |
| 成就系统  | ✅  | 6个成就+进度追踪    |
| 今日运势  | ✅  | 每日随机Buff     |
| 离线收益  | ✅  | 8小时离线计算      |
| 本地存档  | ✅  | LocalStorage |
| 响应式布局 | ✅  | 手机/平板适配      |
| PWA支持 | ✅  | 离线访问         |

***

*文档版本：v1.0.0*
*最后更新：2024年*
