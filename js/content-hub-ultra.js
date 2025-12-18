// ==================== CONTENT HUB ULTRA V2 ====================
// Enhanced Content Hub with Full CRUD, Drag & Drop Calendar, Multi-Images Support
// Version 2.1 - Fixed & Enhanced

const ContentHubUltra = {
    currentView: 'simple',
    currentFilter: 'all',
    currentMonth: new Date(),
    calendarViewMode: 'month', // 'month' or 'week'
    editingContent: null,
    draggedItem: null,
    currentImages: [],

    // Platform mapping by content type
    platformsByType: {
        'text_article': ['blog', 'linkedin', 'medium'],
        'text_thread': ['twitter', 'threads'],
        'video_short': ['tiktok', 'instagram', 'youtube'],
        'video_story': ['instagram', 'facebook', 'whatsapp'],
        'video_long': ['youtube'],
        'image_carousel': ['instagram', 'linkedin', 'facebook']
    },

    // ==================== INITIALIZATION ====================
    init() {
        this.render();
        this.setupKeyboardShortcuts();
    },

    // ==================== RENDER ALL VIEWS ====================
    render() {
        this.renderSimpleView();
        this.renderFullView();
        this.renderKanban();
        this.renderCalendar();
        this.updateCounts();
    },

    // ==================== AUTO-SELECT PLATFORMS BY TYPE ====================
    getDefaultPlatforms(contentType) {
        return this.platformsByType[contentType] || ['instagram'];
    },

    onContentTypeChange(selectElement) {
        const contentType = selectElement.value;
        const defaultPlatforms = this.getDefaultPlatforms(contentType);
        
        // Update platform buttons
        document.querySelectorAll('#editor-platforms button').forEach(btn => {
            const platformId = btn.dataset.platform;
            const platform = this.getPlatformConfig(platformId);
            const isSelected = defaultPlatforms.includes(platformId);
            
            btn.style.background = isSelected ? platform.color : 'var(--bg-muted)';
            btn.style.borderColor = isSelected ? platform.color : 'var(--border)';
            btn.style.color = isSelected ? 'white' : 'var(--text-primary)';
        });

        // Update dynamic fields based on content type
        this.updateDynamicFields(contentType);
    },

    getPlatformConfig(platformId) {
        const platforms = {
            instagram: { color: '#E4405F' },
            tiktok: { color: '#000000' },
            youtube: { color: '#FF0000' },
            twitter: { color: '#1DA1F2' },
            linkedin: { color: '#0A66C2' },
            facebook: { color: '#1877F2' },
            medium: { color: '#000000' },
            blog: { color: '#10b981' },
            whatsapp: { color: '#25D366' },
            threads: { color: '#000000' }
        };
        return platforms[platformId] || { color: '#64748b' };
    },


    // ==================== DYNAMIC FIELDS BY CONTENT TYPE ====================
    updateDynamicFields(contentType) {
        const container = document.getElementById('editor-dynamic-fields');
        if (!container) return;

        let fieldsHTML = '';

        switch(contentType) {
            case 'text_article':
                fieldsHTML = `
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">📰 Meta Description</label>
                        <textarea id="field-meta-desc" rows="2" placeholder="SEO meta description (155 chars max)..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;"></textarea>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🔑 Keywords</label>
                        <input type="text" id="field-keywords" placeholder="keyword1, keyword2, keyword3..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;">
                    </div>
                `;
                break;

            case 'text_thread':
                fieldsHTML = `
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🎣 Hook Tweet</label>
                        <textarea id="field-hook" rows="2" placeholder="First tweet to grab attention..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;" maxlength="280" oninput="document.getElementById('hook-count').textContent = this.value.length"></textarea>
                        <div style="text-align:right;font-size:11px;color:var(--text-muted);margin-top:4px;"><span id="hook-count">0</span>/280</div>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🔢 Thread Count</label>
                        <select id="field-thread-count" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);">
                            <option value="5">5 tweets</option>
                            <option value="7">7 tweets</option>
                            <option value="10" selected>10 tweets</option>
                            <option value="15">15 tweets</option>
                        </select>
                    </div>
                `;
                break;

            case 'video_short':
            case 'video_story':
                fieldsHTML = `
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">⏱️ Duration</label>
                        <select id="field-duration" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);">
                            <option value="15">15 seconds</option>
                            <option value="30" selected>30 seconds</option>
                            <option value="60">60 seconds</option>
                            <option value="90">90 seconds</option>
                        </select>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🎣 Hook (First 3 sec)</label>
                        <textarea id="field-hook" rows="2" placeholder="Opening hook to stop the scroll..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;"></textarea>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">📜 Script</label>
                        <textarea id="field-script" rows="4" placeholder="Full video script with timing..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;"></textarea>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🎬 B-Roll / Visual Notes</label>
                        <textarea id="field-broll" rows="2" placeholder="Visual directions, B-roll suggestions..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;"></textarea>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🎵 Music/Sound</label>
                        <input type="text" id="field-music" placeholder="Trending sound or music suggestion..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;">
                    </div>
                `;
                break;

            case 'video_long':
                fieldsHTML = `
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">⏱️ Duration</label>
                        <select id="field-duration" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);">
                            <option value="5">5 minutes</option>
                            <option value="10" selected>10 minutes</option>
                            <option value="15">15 minutes</option>
                            <option value="20">20+ minutes</option>
                        </select>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🎣 Hook (First 30 sec)</label>
                        <textarea id="field-hook" rows="2" placeholder="Opening hook to retain viewers..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;"></textarea>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">📜 Full Script</label>
                        <textarea id="field-script" rows="6" placeholder="Complete video script with timestamps..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;"></textarea>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">📑 Chapters/Timestamps</label>
                        <textarea id="field-chapters" rows="3" placeholder="0:00 Intro&#10;1:30 Main Topic&#10;5:00 Tips..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;"></textarea>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🖼️ Thumbnail Text</label>
                        <input type="text" id="field-thumbnail" placeholder="Text for thumbnail (3-5 words)..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;">
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🏷️ YouTube Tags</label>
                        <input type="text" id="field-tags" placeholder="tag1, tag2, tag3..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;">
                    </div>
                `;
                break;

            case 'image_carousel':
                fieldsHTML = `
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🔢 Number of Slides</label>
                        <select id="field-slides" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);">
                            <option value="5">5 slides</option>
                            <option value="7">7 slides</option>
                            <option value="10" selected>10 slides</option>
                        </select>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">📝 Slide Contents</label>
                        <textarea id="field-slides-content" rows="6" placeholder="Slide 1: Cover - Title&#10;Slide 2: Problem&#10;Slide 3: Solution&#10;..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;"></textarea>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🎨 Image Prompts (for AI generation)</label>
                        <textarea id="field-image-prompts" rows="4" placeholder="Slide 1: Modern minimalist cover with bold typography...&#10;Slide 2: Illustration of person struggling with problem..." style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;"></textarea>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🎨 Color Scheme</label>
                        <input type="text" id="field-colors" placeholder="#FF5733, #3498DB, #2ECC71" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;">
                    </div>
                `;
                break;

            default:
                fieldsHTML = '';
        }

        container.innerHTML = fieldsHTML;
    },


    // ==================== GENERATE AI CONTENT ====================
    generateAIContent() {
        const title = document.getElementById('editor-title')?.value || '';
        const contentType = document.getElementById('editor-type')?.value || 'text_article';
        const pillar = document.getElementById('editor-pillar')?.value || '';
        const status = document.getElementById('editor-status')?.value || 'draft';
        const scheduledDate = document.getElementById('editor-date')?.value || '';

        if (!title) {
            showToast('Please enter a title first', 'error');
            return;
        }

        console.log('🚀 Starting AI generation for:', { title, contentType, pillar });

        // Get Knowledge Base data
        const kb = typeof KnowledgeBase !== 'undefined' ? KnowledgeBase.getData() : {};

        // Build comprehensive prompt based on content type
        let prompt = this.buildAIPrompt(title, contentType, pillar, kb);

        // Show generating state
        this.showGeneratingState();

        // IMPORTANT: First ensure dynamic fields are rendered for current content type
        this.updateDynamicFields(contentType);

        // Wait for DOM to update, then fill all fields
        setTimeout(() => {
            console.log('📝 Filling generated content...');
            this.fillGeneratedContent(contentType, title, pillar);
            this.hideGeneratingState();
            showToast('✨ Content generated! Review and edit as needed.', 'success');
        }, 500);
    },

    buildAIPrompt(title, contentType, pillar, kb) {
        let prompt = `Generate comprehensive content for:\n\n`;
        prompt += `Title: ${title}\n`;
        prompt += `Type: ${contentType}\n`;
        prompt += `Pillar: ${pillar}\n`;
        prompt += `Brand: ${kb.brand?.name || 'Lumakara'}\n`;
        prompt += `Audience: ${kb.audience?.demographics || 'Entrepreneurs 25-40'}\n\n`;

        switch(contentType) {
            case 'text_article':
                prompt += `Generate:\n1. Meta description (155 chars)\n2. Keywords\n3. Full article content\n4. Hashtags`;
                break;
            case 'text_thread':
                prompt += `Generate:\n1. Hook tweet\n2. Thread content (10 tweets)\n3. Hashtags`;
                break;
            case 'video_short':
            case 'video_story':
                prompt += `Generate:\n1. Hook (3 sec)\n2. Full script with timing\n3. B-roll suggestions\n4. Music recommendation\n5. Caption\n6. Hashtags`;
                break;
            case 'video_long':
                prompt += `Generate:\n1. Hook (30 sec)\n2. Full script\n3. Chapters/timestamps\n4. Thumbnail text\n5. YouTube tags\n6. Description\n7. Hashtags`;
                break;
            case 'image_carousel':
                prompt += `Generate:\n1. Slide contents (10 slides)\n2. Image prompts for each slide\n3. Color scheme\n4. Caption\n5. Hashtags`;
                break;
        }

        return prompt;
    },

    fillGeneratedContent(contentType, title, pillar) {
        console.log('📝 fillGeneratedContent called:', { contentType, title, pillar });
        
        const safePillar = pillar || 'content creation';
        
        // Fill caption/content
        const contentField = document.getElementById('editor-content');
        if (contentField) {
            contentField.value = this.generateCaption(contentType, title, safePillar);
            contentField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('✅ Caption filled');
        }

        // Fill hashtags
        const hashtagsField = document.getElementById('editor-hashtags');
        if (hashtagsField) {
            hashtagsField.value = this.generateHashtagsForType(contentType, title);
            hashtagsField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('✅ Hashtags filled');
        }

        // Fill type-specific fields with a small delay to ensure DOM is ready
        setTimeout(() => {
            console.log('📝 Filling dynamic fields for:', contentType);
            
            switch(contentType) {
                case 'text_article':
                    this.setFieldValue('field-meta-desc', `Pelajari ${title.toLowerCase()} dengan panduan lengkap ini. Tips praktis untuk ${safePillar.toLowerCase()} yang bisa langsung diterapkan.`);
                    this.setFieldValue('field-keywords', title.toLowerCase().split(' ').slice(0, 5).join(', '));
                    break;

                case 'text_thread':
                    this.setFieldValue('field-hook', `🧵 ${title}\n\nIni yang perlu kamu tahu:\n\n(Thread)`);
                    this.setFieldValue('field-thread-count', '10');
                    break;

                case 'video_short':
                case 'video_story':
                    this.setFieldValue('field-duration', '30');
                    this.setFieldValue('field-hook', `"Tahukah kamu tentang ${title.toLowerCase()}?"\n\n[Pause 1 detik untuk hook]`);
                    this.setFieldValue('field-script', `[0:00-0:03] HOOK: "${title}"\n[0:03-0:10] PROBLEM: Banyak orang struggle dengan...\n[0:10-0:25] SOLUTION: Ini caranya...\n[0:25-0:30] CTA: Follow untuk tips lainnya!`);
                    this.setFieldValue('field-broll', `- Close up hands/product\n- Text overlay animations\n- Before/after comparison`);
                    this.setFieldValue('field-music', `Trending sound - upbeat, motivational`);
                    break;

                case 'video_long':
                    this.setFieldValue('field-duration', '10');
                    this.setFieldValue('field-hook', `Dalam video ini, saya akan share ${title.toLowerCase()} yang sudah terbukti berhasil.\n\nTapi sebelum itu, pastikan subscribe dan nyalakan notifikasi!`);
                    this.setFieldValue('field-script', `[INTRO - 0:00]\nHai semuanya! Selamat datang di channel...\n\n[HOOK - 0:30]\n${title}\n\n[MAIN CONTENT - 2:00]\nPoin 1: ...\nPoin 2: ...\nPoin 3: ...\n\n[RECAP - 8:00]\nJadi kesimpulannya...\n\n[CTA - 9:30]\nJangan lupa like, subscribe, dan share!`);
                    this.setFieldValue('field-chapters', `0:00 Intro\n0:30 ${title}\n2:00 Poin Pertama\n4:00 Poin Kedua\n6:00 Poin Ketiga\n8:00 Kesimpulan\n9:30 Outro`);
                    this.setFieldValue('field-thumbnail', title.split(' ').slice(0, 4).join(' ').toUpperCase());
                    this.setFieldValue('field-tags', title.toLowerCase().split(' ').join(', ') + ', tips, tutorial, indonesia');
                    break;

                case 'image_carousel':
                    this.setFieldValue('field-slides', '10');
                    this.setFieldValue('field-slides-content', `Slide 1 (Cover): ${title}\nSlide 2: Masalah yang sering terjadi\nSlide 3: Kenapa ini penting\nSlide 4: Solusi #1\nSlide 5: Solusi #2\nSlide 6: Solusi #3\nSlide 7: Tips tambahan\nSlide 8: Common mistakes\nSlide 9: Quick recap\nSlide 10: CTA - Save & Share!`);
                    this.setFieldValue('field-image-prompts', `Slide 1: Modern minimalist design, bold typography "${title}", gradient background blue to purple\nSlide 2: Illustration of frustrated person, muted colors\nSlide 3: Lightbulb moment illustration, bright colors\nSlide 4-6: Clean infographic style, icons, bullet points\nSlide 7: Tips checklist design\nSlide 8: Red X marks on common mistakes\nSlide 9: Summary icons grid\nSlide 10: Call to action design with save icon`);
                    this.setFieldValue('field-colors', '#6366f1, #8b5cf6, #ec4899');
                    break;
            }
            
            console.log('✅ Dynamic fields filled for:', contentType);
        }, 100);
    },

    setFieldValue(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
            // Trigger input event for any listeners
            field.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.warn(`Field not found: ${fieldId}`);
        }
    },

    generateCaption(contentType, title, pillar) {
        const captions = {
            'text_article': `📝 ${title}\n\nDalam artikel ini, kamu akan belajar:\n✅ Poin penting #1\n✅ Poin penting #2\n✅ Poin penting #3\n\nBaca selengkapnya di link bio!\n\n`,
            'text_thread': `🧵 THREAD: ${title}\n\nIni yang perlu kamu tahu tentang ${pillar.toLowerCase()}:\n\n1/ Pertama...\n\n2/ Kedua...\n\n3/ Ketiga...\n\nRetweet kalau bermanfaat! 🔄`,
            'video_short': `${title} 🔥\n\nSave video ini biar gak lupa!\n\nFollow @username untuk tips ${pillar.toLowerCase()} lainnya ✨\n\n`,
            'video_story': `Swipe untuk lihat ${title.toLowerCase()} 👆\n\nTap ❤️ kalau relate!\n\n`,
            'video_long': `🎬 NEW VIDEO: ${title}\n\nDi video ini aku bahas:\n📌 Poin 1\n📌 Poin 2\n📌 Poin 3\n\nTonton full video di YouTube (link di bio)\n\nJangan lupa SUBSCRIBE! 🔔\n\n`,
            'image_carousel': `📚 ${title}\n\nSwipe untuk baca sampai habis! 👉\n\nSave post ini biar bisa dibaca lagi nanti 🔖\n\nShare ke teman yang butuh info ini!\n\n`
        };
        return captions[contentType] || `${title}\n\n`;
    },

    generateHashtagsForType(contentType, title) {
        const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').filter(w => w.length > 3);
        const baseHashtags = words.slice(0, 5).map(w => '#' + w);
        
        const typeHashtags = {
            'text_article': ['#artikel', '#tips', '#edukasi', '#belajar', '#indonesia'],
            'text_thread': ['#thread', '#threadtwitter', '#tipstwitter', '#viral'],
            'video_short': ['#reels', '#tiktok', '#fyp', '#viral', '#trending'],
            'video_story': ['#instastory', '#story', '#behindthescenes'],
            'video_long': ['#youtube', '#youtuber', '#tutorial', '#vlog'],
            'image_carousel': ['#carousel', '#infographic', '#tips', '#edukasi', '#swipe']
        };

        return [...baseHashtags, ...(typeHashtags[contentType] || [])].join(' ');
    },

    showGeneratingState() {
        const btn = document.querySelector('[onclick="ContentHubUltra.generateAIContent()"]');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳ Generating...';
        }
    },

    hideGeneratingState() {
        const btn = document.querySelector('[onclick="ContentHubUltra.generateAIContent()"]');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '✨ Generate AI';
        }
    },


    // ==================== FULL EDITOR MODAL - IMPROVED ====================
    openFullEditor(contentId) {
        const content = contentId ? DB.content.getById(contentId) : null;
        this.editingContent = content;
        
        const isNew = !content;
        const data = content || {
            title: '', contentType: 'text_article', status: 'draft',
            platforms: this.getDefaultPlatforms('text_article'), content: '', hashtags: '', pillar: '',
            images: [], imageUrl: '', scheduledDate: ''
        };
        
        const type = Config.getType(data.contentType);
        const images = data.images || (data.imageUrl ? [data.imageUrl] : []);
        this.currentImages = [...images];
        
        const modal = document.createElement('div');
        modal.id = 'full-editor-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);padding:20px;';
        
        modal.innerHTML = `
            <div style="background:var(--bg-card);border-radius:16px;width:100%;max-width:1000px;max-height:95vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 25px 50px rgba(0,0,0,0.5);">
                <!-- Header -->
                <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:var(--bg-muted);">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <span style="font-size:24px;">✏️</span>
                        <h2 style="font-size:18px;font-weight:600;color:var(--text-primary);">
                            ${isNew ? 'New Content' : 'Edit: ' + (data.title || 'Untitled')}
                        </h2>
                        <span style="background:${type.color}20;color:${type.color};padding:4px 12px;border-radius:8px;font-size:12px;">
                            ${type.icon} ${type.name}
                        </span>
                        <span style="background:var(--bg-card);padding:4px 12px;border-radius:8px;font-size:12px;color:var(--text-muted);">
                            ${data.status || 'draft'}
                        </span>
                    </div>
                    <button onclick="ContentHubUltra.closeFullEditor()" style="background:var(--bg-card);border:1px solid var(--border);width:36px;height:36px;border-radius:8px;cursor:pointer;font-size:18px;color:var(--text-muted);">&times;</button>
                </div>
                
                <!-- Body - Scrollable -->
                <div style="flex:1;overflow-y:auto;padding:24px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
                        <!-- Left Column -->
                        <div>
                            <!-- Title -->
                            <div style="margin-bottom:20px;">
                                <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">✏️ Title</label>
                                <input type="text" id="editor-title" value="${data.title || ''}" placeholder="Enter title..."
                                       style="width:100%;padding:14px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:14px;">
                            </div>
                            
                            <!-- Type & Status -->
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
                                <div>
                                    <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">📱 Content Type</label>
                                    <select id="editor-type" onchange="ContentHubUltra.onContentTypeChange(this)" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);">
                                        <option value="text_article" ${data.contentType === 'text_article' ? 'selected' : ''}>📝 Text Article</option>
                                        <option value="text_thread" ${data.contentType === 'text_thread' ? 'selected' : ''}>🐦 Text Thread</option>
                                        <option value="video_short" ${data.contentType === 'video_short' ? 'selected' : ''}>📱 Video Short</option>
                                        <option value="video_story" ${data.contentType === 'video_story' ? 'selected' : ''}>⏱️ Video Story</option>
                                        <option value="video_long" ${data.contentType === 'video_long' ? 'selected' : ''}>🎬 Video Long</option>
                                        <option value="image_carousel" ${data.contentType === 'image_carousel' ? 'selected' : ''}>🎨 Carousel</option>
                                    </select>
                                </div>
                                <div>
                                    <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">📊 Status</label>
                                    <select id="editor-status" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);">
                                        <option value="idea" ${data.status === 'idea' ? 'selected' : ''}>💡 Idea</option>
                                        <option value="draft" ${data.status === 'draft' ? 'selected' : ''}>📝 Draft</option>
                                        <option value="review" ${data.status === 'review' ? 'selected' : ''}>👀 Review</option>
                                        <option value="scheduled" ${data.status === 'scheduled' ? 'selected' : ''}>📅 Scheduled</option>
                                        <option value="published" ${data.status === 'published' ? 'selected' : ''}>✅ Published</option>
                                    </select>
                                </div>
                            </div>
                            
                            <!-- Date & Pillar -->
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
                                <div>
                                    <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">📅 Scheduled Date</label>
                                    <input type="date" id="editor-date" value="${data.scheduledDate || ''}"
                                           style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);">
                                </div>
                                <div>
                                    <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">📚 Content Pillar</label>
                                    <select id="editor-pillar" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);">
                                        <option value="">Select pillar...</option>
                                        <option value="Education" ${data.pillar === 'Education' ? 'selected' : ''}>Education</option>
                                        <option value="Inspiration" ${data.pillar === 'Inspiration' ? 'selected' : ''}>Inspiration</option>
                                        <option value="Tips & Tricks" ${data.pillar === 'Tips & Tricks' ? 'selected' : ''}>Tips & Tricks</option>
                                        <option value="Behind the Scenes" ${data.pillar === 'Behind the Scenes' ? 'selected' : ''}>Behind the Scenes</option>
                                        <option value="Promotion" ${data.pillar === 'Promotion' ? 'selected' : ''}>Promotion</option>
                                    </select>
                                </div>
                            </div>
                            
                            <!-- Platforms -->
                            <div style="margin-bottom:20px;">
                                <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🌐 Platforms</label>
                                <div id="editor-platforms" style="display:flex;flex-wrap:wrap;gap:8px;">
                                    ${this.renderPlatformButtons(data.platforms || this.getDefaultPlatforms(data.contentType))}
                                </div>
                            </div>
                            
                            <!-- Dynamic Fields Container -->
                            <div id="editor-dynamic-fields"></div>
                        </div>
                        
                        <!-- Right Column -->
                        <div>
                            <!-- Media Gallery -->
                            <div style="margin-bottom:20px;">
                                <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">🖼️ Media Gallery</label>
                                <div id="editor-media-gallery" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">
                                    ${this.renderMediaGallery(images)}
                                </div>
                                <div style="display:flex;gap:8px;">
                                    <input type="text" id="editor-image-url" placeholder="Or paste image URL here..."
                                           style="flex:1;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--bg-input);color:var(--text-primary);font-size:12px;">
                                    <button onclick="ContentHubUltra.addImageFromUrl()" style="padding:10px 16px;background:var(--bg-muted);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:12px;">Add</button>
                                </div>
                            </div>
                            
                            <!-- Hashtags -->
                            <div style="margin-bottom:20px;">
                                <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">#️⃣ Hashtags</label>
                                <input type="text" id="editor-hashtags" value="${data.hashtags || ''}" placeholder="#hashtag1 #hashtag2"
                                       style="width:100%;padding:12px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--primary);font-size:13px;">
                            </div>
                            
                            <!-- Caption / Content -->
                            <div style="margin-bottom:20px;">
                                <label style="display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:13px;">📝 Caption / Content</label>
                                <textarea id="editor-content" rows="8" placeholder="Write your content here..."
                                          style="width:100%;padding:14px;border:2px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-primary);font-size:13px;line-height:1.6;resize:vertical;">${data.content || data.caption || ''}</textarea>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Footer - Single row of actions -->
                <div style="padding:16px 24px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:var(--bg-muted);">
                    <div style="display:flex;gap:8px;">
                        <button onclick="ContentHubUltra.generateAIContent()" style="padding:12px 20px;background:linear-gradient(135deg,#10b981,#059669);color:white;border:none;border-radius:10px;cursor:pointer;font-size:13px;font-weight:500;display:flex;align-items:center;gap:6px;">
                            ✨ Generate AI
                        </button>
                        <button onclick="ContentHubUltra.openInMagicStudio()" style="padding:12px 20px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:white;border:none;border-radius:10px;cursor:pointer;font-size:13px;font-weight:500;display:flex;align-items:center;gap:6px;">
                            🔮 Magic Studio
                        </button>
                    </div>
                    <div style="display:flex;gap:8px;">
                        ${!isNew ? `
                            <button onclick="ContentHubUltra.duplicate('${contentId}')" style="padding:12px 20px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-size:13px;">📋 Duplicate</button>
                            <button onclick="ContentHubUltra.delete('${contentId}');ContentHubUltra.closeFullEditor();" style="padding:12px 20px;background:#fee2e2;color:#dc2626;border:1px solid #fecaca;border-radius:10px;cursor:pointer;font-size:13px;">🗑️ Delete</button>
                        ` : ''}
                        <button onclick="ContentHubUltra.closeFullEditor()" style="padding:12px 20px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-size:13px;">Cancel</button>
                        <button onclick="ContentHubUltra.saveFromEditor()" style="padding:12px 24px;background:var(--primary);color:white;border:none;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;">💾 Save</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Initialize dynamic fields for current type
        setTimeout(() => {
            this.updateDynamicFields(data.contentType);
            // Fill existing dynamic field data if editing
            if (content && content.dynamicFields) {
                Object.keys(content.dynamicFields).forEach(key => {
                    this.setFieldValue('field-' + key, content.dynamicFields[key]);
                });
            }
        }, 100);
    },

    renderMediaGallery(images) {
        return `
            ${images.map((img, i) => `
                <div style="position:relative;aspect-ratio:1;border-radius:10px;overflow:hidden;border:2px solid var(--border);">
                    <img src="${img}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23333%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 fill=%22%23666%22>Error</text></svg>'">
                    <button onclick="ContentHubUltra.removeImage(${i})" style="position:absolute;top:4px;right:4px;background:#ef4444;color:white;border:none;width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:14px;line-height:1;">×</button>
                </div>
            `).join('')}
            <div onclick="ContentHubUltra.addImagePrompt()" style="aspect-ratio:1;border:2px dashed var(--border);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:var(--bg-muted);transition:all 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">
                <span style="font-size:28px;color:var(--text-muted);">+</span>
                <span style="font-size:11px;color:var(--text-muted);">Add Image</span>
            </div>
        `;
    },

    renderPlatformButtons(selectedPlatforms) {
        const platforms = [
            { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E4405F' },
            { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
            { id: 'youtube', name: 'YouTube', icon: '📺', color: '#FF0000' },
            { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: '#1DA1F2' },
            { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
            { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2' },
            { id: 'medium', name: 'Medium', icon: '📝', color: '#000000' },
            { id: 'blog', name: 'Blog', icon: '🌐', color: '#10b981' },
            { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366' },
            { id: 'threads', name: 'Threads', icon: '🧵', color: '#000000' }
        ];
        
        return platforms.map(p => {
            const isSelected = selectedPlatforms.includes(p.id);
            return `
                <button type="button" onclick="ContentHubUltra.togglePlatform('${p.id}')" 
                        data-platform="${p.id}"
                        style="padding:8px 12px;border-radius:8px;border:2px solid ${isSelected ? p.color : 'var(--border)'};
                               background:${isSelected ? p.color : 'var(--bg-muted)'};color:${isSelected ? 'white' : 'var(--text-primary)'};
                               cursor:pointer;font-size:11px;display:flex;align-items:center;gap:4px;transition:all 0.2s;">
                    <span>${p.icon}</span>
                    <span>${p.name}</span>
                </button>
            `;
        }).join('');
    },

    togglePlatform(platformId) {
        const btn = document.querySelector(`[data-platform="${platformId}"]`);
        if (!btn) return;
        
        const platform = this.getPlatformConfig(platformId);
        const currentBg = btn.style.background;
        const isSelected = currentBg && currentBg !== 'var(--bg-muted)' && !currentBg.includes('--bg-muted');
        
        if (isSelected) {
            btn.style.background = 'var(--bg-muted)';
            btn.style.borderColor = 'var(--border)';
            btn.style.color = 'var(--text-primary)';
        } else {
            btn.style.background = platform.color;
            btn.style.borderColor = platform.color;
            btn.style.color = 'white';
        }
    },


    // ==================== IMAGE MANAGEMENT ====================
    addImagePrompt() {
        const url = prompt('Enter image URL:');
        if (url && url.trim()) {
            this.currentImages.push(url.trim());
            this.refreshMediaGallery();
        }
    },

    addImageFromUrl() {
        const input = document.getElementById('editor-image-url');
        if (input && input.value.trim()) {
            this.currentImages.push(input.value.trim());
            input.value = '';
            this.refreshMediaGallery();
        }
    },

    removeImage(index) {
        this.currentImages.splice(index, 1);
        this.refreshMediaGallery();
    },

    refreshMediaGallery() {
        const gallery = document.getElementById('editor-media-gallery');
        if (gallery) {
            gallery.innerHTML = this.renderMediaGallery(this.currentImages);
        }
    },

    viewImage(url) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:2000;display:flex;align-items:center;justify-content:center;cursor:pointer;';
        modal.onclick = () => modal.remove();
        modal.innerHTML = `<img src="${url}" style="max-width:90%;max-height:90%;object-fit:contain;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.5);">`;
        document.body.appendChild(modal);
    },

    // ==================== SAVE FROM EDITOR ====================
    saveFromEditor() {
        const title = document.getElementById('editor-title').value;
        const contentType = document.getElementById('editor-type').value;
        const status = document.getElementById('editor-status').value;
        const scheduledDate = document.getElementById('editor-date').value;
        const pillar = document.getElementById('editor-pillar').value;
        const content = document.getElementById('editor-content').value;
        const hashtags = document.getElementById('editor-hashtags').value;
        
        // Get selected platforms
        const platforms = [];
        document.querySelectorAll('#editor-platforms button').forEach(btn => {
            const bg = btn.style.background;
            if (bg && bg !== 'var(--bg-muted)' && !bg.includes('--bg-muted')) {
                platforms.push(btn.dataset.platform);
            }
        });
        
        // Get dynamic fields
        const dynamicFields = {};
        document.querySelectorAll('#editor-dynamic-fields input, #editor-dynamic-fields textarea, #editor-dynamic-fields select').forEach(field => {
            if (field.id && field.id.startsWith('field-')) {
                dynamicFields[field.id.replace('field-', '')] = field.value;
            }
        });
        
        const data = {
            title,
            contentType,
            status,
            scheduledDate,
            pillar,
            content,
            caption: content, // For backward compatibility
            hashtags,
            platforms,
            images: this.currentImages,
            imageUrl: this.currentImages[0] || '',
            dynamicFields
        };
        
        if (this.editingContent) {
            data.updatedAt = new Date().toISOString();
            DB.content.update(this.editingContent.id, data);
            showToast('Content updated!', 'success');
        } else {
            data.id = Date.now().toString();
            data.createdAt = new Date().toISOString();
            DB.content.add(data);
            showToast('Content created!', 'success');
        }
        
        this.closeFullEditor();
        this.render();
        if (typeof App !== 'undefined') App.updateStats();
    },

    closeFullEditor() {
        const modal = document.getElementById('full-editor-modal');
        if (modal) modal.remove();
        document.body.style.overflow = '';
        this.editingContent = null;
        this.currentImages = [];
    },

    openInMagicStudio() {
        const title = document.getElementById('editor-title')?.value || '';
        const content = document.getElementById('editor-content')?.value || '';
        const contentType = document.getElementById('editor-type')?.value || 'text_article';
        
        localStorage.setItem('magicStudioTempContent', JSON.stringify({ title, content, contentType }));
        this.closeFullEditor();
        navigateTo('magic-studio');
        
        setTimeout(() => {
            if (typeof MagicStudioUltra !== 'undefined') MagicStudioUltra.loadFromTemp();
        }, 100);
    },

    // ==================== CALENDAR - IMPROVED UI ====================
    renderCalendar() {
        const container = document.getElementById('calendar-view');
        if (!container) return;

        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        // Get contents for this month
        const contents = DB.content.getAll().filter(c => {
            if (!c.scheduledDate) return false;
            const d = new Date(c.scheduledDate);
            return d.getMonth() === month && d.getFullYear() === year;
        });
        
        const contentsByDate = {};
        contents.forEach(c => {
            const day = new Date(c.scheduledDate).getDate();
            if (!contentsByDate[day]) contentsByDate[day] = [];
            contentsByDate[day].push(c);
        });

        container.innerHTML = `
            <div class="calendar-container" style="background:var(--bg-card);border-radius:16px;padding:24px;border:1px solid var(--border);">
                <!-- Calendar Header -->
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <div style="display:flex;align-items:center;gap:16px;">
                        <button onclick="ContentHubUltra.changeMonth(-1)" style="padding:10px 16px;background:var(--bg-muted);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:16px;">←</button>
                        <h2 style="font-size:20px;font-weight:600;color:var(--text-primary);min-width:200px;text-align:center;">${monthNames[month]} ${year}</h2>
                        <button onclick="ContentHubUltra.changeMonth(1)" style="padding:10px 16px;background:var(--bg-muted);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:16px;">→</button>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button onclick="ContentHubUltra.setCalendarView('month')" style="padding:8px 16px;background:${this.calendarViewMode === 'month' ? 'var(--primary)' : 'var(--bg-muted)'};color:${this.calendarViewMode === 'month' ? 'white' : 'var(--text-primary)'};border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:12px;">Month</button>
                        <button onclick="ContentHubUltra.setCalendarView('week')" style="padding:8px 16px;background:${this.calendarViewMode === 'week' ? 'var(--primary)' : 'var(--bg-muted)'};color:${this.calendarViewMode === 'week' ? 'white' : 'var(--text-primary)'};border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:12px;">Week</button>
                        <button onclick="ContentHubUltra.goToToday()" style="padding:8px 16px;background:var(--success);color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;">Today</button>
                    </div>
                </div>
                
                <!-- Calendar Grid -->
                ${this.calendarViewMode === 'month' ? this.renderMonthView(year, month, contentsByDate) : this.renderWeekView(year, month, contentsByDate)}
            </div>
        `;
    },

    renderMonthView(year, month, contentsByDate) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let html = `
            <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:8px;">
                ${dayNames.map(d => `<div style="text-align:center;font-weight:600;color:var(--text-muted);font-size:12px;padding:12px;">${d}</div>`).join('')}
            </div>
            <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">
        `;
        
        // Empty cells
        for (let i = 0; i < firstDay; i++) {
            html += `<div style="min-height:120px;background:var(--bg-muted);border-radius:8px;opacity:0.3;"></div>`;
        }
        
        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
            const dayContents = contentsByDate[day] || [];
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            html += `
                <div class="calendar-day" 
                     data-date="${dateStr}"
                     ondragover="event.preventDefault();this.style.background='var(--primary)';this.style.opacity='0.7';"
                     ondragleave="this.style.background='var(--bg-card)';this.style.opacity='1';"
                     ondrop="ContentHubUltra.handleCalendarDrop(event, '${dateStr}')"
                     style="min-height:120px;background:var(--bg-card);border-radius:10px;border:2px solid ${isToday ? 'var(--primary)' : 'var(--border)'};padding:10px;cursor:pointer;transition:all 0.2s;overflow:hidden;"
                     onclick="ContentHubUltra.createForDate('${dateStr}')">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span style="font-weight:${isToday ? '700' : '500'};color:${isToday ? 'var(--primary)' : 'var(--text-primary)'};font-size:16px;">${day}</span>
                        ${isToday ? '<span style="background:var(--primary);color:white;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;">TODAY</span>' : ''}
                    </div>
                    <div style="display:flex;flex-direction:column;gap:4px;max-height:80px;overflow-y:auto;">
                        ${dayContents.slice(0, 3).map(c => this.renderCalendarItem(c)).join('')}
                        ${dayContents.length > 3 ? `<span style="font-size:10px;color:var(--text-muted);text-align:center;padding:4px;">+${dayContents.length - 3} more</span>` : ''}
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    },

    renderWeekView(year, month, contentsByDate) {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        let html = `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">`;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const isToday = date.toDateString() === today.toDateString();
            const dateStr = date.toISOString().split('T')[0];
            const day = date.getDate();
            
            const dayContents = DB.content.getAll().filter(c => c.scheduledDate === dateStr);
            
            html += `
                <div class="calendar-day-week" 
                     data-date="${dateStr}"
                     ondragover="event.preventDefault();this.style.background='var(--primary)';this.style.opacity='0.7';"
                     ondragleave="this.style.background='var(--bg-card)';this.style.opacity='1';"
                     ondrop="ContentHubUltra.handleCalendarDrop(event, '${dateStr}')"
                     style="min-height:300px;background:var(--bg-card);border-radius:12px;border:2px solid ${isToday ? 'var(--primary)' : 'var(--border)'};padding:12px;transition:all 0.2s;">
                    <div style="text-align:center;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
                        <div style="font-size:12px;color:var(--text-muted);">${dayNames[i]}</div>
                        <div style="font-size:24px;font-weight:${isToday ? '700' : '500'};color:${isToday ? 'var(--primary)' : 'var(--text-primary)'};">${day}</div>
                        ${isToday ? '<span style="background:var(--primary);color:white;padding:2px 8px;border-radius:4px;font-size:10px;">TODAY</span>' : ''}
                    </div>
                    <div style="display:flex;flex-direction:column;gap:6px;">
                        ${dayContents.map(c => this.renderCalendarItemLarge(c)).join('')}
                    </div>
                    <button onclick="event.stopPropagation();ContentHubUltra.createForDate('${dateStr}')" style="width:100%;margin-top:8px;padding:8px;background:var(--bg-muted);border:1px dashed var(--border);border-radius:6px;cursor:pointer;font-size:11px;color:var(--text-muted);">+ Add</button>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    },

    renderCalendarItem(content) {
        const type = Config.getType(content.contentType);
        const hasImage = content.images?.length > 0 || content.imageUrl;
        
        return `
            <div class="calendar-content-item" 
                 draggable="true"
                 ondragstart="ContentHubUltra.handleDragStart(event, '${content.id}')"
                 onclick="event.stopPropagation();ContentHubUltra.openFullEditor('${content.id}')"
                 style="background:${type.color}15;border-left:3px solid ${type.color};padding:6px 8px;border-radius:6px;font-size:11px;cursor:grab;display:flex;align-items:center;gap:6px;">
                ${hasImage ? `<img src="${content.images?.[0] || content.imageUrl}" style="width:20px;height:20px;border-radius:4px;object-fit:cover;">` : ''}
                <span style="color:${type.color};flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${type.icon} ${content.title || 'Untitled'}</span>
            </div>
        `;
    },

    renderCalendarItemLarge(content) {
        const type = Config.getType(content.contentType);
        const hasImage = content.images?.length > 0 || content.imageUrl;
        
        return `
            <div class="calendar-content-item-large" 
                 draggable="true"
                 ondragstart="ContentHubUltra.handleDragStart(event, '${content.id}')"
                 onclick="event.stopPropagation();ContentHubUltra.openFullEditor('${content.id}')"
                 style="background:var(--bg-muted);border:1px solid var(--border);border-left:4px solid ${type.color};padding:10px;border-radius:8px;cursor:grab;">
                ${hasImage ? `<img src="${content.images?.[0] || content.imageUrl}" style="width:100%;height:60px;border-radius:6px;object-fit:cover;margin-bottom:8px;">` : ''}
                <div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:4px;">${content.title || 'Untitled'}</div>
                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="background:${type.color}20;color:${type.color};padding:2px 6px;border-radius:4px;font-size:10px;">${type.icon} ${type.name}</span>
                </div>
            </div>
        `;
    },

    // ==================== CALENDAR DRAG & DROP - FIXED ====================
    handleDragStart(event, contentId) {
        this.draggedItem = contentId;
        event.dataTransfer.setData('text/plain', contentId);
        event.dataTransfer.effectAllowed = 'move';
        event.target.style.opacity = '0.5';
    },

    handleCalendarDrop(event, dateStr) {
        event.preventDefault();
        event.stopPropagation();
        
        // Reset visual
        event.currentTarget.style.background = 'var(--bg-card)';
        event.currentTarget.style.opacity = '1';
        
        const contentId = event.dataTransfer.getData('text/plain') || this.draggedItem;
        if (!contentId) return;
        
        // Get and update content
        const content = DB.content.getById(contentId);
        if (content) {
            content.scheduledDate = dateStr;
            content.status = 'scheduled';
            content.updatedAt = new Date().toISOString();
            DB.content.update(content);
            
            // Re-render calendar and other views
            this.render();
            showToast(`Moved to ${dateStr}`, 'success');
        }
        
        this.draggedItem = null;
    },

    setCalendarView(mode) {
        this.calendarViewMode = mode;
        this.renderCalendar();
    },

    goToToday() {
        this.currentMonth = new Date();
        this.renderCalendar();
    },

    changeMonth(delta) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + delta);
        this.renderCalendar();
    },

    createForDate(dateStr) {
        this.openFullEditor(null);
        setTimeout(() => {
            const dateInput = document.getElementById('editor-date');
            if (dateInput) dateInput.value = dateStr;
            const statusSelect = document.getElementById('editor-status');
            if (statusSelect) statusSelect.value = 'scheduled';
        }, 100);
    },


    // ==================== OTHER VIEWS ====================
    renderSimpleView() {
        const tbody = document.getElementById('simple-table-body');
        if (!tbody) return;
        
        const contents = this.getFilteredContents();
        
        tbody.innerHTML = contents.map(c => {
            const type = Config.getType(c.contentType);
            const statusColors = { idea: '#a855f7', draft: '#f59e0b', review: '#3b82f6', scheduled: '#10b981', published: '#22c55e' };
            const platforms = c.platforms || [];
            
            return `
                <tr onclick="ContentHubUltra.openFullEditor('${c.id}')" style="cursor:pointer;">
                    <td onclick="event.stopPropagation()"><input type="checkbox"></td>
                    <td style="font-weight:500;">${c.title || 'Untitled'}</td>
                    <td><span style="background:${type.color}20;color:${type.color};padding:4px 10px;border-radius:12px;font-size:11px;">${type.icon} ${type.name}</span></td>
                    <td>${platforms.map(p => this.getPlatformIcon(p)).join(' ')}</td>
                    <td><span style="background:${statusColors[c.status]};color:white;padding:4px 10px;border-radius:8px;font-size:11px;">${c.status}</span></td>
                    <td>${c.scheduledDate || '-'}</td>
                    <td onclick="event.stopPropagation()">
                        <button onclick="ContentHubUltra.openFullEditor('${c.id}')" style="padding:6px 10px;background:var(--bg-muted);border:1px solid var(--border);border-radius:6px;cursor:pointer;margin-right:4px;">✏️</button>
                        <button onclick="ContentHubUltra.delete('${c.id}')" style="padding:6px 10px;background:#fee2e2;border:1px solid #fecaca;border-radius:6px;cursor:pointer;color:#dc2626;">🗑️</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        const countEl = document.getElementById('simple-row-count');
        if (countEl) countEl.textContent = `${contents.length} items`;
    },

    renderFullView() {
        const tbody = document.getElementById('airtable-body');
        if (!tbody) return;
        
        const contents = this.getFilteredContents();
        
        tbody.innerHTML = contents.map(c => {
            const type = Config.getType(c.contentType);
            const statusColors = { idea: '#a855f7', draft: '#f59e0b', review: '#3b82f6', scheduled: '#10b981', published: '#22c55e' };
            const images = c.images || (c.imageUrl ? [c.imageUrl] : []);
            const platforms = c.platforms || [];
            
            return `
                <tr data-id="${c.id}" class="airtable-row">
                    <td><input type="checkbox"></td>
                    <td style="width:30px;"><span style="cursor:grab;color:var(--text-muted);">⋮⋮</span></td>
                    <td onclick="ContentHubUltra.openFullEditor('${c.id}')" style="cursor:pointer;font-weight:500;">${c.title || 'Untitled'}</td>
                    <td><span style="background:${type.color}20;color:${type.color};padding:4px 10px;border-radius:12px;font-size:11px;">${type.icon} ${type.name}</span></td>
                    <td>${platforms.map(p => `<span title="${p}">${this.getPlatformIcon(p)}</span>`).join(' ')}</td>
                    <td>
                        <select onchange="ContentHubUltra.updateField('${c.id}', 'status', this.value)" style="background:${statusColors[c.status]};color:white;border:none;padding:6px 10px;border-radius:8px;font-size:11px;cursor:pointer;">
                            <option value="idea" ${c.status === 'idea' ? 'selected' : ''}>💡 Idea</option>
                            <option value="draft" ${c.status === 'draft' ? 'selected' : ''}>📝 Draft</option>
                            <option value="review" ${c.status === 'review' ? 'selected' : ''}>👀 Review</option>
                            <option value="scheduled" ${c.status === 'scheduled' ? 'selected' : ''}>📅 Scheduled</option>
                            <option value="published" ${c.status === 'published' ? 'selected' : ''}>✅ Published</option>
                        </select>
                    </td>
                    <td>
                        <input type="date" value="${c.scheduledDate || ''}" onchange="ContentHubUltra.updateField('${c.id}', 'scheduledDate', this.value)" style="background:var(--bg-input);border:1px solid var(--border);padding:6px;border-radius:6px;color:var(--text-primary);font-size:11px;">
                    </td>
                    <td style="min-width:100px;">
                        ${images.length > 0 ? `
                            <div style="display:flex;gap:4px;">
                                ${images.slice(0, 2).map(img => `<img src="${img}" style="width:32px;height:32px;object-fit:cover;border-radius:4px;cursor:pointer;" onclick="ContentHubUltra.viewImage('${img}')">`).join('')}
                                ${images.length > 2 ? `<span style="width:32px;height:32px;background:var(--bg-muted);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;">+${images.length - 2}</span>` : ''}
                            </div>
                        ` : '<span style="color:var(--text-muted);font-size:10px;">-</span>'}
                    </td>
                    <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:var(--text-muted);">${(c.content || '').substring(0, 40)}...</td>
                    <td style="color:var(--primary);font-size:11px;">${(c.hashtags || '').substring(0, 30)}...</td>
                    <td style="font-size:11px;">${c.pillar || '-'}</td>
                    <td>
                        <button onclick="ContentHubUltra.openFullEditor('${c.id}')" style="padding:6px 10px;background:var(--bg-muted);border:1px solid var(--border);border-radius:6px;cursor:pointer;margin-right:4px;">✏️</button>
                        <button onclick="ContentHubUltra.delete('${c.id}')" style="padding:6px 10px;background:#fee2e2;border:1px solid #fecaca;border-radius:6px;cursor:pointer;color:#dc2626;">🗑️</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        const countEl = document.getElementById('full-row-count');
        if (countEl) countEl.textContent = `${contents.length} items`;
    },

    renderKanban() {
        const statuses = ['idea', 'draft', 'review', 'scheduled', 'published'];
        const contents = this.getFilteredContents();
        
        statuses.forEach(status => {
            const container = document.getElementById(`kanban-${status}`);
            const countEl = document.getElementById(`kanban-count-${status}`);
            if (!container) return;
            
            const statusContents = contents.filter(c => c.status === status);
            if (countEl) countEl.textContent = statusContents.length;
            
            container.innerHTML = statusContents.map(c => {
                const type = Config.getType(c.contentType);
                const hasImage = c.images?.length > 0 || c.imageUrl;
                
                return `
                    <div class="kanban-card" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${c.id}')" onclick="ContentHubUltra.openFullEditor('${c.id}')" style="background:var(--bg-card);padding:12px;border-radius:10px;border:1px solid var(--border);cursor:pointer;margin-bottom:8px;">
                        ${hasImage ? `<img src="${c.images?.[0] || c.imageUrl}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:8px;">` : ''}
                        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                            <span style="background:${type.color}20;color:${type.color};padding:3px 8px;border-radius:6px;font-size:10px;">${type.icon} ${type.name}</span>
                            ${c.scheduledDate ? `<span style="font-size:10px;color:var(--text-muted);">📅 ${c.scheduledDate}</span>` : ''}
                        </div>
                        <h4 style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:6px;">${c.title || 'Untitled'}</h4>
                        <p style="font-size:11px;color:var(--text-muted);line-height:1.4;">${(c.content || '').substring(0, 60)}...</p>
                    </div>
                `;
            }).join('');
        });
    },

    getPlatformIcon(platform) {
        const icons = { instagram: '📸', tiktok: '🎵', youtube: '📺', twitter: '🐦', linkedin: '💼', facebook: '📘', medium: '📝', blog: '🌐', whatsapp: '💬', threads: '🧵' };
        return icons[platform] || '📱';
    },

    // ==================== CRUD & UTILITIES ====================
    createNew() { this.openFullEditor(null); },
    
    createWithStatus(status) {
        this.openFullEditor(null);
        setTimeout(() => {
            const el = document.getElementById('editor-status');
            if (el) el.value = status;
        }, 100);
    },

    duplicate(contentId) {
        const original = DB.content.getById(contentId);
        if (!original) return;
        
        const copy = { ...original, id: Date.now().toString(), title: `${original.title || 'Untitled'} (Copy)`, status: 'draft', createdAt: new Date().toISOString() };
        delete copy.scheduledDate;
        
        DB.content.add(copy);
        this.render();
        showToast('Duplicated!', 'success');
    },

    delete(contentId) {
        if (!confirm('Delete this content?')) return;
        DB.content.delete(contentId);
        this.render();
        if (typeof App !== 'undefined') App.updateStats();
        showToast('Deleted', 'success');
    },

    updateField(contentId, field, value) {
        const content = DB.content.getById(contentId);
        if (!content) return;
        content[field] = value;
        content.updatedAt = new Date().toISOString();
        DB.content.update(content);
        this.render();
    },

    getFilteredContents() {
        let contents = DB.content.getAll();
        if (this.currentFilter !== 'all') contents = contents.filter(c => c.status === this.currentFilter);
        
        const search = document.getElementById('hub-search')?.value?.toLowerCase() || '';
        if (search) contents = contents.filter(c => (c.title || '').toLowerCase().includes(search) || (c.content || '').toLowerCase().includes(search));
        
        const typeFilter = document.getElementById('filter-type')?.value || 'all';
        if (typeFilter !== 'all') contents = contents.filter(c => c.contentType === typeFilter);
        
        return contents;
    },

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.toggle('active', chip.dataset.filter === filter));
        this.render();
    },

    filter() { this.render(); },

    switchView(view) {
        this.currentView = view;
        document.querySelectorAll('.hub-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.view === view));
        document.querySelectorAll('.hub-view').forEach(v => v.classList.toggle('active', v.id === `${view}-view`));
        this.render();
    },

    updateCounts() {
        const contents = DB.content.getAll();
        const setCount = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setCount('content-count', contents.length);
        setCount('stat-total', contents.length);
        setCount('stat-draft', contents.filter(c => c.status === 'draft').length);
        setCount('stat-scheduled', contents.filter(c => c.status === 'scheduled').length);
        setCount('stat-published', contents.filter(c => c.status === 'published').length);
    },

    exportAll() {
        const contents = DB.content.getAll();
        const blob = new Blob([JSON.stringify(contents, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `content-hub-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        showToast('Exported!', 'success');
    },

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.closeFullEditor();
            if (e.ctrlKey && e.key === 'n') { e.preventDefault(); this.createNew(); }
        });
    },

    selectAll(checkbox) {
        document.querySelectorAll('tbody input[type="checkbox"]').forEach(cb => cb.checked = checkbox.checked);
    }
};

// Override ContentHub
if (typeof ContentHub !== 'undefined') Object.assign(ContentHub, ContentHubUltra);
else window.ContentHub = ContentHubUltra;

document.addEventListener('DOMContentLoaded', () => setTimeout(() => ContentHubUltra.init(), 500));
console.log('📋 Content Hub Ultra V2 loaded!');
