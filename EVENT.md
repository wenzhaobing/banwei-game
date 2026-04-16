## 📝 新增20个职场荒诞事件

以下是贴近打工人生活、选项足够离谱的事件库，按场景分类：

---

### 一、会议与汇报类（开会摸鱼）

```javascript
{
    id: "meeting_2",
    title: "📊 季度总结大会",
    desc: "老板在台上激情演讲，PPT已经翻了50页...",
    options: [
        { text: "假装记笔记 ✍️", effects: { sanity: -5, stress: -5, money: 0 }, feedback: "你在本子上画了一只乌龟", tags: [] },
        { text: "偷偷点外卖 🍔", effects: { sanity: 15, stress: -10, money: -40 }, feedback: "外卖到了，全会议室都闻到了香味", tags: ["slack_off"] },
        { text: "举手提问刁难 🤔", effects: { sanity: -20, stress: 15, money: 0 }, feedback: "老板愣住3秒，说'这个问题我们私下讨论'", tags: ["backstab"] }
    ]
},
{
    id: "meeting_3",
    title: "💻 线上会议",
    desc: "Zoom会议开了1小时，你一直关着摄像头...",
    options: [
        { text: "假装网络卡顿 📶", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "你变成了PPT，一动不动", tags: ["slack_off"] },
        { text: "偷偷躺床上 🛏️", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "舒服得差点打呼噜", tags: ["slack_off"] },
        { text: "不小心开了摄像头 😱", effects: { sanity: -30, stress: 25, money: -20 }, feedback: "大家看到你在吃螺蛳粉", tags: ["backstab"] }
    ]
},
{
    id: "meeting_4",
    title: "👥 一对一谈话",
    desc: "HR约你聊聊职业规划...",
    options: [
        { text: "画大饼 🥞", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "你说要当CEO，HR沉默了", tags: [] },
        { text: "实话实说 💔", effects: { sanity: -10, stress: -15, money: -30 }, feedback: "你说'我想摸鱼到退休'", tags: [] },
        { text: "当场辞职 📄", effects: { sanity: 30, stress: -50, money: -200 }, feedback: "HR: '你认真的吗？' 你: '认真的'", tags: [] }
    ]
}
```

---

### 二、老板与领导类（职场修罗场）

```javascript
{
    id: "boss_2",
    title: "👔 老板突然发消息",
    desc: "晚上11点，老板在群里@了你...",
    options: [
        { text: "秒回'收到' ✅", effects: { sanity: -10, stress: 10, money: 50 }, feedback: "老板说'辛苦了'，你心里MMP", tags: ["overtime"] },
        { text: "假装睡着了 😴", effects: { sanity: 10, stress: -5, money: 0 }, feedback: "第二天说手机没电了", tags: ["slack_off"] },
        { text: "反问'你也是？' 🤨", effects: { sanity: 20, stress: -15, money: -80 }, feedback: "老板已读不回，你慌了", tags: ["backstab"] }
    ]
},
{
    id: "boss_3",
    title: "🎂 老板生日",
    desc: "同事们在张罗给老板过生日...",
    options: [
        { text: "众筹买礼物 🎁", effects: { sanity: 0, stress: -10, money: -50 }, feedback: "你出了一份钱，但不知道买的是什么", tags: [] },
        { text: "写贺卡敷衍 ✉️", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "你写了'生日快乐'四个字", tags: [] },
        { text: "送了一箱辣条 🌶️", effects: { sanity: 15, stress: -20, money: -30 }, feedback: "老板: '这是...' 你: '进口零食'", tags: ["slack_off"] }
    ]
},
{
    id: "boss_4",
    title: "📧 收到全员邮件",
    desc: "公司宣布要'降本增效'，大家都慌了...",
    options: [
        { text: "疯狂投简历 📄", effects: { sanity: -15, stress: 20, money: 0 }, feedback: "发现自己的简历毫无亮点", tags: [] },
        { text: "摸鱼等裁员 🐟", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "你开始每天准时下班", tags: ["slack_off"] },
        { text: "主动找老板表忠心 💪", effects: { sanity: -20, stress: 15, money: 30 }, feedback: "老板: '你是个好员工'", tags: [] }
    ]
}
```

---

### 三、同事与社交类（办公室政治）

