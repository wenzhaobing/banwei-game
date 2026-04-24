/**
 * 动态拼凑式结局系统
 * 结局类型（固定5种）+ 数值区间（决定描述片段）+ 人格标签（决定总结）= 独一无二的结局文案
 */
import { resetGameState } from './game.js';
import { saveGame } from './storage.js';
import { showToast } from './ui.js';
import { 
    sanityFragments, 
    stressFragments, 
    moneyFragments, 
    endingFragments, 
    defaultEnding 
} from './data/endings.js';

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

    // 片段库（从数据文件导入）
    getFragments() {
        return {
            sanity: sanityFragments[this.sanityLevel],
            stress: stressFragments[this.stressLevel],
            money: moneyFragments[this.moneyLevel]
        };
    }

    // 结局专属片段（每个结局3种变体）
    getEndingSpecific() {
        const ending = endingFragments[this.ending];
        if (!ending) {
            // 默认结局
            return {
                ...defaultEnding,
                variantDesc: defaultEnding.variants[0],
                variantSummary: defaultEnding.summaries[0]
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
                <button class="ending-btn ending-btn-primary" id="endingRestartBtn">🔄 重新开始</button>
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

    // 检测是否在微信内置浏览器中
    function isWechatBrowser() {
        const ua = navigator.userAgent.toLowerCase();
        return ua.includes('micromessenger');
    }

    // 分享按钮
    document.getElementById('endingShareBtn').onclick = async () => {
        const shareText = `今天不想上班？来测测你的打工命运，看你能活几轮！我打出了【${endingInfo.title}】结局！\n${tags}\n${description}`;
        const fullText = `${shareText}\n${location.href}`;
        
        // 微信内置浏览器：直接使用复制链接方式
        if (isWechatBrowser()) {
            await fallbackToClipboard(fullText, true);
            return;
        }
        
        // 非微信环境：尝试使用 Web Share API
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '今天不想上班',
                    text: shareText,
                    url: location.href
                });
                showToast('分享成功！', '✅');
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('用户取消了分享');
                } else {
                    console.error('分享失败:', error);
                    await fallbackToClipboard(fullText);
                }
            }
        } else {
            await fallbackToClipboard(fullText);
        }
    };

    // 剪贴板降级方案
    async function fallbackToClipboard(text, isWechat = false) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                // 微信环境显示特殊提示
                if (isWechat) {
                    showToast('链接已复制！点击右上角 ⋯ 分享给好友', '📋');
                } else {
                    showToast('结局已复制到剪贴板！', '📋');
                }
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        if (isWechat) {
                            showToast('链接已复制！点击右上角 ⋯ 分享给好友', '📋');
                        } else {
                            showToast('结局已复制到剪贴板！', '📋');
                        }
                    } else {
                        showToast('复制失败，请手动复制', '❌');
                    }
                } catch (err) {
                    console.error('复制失败:', err);
                    showToast('复制失败，请手动复制', '❌');
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        } catch (error) {
            console.error('剪贴板操作失败:', error);
            showToast('分享失败，请手动复制', '❌');
        }
    }

    // 显示结局提示
    showToast(`结局：${endingInfo.title}`, endingInfo.icon);
}

/**
 * 设置游戏状态（供外部调用，在结局前设置）
 * @param {object} state - 游戏状态
 * @param {number} rounds - 总轮数
 */
export function setEndingContext(state, rounds) {
    // 深拷贝状态，避免后续修改影响结局显示
    window._gameStateForEnding = { ...state };
    window._totalRounds = rounds;
}
