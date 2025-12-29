/**
 * SMART AI ASSISTANT v2.0 - raymAIzing
 */
const SmartAssistant = {
    conversationHistory: [],
    lastContext: null,
    
    workflowDatabase: {
        'seo-article': { id: 'WF-001', name: 'SEO Article Generator', category: 'text', keywords: ['artikel', 'article', 'blog', 'seo', 'tulisan'], desc: 'Generate artikel SEO-friendly', usage: 'Untuk membuat artikel blog' },
        'viral-thread': { id: 'WF-002', name: 'Viral Thread Generator', category: 'text', keywords: ['thread', 'twitter', 'x', 'tweet', 'utas'], desc: 'Buat thread viral untuk Twitter/X', usage: 'Untuk thread Twitter' },
        'caption-generator': { id: 'WF-051', name: 'Caption Generator', category: 'text', keywords: ['caption', 'instagram', 'ig', 'post'], desc: 'Generate caption menarik', usage: 'Untuk caption social media' },
        'script-writer': { id: 'WF-031', name: 'Script Writer', category: 'text', keywords: ['script', 'naskah', 'video', 'youtube'], desc: 'Tulis script video/podcast', usage: 'Untuk naskah video' },
        'copywriting': { id: 'WF-055', name: 'Copywriting Formula', category: 'text', keywords: ['copy', 'copywriting', 'ads', 'iklan', 'sales'], desc: 'Formula copywriting AIDA, PAS', usage: 'Untuk copy iklan' },
        'carousel-image': { id: 'WF-003', name: 'Carousel Image Generator', category: 'image', keywords: ['carousel', 'slide', 'instagram', 'swipe'], desc: 'Generate carousel Instagram', usage: 'Untuk carousel Instagram' },
        'single-image': { id: 'WF-004', name: 'Single Image Generator', category: 'image', keywords: ['gambar', 'image', 'foto', 'visual'], desc: 'Generate variasi gambar', usage: 'Untuk gambar single' },
        'product-photo': { id: 'WF-009', name: 'Product Photoshoot', category: 'image', keywords: ['produk', 'foto produk', 'product photo', 'katalog'], desc: 'Foto produk profesional', usage: 'Untuk foto produk' },
        'thumbnail': { id: 'WF-067', name: 'Thumbnail Generator', category: 'image', keywords: ['thumbnail', 'youtube', 'cover', 'miniatur'], desc: 'Thumbnail YouTube', usage: 'Untuk thumbnail YouTube' },
        'logo': { id: 'WF-029', name: 'Logo Generator', category: 'branding', keywords: ['logo', 'brand', 'merek'], desc: 'Generate logo profesional', usage: 'Untuk membuat logo' },
        'short-video': { id: 'WF-005', name: 'Short Video Generator', category: 'video', keywords: ['video', 'tiktok', 'reels', 'shorts'], desc: 'Generate video pendek', usage: 'Untuk TikTok/Reels' },
        'youtube-video': { id: 'WF-006', name: 'YouTube Video Generator', category: 'video', keywords: ['youtube', 'video panjang', 'vlog'], desc: 'Script video YouTube', usage: 'Untuk konten YouTube' },
        'brand-kit': { id: 'WF-012', name: 'Brand Kit Generator', category: 'branding', keywords: ['brand', 'branding', 'identitas'], desc: 'Brand identity lengkap', usage: 'Untuk branding' },
        'ad-creative': { id: 'WF-026', name: 'Ad Creative Generator', category: 'marketing', keywords: ['ads', 'iklan', 'advertising'], desc: 'Generate iklan digital', usage: 'Untuk iklan' },
        'hashtag': { id: 'WF-032', name: 'Hashtag Generator', category: 'tools', keywords: ['hashtag', 'tagar', 'tag'], desc: 'Generate hashtag optimal', usage: 'Untuk hashtag' },
        'hook': { id: 'WF-034', name: 'Hook Generator', category: 'tools', keywords: ['hook', 'opening', 'pembuka'], desc: 'Generate viral hooks', usage: 'Untuk hook konten' },
        'banner': { id: 'WF-071', name: 'Banner Generator', category: 'image', keywords: ['banner', 'header', 'cover'], desc: 'Banner social media', usage: 'Untuk banner' },
        'meme': { id: 'WF-069', name: 'Meme Generator', category: 'image', keywords: ['meme', 'lucu', 'funny'], desc: 'Generate meme viral', usage: 'Untuk meme' },
        'quote': { id: 'WF-070', name: 'Quote Graphics', category: 'image', keywords: ['quote', 'kutipan', 'motivasi'], desc: 'Desain quote aesthetic', usage: 'Untuk quote graphics' },
        'skincare': { id: 'WF-046', name: 'Skincare Kit', category: 'industry', keywords: ['skincare', 'kosmetik', 'beauty'], desc: 'Konten skincare/kosmetik', usage: 'Untuk brand skincare' },
        'food': { id: 'WF-044', name: 'Food Content Kit', category: 'industry', keywords: ['makanan', 'food', 'kuliner', 'fnb'], desc: 'Konten F&B', usage: 'Untuk bisnis makanan' },
        'umkm': { id: 'WF-043', name: 'UMKM Starter Kit', category: 'business', keywords: ['umkm', 'usaha', 'bisnis kecil'], desc: 'Paket untuk UMKM', usage: 'Untuk UMKM' },
        'fashion': { id: 'WF-010', name: 'Magic Fashion', category: 'image', keywords: ['fashion', 'baju', 'pakaian', 'outfit'], desc: 'Photoshoot fashion AI', usage: 'Untuk foto fashion' }
    },

    directMap: {
        'artikel': 'seo-article', 'article': 'seo-article', 'blog': 'seo-article', 'tulisan': 'seo-article',
        'caption': 'caption-generator', 'thread': 'viral-thread', 'tweet': 'viral-thread', 'twitter': 'viral-thread',
        'carousel': 'carousel-image', 'slide': 'carousel-image', 'video': 'short-video', 'tiktok': 'short-video',
        'reels': 'short-video', 'shorts': 'short-video', 'youtube': 'youtube-video', 'logo': 'logo',
        'brand': 'brand-kit', 'branding': 'brand-kit', 'iklan': 'ad-creative', 'ads': 'ad-creative',
        'foto produk': 'product-photo', 'thumbnail': 'thumbnail', 'banner': 'banner', 'meme': 'meme',
        'quote': 'quote', 'kutipan': 'quote', 'hashtag': 'hashtag', 'hook': 'hook', 'script': 'script-writer',
        'naskah': 'script-writer', 'copywriting': 'copywriting', 'skincare': 'skincare', 'kosmetik': 'skincare',
        'makanan': 'food', 'food': 'food', 'kuliner': 'food', 'umkm': 'umkm', 'fashion': 'fashion', 'baju': 'fashion'
    },

    async generateResponse(message) {
        const msg = message.toLowerCase().trim();
        this.conversationHistory.push({ role: 'user', content: message });
        let response = '';

        // 1. Direct workflow match (PRIORITY)
        const direct = this.findDirect(msg);
        if (direct) {
            response = this.directResponse(direct, message);
        }
        // 2. Follow-up (numbers, yes/no)
        else if (this.isFollowUp(msg)) {
            response = this.handleFollowUp(msg);
        }
        // 3. Greeting
        else if (/^(hai|hi|hello|halo|hey|p)$/i.test(msg)) {
            response = this.greetingResponse();
        }
        // 4. Help
        else if (/(bantuan|help|cara|gimana|bagaimana|panduan|bingung)/i.test(msg)) {
            response = this.helpResponse();
        }
        // 5. Ideas
        else if (/(ide|idea|inspirasi|topik|konten apa)/i.test(msg)) {
            response = this.ideaResponse();
        }
        // 6. Thanks
        else if (/(terima kasih|thanks|makasih)/i.test(msg)) {
            response = 'Sama-sama! 😊 Senang bisa membantu. Tanya lagi kalau butuh!';
        }
        // 7. Find workflows
        else {
            const wfs = this.findWorkflows(msg);
            if (wfs.length > 0) {
                response = this.workflowResponse(wfs, message);
            } else {
                response = await this.aiResponse(message);
            }
        }

        this.conversationHistory.push({ role: 'assistant', content: response });
        return response;
    },

    findDirect(msg) {
        for (const [key, wfKey] of Object.entries(this.directMap)) {
            if (msg === key || msg.includes(key)) {
                return this.workflowDatabase[wfKey];
            }
        }
        return null;
    },

    directResponse(wf, orig) {
        this.lastContext = { type: 'workflow_direct', workflow: wf };
        return `🎯 **${wf.name}** (${wf.id})\n\n📝 ${wf.desc}\n💡 **Kegunaan:** ${wf.usage}\n\n**Cara pakai:**\n1. Buka **Magic Studio** (sidebar kiri)\n2. Cari "${wf.name}"\n3. Isi form\n4. Klik **Generate**!\n\nAda pertanyaan lain? 😊`;
    },

    findWorkflows(msg) {
        const results = [];
        for (const [key, wf] of Object.entries(this.workflowDatabase)) {
            let score = 0;
            for (const kw of wf.keywords) { if (msg.includes(kw)) score += 10; }
            if (wf.name.toLowerCase().includes(msg)) score += 15;
            if (score > 0) results.push({ ...wf, key, score });
        }
        return results.sort((a, b) => b.score - a.score).slice(0, 5);
    },

    workflowResponse(wfs, orig) {
        this.lastContext = { type: 'workflows', workflows: wfs };
        let r = `🎯 **Workflow untuk "${orig}":**\n\n`;
        wfs.forEach((wf, i) => { r += `${i+1}. **${wf.name}** (${wf.id})\n   ${wf.desc}\n\n`; });
        r += `📌 Ketik nomor (1-${wfs.length}) untuk detail!`;
        return r;
    },

    isFollowUp(msg) {
        return /^[0-9]+$/.test(msg) || /^(ya|yes|oke|ok|iya|yup|boleh|mau|sip)$/i.test(msg);
    },

    handleFollowUp(msg) {
        if (!this.lastContext) return this.defaultResponse();
        
        if (/^[0-9]+$/.test(msg)) {
            const num = parseInt(msg);
            if (this.lastContext.type === 'workflows' && this.lastContext.workflows) {
                const sel = this.lastContext.workflows[num - 1];
                if (sel) {
                    this.lastContext = { type: 'workflow_detail', workflow: sel };
                    return `📋 **${sel.name}** (${sel.id})\n\n📝 ${sel.desc}\n💡 ${sel.usage}\n\n**Cara pakai:**\n1. Buka **Magic Studio**\n2. Search "${sel.name}"\n3. Isi form\n4. Generate!\n\nKetik "ya" untuk lanjut! 🚀`;
                }
            }
            if (this.lastContext.type === 'ideas' && this.lastContext.ideas) {
                const idea = this.lastContext.ideas[num - 1];
                if (idea) {
                    const wfs = this.findWorkflows(idea.toLowerCase());
                    let r = `🎯 **Ide: "${idea}"**\n\nWorkflow yang cocok:\n`;
                    if (wfs.length > 0) {
                        wfs.slice(0, 3).forEach((w, i) => { r += `${i+1}. **${w.name}** - ${w.desc}\n`; });
                    } else {
                        r += `• Carousel Image Generator\n• Caption Generator\n• Short Video Generator\n`;
                    }
                    r += `\nBuka **Magic Studio** untuk mulai! ✨`;
                    return r;
                }
            }
        }
        
        if (/^(ya|yes|oke|ok|iya|yup|boleh|mau|sip)$/i.test(msg)) {
            if (this.lastContext.type === 'workflow_detail' || this.lastContext.type === 'workflow_direct') {
                return `✨ **Langkah selanjutnya:**\n1. Klik **Magic Studio** di sidebar\n2. Cari workflow-nya\n3. Isi form\n4. Generate!\n\nAda pertanyaan lain? 😊`;
            }
        }
        
        return this.defaultResponse();
    },

    greetingResponse() {
        this.lastContext = { type: 'greeting' };
        return `👋 **Hai! Selamat datang di raymAIzing!**\n\nSaya AI assistant yang siap membantu:\n\n🎯 **Rekomendasi workflow** - 133 tools\n📝 **Buat konten** - artikel, caption, video\n💡 **Ide konten** - inspirasi viral\n🗺️ **Panduan** - cara pakai website\n\n**Coba ketik:**\n• "artikel" - workflow artikel\n• "carousel" - carousel Instagram\n• "ide konten" - inspirasi\n• "bantuan" - panduan\n\nMau mulai dari mana? 😊`;
    },

    helpResponse() {
        return `🗺️ **Panduan raymAIzing**\n\n**Menu (sidebar kiri):**\n🏠 Dashboard - Overview\n📚 Content Hub - Kelola konten\n⚡ AI Generator - Generate cepat\n✨ Magic Studio - 133 workflow (UTAMA!)\n🖼️ AI Image - Generate gambar\n💬 AI Chat - Tanya saya!\n\n**Tips:**\n1. Mulai dari **Magic Studio**\n2. Cari workflow sesuai kebutuhan\n3. Isi form dan Generate!\n\nMau dijelaskan bagian mana? 😊`;
    },

    ideaResponse() {
        const ideas = ['Behind the scenes bisnis', 'Tips & tricks di bidangmu', 'Before-after transformation', 'Day in my life', 'Q&A dengan followers'];
        this.lastContext = { type: 'ideas', ideas };
        let r = `💡 **Ide Konten Viral:**\n\n`;
        ideas.forEach((idea, i) => { r += `${i+1}. ${idea}\n`; });
        r += `\n📌 Ketik nomor (1-5) untuk develop ide!`;
        return r;
    },

    defaultResponse() {
        return `🤔 Bisa jelaskan lebih detail?\n\nCoba ketik:\n• Nama konten (artikel, carousel, video)\n• "ide konten" untuk inspirasi\n• "bantuan" untuk panduan\n\nAtau explore **Magic Studio**! 🚀`;
    },

    async aiResponse(message) {
        try {
            const sys = `Kamu raymAIzing AI, asisten content creator Indonesia. Website punya 133 workflow di Magic Studio. Jawab singkat, friendly, rekomendasikan workflow jika relevan. Bahasa Indonesia.`;
            const res = await fetch('https://text.pollinations.ai/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'system', content: sys }, { role: 'user', content: message }], model: 'openai', temperature: 0.7 })
            });
            if (res.ok) {
                const text = await res.text();
                if (text && text.trim()) return text.trim();
            }
        } catch (e) { console.error('AI Error:', e); }
        return this.defaultResponse();
    },

    clearConversation() {
        this.conversationHistory = [];
        this.lastContext = null;
    }
};

if (typeof window !== 'undefined') window.SmartAssistant = SmartAssistant;
console.log('🧠 Smart AI Assistant v2.0 loaded!');
