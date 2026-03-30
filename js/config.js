/**
 * 游戏配置常量
 */
export const CONFIG = {
    // 数值上限
    MAX_SANITY: 200,
    MAX_STRESS: 100,
    MAX_MONEY: 1000,

    // 初始数值
    INIT_SANITY: 100,
    INIT_STRESS: 0,
    INIT_MONEY: 500,

    // 离线收益配置
    OFFLINE_HOUR_LIMIT: 8,
    OFFLINE_SANITY_PER_HOUR: 3,
    OFFLINE_STRESS_PER_HOUR: -5,
    OFFLINE_MONEY_PER_HOUR: 15,

    // 警告阈值
    SANITY_WARNING: 30,
    STRESS_WARNING: 70,
    ZEN_MASTER_THRESHOLD: 80
};
