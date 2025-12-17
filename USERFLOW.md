# 📋 LUMAKARA CONTENT - COMPLETE USERFLOW DOCUMENTATION

> **Version 1.0 | December 2024**
> **Dokumentasi lengkap alur penggunaan sistem**

---

## 🎯 OVERVIEW SISTEM

### Tujuan Utama
Sistem omnichannel content management untuk mengelola konten social media satu brand/perusahaan dengan:
- Auto-generate 1 bulan konten berdasarkan Knowledge Base
- Multi-view management (Table, Kanban, Calendar)
- Full CRUD operations
- AI-powered content generation

### Tech Stack
- Frontend: Vanilla HTML, CSS, JavaScript
- AI: Pollinations AI (Free, no API key)
- Storage: LocalStorage (client-side)
- Deployment: Vercel-ready

---

## 🚀 USERFLOW LENGKAP

---

## FASE 1: FIRST TIME USER (Onboarding)

### 1.1 User Membuka Website
```
URL: http://localhost:3000 atau domain Vercel
```

**Kondisi Awal:**
- Tidak ada project tersimpan di LocalStorage
- Dashboard kosong
- Stats menunjukkan 0

**Yang Terjadi:**
1. Sistem load `index.html`
2. JavaScript modules di-load secara berurutan:
   - `database.js` → Initialize DB
   - `pollinations.js` → AI integration
   - `content-generator.js` → Content templates
   - `app.js` → Main application
   - `lumakara-setup.js` → Auto-setup Lumakara

3. `DOMContentLoaded` event trigger `initApp()`
4. Setelah 500ms, sistem cek apakah ada project
5. Jika tidak ada project → Auto-create Lumakara project

**UI State:**
- Project selector: "Pilih Project..."
- Dashboard: Empty state
- Button "Setup Lumakara Project" muncul (jika auto-setup gagal)

### 1.2 Auto-Setup Lumakara Project
```
Trigger: Otomatis saat pertama kali buka (jika tidak ada project)
Manual: Klik tombol "Setup Lumakara Project"
```

**Proses:**
1. `LumakaraSetup.init()` dipanggil
2. Cek apakah project "Lumakara" sudah ada
3. Jika belum ada:
   - Create project dengan data lengkap
   - Set sebagai active project
   - Add guidelines ke Knowledge Base
   - Add 7 content pillars
   - Add 4 documents
   - Add 13 notes

**Data yang Dibuat:**

| Item | Jumlah | Detail |
|------|--------|--------|
| Project | 1 | Lumakara dengan semua settings |
| Guidelines | 4 fields | Brand voice, key messages, words to use, words to avoid |
| Pillars | 7 | Brand Strategy, Business Transformation, dll |
| Documents | 4 | Company Identity, Team, Services, Visual Identity |
| Notes | 13 | Brand, audience, competitor insights |

**UI Update:**
- Project selector: "Lumakara" selected
- Project info bar: "Lumakara • business"
- Dashboard project name: "Lumakara"
- Toast: "Lumakara project created with complete knowledge base!"

---

## FASE 2: DASHBOARD

### 2.1 Dashboard View
```
Navigation: Sidebar → Dashboard (default active)
```

**Komponen Dashboard:**

#### A. Stats Grid (4 cards)
| Card | Data Source | Calculation |
|------|-------------|-------------|
| Total Konten | `DB.content.getAll().length` | Count semua content |
| Draft | `stats.draft + stats.idea` | Status draft + idea |
| Scheduled | `stats.scheduled` | Status scheduled |
| Published | `stats.published` | Status published |

#### B. Platform Distribution
- Bar chart horizontal
- Menampilkan jumlah konten per platform
- Platforms: Instagram, TikTok, Twitter, LinkedIn, Facebook, YouTube, Blog
- Width bar = (count / maxCount) * 100%

