# 版本2.0
## 🎯 简化版运势系统：基于周几 + 特殊节日

去掉时间段微调，只保留**星期几**和**特殊节日**两个维度。

---

## 一、完整实现代码

```javascript
// fortune.js - 基于周几和节日的运势系统

class FortuneSystem {
    constructor() {
        this.currentFortune = null;
        this.cachedDate = null;
    }
    
    // 获取星期几名称
    getWeekdayName(weekday) {
        const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return names[weekday];
    }
    
    // 检查特殊日期（节日/纪念日）
    checkSpecialDate() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const key = `${month}-${day}`;
        
        const specialDates = {
            // 法定节假日
            '1-1': { text: "🎉 元旦快乐！新的一年，新的开始！", buff: "新年好运+50%", type: "good", icon: "🎉" },
            '2-14': { text: "💕 情人节快乐！", buff: "社交收益+50%", type: "good", icon: "💕" },
            '3-8': { text: "🌸 妇女节快乐！", buff: "所有收益+30%", type: "good", icon: "🌸" },
            '5-1': { text: "🛠️ 劳动节快乐！今天不用劳动！", buff: "摸鱼收益+100%", type: "good", icon: "🛠️" },
            '6-1': { text: "🍭 儿童节快乐！今天可以当个孩子！", buff: "所有收益+50%", type: "good", icon: "🍭" },
            '9-10': { text: "📖 教师节快乐！", buff: "学习收益+50%", type: "good", icon: "📖" },
            '10-1': { text: "🇨🇳 国庆节快乐！摸鱼七天乐！", buff: "所有收益+100%", type: "good", icon: "🇨🇳" },
            '12-25': { text: "🎄 圣诞节快乐！", buff: "随机礼物+200", type: "good", icon: "🎄" },
            '12-31': { text: "📅 年终总结，摸鱼一年辛苦了！", buff: "年终奖+500", type: "good", icon: "📅" },
            
            // 特殊日子
            '4-1': { text: "🎭 愚人节！小心被整蛊！", debuff: "所有事件随机化", type: "bad", icon: "🎭" },
            '11-11': { text: "🛒 双十一！剁手节！", buff: "购物快乐", debuff: "存款-100", type: "mixed", icon: "🛒" }
        };
        
        return specialDates[key] || null;
    }
    
    // 获取星期运势
    getWeekdayFortune() {
        const now = new Date();
        const weekday = now.getDay();
        const weekdayName = this.getWeekdayName(weekday);
        
        const fortunesByDay = {
            '周一': [
                { text: "黑色星期一，小心背锅", debuff: "背锅概率+50%", type: "bad", icon: "🍳" },
                { text: "周一综合症，效率减半", debuff: "所有收益-20%", type: "bad", icon: "😫" },
                { text: "新的一周，元气满满！", buff: "所有收益+10%", type: "good", icon: "💪" },
                { text: "周一宜摸鱼，忌开会", buff: "摸鱼收益+30%", type: "good", icon: "🐟" },
                { text: "周一正常开工", buff: "", debuff: "", type: "neutral", icon: "📅" }
            ],
            '周二': [
                { text: "周二进入状态，效率提升", buff: "工作收益+20%", type: "good", icon: "⚡" },
                { text: "周二综合征，不上不下", debuff: "压力+10%", type: "bad", icon: "😐" },
                { text: "周二适合表现自己", buff: "金钱收益+20%", type: "good", icon: "💰" },
                { text: "周二平淡如水", buff: "", debuff: "", type: "neutral", icon: "📅" }
            ],
            '周三': [
                { text: "周三小周末，可以划水", buff: "摸鱼收益+30%", type: "good", icon: "🐟" },
                { text: "一周过半，坚持住", buff: "压力减少+20%", type: "good", icon: "💪" },
                { text: "周三容易犯困", debuff: "理智-10%", type: "bad", icon: "😴" },
                { text: "周三不上不下", buff: "", debuff: "", type: "neutral", icon: "📅" }
            ],
            '周四': [
                { text: "周四离周五不远了", buff: "压力减少+15%", type: "good", icon: "🎯" },
                { text: "周四开会最多的一天", debuff: "会议压力+30%", type: "bad", icon: "📊" },
                { text: "周四适合摸鱼等周五", buff: "摸鱼收益+20%", type: "good", icon: "🐟" },
                { text: "周四正常推进", buff: "", debuff: "", type: "neutral", icon: "📅" }
            ],
            '周五': [
                { text: "周五了，摸鱼无罪！", buff: "所有收益+30%", type: "good", icon: "🎉" },
                { text: "周五下午，无心工作", buff: "摸鱼收益+50%", type: "good", icon: "🐟" },
                { text: "黑色星期五，小心加班", debuff: "加班概率+30%", type: "bad", icon: "🌙" },
                { text: "周五快乐！", buff: "压力-20", type: "good", icon: "😊" }
            ],
            '周六': [
                { text: "周六还在加班？辛苦了", buff: "加班收益+50%", type: "good", icon: "💪" },
                { text: "周六适合休息", buff: "压力自动-20", type: "good", icon: "😴" },
                { text: "周六出去玩！", buff: "心情+50", type: "good", icon: "🎉" },
                { text: "周六躺平日", buff: "", debuff: "", type: "neutral", icon: "📅" }
            ],
            '周日': [
                { text: "周日晚上，周一恐惧症", debuff: "周一压力+30%", type: "bad", icon: "😨" },
                { text: "周日适合调整心态", buff: "初始压力-10", type: "good", icon: "🧘" },
                { text: "周日休息日", buff: "压力-10", type: "good", icon: "😴" },
                { text: "周日充电日", buff: "", debuff: "", type: "neutral", icon: "📅" }
            ]
        };
        
        const dayFortunes = fortunesByDay[weekdayName];
        if (!dayFortunes) return null;
        
        const randomIndex = Math.floor(Math.random() * dayFortunes.length);
        const fortune = { ...dayFortunes[randomIndex] };
        fortune.text = `【${weekdayName}】${fortune.text}`;
        
        return fortune;
    }
    
    // 获取今日运势（主入口）
    getDailyFortune() {
        // 1. 检查缓存（同一天不重新生成）
        const today = new Date().toDateString();
        if (this.currentFortune && this.cachedDate === today) {
            return this.currentFortune;
        }
        
        // 2. 优先检查特殊日期（节日优先于星期）
        const special = this.checkSpecialDate();
        if (special) {
            this.currentFortune = special;
            this.cachedDate = today;
            return special;
        }
        
        // 3. 生成星期运势
        const weekdayFortune = this.getWeekdayFortune();
        if (weekdayFortune) {
            this.currentFortune = weekdayFortune;
            this.cachedDate = today;
            return weekdayFortune;
        }
        
        // 4. 默认运势（兜底）
        const defaultFortune = {
            text: "今天是个普通的一天",
            buff: "",
            debuff: "",
            type: "neutral",
            icon: "📅"
        };
        this.currentFortune = defaultFortune;
        this.cachedDate = today;
        return defaultFortune;
    }
    
    // 获取运势显示内容
    getFortuneDisplay() {
        const fortune = this.getDailyFortune();
        return {
            text: fortune.text,
            buff: fortune.buff || null,
            debuff: fortune.debuff || null,
            type: fortune.type || (fortune.buff ? 'good' : (fortune.debuff ? 'bad' : 'neutral')),
            icon: fortune.icon || '🔮'
        };
    }
    
    // 手动刷新运势（用于测试）
    refreshFortune() {
        this.cachedDate = null;
        return this.getDailyFortune();
    }
}

// 导出单例
export const fortuneSystem = new FortuneSystem();
```

