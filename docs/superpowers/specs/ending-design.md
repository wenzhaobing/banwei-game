# 版本2.0
## 🎯 20轮上限功能实现指南

基于当前2倍数值（8-12轮平均结束），20轮上限作为「兜底机制」实现非常简单。

---

## 一、核心逻辑

```
每轮结束 → 轮数+1 → 检查是否达到20轮 → 是则强制结束
                    ↓
              同时检查结局 → 优先触发结局
```

---

## 二、完整实现代码

### 2.1 游戏状态管理

```javascript
// game-state.js
export class GameState {
    constructor() {
        this.rounds = 0;           // 当前轮数
        this.maxRounds = 20;       // 最大轮数
        this.isGameOver = false;   // 游戏是否结束
        this.endingType = null;    // 结局类型
    }
    
    // 增加轮数
    incrementRound() {
        this.rounds++;
    }
    
    // 检查是否达到上限
    isMaxRoundsReached() {
        return this.rounds >= this.maxRounds;
    }
    
    // 结束游戏
    endGame(endingType) {
        this.isGameOver = true;
        this.endingType = endingType;
    }
    
    // 重置游戏
    reset() {
        this.rounds = 0;
        this.isGameOver = false;
        this.endingType = null;
    }
    
    // 获取进度（用于UI）
    getProgress() {
        return {
            current: this.rounds,
            max: this.maxRounds,
            percent: (this.rounds / this.maxRounds) * 100
        };
    }
}

export const gameState = new GameState();
```

---

### 2.2 主游戏逻辑

```javascript
// main.js
import { gameState } from './game-state.js';
import { checkEnding, endings } from './endings.js';

let currentEvent = null;

// 初始化游戏
function initGame() {
    gameState.reset();
    updateProgressUI();
    loadRandomEvent();
}

// 每轮结束后调用
function afterRound() {
    // 1. 增加轮数
    gameState.incrementRound();
    updateProgressUI();
    
    // 2. 检查结局（优先级最高）
    const ending = checkEnding();
    if (ending) {
        gameState.endGame(ending);
        showEnding(ending);
        return;
    }
    
    // 3. 检查轮数上限（兜底）
    if (gameState.isMaxRoundsReached()) {
        gameState.endGame('time_limit');
        showEnding('time_limit');
        return;
    }
    
    // 4. 继续下一轮
    loadRandomEvent();
}

// 更新进度条UI
function updateProgressUI() {
    const progress = gameState.getProgress();
    const progressBar = document.getElementById('roundProgress');
    const roundText = document.getElementById('roundText');
    
    if (progressBar) {
        progressBar.style.width = `${progress.percent}%`;
    }
    if (roundText) {
        roundText.textContent = `第 ${progress.current} / ${progress.max} 轮`;
    }
}

// 显示结局
function showEnding(endingType) {
    const ending = endings[endingType];
    const modal = createEndingModal(ending, gameState.rounds);
    document.body.appendChild(modal);
}

// 创建结局弹窗
function createEndingModal(ending, rounds) {
    const modal = document.createElement('div');
    modal.className = 'ending-modal';
    modal.innerHTML = `
        <div class="ending-content">
            <div class="ending-icon">${ending.icon}</div>
            <div class="ending-title">${ending.title}</div>
            <div class="ending-desc">${ending.desc}</div>
            <div class="ending-stats">
                📊 本轮共经历 ${rounds} 个事件
            </div>
            <div class="ending-buttons">
                <button class="restart-btn" onclick="location.reload()">🔄 重新开始</button>
            </div>
        </div>
    `;
    return modal;
}
```

---

### 2.3 UI组件（进度条）

```html
<!-- 添加到游戏主界面顶部 -->
<div class="round-progress-container">
    <div class="round-info">
        <span class="round-icon">📊</span>
        <span class="round-text" id="roundText">第 0 / 20 轮</span>
    </div>
    <div class="round-progress-bar">
        <div class="round-progress-fill" id="roundProgress" style="width: 0%"></div>
    </div>
</div>
```

