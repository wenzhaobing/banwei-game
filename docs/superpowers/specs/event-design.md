## 🎯 事件选项固定问题 - 多种解决方案

你提出的「选项固定导致玩腻」是非常核心的问题。除了之前讨论的方案，还有以下几种低成本、高效果的解决方案。

---

## 一、问题本质

| 问题 | 表现 | 玩家感受 |
|------|------|----------|
| 选项固定 | 每个事件永远显示相同的3个选项 | 第二次玩就知道选哪个 |
| 效果固定 | 同一个选项永远产生相同数值变化 | 没有惊喜感 |
| 顺序固定 | 选项永远按相同顺序排列 | 可以无脑点同一个位置 |

---

## 二、解决方案汇总（从易到难）

| 方案 | 代码改动 | 效果 | 推荐度 |
|------|----------|------|--------|
| **方案1：选项随机排序** | 5行 | 选项位置变化 | ⭐⭐⭐⭐ |
| **方案2：动态选项池** | 30行 | 选项内容变化 | ⭐⭐⭐⭐ |

---

## 三、方案1：选项随机排序（5行代码）

最简单，让选项每次出现在不同位置。

```javascript
// 在 loadRandomEvent 中添加
function loadRandomEvent() {
    currentEvent = events[Math.floor(Math.random() * events.length)];
    
    // 随机打乱选项顺序（核心3行）
    const shuffled = [...currentEvent.options];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    currentEvent.options = shuffled;
    
    // 正常渲染...
}
```

**效果**：玩家无法靠「位置记忆」来选择，每次需要重新阅读。

---

## 五、方案2：动态选项池（30行代码）

每个事件从选项池中随机抽取选项，而不是固定选项。

```javascript
// 选项池定义
const OPTION_POOL = {
    slack: [
        { text: "刷短视频 😂", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "太好笑了", tags: ["slack_off"] },
        { text: "打游戏 🎮", effects: { sanity: 10, stress: -15, money: -50 }, feedback: "游戏输了", tags: ["slack_off"] },
        { text: "看小说 📚", effects: { sanity: 8, stress: -8, money: 0 }, feedback: "剧情精彩", tags: ["slack_off"] },
        { text: "刷淘宝 🛍️", effects: { sanity: 5, stress: -5, money: -30 }, feedback: "又下单了", tags: ["slack_off"] },
        { text: "睡午觉 😴", effects: { sanity: 15, stress: -20, money: 0 }, feedback: "精神百倍", tags: ["slack_off"] }
    ],
    work: [
        { text: "认真工作 💪", effects: { sanity: -10, stress: 10, money: 50 }, feedback: "老板满意", tags: ["work"] },
        { text: "加班加点 🌙", effects: { sanity: -20, stress: 15, money: 100 }, feedback: "超额完成", tags: ["overtime"] },
        { text: "主动汇报 📊", effects: { sanity: -5, stress: 5, money: 30 }, feedback: "刷存在感", tags: ["work"] }
    ],
    social: [
        { text: "正常聊天 💬", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "聊得开心", tags: ["social"] },
        { text: "吐槽老板 😈", effects: { sanity: 15, stress: -10, money: 0 }, feedback: "太爽了", tags: ["slack_off"] }
    ],
    risk: [
        { text: "主动背锅 🍳", effects: { sanity: -15, stress: 15, money: -20 }, feedback: "背锅侠", tags: ["backstab"] },
        { text: "甩锅同事 🎯", effects: { sanity: -10, stress: 10, money: 0 }, feedback: "成功甩锅", tags: ["backstab"] }
    ]
};

// 事件配置：定义每个事件从哪些池子抽选项
const EVENT_CONFIG = {
    "slack_1": { title: "📱 偷偷摸鱼", desc: "老板去开会了...", pools: ["slack", "slack", "work"] },
    "boss_1": { title: "👔 老板来了", desc: "老板突然出现...", pools: ["work", "social", "risk"] },
    "coffee_1": { title: "☕ 咖啡时间", desc: "去茶水间接咖啡...", pools: ["social", "slack", "work"] }
};

function generateDynamicEvent(eventId) {
    const config = EVENT_CONFIG[eventId];
    const options = [];
    
    for (const poolName of config.pools) {
        const pool = OPTION_POOL[poolName];
        const randomIndex = Math.floor(Math.random() * pool.length);
        options.push({ ...pool[randomIndex] }); // 深拷贝
    }
    
    return {
        title: config.title,
        desc: config.desc,
        options: options
    };
}
```

**效果**：同一个事件「偷偷摸鱼」，可能遇到不同的选项组合。

---


## 🎯 选项池类型汇总

