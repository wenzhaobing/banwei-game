## 🔍 项目完善清单 - 需要确认、完善和优化的逻辑

让我系统性地分析一下这个游戏还有哪些地方需要打磨：

---

## 一、需要确认的逻辑问题

### 1.1 数值平衡性确认 ⚖️

| 问题 | 当前设定 | 需要确认 |
|------|----------|----------|
| 初始存款500是否合理？ | 500 | 玩家需要几次事件才会破产？ |
| 离线收益是否过高？ | 8小时=24理智、-40压力、120存款 | 会否导致玩家故意不上线刷资源？ |
| 成就条件是否太难？ | 摸鱼10次、背锅5次 | 平均游戏时长多久能达成？ |
| 事件数值波动是否平衡？ | ±5~30之间 | 会不会3次事件就触发结局？ |

**建议**：添加一个数值模拟测试函数

```javascript
// 测试工具：模拟100轮游戏，统计平均存活轮数
export function simulateGame(iterations = 100) {
    let results = [];
    for (let i = 0; i < iterations; i++) {
        let state = {...initialState};
        let rounds = 0;
        while (!checkEnding(state) && rounds < 100) {
            const event = randomEvent();
            const option = randomOption(event);
            applyEffects(state, option);
            rounds++;
        }
        results.push({ rounds, ending: checkEnding(state) });
    }
    return results;
}
```

---

### 1.2 事件标签系统确认 🏷️

| 问题 | 当前状态 | 需要确认 |
|------|----------|----------|
| 哪些事件应该带摸鱼标签？ | 3个事件 | 是否所有摸鱼行为都算？ |
| 背锅标签是否太负面？ | 只有2个事件有 | 玩家会不会刻意避开？ |
| 加班标签是否鼓励加班？ | 1个事件 | 会不会传递错误价值观？ |

**建议**：增加更多样化的标签和事件组合

---

### 1.3 结局触发优先级确认 🎬

**当前问题**：如果多个条件同时满足，触发哪个结局？

```javascript
// 当前逻辑：顺序检查，先检查到的先触发
// 理智归零 优先于 压力满值
// 存款归零 优先于 其他

export function checkEnding() {
    if (gameState.sanity <= 0) return 'sanity_zero';      // 优先级1
    if (gameState.money <= 0) return 'money_zero';        // 优先级2
    if (gameState.stress >= gameState.maxStress) return 'stress_max'; // 优先级3
    if (gameState.sanity >= gameState.maxSanity) return 'sanity_max'; // 优先级4
    return null;
}
```

**需要确认**：这个优先级是否合理？还是应该让玩家选择？

---

## 二、需要完善的功能

### 2.1 事件池扩展 📚

**当前**：5个事件
**目标**：20+ 事件

```javascript
// 需要补充的事件类型
const eventCategories = {
    daily_routine: ["晨会", "午休", "下班打卡"],      // 日常
    social: ["同事八卦", "团建", "职场PUA"],          // 社交
    crisis: ["项目延期", "客户投诉", "服务器宕机"],    // 危机
    reward: ["涨薪", "升职", "优秀员工"],              // 奖励
    special: ["公司裁员", "行业寒冬", "创业机会"]      // 特殊
};
```

### 2.2 数值保护机制 🛡️

**当前缺失**：
- 连续负面事件的保护（避免连续3次背锅直接暴毙）
- 新手保护期（前5次事件数值波动减半）
- 软上限机制（数值接近极限时，影响变小）

```javascript
// 建议添加的保护机制
export function applySoftCap(value, current, max) {
    // 当数值接近上限时，增益效果衰减
    if (value > 0 && current > max * 0.8) {
        const ratio = (max - current) / (max * 0.2);
        return value * Math.max(0.2, ratio);
    }
    // 当数值接近下限时，减益效果衰减
    if (value < 0 && current < max * 0.2) {
        const ratio = current / (max * 0.2);
        return value * Math.max(0.2, ratio);
    }
    return value;
}
```

### 2.3 成就奖励实际生效 🎁

**当前问题**：成就解锁有奖励描述，但未实际生效

```javascript
// 需要实现的成就奖励效果
const achievementRewards = {
    slack_master: {
        effect: (value) => value * 1.5,  // 摸鱼收益+50%
        applyTo: ['slack_off']
    },
    backstab_king: {
        effect: (stress) => stress * 0.7, // 背锅压力减少30%
        applyTo: ['backstab']
    },
    millionaire: {
        effect: (money) => money * 1.1,   // 存款利息+10%
        applyTo: ['offline', 'event']
    }
};
```

### 2.4 离线收益UI展示 📊

**当前**：只在控制台显示
**需要**：游戏内弹窗展示详细收益

```javascript
// 离线收益弹窗
export function showOfflineRewardsModal(rewards) {
    const modal = `
        <div class="offline-modal">
            <div class="offline-icon">💤</div>
            <div class="offline-title">你离开了 ${rewards.hours} 小时</div>
            <div class="offline-rewards">
                <div>💖 +${rewards.rewards.sanity}</div>
                <div>😫 ${rewards.rewards.stress > 0 ? '+' : ''}${rewards.rewards.stress}</div>
                <div>💰 +${rewards.rewards.money}</div>
            </div>
            <div class="offline-message">${rewards.message}</div>
        </div>
    `;
}
```

