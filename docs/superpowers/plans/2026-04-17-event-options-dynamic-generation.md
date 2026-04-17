# 事件选项动态生成系统实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现事件选项动态生成系统，包括方案1（选项随机排序）和方案2（动态选项池）

**Architecture:** 模块化设计，创建独立的选项池数据文件和事件生成器，重构现有事件数据结构，集成到主游戏逻辑

**Tech Stack:** JavaScript ES6+, 模块化导入导出

---

## 文件结构

**新建文件:**
- `js/data/option-pools.js` - 选项池数据定义（7种类型）
- `js/utils/event-generator.js` - 事件生成器（动态生成+随机排序）

**修改文件:**
- `js/data/events-data.js` - 重构事件配置（options → pools）
- `js/data/index.js` - 更新导出
- `js/main.js` - 集成事件生成器

---

## Task 1: 创建选项池数据文件

**Files:**
- Create: `js/data/option-pools.js`

- [ ] **Step 1: 创建选项池数据文件并定义基础结构**

```javascript
/**
 * 选项池数据
 * 7种类型：slack, work, social, risk, self, random, special
 * 
 * 数值范围规范：
 * - slack: 理智 +5~+15, 压力 -20~-5, 金钱 -50~0
 * - work: 理智 -20~-5, 压力 +5~+15, 金钱 +20~+100
 * - social: 理智 +5~+15, 压力 -15~-5, 金钱 -80~0
 * - risk: 理智 -25~+20, 压力 -30~+25, 金钱 -100~+150
 * - self: 理智 +5~+20, 压力 -20~-5, 金钱 -100~0
 * - random: 理智 -20~+20, 压力 -20~+20, 金钱 -100~+100
 * - special: 理智 +30~+50, 压力 -50~-30, 金钱 -200~+200
 */

export const OPTION_POOLS = {
    // 摸鱼型：涨理智、降压力、可能花钱
    slack: [
        { text: "刷短视频 😂", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "太好笑了，压力全无！", tags: ["slack_off"] },
        { text: "打游戏 🎮", effects: { sanity: 10, stress: -15, money: -50 }, feedback: "游戏输了，但爽到了", tags: ["slack_off"] },
        { text: "看小说 📚", effects: { sanity: 8, stress: -8, money: 0 }, feedback: "剧情精彩，忘了时间", tags: ["slack_off"] },
        { text: "刷淘宝 🛍️", effects: { sanity: 5, stress: -5, money: -30 }, feedback: "又下单了，钱包哭泣", tags: ["slack_off"] },
        { text: "睡午觉 😴", effects: { sanity: 15, stress: -20, money: 0 }, feedback: "精神百倍，下午有劲了", tags: ["slack_off"] },
        { text: "偷偷点外卖 🍔", effects: { sanity: 12, stress: -12, money: -40 }, feedback: "美食治愈一切", tags: ["slack_off"] },
        { text: "看直播 📺", effects: { sanity: 7, stress: -10, money: 0 }, feedback: "主播太搞笑了", tags: ["slack_off"] },
        { text: "逛论坛 💬", effects: { sanity: 6, stress: -8, money: 0 }, feedback: "网友都是人才", tags: ["slack_off"] }
    ],
    
    // 工作型：降理智、涨压力、赚钱
    work: [
        { text: "认真工作 💪", effects: { sanity: -10, stress: 10, money: 50 }, feedback: "老板满意地走了", tags: ["work"] },
        { text: "加班加点 🌙", effects: { sanity: -20, stress: 15, money: 100 }, feedback: "超额完成，累但值得", tags: ["overtime"] },
        { text: "主动汇报 📊", effects: { sanity: -5, stress: 5, money: 30 }, feedback: "刷了存在感", tags: ["work"] },
        { text: "争取项目 🎯", effects: { sanity: -15, stress: 12, money: 80 }, feedback: "拿到新项目了", tags: ["work"] },
        { text: "写周报 📝", effects: { sanity: -8, stress: 8, money: 20 }, feedback: "周报完成，可以交差了", tags: ["work"] },
        { text: "整理文档 📄", effects: { sanity: -6, stress: 6, money: 25 }, feedback: "文档井井有条", tags: ["work"] },
        { text: "优化流程 ⚙️", effects: { sanity: -12, stress: 10, money: 60 }, feedback: "效率提升，老板点赞", tags: ["work"] }
    ],
    
    // 社交型：中等理智、中等压力、不花钱
    social: [
        { text: "正常聊天 💬", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "聊得挺开心", tags: ["social"] },
        { text: "吐槽老板 😈", effects: { sanity: 15, stress: -10, money: 0 }, feedback: "太爽了，说出心里话", tags: ["slack_off"] },
        { text: "分享八卦 🗣️", effects: { sanity: 10, stress: -8, money: 0 }, feedback: "八卦真精彩", tags: ["social"] },
        { text: "请客吃饭 🍜", effects: { sanity: 12, stress: -12, money: -80 }, feedback: "增进同事感情", tags: ["social"] },
        { text: "参加团建 🎉", effects: { sanity: 8, stress: -15, money: -50 }, feedback: "玩得开心", tags: ["social"] },
        { text: "帮同事忙 🤝", effects: { sanity: 6, stress: -6, money: 0 }, feedback: "助人为乐", tags: ["social"] }
    ],
    
    // 风险型：高收益或高损失
    risk: [
        { text: "主动背锅 🍳", effects: { sanity: -15, stress: 15, money: -20 }, feedback: "背锅侠，但赢得了信任", tags: ["backstab"] },
        { text: "甩锅同事 🎯", effects: { sanity: -10, stress: 10, money: 0 }, feedback: "成功甩锅，良心有点痛", tags: ["backstab"] },
        { text: "越级汇报 📢", effects: { sanity: -20, stress: 20, money: 150 }, feedback: "大老板注意到了你", tags: ["risk"] },
        { text: "提出离职 📄", effects: { sanity: 20, stress: -30, money: 0 }, feedback: "解脱了，但前途未卜", tags: ["risk"] },
        { text: "投诉HR 📞", effects: { sanity: -25, stress: 25, money: -100 }, feedback: "闹大了，不知道后果", tags: ["backstab"] },
        { text: "赌博式投资 🎰", effects: { sanity: -15, stress: 15, money: 120 }, feedback: "运气不错，赚了一笔", tags: ["risk"] }
    ],
    
    // 自我提升型：长期收益
    self: [
        { text: "学习新技能 📖", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "学到了很多", tags: ["self_care"] },
        { text: "冥想放松 🧘", effects: { sanity: 15, stress: -15, money: 0 }, feedback: "内心平静", tags: ["self_care"] },
        { text: "健身锻炼 🏋️", effects: { sanity: 10, stress: -10, money: -30 }, feedback: "身体是革命的本钱", tags: ["self_care"] },
        { text: "早睡早起 😴", effects: { sanity: 8, stress: -8, money: 0 }, feedback: "精神焕发", tags: ["self_care"] },
        { text: "心理咨询 🧠", effects: { sanity: 20, stress: -20, money: -100 }, feedback: "想通了很多事", tags: ["self_care"] }
    ],
    
    // 随机型：效果完全随机
    random: [
        { text: "摸鱼抽奖 🎰", effects: { sanity: 20, stress: -20, money: 100 }, feedback: "欧皇附体！", tags: ["random"] },
        { text: "盲盒开箱 📦", effects: { sanity: -20, stress: 20, money: -100 }, feedback: "非酋本酋...", tags: ["random"] },
        { text: "随机挑战 🎲", effects: { sanity: 5, stress: -5, money: 10 }, feedback: "小赚一笔", tags: ["random"] },
        { text: "命运抉择 🔮", effects: { sanity: -10, stress: 10, money: -50 }, feedback: "亏大了", tags: ["random"] }
    ],
    
    // 特殊型：触发特殊效果
    special: [
        { text: "召唤摸鱼之神 🐟✨", effects: { sanity: 30, stress: -30, money: 200 }, feedback: "神迹降临！", tags: ["special"] },
        { text: "老板的秘药 💊", effects: { sanity: 50, stress: -50, money: -200 }, feedback: "效果惊人", tags: ["special"] },
        { text: "时间回溯 ⏰", effects: { sanity: 0, stress: 0, money: 0 }, feedback: "回到上一轮", tags: ["special"] }
    ]
};
```