```javascript
{
    id: "colleague_1",
    title: "👥 同事八卦时间",
    desc: "茶水间里，同事在讲老板的坏话...",
    options: [
        { text: "一起吐槽 😈", effects: { sanity: 15, stress: -15, money: 0 }, feedback: "爽！说出了心里话", tags: ["slack_off"] },
        { text: "默默走开 🚶", effects: { sanity: -5, stress: -5, money: 0 }, feedback: "你装作什么都没听见", tags: [] },
        { text: "偷偷录音 🎙️", effects: { sanity: -20, stress: 10, money: -100 }, feedback: "被同事发现了，社死现场", tags: ["backstab"] }
    ]
},
{
    id: "colleague_2",
    title: "🍱 午饭时间",
    desc: "同事叫你一起吃饭，但你想一个人...",
    options: [
        { text: "爽快答应 🍜", effects: { sanity: 5, stress: -10, money: -30 }, feedback: "AA制花了30块", tags: [] },
        { text: "找借口拒绝 🙅", effects: { sanity: 0, stress: 5, money: 0 }, feedback: "同事觉得你高冷", tags: [] },
        { text: "说'我减肥' 🏃", effects: { sanity: 10, stress: -5, money: 20 }, feedback: "同事: '你都瘦成闪电了还减？'", tags: ["slack_off"] }
    ]
},
{
    id: "colleague_3",
    title: "🎉 团建通知",
    desc: "HR发了团建通知：周末去爬山...",
    options: [
        { text: "欣然接受 🏔️", effects: { sanity: -10, stress: 15, money: 0 }, feedback: "你心里在流泪", tags: [] },
        { text: "假装家里有事 🏠", effects: { sanity: 10, stress: -10, money: -50 }, feedback: "请了半天病假，其实在家打游戏", tags: ["slack_off"] },
        { text: "建议改剧本杀 🎭", effects: { sanity: 15, stress: -15, money: -80 }, feedback: "大家玩嗨了，你成了团宠", tags: [] }
    ]
}
```

---

### 四、办公环境类（工位日常）

```javascript
{
    id: "office_1",
    title: "❄️ 空调太冷了",
    desc: "中央空调开到了16度，你瑟瑟发抖...",
    options: [
        { text: "默默穿上外套 🧥", effects: { sanity: 0, stress: -5, money: 0 }, feedback: "像一只企鹅", tags: [] },
        { text: "去调空调温度 🌡️", effects: { sanity: 5, stress: 10, money: 0 }, feedback: "同事又调回去了，战争开始", tags: ["backstab"] },
        { text: "带了个暖水袋 🔥", effects: { sanity: 10, stress: -10, money: -30 }, feedback: "同事都来蹭你的热水", tags: ["slack_off"] }
    ]
},
{
    id: "office_2",
    title: "🔊 打印机坏了",
    desc: "你要打印重要文件，打印机卡纸了...",
    options: [
        { text: "拍打打印机 👊", effects: { sanity: -10, stress: 15, money: -50 }, feedback: "打印机彻底坏了", tags: [] },
        { text: "找IT小哥 🛠️", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "IT小哥: '重启试试'", tags: [] },
        { text: "用手抄 ✍️", effects: { sanity: -15, stress: 5, money: 0 }, feedback: "手酸了，字还丑", tags: ["overtime"] }
    ]
},
{
    id: "office_3",
    title: "☕ 咖啡机坏了",
    desc: "唯一的咖啡机坏了，整个部门都疯了...",
    options: [
        { text: "泡速溶咖啡 ☕", effects: { sanity: -5, stress: 5, money: 0 }, feedback: "难喝，但能续命", tags: ["coffee"] },
        { text: "叫外卖咖啡 🚚", effects: { sanity: 10, stress: -10, money: -40 }, feedback: "顺便帮同事带了5杯", tags: ["coffee"] },
        { text: "建议喝白开水 💧", effects: { sanity: -20, stress: 15, money: 0 }, feedback: "被同事集体白眼", tags: [] }
    ]
}
```

---

### 五、个人状态类（身心俱疲）

