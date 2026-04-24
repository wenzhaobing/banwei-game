// 触发运势弹窗
import('./js/fortune.js').then(m => {
    m.initDailyFortune();
    document.getElementById('fortuneContent').innerHTML = m.renderFortuneModal();
    document.getElementById('fortuneModal').style.display = 'flex';
});

// 触发"吃土少年"结局（存款归零）
import('./js/endings.js').then(m => {
    m.setEndingContext({
        sanity: 100,
        stress: 20,
        money: 0,
        maxSanity: 200,
        maxStress: 100
    }, 50);
    m.showEnding('money_zero');
});

// 或者触发"ICU常客"结局（理智归零）
import('./js/endings.js').then(m => {
    m.setEndingContext({
        sanity: 0,
        stress: 80,
        money: 500,
        maxSanity: 200,
        maxStress: 100
    }, 30);
    m.showEnding('sanity_zero');
});