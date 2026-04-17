# 事件选项动态生成系统设计文档

**日期**: 2026-04-17  
**作者**: AI Assistant  
**状态**: 设计阶段

---

## 1. 项目背景

### 1.1 问题描述

当前游戏存在以下问题：
- **选项固定**: 每个事件永远显示相同的3个选项，玩家第二次玩就知道选哪个
- **效果固定**: 同一个选项永远产生相同数值变化，没有惊喜感
- **顺序固定**: 选项永远按相同顺序排列，可以无脑点同一个位置

### 1.2 目标

实施方案1（选项随机排序）+ 方案2（动态选项池），实现：
- ✅ 选项位置每次随机变化
- ✅ 选项内容从选项池动态生成
- ✅ 增加游戏重玩价值和惊喜感
- ✅ 保持游戏平衡性和核心玩法

---

## 2. 架构设计

### 2.1 文件结构

```
js/
├── data/
│   ├── option-pools.js      (新建) 选项池数据
│   ├── events-data.js       (重构) 事件配置
│   └── index.js             (修改) 导出更新
├── utils/
│   └── event-generator.js   (新建) 事件生成器
└── main.js                  (修改) 集成新逻辑
```

### 2.2 模块职责

| 模块 | 职责 | 依赖 |
|------|------|------|
| `option-pools.js` | 定义7种选项池数据 | 无 |
| `event-generator.js` | 动态生成事件和选项 | option-pools.js |
| `events-data.js` | 事件配置（pools替代options） | 无 |
| `main.js` | 游戏主逻辑，集成事件生成器 | event-generator.js |

### 2.3 数据流

```
事件配置 (events-data.js)
    ↓
事件生成器 (event-generator.js)
    ↓
动态选项 (从选项池生成)
    ↓
选项随机排序
    ↓
渲染到UI (main.js)
```

---

## 3. 数据结构设计

### 3.1 选项池数据结构

**文件**: `js/data/option-pools.js`

```javascript
/**
 * 选项池数据
 * 7种类型：slack, work, social, risk, self, random, special
 */
export const OPTION_POOLS = {
    // 摸鱼型：涨理智、降压力、可能花钱
    slack: [
        { text: "刷短视频 😂", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "太好笑了，压力全无！", tags: ["slack_off"] },
        { text: "打游戏 🎮", effects: { sanity: 10, stress: -15, money: -50 }, feedback: "游戏输了，但爽到了", tags: ["slack_off"] },
        // ... 5-10个选项
    ],
    
    // 工作型：降理智、涨压力、赚钱
    work: [
        { text: "认真工作 💪", effects: { sanity: -10, stress: 10, money: 50 }, feedback: "老板满意地走了", tags: ["work"] },
        // ... 5-10个选项
    ],
    
    // 社交型：中等理智、中等压力、不花钱
    social: [
        { text: "正常聊天 💬", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "聊得挺开心", tags: ["social"] },
        // ... 4-8个选项
    ],
    
    // 风险型：高收益或高损失
    risk: [
        { text: "主动背锅 🍳", effects: { sanity: -15, stress: 15, money: -20 }, feedback: "背锅侠", tags: ["backstab"] },
        // ... 4-6个选项
    ],
    
    // 自我提升型：长期收益
    self: [
        { text: "学习新技能 📖", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "学到了很多", tags: ["self_care"] },
        // ... 4-6个选项
    ],
    
    // 随机型：效果完全随机
    random: [
        { text: "摸鱼抽奖 🎰", effects: { sanity: 20, stress: -20, money: 100 }, feedback: "欧皇附体！", tags: ["random"] },
        // ... 2-4个选项
    ],
    
    // 特殊型：触发特殊效果
    special: [
        { text: "召唤摸鱼之神 🐟✨", effects: { sanity: 30, stress: -30, money: 200 }, feedback: "神迹降临！", tags: ["special"] },
        // ... 2-3个选项
    ]
};
```

**数值范围规范**:
- **slack**: 理智 +5~+15, 压力 -20~-5, 金钱 -50~0
- **work**: 理智 -20~-5, 压力 +5~+15, 金钱 +20~+100
- **social**: 理智 +5~+15, 压力 -15~-5, 金钱 -80~0
- **risk**: 理智 -25~+20, 压力 -30~+25, 金钱 -100~+150
- **self**: 理智 +5~+20, 压力 -20~-5, 金钱 -100~0
- **random**: 理智 -20~+20, 压力 -20~+20, 金钱 -100~+100
- **special**: 理智 +30~+50, 压力 -50~-30, 金钱 -200~+200

