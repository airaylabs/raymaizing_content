/**
 * Main Application Module
 * Handles UI interactions and app initialization
 */

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Initialize database
    DB.init();
    
    // Setup navigation
    setupNavigation();
    
    // Setup generator tabs
    setupGeneratorTabs();
    
    // Load saved data
    loadStrategyData();
    loadPillars();
    loadDashboardStats();
    loadRecentContent();
    loadDatabaseContent();
    
    // Initialize calendar
    ContentPlanner.init();
    
    // Setup file upload
    setupFileUpload();
    
    // Setup niche select
    setupNicheSelect();
    
    console.log('🚀 LumakaraContent initialized!');
}

// Show/Hide Loading
function showLoading(text = 'Generating content...') {
    const loading = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');
    if (loadingText) loadingText.textContent = text;
    if (loading) loading.classList.add('show');
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.remove('show');
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3500);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('content-modal');
    if (modal) modal.classList.remove('show');
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            navigateTo(section);
        });
    });
}

function navigateTo(sectionId) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionId);
    });
    
    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });

    // Refresh section data
    if (sectionId === 'calendar') {
        ContentPlanner.renderCalendar();
    } else if (sectionId === 'database') {
        loadDatabaseContent();
    } else if (sectionId === 'dashboard') {
        loadDashboardStats();
        loadRecentContent();
    }
}

// Generator Tabs
function setupGeneratorTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update buttons
            tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
            
            // Update panels
            document.querySelectorAll('.generator-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === `${tab}-panel`);
            });
        });
    });
}

// Niche select handler
function setupNicheSelect() {
    const nicheSelect = document.getElementById('niche-select');
    const customNiche = document.getElementById('custom-niche');
    
    if (nicheSelect && customNiche) {
        nicheSelect.addEventListener('change', () => {
            customNiche.style.display = nicheSelect.value === 'custom' ? 'block' : 'none';
        });
    }
}

// Load strategy data
function loadStrategyData() {
    const strategy = DB.strategy.get();
    
    if (strategy.brandName) {
        document.getElementById('brand-name').value = strategy.brandName;
    }
    if (strategy.niche) {
        const nicheSelect = document.getElementById('niche-select');
        if (nicheSelect.querySelector(`option[value="${strategy.niche}"]`)) {
            nicheSelect.value = strategy.niche;
        } else {
            nicheSelect.value = 'custom';
            document.getElementById('custom-niche').value = strategy.niche;
            document.getElementById('custom-niche').style.display = 'block';
        }
    }
    if (strategy.targetAudience) {
        document.getElementById('target-audience').value = strategy.targetAudience;
    }
    if (strategy.toneOfVoice) {
        document.getElementById('tone-voice').value = strategy.toneOfVoice;
    }
    if (strategy.platforms) {
        document.querySelectorAll('.platform-checkboxes input').forEach(cb => {
            cb.checked = strategy.platforms.includes(cb.value);
        });
    }
}

// Load pillars
function loadPillars() {
    const pillars = DB.pillars.getAll();
    const container = document.getElementById('content-pillars');
    const batchSelect = document.getElementById('batch-pillar');
    
    if (container) {
        container.innerHTML = pillars.map(p => `
            <span class="pillar-tag">
                ${p}
                <span class="remove" onclick="removePillar('${p}')">&times;</span>
            </span>
        `).join('');
    }
    
    if (batchSelect) {
        batchSelect.innerHTML = '<option value="">Pilih Pillar...</option>' +
            pillars.map(p => `<option value="${p}">${p}</option>`).join('');
    }
}

// Add content pillar
function addContentPillar() {
    const input = document.getElementById('new-pillar');
    const pillar = input.value.trim();
    
    if (pillar) {
        DB.pillars.add(pillar);
        loadPillars();
        input.value = '';
        showToast('Pillar ditambahkan!', 'success');
    }
}

