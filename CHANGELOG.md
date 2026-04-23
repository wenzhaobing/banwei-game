# 版本更新记录

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