```css
/* 进度条样式 */
.round-progress-container {
    background: #fff5e6;
    margin: 12px 20px;
    padding: 10px 16px;
    border-radius: 20px;
    border: 1px solid #f0e2d0;
}

.round-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 13px;
    color: #5a4a3a;
}

.round-progress-bar {
    height: 6px;
    background: #e8dccc;
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

---

### 2.4 结局定义（新增兜底结局）

```javascript
// endings.js
export const endings = {
    // ... 原有结局
    
    // 新增：20轮自然结束
    time_limit: {
        name: "🎯 安全着陆",
        icon: "🛬",
        desc: "你平稳地度过了20轮，既没有暴毙，也没有成神。",
        getDesc: (rounds, money) => {
            return `你存活了 ${rounds} 轮，最终存款 ${money} 元。\n虽然不是最精彩的结局，但至少...你活下来了。`;
        }
    }
};

// 检查结局（优先级：数值结局 > 轮数上限）
export function checkEnding(gameState, playerStats) {
    // 1. 数值结局（优先级最高）
    if (playerStats.sanity <= 0) return 'sanity_zero';
    if (playerStats.money <= 0) return 'money_zero';
    if (playerStats.stress >= 100) return 'stress_max';
    if (playerStats.sanity >= 200) return 'sanity_max';
    
    // 2. 轮数上限（兜底）
    if (gameState.isMaxRoundsReached()) return 'time_limit';
    
    return null;
}
```

---

## 三、完整流程图

```
开始游戏
    ↓
第1轮事件 → 选择选项 → 数值变化
    ↓
检查结局？ → 是 → 显示结局 → 结束
    ↓ 否
轮数+1，更新进度条
    ↓
轮数=20？ → 是 → 显示「安全着陆」结局 → 结束
    ↓ 否
继续下一轮
```

---

## 四、预期效果

| 场景 | 概率 | 结局 |
|------|------|------|
| 2-3轮触发结局 | ~10% | ICU/爆炸/吃土/成神 |
| 4-12轮触发结局 | ~70% | 各种结局 |
| 13-19轮触发结局 | ~10% | 各种结局 |
| 20轮未触发 | ~10% | **安全着陆** |

---

## 五、完整文件结构

```
src/
├── game-state.js      # 游戏状态管理（轮数计数）
├── main.js            # 主游戏逻辑（集成轮数检查）
├── endings.js         # 结局定义（含安全着陆）
├── index.html         # UI（进度条）
└── style.css          # 进度条样式
```

---

## 六、总结

| 组件 | 说明 |
|------|------|
| **轮数计数** | `gameState.rounds` |
| **最大轮数** | 20轮 |
| **进度条** | 实时显示当前进度 |
| **结局优先级** | 数值结局 > 轮数上限 |
| **兜底结局** | 「安全着陆」 |

**核心代码量**：约50行，改动极小，立即可用！



# 版本1.0
## 🎯 动态拼凑式结局系统

这个方案**更灵活、更有重玩性**！同样是「吃土少年」结局，但每次的描述和总结都不同，玩家会想反复尝试看不同组合。

---

## 一、核心设计思路

```
结局类型（固定5种）+ 数值区间（决定描述片段）+ 人格标签（决定总结）= 独一无二的结局文案
```

**举例**：
- 同样是「吃土少年」结局
- 存款归零时，理智高 vs 理智低 → 不同描述
- 压力高 vs 压力低 → 不同总结
- 组合出 3×3×3 = 27 种变体

---

## 二、动态片段库设计

### 1. 结局框架（5种固定）

| 结局ID | 结局名称 | 固定部分 |
|--------|----------|----------|
| `money_zero` | 吃土少年 | 存款归零触发 |
| `sanity_zero` | ICU常客 | 理智归零触发 |
| `stress_max` | 职场爆炸 | 压力满值触发 |
| `sanity_max` | 职场成神 | 理智满值触发 |
| `survived` | 职场传说 | 存活100轮触发 |

### 2. 动态片段库（按数值区间）

#### 理智状态片段（3种）

| 区间 | 标签 | 描述片段 | 总结片段 |
|------|------|----------|----------|
| 高 (≥150) | 🧠清醒 | 「头脑清醒，思路清晰」 | 「你始终保持理智，没有失去自我」 |
| 中 (50-149) | 😌正常 | 「精神状态还算正常」 | 「你的理智时高时低，但总体可控」 |
| 低 (≤49) | 😵恍惚 | 「脑子嗡嗡的，像装了台永动机」 | 「你的理智早已离家出走」 |

#### 压力状态片段（3种）

| 区间 | 标签 | 描述片段 | 总结片段 |
|------|------|----------|----------|
| 高 (≥70) | 💢爆炸 | 「压力大到头发一把把掉」 | 「压力是你最大的敌人」 |
| 中 (30-69) | 😤紧绷 | 「压力不小，但还能撑住」 | 「你学会了与压力共处」 |
| 低 (≤29) | 😎轻松 | 「心态稳如老狗」 | 「你找到了释放压力的秘诀」 |

#### 存款状态片段（3种）

| 区间 | 标签 | 描述片段 | 总结片段 |
|------|------|----------|----------|
| 高 (≥700) | 💰富裕 | 「钱包鼓鼓，底气十足」 | 「金钱给了你辞职的勇气」 |
| 中 (300-699) | 💵正常 | 「够花但不够浪」 | 「你对金钱有清醒的认知」 |
| 低 (≤299) | 🍜拮据 | 「泡面是唯一的朋友」 | 「贫穷限制了你的想象力」 |

#### 结局专属片段（每个结局3种变体）

**吃土少年**的3种结局描述：

| 变体 | 描述片段 |
|------|----------|
| 版本A | 「工资到账当天就还了信用卡、花呗、白条。看着余额0.00，你陷入了沉思。」 |
| 版本B | 「同事叫你一起吃饭，你说『我减肥』。其实你只是没钱了，回家煮了包泡面。」 |
| 版本C | 「你打开外卖软件，筛选了半小时，最后默默关掉了页面。」 |

**ICU常客**的3种结局描述：

| 变体 | 描述片段 |
|------|----------|
| 版本A | 「你连续加班30天，每天只睡4小时。在第31天的凌晨，你倒在了工位上。」 |
| 版本B | 「体检报告出来，10项异常。医生说你再这样下去要出大事。」 |
| 版本C | 「你的发际线越来越高，黑眼圈越来越重，同事以为你化了烟熏妆。」 |

---

## 三、核心代码实现

```javascript
// ============ 动态拼凑式结局系统 ============

