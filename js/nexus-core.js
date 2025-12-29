/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NEXUS CORE - Ultra AI Content Platform Engine
 * Main application controller with all modules integrated
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
    workflows: [],
    knowledgeBase: {},
    settings: {
        theme: 'dark',
        aiModel: 'gemini-pro',
        language: 'id'
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Initialize Application
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    console.log('🚀 Initializing raycorp Nexus...');
    
    // Load saved data
    loadAppData();
    
    // Setup navigation
    setupNavigation();
    
    // Setup project selector
    setupProjectSelector();
    
    // Update greeting
    updateGreeting();
    
    // Initialize modules
    initDashboard();
    initContentHub();
    initGenerator();
    initMagicStudio();
    initKnowledgeBase();
    initSettings();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Setup type checkboxes
    setupTypeCheckboxes();
    
    console.log('✅ raycorp Nexus Ready!');
    showToast('Welcome to raycorp!', 'success');
}

// ─────────────────────────────────────────────────────────────────────────────
// Data Management
// ─────────────────────────────────────────────────────────────────────────────
function loadAppData() {
    try {
        const savedProjects = localStorage.getItem('raycorp_projects');
        const savedContent = localStorage.getItem('raycorp_content');
        const savedSettings = localStorage.getItem('raycorp_settings');
        const currentProject = localStorage.getItem('raycorp_current_project');
        
        if (savedProjects) AppState.projects = JSON.parse(savedProjects);
        if (savedContent) AppState.content = JSON.parse(savedContent);
        if (savedSettings) AppState.settings = { ...AppState.settings, ...JSON.parse(savedSettings) };
        if (currentProject) AppState.currentProject = currentProject;
        
    } catch (e) {
        console.error('Error loading data:', e);
    }
}

function saveAppData() {
    try {
        localStorage.setItem('raycorp_projects', JSON.stringify(AppState.projects));
        localStorage.setItem('raycorp_content', JSON.stringify(AppState.content));
        localStorage.setItem('raycorp_settings', JSON.stringify(AppState.settings));
        if (AppState.currentProject) {
            localStorage.setItem('raycorp_current_project', AppState.currentProject);
        }
    } catch (e) {
        console.error('Error saving data:', e);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────────────────────
function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn[data-section]');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            navigateTo(section);
        });
    });
}

function navigateTo(sectionId) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionId);
    });
    
    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });
    
    AppState.currentSection = sectionId;
    
    // Trigger section-specific updates
    switch(sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'content-hub':
            ContentHub.refresh();
            break;
        case 'magic-studio':
            MagicStudio.refresh();
            break;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Project Selector
// ─────────────────────────────────────────────────────────────────────────────
function setupProjectSelector() {
    const selector = document.querySelector('.selector-current');
    const dropdown = document.getElementById('project-dropdown');
    
    if (selector) {
        selector.addEventListener('click', () => {
            selector.classList.toggle('open');
            dropdown.classList.toggle('open');
            renderProjectList();
        });
    }
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.project-selector')) {
            selector?.classList.remove('open');
            dropdown?.classList.remove('open');
        }
    });
    
    // Update display
    updateProjectDisplay();
}

function renderProjectList() {
    const list = document.getElementById('project-list');
    if (!list) return;
    
    if (AppState.projects.length === 0) {
        list.innerHTML = '<div class="dropdown-empty" style="padding:20px;text-align:center;color:var(--text-muted);">No projects yet</div>';
        return;
    }
    
    list.innerHTML = AppState.projects.map(p => `
        <div class="dropdown-item ${p.id === AppState.currentProject ? 'active' : ''}" onclick="selectProject('${p.id}')">
            <span style="margin-right:8px;">◈</span>
            ${p.name}
        </div>
    `).join('');
}

function selectProject(projectId) {
    AppState.currentProject = projectId;
    saveAppData();
    updateProjectDisplay();
    updateDashboard();
    
    // Close dropdown
    document.querySelector('.selector-current')?.classList.remove('open');
    document.getElementById('project-dropdown')?.classList.remove('open');
    
    showToast('Project switched!', 'success');
}

function updateProjectDisplay() {
    const nameEl = document.getElementById('current-project-name');
    if (!nameEl) return;
    
    if (AppState.currentProject) {
        const project = AppState.projects.find(p => p.id === AppState.currentProject);
        nameEl.textContent = project ? project.name : 'Select Project';
    } else {
        nameEl.textContent = 'Select Project';
    }
}

function openProjectModal() {
    document.getElementById('project-modal')?.classList.add('open');
}

function closeProjectModal() {
    document.getElementById('project-modal')?.classList.remove('open');
    document.getElementById('new-project-name').value = '';
    document.getElementById('new-project-desc').value = '';
}

