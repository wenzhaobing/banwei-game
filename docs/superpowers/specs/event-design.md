# 事件选项系统设计文档

**日期**: 2026-04-17
**更新**: 2026-04-22

---

## v3.0需求
## 🎯 问题：选项全正面或全负面，玩家没得选

这是一个非常核心的体验问题！当玩家面对三个选项时：

| 情况 | 玩家感受 | 问题 |
|------|----------|------|
| **3个全正面** | 随便选哪个都行 | 策略性=0，无聊 |
| **3个全负面** | 选哪个都亏 | 挫败感强，不想玩 |
| **2正面1负面** | 避开坏的就行 | 策略性低 |
| **2负面1正面** | 只能选那个好的 | 被迫选择 |

**理想状态**：每个选项都有得有失，让玩家需要权衡。

---

## 一、解决方案：选项类型强制均衡

### 核心规则
**每个事件的3个选项，必须包含至少1个正面和1个负面，第3个可以是中性或混合。**

```javascript
// 选项类型强制配置
const OPTION_TYPE_REQUIREMENT = {
    minPositive: 1,    // 至少1个正面
    minNegative: 1,    // 至少1个负面
    total: 3           // 总共3个选项
};
```

---

## 二、实现方案

### 方案：运行时动态生成选项（高级）

从选项池中按类型抽取，保证每种类型至少一个：

```javascript
// 运行时选项生成器
class OptionGenerator {
    constructor(optionPools) {
        this.pools = optionPools;
    }
    
    // 生成均衡的3个选项
    generateBalancedOptions() {
        const options = [];
        
        // 1. 确保至少1个正面
        const positivePool = this.pools.filter(opt => this.isPositive(opt));
        options.push(this.randomFromPool(positivePool));
        
        // 2. 确保至少1个负面
        const negativePool = this.pools.filter(opt => this.isNegative(opt));
        options.push(this.randomFromPool(negativePool));
        
        // 3. 随机选第3个（可以是任何类型）
        const allPool = this.pools;
        options.push(this.randomFromPool(allPool));
        
        // 4. 打乱顺序
        return this.shuffle(options);
    }
    
    isPositive(opt) {
        const score = (opt.effects.sanity || 0) + 
                      (opt.effects.money || 0) - 
                      (opt.effects.stress || 0);
        return score > 10;
    }
    
    isNegative(opt) {
        const score = (opt.effects.sanity || 0) + 
                      (opt.effects.money || 0) - 
                      (opt.effects.stress || 0);
        return score < -10;
    }
}
```

---

## 三、正面/负面/中性的判定标准

```javascript
// 统一打分函数
function calculateOptionScore(option) {
    const sanity = option.effects.sanity || 0;
    const stress = option.effects.stress || 0;
    const money = option.effects.money || 0;
    
    // 权重：存款100 ≈ 理智20 ≈ 压力20
    return sanity + money/5 - stress;
}

// 类型判定
function getOptionType(option) {
    const score = calculateOptionScore(option);
    
    if (score >= 10) return 'positive';   // 明显正面
    if (score <= -10) return 'negative';  // 明显负面
    return 'neutral';                      // 中性/混合
}
```

**判定示例**：

| 选项 | 效果 | 得分 | 类型 |
|------|------|------|------|
| 刷短视频 | +10💖 -20😫 | 10+4=14 | ✅ 正面 |
| 认真工作 | -20💖 +20😫 +100💰 | -20-4+20=-4 | ⚠️ 中性 |
| 装死 | -30💖 +20😫 -100💰 | -30-4-20=-54 | ❌ 负面 |

---

## 四、验证工具

```javascript
// 批量检查所有事件
function validateAllEvents(events) {
    const issues = [];
    
    events.forEach(event => {
        const types = event.options.map(opt => getOptionType(opt));
        const hasPositive = types.includes('positive');
        const hasNegative = types.includes('negative');
        
        if (!hasPositive) {
            issues.push(`${event.id}: 缺少正面选项`);
        }
        if (!hasNegative) {
            issues.push(`${event.id}: 缺少负面选项`);
        }
    });
    
    if (issues.length > 0) {
        console.warn('事件配置问题：', issues);
        return false;
    }
    console.log('✅ 所有事件配置合格');
    return true;
}
```

---

## 五、数据修正示例