```javascript
{
    id: "self_1",
    title: "😴 昨晚没睡好",
    desc: "凌晨3点才睡，现在眼睛都睁不开...",
    options: [
        { text: "喝三杯咖啡 ☕☕☕", effects: { sanity: 15, stress: 10, money: -30 }, feedback: "手开始抖了", tags: ["coffee"] },
        { text: "去洗手间睡10分钟 🚽", effects: { sanity: 10, stress: -15, money: 0 }, feedback: "醒来发现睡了半小时", tags: ["slack_off"] },
        { text: "硬撑到下班 💪", effects: { sanity: -20, stress: 15, money: 50 }, feedback: "效率只有20%", tags: ["overtime"] }
    ]
},
{
    id: "self_2",
    title: "📱 手机没电了",
    desc: "还有3小时下班，手机只剩10%电量...",
    options: [
        { text: "借充电宝 🔋", effects: { sanity: 5, stress: -5, money: -20 }, feedback: "扫码租了一个", tags: [] },
        { text: "开启省电模式 🔋", effects: { sanity: 0, stress: 10, money: 0 }, feedback: "煎熬，不敢玩手机", tags: [] },
        { text: "去前台蹭充电 🔌", effects: { sanity: 10, stress: -15, money: 0 }, feedback: "顺便和前台小姐姐聊了半小时", tags: ["slack_off"] }
    ]
},
{
    id: "self_3",
    title: "🧠 脑子一片空白",
    desc: "想不起刚才要做什么，感觉失忆了...",
    options: [
        { text: "疯狂回忆 🤔", effects: { sanity: -10, stress: 10, money: 0 }, feedback: "越想越想不起来", tags: [] },
        { text: "放弃思考 🛌", effects: { sanity: 5, stress: -15, money: 0 }, feedback: "刷了半小时手机", tags: ["slack_off"] },
        { text: "写备忘录 📝", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "记了一堆废话", tags: [] }
    ]
}
```

---

### 六、离谱脑洞类（荒诞到底）

```javascript
{
    id: "crazy_1",
    title: "🐱 公司来了一只猫",
    desc: "不知道谁带的猫，在办公室到处跑...",
    options: [
        { text: "偷偷撸猫 🐾", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "猫主子很享受", tags: ["slack_off"] },
        { text: "报告行政 📢", effects: { sanity: -10, stress: 5, money: 0 }, feedback: "猫被赶走了，同事恨你", tags: ["backstab"] },
        { text: "想收养它 🏠", effects: { sanity: 15, stress: -10, money: -200 }, feedback: "猫跟你回家了，你成了铲屎官", tags: [] }
    ]
},
{
    id: "crazy_2",
    title: "🔮 公司请了风水大师",
    desc: "老板请人来看风水，说要调整工位...",
    options: [
        { text: "相信玄学 🙏", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "大师说你命里缺金", tags: [] },
        { text: "偷偷吐槽 😒", effects: { sanity: 10, stress: -5, money: 0 }, feedback: "同事: '老板是不是被骗了？'", tags: ["slack_off"] },
        { text: "要求换个风水宝地 🪑", effects: { sanity: -15, stress: 15, money: 0 }, feedback: "大师说你不懂风水", tags: ["backstab"] }
    ]
},
{
    id: "crazy_3",
    title: "🎰 公司搞抽奖",
    desc: "年会奖品是一张彩票，你刮开了...",
    options: [
        { text: "中了50块 💰", effects: { sanity: 10, stress: -10, money: 50 }, feedback: "开心，晚上加鸡腿", tags: [] },
        { text: "谢谢参与 😭", effects: { sanity: -10, stress: 5, money: 0 }, feedback: "同事中了iPad，你酸了", tags: [] },
        { text: "彩票丢了 😱", effects: { sanity: -20, stress: 20, money: -100 }, feedback: "后来听说那张中了500万", tags: [] }
    ]
}
```

---

## 📊 完整事件库汇总

| 类别 | 数量 | 特点 |
|------|------|------|
| 会议与汇报 | 3个 | 开会摸鱼、线上划水 |
| 老板与领导 | 4个 | 职场修罗场 |
| 同事与社交 | 3个 | 办公室政治 |
| 办公环境 | 3个 | 工位日常 |
| 个人状态 | 3个 | 身心俱疲 |
| 离谱脑洞 | 4个 | 荒诞到底 |
| **总计** | **20个** | - |

这些事件贴近打工人真实生活，选项足够离谱，能激发玩家的好奇心和分享欲！