#### C. Week Preview
- 7 hari (Sun-Sat) dari minggu ini
- Menampilkan tanggal dan jumlah konten per hari
- Hari ini di-highlight dengan warna primary
- Data dari `DB.content.getByDate(dateStr)`

#### D. Upcoming Content
- List 5 konten terdekat yang belum published
- Filter: `scheduledDate >= today && status !== 'published'`
- Sort: by scheduledDate ascending
- Klik item → Open content detail modal

### 2.2 Auto-Generate Monthly Content
```
Trigger: Klik tombol "⚡ Auto-Generate 1 Bulan"
```

**Pre-conditions:**
- Harus ada active project
- Harus ada minimal 1 content pillar di Knowledge Base

**Proses:**
1. Validasi project dan pillars
2. Show loading: "Generating monthly content plan..."
3. Call `ContentGenerator.generateMonthlyPlan(year, month)`
4. AI generate content ideas berdasarkan:
   - Knowledge Base context
   - Content pillars
   - Posting days (dari project settings)
   - Active platforms
5. Parse AI response menjadi array of content objects
6. `DB.content.addBulk(posts)` - simpan semua ke database
7. Hide loading
8. Toast: "{count} content items generated!"
9. Redirect ke Content Hub

**AI Prompt Structure:**
```
[Knowledge Base Context]
- Brand info, guidelines, documents, notes

[Task]
- Create monthly content plan
- Total posts needed: X
- Platforms: [list]
- Content Pillars: [list]
- Posting days: [list]

[Output Format]
---POST---
TITLE: [title]
TOPIC: [topic]
PLATFORM: [platform]
TYPE: [type]
PILLAR: [pillar]
CAPTION_IDEA: [caption]
---END---
```

**Content Object Structure:**
```javascript
{
  id: 'cnt_timestamp_random',
  projectId: 'proj_xxx',
  createdAt: ISO string,
  updatedAt: ISO string,
  type: 'post|reel|story|carousel|thread|article',
  platform: 'instagram|tiktok|twitter|linkedin|facebook|youtube|blog',
  status: 'draft',
  scheduledDate: 'YYYY-MM-DD',
  scheduledTime: '09:00',
  title: string,
  caption: string,
  hashtags: [],
  imagePrompt: '',
  imageUrl: '',
  videoScript: '',
  slides: [],
  pillar: string,
  hook: '',
  cta: '',
  notes: ''
}
```

---

## FASE 3: CONTENT HUB

### 3.1 Content Hub Overview
```
Navigation: Sidebar → Content Hub
```

**Komponen:**
1. Header dengan view switcher
2. Filter bar
3. Content view (Table/Kanban/Calendar)

### 3.2 View Switcher
```
Location: Header actions
Options: Table | Kanban | Calendar
```

**Behavior:**
- Klik view button → `switchView(viewName)`
- Update button active state
- Show/hide corresponding view div
- Save preference ke `DB.settings.setViewMode(mode)`
- Re-render content dengan view baru

### 3.3 Filters
```
Location: Below header
```

| Filter | Type | Options | Function |
|--------|------|---------|----------|
| Search | Text input | Free text | Filter by title/caption |
| Platform | Select | All + 7 platforms | Filter by platform |
| Status | Select | All + 5 statuses | Filter by status |
| Month | Select | All + available months | Filter by scheduledDate |

**Filter Logic:**
```javascript
function getFilteredContent() {
  let contents = DB.content.getAll();
  
  if (search) contents = contents.filter(c => 
    c.title?.includes(search) || c.caption?.includes(search));
  if (platform !== 'all') contents = contents.filter(c => 
    c.platform === platform);
  if (status !== 'all') contents = contents.filter(c => 
    c.status === status);
  if (month !== 'all') contents = contents.filter(c => 
    c.scheduledDate?.startsWith(month));
  
  return contents.sort((a, b) => 
    a.scheduledDate?.localeCompare(b.scheduledDate));
}
```


### 3.4 Table View
```
View: ☰ Table (default)
```

