/**
 * Main Application - LumakaraContent
 * Omnichannel Content Management System
 */

// Global state
let currentView = 'table';
let currentCalendarDate = new Date();
let lastGeneratedContent = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    DB.init();
    setupNavigation();
    loadProjects();
    loadActiveProject();
    setupEventListeners();
    console.log('🚀 LumakaraContent initialized!');
}

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.section));
    });
}

function navigateTo(sectionId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionId);
    });
    document.querySelectorAll('.section').forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });
    
    // Refresh section data
    if (sectionId === 'dashboard') loadDashboard();
    else if (sectionId === 'content-hub') loadContentHub();
    else if (sectionId === 'knowledge-base') loadKnowledgeBase();
    else if (sectionId === 'calendar') loadFullCalendar();
    else if (sectionId === 'settings') loadSettings();
    else if (sectionId === 'generator') loadGenerator();
}

function setupEventListeners() {
    // KB Upload area
    const uploadArea = document.getElementById('kb-upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.style.borderColor = 'var(--primary)'; });
        uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
        uploadArea.addEventListener('drop', e => { e.preventDefault(); uploadArea.style.borderColor = ''; handleKBFileUpload({ target: { files: e.dataTransfer.files } }); });
    }
}

// ==================== PROJECT MANAGEMENT ====================
function loadProjects() {
    const projects = DB.projects.getAll();
    const select = document.getElementById('project-select');
    const activeId = DB.projects.getActiveId();
    
    select.innerHTML = '<option value="">Pilih Project...</option>' +
        projects.map(p => `<option value="${p.id}" ${p.id === activeId ? 'selected' : ''}>${p.name}</option>`).join('');
}

function switchProject(projectId) {
    if (!projectId) return;
    DB.projects.setActive(projectId);
    loadActiveProject();
    showToast('Project switched!', 'success');
}

function loadActiveProject() {
    const project = DB.projects.getActive();
    const projects = DB.projects.getAll();
    const infoEl = document.getElementById('active-project-info');
    const nameEl = document.getElementById('dashboard-project-name');
    const setupBtn = document.getElementById('btn-setup-lumakara');
    
    if (project) {
        infoEl.textContent = `${project.brandName || project.name} • ${project.niche}`;
        nameEl.textContent = project.brandName || project.name;
        document.getElementById('btn-auto-generate').disabled = false;
        if (setupBtn) setupBtn.style.display = 'none';
        loadDashboard();
    } else {
        infoEl.textContent = 'No project selected';
        nameEl.textContent = 'Pilih atau buat project untuk memulai';
        document.getElementById('btn-auto-generate').disabled = true;
        // Show Lumakara setup button if no projects exist
        if (setupBtn && projects.length === 0) {
            setupBtn.style.display = 'flex';
        }
    }
}

