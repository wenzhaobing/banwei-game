/**
 * 成就数据
 * 包含成就条件、奖励和进度信息
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