function createProject() {
    const name = document.getElementById('new-project-name')?.value.trim();
    const desc = document.getElementById('new-project-desc')?.value.trim();
    
    if (!name) {
        showToast('Please enter a project name', 'error');
        return;
    }
    
    const project = {
        id: 'proj_' + Date.now(),
        name: name,
        description: desc,
        createdAt: new Date().toISOString()
    };
    
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
function initDashboard() {
    updateDashboard();
}

function updateDashboard() {
    updateStats();
    updateRecentContent();
    updateUpcomingContent();
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good Evening';
    
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    
    const el = document.getElementById('greeting-time');
    if (el) el.textContent = greeting;
}

function updateStats() {
    const projectContent = getProjectContent();
    
    const total = projectContent.length;
    const draft = projectContent.filter(c => c.status === 'draft').length;
    const scheduled = projectContent.filter(c => c.status === 'scheduled').length;
    const published = projectContent.filter(c => c.status === 'published').length;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-draft').textContent = draft;
    document.getElementById('stat-scheduled').textContent = scheduled;
    document.getElementById('stat-published').textContent = published;
    
    // Update content hub badge
    const badge = document.getElementById('content-count');
    if (badge) badge.textContent = total;
}

function getProjectContent() {
    if (!AppState.currentProject) return [];
    return AppState.content.filter(c => c.projectId === AppState.currentProject);
}

function updateRecentContent() {
    const container = document.getElementById('recent-content');
    if (!container) return;
    
    const content = getProjectContent()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    if (content.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>No content yet</p>
                <span>Start creating to see your content here</span>
            </div>
        `;
        return;
    }
    
    container.innerHTML = content.map(c => `
        <div class="content-item" style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-glass);border-radius:var(--radius-md);margin-bottom:8px;cursor:pointer;" onclick="ContentHub.edit('${c.id}')">
            <span style="font-size:20px;">${getTypeIcon(c.type)}</span>
            <div style="flex:1;min-width:0;">
                <div style="font-size:14px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.title || 'Untitled'}</div>
                <div style="font-size:12px;color:var(--text-muted);">${formatDate(c.createdAt)}</div>
            </div>
            <span class="status-badge ${c.status}" style="padding:4px 10px;border-radius:var(--radius-full);font-size:11px;background:var(--bg-glass);">${c.status}</span>
        </div>
    `).join('');
}

function updateUpcomingContent() {
    const container = document.getElementById('upcoming-content');
    if (!container) return;
    
    const content = getProjectContent()
        .filter(c => c.status === 'scheduled' && c.scheduledDate)
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
        .slice(0, 5);
    
    if (content.length === 0) {
        container.innerHTML = `
            <div class="empty-state horizontal">
                <div class="empty-icon">📅</div>
                <div>
                    <p>No scheduled content</p>
                    <span>Schedule your content to see it here</span>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `<div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;">` + 
        content.map(c => `
            <div style="flex:0 0 200px;padding:14px;background:var(--bg-glass);border-radius:var(--radius-md);cursor:pointer;" onclick="ContentHub.edit('${c.id}')">
                <div style="font-size:12px;color:var(--cyan);margin-bottom:8px;">${formatDate(c.scheduledDate)}</div>
                <div style="font-size:14px;font-weight:500;color:var(--text-primary);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.title || 'Untitled'}</div>
                <div style="font-size:12px;color:var(--text-muted);">${getTypeIcon(c.type)} ${getTypeName(c.type)}</div>
            </div>
        `).join('') + 
    `</div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Hub Module
// ─────────────────────────────────────────────────────────────────────────────
const ContentHub = {
    currentView: 'simple',
    currentFilter: 'all',
    
    init() {
        this.refresh();
    },
    
    refresh() {
        this.renderCurrentView();
        this.updateCounts();
    },
    
    switchView(view) {
        this.currentView = view;
        
        // Update tabs
        document.querySelectorAll('.hub-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === view);
        });
        
        // Update views
        document.querySelectorAll('.hub-view').forEach(v => {
            v.classList.toggle('active', v.id === `${view}-view`);
        });
        
        this.renderCurrentView();
    },
    
    renderCurrentView() {
        switch(this.currentView) {
            case 'simple':
                this.renderSimpleView();
                break;
            case 'full':
                this.renderFullView();
                break;
            case 'kanban':
                this.renderKanbanView();
                break;
            case 'calendar':
                this.renderCalendarView();
                break;
        }
    },
    
    getFilteredContent() {
        let content = getProjectContent();
        
        // Status filter
        if (this.currentFilter !== 'all') {
            content = content.filter(c => c.status === this.currentFilter);
        }
        
        // Type filter
        const typeFilter = document.getElementById('filter-type')?.value;
        if (typeFilter && typeFilter !== 'all') {
            content = content.filter(c => c.type === typeFilter);
        }
        
        // Search filter
        const search = document.getElementById('hub-search')?.value.toLowerCase();
        if (search) {
            content = content.filter(c => 
                (c.title || '').toLowerCase().includes(search) ||
                (c.caption || '').toLowerCase().includes(search)
            );
        }
        
        return content.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.filter === filter);
        });
        
        this.renderCurrentView();
    },
    
    filter() {
        this.renderCurrentView();
    },
    
    renderSimpleView() {
        const tbody = document.getElementById('simple-table-body');
        if (!tbody) return;
        
        const content = this.getFilteredContent();
        
        if (content.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">No content found</td></tr>`;
        } else {
            tbody.innerHTML = content.map(c => `
                <tr>
                    <td><input type="checkbox" data-id="${c.id}"></td>
                    <td style="font-weight:500;">${c.title || 'Untitled'}</td>
                    <td>${getTypeIcon(c.type)} ${getTypeName(c.type)}</td>
                    <td>${(c.platforms || []).map(p => getPlatformIcon(p)).join(' ')}</td>
                    <td><span class="status-badge ${c.status}">${c.status}</span></td>
                    <td>${formatDate(c.createdAt)}</td>
                    <td>
                        <button class="btn-ghost" onclick="ContentHub.edit('${c.id}')" style="padding:6px;">✏️</button>
                        <button class="btn-ghost" onclick="ContentHub.delete('${c.id}')" style="padding:6px;">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }
        
        document.getElementById('simple-row-count').textContent = `${content.length} items`;
    },
    
    renderFullView() {
        const tbody = document.getElementById('airtable-body');
        if (!tbody) return;
        
        const content = this.getFilteredContent();
        
        if (content.length === 0) {
            tbody.innerHTML = `<tr><td colspan="12" style="text-align:center;padding:40px;color:var(--text-muted);">No content found</td></tr>`;
        } else {
            tbody.innerHTML = content.map(c => `
                <tr>
                    <td><input type="checkbox" data-id="${c.id}"></td>
                    <td>${getTypeIcon(c.type)}</td>
                    <td style="font-weight:500;max-width:200px;overflow:hidden;text-overflow:ellipsis;">${c.title || 'Untitled'}</td>
                    <td>${getTypeName(c.type)}</td>
                    <td>${(c.platforms || []).map(p => getPlatformIcon(p)).join(' ')}</td>
                    <td><span class="status-badge ${c.status}">${c.status}</span></td>
                    <td>${formatDate(c.scheduledDate || c.createdAt)}</td>
                    <td>${c.mediaUrl ? '🖼️' : '-'}</td>
                    <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;">${c.caption || '-'}</td>
                    <td style="max-width:100px;overflow:hidden;text-overflow:ellipsis;">${(c.hashtags || []).slice(0, 3).join(' ')}</td>
                    <td>${c.pillar || '-'}</td>
                    <td>
                        <button class="btn-ghost" onclick="ContentHub.edit('${c.id}')" style="padding:6px;">✏️</button>
                        <button class="btn-ghost" onclick="ContentHub.delete('${c.id}')" style="padding:6px;">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }
        
        document.getElementById('full-row-count').textContent = `${content.length} items`;
    },
    
    renderKanbanView() {
        const statuses = ['idea', 'draft', 'review', 'scheduled', 'published'];
        const content = this.getFilteredContent();
        
        statuses.forEach(status => {
            const container = document.getElementById(`kanban-${status}`);
            const countEl = document.getElementById(`kanban-count-${status}`);
            if (!container) return;
            
            const items = content.filter(c => c.status === status);
            countEl.textContent = items.length;
            
            if (items.length === 0) {
                container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">No items</div>';
            } else {
                container.innerHTML = items.map(c => `
                    <div class="kanban-card" draggable="true" data-id="${c.id}" onclick="ContentHub.edit('${c.id}')">
                        <div style="font-size:14px;font-weight:500;margin-bottom:8px;">${c.title || 'Untitled'}</div>
                        <div style="display:flex;align-items:center;justify-content:space-between;">
                            <span style="font-size:12px;color:var(--text-muted);">${getTypeIcon(c.type)} ${getTypeName(c.type)}</span>
                            <span style="font-size:11px;color:var(--text-muted);">${formatDate(c.createdAt)}</span>
                        </div>
                    </div>
                `).join('');
            }
        });
    },
    
    renderCalendarView() {
        const container = document.getElementById('calendar-view');
        if (!container) return;
        
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        let html = `
            <div class="calendar-container glass" style="padding:20px;">
                <div class="calendar-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                    <h3 style="font-size:18px;font-weight:600;">${monthNames[month]} ${year}</h3>
                    <div style="display:flex;gap:8px;">
                        <button class="btn-ghost" onclick="ContentHub.prevMonth()">←</button>
                        <button class="btn-ghost" onclick="ContentHub.nextMonth()">→</button>
                    </div>
                </div>
                <div class="calendar-grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">
                    <div style="padding:10px;text-align:center;font-size:12px;color:var(--text-muted);font-weight:600;">Sun</div>
                    <div style="padding:10px;text-align:center;font-size:12px;color:var(--text-muted);font-weight:600;">Mon</div>
                    <div style="padding:10px;text-align:center;font-size:12px;color:var(--text-muted);font-weight:600;">Tue</div>
                    <div style="padding:10px;text-align:center;font-size:12px;color:var(--text-muted);font-weight:600;">Wed</div>
                    <div style="padding:10px;text-align:center;font-size:12px;color:var(--text-muted);font-weight:600;">Thu</div>
                    <div style="padding:10px;text-align:center;font-size:12px;color:var(--text-muted);font-weight:600;">Fri</div>
                    <div style="padding:10px;text-align:center;font-size:12px;color:var(--text-muted);font-weight:600;">Sat</div>
        `;
        
        // Empty cells before first day
        for (let i = 0; i < startDay; i++) {
            html += `<div style="padding:10px;"></div>`;
        }
        
        // Days
        const content = getProjectContent().filter(c => c.scheduledDate);
        
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayContent = content.filter(c => c.scheduledDate?.startsWith(dateStr));
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            
            html += `
                <div style="min-height:80px;padding:8px;background:var(--bg-glass);border-radius:var(--radius-sm);${isToday ? 'border:1px solid var(--cyan);' : ''}">
                    <div style="font-size:13px;font-weight:${isToday ? '600' : '400'};color:${isToday ? 'var(--cyan)' : 'var(--text-primary)'};margin-bottom:4px;">${day}</div>
                    ${dayContent.slice(0, 2).map(c => `
                        <div style="font-size:11px;padding:4px 6px;background:var(--bg-tertiary);border-radius:4px;margin-bottom:2px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" onclick="ContentHub.edit('${c.id}')">${getTypeIcon(c.type)} ${c.title || 'Untitled'}</div>
                    `).join('')}
                    ${dayContent.length > 2 ? `<div style="font-size:10px;color:var(--text-muted);">+${dayContent.length - 2} more</div>` : ''}
                </div>
            `;
        }
        
        html += `</div></div>`;
        container.innerHTML = html;
    },
    
    updateCounts() {
        const content = getProjectContent();
        document.getElementById('simple-row-count').textContent = `${content.length} items`;
        document.getElementById('full-row-count').textContent = `${content.length} items`;
    },
    
    createNew() {
        openContentModal();
    },
    
    createWithStatus(status) {
        openContentModal(null, status);
    },
    
    edit(id) {
        const content = AppState.content.find(c => c.id === id);
        if (content) {
            openContentModal(content);
        }
    },
    
    delete(id) {
        if (confirm('Are you sure you want to delete this content?')) {
            AppState.content = AppState.content.filter(c => c.id !== id);
            saveAppData();
            this.refresh();
            updateDashboard();
            showToast('Content deleted', 'success');
        }
    },
    
    selectAll(checkbox) {
        const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = checkbox.checked);
    },
    
    exportAll() {
        const content = getProjectContent();
        const dataStr = JSON.stringify(content, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `raycorp-content-${Date.now()}.json`;
        a.click();
        showToast('Content exported!', 'success');
    }
};