// Remove pillar
function removePillar(pillar) {
    DB.pillars.remove(pillar);
    loadPillars();
    showToast('Pillar dihapus', 'success');
}

// Save strategy
function saveStrategy() {
    const nicheSelect = document.getElementById('niche-select');
    const niche = nicheSelect.value === 'custom' 
        ? document.getElementById('custom-niche').value 
        : nicheSelect.value;
    
    const platforms = [];
    document.querySelectorAll('.platform-checkboxes input:checked').forEach(cb => {
        platforms.push(cb.value);
    });
    
    const strategy = {
        brandName: document.getElementById('brand-name').value,
        niche,
        targetAudience: document.getElementById('target-audience').value,
        toneOfVoice: document.getElementById('tone-voice').value,
        platforms
    };
    
    DB.strategy.save(strategy);
    showToast('Strategy berhasil disimpan!', 'success');
}

// Generate strategy with AI
async function generateStrategy() {
    saveStrategy(); // Save current data first
    showLoading();
    
    try {
        const result = await ContentTemplates.generateStrategy();
        const resultDiv = document.getElementById('ai-strategy-result');
        resultDiv.innerHTML = `<pre>${result}</pre>`;
        resultDiv.classList.add('show');
        hideLoading();
        showToast('Strategy berhasil di-generate!', 'success');
    } catch (error) {
        hideLoading();
        showToast('Gagal generate strategy', 'error');
        console.error(error);
    }
}

// Dashboard stats
function loadDashboardStats() {
    const contents = DB.content.getAll();
    
    document.getElementById('total-content').textContent = contents.length;
    document.getElementById('scheduled-content').textContent = 
        contents.filter(c => c.status === 'scheduled').length;
    document.getElementById('published-content').textContent = 
        contents.filter(c => c.status === 'published').length;
    
    // Calculate average viral score
    const scores = contents.filter(c => c.viralScore > 0).map(c => c.viralScore);
    const avgScore = scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
        : 0;
    document.getElementById('viral-score').textContent = `${avgScore}%`;
}

// Load recent content
function loadRecentContent() {
    const contents = DB.content.getAll().slice(0, 5);
    const container = document.getElementById('recent-content-list');
    
    if (!container) return;
    
    if (contents.length === 0) {
        container.innerHTML = '<p class="no-content">Belum ada konten. Mulai generate sekarang!</p>';
        return;
    }
    
    container.innerHTML = contents.map(c => `
        <div class="content-item" onclick="openContentModal('${c.id}')">
            <div class="content-info">
                <span class="content-type-badge ${c.type}">${c.type}</span>
                <span class="content-topic">${c.topic || 'Untitled'}</span>
            </div>
            <span class="content-status ${c.status}">${c.status}</span>
        </div>
    `).join('');
}


// ==========================================
// CONTENT GENERATORS
// ==========================================

// Generate single text (alias for generateText)
async function generateSingleText() {
    return generateText();
}

