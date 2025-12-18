/**
 * Database Module - Multi-Project & Knowledge Base System
 * Local Storage Management for LumakaraContent
 */

const DB = {
    KEYS: {
        PROJECTS: 'lc_projects',
        ACTIVE_PROJECT: 'lc_active_project',
        SETTINGS: 'lc_settings'
    },

    init() {
        if (!this.get(this.KEYS.PROJECTS)) this.set(this.KEYS.PROJECTS, []);
        if (!this.get(this.KEYS.SETTINGS)) this.set(this.KEYS.SETTINGS, { viewMode: 'table' });
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) { console.error('DB Get Error:', e); return null; }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) { console.error('DB Set Error:', e); return false; }
    },

    // ==================== PROJECT MANAGEMENT ====================
    projects: {
        getAll() { return DB.get(DB.KEYS.PROJECTS) || []; },
        getById(id) { return this.getAll().find(p => p.id === id); },
        getActive() {
            const activeId = DB.get(DB.KEYS.ACTIVE_PROJECT);
            return activeId ? this.getById(activeId) : null;
        },
        getActiveId() { return DB.get(DB.KEYS.ACTIVE_PROJECT); },
        setActive(projectId) { DB.set(DB.KEYS.ACTIVE_PROJECT, projectId); },

        create(data) {
            const projects = this.getAll();
            const newProject = {
                id: 'proj_' + Date.now(),
                createdAt: new Date().toISOString(),
                name: data.name || 'New Project',
                brandName: data.brandName || '',
                niche: data.niche || 'general',
                targetAudience: data.targetAudience || '',
                toneOfVoice: data.toneOfVoice || 'casual',
                platforms: data.platforms || ['instagram', 'tiktok'],
                contentPillars: data.contentPillars || [],
                postingDays: data.postingDays || ['mon', 'wed', 'fri'],
                postsPerDay: data.postsPerDay || 1
            };
            projects.push(newProject);
            DB.set(DB.KEYS.PROJECTS, projects);
            if (projects.length === 1) this.setActive(newProject.id);
            return newProject;
        },

        update(id, updates) {
            const projects = this.getAll();
            const index = projects.findIndex(p => p.id === id);
            if (index !== -1) {
                projects[index] = { ...projects[index], ...updates };
                DB.set(DB.KEYS.PROJECTS, projects);
                return projects[index];
            }
            return null;
        },

        delete(id) {
            const projects = this.getAll().filter(p => p.id !== id);
            DB.set(DB.KEYS.PROJECTS, projects);
            DB.knowledgeBase.clear(id);
            DB.content.clear(id);
            const activeId = DB.get(DB.KEYS.ACTIVE_PROJECT);
            if (activeId === id && projects.length > 0) this.setActive(projects[0].id);
            else if (projects.length === 0) DB.set(DB.KEYS.ACTIVE_PROJECT, null);
            return true;
        }
    },

    // ==================== KNOWLEDGE BASE ====================
    knowledgeBase: {
        _key(projectId) { return `lc_kb_${projectId}`; },
        
        get(projectId) {
            projectId = projectId || DB.projects.getActiveId();
            if (!projectId) return { documents: [], notes: [], guidelines: {}, pillars: [] };
            return DB.get(this._key(projectId)) || { documents: [], notes: [], guidelines: {}, pillars: [] };
        },

        save(projectId, data) {
            projectId = projectId || DB.projects.getActiveId();
            if (!projectId) return false;
            return DB.set(this._key(projectId), data);
        },

        addDocument(doc) {
            const projectId = DB.projects.getActiveId();
            const kb = this.get(projectId);
            const newDoc = {
                id: 'doc_' + Date.now(),
                createdAt: new Date().toISOString(),
                name: doc.name,
                type: doc.type,
                content: doc.content,
                category: doc.category || 'general'
            };
            kb.documents.push(newDoc);
            this.save(projectId, kb);
            return newDoc;
        },

        removeDocument(docId) {
            const projectId = DB.projects.getActiveId();
            const kb = this.get(projectId);
            kb.documents = kb.documents.filter(d => d.id !== docId);
            this.save(projectId, kb);
        },

        addNote(text, category = 'general') {
            const projectId = DB.projects.getActiveId();
            const kb = this.get(projectId);
            const note = { id: 'note_' + Date.now(), createdAt: new Date().toISOString(), content: text, category };
            kb.notes.push(note);
            this.save(projectId, kb);
            return note;
        },

        removeNote(noteId) {
            const projectId = DB.projects.getActiveId();
            const kb = this.get(projectId);
            kb.notes = kb.notes.filter(n => n.id !== noteId);
            this.save(projectId, kb);
        },

        updateGuidelines(guidelines) {
            const projectId = DB.projects.getActiveId();
            const kb = this.get(projectId);
            kb.guidelines = { ...kb.guidelines, ...guidelines };
            this.save(projectId, kb);
        },

        addPillar(pillar) {
            const projectId = DB.projects.getActiveId();
            const kb = this.get(projectId);
            if (!kb.pillars.includes(pillar)) {
                kb.pillars.push(pillar);
                this.save(projectId, kb);
            }
        },

        removePillar(pillar) {
            const projectId = DB.projects.getActiveId();
            const kb = this.get(projectId);
            kb.pillars = kb.pillars.filter(p => p !== pillar);
            this.save(projectId, kb);
        },

        getPillars() {
            return this.get().pillars || [];
        },

        getNotes() {
            return this.get().notes || [];
        },

        // Get context string for AI prompts
        getContextString() {
            const projectId = DB.projects.getActiveId();
            const project = DB.projects.getById(projectId);
            const kb = this.get(projectId);
            if (!project) return '';

            let context = `
=== BRAND INFORMATION ===
Brand: ${project.brandName || project.name}
Niche: ${project.niche}
Target Audience: ${project.targetAudience}
Tone: ${project.toneOfVoice}
Content Pillars: ${kb.pillars?.join(', ') || 'Not set'}
`;
            if (kb.guidelines) {
                const g = kb.guidelines;
                if (g.brandVoice) context += `\nBrand Voice: ${g.brandVoice}`;
                if (g.keyMessages) context += `\nKey Messages: ${g.keyMessages}`;
                if (g.wordsToUse) context += `\nWords to Use: ${g.wordsToUse}`;
                if (g.wordsToAvoid) context += `\nWords to Avoid: ${g.wordsToAvoid}`;
            }
            if (kb.documents?.length > 0) {
                context += `\n\n=== KNOWLEDGE BASE ===\n`;
                kb.documents.forEach(doc => {
                    context += `[${doc.category}] ${doc.name}: ${doc.content.substring(0, 500)}\n`;
                });
            }
            if (kb.notes?.length > 0) {
                context += `\n=== NOTES ===\n`;
                kb.notes.forEach(n => context += `- [${n.category}] ${n.content}\n`);
            }
            return context;
        },

        clear(projectId) { localStorage.removeItem(this._key(projectId)); }
    },

    // ==================== CONTENT MANAGEMENT ====================
    content: {
        _key(projectId) { return `lc_content_${projectId}`; },

        getAll(projectId) {
            projectId = projectId || DB.projects.getActiveId();
            if (!projectId) return [];
            return DB.get(this._key(projectId)) || [];
        },

        getById(id, projectId) {
            return this.getAll(projectId).find(c => c.id === id);
        },

        add(content, projectId) {
            projectId = projectId || DB.projects.getActiveId();
            if (!projectId) return null;
            const contents = this.getAll(projectId);
            const newContent = {
                id: 'cnt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                projectId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                type: content.type || 'post',
                platform: content.platform || 'instagram',
                status: content.status || 'draft',
                scheduledDate: content.scheduledDate || null,
                scheduledTime: content.scheduledTime || null,
                title: content.title || '',
                caption: content.caption || '',
                hashtags: content.hashtags || [],
                imagePrompt: content.imagePrompt || '',
                imageUrl: content.imageUrl || '',
                videoScript: content.videoScript || '',
                slides: content.slides || [],
                pillar: content.pillar || '',
                hook: content.hook || '',
                cta: content.cta || '',
                notes: content.notes || ''
            };
            contents.push(newContent);
            DB.set(this._key(projectId), contents);
            return newContent;
        },

        addBulk(contentArray, projectId) {
            projectId = projectId || DB.projects.getActiveId();
            const results = [];
            contentArray.forEach(c => results.push(this.add(c, projectId)));
            return results;
        },

        update(id, updates, projectId) {
            projectId = projectId || DB.projects.getActiveId();
            const contents = this.getAll(projectId);
            const index = contents.findIndex(c => c.id === id);
            if (index !== -1) {
                contents[index] = { ...contents[index], ...updates, updatedAt: new Date().toISOString() };
                DB.set(this._key(projectId), contents);
                return contents[index];
            }
            return null;
        },

        delete(id, projectId) {
            projectId = projectId || DB.projects.getActiveId();
            const contents = this.getAll(projectId).filter(c => c.id !== id);
            DB.set(this._key(projectId), contents);
            return true;
        },

        getByStatus(status, projectId) {
            return this.getAll(projectId).filter(c => c.status === status);
        },

        getByPlatform(platform, projectId) {
            return this.getAll(projectId).filter(c => c.platform === platform);
        },

        getByDate(date, projectId) {
            return this.getAll(projectId).filter(c => c.scheduledDate === date);
        },

        getByMonth(year, month, projectId) {
            const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
            const end = `${year}-${String(month + 1).padStart(2, '0')}-31`;
            return this.getAll(projectId).filter(c => c.scheduledDate >= start && c.scheduledDate <= end);
        },

        getStats(projectId) {
            const contents = this.getAll(projectId);
            return {
                total: contents.length,
                idea: contents.filter(c => c.status === 'idea').length,
                draft: contents.filter(c => c.status === 'draft').length,
                review: contents.filter(c => c.status === 'review').length,
                scheduled: contents.filter(c => c.status === 'scheduled').length,
                published: contents.filter(c => c.status === 'published').length,
                byPlatform: {
                    instagram: contents.filter(c => c.platform === 'instagram').length,
                    tiktok: contents.filter(c => c.platform === 'tiktok').length,
                    twitter: contents.filter(c => c.platform === 'twitter').length,
                    linkedin: contents.filter(c => c.platform === 'linkedin').length,
                    facebook: contents.filter(c => c.platform === 'facebook').length,
                    youtube: contents.filter(c => c.platform === 'youtube').length,
                    blog: contents.filter(c => c.platform === 'blog').length
                }
            };
        },

        search(query, projectId) {
            const q = query.toLowerCase();
            return this.getAll(projectId).filter(c =>
                c.title?.toLowerCase().includes(q) ||
                c.caption?.toLowerCase().includes(q) ||
                c.hashtags?.some(h => h.toLowerCase().includes(q))
            );
        },

        clear(projectId) { localStorage.removeItem(this._key(projectId)); }
    },

    // ==================== SETTINGS ====================
    settings: {
        get() { return DB.get(DB.KEYS.SETTINGS) || {}; },
        update(updates) { DB.set(DB.KEYS.SETTINGS, { ...this.get(), ...updates }); },
        getViewMode() { return this.get().viewMode || 'table'; },
        setViewMode(mode) { this.update({ viewMode: mode }); }
    },

    // ==================== EXPORT/IMPORT ====================
    exportAll() {
        const projectId = this.projects.getActiveId();
        return {
            projects: this.projects.getAll(),
            activeProject: projectId,
            knowledgeBase: this.knowledgeBase.get(projectId),
            content: this.content.getAll(projectId),
            settings: this.settings.get()
        };
    },

    importAll(data) {
        if (data.projects) this.set(this.KEYS.PROJECTS, data.projects);
        if (data.activeProject) this.set(this.KEYS.ACTIVE_PROJECT, data.activeProject);
        if (data.knowledgeBase && data.activeProject) {
            this.knowledgeBase.save(data.activeProject, data.knowledgeBase);
        }
        if (data.content && data.activeProject) {
            this.set(`lc_content_${data.activeProject}`, data.content);
        }
        if (data.settings) this.set(this.KEYS.SETTINGS, data.settings);
    }
};

DB.init();