如果现有事件不符合要求，需要修正：

```javascript
// 修正前：全是负面
{
    id: "boss_bad",
    options: [
        { text: "装死", effects: { sanity: -30, stress: 20, money: -100 } },  // 负面
        { text: "背锅", effects: { sanity: -20, stress: 25, money: -50 } },   // 负面
        { text: "顶嘴", effects: { sanity: -25, stress: 30, money: -80 } }    // 负面
    ]
}

// 修正后：添加正面选项
{
    id: "boss_fixed",
    options: [
        { text: "主动汇报", effects: { sanity: -5, stress: -10, money: 50 } },   // 正面 ✅
        { text: "正常应对", effects: { sanity: 0, stress: 0, money: 0 } },       // 中性
        { text: "装死", effects: { sanity: -30, stress: 20, money: -100 } }      // 负面
    ]
}
```

---

## 六、总结

| 问题 | 解决方案 |
|------|----------|
| 全正面选项 | 不需要解决（玩家乐意选）但策略性低 |
| 全负面选项 | **必须修复**，添加正面/中性选项 |
| 玩家没得选 | **强制每个事件至少1正1负** |

**核心原则**：玩家应该面临「权衡」，而不是「被迫接受」或「随便选」。

**实施建议**：
1. 先用验证工具检查现有30个事件
2. 修复不符合要求的事件
3. 后续新增事件时，遵循「1正1负」规则

## v2.0的需求

### 核心规则（简化版）

| 规则 | 说明 |
|------|------|
| **一轮内不重复** | 同一轮游戏中，每个事件最多出现1次 |
| **触发结局重置** | 游戏结束（数值结局/20轮满）后，重置事件池 |
| **重开重置** | 玩家手动点击「重开」，重置事件池 |

### 实现逻辑

```
游戏开始/重开/结局触发
        ↓
   重置事件池（30个事件全部可用）
        ↓
   随机打乱顺序（洗牌）
        ↓
   依次抽取事件（每轮1个）
        ↓
   轮数达到20 或 触发结局 → 游戏结束
        ↓
   下一次开始 → 重新洗牌
```

### 删除的概念

| 删除项 | 原因 |
|------|------|
| 事件池用尽 | 30 > 20，永远不会用尽 |
| 完美通关结局 | 不需要，因为事件池永远有剩余 |

---

## 三、简化后的需求文档

```markdown
# 需求：一轮内事件不重复（事件池洗牌机制）

## 1. 核心规则
- 同一轮游戏（最多20轮）中，每个事件最多出现1次
- 游戏结束后，事件池重置并重新洗牌
- 手动重开后，事件池重置并重新洗牌

## 2. 实现逻辑
1. 游戏开始时，复制30个事件到待抽取池
2. 随机打乱顺序
3. 每轮从池顶取1个事件
4. 取过的事件不再出现
5. 游戏结束后，重复步骤1-4

## 3. 重置时机
- 触发数值结局（理智归零/满值、压力爆表、存款归零）
- 20轮满「安全着陆」结局
- 玩家点击「重开」按钮

## 4. 验收标准
- [ ] 同一轮内，事件ID不重复
- [ ] 第二轮游戏的事件顺序与第一轮不同
- [ ] 重开后事件顺序重新洗牌
```

---

## 四、总结

| 问题 | 答案 |
|------|------|
| 事件池会用尽吗？ | **不会**，30个事件 > 20轮 |
| 需要完美结局吗？ | **不需要**，永远不会触发 |
| 核心要做什么？ | 每轮开始时洗牌 + 游戏结束时重置 |

**一句话需求**：每轮游戏开始前，把30个事件随机打乱，然后按顺序取20个使用，用完一轮后重新打乱。

## v1.0 (已实现)

## 1. 项目背景

### 1.1 问题描述

原游戏存在以下问题：
- **选项固定**: 每个事件永远显示相同的3个选项，玩家第二次玩就知道选哪个
- **效果固定**: 同一个选项永远产生相同数值变化，没有惊喜感
- **顺序固定**: 选项永远按相同顺序排列，可以无脑点同一个位置

### 1.2 目标

实现每个事件有**专属选项池**（5-8个选项），每次随机抽取3个并打乱顺序，达到：
- ✅ 选项位置每次随机变化
- ✅ 选项内容每次不同（从专属池抽取）
- ✅ 增加游戏重玩价值和惊喜感
- ✅ 保持游戏平衡性和核心玩法