---

## 二、效果示例

| 真实日期 | 显示效果 |
|----------|----------|
| 周一 | 【周一】黑色星期一，小心背锅 🍳 背锅概率+50% |
| 周二 | 【周二】周二进入状态，效率提升 ⚡ 工作收益+20% |
| 周三 | 【周三】周三小周末，可以划水 🐟 摸鱼收益+30% |
| 周四 | 【周四】周四离周五不远了 🎯 压力减少+15% |
| 周五 | 【周五】周五了，摸鱼无罪！🎉 所有收益+30% |
| 周六 | 【周六】周六适合休息 😴 压力自动-20 |
| 周日 | 【周日】周日晚上，周一恐惧症 😨 周一压力+30% |
| 10月1日 | 🇨🇳 国庆节快乐！摸鱼七天乐！🎉 所有收益+100% |
| 12月25日 | 🎄 圣诞节快乐！🎁 随机礼物+200 |

---

## 三、使用示例

```javascript
// 在游戏初始化时调用
import { fortuneSystem } from './fortune.js';

// 获取今日运势
const fortune = fortuneSystem.getDailyFortune();
console.log(fortune.text);      // 【周五】周五了，摸鱼无罪！
console.log(fortune.buff);      // 所有收益+30%
console.log(fortune.type);      // good

// 获取显示内容
const display = fortuneSystem.getFortuneDisplay();
// 渲染到UI
document.getElementById('fortuneText').textContent = display.text;
document.getElementById('fortuneBuff').textContent = display.buff || '';
```