// Generate text content
async function generateText() {
    const topic = document.getElementById('text-topic')?.value;
    if (!topic) {
        showToast('Masukkan topik terlebih dahulu', 'warning');
        return;
    }
    
    showLoading('Generating text...');
    
    try {
        const options = {
            type: document.getElementById('text-type')?.value || 'caption',
            length: document.getElementById('text-length')?.value || 'medium',
            variations: parseInt(document.getElementById('text-variations')?.value || '3'),
            includeHook: document.getElementById('add-hooks')?.checked ?? true,
            includeHashtags: document.getElementById('add-hashtags')?.checked ?? true,
            includeCta: document.getElementById('add-cta')?.checked ?? true,
            tone: DB.strategy.get().toneOfVoice || 'casual'
        };
        
        const result = await ContentTemplates.generateCaption(topic, options);
        
        const resultDiv = document.getElementById('text-result');
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="result-box"><pre>${result}</pre></div>
            <div class="result-actions">
                <button onclick="copyToClipboard(document.querySelector('#text-result pre').textContent)">Copy</button>
                <button onclick="saveContent('text', '${topic.replace(/'/g, "\\'")}', document.querySelector('#text-result pre').textContent)">Save</button>
            </div>`;
        }
        
        hideLoading();
        showToast('Text berhasil di-generate!', 'success');
    } catch (error) {
        hideLoading();
        showToast('Gagal generate text', 'error');
        console.error(error);
    }
}

// Parse text result into cards
function parseTextResult(result, topic) {
    const variations = result.split(/---VARIASI \d+---|---END---/i).filter(v => v.trim());
    
    if (variations.length === 0) {
        variations.push(result);
    }
    
    return variations.map((v, i) => `
        <div class="result-card">
            <div class="result-card-header">
                <span>Variasi ${i + 1}</span>
                <div class="result-card-actions">
                    <button onclick="copyToClipboard(this.closest('.result-card').querySelector('.result-content').textContent)">📋 Copy</button>
                    <button onclick="saveContent('text', '${topic}', this.closest('.result-card').querySelector('.result-content').textContent)">💾 Save</button>
                    <button onclick="analyzeThisContent(this.closest('.result-card').querySelector('.result-content').textContent)">📊 Analyze</button>
                </div>
            </div>
            <div class="result-content">${v.trim()}</div>
        </div>
    `).join('');
}

// Generate image
async function generateImage() {
    const prompt = document.getElementById('image-prompt')?.value;
    if (!prompt) {
        showToast('Masukkan deskripsi gambar', 'warning');
        return;
    }
    
    showLoading('Generating images...');
    
    try {
        const style = document.getElementById('image-style')?.value || 'realistic';
        const ratio = document.getElementById('image-ratio')?.value || '1:1';
        const count = parseInt(document.getElementById('image-count')?.value || '4');
        
        const dimensions = PollinationsAI.getDimensions(ratio);
        const enhancedPrompt = PollinationsAI.enhancePrompt(prompt, style);
        
        const images = PollinationsAI.generateMultipleImages(enhancedPrompt, count, dimensions);
        
        const resultDiv = document.getElementById('image-result');
        if (resultDiv) {
            resultDiv.innerHTML = images.map((img, i) => `
                <div class="image-item" style="position:relative; margin-bottom:10px;">
                    <img src="${img.url}" alt="Generated image ${i + 1}" loading="lazy" style="width:100%; border-radius:8px; cursor:pointer;" onclick="openImageModal('${img.url}')">
                </div>
            `).join('');
        }
        
        hideLoading();
        showToast('Images berhasil di-generate!', 'success');
    } catch (error) {
        hideLoading();
        showToast('Gagal generate images', 'error');
        console.error(error);
    }
}

// Generate video script
async function generateVideoScript() {
    const topic = document.getElementById('video-topic')?.value;
    if (!topic) {
        showToast('Masukkan topik video', 'warning');
        return;
    }
    
    showLoading('Generating video script...');
    
    try {
        const options = {
            type: document.getElementById('video-type')?.value || 'reels',
            duration: parseInt(document.getElementById('video-duration')?.value || '30')
        };
        
        const result = await ContentTemplates.generateVideoScript(topic, options);
        
        const resultDiv = document.getElementById('video-result');
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="result-box"><pre>${result}</pre></div>
            <div class="result-actions">
                <button onclick="copyToClipboard(document.querySelector('#video-result pre').textContent)">Copy</button>
                <button onclick="saveContent('video', '${topic.replace(/'/g, "\\'")}', document.querySelector('#video-result pre').textContent)">Save</button>
            </div>`;
        }
        
        hideLoading();
        showToast('Video script berhasil di-generate!', 'success');
    } catch (error) {
        hideLoading();
        showToast('Gagal generate video script', 'error');
        console.error(error);
    }
}

