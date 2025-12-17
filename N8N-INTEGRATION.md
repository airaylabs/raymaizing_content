# 🔗 N8N Integration Guide

## Overview

Integrasi N8N memungkinkan kamu untuk:
- Auto-generate konten berdasarkan trigger
- Auto-post ke social media
- Analyze gambar dengan AI
- Schedule posting otomatis

---

## 🛠️ Setup N8N Webhook

### 1. Buat Workflow di N8N

```
[Webhook Trigger] → [Process Data] → [Action]
```

### 2. Dapatkan Webhook URL
1. Buka N8N
2. Buat workflow baru
3. Tambah node "Webhook"
4. Copy webhook URL

### 3. Masukkan ke Framework
1. Buka Settings di framework
2. Paste webhook URL di "N8N Webhook URL"
3. Save

---

## 📋 Contoh Workflow N8N

### Workflow 1: Auto-Generate Caption

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "generate-caption",
        "method": "POST"
      }
    },
    {
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://text.pollinations.ai/{{ $json.prompt }}",
        "method": "GET"
      }
    },
    {
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}"
      }
    }
  ]
}
```

### Workflow 2: Analyze Image

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "analyze-image",
        "method": "POST"
      }
    },
    {
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://text.pollinations.ai/Analyze this image and describe what you see: {{ $json.imageUrl }}",
        "method": "GET"
      }
    },
    {
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook"
    }
  ]
}
```

### Workflow 3: Schedule Post to Instagram

```json
{
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{ "field": "hours", "hoursInterval": 24 }]
        }
      }
    },
    {
      "name": "Get Content from Framework",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "YOUR_FRAMEWORK_URL/api/scheduled-content",
        "method": "GET"
      }
    },
    {
      "name": "Post to Instagram",
      "type": "n8n-nodes-base.instagram",
      "parameters": {
        "operation": "createPost"
      }
    }
  ]
}
```

---

## 🔄 Webhook Endpoints

### Generate Caption
```
POST /webhook/generate-caption
Body: {
  "topic": "Tips produktif WFH",
  "type": "caption",
  "tone": "casual"
}
```

### Generate Image Prompt
```
POST /webhook/generate-image-prompt
Body: {
  "topic": "Coffee aesthetic",
  "style": "minimalist"
}
```

### Analyze Content
```
POST /webhook/analyze-content
Body: {
  "content": "Your caption here...",
  "type": "viral-score"
}
```

---

## 📱 Auto-Post Setup

### Instagram (via Meta API)
1. Setup Meta Developer Account
2. Get Instagram Graph API access
3. Create N8N workflow dengan Instagram node

### TikTok
1. TikTok for Developers account
2. Get API credentials
3. Use HTTP Request node di N8N

### Twitter/X
1. Twitter Developer account
2. Get API keys
3. Use Twitter node di N8N

---

## 💡 Tips

1. **Rate Limiting** - Jangan spam API, gunakan delay antar request
2. **Error Handling** - Tambah error handling di workflow
3. **Logging** - Log semua aktivitas untuk debugging
4. **Testing** - Test workflow dengan data dummy dulu

---

## 🔒 Security

- Jangan share webhook URL
- Gunakan authentication jika perlu
- Validate input data
- Limit request rate