- [ ] **Step 2: 验证文件创建成功**

Run: `ls -la js/data/option-pools.js`
Expected: 文件存在且大小合理

- [ ] **Step 3: 提交选项池数据文件**

```bash
git add js/data/option-pools.js
git commit -m "feat: 添加选项池数据文件

- 定义7种选项池类型：slack, work, social, risk, self, random, special
- 每种类型包含5-10个选项
- 数值范围符合游戏平衡性要求
- 混合现有选项和EVENT.md建议的新选项"
```

---

## Task 2: 创建事件生成器

**Files:**
- Create: `js/utils/event-generator.js`

- [ ] **Step 1: 创建 utils 目录（如果不存在）**

Run: `mkdir -p js/utils`
Expected: 目录创建成功

- [ ] **Step 2: 创建事件生成器文件并实现核心功能**

```javascript
/**
 * 事件生成器
 * 负责从选项池动态生成事件选项
 */

import { OPTION_POOLS } from '../data/option-pools.js';

/**
 * 事件生成器类
 */
export class EventGenerator {
    /**
     * 根据事件配置生成动态选项
     * @param {Object} eventConfig - 事件配置 { id, title, desc, pools }
     * @returns {Object} 完整的事件对象
     */
    static generateEvent(eventConfig) {
        // 参数验证
        if (!eventConfig || !eventConfig.pools) {
            console.error('事件配置无效:', eventConfig);
            return {
                id: 'error',
                title: '⚠️ 系统错误',
                desc: '事件加载失败，请刷新页面',
                options: []
            };
        }

        const options = this.generateOptions(eventConfig.pools);
        
        return {
            id: eventConfig.id,
            title: eventConfig.title,
            desc: eventConfig.desc,
            options: options
        };
    }
    
    /**
     * 从选项池生成选项
     * @param {Array<string>} poolNames - 选项池名称数组
     * @returns {Array} 生成的选项数组
     */
    static generateOptions(poolNames) {
        const options = [];
        
        poolNames.forEach(poolName => {
            const pool = OPTION_POOLS[poolName];
            
            // 错误处理：选项池不存在
            if (!pool) {
                console.warn(`选项池 "${poolName}" 不存在，使用默认选项`);
                // 使用 slack 作为默认选项池
                const defaultPool = OPTION_POOLS['slack'];
                if (defaultPool && defaultPool.length > 0) {
                    const randomIndex = Math.floor(Math.random() * defaultPool.length);
                    options.push({ ...defaultPool[randomIndex] });
                }
                return;
            }
            
            // 错误处理：选项池为空
            if (pool.length === 0) {
                console.warn(`选项池 "${poolName}" 为空`);
                return;
            }
            
            // 随机选择一个选项
            const randomIndex = Math.floor(Math.random() * pool.length);
            options.push({ ...pool[randomIndex] }); // 深拷贝
        });
        
        // 错误处理：没有生成任何选项
        if (options.length === 0) {
            console.error('未能生成任何选项，使用默认选项');
            const defaultPool = OPTION_POOLS['slack'];
            if (defaultPool && defaultPool.length > 0) {
                options.push({ ...defaultPool[0] });
            }
        }
        
        return options;
    }
    
    /**
     * 随机打乱选项顺序（方案1）
     * 使用 Fisher-Yates 洗牌算法
     * @param {Array} options - 选项数组
     * @returns {Array} 打乱后的选项数组
     */
    static shuffleOptions(options) {
        if (!options || options.length === 0) {
            return [];
        }
        
        const shuffled = [...options];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}
```