### 3.2 事件配置数据结构

**文件**: `js/data/events-data.js`

**重构前**:
```javascript
export const events = [
    {
        id: "slack_1",
        title: "📱 偷偷摸鱼",
        desc: "老板去开会了，你掏出手机...",
        options: [
            { text: "刷短视频 😂", effects: {...}, feedback: "...", tags: [...] },
            { text: "打游戏 🎮", effects: {...}, feedback: "...", tags: [...] },
            { text: "假装工作 💼", effects: {...}, feedback: "...", tags: [...] }
        ]
    }
];
```

**重构后**:
```javascript
export const events = [
    {
        id: "slack_1",
        title: "📱 偷偷摸鱼",
        desc: "老板去开会了，你掏出手机...",
        pools: ["slack", "slack", "work"]  // 从选项池动态生成
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
    }
    // ... 其他30+个事件
];
```

**事件映射策略**:
- 分析每个事件的选项类型，映射到对应的选项池
- 保持事件的主题和描述不变
- 确保每个事件有3个选项池配置
- 示例映射：
  - `slack_1` (偷偷摸鱼) → `["slack", "slack", "work"]` (2个摸鱼选项 + 1个工作选项)
  - `boss_1` (老板来了) → `["work", "social", "risk"]` (工作 + 社交 + 风险)
  - `meeting_1` (无聊会议) → `["slack", "random", "work"]` (摸鱼 + 随机 + 工作)

---

## 4. 事件生成器设计

**文件**: `js/utils/event-generator.js`

### 4.1 核心功能

```javascript
import { OPTION_POOLS } from '../data/option-pools.js';

/**
 * 事件生成器
 * 负责从选项池动态生成事件选项
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

### 4.2 错误处理策略

| 错误情况 | 处理方式 | 日志级别 |
|---------|---------|---------|
| 事件配置无效 | 返回错误事件对象 | error |
| 选项池不存在 | 使用 slack 作为默认 | warn |
| 选项池为空 | 跳过并警告 | warn |
| 无选项生成 | 使用默认选项 | error |
| 参数为空 | 返回空数组 | - |

---

## 5. 主文件集成设计

**文件**: `js/main.js`

### 5.1 修改点：`loadRandomEvent()` 函数

```javascript
import { EventGenerator } from './utils/event-generator.js';

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

### 5.2 修改要点

- ✅ 导入 EventGenerator
- ✅ 使用 `generateEvent()` 动态生成选项
- ✅ 使用 `shuffleOptions()` 随机打乱选项顺序
- ✅ 保持其他逻辑不变（事件选择、UI渲染等）
- ✅ 最小化改动，降低风险

---

## 6. 测试策略

### 6.1 单元测试

**测试要点**:
- 选项池数据完整性验证
- 事件生成器功能测试
- 错误处理测试
- 随机算法正确性测试

**测试用例**:
```javascript
// 1. 测试选项池数据完整性
- 每个 options 数组不为空
- 每个选项包含 text, effects, feedback, tags
- 数值范围合理（sanity: -30~30, stress: -30~30, money: -200~200）

// 2. 测试事件生成器
- generateEvent() 正常生成事件
- generateOptions() 从不同选项池生成选项
- shuffleOptions() 正确打乱顺序
- 错误处理：无效选项池、空选项池

// 3. 测试主文件集成
- loadRandomEvent() 正常加载事件
- 选项动态生成并随机排序
- 事件不连续重复
```

### 6.2 集成测试

**测试要点**:
- 端到端游戏流程测试
- 选项多样性验证
- 游戏平衡性测试

**测试用例**:
```javascript
// 端到端测试
- 游戏启动 → 事件加载 → 选项显示
- 选择选项 → 应用效果 → 加载新事件
- 多次游戏，验证选项多样性
- 验证游戏平衡性（数值不会过快增长或减少）
```

### 6.3 边界情况测试

**边界情况清单**:
- ✅ 选项池为空 → 使用默认选项
- ✅ 选项池不存在 → 使用 slack 作为默认
- ✅ 事件配置无效 → 显示错误事件
- ✅ 所有事件都被过滤 → 重置为全部事件
- ✅ 选项生成失败 → 使用默认选项
- ✅ 随机数生成异常 → 捕获并使用默认值

