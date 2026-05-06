/**
 * 事件验证工具 - 检查选项类型均衡性
 * 用于验证每个事件是否包含至少1个正面和1个负面选项
 */

import { events } from './data/events-data.js';

/**
 * 计算选项得分
 * @param {Object} option - 选项对象
 * @returns {number} 得分（正面>10，负面<-10，中性-10~10）
 */
function calculateOptionScore(option) {
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
function getOptionType(option) {
    const score = calculateOptionScore(option);
    
    if (score >= 10) return 'positive';   // 明显正面
    if (score <= -10) return 'negative';  // 明显负面
    return 'neutral';                      // 中性/混合
}

/**
 * 验证单个事件
 * @param {Object} event - 事件对象
 * @returns {Object} 验证结果
 */
function validateEvent(event) {
    const optionTypes = event.optionPool.map(opt => ({
        text: opt.text,
        type: getOptionType(opt),
        score: calculateOptionScore(opt),
        effects: opt.effects
    }));
    
    const types = optionTypes.map(o => o.type);
    const hasPositive = types.includes('positive');
    const hasNegative = types.includes('negative');
    const positiveCount = types.filter(t => t === 'positive').length;
    const negativeCount = types.filter(t => t === 'negative').length;
    const neutralCount = types.filter(t => t === 'neutral').length;
    
    const issues = [];
    if (!hasPositive) issues.push('缺少正面选项');
    if (!hasNegative) issues.push('缺少负面选项');
    if (positiveCount === 3) issues.push('全是正面选项（策略性低）');
    if (negativeCount === 3) issues.push('全是负面选项（体验差）');
    
    return {
        id: event.id,
        title: event.title,
        isValid: hasPositive && hasNegative && positiveCount < 3 && negativeCount < 3,
        issues,
        stats: {
            positive: positiveCount,
            negative: negativeCount,
            neutral: neutralCount
        },
        options: optionTypes
    };
}

/**
 * 验证所有事件
 * @returns {Object} 验证报告
 */
export function validateAllEvents() {
    console.log('🔍 开始验证所有事件...\n');
    console.log('=' .repeat(80));
    
    const results = events.map(validateEvent);
    const validEvents = results.filter(r => r.isValid);
    const invalidEvents = results.filter(r => !r.isValid);
    
    // 打印每个事件的详细信息
    results.forEach(result => {
        console.log(`\n📋 事件: ${result.title} (${result.id})`);
        console.log(`   正面: ${result.stats.positive} | 负面: ${result.stats.negative} | 中性: ${result.stats.neutral}`);
        
        result.options.forEach((opt, index) => {
            const icon = opt.type === 'positive' ? '✅' : opt.type === 'negative' ? '❌' : '⚠️';
            console.log(`   ${index + 1}. ${icon} ${opt.text}`);
            console.log(`      效果: 💖${opt.effects.sanity || 0} 😫${opt.effects.stress || 0} 💰${opt.effects.money || 0} | 得分: ${opt.score.toFixed(1)}`);
        });
        
        if (result.issues.length > 0) {
            console.log(`   ⚠️  问题: ${result.issues.join(', ')}`);
        } else {
            console.log(`   ✅ 配置合格`);
        }
    });
    
    // 打印汇总报告
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 验证报告汇总');
    console.log('='.repeat(80));
    console.log(`总事件数: ${results.length}`);
    console.log(`合格事件: ${validEvents.length} (${(validEvents.length / results.length * 100).toFixed(1)}%)`);
    console.log(`不合格事件: ${invalidEvents.length} (${(invalidEvents.length / results.length * 100).toFixed(1)}%)`);
    
    if (invalidEvents.length > 0) {
        console.log('\n❌ 不合格事件列表:');
        invalidEvents.forEach(event => {
            console.log(`   - ${event.title} (${event.id}): ${event.issues.join(', ')}`);
        });
    }
    
    // 统计选项类型分布
    const totalOptions = results.reduce((sum, r) => sum + r.stats.positive + r.stats.negative + r.stats.neutral, 0);
    const totalPositive = results.reduce((sum, r) => sum + r.stats.positive, 0);
    const totalNegative = results.reduce((sum, r) => sum + r.stats.negative, 0);
    const totalNeutral = results.reduce((sum, r) => sum + r.stats.neutral, 0);
    
    console.log('\n📈 选项类型分布:');
    console.log(`   正面选项: ${totalPositive} (${(totalPositive / totalOptions * 100).toFixed(1)}%)`);
    console.log(`   负面选项: ${totalNegative} (${(totalNegative / totalOptions * 100).toFixed(1)}%)`);
    console.log(`   中性选项: ${totalNeutral} (${(totalNeutral / totalOptions * 100).toFixed(1)}%)`);
    
    return {
        total: results.length,
        valid: validEvents.length,
        invalid: invalidEvents.length,
        results,
        stats: {
            positive: totalPositive,
            negative: totalNegative,
            neutral: totalNeutral
        }
    };
}

// 自动执行验证
validateAllEvents();
