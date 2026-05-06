/**
 * 事件生成器
 * 负责从专属选项池动态生成事件选项
 * v3.0: 实现选项类型均衡（至少1个正面+1个负面）
 */

/**
 * 事件生成器类
 */
export class EventGenerator {
    /**
     * 计算选项得分
     * @param {Object} option - 选项对象
     * @returns {number} 得分（正面>10，负面<-10，中性-10~10）
     */
    static calculateOptionScore(option) {
        const sanity = option.effects.sanity || 0;
        const stress = option.effects.stress || 0;
        const money = option.effects.money || 0;
        
        // 权重：存款100 ≈ 理智20 ≈ 压力20
        return sanity + money / 5 - stress;
    }
    
    /**
     * 获取选项类型
     * @param {Object} option - 选项对象
     * @returns {string} 类型：positive/negative/neutral
     */
    static getOptionType(option) {
        const score = this.calculateOptionScore(option);
        
        if (score >= 10) return 'positive';   // 明显正面
        if (score <= -10) return 'negative';  // 明显负面
        return 'neutral';                      // 中性/混合
    }
    
    /**
     * 根据事件配置生成动态选项（v3.0均衡版）
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

        // v3.0: 使用均衡抽取策略
        const selectedOptions = this.generateBalancedOptions(eventConfig.optionPool, 3);
        
        return {
            id: eventConfig.id,
            title: eventConfig.title,
            desc: eventConfig.desc,
            options: selectedOptions
        };
    }
    
    /**
     * 生成均衡的选项（v3.0核心逻辑）
     * 确保至少1个正面和1个负面选项
     * @param {Array} optionPool - 选项池数组
     * @param {number} count - 需要抽取的选项数量
     * @returns {Array} 均衡的选项数组
     */
    static generateBalancedOptions(optionPool, count = 3) {
        // 错误处理：选项池不存在或为空
        if (!optionPool || optionPool.length === 0) {
            console.error('选项池为空');
            return [];
        }
        
        // 按类型分类选项
        const positivePool = optionPool.filter(opt => this.getOptionType(opt) === 'positive');
        const negativePool = optionPool.filter(opt => this.getOptionType(opt) === 'negative');
        const neutralPool = optionPool.filter(opt => this.getOptionType(opt) === 'neutral');
        
        const selectedOptions = [];
        
        // 1. 确保至少1个正面选项
        if (positivePool.length > 0) {
            const randomIndex = Math.floor(Math.random() * positivePool.length);
            selectedOptions.push(positivePool[randomIndex]);
        }
        
        // 2. 确保至少1个负面选项
        if (negativePool.length > 0) {
            const randomIndex = Math.floor(Math.random() * negativePool.length);
            selectedOptions.push(negativePool[randomIndex]);
        }
        
        // 3. 填充剩余选项（从所有选项中随机选择，避免重复）
        const usedIndices = new Set();
        selectedOptions.forEach(opt => {
            const index = optionPool.indexOf(opt);
            if (index !== -1) usedIndices.add(index);
        });
        
        while (selectedOptions.length < count && usedIndices.size < optionPool.length) {
            const randomIndex = Math.floor(Math.random() * optionPool.length);
            if (!usedIndices.has(randomIndex)) {
                selectedOptions.push(optionPool[randomIndex]);
                usedIndices.add(randomIndex);
            }
        }
        
        // 4. 随机打乱顺序
        return this.shuffleOptions(selectedOptions);
    }
    
    /**
     * 从选项池中随机抽取指定数量的不重复选项（旧版，保留兼容）
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