function initContentHub() {
    ContentHub.init();
}

// ─────────────────────────────────────────────────────────────────────────────
// Generator Module
// ─────────────────────────────────────────────────────────────────────────────
const Generator = {
    source: 'new',
    selectedTypes: ['text_article'],
    
    setSource(source) {
        this.source = source;
        
        document.querySelectorAll('.source-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.source === source);
        });
        
        const select = document.getElementById('gen-content-select');
        if (select) {
            select.classList.toggle('hidden', source === 'new');
            if (source === 'existing') {
                this.populateContentSelect();
            }
        }
    },
    
    populateContentSelect() {
        const select = document.getElementById('gen-content-select');
        if (!select) return;
        
        const content = getProjectContent();
        select.innerHTML = '<option value="">Select existing content...</option>' +
            content.map(c => `<option value="${c.id}">${c.title || 'Untitled'} (${getTypeName(c.type)})</option>`).join('');
    },
    
    loadFromHub(id) {
        const content = AppState.content.find(c => c.id === id);
        if (content) {
            document.getElementById('gen-topic').value = content.title + '\n\n' + (content.caption || '');
        }
    },
    
    selectAllTypes() {
        document.querySelectorAll('.type-card input').forEach(cb => {
            cb.checked = true;
            cb.closest('.type-card').classList.add('active');
        });
        this.updateSelectedTypes();
    },
    
    updateSelectedTypes() {
        this.selectedTypes = [];
        document.querySelectorAll('.type-card input:checked').forEach(cb => {
            this.selectedTypes.push(cb.value);
        });
    },
    
    async generateAll() {
        const topic = document.getElementById('gen-topic')?.value.trim();
        const tone = document.getElementById('gen-tone')?.value || 'professional';
        const pillar = document.getElementById('gen-pillar')?.value || 'Education';
        
        if (!topic) {
            showToast('Please enter a topic', 'error');
            return;
        }
        
        this.updateSelectedTypes();
        
        if (this.selectedTypes.length === 0) {
            showToast('Please select at least one content type', 'error');
            return;
        }
        
        const resultsContainer = document.getElementById('generator-results');
        resultsContainer.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;">
                <div class="loading-spinner" style="width:60px;height:60px;border:3px solid var(--border);border-top-color:var(--cyan);border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div>
                <p style="color:var(--text-secondary);">Generating ${this.selectedTypes.length} content types...</p>
            </div>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
        `;
        
        // Generate prompts for each type
        const results = [];
        
        for (const type of this.selectedTypes) {
            const prompt = this.buildPrompt(topic, type, tone, pillar);
            results.push({
                type,
                prompt,
                topic,
                tone,
                pillar
            });
        }
        
        // Render results
        this.renderResults(results);
    },
    
    buildPrompt(topic, type, tone, pillar) {
        const typePrompts = {
            text_article: `Write a comprehensive article about: ${topic}\n\nTone: ${tone}\nContent Pillar: ${pillar}\n\nInclude:\n- Engaging headline\n- Introduction hook\n- 3-5 main points with explanations\n- Conclusion with call-to-action\n- Relevant hashtags`,
            
            text_thread: `Create a Twitter/X thread about: ${topic}\n\nTone: ${tone}\nContent Pillar: ${pillar}\n\nFormat:\n- Hook tweet (1/X)\n- 5-7 value tweets\n- Summary tweet\n- CTA tweet\n- Include relevant hashtags`,
            
            video_short: `Create a short-form video script (15-60 seconds) about: ${topic}\n\nTone: ${tone}\nContent Pillar: ${pillar}\n\nInclude:\n- Hook (first 3 seconds)\n- Main content\n- Call-to-action\n- Suggested visuals/B-roll\n- Caption for posting`,
            
            video_story: `Create an Instagram/TikTok Story sequence about: ${topic}\n\nTone: ${tone}\nContent Pillar: ${pillar}\n\nInclude:\n- 3-5 story slides\n- Text overlays for each\n- Sticker/poll suggestions\n- Music mood recommendation`,
            
            image_carousel: `Create an Instagram carousel post about: ${topic}\n\nTone: ${tone}\nContent Pillar: ${pillar}\n\nInclude:\n- Cover slide (hook)\n- 5-8 content slides\n- CTA slide\n- Caption with hashtags\n- Alt text for accessibility`,
            
            video_long: `Create a long-form video script (5-15 minutes) about: ${topic}\n\nTone: ${tone}\nContent Pillar: ${pillar}\n\nInclude:\n- Hook intro\n- Chapter breakdown\n- Key talking points\n- B-roll suggestions\n- Outro with CTA\n- Video description\n- Tags/keywords`
        };
        
        return typePrompts[type] || `Create content about: ${topic}`;
    },
    
    renderResults(results) {
        const container = document.getElementById('generator-results');
        
        container.innerHTML = `
            <div class="results-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                <h3 style="font-size:18px;font-weight:600;color:var(--text-primary);">Generated Prompts (${results.length})</h3>
                <button class="btn-glass" onclick="Generator.saveAllToHub()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save All to Hub
                </button>
            </div>
            <div class="results-grid" style="display:flex;flex-direction:column;gap:16px;">
                ${results.map((r, i) => `
                    <div class="result-card" style="background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;" data-index="${i}">
                        <div class="result-header" style="display:flex;align-items:center;justify-content:space-between;padding:16px;border-bottom:1px solid var(--border);">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <span style="font-size:24px;">${getTypeIcon(r.type)}</span>
                                <div>
                                    <div style="font-size:15px;font-weight:600;color:var(--text-primary);">${getTypeName(r.type)}</div>
                                    <div style="font-size:12px;color:var(--text-muted);">${r.tone} • ${r.pillar}</div>
                                </div>
                            </div>
                            <div style="display:flex;gap:8px;">
                                <button class="btn-ghost" onclick="Generator.copyPrompt(${i})" title="Copy">📋</button>
                                <button class="btn-ghost" onclick="Generator.openInAI(${i})" title="Open in AI Studio">🚀</button>
                                <button class="btn-ghost" onclick="Generator.saveToHub(${i})" title="Save to Hub">💾</button>
                            </div>
                        </div>
                        <div class="result-body" style="padding:16px;">
                            <pre style="white-space:pre-wrap;font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text-secondary);line-height:1.6;margin:0;">${r.prompt}</pre>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Store results for later use
        this.currentResults = results;
    },
    
    copyPrompt(index) {
        const result = this.currentResults[index];
        navigator.clipboard.writeText(result.prompt);
        showToast('Prompt copied!', 'success');
    },
    
    openInAI(index) {
        window.open('https://aistudio.google.com/', '_blank');
        this.copyPrompt(index);
        showToast('Prompt copied! Paste it in AI Studio', 'info');
    },
    
    saveToHub(index) {
        const result = this.currentResults[index];
        
        const content = {
            id: 'content_' + Date.now() + '_' + index,
            projectId: AppState.currentProject,
            title: result.topic.substring(0, 50),
            type: result.type,
            caption: result.prompt,
            status: 'draft',
            pillar: result.pillar,
            tone: result.tone,
            platforms: [],
            hashtags: [],
            createdAt: new Date().toISOString()
        };
        
        AppState.content.push(content);
        saveAppData();
        updateDashboard();
        
        showToast('Saved to Content Hub!', 'success');
    },
    
    saveAllToHub() {
        if (!this.currentResults || this.currentResults.length === 0) return;
        
        this.currentResults.forEach((result, index) => {
            const content = {
                id: 'content_' + Date.now() + '_' + index,
                projectId: AppState.currentProject,
                title: result.topic.substring(0, 50),
                type: result.type,
                caption: result.prompt,
                status: 'draft',
                pillar: result.pillar,
                tone: result.tone,
                platforms: [],
                hashtags: [],
                createdAt: new Date().toISOString()
            };
            
            AppState.content.push(content);
        });
        
        saveAppData();
        updateDashboard();
        
        showToast(`${this.currentResults.length} items saved to Content Hub!`, 'success');
    }
};

function initGenerator() {
    // Setup type checkbox listeners
    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = card.querySelector('input');
                checkbox.checked = !checkbox.checked;
            }
            card.classList.toggle('active', card.querySelector('input').checked);
            Generator.updateSelectedTypes();
        });
    });
}

function setupTypeCheckboxes() {
    document.querySelectorAll('.type-card input').forEach(cb => {
        cb.addEventListener('change', () => {
            cb.closest('.type-card').classList.toggle('active', cb.checked);
            Generator.updateSelectedTypes();
        });
    });
}

function quickGenerate() {
    const topic = document.getElementById('quick-gen-topic')?.value.trim();
    const type = document.getElementById('quick-gen-type')?.value;
    
    if (!topic) {
        showToast('Please enter a topic', 'error');
        return;
    }
    
    // Navigate to generator and fill in
    navigateTo('generator');
    document.getElementById('gen-topic').value = topic;
    
    // Select only the chosen type
    document.querySelectorAll('.type-card input').forEach(cb => {
        cb.checked = cb.value === type;
        cb.closest('.type-card').classList.toggle('active', cb.checked);
    });
    
    Generator.updateSelectedTypes();
    Generator.generateAll();
}

// ─────────────────────────────────────────────────────────────────────────────
// Magic Studio Module
// ─────────────────────────────────────────────────────────────────────────────
const MagicStudio = {
    currentCategory: 'all',
    currentView: 'grid',
    workflows: [],
    
    init() {
        this.loadWorkflows();
        this.render();
    },
    
    loadWorkflows() {
        // Load from workflows-master.js if available
        if (typeof MASTER_WORKFLOWS !== 'undefined') {
            this.workflows = MASTER_WORKFLOWS;
        } else {
            // Default workflows
            this.workflows = this.getDefaultWorkflows();
        }
    },
    
    getDefaultWorkflows() {
        return [
            { id: 'w1', name: 'Viral Hook Generator', category: 'video', icon: '🎬', description: 'Create attention-grabbing hooks for your videos', tags: ['viral', 'hooks', 'engagement'] },
            { id: 'w2', name: 'Carousel Creator', category: 'image', icon: '🎨', description: 'Design engaging carousel posts with AI', tags: ['carousel', 'instagram', 'design'] },
            { id: 'w3', name: 'Thread Writer', category: 'text', icon: '🐦', description: 'Write viral Twitter/X threads', tags: ['twitter', 'threads', 'viral'] },
            { id: 'w4', name: 'Caption Generator', category: 'social', icon: '✍️', description: 'Generate engaging captions for any platform', tags: ['captions', 'social', 'engagement'] },
            { id: 'w5', name: 'Hashtag Research', category: 'social', icon: '#️⃣', description: 'Find the best hashtags for your content', tags: ['hashtags', 'research', 'reach'] },
            { id: 'w6', name: 'Script Writer', category: 'video', icon: '📝', description: 'Write professional video scripts', tags: ['scripts', 'video', 'youtube'] },
            { id: 'w7', name: 'Blog to Social', category: 'text', icon: '🔄', description: 'Convert blog posts to social content', tags: ['repurpose', 'blog', 'social'] },
            { id: 'w8', name: 'Product Launch', category: 'business', icon: '🚀', description: 'Create launch content strategy', tags: ['launch', 'product', 'marketing'] },
            { id: 'w9', name: 'Story Sequence', category: 'video', icon: '📱', description: 'Plan Instagram/TikTok story sequences', tags: ['stories', 'instagram', 'tiktok'] },
            { id: 'w10', name: 'Email Newsletter', category: 'text', icon: '📧', description: 'Write engaging email newsletters', tags: ['email', 'newsletter', 'marketing'] },
            { id: 'w11', name: 'Ad Copy Writer', category: 'business', icon: '💰', description: 'Create high-converting ad copy', tags: ['ads', 'copywriting', 'conversion'] },
            { id: 'w12', name: 'Content Calendar', category: 'business', icon: '📅', description: 'Plan your content calendar with AI', tags: ['planning', 'calendar', 'strategy'] },
            { id: 'w13', name: 'Thumbnail Ideas', category: 'image', icon: '🖼️', description: 'Generate thumbnail concepts', tags: ['thumbnails', 'youtube', 'design'] },
            { id: 'w14', name: 'Podcast Outline', category: 'video', icon: '🎙️', description: 'Create podcast episode outlines', tags: ['podcast', 'outline', 'audio'] },
            { id: 'w15', name: 'LinkedIn Post', category: 'social', icon: '💼', description: 'Write professional LinkedIn posts', tags: ['linkedin', 'professional', 'b2b'] },
            { id: 'w16', name: 'Meme Generator', category: 'image', icon: '😂', description: 'Create viral meme concepts', tags: ['memes', 'viral', 'humor'] },
            { id: 'w17', name: 'FAQ Generator', category: 'text', icon: '❓', description: 'Generate FAQ content from topics', tags: ['faq', 'support', 'content'] },
            { id: 'w18', name: 'Testimonial Request', category: 'business', icon: '⭐', description: 'Create testimonial request templates', tags: ['testimonials', 'social proof', 'reviews'] },
            { id: 'w19', name: 'Reel Script', category: 'video', icon: '🎞️', description: 'Write Instagram Reels scripts', tags: ['reels', 'instagram', 'short-form'] },
            { id: 'w20', name: 'Quote Graphics', category: 'image', icon: '💬', description: 'Generate quote graphic ideas', tags: ['quotes', 'graphics', 'inspiration'] }
        ];
    },
    
    refresh() {
        this.render();
    },
    
    filterCategory(category) {
        this.currentCategory = category;
        
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
        
        this.render();
    },
    
    search(query) {
        this.searchQuery = query.toLowerCase();
        this.render();
    },
    
    setView(view) {
        this.currentView = view;
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        this.render();
    },
    
    getFilteredWorkflows() {
        let workflows = this.workflows;
        
        if (this.currentCategory !== 'all') {
            workflows = workflows.filter(w => w.category === this.currentCategory);
        }
        
        if (this.searchQuery) {
            workflows = workflows.filter(w => 
                w.name.toLowerCase().includes(this.searchQuery) ||
                w.description.toLowerCase().includes(this.searchQuery) ||
                w.tags.some(t => t.toLowerCase().includes(this.searchQuery))
            );
        }
        
        return workflows;
    },
    
    render() {
        const container = document.getElementById('workflows-grid');
        if (!container) return;
        
        const workflows = this.getFilteredWorkflows();
        
        if (workflows.length === 0) {
            container.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
                    <div style="font-size:48px;margin-bottom:16px;">🔍</div>
                    <p style="color:var(--text-secondary);font-size:16px;">No workflows found</p>
                    <span style="color:var(--text-muted);font-size:14px;">Try a different search or category</span>
                </div>
            `;
            return;
        }
        
        container.innerHTML = workflows.map(w => `
            <div class="workflow-card" onclick="MagicStudio.openWorkflow('${w.id}')">
                <div class="workflow-header">
                    <div class="workflow-icon">${w.icon}</div>
                    <div class="workflow-info">
                        <div class="workflow-title">${w.name}</div>
                        <div class="workflow-category">${w.category}</div>
                    </div>
                </div>
                <div class="workflow-desc">${w.description}</div>
                <div class="workflow-tags">
                    ${w.tags.map(t => `<span class="workflow-tag">${t}</span>`).join('')}
                </div>
            </div>
        `).join('');
    },
    
    openWorkflow(id) {
        const workflow = this.workflows.find(w => w.id === id);
        if (!workflow) return;
        
        this.currentWorkflow = workflow;
        
        document.getElementById('modal-icon').textContent = workflow.icon;
        document.getElementById('modal-title').textContent = workflow.name;
        document.getElementById('modal-description').textContent = workflow.description;
        
        document.getElementById('modal-body').innerHTML = `
            <div class="form-section">
                <label class="form-label">Topic / Input</label>
                <textarea id="workflow-input" placeholder="Enter your topic or content idea..." style="width:100%;min-height:120px;padding:14px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-primary);font-size:14px;resize:vertical;"></textarea>
            </div>
            <div class="form-section">
                <label class="form-label">Additional Context (Optional)</label>
                <input type="text" id="workflow-context" placeholder="Any specific requirements..." style="width:100%;padding:12px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-primary);font-size:14px;">
            </div>
        `;
        
        document.getElementById('workflow-modal').classList.add('open');
    },
    
    closeModal() {
        document.getElementById('workflow-modal').classList.remove('open');
        this.currentWorkflow = null;
    },
    
    executeWorkflow() {
        const input = document.getElementById('workflow-input')?.value.trim();
        const context = document.getElementById('workflow-context')?.value.trim();
        
        if (!input) {
            showToast('Please enter a topic', 'error');
            return;
        }
        
        // Generate prompt based on workflow
        const prompt = this.buildWorkflowPrompt(this.currentWorkflow, input, context);
        
        // Copy to clipboard and open AI Studio
        navigator.clipboard.writeText(prompt);
        window.open('https://aistudio.google.com/', '_blank');
        
        this.closeModal();
        showToast('Prompt copied! Paste it in AI Studio', 'success');
    },
    
    buildWorkflowPrompt(workflow, input, context) {
        const basePrompt = `You are an expert content creator. Create ${workflow.name.toLowerCase()} for the following topic:\n\n${input}`;
        const contextPart = context ? `\n\nAdditional context: ${context}` : '';
        const formatPart = `\n\nProvide detailed, actionable output that can be used immediately.`;
        
        return basePrompt + contextPart + formatPart;
    }
};

