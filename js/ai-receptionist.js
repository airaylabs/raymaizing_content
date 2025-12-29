// ==================== AI SMART RECEPTIONIST v2.0 ====================
// Super intelligent assistant powered by Pollinations AI
// Can understand context, give smart recommendations, and guide users
// Version 2.0 - December 2025

const AIReceptionist = {
    isOpen: false,
    conversationHistory: [],
    isTyping: false,
    
    // Pollinations API endpoint
    pollinationsAPI: 'https://text.pollinations.ai/',
    
    // System prompt for the AI
    systemPrompt: `Kamu adalah AI Assistant bernama "Kira" untuk platform Magic Studio raycorp - platform pembuatan konten AI dengan 133+ workflow tools.

PERAN KAMU:
- Membantu user menemukan workflow yang tepat untuk kebutuhan mereka
- Memberikan rekomendasi tools berdasarkan kebutuhan user
- Menjelaskan cara menggunakan tools
- Memberikan tips dan best practices untuk content creation

WORKFLOW CATEGORIES YANG TERSEDIA:
1. TEXT (20+ tools): SEO Article, Viral Thread, Caption, Script, Blog Post, Newsletter, Copywriting, Story, LinkedIn Content, YouTube SEO, Press Release, FAQ, Quiz/Poll, eBook, Webinar, Chatbot Script, SOP
2. IMAGE (25+ tools): Carousel, Product Photoshoot, Fashion, Thumbnail, Infographic, Meme, Quote Graphics, Banner, Avatar, Pattern, Icon Set, Story Template, Food Photography, Real Estate
3. VIDEO (15+ tools): Short Video (TikTok/Reels), YouTube Video, Story Video, Explainer, Product Video, Promo Video, Tutorial, UGC Video, Testimonial Video
4. AUDIO (10+ tools): Podcast, Voiceover, Music, Sound Effects, ASMR, Audiobook, Jingle, Ad Audio
5. MARKETING (20+ tools): Ad Creative, Email Campaign, Content Calendar, Hashtag, Hook Generator, Trend Content, Product Launch, Event Promotion
6. BRANDING (15+ tools): Brand Kit, Logo Suite, Brand Strategy, Brand Guidelines, Brand Voice, Brand Story, Brand Naming, Business Card
7. BUSINESS (10+ tools): Competitor Analysis, Pitch Deck, Presentation, Media Kit, UMKM Starter Kit
8. E-COMMERCE (15+ tools): Product Description, Packaging Design, Product Catalog, Fashion Lookbook, Skincare Kit, F&B Kit, Reseller Kit

CARA MEREKOMENDASIKAN:
- Tanyakan kebutuhan spesifik user jika belum jelas
- Rekomendasikan 2-3 workflow yang paling relevan
- Jelaskan kenapa workflow tersebut cocok
- Berikan tips penggunaan

GAYA KOMUNIKASI:
- Friendly dan helpful
- Gunakan bahasa Indonesia casual
- Gunakan emoji secukupnya
- Jawab dengan ringkas tapi informatif
- Jika user bingung, berikan contoh konkret

PENTING:
- Selalu rekomendasikan workflow yang ada di platform
- Jika tidak yakin, tanyakan lebih detail
- Berikan alur/flow penggunaan tools jika diminta`,

    // Initialize
    init() {
        this.createUI();
        this.bindEvents();
        console.log('🤖 AI Receptionist v2.0 initialized with Pollinations AI');
    },

    // Create UI
    createUI() {
        // Floating button
        const floatingBtn = document.createElement('div');
        floatingBtn.id = 'ai-receptionist-btn';
        floatingBtn.innerHTML = `
            <div class="receptionist-btn-inner">
                <span class="receptionist-icon">🤖</span>
                <span class="receptionist-label">AI Assistant</span>
                <span class="ai-pulse"></span>
            </div>
        `;
        document.body.appendChild(floatingBtn);

        // Chat modal
        const modal = document.createElement('div');
        modal.id = 'ai-receptionist-modal';
        modal.innerHTML = this.getModalHTML();
        document.body.appendChild(modal);

        // Add styles
        this.addStyles();
    },

    getModalHTML() {
        return `
            <div class="receptionist-container">
                <div class="receptionist-header">
                    <div class="receptionist-avatar">
                        <span class="avatar-icon">🤖</span>
                        <span class="avatar-status"></span>
                    </div>
                    <div class="receptionist-info">
                        <h3>Kira - AI Assistant</h3>
                        <span class="status" id="ai-status">🟢 Online • Powered by AI</span>
                    </div>
                    <button class="receptionist-close" onclick="AIReceptionist.close()">×</button>
                </div>
                
                <div class="receptionist-chat" id="receptionist-chat">
                    <div class="chat-message bot">
                        <div class="bot-avatar">🤖</div>
                        <div class="message-content">
                            <p>👋 Halo! Saya <strong>Kira</strong>, AI Assistant Magic Studio.</p>
                            <p>Saya bisa membantu kamu:</p>
                            <ul>
                                <li>🔍 Menemukan workflow yang tepat</li>
                                <li>💡 Memberikan ide konten</li>
                                <li>📚 Menjelaskan cara pakai tools</li>
                                <li>🎯 Rekomendasi strategi konten</li>
                            </ul>
                            <p><strong>Mau bikin apa hari ini?</strong></p>
                        </div>
                    </div>
                    
                    <div class="quick-actions" id="quick-actions">
                        <button onclick="AIReceptionist.quickAction('Saya mau bikin konten Instagram')">📱 Konten Instagram</button>
                        <button onclick="AIReceptionist.quickAction('Butuh video untuk TikTok')">🎬 Video TikTok</button>
                        <button onclick="AIReceptionist.quickAction('Mau bikin branding lengkap')">🎨 Branding</button>
                        <button onclick="AIReceptionist.quickAction('Butuh konten marketing')">📢 Marketing</button>
                        <button onclick="AIReceptionist.quickAction('Mau bikin artikel SEO')">📝 Artikel SEO</button>
                        <button onclick="AIReceptionist.quickAction('Butuh podcast content')">🎙️ Podcast</button>
                    </div>
                </div>
                
                <div class="receptionist-input">
                    <input type="text" id="receptionist-input" placeholder="Tanya apa saja tentang content creation..." onkeypress="if(event.key==='Enter')AIReceptionist.sendMessage()">
                    <button onclick="AIReceptionist.sendMessage()" id="send-btn">
                        <span class="send-icon">➤</span>
                    </button>
                </div>
                
                <div class="receptionist-footer">
                    <span>Powered by Pollinations AI 🧠</span>
                </div>
            </div>
        `;
    },

    // Add CSS styles
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #ai-receptionist-btn {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9999;
                cursor: pointer;
            }
            .receptionist-btn-inner {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 14px 20px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
                border-radius: 50px;
                box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(139, 92, 246, 0.2);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .receptionist-btn-inner::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                transform: rotate(45deg);
                animation: shimmer 3s infinite;
            }
            @keyframes shimmer {
                0% { transform: translateX(-100%) rotate(45deg); }
                100% { transform: translateX(100%) rotate(45deg); }
            }
            .receptionist-btn-inner:hover {
                transform: translateY(-3px) scale(1.02);
                box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5), 0 0 60px rgba(139, 92, 246, 0.3);
            }
            .receptionist-icon { font-size: 26px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }
            .receptionist-label { color: white; font-weight: 600; font-size: 14px; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
            .ai-pulse {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 10px;
                height: 10px;
                background: #10b981;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.5); opacity: 0.5; }
            }
            
            #ai-receptionist-modal {
                position: fixed;
                bottom: 100px;
                right: 24px;
                width: 420px;
                max-height: 650px;
                background: linear-gradient(180deg, #1a1a2e 0%, #16162a 100%);
                border-radius: 24px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 100px rgba(99, 102, 241, 0.1);
                z-index: 10000;
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid rgba(99, 102, 241, 0.2);
            }
            #ai-receptionist-modal.open { display: flex; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            
            .receptionist-header {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 18px 22px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                position: relative;
                overflow: hidden;
            }
            .receptionist-header::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            }
            .receptionist-avatar {
                position: relative;
                width: 48px;
                height: 48px;
                background: rgba(255,255,255,0.2);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .avatar-icon { font-size: 28px; }
            .avatar-status {
                position: absolute;
                bottom: -2px;
                right: -2px;
                width: 14px;
                height: 14px;
                background: #10b981;
                border-radius: 50%;
                border: 2px solid #6366f1;
            }
            .receptionist-info h3 { margin: 0; font-size: 17px; font-weight: 700; }
            .receptionist-info .status { font-size: 12px; opacity: 0.9; }
            .receptionist-close {
                margin-left: auto;
                background: rgba(255,255,255,0.15);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 12px;
                cursor: pointer;
                font-size: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .receptionist-close:hover { background: rgba(255,255,255,0.25); transform: rotate(90deg); }
            
            .receptionist-chat {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                max-height: 420px;
                scrollbar-width: thin;
                scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
            }
            .receptionist-chat::-webkit-scrollbar { width: 6px; }
            .receptionist-chat::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 3px; }
            
            .chat-message { display: flex; gap: 12px; animation: fadeIn 0.3s ease; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .chat-message.bot { align-items: flex-start; }
            .chat-message.user { flex-direction: row-reverse; }
            .bot-avatar {
                width: 36px;
                height: 36px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                flex-shrink: 0;
            }
            .chat-message.bot .message-content {
                background: rgba(99, 102, 241, 0.15);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 18px 18px 18px 6px;
                padding: 14px 18px;
                color: #e0e0e0;
                max-width: 85%;
            }
            .chat-message.user .message-content {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-radius: 18px 18px 6px 18px;
                padding: 14px 18px;
                color: white;
                max-width: 80%;
            }
            .message-content p { margin: 0 0 10px 0; line-height: 1.6; font-size: 14px; }
            .message-content p:last-child { margin-bottom: 0; }
            .message-content ul { margin: 8px 0; padding-left: 20px; }
            .message-content li { margin: 4px 0; font-size: 13px; }
            .message-content strong { color: #a5b4fc; }
            
            .quick-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 0 20px 16px;
            }
            .quick-actions button {
                padding: 10px 16px;
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 20px;
                color: #a5b4fc;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .quick-actions button:hover {
                background: rgba(99, 102, 241, 0.25);
                border-color: #6366f1;
                transform: translateY(-2px);
            }

            .workflow-card {
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 14px;
                padding: 14px;
                margin-top: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .workflow-card:hover {
                background: rgba(99, 102, 241, 0.2);
                border-color: #6366f1;
                transform: translateX(4px);
            }
            .workflow-card-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 8px;
            }
            .workflow-card-icon { font-size: 24px; }
            .workflow-card-name { font-weight: 600; color: white; font-size: 14px; }
            .workflow-card-desc { font-size: 12px; color: #a0a0a0; line-height: 1.5; }
            .workflow-card-meta {
                display: flex;
                gap: 12px;
                margin-top: 10px;
                font-size: 11px;
                color: #888;
            }
            .workflow-card-meta span {
                background: rgba(255,255,255,0.05);
                padding: 4px 8px;
                border-radius: 6px;
            }
            
            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
                background: rgba(99, 102, 241, 0.15);
                border-radius: 18px;
                width: fit-content;
            }
            .typing-indicator span {
                width: 8px;
                height: 8px;
                background: #6366f1;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }
            .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
            .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                30% { transform: translateY(-8px); opacity: 1; }
            }
            
            .receptionist-input {
                display: flex;
                gap: 12px;
                padding: 16px 20px;
                background: rgba(0,0,0,0.3);
                border-top: 1px solid rgba(99, 102, 241, 0.1);
            }
            .receptionist-input input {
                flex: 1;
                padding: 14px 18px;
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 16px;
                color: white;
                font-size: 14px;
                transition: all 0.2s;
            }
            .receptionist-input input:focus {
                outline: none;
                border-color: #6366f1;
                background: rgba(99, 102, 241, 0.15);
            }
            .receptionist-input input::placeholder { color: #666; }
            .receptionist-input button {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border: none;
                border-radius: 14px;
                color: white;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .receptionist-input button:hover { transform: scale(1.05); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
            .receptionist-input button:disabled { opacity: 0.5; cursor: not-allowed; }
            
            .receptionist-footer {
                padding: 10px;
                text-align: center;
                font-size: 11px;
                color: #555;
                border-top: 1px solid rgba(255,255,255,0.05);
            }
            
            .ai-thinking {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #888;
                font-size: 12px;
                padding: 8px 0;
            }
            .ai-thinking-dots {
                display: flex;
                gap: 3px;
            }
            .ai-thinking-dots span {
                width: 6px;
                height: 6px;
                background: #6366f1;
                border-radius: 50%;
                animation: thinking 1s infinite;
            }
            .ai-thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
            .ai-thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes thinking {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    },

    // Bind events
    bindEvents() {
        document.getElementById('ai-receptionist-btn').addEventListener('click', () => this.toggle());
    },

    // Toggle modal
    toggle() {
        this.isOpen = !this.isOpen;
        document.getElementById('ai-receptionist-modal').classList.toggle('open', this.isOpen);
        if (this.isOpen) {
            document.getElementById('receptionist-input').focus();
        }
    },

    // Close modal
    close() {
        this.isOpen = false;
        document.getElementById('ai-receptionist-modal').classList.remove('open');
    },

    // Quick action
    quickAction(message) {
        document.getElementById('receptionist-input').value = message;
        this.sendMessage();
        // Hide quick actions after first use
        document.getElementById('quick-actions').style.display = 'none';
    },

    // Send message
    async sendMessage() {
        const input = document.getElementById('receptionist-input');
        const message = input.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Add to history
        this.conversationHistory.push({ role: 'user', content: message });

        // Show typing indicator
        this.showTyping();

        // Get AI response
        try {
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.addMessage(response, 'bot', true);
            this.conversationHistory.push({ role: 'assistant', content: response });
        } catch (error) {
            console.error('AI Error:', error);
            this.hideTyping();
            this.addMessage('Maaf, ada gangguan koneksi. Coba lagi ya! 🙏', 'bot', true);
        }
    },

    // Get AI response from Pollinations
    async getAIResponse(userMessage) {
        // Build context with workflow info
        const workflowContext = this.getWorkflowContext();
        
        // Build conversation for context
        const conversationContext = this.conversationHistory.slice(-6).map(msg => 
            `${msg.role === 'user' ? 'User' : 'Kira'}: ${msg.content}`
        ).join('\n');

        const fullPrompt = `${this.systemPrompt}

AVAILABLE WORKFLOWS (untuk referensi):
${workflowContext}

CONVERSATION HISTORY:
${conversationContext}

User: ${userMessage}

Kira:`;

        // Call Pollinations API
        const response = await fetch(this.pollinationsAPI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: this.systemPrompt },
                    ...this.conversationHistory.slice(-6),
                    { role: 'user', content: userMessage }
                ],
                model: 'openai',
                seed: Math.floor(Math.random() * 1000)
            })
        });

        if (!response.ok) {
            // Fallback to simple GET request
            const encodedPrompt = encodeURIComponent(fullPrompt);
            const fallbackResponse = await fetch(`${this.pollinationsAPI}${encodedPrompt}`);
            return await fallbackResponse.text();
        }

        const data = await response.text();
        return this.processAIResponse(data, userMessage);
    },

    // Process AI response and add workflow cards if mentioned
    processAIResponse(response, userMessage) {
        // Clean up response
        let cleanResponse = response.trim();
        
        // Check if response mentions specific workflows and add cards
        const mentionedWorkflows = this.findMentionedWorkflows(cleanResponse, userMessage);
        
        if (mentionedWorkflows.length > 0) {
            cleanResponse += '\n\n__WORKFLOWS__' + JSON.stringify(mentionedWorkflows);
        }
        
        return cleanResponse;
    },

    // Find workflows mentioned in response
    findMentionedWorkflows(response, userMessage) {
        const found = [];
        const combined = (response + ' ' + userMessage).toLowerCase();
        
        // Get workflows from master
        const workflows = window.WorkflowsMaster?.workflows || window.WorkflowsDetailedBatch1 || {};
        
        // Keywords to workflow mapping
        const keywordMap = {
            'carousel': 'carousel-master',
            'instagram': 'carousel-master',
            'artikel': 'seo-article-pro',
            'article': 'seo-article-pro',
            'seo': 'seo-article-pro',
            'thread': 'viral-thread',
            'twitter': 'viral-thread',
            'video pendek': 'short-video',
            'tiktok': 'short-video',
            'reels': 'short-video',
            'shorts': 'short-video',
            'youtube': 'youtube-video',
            'podcast': 'podcast-creator',
            'brand': 'brand-kit',
            'branding': 'brand-kit',
            'logo': 'logo-suite',
            'caption': 'caption-generator',
            'hook': 'hook-generator',
            'thumbnail': 'thumbnail-generator',
            'email': 'email-campaign',
            'newsletter': 'newsletter-writer',
            'product photo': 'product-photoshoot',
            'foto produk': 'product-photoshoot',
            'webinar': 'webinar-content',
            'presentasi': 'presentation',
            'presentation': 'presentation',
            'hashtag': 'hashtag-generator',
            'bio': 'bio-generator',
            'script': 'script-writer',
            'copywriting': 'copywriting-formula',
            'landing page': 'landing-page',
            'faq': 'faq-generator',
            'testimonial': 'testimonial-social-proof',
            'infographic': 'infographic-generator',
            'meme': 'meme-generator',
            'quote': 'quote-graphics',
            'banner': 'banner-generator',
            'packaging': 'packaging-design',
            'catalog': 'product-catalog',
            'lookbook': 'fashion-lookbook',
            'skincare': 'skincare-cosmetic-kit',
            'food': 'food-beverage-kit',
            'makanan': 'food-beverage-kit',
            'umkm': 'umkm-starter-kit',
            'event': 'event-promotion-kit',
            'influencer': 'influencer-brief',
            'competitor': 'competitor-analysis',
            'content calendar': 'content-calendar',
            'kalender konten': 'content-calendar'
        };

        // Find matching workflows
        Object.entries(keywordMap).forEach(([keyword, workflowId]) => {
            if (combined.includes(keyword) && workflows[workflowId]) {
                if (!found.find(f => f.key === workflowId)) {
                    found.push({
                        key: workflowId,
                        workflow: workflows[workflowId]
                    });
                }
            }
        });

        return found.slice(0, 3); // Max 3 recommendations
    },

    // Get workflow context for AI
    getWorkflowContext() {
        const workflows = window.WorkflowsMaster?.workflows || window.WorkflowsDetailedBatch1 || {};
        const categories = {};
        
        Object.entries(workflows).forEach(([key, wf]) => {
            const cat = wf.category || 'other';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(`- ${wf.name} (${key}): ${wf.description}`);
        });

        return Object.entries(categories)
            .map(([cat, items]) => `${cat.toUpperCase()}:\n${items.slice(0, 5).join('\n')}`)
            .join('\n\n');
    },

    // Add message to chat
    addMessage(content, type, isHTML = false) {
        const chat = document.getElementById('receptionist-chat');
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${type}`;
        
        // Check for workflow cards
        let mainContent = content;
        let workflowCards = '';
        
        if (content.includes('__WORKFLOWS__')) {
            const parts = content.split('__WORKFLOWS__');
            mainContent = parts[0];
            try {
                const workflows = JSON.parse(parts[1]);
                workflowCards = this.renderWorkflowCards(workflows);
            } catch (e) {}
        }

        // Format content
        let formattedContent = mainContent;
        if (type === 'bot') {
            formattedContent = this.formatBotMessage(mainContent);
        }

        if (type === 'bot') {
            msgDiv.innerHTML = `
                <div class="bot-avatar">🤖</div>
                <div class="message-content">
                    ${formattedContent}
                    ${workflowCards}
                </div>
            `;
        } else {
            msgDiv.innerHTML = `<div class="message-content"><p>${content}</p></div>`;
        }
        
        chat.appendChild(msgDiv);
        chat.scrollTop = chat.scrollHeight;
    },

    // Format bot message with markdown-like formatting
    formatBotMessage(text) {
        return text
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                // Bold
                line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Lists
                if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                    return `<li>${line.replace(/^[-•]\s*/, '')}</li>`;
                }
                // Numbered lists
                if (/^\d+\.\s/.test(line.trim())) {
                    return `<li>${line.replace(/^\d+\.\s*/, '')}</li>`;
                }
                return `<p>${line}</p>`;
            })
            .join('')
            .replace(/<\/li><li>/g, '</li><li>')
            .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
            .replace(/<\/ul><ul>/g, '');
    },

    // Render workflow cards
    renderWorkflowCards(workflows) {
        if (!workflows || workflows.length === 0) return '';
        
        return `
            <div class="workflow-recommendations">
                <p style="margin-top:12px;font-size:12px;color:#888;">📌 Rekomendasi tools:</p>
                ${workflows.map(item => {
                    const wf = item.workflow;
                    return `
                        <div class="workflow-card" onclick="AIReceptionist.openWorkflow('${item.key}')">
                            <div class="workflow-card-header">
                                <span class="workflow-card-icon">${wf.icon || '🔧'}</span>
                                <span class="workflow-card-name">${wf.name}</span>
                            </div>
                            <div class="workflow-card-desc">${wf.description || ''}</div>
                            <div class="workflow-card-meta">
                                <span>⏱️ ${wf.estimatedTime || '5-10 min'}</span>
                                <span>📊 ${wf.difficulty || 'intermediate'}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    // Show typing indicator
    showTyping() {
        this.isTyping = true;
        document.getElementById('send-btn').disabled = true;
        document.getElementById('ai-status').innerHTML = '🟡 Thinking...';
        
        const chat = document.getElementById('receptionist-chat');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'chat-message bot';
        typingDiv.innerHTML = `
            <div class="bot-avatar">🤖</div>
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        chat.appendChild(typingDiv);
        chat.scrollTop = chat.scrollHeight;
    },

    // Hide typing indicator
    hideTyping() {
        this.isTyping = false;
        document.getElementById('send-btn').disabled = false;
        document.getElementById('ai-status').innerHTML = '🟢 Online • Powered by AI';
        
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    },

    // Open workflow
    openWorkflow(workflowKey) {
        this.close();
        
        // Navigate to Magic Studio
        if (typeof navigateTo === 'function') {
            navigateTo('magic-studio');
        }
        
        // Open workflow modal
        setTimeout(() => {
            if (typeof MagicStudioUltra !== 'undefined' && MagicStudioUltra.openWorkflow) {
                MagicStudioUltra.openWorkflow(workflowKey);
            }
        }, 300);
    }
};

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AIReceptionist.init();
});

// Export
window.AIReceptionist = AIReceptionist;
