/**
 * 事件生成器
 * 负责从专属选项池动态生成事件选项
 */

/**
 * 事件生成器类
 */
export class EventGenerator {
    /**
     * 根据事件配置生成动态选项
     * @param {Object} eventConfig - 事件配置 { id, title, desc, optionPool }
     * @returns {Object} 完整的事件对象
     */
    static generateEvent(eventConfig) {
        // 参数验证
        if (!eventConfig || !eventConfig.optionPool) {
            console.error('事件配置无效:', eventConfig);
            return {
                id: 'error',
                title: '⚠️ 系统错误',
                desc: '事件加载失败，请刷新页面',
                options: []
            };
        }

        // 从专属选项池中随机抽取3个选项
        const selectedOptions = this.randomSelectOptions(eventConfig.optionPool, 3);
        
        return {
            id: eventConfig.id,
            title: eventConfig.title,
            desc: eventConfig.desc,
            options: selectedOptions
        };
    }
    
    /**
     * 从选项池中随机抽取指定数量的不重复选项
     * @param {Array} optionPool - 选项池数组
     * @param {number} count - 需要抽取的选项数量
     * @returns {Array} 抽取的选项数组
     */
    static randomSelectOptions(optionPool, count = 3) {
        // 错误处理：选项池不存在或为空
        if (!optionPool || optionPool.length === 0) {
            console.error('选项池为空');
            return [];
        }
        
        // 如果选项池选项数量少于需要抽取的数量，返回所有选项
        if (optionPool.length <= count) {
            return [...optionPool];
        }
        
        // Fisher-Yates 洗牌算法随机抽取
        const shuffled = [...optionPool];
        for (let i = shuffled.length - 1; i > shuffled.length - count - 1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // 返回最后 count 个元素（已随机打乱）
        return shuffled.slice(-count);
    }
    
    /**
     * 随机打乱选项顺序
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
