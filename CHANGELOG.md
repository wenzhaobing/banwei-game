# 版本更新记录

## v2.0.0 (2026-05-06)

### 🎮 核心玩法优化

#### 1. 事件池洗牌机制（v2.0）
- **实现事件池洗牌**：确保一轮游戏内事件不重复
- **Fisher-Yates洗牌算法**：每次游戏开始时随机打乱事件顺序
- **状态持久化**：事件池状态保存到 localStorage，刷新页面不丢失进度
- **自动重置机制**：
  - 游戏重开时重置事件池
  - 触发结局时重置事件池
  - 确保每次新游戏都是全新体验

#### 2. 选项均衡系统（v3.0）

**问题背景**：验证发现30个事件中仅3个合格，27个存在选项失衡问题

**解决方案**：
- **修复11个严重问题事件**：为全正面/全负面选项的事件添加对立选项
- **实现判定标准函数**：
  - `calculateOptionScore()` - 计算选项得分
  - `getOptionType()` - 判定选项类型（正面/负面/中性）
  - 权重公式：`理智 + 存款/5 - 压力`
- **运行时动态生成均衡选项**：
  - 确保至少1个正面选项
  - 确保至少1个负面选项
  - 第3个选项从剩余选项中随机抽取
  - 最终随机打乱顺序

**修复的事件列表**：

| 事件ID | 事件名称 | 原问题 | 修复方案 |
|--------|---------|--------|---------|
| boss_4 | 📧 收到全员邮件 | 全是负面选项 | 添加正面选项：趁机要求加薪、开始存钱 |
| meeting_1 | 📊 无聊会议 | 全是正面选项 | 添加负面选项：被点名回答、假装去厕所 |
| meeting_2 | 📊 季度总结大会 | 全是正面选项 | 添加负面选项：被老板点名、偷偷睡觉被抓 |
| meeting_3 | 💻 线上会议 | 全是正面选项 | 添加负面选项：被点名回答问题、麦克风没关被听到 |
| meeting_4 | 👥 一对一谈话 | 全是正面选项 | 添加负面选项：被问住答不上来、表现太积极被怀疑 |
| colleague_1 | 👥 同事八卦 | 全是正面选项 | 添加负面选项：被老板发现、打小报告 |
| colleague_2 | 👥 同事八卦时间 | 全是正面选项 | 添加负面选项：被老板撞见、告密邀功 |
| colleague_4 | 🎉 团建通知 | 全是正面选项 | 添加负面选项：被强制参加、爬山受伤 |
| office_2 | 🔊 打印机又坏了 | 全是正面选项 | 添加负面选项：被老板催、弄坏打印机赔钱 |
| office_3 | ☕ 咖啡机坏了 | 全是负面选项 | 添加正面选项：请同事喝咖啡、喝奶茶代替 |
| system_1 | 💻 系统崩溃 | 全是负面选项 | 添加正面选项：趁机休息一下、文件自动恢复 |

### 🐛 问题修复

#### 1. 游戏状态持久化问题
- **问题**：触发结局后刷新页面，轮数显示异常
- **修复**：结局触发时正确保存和重置游戏状态
- **修复**：重置游戏时使用 `Object.assign` 替代变量重赋值

#### 2. Toast提示显示问题
- **问题**：微信浏览器分享时Toast被结局弹窗遮挡
- **修复**：Toast z-index 从 2000 提升到 3500

#### 3. 事件效果残留问题
- **问题**：下一个事件携带上一个事件的运势修正效果
- **修复**：每次加载新事件时重置 `fortuneModifier`

### 📁 文件变更

#### 修改的文件
- `js/game.js` - 事件池洗牌机制、状态重置逻辑
- `js/main.js` - 轮数更新时机、事件加载逻辑
- `js/utils/event-generator.js` - 选项判定和均衡生成逻辑
- `js/data/events-data.js` - 11个事件的选项池数据修复
- `js/endings.js` - 结局上下文深拷贝
- `css/main.css` - Toast z-index 调整