function initMagicStudio() {
    MagicStudio.init();
}

// ─────────────────────────────────────────────────────────────────────────────
// Knowledge Base Module
// ─────────────────────────────────────────────────────────────────────────────
const KnowledgeBase = {
    addNew() {
        showToast('Knowledge Base editor coming soon!', 'info');
    }
};

function initKnowledgeBase() {
    // Initialize knowledge base
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings Module
// ─────────────────────────────────────────────────────────────────────────────
function initSettings() {
    renderSettings();
    
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderSettings(tab.dataset.tab);
        });
    });
}

function renderSettings(tab = 'general') {
    const container = document.getElementById('settings-content');
    if (!container) return;
    
    const settings = {
        general: `
            <h3 style="font-size:18px;font-weight:600;margin-bottom:20px;">General Settings</h3>
            <div class="form-section">
                <label class="form-label">Language</label>
                <select class="select-glass" style="width:100%;max-width:300px;">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                </select>
            </div>
            <div class="form-section">
                <label class="form-label">Default Content Type</label>
                <select class="select-glass" style="width:100%;max-width:300px;">
                    <option value="text_article">Article</option>
                    <option value="video_short">Short Video</option>
                    <option value="image_carousel">Carousel</option>
                </select>
            </div>
        `,
        ai: `
            <h3 style="font-size:18px;font-weight:600;margin-bottom:20px;">AI Settings</h3>
            <div class="form-section">
                <label class="form-label">AI Model</label>
                <select class="select-glass" style="width:100%;max-width:300px;">
                    <option value="gemini-pro">Gemini Pro</option>
                    <option value="gemini-flash">Gemini Flash</option>
                </select>
            </div>
            <div class="form-section">
                <label class="form-label">Default Tone</label>
                <select class="select-glass" style="width:100%;max-width:300px;">
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="educational">Educational</option>
                </select>
            </div>
        `,
        integrations: `
            <h3 style="font-size:18px;font-weight:600;margin-bottom:20px;">Integrations</h3>
            <div style="display:flex;flex-direction:column;gap:16px;">
                <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--bg-glass);border-radius:var(--radius-md);">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <span style="font-size:24px;">🤖</span>
                        <div>
                            <div style="font-weight:500;">Google AI Studio</div>
                            <div style="font-size:13px;color:var(--text-muted);">Connect to Gemini API</div>
                        </div>
                    </div>
                    <button class="btn-glass">Connect</button>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--bg-glass);border-radius:var(--radius-md);">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <span style="font-size:24px;">🌸</span>
                        <div>
                            <div style="font-weight:500;">Pollinations AI</div>
                            <div style="font-size:13px;color:var(--text-muted);">Image generation</div>
                        </div>
                    </div>
                    <span style="color:var(--green);font-size:13px;">Connected</span>
                </div>
            </div>
        `,
        appearance: `
            <h3 style="font-size:18px;font-weight:600;margin-bottom:20px;">Appearance</h3>
            <div class="form-section">
                <label class="form-label">Theme</label>
                <div style="display:flex;gap:12px;">
                    <button class="btn-glow" style="padding:12px 24px;">Dark</button>
                    <button class="btn-glass" style="padding:12px 24px;">Light</button>
                </div>
            </div>
        `
    };
    
    container.innerHTML = settings[tab] || settings.general;
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Modal
// ─────────────────────────────────────────────────────────────────────────────
let editingContent = null;

function openContentModal(content = null, defaultStatus = 'draft') {
    editingContent = content;
    
    const modal = document.getElementById('content-modal');
    const title = document.getElementById('content-modal-title');
    const body = document.getElementById('content-modal-body');
    
    title.textContent = content ? 'Edit Content' : 'New Content';
    
    body.innerHTML = `
        <div style="display:grid;gap:20px;">
            <div class="form-section">
                <label class="form-label">Title</label>
                <input type="text" id="content-title" value="${content?.title || ''}" placeholder="Content title...">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div class="form-section">
                    <label class="form-label">Type</label>
                    <select id="content-type" class="select-glass">
                        <option value="text_article" ${content?.type === 'text_article' ? 'selected' : ''}>📝 Article</option>
                        <option value="text_thread" ${content?.type === 'text_thread' ? 'selected' : ''}>🐦 Thread</option>
                        <option value="video_short" ${content?.type === 'video_short' ? 'selected' : ''}>📱 Short Video</option>
                        <option value="video_story" ${content?.type === 'video_story' ? 'selected' : ''}>⏱️ Story</option>
                        <option value="image_carousel" ${content?.type === 'image_carousel' ? 'selected' : ''}>🎨 Carousel</option>
                        <option value="video_long" ${content?.type === 'video_long' ? 'selected' : ''}>🎬 Long Video</option>
                    </select>
                </div>
                <div class="form-section">
                    <label class="form-label">Status</label>
                    <select id="content-status" class="select-glass">
                        <option value="idea" ${(content?.status || defaultStatus) === 'idea' ? 'selected' : ''}>💡 Idea</option>
                        <option value="draft" ${(content?.status || defaultStatus) === 'draft' ? 'selected' : ''}>📝 Draft</option>
                        <option value="review" ${(content?.status || defaultStatus) === 'review' ? 'selected' : ''}>👀 Review</option>
                        <option value="scheduled" ${(content?.status || defaultStatus) === 'scheduled' ? 'selected' : ''}>📅 Scheduled</option>
                        <option value="published" ${(content?.status || defaultStatus) === 'published' ? 'selected' : ''}>✅ Published</option>
                    </select>
                </div>
            </div>
            <div class="form-section">
                <label class="form-label">Caption / Content</label>
                <textarea id="content-caption" placeholder="Write your content..." style="min-height:150px;">${content?.caption || ''}</textarea>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div class="form-section">
                    <label class="form-label">Pillar</label>
                    <select id="content-pillar" class="select-glass">
                        <option value="Education" ${content?.pillar === 'Education' ? 'selected' : ''}>Education</option>
                        <option value="Inspiration" ${content?.pillar === 'Inspiration' ? 'selected' : ''}>Inspiration</option>
                        <option value="Tips & Tricks" ${content?.pillar === 'Tips & Tricks' ? 'selected' : ''}>Tips & Tricks</option>
                        <option value="Behind the Scenes" ${content?.pillar === 'Behind the Scenes' ? 'selected' : ''}>Behind the Scenes</option>
                        <option value="Promotion" ${content?.pillar === 'Promotion' ? 'selected' : ''}>Promotion</option>
                    </select>
                </div>
                <div class="form-section">
                    <label class="form-label">Schedule Date</label>
                    <input type="datetime-local" id="content-schedule" value="${content?.scheduledDate ? content.scheduledDate.slice(0, 16) : ''}" style="width:100%;padding:12px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-primary);">
                </div>
            </div>
            <div class="form-section">
                <label class="form-label">Platforms</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                    ${['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin', 'facebook'].map(p => `
                        <label style="display:flex;align-items:center;gap:6px;padding:8px 14px;background:var(--bg-glass);border-radius:var(--radius-full);cursor:pointer;">
                            <input type="checkbox" value="${p}" ${(content?.platforms || []).includes(p) ? 'checked' : ''}>
                            <span>${getPlatformIcon(p)} ${p}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="form-section">
                <label class="form-label">Hashtags</label>
                <input type="text" id="content-hashtags" value="${(content?.hashtags || []).join(' ')}" placeholder="#hashtag1 #hashtag2 #hashtag3">
            </div>
        </div>
    `;
    
    modal.classList.add('open');
}

function closeContentModal() {
    document.getElementById('content-modal')?.classList.remove('open');
    editingContent = null;
}

function saveContent() {
    const title = document.getElementById('content-title')?.value.trim();
    const type = document.getElementById('content-type')?.value;
    const status = document.getElementById('content-status')?.value;
    const caption = document.getElementById('content-caption')?.value.trim();
    const pillar = document.getElementById('content-pillar')?.value;
    const schedule = document.getElementById('content-schedule')?.value;
    const hashtags = document.getElementById('content-hashtags')?.value.split(/\s+/).filter(h => h.startsWith('#'));
    
    const platforms = [];
    document.querySelectorAll('#content-modal-body input[type="checkbox"]:checked').forEach(cb => {
        platforms.push(cb.value);
    });
    
    if (!title) {
        showToast('Please enter a title', 'error');
        return;
    }
    
    if (editingContent) {
        // Update existing
        const index = AppState.content.findIndex(c => c.id === editingContent.id);
        if (index !== -1) {
            AppState.content[index] = {
                ...AppState.content[index],
                title,
                type,
                status,
                caption,
                pillar,
                platforms,
                hashtags,
                scheduledDate: schedule || null,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Create new
        const content = {
            id: 'content_' + Date.now(),
            projectId: AppState.currentProject,
            title,
            type,
            status,
            caption,
            pillar,
            platforms,
            hashtags,
            scheduledDate: schedule || null,
            createdAt: new Date().toISOString()
        };
        AppState.content.push(content);
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
function toggleAIAssistant() {
    const panel = document.getElementById('ai-assistant-panel');
    panel?.classList.toggle('open');
}

function sendAssistantMessage() {
    const input = document.getElementById('assistant-input');
    const messages = document.getElementById('assistant-messages');
    
    const text = input?.value.trim();
    if (!text) return;
    
    // Add user message
    messages.innerHTML += `<div class="message user"><p>${text}</p></div>`;
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        messages.innerHTML += `
            <div class="message ai">
                <p>I understand you want to know about "${text}". Let me help you with that!</p>
                <p>You can use the Quick Generate feature or Magic Studio for more specific content creation.</p>
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
    
    messages.scrollTop = messages.scrollHeight;
}

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard Shortcuts
// ─────────────────────────────────────────────────────────────────────────────
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K for search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('global-search')?.focus();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeProjectModal();
            closeContentModal();
            MagicStudio.closeModal();
            document.getElementById('ai-assistant-panel')?.classList.remove('open');
        }
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────
function getTypeIcon(type) {
    const icons = {
        text_article: '📝',
        text_thread: '🐦',
        video_short: '📱',
        video_story: '⏱️',
        video_long: '🎬',
        image_carousel: '🎨'
    };
    return icons[type] || '📄';
}

