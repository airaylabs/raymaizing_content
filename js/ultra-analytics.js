// ==================== ULTRA ANALYTICS ====================
// Advanced Analytics & Insights System
// Version 4.0 - December 2025

const UltraAnalytics = {
    // State
    state: {
        timeRange: '7d',
        data: {
            content: [],
            engagement: [],
            growth: [],
            platforms: {}
        },
        charts: {}
    },

    // Initialize
    init() {
        this.loadData();
        console.log('📊 Ultra Analytics initialized');
        return this;
    },

    // Load Data
    loadData() {
        const contents = JSON.parse(localStorage.getItem('raycorp-contents') || '[]');
        this.state.data.content = contents;
        this.calculateMetrics();
    },

    // Calculate Metrics
    calculateMetrics() {
        const contents = this.state.data.content;
        
        this.state.metrics = {
            totalContent: contents.length,
            byStatus: this.groupBy(contents, 'status'),
            byType: this.groupBy(contents, 'type'),
            byPlatform: this.countPlatforms(contents),
            aiGenerated: contents.filter(c => c.aiGenerated).length,
            thisWeek: contents.filter(c => this.isThisWeek(c.createdAt)).length,
            thisMonth: contents.filter(c => this.isThisMonth(c.createdAt)).length
        };
    },

    groupBy(array, key) {
        return array.reduce((result, item) => {
            const value = item[key] || 'unknown';
            result[value] = (result[value] || 0) + 1;
            return result;
        }, {});
    },

    countPlatforms(contents) {
        const counts = {};
        contents.forEach(c => {
            (c.platforms || []).forEach(p => {
                counts[p] = (counts[p] || 0) + 1;
            });
        });
        return counts;
    },

    isThisWeek(date) {
        if (!date) return false;
        const now = new Date();
        const d = new Date(date);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
    },

    isThisMonth(date) {
        if (!date) return false;
        const now = new Date();
        const d = new Date(date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    },

    // Get Analytics Summary
    getSummary() {
        return {
            overview: {
                totalContent: this.state.metrics.totalContent,
                thisWeek: this.state.metrics.thisWeek,
                thisMonth: this.state.metrics.thisMonth,
                aiGenerated: this.state.metrics.aiGenerated
            },
            status: this.state.metrics.byStatus,
            types: this.state.metrics.byType,
            platforms: this.state.metrics.byPlatform,
            trends: this.calculateTrends()
        };
    },

    // Calculate Trends
    calculateTrends() {
        const contents = this.state.data.content;
        const now = new Date();
        const trends = [];

        // Last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const count = contents.filter(c => {
                const cDate = new Date(c.createdAt).toISOString().split('T')[0];
                return cDate === dateStr;
            }).length;
            
            trends.push({
                date: dateStr,
                day: date.toLocaleDateString('en', { weekday: 'short' }),
                count
            });
        }

        return trends;
    },

    // Generate AI Insights
    async generateInsights() {
        const summary = this.getSummary();
        
        const prompt = `Analyze this content performance data and provide 3-5 actionable insights:

Total Content: ${summary.overview.totalContent}
This Week: ${summary.overview.thisWeek}
AI Generated: ${summary.overview.aiGenerated}

Content by Status:
${Object.entries(summary.status).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Content by Type:
${Object.entries(summary.types).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Content by Platform:
${Object.entries(summary.platforms).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Provide specific, actionable recommendations to improve content strategy.`;

        if (window.UltraAIEngine) {
            const result = await UltraAIEngine.generateText(prompt, {
                temperature: 0.7,
                maxTokens: 1000
            });
            return result.success ? result.content : this.getDefaultInsights();
        }

        return this.getDefaultInsights();
    },

    getDefaultInsights() {
        const summary = this.getSummary();
        const insights = [];

        if (summary.overview.totalContent < 10) {
            insights.push('📈 Increase content production to build a stronger presence');
        }

        if (summary.overview.aiGenerated < summary.overview.totalContent * 0.5) {
            insights.push('🤖 Use AI generation more to speed up content creation');
        }

        const topPlatform = Object.entries(summary.platforms).sort((a, b) => b[1] - a[1])[0];
        if (topPlatform) {
            insights.push(`📱 ${topPlatform[0]} is your most active platform - consider diversifying`);
        }

        if (summary.status.draft > summary.status.published) {
            insights.push('📝 You have many drafts - consider publishing more content');
        }

        return insights.join('\n\n');
    },

    // Render Analytics Dashboard
    renderAnalytics(containerId = 'analytics-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const summary = this.getSummary();

        container.innerHTML = `
            <div class="analytics-header">
                <h2>📊 Content Analytics</h2>
                <div class="analytics-actions">
                    <select id="analytics-range" onchange="UltraAnalytics.setTimeRange(this.value)">
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                        <option value="all">All Time</option>
                    </select>
                    <button class="btn-secondary" onclick="UltraAnalytics.exportReport()">📤 Export</button>
                </div>
            </div>

            <!-- Overview Cards -->
            <div class="analytics-overview">
                <div class="analytics-card">
                    <span class="analytics-icon">📊</span>
                    <div class="analytics-value">${summary.overview.totalContent}</div>
                    <div class="analytics-label">Total Content</div>
                </div>
                <div class="analytics-card">
                    <span class="analytics-icon">📅</span>
                    <div class="analytics-value">${summary.overview.thisWeek}</div>
                    <div class="analytics-label">This Week</div>
                </div>
                <div class="analytics-card">
                    <span class="analytics-icon">🤖</span>
                    <div class="analytics-value">${summary.overview.aiGenerated}</div>
                    <div class="analytics-label">AI Generated</div>
                </div>
                <div class="analytics-card">
                    <span class="analytics-icon">📈</span>
                    <div class="analytics-value">${this.calculateGrowthRate()}%</div>
                    <div class="analytics-label">Growth Rate</div>
                </div>
            </div>

            <!-- Charts Row -->
            <div class="analytics-charts">
                <div class="chart-card">
                    <h3>📈 Content Trend</h3>
                    <div class="trend-chart">
                        ${this.renderTrendChart(summary.trends)}
                    </div>
                </div>
                <div class="chart-card">
                    <h3>📊 By Status</h3>
                    <div class="status-breakdown">
                        ${this.renderStatusBreakdown(summary.status)}
                    </div>
                </div>
            </div>

            <!-- Platform & Type Distribution -->
            <div class="analytics-distribution">
                <div class="distribution-card">
                    <h3>📱 Platform Distribution</h3>
                    ${this.renderPlatformDistribution(summary.platforms)}
                </div>
                <div class="distribution-card">
                    <h3>📝 Content Types</h3>
                    ${this.renderTypeDistribution(summary.types)}
                </div>
            </div>

            <!-- AI Insights -->
            <div class="analytics-insights">
                <div class="insights-header">
                    <h3>🧠 AI Insights</h3>
                    <button class="btn-ghost" onclick="UltraAnalytics.refreshInsights()">Refresh →</button>
                </div>
                <div class="insights-content" id="ai-insights-content">
                    <div class="loading-state">Generating insights...</div>
                </div>
            </div>
        `;

        this.addStyles();
        this.loadInsights();
    },

    renderTrendChart(trends) {
        const maxCount = Math.max(...trends.map(t => t.count), 1);
        
        return `
            <div class="trend-bars">
                ${trends.map(t => `
                    <div class="trend-bar-wrapper">
                        <div class="trend-bar" style="height: ${(t.count / maxCount) * 100}%">
                            <span class="trend-value">${t.count}</span>
                        </div>
                        <span class="trend-label">${t.day}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderStatusBreakdown(status) {
        const total = Object.values(status).reduce((a, b) => a + b, 0) || 1;
        const colors = {
            draft: '#6B7280',
            scheduled: '#F59E0B',
            published: '#10B981',
            review: '#3B82F6',
            idea: '#8B5CF6'
        };

        return `
            <div class="status-bars">
                ${Object.entries(status).map(([key, value]) => `
                    <div class="status-bar-item">
                        <div class="status-bar-header">
                            <span class="status-name">${key}</span>
                            <span class="status-count">${value}</span>
                        </div>
                        <div class="status-bar-track">
                            <div class="status-bar-fill" style="width: ${(value / total) * 100}%; background: ${colors[key] || '#6366F1'}"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderPlatformDistribution(platforms) {
        const total = Object.values(platforms).reduce((a, b) => a + b, 0) || 1;
        const icons = {
            instagram: '📸',
            tiktok: '🎵',
            twitter: '🐦',
            linkedin: '💼',
            youtube: '🎬',
            facebook: '📘'
        };

        if (Object.keys(platforms).length === 0) {
            return '<p class="no-data">No platform data yet</p>';
        }

        return `
            <div class="platform-list">
                ${Object.entries(platforms).map(([key, value]) => `
                    <div class="platform-item">
                        <span class="platform-icon">${icons[key] || '🌐'}</span>
                        <span class="platform-name">${key}</span>
                        <span class="platform-count">${value}</span>
                        <span class="platform-percent">${Math.round((value / total) * 100)}%</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderTypeDistribution(types) {
        const icons = {
            'text_article': '📝',
            'text_thread': '🐦',
            'video_short': '📱',
            'video_long': '🎬',
            'video_story': '⏱️',
            'image_carousel': '🎨'
        };

        if (Object.keys(types).length === 0) {
            return '<p class="no-data">No content type data yet</p>';
        }

        return `
            <div class="type-list">
                ${Object.entries(types).map(([key, value]) => `
                    <div class="type-item">
                        <span class="type-icon">${icons[key] || '📄'}</span>
                        <span class="type-name">${key.replace('_', ' ')}</span>
                        <span class="type-count">${value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    calculateGrowthRate() {
        const contents = this.state.data.content;
        const thisWeek = contents.filter(c => this.isThisWeek(c.createdAt)).length;
        const lastWeek = contents.filter(c => {
            const d = new Date(c.createdAt);
            const now = new Date();
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return d >= twoWeeksAgo && d < oneWeekAgo;
        }).length;

        if (lastWeek === 0) return thisWeek > 0 ? 100 : 0;
        return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
    },

    async loadInsights() {
        const container = document.getElementById('ai-insights-content');
        if (!container) return;

        const insights = await this.generateInsights();
        container.innerHTML = `<div class="insights-text">${insights.replace(/\n/g, '<br>')}</div>`;
    },

    async refreshInsights() {
        const container = document.getElementById('ai-insights-content');
        if (container) {
            container.innerHTML = '<div class="loading-state">Generating new insights...</div>';
        }
        await this.loadInsights();
    },

    setTimeRange(range) {
        this.state.timeRange = range;
        this.loadData();
        this.renderAnalytics();
    },

    exportReport() {
        const summary = this.getSummary();
        const report = {
            generatedAt: new Date().toISOString(),
            timeRange: this.state.timeRange,
            summary,
            rawData: this.state.data.content
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    addStyles() {
        if (document.getElementById('ultra-analytics-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ultra-analytics-styles';
        styles.textContent = `
            .analytics-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }
            .analytics-header h2 { margin: 0; }
            .analytics-actions { display: flex; gap: 12px; }
            
            .analytics-overview {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            .analytics-card {
                background: var(--bg-card);
                padding: 20px;
                border-radius: 16px;
                text-align: center;
                border: 1px solid var(--border);
            }
            .analytics-icon { font-size: 28px; display: block; margin-bottom: 8px; }
            .analytics-value { font-size: 28px; font-weight: 700; color: var(--primary); }
            .analytics-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
            
            .analytics-charts {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 16px;
                margin-bottom: 24px;
            }
            .chart-card {
                background: var(--bg-card);
                padding: 20px;
                border-radius: 16px;
                border: 1px solid var(--border);
            }
            .chart-card h3 { margin: 0 0 16px 0; font-size: 15px; }
            
            .trend-bars {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                height: 150px;
                gap: 8px;
            }
            .trend-bar-wrapper {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }
            .trend-bar {
                width: 100%;
                background: var(--gradient-primary);
                border-radius: 4px 4px 0 0;
                min-height: 4px;
                position: relative;
            }
            .trend-value {
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 10px;
                color: var(--text-muted);
            }
            .trend-label { font-size: 11px; color: var(--text-muted); }
            
            .status-bars { display: flex; flex-direction: column; gap: 12px; }
            .status-bar-item { }
            .status-bar-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
                font-size: 12px;
            }
            .status-bar-track {
                height: 8px;
                background: var(--bg-muted);
                border-radius: 4px;
                overflow: hidden;
            }
            .status-bar-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.3s;
            }
            
            .analytics-distribution {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin-bottom: 24px;
            }
            .distribution-card {
                background: var(--bg-card);
                padding: 20px;
                border-radius: 16px;
                border: 1px solid var(--border);
            }
            .distribution-card h3 { margin: 0 0 16px 0; font-size: 15px; }
            
            .platform-list, .type-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .platform-item, .type-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: var(--bg-muted);
                border-radius: 8px;
            }
            .platform-icon, .type-icon { font-size: 18px; }
            .platform-name, .type-name { flex: 1; font-size: 13px; }
            .platform-count, .type-count { font-weight: 600; }
            .platform-percent { font-size: 11px; color: var(--text-muted); }
            
            .analytics-insights {
                background: var(--bg-card);
                padding: 20px;
                border-radius: 16px;
                border: 1px solid var(--border);
            }
            .insights-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }
            .insights-header h3 { margin: 0; font-size: 15px; }
            .insights-text {
                font-size: 13px;
                line-height: 1.6;
                color: var(--text-secondary);
            }
            
            .no-data {
                text-align: center;
                color: var(--text-muted);
                padding: 20px;
                font-size: 13px;
            }
            
            @media (max-width: 768px) {
                .analytics-charts,
                .analytics-distribution {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(styles);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.UltraAnalytics = UltraAnalytics.init();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltraAnalytics;
}