根据游戏的核心玩法，我建议设计 **7 种基础选项池类型**，覆盖职场中的各种场景。

---

## 一、选项池类型总览

| 类型ID | 名称 | 核心特征 | 标签 | 适用场景 |
|--------|------|----------|------|----------|
| `slack` | 摸鱼型 | 涨理智、降压力、可能花钱 | `slack_off` | 偷偷摸鱼、划水 |
| `work` | 工作型 | 降理智、涨压力、赚钱 | `work`, `overtime` | 认真工作、加班 |
| `social` | 社交型 | 中等理智、中等压力、不花钱 | `social` | 同事互动、聊天 |
| `risk` | 风险型 | 高收益或高损失 | `backstab` | 背锅、甩锅 |
| `self` | 自我提升型 | 长期收益 | `self_care` | 学习、休息 |
| `random` | 随机型 | 效果随机 | `random` | 赌运气 |
| `special` | 特殊型 | 触发特殊事件 | `special` | 隐藏选项 |

---

## 二、各类型详细说明

### 1. slack（摸鱼型）🐟

**特点**：涨理智、降压力、可能花点小钱

```json
{
    "slack": [
        { "text": "刷短视频 😂", "effects": { "sanity": 5, "stress": -10, "money": 0 }, "tags": ["slack_off"] },
        { "text": "打游戏 🎮", "effects": { "sanity": 10, "stress": -15, "money": -50 }, "tags": ["slack_off"] },
        { "text": "看小说 📚", "effects": { "sanity": 8, "stress": -8, "money": 0 }, "tags": ["slack_off"] },
        { "text": "刷淘宝 🛍️", "effects": { "sanity": 5, "stress": -5, "money": -30 }, "tags": ["slack_off"] },
        { "text": "睡午觉 😴", "effects": { "sanity": 15, "stress": -20, "money": 0 }, "tags": ["slack_off"] }
    ]
}
```

**数值范围**：
- 理智：+5 ~ +15
- 压力：-20 ~ -5
- 金钱：-50 ~ 0

---

### 2. work（工作型）💪

**特点**：降理智、涨压力、赚钱

```json
{
    "work": [
        { "text": "认真工作 💪", "effects": { "sanity": -10, "stress": 10, "money": 50 }, "tags": ["work"] },
        { "text": "加班加点 🌙", "effects": { "sanity": -20, "stress": 15, "money": 100 }, "tags": ["overtime"] },
        { "text": "主动汇报 📊", "effects": { "sanity": -5, "stress": 5, "money": 30 }, "tags": ["work"] },
        { "text": "争取项目 🎯", "effects": { "sanity": -15, "stress": 12, "money": 80 }, "tags": ["work"] },
        { "text": "写周报 📝", "effects": { "sanity": -8, "stress": 8, "money": 20 }, "tags": ["work"] }
    ]
}
```

**数值范围**：
- 理智：-20 ~ -5
- 压力：+5 ~ +15
- 金钱：+20 ~ +100

---

### 3. social（社交型）💬

**特点**：中等理智、中等压力、不花钱

```json
{
    "social": [
        { "text": "正常聊天 💬", "effects": { "sanity": 5, "stress": -5, "money": 0 }, "tags": ["social"] },
        { "text": "吐槽老板 😈", "effects": { "sanity": 15, "stress": -10, "money": 0 }, "tags": ["slack_off"] },
        { "text": "分享八卦 🗣️", "effects": { "sanity": 10, "stress": -8, "money": 0 }, "tags": ["social"] },
        { "text": "请客吃饭 🍜", "effects": { "sanity": 12, "stress": -12, "money": -80 }, "tags": ["social"] },
        { "text": "参加团建 🎉", "effects": { "sanity": 8, "stress": -15, "money": -50 }, "tags": ["social"] }
    ]
}
```

**数值范围**：
- 理智：+5 ~ +15
- 压力：-15 ~ -5
- 金钱：-80 ~ 0

---

### 4. risk（风险型）🎲

**特点**：高收益或高损失

```json
{
    "risk": [
        { "text": "主动背锅 🍳", "effects": { "sanity": -15, "stress": 15, "money": -20 }, "tags": ["backstab"] },
        { "text": "甩锅同事 🎯", "effects": { "sanity": -10, "stress": 10, "money": 0 }, "tags": ["backstab"] },
        { "text": "越级汇报 📢", "effects": { "sanity": -20, "stress": 20, "money": 150 }, "tags": ["risk"] },
        { "text": "提出离职 📄", "effects": { "sanity": 20, "stress": -30, "money": 0 }, "tags": ["risk"] },
        { "text": "投诉HR 📞", "effects": { "sanity": -25, "stress": 25, "money": -100 }, "tags": ["backstab"] }
    ]
}
```

