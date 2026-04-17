/**
 * 事件生成器
 * 负责从选项池动态生成事件选项
 */

import { OPTION_POOLS } from '../data/option-pools.js';

/**
 * 事件生成器类
 */
export class EventGenerator {
    /**
     * 根据事件配置生成动态选项
     * @param {Object} eventConfig - 事件配置 { id, title, desc, pools }
     * @returns {Object} 完整的事件对象
     */
    static generateEvent(eventConfig) {
        // 参数验证
        if (!eventConfig || !eventConfig.pools) {
            console.error('事件配置无效:', eventConfig);
            return {
                id: 'error',
                title: '⚠️ 系统错误',
                desc: '事件加载失败，请刷新页面',
                options: []
            };
        }

        const options = this.generateOptions(eventConfig.pools);
        
        return {
            id: eventConfig.id,
            title: eventConfig.title,
            desc: eventConfig.desc,
            options: options
        };
    }
    
    /**
     * 从选项池生成选项
     * @param {Array<string>} poolNames - 选项池名称数组
     * @returns {Array} 生成的选项数组
     */
    static generateOptions(poolNames) {
        const options = [];
        
        poolNames.forEach(poolName => {
            const pool = OPTION_POOLS[poolName];
            
            // 错误处理：选项池不存在
            if (!pool) {
                console.warn(`选项池 "${poolName}" 不存在，使用默认选项`);
                // 使用 slack 作为默认选项池
                const defaultPool = OPTION_POOLS['slack'];
                if (defaultPool && defaultPool.length > 0) {
                    const randomIndex = Math.floor(Math.random() * defaultPool.length);
                    options.push({ ...defaultPool[randomIndex] });
                }
                return;
            }
            
            // 错误处理：选项池为空
            if (pool.length === 0) {
                console.warn(`选项池 "${poolName}" 为空`);
                return;
            }
            
            // 随机选择一个选项
            const randomIndex = Math.floor(Math.random() * pool.length);
            options.push({ ...pool[randomIndex] }); // 深拷贝
        });
        
        // 错误处理：没有生成任何选项
        if (options.length === 0) {
            console.error('未能生成任何选项，使用默认选项');
            const defaultPool = OPTION_POOLS['slack'];
            if (defaultPool && defaultPool.length > 0) {
                options.push({ ...defaultPool[0] });
            }
        }
        
        return options;
    }
    
    /**
     * 随机打乱选项顺序（方案1）
     * 使用 Fisher-Yates 洗牌算法
     * @param {Array} options - 选项数组
     * @returns {Array} 打乱后的选项数组
     */
    static shuffleOptions(options) {
        if (!options || options.length === 0) {
            return [];
        }
        
        const shuffled = [...options];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}
