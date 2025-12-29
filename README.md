# raycorpContent — Omnichannel Content Management System

Sistem manajemen konten omnichannel lengkap dengan AI-powered content generation untuk semua platform social media.

## 🚀 Features

### 1. Multi-Project / Multi-Brand Support
- Kelola multiple brand/project dalam satu dashboard
- Setiap project memiliki knowledge base terpisah
- Switch antar project dengan mudah

### 2. Knowledge Base Integration
- **Brand Guidelines**: Voice, key messages, words to use/avoid
- **Documents**: Upload file untuk referensi AI
- **Quick Notes**: Catatan cepat tentang brand
- **Content Pillars**: Topik utama untuk konten

### 3. Auto-Generate Monthly Content
- Satu klik untuk generate 1 bulan konten
- Berdasarkan knowledge base dan brand guidelines
- Distribusi otomatis ke posting days yang dipilih
- Support multiple platforms sekaligus

### 4. Content Hub (Notion-like Views)
- **Table View**: Spreadsheet-style dengan sorting & filtering
- **Kanban View**: Drag & drop untuk manage status
- **Calendar View**: Visualisasi jadwal bulanan

### 5. Full CRUD Operations
- Create, Read, Update, Delete semua konten
- Edit inline dari semua view
- Bulk operations support

### 6. AI Generator
- Generate konten individual dengan AI
- Auto-generate image prompts
- Platform-specific optimization
- Knowledge base context integration

## 📦 Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **AI**: Pollinations AI (Free, no API key needed)
- **Storage**: LocalStorage (client-side)
- **Deployment**: Vercel-ready

## 🛠️ Setup

```bash
# Install dependencies
npm install

# Run development server
npm start

# Open browser
http://localhost:3000
```

## 📱 Supported Platforms

- Instagram (Feed, Reels, Story, Carousel)
- TikTok
- Twitter/X (Tweet, Thread)
- LinkedIn (Post, Article)
- Facebook
- YouTube (Shorts, Description)
- Blog/Article

## 🔄 Workflow

1. **Create Project** → Setup brand info
2. **Setup Knowledge Base** → Add guidelines, docs, pillars
3. **Auto-Generate** → 1 bulan konten otomatis
4. **Review & Edit** → CRUD di Content Hub
5. **Schedule** → Atur jadwal posting
6. **Export** → Download calendar/content

## 🎨 Customization

Edit `css/styles.css` untuk mengubah:
- Brand colors (CSS variables)
- Typography
- Layout
- Component styles

## 📤 Deployment

### Vercel
```bash
# Push to GitHub
git add .
git commit -m "Deploy"
git push

# Connect to Vercel
# Import from GitHub
# Deploy automatically
```

## 📄 License

MIT License - Free for personal and commercial use.
