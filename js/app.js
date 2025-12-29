/**
 * Main Application - raycorpContent
 * Omnichannel Content Management System
 */

// Global State
let currentView = 'table';
let currentCalendarDate = new Date();
let lastGeneratedContent = null;
let selectedContentType = 'video_short';
let selectedPlatforms = [];
let draggedItem = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    DB.init();
    setupNavigation();
    loadProjects();
    loadActiveProject();
    setupDragAndDrop();
    console.log('🚀 raycorpContent initialized!');
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
    
    // Load section data
    switch(sectionId) {
        case 'dashboard': loadDashboard(); break;
        case 'content-hub': loadContentHub(); break;
        case 'knowledge-base': loadKnowledgeBase(); break;
        case 'calendar': loadFullCalendar(); break;
        case 'settings': loadSettings(); break;
        case 'generator': loadGenerator(); break;
        case 'bulk-create': loadBulkCreate(); break;
    }
}

// ==================== PROJECT MANAGEMENT ====================
function loadProjects() {
    const projects = DB.projects.getAll();
    const select = document.getElementById('project-select');
    const activeId = DB.projects.getActiveId();
    
    select.innerHTML = '<option value="">Pilih Project...</option>' +
        projects.map(p => `<option value="${p.id}" ${p.id === activeId ? 'selected' : ''}>${p.name}</option>`).join('');
    
    // Show setup button if no projects
    const setupBtn = document.getElementById('btn-setup-raycorp');
    if (setupBtn) {
        setupBtn.style.display = projects.length === 0 ? 'block' : 'none';
    }
}

function switchProject(projectId) {
    if (!projectId) return;
    DB.projects.setActive(projectId);
    loadActiveProject();
    showToast('Project switched!', 'success');
}

function loadActiveProject() {
    const project = DB.projects.getActive();
    const nameEl = document.getElementById('dashboard-project-name');
    const genBtn = document.getElementById('btn-auto-generate');
    
    if (project) {
        nameEl.textContent = `${project.brandName || project.name} • ${project.niche}`;
        genBtn.disabled = false;
        loadDashboard();
    } else {
        nameEl.textContent = 'Pilih atau buat project untuk memulai';
        genBtn.disabled = true;
    }
}

function openProjectModal(mode, projectId = null) {
    const project = projectId ? DB.projects.getById(projectId) : null;
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="modal-header">
            <h2>${mode === 'create' ? 'Create Project' : 'Edit Project'}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="form-group">
            <label>Project Name</label>
            <input type="text" id="modal-project-name" value="${project?.name || ''}" placeholder="My Brand">
        </div>
        <div class="form-group">
            <label>Brand Name</label>
            <input type="text" id="modal-brand-name" value="${project?.brandName || ''}" placeholder="Brand Name">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Niche</label>
                <select id="modal-niche">
                    ${['business', 'tech', 'lifestyle', 'education', 'health', 'food', 'fashion', 'finance']
                        .map(n => `<option value="${n}" ${project?.niche === n ? 'selected' : ''}>${n}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Tone</label>
                <select id="modal-tone">
                    ${['casual', 'professional', 'humorous', 'inspirational', 'educational']
                        .map(t => `<option value="${t}" ${project?.toneOfVoice === t ? 'selected' : ''}>${t}</option>`).join('')}
                </select>
            </div>
        </div>
        <button class="btn-primary btn-full" onclick="${mode === 'create' ? 'createProject()' : `updateProject('${projectId}')`}">
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
        toneOfVoice: document.getElementById('modal-tone').value
    });
    
    DB.projects.setActive(project.id);
    loadProjects();
    loadActiveProject();
    closeModal();
    showToast('Project created!', 'success');
}

// ==================== DASHBOARD ====================
function loadDashboard() {
    const stats = DB.content.getStats();
    
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-draft').textContent = stats.draft + stats.idea;
    document.getElementById('stat-scheduled').textContent = stats.scheduled;
    document.getElementById('stat-published').textContent = stats.published;
    
    loadUpcomingContent();
}

function loadUpcomingContent() {
    const container = document.getElementById('upcoming-content');
    const today = new Date().toISOString().split('T')[0];
    const contents = DB.content.getAll()
        .filter(c => c.scheduledDate >= today && c.status !== 'published')
        .sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''))
        .slice(0, 5);
    
    if (contents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <h3>No upcoming content</h3>
                <p>Generate content to get started</p>
                <button class="btn-primary" onclick="autoGenerateMonthlyContent()" style="margin-top: 16px;">⚡ Auto-Generate</button>
            </div>`;
        return;
    }
    
    container.innerHTML = contents.map(c => {
        const type = OmnichannelConfig.getContentType(c.contentType);
        return `
            <div style="display: flex; align-items: center; gap: 16px; padding: 12px; background: var(--bg-muted); border-radius: var(--radius-sm); margin-bottom: 8px; cursor: pointer;" onclick="openContentDetail('${c.id}')">
                <div style="font-size: 24px;">${type?.icon || '📄'}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 500;">${c.title || 'Untitled'}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${type?.name || c.contentType} • ${c.scheduledDate}</div>
                </div>
                <span class="status-badge ${c.status}">${c.status}</span>
            </div>
        `;
    }).join('');
}

function quickGenerate() {
    const topic = document.getElementById('quick-gen-topic').value;
    const type = document.getElementById('quick-gen-type').value;
    
    if (!topic.trim()) {
        showToast('Please enter a topic', 'warning');
        return;
    }
    
    navigateTo('generator');
    setTimeout(() => {
        document.getElementById('gen-topic').value = topic;
        selectContentType(type);
    }, 100);
}

function filterByStatus(status) {
    navigateTo('content-hub');
    setTimeout(() => {
        document.getElementById('filter-status').value = status;
        filterContent();
    }, 100);
}


// ==================== CONTENT HUB ====================
function loadContentHub() {
    switchView(currentView);
}

function switchView(viewName) {
    currentView = viewName;
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.toggle('active', view.id === `${viewName}-view`);
    });
    
    switch(viewName) {
        case 'table': renderTableView(); break;
        case 'kanban': renderKanbanView(); break;
        case 'calendar': renderCalendarView(); break;
        case 'timeline': renderTimelineView(); break;
    }
}

function filterContent() {
    switchView(currentView);
}

function getFilteredContent() {
    let contents = DB.content.getAll();
    
    const search = document.getElementById('search-content')?.value?.toLowerCase();
    const contentType = document.getElementById('filter-content-type')?.value;
    const status = document.getElementById('filter-status')?.value;
    
    if (search) contents = contents.filter(c => c.title?.toLowerCase().includes(search) || c.caption?.toLowerCase().includes(search));
    if (contentType && contentType !== 'all') contents = contents.filter(c => c.contentType === contentType);
    if (status && status !== 'all') contents = contents.filter(c => c.status === status);
    
    return contents.sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''));
}

