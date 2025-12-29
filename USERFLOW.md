# 📋 raycorp CONTENT - OMNICHANNEL SYSTEM

> **Versi 3.0 | Desember 2024**
> **Sistem Omnichannel Content Management dengan AI**

---

## OVERVIEW

### Konsep Omnichannel Distribution
Sistem ini menggunakan pendekatan **Content Type First**, bukan platform-first. Satu konten bisa didistribusikan ke multiple platforms sekaligus.

### Content Types

| Type | Icon | Platforms | Specs |
|------|------|-----------|-------|
| **Text Article** | 📝 | Blog, Medium, WordPress, LinkedIn Article | SEO optimized, 800-3000 words |
| **Text Thread** | 🐦 | Twitter/X, Threads | 5-15 tweets, viral hooks |
| **Video Long-Form** | 🎬 | YouTube | 8-15 min, timestamps, chapters |
| **Video Short-Form** | 📱 | TikTok, YT Shorts, IG Reels, FB Reels | 15-60s, 9:16, hook <3s |
| **Video Story** | ⏱️ | IG Story, FB Story | 15s/slide, interactive |
| **Image Carousel** | 🎠 | IG Carousel, LinkedIn Carousel | 5-10 slides, educational |
| **Image Single** | 🖼️ | IG Post, FB Post, Twitter, LinkedIn | Eye-catching, shareable |

---

## USER FLOW

### 1. Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ DASHBOARD                                                    │
├─────────────────────────────────────────────────────────────┤
│ Stats: Total | Draft | Scheduled | Published                │
├─────────────────────────────────────────────────────────────┤
│ Quick Generate: [Topic] [Content Type ▼] [Generate →]       │
├─────────────────────────────────────────────────────────────┤
│ Upcoming Content                                            │
│ - [📱] Video Short - Dec 20 - draft                        │
│ - [🎠] Carousel - Dec 21 - scheduled                       │
└─────────────────────────────────────────────────────────────┘
```

### 2. Content Hub (4 Views)

**Table View** - Spreadsheet dengan drag & drop
**Kanban View** - Status columns dengan drag & drop
**Calendar View** - Monthly view dengan drag & drop
**Timeline View** - Chronological dengan drag & drop

### 3. AI Generator

```
┌─────────────────────────────────────────────────────────────┐
│ AI GENERATOR                                                 │
├─────────────────────────────────────────────────────────────┤
│ Content Type:                                               │
│ [📱 Video Short] [🎠 Carousel] [🐦 Thread] [📝 Article]    │
├─────────────────────────────────────────────────────────────┤
│ Platform Distribution:                                      │
│ [✓ TikTok] [✓ YT Shorts] [✓ IG Reels] [✓ FB Reels]        │
├─────────────────────────────────────────────────────────────┤
│ Topic: [________________________]                           │
│ Pillar: [Select pillar... ▼]                               │
│ [✓] Generate Multiple Alternatives                         │
├─────────────────────────────────────────────────────────────┤
│ [⚡ Generate Content]                                       │
├─────────────────────────────────────────────────────────────┤
│ External AI:                                                │
│ [🔮 Google Opal] [⚙️ n8n Workflow]                         │
└─────────────────────────────────────────────────────────────┘
```

### 4. Bulk Create

**Step 1: Template** - Canvas editor dengan Fabric.js
**Step 2: Data** - CSV/Excel/Manual/AI Generate
**Step 3: Mapping** - Connect elements ke data columns
**Step 4: Generate** - Batch generate dengan progress

---

## AI INTEGRATIONS

### 1. Pollinations AI (Built-in)
- Text generation: `text.pollinations.ai`
- Image generation: `image.pollinations.ai`
- Free, no API key needed

### 2. Google Opal (External)
Workflow JSON untuk multi-output generation:
```json
{
  "name": "Generate Video Short",
  "steps": [
    { "type": "text_generation", "variations": 5 },
    { "type": "image_generation", "count": 10 },
    { "type": "video_generation", "angles": 5 }
  ]
}
```

### 3. n8n Automation (External)
Workflow untuk automated pipeline:
- Trigger → Generate Text → Generate Images → Save to DB

---

## NAVIGATION STRUCTURE

```
SIDEBAR
├── Overview
│   └── Dashboard
├── Content
│   ├── Content Hub
│   └── Calendar
├── Create
│   ├── AI Generator
│   └── Bulk Create
└── Setup
    ├── Knowledge Base
    └── Settings
```

---

## DRAG & DROP

Semua views support drag & drop:

| View | Drag Action | Result |
|------|-------------|--------|
| Table | Drag row | Reorder |
| Kanban | Drag card to column | Change status |
| Calendar | Drag item to date | Reschedule |
| Timeline | Drag item | Reorder by date |

---

## DATA STRUCTURE

### Content Object
```javascript
{
  id: 'cnt_xxx',
  title: 'Content Title',
  contentType: 'video_short', // omnichannel type
  platforms: ['tiktok', 'youtube_shorts', 'instagram_reels'],
  status: 'draft',
  scheduledDate: '2024-12-20',
  caption: 'Content text...',
  imageUrl: 'https://...',
  pillar: 'Brand Strategy'
}
```

---

*Version 3.0 - Omnichannel System*
*Last Updated: December 2024*