// Generate batch content
async function generateBatch() {
    const pillar = document.getElementById('batch-pillar').value;
    if (!pillar) {
        showToast('Pilih content pillar terlebih dahulu', 'warning');
        return;
    }
    
    showLoading();
    
    try {
        const options = {
            pillar,
            count: parseInt(document.getElementById('batch-count').value),
            includeText: document.getElementById('batch-text').checked,
            includeImagePrompts: document.getElementById('batch-image').checked,
            includeVideoScripts: document.getElementById('batch-video').checked
        };
        
        const result = await ContentTemplates.generateBatchContent(options);
        
        const resultDiv = document.getElementById('batch-result');
        resultDiv.innerHTML = `
            <div class="result-card">
                <div class="result-card-header">
                    <span>📦 Batch Content (${options.count} konten)</span>
                    <div class="result-card-actions">
                        <button onclick="copyToClipboard(this.closest('.result-card').querySelector('.result-content').textContent)">📋 Copy All</button>
                        <button onclick="saveBatchContent('${pillar}', this.closest('.result-card').querySelector('.result-content').textContent)">💾 Save All</button>
                    </div>
                </div>
                <div class="result-content">${result}</div>
            </div>
        `;
        
        hideLoading();
        showToast(`${options.count} konten berhasil di-generate!`, 'success');
    } catch (error) {
        hideLoading();
        showToast('Gagal generate batch content', 'error');
        console.error(error);
    }
}

// ==========================================
// VIRAL ENGINE FUNCTIONS
// ==========================================

// Fetch trending topics
async function fetchTrendingTopics() {
    const strategy = DB.strategy.get();
    const niche = strategy.niche || 'general';
    
    showLoading();
    
    try {
        const result = await ViralEngine.getTrendingIdeas(niche);
        
        const container = document.getElementById('trending-topics');
        container.innerHTML = `<div class="trending-content">${result}</div>`;
        
        hideLoading();
        showToast('Trending topics updated!', 'success');
    } catch (error) {
        hideLoading();
        showToast('Gagal fetch trending topics', 'error');
        console.error(error);
    }
}

// Generate viral hooks
async function generateViralHooks() {
    const category = document.getElementById('hook-category').value;
    const strategy = DB.strategy.get();
    const niche = strategy.niche || 'general';
    
    showLoading();
    
    try {
        const result = await ViralEngine.generateHooks(category, niche);
        
        const container = document.getElementById('viral-hooks');
        const hooks = result.split('\n').filter(h => h.trim());
        
        container.innerHTML = hooks.map(hook => `
            <div class="hook-item" onclick="useHook('${hook.replace(/'/g, "\\'")}')">
                ${hook}
            </div>
        `).join('');
        
        hideLoading();
        showToast('Hooks berhasil di-generate!', 'success');
    } catch (error) {
        hideLoading();
        showToast('Gagal generate hooks', 'error');
        console.error(error);
    }
}

// Use hook
function useHook(hook) {
    const textTopic = document.getElementById('text-topic');
    if (textTopic) {
        textTopic.value = hook;
        navigateTo('generator');
        showToast('Hook ditambahkan ke generator', 'success');
    }
}

