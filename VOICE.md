## 🔊 使用 Web Audio API 生成简单音效完整指南

Web Audio API 可以**纯代码生成音效**，无需外部音频文件，非常适合你的「今天不想上班」游戏！

---

### 一、为什么用 Web Audio API？

| 对比项 | Web Audio API | 音频文件 |
|--------|---------------|----------|
| 文件大小 | 0 KB（纯代码） | 几十到几百 KB |
| 加载速度 | 即时 | 需要下载 |
| 可控性 | 完全可控（音调、音量、时长） | 固定 |
| 实现难度 | 稍复杂 | 简单 |

对于你的轻量级游戏，Web Audio API 是**完美的轻量化方案**。

---

### 二、基础工具函数

```javascript
// ============ Web Audio API 核心工具 ============

let audioContext = null;

// 初始化音频上下文（需要用户交互后才能启动）
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // 恢复挂起的上下文（浏览器策略）
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

// 简单的音量包络（控制声音淡入淡出）
function createEnvelope(audioContext, gainNode, attack = 0.01, decay = 0.1, sustain = 0.3, release = 0.2) {
    const now = audioContext.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + attack);
    gainNode.gain.linearRampToValueAtTime(0.3, now + attack + decay);
    gainNode.gain.setValueAtTime(0.3, now + attack + decay + sustain);
    gainNode.gain.linearRampToValueAtTime(0, now + attack + decay + sustain + release);
}

// 播放纯音（频率、时长、音量、波形）
function playTone(frequency, duration = 0.2, volume = 0.3, type = 'sine') {
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(now + duration);
}
```

---

### 三、游戏音效生成函数

#### 1. UI 点击音效（轻快短促）

```javascript
function playClickSound() {
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;  // A5 音
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(now + 0.1);
}
```

#### 2. 成就解锁音效（胜利感）

```javascript
function playUnlockSound() {
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    const frequencies = [523.25, 659.25, 783.99];  // C5, E5, G5 和弦
    
    frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = freq;
        
        const startTime = now + index * 0.08;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
    });
}
```

#### 3. 选项选择音效（根据数值变化）

```javascript
function playOptionSound(effects) {
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // 根据效果决定音调：正面用高音，负面用低音
    let frequency = 440;  // A4 基准
    let type = 'sine';
    let volume = 0.2;
    
    const totalEffect = (effects.sanity || 0) + (effects.money || 0) - (effects.stress || 0);
    
    if (totalEffect > 0) {
        frequency = 659.25;  // E5 高音
        type = 'sine';
    } else if (totalEffect < 0) {
        frequency = 261.63;  // C4 低音
        type = 'triangle';
    } else {
        frequency = 440;
        type = 'sine';
    }
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(now + 0.15);
}
```

#### 4. 压力警告音效（急促警报）

```javascript
function playWarningSound() {
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 880;
    
    // 颤音效果
    oscillator.frequency.setValueAtTime(880, now);
    oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.3);
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.6);
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(now + 0.6);
}
```

#### 5. 结局音效（戏剧性）

```javascript
function playEndingSound(isGoodEnding = false) {
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    
    if (isGoodEnding) {
        // 升华音效
        const frequencies = [261.63, 329.63, 392.00, 523.25, 659.25];
        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = freq;
            
            const startTime = now + index * 0.12;
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });
    } else {
        // 失败音效（下降音）
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.5);
        
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(now + 0.6);
    }
}
```

#### 6. 摸鱼音效（轻松口哨感）

```javascript
function playSlackSound() {
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
    oscillator.frequency.exponentialRampToValueAtTime(523.25, now + 0.3);
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(now + 0.35);
}
```

---

### 四、完整封装类

```javascript
// ============ 音效管理器 ============
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.initialized = false;
    }
    
    // 初始化（必须在用户点击后调用）
    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('音效系统已初始化');
        } catch (e) {
            console.warn('Web Audio API 不支持', e);
            this.enabled = false;
        }
    }
    
    // 恢复音频上下文（页面交互后）
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    // 播放音效的通用方法
    play(callback) {
        if (!this.enabled || !this.initialized) return;
        this.resume();
        callback(this.audioContext);
    }
    
    // 点击音效
    click() {
        this.play((ctx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        });
    }
    
    // 成就解锁
    achievement() {
        this.play((ctx) => {
            const notes = [523.25, 659.25, 783.99];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const start = ctx.currentTime + i * 0.08;
                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.3);
            });
        });
    }
    
    // 正面选项
    positive() {
        this.play((ctx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 659.25;
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        });
    }
    
    // 负面选项
    negative() {
        this.play((ctx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = 261.63;
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        });
    }
    
    // 警告
    warning() {
        this.play((ctx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        });
    }
    
    // 摸鱼
    slack() {
        this.play((ctx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        });
    }
    
    // 结局（好/坏）
    ending(isGood) {
        this.play((ctx) => {
            if (isGood) {
                const notes = [261.63, 329.63, 392.00, 523.25];
                notes.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    const start = ctx.currentTime + i * 0.12;
                    gain.gain.setValueAtTime(0, start);
                    gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(start);
                    osc.stop(start + 0.35);
                });
            } else {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.5);
                gain.gain.setValueAtTime(0.18, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.6);
            }
        });
    }
}

// 创建全局音效管理器
const soundManager = new SoundManager();

// 在游戏初始化时绑定用户交互（重要！浏览器策略）
document.addEventListener('click', function initAudioOnFirstClick() {
    soundManager.init();
    soundManager.resume();
    document.removeEventListener('click', initAudioOnFirstClick);
}, { once: true });
```

---

### 五、集成到游戏中的示例

```javascript
// 在游戏主文件中使用
// 点击选项时
function onOptionClick(option, btn) {
    if (option.effects.sanity > 0 || option.effects.money > 0) {
        soundManager.positive();
    } else if (option.effects.sanity < 0 || option.effects.money < 0) {
        soundManager.negative();
    }
    
    if (option.tags.includes('slack_off')) {
        soundManager.slack();
    }
    
    // ... 原有的游戏逻辑
}

// 成就解锁时
function onAchievementUnlock() {
    soundManager.achievement();
}

// 压力警告时
if (gameState.stress > 70) {
    soundManager.warning();
}

// 结局触发时
function onEnding(isGoodEnding) {
    soundManager.ending(isGoodEnding);
}
```

---

### 六、注意事项

| 问题 | 解决方案 |
|------|----------|
| **浏览器策略** | 用户首次点击页面后才能播放音频，用全局 click 监听初始化 |
| **性能** | 音效非常轻量，不会影响游戏性能 |
| **兼容性** | 主流浏览器都支持，Safari 需要用 `webkitAudioContext` |
| **开关控制** | 在设置中添加音效开关，`soundManager.enabled = false` |

需要我帮你把这个音效系统完整集成到之前的游戏代码中吗？