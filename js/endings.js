/**
 * 动态拼凑式结局系统
 * 结局类型（固定5种）+ 数值区间（决定描述片段）+ 人格标签（决定总结）= 独一无二的结局文案
 */
import { resetGameState } from './game.js';
import { saveGame } from './storage.js';
import { showToast } from './ui.js';

/**
 * 动态结局生成器
 */
class DynamicEnding {
    constructor(gameState, endingType, totalRounds) {
        this.sanity = gameState.sanity;
        this.stress = gameState.stress;
        this.money = gameState.money;
        this.maxSanity = gameState.maxSanity;
        this.maxStress = gameState.maxStress;
        this.ending = endingType;
        this.rounds = totalRounds;

        // 计算区间
        this.sanityLevel = this.getSanityLevel();
        this.stressLevel = this.getStressLevel();
        this.moneyLevel = this.getMoneyLevel();

        // 随机种子（基于数值，保证同一局不变）
        this.seed = (this.sanity + this.stress + this.money) % 3;
    }

    getSanityLevel() {
        if (this.sanity >= 150) return 'high';
        if (this.sanity >= 50) return 'mid';
        return 'low';
    }

    getStressLevel() {
        if (this.stress >= 70) return 'high';
        if (this.stress >= 30) return 'mid';
        return 'low';
    }

    getMoneyLevel() {
        if (this.money >= 700) return 'high';
        if (this.money >= 300) return 'mid';
        return 'low';
    }

    // 片段库
    getFragments() {
        const sanityFragments = {
            high: { desc: '头脑清醒，思路清晰', summary: '你始终保持理智，没有失去自我' },
            mid: { desc: '精神状态还算正常', summary: '你的理智时高时低，但总体可控' },
            low: { desc: '脑子嗡嗡的，像装了台永动机', summary: '你的理智早已离家出走' }
        };

        const stressFragments = {
            high: { desc: '压力大到头发一把把掉', summary: '压力是你最大的敌人' },
            mid: { desc: '压力不小，但还能撑住', summary: '你学会了与压力共处' },
            low: { desc: '心态稳如老狗', summary: '你找到了释放压力的秘诀' }
        };

        const moneyFragments = {
            high: { desc: '钱包鼓鼓，底气十足', summary: '金钱给了你辞职的勇气' },
            mid: { desc: '够花但不够浪', summary: '你对金钱有清醒的认知' },
            low: { desc: '泡面是唯一的朋友', summary: '贫穷限制了你的想象力' }
        };

        return {
            sanity: sanityFragments[this.sanityLevel],
            stress: stressFragments[this.stressLevel],
            money: moneyFragments[this.moneyLevel]
        };
    }

    // 结局专属片段（每个结局3种变体）
    getEndingSpecific() {
        const endings = {
            money_zero: {
                name: '吃土少年',
                icon: '🍜',
                variants: [
                    '工资到账当天就还了信用卡、花呗、白条。看着余额0.00，你陷入了沉思。',
                    '同事叫你一起吃饭，你说「我减肥」。其实你只是没钱了，回家煮了包泡面。',
                    '你打开外卖软件，筛选了半小时，最后默默关掉了页面。'
                ],
                summaries: [
                    '最终，你的钱包比脸还干净，只能回家啃老。',
                    '最终，你学会了用花呗还花呗，成为了时间管理大师。',
                    '最终，你的存款和你的头发一样，都所剩无几了。'
                ]
            },
            sanity_zero: {
                name: 'ICU常客',
                icon: '⚰️',
                variants: [
                    '你连续加班30天，每天只睡4小时。在第31天的凌晨，你倒在了工位上。',
                    '体检报告出来，10项异常。医生说你再这样下去要出大事。',
                    '你的发际线越来越高，黑眼圈越来越重，同事以为你化了烟熏妆。'
                ],
                summaries: [
                    '最终，你的理智被加班消耗殆尽，倒在了工位上。',
                    '最终，你成为了公司的传说——那个被救护车接走的人。',
                    '最终，你的身体先于你的梦想倒下了。'
                ]
            },
            stress_max: {
                name: '职场爆炸',
                icon: '😤',
                variants: [
                    '老板又在群里@你加班，你看着第108版修改意见，终于爆发了。',
                    '你在会议上当场拍桌子，说出了憋了三年的心里话。',
                    '你把辞职信摔在老板桌上，潇洒地走出了公司大门。'
                ],
                summaries: [
                    '最终，压力让你爆发，你拍桌辞职，成为了传说中的反骨仔。',
                    '最终，你选择了自由，虽然代价是没了收入。',
                    '最终，你用一次爆发，换来了内心的平静。'
                ]
            },
            sanity_max: {
                name: '职场成神',
                icon: '🧘',
                variants: [
                    '你已经看透了一切。老板的PUA对你无效，同事的八卦你充耳不闻。',
                    '你每天准时上下班，工作高效，心态平和。同事们开始找你咨询人生。',
                    '你学会了在工位上冥想，外界的一切都与你无关。'
                ],
                summaries: [
                    '最终，你看透了一切，成为了办公室的精神导师。',
                    '最终，你找到了工作和生活的平衡，成为了人生赢家。',
                    '最终，你的境界已经超越了职场，达到了新的高度。'
                ]
            }
        };

        const ending = endings[this.ending];
        if (!ending) {
            // 默认结局
            return {
                name: '未知结局',
                icon: '❓',
                variants: ['你的职场故事告一段落...'],
                summaries: ['最终，你走出了属于自己的路。']
            };
        }

        const variantIndex = this.seed % ending.variants.length;

        return {
            ...ending,
            variantDesc: ending.variants[variantIndex],
            variantSummary: ending.summaries[variantIndex]
        };
    }