---

## 四、总结

| 特性 | 说明 |
|------|------|
| **周几运势** | 周一到周日各有3-5条专属运势 |
| **特殊节日** | 元旦、国庆、圣诞等节日有彩蛋 |
| **运势类型** | good（好运）、bad（坏运）、neutral（普通） |
| **每日缓存** | 同一天运势不变，刷新页面不会改变 |
| **扩展性** | 可轻松添加更多节日和运势文案 |

---


# 版本1.0

## 一、数据与界面的对应关系

### 完整数据流

```
运势数据 (fortune.js)
       ↓
游戏状态 (game.js)
       ↓
界面展示 (index.html + 动态渲染)
```

### 具体对应表

| 数据字段 | 界面位置 | 作用 |
|----------|----------|------|
| `fortune.text` | 运势卡片文字 | 显示运势文案 |
| `fortune.type` | 运势卡片边框颜色 | 决定弹窗样式 |
| `fortune.buff` | 运势卡片buff标签 | 显示正面效果 |
| `fortune.debuff` | 运势卡片debuff标签 | 显示负面效果 |
| `fortune.advice` | 选项卡片上方 | 今日小提示 |
| `fortune.multiplier` | 游戏逻辑 | 实际影响数值计算 |

---

## 二、运势类型与弹窗样式

### 运势类型定义

```javascript
// 运势类型枚举
const FORTUNE_TYPE = {
    GOOD: 'good',      // 好运
    BAD: 'bad',        // 坏运
    NEUTRAL: 'neutral' // 普通
};
```

### 三种弹窗样式

#### 1. 好运弹窗（绿色系）

```html
<div class="fortune-modal fortune-good">
    <div class="fortune-modal-icon">🔮</div>
    <div class="fortune-modal-title">今日运势 · 大吉</div>
    <div class="fortune-modal-text">“今天宜摸鱼，忌开会”</div>
    <div class="fortune-modal-effects">
        <span class="buff-badge">✨ 摸鱼收益+50%</span>
    </div>
    <div class="fortune-modal-advice">
        💡 小贴士：今天是摸鱼的好日子，大胆划水！
    </div>
    <button class="fortune-modal-btn good">开始摸鱼 🐟</button>
</div>
```

```css
.fortune-modal.fortune-good {
    background: linear-gradient(135deg, #e8f0e4, #d4e8cc);
    border: 2px solid #7c9e6e;
}
.fortune-modal-title { color: #5a7a4e; }
.fortune-modal-btn.good { background: #7c9e6e; color: white; }
```

#### 2. 坏运弹窗（橙色系）

```html
<div class="fortune-modal fortune-bad">
    <div class="fortune-modal-icon">🌊</div>
    <div class="fortune-modal-title">今日运势 · 水逆</div>
    <div class="fortune-modal-text">“今天水逆，建议躺平保平安”</div>
    <div class="fortune-modal-effects">
        <span class="debuff-badge">💀 所有收益-20%</span>
        <span class="debuff-badge">🎯 背锅概率+30%</span>
    </div>
    <div class="fortune-modal-advice">
        💡 小贴士：今天不适合做任何重要决定，摸鱼可能是最好的选择。
    </div>
    <button class="fortune-modal-btn bad">知道了，开始摸鱼 🐟</button>
</div>
```

```css
.fortune-modal.fortune-bad {
    background: linear-gradient(135deg, #fff5f0, #ffe8e0);
    border: 2px solid #e8a87c;
}
.fortune-modal-title { color: #d4956a; }
.fortune-modal-btn.bad { background: #e8a87c; color: #1a0f08; }
```

#### 3. 普通弹窗（米色系）

