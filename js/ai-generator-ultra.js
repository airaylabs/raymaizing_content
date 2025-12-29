// ==================== AI GENERATOR ULTRA ====================
// Enhanced AI Generator with Multi-Type Generation, Content Hub Integration
// Version 2.0

const GeneratorUltra = {
    source: 'new',
    loadedContent: null,
    selectedTypes: ['text_article'],
    generatedResults: [],

    // ==================== INITIALIZATION ====================
    init() {
        this.setupTypeCheckboxes();
        this.refreshContentList();
    },

    // ==================== SOURCE SELECTION ====================
    setSource(source) {
        this.source = source;
        
        document.querySelectorAll('.source-btn').forEach(btn => {
            const isActive = btn.dataset.source === source;
            btn.style.background = isActive ? 'var(--primary)' : 'var(--bg-muted)';
            btn.style.borderColor = isActive ? 'var(--primary)' : 'var(--border)';
            btn.style.color = isActive ? 'white' : 'var(--text-primary)';
        });
        
        const select = document.getElementById('gen-content-select');
        if (select) {
            select.style.display = source === 'existing' ? 'block' : 'none';
        }
        
        if (source === 'new') {
            this.loadedContent = null;
            document.getElementById('gen-topic').value = '';
        }
    },

    // ==================== CONTENT HUB INTEGRATION ====================
    refreshContentList() {
        const select = document.getElementById('gen-content-select');
        if (!select || typeof DB === 'undefined') return;
        
        const contents = DB.content.getAll();
        select.innerHTML = '<option value="">Select existing content...</option>' + 
            contents.map(c => {
                const type = Config.getType(c.contentType);
                return `<option value="${c.id}">${c.title || 'Untitled'} (${type.name})</option>`;
            }).join('');
    },

    loadFromHub(contentId) {
        if (!contentId) {
            this.loadedContent = null;
            return;
        }
        
        const content = DB.content.getById(contentId);
        if (!content) return;
        
        this.loadedContent = content;
        document.getElementById('gen-topic').value = content.title + '\n\n' + (content.content || '');
        
        showToast(`Loaded: ${content.title}`, 'success');
    },


    // ==================== TYPE SELECTION ====================
    setupTypeCheckboxes() {
        document.querySelectorAll('.type-checkbox input').forEach(cb => {
            cb.addEventListener('change', () => this.updateSelectedTypes());
        });
    },

    updateSelectedTypes() {
        this.selectedTypes = [];
        document.querySelectorAll('.type-checkbox input:checked').forEach(cb => {
            this.selectedTypes.push(cb.value);
        });
    },

    // ==================== GENERATE ALL ====================
    generateAll() {
        const topic = document.getElementById('gen-topic').value.trim();
        if (!topic) {
            showToast('Please enter a topic or idea', 'error');
            return;
        }
        
        if (this.selectedTypes.length === 0) {
            showToast('Please select at least one content type', 'error');
            return;
        }
        
        const tone = document.getElementById('gen-tone').value;
        const pillar = document.getElementById('gen-pillar').value;
        
        // Get Knowledge Base data
        const kb = typeof KnowledgeBase !== 'undefined' ? KnowledgeBase.getData() : {};
        
        // Generate results for each type
        this.generatedResults = this.selectedTypes.map(type => ({
            type,
            prompt: this.buildPrompt(type, topic, tone, pillar, kb),
            content: null
        }));
        
        this.renderResults();
    },

    // ==================== BUILD PROMPT ====================
    buildPrompt(contentType, topic, tone, pillar, kb) {
        const typeConfig = Config.getType(contentType);
        
        let prompt = `# Content Generation Request\n\n`;
        prompt += `## Content Type: ${typeConfig.name} ${typeConfig.icon}\n\n`;
        
        prompt += `## Topic/Idea:\n${topic}\n\n`;
        
        prompt += `## Brand Context:\n`;
        prompt += `- Brand: ${kb.brand?.name || 'raycorp'}\n`;
        prompt += `- Industry: ${kb.brand?.industry || 'Digital Marketing'}\n`;
        prompt += `- Tone: ${tone}\n`;
        prompt += `- Content Pillar: ${pillar}\n\n`;
        
        prompt += `## Target Audience:\n`;
        prompt += `- Demographics: ${kb.audience?.demographics || 'Entrepreneurs 25-40'}\n`;
        prompt += `- Pain Points: ${kb.audience?.painPoints || 'Time management, scaling business'}\n`;
        prompt += `- Goals: ${kb.audience?.goals || 'Business growth, work-life balance'}\n\n`;
        
        // Type-specific instructions
        switch (contentType) {
            case 'text_article':
                prompt += `## Output Requirements:\n`;
                prompt += `1. SEO-optimized title (60 chars max)\n`;
                prompt += `2. Meta description (155 chars max)\n`;
                prompt += `3. Article body (1500-2000 words)\n`;
                prompt += `4. H2 and H3 subheadings\n`;
                prompt += `5. Bullet points for key takeaways\n`;
                prompt += `6. Call-to-action at the end\n`;
                prompt += `7. 10-15 relevant hashtags\n\n`;
                break;
                
            case 'text_thread':
                prompt += `## Output Requirements:\n`;
                prompt += `1. Hook tweet (stop the scroll)\n`;
                prompt += `2. 7-10 thread tweets\n`;
                prompt += `3. Each tweet under 280 characters\n`;
                prompt += `4. Use emojis strategically\n`;
                prompt += `5. End with CTA tweet\n`;
                prompt += `6. Include engagement question\n`;
                prompt += `7. 5-10 relevant hashtags\n\n`;
                break;
                
            case 'video_short':
                prompt += `## Output Requirements:\n`;
                prompt += `1. Hook (first 3 seconds script)\n`;
                prompt += `2. Main content script (15-60 seconds)\n`;
                prompt += `3. Visual directions/B-roll suggestions\n`;
                prompt += `4. Text overlay suggestions\n`;
                prompt += `5. Music/sound recommendations\n`;
                prompt += `6. Caption for posting\n`;
                prompt += `7. 15-20 hashtags for TikTok/Reels\n\n`;
                break;
                
            case 'video_story':
                prompt += `## Output Requirements:\n`;
                prompt += `1. Story sequence (3-5 slides)\n`;
                prompt += `2. Text for each slide\n`;
                prompt += `3. Visual suggestions per slide\n`;
                prompt += `4. Interactive element (poll/quiz/question)\n`;
                prompt += `5. CTA slide content\n`;
                prompt += `6. Sticker/GIF suggestions\n\n`;
                break;
                
            case 'video_long':
                prompt += `## Output Requirements:\n`;
                prompt += `1. Video title (SEO-optimized)\n`;
                prompt += `2. Full script with timestamps\n`;
                prompt += `3. Intro hook (first 30 seconds)\n`;
                prompt += `4. Chapter markers\n`;
                prompt += `5. B-roll shot list\n`;
                prompt += `6. Thumbnail text suggestions\n`;
                prompt += `7. YouTube description with timestamps\n`;
                prompt += `8. Tags for YouTube SEO\n\n`;
                break;
                
            case 'image_carousel':
                prompt += `## Output Requirements:\n`;
                prompt += `1. Carousel title/cover slide\n`;
                prompt += `2. 7-10 slide content\n`;
                prompt += `3. Text for each slide (concise)\n`;
                prompt += `4. Visual direction per slide\n`;
                prompt += `5. Color scheme suggestion\n`;
                prompt += `6. CTA slide content\n`;
                prompt += `7. Caption for posting\n`;
                prompt += `8. 20-30 hashtags\n\n`;
                
                // Add image prompt section
                prompt += `## Image Generation Prompts:\n`;
                prompt += `For each slide, provide an Imagen/DALL-E prompt:\n`;
                prompt += `- Slide 1 (Cover): [detailed image prompt]\n`;
                prompt += `- Slide 2: [detailed image prompt]\n`;
                prompt += `- ... continue for all slides\n\n`;
                prompt += `Image prompt format: "Style, subject, composition, lighting, mood, colors"\n\n`;
                break;
        }
        
        prompt += `## Quality Guidelines:\n`;
        prompt += `- Make it engaging and valuable\n`;
        prompt += `- Use ${tone} tone throughout\n`;
        prompt += `- Include actionable insights\n`;
        prompt += `- Optimize for ${this.getPlatformForType(contentType)}\n`;
        prompt += `- Ensure brand voice consistency\n`;
        
        return prompt;
    },

    getPlatformForType(type) {
        const platforms = {
            text_article: 'Blog/LinkedIn/Medium',
            text_thread: 'Twitter/X',
            video_short: 'TikTok/Instagram Reels/YouTube Shorts',
            video_story: 'Instagram/Facebook Stories',
            video_long: 'YouTube',
            image_carousel: 'Instagram/LinkedIn'
        };
        return platforms[type] || 'Social Media';
    },


    // ==================== RENDER RESULTS ====================
    renderResults() {
        const container = document.getElementById('generator-results');
        if (!container) return;
        
        container.innerHTML = `
            <div style="margin-bottom:20px;">
                <h3 style="font-size:16px;font-weight:600;color:var(--text-primary);margin-bottom:8px;">
                    ✨ Generated Prompts (${this.generatedResults.length} types)
                </h3>
                <p style="font-size:12px;color:var(--text-muted);">
                    Copy each prompt and paste into Google AI Studio for generation
                </p>
            </div>
            
            <div style="display:flex;flex-direction:column;gap:16px;">
                ${this.generatedResults.map((result, index) => {
                    const type = Config.getType(result.type);
                    return `
                        <div class="result-card" style="background:var(--bg-muted);border-radius:12px;border:1px solid var(--border);overflow:hidden;">
                            <!-- Header -->
                            <div style="padding:16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                                <div style="display:flex;align-items:center;gap:12px;">
                                    <span style="font-size:24px;">${type.icon}</span>
                                    <div>
                                        <h4 style="font-size:14px;font-weight:600;color:var(--text-primary);">${type.name}</h4>
                                        <span style="font-size:11px;color:var(--text-muted);">${this.getPlatformForType(result.type)}</span>
                                    </div>
                                </div>
                                <div style="display:flex;gap:8px;">
                                    <button onclick="GeneratorUltra.copyPrompt(${index})" style="padding:8px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:6px;">
                                        📋 Copy Prompt
                                    </button>
                                    <button onclick="GeneratorUltra.openInOpal(${index})" style="padding:8px 16px;background:linear-gradient(135deg,#4285f4,#34a853);color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:6px;">
                                        🚀 Open in AI Studio
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Prompt Preview -->
                            <div style="padding:16px;max-height:200px;overflow-y:auto;">
                                <pre style="font-family:monospace;font-size:11px;line-height:1.5;white-space:pre-wrap;color:var(--text-secondary);">${result.prompt.substring(0, 500)}${result.prompt.length > 500 ? '...' : ''}</pre>
                            </div>
                            
                            <!-- Actions -->
                            <div style="padding:12px 16px;background:var(--bg-card);border-top:1px solid var(--border);display:flex;gap:8px;">
                                <button onclick="GeneratorUltra.saveToHub(${index})" style="padding:8px 16px;background:var(--success);color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;">
                                    💾 Save to Content Hub
                                </button>
                                <button onclick="GeneratorUltra.openInMagicStudio(${index})" style="padding:8px 16px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;">
                                    🔮 Enhance in Magic Studio
                                </button>
                                <button onclick="GeneratorUltra.scheduleContent(${index})" style="padding:8px 16px;background:var(--bg-muted);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:12px;">
                                    📅 Schedule
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <!-- Bulk Actions -->
            <div style="margin-top:24px;padding:16px;background:var(--bg-muted);border-radius:12px;display:flex;justify-content:between;align-items:center;gap:16px;">
                <span style="font-size:13px;color:var(--text-primary);font-weight:500;">Bulk Actions:</span>
                <button onclick="GeneratorUltra.copyAllPrompts()" style="padding:10px 20px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:12px;">
                    📋 Copy All Prompts
                </button>
                <button onclick="GeneratorUltra.saveAllToHub()" style="padding:10px 20px;background:var(--success);color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;">
                    💾 Save All to Hub
                </button>
                <button onclick="GeneratorUltra.scheduleAll()" style="padding:10px 20px;background:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;">
                    📅 Auto-Schedule All
                </button>
            </div>
        `;
    },

    // ==================== ACTIONS ====================
    copyPrompt(index) {
        const result = this.generatedResults[index];
        if (!result) return;
        
        navigator.clipboard.writeText(result.prompt).then(() => {
            showToast('Prompt copied to clipboard!', 'success');
        });
    },

    copyAllPrompts() {
        const allPrompts = this.generatedResults.map((r, i) => {
            const type = Config.getType(r.type);
            return `=== ${type.name} ===\n\n${r.prompt}`;
        }).join('\n\n' + '='.repeat(50) + '\n\n');
        
        navigator.clipboard.writeText(allPrompts).then(() => {
            showToast('All prompts copied!', 'success');
        });
    },

    openInOpal(index) {
        const result = this.generatedResults[index];
        if (!result) return;
        
        const encodedPrompt = encodeURIComponent(result.prompt);
        window.open(`https://aistudio.google.com/app/prompts/new_chat?prompt=${encodedPrompt}`, '_blank');
    },

    saveToHub(index) {
        const result = this.generatedResults[index];
        if (!result) return;
        
        const topic = document.getElementById('gen-topic').value;
        const pillar = document.getElementById('gen-pillar').value;
        const type = Config.getType(result.type);
        
        const content = {
            id: Date.now().toString() + index,
            title: `${topic.substring(0, 50)} - ${type.name}`,
            contentType: result.type,
            content: result.prompt,
            status: 'draft',
            pillar: pillar,
            platforms: this.getDefaultPlatforms(result.type),
            createdAt: new Date().toISOString(),
            source: 'ai-generator'
        };
        
        DB.content.add(content);
        showToast(`Saved to Content Hub: ${type.name}`, 'success');
        
        if (typeof ContentHub !== 'undefined') {
            ContentHub.render();
        }
    },

    saveAllToHub() {
        this.generatedResults.forEach((_, index) => {
            this.saveToHub(index);
        });
        showToast(`Saved ${this.generatedResults.length} items to Content Hub!`, 'success');
    },

    getDefaultPlatforms(type) {
        const platformMap = {
            text_article: ['blog', 'linkedin', 'medium'],
            text_thread: ['twitter'],
            video_short: ['tiktok', 'instagram', 'youtube'],
            video_story: ['instagram', 'facebook'],
            video_long: ['youtube'],
            image_carousel: ['instagram', 'linkedin']
        };
        return platformMap[type] || ['instagram'];
    },

    scheduleContent(index) {
        const result = this.generatedResults[index];
        if (!result) return;
        
        // Calculate optimal date based on content type
        const scheduledDate = this.calculateOptimalDate(result.type, index);
        
        const topic = document.getElementById('gen-topic').value;
        const pillar = document.getElementById('gen-pillar').value;
        const type = Config.getType(result.type);
        
        const content = {
            id: Date.now().toString() + index,
            title: `${topic.substring(0, 50)} - ${type.name}`,
            contentType: result.type,
            content: result.prompt,
            status: 'scheduled',
            scheduledDate: scheduledDate,
            pillar: pillar,
            platforms: this.getDefaultPlatforms(result.type),
            createdAt: new Date().toISOString(),
            source: 'ai-generator'
        };
        
        DB.content.add(content);
        showToast(`Scheduled for ${scheduledDate}: ${type.name}`, 'success');
        
        if (typeof ContentHub !== 'undefined') {
            ContentHub.render();
        }
    },

    scheduleAll() {
        this.generatedResults.forEach((_, index) => {
            this.scheduleContent(index);
        });
        showToast(`Scheduled ${this.generatedResults.length} items!`, 'success');
    },

    calculateOptimalDate(type, offset = 0) {
        const today = new Date();
        const daysToAdd = {
            text_article: 7,      // Weekly articles
            text_thread: 2,       // Every 2 days
            video_short: 1,       // Daily shorts
            video_story: 1,       // Daily stories
            video_long: 14,       // Bi-weekly long videos
            image_carousel: 3     // Every 3 days
        };
        
        const baseDays = daysToAdd[type] || 3;
        today.setDate(today.getDate() + baseDays + (offset * baseDays));
        
        return today.toISOString().split('T')[0];
    },

    openInMagicStudio(index) {
        const result = this.generatedResults[index];
        if (!result) return;
        
        localStorage.setItem('magicStudioTempContent', JSON.stringify({
            title: document.getElementById('gen-topic').value,
            content: result.prompt,
            contentType: result.type
        }));
        
        navigateTo('magic-studio');
        
        setTimeout(() => {
            if (typeof MagicStudioUltra !== 'undefined') {
                MagicStudioUltra.loadFromTemp();
            }
        }, 100);
    }
};

// ==================== EXTEND EXISTING GENERATOR ====================
if (typeof Generator !== 'undefined') {
    Object.assign(Generator, GeneratorUltra);
} else {
    window.Generator = GeneratorUltra;
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof GeneratorUltra !== 'undefined') {
            GeneratorUltra.init();
        }
    }, 500);
});

console.log('⚡ AI Generator Ultra loaded!');
