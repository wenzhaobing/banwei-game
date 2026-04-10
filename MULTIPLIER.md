## 📊 multiplier 影响的计算详解

这些 multiplier 会在游戏的**多个核心计算环节**中生效。让我详细说明每个 multiplier 影响哪些计算：

---

### 一、multiplier 完整映射表

| multiplier | 影响的系统 | 影响的数值 | 生效时机 |
|------------|------------|------------|----------|
| `slackBonus` | 事件系统 | 理智、压力、存款 | 选择带 `slack_off` 标签的选项时 |
| `stressMultiplier` | 事件系统 | 压力 | 所有事件的压力变化 |
| `sanityMultiplier` | 事件系统 | 理智 | 所有事件的理智变化 |
| `moneyMultiplier` | 事件系统 | 存款 | 所有事件的存款变化 |
| `backstabPenalty` | 事件系统 | 理智、压力、存款 | 选择带 `backstab` 标签的选项时 |
| `coffeeBonus` | 事件系统 | 理智、压力 | 选择带 `coffee` 标签的选项时 |
| `instantMoney` | 运势系统 | 存款 | 应用运势时立即生效 |
| `instantSanity` | 运势系统 | 理智 | 应用运势时立即生效 |
| `instantStress` | 运势系统 | 压力 | 应用运势时立即生效 |
| `randomizeEffects` | 事件系统 | 理智、压力、存款 | 所有事件选项 |

---

### 二、详细计算逻辑

#### 1. `slackBonus` - 摸鱼收益加成

```javascript
// 在 game.js 中的 applyModifier 函数
function applyModifier(effects, tags) {
    let result = { ...effects };
    
    // 如果事件标签包含 slack_off（摸鱼事件）
    if (tags && tags.includes('slack_off')) {
        const bonus = gameState.fortuneModifier.slackBonus || 1.0;
        result.sanity = Math.floor(result.sanity * bonus);
        result.stress = Math.floor(result.stress * bonus);
        result.money = Math.floor(result.money * bonus);
        // 示例：slackBonus = 1.5 → 效果 ×1.5
    }
    
    return result;
}

// 使用示例
// 原效果：sanity: +5, stress: -10, money: 0
// slackBonus = 1.5 → 实际效果：sanity: +7, stress: -15, money: 0
```

#### 2. `stressMultiplier` - 压力变化倍率

```javascript
// 在 game.js 中
function applyModifier(effects, tags) {
    let result = { ...effects };
    
    // 全局压力倍率
    const stressMult = gameState.fortuneModifier.stressMultiplier || 1.0;
    result.stress = Math.floor(result.stress * stressMult);
    // 示例：原压力 -10，stressMultiplier = 0.7 → 实际 -7（减少30%）
    //      原压力 +20，stressMultiplier = 1.2 → 实际 +24（增加20%）
    
    return result;
}
```

#### 3. `sanityMultiplier` - 理智变化倍率

```javascript
// 在 game.js 中
function applyModifier(effects, tags) {
    let result = { ...effects };
    
    // 全局理智倍率
    const sanityMult = gameState.fortuneModifier.sanityMultiplier || 1.0;
    result.sanity = Math.floor(result.sanity * sanityMult);
    // 示例：原理智 +10，sanityMultiplier = 1.3 → 实际 +13
    //      原理智 -20，sanityMultiplier = 0.8 → 实际 -16
}
```

#### 4. `moneyMultiplier` - 存款变化倍率

```javascript
// 在 game.js 中
function applyModifier(effects, tags) {
    let result = { ...effects };
    
    // 全局存款倍率
    const moneyMult = gameState.fortuneModifier.moneyMultiplier || 1.0;
    result.money = Math.floor(result.money * moneyMult);
    // 示例：原存款 +100，moneyMultiplier = 1.5 → 实际 +150
    //      原存款 -80，moneyMultiplier = 0.7 → 实际 -56
}
```

#### 5. `backstabPenalty` - 背锅惩罚加成

```javascript
// 在 game.js 中
function applyModifier(effects, tags) {
    let result = { ...effects };
    
    // 如果事件标签包含 backstab（背锅事件）
    if (tags && tags.includes('backstab')) {
        const penalty = gameState.fortuneModifier.backstabPenalty || 1.0;
        result.sanity = Math.floor(result.sanity * penalty);
        result.stress = Math.floor(result.stress * penalty);
        result.money = Math.floor(result.money * penalty);
        // 示例：backstabPenalty = 1.5 → 惩罚效果 ×1.5
        //      原效果 -20 理智 → 实际 -30 理智
    }
    
    return result;
}
```

#### 6. `coffeeBonus` - 咖啡效果加成

```javascript
// 在 game.js 中
function applyModifier(effects, tags) {
    let result = { ...effects };
    
    // 如果事件标签包含 coffee（咖啡事件）
    if (tags && tags.includes('coffee')) {
        const bonus = gameState.fortuneModifier.coffeeBonus || 1.0;
        result.sanity = Math.floor(result.sanity * bonus);
        result.stress = Math.floor(result.stress * bonus);
        // 示例：coffeeBonus = 1.5 → 咖啡效果 ×1.5
        //      原理智 +15 → 实际 +22
        //      原压力 -20 → 实际 -30
    }
    
    return result;
}
```

#### 7. `instantMoney` / `instantSanity` / `instantStress` - 立即生效