```html
<div class="fortune-modal fortune-neutral">
    <div class="fortune-modal-icon">📅</div>
    <div class="fortune-modal-title">今日运势 · 平平</div>
    <div class="fortune-modal-text">“今天平平无奇，适合正常上班”</div>
    <div class="fortune-modal-effects">
        <span class="neutral-badge">📊 无特殊效果</span>
    </div>
    <div class="fortune-modal-advice">
        💡 小贴士：今天正常发挥就好，不用太拼。
    </div>
    <button class="fortune-modal-btn neutral">开始上班 💼</button>
</div>
```

```css
.fortune-modal.fortune-neutral {
    background: linear-gradient(135deg, #fef7e8, #f5ecd8);
    border: 2px solid #c7b198;
}
.fortune-modal-title { color: #a08870; }
.fortune-modal-btn.neutral { background: #c7b198; color: white; }
```

---

## 三、小提示固定在选项卡片上

### 界面布局

```
┌─────────────────────────────────────┐
│  💡 今日小提示：今天水逆，建议躺平   │ ← 固定在选项卡片上方
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ ①  认真工作            💪   │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ ②  躺平摸鱼            🐟   │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ ③  假装掉线            💻   │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 完整HTML/CSS实现

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>今天不想上班 - 运势小提示</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #2c3e2f 0%, #1a2a1c 100%);
            font-family: 'Segoe UI', 'PingFang SC', monospace;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .game-container {
            max-width: 500px;
            width: 100%;
            background: #fef7e8;
            border-radius: 32px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        /* 事件卡片 */
        .event-card {
            background: #ffffff;
            margin: 20px;
            padding: 24px;
            border-radius: 24px;
            border: 1px solid #f0e2d0;
        }

        .event-title {
            font-size: 20px;
            font-weight: 600;
            color: #7c9e6e;
            margin-bottom: 16px;
        }

        .event-desc {
            font-size: 18px;
            color: #5a4a3a;
            line-height: 1.5;
        }

        /* ========== 小提示区域（固定在选项卡片上方） ========== */
        .tips-area {
            margin: 0 20px 16px 20px;
            padding: 12px 16px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
            transition: all 0.3s;
        }

        /* 好运提示 */
        .tips-area.tips-good {
            background: rgba(124, 158, 110, 0.15);
            border-left: 4px solid #7c9e6e;
            color: #5a7a4e;
        }

        /* 坏运提示 */
        .tips-area.tips-bad {
            background: rgba(232, 168, 124, 0.15);
            border-left: 4px solid #e8a87c;
            color: #c97a4a;
        }

        /* 普通提示 */
        .tips-area.tips-neutral {
            background: rgba(199, 177, 152, 0.15);
            border-left: 4px solid #c7b198;
            color: #8b6b4d;
        }

        .tips-icon {
            font-size: 20px;
            flex-shrink: 0;
        }

        .tips-text {
            flex: 1;
            line-height: 1.4;
        }

        .tips-detail {
            font-size: 11px;
            opacity: 0.7;
            margin-top: 4px;
        }

        /* 选项区域 */
        .options-section {
            padding: 0 20px 20px 20px;
        }

        .options-label {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            padding: 0 4px;
        }

        .options-label-text {
            font-size: 13px;
            color: #b8a890;
        }

        .options-label-line {
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, #e8dccc, transparent);
        }

        .options-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .option-btn {
            background: #ffffff;
            border: 2px solid #e8dccc;
            border-radius: 20px;
            padding: 16px 18px;
            width: 100%;
            text-align: left;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 14px;
            font-family: inherit;
        }

        .option-btn:hover {
            border-color: #7c9e6e;
            background: #fef9f0;
            transform: translateX(4px);
        }

        .option-number {
            width: 36px;
            height: 36px;
            background: #f0e8dc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
            color: #8b6b4d;
        }

        .option-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        .option-text {
            font-size: 16px;
            font-weight: 500;
            color: #5a4a3a;
        }

        .option-emoji {
            font-size: 22px;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <!-- 事件卡片 -->
        <div class="event-card">
            <div class="event-title">📢 今日事件</div>
            <div class="event-desc">今天可以在家办公...</div>
        </div>

        <!-- ========== 小提示区域（根据运势类型变化） ========== -->
        <div class="tips-area tips-bad" id="tipsArea">
            <span class="tips-icon">💡</span>
            <div class="tips-text">
                <div>今日小提示：今天水逆，建议躺平保平安</div>
                <div class="tips-detail">所有收益-20% · 背锅概率+30%</div>
            </div>
        </div>

        <!-- 选项区域 -->
        <div class="options-section">
            <div class="options-label">
                <span class="options-label-text">⚡ 选择你的行动</span>
                <div class="options-label-line"></div>
            </div>
            <div class="options-list">
                <button class="option-btn">
                    <div class="option-number">1</div>
                    <div class="option-content">
                        <span class="option-text">认真工作</span>
                        <span class="option-emoji">💪</span>
                    </div>
                </button>
                <button class="option-btn">
                    <div class="option-number">2</div>
                    <div class="option-content">
                        <span class="option-text">躺平摸鱼</span>
                        <span class="option-emoji">🐟</span>
                    </div>
                </button>
                <button class="option-btn">
                    <div class="option-number">3</div>
                    <div class="option-content">
                        <span class="option-text">假装掉线</span>
                        <span class="option-emoji">💻</span>
                    </div>
                </button>
            </div>
        </div>
    </div>

    <script>
        // 运势类型示例切换（演示用）
        const tipTypes = ['good', 'bad', 'neutral'];
        let currentType = 1;
        
        // 不同运势的小提示配置
        const tipConfig = {
            good: {
                icon: '🍀',
                text: '今日小提示：今天是摸鱼的好日子，大胆划水！',
                detail: '摸鱼收益+50% · 压力减少+30%',
                class: 'tips-good'
            },
            bad: {
                icon: '🌊',
                text: '今日小提示：今天水逆，建议躺平保平安',
                detail: '所有收益-20% · 背锅概率+30%',
                class: 'tips-bad'
            },
            neutral: {
                icon: '📅',
                text: '今日小提示：今天正常发挥就好，不用太拼',
                detail: '无特殊效果 · 正常发挥',
                class: 'tips-neutral'
            }
        };
        
        // 更新小提示（根据运势类型）
        function updateTips(type) {
            const config = tipConfig[type];
            const tipsArea = document.getElementById('tipsArea');
            tipsArea.className = `tips-area ${config.class}`;
            tipsArea.innerHTML = `
                <span class="tips-icon">💡</span>
                <div class="tips-text">
                    <div>${config.text}</div>
                    <div class="tips-detail">${config.detail}</div>
                </div>
            `;
        }
        
        // 演示：点击页面切换运势类型（实际开发中根据游戏状态）
        document.addEventListener('click', () => {
            currentType = (currentType + 1) % 3;
            updateTips(tipTypes[currentType]);
        });
    </script>
</body>
</html>
```

