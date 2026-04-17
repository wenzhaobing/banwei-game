/**
 * 游戏事件数据
 * 重构为选项池配置
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
