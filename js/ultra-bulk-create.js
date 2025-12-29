// ==================== ULTRA BULK CREATE ====================
// Mass Content Generation System with AI
// Version 4.0 - December 2025

const UltraBulkCreate = {
    // State
    state: {
        isOpen: false,
        topics: [],
        settings: {
            types: ['text_article'],
            platforms: ['instagram'],
            tone: 'professional',
            generateHashtags: true,
            generateImages: false,
            autoSave: true
        },
        results: [],
        isGenerating: false,
        progress: 0
    },

    // Initialize
    init() {
        console.log('📦 Ultra Bulk Create initialized');
        return this;
    },

    // Open Bulk Create Modal
    open() {
        this.state.isOpen = true;
        this.renderModal();
    },

    // Close Modal
    close() {
        this.state.isOpen = false;
        const modal = document.getElementById('bulk-create-modal');
        if (modal) modal.remove();
    },

    // Render Modal
    renderModal() {
        const existing = document.getElementById('bulk-create-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'bulk-create-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 90vh;">
                <div class="modal-header">
                    <div>
                        <h2>📦 Bulk Content Creator</h2>
                        <p style="margin:4px 0 0;font-size:12px;color:var(--text-muted);">Generate multiple content pieces at once</p>
                    </div>
                    <button class="modal-close" onclick="UltraBulkCreate.close()">×</button>
                </div>
                
                <div class="modal-body" style="padding:0;">
                    <!-- Tabs -->
                    <div class="bulk-tabs">
                        <button class="bulk-tab active" data-tab="topics" onclick="UltraBulkCreate.switchTab('topics')">1. Topics</button>
                        <button class="bulk-tab" data-tab="settings" onclick="UltraBulkCreate.switchTab('settings')">2. Settings</button>
                        <button class="bulk-tab" data-tab="generate" onclick="UltraBulkCreate.switchTab('generate')">3. Generate</button>
                        <button class="bulk-tab" data-tab="results" onclick="UltraBulkCreate.switchTab('results')">4. Results</button>
                    </div>

                    <!-- Topics Tab -->
                    <div class="bulk-tab-content active" id="tab-topics">
                        <div class="bulk-section">
                            <h3>📝 Enter Topics</h3>
                            <p class="section-desc">Add multiple topics (one per line) or use AI to generate them</p>
                            
                            <textarea id="bulk-topics" rows="8" placeholder="Enter topics, one per line...&#10;&#10;Example:&#10;Tips membangun personal brand&#10;Cara meningkatkan engagement&#10;Strategi content marketing 2025"></textarea>
                            
                            <div class="bulk-topic-actions">
                                <button class="btn-secondary" onclick="UltraBulkCreate.generateTopics()">
                                    🤖 AI Generate Topics
                                </button>
                                <button class="btn-secondary" onclick="UltraBulkCreate.loadFromFile()">
                                    📁 Load from File
                                </button>
                                <span class="topic-count" id="topic-count">0 topics</span>
                            </div>
                        </div>

                        <div class="bulk-section">
                            <h3>💡 Quick Topic Ideas</h3>
                            <div class="quick-topic-chips">
                                <button class="topic-chip" onclick="UltraBulkCreate.addQuickTopic('Tips dan trik untuk pemula')">Tips untuk Pemula</button>
                                <button class="topic-chip" onclick="UltraBulkCreate.addQuickTopic('Behind the scenes proses kerja')">Behind the Scenes</button>
                                <button class="topic-chip" onclick="UltraBulkCreate.addQuickTopic('Kesalahan umum yang harus dihindari')">Common Mistakes</button>
                                <button class="topic-chip" onclick="UltraBulkCreate.addQuickTopic('Tren terbaru di industri')">Industry Trends</button>
                                <button class="topic-chip" onclick="UltraBulkCreate.addQuickTopic('Q&A dengan audience')">Q&A Session</button>
                                <button class="topic-chip" onclick="UltraBulkCreate.addQuickTopic('Success story dan case study')">Success Stories</button>
                            </div>
                        </div>
                    </div>

                    <!-- Settings Tab -->
                    <div class="bulk-tab-content" id="tab-settings">
                        <div class="bulk-section">
                            <h3>📱 Content Types</h3>
                            <div class="type-checkboxes">
                                <label class="type-checkbox">
                                    <input type="checkbox" value="text_article" checked onchange="UltraBulkCreate.updateSettings()">
                                    <span>📝 Article</span>
                                </label>
                                <label class="type-checkbox">
                                    <input type="checkbox" value="text_thread" onchange="UltraBulkCreate.updateSettings()">
                                    <span>🐦 Thread</span>
                                </label>
                                <label class="type-checkbox">
                                    <input type="checkbox" value="video_short" onchange="UltraBulkCreate.updateSettings()">
                                    <span>📱 Short Video</span>
                                </label>
                                <label class="type-checkbox">
                                    <input type="checkbox" value="image_carousel" onchange="UltraBulkCreate.updateSettings()">
                                    <span>🎨 Carousel</span>
                                </label>
                            </div>
                        </div>

                        <div class="bulk-section">
                            <h3>🌐 Platforms</h3>
                            <div class="platform-checkboxes">
                                <label class="platform-checkbox">
                                    <input type="checkbox" value="instagram" checked onchange="UltraBulkCreate.updateSettings()">
                                    <span>📸 Instagram</span>
                                </label>
                                <label class="platform-checkbox">
                                    <input type="checkbox" value="tiktok" onchange="UltraBulkCreate.updateSettings()">
                                    <span>🎵 TikTok</span>
                                </label>
                                <label class="platform-checkbox">
                                    <input type="checkbox" value="twitter" onchange="UltraBulkCreate.updateSettings()">
                                    <span>🐦 Twitter</span>
                                </label>
                                <label class="platform-checkbox">
                                    <input type="checkbox" value="linkedin" onchange="UltraBulkCreate.updateSettings()">
                                    <span>💼 LinkedIn</span>
                                </label>
                            </div>
                        </div>

                        <div class="bulk-section">
                            <h3>⚙️ Generation Options</h3>
                            <div class="settings-grid">
                                <div class="form-group">
                                    <label>Tone</label>
                                    <select id="bulk-tone" onchange="UltraBulkCreate.updateSettings()">
                                        <option value="professional">Professional</option>
                                        <option value="casual">Casual</option>
                                        <option value="educational">Educational</option>
                                        <option value="inspirational">Inspirational</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Language</label>
                                    <select id="bulk-language" onchange="UltraBulkCreate.updateSettings()">
                                        <option value="id">Indonesian</option>
                                        <option value="en">English</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                            </div>
                            <div class="toggle-options">
                                <label class="toggle-option">
                                    <span>Auto-generate hashtags</span>
                                    <input type="checkbox" checked id="bulk-hashtags" onchange="UltraBulkCreate.updateSettings()">
                                </label>
                                <label class="toggle-option">
                                    <span>Auto-save to Content Hub</span>
                                    <input type="checkbox" checked id="bulk-autosave" onchange="UltraBulkCreate.updateSettings()">
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Generate Tab -->
                    <div class="bulk-tab-content" id="tab-generate">
                        <div class="bulk-section">
                            <h3>🚀 Ready to Generate</h3>
                            <div class="generation-summary">
                                <div class="summary-item">
                                    <span class="summary-label">Topics</span>
                                    <span class="summary-value" id="summary-topics">0</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">Content Types</span>
                                    <span class="summary-value" id="summary-types">1</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">Total Content</span>
                                    <span class="summary-value highlight" id="summary-total">0</span>
                                </div>
                            </div>

                            <div class="generation-progress" id="generation-progress" style="display:none;">
                                <div class="progress-bar">
                                    <div class="progress-fill" id="progress-fill" style="width:0%"></div>
                                </div>
                                <div class="progress-text">
                                    <span id="progress-status">Generating...</span>
                                    <span id="progress-percent">0%</span>
                                </div>
                            </div>

                            <button class="btn-primary btn-large" id="start-generation-btn" onclick="UltraBulkCreate.startGeneration()">
                                ⚡ Start Bulk Generation
                            </button>
                        </div>

                        <div class="bulk-section">
                            <h3>⏱️ Estimated Time</h3>
                            <p class="estimate-text" id="estimate-text">Add topics to see estimate</p>
                        </div>
                    </div>

                    <!-- Results Tab -->
                    <div class="bulk-tab-content" id="tab-results">
                        <div class="bulk-section">
                            <div class="results-header">
                                <h3>✅ Generated Content</h3>
                                <div class="results-actions">
                                    <button class="btn-secondary" onclick="UltraBulkCreate.exportResults()">📤 Export All</button>
                                    <button class="btn-primary" onclick="UltraBulkCreate.saveAllToHub()">💾 Save All to Hub</button>
                                </div>
                            </div>
                            <div class="results-list" id="results-list">
                                <div class="empty-state">
                                    <span class="empty-icon">📦</span>
                                    <p>No content generated yet</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.addStyles();
        this.updateTopicCount();
    },

    // Switch Tab
    switchTab(tabId) {
        document.querySelectorAll('.bulk-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        document.querySelectorAll('.bulk-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabId}`);
        });

        if (tabId === 'generate') {
            this.updateSummary();
        }
    },

    // Update Topic Count
    updateTopicCount() {
        const textarea = document.getElementById('bulk-topics');
        const countEl = document.getElementById('topic-count');
        if (textarea && countEl) {
            const topics = textarea.value.split('\n').filter(t => t.trim());
            this.state.topics = topics;
            countEl.textContent = `${topics.length} topics`;
        }
    },

    // Add Quick Topic
    addQuickTopic(topic) {
        const textarea = document.getElementById('bulk-topics');
        if (textarea) {
            const current = textarea.value.trim();
            textarea.value = current ? `${current}\n${topic}` : topic;
            this.updateTopicCount();
        }
    },

    // Generate Topics with AI
    async generateTopics() {
        const btn = document.querySelector('.bulk-topic-actions .btn-secondary');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '🤖 Generating...';
        }

        try {
            if (window.UltraAIEngine) {
                const result = await UltraAIEngine.generateText(
                    'Generate 10 creative content topics for social media marketing. Topics should be diverse and engaging. Return only the topics, one per line, without numbering.',
                    { temperature: 0.9 }
                );

                if (result.success) {
                    const textarea = document.getElementById('bulk-topics');
                    if (textarea) {
                        const current = textarea.value.trim();
                        textarea.value = current ? `${current}\n${result.content}` : result.content;
                        this.updateTopicCount();
                    }
                }
            }
        } catch (e) {
            console.error('Topic generation failed:', e);
        }

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🤖 AI Generate Topics';
        }
    },

    // Load from File
    loadFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                const textarea = document.getElementById('bulk-topics');
                if (textarea) {
                    textarea.value = ev.target.result;
                    this.updateTopicCount();
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    // Update Settings
    updateSettings() {
        // Get selected types
        const types = [];
        document.querySelectorAll('.type-checkbox input:checked').forEach(cb => {
            types.push(cb.value);
        });
        this.state.settings.types = types;

        // Get selected platforms
        const platforms = [];
        document.querySelectorAll('.platform-checkbox input:checked').forEach(cb => {
            platforms.push(cb.value);
        });
        this.state.settings.platforms = platforms;

        // Get other settings
        this.state.settings.tone = document.getElementById('bulk-tone')?.value || 'professional';
        this.state.settings.language = document.getElementById('bulk-language')?.value || 'id';
        this.state.settings.generateHashtags = document.getElementById('bulk-hashtags')?.checked || false;
        this.state.settings.autoSave = document.getElementById('bulk-autosave')?.checked || false;
    },

    // Update Summary
    updateSummary() {
        const topicsCount = this.state.topics.length;
        const typesCount = this.state.settings.types.length;
        const totalCount = topicsCount * typesCount;

        document.getElementById('summary-topics').textContent = topicsCount;
        document.getElementById('summary-types').textContent = typesCount;
        document.getElementById('summary-total').textContent = totalCount;

        // Estimate time (roughly 5 seconds per content)
        const estimatedSeconds = totalCount * 5;
        const minutes = Math.floor(estimatedSeconds / 60);
        const seconds = estimatedSeconds % 60;
        document.getElementById('estimate-text').textContent = 
            totalCount > 0 ? `Approximately ${minutes}m ${seconds}s for ${totalCount} content pieces` : 'Add topics to see estimate';
    },

    // Start Generation
    async startGeneration() {
        if (this.state.topics.length === 0) {
            this.showToast('Please add at least one topic', 'error');
            return;
        }

        if (this.state.settings.types.length === 0) {
            this.showToast('Please select at least one content type', 'error');
            return;
        }

        this.state.isGenerating = true;
        this.state.results = [];
        this.state.progress = 0;

        // Show progress
        document.getElementById('generation-progress').style.display = 'block';
        document.getElementById('start-generation-btn').disabled = true;
        document.getElementById('start-generation-btn').innerHTML = '⏳ Generating...';

        const totalItems = this.state.topics.length * this.state.settings.types.length;
        let completed = 0;

        for (const topic of this.state.topics) {
            for (const type of this.state.settings.types) {
                try {
                    const content = await this.generateContent(topic, type);
                    this.state.results.push(content);
                    
                    completed++;
                    this.updateProgress(completed, totalItems);
                } catch (e) {
                    console.error('Generation error:', e);
                }
            }
        }

        this.state.isGenerating = false;
        document.getElementById('start-generation-btn').disabled = false;
        document.getElementById('start-generation-btn').innerHTML = '⚡ Start Bulk Generation';

        // Auto-save if enabled
        if (this.state.settings.autoSave) {
            this.saveAllToHub();
        }

        // Switch to results tab
        this.switchTab('results');
        this.renderResults();
        this.showToast(`Generated ${this.state.results.length} content pieces! 🎉`, 'success');
    },

    // Generate Single Content
    async generateContent(topic, type) {
        const typeNames = {
            'text_article': 'article/caption',
            'text_thread': 'Twitter thread',
            'video_short': 'short video script',
            'image_carousel': 'carousel slides'
        };

        const prompt = `Create a ${typeNames[type] || 'content'} about: ${topic}

Requirements:
- Tone: ${this.state.settings.tone}
- Language: ${this.state.settings.language === 'id' ? 'Indonesian' : this.state.settings.language === 'en' ? 'English' : 'Both Indonesian and English'}
- Platform optimized for: ${this.state.settings.platforms.join(', ')}
${this.state.settings.generateHashtags ? '- Include relevant hashtags' : ''}

Make it engaging and ready to post.`;

        let content = '';
        
        if (window.UltraAIEngine) {
            const result = await UltraAIEngine.generateText(prompt, {
                temperature: 0.8,
                maxTokens: 1500
            });
            content = result.success ? result.content : `[Content for: ${topic}]`;
        } else {
            content = `[Generated content for: ${topic}]`;
        }

        return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: topic,
            type,
            content,
            platforms: this.state.settings.platforms,
            tone: this.state.settings.tone,
            status: 'draft',
            createdAt: Date.now(),
            aiGenerated: true
        };
    },

    // Update Progress
    updateProgress(completed, total) {
        const percent = Math.round((completed / total) * 100);
        this.state.progress = percent;

        document.getElementById('progress-fill').style.width = `${percent}%`;
        document.getElementById('progress-percent').textContent = `${percent}%`;
        document.getElementById('progress-status').textContent = `Generating ${completed}/${total}...`;
    },

    // Render Results
    renderResults() {
        const container = document.getElementById('results-list');
        if (!container) return;

        if (this.state.results.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📦</span>
                    <p>No content generated yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.state.results.map((item, index) => `
            <div class="result-item">
                <div class="result-header">
                    <span class="result-type">${this.getTypeIcon(item.type)} ${item.type}</span>
                    <div class="result-actions">
                        <button class="btn-icon-sm" onclick="UltraBulkCreate.copyResult(${index})" title="Copy">📋</button>
                        <button class="btn-icon-sm" onclick="UltraBulkCreate.editResult(${index})" title="Edit">✏️</button>
                        <button class="btn-icon-sm" onclick="UltraBulkCreate.deleteResult(${index})" title="Delete">🗑️</button>
                    </div>
                </div>
                <h4 class="result-title">${item.title}</h4>
                <p class="result-preview">${this.truncate(item.content, 150)}</p>
                <div class="result-footer">
                    <span class="result-platforms">${item.platforms.map(p => this.getPlatformIcon(p)).join(' ')}</span>
                </div>
            </div>
        `).join('');
    },

    getTypeIcon(type) {
        const icons = {
            'text_article': '📝',
            'text_thread': '🐦',
            'video_short': '📱',
            'image_carousel': '🎨'
        };
        return icons[type] || '📄';
    },

    getPlatformIcon(platform) {
        const icons = {
            'instagram': '📸',
            'tiktok': '🎵',
            'twitter': '🐦',
            'linkedin': '💼'
        };
        return icons[platform] || '🌐';
    },

    truncate(text, length) {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    },

    // Result Actions
    copyResult(index) {
        const item = this.state.results[index];
        if (item) {
            navigator.clipboard.writeText(item.content);
            this.showToast('Copied to clipboard! 📋', 'success');
        }
    },

    editResult(index) {
        const item = this.state.results[index];
        if (!item) return;

        const newContent = prompt('Edit content:', item.content);
        if (newContent !== null) {
            this.state.results[index].content = newContent;
            this.renderResults();
        }
    },

    deleteResult(index) {
        if (confirm('Delete this content?')) {
            this.state.results.splice(index, 1);
            this.renderResults();
        }
    },

    // Save All to Hub
    saveAllToHub() {
        const contents = JSON.parse(localStorage.getItem('raycorp-contents') || '[]');
        
        this.state.results.forEach(item => {
            contents.push({
                ...item,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
            });
        });

        localStorage.setItem('raycorp-contents', JSON.stringify(contents));
        this.showToast(`Saved ${this.state.results.length} items to Content Hub! 💾`, 'success');
    },

    // Export Results
    exportResults() {
        const data = {
            exportedAt: new Date().toISOString(),
            count: this.state.results.length,
            contents: this.state.results
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bulk-content-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Exported! 📤', 'success');
    },

    showToast(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        }
    },

    // Add Styles
    addStyles() {
        if (document.getElementById('bulk-create-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'bulk-create-styles';
        styles.textContent = `
            .bulk-tabs {
                display: flex;
                border-bottom: 1px solid var(--border);
            }
            .bulk-tab {
                flex: 1;
                padding: 14px;
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
            }
            .bulk-tab.active {
                color: var(--primary);
                border-bottom: 2px solid var(--primary);
            }
            .bulk-tab-content {
                display: none;
                padding: 20px;
            }
            .bulk-tab-content.active { display: block; }
            
            .bulk-section {
                margin-bottom: 24px;
            }
            .bulk-section h3 {
                margin: 0 0 8px 0;
                font-size: 15px;
            }
            .section-desc {
                color: var(--text-muted);
                font-size: 12px;
                margin: 0 0 12px 0;
            }
            
            #bulk-topics {
                width: 100%;
                padding: 12px;
                border: 2px solid var(--border);
                border-radius: 12px;
                background: var(--bg-input);
                color: var(--text-primary);
                font-size: 13px;
                resize: vertical;
            }
            
            .bulk-topic-actions {
                display: flex;
                gap: 12px;
                margin-top: 12px;
                align-items: center;
            }
            .topic-count {
                margin-left: auto;
                font-size: 12px;
                color: var(--text-muted);
            }
            
            .quick-topic-chips {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .topic-chip {
                padding: 8px 14px;
                background: var(--bg-muted);
                border: 1px solid var(--border);
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            .topic-chip:hover {
                background: var(--primary);
                color: white;
                border-color: var(--primary);
            }
            
            .type-checkboxes, .platform-checkboxes {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 10px;
            }
            .type-checkbox, .platform-checkbox {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px;
                background: var(--bg-muted);
                border: 1px solid var(--border);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .type-checkbox:has(input:checked),
            .platform-checkbox:has(input:checked) {
                background: var(--primary);
                color: white;
                border-color: var(--primary);
            }
            
            .settings-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            
            .toggle-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 16px;
            }
            .toggle-option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: var(--bg-muted);
                border-radius: 10px;
            }
            
            .generation-summary {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                margin-bottom: 24px;
            }
            .summary-item {
                text-align: center;
                padding: 16px;
                background: var(--bg-muted);
                border-radius: 12px;
            }
            .summary-label {
                display: block;
                font-size: 12px;
                color: var(--text-muted);
                margin-bottom: 4px;
            }
            .summary-value {
                font-size: 24px;
                font-weight: 700;
            }
            .summary-value.highlight {
                color: var(--primary);
            }
            
            .generation-progress {
                margin-bottom: 20px;
            }
            .progress-bar {
                height: 8px;
                background: var(--bg-muted);
                border-radius: 4px;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                background: var(--gradient-primary);
                transition: width 0.3s;
            }
            .progress-text {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
                font-size: 12px;
                color: var(--text-muted);
            }
            
            .btn-large {
                width: 100%;
                padding: 16px;
                font-size: 15px;
            }
            
            .estimate-text {
                color: var(--text-muted);
                font-size: 13px;
            }
            
            .results-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }
            .results-actions {
                display: flex;
                gap: 8px;
            }
            
            .results-list {
                max-height: 400px;
                overflow-y: auto;
            }
            .result-item {
                padding: 16px;
                background: var(--bg-muted);
                border-radius: 12px;
                margin-bottom: 12px;
            }
            .result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            .result-type {
                font-size: 11px;
                color: var(--text-muted);
            }
            .result-title {
                margin: 0 0 8px 0;
                font-size: 14px;
            }
            .result-preview {
                font-size: 12px;
                color: var(--text-muted);
                margin: 0 0 12px 0;
                line-height: 1.5;
            }
            .result-footer {
                font-size: 14px;
            }
        `;
        document.head.appendChild(styles);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.UltraBulkCreate = UltraBulkCreate.init();
    window.BulkCreate = UltraBulkCreate; // Alias
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltraBulkCreate;
}
