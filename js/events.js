/**
 * 运势数据
 */
export const fortunes = [
    // 好运类型
    { id: "fortune_001", type: "good", text: "今天宜摸鱼，忌开会", buff: "摸鱼收益+50%", debuff: "", advice: "今天是摸鱼的好日子，大胆划水！", multiplier: { slackBonus: 1.5 } },
    { id: "fortune_002", type: "good", text: "老板心情不错，可以适当划水", buff: "压力减少+30%", debuff: "", advice: "老板心情好，今天适合低调摸鱼。", multiplier: { stressMultiplier: 0.7 } },
    { id: "fortune_003", type: "good", text: "周五了，摸鱼无罪！", buff: "所有收益+30%", debuff: "", advice: "周五了，该放松就放松！", multiplier: { sanityMultiplier: 1.3, stressMultiplier: 0.7, moneyMultiplier: 1.3 } },
    { id: "fortune_004", type: "good", text: "今天咖啡半价，多喝点☕", buff: "咖啡效果+50%", debuff: "", advice: "多喝咖啡，精神百倍！", multiplier: { coffeeBonus: 1.5 } },
    { id: "fortune_005", type: "good", text: "今天适合表现自己✨", buff: "金钱收益+30%", debuff: "", advice: "好好表现，加薪有望！", multiplier: { moneyMultiplier: 1.3 } },
    { id: "fortune_006", type: "good", text: "财神眷顾，今天财运不错💰", buff: "存款收益+50%", debuff: "", advice: "今天适合谈钱，不伤感情。", multiplier: { moneyMultiplier: 1.5 } },
    { id: "fortune_007", type: "good", text: "今天心情特别好😊", buff: "理智恢复+50%", debuff: "", advice: "心情好，工作效率自然高。", multiplier: { sanityMultiplier: 1.5 } },
    { id: "fortune_008", type: "good", text: "老板出差了，今天自由啦🎉", buff: "摸鱼自由，压力自动减少", debuff: "", advice: "老板不在，尽情摸鱼！", multiplier: { slackBonus: 2.0, stressMultiplier: 0.5 } },
    { id: "fortune_019", type: "good", text: "欧皇附体！今天运气爆棚🍀", buff: "所有正面效果翻倍", debuff: "", advice: "今天运气爆棚，大胆做选择！", multiplier: { sanityMultiplier: 2.0, stressMultiplier: 0.5, moneyMultiplier: 2.0, slackBonus: 2.0 } },

    // 坏运类型
    { id: "fortune_009", type: "bad", text: "黑色星期一，小心背锅", buff: "", debuff: "背锅概率+50%", advice: "今天小心行事，少说话多做事。", multiplier: { backstabPenalty: 1.5 } },
    { id: "fortune_010", type: "bad", text: "今天不宜上班，建议请假😴", buff: "", debuff: "所有事件惩罚+20%", advice: "今天不适合做重要决定，摸鱼保平安。", multiplier: { sanityMultiplier: 0.8, stressMultiplier: 1.2, moneyMultiplier: 0.8 } },
    { id: "fortune_011", type: "bad", text: "老板今天心情不好，离远点😠", buff: "", debuff: "压力增加+50%", advice: "远离老板，低调行事。", multiplier: { stressMultiplier: 1.5 } },
    { id: "fortune_012", type: "bad", text: "今天不宜消费，小心钱包💸", buff: "", debuff: "存款减少+30%", advice: "今天控制消费，省钱为上。", multiplier: { moneyMultiplier: 0.7 } },
    { id: "fortune_013", type: "bad", text: "水逆来袭，诸事不顺🌊", buff: "", debuff: "所有收益-20%，惩罚+20%", advice: "今天水逆，建议躺平保平安。", multiplier: { sanityMultiplier: 0.8, stressMultiplier: 1.2, moneyMultiplier: 0.8, backstabPenalty: 1.2 } },
    { id: "fortune_014", type: "bad", text: "今天容易犯困，效率低下😪", buff: "", debuff: "理智消耗+30%", advice: "多喝咖啡提神，或者干脆摸鱼。", multiplier: { sanityMultiplier: 0.7 } },
    { id: "fortune_020", type: "bad", text: "今天不适合做任何决定🤔", buff: "", debuff: "所有选择后果随机化", advice: "今天选择困难，随缘吧。", multiplier: { randomizeEffects: true } },

    // 普通类型（混合效果）
    { id: "fortune_015", type: "neutral", text: "老板出差了，但被安排了远程汇报", buff: "摸鱼自由+50%", debuff: "汇报压力+30%", advice: "有得有失，看你怎么选。", multiplier: { slackBonus: 1.5, stressMultiplier: 1.3 } },
    { id: "fortune_016", type: "neutral", text: "今天是发薪日，但信用卡也要还", buff: "存款+200", debuff: "压力+10", advice: "发薪日快乐，记得还信用卡。", multiplier: { instantMoney: 200, instantStress: 10 } },
    { id: "fortune_017", type: "neutral", text: "同事请喝奶茶，但热量爆炸🧋", buff: "理智+10", debuff: "压力+5", advice: "奶茶虽好，热量爆炸。", multiplier: { instantSanity: 10, instantStress: 5 } },
    { id: "fortune_018", type: "neutral", text: "今天开会特别多，但可以摸鱼", buff: "摸鱼收益+30%", debuff: "压力+15", advice: "开会摸鱼两不误。", multiplier: { slackBonus: 1.3, instantStress: 15 } },
];

