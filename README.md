# 今天不想上班 - 打工人摸鱼模拟器

## 📖 项目简介

「今天不想上班」是一款打工人主题的文字互动放置收集游戏，通过荒诞的职场选项宣泄压力，利用随机事件保证重玩性，通过成就系统驱动长期留存。

### 游戏特色

- 🎭 **荒诞职场**：20+ 随机事件，真实还原打工人的日常
- 🔮 **每日运势**：20种运势类型，影响当天游戏体验
- 🏆 **成就系统**：6个成就，解锁永久奖励
- 🎬 **动态结局**：405种结局组合，每次都不一样
- 📱 **PWA支持**：可添加到桌面，离线游玩
- 🎨 **精美UI**：奶茶色主题，治愈系配色

---

## 🎮 核心玩法

### 游戏循环

```
启动游戏 → 查看今日运势 → 遭遇随机事件 → 选择选项 → 
数值变化 → 触发结局/解锁成就 → 继续游戏
```

### 核心数值

| 数值 | 图标 | 初始值 | 上限 | 归零后果 | 满值后果 |
|------|------|--------|------|----------|----------|
| 理智值 | 💖 | 80 | 200 | 结局：ICU常客 | 结局：职场成神 |
| 压力值 | 😫 | 20 | 100 | - | 结局：职场爆炸 |
| 存款 | 💰 | 600 | 1000 | 结局：吃土少年 | - |

---

## 📦 项目结构

```
banwei-over/
├── index.html              # 主入口文件
├── manifest.json           # PWA配置
├── sw.js                   # Service Worker
├── server.js               # 本地开发服务器
├── css/
│   ├── main.css            # 全局样式和变量
│   ├── components.css      # 组件样式
│   └── animations.css      # 动画样式
└── js/
    ├── main.js             # 主入口，初始化游戏
    ├── game.js             # 游戏核心逻辑
    ├── events.js           # 事件和运势数据
    ├── achievements.js     # 成就系统
    ├── endings.js          # 动态结局系统
    ├── fortune.js          # 今日运势系统
    ├── storage.js          # 存档系统
    ├── ui.js               # UI更新函数
    ├── sound.js            # 音效管理器
    ├── vibration.js        # 震动管理器
    └── config.js           # 游戏配置常量
```

---

## 🛠️ 技术架构

### 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| CSS3 | 样式和动画 |
| JavaScript (ES6+) | 游戏逻辑 |
| LocalStorage | 本地存档 |
| PWA | 离线访问 |
| Web Audio API | 音效生成 |
| Vibration API | 震动反馈 |

### 模块依赖关系

```
main.js (入口)
    ├── game.js (核心逻辑)
    │   └── config.js (配置)
    ├── events.js (事件数据)
    ├── storage.js (存档)
    ├── ui.js (界面)
    ├── achievements.js (成就)
    ├── endings.js (结局)
    ├── fortune.js (运势)
    ├── sound.js (音效)
    └── vibration.js (震动)
```

---

## 🎯 系统设计

### 1. 今日运势系统

每天随机生成一个运势，分为三种类型：

| 类型 | 数量 | 图标 | 特点 |
|------|------|------|------|
| 好运 | 9个 | 🍀 | 正面效果加成 |
| 坏运 | 7个 | 🌊 | 负面效果惩罚 |
| 普通 | 4个 | 📅 | 混合效果 |

运势效果类型：
- `sanityMultiplier` - 理智倍率
- `stressMultiplier` - 压力倍率
- `moneyMultiplier` - 金钱倍率
- `slackBonus` - 摸鱼加成
- `backstabPenalty` - 背锅惩罚
- `coffeeBonus` - 咖啡加成
- `randomizeEffects` - 随机化效果

### 2. 成就系统

| 成就 | 条件 | 奖励 |
|------|------|------|
| 🐟 摸鱼宗师 | 摸鱼10次 | 摸鱼收益+50% |
| 🍳 背锅侠 | 背锅5次 | 背锅压力-50% |
| 🌙 加班战神 | 加班8次 | 加班金钱+20 |
| ☕ 咖啡中毒 | 喝咖啡20次 | 咖啡效果×2 |
| 💰 小目标达成 | 存款达到1000 | 存款利息+10% |
| 🧘 情绪大师 | 压力从未超80 | 初始压力-20 |

### 3. 动态结局系统

结局由三部分动态组合：

```
结局类型（4种）+ 数值区间（3×3×3=27种）+ 人格标签（16种）= 405种结局
```

结局类型：
- `sanity_zero` - ICU常客 ⚰️
- `stress_max` - 职场爆炸 😤
- `money_zero` - 吃土少年 🍜
- `sanity_max` - 职场成神 🧘

### 4. 离线收益

离线最多计算8小时，每小时获得：
- 理智 +3
- 压力 -5
- 存款 +15

---

## 🎨 UI设计

### 配色方案

