// ==================== ULTRA AI ASSISTANT ====================
// Advanced AI Chat Assistant with Multi-Modal Capabilities
// Version 4.0 - December 2025

const UltraAIAssistant = {
    // State
    state: {
        isOpen: false,
        isMinimized: false,
        messages: [],
        context: {},
        mode: 'chat', // chat, workflow, analyze, create
        isTyping: false
    },

    // Personality & Capabilities
    personality: {
        name: 'Kira',
        role: 'AI Content Assistant',
        traits: ['helpful', 'creative', 'knowledgeable', 'friendly'],
        expertise: ['content creation', 'social media', 'marketing', 'copywriting', 'SEO']
    },

    // Quick Actions
    quickActions: [
        { icon: '✨', label: 'Create Content', action: 'create' },
        { icon: '📊', label: 'Analyze', action: 'analyze' },
        { icon: '💡', label: 'Get Ideas', action: 'ideas' },
        { icon: '📝', label: 'Write Caption', action: 'caption' },
        { icon: '#️⃣', label: 'Hashtags', action: 'hashtags' },
        { icon: '🎬', label: 'Video Script', action: 'video' }
    ],

    // Initialize
    init() {
        this.loadState();
        this.createAssistantUI();
        this.bindEvents();
        console.log('🤖 Ultra AI Assistant initialized');
        return this;
    },

    loadState() {
        const saved = localStorage.getItem('ultra-ai-assistant-state');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.state.messages = parsed.messages || [];
        }
    },

    saveState() {
        localStorage.setItem('ultra-ai-assistant-state', JSON.stringify({
            messages: this.state.messages.slice(-50) // Keep last 50 messages
        }));
    },

    // Create Assistant UI
    createAssistantUI() {
        // Remove existing if any
        const existing = document.getElementById('ultra-ai-assistant');
        if (existing) existing.remove();

        const assistant = document.createElement('div');
        assistant.id = 'ultra-ai-assistant';
        assistant.innerHTML = `
            <!-- Floating Button -->
            <button class="ai-assistant-fab" onclick="UltraAIAssistant.toggle()">
                <span class="fab-icon">🤖</span>
                <span class="fab-pulse"></span>
            </button>

            <!-- Chat Window -->
            <div class="ai-assistant-window ${this.state.isOpen ? 'open' : ''} ${this.state.isMinimized ? 'minimized' : ''}">
                <!-- Header -->
                <div class="ai-assistant-header">
                    <div class="ai-assistant-info">
                        <div class="ai-avatar">
                            <span>🤖</span>
                            <span class="ai-status-dot"></span>
                        </div>
                        <div class="ai-details">
                            <span class="ai-name">${this.personality.name}</span>
                            <span class="ai-role">${this.personality.role}</span>
                        </div>
                    </div>
                    <div class="ai-assistant-actions">
                        <button class="ai-action-btn" onclick="UltraAIAssistant.clearChat()" title="Clear Chat">🗑️</button>
                        <button class="ai-action-btn" onclick="UltraAIAssistant.minimize()" title="Minimize">➖</button>
                        <button class="ai-action-btn" onclick="UltraAIAssistant.close()" title="Close">✕</button>
                    </div>
                </div>

                <!-- Mode Tabs -->
                <div class="ai-mode-tabs">
                    <button class="ai-mode-tab active" data-mode="chat" onclick="UltraAIAssistant.setMode('chat')">💬 Chat</button>
                    <button class="ai-mode-tab" data-mode="create" onclick="UltraAIAssistant.setMode('create')">✨ Create</button>
                    <button class="ai-mode-tab" data-mode="analyze" onclick="UltraAIAssistant.setMode('analyze')">📊 Analyze</button>
                </div>

                <!-- Messages Container -->
                <div class="ai-messages-container" id="ai-messages">
                    ${this.renderMessages()}
                </div>

                <!-- Quick Actions -->
                <div class="ai-quick-actions" id="ai-quick-actions">
                    ${this.quickActions.map(qa => `
                        <button class="ai-quick-btn" onclick="UltraAIAssistant.executeQuickAction('${qa.action}')">
                            <span>${qa.icon}</span>
                            <span>${qa.label}</span>
                        </button>
                    `).join('')}
                </div>

                <!-- Input Area -->
                <div class="ai-input-area">
                    <div class="ai-input-wrapper">
                        <textarea 
                            id="ai-input" 
                            placeholder="Ask me anything about content creation..."
                            rows="1"
                            onkeydown="UltraAIAssistant.handleKeyDown(event)"
                            oninput="UltraAIAssistant.autoResize(this)"
                        ></textarea>
                        <div class="ai-input-actions">
                            <button class="ai-attach-btn" onclick="UltraAIAssistant.attachFile()" title="Attach">📎</button>
                            <button class="ai-send-btn" onclick="UltraAIAssistant.sendMessage()" title="Send">
                                <span>➤</span>
                            </button>
                        </div>
                    </div>
                    <div class="ai-input-hints">
                        <span>Press Enter to send • Shift+Enter for new line</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(assistant);
        this.addStyles();
    },

    // Render Messages
    renderMessages() {
        if (this.state.messages.length === 0) {
            return this.renderWelcomeMessage();
        }

        return this.state.messages.map(msg => this.renderMessage(msg)).join('');
    },

    renderWelcomeMessage() {
        return `
            <div class="ai-welcome">
                <div class="ai-welcome-avatar">🤖</div>
                <h3>Hi! I'm ${this.personality.name}</h3>
                <p>Your AI-powered content assistant. I can help you with:</p>
                <div class="ai-capabilities">
                    <span class="capability">✨ Content Creation</span>
                    <span class="capability">📝 Copywriting</span>
                    <span class="capability">🎬 Video Scripts</span>
                    <span class="capability">#️⃣ Hashtags</span>
                    <span class="capability">📊 Analytics</span>
                    <span class="capability">💡 Ideas</span>
                </div>
                <p class="ai-welcome-hint">Try asking: "Create a caption for my new product launch"</p>
            </div>
        `;
    },

    renderMessage(msg) {
        const isUser = msg.role === 'user';
        return `
            <div class="ai-message ${isUser ? 'user' : 'assistant'}">
                ${!isUser ? '<div class="ai-msg-avatar">🤖</div>' : ''}
                <div class="ai-msg-content">
                    <div class="ai-msg-text">${this.formatMessage(msg.content)}</div>
                    <div class="ai-msg-meta">
                        <span class="ai-msg-time">${this.formatTime(msg.timestamp)}</span>
                        ${!isUser ? `
                            <div class="ai-msg-actions">
                                <button onclick="UltraAIAssistant.copyMessage('${msg.id}')" title="Copy">📋</button>
                                <button onclick="UltraAIAssistant.useInGenerator('${msg.id}')" title="Use in Generator">⚡</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    formatMessage(content) {
        // Convert markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    },

    formatTime(timestamp) {
        if (!timestamp) return 'Just now';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    // Toggle Assistant
    toggle() {
        this.state.isOpen = !this.state.isOpen;
        this.state.isMinimized = false;
        this.updateUI();
    },

    open() {
        this.state.isOpen = true;
        this.state.isMinimized = false;
        this.updateUI();
        setTimeout(() => {
            document.getElementById('ai-input')?.focus();
        }, 300);
    },

    close() {
        this.state.isOpen = false;
        this.updateUI();
    },

    minimize() {
        this.state.isMinimized = !this.state.isMinimized;
        this.updateUI();
    },

    updateUI() {
        const window = document.querySelector('.ai-assistant-window');
        if (window) {
            window.classList.toggle('open', this.state.isOpen);
            window.classList.toggle('minimized', this.state.isMinimized);
        }
    },

    // Set Mode
    setMode(mode) {
        this.state.mode = mode;
        document.querySelectorAll('.ai-mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });

        // Update quick actions based on mode
        this.updateQuickActions(mode);
    },

    updateQuickActions(mode) {
        const modeActions = {
            chat: [
                { icon: '✨', label: 'Create Content', action: 'create' },
                { icon: '📊', label: 'Analyze', action: 'analyze' },
                { icon: '💡', label: 'Get Ideas', action: 'ideas' },
                { icon: '📝', label: 'Write Caption', action: 'caption' }
            ],
            create: [
                { icon: '📝', label: 'Caption', action: 'caption' },
                { icon: '#️⃣', label: 'Hashtags', action: 'hashtags' },
                { icon: '🎬', label: 'Video Script', action: 'video' },
                { icon: '📧', label: 'Email', action: 'email' }
            ],
            analyze: [
                { icon: '📊', label: 'Performance', action: 'performance' },
                { icon: '🎯', label: 'Audience', action: 'audience' },
                { icon: '📈', label: 'Trends', action: 'trends' },
                { icon: '🔍', label: 'Competitors', action: 'competitors' }
            ]
        };

        const actions = modeActions[mode] || modeActions.chat;
        const container = document.getElementById('ai-quick-actions');
        if (container) {
            container.innerHTML = actions.map(qa => `
                <button class="ai-quick-btn" onclick="UltraAIAssistant.executeQuickAction('${qa.action}')">
                    <span>${qa.icon}</span>
                    <span>${qa.label}</span>
                </button>
            `).join('');
        }
    },

    // Handle Input
    handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    },

    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    },

    // Send Message
    async sendMessage() {
        const input = document.getElementById('ai-input');
        const message = input?.value.trim();
        
        if (!message || this.state.isTyping) return;

        // Add user message
        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: Date.now()
        };
        this.state.messages.push(userMsg);
        this.saveState();

        // Clear input
        input.value = '';
        input.style.height = 'auto';

        // Update UI
        this.updateMessages();
        this.scrollToBottom();

        // Show typing indicator
        this.showTyping();

        // Generate AI response
        try {
            const response = await this.generateResponse(message);
            this.hideTyping();

            const assistantMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: Date.now()
            };
            this.state.messages.push(assistantMsg);
            this.saveState();
            this.updateMessages();
            this.scrollToBottom();
        } catch (error) {
            this.hideTyping();
            this.addErrorMessage('Sorry, I encountered an error. Please try again.');
        }
    },

    // Generate AI Response
    async generateResponse(message) {
        const context = this.buildContext();
        
        const systemPrompt = `You are ${this.personality.name}, an expert ${this.personality.role}. 
You help users with content creation, social media strategy, copywriting, and marketing.
Be helpful, creative, and provide actionable advice.
Keep responses concise but informative.
Use emojis sparingly to add personality.
If asked to create content, provide ready-to-use examples.

Current context:
- Mode: ${this.state.mode}
- Brand: ${context.brand || 'Not specified'}
- Industry: ${context.industry || 'General'}

User message: ${message}`;

        if (window.UltraAIEngine) {
            const result = await UltraAIEngine.generateText(systemPrompt, {
                temperature: 0.8,
                maxTokens: 1000
            });
            return result.success ? result.content : this.getFallbackResponse(message);
        }

        return this.getFallbackResponse(message);
    },

    buildContext() {
        const settings = JSON.parse(localStorage.getItem('raycorp-settings') || '{}');
        return {
            brand: settings.brand?.name,
            industry: settings.brand?.industry,
            tone: settings.ai?.tone
        };
    },

    getFallbackResponse(message) {
        const responses = {
            'create': 'I can help you create amazing content! What type would you like? Caption, video script, or something else?',
            'caption': 'Sure! Tell me about your post topic and I\'ll craft an engaging caption for you.',
            'hashtags': 'I\'ll generate relevant hashtags for you. What\'s the topic or niche?',
            'ideas': 'Here are some content ideas:\n\n1. 💡 Behind-the-scenes of your process\n2. 📚 Educational tips in your niche\n3. 🎯 Common mistakes to avoid\n4. ✨ Success stories or testimonials\n5. 🔥 Trending topic commentary',
            'video': 'I can write a video script! What\'s the topic and how long should the video be?',
            'default': 'I\'m here to help with your content creation needs! You can ask me to:\n\n• Create captions and copy\n• Generate hashtags\n• Write video scripts\n• Brainstorm content ideas\n• Analyze your content strategy\n\nWhat would you like to work on?'
        };

        const lowerMessage = message.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        return responses.default;
    },

    // Execute Quick Action
    async executeQuickAction(action) {
        const prompts = {
            create: 'I want to create new content. What type should I make?',
            analyze: 'Can you analyze my content performance and give suggestions?',
            ideas: 'Give me 5 creative content ideas for social media',
            caption: 'Help me write an engaging Instagram caption',
            hashtags: 'Generate 20 relevant hashtags for my content',
            video: 'Help me write a 60-second video script',
            email: 'Help me write a marketing email',
            performance: 'Analyze my content performance metrics',
            audience: 'Help me understand my target audience better',
            trends: 'What are the current social media trends?',
            competitors: 'How can I analyze my competitors?'
        };

        const prompt = prompts[action] || prompts.create;
        
        // Add to input and send
        const input = document.getElementById('ai-input');
        if (input) {
            input.value = prompt;
            await this.sendMessage();
        }
    },

    // UI Updates
    updateMessages() {
        const container = document.getElementById('ai-messages');
        if (container) {
            container.innerHTML = this.renderMessages();
        }
    },

    scrollToBottom() {
        const container = document.getElementById('ai-messages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    },

    showTyping() {
        this.state.isTyping = true;
        const container = document.getElementById('ai-messages');
        if (container) {
            const typing = document.createElement('div');
            typing.className = 'ai-typing';
            typing.id = 'ai-typing-indicator';
            typing.innerHTML = `
                <div class="ai-msg-avatar">🤖</div>
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            `;
            container.appendChild(typing);
            this.scrollToBottom();
        }
    },

    hideTyping() {
        this.state.isTyping = false;
        const typing = document.getElementById('ai-typing-indicator');
        if (typing) typing.remove();
    },

    addErrorMessage(text) {
        const errorMsg = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `⚠️ ${text}`,
            timestamp: Date.now()
        };
        this.state.messages.push(errorMsg);
        this.updateMessages();
        this.scrollToBottom();
    },

    // Message Actions
    copyMessage(id) {
        const msg = this.state.messages.find(m => m.id === id);
        if (msg) {
            navigator.clipboard.writeText(msg.content);
            this.showToast('Copied to clipboard! 📋', 'success');
        }
    },

    useInGenerator(id) {
        const msg = this.state.messages.find(m => m.id === id);
        if (msg) {
            navigateTo('generator');
            setTimeout(() => {
                const topicInput = document.getElementById('gen-topic');
                if (topicInput) {
                    topicInput.value = msg.content;
                }
            }, 100);
            this.close();
        }
    },

    clearChat() {
        if (confirm('Clear all chat history?')) {
            this.state.messages = [];
            this.saveState();
            this.updateMessages();
        }
    },

    attachFile() {
        this.showToast('File attachment coming soon! 📎', 'info');
    },

    // Bind Events
    bindEvents() {
        // Keyboard shortcut to open assistant
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
        });
    },

    showToast(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        }
    },

    // Add Styles
    addStyles() {
        if (document.getElementById('ultra-ai-assistant-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ultra-ai-assistant-styles';
        styles.textContent = `
            #ultra-ai-assistant {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .ai-assistant-fab {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #6366F1, #8B5CF6);
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
                z-index: 9998;
                transition: transform 0.3s, box-shadow 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .ai-assistant-fab:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(99, 102, 241, 0.5);
            }
            .fab-icon { font-size: 28px; }
            .fab-pulse {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: inherit;
                animation: pulse 2s infinite;
                z-index: -1;
            }
            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.5; }
                100% { transform: scale(1.5); opacity: 0; }
            }

            .ai-assistant-window {
                position: fixed;
                bottom: 100px;
                right: 24px;
                width: 400px;
                height: 600px;
                background: var(--bg-card, #1a1a2e);
                border-radius: 20px;
                box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px) scale(0.95);
                transition: all 0.3s ease;
            }
            .ai-assistant-window.open {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }
            .ai-assistant-window.minimized {
                height: 60px;
            }
            .ai-assistant-window.minimized .ai-messages-container,
            .ai-assistant-window.minimized .ai-quick-actions,
            .ai-assistant-window.minimized .ai-input-area,
            .ai-assistant-window.minimized .ai-mode-tabs {
                display: none;
            }

            .ai-assistant-header {
                padding: 16px 20px;
                background: linear-gradient(135deg, #6366F1, #8B5CF6);
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: white;
            }
            .ai-assistant-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .ai-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                position: relative;
            }
            .ai-status-dot {
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 10px;
                height: 10px;
                background: #10B981;
                border-radius: 50%;
                border: 2px solid #6366F1;
            }
            .ai-name { font-weight: 600; font-size: 15px; display: block; }
            .ai-role { font-size: 11px; opacity: 0.8; }
            .ai-assistant-actions { display: flex; gap: 8px; }
            .ai-action-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            }
            .ai-action-btn:hover { background: rgba(255,255,255,0.3); }

            .ai-mode-tabs {
                display: flex;
                padding: 8px;
                gap: 4px;
                background: var(--bg-muted, #252542);
            }
            .ai-mode-tab {
                flex: 1;
                padding: 8px;
                border: none;
                background: transparent;
                color: var(--text-muted, #888);
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            .ai-mode-tab.active {
                background: var(--primary, #6366F1);
                color: white;
            }

            .ai-messages-container {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .ai-welcome {
                text-align: center;
                padding: 20px;
            }
            .ai-welcome-avatar { font-size: 48px; margin-bottom: 12px; }
            .ai-welcome h3 { margin: 0 0 8px 0; color: var(--text-primary, #fff); }
            .ai-welcome p { color: var(--text-muted, #888); font-size: 13px; margin: 0 0 16px 0; }
            .ai-capabilities {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;
                margin-bottom: 16px;
            }
            .capability {
                background: var(--bg-muted, #252542);
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 11px;
                color: var(--text-secondary, #aaa);
            }
            .ai-welcome-hint {
                font-size: 11px;
                color: var(--text-muted, #666);
                font-style: italic;
            }

            .ai-message {
                display: flex;
                gap: 10px;
                max-width: 90%;
            }
            .ai-message.user {
                margin-left: auto;
                flex-direction: row-reverse;
            }
            .ai-msg-avatar {
                width: 32px;
                height: 32px;
                background: var(--bg-muted, #252542);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                flex-shrink: 0;
            }
            .ai-msg-content {
                background: var(--bg-muted, #252542);
                padding: 12px 16px;
                border-radius: 16px;
                border-top-left-radius: 4px;
            }
            .ai-message.user .ai-msg-content {
                background: var(--primary, #6366F1);
                color: white;
                border-radius: 16px;
                border-top-right-radius: 4px;
            }
            .ai-msg-text {
                font-size: 13px;
                line-height: 1.5;
                color: var(--text-primary, #fff);
            }
            .ai-message.user .ai-msg-text { color: white; }
            .ai-msg-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 8px;
            }
            .ai-msg-time {
                font-size: 10px;
                color: var(--text-muted, #666);
            }
            .ai-msg-actions {
                display: flex;
                gap: 4px;
            }
            .ai-msg-actions button {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 12px;
                opacity: 0.6;
                transition: opacity 0.2s;
            }
            .ai-msg-actions button:hover { opacity: 1; }

            .ai-typing {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            .typing-dots {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
                background: var(--bg-muted, #252542);
                border-radius: 16px;
            }
            .typing-dots span {
                width: 8px;
                height: 8px;
                background: var(--text-muted, #666);
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }
            .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
            .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing {
                0%, 100% { opacity: 0.3; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1); }
            }

            .ai-quick-actions {
                display: flex;
                gap: 8px;
                padding: 12px 16px;
                overflow-x: auto;
                border-top: 1px solid var(--border, #333);
            }
            .ai-quick-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 12px;
                background: var(--bg-muted, #252542);
                border: 1px solid var(--border, #333);
                border-radius: 20px;
                cursor: pointer;
                font-size: 11px;
                color: var(--text-secondary, #aaa);
                white-space: nowrap;
                transition: all 0.2s;
            }
            .ai-quick-btn:hover {
                background: var(--primary, #6366F1);
                color: white;
                border-color: var(--primary, #6366F1);
            }

            .ai-input-area {
                padding: 12px 16px;
                border-top: 1px solid var(--border, #333);
            }
            .ai-input-wrapper {
                display: flex;
                align-items: flex-end;
                gap: 8px;
                background: var(--bg-muted, #252542);
                border-radius: 16px;
                padding: 8px 12px;
            }
            .ai-input-wrapper textarea {
                flex: 1;
                background: none;
                border: none;
                color: var(--text-primary, #fff);
                font-size: 13px;
                resize: none;
                max-height: 120px;
                line-height: 1.4;
            }
            .ai-input-wrapper textarea::placeholder {
                color: var(--text-muted, #666);
            }
            .ai-input-wrapper textarea:focus { outline: none; }
            .ai-input-actions { display: flex; gap: 4px; }
            .ai-attach-btn, .ai-send-btn {
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .ai-attach-btn {
                background: transparent;
                font-size: 16px;
            }
            .ai-send-btn {
                background: var(--primary, #6366F1);
                color: white;
                font-size: 14px;
            }
            .ai-send-btn:hover { transform: scale(1.1); }
            .ai-input-hints {
                text-align: center;
                margin-top: 8px;
                font-size: 10px;
                color: var(--text-muted, #666);
            }

            @media (max-width: 480px) {
                .ai-assistant-window {
                    width: calc(100% - 32px);
                    right: 16px;
                    bottom: 90px;
                    height: calc(100vh - 120px);
                }
            }
        `;
        document.head.appendChild(styles);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.UltraAIAssistant = UltraAIAssistant.init();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltraAIAssistant;
}