#### 新增的文件
- `js/validate-events.js` - 事件验证工具
- `validate-events.html` - 可视化验证界面

### 🔧 技术细节

#### 事件池洗牌实现
```javascript
// Fisher-Yates 洗牌算法
static shuffleEventPool(events) {
    const shuffled = [...events];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 游戏状态中保存事件池
gameState = {
    eventPool: [],      // 洗牌后的事件池
    eventIndex: 0,      // 当前事件索引
    rounds: 1,          // 当前轮数
    // ...
};
```

#### 选项类型判定
```javascript
// 计算选项得分（权重：存款100 ≈ 理智20 ≈ 压力20）
static calculateOptionScore(option) {
    const sanity = option.effects.sanity || 0;
    const stress = option.effects.stress || 0;
    const money = option.effects.money || 0;
    return sanity + money / 5 - stress;
}

// 判定选项类型
static getOptionType(option) {
    const score = this.calculateOptionScore(option);
    if (score >= 10) return 'positive';   // 明显正面
    if (score <= -10) return 'negative';  // 明显负面
    return 'neutral';                      // 中性/混合
}
```

#### 均衡选项生成
```javascript
static generateBalancedOptions(optionPool, count = 3) {
    // 1. 分类选项
    const positivePool = optionPool.filter(opt => this.getOptionType(opt) === 'positive');
    const negativePool = optionPool.filter(opt => this.getOptionType(opt) === 'negative');
    
    // 2. 确保至少1个正面 + 1个负面
    const selected = [];
    if (positivePool.length > 0) selected.push(randomPick(positivePool));
    if (negativePool.length > 0) selected.push(randomPick(negativePool));
    
    // 3. 填充剩余选项
    while (selected.length < count) {
        selected.push(randomPick(optionPool, selected));
    }
    
    // 4. 随机打乱顺序
    return this.shuffleOptions(selected);
}
```

### ✨ 改进点总结

1. **游戏体验提升**：事件不重复，每局游戏都是新体验
2. **策略性增强**：每个事件都有正负选项，玩家需要权衡
3. **公平性保障**：运行时动态生成均衡选项，避免被迫选择
4. **重玩价值提升**：多样化的事件组合和选项选择
5. **代码可维护性**：验证工具帮助快速定位问题事件

---

## v1.1.0 (2026-04-23)

### 🎨 UI/UX 优化

#### 1. 轮数和运势提示栏重构
- **移除了旧的进度条设计**，改为简洁的"轮数/总轮数"显示
- 轮数格式从"第 X / Y 轮"简化为"X/Y"
- 运势提示触发器（💡图标）从独立一行移至轮数栏右侧
- 新布局采用 Flexbox 左右对齐，整体更紧凑

#### 2. 运势提示弹窗优化
- **位置调整**：弹窗现在显示在💡图标左侧（之前是下方）
- **三角形指示器**：弹窗右侧添加三角形指向💡图标
- **垂直居中对齐**：弹窗与💡图标垂直居中
- **背景色优化**：移除透明度，使用纯色背景提升可读性
  - 好运提示：中绿色背景 `#7c9e6e`
  - 坏运提示：橙色背景 `#e8a87c`
  - 普通提示：棕色背景 `#c7b198`
- **字体颜色**：统一使用白色字体，细节文字使用90%透明度白色

#### 3. 动画效果
- 弹窗展开：从左往右滑入动画
- 弹窗关闭：从左往右滑出动画
- 动画时长：0.3秒，使用 ease 缓动

### 🐛 问题修复

#### 1. 轮数逻辑修复
- **重置游戏后轮数显示**：修复了重置游戏后轮数未重置为1的问题
- **结局触发时机**：修复了需要玩到21轮才触发结局的bug
  - 原来：`rounds >= MAX_ROUNDS` 时触发
  - 现在：`rounds > MAX_ROUNDS` 时触发