- [ ] **Step 3: 验证文件创建成功**

Run: `ls -la js/utils/event-generator.js`
Expected: 文件存在且大小合理

- [ ] **Step 4: 提交事件生成器文件**

```bash
git add js/utils/event-generator.js
git commit -m "feat: 添加事件生成器

- 实现 generateEvent() 方法动态生成事件
- 实现 generateOptions() 方法从选项池生成选项
- 实现 shuffleOptions() 方法随机打乱选项顺序
- 添加完善的错误处理机制
- 使用 Fisher-Yates 洗牌算法"
```

---

## Task 3: 重构事件数据结构

**Files:**
- Modify: `js/data/events-data.js`

- [ ] **Step 1: 备份原始事件数据文件**

Run: `cp js/data/events-data.js js/data/events-data.js.backup`
Expected: 备份文件创建成功

- [ ] **Step 2: 重构事件数据结构（将 options 改为 pools）**

需要将所有事件的 `options` 数组改为 `pools` 配置。以下是重构后的示例：

```javascript
/**
 * 游戏事件数据
 */
export const events = [
    {
        id: "slack_1",
        title: "📱 偷偷摸鱼",
        desc: "老板去开会了，你掏出手机...",
        pools: ["slack", "slack", "work"]
    },
    {
        id: "boss_1",
        title: "👔 老板来了",
        desc: "老板突然出现在你身后...",
        pools: ["work", "social", "risk"]
    },
    {
        id: "coffee_1",
        title: "☕ 咖啡时间",
        desc: "去茶水间接咖啡，遇到同事",
        pools: ["social", "slack", "work"]
    },
    {
        id: "meeting_1",
        title: "📊 无聊会议",
        desc: "会议室里，PPT放了半小时...",
        pools: ["slack", "random", "work"]
    },
    {
        id: "overtime_1",
        title: "🌙 深夜加班",
        desc: "又是加班到深夜...",
        pools: ["work", "work", "self"]
    },
    {
        id: "colleague_1",
        title: "👥 同事八卦",
        desc: "听到同事在讨论工资...",
        pools: ["social", "risk", "slack"]
    },
    {
        id: "lunch_1",
        title: "🍜 午餐时间",
        desc: "中午吃什么世纪难题...",
        pools: ["slack", "social", "self"]
    },
    {
        id: "deadline_1",
        title: "📅 截止日期",
        desc: "明天就是deadline了！",
        pools: ["work", "slack", "risk"]
    },
    {
        id: "email_1",
        title: "📧 邮件炸弹",
        desc: "一觉醒来，99+未读邮件...",
        pools: ["slack", "work", "slack"]
    },
    {
        id: "interview_1",
        title: "💼 面试来宾",
        desc: "今天有个面试者在等你...",
        pools: ["work", "slack", "social"]
    },
    {
        id: "printer_1",
        title: "🖨️ 打印机坏了",
        desc: "重要文件打不出来...",
        pools: ["work", "slack", "risk"]
    },
    {
        id: "birthday_1",
        title: "🎂 同事生日",
        desc: "又有人过生日了...",
        pools: ["social", "slack", "social"]
    },
    {
        id: "system_1",
        title: "💻 系统崩溃",
        desc: "电脑突然蓝屏了...",
        pools: ["work", "slack", "slack"]
    },
    {
        id: "outing_1",
        title: "🏕️ 团建活动",
        desc: "周末要团建，去还是不去...",
        pools: ["social", "slack", "social"]
    },
    {
        id: "promotion_1",
        title: "📈 晋升机会",
        desc: "有个主管位置空出来了...",
        pools: ["work", "self", "risk"]
    },
    {
        id: "complaint_1",
        title: "😤 客户投诉",
        desc: "客户打电话来抱怨...",
        pools: ["work", "risk", "slack"]
    },
    {
        id: "workfromhome_1",
        title: "🏠 居家办公",
        desc: "今天可以在家办公...",
        pools: ["work", "slack", "slack"]
    },
    {
        id: "training_1",
        title: "📚 培训课程",
        desc: "公司安排了一场培训...",
        pools: ["self", "slack", "slack"]
    },
    {
        id: "bonus_1",
        title: "💵 发奖金了",
        desc: "季度奖金到账！",
        pools: ["self", "slack", "slack"]
    },
    {
        id: "meeting_2",
        title: "📊 季度总结大会",
        desc: "老板在台上激情演讲，PPT已经翻了50页...",
        pools: ["slack", "slack", "risk"]
    },
    {
        id: "meeting_3",
        title: "💻 线上会议",
        desc: "Zoom会议开了1小时，你一直关着摄像头...",
        pools: ["slack", "slack", "risk"]
    },
    {
        id: "meeting_4",
        title: "👥 一对一谈话",
        desc: "HR约你聊聊职业规划...",
        pools: ["social", "slack", "risk"]
    },
    {
        id: "boss_2",
        title: "👔 老板突然发消息",
        desc: "晚上11点，老板在群里@了你...",
        pools: ["work", "slack", "risk"]
    },
    {
        id: "boss_3",
        title: "🎂 老板生日",
        desc: "同事们在张罗给老板过生日...",
        pools: ["social", "slack", "slack"]
    },
    {
        id: "boss_4",
        title: "📧 收到全员邮件",
        desc: "公司宣布要'降本增效'，大家都慌了...",
        pools: ["risk", "slack", "work"]
    },
    {
        id: "colleague_2",
        title: "👥 同事八卦时间",
        desc: "茶水间里，同事在讲老板的坏话...",
        pools: ["social", "slack", "risk"]
    },
    {
        id: "colleague_3",
        title: "🍱 午饭时间",
        desc: "同事叫你一起吃饭，但你想一个人...",
        pools: ["social", "slack", "slack"]
    },
    {
        id: "colleague_4",
        title: "🎉 团建通知",
        desc: "HR发了团建通知：周末去爬山...",
        pools: ["social", "slack", "social"]
    },
    {
        id: "office_1",
        title: "❄️ 空调太冷了",
        desc: "中央空调开到了16度，你瑟瑟发抖...",
        pools: ["self", "risk", "slack"]
    },
    {
        id: "office_2",
        title: "🔊 打印机又坏了",
        desc: "你要打印重要文件，打印机卡纸了...",
        pools: ["work", "slack", "work"]
    },
    {
        id: "office_3",
        title: "☕ 咖啡机坏了",
        desc: "唯一的咖啡机坏了，整个部门都疯了...",
        pools: ["slack", "social", "slack"]
    },
    {
        id: "self_1",
        title: "😴 昨晚没睡好",
        desc: "凌晨3点才睡，现在眼睛都睁不开...",
        pools: ["self", "slack", "work"]
    },
    {
        id: "self_2",
        title: "📱 手机没电了",
        desc: "还有3小时下班，手机只剩10%电量...",
        pools: ["self", "slack", "slack"]
    },
    {
        id: "self_3",
        title: "🧠 脑子一片空白",
        desc: "想不起刚才要做什么，感觉失忆了...",
        pools: ["self", "slack", "self"]
    },
    {
        id: "crazy_1",
        title: "🐱 公司来了一只猫",
        desc: "不知道谁带的猫，在办公室到处跑...",
        pools: ["social", "slack", "slack"]
    }
];
```