---

## 7. 性能考虑

### 7.1 性能优化

- **选项池数据预加载**: 在游戏初始化时加载所有选项池数据
- **避免重复创建对象**: 使用深拷贝确保数据独立性
- **随机算法效率**: 使用 Fisher-Yates 洗牌算法，时间复杂度 O(n)
- **内存管理**: 及时清理无用对象，避免内存泄漏

### 7.2 性能指标

- **事件生成时间**: < 1ms
- **选项打乱时间**: < 0.1ms
- **内存占用**: 增加约 50KB（选项池数据）
- **CPU占用**: 可忽略不计

---

## 8. 风险评估

### 8.1 技术风险

| 风险项 | 风险等级 | 影响范围 | 应对措施 |
|--------|----------|----------|----------|
| 现有功能破坏 | 🟡 中等 | 全局事件系统 | 完善错误处理，保留兼容性 |
| 选项平衡性问题 | 🟡 中等 | 游戏体验 | 充分测试数值范围，调整选项池内容 |
| 边界情况处理 | 🟢 低 | 特定场景 | 添加空池检查等错误处理 |
| 代码维护性 | 🟢 低 | 长期维护 | 模块化设计，清晰注释 |

### 8.2 游戏平衡性风险

| 风险项 | 风险等级 | 应对措施 |
|--------|----------|----------|
| 数值范围不合理 | 🟡 中等 | 严格遵循数值范围规范 |
| 选项类型分布不均 | 🟡 中等 | 确保每个事件有合理的选项池配置 |
| 特殊选项池过于强大 | 🟢 低 | random 和 special 作为普通选项池处理 |

---

## 9. 实施计划

### 9.1 实施步骤

1. **创建选项池数据文件** (2-3小时)
   - 定义7种选项池类型
   - 从现有事件中提取选项
   - 添加 EVENT.md 建议的新选项
   - 确保数值平衡性

2. **创建事件生成器** (1小时)
   - 实现 generateEvent() 方法
   - 实现 generateOptions() 方法
   - 实现 shuffleOptions() 方法
   - 添加完善的错误处理

3. **重构事件数据结构** (1-2小时)
   - 将所有事件改为 pools 配置
   - 分析每个事件的选项类型
   - 映射到对应的选项池

4. **修改主文件** (0.5-1小时)
   - 导入 EventGenerator
   - 修改 loadRandomEvent() 函数
   - 集成动态生成逻辑

5. **测试和调试** (1-2小时)
   - 单元测试
   - 集成测试
   - 边界情况测试
   - 游戏平衡性测试

### 9.2 预计工作量

- **总工作量**: 5-8小时
- **文件修改**: 4个文件（2个新建，2个修改）
- **代码行数**: 约700行
- **测试用例**: 约20个

---

## 10. 验收标准

### 10.1 功能验收

- ✅ 每次加载事件，选项内容不同
- ✅ 每次加载事件，选项顺序不同
- ✅ 游戏平衡性保持良好
- ✅ 所有现有功能正常工作
- ✅ 错误处理完善，不会崩溃

### 10.2 性能验收

- ✅ 事件生成时间 < 1ms
- ✅ 无明显性能下降
- ✅ 内存占用增加 < 100KB

### 10.3 代码质量验收

- ✅ 代码符合项目规范
- ✅ 注释清晰完整
- ✅ 模块化设计合理
- ✅ 易于维护和扩展

---

## 11. 后续优化方向

### 11.1 短期优化（1-2周）

- 增加更多选项内容
- 优化选项池数值平衡
- 添加选项权重系统

### 11.2 中期优化（1-2月）

- 实现特殊选项池的增强功能
- 添加选项组合效果
- 实现事件链系统

### 11.3 长期优化（3-6月）

- 基于玩家行为动态调整选项池
- 实现个性化选项推荐
- 添加玩家自定义选项功能

---

## 12. 附录

### 12.1 相关文档

- [EVENT.md](../../EVENT.md) - 事件选项固定问题解决方案
- [README.md](../../README.md) - 项目说明文档

### 12.2 参考资料

- Fisher-Yates 洗牌算法: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
- JavaScript 深拷贝: https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy

---

**文档版本**: 1.0  
**最后更新**: 2026-04-17
