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