**注意**: 需要将所有30+个事件都改为 pools 配置，上面的示例只展示了部分事件。实际实施时需要完整重构所有事件。

- [ ] **Step 3: 验证重构后的数据结构**

Run: `node -e "import('./js/data/events-data.js').then(m => console.log('Events loaded:', m.events.length, 'events'))"`
Expected: 输出事件数量，无错误

- [ ] **Step 4: 提交事件数据重构**

```bash
git add js/data/events-data.js
git commit -m "refactor: 重构事件数据结构

- 将所有事件的 options 改为 pools 配置
- 每个事件映射到对应的选项池类型
- 保持事件主题和描述不变
- 确保每个事件有3个选项池配置"
```

---

## Task 4: 更新数据导出

**Files:**
- Modify: `js/data/index.js`

- [ ] **Step 1: 查看当前导出内容**

Run: `cat js/data/index.js`
Expected: 显示当前导出内容

- [ ] **Step 2: 更新导出，添加选项池导出**

```javascript
/**
 * 数据导出模块
 */
export { events } from './events-data.js';
export { OPTION_POOLS } from './option-pools.js';
export { achievements } from './achievements.js';
export { endings } from './endings.js';
export { fortunes } from './fortunes.js';
```

- [ ] **Step 3: 验证导出正确**

