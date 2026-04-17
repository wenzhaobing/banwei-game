/**
 * 运势数据
 * 包含好运、坏运、普通三种类型
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