class DynamicEnding {
    constructor(gameState, endingType, totalRounds) {
        this.sanity = gameState.sanity;
        this.stress = gameState.stress;
        this.money = gameState.money;
        this.maxSanity = gameState.maxSanity;
        this.maxStress = gameState.maxStress;
        this.ending = endingType;
        this.rounds = totalRounds;
        
        // 计算区间
        this.sanityLevel = this.getSanityLevel();
        this.stressLevel = this.getStressLevel();
        this.moneyLevel = this.getMoneyLevel();
        
        // 随机种子（基于数值，保证同一局不变）
        this.seed = (this.sanity + this.stress + this.money) % 3;
    }
    
    getSanityLevel() {
        if (this.sanity >= 150) return 'high';
        if (this.sanity >= 50) return 'mid';
        return 'low';
    }
    
    getStressLevel() {
        if (this.stress >= 70) return 'high';
        if (this.stress >= 30) return 'mid';
        return 'low';
    }
    
    getMoneyLevel() {
        if (this.money >= 700) return 'high';
        if (this.money >= 300) return 'mid';
        return 'low';
    }
    
    // 片段库
    getFragments() {
        const sanityFragments = {
            high: { desc: '头脑清醒，思路清晰', summary: '你始终保持理智，没有失去自我' },
            mid: { desc: '精神状态还算正常', summary: '你的理智时高时低，但总体可控' },
            low: { desc: '脑子嗡嗡的，像装了台永动机', summary: '你的理智早已离家出走' }
        };
        
        const stressFragments = {
            high: { desc: '压力大到头发一把把掉', summary: '压力是你最大的敌人' },
            mid: { desc: '压力不小，但还能撑住', summary: '你学会了与压力共处' },
            low: { desc: '心态稳如老狗', summary: '你找到了释放压力的秘诀' }
        };
        
        const moneyFragments = {
            high: { desc: '钱包鼓鼓，底气十足', summary: '金钱给了你辞职的勇气' },
            mid: { desc: '够花但不够浪', summary: '你对金钱有清醒的认知' },
            low: { desc: '泡面是唯一的朋友', summary: '贫穷限制了你的想象力' }
        };
        
        return {
            sanity: sanityFragments[this.sanityLevel],
            stress: stressFragments[this.stressLevel],
            money: moneyFragments[this.moneyLevel]
        };
    }
    
