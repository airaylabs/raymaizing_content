// ==================== ULTRA KNOWLEDGE BASE ====================
// Advanced AI-Powered Knowledge Management System
// Version 4.0 - December 2025

const UltraKnowledgeBase = {
    // State
    state: {
        documents: [],
        categories: ['Brand', 'Products', 'Audience', 'Competitors', 'Industry', 'Templates'],
        searchIndex: {},
        embeddings: {},
        isIndexing: false
    },

    // Initialize
    init() {
        this.loadData();
        this.renderKnowledgeBase();
        console.log('📚 Ultra Knowledge Base initialized');
        return this;
    },

    loadData() {
        const saved = localStorage.getItem('raycorp-knowledge-base');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.state.documents = parsed.documents || [];
            this.state.searchIndex = parsed.searchIndex || {};
        }
    },

    saveData() {
        localStorage.setItem('raycorp-knowledge-base', JSON.stringify({
            documents: this.state.documents,
            searchIndex: this.state.searchIndex,
            brandInfo: this.getBrandInfo()
        }));
    },

    getBrandInfo() {
        const settings = JSON.parse(localStorage.getItem('raycorp-settings') || '{}');
        return settings.brand || {};
    },

    // Render Knowledge Base Page
    renderKnowledgeBase() {
        const container = document.getElementById('knowledge-base');
        if (!container) return;

        container.innerHTML = `
            <div class="section-header">
                <div>
                    <h1>📚 Knowledge Base</h1>
                    <p>AI-powered knowledge management for smarter content creation</p>
                </div>
                <div class="header-actions">
                    <button class="btn-secondary" onclick="UltraKnowledgeBase.exportAll()">📤 Export</button>
                    <button class="btn-primary" onclick="UltraKnowledgeBase.openAddModal()">+ Add Knowledge</button>
                </div>
            </div>

            <!-- AI Status Banner -->
            <div class="kb-ai-banner">
                <div class="kb-ai-icon">🧠</div>
                <div class="kb-ai-info">
                    <h4>AI Knowledge Integration Active</h4>
                    <p>Your knowledge base is automatically used to enhance AI-generated content</p>
                </div>
                <div class="kb-ai-stats">
                    <span class="kb-stat"><strong id="kb-doc-count">${this.state.documents.length}</strong> Documents</span>
                    <span class="kb-stat"><strong id="kb-word-count">${this.getTotalWords()}</strong> Words</span>
                </div>
            </div>

            <!-- Search & Filter -->
            <div class="kb-toolbar">
                <div class="kb-search">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="kb-search-input" placeholder="Search knowledge base..." oninput="UltraKnowledgeBase.search(this.value)">
                </div>
                <div class="kb-filters">
                    <select id="kb-category-filter" onchange="UltraKnowledgeBase.filterByCategory(this.value)">
                        <option value="all">All Categories</option>
                        ${this.state.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                    <button class="btn-icon" onclick="UltraKnowledgeBase.toggleView()" title="Toggle View">📊</button>
                </div>
            </div>

            <!-- Quick Add Cards -->
            <div class="kb-quick-add">
                <h3>Quick Add</h3>
                <div class="kb-quick-cards">
                    <button class="kb-quick-card" onclick="UltraKnowledgeBase.quickAdd('brand')">
                        <span class="qc-icon">🏢</span>
                        <span class="qc-title">Brand Info</span>
                        <span class="qc-desc">Company details, mission, values</span>
                    </button>
                    <button class="kb-quick-card" onclick="UltraKnowledgeBase.quickAdd('product')">
                        <span class="qc-icon">📦</span>
                        <span class="qc-title">Product/Service</span>
                        <span class="qc-desc">Features, benefits, pricing</span>
                    </button>
                    <button class="kb-quick-card" onclick="UltraKnowledgeBase.quickAdd('audience')">
                        <span class="qc-icon">👥</span>
                        <span class="qc-title">Target Audience</span>
                        <span class="qc-desc">Demographics, interests, pain points</span>
                    </button>
                    <button class="kb-quick-card" onclick="UltraKnowledgeBase.quickAdd('competitor')">
                        <span class="qc-icon">🎯</span>
                        <span class="qc-title">Competitor</span>
                        <span class="qc-desc">Analysis, strengths, weaknesses</span>
                    </button>
                    <button class="kb-quick-card" onclick="UltraKnowledgeBase.quickAdd('template')">
                        <span class="qc-icon">📝</span>
                        <span class="qc-title">Content Template</span>
                        <span class="qc-desc">Reusable content formats</span>
                    </button>
                    <button class="kb-quick-card" onclick="UltraKnowledgeBase.quickAdd('faq')">
                        <span class="qc-icon">❓</span>
                        <span class="qc-title">FAQ</span>
                        <span class="qc-desc">Common questions & answers</span>
                    </button>
                </div>
            </div>

            <!-- Documents Grid -->
            <div class="kb-documents-section">
                <div class="kb-section-header">
                    <h3>📄 Documents</h3>
                    <span class="doc-count" id="filtered-count">${this.state.documents.length} items</span>
                </div>
                <div class="kb-documents-grid" id="kb-documents-grid">
                    ${this.renderDocuments()}
                </div>
            </div>

            <!-- AI Suggestions -->
            <div class="kb-suggestions-section">
                <div class="kb-section-header">
                    <h3>💡 AI Suggestions</h3>
                    <button class="btn-ghost" onclick="UltraKnowledgeBase.generateSuggestions()">Refresh →</button>
                </div>
                <div class="kb-suggestions" id="kb-suggestions">
                    ${this.renderSuggestions()}
                </div>
            </div>
        `;

        this.addStyles();
    },

    // Render Documents
    renderDocuments() {
        if (this.state.documents.length === 0) {
            return `
                <div class="kb-empty-state">
                    <span class="empty-icon">📚</span>
                    <h3>No documents yet</h3>
                    <p>Add knowledge to help AI create better content for your brand</p>
                    <button class="btn-primary" onclick="UltraKnowledgeBase.openAddModal()">+ Add First Document</button>
                </div>
            `;
        }

        return this.state.documents.map(doc => `
            <div class="kb-document-card" data-id="${doc.id}" data-category="${doc.category}">
                <div class="doc-header">
                    <span class="doc-category-badge">${this.getCategoryIcon(doc.category)} ${doc.category}</span>
                    <div class="doc-actions">
                        <button class="btn-icon-sm" onclick="UltraKnowledgeBase.editDocument('${doc.id}')" title="Edit">✏️</button>
                        <button class="btn-icon-sm" onclick="UltraKnowledgeBase.deleteDocument('${doc.id}')" title="Delete">🗑️</button>
                    </div>
                </div>
                <h4 class="doc-title">${doc.title}</h4>
                <p class="doc-preview">${this.truncate(doc.content, 120)}</p>
                <div class="doc-footer">
                    <span class="doc-date">${this.formatDate(doc.createdAt)}</span>
                    <span class="doc-words">${this.countWords(doc.content)} words</span>
                </div>
            </div>
        `).join('');
    },

    getCategoryIcon(category) {
        const icons = {
            'Brand': '🏢',
            'Products': '📦',
            'Audience': '👥',
            'Competitors': '🎯',
            'Industry': '🏭',
            'Templates': '📝'
        };
        return icons[category] || '📄';
    },

    truncate(text, length) {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    },

    formatDate(date) {
        if (!date) return 'Just now';
        return new Date(date).toLocaleDateString();
    },

    countWords(text) {
        if (!text) return 0;
        return text.split(/\s+/).filter(w => w).length;
    },

    getTotalWords() {
        return this.state.documents.reduce((sum, doc) => sum + this.countWords(doc.content), 0);
    },

    // Render Suggestions
    renderSuggestions() {
        const suggestions = [
            { icon: '🏢', text: 'Add your brand story and mission statement', action: 'brand' },
            { icon: '👥', text: 'Define your target audience personas', action: 'audience' },
            { icon: '📦', text: 'Document your products/services details', action: 'product' },
            { icon: '🎯', text: 'Analyze your top competitors', action: 'competitor' }
        ];

        return suggestions.map(s => `
            <div class="kb-suggestion-item" onclick="UltraKnowledgeBase.quickAdd('${s.action}')">
                <span class="suggestion-icon">${s.icon}</span>
                <span class="suggestion-text">${s.text}</span>
                <span class="suggestion-arrow">→</span>
            </div>
        `).join('');
    },

    // Open Add Modal
    openAddModal(category = null) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'kb-add-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>📄 Add Knowledge</h2>
                    <button class="modal-close" onclick="document.getElementById('kb-add-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="kb-doc-title" placeholder="e.g., Brand Story, Product Features...">
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select id="kb-doc-category">
                            ${this.state.categories.map(cat => `
                                <option value="${cat}" ${cat === category ? 'selected' : ''}>${this.getCategoryIcon(cat)} ${cat}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Content</label>
                        <textarea id="kb-doc-content" rows="10" placeholder="Enter detailed information..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Tags (comma separated)</label>
                        <input type="text" id="kb-doc-tags" placeholder="e.g., brand, mission, values">
                    </div>
                    <div class="ai-enhance-section">
                        <button class="btn-secondary" onclick="UltraKnowledgeBase.enhanceWithAI()">
                            🤖 Enhance with AI
                        </button>
                        <span class="ai-hint">AI will expand and improve your content</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="document.getElementById('kb-add-modal').remove()">Cancel</button>
                    <button class="btn-primary" onclick="UltraKnowledgeBase.saveDocument()">💾 Save Document</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // Quick Add with Templates
    quickAdd(type) {
        const templates = {
            brand: {
                title: 'Brand Information',
                category: 'Brand',
                content: `Brand Name: [Your Brand Name]

Mission Statement:
[What is your brand's purpose?]

Vision:
[Where do you see your brand in 5 years?]

Core Values:
1. [Value 1]
2. [Value 2]
3. [Value 3]

Brand Voice & Tone:
[How does your brand communicate? Professional, casual, friendly, etc.]

Unique Selling Proposition (USP):
[What makes your brand different?]

Brand Story:
[Tell your brand's origin story]`
            },
            product: {
                title: 'Product/Service Details',
                category: 'Products',
                content: `Product/Service Name: [Name]

Description:
[Brief description of what it is]

Key Features:
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

Benefits:
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

Target Customer:
[Who is this product for?]

Pricing:
[Price or pricing tiers]

Unique Value:
[What makes this product special?]`
            },
            audience: {
                title: 'Target Audience Persona',
                category: 'Audience',
                content: `Persona Name: [Name]

Demographics:
- Age: [Range]
- Gender: [M/F/All]
- Location: [Geographic area]
- Income: [Range]
- Education: [Level]

Psychographics:
- Interests: [List interests]
- Values: [What they care about]
- Lifestyle: [How they live]

Pain Points:
1. [Problem 1]
2. [Problem 2]
3. [Problem 3]

Goals & Aspirations:
1. [Goal 1]
2. [Goal 2]

Where They Hang Out Online:
- [Platform 1]
- [Platform 2]

Content Preferences:
[What type of content do they engage with?]`
            },
            competitor: {
                title: 'Competitor Analysis',
                category: 'Competitors',
                content: `Competitor Name: [Name]

Website: [URL]

Overview:
[Brief description of the competitor]

Strengths:
1. [Strength 1]
2. [Strength 2]
3. [Strength 3]

Weaknesses:
1. [Weakness 1]
2. [Weakness 2]

Their Target Audience:
[Who do they target?]

Pricing Strategy:
[How do they price?]

Marketing Channels:
- [Channel 1]
- [Channel 2]

What We Can Learn:
[Key takeaways]

How We Differentiate:
[Our advantages over them]`
            },
            template: {
                title: 'Content Template',
                category: 'Templates',
                content: `Template Name: [Name]

Use Case:
[When to use this template]

Structure:
1. Hook: [Opening line format]
2. Problem: [Address the pain point]
3. Solution: [Present your solution]
4. Proof: [Social proof or evidence]
5. CTA: [Call to action]

Example:
[Write a sample using this template]

Best Platforms:
- [Platform 1]
- [Platform 2]

Tips:
- [Tip 1]
- [Tip 2]`
            },
            faq: {
                title: 'FAQ Entry',
                category: 'Brand',
                content: `Question: [Common question]

Answer:
[Detailed answer]

Related Questions:
- [Related Q1]
- [Related Q2]

Keywords:
[Relevant keywords for this FAQ]`
            }
        };

        const template = templates[type] || templates.brand;
        this.openAddModal(template.category);

        setTimeout(() => {
            document.getElementById('kb-doc-title').value = template.title;
            document.getElementById('kb-doc-category').value = template.category;
            document.getElementById('kb-doc-content').value = template.content;
        }, 100);
    },

    // Save Document
    saveDocument() {
        const title = document.getElementById('kb-doc-title')?.value.trim();
        const category = document.getElementById('kb-doc-category')?.value;
        const content = document.getElementById('kb-doc-content')?.value.trim();
        const tags = document.getElementById('kb-doc-tags')?.value.split(',').map(t => t.trim()).filter(t => t);

        if (!title || !content) {
            this.showToast('Please fill in title and content', 'error');
            return;
        }

        const doc = {
            id: Date.now().toString(),
            title,
            category,
            content,
            tags,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this.state.documents.push(doc);
        this.indexDocument(doc);
        this.saveData();

        document.getElementById('kb-add-modal')?.remove();
        this.renderKnowledgeBase();
        this.showToast('Document saved! 📄', 'success');
    },

    // Index Document for Search
    indexDocument(doc) {
        const words = `${doc.title} ${doc.content} ${doc.tags?.join(' ')}`.toLowerCase().split(/\s+/);
        words.forEach(word => {
            if (word.length > 2) {
                if (!this.state.searchIndex[word]) {
                    this.state.searchIndex[word] = [];
                }
                if (!this.state.searchIndex[word].includes(doc.id)) {
                    this.state.searchIndex[word].push(doc.id);
                }
            }
        });
    },

    // Search
    search(query) {
        const grid = document.getElementById('kb-documents-grid');
        const countEl = document.getElementById('filtered-count');
        
        if (!query.trim()) {
            grid.innerHTML = this.renderDocuments();
            countEl.textContent = `${this.state.documents.length} items`;
            return;
        }

        const words = query.toLowerCase().split(/\s+/);
        const matchingIds = new Set();

        words.forEach(word => {
            Object.keys(this.state.searchIndex).forEach(indexWord => {
                if (indexWord.includes(word)) {
                    this.state.searchIndex[indexWord].forEach(id => matchingIds.add(id));
                }
            });
        });

        const filtered = this.state.documents.filter(doc => matchingIds.has(doc.id));
        
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="kb-empty-state">
                    <span class="empty-icon">🔍</span>
                    <h3>No results found</h3>
                    <p>Try different keywords</p>
                </div>
            `;
        } else {
            const originalDocs = this.state.documents;
            this.state.documents = filtered;
            grid.innerHTML = this.renderDocuments();
            this.state.documents = originalDocs;
        }
        
        countEl.textContent = `${filtered.length} items`;
    },

    // Filter by Category
    filterByCategory(category) {
        const grid = document.getElementById('kb-documents-grid');
        const countEl = document.getElementById('filtered-count');

        if (category === 'all') {
            grid.innerHTML = this.renderDocuments();
            countEl.textContent = `${this.state.documents.length} items`;
            return;
        }

        const filtered = this.state.documents.filter(doc => doc.category === category);
        
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="kb-empty-state">
                    <span class="empty-icon">📁</span>
                    <h3>No documents in ${category}</h3>
                    <button class="btn-primary" onclick="UltraKnowledgeBase.quickAdd('${category.toLowerCase()}')">+ Add ${category}</button>
                </div>
            `;
        } else {
            const originalDocs = this.state.documents;
            this.state.documents = filtered;
            grid.innerHTML = this.renderDocuments();
            this.state.documents = originalDocs;
        }
        
        countEl.textContent = `${filtered.length} items`;
    },

    // Edit Document
    editDocument(id) {
        const doc = this.state.documents.find(d => d.id === id);
        if (!doc) return;

        this.openAddModal(doc.category);

        setTimeout(() => {
            document.getElementById('kb-doc-title').value = doc.title;
            document.getElementById('kb-doc-category').value = doc.category;
            document.getElementById('kb-doc-content').value = doc.content;
            document.getElementById('kb-doc-tags').value = doc.tags?.join(', ') || '';

            // Change save button to update
            const saveBtn = document.querySelector('#kb-add-modal .btn-primary');
            if (saveBtn) {
                saveBtn.textContent = '💾 Update Document';
                saveBtn.onclick = () => this.updateDocument(id);
            }
        }, 100);
    },

    updateDocument(id) {
        const index = this.state.documents.findIndex(d => d.id === id);
        if (index === -1) return;

        const title = document.getElementById('kb-doc-title')?.value.trim();
        const category = document.getElementById('kb-doc-category')?.value;
        const content = document.getElementById('kb-doc-content')?.value.trim();
        const tags = document.getElementById('kb-doc-tags')?.value.split(',').map(t => t.trim()).filter(t => t);

        this.state.documents[index] = {
            ...this.state.documents[index],
            title,
            category,
            content,
            tags,
            updatedAt: Date.now()
        };

        this.saveData();
        document.getElementById('kb-add-modal')?.remove();
        this.renderKnowledgeBase();
        this.showToast('Document updated! ✅', 'success');
    },

    // Delete Document
    deleteDocument(id) {
        if (!confirm('Delete this document?')) return;

        this.state.documents = this.state.documents.filter(d => d.id !== id);
        this.saveData();
        this.renderKnowledgeBase();
        this.showToast('Document deleted', 'info');
    },

    // Enhance with AI
    async enhanceWithAI() {
        const content = document.getElementById('kb-doc-content')?.value;
        if (!content || content.length < 20) {
            this.showToast('Please add some content first', 'error');
            return;
        }

        const btn = document.querySelector('.ai-enhance-section button');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '🤖 Enhancing...';
        }

        try {
            if (window.UltraAIEngine) {
                const result = await UltraAIEngine.generateText(
                    `Enhance and expand this knowledge base content. Make it more detailed, well-structured, and useful for AI content generation. Keep the same format but add more depth:\n\n${content}`,
                    { temperature: 0.7, maxTokens: 2000 }
                );

                if (result.success) {
                    document.getElementById('kb-doc-content').value = result.content;
                    this.showToast('Content enhanced! ✨', 'success');
                }
            }
        } catch (e) {
            this.showToast('Enhancement failed', 'error');
        }

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🤖 Enhance with AI';
        }
    },

    // Export All
    exportAll() {
        const data = {
            exportedAt: new Date().toISOString(),
            documents: this.state.documents,
            brandInfo: this.getBrandInfo()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `knowledge-base-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Knowledge base exported! 📤', 'success');
    },

    // Generate Suggestions
    async generateSuggestions() {
        const container = document.getElementById('kb-suggestions');
        if (!container) return;

        container.innerHTML = '<div class="loading-state">🤖 Generating suggestions...</div>';

        // Analyze existing documents and suggest what's missing
        const existingCategories = [...new Set(this.state.documents.map(d => d.category))];
        const missingCategories = this.state.categories.filter(c => !existingCategories.includes(c));

        const suggestions = missingCategories.map(cat => ({
            icon: this.getCategoryIcon(cat),
            text: `Add ${cat.toLowerCase()} information to improve AI content`,
            action: cat.toLowerCase()
        }));

        if (suggestions.length === 0) {
            suggestions.push(
                { icon: '📝', text: 'Add more content templates', action: 'template' },
                { icon: '❓', text: 'Document frequently asked questions', action: 'faq' }
            );
        }

        container.innerHTML = suggestions.slice(0, 4).map(s => `
            <div class="kb-suggestion-item" onclick="UltraKnowledgeBase.quickAdd('${s.action}')">
                <span class="suggestion-icon">${s.icon}</span>
                <span class="suggestion-text">${s.text}</span>
                <span class="suggestion-arrow">→</span>
            </div>
        `).join('');
    },

    toggleView() {
        this.showToast('View toggle coming soon!', 'info');
    },

    showToast(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        }
    },

    // Add Styles
    addStyles() {
        if (document.getElementById('ultra-kb-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ultra-kb-styles';
        styles.textContent = `
            .kb-ai-banner {
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                padding: 20px 24px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 24px;
                color: white;
            }
            .kb-ai-icon { font-size: 32px; }
            .kb-ai-info h4 { margin: 0 0 4px 0; font-size: 15px; }
            .kb-ai-info p { margin: 0; font-size: 13px; opacity: 0.9; }
            .kb-ai-stats { margin-left: auto; display: flex; gap: 20px; }
            .kb-stat { font-size: 13px; }
            .kb-stat strong { display: block; font-size: 20px; }

            .kb-toolbar {
                display: flex;
                gap: 16px;
                margin-bottom: 24px;
                flex-wrap: wrap;
            }
            .kb-search {
                flex: 1;
                min-width: 250px;
                display: flex;
                align-items: center;
                gap: 10px;
                background: var(--bg-card);
                padding: 12px 16px;
                border-radius: 12px;
                border: 1px solid var(--border);
            }
            .kb-search input {
                flex: 1;
                background: none;
                border: none;
                color: var(--text-primary);
                font-size: 14px;
            }
            .kb-search input:focus { outline: none; }
            .kb-filters { display: flex; gap: 8px; }
            .kb-filters select {
                padding: 12px 16px;
                border: 1px solid var(--border);
                border-radius: 12px;
                background: var(--bg-card);
                color: var(--text-primary);
                font-size: 13px;
            }

            .kb-quick-add {
                background: var(--bg-card);
                padding: 20px;
                border-radius: 16px;
                margin-bottom: 24px;
                border: 1px solid var(--border);
            }
            .kb-quick-add h3 { margin: 0 0 16px 0; font-size: 15px; }
            .kb-quick-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 12px;
            }
            .kb-quick-card {
                background: var(--bg-muted);
                border: 1px solid var(--border);
                padding: 16px;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: left;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .kb-quick-card:hover {
                background: var(--primary);
                color: white;
                border-color: var(--primary);
            }
            .qc-icon { font-size: 24px; }
            .qc-title { font-weight: 600; font-size: 13px; }
            .qc-desc { font-size: 11px; opacity: 0.7; }

            .kb-documents-section {
                background: var(--bg-card);
                padding: 20px;
                border-radius: 16px;
                margin-bottom: 24px;
                border: 1px solid var(--border);
            }
            .kb-section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }
            .kb-section-header h3 { margin: 0; font-size: 15px; }
            .doc-count { font-size: 12px; color: var(--text-muted); }

            .kb-documents-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 16px;
            }
            .kb-document-card {
                background: var(--bg-muted);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 16px;
                transition: all 0.2s;
            }
            .kb-document-card:hover {
                border-color: var(--primary);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
            }
            .doc-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            .doc-category-badge {
                background: var(--bg-card);
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 11px;
                color: var(--text-muted);
            }
            .doc-actions { display: flex; gap: 4px; }
            .btn-icon-sm {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                opacity: 0.6;
                transition: opacity 0.2s;
            }
            .btn-icon-sm:hover { opacity: 1; }
            .doc-title {
                margin: 0 0 8px 0;
                font-size: 14px;
                color: var(--text-primary);
            }
            .doc-preview {
                font-size: 12px;
                color: var(--text-muted);
                line-height: 1.5;
                margin: 0 0 12px 0;
            }
            .doc-footer {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                color: var(--text-muted);
            }

            .kb-suggestions-section {
                background: var(--bg-card);
                padding: 20px;
                border-radius: 16px;
                border: 1px solid var(--border);
            }
            .kb-suggestions {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .kb-suggestion-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                background: var(--bg-muted);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .kb-suggestion-item:hover {
                background: var(--primary);
                color: white;
            }
            .suggestion-icon { font-size: 20px; }
            .suggestion-text { flex: 1; font-size: 13px; }
            .suggestion-arrow { opacity: 0.5; }

            .kb-empty-state {
                text-align: center;
                padding: 40px;
                grid-column: 1 / -1;
            }
            .kb-empty-state .empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
            .kb-empty-state h3 { margin: 0 0 8px 0; color: var(--text-primary); }
            .kb-empty-state p { color: var(--text-muted); margin: 0 0 16px 0; font-size: 13px; }

            .ai-enhance-section {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: var(--bg-muted);
                border-radius: 10px;
                margin-top: 12px;
            }
            .ai-hint { font-size: 11px; color: var(--text-muted); }

            .loading-state {
                text-align: center;
                padding: 20px;
                color: var(--text-muted);
            }
        `;
        document.head.appendChild(styles);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.UltraKnowledgeBase = UltraKnowledgeBase;
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltraKnowledgeBase;
}
