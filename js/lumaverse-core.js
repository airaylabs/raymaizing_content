/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LUMAVERSE CORE - Ultra AI Content Universe Engine
 * Complete application with 133 workflows, Pollinations AI, and more
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// Global State
// ─────────────────────────────────────────────────────────────────────────────
const AppState = {
    currentSection: 'dashboard',
    currentProject: null,
    projects: [],
    content: [],
    knowledgeBase: [],
    chatHistory: [],
    settings: { theme: 'dark', language: 'id', aiModel: 'openai' },
    imageCount: 2
};

// ─────────────────────────────────────────────────────────────────────────────
// Initialize Application
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    console.log('🚀 Initializing Lumaverse...');
    loadAppData();
    setupNavigation();
    setupProjectSelector();
    updateGreeting();
    initDashboard();
    initContentHub();
    initGenerator();
    initMagicStudio();
    initSettings();
    setupKeyboardShortcuts();
    setupTypeCheckboxes();
    console.log('✅ Lumaverse Ready! 133 Workflows loaded.');
    showToast('Welcome to Lumaverse!', 'success');
}

// ─────────────────────────────────────────────────────────────────────────────
// Data Management
// ─────────────────────────────────────────────────────────────────────────────
function loadAppData() {
    try {
        AppState.projects = JSON.parse(localStorage.getItem('lumaverse_projects') || '[]');
        AppState.content = JSON.parse(localStorage.getItem('lumaverse_content') || '[]');
        AppState.knowledgeBase = JSON.parse(localStorage.getItem('lumaverse_kb') || '[]');
        AppState.currentProject = localStorage.getItem('lumaverse_current_project');
        AppState.settings = { ...AppState.settings, ...JSON.parse(localStorage.getItem('lumaverse_settings') || '{}') };
    } catch (e) { console.error('Load error:', e); }
}

function saveAppData() {
    try {
        localStorage.setItem('lumaverse_projects', JSON.stringify(AppState.projects));
        localStorage.setItem('lumaverse_content', JSON.stringify(AppState.content));
        localStorage.setItem('lumaverse_kb', JSON.stringify(AppState.knowledgeBase));
        localStorage.setItem('lumaverse_settings', JSON.stringify(AppState.settings));
        if (AppState.currentProject) localStorage.setItem('lumaverse_current_project', AppState.currentProject);
    } catch (e) { console.error('Save error:', e); }
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────────────────────
function setupNavigation() {
    document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.section));
    });
}

function navigateTo(sectionId) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.section === sectionId));
    document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === sectionId));
    AppState.currentSection = sectionId;
    if (sectionId === 'dashboard') updateDashboard();
    if (sectionId === 'content-hub') ContentHub.refresh();
    if (sectionId === 'magic-studio') MagicStudio.refresh();
}

// ─────────────────────────────────────────────────────────────────────────────
// Project Management
// ─────────────────────────────────────────────────────────────────────────────
function setupProjectSelector() {
    updateProjectDisplay();
}

function toggleProjectDropdown() {
    const dropdown = document.getElementById('project-dropdown');
    dropdown.classList.toggle('open');
    if (dropdown.classList.contains('open')) renderProjectList();
}

function renderProjectList() {
    const list = document.getElementById('project-list');
    if (AppState.projects.length === 0) {
        list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);">No projects yet</div>';
        return;
    }
    list.innerHTML = AppState.projects.map(p => `
        <div class="dropdown-item ${p.id === AppState.currentProject ? 'active' : ''}" onclick="selectProject('${p.id}')" style="padding:12px;cursor:pointer;border-radius:8px;">
            <span style="margin-right:8px;">◈</span>${p.name}
        </div>
    `).join('');
}

function selectProject(id) {
    AppState.currentProject = id;
    saveAppData();
    updateProjectDisplay();
    updateDashboard();
    document.getElementById('project-dropdown').classList.remove('open');
    showToast('Project switched!', 'success');
}

function updateProjectDisplay() {
    const el = document.getElementById('current-project-name');
    if (!el) return;
    const project = AppState.projects.find(p => p.id === AppState.currentProject);
    el.textContent = project ? project.name : 'Select Project';
}

function openProjectModal() { document.getElementById('project-modal').classList.add('open'); }
function closeProjectModal() { 
    document.getElementById('project-modal').classList.remove('open');
    document.getElementById('new-project-name').value = '';
    document.getElementById('new-project-desc').value = '';
}

