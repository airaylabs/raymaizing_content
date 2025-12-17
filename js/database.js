/**
 * Database Module - Local Storage Management
 * Handles all data persistence for the Social Media AI Framework
 */

const DB = {
    // Storage keys
    KEYS: {
        STRATEGY: 'smaf_strategy',
        CONTENT: 'smaf_content',
        CALENDAR: 'smaf_calendar',
        ANALYTICS: 'smaf_analytics',
        SETTINGS: 'smaf_settings',
        PILLARS: 'smaf_pillars'
    },

    // Initialize database with default values
    init() {
        if (!this.get(this.KEYS.STRATEGY)) {
            this.set(this.KEYS.STRATEGY, {
                brandName: '',
                niche: '',
                targetAudience: '',
                toneOfVoice: 'casual',
                platforms: ['instagram', 'tiktok']
            });
        }
        if (!this.get(this.KEYS.CONTENT)) {
            this.set(this.KEYS.CONTENT, []);
        }
        if (!this.get(this.KEYS.CALENDAR)) {
            this.set(this.KEYS.CALENDAR, {});
        }
        if (!this.get(this.KEYS.ANALYTICS)) {
            this.set(this.KEYS.ANALYTICS, {
                totalViews: 0,
                totalEngagement: 0,
                contentPerformance: []
            });
        }
        if (!this.get(this.KEYS.PILLARS)) {
            this.set(this.KEYS.PILLARS, []);
        }
        if (!this.get(this.KEYS.SETTINGS)) {
            this.set(this.KEYS.SETTINGS, {
                n8nWebhook: '',
                customAiEndpoint: '',
                theme: 'dark'
            });
        }
    },

    // Get data from localStorage
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('DB Get Error:', e);
            return null;
        }
    },

    // Set data to localStorage
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('DB Set Error:', e);
            return false;
        }
    },

    // Content CRUD operations
    content: {
        getAll() {
            return DB.get(DB.KEYS.CONTENT) || [];
        },

        getById(id) {
            const contents = this.getAll();
            return contents.find(c => c.id === id);
        },

        add(content) {
            const contents = this.getAll();
            const newContent = {
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'draft',
                viralScore: 0,
                ...content
            };
            contents.unshift(newContent);
            DB.set(DB.KEYS.CONTENT, contents);
            return newContent;
        },

        update(id, updates) {
            const contents = this.getAll();
            const index = contents.findIndex(c => c.id === id);
            if (index !== -1) {
                contents[index] = {
                    ...contents[index],
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                DB.set(DB.KEYS.CONTENT, contents);
                return contents[index];
            }
            return null;
        },

        delete(id) {
            const contents = this.getAll();
            const filtered = contents.filter(c => c.id !== id);
            DB.set(DB.KEYS.CONTENT, filtered);
            return true;
        },

        getByStatus(status) {
            return this.getAll().filter(c => c.status === status);
        },

        getByType(type) {
            return this.getAll().filter(c => c.type === type);
        },

        search(query) {
            const q = query.toLowerCase();
            return this.getAll().filter(c => 
                c.content?.toLowerCase().includes(q) ||
                c.topic?.toLowerCase().includes(q) ||
                c.hashtags?.some(h => h.toLowerCase().includes(q))
            );
        }
    },

    // Calendar operations
    calendar: {
        get() {
            return DB.get(DB.KEYS.CALENDAR) || {};
        },

        getByDate(date) {
            const calendar = this.get();
            return calendar[date] || [];
        },

        addToDate(date, contentId) {
            const calendar = this.get();
            if (!calendar[date]) {
                calendar[date] = [];
            }
            if (!calendar[date].includes(contentId)) {
                calendar[date].push(contentId);
            }
            DB.set(DB.KEYS.CALENDAR, calendar);
        },

        removeFromDate(date, contentId) {
            const calendar = this.get();
            if (calendar[date]) {
                calendar[date] = calendar[date].filter(id => id !== contentId);
            }
            DB.set(DB.KEYS.CALENDAR, calendar);
        },

        getMonthContent(year, month) {
            const calendar = this.get();
            const result = {};
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                result[dateStr] = calendar[dateStr] || [];
            }
            return result;
        }
    },

    // Strategy operations
    strategy: {
        get() {
            return DB.get(DB.KEYS.STRATEGY) || {};
        },

        save(data) {
            DB.set(DB.KEYS.STRATEGY, data);
        },

        update(updates) {
            const current = this.get();
            DB.set(DB.KEYS.STRATEGY, { ...current, ...updates });
        }
    },

    // Pillars operations
    pillars: {
        getAll() {
            return DB.get(DB.KEYS.PILLARS) || [];
        },

        add(pillar) {
            const pillars = this.getAll();
            if (!pillars.includes(pillar)) {
                pillars.push(pillar);
                DB.set(DB.KEYS.PILLARS, pillars);
            }
            return pillars;
        },

        remove(pillar) {
            const pillars = this.getAll().filter(p => p !== pillar);
            DB.set(DB.KEYS.PILLARS, pillars);
            return pillars;
        }
    },

    // Settings operations
    settings: {
        get() {
            return DB.get(DB.KEYS.SETTINGS) || {};
        },

        save(data) {
            DB.set(DB.KEYS.SETTINGS, data);
        },

        update(updates) {
            const current = this.get();
            DB.set(DB.KEYS.SETTINGS, { ...current, ...updates });
        }
    },

    // Analytics operations
    analytics: {
        get() {
            return DB.get(DB.KEYS.ANALYTICS) || {};
        },

        update(updates) {
            const current = this.get();
            DB.set(DB.KEYS.ANALYTICS, { ...current, ...updates });
        },

        addPerformance(contentId, metrics) {
            const analytics = this.get();
            if (!analytics.contentPerformance) {
                analytics.contentPerformance = [];
            }
            analytics.contentPerformance.push({
                contentId,
                date: new Date().toISOString(),
                ...metrics
            });
            DB.set(DB.KEYS.ANALYTICS, analytics);
        }
    },

    // Export all data
    exportAll() {
        return {
            strategy: this.get(this.KEYS.STRATEGY),
            content: this.get(this.KEYS.CONTENT),
            calendar: this.get(this.KEYS.CALENDAR),
            analytics: this.get(this.KEYS.ANALYTICS),
            pillars: this.get(this.KEYS.PILLARS),
            settings: this.get(this.KEYS.SETTINGS),
            exportedAt: new Date().toISOString()
        };
    },

    // Import data
    importAll(data) {
        if (data.strategy) this.set(this.KEYS.STRATEGY, data.strategy);
        if (data.content) this.set(this.KEYS.CONTENT, data.content);
        if (data.calendar) this.set(this.KEYS.CALENDAR, data.calendar);
        if (data.analytics) this.set(this.KEYS.ANALYTICS, data.analytics);
        if (data.pillars) this.set(this.KEYS.PILLARS, data.pillars);
        if (data.settings) this.set(this.KEYS.SETTINGS, data.settings);
    },

    // Clear all data
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.init();
    }
};

// Initialize on load
DB.init();