---

## 四、完整数据流示意图

```
┌─────────────────────────────────────────────────────────────┐
│                        fortune.js                            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ {                                                       ││
│  │   type: "bad",                                          ││
│  │   text: "今天水逆，建议躺平保平安",                       ││
│  │   buff: "",                                             ││
│  │   debuff: "所有收益-20%",                               ││
│  │   advice: "今天不适合做任何重要决定",                    ││
│  │   multiplier: { sanityMultiplier: 0.8, ... }           ││
│  │ }                                                       ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        game.js                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ gameState.fortuneModifier = {                          ││
│  │   sanityMultiplier: 0.8,                               ││
│  │   moneyMultiplier: 0.8,                                ││
│  │   backstabPenalty: 1.3                                 ││
│  │ }                                                       ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      index.html (界面)                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 运势弹窗 (type决定样式)                                  ││
│  │   - good → 绿色弹窗                                      ││
│  │   - bad  → 橙色弹窗                                      ││
│  │   - neutral → 米色弹窗                                   ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ 小提示区域 (固定在选项卡片上方)                          ││
│  │   - 显示 fortune.advice                                 ││
│  │   - 显示 fortune.debuff                                 ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ 选项卡片                                                ││
│  │   - 正常显示选项                                        ││
│  │   - 数值计算时应用 multiplier                           ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 五、总结对应表

| 数据 | 界面元素 | 样式依据 |
|------|----------|----------|
| `fortune.type` | 弹窗整体 | `fortune-good` / `fortune-bad` / `fortune-neutral` |
| `fortune.text` | 弹窗文字 | 直接显示 |
| `fortune.buff` | 弹窗buff标签 | 绿色背景 |
| `fortune.debuff` | 弹窗debuff标签 | 橙色背景 |
| `fortune.advice` | 小提示文字 | 直接显示 |
| `fortune.type` | 小提示背景 | `tips-good` / `tips-bad` / `tips-neutral` |
| `fortune.multiplier` | 游戏逻辑 | 影响数值计算 |

这样数据、界面、交互的关系就清晰了！