// Use formula
function useFormula(formulaKey) {
    const formula = ViralEngine.getFormula(formulaKey);
    if (formula) {
        const modal = document.getElementById('content-modal');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <h2>${formula.name}</h2>
            <p><strong>Template:</strong> ${formula.template}</p>
            <h4>Contoh:</h4>
            <ul>
                ${formula.examples.map(e => `<li>${e}</li>`).join('')}
            </ul>
            <p><strong>Best for:</strong> ${formula.bestFor.join(', ')}</p>
            <button class="action-btn primary" onclick="applyFormula('${formulaKey}')">
                Gunakan Formula Ini
            </button>
        `;
        
        modal.classList.add('show');
    }
}

// Apply formula to generator
function applyFormula(formulaKey) {
    const formula = ViralEngine.getFormula(formulaKey);
    if (formula) {
        const textTopic = document.getElementById('text-topic');
        if (textTopic) {
            textTopic.value = formula.template;
        }
        closeModal();
        navigateTo('generator');
        showToast('Formula diterapkan!', 'success');
    }
}

// Analyze viral score
async function analyzeViralScore() {
    const content = document.getElementById('content-to-analyze').value;
    if (!content) {
        showToast('Masukkan konten untuk dianalisis', 'warning');
        return;
    }
    
    showLoading();
    
    try {
        const analysis = await ViralEngine.analyzeAndImprove(content);
        
        const container = document.getElementById('viral-analysis');
        container.innerHTML = `
            <div class="viral-score-display">
                <div class="score-circle">${analysis.score}</div>
                <p>Viral Score</p>
            </div>
            <div class="score-breakdown">
                <h4>Breakdown:</h4>
                ${analysis.breakdown.map(b => `
                    <div class="breakdown-item">
                        <span>${b.category}</span>
                        <span>${b.score}/${b.maxScore}</span>
                        <span>${b.feedback}</span>
                    </div>
                `).join('')}
            </div>
            <div class="ai-analysis">
                <h4>AI Analysis:</h4>
                <pre>${analysis.aiAnalysis}</pre>
            </div>
        `;
        container.classList.add('show');
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Gagal analyze content', 'error');
        console.error(error);
    }
}

// Analyze content from result card
async function analyzeThisContent(content) {
    document.getElementById('content-to-analyze').value = content;
    navigateTo('viral');
    await analyzeViralScore();
}

// Generate hashtags
async function generateHashtags() {
    const topic = document.getElementById('hashtag-topic').value;
    if (!topic) {
        showToast('Masukkan topik', 'warning');
        return;
    }
    
    showLoading();
    
    try {
        const result = await ContentTemplates.generateHashtags(topic);
        
        const container = document.getElementById('hashtag-result');
        const hashtags = result.match(/#\w+/g) || [];
        
        container.innerHTML = hashtags.map(h => `
            <span class="hashtag-tag" onclick="copyToClipboard('${h}')">${h}</span>
        `).join('');
        
        hideLoading();
        showToast('Hashtags berhasil di-generate!', 'success');
    } catch (error) {
        hideLoading();
        showToast('Gagal generate hashtags', 'error');
        console.error(error);
    }
}


// ==========================================
// DATABASE FUNCTIONS
// ==========================================

// Load database content
function loadDatabaseContent() {
    const contents = DB.content.getAll();
    const container = document.getElementById('database-grid');
    
    if (!container) return;
    
    if (contents.length === 0) {
        container.innerHTML = '<p class="no-content">Belum ada konten tersimpan</p>';
        return;
    }
    
    container.innerHTML = contents.map(c => `
        <div class="db-card" onclick="openContentModal('${c.id}')">
            <div class="db-card-header">
                <span class="db-card-type">${c.type}</span>
                <span class="db-card-status ${c.status}">${c.status}</span>
            </div>
            <h4>${c.topic || 'Untitled'}</h4>
            <p class="db-card-preview">${c.content?.substring(0, 100) || ''}...</p>
            <div class="db-card-footer">
                <span>${new Date(c.createdAt).toLocaleDateString('id-ID')}</span>
                <span>Score: ${c.viralScore || 0}%</span>
            </div>
        </div>
    `).join('');
}

// Save content
function saveContent(type, topic, content) {
    const viralScore = ViralEngine.calculateViralScore(content);
    
    const saved = DB.content.add({
        type,
        topic,
        content,
        viralScore,
        status: 'draft'
    });
    
    // If there's a pending schedule date, schedule it
    if (window.pendingScheduleDate) {
        ContentPlanner.scheduleContent(saved.id, window.pendingScheduleDate);
        window.pendingScheduleDate = null;
    }
    
    loadDatabaseContent();
    loadDashboardStats();
    showToast('Konten berhasil disimpan!', 'success');
}

// Save image content
function saveImageContent(prompt, imageUrl) {
    DB.content.add({
        type: 'image',
        topic: prompt,
        content: prompt,
        imageUrl,
        status: 'draft'
    });
    
    loadDatabaseContent();
    showToast('Image berhasil disimpan!', 'success');
}

// Save batch content
function saveBatchContent(pillar, content) {
    // Parse batch content and save each
    const items = content.split(/---KONTEN \d+---|---END---/i).filter(c => c.trim());
    
    items.forEach((item, i) => {
        DB.content.add({
            type: 'text',
            topic: `${pillar} - Batch ${i + 1}`,
            content: item.trim(),
            pillar,
            status: 'draft'
        });
    });
    
    loadDatabaseContent();
    loadDashboardStats();
    showToast(`${items.length} konten berhasil disimpan!`, 'success');
}

// Open content modal
function openContentModal(contentId) {
    const content = DB.content.getById(contentId);
    if (!content) return;
    
    const modal = document.getElementById('content-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div class="content-detail">
            <div class="content-detail-header">
                <span class="content-type-badge ${content.type}">${content.type}</span>
                <span class="content-status ${content.status}">${content.status}</span>
            </div>
            <h2>${content.topic || 'Untitled'}</h2>
            ${content.imageUrl ? `<img src="${content.imageUrl}" alt="Content image" style="max-width: 100%; border-radius: 12px; margin: 16px 0;">` : ''}
            <div class="content-body">
                <pre>${content.content || ''}</pre>
            </div>
            <div class="content-meta">
                <p>Created: ${new Date(content.createdAt).toLocaleString('id-ID')}</p>
                <p>Viral Score: ${content.viralScore || 0}%</p>
                ${content.scheduledDate ? `<p>Scheduled: ${content.scheduledDate}</p>` : ''}
            </div>
            <div class="content-actions" style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="action-btn" onclick="copyToClipboard(\`${content.content?.replace(/`/g, '\\`') || ''}\`)">📋 Copy</button>
                <button class="action-btn" onclick="editContent('${content.id}')">✏️ Edit</button>
                <button class="action-btn" onclick="scheduleContentModal('${content.id}')">📅 Schedule</button>
                <button class="action-btn" onclick="markAsPublished('${content.id}')">✅ Mark Published</button>
                <button class="action-btn danger" onclick="deleteContent('${content.id}')">🗑️ Delete</button>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

// Edit content
function editContent(contentId) {
    const content = DB.content.getById(contentId);
    if (!content) return;
    
    const modal = document.getElementById('content-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>✏️ Edit Content</h2>
        <div class="form-group">
            <label>Topic</label>
            <input type="text" id="edit-topic" value="${content.topic || ''}">
        </div>
        <div class="form-group">
            <label>Content</label>
            <textarea id="edit-content" style="min-height: 200px;">${content.content || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Status</label>
            <select id="edit-status">
                <option value="draft" ${content.status === 'draft' ? 'selected' : ''}>Draft</option>
                <option value="scheduled" ${content.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                <option value="published" ${content.status === 'published' ? 'selected' : ''}>Published</option>
            </select>
        </div>
        <button class="action-btn primary" onclick="saveEditedContent('${content.id}')">💾 Save Changes</button>
    `;
    
    modal.classList.add('show');
}