**数值范围**：
- 理智：-25 ~ +20
- 压力：-30 ~ +25
- 金钱：-100 ~ +150

---

### 5. self（自我提升型）🌱

**特点**：长期收益，短期可能消耗

```json
{
    "self": [
        { "text": "学习新技能 📖", "effects": { "sanity": 5, "stress": -5, "money": 0 }, "tags": ["self_care"] },
        { "text": "冥想放松 🧘", "effects": { "sanity": 15, "stress": -15, "money": 0 }, "tags": ["self_care"] },
        { "text": "健身锻炼 🏋️", "effects": { "sanity": 10, "stress": -10, "money": -30 }, "tags": ["self_care"] },
        { "text": "早睡早起 😴", "effects": { "sanity": 8, "stress": -8, "money": 0 }, "tags": ["self_care"] },
        { "text": "心理咨询 🧠", "effects": { "sanity": 20, "stress": -20, "money": -100 }, "tags": ["self_care"] }
    ]
}
```

**数值范围**：
- 理智：+5 ~ +20
- 压力：-20 ~ -5
- 金钱：-100 ~ 0

---

### 6. random（随机型）🎰

**特点**：效果完全随机，增加惊喜感

```json
{
    "random": [
        { "text": "摸鱼抽奖 🎰", "effects": "random", "tags": ["random"] }
    ]
}

// 代码中处理随机效果
function getRandomEffects() {
    const outcomes = [
        { sanity: 20, stress: -20, money: 100, feedback: "欧皇附体！" },
        { sanity: -20, stress: 20, money: -100, feedback: "非酋本酋..." },
        { sanity: 5, stress: -5, money: 10, feedback: "小赚一笔" },
        { sanity: -10, stress: 10, money: -50, feedback: "亏大了" }
    ];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
}
```

---

### 7. special（特殊型）✨

**特点**：触发隐藏剧情或特殊效果

```json
{
    "special": [
        { "text": "召唤摸鱼之神 🐟✨", "effects": { "sanity": 30, "stress": -30, "money": 200 }, "tags": ["special"] },
        { "text": "老板的秘药 💊", "effects": { "sanity": 50, "stress": -50, "money": -200 }, "tags": ["special"] },
        { "text": "时间回溯 ⏰", "effects": { "sanity": 0, "stress": 0, "money": 0 }, "feedback": "回到上一轮", "tags": ["special"] }
    ]
}
```

---

## 三、事件与选项池映射示例

```json
{
    "events": [
        {
            "id": "slack_1",
            "title": "📱 偷偷摸鱼",
            "desc": "老板去开会了，你掏出手机...",
            "pools": ["slack", "slack", "work"]
        },
        {
            "id": "boss_1", 
            "title": "👔 老板来了",
            "desc": "老板突然出现在你身后...",
            "pools": ["work", "social", "risk"]
        },
        {
            "id": "coffee_1",
            "title": "☕ 咖啡时间",
            "desc": "去茶水间接咖啡，遇到同事",
            "pools": ["social", "self", "slack"]
        },
        {
            "id": "meeting_1",
            "title": "📊 无聊会议",
            "desc": "会议室里，PPT放了半小时...",
            "pools": ["slack", "random", "work"]
        },
        {
            "id": "overtime_1",
            "title": "🌙 深夜加班",
            "desc": "又是加班到深夜...",
            "pools": ["work", "work", "self"]
        }
    ]
}
```

---

## 四、类型使用频率建议

| 类型 | 使用频率 | 说明 |
|------|----------|------|
| `slack` | 30% | 最常用，摸鱼是核心玩法 |
| `work` | 25% | 常见，工作场景多 |
| `social` | 20% | 中等，同事互动 |
| `risk` | 10% | 较少，高风险高回报 |
| `self` | 10% | 较少，自我提升 |
| `random` | 3% | 稀有，惊喜效果 |
| `special` | 2% | 极稀有，隐藏彩蛋 |

---

## 五、总结

| 类型 | 核心效果 | 推荐选项数 |
|------|----------|------------|
| `slack` | +💖 -😫 -💰 | 5-10个 |
| `work` | -💖 +😫 +💰 | 5-10个 |
| `social` | +💖 -😫 0💰 | 4-8个 |
| `risk` | ±💖 ±😫 ±💰 | 4-6个 |
| `self` | +💖 -😫 -💰 | 4-6个 |
| `random` | 完全随机 | 2-4个 |
| `special` | 特殊效果 | 2-3个 |

这7种类型足够覆盖职场的各种场景，并且便于后续扩展！