**Columns:**
| Column | Content | Width |
|--------|---------|-------|
| Title | Title + caption preview (50 chars) | flex |
| Platform | Platform badge dengan warna | 100px |
| Type | Content type text | 80px |
| Status | Status badge dengan warna | 100px |
| Date | scheduledDate atau "-" | 100px |
| Actions | View, Edit, Delete buttons | 120px |

**Platform Badge Colors:**
```css
instagram: #FCE7F3 / #BE185D
tiktok: #F3E8FF / #7C3AED
twitter: #DBEAFE / #1D4ED8
linkedin: #DBEAFE / #1E40AF
facebook: #DBEAFE / #1E3A8A
youtube: #FEE2E2 / #DC2626
blog: #D1FAE5 / #065F46
```

**Status Badge Colors:**
```css
idea: #F3F4F6 / #6B7280
draft: #FEF3C7 / #92400E
review: #FEE2E2 / #DC2626
scheduled: #DBEAFE / #1E40AF
published: #D1FAE5 / #065F46
```

**Row Actions:**
- 👁 View → `openContentDetail(id)`
- ✏️ Edit → `openContentEditor(id)`
- 🗑️ Delete → `deleteContent(id)`

### 3.5 Kanban View
```
View: ▦ Kanban
```

**Columns (5):**
| Column | Status | Header |
|--------|--------|--------|
| 1 | idea | 💡 Ideas |
| 2 | draft | 📝 Draft |
| 3 | review | 👀 Review |
| 4 | scheduled | 📅 Scheduled |
| 5 | published | ✅ Published |

**Card Content:**
- Title (truncated)
- Platform badge
- Scheduled date

**Drag & Drop:**
1. Card draggable="true"
2. dragstart → set dataTransfer dengan content ID
3. Column dragover → prevent default, highlight
4. Column drop → update content status
5. Re-render kanban view
6. Toast: "Status updated!"

**Drag & Drop Code:**
```javascript
// Card
card.addEventListener('dragstart', e => {
  e.dataTransfer.setData('text/plain', card.dataset.id);
});

// Column
column.addEventListener('drop', e => {
  const contentId = e.dataTransfer.getData('text/plain');
  const newStatus = column.dataset.status;
  DB.content.update(contentId, { status: newStatus });
  renderKanbanView();
});
```

### 3.6 Calendar View (Content Hub)
```
View: 📅 Calendar
```

**Components:**
1. Navigation: ← Previous | Month Year | Next →
2. Day headers: Sun Mon Tue Wed Thu Fri Sat
3. Calendar grid: 7 columns × 5-6 rows

**Day Cell Content:**
- Day number
- Content dots (max 3 visible)
- "+X" indicator jika lebih dari 3

**Content Dot:**
- Background color = platform color
- Text = platform abbreviation (IG, TT, etc)

**Interactions:**
- Klik day → `openDayDetail(dateStr)`
- Modal shows all content for that day
- Option to add new content for that day

### 3.7 Create New Content
```
Trigger: Klik "+ New Content" button
```

**Modal Fields:**

| Field | Type | Options/Placeholder |
|-------|------|---------------------|
| Title | Text | "Content title" |
| Platform | Select | 7 platforms |
| Type | Select | post, reel, story, carousel, thread, article |
| Status | Select | idea, draft, review, scheduled, published |
| Pillar | Select | From Knowledge Base pillars |
| Scheduled Date | Date | Date picker |
| Time | Time | Default "09:00" |
| Caption | Textarea | "Write your caption..." |
| Hashtags | Text | "#hashtag1 #hashtag2" |
| Image URL | Text | "https://..." |
| Notes | Textarea | "Internal notes..." |

