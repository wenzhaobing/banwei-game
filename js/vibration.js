/**
 * 震动管理器 - 使用 Vibration API
 */

class VibrationManager {
    constructor() {
        this.enabled = false;
        this.supported = 'vibrate' in navigator;
    }

    setEnabled(enabled) {
        this.enabled = enabled && this.supported;
    }

    vibrate(pattern) {
        if (!this.enabled || !this.supported) return;
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            console.warn('震动失败', e);
        }
    }

    click() {
        this.vibrate(50);
    }

    achievement() {
        this.vibrate([100, 50, 100]);
    }

    warning() {
        this.vibrate([50, 30, 50, 30, 50]);
    }

    ending() {
        this.vibrate(200);
    }

    reset() {
        this.vibrate(100);
    }
}

export const vibrationManager = new VibrationManager();