    // 结局专属片段（每个结局3种变体）
    getEndingSpecific() {
        const endings = {
            money_zero: {
                name: '吃土少年',
                icon: '🍜',
                variants: [
                    '工资到账当天就还了信用卡、花呗、白条。看着余额0.00，你陷入了沉思。',
                    '同事叫你一起吃饭，你说「我减肥」。其实你只是没钱了，回家煮了包泡面。',
                    '你打开外卖软件，筛选了半小时，最后默默关掉了页面。'
                ],
                summaries: [
                    '最终，你的钱包比脸还干净，只能回家啃老。',
                    '最终，你学会了用花呗还花呗，成为了时间管理大师。',
                    '最终，你的存款和你的头发一样，都所剩无几了。'
                ]
            },
            sanity_zero: {
                name: 'ICU常客',
                icon: '⚰️',
                variants: [
                    '你连续加班30天，每天只睡4小时。在第31天的凌晨，你倒在了工位上。',
                    '体检报告出来，10项异常。医生说你再这样下去要出大事。',
                    '你的发际线越来越高，黑眼圈越来越重，同事以为你化了烟熏妆。'
                ],
                summaries: [
                    '最终，你的理智被加班消耗殆尽，倒在了工位上。',
                    '最终，你成为了公司的传说——那个被救护车接走的人。',
                    '最终，你的身体先于你的梦想倒下了。'
                ]
            },
            stress_max: {
                name: '职场爆炸',
                icon: '😤',
                variants: [
                    '老板又在群里@你加班，你看着第108版修改意见，终于爆发了。',
                    '你在会议上当场拍桌子，说出了憋了三年的心里话。',
                    '你把辞职信摔在老板桌上，潇洒地走出了公司大门。'
                ],
                summaries: [
                    '最终，压力让你爆发，你拍桌辞职，成为了传说中的反骨仔。',
                    '最终，你选择了自由，虽然代价是没了收入。',
                    '最终，你用一次爆发，换来了内心的平静。'
                ]
            },
            sanity_max: {
                name: '职场成神',
                icon: '🧘',
                variants: [
                    '你已经看透了一切。老板的PUA对你无效，同事的八卦你充耳不闻。',
                    '你每天准时上下班，工作高效，心态平和。同事们开始找你咨询人生。',
                    '你学会了在工位上冥想，外界的一切都与你无关。'
                ],
                summaries: [
                    '最终，你看透了一切，成为了办公室的精神导师。',
                    '最终，你找到了工作和生活的平衡，成为了人生赢家。',
                    '最终，你的境界已经超越了职场，达到了新的高度。'
                ]
            },
            survived: {
                name: '职场传说',
                icon: '🏆',
                variants: [
                    '你在这家公司待了整整100轮。见证了3轮裁员，5任领导。',
                    '新来的实习生都叫你「传说哥」，你笑而不语。',
                    '你的工位上贴满了「最佳员工」的奖状，虽然都是自己打印的。'
                ],
                summaries: [
                    '最终，你活到了最后，成为了职场传说。',
                    '最终，你证明了摸鱼也能摸出境界。',
                    '最终，你的名字被刻在了公司的传说墙上。'
                ]
            }
        };
        
        const ending = endings[this.ending];
        const variantIndex = this.seed % ending.variants.length;
        
        return {
            ...ending,
            variantDesc: ending.variants[variantIndex],
            variantSummary: ending.summaries[variantIndex]
        };
    }
    
    // 生成完整描述
    generateDescription() {
        const fragments = this.getFragments();
        const ending = this.getEndingSpecific();
        
        // 组合描述：状态片段 + 结局片段
        const parts = [
            `你${fragments.sanity.desc}，${fragments.stress.desc}，${fragments.money.desc}。`,
            ending.variantDesc
        ];
        
        return parts.join(' ');
    }
    
    // 生成总结
    generateSummary() {
        const fragments = this.getFragments();
        const ending = this.getEndingSpecific();
        
        const parts = [
            fragments.sanity.summary，
            fragments.stress.summary，
            fragments.money.summary,
            ending.variantSummary
        ];
        
        return parts.join('。') + '。';
    }
    
