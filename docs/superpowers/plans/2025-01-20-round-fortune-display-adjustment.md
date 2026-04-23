# 轮数和运势提示展示调整实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 调整游戏界面中轮数展示和今日运势提示的布局和交互方式，使其更加简洁、直观。

**Architecture:** 将轮数和运势提示合并到同一行，去掉进度条，运势提示改为点击展开的浮动面板，使用 flexbox 布局和 CSS 动画实现交互效果。

**Tech Stack:** HTML5, CSS3 (Flexbox, Animations), JavaScript (ES6+)

---

## 文件结构

**修改文件：**
- `index.html` - 调整轮数和运势提示的HTML结构
- `css/main.css` - 添加新样式，移除旧样式，实现动画效果
- `js/main.js` - 添加交互逻辑，简化轮数更新函数

**文件职责：**
- `index.html`: 负责页面结构，包含轮数显示和运势提示的容器
- `css/main.css`: 负责样式和动画，包括布局、悬停效果、滑入滑出动画
- `js/main.js`: 负责交互逻辑，包括点击事件处理、定时器管理、状态控制

---

## Task 1: 调整HTML结构

**Files:**
- Modify: `index.html:71-96`

- [ ] **Step 1: 移除旧的轮数进度条结构**

找到 `index.html` 中的轮数进度条部分（第71-82行），删除整个 `round-progress-container` div：

```html
<!-- 删除这部分 -->
<div class="round-progress-container">
  <div class="round-info">
    <span class="round-icon">📊</span>
    <span class="round-text" id="roundText">第 0 / 20 轮</span>
  </div>
  <div class="round-progress-bar">
    <div class="round-progress-fill" id="roundProgressFill" style="width: 0%"></div>
  </div>
</div>
```

- [ ] **Step 2: 添加新的轮数和运势提示栏结构**

在删除的位置添加新的HTML结构：

```html
<!-- 轮数和运势提示栏 -->
<div class="round-fortune-bar">
  <div class="round-display">
    <span class="round-icon">📊</span>
    <span class="round-text" id="roundText">0/20</span>
  </div>
  <div class="fortune-trigger" id="fortuneTrigger">
    <span class="fortune-icon">💡</span>
  </div>
</div>
```

- [ ] **Step 3: 修改运势提示面板的初始状态**

找到 `fortuneEffectPanel` div（第89-96行），修改其初始 `style` 属性：

```html
<!-- 运势小提示 -->
<div
  class="fortune-tip-panel"
  id="fortuneEffectPanel"
  style="display: none"
>
  <div class="fortune-tip-icon" id="fortuneTipIcon">💡</div>
  <div class="fortune-tip-content">
    <div class="fortune-tip-text" id="fortuneTipText"></div>
    <div class="fortune-tip-detail" id="fortuneTipDetail"></div>
  </div>
</div>
```

- [ ] **Step 4: 验证HTML结构**

在浏览器中打开 `index.html`，确认：
- 轮数和运势提示在同一行
- 💡图标显示在右侧
- 运势提示面板默认隐藏

- [ ] **Step 5: 提交HTML更改**

```bash
git add index.html
git commit -m "feat: 调整轮数和运势提示的HTML结构"
```

---

## Task 2: 实现CSS样式

**Files:**
- Modify: `css/main.css:56-248`

- [ ] **Step 1: 添加新的轮数和运势提示栏样式**

在 `css/main.css` 文件中，找到轮数进度条部分（第201行），在其前面添加新样式：

```css
/* ============ 轮数和运势提示栏 ============ */
.round-fortune-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--panel-bg);
  margin: 0 12px;
  padding: 10px 16px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  position: relative;
}

.round-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.round-icon {
  font-size: 16px;
}

.round-text {
  font-weight: 600;
}

.fortune-trigger {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  user-select: none;
}

.fortune-trigger:hover {
  background: rgba(0, 0, 0, 0.05);
}

.fortune-trigger:active {
  transform: scale(0.95);
}

.fortune-icon {
  font-size: 18px;
  display: block;
}
```

- [ ] **Step 2: 修改运势提示面板样式**

找到 `.fortune-tip-panel` 样式（第56行），修改为浮动样式：

```css
/* 运势小提示面板（浮动） */
.fortune-tip-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 100;
  display: none;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  margin: 0 12px;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.fortune-tip-panel.show {
  display: flex;
  animation: slideInFromRight 0.3s ease;
}

.fortune-tip-panel.hide {
  display: flex;
  animation: slideOutToRight 0.3s ease forwards;
}
```

- [ ] **Step 3: 添加动画关键帧**

在文件末尾添加动画关键帧：

```css
@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutToRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(20px);
  }
}
```

- [ ] **Step 4: 移除旧的轮数进度条样式**

找到并删除旧的轮数进度条样式（第201-248行）：

```css
/* 删除这部分 */
/* ============ 轮数进度条 ============ */
.round-progress-container {
  background: var(--panel-bg);
  margin: 0 12px;
  padding: 10px 16px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.round-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--text-primary);
}

.round-icon {
  font-size: 14px;
}

.round-text {
  font-weight: 500;
}

.round-progress-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 3px;
  overflow: hidden;
}

.round-progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #7c9e6e, #9bbf8a);
  border-radius: 3px;
  transition: width 0.3s ease;
}
```

- [ ] **Step 5: 验证CSS样式**