---

## 2. 架构设计

### 2.1 文件结构

```
js/
├── data/
│   ├── events-data.js       (事件配置，含专属选项池)
│   └── index.js             (导出更新)
└── utils/
    └── event-generator.js   (事件生成器)
```

### 2.2 模块职责

| 模块 | 职责 | 依赖 |
|------|------|------|
| `events-data.js` | 定义30个事件，每个事件有专属 optionPool | 无 |
| `event-generator.js` | 从选项池随机抽取选项并打乱顺序 | events-data.js |

### 2.3 数据流

```
事件配置 (events-data.js)
    ↓
事件生成器 (event-generator.js)
    ↓
随机抽取3个选项 (从专属池)
    ↓
随机打乱顺序
    ↓
渲染到UI
```

---

## 3. 数据结构设计

### 3.1 事件配置数据结构

**文件**: `js/data/events-data.js`

```javascript
export const events = [
    {
        id: "boss_1",
        title: "👔 老板来了",
        desc: "老板突然出现在你身后...",
        optionPool: [
            { text: "假装写代码 💻", effects: { sanity: -20, stress: 10, money: 100 }, feedback: "老板满意地走了", tags: ["work"] },
            { text: "回头对视 👀", effects: { sanity: -40, stress: 20, money: 0 }, feedback: "尴尬对视3秒，你赢了", tags: [] },
            { text: "装死 😵", effects: { sanity: -60, stress: 40, money: -200 }, feedback: "老板叫了救护车...", tags: ["backstab"] },
            { text: "递上一杯咖啡 ☕", effects: { sanity: 10, stress: -20, money: -40 }, feedback: "老板愣了一下", tags: ["social"] },
            { text: "主动汇报工作 📊", effects: { sanity: -30, stress: 16, money: 120 }, feedback: "老板点头赞许", tags: ["work"] },
            { text: "假装接电话 📞", effects: { sanity: 0, stress: -10, money: 0 }, feedback: "成功逃脱", tags: ["slack_off"] },
            { text: "夸老板领带好看 👔", effects: { sanity: 10, stress: -16, money: 0 }, feedback: "老板心情变好", tags: ["social"] },
            { text: "说身体不舒服 🤒", effects: { sanity: 0, stress: -20, money: 0 }, feedback: "老板让你早点回去", tags: [] }
        ]
    },
    // ... 其他29个事件
];
```

### 3.2 数值范围规范

| 选项类型 | 理智 (sanity) | 压力 (stress) | 金钱 (money) |
|----------|---------------|---------------|--------------|
| 摸鱼型 | +10 ~ +40 | -50 ~ -10 | -200 ~ 0 |
| 工作型 | -40 ~ -10 | +10 ~ +40 | +60 ~ +120 |
| 社交型 | +10 ~ +30 | -40 ~ -10 | -160 ~ 0 |
| 风险型 | -60 ~ +40 | -30 ~ +50 | -200 ~ +100 |
| 中立型 | 0 | -20 ~ +10 | 0 |

**说明**: 数值已按2倍调整，确保游戏节奏适中。

### 3.3 事件分类

| 分类 | 数量 | 示例 |
|------|------|------|
| 老板类 | 4 | 老板来了、老板突然发消息、老板生日、降本增效 |
| 会议类 | 4 | 无聊会议、季度总结大会、线上会议、一对一谈话 |
| 同事类 | 4 | 同事八卦、午饭时间、团建通知、背后说坏话 |
| 工作类 | 4 | 系统崩溃、打印机坏了、咖啡机坏了、重要邮件 |
| 摸鱼类 | 4 | 偷偷摸鱼、手机没电、午休时间、网购 |
| 自我类 | 3 | 学习新技能、健身运动、心理咨询 |
| 特殊类 | 3 | 抽奖、特殊遭遇、神秘事件 |
| 突发类 | 4 | 客户投诉、HR约谈、加班、离职危机 |

---

## 4. 事件生成器设计

**文件**: `js/utils/event-generator.js`

### 4.1 核心功能