function getTypeName(type) {
    const names = {
        text_article: 'Article',
        text_thread: 'Thread',
        video_short: 'Short Video',
        video_story: 'Story',
        video_long: 'Long Video',
        image_carousel: 'Carousel'
    };
    return names[type] || type;
}

function getPlatformIcon(platform) {
    const icons = {
        instagram: '📸',
        tiktok: '🎵',
        youtube: '▶️',
        twitter: '🐦',
        linkedin: '💼',
        facebook: '👤'
    };
    return icons[platform] || '🌐';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function filterByStatus(status) {
    navigateTo('content-hub');
    ContentHub.setFilter(status);
}

function refreshInsights() {
    showToast('Insights refreshed!', 'success');
}

// ─────────────────────────────────────────────────────────────────────────────
// Toast Notifications
// ─────────────────────────────────────────────────────────────────────────────
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add toast out animation
const style = document.createElement('style');
style.textContent = `@keyframes toastOut { to { opacity: 0; transform: translateX(100px); } }`;
document.head.appendChild(style);

// ─────────────────────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────────────────────
function toggleNotifications() {
    showToast('Notifications panel coming soon!', 'info');
}

function toggleUserMenu() {
    showToast('User menu coming soon!', 'info');
}

console.log('🎨 Nexus Core loaded successfully!');