    // 生成完整描述
    generateDescription() {
        const fragments = this.getFragments();
        const ending = this.getEndingSpecific();

        // 组合描述：状态片段 + 结局片段
        const parts = [
            `你${fragments.sanity.desc}，${fragments.stress.desc}，${fragments.money.desc}。`,
            ending.variantDesc
        ];

        return parts.join(' ');
    }

    // 生成总结
    generateSummary() {
        const fragments = this.getFragments();
        const ending = this.getEndingSpecific();

        const parts = [
            fragments.sanity.summary,
            fragments.stress.summary,
            fragments.money.summary,
            ending.variantSummary
        ];

        return parts.join('。') + '。';
    }

    // 生成人格标签
    getPersonalityTags() {
        const workTag = this.moneyLevel === 'high' ? '🔥卷王' : (this.moneyLevel === 'mid' ? '⚖️打工人' : '😴躺平');
        const survivalTag = this.stressLevel === 'low' ? '🦊老油条' : (this.stressLevel === 'mid' ? '🐣新人' : '🐑老实人');
        const mentalTag = this.sanityLevel === 'high' ? '🧘佛系' : (this.sanityLevel === 'mid' ? '😌平和' : '😫焦虑');
        const moneyTag = this.moneyLevel === 'high' ? '💰土豪' : (this.moneyLevel === 'mid' ? '💵小康' : '🍜月光');

        return `${workTag} · ${survivalTag} · ${mentalTag} · ${moneyTag}`;
    }

    // 获取结局基本信息
    getEndingInfo() {
        const ending = this.getEndingSpecific();
        return {
            icon: ending.icon,
            title: ending.name
        };
    }
}

/**
 * 显示结局画面
 * @param {string} endingType - 结局类型
 * @param {function} onRestart - 重新开始回调
 */
export function showEnding(endingType, onRestart) {
    // 从全局获取游戏状态和轮数
    const state = window._gameStateForEnding || {
        sanity: 100,
        stress: 50,
        money: 500,
        maxSanity: 200,
        maxStress: 100
    };
    const rounds = window._totalRounds || 10;

    // 生成动态结局
    const dynamicEnding = new DynamicEnding(state, endingType, rounds);
    const endingInfo = dynamicEnding.getEndingInfo();
    const description = dynamicEnding.generateDescription();
    const summary = dynamicEnding.generateSummary();
    const tags = dynamicEnding.getPersonalityTags();

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'ending-overlay';
    overlay.innerHTML = `
        <div class="ending-card">
            <div class="ending-icon">${endingInfo.icon}</div>
            <div class="ending-title">结局：${endingInfo.title}</div>
            
            <div class="ending-desc">${description}</div>
            
            <div class="personality-badge">${tags}</div>
            
            <div class="personality-desc">${summary}</div>
            
            <div class="stats-summary">
                <div class="stat">💖 理智: ${state.sanity}/${state.maxSanity}</div>
                <div class="stat">😫 压力: ${state.stress}/${state.maxStress}</div>
                <div class="stat">💰 存款: ${state.money}/1000</div>
                <div class="stat">📊 共经历 ${rounds} 轮</div>
            </div>
            
            <div class="ending-buttons">
                <button class="ending-btn ending-btn-secondary" id="endingShareBtn">📤 分享</button>
                <button class="ending-btn ending-btn-primary" id="endingRestartBtn">� 重新开始</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // 重新开始按钮
    document.getElementById('endingRestartBtn').onclick = () => {
        overlay.remove();
        if (onRestart) {
            onRestart();
        } else {
            resetGameState();
            saveGame();
            location.reload();
        }
    };

    // 分享按钮
    document.getElementById('endingShareBtn').onclick = () => {
        const shareText = `今天不想上班？来测测你的打工命运！我打出了【${endingInfo.title}】结局！\n${tags}\n${description}`;
        if (navigator.share) {
            navigator.share({
                title: '今天不想上班',
                text: shareText,
                url: location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(`${shareText}\n${location.href}`).then(() => {
                showToast('结局已复制到剪贴板', '📋');
            }).catch(() => {
                showToast('分享失败', '❌');
            });
        }
    };

    // 显示结局提示
    showToast(`结局：${endingInfo.title}`, endingInfo.icon);
}

/**
 * 设置游戏状态（供外部调用，在结局前设置）
 * @param {object} state - 游戏状态
 * @param {number} rounds - 总轮数
 */
export function setEndingContext(state, rounds) {
    window._gameStateForEnding = state;
    window._totalRounds = rounds;
}
