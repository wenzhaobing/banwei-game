/**
 * 运势数据 - 版本2.0
 * 基于周几 + 特殊节日的运势系统
 */

// 特殊日期运势（节日/纪念日）
export const specialDateFortunes = {
    // 法定节假日
    '1-1': { 
        id: 'special_1', 
        type: 'good', 
        text: '元旦快乐！新的一年，新的开始！', 
        buff: '新年好运+50%', 
        debuff: '', 
        advice: '新年第一天，许个愿望吧！', 
        icon: '🎉',
        multiplier: { sanityMultiplier: 1.5, moneyMultiplier: 1.5 } 
    },
    '2-14': { 
        id: 'special_2', 
        type: 'good', 
        text: '情人节快乐！', 
        buff: '社交收益+50%', 
        debuff: '', 
        advice: '有对象的秀恩爱，没对象的摸鱼吧！', 
        icon: '💕',
        multiplier: { slackBonus: 1.5 } 
    },
    '3-8': { 
        id: 'special_3', 
        type: 'good', 
        text: '妇女节快乐！', 
        buff: '所有收益+30%', 
        debuff: '', 
        advice: '致敬所有女性打工人！', 
        icon: '🌸',
        multiplier: { sanityMultiplier: 1.3, stressMultiplier: 0.7, moneyMultiplier: 1.3 } 
    },
    '5-1': { 
        id: 'special_4', 
        type: 'good', 
        text: '劳动节快乐！今天不用劳动！', 
        buff: '摸鱼收益+100%', 
        debuff: '', 
        advice: '劳动节就该休息，摸鱼无罪！', 
        icon: '🛠️',
        multiplier: { slackBonus: 2.0 } 
    },
    '6-1': { 
        id: 'special_5', 
        type: 'good', 
        text: '儿童节快乐！今天可以当个孩子！', 
        buff: '所有收益+50%', 
        debuff: '', 
        advice: '谁还不是个宝宝呢！', 
        icon: '🍭',
        multiplier: { sanityMultiplier: 1.5, stressMultiplier: 0.5, moneyMultiplier: 1.5 } 
    },
    '9-10': { 
        id: 'special_6', 
        type: 'good', 
        text: '教师节快乐！', 
        buff: '学习收益+50%', 
        debuff: '', 
        advice: '感谢所有老师的付出！', 
        icon: '📖',
        multiplier: { sanityMultiplier: 1.5 } 
    },
    '10-1': { 
        id: 'special_7', 
        type: 'good', 
        text: '国庆节快乐！摸鱼七天乐！', 
        buff: '所有收益+100%', 
        debuff: '', 
        advice: '国庆长假，尽情享受！', 
        icon: '🇨🇳',
        multiplier: { sanityMultiplier: 2.0, stressMultiplier: 0.5, moneyMultiplier: 2.0 } 
    },
    '12-25': { 
        id: 'special_8', 
        type: 'good', 
        text: '圣诞节快乐！', 
        buff: '随机礼物+200', 
        debuff: '', 
        advice: '圣诞快乐，记得许愿！', 
        icon: '🎄',
        multiplier: { instantMoney: 200 } 
    },
    '12-31': { 
        id: 'special_9', 
        type: 'good', 
        text: '年终总结，摸鱼一年辛苦了！', 
        buff: '年终奖+500', 
        debuff: '', 
        advice: '一年辛苦了，明年继续摸鱼！', 
        icon: '📅',
        multiplier: { instantMoney: 500 } 
    },
    
    // 特殊日子
    '4-1': { 
        id: 'special_10', 
        type: 'bad', 
        text: '愚人节！小心被整蛊！', 
        buff: '', 
        debuff: '所有事件随机化', 
        advice: '今天说什么都要三思！', 
        icon: '🎭',
        multiplier: { randomizeEffects: true } 
    },
    '11-11': { 
        id: 'special_11', 
        type: 'neutral', 
        text: '双十一！剁手节！', 
        buff: '购物快乐', 
        debuff: '存款-100', 
        advice: '剁手需谨慎，钱包要保住！', 
        icon: '🛒',
        multiplier: { instantMoney: -100, sanityMultiplier: 1.2 } 
    }
};

