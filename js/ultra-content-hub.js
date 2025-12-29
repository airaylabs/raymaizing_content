// ==================== ULTRA CONTENT HUB ====================
// Enhanced Content Management System
// Version 5.0 - December 2025

const UltraContentHub = {
    // State
    state: {
        contents: [],
        filteredContents: [],
        currentView: 'simple',
        currentFilter: 'all',
        searchQuery: '',
        selectedItems: [],
        sortBy: 'createdAt',
        sortOrder: 'desc'
    },

    // Initialize
    init() {
        this.loadContents();
        this.render();
        console.log('📋 Ultra Content Hub initialized');
        return this;
    },

    // Load Contents
    loadContents() {
        this.state.contents = JSON.parse(localStorage.getItem('raycorp-contents') || '[]');
        this.applyFilters();
    },

    // Save Contents
    saveContents() {
        localStorage.setItem('raycorp-contents', JSON.stringify(this.state.contents));
        this.updateStats();
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
                c.caption?.toLowerCase().includes(query)
            );
        }

        // Sort
        filtered.sort((a, b) => {
            const aVal = a[this.state.sortBy] || 0;
            const bVal = b[this.state.sortBy] || 0;
            return this.state.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        });

        this.state.filteredContents = filtered;
    },

    // Update Stats
    updateStats() {
        const stats = {
            total: this.state.contents.length,
            draft: this.state.contents.filter(c => c.status === 'draft').length,
            scheduled: this.state.contents.filter(c => c.status === 'scheduled').length,
            published: this.state.contents.filter(c => c.status === 'published').length
        };

        // Update UI elements
        if (document.getElementById('content-count')) {
            document.getElementById('content-count').textContent = stats.total;
        }
        if (document.getElementById('stat-total')) {
            document.getElementById('stat-total').textContent = stats.total;
        }
        if (document.getElementById('stat-draft')) {
            document.getElementById('stat-draft').textContent = stats.draft;
        }
        if (document.getElementById('stat-scheduled')) {
            document.getElementById('stat-scheduled').textContent = stats.scheduled;
        }
        if (document.getElementById('stat-published')) {
            document.getElementById('stat-published').textContent = stats.published;
        }
    },

    // Render Content Hub
    render() {
        this.applyFilters();
        this.renderCurrentView();
        this.updateRowCount();
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

    // Set Filter
    setFilter(filter) {
        this.state.currentFilter = filter;
        
        // Update chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.filter === filter);
        });
        
        this.render();
    },

    // Filter (search)
    filter() {
        const searchInput = document.getElementById('hub-search');
        const typeFilter = document.getElementById('filter-type');
        
        this.state.searchQuery = searchInput?.value || '';
        
        // Apply type filter if exists
        if (typeFilter && typeFilter.value !== 'all') {
            this.state.filteredContents = this.state.filteredContents.filter(c => c.type === typeFilter.value);
        }
        
        this.render();
    },

    // Render Simple View
    renderSimpleView() {
        const tbody = document.getElementById('simple-table-body');
        if (!tbody) return;

        if (this.state.filteredContents.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-cell">
                        <div class="empty-state small">
                            <span class="empty-icon">📋</span>
                            <p>No content found</p>
                            <button class="btn-primary btn-sm" onclick="UltraContentHub.createNew()">+ Create Content</button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.state.filteredContents.map(content => `
            <tr data-id="${content.id}">
                <td><input type="checkbox" onchange="UltraContentHub.toggleSelect('${content.id}', this.checked)"></td>
                <td class="title-cell" onclick="UltraContentHub.editContent('${content.id}')">${content.title || 'Untitled'}</td>
                <td><span class="type-badge">${this.getTypeIcon(content.type)} ${this.formatType(content.type)}</span></td>
                <td>${this.renderPlatformBadges(content.platforms)}</td>
                <td><span class="status-badge status-${content.status}">${content.status}</span></td>
                <td>${this.formatDate(content.createdAt)}</td>
                <td class="actions-cell">
                    <button class="btn-icon-sm" onclick="UltraContentHub.editContent('${content.id}')" title="Edit">✏️</button>
                    <button class="btn-icon-sm" onclick="UltraContentHub.duplicateContent('${content.id}')" title="Duplicate">📋</button>
                    <button class="btn-icon-sm" onclick="UltraContentHub.deleteContent('${content.id}')" title="Delete">🗑️</button>
                </td>
            </tr>
        `).join('');
    },

    // Render Full View
    renderFullView() {
        const tbody = document.getElementById('airtable-body');
        if (!tbody) return;

        if (this.state.filteredContents.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="12" class="empty-cell">
                        <div class="empty-state small">
                            <span class="empty-icon">📋</span>
                            <p>No content found</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.state.filteredContents.map(content => `
            <tr data-id="${content.id}">
                <td><input type="checkbox" onchange="UltraContentHub.toggleSelect('${content.id}', this.checked)"></td>
                <td>${this.getTypeIcon(content.type)}</td>
                <td class="title-cell" onclick="UltraContentHub.editContent('${content.id}')">${content.title || 'Untitled'}</td>
                <td>${this.formatType(content.type)}</td>
                <td>${this.renderPlatformBadges(content.platforms)}</td>
                <td><span class="status-badge status-${content.status}">${content.status}</span></td>
                <td>${this.formatDate(content.createdAt)}</td>
                <td>${content.media ? '📷' : '-'}</td>
                <td class="caption-cell">${this.truncate(content.caption || content.content, 50)}</td>
                <td>${(content.hashtags || []).slice(0, 3).join(' ')}</td>
                <td>${content.pillar || '-'}</td>
                <td class="actions-cell">
                    <button class="btn-icon-sm" onclick="UltraContentHub.editContent('${content.id}')">✏️</button>
                    <button class="btn-icon-sm" onclick="UltraContentHub.deleteContent('${content.id}')">🗑️</button>
                </td>
            </tr>
        `).join('');
    },

    // Render Kanban View
    renderKanbanView() {
        const statuses = ['idea', 'draft', 'review', 'scheduled', 'published'];
        
        statuses.forEach(status => {
            const container = document.getElementById(`kanban-${status}`);
            const countEl = document.getElementById(`kanban-count-${status}`);
            
            if (!container) return;
            
            const items = this.state.contents.filter(c => c.status === status);
            
            if (countEl) countEl.textContent = items.length;
            
            if (items.length === 0) {
                container.innerHTML = '<div class="kanban-empty">No items</div>';
                return;
            }
            
            container.innerHTML = items.map(content => `
                <div class="kanban-card" draggable="true" data-id="${content.id}" onclick="UltraContentHub.editContent('${content.id}')">
                    <div class="kanban-card-type">${this.getTypeIcon(content.type)}</div>
                    <div class="kanban-card-title">${content.title || 'Untitled'}</div>
                    <div class="kanban-card-meta">
                        ${this.renderPlatformBadges(content.platforms)}
                    </div>
                </div>
            `).join('');
        });
    },

    // Render Calendar View
    renderCalendarView() {
        const container = document.getElementById('calendar-view');
        if (!container) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];

        let calendarHTML = `
            <div class="calendar-header">
                <button class="btn-icon" onclick="UltraContentHub.prevMonth()">←</button>
                <h3>${monthNames[month]} ${year}</h3>
                <button class="btn-icon" onclick="UltraContentHub.nextMonth()">→</button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
        `;

        // Empty cells before first day
        for (let i = 0; i < startDay; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayContents = this.state.contents.filter(c => {
                const cDate = c.scheduledDate || c.createdAt;
                return cDate && cDate.startsWith(dateStr);
            });

            const isToday = day === now.getDate() && month === now.getMonth();

            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''}" onclick="UltraContentHub.selectDate('${dateStr}')">
                    <span class="day-number">${day}</span>
                    ${dayContents.length > 0 ? `
                        <div class="day-contents">
                            ${dayContents.slice(0, 2).map(c => `
                                <div class="day-content-item" onclick="event.stopPropagation();UltraContentHub.editContent('${c.id}')">
                                    ${this.getTypeIcon(c.type)} ${this.truncate(c.title, 15)}
                                </div>
                            `).join('')}
                            ${dayContents.length > 2 ? `<span class="more-items">+${dayContents.length - 2} more</span>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        calendarHTML += '</div>';
        container.innerHTML = calendarHTML;
        this.addCalendarStyles();
    },

    // Create New Content
    createNew() {
        this.openContentModal();
    },

    createWithStatus(status) {
        this.openContentModal({ status });
    },

    // Open Content Modal
    openContentModal(defaults = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'content-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>${defaults.id ? '✏️ Edit Content' : '✨ Create Content'}</h2>
                    <button class="modal-close" onclick="document.getElementById('content-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="content-title" value="${defaults.title || ''}" placeholder="Content title...">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Type</label>
                            <select id="content-type">
                                <option value="text_article" ${defaults.type === 'text_article' ? 'selected' : ''}>📝 Article</option>
                                <option value="text_thread" ${defaults.type === 'text_thread' ? 'selected' : ''}>🐦 Thread</option>
                                <option value="video_short" ${defaults.type === 'video_short' ? 'selected' : ''}>📱 Short Video</option>
                                <option value="video_long" ${defaults.type === 'video_long' ? 'selected' : ''}>🎬 Long Video</option>
                                <option value="video_story" ${defaults.type === 'video_story' ? 'selected' : ''}>⏱️ Story</option>
                                <option value="image_carousel" ${defaults.type === 'image_carousel' ? 'selected' : ''}>🎨 Carousel</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Status</label>
                            <select id="content-status">
                                <option value="idea" ${defaults.status === 'idea' ? 'selected' : ''}>💡 Idea</option>
                                <option value="draft" ${defaults.status === 'draft' ? 'selected' : ''}>📝 Draft</option>
                                <option value="review" ${defaults.status === 'review' ? 'selected' : ''}>👀 Review</option>
                                <option value="scheduled" ${defaults.status === 'scheduled' ? 'selected' : ''}>📅 Scheduled</option>
                                <option value="published" ${defaults.status === 'published' ? 'selected' : ''}>✅ Published</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Platforms</label>
                        <div class="platform-checkboxes-inline">
                            <label><input type="checkbox" value="instagram" ${(defaults.platforms || []).includes('instagram') ? 'checked' : ''}> 📸 Instagram</label>
                            <label><input type="checkbox" value="tiktok" ${(defaults.platforms || []).includes('tiktok') ? 'checked' : ''}> 🎵 TikTok</label>
                            <label><input type="checkbox" value="twitter" ${(defaults.platforms || []).includes('twitter') ? 'checked' : ''}> 🐦 Twitter</label>
                            <label><input type="checkbox" value="linkedin" ${(defaults.platforms || []).includes('linkedin') ? 'checked' : ''}> 💼 LinkedIn</label>
                            <label><input type="checkbox" value="youtube" ${(defaults.platforms || []).includes('youtube') ? 'checked' : ''}> 🎬 YouTube</label>
                            <label><input type="checkbox" value="facebook" ${(defaults.platforms || []).includes('facebook') ? 'checked' : ''}> 📘 Facebook</label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Content / Caption</label>
                        <textarea id="content-body" rows="6" placeholder="Write your content here...">${defaults.content || defaults.caption || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Hashtags</label>
                        <input type="text" id="content-hashtags" value="${(defaults.hashtags || []).join(' ')}" placeholder="#hashtag1 #hashtag2 ...">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Pillar</label>
                            <select id="content-pillar">
                                <option value="">Select pillar...</option>
                                <option value="Education" ${defaults.pillar === 'Education' ? 'selected' : ''}>Education</option>
                                <option value="Inspiration" ${defaults.pillar === 'Inspiration' ? 'selected' : ''}>Inspiration</option>
                                <option value="Entertainment" ${defaults.pillar === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                                <option value="Promotion" ${defaults.pillar === 'Promotion' ? 'selected' : ''}>Promotion</option>
                                <option value="Behind the Scenes" ${defaults.pillar === 'Behind the Scenes' ? 'selected' : ''}>Behind the Scenes</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Scheduled Date</label>
                            <input type="datetime-local" id="content-scheduled" value="${defaults.scheduledDate || ''}">
                        </div>
                    </div>
                    
                    <div class="ai-enhance-bar">
                        <button class="btn-secondary" onclick="UltraContentHub.enhanceWithAI()">🤖 Enhance with AI</button>
                        <button class="btn-secondary" onclick="UltraContentHub.generateHashtags()">🏷️ Generate Hashtags</button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="document.getElementById('content-modal').remove()">Cancel</button>
                    <button class="btn-primary" onclick="UltraContentHub.saveContent('${defaults.id || ''}')">${defaults.id ? 'Update' : 'Create'}</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Focus title
        setTimeout(() => document.getElementById('content-title')?.focus(), 100);
    },

    // Save Content
    saveContent(existingId) {
        const title = document.getElementById('content-title')?.value.trim();
        const type = document.getElementById('content-type')?.value;
        const status = document.getElementById('content-status')?.value;
        const content = document.getElementById('content-body')?.value.trim();
        const hashtagsStr = document.getElementById('content-hashtags')?.value;
        const pillar = document.getElementById('content-pillar')?.value;
        const scheduledDate = document.getElementById('content-scheduled')?.value;
        
        // Get platforms
        const platforms = [];
        document.querySelectorAll('.platform-checkboxes-inline input:checked').forEach(cb => {
            platforms.push(cb.value);
        });
        
        // Parse hashtags
        const hashtags = hashtagsStr ? hashtagsStr.match(/#?\w+/g)?.map(h => h.startsWith('#') ? h : `#${h}`) || [] : [];
        
        if (!title) {
            showToast('Please enter a title', 'warning');
            return;
        }
        
        const contentData = {
            id: existingId || Date.now().toString(),
            title,
            type,
            status,
            content,
            caption: content,
            platforms,
            hashtags,
            pillar,
            scheduledDate,
            createdAt: existingId ? this.state.contents.find(c => c.id === existingId)?.createdAt : Date.now(),
            updatedAt: Date.now()
        };
        
        if (existingId) {
            const index = this.state.contents.findIndex(c => c.id === existingId);
            if (index !== -1) {
                this.state.contents[index] = contentData;
            }
        } else {
            this.state.contents.push(contentData);
        }
        
        this.saveContents();
        document.getElementById('content-modal')?.remove();
        this.render();
        
        showToast(existingId ? 'Content updated! ✅' : 'Content created! 🎉', 'success');
    },

    // Edit Content
    editContent(id) {
        const content = this.state.contents.find(c => c.id === id);
        if (content) {
            this.openContentModal(content);
        }
    },

    // Duplicate Content
    duplicateContent(id) {
        const content = this.state.contents.find(c => c.id === id);
        if (content) {
            const duplicate = {
                ...content,
                id: Date.now().toString(),
                title: `${content.title} (Copy)`,
                status: 'draft',
                createdAt: Date.now()
            };
            this.state.contents.push(duplicate);
            this.saveContents();
            this.render();
            showToast('Content duplicated! 📋', 'success');
        }
    },

    // Delete Content
    deleteContent(id) {
        if (!confirm('Delete this content?')) return;
        
        this.state.contents = this.state.contents.filter(c => c.id !== id);
        this.saveContents();
        this.render();
        showToast('Content deleted', 'info');
    },

    // Enhance with AI
    async enhanceWithAI() {
        const content = document.getElementById('content-body')?.value;
        if (!content || content.length < 10) {
            showToast('Please add some content first', 'warning');
            return;
        }
        
        showToast('Enhancing with AI...', 'info');
        
        if (window.UltraAIEngine) {
            const result = await UltraAIEngine.generateText(
                `Improve and enhance this social media content. Make it more engaging, add emojis, and optimize for engagement:\n\n${content}`,
                { temperature: 0.8 }
            );
            
            if (result.success) {
                document.getElementById('content-body').value = result.content;
                showToast('Content enhanced! ✨', 'success');
            }
        }
    },

    // Generate Hashtags
    async generateHashtags() {
        const content = document.getElementById('content-body')?.value;
        const title = document.getElementById('content-title')?.value;
        
        if (!content && !title) {
            showToast('Please add title or content first', 'warning');
            return;
        }
        
        showToast('Generating hashtags...', 'info');
        
        if (window.UltraAIEngine) {
            const hashtags = await UltraAIEngine.generateHashtags(title || content, 'instagram', 15);
            if (hashtags.length > 0) {
                document.getElementById('content-hashtags').value = hashtags.join(' ');
                showToast('Hashtags generated! 🏷️', 'success');
            }
        }
    },

    // Select All
    selectAll(checkbox) {
        const isChecked = checkbox.checked;
        this.state.selectedItems = isChecked ? this.state.filteredContents.map(c => c.id) : [];
        
        document.querySelectorAll('tbody input[type="checkbox"]').forEach(cb => {
            cb.checked = isChecked;
        });
    },

    // Toggle Select
    toggleSelect(id, checked) {
        if (checked) {
            if (!this.state.selectedItems.includes(id)) {
                this.state.selectedItems.push(id);
            }
        } else {
            this.state.selectedItems = this.state.selectedItems.filter(i => i !== id);
        }
    },

    // Export All
    exportAll() {
        const data = {
            exportedAt: new Date().toISOString(),
            count: this.state.contents.length,
            contents: this.state.contents
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `content-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showToast('Content exported! 📤', 'success');
    },

    // Update Row Count
    updateRowCount() {
        const simpleCount = document.getElementById('simple-row-count');
        const fullCount = document.getElementById('full-row-count');
        const count = `${this.state.filteredContents.length} items`;
        
        if (simpleCount) simpleCount.textContent = count;
        if (fullCount) fullCount.textContent = count;
    },

    // Helper Functions
    getTypeIcon(type) {
        const icons = {
            'text_article': '📝',
            'text_thread': '🐦',
            'video_short': '📱',
            'video_long': '🎬',
            'video_story': '⏱️',
            'image_carousel': '🎨'
        };
        return icons[type] || '📄';
    },

    formatType(type) {
        const names = {
            'text_article': 'Article',
            'text_thread': 'Thread',
            'video_short': 'Short Video',
            'video_long': 'Long Video',
            'video_story': 'Story',
            'image_carousel': 'Carousel'
        };
        return names[type] || type;
    },

    renderPlatformBadges(platforms) {
        if (!platforms || platforms.length === 0) return '-';
        
        const icons = {
            'instagram': '📸',
            'tiktok': '🎵',
            'twitter': '🐦',
            'linkedin': '💼',
            'youtube': '🎬',
            'facebook': '📘'
        };
        
        return platforms.map(p => icons[p] || '🌐').join(' ');
    },

    formatDate(date) {
        if (!date) return '-';
        return new Date(date).toLocaleDateString();
    },

    truncate(text, length) {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    },

    // Calendar Navigation
    prevMonth() {
        // Implementation for previous month
        showToast('Previous month', 'info');
    },

    nextMonth() {
        // Implementation for next month
        showToast('Next month', 'info');
    },

    selectDate(dateStr) {
        showToast(`Selected: ${dateStr}`, 'info');
    },

    // Add Calendar Styles
    addCalendarStyles() {
        if (document.getElementById('calendar-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'calendar-styles';
        styles.textContent = `
            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .calendar-header h3 { margin: 0; }
            
            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 4px;
            }
            .calendar-day-header {
                padding: 10px;
                text-align: center;
                font-weight: 600;
                font-size: 12px;
                color: var(--text-muted);
            }
            .calendar-day {
                min-height: 100px;
                padding: 8px;
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .calendar-day:hover {
                border-color: var(--primary);
            }
            .calendar-day.empty {
                background: transparent;
                border: none;
            }
            .calendar-day.today {
                border-color: var(--primary);
                background: rgba(99, 102, 241, 0.1);
            }
            .day-number {
                font-weight: 600;
                font-size: 14px;
            }
            .day-contents {
                margin-top: 8px;
            }
            .day-content-item {
                font-size: 11px;
                padding: 4px 6px;
                background: var(--bg-muted);
                border-radius: 4px;
                margin-bottom: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .more-items {
                font-size: 10px;
                color: var(--text-muted);
            }
            
            .kanban-empty {
                text-align: center;
                padding: 20px;
                color: var(--text-muted);
                font-size: 12px;
            }
            .kanban-card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 10px;
                padding: 12px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .kanban-card:hover {
                border-color: var(--primary);
                transform: translateY(-2px);
            }
            .kanban-card-type { font-size: 16px; margin-bottom: 6px; }
            .kanban-card-title { font-weight: 500; font-size: 13px; margin-bottom: 8px; }
            .kanban-card-meta { font-size: 12px; }
            
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            .platform-checkboxes-inline {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
            }
            .platform-checkboxes-inline label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                cursor: pointer;
            }
            .ai-enhance-bar {
                display: flex;
                gap: 12px;
                padding: 12px;
                background: var(--bg-muted);
                border-radius: 10px;
                margin-top: 16px;
            }
            
            .title-cell {
                cursor: pointer;
                font-weight: 500;
            }
            .title-cell:hover {
                color: var(--primary);
            }
            .caption-cell {
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .type-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 12px;
            }
            .actions-cell {
                display: flex;
                gap: 4px;
            }
            .btn-icon-sm {
                width: 28px;
                height: 28px;
                border: none;
                background: var(--bg-muted);
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            .btn-icon-sm:hover {
                background: var(--primary);
            }
            .empty-cell {
                text-align: center;
            }
        `;
        document.head.appendChild(styles);
    }
};

// Make globally available
window.UltraContentHub = UltraContentHub;
window.ContentHub = UltraContentHub; // Alias for compatibility

// Initialize when needed
document.addEventListener('DOMContentLoaded', () => {
    // Will be initialized when section is shown
});
