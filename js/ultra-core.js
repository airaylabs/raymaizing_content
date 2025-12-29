// ==================== ULTRA CORE ====================
// Main Application Controller - Perfect Integration
// Version 5.0 - December 2025

const UltraCore = {
    // Application State
    state: {
        currentSection: 'dashboard',
        currentProject: null,
        isLoading: false,
        initialized: false
    },

    // Initialize Application
    async init() {
        console.log('🚀 Initializing raycorp Ultra...');
        
        try {
            // Show loading
            this.showGlobalLoading();
            
            // Initialize core systems
            await this.initializeSystems();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load user data
            this.loadUserData();
            
            // Initialize navigation
            this.initNavigation();
            
            // Update UI
            this.updateUI();
            
            // Hide loading
            this.hideGlobalLoading();
            
            this.state.initialized = true;
            console.log('✅ raycorp Ultra initialized successfully!');
            
            // Show welcome toast
            setTimeout(() => {
                this.showToast('Welcome to raycorp Ultra! 🚀', 'success');
            }, 500);
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.hideGlobalLoading();
            this.showToast('Error initializing app', 'error');
        }
    },

    // Initialize all systems
    async initializeSystems() {
        // Initialize AI Engine
        if (window.UltraAIEngine) {
            window.UltraAIEngine.init();
        }
        
        // Initialize Dashboard
        if (window.UltraDashboard) {
            // Will be initialized when section is shown
        }
        
        // Initialize AI Assistant
        if (window.UltraAIAssistant) {
            window.UltraAIAssistant.init();
        }
        
        // Initialize Knowledge Base
        if (window.UltraKnowledgeBase) {
            // Will be initialized when section is shown
        }
        
        // Initialize Settings
        if (window.UltraSettings) {
            // Will be initialized when section is shown
        }
        
        // Initialize Analytics
        if (window.UltraAnalytics) {
            window.UltraAnalytics.init();
        }
        
        // Initialize Bulk Create
        if (window.UltraBulkCreate) {
            window.UltraBulkCreate.init();
        }
    },

    // Setup Event Listeners
    setupEventListeners() {
        // Navigation clicks
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = item.dataset.section;
                if (section) {
                    this.navigateTo(section);
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+K - Open AI Assistant
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                if (window.UltraAIAssistant) {
                    UltraAIAssistant.toggle();
                }
            }
            
            // Ctrl+N - New Content
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.navigateTo('generator');
            }
            
            // Escape - Close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Before unload - save state
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
    },

    // Navigation
    navigateTo(section) {
        // Update state
        this.state.currentSection = section;
        
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });
        
        // Update sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.toggle('active', sec.id === section);
        });
        
        // Initialize section-specific features
        this.initSection(section);
        
        // Save state
        this.saveState();
        
        // Scroll to top
        document.querySelector('.main-content')?.scrollTo(0, 0);
    },

    // Initialize section-specific features
    initSection(section) {
        switch (section) {
            case 'dashboard':
                if (window.UltraDashboard) {
                    UltraDashboard.init();
                }
                this.updateDashboardStats();
                break;
                
            case 'content-hub':
                if (window.ContentHub) {
                    ContentHub.render();
                }
                break;
                
            case 'generator':
                if (window.Generator) {
                    Generator.init?.();
                }
                break;
                
            case 'magic-studio':
                if (window.MagicStudioUltra) {
                    MagicStudioUltra.init?.();
                }
                break;
                
            case 'knowledge-base':
                if (window.UltraKnowledgeBase) {
                    UltraKnowledgeBase.init();
                }
                break;
                
            case 'settings':
                if (window.UltraSettings) {
                    UltraSettings.init();
                }
                break;
        }
    },

    initNavigation() {
        // Make navigateTo globally available
        window.navigateTo = (section) => this.navigateTo(section);
        
        // Load last section
        const lastSection = localStorage.getItem('raycorp-last-section') || 'dashboard';
        this.navigateTo(lastSection);
    },

    // Load User Data
    loadUserData() {
        // Load projects
        this.loadProjects();
        
        // Load settings
        const settings = JSON.parse(localStorage.getItem('raycorp-settings') || '{}');
        if (settings.brand?.name) {
            document.getElementById('project-name-sidebar').textContent = settings.brand.name;
        }
    },

    // Load Projects
    loadProjects() {
        const projects = JSON.parse(localStorage.getItem('raycorp-projects') || '[]');
        const select = document.getElementById('project-select');
        
        if (select) {
            select.innerHTML = '<option value="">Pilih Project...</option>';
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                if (project.id === this.state.currentProject) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        }
    },

    // Update Dashboard Stats
    updateDashboardStats() {
        const contents = JSON.parse(localStorage.getItem('raycorp-contents') || '[]');
        
        const stats = {
            total: contents.length,
            draft: contents.filter(c => c.status === 'draft').length,
            scheduled: contents.filter(c => c.status === 'scheduled').length,
            published: contents.filter(c => c.status === 'published').length
        };
        
        // Update stat elements
        const statTotal = document.getElementById('stat-total');
        const statDraft = document.getElementById('stat-draft');
        const statScheduled = document.getElementById('stat-scheduled');
        const statPublished = document.getElementById('stat-published');
        
        if (statTotal) this.animateNumber(statTotal, stats.total);
        if (statDraft) this.animateNumber(statDraft, stats.draft);
        if (statScheduled) this.animateNumber(statScheduled, stats.scheduled);
        if (statPublished) this.animateNumber(statPublished, stats.published);
        
        // Update content count badge
        const contentCount = document.getElementById('content-count');
        if (contentCount) contentCount.textContent = stats.total;
    },

    // Animate number change
    animateNumber(element, target) {
        const current = parseInt(element.textContent) || 0;
        const diff = target - current;
        const duration = 500;
        const steps = 20;
        const stepValue = diff / steps;
        const stepDuration = duration / steps;
        
        let step = 0;
        const interval = setInterval(() => {
            step++;
            const value = Math.round(current + stepValue * step);
            element.textContent = value;
            
            if (step >= steps) {
                element.textContent = target;
                clearInterval(interval);
            }
        }, stepDuration);
    },

    // Update UI
    updateUI() {
        this.updateDashboardStats();
        this.updateRecentContent();
        this.updateUpcomingContent();
    },

    // Update Recent Content
    updateRecentContent() {
        const container = document.getElementById('recent-content');
        if (!container) return;
        
        const contents = JSON.parse(localStorage.getItem('raycorp-contents') || '[]');
        const recent = contents.slice(-5).reverse();
        
        if (recent.length === 0) {
            container.innerHTML = `
                <div class="empty-state small">
                    <p>No content yet</p>
                    <button class="btn-primary btn-sm" onclick="navigateTo('generator')">Create Content</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recent.map(content => `
            <div class="content-item" onclick="UltraCore.viewContent('${content.id}')">
                <div class="content-icon">${this.getTypeIcon(content.type)}</div>
                <div class="content-info">
                    <span class="content-title">${content.title || 'Untitled'}</span>
                    <span class="content-meta">${this.formatDate(content.createdAt)}</span>
                </div>
                <span class="status-badge status-${content.status}">${content.status}</span>
            </div>
        `).join('');
    },

    // Update Upcoming Content
    updateUpcomingContent() {
        const container = document.getElementById('upcoming-content');
        if (!container) return;
        
        const contents = JSON.parse(localStorage.getItem('raycorp-contents') || '[]');
        const scheduled = contents.filter(c => c.status === 'scheduled').slice(0, 4);
        
        if (scheduled.length === 0) {
            container.innerHTML = `
                <div class="empty-state small">
                    <p>No scheduled content</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = scheduled.map(content => `
            <div class="content-item">
                <div class="content-icon">📅</div>
                <div class="content-info">
                    <span class="content-title">${content.title || 'Untitled'}</span>
                    <span class="content-meta">${content.scheduledDate || 'Not set'}</span>
                </div>
            </div>
        `).join('');
    },

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

    formatDate(date) {
        if (!date) return 'Just now';
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return d.toLocaleDateString();
    },

    viewContent(id) {
        this.navigateTo('content-hub');
        setTimeout(() => {
            if (window.ContentHub) {
                ContentHub.editContent?.(id);
            }
        }, 100);
    },

    // Save State
    saveState() {
        localStorage.setItem('raycorp-last-section', this.state.currentSection);
        localStorage.setItem('raycorp-app-state', JSON.stringify({
            currentProject: this.state.currentProject,
            lastVisit: Date.now()
        }));
    },

    // Handle Resize
    handleResize() {
        // Handle responsive changes
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile', isMobile);
    },

    // Close All Modals
    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.remove();
        });
    },

    // Show Global Loading
    showGlobalLoading() {
        const existing = document.getElementById('global-loading');
        if (existing) return;
        
        const loading = document.createElement('div');
        loading.id = 'global-loading';
        loading.innerHTML = `
            <div class="global-loading-content">
                <div class="loading-logo">◈</div>
                <div class="loading-text">Loading raycorp...</div>
                <div class="loading-bar">
                    <div class="loading-bar-fill"></div>
                </div>
            </div>
        `;
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--bg-main);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
        `;
        document.body.appendChild(loading);
    },

    hideGlobalLoading() {
        const loading = document.getElementById('global-loading');
        if (loading) {
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.3s ease';
            setTimeout(() => loading.remove(), 300);
        }
    },

    // Toast Notification System
    showToast(message, type = 'info', duration = 4000) {
        // Create container if not exists
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        container.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // Quick Generate
    async quickGenerate() {
        const topic = document.getElementById('quick-gen-topic')?.value;
        const type = document.getElementById('quick-gen-type')?.value;
        
        if (!topic) {
            this.showToast('Please enter a topic', 'warning');
            return;
        }
        
        this.showToast('Generating content...', 'info');
        
        // Navigate to generator with pre-filled data
        this.navigateTo('generator');
        
        setTimeout(() => {
            const topicInput = document.getElementById('gen-topic');
            if (topicInput) {
                topicInput.value = topic;
            }
            
            // Select the type
            const typeCheckboxes = document.querySelectorAll('.type-checkbox input');
            typeCheckboxes.forEach(cb => {
                cb.checked = cb.value === type;
            });
            
            // Trigger generation if Generator exists
            if (window.Generator?.generateAll) {
                Generator.generateAll();
            }
        }, 200);
    },

    // Open Project Modal
    openProjectModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>📁 Create New Project</h2>
                    <button class="modal-close" onclick="document.getElementById('project-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Project Name</label>
                        <input type="text" id="new-project-name" placeholder="e.g., My Brand Campaign">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="new-project-desc" rows="3" placeholder="Brief description of this project..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="document.getElementById('project-modal').remove()">Cancel</button>
                    <button class="btn-primary" onclick="UltraCore.createProject()">Create Project</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Focus input
        setTimeout(() => {
            document.getElementById('new-project-name')?.focus();
        }, 100);
    },

    // Create Project
    createProject() {
        const name = document.getElementById('new-project-name')?.value.trim();
        const desc = document.getElementById('new-project-desc')?.value.trim();
        
        if (!name) {
            this.showToast('Please enter a project name', 'warning');
            return;
        }
        
        const projects = JSON.parse(localStorage.getItem('raycorp-projects') || '[]');
        const newProject = {
            id: Date.now().toString(),
            name,
            description: desc,
            createdAt: Date.now()
        };
        
        projects.push(newProject);
        localStorage.setItem('raycorp-projects', JSON.stringify(projects));
        
        // Set as current project
        this.state.currentProject = newProject.id;
        this.saveState();
        
        // Update UI
        this.loadProjects();
        document.getElementById('project-select').value = newProject.id;
        document.getElementById('project-name-sidebar').textContent = name;
        
        // Close modal
        document.getElementById('project-modal')?.remove();
        
        this.showToast(`Project "${name}" created! 🎉`, 'success');
    },

    // Switch Project
    switchProject(projectId) {
        if (!projectId) return;
        
        const projects = JSON.parse(localStorage.getItem('raycorp-projects') || '[]');
        const project = projects.find(p => p.id === projectId);
        
        if (project) {
            this.state.currentProject = projectId;
            document.getElementById('project-name-sidebar').textContent = project.name;
            this.saveState();
            this.showToast(`Switched to "${project.name}"`, 'info');
        }
    },

    // Filter by Status
    filterByStatus(status) {
        this.navigateTo('content-hub');
        setTimeout(() => {
            if (window.ContentHub) {
                ContentHub.setFilter?.(status);
            }
        }, 100);
    },

    // Open Bulk Create
    openBulkCreate() {
        if (window.UltraBulkCreate) {
            UltraBulkCreate.open();
        } else {
            this.showToast('Bulk Create not available', 'error');
        }
    },

    // Open AI Assistant
    openAIAssistant() {
        if (window.UltraAIAssistant) {
            UltraAIAssistant.open();
        }
    }
};

// Make functions globally available
window.UltraCore = UltraCore;
window.showToast = (msg, type) => UltraCore.showToast(msg, type);
window.quickGenerate = () => UltraCore.quickGenerate();
window.openProjectModal = () => UltraCore.openProjectModal();
window.switchProject = (id) => UltraCore.switchProject(id);
window.filterByStatus = (status) => UltraCore.filterByStatus(status);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    UltraCore.init();
});

// Add slideOutRight animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .content-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 10px;
        cursor: pointer;
        transition: background 0.2s;
    }
    .content-item:hover {
        background: var(--bg-hover);
    }
    .content-icon {
        font-size: 20px;
        width: 40px;
        height: 40px;
        background: var(--bg-muted);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .content-info {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .content-title {
        font-weight: 500;
        font-size: 13px;
        color: var(--text-primary);
    }
    .content-meta {
        font-size: 11px;
        color: var(--text-muted);
    }
    .status-badge {
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 10px;
        font-weight: 600;
        text-transform: capitalize;
    }
    .status-draft {
        background: var(--bg-muted);
        color: var(--text-muted);
    }
    .status-scheduled {
        background: rgba(245, 158, 11, 0.2);
        color: var(--warning);
    }
    .status-published {
        background: rgba(16, 185, 129, 0.2);
        color: var(--success);
    }
    .status-review {
        background: rgba(59, 130, 246, 0.2);
        color: var(--info);
    }
    
    .global-loading-content {
        text-align: center;
    }
    .loading-logo {
        font-size: 48px;
        margin-bottom: 16px;
        animation: pulse 1.5s infinite;
    }
    .loading-text {
        font-size: 16px;
        color: var(--text-secondary);
        margin-bottom: 20px;
    }
    .loading-bar {
        width: 200px;
        height: 4px;
        background: var(--bg-muted);
        border-radius: 2px;
        overflow: hidden;
    }
    .loading-bar-fill {
        width: 30%;
        height: 100%;
        background: var(--gradient-primary);
        animation: loading 1.5s infinite;
    }
    @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(400%); }
    }
`;
document.head.appendChild(style);