Run: `node -e "import('./js/data/index.js').then(m => console.log('Exports:', Object.keys(m)))"`
Expected: 输出包含 OPTION_POOLS

- [ ] **Step 4: 提交导出更新**

```bash
git add js/data/index.js
git commit -m "feat: 更新数据导出，添加选项池导出

- 导出 OPTION_POOLS 供其他模块使用
- 保持其他导出不变"
```

---

## Task 5: 集成到主文件

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: 在文件顶部添加导入语句**

在 `js/main.js` 文件顶部添加：

```javascript
import { EventGenerator } from './utils/event-generator.js';
```

- [ ] **Step 2: 修改 loadRandomEvent() 函数**

找到 `loadRandomEvent()` 函数（约在第109行），修改为：

```javascript
/**
 * 加载随机事件（避免连续重复）
 */
function loadRandomEvent() {
    if (isGameOver) return;

    // 过滤掉上一次的事件，避免连续重复
    let availableEvents = lastEventId
        ? events.filter(e => e.id !== lastEventId)
        : events;

    // 如果过滤后没有可用事件（理论上不会发生），则使用全部事件
    if (availableEvents.length === 0) {
        availableEvents = events;
    }

    // 随机选择一个事件配置
    const eventConfig = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    
    // 使用事件生成器动态生成完整事件（方案2）
    currentEvent = EventGenerator.generateEvent(eventConfig);
    
    // 随机打乱选项顺序（方案1）
    currentEvent.options = EventGenerator.shuffleOptions(currentEvent.options);

    // 记录当前事件ID
    lastEventId = currentEvent.id;

    // 更新事件描述
    document.getElementById('eventTitle').textContent = currentEvent.title;
    document.getElementById('eventDesc').textContent = currentEvent.desc;

    // 清空并重新生成选项按钮
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    currentEvent.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';

        // 生成选项显示内容
        const emoji = opt.text.split(' ')[1] || '📌';
        const text = opt.text.split(' ')[0] || '';

        btn.innerHTML = `
            <div class="option-text">${text}</div>
            <span class="option-emoji">${emoji}</span>
        `;

        btn.onclick = () => applyEffects(opt, btn);
        container.appendChild(btn);
    });

    // 重置反馈区域
    resetFeedback('选择你的行动...');
}
```