function openProjectModal(mode, projectId = null) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    const project = projectId ? DB.projects.getById(projectId) : null;
    
    content.innerHTML = `
        <div class="modal-header">
            <h2>${mode === 'create' ? 'Create New Project' : 'Edit Project'}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="form-group">
            <label>Project Name</label>
            <input type="text" id="modal-project-name" value="${project?.name || ''}" placeholder="My Brand Project">
        </div>
        <div class="form-group">
            <label>Brand Name</label>
            <input type="text" id="modal-brand-name" value="${project?.brandName || ''}" placeholder="Brand Name">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Niche</label>
                <select id="modal-niche">
                    ${['tech', 'lifestyle', 'business', 'education', 'health', 'food', 'fashion', 'finance', 'travel', 'entertainment']
                        .map(n => `<option value="${n}" ${project?.niche === n ? 'selected' : ''}>${n.charAt(0).toUpperCase() + n.slice(1)}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Tone</label>
                <select id="modal-tone">
                    ${['casual', 'professional', 'humorous', 'inspirational', 'educational']
                        .map(t => `<option value="${t}" ${project?.toneOfVoice === t ? 'selected' : ''}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>Target Audience</label>
            <textarea id="modal-audience" rows="2" placeholder="Describe your target audience...">${project?.targetAudience || ''}</textarea>
        </div>
        <button class="btn-primary full-width" onclick="${mode === 'create' ? 'createProject()' : `updateProject('${projectId}')`}">
            ${mode === 'create' ? 'Create Project' : 'Save Changes'}
        </button>
    `;
    modal.classList.add('show');
}

function createProject() {
    const project = DB.projects.create({
        name: document.getElementById('modal-project-name').value || 'New Project',
        brandName: document.getElementById('modal-brand-name').value,
        niche: document.getElementById('modal-niche').value,
        toneOfVoice: document.getElementById('modal-tone').value,
        targetAudience: document.getElementById('modal-audience').value
    });
    
    DB.projects.setActive(project.id);
    loadProjects();
    loadActiveProject();
    closeModal();
    showToast('Project created!', 'success');
}

function updateProject(projectId) {
    DB.projects.update(projectId, {
        name: document.getElementById('modal-project-name').value,
        brandName: document.getElementById('modal-brand-name').value,
        niche: document.getElementById('modal-niche').value,
        toneOfVoice: document.getElementById('modal-tone').value,
        targetAudience: document.getElementById('modal-audience').value
    });
    
    loadProjects();
    loadActiveProject();
    closeModal();
    showToast('Project updated!', 'success');
}

function deleteProject() {
    const project = DB.projects.getActive();
    if (!project) return;
    
    if (confirm(`Delete project "${project.name}"? This will delete all content and cannot be undone.`)) {
        DB.projects.delete(project.id);
        loadProjects();
        loadActiveProject();
        showToast('Project deleted', 'success');
    }
}

// ==================== DASHBOARD ====================
function loadDashboard() {
    const stats = DB.content.getStats();
    
    // Update stats
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-draft').textContent = stats.draft + stats.idea;
    document.getElementById('stat-scheduled').textContent = stats.scheduled;
    document.getElementById('stat-published').textContent = stats.published;
    
    // Platform distribution
    const platformDist = document.getElementById('platform-distribution');
    const maxCount = Math.max(...Object.values(stats.byPlatform), 1);
    platformDist.innerHTML = Object.entries(stats.byPlatform)
        .filter(([_, count]) => count > 0)
        .map(([platform, count]) => `
            <div class="platform-bar-item">
                <span class="platform-bar-label">${platform}</span>
                <div class="platform-bar-track">
                    <div class="platform-bar-fill" style="width: ${(count / maxCount) * 100}%"></div>
                </div>
                <span class="platform-bar-count">${count}</span>
            </div>
        `).join('') || '<p class="empty-state">No content yet</p>';
    
    // Week preview
    loadWeekPreview();
    
    // Upcoming content
    loadUpcomingContent();
}

function loadWeekPreview() {
    const container = document.getElementById('week-preview');
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let html = '';
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + i);
        const dateStr = date.toISOString().split('T')[0];
        const contents = DB.content.getByDate(dateStr);
        const isToday = date.toDateString() === today.toDateString();
        
        html += `
            <div class="week-day ${isToday ? 'today' : ''}">
                <div class="week-day-name">${days[i]}</div>
                <div class="week-day-date">${date.getDate()}</div>
                <div class="week-day-count">${contents.length}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function loadUpcomingContent() {
    const container = document.getElementById('upcoming-content');
    const today = new Date().toISOString().split('T')[0];
    const contents = DB.content.getAll()
        .filter(c => c.scheduledDate >= today && c.status !== 'published')
        .sort((a, b) => a.scheduledDate?.localeCompare(b.scheduledDate))
        .slice(0, 5);
    
    if (contents.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><h3>No upcoming content</h3><p>Generate monthly content to get started</p></div>';
        return;
    }
    
    container.innerHTML = contents.map(c => {
        const date = new Date(c.scheduledDate);
        return `
            <div class="content-preview-item" onclick="openContentDetail('${c.id}')">
                <div class="content-preview-date">
                    <div class="day">${date.getDate()}</div>
                    <div class="month">${date.toLocaleString('id-ID', { month: 'short' })}</div>
                </div>
                <div class="content-preview-info">
                    <div class="content-preview-title">${c.title || 'Untitled'}</div>
                    <div class="content-preview-meta">
                        <span class="platform-badge ${c.platform}">${c.platform}</span>
                        <span>${c.type}</span>
                    </div>
                </div>
                <span class="content-preview-status ${c.status}">${c.status}</span>
            </div>
        `;
    }).join('');
}

// ==================== AUTO GENERATE MONTHLY CONTENT ====================
async function autoGenerateMonthlyContent() {
    const project = DB.projects.getActive();
    if (!project) {
        showToast('Please select or create a project first', 'warning');
        return;
    }
    
    const pillars = DB.knowledgeBase.getPillars();
    if (pillars.length === 0) {
        showToast('Please add content pillars in Knowledge Base first', 'warning');
        navigateTo('knowledge-base');
        return;
    }
    
    showLoading('Generating monthly content plan...');
    
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        const posts = await ContentGenerator.generateMonthlyPlan(year, month);
        
        if (posts.length > 0) {
            DB.content.addBulk(posts);
            hideLoading();
            showToast(`${posts.length} content items generated!`, 'success');
            loadDashboard();
            navigateTo('content-hub');
        } else {
            hideLoading();
            showToast('No content generated. Please try again.', 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Generation error:', error);
        showToast('Failed to generate content. Please try again.', 'error');
    }
}

// ==================== CONTENT HUB ====================
function loadContentHub() {
    const view = DB.settings.getViewMode();
    switchView(view);
    populateMonthFilter();
}

function switchView(viewName) {
    currentView = viewName;
    DB.settings.setViewMode(viewName);
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.toggle('active', view.id === `${viewName}-view`);
    });
    
    if (viewName === 'table') renderTableView();
    else if (viewName === 'kanban') renderKanbanView();
    else if (viewName === 'calendar') renderCalendarView();
}

function filterContent() {
    if (currentView === 'table') renderTableView();
    else if (currentView === 'kanban') renderKanbanView();
    else if (currentView === 'calendar') renderCalendarView();
}

function getFilteredContent() {
    let contents = DB.content.getAll();
    
    const search = document.getElementById('search-content')?.value?.toLowerCase();
    const platform = document.getElementById('filter-platform')?.value;
    const status = document.getElementById('filter-status')?.value;
    const month = document.getElementById('filter-month')?.value;
    
    if (search) contents = contents.filter(c => c.title?.toLowerCase().includes(search) || c.caption?.toLowerCase().includes(search));
    if (platform && platform !== 'all') contents = contents.filter(c => c.platform === platform);
    if (status && status !== 'all') contents = contents.filter(c => c.status === status);
    if (month && month !== 'all') contents = contents.filter(c => c.scheduledDate?.startsWith(month));
    
    return contents.sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''));
}

function populateMonthFilter() {
    const select = document.getElementById('filter-month');
    const contents = DB.content.getAll();
    const months = new Set();
    
    contents.forEach(c => {
        if (c.scheduledDate) months.add(c.scheduledDate.substring(0, 7));
    });
    
    select.innerHTML = '<option value="all">All Time</option>' +
        Array.from(months).sort().reverse().map(m => {
            const [year, month] = m.split('-');
            const date = new Date(year, month - 1);
            return `<option value="${m}">${date.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</option>`;
        }).join('');
}

// Table View
function renderTableView() {
    const contents = getFilteredContent();
    const tbody = document.getElementById('content-table-body');
    
    if (contents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No content found. <a href="#" onclick="navigateTo(\'generator\');return false;" style="color:var(--primary)">Generate with AI</a> or <a href="#" onclick="openContentEditor();return false;" style="color:var(--primary)">create manually</a>.</td></tr>';
        return;
    }
    
    tbody.innerHTML = contents.map(c => {
        const needsAI = !c.caption || c.status === 'idea';
        return `
        <tr>
            <td>
                <strong>${c.title || 'Untitled'}</strong><br>
                <small style="color:var(--text-muted)">${c.caption ? (c.caption.substring(0, 50) + '...') : '<em>No caption</em>'}</small>
            </td>
            <td><span class="platform-badge ${c.platform}">${c.platform}</span></td>
            <td>${c.type}</td>
            <td><span class="status-badge ${c.status}">${c.status}</span></td>
            <td>${c.scheduledDate || '-'}</td>
            <td class="table-actions">
                <button onclick="openContentDetail('${c.id}')" title="View">👁</button>
                <button onclick="openContentEditor('${c.id}')" title="Edit">✏️</button>
                ${needsAI ? `<button onclick="triggerAIForContent('${c.id}')" title="Generate with AI" style="background:var(--primary);color:white;">⚡</button>` : ''}
                <button onclick="deleteContent('${c.id}')" title="Delete">🗑️</button>
            </td>
        </tr>
    `}).join('');
}

// Kanban View
function renderKanbanView() {
    const contents = getFilteredContent();
    const statuses = ['idea', 'draft', 'review', 'scheduled', 'published'];
    
    statuses.forEach(status => {
        const container = document.getElementById(`kanban-${status}`);
        const items = contents.filter(c => c.status === status);
        
        container.innerHTML = items.map(c => {
            const needsAI = !c.caption || c.status === 'idea';
            return `
            <div class="kanban-card" draggable="true" data-id="${c.id}">
                <div class="kanban-card-title" onclick="openContentDetail('${c.id}')">${c.title || 'Untitled'}</div>
                <div class="kanban-card-meta">
                    <span class="platform-badge ${c.platform}">${c.platform}</span>
                    <span class="kanban-card-date">${c.scheduledDate || ''}</span>
                </div>
                ${needsAI ? `<button onclick="event.stopPropagation(); triggerAIForContent('${c.id}')" style="width:100%;margin-top:8px;padding:6px;background:var(--primary);color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">⚡ Generate AI</button>` : ''}
            </div>
        `}).join('') || '<p style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">No items</p>';
    });
    
    // Setup drag and drop
    setupKanbanDragDrop();
}

function setupKanbanDragDrop() {
    document.querySelectorAll('.kanban-card').forEach(card => {
        card.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', card.dataset.id);
            card.style.opacity = '0.5';
        });
        card.addEventListener('dragend', () => card.style.opacity = '1');
    });
    
    document.querySelectorAll('.kanban-column').forEach(column => {
        column.addEventListener('dragover', e => { e.preventDefault(); column.style.background = 'var(--border-light)'; });
        column.addEventListener('dragleave', () => column.style.background = '');
        column.addEventListener('drop', e => {
            e.preventDefault();
            column.style.background = '';
            const contentId = e.dataTransfer.getData('text/plain');
            const newStatus = column.dataset.status;
            DB.content.update(contentId, { status: newStatus });
            renderKanbanView();
            showToast('Status updated!', 'success');
        });
    });
}

// Calendar View (in Content Hub)
function renderCalendarView() {
    const grid = document.getElementById('calendar-grid');
    const label = document.getElementById('calendar-month-label');
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    label.textContent = currentCalendarDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    let html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        .map(d => `<div class="calendar-day-header">${d}</div>`).join('');
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day other-month"></div>';
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const contents = DB.content.getByDate(dateStr);
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}" onclick="openDayDetail('${dateStr}')">
                <div class="calendar-day-number">${day}</div>
                <div class="calendar-day-content">
                    ${contents.slice(0, 3).map(c => `<div class="calendar-content-dot" style="background:${getPlatformColor(c.platform)}">${c.platform.substring(0, 2).toUpperCase()}</div>`).join('')}
                    ${contents.length > 3 ? `<div class="calendar-content-dot" style="background:var(--text-muted)">+${contents.length - 3}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    grid.innerHTML = html;
}

function changeMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderCalendarView();
}

