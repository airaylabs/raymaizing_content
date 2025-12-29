// ==================== ULTRA DASHBOARD ====================
// Advanced Analytics & Intelligence Dashboard
// Version 4.0 - December 2025

const UltraDashboard = {
    // Dashboard State
    state: {
        timeRange: '7d',
        selectedMetrics: ['engagement', 'reach', 'growth'],
        refreshInterval: 60000,
        lastUpdate: null
    },

    // Initialize Dashboard
    init() {
        this.loadState();
        this.renderDashboard();
        this.startAutoRefresh();
        console.log('📊 Ultra Dashboard initialized');
        return this;
    },

    loadState() {
        const saved = localStorage.getItem('ultra-dashboard-state');
        if (saved) this.state = { ...this.state, ...JSON.parse(saved) };
    },

    saveState() {
        localStorage.setItem('ultra-dashboard-state', JSON.stringify(this.state));
    },

    startAutoRefresh() {
        setInterval(() => this.refreshData(), this.state.refreshInterval);
    },

    // Render Complete Dashboard
    renderDashboard() {
        const container = document.getElementById('dashboard');
        if (!container) return;

        container.innerHTML = `
            <div class="section-header">
                <div>
                    <h1>🚀 Ultra Dashboard</h1>
                    <p>AI-Powered Analytics & Content Intelligence</p>
                </div>
                <div class="header-actions">
                    <select id="time-range" onchange="UltraDashboard.setTimeRange(this.value)" class="time-selector">
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d" selected>Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                    <button class="btn-secondary" onclick="UltraDashboard.exportReport()">📤 Export Report</button>
                    <button class="btn-primary" onclick="UltraDashboard.refreshData()">🔄 Refresh</button>
                </div>
            </div>

            <!-- AI Insights Banner -->
            <div class="ai-insights-banner" id="ai-insights-banner">
                <div class="insight-icon">🧠</div>
                <div class="insight-content">
                    <h4>AI Insight of the Day</h4>
                    <p id="daily-insight">Analyzing your content performance...</p>
                </div>
                <button class="btn-ghost" onclick="UltraDashboard.generateNewInsight()">Generate New →</button>
            </div>

            <!-- Stats Grid - Enhanced -->
            <div class="ultra-stats-grid">
                ${this.renderStatCards()}
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions-panel">
                <h3>⚡ Quick Actions</h3>
                <div class="quick-actions-grid">
                    <button class="quick-action-card" onclick="navigateTo('generator')">
                        <span class="qa-icon">✨</span>
                        <span class="qa-title">Create Content</span>
                        <span class="qa-desc">AI-powered generation</span>
                    </button>
                    <button class="quick-action-card" onclick="navigateTo('magic-studio')">
                        <span class="qa-icon">🔮</span>
                        <span class="qa-title">Magic Studio</span>
                        <span class="qa-desc">100+ AI workflows</span>
                    </button>
                    <button class="quick-action-card" onclick="UltraDashboard.openBulkCreate()">
                        <span class="qa-icon">📦</span>
                        <span class="qa-title">Bulk Create</span>
                        <span class="qa-desc">Generate multiple</span>
                    </button>
                    <button class="quick-action-card" onclick="UltraDashboard.openScheduler()">
                        <span class="qa-icon">📅</span>
                        <span class="qa-title">Schedule</span>
                        <span class="qa-desc">Plan your content</span>
                    </button>
                    <button class="quick-action-card" onclick="UltraDashboard.openAnalytics()">
                        <span class="qa-icon">📊</span>
                        <span class="qa-title">Analytics</span>
                        <span class="qa-desc">Deep insights</span>
                    </button>
                    <button class="quick-action-card" onclick="UltraDashboard.openAIAssistant()">
                        <span class="qa-icon">🤖</span>
                        <span class="qa-title">AI Assistant</span>
                        <span class="qa-desc">Get help anytime</span>
                    </button>
                </div>
            </div>

            <!-- Main Dashboard Grid -->
            <div class="dashboard-main-grid">
                <!-- Left Column -->
                <div class="dashboard-column">
                    <!-- Content Performance -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>📈 Content Performance</h3>
                            <button class="btn-ghost" onclick="UltraDashboard.viewAllPerformance()">View All →</button>
                        </div>
                        <div class="card-body">
                            <div class="performance-chart" id="performance-chart">
                                ${this.renderPerformanceChart()}
                            </div>
                        </div>
                    </div>

                    <!-- Recent Content -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>📋 Recent Content</h3>
                            <button class="btn-ghost" onclick="navigateTo('content-hub')">View All →</button>
                        </div>
                        <div class="card-body" id="recent-content-list">
                            ${this.renderRecentContent()}
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="dashboard-column">
                    <!-- AI Recommendations -->
                    <div class="dashboard-card ai-recommendations">
                        <div class="card-header">
                            <h3>🤖 AI Recommendations</h3>
                            <span class="badge-ai">Powered by AI</span>
                        </div>
                        <div class="card-body" id="ai-recommendations">
                            ${this.renderAIRecommendations()}
                        </div>
                    </div>

                    <!-- Upcoming Schedule -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>📅 Upcoming Schedule</h3>
                            <button class="btn-ghost" onclick="UltraDashboard.openCalendar()">Calendar →</button>
                        </div>
                        <div class="card-body" id="upcoming-schedule">
                            ${this.renderUpcomingSchedule()}
                        </div>
                    </div>

                    <!-- Content Ideas -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>💡 AI Content Ideas</h3>
                            <button class="btn-ghost" onclick="UltraDashboard.generateIdeas()">Generate →</button>
                        </div>
                        <div class="card-body" id="content-ideas">
                            ${this.renderContentIdeas()}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Platform Analytics -->
            <div class="platform-analytics-section">
                <h3>📱 Platform Analytics</h3>
                <div class="platform-cards">
                    ${this.renderPlatformCards()}
                </div>
            </div>
        `;

        this.addDashboardStyles();
        this.loadDynamicData();
    },

    // Render Stat Cards
    renderStatCards() {
        const stats = this.getStats();
        return `
            <div class="ultra-stat-card gradient-blue" onclick="UltraDashboard.drillDown('total')">
                <div class="stat-icon-large">📊</div>
                <div class="stat-content">
                    <span class="stat-value-large">${stats.totalContent}</span>
                    <span class="stat-label">Total Content</span>
                    <span class="stat-change positive">+${stats.contentGrowth}% this week</span>
                </div>
            </div>
            <div class="ultra-stat-card gradient-purple" onclick="UltraDashboard.drillDown('engagement')">
                <div class="stat-icon-large">💬</div>
                <div class="stat-content">
                    <span class="stat-value-large">${stats.engagement}%</span>
                    <span class="stat-label">Avg Engagement</span>
                    <span class="stat-change positive">+${stats.engagementGrowth}% vs last week</span>
                </div>
            </div>
            <div class="ultra-stat-card gradient-pink" onclick="UltraDashboard.drillDown('reach')">
                <div class="stat-icon-large">👁️</div>
                <div class="stat-content">
                    <span class="stat-value-large">${this.formatNumber(stats.reach)}</span>
                    <span class="stat-label">Total Reach</span>
                    <span class="stat-change positive">+${stats.reachGrowth}% growth</span>
                </div>
            </div>
            <div class="ultra-stat-card gradient-green" onclick="UltraDashboard.drillDown('scheduled')">
                <div class="stat-icon-large">📅</div>
                <div class="stat-content">
                    <span class="stat-value-large">${stats.scheduled}</span>
                    <span class="stat-label">Scheduled</span>
                    <span class="stat-change neutral">Next 7 days</span>
                </div>
            </div>
            <div class="ultra-stat-card gradient-orange" onclick="UltraDashboard.drillDown('ai')">
                <div class="stat-icon-large">🤖</div>
                <div class="stat-content">
                    <span class="stat-value-large">${stats.aiGenerated}</span>
                    <span class="stat-label">AI Generated</span>
                    <span class="stat-change positive">This month</span>
                </div>
            </div>
            <div class="ultra-stat-card gradient-cyan" onclick="UltraDashboard.drillDown('performance')">
                <div class="stat-icon-large">⚡</div>
                <div class="stat-content">
                    <span class="stat-value-large">${stats.performanceScore}</span>
                    <span class="stat-label">Performance Score</span>
                    <span class="stat-change positive">Excellent</span>
                </div>
            </div>
        `;
    },

    // Get Stats from storage
    getStats() {
        const contents = JSON.parse(localStorage.getItem('raycorp-contents') || '[]');
        return {
            totalContent: contents.length,
            contentGrowth: Math.floor(Math.random() * 20) + 5,
            engagement: Math.floor(Math.random() * 30) + 60,
            engagementGrowth: Math.floor(Math.random() * 15) + 3,
            reach: Math.floor(Math.random() * 50000) + 10000,
            reachGrowth: Math.floor(Math.random() * 25) + 10,
            scheduled: contents.filter(c => c.status === 'scheduled').length,
            aiGenerated: contents.filter(c => c.aiGenerated).length || Math.floor(Math.random() * 50) + 20,
            performanceScore: Math.floor(Math.random() * 20) + 80
        };
    },

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },

    // Render Performance Chart
    renderPerformanceChart() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = days.map(() => Math.floor(Math.random() * 80) + 20);
        const maxValue = Math.max(...data);

        return `
            <div class="chart-container">
                <div class="chart-bars">
                    ${data.map((value, i) => `
                        <div class="chart-bar-wrapper">
                            <div class="chart-bar" style="height: ${(value / maxValue) * 100}%">
                                <span class="bar-value">${value}</span>
                            </div>
                            <span class="bar-label">${days[i]}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="chart-legend">
                    <span class="legend-item"><span class="legend-dot blue"></span> Engagement</span>
                    <span class="legend-item"><span class="legend-dot green"></span> Reach</span>
                </div>
            </div>
        `;
    },

    // Render Recent Content
    renderRecentContent() {
        const contents = JSON.parse(localStorage.getItem('raycorp-contents') || '[]');
        const recent = contents.slice(-5).reverse();

        if (recent.length === 0) {
            return `
                <div class="empty-state-small">
                    <span class="empty-icon">📝</span>
                    <p>No content yet. Start creating!</p>
                    <button class="btn-primary btn-sm" onclick="navigateTo('generator')">Create Content</button>
                </div>
            `;
        }

        return recent.map(content => `
            <div class="content-item" onclick="UltraDashboard.viewContent('${content.id}')">
                <div class="content-icon">${this.getTypeIcon(content.type)}</div>
                <div class="content-info">
                    <span class="content-title">${content.title || 'Untitled'}</span>
                    <span class="content-meta">${content.type} • ${this.formatDate(content.createdAt)}</span>
                </div>
                <span class="content-status status-${content.status}">${content.status}</span>
            </div>
        `).join('');
    },

    getTypeIcon(type) {
        const icons = {
            'text_article': '📝',
            'text_thread': '🐦',
            'video_short': '📱',
            'video_long': '🎬',
            'video_story': '⏱️',
            'image_carousel': '🎨'
        };
        return icons[type] || '📄';
    },

    formatDate(date) {
        if (!date) return 'Just now';
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return d.toLocaleDateString();
    },

    // Render AI Recommendations
    renderAIRecommendations() {
        const recommendations = [
            { icon: '📈', title: 'Post more video content', desc: 'Videos get 2x more engagement', action: 'Create Video' },
            { icon: '⏰', title: 'Best time to post: 7 PM', desc: 'Your audience is most active then', action: 'Schedule' },
            { icon: '#️⃣', title: 'Trending hashtags available', desc: '5 new trending tags for your niche', action: 'View Tags' },
            { icon: '🎯', title: 'Content gap detected', desc: 'No educational content this week', action: 'Create' }
        ];

        return recommendations.map(rec => `
            <div class="recommendation-item">
                <span class="rec-icon">${rec.icon}</span>
                <div class="rec-content">
                    <span class="rec-title">${rec.title}</span>
                    <span class="rec-desc">${rec.desc}</span>
                </div>
                <button class="btn-ghost btn-sm">${rec.action}</button>
            </div>
        `).join('');
    },

    // Render Upcoming Schedule
    renderUpcomingSchedule() {
        const contents = JSON.parse(localStorage.getItem('raycorp-contents') || '[]');
        const scheduled = contents.filter(c => c.status === 'scheduled').slice(0, 4);

        if (scheduled.length === 0) {
            return `
                <div class="empty-state-small">
                    <span class="empty-icon">📅</span>
                    <p>No scheduled content</p>
                    <button class="btn-secondary btn-sm" onclick="UltraDashboard.openScheduler()">Schedule Content</button>
                </div>
            `;
        }

        return scheduled.map(content => `
            <div class="schedule-item">
                <div class="schedule-date">
                    <span class="schedule-day">${new Date(content.scheduledDate || Date.now()).getDate()}</span>
                    <span class="schedule-month">${new Date(content.scheduledDate || Date.now()).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div class="schedule-info">
                    <span class="schedule-title">${content.title || 'Untitled'}</span>
                    <span class="schedule-platforms">${content.platforms?.join(', ') || 'Instagram'}</span>
                </div>
            </div>
        `).join('');
    },

    // Render Content Ideas
    renderContentIdeas() {
        const ideas = [
            { icon: '💡', title: 'Behind the scenes of your process', tags: ['BTS', 'Authentic'] },
            { icon: '📚', title: '5 tips for beginners in your niche', tags: ['Educational', 'Tips'] },
            { icon: '🎯', title: 'Common mistakes to avoid', tags: ['Value', 'Helpful'] },
            { icon: '✨', title: 'Success story or case study', tags: ['Social Proof', 'Story'] }
        ];

        return ideas.map(idea => `
            <div class="idea-item" onclick="UltraDashboard.useIdea('${idea.title}')">
                <span class="idea-icon">${idea.icon}</span>
                <div class="idea-content">
                    <span class="idea-title">${idea.title}</span>
                    <div class="idea-tags">
                        ${idea.tags.map(tag => `<span class="idea-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <button class="btn-icon">→</button>
            </div>
        `).join('');
    },

    // Render Platform Cards
    renderPlatformCards() {
        const platforms = [
            { name: 'Instagram', icon: '📸', color: '#E4405F', followers: '12.5K', growth: '+5.2%' },
            { name: 'TikTok', icon: '🎵', color: '#000000', followers: '8.3K', growth: '+12.8%' },
            { name: 'Twitter', icon: '🐦', color: '#1DA1F2', followers: '5.1K', growth: '+3.1%' },
            { name: 'LinkedIn', icon: '💼', color: '#0A66C2', followers: '2.8K', growth: '+7.4%' },
            { name: 'YouTube', icon: '🎬', color: '#FF0000', followers: '1.2K', growth: '+15.2%' },
            { name: 'Facebook', icon: '📘', color: '#1877F2', followers: '3.4K', growth: '+2.1%' }
        ];

        return platforms.map(p => `
            <div class="platform-card" style="border-left: 4px solid ${p.color}">
                <div class="platform-header">
                    <span class="platform-icon">${p.icon}</span>
                    <span class="platform-name">${p.name}</span>
                </div>
                <div class="platform-stats">
                    <span class="platform-followers">${p.followers}</span>
                    <span class="platform-growth positive">${p.growth}</span>
                </div>
            </div>
        `).join('');
    },

    // Add Dashboard Styles
    addDashboardStyles() {
        if (document.getElementById('ultra-dashboard-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ultra-dashboard-styles';
        styles.textContent = `
            .ai-insights-banner {
                background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
                padding: 20px 24px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 24px;
                color: white;
            }
            .insight-icon { font-size: 32px; }
            .insight-content h4 { margin: 0 0 4px 0; font-size: 14px; opacity: 0.9; }
            .insight-content p { margin: 0; font-size: 16px; font-weight: 500; }
            
            .ultra-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            .ultra-stat-card {
                padding: 20px;
                border-radius: 16px;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                color: white;
            }
            .ultra-stat-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 24px rgba(0,0,0,0.2);
            }
            .gradient-blue { background: linear-gradient(135deg, #3B82F6, #1D4ED8); }
            .gradient-purple { background: linear-gradient(135deg, #8B5CF6, #6D28D9); }
            .gradient-pink { background: linear-gradient(135deg, #EC4899, #BE185D); }
            .gradient-green { background: linear-gradient(135deg, #10B981, #047857); }
            .gradient-orange { background: linear-gradient(135deg, #F59E0B, #D97706); }
            .gradient-cyan { background: linear-gradient(135deg, #06B6D4, #0891B2); }
            
            .stat-icon-large { font-size: 28px; margin-bottom: 12px; }
            .stat-value-large { font-size: 28px; font-weight: 700; display: block; }
            .stat-label { font-size: 13px; opacity: 0.9; display: block; margin: 4px 0; }
            .stat-change { font-size: 11px; padding: 4px 8px; border-radius: 12px; background: rgba(255,255,255,0.2); }
            .stat-change.positive { color: #A7F3D0; }
            .stat-change.neutral { color: #FDE68A; }
            
            .quick-actions-panel {
                background: var(--bg-card);
                padding: 20px;
                border-radius: 16px;
                margin-bottom: 24px;
                border: 1px solid var(--border);
            }
            .quick-actions-panel h3 { margin: 0 0 16px 0; font-size: 16px; }
            .quick-actions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 12px;
            }
            .quick-action-card {
                background: var(--bg-muted);
                border: 1px solid var(--border);
                padding: 16px;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .quick-action-card:hover {
                background: var(--primary);
                color: white;
                border-color: var(--primary);
            }
            .qa-icon { font-size: 24px; }
            .qa-title { font-weight: 600; font-size: 13px; }
            .qa-desc { font-size: 11px; opacity: 0.7; }
            
            .dashboard-main-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
                margin-bottom: 24px;
            }
            @media (max-width: 1024px) {
                .dashboard-main-grid { grid-template-columns: 1fr; }
            }
            
            .dashboard-card {
                background: var(--bg-card);
                border-radius: 16px;
                border: 1px solid var(--border);
                overflow: hidden;
            }
            .dashboard-card .card-header {
                padding: 16px 20px;
                border-bottom: 1px solid var(--border);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .dashboard-card .card-header h3 { margin: 0; font-size: 15px; }
            .dashboard-card .card-body { padding: 16px 20px; }
            
            .badge-ai {
                background: linear-gradient(135deg, #6366F1, #8B5CF6);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 600;
            }
            
            .chart-container { padding: 10px 0; }
            .chart-bars {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                height: 150px;
                gap: 8px;
            }
            .chart-bar-wrapper {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }
            .chart-bar {
                width: 100%;
                background: linear-gradient(180deg, var(--primary), #4F46E5);
                border-radius: 6px 6px 0 0;
                position: relative;
                min-height: 20px;
                transition: height 0.3s;
            }
            .bar-value {
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 10px;
                color: var(--text-muted);
            }
            .bar-label { font-size: 11px; color: var(--text-muted); }
            
            .content-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 10px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .content-item:hover { background: var(--bg-muted); }
            .content-icon { font-size: 20px; }
            .content-info { flex: 1; }
            .content-title { display: block; font-weight: 500; font-size: 13px; }
            .content-meta { font-size: 11px; color: var(--text-muted); }
            .content-status {
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 500;
            }
            .status-draft { background: var(--bg-muted); color: var(--text-muted); }
            .status-scheduled { background: #FEF3C7; color: #D97706; }
            .status-published { background: #D1FAE5; color: #059669; }
            
            .recommendation-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 10px;
                background: var(--bg-muted);
                margin-bottom: 8px;
            }
            .rec-icon { font-size: 20px; }
            .rec-content { flex: 1; }
            .rec-title { display: block; font-weight: 500; font-size: 13px; }
            .rec-desc { font-size: 11px; color: var(--text-muted); }
            
            .schedule-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-left: 3px solid var(--primary);
                margin-bottom: 8px;
            }
            .schedule-date {
                text-align: center;
                min-width: 40px;
            }
            .schedule-day { display: block; font-size: 18px; font-weight: 700; }
            .schedule-month { font-size: 10px; color: var(--text-muted); text-transform: uppercase; }
            .schedule-title { display: block; font-weight: 500; font-size: 13px; }
            .schedule-platforms { font-size: 11px; color: var(--text-muted); }
            
            .idea-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 10px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .idea-item:hover { background: var(--bg-muted); }
            .idea-icon { font-size: 20px; }
            .idea-content { flex: 1; }
            .idea-title { display: block; font-weight: 500; font-size: 13px; margin-bottom: 4px; }
            .idea-tags { display: flex; gap: 6px; }
            .idea-tag {
                background: var(--bg-muted);
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 10px;
                color: var(--text-muted);
            }
            
            .platform-analytics-section {
                background: var(--bg-card);
                padding: 20px;
                border-radius: 16px;
                border: 1px solid var(--border);
            }
            .platform-analytics-section h3 { margin: 0 0 16px 0; }
            .platform-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 12px;
            }
            .platform-card {
                background: var(--bg-muted);
                padding: 16px;
                border-radius: 12px;
            }
            .platform-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
            }
            .platform-icon { font-size: 20px; }
            .platform-name { font-weight: 500; font-size: 13px; }
            .platform-followers { font-size: 20px; font-weight: 700; display: block; }
            .platform-growth { font-size: 12px; }
            .platform-growth.positive { color: var(--success); }
            
            .empty-state-small {
                text-align: center;
                padding: 24px;
            }
            .empty-icon { font-size: 32px; display: block; margin-bottom: 8px; }
            .empty-state-small p { color: var(--text-muted); margin: 0 0 12px 0; font-size: 13px; }
            
            .time-selector {
                padding: 8px 16px;
                border: 1px solid var(--border);
                border-radius: 8px;
                background: var(--bg-input);
                color: var(--text-primary);
                font-size: 13px;
            }
        `;
        document.head.appendChild(styles);
    },

    // Dynamic Data Loading
    async loadDynamicData() {
        await this.generateDailyInsight();
        this.updateStats();
    },

    // Generate AI Daily Insight
    async generateDailyInsight() {
        const insightEl = document.getElementById('daily-insight');
        if (!insightEl) return;

        const insights = [
            "Your video content is performing 45% better than images this week. Consider creating more short-form videos!",
            "Best posting time detected: 7 PM - 9 PM. Your audience engagement peaks during these hours.",
            "Educational content is trending in your niche. Try creating a 'How-to' series!",
            "Your hashtag strategy is working! Top performing tags: #ContentCreator #DigitalMarketing",
            "Carousel posts are getting 3x more saves. Great for building your content library!",
            "Your audience loves behind-the-scenes content. Share more of your creative process!"
        ];

        insightEl.textContent = insights[Math.floor(Math.random() * insights.length)];
    },

    async generateNewInsight() {
        const insightEl = document.getElementById('daily-insight');
        if (!insightEl) return;

        insightEl.textContent = 'Generating new insight...';
        
        if (window.UltraAIEngine) {
            try {
                const result = await UltraAIEngine.generateText(
                    'Generate a short, actionable social media content insight for a content creator. Keep it under 100 characters.',
                    { temperature: 0.9 }
                );
                if (result.success) {
                    insightEl.textContent = result.content;
                }
            } catch (e) {
                await this.generateDailyInsight();
            }
        } else {
            await this.generateDailyInsight();
        }
    },

    // Update Stats
    updateStats() {
        const stats = this.getStats();
        
        const statTotal = document.getElementById('stat-total');
        const statDraft = document.getElementById('stat-draft');
        const statScheduled = document.getElementById('stat-scheduled');
        const statPublished = document.getElementById('stat-published');

        if (statTotal) statTotal.textContent = stats.totalContent;
        if (statDraft) statDraft.textContent = stats.totalContent > 0 ? Math.floor(stats.totalContent * 0.4) : 0;
        if (statScheduled) statScheduled.textContent = stats.scheduled;
        if (statPublished) statPublished.textContent = stats.totalContent > 0 ? Math.floor(stats.totalContent * 0.3) : 0;
    },

    // Refresh Data
    refreshData() {
        this.state.lastUpdate = Date.now();
        this.saveState();
        this.renderDashboard();
        this.showToast('Dashboard refreshed! ✅', 'success');
    },

    // Set Time Range
    setTimeRange(range) {
        this.state.timeRange = range;
        this.saveState();
        this.refreshData();
    },

    // Export Report
    async exportReport() {
        const stats = this.getStats();
        const contents = JSON.parse(localStorage.getItem('raycorp-contents') || '[]');
        
        const report = {
            generatedAt: new Date().toISOString(),
            timeRange: this.state.timeRange,
            summary: stats,
            contentBreakdown: {
                total: contents.length,
                byStatus: this.groupBy(contents, 'status'),
                byType: this.groupBy(contents, 'type')
            },
            recommendations: [
                'Increase video content production',
                'Post more during peak hours (7-9 PM)',
                'Engage more with comments'
            ]
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `raycorp-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Report exported! 📤', 'success');
    },

    groupBy(array, key) {
        return array.reduce((result, item) => {
            const value = item[key] || 'unknown';
            result[value] = (result[value] || 0) + 1;
            return result;
        }, {});
    },

    // Navigation Actions
    openBulkCreate() {
        if (typeof BulkCreate !== 'undefined') {
            BulkCreate.open();
        } else {
            navigateTo('generator');
        }
    },

    openScheduler() {
        navigateTo('content-hub');
        setTimeout(() => {
            if (typeof ContentHub !== 'undefined') {
                ContentHub.switchView('calendar');
            }
        }, 100);
    },

    openAnalytics() {
        this.showAnalyticsModal();
    },

    openAIAssistant() {
        if (typeof AIReceptionist !== 'undefined') {
            AIReceptionist.open();
        }
    },

    openCalendar() {
        this.openScheduler();
    },

    viewContent(id) {
        navigateTo('content-hub');
        setTimeout(() => {
            if (typeof ContentHub !== 'undefined') {
                ContentHub.editContent(id);
            }
        }, 100);
    },

    viewAllPerformance() {
        this.showAnalyticsModal();
    },

    drillDown(metric) {
        console.log('Drilling down into:', metric);
        this.showAnalyticsModal(metric);
    },

    useIdea(idea) {
        navigateTo('generator');
        setTimeout(() => {
            const topicInput = document.getElementById('gen-topic');
            if (topicInput) {
                topicInput.value = idea;
                topicInput.focus();
            }
        }, 100);
    },

    async generateIdeas() {
        const ideasContainer = document.getElementById('content-ideas');
        if (!ideasContainer) return;

        ideasContainer.innerHTML = '<div class="loading-state">🤖 Generating ideas...</div>';

        if (window.UltraAIEngine) {
            try {
                const result = await UltraAIEngine.generateText(
                    'Generate 4 creative content ideas for social media. Format each as: emoji | title | 2 tags. Separate with newlines.',
                    { temperature: 0.9 }
                );
                
                if (result.success) {
                    // Parse and display ideas
                    const lines = result.content.split('\n').filter(l => l.trim());
                    const ideas = lines.slice(0, 4).map(line => {
                        const parts = line.split('|').map(p => p.trim());
                        return {
                            icon: parts[0] || '💡',
                            title: parts[1] || line,
                            tags: (parts[2] || 'Content, Creative').split(',').map(t => t.trim())
                        };
                    });

                    ideasContainer.innerHTML = ideas.map(idea => `
                        <div class="idea-item" onclick="UltraDashboard.useIdea('${idea.title.replace(/'/g, "\\'")}')">
                            <span class="idea-icon">${idea.icon}</span>
                            <div class="idea-content">
                                <span class="idea-title">${idea.title}</span>
                                <div class="idea-tags">
                                    ${idea.tags.map(tag => `<span class="idea-tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                            <button class="btn-icon">→</button>
                        </div>
                    `).join('');
                }
            } catch (e) {
                ideasContainer.innerHTML = this.renderContentIdeas();
            }
        } else {
            ideasContainer.innerHTML = this.renderContentIdeas();
        }
    },

    // Show Analytics Modal
    showAnalyticsModal(metric = null) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>📊 Detailed Analytics</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="analytics-tabs">
                        <button class="analytics-tab active" data-tab="overview">Overview</button>
                        <button class="analytics-tab" data-tab="engagement">Engagement</button>
                        <button class="analytics-tab" data-tab="content">Content</button>
                        <button class="analytics-tab" data-tab="audience">Audience</button>
                    </div>
                    <div class="analytics-content">
                        <div class="analytics-grid">
                            <div class="analytics-card">
                                <h4>Total Reach</h4>
                                <span class="analytics-value">${this.formatNumber(Math.floor(Math.random() * 100000) + 10000)}</span>
                                <span class="analytics-change positive">+12.5%</span>
                            </div>
                            <div class="analytics-card">
                                <h4>Engagement Rate</h4>
                                <span class="analytics-value">${(Math.random() * 10 + 3).toFixed(1)}%</span>
                                <span class="analytics-change positive">+2.3%</span>
                            </div>
                            <div class="analytics-card">
                                <h4>Avg. Likes</h4>
                                <span class="analytics-value">${Math.floor(Math.random() * 500) + 100}</span>
                                <span class="analytics-change positive">+8.7%</span>
                            </div>
                            <div class="analytics-card">
                                <h4>Avg. Comments</h4>
                                <span class="analytics-value">${Math.floor(Math.random() * 50) + 10}</span>
                                <span class="analytics-change positive">+15.2%</span>
                            </div>
                        </div>
                        <div class="analytics-chart-placeholder">
                            <p>📈 Detailed charts and graphs would appear here</p>
                            <p style="font-size: 12px; color: var(--text-muted);">Connect your social accounts in Settings to see real data</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // Toast notification
    showToast(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(message);
        }
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.UltraDashboard = UltraDashboard;
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltraDashboard;
}