- [ ] **Step 3: 验证修改正确**

Run: `node -c js/main.js`
Expected: 无语法错误

- [ ] **Step 4: 提交主文件集成**

```bash
git add js/main.js
git commit -m "feat: 集成事件生成器到主文件

- 导入 EventGenerator
- 修改 loadRandomEvent() 使用动态选项生成
- 实现方案1：选项随机排序
- 实现方案2：动态选项池
- 保持其他逻辑不变"
```

---

## Task 6: 测试和验证

**Files:**
- Test: 浏览器测试

- [ ] **Step 1: 启动本地服务器**

Run: `node server.js`
Expected: 服务器启动成功，显示访问地址

- [ ] **Step 2: 在浏览器中测试**

打开浏览器访问 `http://localhost:3000`，进行以下测试：

**测试清单：**
- [ ] 游戏正常启动，无控制台错误
- [ ] 事件正常加载，显示标题和描述
- [ ] 选项正常显示，有3个选项
- [ ] 点击选项，效果正常应用
- [ ] 多次刷新，验证选项内容变化
- [ ] 多次刷新，验证选项顺序变化
- [ ] 游戏平衡性良好，数值不会异常

- [ ] **Step 3: 检查控制台日志**

打开浏览器开发者工具，检查：
- 无错误日志
- 无警告日志（除非是预期的警告）
- 事件生成日志正常

- [ ] **Step 4: 性能测试**

在浏览器中快速点击选项，验证：
- 事件生成速度正常
- 无明显延迟
- 内存占用正常

---

## Task 7: 清理和文档

**Files:**
- Delete: `js/data/events-data.js.backup`

- [ ] **Step 1: 删除备份文件**

Run: `rm js/data/events-data.js.backup`
Expected: 备份文件删除成功

- [ ] **Step 2: 更新 README.md（如果需要）**

如果 README.md 中有关于事件数据结构的说明，需要更新为新的 pools 配置。

- [ ] **Step 3: 最终提交**

```bash
git add -A
git commit -m "chore: 清理备份文件，完成事件选项动态生成系统

- 实现方案1：选项随机排序
- 实现方案2：动态选项池
- 重构事件数据结构
- 集成到主游戏逻辑
- 测试通过，功能正常"
```

---

## 验收清单

- [ ] 所有文件创建成功
- [ ] 所有修改正确应用
- [ ] 浏览器测试通过
- [ ] 无控制台错误
- [ ] 选项内容动态变化
- [ ] 选项顺序随机变化
- [ ] 游戏平衡性良好
- [ ] 性能正常
- [ ] 代码符合规范
- [ ] 注释清晰完整
- [ ] Git 提交记录清晰

---

## 注意事项

1. **数据完整性**: 确保所有事件都有正确的 pools 配置
2. **错误处理**: 测试各种边界情况（空选项池、无效配置等）
3. **游戏平衡性**: 验证数值范围合理，不会过快增长或减少
4. **性能**: 确保事件生成速度正常，无明显延迟
5. **兼容性**: 确保所有现有功能正常工作

---

**计划版本**: 1.0  
**创建日期**: 2026-04-17