// Save edited content
function saveEditedContent(contentId) {
    const topic = document.getElementById('edit-topic').value;
    const content = document.getElementById('edit-content').value;
    const status = document.getElementById('edit-status').value;
    
    const viralScore = ViralEngine.calculateViralScore(content);
    
    DB.content.update(contentId, {
        topic,
        content,
        status,
        viralScore
    });
    
    closeModal();
    loadDatabaseContent();
    loadDashboardStats();
    showToast('Konten berhasil diupdate!', 'success');
}

// Schedule content modal
function scheduleContentModal(contentId) {
    const modal = document.getElementById('content-modal');
    const modalBody = document.getElementById('modal-body');
    
    const today = new Date().toISOString().split('T')[0];
    
    modalBody.innerHTML = `
        <h2>📅 Schedule Content</h2>
        <div class="form-group">
            <label>Pilih Tanggal</label>
            <input type="date" id="schedule-date" min="${today}">
        </div>
        <button class="action-btn primary" onclick="confirmSchedule('${contentId}')">✅ Schedule</button>
    `;
    
    modal.classList.add('show');
}

// Confirm schedule
function confirmSchedule(contentId) {
    const dateStr = document.getElementById('schedule-date').value;
    if (!dateStr) {
        showToast('Pilih tanggal terlebih dahulu', 'warning');
        return;
    }
    
    ContentPlanner.scheduleContent(contentId, dateStr);
    closeModal();
    showToast('Konten berhasil dijadwalkan!', 'success');
}