function createProject() {
    const name = document.getElementById('new-project-name').value.trim();
    const desc = document.getElementById('new-project-desc').value.trim();
    const industry = document.getElementById('new-project-industry').value;
    if (!name) { showToast('Please enter a project name', 'error'); return; }
    const project = { id: 'proj_' + Date.now(), name, description: desc, industry, createdAt: new Date().toISOString() };
    AppState.projects.push(project);
    AppState.currentProject = project.id;
    saveAppData();
    closeProjectModal();
    updateProjectDisplay();
    updateDashboard();
    showToast('Project created!', 'success');
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────
function initDashboard() { updateDashboard(); renderPopularWorkflows(); }

function updateDashboard() {
    updateStats();
    updateRecentContent();
}

function updateGreeting() {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    const el = document.getElementById('greeting-time');
    if (el) el.textContent = greeting;
}

function updateStats() {
    const content = getProjectContent();
    document.getElementById('stat-total').textContent = content.length;
    document.getElementById('stat-draft').textContent = content.filter(c => c.status === 'draft').length;
    document.getElementById('stat-scheduled').textContent = content.filter(c => c.status === 'scheduled').length;
}

function getProjectContent() {
    if (!AppState.currentProject) return [];
    return AppState.content.filter(c => c.projectId === AppState.currentProject);
}

function updateRecentContent() {
    const container = document.getElementById('recent-content');
    if (!container) return;
    const content = getProjectContent().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    if (content.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><p>No content yet</p><span>Start creating to see your content here</span></div>';
        return;
    }
    container.innerHTML = content.map(c => `
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-glass);border-radius:var(--radius-md);margin-bottom:8px;cursor:pointer;" onclick="ContentHub.edit('${c.id}')">
            <span style="font-size:20px;">${getTypeIcon(c.type)}</span>
            <div style="flex:1;min-width:0;"><div style="font-size:14px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.title || 'Untitled'}</div><div style="font-size:12px;color:var(--text-muted);">${formatDate(c.createdAt)}</div></div>
            <span style="padding:4px 10px;border-radius:var(--radius-full);font-size:11px;background:var(--bg-glass);">${c.status}</span>
        </div>
    `).join('');
}

function renderPopularWorkflows() {
    const container = document.getElementById('popular-workflows');
    if (!container) return;
    const popular = WORKFLOWS_DATABASE.slice(0, 8);
    container.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">` +
        popular.map(w => `
            <div style="padding:16px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer;transition:all 0.2s;" onclick="MagicStudio.openWorkflow('${w.id}')" onmouseover="this.style.borderColor='var(--cyan)'" onmouseout="this.style.borderColor='var(--border)'">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:24px;">${w.icon}</span>
                    <span style="font-size:14px;font-weight:500;color:var(--text-primary);">${w.name}</span>
                </div>
                <div style="font-size:12px;color:var(--text-muted);line-height:1.4;">${w.description.substring(0, 60)}...</div>
            </div>
        `).join('') + `</div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Hub Module
// ─────────────────────────────────────────────────────────────────────────────
const ContentHub = {
    currentView: 'simple',
    currentFilter: 'all',

    init() { this.refresh(); },
    refresh() { this.renderCurrentView(); },

    switchView(view) {
        this.currentView = view;
        document.querySelectorAll('.hub-tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));
        document.querySelectorAll('.hub-view').forEach(v => v.classList.toggle('active', v.id === `${view}-view`));
        this.renderCurrentView();
    },

    renderCurrentView() {
        if (this.currentView === 'simple') this.renderSimpleView();
        else if (this.currentView === 'kanban') this.renderKanbanView();
        else if (this.currentView === 'calendar') this.renderCalendarView();
    },

    getFilteredContent() {
        let content = getProjectContent();
        if (this.currentFilter !== 'all') content = content.filter(c => c.status === this.currentFilter);
        const typeFilter = document.getElementById('filter-type')?.value;
        if (typeFilter && typeFilter !== 'all') content = content.filter(c => c.type === typeFilter);
        const search = document.getElementById('hub-search')?.value.toLowerCase();
        if (search) content = content.filter(c => (c.title || '').toLowerCase().includes(search) || (c.caption || '').toLowerCase().includes(search));
        return content.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === filter));
        this.renderCurrentView();
    },

    filter() { this.renderCurrentView(); },

    renderSimpleView() {
        const tbody = document.getElementById('simple-table-body');
        if (!tbody) return;
        const content = this.getFilteredContent();
        if (content.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">No content found. Create your first content!</td></tr>';
        } else {
            tbody.innerHTML = content.map(c => `
                <tr data-id="${c.id}">
                    <td><input type="checkbox" data-id="${c.id}"></td>
                    <td><div class="editable-cell" contenteditable="true" data-field="title" data-id="${c.id}" onblur="ContentHub.inlineUpdate(this)">${c.title || 'Untitled'}</div></td>
                    <td><select class="inline-select" data-field="type" data-id="${c.id}" onchange="ContentHub.inlineUpdate(this)" style="background:transparent;border:none;color:var(--text-primary);">
                        <option value="text_article" ${c.type==='text_article'?'selected':''}>📝 Article</option>
                        <option value="text_thread" ${c.type==='text_thread'?'selected':''}>🐦 Thread</option>
                        <option value="video_short" ${c.type==='video_short'?'selected':''}>📱 Short</option>
                        <option value="image_carousel" ${c.type==='image_carousel'?'selected':''}>🎨 Carousel</option>
                    </select></td>
                    <td>${(c.platforms || []).map(p => getPlatformIcon(p)).join(' ') || '-'}</td>
                    <td><select class="inline-select status-badge ${c.status}" data-field="status" data-id="${c.id}" onchange="ContentHub.inlineUpdate(this)">
                        <option value="idea" ${c.status==='idea'?'selected':''}>💡 Idea</option>
                        <option value="draft" ${c.status==='draft'?'selected':''}>📝 Draft</option>
                        <option value="scheduled" ${c.status==='scheduled'?'selected':''}>📅 Scheduled</option>
                        <option value="published" ${c.status==='published'?'selected':''}>✅ Published</option>
                    </select></td>
                    <td>${formatDate(c.createdAt)}</td>
                    <td>
                        <button class="btn-ghost" onclick="ContentHub.edit('${c.id}')" style="padding:6px;">✏️</button>
                        <button class="btn-ghost" onclick="ContentHub.duplicate('${c.id}')" style="padding:6px;">📋</button>
                        <button class="btn-ghost" onclick="ContentHub.delete('${c.id}')" style="padding:6px;">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }
        document.getElementById('simple-row-count').textContent = `${content.length} items`;
    },

    inlineUpdate(el) {
        const id = el.dataset.id;
        const field = el.dataset.field;
        const value = el.tagName === 'SELECT' ? el.value : el.textContent.trim();
        const idx = AppState.content.findIndex(c => c.id === id);
        if (idx !== -1) {
            AppState.content[idx][field] = value;
            AppState.content[idx].updatedAt = new Date().toISOString();
            saveAppData();
            if (field === 'status') { el.className = `inline-select status-badge ${value}`; }
        }
    },

    duplicate(id) {
        const c = AppState.content.find(x => x.id === id);
        if (c) {
            const newContent = { ...c, id: 'content_' + Date.now(), title: c.title + ' (Copy)', createdAt: new Date().toISOString() };
            AppState.content.push(newContent);
            saveAppData();
            this.refresh();
            showToast('Content duplicated!', 'success');
        }
    },

    renderKanbanView() {
        const statuses = ['idea', 'draft', 'scheduled', 'published'];
        const content = this.getFilteredContent();
        statuses.forEach(status => {
            const container = document.getElementById(`kanban-${status}`);
            const countEl = document.getElementById(`kanban-count-${status}`);
            if (!container) return;
            const items = content.filter(c => c.status === status);
            countEl.textContent = items.length;
            
            // Setup drop zone
            container.ondragover = (e) => { e.preventDefault(); container.parentElement.classList.add('drag-over'); };
            container.ondragleave = () => container.parentElement.classList.remove('drag-over');
            container.ondrop = (e) => {
                e.preventDefault();
                container.parentElement.classList.remove('drag-over');
                const id = e.dataTransfer.getData('text/plain');
                this.updateStatus(id, status);
            };
            
            container.innerHTML = items.length === 0 ? '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">Drop here</div>' :
                items.map(c => `
                    <div class="kanban-card" draggable="true" data-id="${c.id}" 
                        ondragstart="event.dataTransfer.setData('text/plain','${c.id}');this.classList.add('dragging')"
                        ondragend="this.classList.remove('dragging')"
                        style="padding:14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-md);cursor:grab;margin-bottom:8px;">
                        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                            <div style="font-size:14px;font-weight:500;">${c.title || 'Untitled'}</div>
                            <button onclick="event.stopPropagation();ContentHub.edit('${c.id}')" style="background:none;border:none;cursor:pointer;padding:4px;">✏️</button>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--text-muted);">
                            <span>${getTypeIcon(c.type)} ${getTypeName(c.type)}</span>
                            <span>${formatDate(c.createdAt)}</span>
                        </div>
                    </div>
                `).join('');
        });
    },

    updateStatus(id, newStatus) {
        const idx = AppState.content.findIndex(c => c.id === id);
        if (idx !== -1) {
            AppState.content[idx].status = newStatus;
            AppState.content[idx].updatedAt = new Date().toISOString();
            saveAppData();
            this.refresh();
            showToast(`Moved to ${newStatus}!`, 'success');
        }
    },

    renderCalendarView() {
        const container = document.getElementById('calendar-view');
        if (!container) return;
        const now = new Date();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        container.innerHTML = `
            <div class="glass" style="padding:20px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                    <h3 style="font-size:18px;font-weight:600;">${monthNames[now.getMonth()]} ${now.getFullYear()}</h3>
                </div>
                <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;">
                    ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div style="padding:10px;font-size:12px;color:var(--text-muted);font-weight:600;">${d}</div>`).join('')}
                    ${Array.from({length: 35}, (_, i) => {
                        const day = i - new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 1;
                        const isValid = day > 0 && day <= new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                        const isToday = isValid && day === now.getDate();
                        return `<div style="min-height:60px;padding:8px;background:var(--bg-glass);border-radius:4px;${isToday ? 'border:1px solid var(--cyan);' : ''}">${isValid ? `<span style="font-size:13px;${isToday ? 'color:var(--cyan);font-weight:600;' : ''}">${day}</span>` : ''}</div>`;
                    }).join('')}
                </div>
            </div>
        `;
    },

    createNew() { openContentModal(); },
    createWithStatus(status) { openContentModal(null, status); },
    edit(id) { const c = AppState.content.find(x => x.id === id); if (c) openContentModal(c); },
    delete(id) {
        if (confirm('Delete this content?')) {
            AppState.content = AppState.content.filter(c => c.id !== id);
            saveAppData();
            this.refresh();
            updateDashboard();
            showToast('Content deleted', 'success');
        }
    },
    selectAll(cb) { document.querySelectorAll('tbody input[type="checkbox"]').forEach(x => x.checked = cb.checked); },
    exportAll() {
        const content = getProjectContent();
        const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `lumaverse-content-${Date.now()}.json`;
        a.click();
        showToast('Content exported!', 'success');
    }
};

function initContentHub() { ContentHub.init(); }

// ─────────────────────────────────────────────────────────────────────────────
// Generator Module
// ─────────────────────────────────────────────────────────────────────────────
const Generator = {
    selectedTypes: ['text_article'],

    selectAllTypes() {
        document.querySelectorAll('.type-card input').forEach(cb => { cb.checked = true; cb.closest('.type-card').classList.add('active'); });
        this.updateSelectedTypes();
    },

    updateSelectedTypes() {
        this.selectedTypes = [];
        document.querySelectorAll('.type-card input:checked').forEach(cb => this.selectedTypes.push(cb.value));
    },

    async generateAll() {
        const topic = document.getElementById('gen-topic')?.value.trim();
        const tone = document.getElementById('gen-tone')?.value || 'professional';
        const pillar = document.getElementById('gen-pillar')?.value || 'Education';
        if (!topic) { showToast('Please enter a topic', 'error'); return; }
        this.updateSelectedTypes();
        if (this.selectedTypes.length === 0) { showToast('Please select at least one content type', 'error'); return; }

        const container = document.getElementById('generator-results');
        container.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;"><div style="width:60px;height:60px;border:3px solid var(--border);border-top-color:var(--cyan);border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div><p style="color:var(--text-secondary);">Generating ${this.selectedTypes.length} content types with AI...</p></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;

        const results = [];
        for (const type of this.selectedTypes) {
            const result = await PollinationsAI.generateContent(topic, type, tone, pillar);
            results.push({ type, content: result.success ? result.text : 'Generation failed. Please try again.', topic, tone, pillar });
        }
        this.renderResults(results);
    },

    renderResults(results) {
        const container = document.getElementById('generator-results');
        container.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                <h3 style="font-size:18px;font-weight:600;">Generated Content (${results.length})</h3>
                <button class="btn-glass" onclick="Generator.saveAllToHub()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg> Save All</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:16px;">
                ${results.map((r, i) => `
                    <div style="background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;" data-index="${i}">
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;border-bottom:1px solid var(--border);">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <span style="font-size:24px;">${getTypeIcon(r.type)}</span>
                                <div><div style="font-size:15px;font-weight:600;">${getTypeName(r.type)}</div><div style="font-size:12px;color:var(--text-muted);">${r.tone} • ${r.pillar}</div></div>
                            </div>
                            <div style="display:flex;gap:8px;">
                                <button class="btn-ghost" onclick="Generator.copyContent(${i})" title="Copy">📋</button>
                                <button class="btn-ghost" onclick="Generator.saveToHub(${i})" title="Save">💾</button>
                            </div>
                        </div>
                        <div style="padding:16px;max-height:300px;overflow-y:auto;">
                            <pre style="white-space:pre-wrap;font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text-secondary);line-height:1.6;margin:0;">${r.content}</pre>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        this.currentResults = results;
    },

    copyContent(i) { navigator.clipboard.writeText(this.currentResults[i].content); showToast('Copied!', 'success'); },

    saveToHub(i) {
        const r = this.currentResults[i];
        AppState.content.push({ id: 'content_' + Date.now() + '_' + i, projectId: AppState.currentProject, title: r.topic.substring(0, 50), type: r.type, caption: r.content, status: 'draft', pillar: r.pillar, platforms: [], hashtags: [], createdAt: new Date().toISOString() });
        saveAppData();
        updateDashboard();
        showToast('Saved to Content Hub!', 'success');
    },

    saveAllToHub() {
        if (!this.currentResults) return;
        this.currentResults.forEach((r, i) => {
            AppState.content.push({ id: 'content_' + Date.now() + '_' + i, projectId: AppState.currentProject, title: r.topic.substring(0, 50), type: r.type, caption: r.content, status: 'draft', pillar: r.pillar, platforms: [], hashtags: [], createdAt: new Date().toISOString() });
        });
        saveAppData();
        updateDashboard();
        showToast(`${this.currentResults.length} items saved!`, 'success');
    }
};