function getPlatformColor(platform) {
    const colors = {
        instagram: '#E1306C', tiktok: '#7C3AED', twitter: '#1DA1F2',
        linkedin: '#0077B5', facebook: '#1877F2', youtube: '#FF0000', blog: '#10B981'
    };
    return colors[platform] || '#6B7280';
}

function openDayDetail(dateStr) {
    const contents = DB.content.getByDate(dateStr);
    const date = new Date(dateStr);
    
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="modal-header">
            <h2>${date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div style="margin-bottom:16px;">
            <button class="btn-primary" onclick="closeModal(); openContentEditor(null, '${dateStr}')">+ Add Content</button>
        </div>
        ${contents.length === 0 ? '<p class="empty-state">No content scheduled for this day</p>' :
            contents.map(c => `
                <div class="content-preview-item" onclick="closeModal(); openContentDetail('${c.id}')">
                    <div class="content-preview-info">
                        <div class="content-preview-title">${c.title || 'Untitled'}</div>
                        <div class="content-preview-meta">
                            <span class="platform-badge ${c.platform}">${c.platform}</span>
                            <span>${c.type}</span>
                        </div>
                    </div>
                    <span class="status-badge ${c.status}">${c.status}</span>
                </div>
            `).join('')
        }
    `;
    modal.classList.add('show');
}

// ==================== FULL CALENDAR PAGE ====================
function loadFullCalendar() {
    renderFullCalendar();
}

function renderFullCalendar() {
    const grid = document.getElementById('full-calendar-grid');
    const label = document.getElementById('full-calendar-month');
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    label.textContent = currentCalendarDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    let html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        .map(d => `<div class="calendar-day-header">${d}</div>`).join('');
    
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day other-month"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const contents = DB.content.getByDate(dateStr);
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}" onclick="openDayDetail('${dateStr}')">
                <div class="calendar-day-number">${day}</div>
                <div class="calendar-day-content">
                    ${contents.slice(0, 4).map(c => `<div class="calendar-content-dot" style="background:${getPlatformColor(c.platform)}">${c.title?.substring(0, 15) || c.platform}</div>`).join('')}
                    ${contents.length > 4 ? `<div class="calendar-content-dot" style="background:var(--text-muted)">+${contents.length - 4} more</div>` : ''}
                </div>
            </div>
        `;
    }
    
    grid.innerHTML = html;
}

function changeCalendarMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderFullCalendar();
}

// ==================== CONTENT CRUD ====================
function openContentEditor(contentId = null, defaultDate = null) {
    const content = contentId ? DB.content.getById(contentId) : null;
    const pillars = DB.knowledgeBase.getPillars();
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${content ? 'Edit Content' : 'New Content'}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="form-group">
            <label>Title</label>
            <input type="text" id="edit-title" value="${content?.title || ''}" placeholder="Content title">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Platform</label>
                <select id="edit-platform">
                    ${['instagram', 'tiktok', 'twitter', 'linkedin', 'facebook', 'youtube', 'blog']
                        .map(p => `<option value="${p}" ${content?.platform === p ? 'selected' : ''}>${p.charAt(0).toUpperCase() + p.slice(1)}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Type</label>
                <select id="edit-type">
                    ${['post', 'reel', 'story', 'carousel', 'thread', 'article']
                        .map(t => `<option value="${t}" ${content?.type === t ? 'selected' : ''}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Status</label>
                <select id="edit-status">
                    ${['idea', 'draft', 'review', 'scheduled', 'published']
                        .map(s => `<option value="${s}" ${content?.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Pillar</label>
                <select id="edit-pillar">
                    <option value="">Select pillar...</option>
                    ${pillars.map(p => `<option value="${p}" ${content?.pillar === p ? 'selected' : ''}>${p}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Scheduled Date</label>
                <input type="date" id="edit-date" value="${content?.scheduledDate || defaultDate || ''}">
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" id="edit-time" value="${content?.scheduledTime || '09:00'}">
            </div>
        </div>
        <div class="form-group">
            <label>Caption</label>
            <textarea id="edit-caption" rows="5" placeholder="Write your caption...">${content?.caption || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Hashtags</label>
            <input type="text" id="edit-hashtags" value="${content?.hashtags?.join(' ') || ''}" placeholder="#hashtag1 #hashtag2">
        </div>
        <div class="form-group">
            <label>Image URL</label>
            <input type="text" id="edit-image" value="${content?.imageUrl || ''}" placeholder="https://...">
        </div>
        <div class="form-group">
            <label>Notes</label>
            <textarea id="edit-notes" rows="2" placeholder="Internal notes...">${content?.notes || ''}</textarea>
        </div>
        <div style="display:flex;gap:12px;">
            <button class="btn-primary" style="flex:1" onclick="saveContent('${contentId || ''}')">${content ? 'Save Changes' : 'Create Content'}</button>
            ${content ? `<button class="btn-danger" onclick="deleteContent('${contentId}'); closeModal()">Delete</button>` : ''}
        </div>
    `;
    modal.classList.add('show');
}

function saveContent(contentId) {
    const data = {
        title: document.getElementById('edit-title').value,
        platform: document.getElementById('edit-platform').value,
        type: document.getElementById('edit-type').value,
        status: document.getElementById('edit-status').value,
        pillar: document.getElementById('edit-pillar').value,
        scheduledDate: document.getElementById('edit-date').value,
        scheduledTime: document.getElementById('edit-time').value,
        caption: document.getElementById('edit-caption').value,
        hashtags: document.getElementById('edit-hashtags').value.match(/#\w+/g) || [],
        imageUrl: document.getElementById('edit-image').value,
        notes: document.getElementById('edit-notes').value
    };
    
    if (contentId) {
        DB.content.update(contentId, data);
        showToast('Content updated!', 'success');
    } else {
        DB.content.add(data);
        showToast('Content created!', 'success');
    }
    
    closeModal();
    loadContentHub();
    loadDashboard();
}

function deleteContent(contentId) {
    if (confirm('Delete this content?')) {
        DB.content.delete(contentId);
        showToast('Content deleted', 'success');
        loadContentHub();
        loadDashboard();
    }
}

function openContentDetail(contentId) {
    const content = DB.content.getById(contentId);
    if (!content) return;
    
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    // Check if content needs AI generation (empty caption or status is idea)
    const needsAI = !content.caption || content.status === 'idea';
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${content.title || 'Untitled'}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
            <span class="platform-badge ${content.platform}">${content.platform}</span>
            <span class="status-badge ${content.status}">${content.status}</span>
            <span style="color:var(--text-secondary)">${content.type}</span>
            ${content.pillar ? `<span style="background:var(--secondary);color:white;padding:2px 8px;border-radius:4px;font-size:12px;">🎯 ${content.pillar}</span>` : ''}
        </div>
        ${content.imageUrl ? `<img src="${content.imageUrl}" style="width:100%;border-radius:8px;margin-bottom:16px;">` : ''}
        <div style="background:var(--bg-main);padding:16px;border-radius:8px;margin-bottom:16px;white-space:pre-wrap;">${content.caption || '<span style="color:var(--text-muted)">No caption yet - Generate with AI!</span>'}</div>
        ${content.hashtags?.length ? `<div style="margin-bottom:16px;">${content.hashtags.map(h => `<span style="background:var(--primary);color:white;padding:2px 8px;border-radius:4px;margin-right:4px;font-size:12px;">${h}</span>`).join('')}</div>` : ''}
        <div style="color:var(--text-secondary);font-size:13px;margin-bottom:16px;">
            ${content.scheduledDate ? `📅 ${content.scheduledDate} ${content.scheduledTime || ''}` : 'Not scheduled'}
        </div>
        ${content.notes ? `<div style="background:#FEF3C7;padding:12px;border-radius:8px;font-size:13px;margin-bottom:16px;">📝 ${content.notes}</div>` : ''}
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
            ${content.caption ? `<button class="btn-secondary" onclick="copyToClipboard(\`${(content.caption || '').replace(/`/g, '\\`')}\`)">📋 Copy</button>` : ''}
            <button class="btn-secondary" onclick="closeModal(); openContentEditor('${contentId}')">✏️ Edit</button>
            ${needsAI ? `<button class="btn-primary" onclick="closeModal(); triggerAIForContent('${contentId}')">⚡ Generate with AI</button>` : `<button class="btn-secondary" onclick="closeModal(); triggerAIForContent('${contentId}')">🔄 Regenerate</button>`}
            <button class="btn-secondary" onclick="updateContentStatus('${contentId}')">📊 Change Status</button>
        </div>
    `;
    modal.classList.add('show');
}

// Trigger AI Generator with content data pre-filled
function triggerAIForContent(contentId) {
    const content = DB.content.getById(contentId);
    if (!content) return;
    
    // Store content ID for later update
    window.pendingContentUpdate = contentId;
    
    // Navigate to generator
    navigateTo('generator');
    
    // Pre-fill form with content data
    setTimeout(() => {
        document.getElementById('gen-topic').value = content.title || '';
        document.getElementById('gen-platform').value = content.platform || 'instagram';
        document.getElementById('gen-type').value = content.type || 'post';
        
        const pillarSelect = document.getElementById('gen-pillar');
        if (pillarSelect && content.pillar) {
            pillarSelect.value = content.pillar;
        }
        
        showToast('Form pre-filled from content. Click Generate!', 'info');
    }, 100);
}

// Update content status via modal
function updateContentStatus(contentId) {
    const content = DB.content.getById(contentId);
    if (!content) return;
    
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>Update Status</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <p style="margin-bottom:16px;color:var(--text-secondary);">${content.title || 'Untitled'}</p>
        <div class="status-options" style="display:flex;flex-direction:column;gap:8px;">
            ${['idea', 'draft', 'review', 'scheduled', 'published'].map(s => `
                <button class="btn-secondary ${content.status === s ? 'active' : ''}" 
                    style="${content.status === s ? 'border-color:var(--primary);background:rgba(91,154,148,0.1);' : ''}"
                    onclick="setContentStatus('${contentId}', '${s}')">
                    ${getStatusEmoji(s)} ${s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
            `).join('')}
        </div>
    `;
    modal.classList.add('show');
}

function getStatusEmoji(status) {
    const emojis = { idea: '💡', draft: '📝', review: '👀', scheduled: '📅', published: '✅' };
    return emojis[status] || '📄';
}

function setContentStatus(contentId, status) {
    DB.content.update(contentId, { status });
    closeModal();
    showToast(`Status updated to ${status}!`, 'success');
    
    // Refresh current view
    const currentSection = document.querySelector('.section.active')?.id;
    if (currentSection === 'content-hub') loadContentHub();
    else if (currentSection === 'dashboard') loadDashboard();
    else if (currentSection === 'calendar') loadFullCalendar();
}

// ==================== KNOWLEDGE BASE ====================
function loadKnowledgeBase() {
    const kb = DB.knowledgeBase.get();
    
    // Load guidelines
    if (kb.guidelines) {
        document.getElementById('kb-brand-voice').value = kb.guidelines.brandVoice || '';
        document.getElementById('kb-key-messages').value = kb.guidelines.keyMessages || '';
        document.getElementById('kb-words-use').value = kb.guidelines.wordsToUse || '';
        document.getElementById('kb-words-avoid').value = kb.guidelines.wordsToAvoid || '';
    }
    
    // Load documents
    renderKBDocuments();
    
    // Load notes
    renderKBNotes();
    
    // Load pillars
    renderPillars();
}

function saveGuidelines() {
    DB.knowledgeBase.updateGuidelines({
        brandVoice: document.getElementById('kb-brand-voice').value,
        keyMessages: document.getElementById('kb-key-messages').value,
        wordsToUse: document.getElementById('kb-words-use').value,
        wordsToAvoid: document.getElementById('kb-words-avoid').value
    });
    showToast('Guidelines saved!', 'success');
}

function handleKBFileUpload(event) {
    const files = event.target.files;
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            DB.knowledgeBase.addDocument({
                name: file.name,
                type: file.type,
                content: e.target.result,
                category: 'general'
            });
            renderKBDocuments();
            showToast(`${file.name} uploaded!`, 'success');
        };
        reader.readAsText(file);
    });
}

function renderKBDocuments() {
    const kb = DB.knowledgeBase.get();
    const container = document.getElementById('kb-documents-list');
    
    container.innerHTML = kb.documents?.map(doc => `
        <div class="kb-doc-item">
            <span>📄 ${doc.name} <small style="color:var(--text-muted)">(${doc.category})</small></span>
            <button onclick="removeKBDocument('${doc.id}')">&times;</button>
        </div>
    `).join('') || '<p style="color:var(--text-muted);font-size:13px;">No documents uploaded</p>';
}

function removeKBDocument(docId) {
    DB.knowledgeBase.removeDocument(docId);
    renderKBDocuments();
    showToast('Document removed', 'success');
}

function addKBNote() {
    const text = document.getElementById('kb-note-text').value;
    const category = document.getElementById('kb-note-category').value;
    
    if (!text.trim()) {
        showToast('Please enter a note', 'warning');
        return;
    }
    
    DB.knowledgeBase.addNote(text, category);
    document.getElementById('kb-note-text').value = '';
    renderKBNotes();
    showToast('Note added!', 'success');
}

function renderKBNotes() {
    const kb = DB.knowledgeBase.get();
    const container = document.getElementById('kb-notes-list');
    
    container.innerHTML = kb.notes?.map(note => `
        <div class="kb-note-item">
            <span><strong>[${note.category}]</strong> ${note.content}</span>
            <button onclick="removeKBNote('${note.id}')">&times;</button>
        </div>
    `).join('') || '<p style="color:var(--text-muted);font-size:13px;">No notes added</p>';
}

function removeKBNote(noteId) {
    DB.knowledgeBase.removeNote(noteId);
    renderKBNotes();
    showToast('Note removed', 'success');
}

function addPillar() {
    const input = document.getElementById('new-pillar-input');
    const pillar = input.value.trim();
    
    if (!pillar) {
        showToast('Please enter a pillar name', 'warning');
        return;
    }
    
    DB.knowledgeBase.addPillar(pillar);
    input.value = '';
    renderPillars();
    showToast('Pillar added!', 'success');
}

function renderPillars() {
    const pillars = DB.knowledgeBase.getPillars();
    const container = document.getElementById('pillars-list');
    const genSelect = document.getElementById('gen-pillar');
    
    container.innerHTML = pillars.map(p => `
        <span class="pillar-tag">
            ${p}
            <button onclick="removePillar('${p}')">&times;</button>
        </span>
    `).join('') || '<p style="color:var(--text-muted);font-size:13px;">No pillars added</p>';
    
    if (genSelect) {
        genSelect.innerHTML = '<option value="">Select pillar...</option>' +
            pillars.map(p => `<option value="${p}">${p}</option>`).join('');
    }
}

function removePillar(pillar) {
    DB.knowledgeBase.removePillar(pillar);
    renderPillars();
    showToast('Pillar removed', 'success');
}

// ==================== AI GENERATOR ====================
function loadGenerator() {
    renderPillars();
    
    // Clear pending content update if navigating fresh
    if (!window.pendingContentUpdate) {
        document.getElementById('gen-topic').value = '';
        document.getElementById('gen-result').innerHTML = '<p class="placeholder-text">Result will appear here...</p>';
        document.getElementById('gen-result-actions').style.display = 'none';
    }
}

// Quick Generate from Dashboard
async function quickGenerateFromDashboard() {
    const topic = document.getElementById('quick-gen-topic')?.value;
    const platform = document.getElementById('quick-gen-platform')?.value || 'instagram';
    
    if (!topic?.trim()) {
        showToast('Please enter a topic', 'warning');
        return;
    }
    
    // Navigate to generator with pre-filled data
    navigateTo('generator');
    
    setTimeout(() => {
        document.getElementById('gen-topic').value = topic;
        document.getElementById('gen-platform').value = platform;
        
        // Auto-trigger generation
        generateSingleContent();
    }, 100);
    
    // Clear dashboard input
    document.getElementById('quick-gen-topic').value = '';
}

async function generateSingleContent() {
    const topic = document.getElementById('gen-topic').value;
    if (!topic.trim()) {
        showToast('Please enter a topic', 'warning');
        return;
    }
    
    const project = DB.projects.getActive();
    if (!project) {
        showToast('Please select a project first', 'warning');
        return;
    }
    
    showLoading('Generating content...');
    
    try {
        const options = {
            platform: document.getElementById('gen-platform').value,
            type: document.getElementById('gen-type').value,
            pillar: document.getElementById('gen-pillar').value,
            includeHashtags: document.getElementById('gen-hashtags').checked,
            includeCta: document.getElementById('gen-cta').checked
        };
        
        const result = await ContentGenerator.generateContent(topic, options);
        lastGeneratedContent = { ...result, topic, options };
        
        // Generate image if checked
        let imageUrl = '';
        if (document.getElementById('gen-image').checked) {
            const imagePrompt = await ContentGenerator.generateImagePrompt(topic, options.platform);
            imageUrl = PollinationsAI.generateImageUrl(imagePrompt.trim());
            lastGeneratedContent.imageUrl = imageUrl;
            lastGeneratedContent.imagePrompt = imagePrompt;
        }
        
        // Display result
        const resultDiv = document.getElementById('gen-result');
        resultDiv.innerHTML = `
            ${imageUrl ? `<img src="${imageUrl}" class="gen-result-image" alt="Generated image">` : ''}
            <div style="margin-bottom:12px;">
                <strong>Hook:</strong><br>
                <span style="color:var(--primary)">${result.hook || '-'}</span>
            </div>
            <div style="margin-bottom:12px;">
                <strong>Caption:</strong><br>
                ${result.caption || result.raw}
            </div>
            ${result.cta ? `<div style="margin-bottom:12px;"><strong>CTA:</strong> ${result.cta}</div>` : ''}
            ${result.hashtags?.length ? `<div><strong>Hashtags:</strong> ${result.hashtags.join(' ')}</div>` : ''}
        `;
        
        document.getElementById('gen-result-actions').style.display = 'flex';
        hideLoading();
        showToast('Content generated!', 'success');
    } catch (error) {
        hideLoading();
        console.error('Generation error:', error);
        showToast('Failed to generate content', 'error');
    }
}

function copyGeneratedContent() {
    if (!lastGeneratedContent) return;
    const text = `${lastGeneratedContent.hook}\n\n${lastGeneratedContent.caption}\n\n${lastGeneratedContent.cta || ''}\n\n${lastGeneratedContent.hashtags?.join(' ') || ''}`;
    copyToClipboard(text);
}

async function regenerateContent() {
    if (!lastGeneratedContent) return;
    document.getElementById('gen-topic').value = lastGeneratedContent.topic;
    await generateSingleContent();
}

function saveGeneratedContent() {
    if (!lastGeneratedContent) return;
    
    const fullCaption = `${lastGeneratedContent.hook}\n\n${lastGeneratedContent.caption}\n\n${lastGeneratedContent.cta || ''}`.trim();
    
    // Check if we're updating existing content or creating new
    if (window.pendingContentUpdate) {
        // Update existing content
        DB.content.update(window.pendingContentUpdate, {
            caption: fullCaption,
            hashtags: lastGeneratedContent.hashtags || [],
            imageUrl: lastGeneratedContent.imageUrl || '',
            imagePrompt: lastGeneratedContent.imagePrompt || '',
            hook: lastGeneratedContent.hook || '',
            cta: lastGeneratedContent.cta || '',
            status: 'draft' // Move from idea to draft after generation
        });
        showToast('Content updated with AI generation!', 'success');
        window.pendingContentUpdate = null;
    } else {
        // Create new content
        DB.content.add({
            title: lastGeneratedContent.topic.substring(0, 50),
            caption: fullCaption,
            hashtags: lastGeneratedContent.hashtags || [],
            platform: lastGeneratedContent.options.platform,
            type: lastGeneratedContent.options.type,
            pillar: lastGeneratedContent.options.pillar,
            imageUrl: lastGeneratedContent.imageUrl || '',
            imagePrompt: lastGeneratedContent.imagePrompt || '',
            hook: lastGeneratedContent.hook || '',
            cta: lastGeneratedContent.cta || '',
            status: 'draft'
        });
        showToast('Content saved to hub!', 'success');
    }
    
    lastGeneratedContent = null;
    document.getElementById('gen-result').innerHTML = '<p class="placeholder-text">Result will appear here...</p>';
    document.getElementById('gen-result-actions').style.display = 'none';
    
    // Refresh dashboard stats
    loadDashboard();
}

// ==================== SETTINGS ====================
function loadSettings() {
    const project = DB.projects.getActive();
    if (!project) return;
    
    document.getElementById('setting-project-name').value = project.name || '';
    document.getElementById('setting-brand-name').value = project.brandName || '';
    document.getElementById('setting-niche').value = project.niche || 'general';
    document.getElementById('setting-audience').value = project.targetAudience || '';
    document.getElementById('setting-tone').value = project.toneOfVoice || 'casual';
    document.getElementById('setting-posts-per-day').value = project.postsPerDay || 1;
    
    // Posting days
    const postingDays = project.postingDays || ['mon', 'wed', 'fri'];
    document.querySelectorAll('.day-selector input').forEach(cb => {
        cb.checked = postingDays.includes(cb.value);
    });
    
    // Platforms
    const platforms = project.platforms || ['instagram', 'tiktok'];
    document.querySelectorAll('.platform-checkboxes input').forEach(cb => {
        cb.checked = platforms.includes(cb.value);
    });
}

function saveProjectSettings() {
    const project = DB.projects.getActive();
    if (!project) return;
    
    const postingDays = [];
    document.querySelectorAll('.day-selector input:checked').forEach(cb => postingDays.push(cb.value));
    
    const platforms = [];
    document.querySelectorAll('.platform-checkboxes input:checked').forEach(cb => platforms.push(cb.value));
    
    DB.projects.update(project.id, {
        name: document.getElementById('setting-project-name').value,
        brandName: document.getElementById('setting-brand-name').value,
        niche: document.getElementById('setting-niche').value,
        targetAudience: document.getElementById('setting-audience').value,
        toneOfVoice: document.getElementById('setting-tone').value,
        postsPerDay: parseInt(document.getElementById('setting-posts-per-day').value),
        postingDays,
        platforms
    });
    
    loadProjects();
    loadActiveProject();
    showToast('Settings saved!', 'success');
}

function exportProjectData() {
    const project = DB.projects.getActive();
    if (!project) return;
    
    const data = {
        project,
        knowledgeBase: DB.knowledgeBase.get(),
        content: DB.content.getAll(),
        exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Project exported!', 'success');
}

function importProjectData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                // Import logic here
                showToast('Import feature coming soon!', 'info');
            } catch (err) {
                showToast('Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportCalendar() {
    const contents = DB.content.getAll().filter(c => c.scheduledDate);
    const csv = 'Date,Time,Title,Platform,Type,Status,Caption\n' +
        contents.map(c => `"${c.scheduledDate}","${c.scheduledTime || ''}","${c.title || ''}","${c.platform}","${c.type}","${c.status}","${(c.caption || '').replace(/"/g, '""')}"`).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content_calendar.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Calendar exported!', 'success');
}

// ==================== UTILITIES ====================
function showLoading(text = 'Loading...') {
    const loading = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');
    if (loadingText) loadingText.textContent = text;
    if (loading) loading.classList.add('show');
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.remove('show');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3500);
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('show');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard!', 'success');
    });
}

// Close modal on escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});
