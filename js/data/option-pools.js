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
