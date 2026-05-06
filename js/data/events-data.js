/**
 * 游戏事件数据
 * 每个事件有专属选项池（5-8个选项），每次随机抽取3个不重复选项
 */

// 批量检查所有事件
function validateAllEvents(events) {
    const issues = [];
    
    events.forEach(event => {
        const types = event.options.map(opt => getOptionType(opt));
        const hasPositive = types.includes('positive');
        const hasNegative = types.includes('negative');
        
        if (!hasPositive) {
            issues.push(`${event.id}: 缺少正面选项`);
        }
        if (!hasNegative) {
            issues.push(`${event.id}: 缺少负面选项`);
        }
    });
    
    if (issues.length > 0) {
        console.warn('事件配置问题：', issues);
        return false;
    }
    console.log('✅ 所有事件配置合格');
    return true;
}

export const events = [
    // ========== 1. 老板类（4个事件）==========
    {
        id: "boss_1",
        title: "👔 老板来了",
        desc: "老板突然出现在你身后...",
        optionPool: [
            { text: "假装写代码 💻", effects: { sanity: -20, stress: 10, money: 100 }, feedback: "老板满意地走了", tags: ["work"] },
            { text: "回头对视 👀", effects: { sanity: -40, stress: 20, money: 0 }, feedback: "尴尬对视3秒，你赢了", tags: [] },
            { text: "装死 😵", effects: { sanity: -60, stress: 40, money: -200 }, feedback: "老板叫了救护车...", tags: ["backstab"] },
            { text: "递上一杯咖啡 ☕", effects: { sanity: 10, stress: -20, money: -40 }, feedback: "老板愣了一下", tags: ["social"] },
            { text: "主动汇报工作 📊", effects: { sanity: -30, stress: 16, money: 120 }, feedback: "老板点头赞许", tags: ["work"] },
            { text: "假装接电话 📞", effects: { sanity: 0, stress: -10, money: 0 }, feedback: "成功逃脱", tags: ["slack_off"] },
            { text: "夸老板领带好看 👔", effects: { sanity: 10, stress: -16, money: 0 }, feedback: "老板心情变好", tags: ["social"] },
            { text: "说身体不舒服 🤒", effects: { sanity: 0, stress: -20, money: 0 }, feedback: "老板让你早点回去", tags: [] }
        ]
    },
    {
        id: "boss_2",
        title: "👔 老板突然发消息",
        desc: "晚上11点，老板在群里@了你...",
        optionPool: [
            { text: "秒回'收到' ✅", effects: { sanity: -20, stress: 20, money: 100 }, feedback: "老板说'辛苦了'", tags: ["overtime"] },
            { text: "假装睡着了 😴", effects: { sanity: 20, stress: -10, money: 0 }, feedback: "第二天说手机没电", tags: ["slack_off"] },
            { text: "反问'你也是？' 🤨", effects: { sanity: 40, stress: -30, money: -160 }, feedback: "老板已读不回", tags: ["backstab"] },
            { text: "直接忽略 📵", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "明天再说", tags: ["slack_off"] },
            { text: "打电话过去 📞", effects: { sanity: -30, stress: 30, money: 60 }, feedback: "老板只是确认事情", tags: ["work"] },
            { text: "发个表情包 😅", effects: { sanity: 0, stress: -10, money: 0 }, feedback: "老板没回复", tags: [] }
        ]
    },
    {
        id: "boss_3",
        title: "🎂 老板生日",
        desc: "同事们在张罗给老板过生日...",
        optionPool: [
            { text: "众筹买礼物 🎁", effects: { sanity: 0, stress: -20, money: -100 }, feedback: "你出了一份钱", tags: ["social"] },
            { text: "写贺卡敷衍 ✉️", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "写了'生日快乐'四个字", tags: [] },
            { text: "送了一箱辣条 🌶️", effects: { sanity: 30, stress: -40, money: -60 }, feedback: "老板：'进口零食？'", tags: ["slack_off"] },
            { text: "假装不知道 🙈", effects: { sanity: 0, stress: 10, money: 0 }, feedback: "躲过一劫", tags: [] },
            { text: "主动组织 🎉", effects: { sanity: -20, stress: 10, money: -160 }, feedback: "老板很开心", tags: ["work"] }
        ]
    },
    {
        id: "boss_4",
        title: "📧 收到全员邮件",
        desc: "公司宣布要'降本增效'，大家都慌了...",
        optionPool: [
            { text: "疯狂投简历 📄", effects: { sanity: -30, stress: 40, money: 0 }, feedback: "发现简历毫无亮点", tags: [] },
            { text: "摸鱼等裁员 🐟", effects: { sanity: 20, stress: -40, money: 0 }, feedback: "开始每天准时下班", tags: ["slack_off"] },
            { text: "主动找老板表忠心 💪", effects: { sanity: -40, stress: 30, money: 60 }, feedback: "老板：'你是个好员工'", tags: ["work"] },
            { text: "和同事讨论 😨", effects: { sanity: -10, stress: 10, money: 0 }, feedback: "越聊越慌", tags: ["social"] },
            { text: "假装没看见 🙈", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "该干嘛干嘛", tags: ["slack_off"] },
            { text: "趁机要求加薪 💰", effects: { sanity: 20, stress: -30, money: 200 }, feedback: "老板说考虑一下", tags: ["work"] },
            { text: "开始存钱 💵", effects: { sanity: 10, stress: -10, money: 100 }, feedback: "未雨绸缪", tags: [] },
            { text: "找HR打听消息 🕵️", effects: { sanity: -20, stress: 20, money: -50 }, feedback: "HR说'一切正常'", tags: ["social"] }
        ]
    },

    // ========== 2. 会议类（4个事件）==========
    {
        id: "meeting_1",
        title: "📊 无聊会议",
        desc: "会议室里，PPT已经放了半小时...",
        optionPool: [
            { text: "认真记笔记 ✍️", effects: { sanity: -20, stress: 10, money: 60 }, feedback: "假装很认真", tags: ["work"] },
            { text: "偷偷睡觉 😴", effects: { sanity: 40, stress: -50, money: 0 }, feedback: "醒来会议刚结束", tags: ["slack_off"] },
            { text: "提问刁难 🤔", effects: { sanity: -30, stress: 20, money: 0 }, feedback: "气氛突然尴尬", tags: ["backstab"] },
            { text: "刷手机摸鱼 📱", effects: { sanity: 20, stress: -30, money: 0 }, feedback: "没人发现", tags: ["slack_off"] },
            { text: "主动发言 🎤", effects: { sanity: -10, stress: -10, money: 40 }, feedback: "老板记住了你", tags: ["work"] },
            { text: "偷偷点外卖 🍔", effects: { sanity: 30, stress: -20, money: -80 }, feedback: "香味飘满会议室", tags: ["slack_off"] },
            { text: "被点名回答 😰", effects: { sanity: -40, stress: 30, money: 0 }, feedback: "完全不知道在讲什么", tags: [] },
            { text: "假装去厕所 🚽", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "成功逃离半小时", tags: ["slack_off"] }
        ]
    },
    {
        id: "meeting_2",
        title: "📊 季度总结大会",
        desc: "老板在台上激情演讲，PPT已经翻了50页...",
        optionPool: [
            { text: "假装记笔记 ✍️", effects: { sanity: -10, stress: -10, money: 0 }, feedback: "你在本子上画乌龟", tags: [] },
            { text: "偷偷点外卖 🍔", effects: { sanity: 30, stress: -20, money: -80 }, feedback: "全会议室都闻到了", tags: ["slack_off"] },
            { text: "举手提问刁难 🤔", effects: { sanity: -40, stress: 30, money: 0 }, feedback: "老板愣住3秒", tags: ["backstab"] },
            { text: "数PPT页数 📊", effects: { sanity: 0, stress: -10, money: 0 }, feedback: "已经100页了", tags: [] },
            { text: "偷偷刷短视频 📱", effects: { sanity: 20, stress: -30, money: 0 }, feedback: "笑出了声", tags: ["slack_off"] },
            { text: "被老板点名 😰", effects: { sanity: -50, stress: 40, money: 0 }, feedback: "完全没听刚才讲什么", tags: [] },
            { text: "认真听讲做笔记 📝", effects: { sanity: -30, stress: 20, money: 40 }, feedback: "老板表扬了你", tags: ["work"] },
            { text: "偷偷睡觉被抓 😴", effects: { sanity: -60, stress: 50, money: -100 }, feedback: "老板当众批评", tags: [] }
        ]
    },
    {
        id: "meeting_3",
        title: "💻 线上会议",
        desc: "Zoom会议开了1小时，你一直关着摄像头...",
        optionPool: [
            { text: "假装网络卡顿 📶", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "你变成了PPT", tags: ["slack_off"] },
            { text: "偷偷躺床上 🛏️", effects: { sanity: 40, stress: -40, money: 0 }, feedback: "差点打呼噜", tags: ["slack_off"] },
            { text: "不小心开了摄像头 😱", effects: { sanity: -60, stress: 50, money: -40 }, feedback: "大家看到你在吃螺蛳粉", tags: ["backstab"] },
            { text: "边开会边打游戏 🎮", effects: { sanity: 30, stress: -30, money: 0 }, feedback: "赢了游戏", tags: ["slack_off"] },
            { text: "认真做笔记 ✍️", effects: { sanity: -20, stress: 10, money: 60 }, feedback: "老板点名表扬", tags: ["work"] },
            { text: "被点名回答问题 😰", effects: { sanity: -40, stress: 30, money: 0 }, feedback: "完全没听刚才讲什么", tags: [] },
            { text: "麦克风没关被听到 🎤", effects: { sanity: -50, stress: 40, money: 0 }, feedback: "大家听到你在吐槽", tags: [] },
            { text: "主动发言展示 💪", effects: { sanity: -30, stress: 20, money: 80 }, feedback: "老板很满意", tags: ["work"] }
        ]
    },
    {
        id: "meeting_4",
        title: "👥 一对一谈话",
        desc: "HR约你聊聊职业规划...",
        optionPool: [
            { text: "画大饼 🥞", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "你说要当CEO", tags: [] },
            { text: "实话实说 💔", effects: { sanity: -20, stress: -30, money: -60 }, feedback: "你说'我想摸鱼到退休'", tags: [] },
            { text: "当场辞职 📄", effects: { sanity: 60, stress: -100, money: -400 }, feedback: "HR: '你认真的吗？'", tags: ["risk"] },
            { text: "要求加薪 💰", effects: { sanity: -30, stress: 30, money: 200 }, feedback: "HR说等通知", tags: ["work"] },
            { text: "装傻充愣 🐑", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "HR无奈", tags: [] },
            { text: "被问住答不上来 😰", effects: { sanity: -40, stress: 40, money: 0 }, feedback: "HR觉得你没规划", tags: [] },
            { text: "表现太积极被怀疑 🤨", effects: { sanity: -30, stress: 20, money: 0 }, feedback: "HR觉得你在演戏", tags: [] },
            { text: "认真准备PPT 📊", effects: { sanity: -20, stress: 10, money: 40 }, feedback: "HR印象深刻", tags: ["work"] }
        ]
    },

    // ========== 3. 加班类（2个事件）==========
    {
        id: "overtime_1",
        title: "🌙 深夜加班",
        desc: "又是加班到深夜...",
        optionPool: [
            { text: "努力干活 💪", effects: { sanity: -40, stress: 30, money: 200 }, feedback: "完成了任务", tags: ["overtime"] },
            { text: "摸鱼等下班 🐟", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "反正没人管", tags: ["slack_off"] },
            { text: "点外卖 🍱", effects: { sanity: 10, stress: -10, money: -160 }, feedback: "美食治愈一切", tags: [] },
            { text: "叫同事一起 🫂", effects: { sanity: 16, stress: -16, money: -80 }, feedback: "有人陪着加班", tags: ["social"] },
            { text: "申请加班费 💰", effects: { sanity: 10, stress: -30, money: 100 }, feedback: "HR说没有预算", tags: ["work"] },
            { text: "偷偷刷剧 📺", effects: { sanity: 24, stress: -24, money: 0 }, feedback: "一集接一集", tags: ["slack_off"] }
        ]
    },
    {
        id: "deadline_1",
        title: "📅 截止日期",
        desc: "明天就是deadline了！",
        optionPool: [
            { text: "通宵赶工 🌙", effects: { sanity: -60, stress: 40, money: 300 }, feedback: "完成了！", tags: ["overtime"] },
            { text: "请求延期 📅", effects: { sanity: -20, stress: 30, money: -100 }, feedback: "老板不太高兴", tags: ["work"] },
            { text: "糊弄过去 😅", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "居然通过了", tags: ["slack_off"] },
            { text: "求助同事 🤝", effects: { sanity: 0, stress: -30, money: -160 }, feedback: "同事帮了你", tags: ["social"] },
            { text: "装病请假 🤒", effects: { sanity: 20, stress: -40, money: 0 }, feedback: "成功逃脱", tags: ["slack_off"] }
        ]
    },

    // ========== 4. 同事类（4个事件）==========
    {
        id: "colleague_1",
        title: "👥 同事八卦",
        desc: "听到同事在讨论工资...",
        optionPool: [
            { text: "一起吐槽 😈", effects: { sanity: 30, stress: -30, money: 0 }, feedback: "爽！说出了心里话", tags: ["slack_off"] },
            { text: "默默走开 🚶", effects: { sanity: -10, stress: -10, money: 0 }, feedback: "装作什么都没听见", tags: [] },
            { text: "偷偷录音 🎙️", effects: { sanity: -40, stress: 20, money: -200 }, feedback: "被同事发现了", tags: ["backstab"] },
            { text: "加入聊天 💬", effects: { sanity: 16, stress: -16, money: 0 }, feedback: "聊得挺开心", tags: ["social"] },
            { text: "请客吃饭 🍜", effects: { sanity: 24, stress: -24, money: -160 }, feedback: "关系更近了", tags: ["social"] },
            { text: "被老板发现 😱", effects: { sanity: -50, stress: 40, money: -100 }, feedback: "老板说'工作时间不聊天'", tags: [] },
            { text: "打小报告 📝", effects: { sanity: -30, stress: 30, money: 50 }, feedback: "老板记住了你", tags: ["backstab"] },
            { text: "假装没听见 🙈", effects: { sanity: 0, stress: 10, money: 0 }, feedback: "同事觉得你高冷", tags: [] }
        ]
    },
    {
        id: "colleague_2",
        title: "👥 同事八卦时间",
        desc: "茶水间里，同事在讲老板的坏话...",
        optionPool: [
            { text: "一起吐槽 😈", effects: { sanity: 30, stress: -30, money: 0 }, feedback: "爽！说出了心里话", tags: ["slack_off"] },
            { text: "默默走开 🚶", effects: { sanity: -10, stress: -10, money: 0 }, feedback: "装作什么都没听见", tags: [] },
            { text: "偷偷录音 🎙️", effects: { sanity: -40, stress: 20, money: -200 }, feedback: "被同事发现了", tags: ["backstab"] },
            { text: "提醒隔墙有耳 👂", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "大家赶紧散开", tags: ["social"] },
            { text: "加入讨论 💬", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "聊得很投入", tags: ["social"] },
            { text: "被老板撞见 😱", effects: { sanity: -60, stress: 50, money: -200 }, feedback: "老板听到了所有内容", tags: [] },
            { text: "告密邀功 📝", effects: { sanity: -20, stress: 30, money: 100 }, feedback: "老板表扬了你", tags: ["backstab"] },
            { text: "假装没听见 🙈", effects: { sanity: 0, stress: 10, money: 0 }, feedback: "同事觉得你高冷", tags: [] }
        ]
    },
    {
        id: "colleague_3",
        title: "🍱 午饭时间",
        desc: "同事叫你一起吃饭，但你想一个人...",
        optionPool: [
            { text: "爽快答应 🍜", effects: { sanity: 10, stress: -20, money: -60 }, feedback: "AA制花了30块", tags: ["social"] },
            { text: "找借口拒绝 🙅", effects: { sanity: 0, stress: 10, money: 0 }, feedback: "同事觉得你高冷", tags: [] },
            { text: "说'我减肥' 🏃", effects: { sanity: 20, stress: -10, money: 40 }, feedback: "同事: '你都瘦成闪电了'", tags: ["slack_off"] },
            { text: "点外卖自己吃 🍔", effects: { sanity: 16, stress: -16, money: -80 }, feedback: "清净", tags: [] },
            { text: "带便当 🍱", effects: { sanity: 10, stress: -10, money: 20 }, feedback: "同事羡慕", tags: [] }
        ]
    },
    {
        id: "colleague_4",
        title: "🎉 团建通知",
        desc: "HR发了团建通知：周末去爬山...",
        optionPool: [
            { text: "欣然接受 🏔️", effects: { sanity: -20, stress: 30, money: 0 }, feedback: "心里在流泪", tags: [] },
            { text: "假装家里有事 🏠", effects: { sanity: 20, stress: -20, money: -100 }, feedback: "在家打游戏", tags: ["slack_off"] },
            { text: "建议改剧本杀 🎭", effects: { sanity: 30, stress: -30, money: -160 }, feedback: "大家玩嗨了", tags: ["social"] },
            { text: "请病假 🤒", effects: { sanity: 10, stress: -30, money: 0 }, feedback: "成功逃脱", tags: ["slack_off"] },
            { text: "积极组织 🎉", effects: { sanity: -30, stress: 20, money: 100 }, feedback: "HR表扬了你", tags: ["work"] },
            { text: "被强制参加 😤", effects: { sanity: -40, stress: 40, money: 0 }, feedback: "HR说'不去扣绩效'", tags: [] },
            { text: "爬山受伤 🤕", effects: { sanity: -50, stress: 30, money: -200 }, feedback: "脚扭了", tags: [] },
            { text: "团建表现太差 😓", effects: { sanity: -30, stress: 20, money: 0 }, feedback: "同事觉得你不合群", tags: [] }
        ]
    },

    // ========== 5. 办公环境类（5个事件）==========
    {
        id: "office_1",
        title: "❄️ 空调太冷了",
        desc: "中央空调开到了16度，你瑟瑟发抖...",
        optionPool: [
            { text: "默默穿上外套 🧥", effects: { sanity: 0, stress: -10, money: 0 }, feedback: "像一只企鹅", tags: [] },
            { text: "去调空调温度 🌡️", effects: { sanity: 10, stress: 20, money: 0 }, feedback: "同事又调回去了", tags: ["backstab"] },
            { text: "带了个暖水袋 🔥", effects: { sanity: 20, stress: -20, money: -60 }, feedback: "同事都来蹭", tags: ["slack_off"] },
            { text: "投诉行政 📢", effects: { sanity: 10, stress: -30, money: 0 }, feedback: "问题解决了", tags: ["social"] },
            { text: "喝热水取暖 ☕", effects: { sanity: 6, stress: -6, money: 0 }, feedback: "有点用", tags: [] }
        ]
    },
    {
        id: "office_2",
        title: "🔊 打印机又坏了",
        desc: "你要打印重要文件，打印机卡纸了...",
        optionPool: [
            { text: "拍打打印机 👊", effects: { sanity: -20, stress: 30, money: -100 }, feedback: "打印机彻底坏了", tags: [] },
            { text: "找IT小哥 🛠️", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "IT: '重启试试'", tags: ["work"] },
            { text: "用手抄 ✍️", effects: { sanity: -30, stress: 10, money: 0 }, feedback: "手酸了，字还丑", tags: ["overtime"] },
            { text: "拍照发朋友圈 📸", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "网友都笑了", tags: ["slack_off"] },
            { text: "换一台打印机 🖨️", effects: { sanity: 0, stress: -10, money: 0 }, feedback: "搞定", tags: [] },
            { text: "被老板催 😰", effects: { sanity: -40, stress: 40, money: 0 }, feedback: "老板说'怎么还没好'", tags: [] },
            { text: "弄坏打印机赔钱 💸", effects: { sanity: -30, stress: 20, money: -300 }, feedback: "行政让你赔偿", tags: [] },
            { text: "紧急去打印店 🏃", effects: { sanity: -20, stress: 10, money: -50 }, feedback: "花了50块", tags: [] }
        ]
    },
    {
        id: "office_3",
        title: "☕ 咖啡机坏了",
        desc: "唯一的咖啡机坏了，整个部门都疯了...",
        optionPool: [
            { text: "泡速溶咖啡 ☕", effects: { sanity: -10, stress: 10, money: 0 }, feedback: "难喝，但能续命", tags: ["coffee"] },
            { text: "叫外卖咖啡 🚚", effects: { sanity: 20, stress: -20, money: -80 }, feedback: "帮同事带了5杯", tags: ["coffee"] },
            { text: "建议喝白开水 💧", effects: { sanity: -40, stress: 30, money: 0 }, feedback: "被同事集体白眼", tags: [] },
            { text: "自己修 🔧", effects: { sanity: -20, stress: 10, money: 40 }, feedback: "居然修好了", tags: ["work"] },
            { text: "去楼下买 ☕", effects: { sanity: 10, stress: -20, money: -50 }, feedback: "顺便摸鱼", tags: ["slack_off"] },
            { text: "趁机请同事喝咖啡 🎁", effects: { sanity: 30, stress: -30, money: -200 }, feedback: "同事关系变好了", tags: ["social"] },
            { text: "喝奶茶代替 🧋", effects: { sanity: 20, stress: -20, money: -60 }, feedback: "发现奶茶更好喝", tags: [] },
            { text: "戒咖啡一天 🚫", effects: { sanity: -30, stress: 20, money: 50 }, feedback: "省了钱，但头疼", tags: [] }
        ]
    },
    {
        id: "printer_1",
        title: "🖨️ 打印机又坏了",
        desc: "重要文件打不出来，客户在等...",
        optionPool: [
            { text: "暴力拍打 👊", effects: { sanity: -30, stress: 30, money: -200 }, feedback: "彻底报废", tags: [] },
            { text: "找IT紧急维修 🛠️", effects: { sanity: -10, stress: -20, money: 60 }, feedback: "IT小哥飞速赶来", tags: ["work"] },
            { text: "去隔壁借打印机 🏃", effects: { sanity: 0, stress: -10, money: 0 }, feedback: "隔壁同事帮了你", tags: ["social"] },
            { text: "电子版发送 📧", effects: { sanity: 10, stress: -30, money: 0 }, feedback: "客户接受", tags: ["slack_off"] },
            { text: "甩锅给行政 🎯", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "成功甩锅", tags: ["backstab"] }
        ]
    },
    {
        id: "system_1",
        title: "💻 系统崩溃",
        desc: "电脑突然蓝屏了，文件没保存...",
        optionPool: [
            { text: "重启电脑 🔄", effects: { sanity: -20, stress: 20, money: 0 }, feedback: "文件没了", tags: [] },
            { text: "找IT支援 🛠️", effects: { sanity: 10, stress: -30, money: 0 }, feedback: "IT恢复了文件", tags: ["work"] },
            { text: "趁机摸鱼 🐟", effects: { sanity: 30, stress: -30, money: 0 }, feedback: "反正也干不了活", tags: ["slack_off"] },
            { text: "骂骂咧咧 😤", effects: { sanity: -20, stress: 10, money: 0 }, feedback: "同事都听到了", tags: [] },
            { text: "重写文件 ✍️", effects: { sanity: -40, stress: 30, money: 100 }, feedback: "写得比原来好", tags: ["overtime"] },
            { text: "用备用电脑 💻", effects: { sanity: 0, stress: -10, money: 0 }, feedback: "幸好有备份", tags: [] },
            { text: "趁机休息一下 ☕", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "难得清闲", tags: ["slack_off"] },
            { text: "文件自动恢复 ✨", effects: { sanity: 30, stress: -20, money: 0 }, feedback: "运气爆棚", tags: [] }
        ]
    },

    // ========== 6. 自我状态类（5个事件）==========
    {
        id: "self_1",
        title: "😴 昨晚没睡好",
        desc: "凌晨3点才睡，现在眼睛都睁不开...",
        optionPool: [
            { text: "喝咖啡续命 ☕", effects: { sanity: 20, stress: -20, money: -60 }, feedback: "活过来了", tags: ["coffee"] },
            { text: "去洗手间睡10分钟 🚽", effects: { sanity: 20, stress: -30, money: 0 }, feedback: "醒来精神了", tags: ["slack_off"] },
            { text: "硬撑到下班 💪", effects: { sanity: -30, stress: 30, money: 100 }, feedback: "效率很低", tags: ["overtime"] },
            { text: "点一杯奶茶 🧋", effects: { sanity: 24, stress: -16, money: -50 }, feedback: "甜食治愈", tags: [] },
            { text: "做几个拉伸 🧘", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "身体舒服多了", tags: ["self_care"] },
            { text: "听音乐放松 🎧", effects: { sanity: 16, stress: -24, money: 0 }, feedback: "心情变好", tags: ["slack_off"] }
        ]
    },
    {
        id: "self_2",
        title: "📱 手机没电了",
        desc: "还有3小时下班，手机只剩10%电量...",
        optionPool: [
            { text: "借充电宝 🔋", effects: { sanity: 10, stress: -10, money: -40 }, feedback: "扫码租了一个", tags: [] },
            { text: "开启省电模式 🔋", effects: { sanity: 0, stress: 20, money: 0 }, feedback: "煎熬，不敢玩手机", tags: [] },
            { text: "去前台蹭充电 🔌", effects: { sanity: 20, stress: -30, money: 0 }, feedback: "顺便和前台聊天", tags: ["slack_off"] },
            { text: "借同事充电器 🔌", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "同事借你了", tags: ["social"] },
            { text: "不用手机 📵", effects: { sanity: -20, stress: 20, money: 0 }, feedback: "专心工作", tags: ["work"] }
        ]
    },
    {
        id: "self_3",
        title: "🧠 脑子一片空白",
        desc: "想不起刚才要做什么，感觉失忆了...",
        optionPool: [
            { text: "疯狂回忆 🤔", effects: { sanity: -20, stress: 20, money: 0 }, feedback: "越想越想不起来", tags: [] },
            { text: "放弃思考 🛌", effects: { sanity: 10, stress: -30, money: 0 }, feedback: "刷了半小时手机", tags: ["slack_off"] },
            { text: "写备忘录 📝", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "记了一堆废话", tags: [] },
            { text: "问同事 🗣️", effects: { sanity: 0, stress: -10, money: 0 }, feedback: "同事提醒了你", tags: ["social"] },
            { text: "先做别的 🔄", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "做着做着就想起来了", tags: ["work"] }
        ]
    },
    {
        id: "training_1",
        title: "📚 培训课程",
        desc: "公司安排了一场培训，要占用下班时间...",
        optionPool: [
            { text: "认真听课 📖", effects: { sanity: -10, stress: -10, money: 60 }, feedback: "学到了新知识", tags: ["self_care"] },
            { text: "偷偷刷手机 📱", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "没人发现", tags: ["slack_off"] },
            { text: "假装有事请假 📞", effects: { sanity: 10, stress: -30, money: -100 }, feedback: "成功逃脱", tags: ["slack_off"] },
            { text: "积极互动 🎤", effects: { sanity: -20, stress: 10, money: 40 }, feedback: "讲师记住了你", tags: ["work"] },
            { text: "睡觉 😴", effects: { sanity: 30, stress: -30, money: 0 }, feedback: "醒来培训结束了", tags: ["slack_off"] }
        ]
    },
    {
        id: "workfromhome_1",
        title: "🏠 居家办公",
        desc: "今天可以在家办公...",
        optionPool: [
            { text: "认真工作 💪", effects: { sanity: -10, stress: 10, money: 100 }, feedback: "效率很高", tags: ["work"] },
            { text: "躺平摸鱼 🐟", effects: { sanity: 30, stress: -30, money: 0 }, feedback: "舒服", tags: ["slack_off"] },
            { text: "假装掉线 📶", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "没人发现", tags: ["slack_off"] },
            { text: "边看电视边工作 📺", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "两不误", tags: ["slack_off"] },
            { text: "提前下班 🏃", effects: { sanity: 40, stress: -40, money: 0 }, feedback: "没人知道", tags: ["slack_off"] }
        ]
    },

    // ========== 7. 日常类（6个事件）==========
    {
        id: "slack_1",
        title: "📱 偷偷摸鱼",
        desc: "老板去开会了，你掏出手机...",
        optionPool: [
            { text: "刷短视频 😂", effects: { sanity: 10, stress: -20, money: 0 }, feedback: "太好笑了", tags: ["slack_off"] },
            { text: "打游戏 🎮", effects: { sanity: 20, stress: -30, money: -100 }, feedback: "游戏输了", tags: ["slack_off"] },
            { text: "看小说 📚", effects: { sanity: 16, stress: -16, money: 0 }, feedback: "剧情精彩", tags: ["slack_off"] },
            { text: "刷淘宝 🛍️", effects: { sanity: 10, stress: -10, money: -60 }, feedback: "又下单了", tags: ["slack_off"] },
            { text: "睡午觉 😴", effects: { sanity: 30, stress: -40, money: 0 }, feedback: "精神百倍", tags: ["slack_off"] },
            { text: "偷偷点外卖 🍔", effects: { sanity: 24, stress: -24, money: -80 }, feedback: "美食治愈", tags: ["slack_off"] },
            { text: "看直播 📺", effects: { sanity: 14, stress: -20, money: 0 }, feedback: "主播太搞笑了", tags: ["slack_off"] },
            { text: "假装工作 💼", effects: { sanity: -10, stress: -10, money: 40 }, feedback: "机智切屏", tags: ["work"] }
        ]
    },
    {
        id: "coffee_1",
        title: "☕ 咖啡时间",
        desc: "去茶水间接咖啡，遇到同事",
        optionPool: [
            { text: "正常聊天 💬", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "聊得挺开心", tags: ["social"] },
            { text: "疯狂续杯 🔄", effects: { sanity: 30, stress: -40, money: -60 }, feedback: "咖啡因上头", tags: ["coffee"] },
            { text: "给老板带一杯 🎁", effects: { sanity: -10, stress: -30, money: -120 }, feedback: "老板记住你了", tags: [] },
            { text: "边喝边摸鱼 🐟", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "摸鱼时间", tags: ["slack_off"] },
            { text: "吐槽工作 😤", effects: { sanity: 16, stress: -24, money: 0 }, feedback: "同事深有同感", tags: ["social"] }
        ]
    },
    {
        id: "lunch_1",
        title: "🍜 午餐时间",
        desc: "中午吃什么世纪难题...",
        optionPool: [
            { text: "食堂解决 🍚", effects: { sanity: 0, stress: -10, money: -40 }, feedback: "凑合吃", tags: [] },
            { text: "叫外卖 🍔", effects: { sanity: 10, stress: -20, money: -80 }, feedback: "还不错", tags: [] },
            { text: "出去吃 🚶", effects: { sanity: 20, stress: -30, money: -120 }, feedback: "顺便散步", tags: ["slack_off"] },
            { text: "不吃减肥 🏃", effects: { sanity: -20, stress: 20, money: 0 }, feedback: "下午饿了", tags: [] },
            { text: "带便当 🍱", effects: { sanity: 10, stress: -10, money: 20 }, feedback: "省钱又健康", tags: [] }
        ]
    },
    {
        id: "birthday_1",
        title: "🎂 同事生日",
        desc: "又有人过生日了...",
        optionPool: [
            { text: "送祝福 🎉", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "同事很开心", tags: ["social"] },
            { text: "凑份子买蛋糕 🎂", effects: { sanity: 10, stress: -20, money: -60 }, feedback: "蛋糕很好吃", tags: ["social"] },
            { text: "假装不知道 🙈", effects: { sanity: 0, stress: 10, money: 0 }, feedback: "躲过一劫", tags: [] },
            { text: "送个礼物 🎁", effects: { sanity: 16, stress: -16, money: -100 }, feedback: "同事很感动", tags: ["social"] },
            { text: "带头起哄 🎉", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "气氛很嗨", tags: ["social"] }
        ]
    },
    {
        id: "bonus_1",
        title: "💵 发奖金了",
        desc: "季度奖金到账！",
        optionPool: [
            { text: "存起来 💰", effects: { sanity: 10, stress: -10, money: 200 }, feedback: "理财达人", tags: [] },
            { text: "请同事吃饭 🍜", effects: { sanity: 30, stress: -30, money: -160 }, feedback: "大家都很开心", tags: ["social"] },
            { text: "买心仪已久的东西 🛍️", effects: { sanity: 40, stress: -40, money: -400 }, feedback: "终于买了", tags: [] },
            { text: "还信用卡 💳", effects: { sanity: -10, stress: 10, money: 100 }, feedback: "还了一部分", tags: [] },
            { text: "投资理财 📈", effects: { sanity: -20, stress: 20, money: 0 }, feedback: "希望能赚", tags: [] }
        ]
    },
    {
        id: "crazy_1",
        title: "🐱 公司来了一只猫",
        desc: "不知道谁带的猫，在办公室到处跑...",
        optionPool: [
            { text: "撸猫 🐱", effects: { sanity: 40, stress: -50, money: 0 }, feedback: "太治愈了", tags: ["slack_off"] },
            { text: "拍照发朋友圈 📸", effects: { sanity: 20, stress: -20, money: 0 }, feedback: "获赞无数", tags: ["slack_off"] },
            { text: "找猫主人 🔍", effects: { sanity: 10, stress: -10, money: 0 }, feedback: "找到了", tags: [] },
            { text: "假装没看见 🙈", effects: { sanity: 0, stress: 0, money: 0 }, feedback: "专心工作", tags: ["work"] },
            { text: "给猫喂食 🍖", effects: { sanity: 30, stress: -30, money: -40 }, feedback: "猫很喜欢你", tags: [] }
        ]
    }
];