// Table View
function renderTableView() {
    const contents = getFilteredContent();
    const tbody = document.getElementById('content-table-body');
    
    if (contents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No content found</td></tr>';
        return;
    }
    
    tbody.innerHTML = contents.map(c => {
        const type = OmnichannelConfig.getContentType(c.contentType);
        const platforms = OmnichannelConfig.getPlatformsForType(c.contentType);
        
        return `
            <tr draggable="true" data-id="${c.id}" onclick="openContentDetail('${c.id}')">
                <td>
                    <strong>${c.title || 'Untitled'}</strong><br>
                    <small style="color: var(--text-muted);">${c.caption ? c.caption.substring(0, 50) + '...' : 'No caption'}</small>
                </td>
                <td><span class="content-type-badge ${c.contentType?.replace('_', '-')}">${type?.icon || ''} ${type?.name || c.contentType}</span></td>
                <td>
                    <div class="platform-tags">
                        ${platforms.slice(0, 3).map(p => `<span class="platform-tag">${p.icon}</span>`).join('')}
                        ${platforms.length > 3 ? `<span class="platform-tag">+${platforms.length - 3}</span>` : ''}
                    </div>
                </td>
                <td><span class="status-badge ${c.status}">${c.status}</span></td>
                <td>${c.scheduledDate || '-'}</td>
                <td class="table-actions" onclick="event.stopPropagation()">
                    <button onclick="openContentEditor('${c.id}')" title="Edit">✏️</button>
                    <button onclick="deleteContent('${c.id}')" title="Delete">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
    
    setupTableDragDrop();
}

// Kanban View
function renderKanbanView() {
    const contents = getFilteredContent();
    const statuses = ['idea', 'draft', 'review', 'scheduled', 'published'];
    
    statuses.forEach(status => {
        const container = document.getElementById(`kanban-${status}`);
        const countEl = document.getElementById(`kanban-count-${status}`);
        const items = contents.filter(c => c.status === status);
        
        countEl.textContent = items.length;
        
        container.innerHTML = items.map(c => {
            const type = OmnichannelConfig.getContentType(c.contentType);
            const platforms = OmnichannelConfig.getPlatformsForType(c.contentType);
            
            return `
                <div class="kanban-card" draggable="true" data-id="${c.id}" onclick="openContentDetail('${c.id}')">
                    <div class="kanban-card-title">${c.title || 'Untitled'}</div>
                    <div class="kanban-card-meta">
                        <span class="content-type-badge ${c.contentType?.replace('_', '-')}" style="font-size: 10px; padding: 2px 8px;">${type?.icon || ''} ${type?.name || ''}</span>
                        <span>${c.scheduledDate || ''}</span>
                    </div>
                    <div class="kanban-card-platforms">
                        ${platforms.slice(0, 4).map(p => `<span class="platform-icon">${p.icon}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('') || '<p style="text-align: center; color: var(--text-muted); padding: 20px;">No items</p>';
    });
    
    setupKanbanDragDrop();
}

// Calendar View
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
    
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day" style="opacity: 0.3;"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const contents = DB.content.getByDate(dateStr);
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}" onclick="openDayDetail('${dateStr}')">
                <div class="calendar-day-number">${day}</div>
                <div class="calendar-day-content">
                    ${contents.slice(0, 3).map(c => {
                        const type = OmnichannelConfig.getContentType(c.contentType);
                        return `<div class="calendar-item" style="background: ${type?.color || 'var(--primary)'}; color: white;" draggable="true" data-id="${c.id}">${type?.icon || ''} ${c.title?.substring(0, 10) || ''}</div>`;
                    }).join('')}
                    ${contents.length > 3 ? `<div style="font-size: 10px; color: var(--text-muted);">+${contents.length - 3} more</div>` : ''}
                </div>
            </div>
        `;
    }
    
    grid.innerHTML = html;
    setupCalendarDragDrop();
}

// Timeline View
function renderTimelineView() {
    const container = document.getElementById('timeline-container');
    const contents = getFilteredContent().filter(c => c.scheduledDate);
    
    if (contents.length === 0) {
        container.innerHTML = '<div class="timeline-line"></div><div class="empty-state">No scheduled content</div>';
        return;
    }
    
    let html = '<div class="timeline-line"></div>';
    
    contents.forEach(c => {
        const type = OmnichannelConfig.getContentType(c.contentType);
        html += `
            <div class="timeline-item" draggable="true" data-id="${c.id}" onclick="openContentDetail('${c.id}')">
                <div class="timeline-date">${c.scheduledDate}</div>
                <div class="timeline-title">${c.title || 'Untitled'}</div>
                <div class="timeline-meta">
                    <span class="content-type-badge ${c.contentType?.replace('_', '-')}">${type?.icon || ''} ${type?.name || ''}</span>
                    <span class="status-badge ${c.status}">${c.status}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    setupTimelineDragDrop();
}

function changeMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderCalendarView();
}

// ==================== DRAG AND DROP ====================
function setupDragAndDrop() {
    // Global drag events
    document.addEventListener('dragstart', (e) => {
        if (e.target.dataset.id) {
            draggedItem = e.target.dataset.id;
            e.target.classList.add('dragging');
        }
    });
    
    document.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    });
}

function setupTableDragDrop() {
    // Table rows can be reordered
}

function setupKanbanDragDrop() {
    document.querySelectorAll('.kanban-column').forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            if (draggedItem) {
                const newStatus = column.dataset.status;
                DB.content.update(draggedItem, { status: newStatus });
                renderKanbanView();
                showToast('Status updated!', 'success');
            }
        });
    });
}

function setupCalendarDragDrop() {
    document.querySelectorAll('.calendar-day[data-date]').forEach(day => {
        day.addEventListener('dragover', (e) => {
            e.preventDefault();
            day.classList.add('drag-over');
        });
        
        day.addEventListener('dragleave', () => {
            day.classList.remove('drag-over');
        });
        
        day.addEventListener('drop', (e) => {
            e.preventDefault();
            day.classList.remove('drag-over');
            
            if (draggedItem) {
                const newDate = day.dataset.date;
                DB.content.update(draggedItem, { scheduledDate: newDate });
                renderCalendarView();
                showToast('Date updated!', 'success');
            }
        });
    });
}

function setupTimelineDragDrop() {
    // Timeline items can be reordered by date
}


// ==================== AI GENERATOR ====================
function loadGenerator() {
    renderPillars();
    selectContentType(selectedContentType);
}

function selectContentType(typeId) {
    selectedContentType = typeId;
    
    // Update UI
    document.querySelectorAll('.content-type-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.type === typeId);
    });
    
    // Update platform checkboxes
    updatePlatformCheckboxes(typeId);
}

function updatePlatformCheckboxes(typeId) {
    const container = document.getElementById('platform-checkboxes');
    const platforms = OmnichannelConfig.getPlatformsForType(typeId);
    
    selectedPlatforms = platforms.map(p => p.id);
    
    container.innerHTML = platforms.map(p => `
        <label class="platform-checkbox checked" data-platform="${p.id}" onclick="togglePlatform('${p.id}')">
            <span>${p.icon}</span>
            <span>${p.name}</span>
        </label>
    `).join('');
}

function togglePlatform(platformId) {
    const checkbox = document.querySelector(`.platform-checkbox[data-platform="${platformId}"]`);
    checkbox.classList.toggle('checked');
    
    if (selectedPlatforms.includes(platformId)) {
        selectedPlatforms = selectedPlatforms.filter(p => p !== platformId);
    } else {
        selectedPlatforms.push(platformId);
    }
}

async function generateContent() {
    const topic = document.getElementById('gen-topic').value;
    const pillar = document.getElementById('gen-pillar').value;
    const multiOutput = document.getElementById('gen-multi-output').checked;
    
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
        const context = DB.knowledgeBase.getContextString();
        const contentType = OmnichannelConfig.getContentType(selectedContentType);
        const prompt = OmnichannelConfig.generatePrompt(selectedContentType, topic, context);
        
        // Generate main content
        const result = await PollinationsAI.generateText(prompt);
        
        lastGeneratedContent = {
            topic,
            contentType: selectedContentType,
            platforms: selectedPlatforms,
            pillar,
            content: result,
            alternatives: []
        };
        
        // Generate alternatives if enabled
        if (multiOutput) {
            showLoading('Generating alternatives...');
            const altPrompt = `Generate 3 alternative variations of this content with different angles/hooks:\n\n${result.substring(0, 500)}...\n\nProvide 3 distinct variations, each with a different approach.`;
            const alternatives = await PollinationsAI.generateText(altPrompt);
            lastGeneratedContent.alternatives = parseAlternatives(alternatives);
        }
        
        // Generate image if applicable
        if (['image_single', 'image_carousel', 'video_short', 'video_story'].includes(selectedContentType)) {
            showLoading('Generating image...');
            const imagePrompt = `Professional social media ${contentType.name} about: ${topic}. Modern, clean design, high quality.`;
            lastGeneratedContent.imageUrl = PollinationsAI.generateImageUrl(imagePrompt);
        }
        
        displayGeneratorResult();
        hideLoading();
        showToast('Content generated!', 'success');
        
    } catch (error) {
        hideLoading();
        console.error('Generation error:', error);
        showToast('Failed to generate content', 'error');
    }
}

function parseAlternatives(text) {
    // Simple parsing - split by "Variation" or numbered items
    const parts = text.split(/(?:Variation|Alternative|\d\.)\s*/i).filter(p => p.trim().length > 50);
    return parts.slice(0, 3).map((p, i) => ({
        id: i + 1,
        content: p.trim().substring(0, 300) + '...'
    }));
}

function displayGeneratorResult() {
    const preview = document.getElementById('result-preview');
    const alternatives = document.getElementById('ai-alternatives');
    const actions = document.getElementById('result-actions');
    
    const type = OmnichannelConfig.getContentType(lastGeneratedContent.contentType);
    
    let html = '';
    
    if (lastGeneratedContent.imageUrl) {
        html += `<img src="${lastGeneratedContent.imageUrl}" style="max-width: 100%; border-radius: var(--radius-md); margin-bottom: 16px;">`;
    }
    
    html += `
        <div style="margin-bottom: 16px;">
            <span class="content-type-badge ${lastGeneratedContent.contentType.replace('_', '-')}">${type?.icon} ${type?.name}</span>
        </div>
        <div style="white-space: pre-wrap; line-height: 1.8;">${lastGeneratedContent.content}</div>
    `;
    
    preview.innerHTML = html;
    
    // Show alternatives
    if (lastGeneratedContent.alternatives.length > 0) {
        alternatives.style.display = 'block';
        document.getElementById('alternatives-grid').innerHTML = lastGeneratedContent.alternatives.map(alt => `
            <div class="alternative-item" onclick="selectAlternative(${alt.id})">
                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Variation ${alt.id}</div>
                <div style="font-size: 13px;">${alt.content}</div>
            </div>
        `).join('');
    } else {
        alternatives.style.display = 'none';
    }
    
    actions.style.display = 'flex';
}

function selectAlternative(id) {
    document.querySelectorAll('.alternative-item').forEach(item => item.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    // Could swap main content with alternative
}

function copyResult() {
    if (!lastGeneratedContent) return;
    copyToClipboard(lastGeneratedContent.content);
}

function regenerate() {
    generateContent();
}

function saveToHub() {
    if (!lastGeneratedContent) return;
    
    const type = OmnichannelConfig.getContentType(lastGeneratedContent.contentType);
    
    DB.content.add({
        title: lastGeneratedContent.topic,
        contentType: lastGeneratedContent.contentType,
        platforms: lastGeneratedContent.platforms,
        caption: lastGeneratedContent.content,
        imageUrl: lastGeneratedContent.imageUrl || '',
        pillar: lastGeneratedContent.pillar,
        status: 'draft',
        scheduledDate: new Date().toISOString().split('T')[0]
    });
    
    showToast('Saved to Content Hub!', 'success');
    
    // Clear
    lastGeneratedContent = null;
    document.getElementById('result-preview').innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 100px 20px;">Result will appear here...</p>';
    document.getElementById('ai-alternatives').style.display = 'none';
    document.getElementById('result-actions').style.display = 'none';
}

// ==================== EXTERNAL AI INTEGRATIONS ====================
function openOpalWorkflow() {
    const type = OmnichannelConfig.getContentType(selectedContentType);
    const topic = document.getElementById('gen-topic').value || 'your topic';
    
    // Map content type to Opal workflow
    const workflowMap = {
        'text_article': 'seoArticle',
        'text_thread': 'viralThread',
        'image_carousel': 'carouselImages',
        'image_single': 'singleImage',
        'video_short': 'shortVideo',
        'video_long': 'youtubeVideo',
        'video_story': 'shortVideo'
    };
    
    const workflowId = workflowMap[selectedContentType] || 'completePackage';
    
    // If we have OpalWorkflowPrompts, use the modal
    if (typeof OpalWorkflowPrompts !== 'undefined' && OpalWorkflowPrompts[workflowId]) {
        openOpalWorkflowModal(workflowId);
        return;
    }
    
    // Fallback: Generate custom prompt based on topic
    const customPrompt = `Build an app that generates ${type?.name || 'content'} about: ${topic}

=== STEP 1: USER INPUT ===
- Topic: "${topic}"
- Content Type: ${type?.name || selectedContentType}

=== STEP 2: GENERATE CONTENT (Gemini 3 Pro) ===
Generate 10 variations of ${type?.name || 'content'} about the topic.

=== STEP 3: GENERATE IMAGES (Imagen 4) ===
Generate 10 image variations for the content.

=== STEP 4: OUTPUT ===
Display all variations with copy and download buttons.`;
    
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="modal-header">
            <h2>🔮 Google Opal Workflow</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <p style="margin-bottom: 16px; color: var(--text-secondary);">
            Copy prompt ini dan paste ke Google Opal untuk generate ${type?.name || 'content'}:
        </p>
        <div style="background: var(--bg-muted); padding: 16px; border-radius: var(--radius-md); font-family: monospace; font-size: 12px; max-height: 400px; overflow: auto; white-space: pre-wrap; line-height: 1.6;">
${customPrompt}
        </div>
        <div style="display: flex; gap: 12px; margin-top: 20px;">
            <button class="btn-primary" style="flex: 1; background: linear-gradient(135deg, #7c4dff, #536dfe);" onclick="copyToClipboard(\`${customPrompt.replace(/`/g, '\\`')}\`); showToast('Copied!', 'success');">
                📋 Copy Prompt
            </button>
            <button class="btn-secondary" onclick="window.open('https://opal.google/', '_blank')">
                🔮 Open Google Opal →
            </button>
        </div>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-light);">
            <p style="font-size: 12px; color: var(--text-muted);">
                💡 Tip: Untuk workflow yang lebih lengkap, kunjungi <a href="#" onclick="navigateTo('opal-hub'); closeModal();" style="color: #7c4dff;">Google Opal Hub</a>
            </p>
        </div>
    `;
    modal.classList.add('show');
}

function openN8NWorkflow() {
    const type = OmnichannelConfig.getContentType(selectedContentType);
    const topic = document.getElementById('gen-topic').value || 'your topic';
    
    // Generate n8n workflow JSON
    const n8nWorkflow = {
        name: `Content Generation: ${type?.name || 'Content'}`,
        nodes: [
            {
                parameters: {},
                id: "start",
                name: "Manual Trigger",
                type: "n8n-nodes-base.manualTrigger",
                typeVersion: 1,
                position: [250, 300]
            },
            {
                parameters: {
                    url: "https://text.pollinations.ai/",
                    sendBody: true,
                    specifyBody: "json",
                    jsonBody: JSON.stringify({
                        messages: [{
                            role: "user",
                            content: `Create ${type?.name || 'content'} about: ${topic}`
                        }]
                    })
                },
                id: "generateText",
                name: "Generate Text",
                type: "n8n-nodes-base.httpRequest",
                typeVersion: 4.1,
                position: [450, 300]
            },
            {
                parameters: {
                    url: `https://image.pollinations.ai/prompt/${encodeURIComponent(topic + ' professional image')}?width=1024&height=1024&nologo=true`
                },
                id: "generateImage",
                name: "Generate Image",
                type: "n8n-nodes-base.httpRequest",
                typeVersion: 4.1,
                position: [650, 300]
            }
        ],
        connections: {
            "Manual Trigger": { main: [[{ node: "Generate Text", type: "main", index: 0 }]] },
            "Generate Text": { main: [[{ node: "Generate Image", type: "main", index: 0 }]] }
        },
        settings: { executionOrder: "v1" }
    };
    
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="modal-header">
            <h2>⚙️ n8n Automation Workflow</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <p style="margin-bottom: 16px; color: var(--text-secondary);">
            Import workflow JSON ini ke n8n untuk automation:
        </p>
        <div style="background: var(--bg-muted); padding: 16px; border-radius: var(--radius-md); font-family: monospace; font-size: 11px; max-height: 350px; overflow: auto;">
            <pre>${JSON.stringify(n8nWorkflow, null, 2)}</pre>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 20px;">
            <button class="btn-primary" style="flex: 1; background: linear-gradient(135deg, #ff6d00, #ff9100);" onclick="copyToClipboard(JSON.stringify(${JSON.stringify(n8nWorkflow).replace(/"/g, '\\"')})); showToast('Copied!', 'success');">
                📋 Copy Workflow JSON
            </button>
            <button class="btn-secondary" onclick="window.open('https://n8n.io', '_blank')">
                ⚙️ Open n8n →
            </button>
        </div>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-light);">
            <p style="font-size: 12px; color: var(--text-muted);">
                💡 Untuk workflow yang lebih lengkap, download dari <a href="#" onclick="navigateTo('opal-hub'); closeModal();" style="color: #ff6d00;">Google Opal Hub</a>
            </p>
        </div>
    `;
    modal.classList.add('show');
}


// ==================== AUTO GENERATE MONTHLY ====================
async function autoGenerateMonthlyContent() {
    const project = DB.projects.getActive();
    if (!project) {
        showToast('Please select a project first', 'warning');
        return;
    }
    
    const pillars = DB.knowledgeBase.getPillars();
    if (pillars.length === 0) {
        showToast('Please add content pillars first', 'warning');
        navigateTo('knowledge-base');
        return;
    }
    
    showLoading('Generating monthly content plan...');
    
    try {
        const posts = await ContentGenerator.generateMonthlyPlan(
            new Date().getFullYear(),
            new Date().getMonth()
        );
        
        if (posts.length > 0) {
            DB.content.addBulk(posts);
            hideLoading();
            showToast(`${posts.length} content items generated!`, 'success');
            loadDashboard();
            navigateTo('content-hub');
        } else {
            hideLoading();
            showToast('No content generated', 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Generation error:', error);
        showToast('Failed to generate content', 'error');
    }
}

// ==================== CONTENT CRUD ====================
function openContentEditor(contentId = null) {
    const content = contentId ? DB.content.getById(contentId) : null;
    const pillars = DB.knowledgeBase.getPillars();
    const contentTypes = OmnichannelConfig.getAllContentTypes();
    
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
                <label>Content Type</label>
                <select id="edit-content-type">
                    ${contentTypes.map(t => `<option value="${t.id}" ${content?.contentType === t.id ? 'selected' : ''}>${t.icon} ${t.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Status</label>
                <select id="edit-status">
                    ${['idea', 'draft', 'review', 'scheduled', 'published'].map(s => 
                        `<option value="${s}" ${content?.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Scheduled Date</label>
                <input type="date" id="edit-date" value="${content?.scheduledDate || ''}">
            </div>
            <div class="form-group">
                <label>Pillar</label>
                <select id="edit-pillar">
                    <option value="">Select pillar...</option>
                    ${pillars.map(p => `<option value="${p}" ${content?.pillar === p ? 'selected' : ''}>${p}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>Caption / Content</label>
            <textarea id="edit-caption" rows="6" placeholder="Write your content...">${content?.caption || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Image URL</label>
            <input type="text" id="edit-image" value="${content?.imageUrl || ''}" placeholder="https://...">
        </div>
        <div style="display: flex; gap: 12px;">
            <button class="btn-primary" style="flex: 1;" onclick="saveContent('${contentId || ''}')">${content ? 'Save' : 'Create'}</button>
            ${content ? `<button class="btn-danger" onclick="deleteContent('${contentId}'); closeModal();">Delete</button>` : ''}
        </div>
    `;
    modal.classList.add('show');
}

function saveContent(contentId) {
    const data = {
        title: document.getElementById('edit-title').value,
        contentType: document.getElementById('edit-content-type').value,
        status: document.getElementById('edit-status').value,
        scheduledDate: document.getElementById('edit-date').value,
        pillar: document.getElementById('edit-pillar').value,
        caption: document.getElementById('edit-caption').value,
        imageUrl: document.getElementById('edit-image').value,
        platforms: OmnichannelConfig.getContentType(document.getElementById('edit-content-type').value)?.platforms || []
    };
    
    if (contentId) {
        DB.content.update(contentId, data);
        showToast('Content updated!', 'success');
    } else {
        DB.content.add(data);
        showToast('Content created!', 'success');
    }
    
    closeModal();
    switchView(currentView);
}

function deleteContent(contentId) {
    if (confirm('Delete this content?')) {
        DB.content.delete(contentId);
        showToast('Content deleted', 'success');
        switchView(currentView);
    }
}

function openContentDetail(contentId) {
    const content = DB.content.getById(contentId);
    if (!content) return;
    
    const type = OmnichannelConfig.getContentType(content.contentType);
    const platforms = OmnichannelConfig.getPlatformsForType(content.contentType);
    
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${content.title || 'Untitled'}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
            <span class="content-type-badge ${content.contentType?.replace('_', '-')}">${type?.icon} ${type?.name}</span>
            <span class="status-badge ${content.status}">${content.status}</span>
            ${content.scheduledDate ? `<span style="color: var(--text-secondary);">📅 ${content.scheduledDate}</span>` : ''}
        </div>
        ${content.imageUrl ? `<img src="${content.imageUrl}" style="max-width: 100%; border-radius: var(--radius-md); margin-bottom: 16px;">` : ''}
        <div style="background: var(--bg-muted); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px; white-space: pre-wrap;">
            ${content.caption || 'No content yet'}
        </div>
        <div style="margin-bottom: 16px;">
            <strong style="font-size: 12px; color: var(--text-secondary);">PLATFORMS</strong>
            <div class="platform-tags" style="margin-top: 8px;">
                ${platforms.map(p => `<span class="platform-tag active">${p.icon} ${p.name}</span>`).join('')}
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            <button class="btn-secondary" onclick="copyToClipboard(\`${content.caption?.replace(/`/g, "'") || ''}\`); showToast('Copied!', 'success');">📋 Copy</button>
            <button class="btn-secondary" onclick="closeModal(); openContentEditor('${contentId}')">✏️ Edit</button>
            <button class="btn-primary" onclick="closeModal(); triggerAIForContent('${contentId}')">⚡ Regenerate</button>
        </div>
    `;
    modal.classList.add('show');
}

function triggerAIForContent(contentId) {
    const content = DB.content.getById(contentId);
    if (!content) return;
    
    navigateTo('generator');
    setTimeout(() => {
        document.getElementById('gen-topic').value = content.title || '';
        selectContentType(content.contentType || 'video_short');
    }, 100);
}

function openDayDetail(dateStr) {
    const contents = DB.content.getByDate(dateStr);
    const date = new Date(dateStr);
    
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <button class="btn-primary" style="margin-bottom: 16px;" onclick="closeModal(); openContentEditor()">+ Add Content</button>
        ${contents.length === 0 ? '<p style="color: var(--text-muted); text-align: center;">No content scheduled</p>' :
            contents.map(c => {
                const type = OmnichannelConfig.getContentType(c.contentType);
                return `
                    <div style="padding: 12px; background: var(--bg-muted); border-radius: var(--radius-sm); margin-bottom: 8px; cursor: pointer;" onclick="closeModal(); openContentDetail('${c.id}')">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 20px;">${type?.icon || '📄'}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 500;">${c.title || 'Untitled'}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">${type?.name || ''}</div>
                            </div>
                            <span class="status-badge ${c.status}">${c.status}</span>
                        </div>
                    </div>
                `;
            }).join('')
        }
    `;
    modal.classList.add('show');
}

// ==================== KNOWLEDGE BASE ====================
function loadKnowledgeBase() {
    const kb = DB.knowledgeBase.get();
    
    if (kb.guidelines) {
        document.getElementById('kb-brand-voice').value = kb.guidelines.brandVoice || '';
        document.getElementById('kb-key-messages').value = kb.guidelines.keyMessages || '';
    }
    
    renderPillars();
    renderKBNotes();
}

function saveGuidelines() {
    DB.knowledgeBase.updateGuidelines({
        brandVoice: document.getElementById('kb-brand-voice').value,
        keyMessages: document.getElementById('kb-key-messages').value
    });
    showToast('Guidelines saved!', 'success');
}

function addPillar() {
    const input = document.getElementById('new-pillar-input');
    const pillar = input.value.trim();
    if (!pillar) return;
    
    DB.knowledgeBase.addPillar(pillar);
    input.value = '';
    renderPillars();
    showToast('Pillar added!', 'success');
}

function renderPillars() {
    const pillars = DB.knowledgeBase.getPillars();
    const container = document.getElementById('pillars-list');
    const genSelect = document.getElementById('gen-pillar');
    
    if (container) {
        container.innerHTML = pillars.map(p => `
            <span class="pillar-tag">
                ${p}
                <button onclick="removePillar('${p}')">&times;</button>
            </span>
        `).join('') || '<p style="color: var(--text-muted);">No pillars added</p>';
    }
    
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

function addKBNote() {
    const text = document.getElementById('kb-note-text').value.trim();
    if (!text) return;
    
    DB.knowledgeBase.addNote({ category: 'general', content: text });
    document.getElementById('kb-note-text').value = '';
    renderKBNotes();
    showToast('Note added!', 'success');
}

function renderKBNotes() {
    const notes = DB.knowledgeBase.getNotes();
    const container = document.getElementById('kb-notes-list');
    if (!container) return;
    
    container.innerHTML = notes.map(n => `
        <div style="padding: 10px; background: var(--bg-muted); border-radius: var(--radius-sm); margin-bottom: 8px; display: flex; justify-content: space-between;">
            <span style="font-size: 13px;">${n.content}</span>
            <button onclick="removeKBNote('${n.id}')" style="background: none; border: none; color: var(--danger); cursor: pointer;">&times;</button>
        </div>
    `).join('') || '<p style="color: var(--text-muted);">No notes</p>';
}

function removeKBNote(noteId) {
    DB.knowledgeBase.removeNote(noteId);
    renderKBNotes();
}

// ==================== CALENDAR ====================
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
        html += '<div class="calendar-day" style="opacity: 0.3;"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const contents = DB.content.getByDate(dateStr);
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}" onclick="openDayDetail('${dateStr}')">
                <div class="calendar-day-number">${day}</div>
                <div class="calendar-day-content">
                    ${contents.slice(0, 3).map(c => {
                        const type = OmnichannelConfig.getContentType(c.contentType);
                        return `<div class="calendar-item" style="background: ${type?.color || 'var(--primary)'}; color: white;">${type?.icon || ''}</div>`;
                    }).join('')}
                    ${contents.length > 3 ? `<div style="font-size: 10px; color: var(--text-muted);">+${contents.length - 3}</div>` : ''}
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

function exportCalendar() {
    const contents = DB.content.getAll().filter(c => c.scheduledDate);
    const csv = 'Date,Title,Type,Status,Caption\n' + 
        contents.map(c => `"${c.scheduledDate}","${c.title}","${c.contentType}","${c.status}","${c.caption?.replace(/"/g, '""') || ''}"`).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, `calendar_${Date.now()}.csv`);
    showToast('Calendar exported!', 'success');
}

