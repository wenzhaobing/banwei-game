/**
 * 结局系统
 */
import { resetGameState } from './game.js';
import { saveGame } from './storage.js';
import { showToast } from './ui.js';

/**
 * 结局数据
 */
const endings = {
    // 理智归零 - ICU常客
    sanity_zero: {
        icon: "⚰️",
        title: "ICU常客",
        desc: "连续加班30天后被送进ICU，身体被掏空...",
        reward: "解锁成就：医院VIP会员",
        achievementId: "icu_patient"
    },
    // 压力满值 - 职场爆炸
    stress_max: {
        icon: "😤",
        title: "职场爆炸",
        desc: "压力太大，当场拍桌子辞职！怒怼老板后世界清净了",
        reward: "解锁成就：反骨仔",
        achievementId: "rebel"
    },
    // 存款归零 - 吃土少年
    money_zero: {
        icon: "🍜",
        title: "吃土少年",
        desc: "存款花光，只能回家啃老...",
        reward: "解锁成就：负翁",
        achievementId: "poor_guy"
    },
    // 理智满值 - 职场成神
    sanity_max: {
        icon: "🧘",
        title: "职场成神",
        desc: "看透一切，成为办公室精神导师！",
        reward: "解锁成就：佛系打工人",
        achievementId: "zen_worker"
    }
};

/**
 * 显示结局画面
 * @param {string} endingType - 结局类型
 * @param {function} onRestart - 重新开始回调
 */
export function showEnding(endingType, onRestart) {
    const ending = endings[endingType];

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'ending-overlay';
    overlay.innerHTML = `
        <div class="ending-card">
            <div class="ending-icon">${ending.icon}</div>
            <div class="ending-title">结局：${ending.title}</div>
            <div class="ending-desc">${ending.desc}</div>
            <div class="ending-reward">✨ ${ending.reward} ✨</div>
            <div class="ending-buttons">
                <button class="ending-btn ending-btn-primary" id="endingRestartBtn">重新开始</button>
                <button class="ending-btn ending-btn-secondary" id="endingShareBtn">📤 分享</button>
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
        const shareText = `我在《班味清除计划》打出了【${ending.title}】结局！`;
        if (navigator.share) {
            navigator.share({
                title: '班味清除计划',
                text: shareText,
                url: location.href
            }).catch(() => {
                // 用户取消分享
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(`${shareText} ${location.href}`).then(() => {
                showToast('链接已复制', '📋');
            }).catch(() => {
                showToast('分享失败', '❌');
            });
        }
    };

    // 显示成就解锁提示
    showToast(ending.reward, ending.icon);
}

/**
 * 获取结局数据
 * @param {string} endingType - 结局类型
 * @returns {object}
 */
export function getEnding(endingType) {
    return endings[endingType] || null;
}