// 星期运势池
export const weekdayFortunes = {
    // 周一运势
    '周一': [
        { 
            id: 'monday_1', 
            type: 'bad', 
            text: '黑色星期一，小心背锅', 
            buff: '', 
            debuff: '背锅概率+50%', 
            advice: '今天小心行事，少说话多做事。', 
            icon: '🍳',
            multiplier: { backstabPenalty: 1.5 } 
        },
        { 
            id: 'monday_2', 
            type: 'bad', 
            text: '周一综合症，效率减半', 
            buff: '', 
            debuff: '所有收益-20%', 
            advice: '周一嘛，慢慢进入状态。', 
            icon: '😫',
            multiplier: { sanityMultiplier: 0.8, stressMultiplier: 1.2, moneyMultiplier: 0.8 } 
        },
        { 
            id: 'monday_3', 
            type: 'good', 
            text: '新的一周，元气满满！', 
            buff: '所有收益+10%', 
            debuff: '', 
            advice: '新的一周，新的开始！', 
            icon: '💪',
            multiplier: { sanityMultiplier: 1.1, stressMultiplier: 0.9, moneyMultiplier: 1.1 } 
        },
        { 
            id: 'monday_4', 
            type: 'good', 
            text: '周一宜摸鱼，忌开会', 
            buff: '摸鱼收益+30%', 
            debuff: '', 
            advice: '周一摸鱼，一周轻松！', 
            icon: '🐟',
            multiplier: { slackBonus: 1.3 } 
        },
        { 
            id: 'monday_5', 
            type: 'neutral', 
            text: '周一正常开工', 
            buff: '', 
            debuff: '', 
            advice: '正常上班，正常摸鱼。', 
            icon: '📅',
            multiplier: {} 
        }
    ],
    
    // 周二运势
    '周二': [
        { 
            id: 'tuesday_1', 
            type: 'good', 
            text: '周二进入状态，效率提升', 
            buff: '工作收益+20%', 
            debuff: '', 
            advice: '周二状态不错，好好表现！', 
            icon: '⚡',
            multiplier: { moneyMultiplier: 1.2 } 
        },
        { 
            id: 'tuesday_2', 
            type: 'bad', 
            text: '周二综合征，不上不下', 
            buff: '', 
            debuff: '压力+10%', 
            advice: '周二最难熬，坚持住！', 
            icon: '😐',
            multiplier: { stressMultiplier: 1.1 } 
        },
        { 
            id: 'tuesday_3', 
            type: 'good', 
            text: '周二适合表现自己', 
            buff: '金钱收益+20%', 
            debuff: '', 
            advice: '好好表现，加薪有望！', 
            icon: '💰',
            multiplier: { moneyMultiplier: 1.2 } 
        },
        { 
            id: 'tuesday_4', 
            type: 'neutral', 
            text: '周二平淡如水', 
            buff: '', 
            debuff: '', 
            advice: '普通的一天，正常发挥。', 
            icon: '📅',
            multiplier: {} 
        }
    ],
    
    // 周三运势
    '周三': [
        { 
            id: 'wednesday_1', 
            type: 'good', 
            text: '周三小周末，可以划水', 
            buff: '摸鱼收益+30%', 
            debuff: '', 
            advice: '周三小周末，摸鱼无罪！', 
            icon: '🐟',
            multiplier: { slackBonus: 1.3 } 
        },
        { 
            id: 'wednesday_2', 
            type: 'good', 
            text: '一周过半，坚持住', 
            buff: '压力减少+20%', 
            debuff: '', 
            advice: '已经过半了，加油！', 
            icon: '💪',
            multiplier: { stressMultiplier: 0.8 } 
        },
        { 
            id: 'wednesday_3', 
            type: 'bad', 
            text: '周三容易犯困', 
            buff: '', 
            debuff: '理智-10%', 
            advice: '多喝咖啡提神！', 
            icon: '😴',
            multiplier: { sanityMultiplier: 0.9 } 
        },
        { 
            id: 'wednesday_4', 
            type: 'neutral', 
            text: '周三不上不下', 
            buff: '', 
            debuff: '', 
            advice: '普通的一天，继续努力。', 
            icon: '📅',
            multiplier: {} 
        }
    ],
    
    // 周四运势
    '周四': [
        { 
            id: 'thursday_1', 
            type: 'good', 
            text: '周四离周五不远了', 
            buff: '压力减少+15%', 
            debuff: '', 
            advice: '快到周五了，坚持住！', 
            icon: '🎯',
            multiplier: { stressMultiplier: 0.85 } 
        },
        { 
            id: 'thursday_2', 
            type: 'bad', 
            text: '周四开会最多的一天', 
            buff: '', 
            debuff: '会议压力+30%', 
            advice: '今天会议多，注意摸鱼技巧。', 
            icon: '📊',
            multiplier: { stressMultiplier: 1.3 } 
        },
        { 
            id: 'thursday_3', 
            type: 'good', 
            text: '周四适合摸鱼等周五', 
            buff: '摸鱼收益+20%', 
            debuff: '', 
            advice: '周五快到了，提前庆祝！', 
            icon: '🐟',
            multiplier: { slackBonus: 1.2 } 
        },
        { 
            id: 'thursday_4', 
            type: 'neutral', 
            text: '周四正常推进', 
            buff: '', 
            debuff: '', 
            advice: '正常工作，正常摸鱼。', 
            icon: '📅',
            multiplier: {} 
        }
    ],
    
    // 周五运势
    '周五': [
        { 
            id: 'friday_1', 
            type: 'good', 
            text: '周五了，摸鱼无罪！', 
            buff: '所有收益+30%', 
            debuff: '', 
            advice: '周五了，该放松就放松！', 
            icon: '🎉',
            multiplier: { sanityMultiplier: 1.3, stressMultiplier: 0.7, moneyMultiplier: 1.3 } 
        },
        { 
            id: 'friday_2', 
            type: 'good', 
            text: '周五下午，无心工作', 
            buff: '摸鱼收益+50%', 
            debuff: '', 
            advice: '周五下午，心已经飞了！', 
            icon: '🐟',
            multiplier: { slackBonus: 1.5 } 
        },
        { 
            id: 'friday_3', 
            type: 'bad', 
            text: '黑色星期五，小心加班', 
            buff: '', 
            debuff: '加班概率+30%', 
            advice: '小心周五加班，提前跑路！', 
            icon: '🌙',
            multiplier: { stressMultiplier: 1.3 } 
        },
        { 
            id: 'friday_4', 
            type: 'good', 
            text: '周五快乐！', 
            buff: '压力-20%', 
            debuff: '', 
            advice: '周五快乐，周末在招手！', 
            icon: '😊',
            multiplier: { stressMultiplier: 0.8 } 
        }
    ],
    
    // 周六运势
    '周六': [
        { 
            id: 'saturday_1', 
            type: 'good', 
            text: '周六还在加班？辛苦了', 
            buff: '加班收益+50%', 
            debuff: '', 
            advice: '周六加班，记得申请加班费！', 
            icon: '💪',
            multiplier: { moneyMultiplier: 1.5 } 
        },
        { 
            id: 'saturday_2', 
            type: 'good', 
            text: '周六适合休息', 
            buff: '压力自动-20', 
            debuff: '', 
            advice: '周六就该休息，别太拼！', 
            icon: '😴',
            multiplier: { instantStress: -20 } 
        },
        { 
            id: 'saturday_3', 
            type: 'good', 
            text: '周六出去玩！', 
            buff: '心情+50', 
            debuff: '', 
            advice: '周末愉快，尽情享受！', 
            icon: '🎉',
            multiplier: { instantSanity: 50 } 
        },
        { 
            id: 'saturday_4', 
            type: 'neutral', 
            text: '周六躺平日', 
            buff: '', 
            debuff: '', 
            advice: '躺平也是休息的一种！', 
            icon: '📅',
            multiplier: {} 
        }
    ],
    
    // 周日运势
    '周日': [
        { 
            id: 'sunday_1', 
            type: 'bad', 
            text: '周日晚上，周一恐惧症', 
            buff: '', 
            debuff: '周一压力+30%', 
            advice: '周日晚上，开始焦虑了...', 
            icon: '😨',
            multiplier: { stressMultiplier: 1.3 } 
        },
        { 
            id: 'sunday_2', 
            type: 'good', 
            text: '周日适合调整心态', 
            buff: '初始压力-10', 
            debuff: '', 
            advice: '调整心态，迎接新的一周！', 
            icon: '🧘',
            multiplier: { instantStress: -10 } 
        },
        { 
            id: 'sunday_3', 
            type: 'good', 
            text: '周日休息日', 
            buff: '压力-10', 
            debuff: '', 
            advice: '好好休息，明天又是周一！', 
            icon: '😴',
            multiplier: { stressMultiplier: 0.9 } 
        },
        { 
            id: 'sunday_4', 
            type: 'neutral', 
            text: '周日充电日', 
            buff: '', 
            debuff: '', 
            advice: '充电完毕，准备战斗！', 
            icon: '📅',
            multiplier: {} 
        }
    ]
};

// 兼容旧版导出（保持向后兼容）
export const fortunes = Object.values(specialDateFortunes).concat(
    ...Object.values(weekdayFortunes)
);