// ==================== SETTINGS ====================
function loadSettings() {
    const project = DB.projects.getActive();
    if (project) {
        document.getElementById('setting-project-name').value = project.name || '';
        document.getElementById('setting-brand-name').value = project.brandName || '';
        document.getElementById('setting-niche').value = project.niche || 'business';
    }
}

function saveProjectSettings() {
    const project = DB.projects.getActive();
    if (!project) return;
    
    DB.projects.update(project.id, {
        name: document.getElementById('setting-project-name').value,
        brandName: document.getElementById('setting-brand-name').value,
        niche: document.getElementById('setting-niche').value
    });
    
    loadProjects();
    loadActiveProject();
    showToast('Settings saved!', 'success');
}

function deleteProject() {
    const project = DB.projects.getActive();
    if (!project) return;
    
    if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
        DB.projects.delete(project.id);
        loadProjects();
        loadActiveProject();
        showToast('Project deleted', 'success');
    }
}

function exportProjectData() {
    const data = DB.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `project_backup_${Date.now()}.json`);
    showToast('Project exported!', 'success');
}

function importProjectData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                DB.importAll(data);
                loadProjects();
                loadActiveProject();
                showToast('Project imported!', 'success');
            } catch (err) {
                showToast('Invalid file', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// ==================== BULK CREATE ====================
function loadBulkCreate() {
    if (typeof BulkCreate !== 'undefined' && !BulkCreate.canvas) {
        setTimeout(() => BulkCreate.init(), 100);
    }
}

// ==================== UTILITIES ====================
function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

function showLoading(text = 'Loading...') {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading').classList.add('show');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('show');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    });
}

function openSettings() {
    navigateTo('settings');
}


// ==================== GOOGLE OPAL HUB ====================

// Opal Workflow Prompts
const OpalWorkflowPrompts = {
    seoArticle: {
        name: 'SEO Article Generator',
        icon: '📄',
        prompt: `Build an app that generates SEO-optimized articles with 10 different variations.

=== STEP 1: USER INPUT ===
Add "User Input" component with these fields:
- Text input: "topic" (label: "Article Topic")
- Text input: "keywords" (label: "Target Keywords (comma separated)")
- Dropdown: "tone" with options: Professional, Casual, Educational, Inspirational, Humorous
- Dropdown: "length" with options: Short (800 words), Medium (1500 words), Long (2500 words)

=== STEP 2: RESEARCH (Gemini 2.5 Pro) ===
Add "Generate" component
Model: Gemini 2.5 Pro
Enable: @Web Search tool
Prompt: "Research @topic thoroughly. Find top 10 questions, key statistics, competitor analysis, trending angles."

=== STEP 3: GENERATE MAIN ARTICLE (Gemini 3 Pro) ===
Add "Generate" component
Model: Gemini 3 Pro
Prompt: "Create comprehensive SEO article with title, meta description, H2 sections, FAQ."

=== STEP 4: GENERATE 10 VARIATIONS (Gemini 2.5 Flash) ===
Add "Generate" component
Model: Gemini 2.5 Flash
Prompt: "Create 10 different versions: Listicle, How-to, Case Study, Story, Expert Roundup, Comparison, Beginner Guide, Advanced, News, Controversial."

=== STEP 5: OUTPUT ===
Display all variations with copy buttons.`
    },

    viralThread: {
        name: 'Viral Thread Generator',
        icon: '🐦',
        prompt: `Build an app that generates viral Twitter/X threads with 10 different hook variations.

=== STEP 1: USER INPUT ===
- Text input: "topic"
- Dropdown: "thread_style": Educational, Story, Listicle, Controversial
- Number input: "tweet_count" (5-20, default: 10)

=== STEP 2: RESEARCH (Gemini 2.5 Pro + Web Search) ===
Research viral patterns, hooks, hashtags for this topic.

=== STEP 3: GENERATE 10 HOOKS (Gemini 3 Pro) ===
Create 10 different hooks: Shocking stat, Bold claim, Personal story, Question, Contrarian, Curiosity gap, Social proof, Urgency, Promise, Pattern interrupt.

=== STEP 4: GENERATE 10 THREADS (Gemini 2.5 Flash) ===
Complete thread for each hook, under 280 chars per tweet.

=== STEP 5: OUTPUT ===
Display all threads with copy buttons and character counts.`
    },

    instagramCaption: {
        name: 'Instagram Caption Generator',
        icon: '📸',
        prompt: `Build an app that generates 10 Instagram caption variations.

=== STEP 1: USER INPUT ===
- Text input: "topic"
- Dropdown: "mood": Inspirational, Educational, Entertaining, Behind-the-scenes
- Checkbox: "include_hashtags" (default: true)

=== STEP 2: GENERATE 10 CAPTIONS (Gemini 2.5 Flash) ===
Create 10 variations: Question hook, Story hook, Stat hook, Controversial, Listicle, BTS, Educational, Inspirational, Problem-solution, Trend-based.

Each with: Hook line, value points, CTA, 25 hashtags.

=== STEP 3: OUTPUT ===
Display all captions with copy buttons.`
    },

    carouselImages: {
        name: 'Carousel Image Generator',
        icon: '🎨',
        prompt: `Build an app that generates carousel posts with 10 slides and 3 style variations.

=== STEP 1: USER INPUT ===
- Text input: "topic"
- Dropdown: "slide_count": 5, 7, 10
- Dropdown: "style": Minimalist, Bold, Professional, Aesthetic, Dark Mode
- Color picker: "primary_color"
- Color picker: "secondary_color"

=== STEP 2: GENERATE SLIDE CONTENT (Gemini 2.5 Pro) ===
Create headline, subtext, visual description for each slide.

=== STEP 3: GENERATE STYLE A - PHOTO-REALISTIC (Imagen 4) ===
Generate 10 photo-realistic images.

=== STEP 4: GENERATE STYLE B - ILLUSTRATED (Gemini 3 Pro Image) ===
Generate 10 illustrated/vector style images.

=== STEP 5: GENERATE STYLE C - ABSTRACT (Gemini 2.5 Flash Image) ===
Generate 10 abstract/artistic images.

=== STEP 6: GENERATE CAPTION (Gemini 2.5 Flash) ===
Create caption with hashtags.

=== STEP 7: OUTPUT ===
Display all 30 images (10 x 3 styles) with download options.`
    },

    singleImage: {
        name: 'Single Image Generator',
        icon: '🖼️',
        prompt: `Build an app that generates 10 unique image variations.

=== STEP 1: USER INPUT ===
- Text area: "concept"
- Dropdown: "platform": Instagram, Facebook, LinkedIn, Twitter
- Dropdown: "mood": Professional, Playful, Inspirational, Minimalist, Bold

=== STEP 2: CREATE 10 PROMPTS (Gemini 2.5 Pro) ===
Create 10 detailed prompts: Minimalist, Bold, Soft, Corporate, Lifestyle, Abstract, Vintage, Futuristic, Nature, Luxury.

=== STEP 3: GENERATE 5 IMAGES (Imagen 4) ===
Use prompts 1-5.

=== STEP 4: GENERATE 5 IMAGES (Gemini 3 Pro Image) ===
Use prompts 6-10.

=== STEP 5: OUTPUT ===
Display all 10 images with download options.`
    },

    shortVideo: {
        name: 'Short Video Generator',
        icon: '📱',
        prompt: `Build an app that generates short-form videos with 10 script variations.

=== STEP 1: USER INPUT ===
- Text area: "concept"
- Dropdown: "duration": 15s, 30s, 60s
- Dropdown: "platform": TikTok, Reels, Shorts
- Dropdown: "style": Talking Head, B-Roll, Text on Screen, Tutorial

=== STEP 2: RESEARCH (Gemini 2.5 Pro + Web Search) ===
Research viral patterns for this content type.

=== STEP 3: GENERATE 10 SCRIPTS (Gemini 3 Pro) ===
Create 10 scripts with different hooks: Shock, Question, Story, Trend, Educational, BTS, Transformation, POV, Duet, Controversial.

=== STEP 4: GENERATE VIDEO CLIPS (Veo) ===
Generate main angle clips for each script.

=== STEP 5: GENERATE ALTERNATIVE ANGLES (Veo) ===
Generate 2-3 alternative angles for key scenes.

=== STEP 6: GENERATE MUSIC (Lyria 2) ===
Create 10 background music tracks.

=== STEP 7: GENERATE VOICEOVER (AudioLM) ===
Create voiceover for each script.

=== STEP 8: OUTPUT ===
Display all videos with download options.`
    },

    youtubeVideo: {
        name: 'YouTube Video Generator',
        icon: '📺',
        prompt: `Build an app that generates complete YouTube video packages.

=== STEP 1: USER INPUT ===
- Text area: "topic"
- Dropdown: "video_type": Tutorial, Vlog, Review, Documentary, List Video
- Number input: "duration_minutes" (5-30)

=== STEP 2: DEEP RESEARCH (Gemini 2.5 Pro + Deep Research) ===
Research keywords, competitors, content gaps.

=== STEP 3: GENERATE OUTLINE (Gemini 3 Pro) ===
Create 10 title options, 5 thumbnail concepts, detailed outline with timestamps.

=== STEP 4: GENERATE FULL SCRIPT (Gemini 3 Pro) ===
Write complete script with visual cues.

=== STEP 5: GENERATE THUMBNAILS (Imagen 4) ===
Create 5 thumbnail options.

=== STEP 6: GENERATE B-ROLL (Veo) ===
Create 15-20 B-roll clips.

=== STEP 7: GENERATE MUSIC (Lyria 2) ===
Create intro, background, and emotional tracks.

=== STEP 8: OUTPUT ===
Display complete package with download options.`
    },

    podcast: {
        name: 'Podcast Episode Generator',
        icon: '🎙️',
        prompt: `Build an app that generates complete podcast episodes.

=== STEP 1: USER INPUT ===
- Text input: "podcast_name"
- Text input: "episode_topic"
- Dropdown: "episode_type": Solo, Interview, Panel, Storytelling
- Number input: "duration_minutes" (10-60)

=== STEP 2: RESEARCH & OUTLINE (Gemini 2.5 Pro) ===
Create episode outline with segments.

=== STEP 3: GENERATE FULL SCRIPT (Gemini 3 Pro) ===
Write complete script with natural conversation flow.

=== STEP 4: GENERATE INTRO MUSIC (Lyria 2) ===
Create 15-second intro music.

=== STEP 5: GENERATE OUTRO MUSIC (Lyria 2) ===
Create 20-second outro music.

=== STEP 6: GENERATE TRANSITIONS (Lyria 2) ===
Create 5 transition sounds.

=== STEP 7: OUTPUT ===
Display script and audio files with download options.`
    },

    completePackage: {
        name: 'Complete Content Package',
        icon: '✨',
        prompt: `Build an app that generates a complete content package: articles, images, and videos from one topic.

=== STEP 1: USER INPUT ===
- Text input: "main_topic"
- Text area: "brand_context"
- Dropdown: "content_goal": Awareness, Engagement, Conversion, Education
- Color picker: "brand_color_1"
- Color picker: "brand_color_2"
- Checkbox array: "platforms": Instagram, TikTok, YouTube, LinkedIn, Twitter, Facebook, Blog
- Dropdown: "output_quantity": Standard (5 each), Pro (10 each), Enterprise (20 each)

=== STEP 2: CONTENT STRATEGY (Gemini 2.5 Pro + Deep Research) ===
Create content pillars, 30-day calendar, audience personas, competitor analysis, hashtag strategy.

=== STEP 3: GENERATE ALL TEXT CONTENT (Gemini 3 Pro) ===
For each platform: articles, posts, threads, captions, scripts.

=== STEP 4: GENERATE IMAGE PROMPTS (Gemini 2.5 Pro) ===
Create detailed prompts for each platform with 3 style variations.

=== STEP 5: GENERATE IMAGES - STYLE A (Imagen 4) ===
Photo-realistic images.

=== STEP 6: GENERATE IMAGES - STYLE B (Gemini 3 Pro Image) ===
Illustrated images.

=== STEP 7: GENERATE IMAGES - STYLE C (Gemini 2.5 Flash Image) ===
Abstract images.

=== STEP 8: GENERATE VIDEO SCRIPTS (Gemini 3 Pro) ===
Scripts for TikTok/Reels/Shorts and YouTube.

=== STEP 9: GENERATE VIDEO CLIPS (Veo) ===
Video clips with multiple angles.

=== STEP 10: GENERATE BACKGROUND MUSIC (Lyria 2) ===
Music tracks for videos.

=== STEP 11: GENERATE VOICEOVERS (AudioLM) ===
Voiceovers for video scripts.

=== STEP 12: OUTPUT ===
Dashboard with tabs: Strategy, Text, Images, Videos, Audio, Download All.`
    }
};

// Open Opal Workflow Modal
function openOpalWorkflowModal(workflowId) {
    const workflow = OpalWorkflowPrompts[workflowId];
    if (!workflow) return;

    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <div class="modal-header">
            <h2>${workflow.icon} ${workflow.name}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <p style="margin-bottom: 16px; color: var(--text-secondary);">
            Copy prompt ini dan paste ke Google Opal untuk membuat workflow:
        </p>
        <div style="background: var(--bg-muted); padding: 16px; border-radius: var(--radius-md); font-family: monospace; font-size: 12px; max-height: 400px; overflow: auto; white-space: pre-wrap; line-height: 1.6;">
${workflow.prompt}
        </div>
        <div style="display: flex; gap: 12px; margin-top: 20px;">
            <button class="btn-primary" style="flex: 1; background: linear-gradient(135deg, #7c4dff, #536dfe);" onclick="copyOpalPrompt('${workflowId}')">
                📋 Copy Prompt
            </button>
            <button class="btn-secondary" onclick="window.open('https://opal.google/', '_blank')">
                🔮 Open Google Opal →
            </button>
        </div>
    `;

    modal.classList.add('show');
}

// Copy Opal Prompt
function copyOpalPrompt(workflowId) {
    const workflow = OpalWorkflowPrompts[workflowId];
    if (!workflow) return;

    navigator.clipboard.writeText(workflow.prompt).then(() => {
        showToast('Prompt copied! Paste it in Google Opal.', 'success');
    });
}

// Download n8n Workflow
function downloadN8NWorkflow(workflowType) {
    const workflowMap = {
        contentPipeline: 'contentGeneration',
        bulkGeneration: 'bulkContent',
        multiAI: 'multiAIGeneration',
        scheduledPosting: 'scheduledPosting'
    };

    const n8nWorkflowType = workflowMap[workflowType];
    
    // Try to use N8NWorkflows module if available
    if (typeof N8NWorkflows !== 'undefined' && N8NWorkflows[n8nWorkflowType]) {
        N8NWorkflows.downloadWorkflow(n8nWorkflowType);
        showToast('Workflow downloaded!', 'success');
        return;
    }

    // Fallback: show modal with instructions
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    const workflowNames = {
        contentPipeline: 'Content Generation Pipeline',
        bulkGeneration: 'Bulk Content from Spreadsheet',
        multiAI: 'Multi-AI Comparison',
        scheduledPosting: 'Scheduled Social Posting'
    };
    
    content.innerHTML = `
        <div class="modal-header">
            <h2>⚙️ ${workflowNames[workflowType]}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <p style="margin-bottom: 16px; color: var(--text-secondary);">
            Download workflow JSON dari folder <code>google opal/n8n-workflows/</code> dan import ke n8n.
        </p>
        <div style="background: var(--bg-muted); padding: 16px; border-radius: var(--radius-md);">
            <p style="font-size: 13px; margin-bottom: 12px;"><strong>Cara Import ke n8n:</strong></p>
            <ol style="font-size: 13px; padding-left: 20px; line-height: 1.8;">
                <li>Buka n8n instance kamu</li>
                <li>Klik "Import from File" atau "Import from URL"</li>
                <li>Pilih file JSON workflow</li>
                <li>Ganti <code>YOUR_GOOGLE_SHEET_ID</code> dengan Sheet ID kamu</li>
                <li>Setup credentials yang diperlukan</li>
                <li>Aktifkan workflow</li>
            </ol>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 20px;">
            <button class="btn-secondary" style="flex: 1;" onclick="window.open('https://n8n.io', '_blank')">
                ⚙️ Open n8n
            </button>
        </div>
    `;
    modal.classList.add('show');
}

// Add Opal Link
function addOpalLink() {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <div class="modal-header">
            <h2>🔗 Add Opal Workflow Link</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="form-group">
            <label>Workflow Name</label>
            <input type="text" id="opal-link-name" placeholder="e.g., My Article Generator">
        </div>
        <div class="form-group">
            <label>Opal URL</label>
            <input type="text" id="opal-link-url" placeholder="https://opal.google/?flow=...">
        </div>
        <div class="form-group">
            <label>Category</label>
            <select id="opal-link-category">
                <option value="text">📝 Text</option>
                <option value="image">🖼️ Image</option>
                <option value="video">🎬 Video</option>
                <option value="audio">🎵 Audio</option>
                <option value="other">📦 Other</option>
            </select>
        </div>
        <button class="btn-primary btn-full" onclick="saveOpalLink()">Save Link</button>
    `;

    modal.classList.add('show');
}

// Save Opal Link
function saveOpalLink() {
    const name = document.getElementById('opal-link-name').value;
    const url = document.getElementById('opal-link-url').value;
    const category = document.getElementById('opal-link-category').value;

    if (!name || !url) {
        showToast('Please fill all fields', 'warning');
        return;
    }

    // Get existing links
    let links = JSON.parse(localStorage.getItem('opal-links') || '[]');
    
    // Add new link
    links.push({
        id: Date.now(),
        name,
        url,
        category,
        createdAt: new Date().toISOString()
    });

    // Save
    localStorage.setItem('opal-links', JSON.stringify(links));

    closeModal();
    renderOpalLinks();
    showToast('Link saved!', 'success');
}

// Render Opal Links
function renderOpalLinks() {
    const container = document.getElementById('opal-links-grid');
    if (!container) return;

    const links = JSON.parse(localStorage.getItem('opal-links') || '[]');

    if (links.length === 0) {
        container.innerHTML = `
            <div class="opal-link-placeholder">
                <p>Belum ada Opal workflow yang disimpan.</p>
                <p>Setelah membuat workflow di Google Opal, simpan link-nya di sini untuk akses cepat.</p>
            </div>
        `;
        return;
    }

    const categoryIcons = {
        text: '📝',
        image: '🖼️',
        video: '🎬',
        audio: '🎵',
        other: '📦'
    };

    container.innerHTML = links.map(link => `
        <div class="opal-link-card" onclick="window.open('${link.url}', '_blank')">
            <div class="link-icon">${categoryIcons[link.category] || '🔮'}</div>
            <div class="link-info">
                <h4>${link.name}</h4>
                <p>${link.category}</p>
            </div>
            <div class="link-actions" onclick="event.stopPropagation()">
                <button onclick="copyToClipboard('${link.url}')" title="Copy URL">📋</button>
                <button onclick="deleteOpalLink(${link.id})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Delete Opal Link
function deleteOpalLink(linkId) {
    if (!confirm('Delete this link?')) return;

    let links = JSON.parse(localStorage.getItem('opal-links') || '[]');
    links = links.filter(l => l.id !== linkId);
    localStorage.setItem('opal-links', JSON.stringify(links));

    renderOpalLinks();
    showToast('Link deleted', 'success');
}

// Load Opal Hub
function loadOpalHub() {
    renderOpalLinks();
}

// Update navigateTo to include opal-hub
const originalNavigateTo = navigateTo;
navigateTo = function(sectionId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionId);
    });
    document.querySelectorAll('.section').forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });
    
    // Load section data
    switch(sectionId) {
        case 'dashboard': loadDashboard(); break;
        case 'content-hub': loadContentHub(); break;
        case 'knowledge-base': loadKnowledgeBase(); break;
        case 'calendar': loadFullCalendar(); break;
        case 'settings': loadSettings(); break;
        case 'generator': loadGenerator(); break;
        case 'bulk-create': loadBulkCreate(); break;
        case 'opal-hub': loadOpalHub(); break;
    }
};


// ==================== AI INSIGHTS ====================
function refreshInsights() {
    if (typeof showToast !== 'undefined') {
        showToast('Refreshing AI insights...', 'info');
    }
    // Simulate refresh
    setTimeout(() => {
        if (typeof showToast !== 'undefined') {
            showToast('AI insights updated!', 'success');
        }
    }, 1000);
}

// Make function globally available
window.refreshInsights = refreshInsights;