// Mark as published
function markAsPublished(contentId) {
    DB.content.update(contentId, { status: 'published' });
    closeModal();
    loadDatabaseContent();
    loadDashboardStats();
    showToast('Konten ditandai sebagai published!', 'success');
}

// Delete content
function deleteContent(contentId) {
    if (confirm('Yakin ingin menghapus konten ini?')) {
        DB.content.delete(contentId);
        closeModal();
        loadDatabaseContent();
        loadDashboardStats();
        showToast('Konten berhasil dihapus!', 'success');
    }
}

// Export database
function exportDatabase() {
    const data = DB.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-media-content-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Data berhasil di-export!', 'success');
}

// Search content
document.getElementById('search-content')?.addEventListener('input', (e) => {
    const query = e.target.value;
    const contents = query ? DB.content.search(query) : DB.content.getAll();
    
    const container = document.getElementById('database-grid');
    container.innerHTML = contents.map(c => `
        <div class="db-card" onclick="openContentModal('${c.id}')">
            <div class="db-card-header">
                <span class="db-card-type">${c.type}</span>
                <span class="db-card-status ${c.status}">${c.status}</span>
            </div>
            <h4>${c.topic || 'Untitled'}</h4>
            <p class="db-card-preview">${c.content?.substring(0, 100) || ''}...</p>
        </div>
    `).join('');
});

// Filter by status
document.getElementById('filter-status')?.addEventListener('change', (e) => {
    filterDatabaseContent();
});

// Filter by type
document.getElementById('filter-type')?.addEventListener('change', (e) => {
    filterDatabaseContent();
});

function filterDatabaseContent() {
    const status = document.getElementById('filter-status').value;
    const type = document.getElementById('filter-type').value;
    
    let contents = DB.content.getAll();
    
    if (status !== 'all') {
        contents = contents.filter(c => c.status === status);
    }
    if (type !== 'all') {
        contents = contents.filter(c => c.type === type);
    }
    
    const container = document.getElementById('database-grid');
    container.innerHTML = contents.map(c => `
        <div class="db-card" onclick="openContentModal('${c.id}')">
            <div class="db-card-header">
                <span class="db-card-type">${c.type}</span>
                <span class="db-card-status ${c.status}">${c.status}</span>
            </div>
            <h4>${c.topic || 'Untitled'}</h4>
            <p class="db-card-preview">${c.content?.substring(0, 100) || ''}...</p>
        </div>
    `).join('');
}

// ==========================================
// FILE UPLOAD
// ==========================================

function setupFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-upload');
    
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border)';
        handleFiles(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const type = file.type.startsWith('video') ? 'video' : 'image';
            
            DB.content.add({
                type,
                topic: file.name,
                content: `Uploaded: ${file.name}`,
                fileData: e.target.result,
                fileName: file.name,
                status: 'draft'
            });
            
            loadDatabaseContent();
            showToast(`${file.name} berhasil di-upload!`, 'success');
        };
        
        reader.readAsDataURL(file);
    });
}

