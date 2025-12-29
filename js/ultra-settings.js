// ==================== ULTRA SETTINGS ====================
// Complete Settings System with AI Integration
// Version 3.0 - December 2025

const UltraSettings = {
    // Default settings
    defaults: {
        // Brand Settings
        brand: {
            name: '',
            tagline: '',
            description: '',
            industry: '',
            website: '',
            email: '',
            phone: '',
            address: '',
            primaryColor: '#6366F1',
            secondaryColor: '#EC4899',
            accentColor: '#10B981',
            logo: null
        },
        // AI Settings
        ai: {
            provider: 'pollinations',
            model: 'openai',
            temperature: 0.7,
            maxTokens: 2000,
            language: 'id',
            tone: 'professional',
            creativity: 'balanced',
            autoSuggest: true,
            smartComplete: true
        },
        // Content Settings
        content: {
            defaultPlatforms: ['instagram', 'tiktok'],
            defaultTone: 'casual',
            autoHashtags: true,
            hashtagCount: 20,
            autoEmoji: true,
            emojiLevel: 'moderate',
            contentPillars: ['Education', 'Inspiration', 'Entertainment', 'Promotion'],
            postingSchedule: {
                monday: ['09:00', '12:00', '18:00'],
                tuesday: ['09:00', '12:00', '18:00'],
                wednesday: ['09:00', '12:00', '18:00'],
                thursday: ['09:00', '12:00', '18:00'],
                friday: ['09:00', '12:00', '18:00'],
                saturday: ['10:00', '15:00'],
                sunday: ['10:00', '15:00']
            }
        },
        // Social Media Accounts
        social: {
            instagram: { username: '', connected: false },
            tiktok: { username: '', connected: false },
            twitter: { username: '', connected: false },
            linkedin: { username: '', connected: false },
            facebook: { username: '', connected: false },
            youtube: { username: '', connected: false }
        },
        // API Keys
        apiKeys: {
            googleOpal: '',
            openai: '',
            anthropic: '',
            stability: '',
            elevenlabs: '',
            custom: []
        },
        // Appearance
        appearance: {
            theme: 'dark',
            accentColor: '#6366F1',
            fontSize: 'medium',
            compactMode: false,
            animations: true,
            soundEffects: false
        },
        // Notifications
        notifications: {
            email: true,
            browser: true,
            contentReminders: true,
            weeklyReport: true,
            aiSuggestions: true
        },
        // Export Settings
        export: {
            format: 'json',
            includeImages: true,
            compression: false
        },
        // Knowledge Base
        knowledgeBase: {
            documents: [],
            autoIndex: true,
            searchEnabled: true
        }
    },

    // Current settings
    current: null,

    // Initialize
    init() {
        this.load();
        this.renderSettingsPage();
        console.log('⚙️ UltraSettings initialized');
    },

    // Load settings from localStorage
    load() {
        const saved = localStorage.getItem('raycorp-settings');
        if (saved) {
            this.current = { ...this.defaults, ...JSON.parse(saved) };
        } else {
            this.current = { ...this.defaults };
        }
        return this.current;
    },

    // Save settings
    save() {
        localStorage.setItem('raycorp-settings', JSON.stringify(this.current));
        this.showToast('Settings saved! ✅', 'success');
    },

    // Get setting value
    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.current);
    },

    // Set setting value
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.current);
        target[lastKey] = value;
        this.save();
    },

    // Show toast notification
    showToast(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(message);
        }
    },

    // Render complete settings page
    renderSettingsPage() {
        const container = document.getElementById('settings');
        if (!container) return;

        container.innerHTML = `
            <div class="section-header">
                <div>
                    <h1>⚙️ Ultra Settings</h1>
                    <p>Configure your workspace, AI, and integrations</p>
                </div>
                <div class="header-actions">
                    <button class="btn-secondary" onclick="UltraSettings.resetToDefaults()">🔄 Reset Defaults</button>
                    <button class="btn-primary" onclick="UltraSettings.save()">💾 Save All</button>
                </div>
            </div>

            <!-- Settings Navigation -->
            <div class="settings-layout">
                <div class="settings-nav">
                    <button class="settings-nav-item active" data-tab="brand" onclick="UltraSettings.switchTab('brand')">
                        <span class="nav-icon">🏢</span>
                        <span>Brand Profile</span>
                    </button>
                    <button class="settings-nav-item" data-tab="ai" onclick="UltraSettings.switchTab('ai')">
                        <span class="nav-icon">🤖</span>
                        <span>AI Configuration</span>
                    </button>
                    <button class="settings-nav-item" data-tab="content" onclick="UltraSettings.switchTab('content')">
                        <span class="nav-icon">📝</span>
                        <span>Content Settings</span>
                    </button>
                    <button class="settings-nav-item" data-tab="social" onclick="UltraSettings.switchTab('social')">
                        <span class="nav-icon">📱</span>
                        <span>Social Accounts</span>
                    </button>
                    <button class="settings-nav-item" data-tab="api" onclick="UltraSettings.switchTab('api')">
                        <span class="nav-icon">🔑</span>
                        <span>API Keys</span>
                    </button>
                    <button class="settings-nav-item" data-tab="appearance" onclick="UltraSettings.switchTab('appearance')">
                        <span class="nav-icon">🎨</span>
                        <span>Appearance</span>
                    </button>
                    <button class="settings-nav-item" data-tab="notifications" onclick="UltraSettings.switchTab('notifications')">
                        <span class="nav-icon">🔔</span>
                        <span>Notifications</span>
                    </button>
                    <button class="settings-nav-item" data-tab="knowledge" onclick="UltraSettings.switchTab('knowledge')">
                        <span class="nav-icon">📚</span>
                        <span>Knowledge Base</span>
                    </button>
                    <button class="settings-nav-item" data-tab="data" onclick="UltraSettings.switchTab('data')">
                        <span class="nav-icon">💾</span>
                        <span>Data Management</span>
                    </button>
                    <button class="settings-nav-item" data-tab="advanced" onclick="UltraSettings.switchTab('advanced')">
                        <span class="nav-icon">⚡</span>
                        <span>Advanced</span>
                    </button>
                </div>

                <div class="settings-content">
                    ${this.renderBrandTab()}
                    ${this.renderAITab()}
                    ${this.renderContentTab()}
                    ${this.renderSocialTab()}
                    ${this.renderAPITab()}
                    ${this.renderAppearanceTab()}
                    ${this.renderNotificationsTab()}
                    ${this.renderKnowledgeTab()}
                    ${this.renderDataTab()}
                    ${this.renderAdvancedTab()}
                </div>
            </div>
        `;

        this.addSettingsStyles();
        this.populateFormValues();
    },

    // Switch tab
    switchTab(tabId) {
        document.querySelectorAll('.settings-nav-item').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`settings-${tabId}`).classList.add('active');
    },

    // Render Brand Tab
    renderBrandTab() {
        return `
            <div id="settings-brand" class="settings-tab active">
                <div class="settings-section">
                    <h3>🏢 Brand Identity</h3>
                    <p class="section-desc">Define your brand for personalized AI content generation</p>
                    
                    <div class="settings-grid">
                        <div class="form-group">
                            <label>Brand/Company Name</label>
                            <input type="text" id="brand-name" placeholder="e.g., raycorp" onchange="UltraSettings.set('brand.name', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Tagline</label>
                            <input type="text" id="brand-tagline" placeholder="e.g., Empowering Your Digital Journey" onchange="UltraSettings.set('brand.tagline', this.value)">
                        </div>
                        <div class="form-group full-width">
                            <label>Brand Description</label>
                            <textarea id="brand-description" rows="3" placeholder="Describe your brand, mission, and values..." onchange="UltraSettings.set('brand.description', this.value)"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Industry</label>
                            <select id="brand-industry" onchange="UltraSettings.set('brand.industry', this.value)">
                                <option value="">Select Industry</option>
                                <option value="technology">Technology</option>
                                <option value="fashion">Fashion & Apparel</option>
                                <option value="food">Food & Beverage</option>
                                <option value="health">Health & Wellness</option>
                                <option value="finance">Finance & Fintech</option>
                                <option value="education">Education</option>
                                <option value="creative">Creative & Agency</option>
                                <option value="ecommerce">E-commerce & Retail</option>
                                <option value="realestate">Real Estate</option>
                                <option value="travel">Travel & Hospitality</option>
                                <option value="beauty">Beauty & Cosmetics</option>
                                <option value="sports">Sports & Fitness</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Website</label>
                            <input type="url" id="brand-website" placeholder="https://yourbrand.com" onchange="UltraSettings.set('brand.website', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="brand-email" placeholder="contact@yourbrand.com" onchange="UltraSettings.set('brand.email', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" id="brand-phone" placeholder="+62 812 3456 7890" onchange="UltraSettings.set('brand.phone', this.value)">
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>🎨 Brand Colors</h3>
                    <p class="section-desc">These colors will be used in AI-generated content</p>
                    
                    <div class="color-pickers">
                        <div class="color-picker-group">
                            <label>Primary Color</label>
                            <div class="color-input-wrapper">
                                <input type="color" id="brand-primary-color" value="#6366F1" onchange="UltraSettings.set('brand.primaryColor', this.value)">
                                <input type="text" id="brand-primary-hex" value="#6366F1" onchange="document.getElementById('brand-primary-color').value=this.value;UltraSettings.set('brand.primaryColor', this.value)">
                            </div>
                        </div>
                        <div class="color-picker-group">
                            <label>Secondary Color</label>
                            <div class="color-input-wrapper">
                                <input type="color" id="brand-secondary-color" value="#EC4899" onchange="UltraSettings.set('brand.secondaryColor', this.value)">
                                <input type="text" id="brand-secondary-hex" value="#EC4899" onchange="document.getElementById('brand-secondary-color').value=this.value;UltraSettings.set('brand.secondaryColor', this.value)">
                            </div>
                        </div>
                        <div class="color-picker-group">
                            <label>Accent Color</label>
                            <div class="color-input-wrapper">
                                <input type="color" id="brand-accent-color" value="#10B981" onchange="UltraSettings.set('brand.accentColor', this.value)">
                                <input type="text" id="brand-accent-hex" value="#10B981" onchange="document.getElementById('brand-accent-color').value=this.value;UltraSettings.set('brand.accentColor', this.value)">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>📷 Brand Logo</h3>
                    <div class="logo-upload-area" onclick="document.getElementById('logo-upload').click()">
                        <div id="logo-preview" class="logo-preview">
                            <span class="upload-icon">📤</span>
                            <p>Click to upload logo</p>
                            <small>PNG, JPG, SVG (max 2MB)</small>
                        </div>
                        <input type="file" id="logo-upload" accept="image/*" style="display:none" onchange="UltraSettings.handleLogoUpload(this)">
                    </div>
                </div>
            </div>
        `;
    },

    // Render AI Tab
    renderAITab() {
        return `
            <div id="settings-ai" class="settings-tab">
                <div class="settings-section">
                    <h3>🤖 AI Provider Configuration</h3>
                    <p class="section-desc">Configure AI models for content generation</p>
                    
                    <div class="settings-grid">
                        <div class="form-group">
                            <label>AI Provider</label>
                            <select id="ai-provider" onchange="UltraSettings.set('ai.provider', this.value)">
                                <option value="pollinations">Pollinations AI (Free)</option>
                                <option value="openai">OpenAI (API Key Required)</option>
                                <option value="anthropic">Anthropic Claude (API Key Required)</option>
                                <option value="google">Google AI (API Key Required)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Model</label>
                            <select id="ai-model" onchange="UltraSettings.set('ai.model', this.value)">
                                <option value="openai">GPT-4 / GPT-3.5</option>
                                <option value="claude">Claude 3</option>
                                <option value="gemini">Gemini Pro</option>
                                <option value="mistral">Mistral</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>⚡ AI Behavior</h3>
                    
                    <div class="settings-grid">
                        <div class="form-group">
                            <label>Temperature (Creativity)</label>
                            <div class="slider-group">
                                <input type="range" id="ai-temperature" min="0" max="1" step="0.1" value="0.7" onchange="UltraSettings.set('ai.temperature', this.value);document.getElementById('temp-value').textContent=this.value">
                                <span id="temp-value">0.7</span>
                            </div>
                            <small>Lower = more focused, Higher = more creative</small>
                        </div>
                        <div class="form-group">
                            <label>Max Tokens</label>
                            <select id="ai-max-tokens" onchange="UltraSettings.set('ai.maxTokens', this.value)">
                                <option value="500">500 (Short)</option>
                                <option value="1000">1000 (Medium)</option>
                                <option value="2000" selected>2000 (Standard)</option>
                                <option value="4000">4000 (Long)</option>
                                <option value="8000">8000 (Very Long)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Default Language</label>
                            <select id="ai-language" onchange="UltraSettings.set('ai.language', this.value)">
                                <option value="id">Indonesian</option>
                                <option value="en">English</option>
                                <option value="both">Both (ID + EN)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Default Tone</label>
                            <select id="ai-tone" onchange="UltraSettings.set('ai.tone', this.value)">
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="friendly">Friendly</option>
                                <option value="formal">Formal</option>
                                <option value="playful">Playful</option>
                                <option value="authoritative">Authoritative</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>🧠 Smart Features</h3>
                    
                    <div class="toggle-list">
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">Auto-Suggest Content</span>
                                <span class="toggle-desc">AI suggests content ideas based on your brand</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="ai-auto-suggest" checked onchange="UltraSettings.set('ai.autoSuggest', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">Smart Auto-Complete</span>
                                <span class="toggle-desc">AI completes your sentences as you type</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="ai-smart-complete" checked onchange="UltraSettings.set('ai.smartComplete', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">Context-Aware Generation</span>
                                <span class="toggle-desc">AI uses your brand info for better content</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="ai-context-aware" checked onchange="UltraSettings.set('ai.contextAware', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">Learn from Feedback</span>
                                <span class="toggle-desc">AI improves based on your edits</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="ai-learn-feedback" onchange="UltraSettings.set('ai.learnFeedback', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>🧪 Test AI Connection</h3>
                    <div class="test-ai-section">
                        <button class="btn-primary" onclick="UltraSettings.testAIConnection()">
                            🔌 Test Connection
                        </button>
                        <div id="ai-test-result" class="test-result"></div>
                    </div>
                </div>
            </div>
        `;
    },

    // Render Content Tab
    renderContentTab() {
        return `
            <div id="settings-content" class="settings-tab">
                <div class="settings-section">
                    <h3>📱 Default Platforms</h3>
                    <p class="section-desc">Select platforms for content generation</p>
                    
                    <div class="platform-checkboxes">
                        <label class="platform-checkbox">
                            <input type="checkbox" value="instagram" checked onchange="UltraSettings.updatePlatforms()">
                            <span class="platform-icon">📸</span>
                            <span>Instagram</span>
                        </label>
                        <label class="platform-checkbox">
                            <input type="checkbox" value="tiktok" checked onchange="UltraSettings.updatePlatforms()">
                            <span class="platform-icon">🎵</span>
                            <span>TikTok</span>
                        </label>
                        <label class="platform-checkbox">
                            <input type="checkbox" value="twitter" onchange="UltraSettings.updatePlatforms()">
                            <span class="platform-icon">🐦</span>
                            <span>Twitter/X</span>
                        </label>
                        <label class="platform-checkbox">
                            <input type="checkbox" value="linkedin" onchange="UltraSettings.updatePlatforms()">
                            <span class="platform-icon">💼</span>
                            <span>LinkedIn</span>
                        </label>
                        <label class="platform-checkbox">
                            <input type="checkbox" value="facebook" onchange="UltraSettings.updatePlatforms()">
                            <span class="platform-icon">📘</span>
                            <span>Facebook</span>
                        </label>
                        <label class="platform-checkbox">
                            <input type="checkbox" value="youtube" onchange="UltraSettings.updatePlatforms()">
                            <span class="platform-icon">🎬</span>
                            <span>YouTube</span>
                        </label>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>📝 Content Pillars</h3>
                    <p class="section-desc">Define your content categories</p>
                    
                    <div id="content-pillars-list" class="pillars-list">
                        <!-- Pillars will be rendered here -->
                    </div>
                    <div class="add-pillar-form">
                        <input type="text" id="new-pillar" placeholder="Add new pillar...">
                        <button class="btn-secondary" onclick="UltraSettings.addPillar()">+ Add</button>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>#️⃣ Hashtag Settings</h3>
                    
                    <div class="settings-grid">
                        <div class="form-group">
                            <label>Auto-Generate Hashtags</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="auto-hashtags" checked onchange="UltraSettings.set('content.autoHashtags', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Default Hashtag Count</label>
                            <select id="hashtag-count" onchange="UltraSettings.set('content.hashtagCount', this.value)">
                                <option value="10">10 hashtags</option>
                                <option value="15">15 hashtags</option>
                                <option value="20" selected>20 hashtags</option>
                                <option value="25">25 hashtags</option>
                                <option value="30">30 hashtags</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>😊 Emoji Settings</h3>
                    
                    <div class="settings-grid">
                        <div class="form-group">
                            <label>Auto-Add Emojis</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="auto-emoji" checked onchange="UltraSettings.set('content.autoEmoji', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Emoji Level</label>
                            <select id="emoji-level" onchange="UltraSettings.set('content.emojiLevel', this.value)">
                                <option value="minimal">Minimal (1-2 per post)</option>
                                <option value="moderate" selected>Moderate (3-5 per post)</option>
                                <option value="heavy">Heavy (5+ per post)</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>📅 Posting Schedule</h3>
                    <p class="section-desc">Set optimal posting times for each day</p>
                    
                    <div class="schedule-grid" id="posting-schedule">
                        <!-- Schedule will be rendered here -->
                    </div>
                </div>
            </div>
        `;
    },

    // Render Social Tab
    renderSocialTab() {
        return `
            <div id="settings-social" class="settings-tab">
                <div class="settings-section">
                    <h3>📱 Connected Social Accounts</h3>
                    <p class="section-desc">Link your social media accounts for seamless publishing</p>
                    
                    <div class="social-accounts-list">
                        <div class="social-account-item">
                            <div class="social-account-info">
                                <span class="social-icon instagram">📸</span>
                                <div class="social-details">
                                    <span class="social-name">Instagram</span>
                                    <input type="text" id="social-instagram" placeholder="@username" onchange="UltraSettings.set('social.instagram.username', this.value)">
                                </div>
                            </div>
                            <button class="btn-connect" onclick="UltraSettings.connectSocial('instagram')">Connect</button>
                        </div>
                        <div class="social-account-item">
                            <div class="social-account-info">
                                <span class="social-icon tiktok">🎵</span>
                                <div class="social-details">
                                    <span class="social-name">TikTok</span>
                                    <input type="text" id="social-tiktok" placeholder="@username" onchange="UltraSettings.set('social.tiktok.username', this.value)">
                                </div>
                            </div>
                            <button class="btn-connect" onclick="UltraSettings.connectSocial('tiktok')">Connect</button>
                        </div>
                        <div class="social-account-item">
                            <div class="social-account-info">
                                <span class="social-icon twitter">🐦</span>
                                <div class="social-details">
                                    <span class="social-name">Twitter/X</span>
                                    <input type="text" id="social-twitter" placeholder="@username" onchange="UltraSettings.set('social.twitter.username', this.value)">
                                </div>
                            </div>
                            <button class="btn-connect" onclick="UltraSettings.connectSocial('twitter')">Connect</button>
                        </div>
                        <div class="social-account-item">
                            <div class="social-account-info">
                                <span class="social-icon linkedin">💼</span>
                                <div class="social-details">
                                    <span class="social-name">LinkedIn</span>
                                    <input type="text" id="social-linkedin" placeholder="Profile URL" onchange="UltraSettings.set('social.linkedin.username', this.value)">
                                </div>
                            </div>
                            <button class="btn-connect" onclick="UltraSettings.connectSocial('linkedin')">Connect</button>
                        </div>
                        <div class="social-account-item">
                            <div class="social-account-info">
                                <span class="social-icon facebook">📘</span>
                                <div class="social-details">
                                    <span class="social-name">Facebook</span>
                                    <input type="text" id="social-facebook" placeholder="Page URL" onchange="UltraSettings.set('social.facebook.username', this.value)">
                                </div>
                            </div>
                            <button class="btn-connect" onclick="UltraSettings.connectSocial('facebook')">Connect</button>
                        </div>
                        <div class="social-account-item">
                            <div class="social-account-info">
                                <span class="social-icon youtube">🎬</span>
                                <div class="social-details">
                                    <span class="social-name">YouTube</span>
                                    <input type="text" id="social-youtube" placeholder="Channel URL" onchange="UltraSettings.set('social.youtube.username', this.value)">
                                </div>
                            </div>
                            <button class="btn-connect" onclick="UltraSettings.connectSocial('youtube')">Connect</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Render API Tab
    renderAPITab() {
        return `
            <div id="settings-api" class="settings-tab">
                <div class="settings-section">
                    <h3>🔑 API Keys</h3>
                    <p class="section-desc">Configure API keys for enhanced features</p>
                    
                    <div class="api-keys-list">
                        <div class="api-key-item">
                            <div class="api-key-header">
                                <span class="api-icon">🌐</span>
                                <div class="api-info">
                                    <span class="api-name">Google Opal</span>
                                    <span class="api-desc">For workflow automation</span>
                                </div>
                            </div>
                            <div class="api-key-input">
                                <input type="password" id="api-google-opal" placeholder="Enter API key..." onchange="UltraSettings.set('apiKeys.googleOpal', this.value)">
                                <button class="btn-icon" onclick="UltraSettings.toggleApiKey('api-google-opal')">👁️</button>
                            </div>
                        </div>
                        <div class="api-key-item">
                            <div class="api-key-header">
                                <span class="api-icon">🤖</span>
                                <div class="api-info">
                                    <span class="api-name">OpenAI</span>
                                    <span class="api-desc">GPT-4, DALL-E, Whisper</span>
                                </div>
                            </div>
                            <div class="api-key-input">
                                <input type="password" id="api-openai" placeholder="sk-..." onchange="UltraSettings.set('apiKeys.openai', this.value)">
                                <button class="btn-icon" onclick="UltraSettings.toggleApiKey('api-openai')">👁️</button>
                            </div>
                        </div>
                        <div class="api-key-item">
                            <div class="api-key-header">
                                <span class="api-icon">🧠</span>
                                <div class="api-info">
                                    <span class="api-name">Anthropic</span>
                                    <span class="api-desc">Claude AI models</span>
                                </div>
                            </div>
                            <div class="api-key-input">
                                <input type="password" id="api-anthropic" placeholder="sk-ant-..." onchange="UltraSettings.set('apiKeys.anthropic', this.value)">
                                <button class="btn-icon" onclick="UltraSettings.toggleApiKey('api-anthropic')">👁️</button>
                            </div>
                        </div>
                        <div class="api-key-item">
                            <div class="api-key-header">
                                <span class="api-icon">🎨</span>
                                <div class="api-info">
                                    <span class="api-name">Stability AI</span>
                                    <span class="api-desc">Stable Diffusion image generation</span>
                                </div>
                            </div>
                            <div class="api-key-input">
                                <input type="password" id="api-stability" placeholder="sk-..." onchange="UltraSettings.set('apiKeys.stability', this.value)">
                                <button class="btn-icon" onclick="UltraSettings.toggleApiKey('api-stability')">👁️</button>
                            </div>
                        </div>
                        <div class="api-key-item">
                            <div class="api-key-header">
                                <span class="api-icon">🎙️</span>
                                <div class="api-info">
                                    <span class="api-name">ElevenLabs</span>
                                    <span class="api-desc">AI voice generation</span>
                                </div>
                            </div>
                            <div class="api-key-input">
                                <input type="password" id="api-elevenlabs" placeholder="Enter API key..." onchange="UltraSettings.set('apiKeys.elevenlabs', this.value)">
                                <button class="btn-icon" onclick="UltraSettings.toggleApiKey('api-elevenlabs')">👁️</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>🔗 Webhook URLs</h3>
                    <p class="section-desc">Configure webhooks for integrations</p>
                    
                    <div class="form-group full-width">
                        <label>n8n Webhook URL</label>
                        <input type="url" id="webhook-n8n" placeholder="https://your-n8n-instance.com/webhook/..." onchange="UltraSettings.set('webhooks.n8n', this.value)">
                    </div>
                    <div class="form-group full-width">
                        <label>Zapier Webhook URL</label>
                        <input type="url" id="webhook-zapier" placeholder="https://hooks.zapier.com/..." onchange="UltraSettings.set('webhooks.zapier', this.value)">
                    </div>
                    <div class="form-group full-width">
                        <label>Custom Webhook URL</label>
                        <input type="url" id="webhook-custom" placeholder="https://..." onchange="UltraSettings.set('webhooks.custom', this.value)">
                    </div>
                </div>
            </div>
        `;
    },

    // Render Appearance Tab
    renderAppearanceTab() {
        return `
            <div id="settings-appearance" class="settings-tab">
                <div class="settings-section">
                    <h3>🎨 Theme</h3>
                    
                    <div class="theme-selector">
                        <label class="theme-option">
                            <input type="radio" name="theme" value="dark" checked onchange="UltraSettings.setTheme('dark')">
                            <div class="theme-preview dark">
                                <span class="theme-name">Dark Mode</span>
                            </div>
                        </label>
                        <label class="theme-option">
                            <input type="radio" name="theme" value="light" onchange="UltraSettings.setTheme('light')">
                            <div class="theme-preview light">
                                <span class="theme-name">Light Mode</span>
                            </div>
                        </label>
                        <label class="theme-option">
                            <input type="radio" name="theme" value="auto" onchange="UltraSettings.setTheme('auto')">
                            <div class="theme-preview auto">
                                <span class="theme-name">Auto (System)</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>🎯 Accent Color</h3>
                    
                    <div class="accent-colors">
                        <button class="accent-color" style="background:#6366F1" onclick="UltraSettings.setAccent('#6366F1')"></button>
                        <button class="accent-color" style="background:#8B5CF6" onclick="UltraSettings.setAccent('#8B5CF6')"></button>
                        <button class="accent-color" style="background:#EC4899" onclick="UltraSettings.setAccent('#EC4899')"></button>
                        <button class="accent-color" style="background:#EF4444" onclick="UltraSettings.setAccent('#EF4444')"></button>
                        <button class="accent-color" style="background:#F59E0B" onclick="UltraSettings.setAccent('#F59E0B')"></button>
                        <button class="accent-color" style="background:#10B981" onclick="UltraSettings.setAccent('#10B981')"></button>
                        <button class="accent-color" style="background:#06B6D4" onclick="UltraSettings.setAccent('#06B6D4')"></button>
                        <button class="accent-color" style="background:#3B82F6" onclick="UltraSettings.setAccent('#3B82F6')"></button>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>📐 Display</h3>
                    
                    <div class="settings-grid">
                        <div class="form-group">
                            <label>Font Size</label>
                            <select id="font-size" onchange="UltraSettings.set('appearance.fontSize', this.value)">
                                <option value="small">Small</option>
                                <option value="medium" selected>Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Compact Mode</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="compact-mode" onchange="UltraSettings.set('appearance.compactMode', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Animations</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="animations" checked onchange="UltraSettings.set('appearance.animations', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Sound Effects</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="sound-effects" onchange="UltraSettings.set('appearance.soundEffects', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Render Notifications Tab
    renderNotificationsTab() {
        return `
            <div id="settings-notifications" class="settings-tab">
                <div class="settings-section">
                    <h3>🔔 Notification Preferences</h3>
                    <div class="toggle-list">
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">Email Notifications</span>
                                <span class="toggle-desc">Receive updates via email</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked onchange="UltraSettings.set('notifications.email', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">Browser Notifications</span>
                                <span class="toggle-desc">Show desktop notifications</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked onchange="UltraSettings.set('notifications.browser', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">Content Reminders</span>
                                <span class="toggle-desc">Remind about scheduled content</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked onchange="UltraSettings.set('notifications.contentReminders', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">AI Suggestions</span>
                                <span class="toggle-desc">Get AI-powered content suggestions</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked onchange="UltraSettings.set('notifications.aiSuggestions', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Render Knowledge Tab
    renderKnowledgeTab() {
        return `
            <div id="settings-knowledge" class="settings-tab">
                <div class="settings-section">
                    <h3>📚 Knowledge Base Settings</h3>
                    <p class="section-desc">Configure how AI uses your knowledge base</p>
                    <div class="toggle-list">
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">Auto-Index Documents</span>
                                <span class="toggle-desc">Automatically index new documents</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked onchange="UltraSettings.set('knowledgeBase.autoIndex', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">Use in AI Generation</span>
                                <span class="toggle-desc">Include KB context in AI prompts</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked onchange="UltraSettings.set('knowledgeBase.useInAI', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    <button class="btn-secondary" onclick="navigateTo('knowledge-base')" style="margin-top:16px;">
                        📚 Open Knowledge Base
                    </button>
                </div>
            </div>
        `;
    },

    // Render Data Tab
    renderDataTab() {
        return `
            <div id="settings-data" class="settings-tab">
                <div class="settings-section">
                    <h3>💾 Data Management</h3>
                    <div class="data-actions">
                        <div class="data-action-card">
                            <span class="data-icon">📤</span>
                            <h4>Export Data</h4>
                            <p>Download all your data as JSON</p>
                            <button class="btn-secondary" onclick="UltraSettings.exportAllData()">Export</button>
                        </div>
                        <div class="data-action-card">
                            <span class="data-icon">📥</span>
                            <h4>Import Data</h4>
                            <p>Restore from a backup file</p>
                            <button class="btn-secondary" onclick="UltraSettings.importData()">Import</button>
                        </div>
                        <div class="data-action-card danger">
                            <span class="data-icon">🗑️</span>
                            <h4>Clear All Data</h4>
                            <p>Delete all content and settings</p>
                            <button class="btn-danger" onclick="UltraSettings.clearAllData()">Clear</button>
                        </div>
                    </div>
                </div>
                <div class="settings-section">
                    <h3>📊 Storage Usage</h3>
                    <div class="storage-info">
                        <div class="storage-bar">
                            <div class="storage-fill" id="storage-fill" style="width:30%"></div>
                        </div>
                        <span class="storage-text" id="storage-text">Calculating...</span>
                    </div>
                </div>
            </div>
        `;
    },

    // Render Advanced Tab
    renderAdvancedTab() {
        return `
            <div id="settings-advanced" class="settings-tab">
                <div class="settings-section">
                    <h3>⚡ Advanced Settings</h3>
                    <div class="toggle-list">
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">Developer Mode</span>
                                <span class="toggle-desc">Show debug information</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" onchange="UltraSettings.set('advanced.devMode', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-label">Experimental Features</span>
                                <span class="toggle-desc">Enable beta features</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" onchange="UltraSettings.set('advanced.experimental', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="settings-section">
                    <h3>🔧 System Info</h3>
                    <div class="system-info">
                        <div class="info-row"><span>Version</span><span>5.0 Ultra</span></div>
                        <div class="info-row"><span>Build</span><span>2025.12.19</span></div>
                        <div class="info-row"><span>AI Engine</span><span>Pollinations AI</span></div>
                    </div>
                </div>
            </div>
        `;
    },

    // Helper Functions
    setTheme(theme) {
        this.set('appearance.theme', theme);
        document.body.dataset.theme = theme;
        this.showToast(`Theme changed to ${theme}`, 'success');
    },

    setAccent(color) {
        this.set('appearance.accentColor', color);
        document.documentElement.style.setProperty('--primary', color);
        this.showToast('Accent color updated!', 'success');
    },

    toggleApiKey(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    },

    connectSocial(platform) {
        this.showToast(`${platform} connection coming soon!`, 'info');
    },

    async testAIConnection() {
        const resultEl = document.getElementById('ai-test-result');
        if (resultEl) {
            resultEl.innerHTML = '<span class="loading">Testing connection...</span>';
        }
        
        try {
            if (window.UltraAIEngine) {
                const result = await UltraAIEngine.generateText('Say "Connection successful!"', { maxTokens: 50 });
                if (result.success) {
                    resultEl.innerHTML = '<span class="success">✅ Connection successful!</span>';
                } else {
                    resultEl.innerHTML = '<span class="error">❌ Connection failed</span>';
                }
            }
        } catch (e) {
            resultEl.innerHTML = '<span class="error">❌ Connection failed</span>';
        }
    },

    updatePlatforms() {
        const platforms = [];
        document.querySelectorAll('.platform-checkbox input:checked').forEach(cb => {
            platforms.push(cb.value);
        });
        this.set('content.defaultPlatforms', platforms);
    },

    addPillar() {
        const input = document.getElementById('new-pillar');
        const value = input?.value.trim();
        if (!value) return;
        
        const pillars = this.get('content.contentPillars') || [];
        if (!pillars.includes(value)) {
            pillars.push(value);
            this.set('content.contentPillars', pillars);
            this.renderPillars();
            input.value = '';
        }
    },

    renderPillars() {
        const container = document.getElementById('content-pillars-list');
        const pillars = this.get('content.contentPillars') || [];
        if (container) {
            container.innerHTML = pillars.map((p, i) => `
                <div class="pillar-tag">
                    <span>${p}</span>
                    <button onclick="UltraSettings.removePillar(${i})">×</button>
                </div>
            `).join('');
        }
    },

    removePillar(index) {
        const pillars = this.get('content.contentPillars') || [];
        pillars.splice(index, 1);
        this.set('content.contentPillars', pillars);
        this.renderPillars();
    },

    handleLogoUpload(input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('logo-preview');
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Logo" style="max-width:100%;max-height:100px;">`;
            }
            this.set('brand.logo', e.target.result);
        };
        reader.readAsDataURL(file);
    },

    exportAllData() {
        const data = {
            settings: this.current,
            contents: JSON.parse(localStorage.getItem('raycorp-contents') || '[]'),
            knowledgeBase: JSON.parse(localStorage.getItem('raycorp-knowledge-base') || '{}'),
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `raycorp-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Data exported! 📤', 'success');
    },

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    if (data.settings) localStorage.setItem('raycorp-settings', JSON.stringify(data.settings));
                    if (data.contents) localStorage.setItem('raycorp-contents', JSON.stringify(data.contents));
                    if (data.knowledgeBase) localStorage.setItem('raycorp-knowledge-base', JSON.stringify(data.knowledgeBase));
                    this.showToast('Data imported! Refreshing...', 'success');
                    setTimeout(() => location.reload(), 1000);
                } catch (err) {
                    this.showToast('Invalid file', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    clearAllData() {
        if (confirm('Are you sure? This will delete ALL your data!')) {
            localStorage.clear();
            this.showToast('All data cleared. Refreshing...', 'info');
            setTimeout(() => location.reload(), 1000);
        }
    },

    resetToDefaults() {
        if (confirm('Reset all settings to defaults?')) {
            this.current = { ...this.defaults };
            this.save();
            this.renderSettingsPage();
            this.showToast('Settings reset to defaults', 'success');
        }
    },

    populateFormValues() {
        // Populate form fields with current values
        const brand = this.current.brand || {};
        if (document.getElementById('brand-name')) document.getElementById('brand-name').value = brand.name || '';
        if (document.getElementById('brand-tagline')) document.getElementById('brand-tagline').value = brand.tagline || '';
        if (document.getElementById('brand-description')) document.getElementById('brand-description').value = brand.description || '';
        if (document.getElementById('brand-industry')) document.getElementById('brand-industry').value = brand.industry || '';
        if (document.getElementById('brand-website')) document.getElementById('brand-website').value = brand.website || '';
        if (document.getElementById('brand-email')) document.getElementById('brand-email').value = brand.email || '';
        
        // Render pillars
        this.renderPillars();
        
        // Calculate storage
        this.calculateStorage();
    },

    calculateStorage() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length * 2; // UTF-16
            }
        }
        const mb = (total / 1024 / 1024).toFixed(2);
        const percent = Math.min((total / (5 * 1024 * 1024)) * 100, 100);
        
        const fill = document.getElementById('storage-fill');
        const text = document.getElementById('storage-text');
        if (fill) fill.style.width = `${percent}%`;
        if (text) text.textContent = `${mb} MB / 5 MB used`;
    },

    // Add Settings Styles
    addSettingsStyles() {
        if (document.getElementById('ultra-settings-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ultra-settings-styles';
        styles.textContent = `
            .settings-layout {
                display: grid;
                grid-template-columns: 240px 1fr;
                gap: 24px;
                min-height: 600px;
            }
            .settings-nav {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .settings-nav-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                background: none;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                color: var(--text-secondary);
                font-size: 13px;
                font-weight: 500;
                text-align: left;
                transition: all 0.2s;
            }
            .settings-nav-item:hover {
                background: var(--bg-hover);
                color: var(--text-primary);
            }
            .settings-nav-item.active {
                background: var(--gradient-primary);
                color: white;
            }
            .nav-icon { font-size: 18px; }
            
            .settings-content {
                background: var(--bg-card);
                border-radius: 16px;
                border: 1px solid var(--border);
                overflow: hidden;
            }
            .settings-tab {
                display: none;
                padding: 24px;
            }
            .settings-tab.active { display: block; }
            
            .settings-section {
                margin-bottom: 32px;
            }
            .settings-section h3 {
                font-size: 16px;
                margin-bottom: 8px;
            }
            .section-desc {
                color: var(--text-muted);
                font-size: 13px;
                margin-bottom: 16px;
            }
            
            .settings-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
            }
            
            .color-pickers {
                display: flex;
                gap: 24px;
                flex-wrap: wrap;
            }
            .color-picker-group label {
                display: block;
                margin-bottom: 8px;
                font-size: 12px;
                color: var(--text-muted);
            }
            .color-input-wrapper {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .color-input-wrapper input[type="color"] {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            }
            .color-input-wrapper input[type="text"] {
                width: 100px;
                padding: 8px;
                border: 1px solid var(--border);
                border-radius: 8px;
                background: var(--bg-input);
                color: var(--text-primary);
                font-size: 12px;
            }
            
            .logo-upload-area {
                border: 2px dashed var(--border);
                border-radius: 12px;
                padding: 32px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
            }
            .logo-upload-area:hover {
                border-color: var(--primary);
                background: rgba(99, 102, 241, 0.05);
            }
            .upload-icon { font-size: 32px; }
            
            .toggle-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .toggle-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background: var(--bg-muted);
                border-radius: 12px;
            }
            .toggle-info { flex: 1; }
            .toggle-label {
                display: block;
                font-weight: 500;
                margin-bottom: 4px;
            }
            .toggle-desc {
                font-size: 12px;
                color: var(--text-muted);
            }
            
            .slider-group {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .slider-group input[type="range"] {
                flex: 1;
                height: 6px;
                border-radius: 3px;
                background: var(--bg-muted);
                -webkit-appearance: none;
            }
            .slider-group input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--primary);
                cursor: pointer;
            }
            
            .social-accounts-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .social-account-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background: var(--bg-muted);
                border-radius: 12px;
            }
            .social-account-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .social-icon {
                font-size: 24px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--bg-card);
                border-radius: 10px;
            }
            .social-details input {
                margin-top: 4px;
                padding: 6px 10px;
                border: 1px solid var(--border);
                border-radius: 6px;
                background: var(--bg-input);
                color: var(--text-primary);
                font-size: 12px;
            }
            .btn-connect {
                padding: 8px 16px;
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            .btn-connect:hover {
                background: var(--primary);
                color: white;
                border-color: var(--primary);
            }
            
            .api-keys-list {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .api-key-item {
                padding: 16px;
                background: var(--bg-muted);
                border-radius: 12px;
            }
            .api-key-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
            }
            .api-icon { font-size: 24px; }
            .api-name { font-weight: 600; display: block; }
            .api-desc { font-size: 11px; color: var(--text-muted); }
            .api-key-input {
                display: flex;
                gap: 8px;
            }
            .api-key-input input {
                flex: 1;
                padding: 10px;
                border: 1px solid var(--border);
                border-radius: 8px;
                background: var(--bg-input);
                color: var(--text-primary);
                font-size: 13px;
            }
            
            .theme-selector {
                display: flex;
                gap: 16px;
            }
            .theme-option {
                cursor: pointer;
            }
            .theme-option input { display: none; }
            .theme-preview {
                width: 120px;
                height: 80px;
                border-radius: 12px;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                padding: 8px;
                border: 2px solid var(--border);
                transition: all 0.2s;
            }
            .theme-preview.dark { background: #0a0a0f; }
            .theme-preview.light { background: #f8fafc; }
            .theme-preview.auto { background: linear-gradient(135deg, #0a0a0f 50%, #f8fafc 50%); }
            .theme-option input:checked + .theme-preview {
                border-color: var(--primary);
                box-shadow: 0 0 0 3px var(--primary-glow);
            }
            .theme-name { font-size: 11px; font-weight: 500; }
            
            .accent-colors {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }
            .accent-color {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 3px solid transparent;
                cursor: pointer;
                transition: all 0.2s;
            }
            .accent-color:hover {
                transform: scale(1.1);
            }
            .accent-color.active {
                border-color: white;
                box-shadow: 0 0 0 2px var(--primary);
            }
            
            .data-actions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
            }
            .data-action-card {
                padding: 20px;
                background: var(--bg-muted);
                border-radius: 12px;
                text-align: center;
            }
            .data-action-card.danger {
                border: 1px solid var(--danger);
            }
            .data-icon { font-size: 32px; display: block; margin-bottom: 8px; }
            .data-action-card h4 { margin: 0 0 4px 0; font-size: 14px; }
            .data-action-card p { font-size: 12px; color: var(--text-muted); margin: 0 0 12px 0; }
            .btn-danger {
                background: var(--danger);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
            }
            
            .storage-info { margin-top: 16px; }
            .storage-bar {
                height: 8px;
                background: var(--bg-muted);
                border-radius: 4px;
                overflow: hidden;
            }
            .storage-fill {
                height: 100%;
                background: var(--gradient-primary);
                transition: width 0.3s;
            }
            .storage-text {
                display: block;
                margin-top: 8px;
                font-size: 12px;
                color: var(--text-muted);
            }
            
            .system-info {
                background: var(--bg-muted);
                border-radius: 12px;
                padding: 16px;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid var(--border);
                font-size: 13px;
            }
            .info-row:last-child { border-bottom: none; }
            
            .pillars-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 12px;
            }
            .pillar-tag {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: var(--bg-muted);
                border-radius: 20px;
                font-size: 12px;
            }
            .pillar-tag button {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                font-size: 14px;
            }
            .add-pillar-form {
                display: flex;
                gap: 8px;
            }
            .add-pillar-form input {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid var(--border);
                border-radius: 8px;
                background: var(--bg-input);
                color: var(--text-primary);
            }
            
            .test-ai-section {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .test-result {
                font-size: 13px;
            }
            .test-result .success { color: var(--success); }
            .test-result .error { color: var(--danger); }
            .test-result .loading { color: var(--text-muted); }
            
            @media (max-width: 768px) {
                .settings-layout {
                    grid-template-columns: 1fr;
                }
                .settings-nav {
                    flex-direction: row;
                    overflow-x: auto;
                    padding-bottom: 8px;
                }
                .settings-nav-item {
                    white-space: nowrap;
                }
            }
        `;
        document.head.appendChild(styles);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.UltraSettings = UltraSettings;
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltraSettings;
}
