// ==================== CONTENT HUB V2 ====================
// Ultra Advanced Content Management System
// Version 6.0 - December 2025
// Features: Full View, Inline Editing, Drag & Drop, Dynamic Forms

const ContentHubV2 = {
    // State Management
    state: {
        contents: [],
        filteredContents: [],
        currentView: 'full',
        currentFilter: 'all',
        searchQuery: '',
        selectedItems: [],
        sortBy: 'createdAt',
        sortOrder: 'desc',
        editingCell: null,
        draggedItem: null,
        calendarMonth: new Date().getMonth(),
        calendarYear: new Date().getFullYear()
    },

    // Content Categories with specific fields
    contentCategories: {
        text_article: {
            name: 'Article',
            icon: '📝',
            fields: ['title', 'content', 'excerpt', 'seoTitle', 'seoDescription', 'keywords', 'wordCount', 'readTime']
        },
        text_thread: {
            name: 'Thread',
            icon: '🐦',
            fields: ['title', 'tweets', 'hookTweet', 'ctaTweet', 'threadLength']
        },
        video_short: {
            name: 'Short Video',
            icon: '📱',
            fields: ['title', 'script', 'hook', 'duration', 'aspectRatio', 'musicSuggestion', 'transitions', 'captions']
        },
        video_long: {
            name: 'Long Video',
            icon: '🎬',
            fields: ['title', 'script', 'outline', 'intro', 'chapters', 'outro', 'duration', 'thumbnailIdea', 'bRoll']
        },
        video_story: {
            name: 'Story',
            icon: '⏱️',
            fields: ['title', 'slides', 'duration', 'stickers', 'polls', 'questions', 'links']
        },
        image_carousel: {
            name: 'Carousel',
            icon: '🎨',
            fields: ['title', 'slides', 'coverSlide', 'ctaSlide', 'slideCount', 'designStyle']
        },
        image_single: {
            name: 'Single Image',
            icon: '🖼️',
            fields: ['title', 'imagePrompt', 'caption', 'altText', 'dimensions']
        },
        audio_podcast: {
            name: 'Podcast',
            icon: '🎙️',
            fields: ['title', 'script', 'outline', 'intro', 'segments', 'outro', 'duration', 'showNotes']
        },
        email_newsletter: {
            name: 'Newsletter',
            icon: '📧',
            fields: ['title', 'subject', 'preheader', 'body', 'cta', 'segments']
        }
    },

    // Platform configurations
    platforms: {
        instagram: { name: 'Instagram', icon: '📸', color: '#E4405F' },
        tiktok: { name: 'TikTok', icon: '🎵', color: '#000000' },
        twitter: { name: 'Twitter/X', icon: '🐦', color: '#1DA1F2' },
        linkedin: { name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
        youtube: { name: 'YouTube', icon: '🎬', color: '#FF0000' },
        facebook: { name: 'Facebook', icon: '📘', color: '#1877F2' },
        threads: { name: 'Threads', icon: '🧵', color: '#000000' },
        pinterest: { name: 'Pinterest', icon: '📌', color: '#E60023' },
        blog: { name: 'Blog', icon: '📰', color: '#FF6B6B' }
    },

    // Status configurations
    statuses: {
        idea: { name: 'Idea', icon: '💡', color: '#F59E0B' },
        draft: { name: 'Draft', icon: '📝', color: '#6B7280' },
        review: { name: 'Review', icon: '👀', color: '#8B5CF6' },
        approved: { name: 'Approved', icon: '✓', color: '#10B981' },
        scheduled: { name: 'Scheduled', icon: '📅', color: '#3B82F6' },
        published: { name: 'Published', icon: '✅', color: '#059669' },
        archived: { name: 'Archived', icon: '📦', color: '#9CA3AF' }
    },

    // Initialize
    init() {
        this.loadContents();
        this.setupEventListeners();
        this.render();
        console.log('📋 Content Hub V2 initialized with Full View & Inline Editing');
        return this;
    },

    // Load Contents from localStorage
    loadContents() {
        this.state.contents = JSON.parse(localStorage.getItem('raycorp-contents') || '[]');
        this.applyFilters();
    },

    // Save Contents to localStorage
    saveContents() {
        localStorage.setItem('raycorp-contents', JSON.stringify(this.state.contents));
        this.updateStats();
    },

    // Setup Event Listeners
    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.editingCell) {
                this.cancelInlineEdit();
            }
            if (e.key === 'Enter' && !e.shiftKey && this.state.editingCell) {
                this.saveInlineEdit();
            }
        });

        // Click outside to save inline edit
        document.addEventListener('click', (e) => {
            if (this.state.editingCell && !e.target.closest('.inline-edit-cell')) {
                this.saveInlineEdit();
            }
        });
    },

    // Apply Filters
    applyFilters() {
        let filtered = [...this.state.contents];

        // Filter by status
        if (this.state.currentFilter !== 'all') {
            filtered = filtered.filter(c => c.status === this.state.currentFilter);
        }

        // Filter by search
        if (this.state.searchQuery) {
            const query = this.state.searchQuery.toLowerCase();
            filtered = filtered.filter(c => 
                c.title?.toLowerCase().includes(query) ||
                c.content?.toLowerCase().includes(query) ||
                c.caption?.toLowerCase().includes(query) ||
                c.hashtags?.some(h => h.toLowerCase().includes(query))
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal = a[this.state.sortBy];
            let bVal = b[this.state.sortBy];
            
            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();
            
            if (aVal < bVal) return this.state.sortOrder === 'desc' ? 1 : -1;
            if (aVal > bVal) return this.state.sortOrder === 'desc' ? -1 : 1;
            return 0;
        });

        this.state.filteredContents = filtered;
    },

    // Update Stats
    updateStats() {
        const stats = {
            total: this.state.contents.length,
            idea: this.state.contents.filter(c => c.status === 'idea').length,
            draft: this.state.contents.filter(c => c.status === 'draft').length,
            review: this.state.contents.filter(c => c.status === 'review').length,
            scheduled: this.state.contents.filter(c => c.status === 'scheduled').length,
            published: this.state.contents.filter(c => c.status === 'published').length
        };

        // Update dashboard stats
        ['total', 'draft', 'scheduled', 'published'].forEach(key => {
            const el = document.getElementById(`stat-${key}`);
            if (el) el.textContent = stats[key] || stats.total;
        });
    },

    // Main Render
    render() {
        this.applyFilters();
        this.renderCurrentView();
        this.updateRowCount();
        this.updateStats();
    },

    // Render Current View
    renderCurrentView() {
        switch (this.state.currentView) {
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

    // Switch View
    switchView(view) {
        this.state.currentView = view;
        
        document.querySelectorAll('.hub-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === view);
        });
        
        document.querySelectorAll('.hub-view').forEach(v => {
            v.classList.toggle('active', v.id === `${view}-view`);
        });
        
        this.renderCurrentView();
    },

    // Set Filter
    setFilter(filter) {
        this.state.currentFilter = filter;
        
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.filter === filter);
        });
        
        this.render();
    },

    // Search Filter
    filter() {
        const searchInput = document.getElementById('hub-search');
        const typeFilter = document.getElementById('filter-type');
        
        this.state.searchQuery = searchInput?.value || '';
        this.render();
    },

    // Sort by column
    sortBy(column) {
        if (this.state.sortBy === column) {
            this.state.sortOrder = this.state.sortOrder === 'desc' ? 'asc' : 'desc';
        } else {
            this.state.sortBy = column;
            this.state.sortOrder = 'desc';
        }
        this.render();
    },

    // ==================== FULL VIEW (Airtable-style) ====================
    renderFullView() {
        const container = document.getElementById('full-view');
        if (!container) return;

        const sortIcon = (col) => {
            if (this.state.sortBy !== col) return '';
            return this.state.sortOrder === 'desc' ? ' ↓' : ' ↑';
        };

        container.innerHTML = `
            <div class="full-view-container glass">
                <div class="full-view-toolbar">
                    <div class="toolbar-left">
                        <button class="btn-icon-sm" onclick="ContentHubV2.addNewRow()" title="Add Row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                        <span class="toolbar-divider"></span>
                        <button class="btn-icon-sm ${this.state.selectedItems.length > 0 ? '' : 'disabled'}" onclick="ContentHubV2.bulkDelete()" title="Delete Selected">🗑️</button>
                        <button class="btn-icon-sm ${this.state.selectedItems.length > 0 ? '' : 'disabled'}" onclick="ContentHubV2.bulkStatusChange()" title="Change Status">📋</button>
                    </div>
                    <div class="toolbar-right">
                        <span class="row-count">${this.state.filteredContents.length} items</span>
                    </div>
                </div>
                
                <div class="full-view-table-wrapper">
                    <table class="full-view-table">
                        <thead>
                            <tr>
                                <th class="col-checkbox"><input type="checkbox" onchange="ContentHubV2.selectAll(this)"></th>
                                <th class="col-title sortable" onclick="ContentHubV2.sortBy('title')">TITLE${sortIcon('title')}</th>
                                <th class="col-type sortable" onclick="ContentHubV2.sortBy('type')">TYPE${sortIcon('type')}</th>
                                <th class="col-platforms">PLATFORMS</th>
                                <th class="col-status sortable" onclick="ContentHubV2.sortBy('status')">STATUS${sortIcon('status')}</th>
                                <th class="col-date sortable" onclick="ContentHubV2.sortBy('scheduledDate')">DATE${sortIcon('scheduledDate')}</th>
                                <th class="col-media">MEDIA</th>
                                <th class="col-caption">CAPTION</th>
                                <th class="col-hashtags">HASHTAGS</th>
                                <th class="col-pillar sortable" onclick="ContentHubV2.sortBy('pillar')">PILLAR${sortIcon('pillar')}</th>
                                <th class="col-actions">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody id="full-view-body">
                            ${this.renderFullViewRows()}
                        </tbody>
                    </table>
                </div>
                
                <div class="full-view-footer">
                    <button class="btn-add-row" onclick="ContentHubV2.addNewRow()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add new row
                    </button>
                    <span id="full-row-count">${this.state.filteredContents.length} items</span>
                </div>
            </div>
        `;
    },

    renderFullViewRows() {
        if (this.state.filteredContents.length === 0) {
            return `
                <tr class="empty-row">
                    <td colspan="11">
                        <div class="empty-state-inline">
                            <span>📋</span>
                            <p>No content found</p>
                            <button class="btn-primary btn-sm" onclick="ContentHubV2.addNewRow()">+ Add Content</button>
                        </div>
                    </td>
                </tr>
            `;
        }

        return this.state.filteredContents.map(content => `
            <tr data-id="${content.id}" class="${this.state.selectedItems.includes(content.id) ? 'selected' : ''}">
                <td class="col-checkbox">
                    <input type="checkbox" ${this.state.selectedItems.includes(content.id) ? 'checked' : ''} 
                           onchange="ContentHubV2.toggleSelect('${content.id}', this.checked)">
                </td>
                <td class="col-title editable" onclick="ContentHubV2.startInlineEdit('${content.id}', 'title', this)">
                    <div class="cell-content">${content.title || '<span class="placeholder">Click to add title...</span>'}</div>
                </td>
                <td class="col-type" onclick="ContentHubV2.showTypeDropdown('${content.id}', this)">
                    <div class="type-badge-cell">
                        ${this.getTypeIcon(content.type)} ${this.formatType(content.type)}
                        <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                </td>
                <td class="col-platforms" onclick="ContentHubV2.showPlatformSelector('${content.id}', this)">
                    <div class="platforms-cell">
                        ${this.renderPlatformBadges(content.platforms) || '<span class="placeholder">+ Add</span>'}
                    </div>
                </td>
                <td class="col-status" onclick="ContentHubV2.showStatusDropdown('${content.id}', this)">
                    <div class="status-badge-cell status-${content.status}">
                        ${this.statuses[content.status]?.icon || '📝'} ${this.statuses[content.status]?.name || content.status}
                        <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                </td>
                <td class="col-date editable" onclick="ContentHubV2.showDatePicker('${content.id}', this)">
                    <div class="date-cell">
                        ${content.scheduledDate ? this.formatDate(content.scheduledDate) : '<span class="placeholder">Set date</span>'}
                    </div>
                </td>
                <td class="col-media" onclick="ContentHubV2.showMediaUploader('${content.id}', this)">
                    <div class="media-cell">
                        ${content.media ? `<img src="${content.media}" class="media-thumb">` : '<span class="media-add">+ 📷</span>'}
                    </div>
                </td>
                <td class="col-caption editable" onclick="ContentHubV2.startInlineEdit('${content.id}', 'caption', this)">
                    <div class="cell-content caption-preview">${this.truncate(content.caption || content.content, 60) || '<span class="placeholder">Add caption...</span>'}</div>
                </td>
                <td class="col-hashtags editable" onclick="ContentHubV2.startInlineEdit('${content.id}', 'hashtags', this)">
                    <div class="hashtags-cell">${this.renderHashtags(content.hashtags) || '<span class="placeholder">+ Tags</span>'}</div>
                </td>
                <td class="col-pillar" onclick="ContentHubV2.showPillarDropdown('${content.id}', this)">
                    <div class="pillar-cell">
                        ${content.pillar || '<span class="placeholder">Select</span>'}
                        <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                </td>
                <td class="col-actions">
                    <div class="actions-cell">
                        <button class="btn-icon-xs" onclick="event.stopPropagation();ContentHubV2.openFullForm('${content.id}')" title="Full Edit">📝</button>
                        <button class="btn-icon-xs" onclick="event.stopPropagation();ContentHubV2.duplicateContent('${content.id}')" title="Duplicate">📋</button>
                        <button class="btn-icon-xs" onclick="event.stopPropagation();ContentHubV2.deleteContent('${content.id}')" title="Delete">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    // ==================== INLINE EDITING ====================
    startInlineEdit(id, field, cell) {
        // Save any existing edit first
        if (this.state.editingCell) {
            this.saveInlineEdit();
        }

        const content = this.state.contents.find(c => c.id === id);
        if (!content) return;

        this.state.editingCell = { id, field, cell };
        cell.classList.add('inline-edit-cell');

        let value = content[field];
        if (field === 'hashtags' && Array.isArray(value)) {
            value = value.join(' ');
        }

        const isMultiline = field === 'caption' || field === 'content';
        
        cell.innerHTML = isMultiline ? `
            <textarea class="inline-edit-input" autofocus>${value || ''}</textarea>
            <div class="inline-edit-actions">
                <button class="btn-save" onclick="event.stopPropagation();ContentHubV2.saveInlineEdit()">✓</button>
                <button class="btn-cancel" onclick="event.stopPropagation();ContentHubV2.cancelInlineEdit()">✕</button>
            </div>
        ` : `
            <input type="text" class="inline-edit-input" value="${value || ''}" autofocus>
            <div class="inline-edit-actions">
                <button class="btn-save" onclick="event.stopPropagation();ContentHubV2.saveInlineEdit()">✓</button>
                <button class="btn-cancel" onclick="event.stopPropagation();ContentHubV2.cancelInlineEdit()">✕</button>
            </div>
        `;

        const input = cell.querySelector('.inline-edit-input');
        input.focus();
        input.select();

        // Handle Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.saveInlineEdit();
            }
            if (e.key === 'Escape') {
                this.cancelInlineEdit();
            }
        });
    },

    saveInlineEdit() {
        if (!this.state.editingCell) return;

        const { id, field, cell } = this.state.editingCell;
        const input = cell.querySelector('.inline-edit-input');
        if (!input) return;

        let value = input.value.trim();
        
        // Parse hashtags
        if (field === 'hashtags') {
            value = value.split(/\s+/).filter(h => h).map(h => h.startsWith('#') ? h : `#${h}`);
        }

        // Update content
        const index = this.state.contents.findIndex(c => c.id === id);
        if (index !== -1) {
            this.state.contents[index][field] = value;
            this.state.contents[index].updatedAt = Date.now();
            this.saveContents();
        }

        this.state.editingCell = null;
        this.render();
        showToast('Updated! ✓', 'success');
    },

    cancelInlineEdit() {
        this.state.editingCell = null;
        this.render();
    },

    // ==================== DROPDOWN SELECTORS ====================
    showTypeDropdown(id, cell) {
        this.closeAllDropdowns();
        
        const dropdown = document.createElement('div');
        dropdown.className = 'inline-dropdown';
        dropdown.innerHTML = Object.entries(this.contentCategories).map(([key, cat]) => `
            <div class="dropdown-item" onclick="ContentHubV2.updateField('${id}', 'type', '${key}')">
                ${cat.icon} ${cat.name}
            </div>
        `).join('');
        
        this.positionDropdown(dropdown, cell);
        document.body.appendChild(dropdown);
        
        setTimeout(() => dropdown.classList.add('show'), 10);
    },

    showStatusDropdown(id, cell) {
        this.closeAllDropdowns();
        
        const dropdown = document.createElement('div');
        dropdown.className = 'inline-dropdown';
        dropdown.innerHTML = Object.entries(this.statuses).map(([key, status]) => `
            <div class="dropdown-item" onclick="ContentHubV2.updateField('${id}', 'status', '${key}')">
                <span class="status-dot" style="background: ${status.color}"></span>
                ${status.icon} ${status.name}
            </div>
        `).join('');
        
        this.positionDropdown(dropdown, cell);
        document.body.appendChild(dropdown);
        
        setTimeout(() => dropdown.classList.add('show'), 10);
    },

    showPlatformSelector(id, cell) {
        this.closeAllDropdowns();
        
        const content = this.state.contents.find(c => c.id === id);
        const currentPlatforms = content?.platforms || [];
        
        const dropdown = document.createElement('div');
        dropdown.className = 'inline-dropdown platform-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-header">Select Platforms</div>
            ${Object.entries(this.platforms).map(([key, platform]) => `
                <label class="dropdown-checkbox">
                    <input type="checkbox" value="${key}" ${currentPlatforms.includes(key) ? 'checked' : ''} 
                           onchange="ContentHubV2.togglePlatform('${id}', '${key}', this.checked)">
                    ${platform.icon} ${platform.name}
                </label>
            `).join('')}
            <div class="dropdown-footer">
                <button class="btn-sm" onclick="ContentHubV2.closeAllDropdowns()">Done</button>
            </div>
        `;
        
        this.positionDropdown(dropdown, cell);
        document.body.appendChild(dropdown);
        
        setTimeout(() => dropdown.classList.add('show'), 10);
    },

    showPillarDropdown(id, cell) {
        this.closeAllDropdowns();
        
        const pillars = ['Education', 'Inspiration', 'Entertainment', 'Promotion', 'Behind the Scenes', 'Tips & Tricks', 'News', 'Community'];
        
        const dropdown = document.createElement('div');
        dropdown.className = 'inline-dropdown';
        dropdown.innerHTML = pillars.map(pillar => `
            <div class="dropdown-item" onclick="ContentHubV2.updateField('${id}', 'pillar', '${pillar}')">
                ${pillar}
            </div>
        `).join('');
        
        this.positionDropdown(dropdown, cell);
        document.body.appendChild(dropdown);
        
        setTimeout(() => dropdown.classList.add('show'), 10);
    },

    showDatePicker(id, cell) {
        this.closeAllDropdowns();
        
        const content = this.state.contents.find(c => c.id === id);
        const currentDate = content?.scheduledDate || '';
        
        const dropdown = document.createElement('div');
        dropdown.className = 'inline-dropdown date-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-header">Schedule Date</div>
            <input type="datetime-local" class="date-input" value="${currentDate}" 
                   onchange="ContentHubV2.updateField('${id}', 'scheduledDate', this.value)">
            <div class="quick-dates">
                <button onclick="ContentHubV2.setQuickDate('${id}', 'today')">Today</button>
                <button onclick="ContentHubV2.setQuickDate('${id}', 'tomorrow')">Tomorrow</button>
                <button onclick="ContentHubV2.setQuickDate('${id}', 'nextWeek')">Next Week</button>
            </div>
            <button class="btn-clear" onclick="ContentHubV2.updateField('${id}', 'scheduledDate', '')">Clear Date</button>
        `;
        
        this.positionDropdown(dropdown, cell);
        document.body.appendChild(dropdown);
        
        setTimeout(() => dropdown.classList.add('show'), 10);
    },

    setQuickDate(id, preset) {
        const now = new Date();
        let date;
        
        switch(preset) {
            case 'today':
                date = now;
                break;
            case 'tomorrow':
                date = new Date(now.setDate(now.getDate() + 1));
                break;
            case 'nextWeek':
                date = new Date(now.setDate(now.getDate() + 7));
                break;
        }
        
        const formatted = date.toISOString().slice(0, 16);
        this.updateField(id, 'scheduledDate', formatted);
    },

    positionDropdown(dropdown, cell) {
        const rect = cell.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${rect.bottom + 4}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.minWidth = `${rect.width}px`;
    },

    closeAllDropdowns() {
        document.querySelectorAll('.inline-dropdown').forEach(d => d.remove());
    },

    // Update field directly
    updateField(id, field, value) {
        const index = this.state.contents.findIndex(c => c.id === id);
        if (index !== -1) {
            this.state.contents[index][field] = value;
            this.state.contents[index].updatedAt = Date.now();
            this.saveContents();
        }
        this.closeAllDropdowns();
        this.render();
        showToast('Updated! ✓', 'success');
    },

    togglePlatform(id, platform, checked) {
        const content = this.state.contents.find(c => c.id === id);
        if (!content) return;
        
        if (!content.platforms) content.platforms = [];
        
        if (checked && !content.platforms.includes(platform)) {
            content.platforms.push(platform);
        } else if (!checked) {
            content.platforms = content.platforms.filter(p => p !== platform);
        }
        
        content.updatedAt = Date.now();
        this.saveContents();
        this.render();
    },

    // ==================== ADD NEW ROW (Inline) ====================
    addNewRow() {
        const newContent = {
            id: Date.now().toString(),
            title: '',
            type: 'text_article',
            status: 'idea',
            platforms: [],
            content: '',
            caption: '',
            hashtags: [],
            pillar: '',
            scheduledDate: '',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        this.state.contents.unshift(newContent);
        this.saveContents();
        this.render();
        
        // Auto-focus on title cell
        setTimeout(() => {
            const firstRow = document.querySelector(`tr[data-id="${newContent.id}"] .col-title`);
            if (firstRow) {
                this.startInlineEdit(newContent.id, 'title', firstRow);
            }
        }, 100);
    },

    // ==================== KANBAN VIEW with Drag & Drop ====================
    renderKanbanView() {
        const container = document.getElementById('kanban-view');
        if (!container) return;

        const statusOrder = ['idea', 'draft', 'review', 'scheduled', 'published'];
        
        container.innerHTML = `
            <div class="kanban-board-v2">
                ${statusOrder.map(status => {
                    const items = this.state.contents.filter(c => c.status === status);
                    const statusConfig = this.statuses[status];
                    return `
                        <div class="kanban-column-v2" data-status="${status}" 
                             ondragover="ContentHubV2.handleDragOver(event)" 
                             ondrop="ContentHubV2.handleDrop(event, '${status}')">
                            <div class="kanban-header-v2" style="border-color: ${statusConfig.color}">
                                <span class="kanban-status-v2">
                                    ${statusConfig.icon} ${statusConfig.name}
                                </span>
                                <span class="kanban-count-v2">${items.length}</span>
                            </div>
                            <div class="kanban-cards-v2" id="kanban-${status}">
                                ${items.map(content => this.renderKanbanCard(content)).join('')}
                            </div>
                            <button class="kanban-add-v2" onclick="ContentHubV2.createWithStatus('${status}')">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Add
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    renderKanbanCard(content) {
        return `
            <div class="kanban-card-v2" 
                 draggable="true" 
                 data-id="${content.id}"
                 ondragstart="ContentHubV2.handleDragStart(event, '${content.id}')"
                 ondragend="ContentHubV2.handleDragEnd(event)"
                 onclick="ContentHubV2.openFullForm('${content.id}')">
                <div class="kanban-card-header">
                    <span class="card-type">${this.getTypeIcon(content.type)}</span>
                    <div class="card-actions">
                        <button class="btn-icon-xs" onclick="event.stopPropagation();ContentHubV2.duplicateContent('${content.id}')">📋</button>
                        <button class="btn-icon-xs" onclick="event.stopPropagation();ContentHubV2.deleteContent('${content.id}')">🗑️</button>
                    </div>
                </div>
                <div class="kanban-card-title">${content.title || 'Untitled'}</div>
                ${content.caption ? `<div class="kanban-card-preview">${this.truncate(content.caption, 80)}</div>` : ''}
                <div class="kanban-card-footer">
                    <div class="card-platforms">${this.renderPlatformBadges(content.platforms)}</div>
                    ${content.scheduledDate ? `<div class="card-date">📅 ${this.formatDate(content.scheduledDate)}</div>` : ''}
                </div>
            </div>
        `;
    },

    // Drag & Drop Handlers for Kanban
    handleDragStart(event, id) {
        this.state.draggedItem = id;
        event.target.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', id);
    },

    handleDragEnd(event) {
        event.target.classList.remove('dragging');
        document.querySelectorAll('.kanban-column-v2').forEach(col => {
            col.classList.remove('drag-over');
        });
        this.state.draggedItem = null;
    },

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        event.currentTarget.classList.add('drag-over');
    },

    handleDrop(event, newStatus) {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');
        
        const id = event.dataTransfer.getData('text/plain') || this.state.draggedItem;
        if (!id) return;

        const index = this.state.contents.findIndex(c => c.id === id);
        if (index !== -1) {
            this.state.contents[index].status = newStatus;
            this.state.contents[index].updatedAt = Date.now();
            this.saveContents();
            this.render();
            showToast(`Moved to ${this.statuses[newStatus].name}! ✓`, 'success');
        }
    },

    // ==================== CALENDAR VIEW with Drag & Drop ====================
    renderCalendarView() {
        const container = document.getElementById('calendar-view');
        if (!container) return;

        const year = this.state.calendarYear;
        const month = this.state.calendarMonth;
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];

        container.innerHTML = `
            <div class="calendar-v2">
                <div class="calendar-header-v2">
                    <button class="btn-icon" onclick="ContentHubV2.prevMonth()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <h3>${monthNames[month]} ${year}</h3>
                    <button class="btn-icon" onclick="ContentHubV2.nextMonth()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                    <button class="btn-ghost" onclick="ContentHubV2.goToToday()">Today</button>
                </div>
                
                <div class="calendar-grid-v2">
                    <div class="calendar-weekdays">
                        ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="weekday">${d}</div>`).join('')}
                    </div>
                    <div class="calendar-days">
                        ${this.renderCalendarDays(year, month, daysInMonth, startDay)}
                    </div>
                </div>
            </div>
        `;
    },

    renderCalendarDays(year, month, daysInMonth, startDay) {
        let html = '';
        const today = new Date();
        
        // Empty cells before first day
        for (let i = 0; i < startDay; i++) {
            html += '<div class="calendar-day-v2 empty"></div>';
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayContents = this.state.contents.filter(c => {
                if (!c.scheduledDate) return false;
                return c.scheduledDate.startsWith(dateStr);
            });

            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

            html += `
                <div class="calendar-day-v2 ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}" 
                     data-date="${dateStr}"
                     ondragover="ContentHubV2.handleCalendarDragOver(event)"
                     ondrop="ContentHubV2.handleCalendarDrop(event, '${dateStr}')"
                     onclick="ContentHubV2.selectDate('${dateStr}')">
                    <span class="day-number-v2">${day}</span>
                    <div class="day-contents-v2">
                        ${dayContents.slice(0, 3).map(c => `
                            <div class="day-content-item-v2 status-${c.status}" 
                                 draggable="true"
                                 ondragstart="ContentHubV2.handleDragStart(event, '${c.id}')"
                                 onclick="event.stopPropagation();ContentHubV2.openFullForm('${c.id}')">
                                ${this.getTypeIcon(c.type)} ${this.truncate(c.title, 12)}
                            </div>
                        `).join('')}
                        ${dayContents.length > 3 ? `<span class="more-items-v2">+${dayContents.length - 3} more</span>` : ''}
                    </div>
                    <button class="day-add-btn" onclick="event.stopPropagation();ContentHubV2.createForDate('${dateStr}')">+</button>
                </div>
            `;
        }

        return html;
    },

    // Calendar Drag & Drop
    handleCalendarDragOver(event) {
        event.preventDefault();
        event.currentTarget.classList.add('drag-over');
    },

    handleCalendarDrop(event, dateStr) {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');
        
        const id = event.dataTransfer.getData('text/plain') || this.state.draggedItem;
        if (!id) return;

        const index = this.state.contents.findIndex(c => c.id === id);
        if (index !== -1) {
            // Set time to 9:00 AM by default
            this.state.contents[index].scheduledDate = `${dateStr}T09:00`;
            this.state.contents[index].status = 'scheduled';
            this.state.contents[index].updatedAt = Date.now();
            this.saveContents();
            this.render();
            showToast(`Scheduled for ${this.formatDate(dateStr)}! 📅`, 'success');
        }
    },

    // Calendar Navigation
    prevMonth() {
        this.state.calendarMonth--;
        if (this.state.calendarMonth < 0) {
            this.state.calendarMonth = 11;
            this.state.calendarYear--;
        }
        this.renderCalendarView();
    },

    nextMonth() {
        this.state.calendarMonth++;
        if (this.state.calendarMonth > 11) {
            this.state.calendarMonth = 0;
            this.state.calendarYear++;
        }
        this.renderCalendarView();
    },

    goToToday() {
        const today = new Date();
        this.state.calendarMonth = today.getMonth();
        this.state.calendarYear = today.getFullYear();
        this.renderCalendarView();
    },

    selectDate(dateStr) {
        this.createForDate(dateStr);
    },

    createForDate(dateStr) {
        this.openFullForm(null, { scheduledDate: `${dateStr}T09:00`, status: 'scheduled' });
    },

    createWithStatus(status) {
        this.openFullForm(null, { status });
    },

    // ==================== FULL FORM (Dynamic based on Content Type) ====================
    openFullForm(id = null, defaults = {}) {
        const content = id ? this.state.contents.find(c => c.id === id) : null;
        const data = { ...defaults, ...content };
        const isEdit = !!id;
        const contentType = data.type || 'text_article';
        const category = this.contentCategories[contentType];

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'content-form-modal';
        modal.innerHTML = `
            <div class="modal-content full-form-modal">
                <div class="modal-header">
                    <div class="modal-title-section">
                        <h2>${isEdit ? '✏️ Edit Content' : '✨ Create Content'}</h2>
                        <span class="content-type-badge">${category?.icon || '📝'} ${category?.name || 'Content'}</spa