// ==========================================
// ANALYTICS
// ==========================================

function getAIRecommendations() {
    const contents = DB.content.getAll();
    const strategy = DB.strategy.get();
    
    const container = document.getElementById('ai-recommendations');
    
    // Simple recommendations based on data
    const recommendations = [];
    
    const draftCount = contents.filter(c => c.status === 'draft').length;
    if (draftCount > 5) {
        recommendations.push({
            icon: '📝',
            text: `Kamu punya ${draftCount} draft. Pertimbangkan untuk schedule atau publish beberapa.`
        });
    }
    
    const avgScore = contents.length > 0 
        ? contents.reduce((a, c) => a + (c.viralScore || 0), 0) / contents.length 
        : 0;
    if (avgScore < 50) {
        recommendations.push({
            icon: '🔥',
            text: 'Viral score rata-rata masih rendah. Coba gunakan Viral Engine untuk improve hooks dan CTA.'
        });
    }
    
    const pillars = DB.pillars.getAll();
    if (pillars.length < 3) {
        recommendations.push({
            icon: '🎯',
            text: 'Tambahkan lebih banyak content pillars untuk variasi konten yang lebih baik.'
        });
    }
    
    if (!strategy.brandName) {
        recommendations.push({
            icon: '⚙️',
            text: 'Setup brand dan strategy kamu di halaman Strategy untuk hasil yang lebih optimal.'
        });
    }
    
    if (recommendations.length === 0) {
        recommendations.push({
            icon: '✨',
            text: 'Great job! Terus konsisten posting dan monitor engagement.'
        });
    }
    
    container.innerHTML = recommendations.map(r => `
        <div class="recommendation-item">
            <span style="font-size: 24px; margin-right: 12px;">${r.icon}</span>
            <span>${r.text}</span>
        </div>
    `).join('');
}

// ==========================================
// SETTINGS
// ==========================================

function exportAllData() {
    exportDatabase();
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                DB.importAll(data);
                
                // Reload everything
                loadStrategyData();
                loadPillars();
                loadDashboardStats();
                loadRecentContent();
                loadDatabaseContent();
                ContentPlanner.renderCalendar();
                
                showToast('Data berhasil di-import!', 'success');
            } catch (error) {
                showToast('Gagal import data. File tidak valid.', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function clearAllData() {
    if (confirm('Yakin ingin menghapus SEMUA data? Tindakan ini tidak bisa dibatalkan!')) {
        DB.clearAll();
        
        // Reload everything
        loadStrategyData();
        loadPillars();
        loadDashboardStats();
        loadRecentContent();
        loadDatabaseContent();
        ContentPlanner.renderCalendar();
        
        showToast('Semua data berhasil dihapus!', 'success');
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function showLoading(text = 'Generating content...') {
    const loading = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');
    if (loadingText) loadingText.textContent = text;
    if (loading) loading.classList.add('show');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('show');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function closeModal() {
    document.getElementById('content-modal').classList.remove('show');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Gagal copy', 'error');
    });
}

function downloadImage(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.click();
    showToast('Download started!', 'success');
}

function openImageModal(url) {
    const modal = document.getElementById('content-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <img src="${url}" alt="Generated image" style="max-width: 100%; border-radius: 12px;">
        <div style="margin-top: 16px; display: flex; gap: 10px;">
            <button class="action-btn" onclick="downloadImage('${url}', 'image-${Date.now()}.png')">⬇️ Download</button>
            <button class="action-btn" onclick="window.open('${url}', '_blank')">🔗 Open in New Tab</button>
        </div>
    `;
    
    modal.classList.add('show');
}

// Close modal on outside click
document.getElementById('content-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'content-modal') {
        closeModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