/**
 * 游戏事件数据
 */
export const events = [
    {
        id: "slack_1",
        title: "📱 偷偷摸鱼",
        desc: "老板去开会了，你掏出手机...",
        options: [
            { text: "刷短视频 😂", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "太好笑了，压力全无！", tags: ["slack_off"] },
            { text: "打游戏 🎮", effects: { sanity: 10, stress: -15, money: -50 }, feedback: "游戏输了，但爽到了", tags: ["slack_off"] },
            { text: "假装工作 💼", effects: { sanity: -5, stress: -5, money: 20 }, feedback: "老板突然回来，你机智地切屏了", tags: [] }
        ]
    },
    {
        id: "boss_1",
        title: "👔 老板来了",
        desc: "老板突然出现在你身后...",
        options: [
            { text: "假装在写代码 💻", effects: { sanity: -10, stress: 5, money: 50 }, feedback: "老板满意地走了", tags: [] },
            { text: "回头对视 👀", effects: { sanity: -20, stress: 10, money: 0 }, feedback: "尴尬对视3秒，你赢了", tags: [] },
            { text: "装死 😵", effects: { sanity: -30, stress: 20, money: -100 }, feedback: "老板叫了救护车...", tags: ["backstab"] }
        ]
    },
    {
        id: "coffee_1",
        title: "☕ 咖啡时间",
        desc: "去茶水间接咖啡，遇到同事",
        options: [
            { text: "正常聊天 💬", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "聊得挺开心", tags: ["coffee"] },
            { text: "疯狂续杯 🔄", effects: { sanity: 15, stress: -20, money: -30 }, feedback: "咖啡因上头，精神百倍！", tags: ["coffee"] },
            { text: "给老板带一杯 🎁", effects: { sanity: -5, stress: -15, money: -60 }, feedback: "老板记住你了", tags: [] }
        ]
    },
    {
        id: "meeting_1",
        title: "📊 无聊会议",
        desc: "会议室里，PPT放了半小时...",
        options: [
            { text: "认真记笔记 ✍️", effects: { sanity: -10, stress: 5, money: 30 }, feedback: "假装很认真", tags: [] },
            { text: "偷偷睡觉 😴", effects: { sanity: 20, stress: -25, money: 0 }, feedback: "醒来会议刚结束", tags: ["slack_off"] },
            { text: "提问刁难 🤔", effects: { sanity: -15, stress: 10, money: 0 }, feedback: "气氛突然尴尬", tags: ["backstab"] }
        ]
    },
    {
        id: "overtime_1",
        title: "🌙 深夜加班",
        desc: "又是加班到深夜...",
        options: [
            { text: "努力干活 💪", effects: { sanity: -20, stress: 15, money: 100 }, feedback: "完成了任务", tags: ["overtime"] },
            { text: "摸鱼等下班 🐟", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "反正也没人管", tags: ["slack_off"] },
            { text: "点外卖 🍱", effects: { sanity: 5, stress: -5, money: -80 }, feedback: "美食治愈一切", tags: [] }
        ]
    },
    {
        id: "colleague_1",
        title: "👥 同事八卦",
        desc: "听到同事在讨论工资...",
        options: [
            { text: "加入讨论 🗣️", effects: { sanity: 10, stress: -5, money: 0 }, feedback: "了解了市场行情", tags: [] },
            { text: "假装没听见 🤐", effects: { sanity: -5, stress: 5, money: 0 }, feedback: "还是少知道为妙", tags: [] },
            { text: "找HR举报 📢", effects: { sanity: -20, stress: 20, money: 50 }, feedback: "老板给你发了奖金", tags: ["backstab"] }
        ]
    },
    {
        id: "lunch_1",
        title: "🍜 午餐时间",
        desc: "中午吃什么世纪难题...",
        options: [
            { text: "点外卖 🍔", effects: { sanity: 5, stress: -5, money: -40 }, feedback: "外卖真香", tags: [] },
            { text: "去食堂 🍱", effects: { sanity: 0, stress: 0, money: -20 }, feedback: "省钱但难吃", tags: [] },
            { text: "请客吃饭 🎉", effects: { sanity: 15, stress: -10, money: -100 }, feedback: "同事都夸你大气", tags: [] }
        ]
    },
    {
        id: "deadline_1",
        title: "📅 截止日期",
        desc: "明天就是deadline了！",
        options: [
            { text: "熬夜赶工 🌙", effects: { sanity: -25, stress: 20, money: 80 }, feedback: "终于完成了", tags: ["overtime"] },
            { text: "通宵摸鱼 😈", effects: { sanity: 10, stress: -15, money: 0 }, feedback: "明天再说的吧", tags: ["slack_off"] },
            { text: "甩锅同事 🙄", effects: { sanity: -10, stress: 10, money: 30 }, feedback: "成功转移压力", tags: ["backstab"] }
        ]
    },
    {
        id: "email_1",
        title: "📧 邮件炸弹",
        desc: "一觉醒来，99+未读邮件...",
        options: [
            { text: "全部标记已读 👻", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "眼不见为净", tags: ["slack_off"] },
            { text: "认真回复 📝", effects: { sanity: -15, stress: 15, money: 50 }, feedback: "专业经理人", tags: [] },
            { text: "假装没看见 😴", effects: { sanity: 10, stress: -5, money: 0 }, feedback: "睡醒再说", tags: ["slack_off"] }
        ]
    },
    {
        id: "interview_1",
        title: "💼 面试来宾",
        desc: "今天有个面试者在等你...",
        options: [
            { text: "正常面试 🤵", effects: { sanity: -10, stress: 5, money: 30 }, feedback: "招到人了", tags: [] },
            { text: "疯狂劝退 🚪", effects: { sanity: 10, stress: -15, money: 0 }, feedback: "终于清静了", tags: ["slack_off"] },
            { text: "聊人生理想 🌟", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "收获一个新朋友", tags: [] }
        ]
    },
    {
        id: "printer_1",
        title: "🖨️ 打印机坏了",
        desc: "重要文件打不出来...",
        options: [
            { text: "自己修理 🔧", effects: { sanity: -15, stress: 10, money: 0 }, feedback: "弄一手墨水", tags: [] },
            { text: "叫IT维修 📞", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "等了一个小时", tags: [] },
            { text: "让别人打 🧐", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "成功转移任务", tags: ["backstab"] }
        ]
    },
    {
        id: "birthday_1",
        title: "🎂 同事生日",
        desc: "又有人过生日了...",
        options: [
            { text: "随份子 💰", effects: { sanity: 5, stress: -5, money: -100 }, feedback: "增进同事感情", tags: [] },
            { text: "假装不在 🙈", effects: { sanity: -5, stress: 5, money: 0 }, feedback: "逃过一劫", tags: ["slack_off"] },
            { text: "组织庆祝 🎉", effects: { sanity: 15, stress: -15, money: -150 }, feedback: "成为社交达人", tags: [] }
        ]
    },
    {
        id: "system_1",
        title: "💻 系统崩溃",
        desc: "电脑突然蓝屏了...",
        options: [
            { text: "重启大法 🔄", effects: { sanity: -5, stress: 5, money: 0 }, feedback: "重试亿次", tags: [] },
            { text: "叫IT来修 📞", effects: { sanity: 5, stress: -10, money: 0 }, feedback: "等待支援", tags: [] },
            { text: "趁机摸鱼 🐟", effects: { sanity: 10, stress: -15, money: 0 }, feedback: "天赐摸鱼机会", tags: ["slack_off"] }
        ]
    },
    {
        id: "outing_1",
        title: "🏕️ 团建活动",
        desc: "周末要团建，去还是不去...",
        options: [
            { text: "积极参加 🎯", effects: { sanity: 15, stress: -20, money: -200 }, feedback: "累但快乐着", tags: [] },
            { text: "找借口不去 😏", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "成功逃掉", tags: ["slack_off"] },
            { text: "全程划水 🚣", effects: { sanity: 5, stress: -5, money: -100 }, feedback: "摸鱼大成功", tags: ["slack_off"] }
        ]
    },
    {
        id: "promotion_1",
        title: "📈 晋升机会",
        desc: "有个主管位置空出来了...",
        options: [
            { text: "主动争取 💪", effects: { sanity: -20, stress: 20, money: 100 }, feedback: "压力山大", tags: ["overtime"] },
            { text: "顺其自然 🧘", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "看淡名利", tags: [] },
            { text: "背后搞事 🎭", effects: { sanity: -15, stress: 15, money: 50 }, feedback: "不择手段", tags: ["backstab"] }
        ]
    },
    {
        id: " complaint_1",
        title: "😤 客户投诉",
        desc: "客户打电话来抱怨...",
        options: [
            { text: "耐心倾听 👂", effects: { sanity: -10, stress: 10, money: 30 }, feedback: "服务至上", tags: [] },
            { text: "转接同事 📲", effects: { sanity: 5, stress: -5, money: 0 }, feedback: "成功甩锅", tags: ["backstab"] },
            { text: "直接挂断 📵", effects: { sanity: 10, stress: -15, money: -50 }, feedback: "舒服了，但可能被扣钱", tags: ["slack_off"] }
        ]
    },
    {
        id: "workfromhome_1",
        title: "🏠 居家办公",
        desc: "今天可以在家办公...",
        options: [
            { text: "认真工作 💻", effects: { sanity: -10, stress: 5, money: 50 }, feedback: "没人监督也要自律", tags: [] },
            { text: "躺平摸鱼 🛏️", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "居家摸鱼就是爽", tags: ["slack_off"] },
            { text: "假装掉线 🌙", effects: { sanity: 15, stress: -15, money: 0 }, feedback: "消失一天", tags: ["slack_off"] }
        ]
    },
    {
        id: "training_1",
        title: "📚 培训课程",
        desc: "公司安排了一场培训...",
        options: [
            { text: "认真听讲 📖", effects: { sanity: -10, stress: 5, money: 30 }, feedback: "学到了很多", tags: [] },
            { text: "偷偷刷手机 📱", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "时间没浪费", tags: ["slack_off"] },
            { text: "提前开溜 🏃", effects: { sanity: 15, stress: -15, money: 0 }, feedback: "溜了溜了", tags: ["slack_off"] }
        ]
    },
    {
        id: "bonus_1",
        title: "💵 发奖金了",
        desc: "季度奖金到账！",
        options: [
            { text: "存起来 🏦", effects: { sanity: 10, stress: -10, money: 200 }, feedback: "理财达人", tags: [] },
            { text: "吃顿好的 🍜", effects: { sanity: 15, stress: -15, money: -150 }, feedback: "犒劳自己", tags: [] },
            { text: "买买买 🛍️", effects: { sanity: 20, stress: -20, money: -200 }, feedback: "心情舒畅", tags: [] }
        ]
    },
    // ========== 新增事件 ==========
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
    },
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
    },
    {
        id: "colleague_2",
        title: "👥 同事八卦时间",
        desc: "茶水间里，同事在讲老板的坏话...",
        options: [
            { text: "一起吐槽 😈", effects: { sanity: 15, stress: -15, money: 0 }, feedback: "爽！说出了心里话", tags: ["slack_off"] },
            { text: "默默走开 🚶", effects: { sanity: -5, stress: -5, money: 0 }, feedback: "你装作什么都没听见", tags: [] },
            { text: "偷偷录音 🎙️", effects: { sanity: -20, stress: 10, money: -100 }, feedback: "被同事发现了，社死现场", tags: ["backstab"] }
        ]
    },
    {
        id: "colleague_3",
        title: "🍱 午饭时间",
        desc: "同事叫你一起吃饭，但你想一个人...",
        options: [
            { text: "爽快答应 🍜", effects: { sanity: 5, stress: -10, money: -30 }, feedback: "AA制花了30块", tags: [] },
            { text: "找借口拒绝 🙅", effects: { sanity: 0, stress: 5, money: 0 }, feedback: "同事觉得你高冷", tags: [] },
            { text: "说'我减肥' 🏃", effects: { sanity: 10, stress: -5, money: 20 }, feedback: "同事: '你都瘦成闪电了还减？'", tags: ["slack_off"] }
        ]
    },
    {
        id: "colleague_4",
        title: "🎉 团建通知",
        desc: "HR发了团建通知：周末去爬山...",
        options: [
            { text: "欣然接受 🏔️", effects: { sanity: -10, stress: 15, money: 0 }, feedback: "你心里在流泪", tags: [] },
            { text: "假装家里有事 🏠", effects: { sanity: 10, stress: -10, money: -50 }, feedback: "请了半天病假，其实在家打游戏", tags: ["slack_off"] },
            { text: "建议改剧本杀 🎭", effects: { sanity: 15, stress: -15, money: -80 }, feedback: "大家玩嗨了，你成了团宠", tags: [] }
        ]
    },
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
        title: "🔊 打印机又坏了",
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
    },
    {
        id: "self_1",
        title: "😴 昨晚没睡好",
        desc: "凌晨3点才睡，现在眼睛都睁不开...",
        options: [
            { text: "喝三杯咖啡 ☕☕☕", effects: { sanity: 15, stress: -5, money: -30 }, feedback: "手开始抖了", tags: ["coffee"] },
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
    },
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
];