| 元素 | 色值 | 用途 |
|------|------|------|
| 页面背景 | `linear-gradient(135deg, #2c3e2f, #1a2a1c)` | 墨绿渐变 |
| 主容器 | `#fef7e8` | 奶茶色 |
| 理智条 | `linear-gradient(90deg, #7c9e6e, #9bbf8a)` | 抹茶绿 |
| 压力条 | `linear-gradient(90deg, #e8a87c, #f0bc8c)` | 杏色 |
| 存款条 | `linear-gradient(90deg, #c7b198, #dfc9ae)` | 奶茶渐变 |

### 界面布局

```
┌─────────────────────────────┐
│        状态栏               │
│  💖 理智  😫 压力  💰 存款  │
├─────────────────────────────┤
│      运势小提示             │
│  🍀 今天宜摸鱼，大胆划水！  │
├─────────────────────────────┤
│        事件卡片             │
│  📢 今日事件               │
│  老板去开会了...           │
│  ┌─────┐ ┌─────┐          │
│  │选项1│ │选项2│          │
│  └─────┘ └─────┘          │
│  💡 反馈提示               │
├─────────────────────────────┤
│      底部导航               │
│    🏆 成就墙  ⚙️ 设置      │
└─────────────────────────────┘
```

---

## 📋 数据结构

### 游戏状态 (gameState)

```javascript
{
    sanity: 80,              // 理智值
    stress: 20,              // 压力值
    money: 600,              // 存款
    maxSanity: 200,          // 理智上限
    maxStress: 100,          // 压力上限
    maxMoney: 1000,          // 存款上限
    maxStressEver: 0,        // 历史最高压力
    achievements: {},        // 已解锁成就
    eventCount: {            // 事件计数
        total: 0,
        slack_off: 0,
        backstab: 0,
        overtime: 0,
        coffee: 0
    },
    lastPlayTime: Date.now(), // 上次游戏时间
    fortuneModifier: {        // 运势修正
        sanityMultiplier: 1.0,
        stressMultiplier: 1.0,
        moneyMultiplier: 1.0,
        slackBonus: 1.0,
        backstabPenalty: 1.0,
        coffeeBonus: 1.0,
        randomizeEffects: false
    }
}
```

### 事件数据结构

```javascript
{
    id: "slack_1",
    title: "📱 偷偷摸鱼",
    desc: "老板去开会了，你掏出手机...",
    options: [
        {
            text: "刷短视频 😂",
            effects: { sanity: 5, stress: -10, money: 0 },
            feedback: "太好笑了，压力全无！",
            tags: ["slack_off"]
        }
    ]
}
```

### 运势数据结构

```javascript
{
    id: "fortune_001",
    type: "good",           // good | bad | neutral
    text: "今天宜摸鱼，忌开会",
    buff: "摸鱼收益+50%",
    debuff: "",
    advice: "今天是摸鱼的好日子，大胆划水！",
    multiplier: {
        slackBonus: 1.5
    }
}
```

---

## 🚀 部署说明

### 本地开发

```bash
# 安装依赖（可选，用于本地服务器）
npm install

# 启动开发服务器
node server.js

# 访问 http://localhost:3000
```

### 生产部署

项目为纯静态文件，可直接部署到：
- Vercel
- Netlify
- GitHub Pages
- 任何静态文件服务器

### PWA配置

1. 确保 `manifest.json` 配置正确
2. Service Worker 会自动缓存静态资源
3. 支持添加到主屏幕

---

## 🔧 配置说明

### 游戏配置 (config.js)

```javascript
export const CONFIG = {
    // 数值上限
    MAX_SANITY: 200,
    MAX_STRESS: 100,
    MAX_MONEY: 1000,

    // 初始数值
    INIT_SANITY: 80,
    INIT_STRESS: 20,
    INIT_MONEY: 600,

    // 离线收益配置
    OFFLINE_HOUR_LIMIT: 8,
    OFFLINE_SANITY_PER_HOUR: 3,
    OFFLINE_STRESS_PER_HOUR: -5,
    OFFLINE_MONEY_PER_HOUR: 15,

    // 警告阈值
    SANITY_WARNING: 30,
    STRESS_WARNING: 70,
    ZEN_MASTER_THRESHOLD: 80
};
```

---

## 📝 开发指南

### 添加新事件

在 `js/events.js` 的 `events` 数组中添加：

```javascript
{
    id: "new_event_1",
    title: "📌 事件标题",
    desc: "事件描述...",
    options: [
        {
            text: "选项文字 😊",
            effects: { sanity: 10, stress: -5, money: 0 },
            feedback: "反馈文字",
            tags: ["slack_off"]  // 可选标签
        }
    ]
}
```

### 添加新运势

在 `js/events.js` 的 `fortunes` 数组中添加：

```javascript
{
    id: "fortune_new",
    type: "good",  // good | bad | neutral
    text: "运势文字",
    buff: "正面效果描述",
    debuff: "负面效果描述",
    advice: "小贴士",
    multiplier: {
        sanityMultiplier: 1.5
    }
}
```

### 添加新成就

1. 在 `js/events.js` 的 `achievements` 对象中添加定义
2. 在 `js/game.js` 的 `applyAchievementModifier` 函数中实现奖励逻辑

---

## 📄 许可证

MIT License

---

## 🙏 致谢

感谢所有打工人的灵感贡献！🐟