```javascript
// 在 fortune.js 中
function applyDailyFortune() {
    const fortune = getDailyFortune();
    
    // 应用即时效果
    if (fortune.multiplier.instantMoney) {
        gameState.money += fortune.multiplier.instantMoney;
        showToast(`💰 获得 ${fortune.multiplier.instantMoney} 存款`, '🎁');
    }
    
    if (fortune.multiplier.instantSanity) {
        gameState.sanity += fortune.multiplier.instantSanity;
        showToast(`💖 获得 ${fortune.multiplier.instantSanity} 理智`, '🎁');
    }
    
    if (fortune.multiplier.instantStress) {
        gameState.stress += fortune.multiplier.instantStress;
        showToast(`😫 压力 +${fortune.multiplier.instantStress}`, '⚠️');
    }
    
    // 数值限制
    gameState.sanity = clamp(gameState.sanity, 0, gameState.maxSanity);
    gameState.stress = clamp(gameState.stress, 0, gameState.maxStress);
    gameState.money = clamp(gameState.money, 0, gameState.maxMoney);
}
```

#### 8. `randomizeEffects` - 随机化效果

```javascript
// 在 game.js 中
function applyModifier(effects, tags) {
    let result = { ...effects };
    
    // 如果运势启用了随机化
    if (gameState.fortuneModifier.randomizeEffects) {
        // 所有数值变化随机 ±50%
        const randomFactor = () => 0.5 + Math.random();
        result.sanity = Math.floor(result.sanity * randomFactor());
        result.stress = Math.floor(result.stress * randomFactor());
        result.money = Math.floor(result.money * randomFactor());
        // 示例：原效果 +20 理智 → 实际 +10 ~ +30 随机
    }
    
    return result;
}
```

---

### 三、完整的事件效果计算流程

```javascript
// 在 game.js 中的完整计算流程
function applyEffects(opt, btnElement) {
    // 1. 获取原始效果
    let effects = { ...opt.effects };
    const tags = opt.tags || [];
    
    // 2. 应用运势 modifier（核心计算）
    let modified = applyModifier(effects, tags);
    
    // 3. 应用成就奖励（如有）
    modified = applyAchievementBonus(modified, tags);
    
    // 4. 数值限制
    gameState.sanity = clamp(gameState.sanity + modified.sanity, 0, gameState.maxSanity);
    gameState.stress = clamp(gameState.stress + modified.stress, 0, gameState.maxStress);
    gameState.money = clamp(gameState.money + modified.money, 0, gameState.maxMoney);
    
    // 5. 显示变化
    showNumberPop(modified.sanity - effects.sanity, x, y);
    
    return modified;
}

// 完整的 modifier 应用函数
function applyModifier(effects, tags) {
    let result = { ...effects };
    const mod = gameState.fortuneModifier;
    
    // 随机化效果（优先级最高）
    if (mod.randomizeEffects) {
        result.sanity = Math.floor(result.sanity * (0.5 + Math.random()));
        result.stress = Math.floor(result.stress * (0.5 + Math.random()));
        result.money = Math.floor(result.money * (0.5 + Math.random()));
        return result;
    }
    
    // 应用标签专属加成
    if (tags.includes('slack_off') && mod.slackBonus) {
        result.sanity = Math.floor(result.sanity * mod.slackBonus);
        result.stress = Math.floor(result.stress * mod.slackBonus);
        result.money = Math.floor(result.money * mod.slackBonus);
    }
    
    if (tags.includes('backstab') && mod.backstabPenalty) {
        result.sanity = Math.floor(result.sanity * mod.backstabPenalty);
        result.stress = Math.floor(result.stress * mod.backstabPenalty);
        result.money = Math.floor(result.money * mod.backstabPenalty);
    }
    
    if (tags.includes('coffee') && mod.coffeeBonus) {
        result.sanity = Math.floor(result.sanity * mod.coffeeBonus);
        result.stress = Math.floor(result.stress * mod.coffeeBonus);
    }
    
    // 应用全局倍率
    if (mod.sanityMultiplier) {
        result.sanity = Math.floor(result.sanity * mod.sanityMultiplier);
    }
    if (mod.stressMultiplier) {
        result.stress = Math.floor(result.stress * mod.stressMultiplier);
    }
    if (mod.moneyMultiplier) {
        result.money = Math.floor(result.money * mod.moneyMultiplier);
    }
    
    return result;
}
```

---

### 四、multiplier 优先级顺序

```
1. randomizeEffects（最高优先级，覆盖其他所有效果）
         ↓
2. 标签专属加成（slackBonus、backstabPenalty、coffeeBonus）
         ↓
3. 全局倍率（sanityMultiplier、stressMultiplier、moneyMultiplier）
         ↓
4. 即时效果（instantMoney、instantSanity、instantStress）
```

---

### 五、实际计算示例

假设当前运势：`slackBonus: 1.5, stressMultiplier: 0.7`

**原事件**：
```javascript
{
    text: "刷短视频 😂",
    effects: { sanity: 5, stress: -10, money: 0 },
    tags: ["slack_off"]
}
```

**计算过程**：
```javascript
// 1. 标签专属加成（slackBonus = 1.5）
sanity = 5 × 1.5 = 7.5 → 7
stress = -10 × 1.5 = -15
money = 0 × 1.5 = 0

// 2. 全局倍率（stressMultiplier = 0.7）
stress = -15 × 0.7 = -10.5 → -10

// 最终效果
{ sanity: 7, stress: -10, money: 0 }
```

**结果显示**：理智 +7，压力 -10（原压力 -10 被 slackBonus 放大后又被 stressMultiplier 缩小，最终不变）

---