/**
 * 成就数据
 */
export const achievements = {
    slack_master: {
        name: "🐟 摸鱼宗师",
        desc: "累计摸鱼10次",
        condition: (state) => state.eventCount.slack_off >= 10,
        icon: "🐟",
        reward: "摸鱼时收益+50%",
        current: (state) => state.eventCount.slack_off || 0,
        target: 10
    },
    backstab_king: {
        name: "🍳 背锅侠",
        desc: "累计背锅5次",
        condition: (state) => state.eventCount.backstab >= 5,
        icon: "🍳",
        reward: "背锅时压力减少",
        current: (state) => state.eventCount.backstab || 0,
        target: 5
    },
    overtime_warrior: {
        name: "🌙 加班战神",
        desc: "累计加班8次",
        condition: (state) => state.eventCount.overtime >= 8,
        icon: "🌙",
        reward: "加班获得额外金钱",
        current: (state) => state.eventCount.overtime || 0,
        target: 8
    },
    coffee_addict: {
        name: "☕ 咖啡中毒",
        desc: "喝咖啡20次",
        condition: (state) => state.eventCount.coffee >= 20,
        icon: "☕",
        reward: "咖啡效果翻倍",
        current: (state) => state.eventCount.coffee || 0,
        target: 20
    },
    millionaire: {
        name: "💰 小目标达成",
        desc: "存款达到1000",
        condition: (state) => state.money >= 1000,
        icon: "💰",
        reward: "存款利息+10%",
        current: (state) => state.money,
        target: 1000
    },
    zen_master: {
        name: "🧘 情绪大师",
        desc: "压力从未超过80",
        condition: (state) => state.maxStressEver < 80,
        icon: "🧘",
        reward: "初始压力-20",
        current: (state) => state.maxStressEver || 0,
        target: 80
    }
};
