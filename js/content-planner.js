/**
 * Content Planner Module
 * Handles calendar, scheduling, and content planning
 */

const ContentPlanner = {
    currentDate: new Date(),
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),

    // Month names in Indonesian
    monthNames: [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ],

    // Day names
    dayNames: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],

    // Initialize calendar
    init() {
        this.renderCalendar();
        this.loadTodayContent();
    },

    // Render calendar grid
    renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        if (!grid) return;

        grid.innerHTML = '';

        // Add day headers
        this.dayNames.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            header.style.cssText = 'text-align: center; padding: 10px; font-weight: 600; color: var(--text-secondary);';
            grid.appendChild(header);
        });

        // Get first day of month and total days
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const today = new Date();

        // Get calendar data
        const calendarData = DB.calendar.getMonthContent(this.currentYear, this.currentMonth);

        // Add empty cells for days before first day
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            emptyCell.style.opacity = '0.3';
            grid.appendChild(emptyCell);
        }

        // Add day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayContent = calendarData[dateStr] || [];
            const contents = dayContent.map(id => DB.content.getById(id)).filter(Boolean);

            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            // Check if today
            if (day === today.getDate() && 
                this.currentMonth === today.getMonth() && 
                this.currentYear === today.getFullYear()) {
                dayCell.classList.add('today');
            }

            // Check if has content
            if (contents.length > 0) {
                dayCell.classList.add('has-content');
            }

            dayCell.innerHTML = `
                <div class="day-header">
                    <span class="day-number">${day}</span>
                </div>
                <div class="day-content">
                    ${contents.slice(0, 3).map(c => `
                        <div class="content-preview">
                            <span class="content-dot ${c.type}"></span>
                            <span class="content-title">${c.topic?.substring(0, 15) || c.type}...</span>
                        </div>
                    `).join('')}
                    ${contents.length > 3 ? `<span class="more-content">+${contents.length - 3} more</span>` : ''}
                </div>
            `;

            dayCell.onclick = () => this.openDayModal(dateStr, contents);
            grid.appendChild(dayCell);
        }

        // Update month display
        const monthDisplay = document.getElementById('current-month');
        if (monthDisplay) {
            monthDisplay.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
        }
    },

    // Navigate to previous month
    prevMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderCalendar();
    },

    // Navigate to next month
    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.renderCalendar();
    },

    // Load today's content
    loadTodayContent() {
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const contentIds = DB.calendar.getByDate(dateStr);
        const contents = contentIds.map(id => DB.content.getById(id)).filter(Boolean);

        const container = document.getElementById('today-content');
        if (!container) return;

        if (contents.length === 0) {
            container.innerHTML = '<p class="no-content">Tidak ada konten terjadwal hari ini</p>';
            return;
        }

        container.innerHTML = contents.map(c => `
            <div class="today-content-item" onclick="openContentModal('${c.id}')">
                <span class="content-type-badge ${c.type}">${c.type}</span>
                <span class="content-topic">${c.topic || 'Untitled'}</span>
                <span class="content-status ${c.status}">${c.status}</span>
            </div>
        `).join('');
    },

    // Open day modal
    openDayModal(dateStr, contents) {
        const modal = document.getElementById('content-modal');
        const modalBody = document.getElementById('modal-body');
        
        const date = new Date(dateStr);
        const formattedDate = `${date.getDate()} ${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;

        modalBody.innerHTML = `
            <h2>📅 ${formattedDate}</h2>
            <div class="day-modal-content">
                ${contents.length === 0 ? `
                    <p class="no-content">Belum ada konten terjadwal</p>
                    <button class="action-btn primary" onclick="quickAddContent('${dateStr}')">
                        + Tambah Konten
                    </button>
                ` : `
                    <div class="scheduled-content-list">
                        ${contents.map(c => `
                            <div class="scheduled-content-item">
                                <div class="content-header">
                                    <span class="content-type-badge ${c.type}">${c.type}</span>
                                    <span class="content-status ${c.status}">${c.status}</span>
                                </div>
                                <h4>${c.topic || 'Untitled'}</h4>
                                <p class="content-preview">${c.content?.substring(0, 150) || ''}...</p>
                                <div class="content-actions">
                                    <button onclick="editContent('${c.id}')">✏️ Edit</button>
                                    <button onclick="viewContent('${c.id}')">👁️ View</button>
                                    <button onclick="removeFromCalendar('${dateStr}', '${c.id}')">🗑️ Remove</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="action-btn" onclick="quickAddContent('${dateStr}')">
                        + Tambah Konten Lain
                    </button>
                `}
            </div>
        `;

        modal.classList.add('show');
    },

    // Generate weekly plan
    async generateWeeklyPlan() {
        showLoading();
        
        try {
            const pillars = DB.pillars.getAll();
            const pillar = pillars[Math.floor(Math.random() * pillars.length)] || 'General';
            
            const plan = await ContentTemplates.generateWeeklyPlan(pillar);
            
            // Parse and save the plan
            const today = new Date();
            const contents = this.parseWeeklyPlan(plan);
            
            contents.forEach((content, index) => {
                const date = new Date(today);
                date.setDate(date.getDate() + index);
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                
                const saved = DB.content.add({
                    type: content.type || 'text',
                    topic: content.topic,
                    content: content.content,
                    status: 'scheduled',
                    scheduledDate: dateStr
                });
                
                DB.calendar.addToDate(dateStr, saved.id);
            });

            this.renderCalendar();
            hideLoading();
            showToast('Weekly plan berhasil di-generate!', 'success');
            
            // Show the generated plan
            const modal = document.getElementById('content-modal');
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = `
                <h2>📅 Weekly Content Plan</h2>
                <div class="generated-plan">
                    <pre>${plan}</pre>
                </div>
                <button class="action-btn primary" onclick="closeModal()">OK</button>
            `;
            modal.classList.add('show');
            
        } catch (error) {
            hideLoading();
            showToast('Gagal generate weekly plan', 'error');
            console.error(error);
        }
    },

    // Parse weekly plan from AI response
    parseWeeklyPlan(planText) {
        const contents = [];
        const dayRegex = /---HARI \d+---[\s\S]*?(?=---HARI|---END---|$)/gi;
        const matches = planText.match(dayRegex) || [];

        matches.forEach(match => {
            const typeMatch = match.match(/Tipe:\s*(.+)/i);
            const topicMatch = match.match(/Topik:\s*(.+)/i);
            const hookMatch = match.match(/Hook:\s*(.+)/i);
            const outlineMatch = match.match(/Outline:\s*([\s\S]*?)(?=CTA:|Best Time:|---)/i);

            contents.push({
                type: this.mapContentType(typeMatch?.[1] || 'post'),
                topic: topicMatch?.[1]?.trim() || 'Untitled',
                content: `${hookMatch?.[1] || ''}\n\n${outlineMatch?.[1] || ''}`.trim()
            });
        });

        // If parsing failed, create 7 placeholder contents
        if (contents.length === 0) {
            for (let i = 0; i < 7; i++) {
                contents.push({
                    type: 'text',
                    topic: `Content Day ${i + 1}`,
                    content: planText
                });
            }
        }

        return contents.slice(0, 7);
    },

    // Map content type string to type key
    mapContentType(typeStr) {
        const str = typeStr.toLowerCase();
        if (str.includes('reel') || str.includes('video')) return 'video';
        if (str.includes('carousel') || str.includes('image')) return 'image';
        return 'text';
    },

    // Generate monthly plan
    async generateMonthlyPlan() {
        showLoading();
        
        try {
            const strategy = DB.strategy.get();
            const pillars = DB.pillars.getAll();
            
            // Generate 4 weeks of content
            for (let week = 0; week < 4; week++) {
                const pillar = pillars[week % pillars.length] || 'General';
                const plan = await ContentTemplates.generateWeeklyPlan(pillar);
                const contents = this.parseWeeklyPlan(plan);
                
                const startDate = new Date();
                startDate.setDate(startDate.getDate() + (week * 7));
                
                contents.forEach((content, index) => {
                    const date = new Date(startDate);
                    date.setDate(date.getDate() + index);
                    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    
                    const saved = DB.content.add({
                        type: content.type || 'text',
                        topic: content.topic,
                        content: content.content,
                        status: 'scheduled',
                        scheduledDate: dateStr,
                        pillar
                    });
                    
                    DB.calendar.addToDate(dateStr, saved.id);
                });
            }

            this.renderCalendar();
            hideLoading();
            showToast('Monthly plan berhasil di-generate! (28 konten)', 'success');
            
        } catch (error) {
            hideLoading();
            showToast('Gagal generate monthly plan', 'error');
            console.error(error);
        }
    },

    // Schedule content to date
    scheduleContent(contentId, dateStr) {
        const content = DB.content.getById(contentId);
        if (!content) return false;

        DB.content.update(contentId, {
            status: 'scheduled',
            scheduledDate: dateStr
        });
        
        DB.calendar.addToDate(dateStr, contentId);
        this.renderCalendar();
        return true;
    },

    // Remove content from calendar
    removeFromCalendar(dateStr, contentId) {
        DB.calendar.removeFromDate(dateStr, contentId);
        DB.content.update(contentId, {
            status: 'draft',
            scheduledDate: null
        });
        this.renderCalendar();
        closeModal();
        showToast('Konten dihapus dari jadwal', 'success');
    },

    // Get upcoming content
    getUpcomingContent(days = 7) {
        const upcoming = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            
            const contentIds = DB.calendar.getByDate(dateStr);
            const contents = contentIds.map(id => DB.content.getById(id)).filter(Boolean);
            
            if (contents.length > 0) {
                upcoming.push({
                    date: dateStr,
                    contents
                });
            }
        }

        return upcoming;
    }
};

// Global functions for calendar
function prevMonth() {
    ContentPlanner.prevMonth();
}

function nextMonth() {
    ContentPlanner.nextMonth();
}

function generateWeeklyPlan() {
    ContentPlanner.generateWeeklyPlan();
}

function generateMonthlyPlan() {
    ContentPlanner.generateMonthlyPlan();
}

function removeFromCalendar(dateStr, contentId) {
    ContentPlanner.removeFromCalendar(dateStr, contentId);
}

function quickAddContent(dateStr) {
    closeModal();
    navigateTo('generator');
    // Store the date for later use
    window.pendingScheduleDate = dateStr;
    showToast(`Generate konten untuk ${dateStr}`, 'info');
}