```javascript
export class EventGenerator {
    /**
     * 根据事件配置生成动态选项
     * @param {Object} eventConfig - 事件配置 { id, title, desc, optionPool }
     * @returns {Object} 完整的事件对象
     */
    static generateEvent(eventConfig) {
        if (!eventConfig || !eventConfig.optionPool) {
            return { id: 'error', title: '⚠️ 系统错误', desc: '事件加载失败', options: [] };
        }

        const selectedOptions = this.randomSelectOptions(eventConfig.optionPool, 3);

        return {
            id: eventConfig.id,
            title: eventConfig.title,
            desc: eventConfig.desc,
            options: selectedOptions
        };
    }

    /**
     * 从选项池中随机抽取指定数量的不重复选项
     * @param {Array} optionPool - 选项池数组
     * @param {number} count - 需要抽取的选项数量
     * @returns {Array} 抽取的选项数组
     */
    static randomSelectOptions(optionPool, count = 3) {
        if (!optionPool || optionPool.length === 0) return [];
        if (optionPool.length <= count) return [...optionPool];

        const shuffled = [...optionPool];
        for (let i = shuffled.length - 1; i > shuffled.length - count - 1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(-count);
    }

    /**
     * 随机打乱选项顺序（Fisher-Yates 洗牌算法）
     * @param {Array} options - 选项数组
     * @returns {Array} 打乱后的选项数组
     */
    static shuffleOptions(options) {
        if (!options || options.length === 0) return [];

        const shuffled = [...options];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}
```

### 4.2 核心算法

**随机抽取 + 打乱顺序**:

```javascript
// 1. 从专属选项池随机抽取3个不重复选项
const selectedOptions = EventGenerator.randomSelectOptions(event.optionPool, 3);

// 2. 随机打乱选项顺序
const shuffledOptions = EventGenerator.shuffleOptions(selectedOptions);
```

### 4.3 效果对比

| 维度 | 旧方案（固定选项） | 新方案（专属池+随机） |
|------|-------------------|---------------------|
| 选项内容 | 每次相同（固定3个） | 每次不同（从5-8个中抽3个） |
| 选项顺序 | 固定 | 随机打乱 |
| 关联性 | ✅ 强 | ✅ 强（选项都是为该事件设计的） |
| 多样性 | ❌ 差 | ✅ 好（C(8,3)=56种组合） |
| 玩家感受 | 「又是这几个选项」 | 「咦，这次选项不一样」 |

### 4.4 选项池大小与组合数

| 事件类型 | 选项数 | 组合数 C(n,3) |
|----------|--------|---------------|
| 核心事件 | 6-8个 | C(6,3)=20 ~ C(8,3)=56 |
| 普通事件 | 5-6个 | C(5,3)=10 ~ C(6,3)=20 |
| 稀有事件 | 4-5个 | C(4,3)=4 ~ C(5,3)=10 |

---

## 5. 错误处理策略

| 错误情况 | 处理方式 | 日志级别 |
|---------|---------|---------|
| 事件配置无效 | 返回错误事件对象 | error |
| 选项池为空 | 返回空数组 | error |
| 选项池数量不足 | 返回所有可用选项 | warn |
| 选项生成失败 | 使用空选项 | error |

---

## 6. 性能指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 事件生成时间 | < 1ms | 包括随机抽取和打乱 |
| 内存占用 | < 100KB | 30个事件的选项池数据 |
| CPU占用 | 可忽略 | Fisher-Yates 算法 O(n) |

---

## 7. 后续优化方向

### 7.1 短期优化

- 增加更多事件类型
- 优化选项池数值平衡
- 添加选项权重系统（稀有选项概率更低）

### 7.2 中期优化

- 实现特殊选项效果（如时间回溯、金钱加倍）
- 添加选项组合效果（连续选择特定选项触发）
- 实现事件链系统（某些选项触发后续事件）

### 7.3 长期优化

- 基于玩家行为动态调整选项池
- 实现个性化选项推荐
- 添加玩家自定义选项功能

---

## 8. 相关文档

| 文档 | 说明 |
|------|------|
| `EVENT.md` | 事件选项问题原始需求 |
| `fortunes-design.md` | 运势系统设计（版本2.0） |
| `ending-design.md` | 动态结局系统设计 |
| `mutiplier-design.md` | 乘数系统技术细节 |

---

**文档版本**: 2.0
**最后更新**: 2026-04-22