---

## 三、需要优化的性能

### 3.1 事件随机算法 🎲

**当前**：完全随机
**问题**：可能出现连续重复事件

```javascript
// 优化：避免连续重复
let lastEventId = null;

export function getRandomEvent() {
    let availableEvents = events.filter(e => e.id !== lastEventId);
    let event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    lastEventId = event.id;
    return event;
}
```

### 3.2 存档频率优化 💾

**当前**：每次操作都保存
**问题**：频繁写入可能影响性能

```javascript
// 优化：防抖保存
let saveTimer = null;

export function debouncedSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        saveGame();
        saveTimer = null;
    }, 1000);
}
```

### 3.3 动画性能优化 🎬

**当前**：大量 DOM 操作
**问题**：数值变化频繁时可能卡顿

```javascript
// 优化：批量更新 + requestAnimationFrame
let pendingUIUpdate = false;

export function scheduleUIUpdate() {
    if (pendingUIUpdate) return;
    pendingUIUpdate = true;
    requestAnimationFrame(() => {
        updateStatsUI(gameState);
        pendingUIUpdate = false;
    });
}
```

---

## 四、需要添加的新功能

### 4.1 音效系统 🔊

```javascript
// 简易音效系统
const sounds = {
    click: new Audio('data:audio/wav;base64,...'),  // base64编码的短音效
    unlock: new Audio('...'),
    ending: new Audio('...'),
    warning: new Audio('...')
};

export function playSound(soundName) {
    if (settings.soundEnabled && sounds[soundName]) {
        sounds[soundName].play().catch(e => console.log('音频播放失败'));
    }
}
```

### 4.2 数据统计面板 📈

```javascript
// 玩家统计
const stats = {
    totalGames: 0,           // 总游戏次数
    totalEvents: 0,          // 总事件次数
    favoriteOption: null,    // 最喜欢的选择
    mostEnding: null,        // 最常见结局
    averageLifespan: 0,      // 平均存活轮数
    bestScore: {             // 最好成绩
        sanity: 0,
        money: 0,
        events: 0
    }
};
```

### 4.3 每日挑战模式 🏆

```javascript
// 固定种子的每日挑战
export function getDailyChallenge() {
    const today = new Date().toDateString();
    const seed = hashCode(today);
    
    return {
        seed,
        fixedEvents: true,     // 所有玩家遇到相同事件
        leaderboard: true,     // 排行榜
        goal: "存活20轮",       // 挑战目标
        reward: "✨ 限定徽章"   // 特殊奖励
    };
}
```

### 4.4 导入/导出存档 💾

```javascript
// 存档分享功能
export function exportGameCode() {
    const saveData = localStorage.getItem(STORAGE_KEY);
    const compressed = btoa(encodeURIComponent(saveData));
    return `banwei://import?data=${compressed}`;
}

export function importGameCode(code) {
    const data = JSON.parse(decodeURIComponent(atob(code)));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    location.reload();
}
```

---

## 五、需要优化的用户体验

### 5.1 新手引导 🆕

```javascript
// 首次进入显示引导
const isFirstTime = !localStorage.getItem('hasSeenTutorial');

if (isFirstTime) {
    showTutorial([
        { text: "💖 理智值：归零会进ICU", highlight: "sanityBar" },
        { text: "😫 压力值：太高会爆炸", highlight: "stressBar" },
        { text: "💰 存款：没了要吃土", highlight: "moneyBar" },
        { text: "点击选项，改变你的职场命运！", highlight: "optionsContainer" }
    ]);
    localStorage.setItem('hasSeenTutorial', 'true');
}
```

### 5.2 震动反馈（可选）📳

```javascript
// 移动端震动反馈
export function vibrate(pattern = 50) {
    if (settings.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// 在关键操作时调用
optionBtn.onclick = () => {
    vibrate(30);
    applyEffects(opt, btn);
};
```

### 5.3 暗色模式 🌙

```javascript
// 跟随系统主题
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

if (darkModeMediaQuery.matches) {
    document.body.classList.add('dark-mode');
}

darkModeMediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});
```

---

## 六、优先级建议

| 优先级 | 类别 | 内容 | 预估工作量 |
|--------|------|------|------------|
| 🔴 高 | 平衡性 | 数值平衡测试和调整 | 2-4小时 |
| 🔴 高 | 内容 | 扩展事件池到20+ | 3-5小时 |
| 🟡 中 | 功能 | 成就奖励实际生效 | 2-3小时 |
| 🟡 中 | UI | 离线收益弹窗 | 1-2小时 |
| 🟡 中 | 体验 | 新手引导 | 2-3小时 |
| 🟢 低 | 优化 | 防抖保存、动画优化 | 1-2小时 |
| 🟢 低 | 新增 | 音效系统 | 2-3小时 |
| 🟢 低 | 新增 | 数据统计 | 3-4小时 |

---

## 📋 下一步行动建议

1. **立即确认**：数值平衡和结局优先级
2. **本周完成**：扩展事件池、成就奖励生效
3. **下周优化**：离线收益UI、新手引导
4. **未来迭代**：音效、统计、每日挑战

需要我帮你实现其中任何一项吗？