在浏览器中刷新页面，确认：
- 轮数和运势提示在同一行，左右对齐
- 💡图标有悬停效果
- 运势提示面板仍然隐藏（等待JavaScript实现）

- [ ] **Step 6: 提交CSS更改**

```bash
git add css/main.css
git commit -m "feat: 实现轮数和运势提示的新样式和动画"
```

---

## Task 3: 实现JavaScript交互逻辑

**Files:**
- Modify: `js/main.js:26-40, 315-362`

- [ ] **Step 1: 简化轮数更新函数**

找到 `updateRoundProgress()` 函数（第26-40行），简化为：

```javascript
/**
 * 更新轮数进度条
 */
function updateRoundProgress() {
  const roundText = document.getElementById('roundText');
  
  const current = gameState.rounds || 0;
  const max = gameState.maxRounds || 20;
  
  if (roundText) {
    roundText.textContent = `${current}/${max}`;
  }
}
```

- [ ] **Step 2: 添加运势提示交互函数**

在 `updateRoundProgress()` 函数后面添加新函数：

```javascript
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
    fortunePanel.classList.remove('hide');
    fortunePanel.classList.add('show');
    
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
```

- [ ] **Step 3: 在init函数中调用初始化函数**

找到 `init()` 函数（第315行），在适当位置添加调用：

```javascript
function init() {
  const savedState = loadGame();
  if (savedState) {
    Object.assign(gameState, savedState);
    gameState.sanity = Math.max(0, gameState.sanity);
    gameState.stress = Math.max(0, gameState.stress);
    gameState.money = Math.max(0, gameState.money);
    // 确保轮数存在
    if (gameState.rounds === undefined) {
      gameState.rounds = 0;
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
```

- [ ] **Step 4: 验证JavaScript交互**

在浏览器中刷新页面，测试：
- 点击💡图标，运势提示面板从右往左滑入展开
- 再次点击💡图标，运势提示面板从左往右滑出折叠
- 展开后5秒自动折叠
- 轮数显示格式为 "X/Y"

- [ ] **Step 5: 提交JavaScript更改**

```bash
git add js/main.js
git commit -m "feat: 实现运势提示的点击展开/折叠交互逻辑"
```

---

## Task 4: 测试和验证

**Files:**
- Test: 浏览器功能测试

- [ ] **Step 1: 功能测试**

在浏览器中进行以下测试：
1. 刷新页面，确认轮数显示为 "0/20"
2. 点击💡图标，确认运势提示面板展开
3. 再次点击💡图标，确认运势提示面板折叠
4. 展开运势提示后，等待5秒，确认自动折叠
5. 选择一个事件选项，确认轮数更新为 "1/20"
6. 重复选择选项，确认轮数正确递增

- [ ] **Step 2: 视觉测试**

检查以下视觉效果：
1. 轮数和运势提示在同一行，左右对齐
2. 💡图标悬停时有背景变化
3. 💡图标点击时有缩放效果
4. 运势提示面板展开时从右往左滑入
5. 运势提示面板折叠时从左往右滑出
6. 在不同屏幕尺寸下布局正常

- [ ] **Step 3: 交互测试**

测试以下交互场景：
1. 快速连续点击💡图标，确认状态不会混乱
2. 在运势提示展开时选择事件选项，确认面板状态正确
3. 在运势提示展开时打开其他弹窗，确认层级正确
4. 在移动设备上测试触摸交互（如果可用）

- [ ] **Step 4: 性能测试**

检查以下性能指标：
1. 动画流畅，无卡顿
2. 快速点击不会导致内存泄漏
3. 定时器正确清理，无残留

- [ ] **Step 5: 最终提交**

如果所有测试通过，进行最终提交：

```bash
git add .
git commit -m "feat: 完成轮数和运势提示展示调整

- 合并轮数和运势提示到同一行
- 去掉轮数进度条和多余文字
- 运势提示改为点击展开的浮动面板
- 添加从右往左滑入/从左往右滑出动画
- 实现5秒自动关闭功能
- 简化轮数更新逻辑"
```

---

## 实施注意事项

### 关键点
1. **HTML结构调整**：确保删除旧的轮数进度条结构，避免重复元素
2. **CSS样式优先级**：新的 `.fortune-tip-panel` 样式会覆盖旧样式，确保浮动效果正确
3. **JavaScript状态管理**：使用 `isOpen` 变量跟踪面板状态，避免状态混乱
4. **定时器清理**：在关闭面板时清理定时器，避免内存泄漏

### 潜在问题
1. **布局破坏**：如果其他元素依赖旧的轮数进度条结构，可能需要调整
2. **动画冲突**：如果页面有其他动画，可能需要调整动画时长或曲线
3. **移动端适配**：确保在移动设备上触摸交互流畅

### 回滚方案
如果出现问题，可以通过以下命令回滚：
```bash
git revert HEAD
```

---

## 验收标准

- [ ] 轮数和运势提示在同一行显示
- [ ] 轮数显示格式为 "X/Y"，无进度条和多余文字
- [ ] 💡图标可点击，有悬停和点击效果
- [ ] 点击💡图标，运势提示面板从右往左滑入展开
- [ ] 再次点击💡图标，运势提示面板从左往右滑出折叠
- [ ] 展开后5秒自动折叠
- [ ] 所有功能正常，无bug
- [ ] 动画流畅，性能良好
- [ ] 在不同屏幕尺寸下显示正常