    // 生成人格标签
    getPersonalityTags() {
        const workTag = this.moneyLevel === 'high' ? '🔥卷王' : (this.moneyLevel === 'mid' ? '⚖️打工人' : '😴躺平');
        const survivalTag = this.stressLevel === 'low' ? '🦊老油条' : (this.stressLevel === 'mid' ? '🐣新人' : '🐑老实人');
        const mentalTag = this.sanityLevel === 'high' ? '🧘佛系' : (this.sanityLevel === 'mid' ? '😌平和' : '😫焦虑');
        const moneyTag = this.moneyLevel === 'high' ? '💰土豪' : (this.moneyLevel === 'mid' ? '💵小康' : '🍜月光');
        
        return `${workTag} · ${survivalTag} · ${mentalTag} · ${moneyTag}`;
    }
    
    // 生成完整HTML
    generateHTML() {
        const ending = this.getEndingSpecific();
        const description = this.generateDescription();
        const summary = this.generateSummary();
        const tags = this.getPersonalityTags();
        
        return `
            <div class="ending-modal">
                <div class="ending-icon">${ending.icon}</div>
                <div class="ending-title">结局：${ending.name}</div>
                
                <div class="ending-desc">
                    ${description}
                </div>
                
                <div class="personality-badge">
                    ${tags}
                </div>
                
                <div class="personality-desc">
                    ${summary}
                </div>
                
                <div class="stats-summary">
                    <div class="stat">💖 理智: ${this.sanity}/${this.maxSanity}</div>
                    <div class="stat">😫 压力: ${this.stress}/${this.maxStress}</div>
                    <div class="stat">💰 存款: ${this.money}/1000</div>
                    <div class="stat">📊 共经历 ${this.rounds} 轮</div>
                </div>
                
                <div class="ending-buttons">
                    <button class="share-btn" onclick="copyEnding()">📋 复制结局</button>
                    <button class="share-btn" onclick="shareEnding()">📤 分享朋友圈</button>
                    <button class="restart-btn" onclick="restartGame()">🔄 重新开始</button>
                </div>
            </div>
        `;
    }
}

// 使用示例
function onGameEnd(gameState, endingType, totalRounds) {
    const ending = new DynamicEnding(gameState, endingType, totalRounds);
    const html = ending.generateHTML();
    showEndingModal(html);
}
```

---

## 四、组合变体数量

| 结局 | 理智状态 | 压力状态 | 存款状态 | 结局变体 | 总组合 |
|------|----------|----------|----------|----------|--------|
| 吃土少年 | 3种 | 3种 | 3种 | 3种 | 3×3×3×3 = **81种** |
| ICU常客 | 3种 | 3种 | 3种 | 3种 | **81种** |
| 职场爆炸 | 3种 | 3种 | 3种 | 3种 | **81种** |
| 职场成神 | 3种 | 3种 | 3种 | 3种 | **81种** |
| 职场传说 | 3种 | 3种 | 3种 | 3种 | **81种** |
| **总计** | - | - | - | - | **405种** |

---

## 五、示例输出对比

### 同样是「吃土少年」，不同数值产生不同文案

**示例A**（理智高、压力低、存款低）：
> 🍜 **吃土少年**
>
> 你头脑清醒，思路清晰，心态稳如老狗，泡面是唯一的朋友。
> 同事叫你一起吃饭，你说「我减肥」。其实你只是没钱了，回家煮了包泡面。
>
> 你始终保持理智，没有失去自我。你找到了释放压力的秘诀。贫穷限制了你的想象力。最终，你的钱包比脸还干净，只能回家啃老。

**示例B**（理智低、压力高、存款低）：
> 🍜 **吃土少年**
>
> 你脑子嗡嗡的，像装了台永动机，压力大到头发一把把掉，泡面是唯一的朋友。
> 你打开外卖软件，筛选了半小时，最后默默关掉了页面。
>
> 你的理智早已离家出走。压力是你最大的敌人。贫穷限制了你的想象力。最终，你学会了用花呗还花呗，成为了时间管理大师。

---

## 六、方案对比

| 维度 | 固定5结局 | 动态拼凑式 |
|------|----------|-----------|
| 结局数量 | 5种 | 5种（但变体405种） |
| 重玩性 | 低 | **高**（每次不同） |
| 实现复杂度 | 简单 | 中等 |
| 玩家新鲜感 | 几次就腻 | **可玩很久** |
| 分享传播 | 一般 | **强**（每次结果不同） |

**推荐使用动态拼凑式**，用最少的代码实现最大的变化！