- **内部逻辑调整**：
  - 轮数现在从1开始计数（之前从0开始）
  - 显示时不再需要+1，直接显示 `gameState.rounds`
  - 重置游戏时设置 `rounds = 1`

#### 2. 防重复点击机制
- **问题**：点击选项后到下一轮事件出现前，用户可能再次点击导致误操作
- **解决方案**：
  - 点击选项后立即禁用所有选项按钮
  - 设置按钮 `disabled`、`pointerEvents: none`、`opacity: 0.6`
  - 下一轮事件出现后自动恢复按钮状态
  - 视觉效果：按钮变灰并不可点击

### 📁 文件变更

#### 修改的文件
- `css/main.css` - 轮数显示和运势弹窗样式重构
- `css/components.css` - 组件样式更新
- `js/main.js` - 轮数更新逻辑、防重复点击机制
- `js/game.js` - 轮数初始化和结局判断逻辑
- `js/config.js` - 配置更新
- `js/storage.js` - 存储逻辑
- `js/fortune.js` - 运势系统
- `js/endings.js` - 结局系统
- `js/data/events-data.js` - 事件数据
- `js/data/fortunes.js` - 运势数据
- `js/data/endings.js` - 结局数据
- `js/data/index.js` - 数据导出
- `js/utils/event-generator.js` - 事件生成器
- `index.html` - HTML结构更新

#### 新增的文件
- `visual-companion.html` - 视觉伴侣演示页面
- `docs/superpowers/specs/2025-01-20-round-fortune-display-adjustment-design.md` - 设计文档
- `docs/superpowers/plans/2025-01-20-round-fortune-display-adjustment.md` - 实现计划

#### 删除的文件
- `js/data/option-pools.js` - 选项池数据（已合并到事件数据中）
- `docs/superpowers/plans/2026-04-17-event-options-dynamic-generation.md` - 旧计划文档
- `docs/superpowers/specs/2026-04-17-event-options-dynamic-generation-design.md` - 旧设计文档

### 🔧 技术细节

#### 轮数显示逻辑
```javascript
// 游戏初始化
gameState.rounds = 1;  // 从1开始

// 显示时
const current = gameState.rounds;  // 直接显示
const max = gameState.maxRounds;   // 20
roundText.textContent = `${current}/${max}`;  // "1/20"

// 结局判断
if (gameState.rounds > CONFIG.MAX_ROUNDS) {  // 改为 >
    triggerEnding();
}
```

#### 防重复点击实现
```javascript
function applyEffects(opt, btnElement) {
    // 禁用所有按钮
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.6';
    });

    // 执行选项逻辑...

    // 下一轮事件加载后恢复按钮
    setTimeout(loadRandomEvent, 1500);
}

function loadRandomEvent() {
    // ... 加载事件逻辑

    // 恢复按钮状态
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
    });
}
```

#### 运势弹窗位置计算
```javascript
function openFortunePanel() {
    const triggerRect = fortuneTrigger.getBoundingClientRect();
    const panelWidth = 280;
    const gap = 12;

    fortunePanel.style.top = `${triggerRect.top + triggerRect.height / 2}px`;
    fortunePanel.style.left = `${triggerRect.left - panelWidth - gap}px`;
    fortunePanel.style.transform = 'translateY(-50%)';
}
```

### ✨ 改进点总结

1. **UI更简洁**：轮数和运势提示在同一行，减少视觉噪音
2. **交互更合理**：弹窗在💡左侧，符合阅读习惯
3. **游戏逻辑更准确**：20轮触发结局，重置后正确显示1/20
4. **用户体验提升**：防重复点击避免误操作
5. **视觉更清晰**：纯色背景提升可读性

---

## v1.0.0 (2026-04-17) - 初始版本

### 核心功能
- 20+ 随机事件系统
- 20种今日运势类型
- 6个成就系统
- 405种动态结局
- PWA离线支持
- 离线收益计算
- 音效系统