function initGenerator() {
    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.tagName !== 'INPUT') { const cb = card.querySelector('input'); cb.checked = !cb.checked; }
            card.classList.toggle('active', card.querySelector('input').checked);
            Generator.updateSelectedTypes();
        });
    });
}

function setupTypeCheckboxes() {
    document.querySelectorAll('.type-card input').forEach(cb => {
        cb.addEventListener('change', () => { cb.closest('.type-card').classList.toggle('active', cb.checked); Generator.updateSelectedTypes(); });
    });
}

async function quickGenerate() {
    const topic = document.getElementById('quick-gen-topic')?.value.trim();
    const type = document.getElementById('quick-gen-type')?.value;
    if (!topic) { showToast('Please enter a topic', 'error'); return; }
    if (type === 'auto') {
        navigateTo('generator');
        document.getElementById('gen-topic').value = topic;
        Generator.selectAllTypes();
        Generator.generateAll();
    } else {
        navigateTo('generator');
        document.getElementById('gen-topic').value = topic;
        document.querySelectorAll('.type-card input').forEach(cb => { cb.checked = cb.value === type; cb.closest('.type-card').classList.toggle('active', cb.checked); });
        Generator.updateSelectedTypes();
        Generator.generateAll();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Magic Studio Module - 133 Workflows
// ─────────────────────────────────────────────────────────────────────────────
const MagicStudio = {
    currentCategory: 'all',
    currentView: 'grid',
    searchQuery: '',
    currentWorkflow: null,

    init() { this.render(); },
    refresh() { this.render(); },

    filterCategory(cat) {
        this.currentCategory = cat;
        document.querySelectorAll('.category-tab').forEach(t => t.classList.toggle('active', t.dataset.category === cat));
        this.render();
    },

    search(query) { this.searchQuery = query.toLowerCase(); this.render(); },

    setView(view) {
        this.currentView = view;
        document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
        this.render();
    },

    getFilteredWorkflows() {
        let wfs = WORKFLOWS_DATABASE;
        if (this.currentCategory !== 'all') wfs = wfs.filter(w => w.category === this.currentCategory);
        if (this.searchQuery) wfs = wfs.filter(w => w.name.toLowerCase().includes(this.searchQuery) || w.description.toLowerCase().includes(this.searchQuery) || w.tags.some(t => t.includes(this.searchQuery)));
        return wfs;
    },

    render() {
        const container = document.getElementById('workflows-grid');
        if (!container) return;
        const wfs = this.getFilteredWorkflows();
        if (wfs.length === 0) {
            container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;"><div style="font-size:48px;margin-bottom:16px;">🔍</div><p style="color:var(--text-secondary);">No workflows found</p></div>';
            return;
        }
        container.innerHTML = wfs.map(w => `
            <div class="workflow-card" onclick="MagicStudio.openWorkflow('${w.id}')" style="padding:20px;background:var(--bg-glass);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:var(--radius-lg);cursor:pointer;transition:all 0.2s;">
                <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:14px;">
                    <div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:var(--gradient-primary);border-radius:var(--radius-md);font-size:24px;">${w.icon}</div>
                    <div style="flex:1;"><div style="font-size:15px;font-weight:600;color:var(--text-primary);margin-bottom:4px;">${w.name}</div><div style="font-size:12px;color:var(--text-muted);">${w.category}</div></div>
                </div>
                <div style="font-size:13px;color:var(--text-secondary);line-height:1.5;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${w.description}</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">${w.tags.slice(0, 3).map(t => `<span style="padding:4px 10px;background:var(--bg-glass);border-radius:20px;font-size:11px;color:var(--text-muted);">${t}</span>`).join('')}</div>
            </div>
        `).join('');
    },

    openWorkflow(id) {
        const wf = WORKFLOWS_DATABASE.find(w => w.id === id);
        if (!wf) return;
        this.currentWorkflow = wf;
        document.getElementById('wf-modal-icon').textContent = wf.icon;
        document.getElementById('wf-modal-title').textContent = wf.name;
        document.getElementById('wf-modal-category').textContent = `${wf.category.charAt(0).toUpperCase() + wf.category.slice(1)} • ${wf.id}`;
        
        // Use WorkflowForms to render dynamic form
        if (typeof WorkflowForms !== 'undefined') {
            document.getElementById('wf-modal-body').innerHTML = WorkflowForms.renderForm(wf);
        } else {
            document.getElementById('wf-modal-body').innerHTML = `
                <div style="margin-bottom:20px;">
                    <p style="color:var(--text-secondary);line-height:1.6;">${wf.description}</p>
                </div>
                <div style="margin-bottom:20px;">
                    <label style="display:block;margin-bottom:8px;font-weight:500;">Tags</label>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;">${wf.tags.map(t => `<span style="padding:6px 14px;background:var(--bg-glass);border-radius:20px;font-size:13px;">${t}</span>`).join('')}</div>
                </div>
                ${wf.opalLink ? `
                <div style="padding:16px;background:linear-gradient(135deg,rgba(6,182,212,0.1),rgba(139,92,246,0.1));border-radius:var(--radius-md);border:1px solid var(--border);">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                        <span style="font-size:20px;">🔗</span>
                        <span style="font-weight:600;color:var(--text-primary);">Google Opal Integration</span>
                    </div>
                    <p style="font-size:13px;color:var(--text-muted);">This workflow is powered by Google Opal. Click "Launch in Opal" to start.</p>
                </div>
                ` : ''}
            `;
        }
        
        // Hide default launch button when using forms (form has its own button)
        document.getElementById('wf-modal-launch').style.display = typeof WorkflowForms !== 'undefined' ? 'none' : (wf.opalLink ? 'flex' : 'none');
        document.getElementById('workflow-modal').classList.add('open');
    },

    closeModal() { document.getElementById('workflow-modal').classList.remove('open'); this.currentWorkflow = null; },

    launchWorkflow() {
        if (this.currentWorkflow?.opalLink) {
            window.open(this.currentWorkflow.opalLink, '_blank');
            showToast('Opening in Google Opal...', 'success');
        }
    }
};

function initMagicStudio() { MagicStudio.init(); }

// ─────────────────────────────────────────────────────────────────────────────
// AI Image Generator
// ─────────────────────────────────────────────────────────────────────────────
function setImageCount(count) {
    AppState.imageCount = count;
    document.querySelectorAll('.num-btn').forEach(b => b.classList.toggle('active', parseInt(b.textContent) === count));
}

function applyImageStyle(style) {
    const styles = {
        photorealistic: ', photorealistic, highly detailed, 8k, professional photography',
        anime: ', anime style, vibrant colors, detailed illustration',
        '3d': ', 3D render, octane render, cinema 4D, highly detailed',
        watercolor: ', watercolor painting, artistic, soft colors',
        cyberpunk: ', cyberpunk style, neon lights, futuristic, dark atmosphere',
        minimalist: ', minimalist design, clean, simple, modern'
    };
    const input = document.getElementById('image-prompt');
    if (input && styles[style]) {
        input.value = input.value.replace(/, (photorealistic|anime style|3D render|watercolor|cyberpunk style|minimalist design)[^,]*/g, '') + styles[style];
    }
    document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function generateImages() {
    const prompt = document.getElementById('image-prompt')?.value.trim();
    if (!prompt) { showToast('Please enter a prompt', 'error'); return; }
    const size = document.getElementById('image-size')?.value || '1024x1024';
    const model = document.getElementById('image-model')?.value || 'flux';
    const [width, height] = size.split('x').map(Number);
    const container = document.getElementById('image-results');
    container.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;"><div style="width:60px;height:60px;border:3px solid var(--border);border-top-color:var(--cyan);border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div><p style="color:var(--text-secondary);">Generating ${AppState.imageCount} images...</p></div>`;
    
    const images = PollinationsAI.generateMultipleImages(prompt, AppState.imageCount, { width, height, model });
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
            ${images.map((img, i) => `
                <div style="position:relative;border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-glass);border:1px solid var(--border);">
                    <img src="${img.url}" alt="Generated ${i+1}" style="width:100%;display:block;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%231a1a24%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23666%22>Loading...</text></svg>'">
                    <div style="position:absolute;bottom:0;left:0;right:0;padding:12px;background:linear-gradient(transparent,rgba(0,0,0,0.8));display:flex;gap:8px;">
                        <button onclick="downloadImage('${img.url}', 'lumaverse-${i+1}.png')" style="flex:1;padding:8px;background:var(--gradient-primary);border:none;border-radius:8px;color:white;cursor:pointer;font-size:12px;">Download</button>
                        <button onclick="navigator.clipboard.writeText('${img.url}');showToast('URL copied!','success')" style="padding:8px 12px;background:var(--bg-glass);border:1px solid var(--border);border-radius:8px;color:white;cursor:pointer;font-size:12px;">📋</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div style="margin-top:16px;padding:12px;background:var(--bg-glass);border-radius:var(--radius-md);font-size:12px;color:var(--text-muted);">
            💡 Tip: Images are generated with Pollinations AI. Click to download or copy URL.
        </div>
    `;
}

function downloadImage(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.click();
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Chat
// ─────────────────────────────────────────────────────────────────────────────
async function sendChatMessage(message) {
    const container = document.getElementById('chat-messages');
    container.innerHTML += `<div class="chat-message user"><div class="message-content"><p>${message}</p></div></div>`;
    container.scrollTop = container.scrollHeight;
    
    container.innerHTML += `<div class="chat-message ai loading"><div class="message-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div><div class="message-content"><p>Thinking...</p></div></div>`;
    
    const result = await PollinationsAI.chat(message, AppState.chatHistory);
    AppState.chatHistory.push({ role: 'user', content: message });
    
    const loadingMsg = container.querySelector('.loading');
    if (loadingMsg) loadingMsg.remove();
    
    if (result.success) {
        AppState.chatHistory.push({ role: 'assistant', content: result.text });
        container.innerHTML += `<div class="chat-message ai"><div class="message-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div><div class="message-content"><p>${result.text.replace(/\n/g, '<br>')}</p></div></div>`;
    } else {
        container.innerHTML += `<div class="chat-message ai"><div class="message-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div><div class="message-content"><p>Sorry, I encountered an error. Please try again.</p></div></div>`;
    }
    container.scrollTop = container.scrollHeight;
}

function sendChatFromInput() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) { sendChatMessage(message); input.value = ''; }
}

function clearChat() {
    AppState.chatHistory = [];
    document.getElementById('chat-messages').innerHTML = `<div class="chat-message ai"><div class="message-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div><div class="message-content"><p>Chat cleared! How can I help you?</p></div></div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Knowledge Base Module
// ─────────────────────────────────────────────────────────────────────────────
const KnowledgeBase = {
    currentCategory: 'brand',

    selectCategory(cat) {
        this.currentCategory = cat;
        document.querySelectorAll('.kb-category').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
        this.render();
    },

    render() {
        const container = document.getElementById('kb-content');
        if (!container) return;
        const items = AppState.knowledgeBase.filter(k => k.category === this.currentCategory && k.projectId === AppState.currentProject);
        this.updateCounts();
        if (items.length === 0) {
            container.innerHTML = `<div class="kb-empty-state"><div class="empty-visual"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div><h3>No knowledge in this category</h3><p>Add information to help AI generate better content</p><button class="btn-glow" onclick="KnowledgeBase.addNew()">Add Knowledge</button></div>`;
            return;
        }
        container.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px;">${items.map(k => `
            <div style="padding:16px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-md);">
                <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                    <h4 style="font-size:15px;font-weight:600;">${k.title}</h4>
                    <button class="btn-ghost" onclick="KnowledgeBase.delete('${k.id}')" style="padding:4px;">🗑️</button>
                </div>
                <p style="font-size:13px;color:var(--text-secondary);line-height:1.5;">${k.content.substring(0, 200)}${k.content.length > 200 ? '...' : ''}</p>
            </div>
        `).join('')}</div>`;
    },

    updateCounts() {
        ['brand', 'audience', 'products', 'voice', 'competitors', 'templates'].forEach(cat => {
            const count = AppState.knowledgeBase.filter(k => k.category === cat && k.projectId === AppState.currentProject).length;
            const el = document.getElementById(`kb-count-${cat}`);
            if (el) el.textContent = count;
        });
    },

    addNew() { document.getElementById('kb-modal').classList.add('open'); },
    closeModal() { document.getElementById('kb-modal').classList.remove('open'); },

    save() {
        const category = document.getElementById('kb-category').value;
        const title = document.getElementById('kb-title').value.trim();
        const content = document.getElementById('kb-content-input').value.trim();
        if (!title || !content) { showToast('Please fill all fields', 'error'); return; }
        AppState.knowledgeBase.push({ id: 'kb_' + Date.now(), projectId: AppState.currentProject, category, title, content, createdAt: new Date().toISOString() });
        saveAppData();
        this.closeModal();
        this.render();
        showToast('Knowledge saved!', 'success');
        document.getElementById('kb-title').value = '';
        document.getElementById('kb-content-input').value = '';
    },

    delete(id) {
        if (confirm('Delete this knowledge?')) {
            AppState.knowledgeBase = AppState.knowledgeBase.filter(k => k.id !== id);
            saveAppData();
            this.render();
            showToast('Deleted', 'success');
        }
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Settings Module
// ─────────────────────────────────────────────────────────────────────────────
const Settings = {
    switchTab(tab) {
        document.querySelectorAll('.settings-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        this.render(tab);
    },

    render(tab = 'general') {
        const container = document.getElementById('settings-content');
        if (!container) return;
        const tabs = {
            general: `<h3 style="font-size:18px;font-weight:600;margin-bottom:20px;">General Settings</h3>
                <div class="form-section" style="margin-bottom:20px;"><label class="form-label">Language</label><select class="select-glass" style="width:100%;max-width:300px;"><option value="id">Bahasa Indonesia</option><option value="en">English</option></select></div>
                <div class="form-section"><label class="form-label">Default Content Type</label><select class="select-glass" style="width:100%;max-width:300px;"><option value="text_article">Article</option><option value="video_short">Short Video</option><option value="image_carousel">Carousel</option></select></div>`,
            ai: `<h3 style="font-size:18px;font-weight:600;margin-bottom:20px;">AI Settings</h3>
                <div class="form-section" style="margin-bottom:20px;"><label class="form-label">AI Model</label><select class="select-glass" style="width:100%;max-width:300px;"><option value="openai">OpenAI (via Pollinations)</option><option value="mistral">Mistral</option></select></div>
                <div class="form-section"><label class="form-label">Default Tone</label><select class="select-glass" style="width:100%;max-width:300px;"><option value="professional">Professional</option><option value="casual">Casual</option><option value="educational">Educational</option></select></div>`,
            integrations: `<h3 style="font-size:18px;font-weight:600;margin-bottom:20px;">Integrations</h3>
                <div style="display:flex;flex-direction:column;gap:16px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--bg-glass);border-radius:var(--radius-md);"><div style="display:flex;align-items:center;gap:12px;"><span style="font-size:24px;">🌸</span><div><div style="font-weight:500;">Pollinations AI</div><div style="font-size:13px;color:var(--text-muted);">Text & Image Generation</div></div></div><span style="color:var(--green);font-size:13px;">✓ Connected</span></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--bg-glass);border-radius:var(--radius-md);"><div style="display:flex;align-items:center;gap:12px;"><span style="font-size:24px;">🔮</span><div><div style="font-weight:500;">Google Opal</div><div style="font-size:13px;color:var(--text-muted);">133 AI Workflows</div></div></div><span style="color:var(--green);font-size:13px;">✓ Connected</span></div>
                </div>`,
            export: `<h3 style="font-size:18px;font-weight:600;margin-bottom:20px;">Export / Import</h3>
                <div style="display:flex;flex-direction:column;gap:16px;">
                    <button class="btn-glass" onclick="exportAllData()" style="justify-content:center;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export All Data</button>
                    <button class="btn-glass" onclick="document.getElementById('import-file').click()" style="justify-content:center;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Import Data</button>
                    <input type="file" id="import-file" accept=".json" style="display:none;" onchange="importData(this)">
                </div>`
        };
        container.innerHTML = tabs[tab] || tabs.general;
    }
};

function initSettings() { Settings.render(); }

function exportAllData() {
    const data = { projects: AppState.projects, content: AppState.content, knowledgeBase: AppState.knowledgeBase, settings: AppState.settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `lumaverse-backup-${Date.now()}.json`;
    a.click();
    showToast('Data exported!', 'success');
}

function importData(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.projects) AppState.projects = data.projects;
            if (data.content) AppState.content = data.content;
            if (data.knowledgeBase) AppState.knowledgeBase = data.knowledgeBase;
            if (data.settings) AppState.settings = { ...AppState.settings, ...data.settings };
            saveAppData();
            updateDashboard();
            showToast('Data imported!', 'success');
        } catch (err) { showToast('Invalid file', 'error'); }
    };
    reader.readAsText(file);
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Modal
// ─────────────────────────────────────────────────────────────────────────────
let editingContent = null;

function openContentModal(content = null, defaultStatus = 'draft') {
    editingContent = content;
    document.getElementById('content-modal-title').textContent = content ? 'Edit Content' : 'New Content';
    document.getElementById('content-modal-body').innerHTML = `
        <div style="display:grid;gap:20px;">
            <div class="form-section"><label class="form-label">Title</label><input type="text" id="content-title" value="${content?.title || ''}" placeholder="Content title..."></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div class="form-section"><label class="form-label">Type</label><select id="content-type" class="select-glass"><option value="text_article" ${content?.type === 'text_article' ? 'selected' : ''}>📝 Article</option><option value="text_thread" ${content?.type === 'text_thread' ? 'selected' : ''}>🐦 Thread</option><option value="video_short" ${content?.type === 'video_short' ? 'selected' : ''}>📱 Short Video</option><option value="video_story" ${content?.type === 'video_story' ? 'selected' : ''}>⏱️ Story</option><option value="image_carousel" ${content?.type === 'image_carousel' ? 'selected' : ''}>🎨 Carousel</option><option value="video_long" ${content?.type === 'video_long' ? 'selected' : ''}>🎬 Long Video</option></select></div>
                <div class="form-section"><label class="form-label">Status</label><select id="content-status" class="select-glass"><option value="idea" ${(content?.status || defaultStatus) === 'idea' ? 'selected' : ''}>💡 Idea</option><option value="draft" ${(content?.status || defaultStatus) === 'draft' ? 'selected' : ''}>📝 Draft</option><option value="scheduled" ${(content?.status || defaultStatus) === 'scheduled' ? 'selected' : ''}>📅 Scheduled</option><option value="published" ${(content?.status || defaultStatus) === 'published' ? 'selected' : ''}>✅ Published</option></select></div>
            </div>
            <div class="form-section"><label class="form-label">Caption / Content</label><textarea id="content-caption" placeholder="Write your content..." style="min-height:150px;">${content?.caption || ''}</textarea></div>
            <div class="form-section"><label class="form-label">Platforms</label><div style="display:flex;flex-wrap:wrap;gap:8px;">${['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin'].map(p => `<label style="display:flex;align-items:center;gap:6px;padding:8px 14px;background:var(--bg-glass);border-radius:20px;cursor:pointer;"><input type="checkbox" value="${p}" ${(content?.platforms || []).includes(p) ? 'checked' : ''}><span>${getPlatformIcon(p)} ${p}</span></label>`).join('')}</div></div>
        </div>
    `;
    document.getElementById('content-modal').classList.add('open');
}

function closeContentModal() { document.getElementById('content-modal').classList.remove('open'); editingContent = null; }

function saveContent() {
    const title = document.getElementById('content-title')?.value.trim();
    const type = document.getElementById('content-type')?.value;
    const status = document.getElementById('content-status')?.value;
    const caption = document.getElementById('content-caption')?.value.trim();
    const platforms = Array.from(document.querySelectorAll('#content-modal-body input[type="checkbox"]:checked')).map(cb => cb.value);
    if (!title) { showToast('Please enter a title', 'error'); return; }
    if (editingContent) {
        const idx = AppState.content.findIndex(c => c.id === editingContent.id);
        if (idx !== -1) AppState.content[idx] = { ...AppState.content[idx], title, type, status, caption, platforms, updatedAt: new Date().toISOString() };
    } else {
        AppState.content.push({ id: 'content_' + Date.now(), projectId: AppState.currentProject, title, type, status, caption, platforms, hashtags: [], createdAt: new Date().toISOString() });
    }
    saveAppData();
    closeContentModal();
    ContentHub.refresh();
    updateDashboard();
    showToast(editingContent ? 'Content updated!' : 'Content created!', 'success');
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Assistant
// ─────────────────────────────────────────────────────────────────────────────
function toggleAIAssistant() { document.getElementById('ai-assistant-panel').classList.toggle('open'); }

async function sendAssistantMessage() {
    const input = document.getElementById('assistant-input');
    const messages = document.getElementById('assistant-messages');
    const text = input?.value.trim();
    if (!text) return;
    messages.innerHTML += `<div class="message user"><p>${text}</p></div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    const result = await PollinationsAI.chat(text);
    messages.innerHTML += `<div class="message ai"><p>${result.success ? result.text.replace(/\n/g, '<br>') : 'Sorry, please try again.'}</p></div>`;
    messages.scrollTop = messages.scrollHeight;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); document.getElementById('global-search')?.focus(); }
        if (e.key === 'Escape') { closeProjectModal(); closeContentModal(); MagicStudio.closeModal(); KnowledgeBase.closeModal(); document.getElementById('ai-assistant-panel')?.classList.remove('open'); }
    });
}

function globalSearch(query) {
    if (!query) return;
    const q = query.toLowerCase();
    const wf = WORKFLOWS_DATABASE.find(w => w.name.toLowerCase().includes(q) || w.tags.some(t => t.includes(q)));
    if (wf) { navigateTo('magic-studio'); MagicStudio.search(query); }
}

function getTypeIcon(type) { return { text_article: '📝', text_thread: '🐦', video_short: '📱', video_story: '⏱️', video_long: '🎬', image_carousel: '🎨' }[type] || '📄'; }
function getTypeName(type) { return { text_article: 'Article', text_thread: 'Thread', video_short: 'Short Video', video_story: 'Story', video_long: 'Long Video', image_carousel: 'Carousel' }[type] || type; }
function getPlatformIcon(p) { return { instagram: '📸', tiktok: '🎵', youtube: '▶️', twitter: '🐦', linkedin: '💼', facebook: '👤' }[p] || '🌐'; }
function formatDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); }
function filterByStatus(s) { navigateTo('content-hub'); ContentHub.setFilter(s); }
function refreshInsights() { showToast('Insights refreshed!', 'success'); }

// Notifications Panel
function toggleNotifications() {
    const existing = document.getElementById('notifications-panel');
    if (existing) { existing.remove(); return; }
    const panel = document.createElement('div');
    panel.id = 'notifications-panel';
    panel.style.cssText = 'position:fixed;top:70px;right:100px;width:320px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);z-index:1000;padding:16px;';
    panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="font-size:16px;font-weight:600;">Notifications</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:18px;">×</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="padding:12px;background:var(--bg-glass);border-radius:8px;"><span style="color:var(--cyan);">🎉</span> Welcome to Lumaverse!</div>
            <div style="padding:12px;background:var(--bg-glass);border-radius:8px;"><span style="color:var(--purple);">✨</span> 133 workflows ready to use</div>
            <div style="padding:12px;background:var(--bg-glass);border-radius:8px;"><span style="color:var(--green);">🤖</span> AI Assistant is online</div>
        </div>
    `;
    document.body.appendChild(panel);
}

// User Menu
function toggleUserMenu() {
    const existing = document.getElementById('user-menu-panel');
    if (existing) { existing.remove(); return; }
    const panel = document.createElement('div');
    panel.id = 'user-menu-panel';
    panel.style.cssText = 'position:fixed;top:70px;right:20px;width:200px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);z-index:1000;padding:8px;';
    panel.innerHTML = `
        <div style="padding:12px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border);margin-bottom:8px;">
            <div style="width:40px;height:40px;background:var(--gradient-primary);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:600;">L</div>
            <div><div style="font-weight:600;">Lumaverse User</div><div style="font-size:12px;color:var(--text-muted);">Pro Plan</div></div>
        </div>
        <button onclick="navigateTo('settings');this.parentElement.remove()" style="width:100%;padding:10px 12px;background:none;border:none;color:var(--text-primary);text-align:left;cursor:pointer;border-radius:6px;">⚙️ Settings</button>
        <button onclick="exportAllData();this.parentElement.remove()" style="width:100%;padding:10px 12px;background:none;border:none;color:var(--text-primary);text-align:left;cursor:pointer;border-radius:6px;">📤 Export Data</button>
        <button onclick="this.parentElement.remove()" style="width:100%;padding:10px 12px;background:none;border:none;color:var(--red);text-align:left;cursor:pointer;border-radius:6px;">🚪 Logout</button>
    `;
    document.body.appendChild(panel);
}

// Voice Input
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Voice input not supported in this browser', 'error');
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;
    showToast('🎤 Listening... Speak now!', 'info');
    recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        const input = document.getElementById('quick-gen-topic');
        if (input) input.value = text;
        showToast('Voice captured!', 'success');
    };
    recognition.onerror = () => showToast('Voice input failed', 'error');
    recognition.start();
}
async function aiSuggestTopic() {
    showToast('Getting AI suggestions...', 'info');
    const result = await PollinationsAI.suggestTopics('general', 3);
    if (result.success) { document.getElementById('quick-gen-topic').value = result.text; showToast('Topics suggested!', 'success'); }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-message">${message}</span><button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
    toast.style.cssText = 'display:flex;align-items:center;gap:12px;padding:14px 20px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-md);box-shadow:var(--shadow-lg);animation:toastIn 0.3s ease;';
    if (type === 'success') toast.style.borderLeftColor = 'var(--green)';
    if (type === 'error') toast.style.borderLeftColor = 'var(--red)';
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'toastOut 0.3s ease forwards'; setTimeout(() => toast.remove(), 300); }, 4000);
}

const style = document.createElement('style');
style.textContent = `@keyframes toastIn{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}@keyframes toastOut{to{opacity:0;transform:translateX(100px)}}`;
document.head.appendChild(style);

console.log('🎨 Lumaverse Core loaded! 133 workflows ready.');