**Save Process:**
1. Collect all field values
2. Parse hashtags (match #\w+)
3. `DB.content.add(data)`
4. Close modal
5. Reload Content Hub
6. Reload Dashboard stats
7. Toast: "Content created!"

### 3.8 Edit Content
```
Trigger: Klik Edit button atau dari detail modal
```

**Same as Create, but:**
- Pre-fill semua fields dengan existing data
- Button text: "Save Changes"
- Additional "Delete" button
- On save: `DB.content.update(id, data)`
- Toast: "Content updated!"

### 3.9 View Content Detail
```
Trigger: Klik content item atau View button
```

**Modal Content:**
- Title (h2)
- Platform badge + Status badge + Type
- Image (if imageUrl exists)
- Caption (pre-formatted)
- Hashtags (as tags)
- Schedule info (date + time)
- Pillar info
- Notes (if exists, yellow background)

**Actions:**
- 📋 Copy Caption → copy to clipboard
- ✏️ Edit → open editor modal

### 3.10 Delete Content
```
Trigger: Klik Delete button
```

**Process:**
1. Confirm dialog: "Delete this content?"
2. If confirmed: `DB.content.delete(id)`
3. Reload Content Hub
4. Reload Dashboard
5. Toast: "Content deleted"

---

## FASE 4: KNOWLEDGE BASE

### 4.1 Knowledge Base Overview
```
Navigation: Sidebar → Knowledge Base
```

**4 Sections:**
1. Brand Guidelines
2. Documents & Files
3. Quick Notes
4. Content Pillars

### 4.2 Brand Guidelines
```
Section: 📋 Brand Guidelines
```

**Fields:**
| Field | Purpose | Example |
|-------|---------|---------|
| Brand Voice & Personality | Tone, character | "Friendly, professional, sedikit humor..." |
| Key Messages (USP) | Core messages | "Let's grow your brand with clarity..." |
| Words to Use | Vocabulary | "clarity, growth, transformation..." |
| Words to Avoid | Forbidden words | "murah, cepat, instan, diskon..." |

**Save Process:**
1. Klik "Save Guidelines"
2. `DB.knowledgeBase.updateGuidelines({...})`
3. Toast: "Guidelines saved!"

**Impact:**
- Semua field ini akan di-include dalam AI prompt
- AI akan mengikuti guidelines saat generate content

### 4.3 Documents & Files
```
Section: 📄 Documents & Files
```

**Upload Methods:**
1. Click upload area → file picker
2. Drag & drop files

**Supported Formats:**
- .txt, .md, .pdf, .doc, .docx

**Upload Process:**
1. FileReader reads file as text
2. `DB.knowledgeBase.addDocument({name, type, content, category})`
3. Re-render document list
4. Toast: "{filename} uploaded!"

**Document List:**
- Icon + filename + category
- Delete button (×)

**Delete Document:**
1. Klik × button
2. `DB.knowledgeBase.removeDocument(docId)`
3. Re-render list
4. Toast: "Document removed"

### 4.4 Quick Notes
```
Section: 📝 Quick Notes
```

**Add Note:**
1. Select category: Brand Info, Product Info, Audience Info, Competitor Info, General
2. Enter note text
3. Klik "+ Add Note"
4. `DB.knowledgeBase.addNote(text, category)`
5. Re-render notes list
6. Toast: "Note added!"

**Note Display:**
- [category] note content
- Delete button (×)

**Delete Note:**
1. Klik × button
2. `DB.knowledgeBase.removeNote(noteId)`
3. Re-render list
4. Toast: "Note removed"

### 4.5 Content Pillars
```
Section: 🎯 Content Pillars
```

**Add Pillar:**
1. Enter pillar name
2. Klik "+ Add"
3. `DB.knowledgeBase.addPillar(pillar)`
4. Re-render pillars list
5. Toast: "Pillar added!"

**Pillar Display:**
- Tag style dengan primary color
- Delete button (×)

**Delete Pillar:**
1. Klik × button
2. `DB.knowledgeBase.removePillar(pillar)`
3. Re-render list
4. Toast: "Pillar removed"

**Pillar Usage:**
- Dropdown di Content Editor
- Dropdown di AI Generator
- Used in monthly content generation
- Distributed evenly across generated content

---

## FASE 5: AI GENERATOR

### 5.1 AI Generator Overview
```
Navigation: Sidebar → AI Generator
```

**Purpose:**
Generate single content dengan AI, dengan full control over parameters.

### 5.2 Generator Form
```
Section: Generate Content
```

**Fields:**

| Field | Type | Required | Options |
|-------|------|----------|---------|
| Topic/Idea | Textarea | Yes | Free text |
| Platform | Select | Yes | 7 platforms |
| Content Type | Select | Yes | post, reel, story, carousel, thread, article |
| Content Pillar | Select | No | From KB pillars |
| Generate Image | Checkbox | No | Default: checked |
| Include Hashtags | Checkbox | No | Default: checked |
| Include CTA | Checkbox | No | Default: checked |

### 5.3 Generate Process
```
Trigger: Klik "⚡ Generate Content"
```

**Process:**
1. Validate topic not empty
2. Validate active project exists
3. Show loading: "Generating content..."
4. Build AI prompt with:
   - Knowledge Base context (guidelines, docs, notes)
   - Platform specifications
   - Topic and options
5. Call `ContentGenerator.generateContent(topic, options)`
6. Parse response (hook, caption, cta, hashtags)
7. If "Generate Image" checked:
   - Generate image prompt
   - Create Pollinations image URL
8. Display result
9. Show action buttons
10. Hide loading
11. Toast: "Content generated!"

**AI Prompt Structure:**
```
[Knowledge Base Context]
=== BRAND INFORMATION ===
Brand: {brandName}
Niche: {niche}
Target Audience: {targetAudience}
Tone: {toneOfVoice}
Content Pillars: {pillars}

Brand Voice: {brandVoice}
Key Messages: {keyMessages}
Words to Use: {wordsToUse}
Words to Avoid: {wordsToAvoid}

=== KNOWLEDGE BASE ===
[Documents content]

=== NOTES ===
[Notes content]

=== TASK ===
Create {type} content for {platform}.
Topic: {topic}
Tone: {tone}
Style: {platformStyle}

Requirements:
1. Attention-grabbing hook
2. Engaging main content
3. Clear call-to-action
4. Relevant hashtags

Format:
HOOK: [hook]
CAPTION: [caption]
CTA: [cta]
HASHTAGS: [hashtags]
```

### 5.4 Result Display
```
Section: Generated Result
```

**Content:**
- Generated image (if checked)
- Hook (highlighted)
- Caption
- CTA
- Hashtags

**Actions:**
- 📋 Copy → copy full content to clipboard
- 🔄 Regenerate → generate again with same topic
- 💾 Save to Hub → save to Content Hub

### 5.5 Save Generated Content
```
Trigger: Klik "💾 Save to Hub"
```

**Process:**
1. Create content object from generated result
2. `DB.content.add({...})`
3. Clear result area
4. Hide action buttons
5. Toast: "Content saved to hub!"

---

## FASE 6: CALENDAR (Full Page)

### 6.1 Calendar Overview
```
Navigation: Sidebar → Calendar
```

**Purpose:**
Full-page calendar view untuk visualisasi jadwal konten bulanan.

### 6.2 Calendar Components

**Header:**
- "← Previous" button
- Month Year label (e.g., "December 2024")
- "Next →" button
- "📤 Export" button

**Grid:**
- 7 columns (Sun-Sat)
- 5-6 rows depending on month
- Day headers
- Day cells with content

### 6.3 Calendar Navigation
```
Trigger: Klik Previous/Next button
```

**Process:**
1. `changeCalendarMonth(delta)` // -1 or +1
2. Update `currentCalendarDate`
3. Re-render calendar grid

### 6.4 Day Cell Content

**Structure:**
- Day number (bold)
- Content items (max 4 visible)
- "+X more" indicator

**Content Item:**
- Background = platform color
- Text = title (truncated) or platform name

### 6.5 Day Detail Modal
```
Trigger: Klik any day cell
```

**Modal Content:**
- Date header (full format)
- "+ Add Content" button
- List of content for that day
- Each item clickable → content detail

### 6.6 Export Calendar
```
Trigger: Klik "📤 Export" button
```

**Process:**
1. Get all content with scheduledDate
2. Generate CSV:
   - Headers: Date, Time, Title, Platform, Type, Status, Caption
   - Rows: content data
3. Create Blob
4. Trigger download
5. Toast: "Calendar exported!"

**CSV Format:**
```csv
Date,Time,Title,Platform,Type,Status,Caption
"2024-12-16","09:00","Content Title","instagram","post","draft","Caption text..."
```

---

## FASE 7: SETTINGS

### 7.1 Settings Overview
```
Navigation: Sidebar → Settings
```

**3 Sections:**
1. Project Settings
2. Posting Schedule
3. Data Management

### 7.2 Project Settings
```
Section: 📁 Project Settings
```

**Fields:**
| Field | Type | Source |
|-------|------|--------|
| Project Name | Text | project.name |
| Brand Name | Text | project.brandName |
| Niche/Industry | Select | project.niche |
| Target Audience | Textarea | project.targetAudience |
| Tone of Voice | Select | project.toneOfVoice |

**Niche Options:**
tech, lifestyle, business, education, health, food, fashion, finance, travel, entertainment

**Tone Options:**
casual, professional, humorous, inspirational, educational

### 7.3 Posting Schedule
```
Section: 📅 Posting Schedule
```

**Fields:**

| Field | Type | Options |
|-------|------|---------|
| Posting Days | Checkboxes | Mon, Tue, Wed, Thu, Fri, Sat, Sun |
| Posts Per Day | Select | 1, 2, 3 |
| Active Platforms | Checkboxes | Instagram, TikTok, Twitter, LinkedIn, Facebook, YouTube |

### 7.4 Save Settings
```
Trigger: Klik "Save Settings"
```

**Process:**
1. Collect all field values
2. Collect checked posting days
3. Collect checked platforms
4. `DB.projects.update(projectId, {...})`
5. Reload projects dropdown
6. Reload active project info
7. Toast: "Settings saved!"

### 7.5 Data Management
```
Section: 💾 Data Management
```

**Actions:**

#### Export Project
```
Trigger: Klik "📤 Export Project"
```
1. Get active project data
2. Get knowledge base data
3. Get all content
4. Create JSON object
5. Create Blob
6. Trigger download as `{projectName}_export.json`
7. Toast: "Project exported!"

**Export Structure:**
```json
{
  "project": {...},
  "knowledgeBase": {...},
  "content": [...],
  "exportedAt": "ISO date"
}
```

#### Import Project
```
Trigger: Klik "📥 Import Project"
```
1. Open file picker
2. Read JSON file
3. Parse and validate
4. Import data (coming soon)
5. Toast: "Import feature coming soon!"

#### Delete Project
```
Trigger: Klik "🗑️ Delete Project"
```
1. Confirm: "Delete project? This will delete all content and cannot be undone."
2. If confirmed:
   - `DB.projects.delete(projectId)`
   - Clear knowledge base for project
   - Clear content for project
3. Reload projects
4. Reload active project
5. Toast: "Project deleted"

---

## FASE 8: PROJECT MANAGEMENT

### 8.1 Project Selector
```
Location: Top bar (Project Bar)
```

**Components:**
- Select dropdown dengan semua projects
- "+" button untuk create new project
- Project info text

### 8.2 Switch Project
```
Trigger: Change project selector value
```

**Process:**
1. `switchProject(projectId)`
2. `DB.projects.setActive(projectId)`
3. Reload active project
4. Toast: "Project switched!"

**Impact:**
- Semua data (content, KB) berubah ke project baru
- Dashboard refresh
- Content Hub refresh

### 8.3 Create New Project
```
Trigger: Klik "+" button di project bar
```

**Modal Fields:**
- Project Name
- Brand Name
- Niche (select)
- Tone (select)
- Target Audience (textarea)

**Process:**
1. `DB.projects.create({...})`
2. Set as active project
3. Reload projects dropdown
4. Reload active project
5. Close modal
6. Toast: "Project created!"

---

## FASE 9: UTILITIES & HELPERS

### 9.1 Loading Overlay
```
Functions: showLoading(text), hideLoading()
```

**Behavior:**
- Full screen overlay
- Spinner animation
- Custom text message
- Blocks all interaction

### 9.2 Toast Notifications
```
Function: showToast(message, type)
```

**Types:**
- info (default) - primary color border
- success - green border
- error - red border
- warning - yellow border

**Behavior:**
- Slide in from right
- Auto-dismiss after 3.5 seconds
- Stack multiple toasts

### 9.3 Modal System
```
Functions: openModal(), closeModal()
```

**Components:**
- Overlay (click to close)
- Content container
- Close button (×)

**Close Triggers:**
- Click overlay
- Click × button
- Press Escape key

### 9.4 Copy to Clipboard
```
Function: copyToClipboard(text)
```

**Process:**
1. Try `navigator.clipboard.writeText()`
2. Fallback: create textarea, select, execCommand
3. Toast: "Copied to clipboard!"

---

## 📊 DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
├─────────────────────────────────────────────────────────────┤
│  Dashboard │ Content Hub │ Knowledge Base │ Generator │ ... │
└──────┬──────────┬─────────────┬──────────────┬──────────────┘
       │          │             │              │
       ▼          ▼             ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                      APP.JS (Controller)                     │
│  - Navigation                                                │
│  - Event handlers                                            │
│  - UI updates                                                │
│  - Data formatting                                           │
└──────┬──────────┬─────────────┬──────────────┬──────────────┘
       │          │             │              │
       ▼          ▼             ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE.JS (Model)                       │
│  ┌─────────┐  ┌─────────────┐  ┌─────────┐  ┌──────────┐   │
│  │Projects │  │KnowledgeBase│  │ Content │  │ Settings │   │
│  └────┬────┘  └──────┬──────┘  └────┬────┘  └────┬─────┘   │
│       └──────────────┴──────────────┴────────────┘          │
│                          │                                   │
│                          ▼                                   │
│                   ┌─────────────┐                            │
│                   │ LocalStorage│                            │
│                   └─────────────┘                            │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│              POLLINATIONS.JS + CONTENT-GENERATOR.JS          │
│  - AI text generation                                        │
│  - AI image generation                                       │
│  - Content parsing                                           │
│  - Monthly plan generation                                   │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                    POLLINATIONS AI API                       │
│  - text.pollinations.ai (text generation)                   │
│  - image.pollinations.ai (image generation)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 LOCALSTORAGE KEYS

| Key | Content | Structure |
|-----|---------|-----------|
| `lc_projects` | Array of projects | `[{id, name, brandName, ...}]` |
| `lc_active_project` | Active project ID | `"proj_xxx"` |
| `lc_settings` | App settings | `{viewMode: 'table'}` |
| `lc_kb_{projectId}` | Knowledge base per project | `{documents, notes, guidelines, pillars}` |
| `lc_content_{projectId}` | Content per project | `[{id, title, caption, ...}]` |

---

## ⚠️ ERROR HANDLING

### No Project Selected
- Dashboard shows empty state
- Auto-generate button disabled
- Prompt to create/select project

### No Pillars
- Auto-generate shows warning
- Redirect to Knowledge Base
- Toast: "Please add content pillars first"

### AI Generation Failed
- Hide loading
- Toast: "Failed to generate content"
- Console error log
- User can retry

### Empty Content
- Table: "No content found"
- Kanban: "No items" per column
- Calendar: Empty day cells

---

## 🎯 KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| Escape | Close modal |

---

*Document Version: 1.0*
*Last Updated: December 2024*
