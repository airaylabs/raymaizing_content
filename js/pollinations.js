/**
 * Pollinations AI Integration Module
 * Correct API implementation based on official docs
 */

const PollinationsAI = {
    // API endpoints
    endpoints: {
        text: 'https://text.pollinations.ai/',
        textOpenAI: 'https://text.pollinations.ai/openai',
        image: 'https://image.pollinations.ai/prompt/'
    },

    // Generate text using Pollinations - Simple GET method
    async generateText(prompt, options = {}) {
        const {
            model = 'openai',
            systemPrompt = 'Kamu adalah content creator profesional yang ahli membuat konten viral untuk social media Indonesia. Selalu jawab dalam Bahasa Indonesia yang casual dan engaging.',
            temperature = 0.8
        } = options;

        try {
            // Use POST method for better control
            const payload = {
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: temperature
            };

            const response = await fetch(this.endpoints.textOpenAI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || data;
        } catch (error) {
            console.error('Pollinations Text Error:', error);
            
            // Fallback to simple GET method
            try {
                const encodedPrompt = encodeURIComponent(prompt);
                const encodedSystem = encodeURIComponent(systemPrompt);
                const url = `${this.endpoints.text}${encodedPrompt}?model=${model}&system=${encodedSystem}`;
                
                const response = await fetch(url);
                if (!response.ok) throw new Error('GET fallback failed');
                return await response.text();
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                throw error;
            }
        }
    },

    // Generate text with simple GET (alternative method)
    async generateTextSimple(prompt, options = {}) {
        const {
            model = 'openai',
            seed = Math.floor(Math.random() * 10000)
        } = options;

        try {
            const encodedPrompt = encodeURIComponent(prompt);
            const url = `${this.endpoints.text}${encodedPrompt}?model=${model}&seed=${seed}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            console.error('Pollinations Simple Text Error:', error);
            throw error;
        }
    },

    // Generate image URL using Pollinations
    generateImageUrl(prompt, options = {}) {
        const {
            width = 1024,
            height = 1024,
            seed = Math.floor(Math.random() * 1000000),
            model = 'flux',
            nologo = true,
            enhance = true
        } = options;

        const encodedPrompt = encodeURIComponent(prompt);
        let url = `${this.endpoints.image}${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}`;
        
        if (nologo) url += '&nologo=true';
        if (enhance) url += '&enhance=true';
        
        return url;
    },

    // Generate multiple images
    generateMultipleImages(prompt, count = 4, options = {}) {
        const images = [];
        for (let i = 0; i < count; i++) {
            const seed = Math.floor(Math.random() * 1000000);
            images.push({
                url: this.generateImageUrl(prompt, { ...options, seed }),
                seed
            });
        }
        return images;
    },

    // Get dimensions based on aspect ratio
    getDimensions(ratio) {
        const dimensions = {
            '1:1': { width: 1024, height: 1024 },
            '9:16': { width: 768, height: 1365 },
            '16:9': { width: 1365, height: 768 },
            '4:5': { width: 896, height: 1120 }
        };
        return dimensions[ratio] || dimensions['1:1'];
    },

    // Enhance prompt with style
    enhancePrompt(basePrompt, style) {
        const styleEnhancements = {
            realistic: 'ultra realistic, professional photography, high quality, detailed, 8k resolution',
            aesthetic: 'aesthetic, minimalist, soft colors, instagram worthy, clean composition',
            cartoon: 'cartoon style, illustration, vibrant colors, fun, playful',
            '3d': '3D render, octane render, cinema 4D, high detail, professional lighting',
            anime: 'anime style, japanese animation, vibrant, detailed, studio ghibli inspired',
            vintage: 'vintage style, retro, film grain, nostalgic, warm tones, 70s aesthetic',
            neon: 'neon lights, cyberpunk, futuristic, glowing, dark background, vibrant colors'
        };

        const enhancement = styleEnhancements[style] || '';
        return `${basePrompt}, ${enhancement}`;
    }
};

// Content Generation Templates
const ContentTemplates = {
    // Generate viral caption
    async generateCaption(topic, options = {}) {
        const {
            type = 'caption',
            length = 'medium',
            includeHook = true,
            includeHashtags = true,
            includeCta = true,
            tone = 'casual',
            variations = 1
        } = options;

        const strategy = DB.strategy.get();
        const niche = strategy.niche || 'general';
        
        const lengthGuide = {
            short: '50-80 kata',
            medium: '100-150 kata',
            long: '200-300 kata'
        };

        const prompt = `Buatkan ${variations} variasi ${type} untuk social media dengan detail:
- Topik: ${topic}
- Niche: ${niche}
- Tone: ${tone}
- Panjang: ${lengthGuide[length]}
${includeHook ? '- Mulai dengan hook yang menarik perhatian' : ''}
${includeCta ? '- Akhiri dengan call-to-action yang engaging' : ''}
${includeHashtags ? '- Sertakan 5-10 hashtag relevan di akhir' : ''}

Format output untuk setiap variasi:
---VARIASI 1---
[Caption lengkap]
${includeHashtags ? '[Hashtags]' : ''}
---END---

Buat caption yang viral, relatable, dan engaging. Gunakan emoji secukupnya.`;

        return await PollinationsAI.generateText(prompt);
    },

    // Generate video script
    async generateVideoScript(topic, options = {}) {
        const {
            type = 'reels',
            duration = 30,
            style = 'educational'
        } = options;

        const strategy = DB.strategy.get();
        
        const prompt = `Buatkan script video ${type} dengan detail:
- Topik: ${topic}
- Durasi: ${duration} detik
- Style: ${style}
- Niche: ${strategy.niche || 'general'}
- Target audience: ${strategy.targetAudience || 'general'}

Format script:
---SCRIPT---
[HOOK - 3 detik pertama]
(Teks yang harus diucapkan)

[SCENE 1 - X detik]
Visual: (deskripsi visual)
Narasi: (teks narasi)

[SCENE 2 - X detik]
Visual: (deskripsi visual)
Narasi: (teks narasi)

[CTA - 3 detik terakhir]
(Call to action)
---END---

[TIPS EDITING]
- Musik yang cocok: ...
- Transisi yang disarankan: ...
- Text overlay: ...

Buat script yang engaging dari detik pertama, dengan hook yang kuat dan pacing yang pas.`;

        return await PollinationsAI.generateText(prompt);
    },

    // Generate hashtags
    async generateHashtags(topic, count = 15) {
        const strategy = DB.strategy.get();
        
        const prompt = `Generate ${count} hashtag untuk konten social media:
- Topik: ${topic}
- Niche: ${strategy.niche || 'general'}

Berikan mix hashtag:
- 5 hashtag populer (high volume)
- 5 hashtag medium (moderate competition)
- 5 hashtag niche specific (targeted)

Format: #hashtag1 #hashtag2 #hashtag3 (dalam satu baris, tanpa penjelasan)`;

        return await PollinationsAI.generateText(prompt);
    },

    // Generate content strategy
    async generateStrategy() {
        const strategy = DB.strategy.get();
        const pillars = DB.pillars.getAll();

        const prompt = `Buatkan strategi konten social media lengkap:

Brand: ${strategy.brandName || 'Brand Baru'}
Niche: ${strategy.niche || 'General'}
Target Audience: ${strategy.targetAudience || 'General audience'}
Tone: ${strategy.toneOfVoice || 'Casual'}
Platforms: ${strategy.platforms?.join(', ') || 'Instagram, TikTok'}
Content Pillars: ${pillars.join(', ') || 'Belum ditentukan'}

Berikan:
1. Analisis singkat positioning brand
2. 5 content pillar yang disarankan (jika belum ada)
3. Posting schedule yang optimal
4. 10 ide konten viral untuk minggu pertama
5. Tips engagement untuk niche ini
6. Hashtag strategy

Format dengan jelas dan actionable.`;

        return await PollinationsAI.generateText(prompt);
    },

    // Analyze viral potential
    async analyzeViralPotential(content) {
        const prompt = `Analisis potensi viral konten berikut:

"${content}"

Berikan:
1. VIRAL SCORE: X/100
2. Kelebihan konten ini
3. Kelemahan yang perlu diperbaiki
4. Saran perbaikan spesifik
5. Prediksi engagement rate

Format dengan jelas dan berikan skor numerik.`;

        return await PollinationsAI.generateText(prompt);
    },

    // Generate trending topics
    async generateTrendingTopics(niche) {
        const prompt = `Berikan 10 topik yang sedang trending dan berpotensi viral untuk niche: ${niche}

Format:
1. [Topik] - [Alasan kenapa trending] - [Ide konten]
2. ...

Fokus pada topik yang relevan untuk social media Indonesia saat ini.`;

        return await PollinationsAI.generateText(prompt);
    },

    // Generate viral hooks
    async generateViralHooks(category, niche) {
        const prompt = `Generate 10 hook pembuka yang viral untuk konten social media:
- Kategori hook: ${category}
- Niche: ${niche}

Kategori hook:
- curiosity: Membuat penasaran
- controversy: Kontroversial tapi aman
- story: Storytelling hook
- question: Pertanyaan yang relate
- shock: Fakta mengejutkan
- relatable: Sangat relate dengan audience

Format: Satu hook per baris, langsung bisa dipakai.`;

        return await PollinationsAI.generateText(prompt);
    },

    // Generate weekly content plan
    async generateWeeklyPlan(pillar) {
        const strategy = DB.strategy.get();
        
        const prompt = `Buatkan content plan untuk 7 hari:
- Content Pillar: ${pillar || 'General'}
- Niche: ${strategy.niche || 'General'}
- Platforms: ${strategy.platforms?.join(', ') || 'Instagram, TikTok'}

Format untuk setiap hari:
---HARI 1---
Tipe: [Reels/Carousel/Single Post/Story]
Topik: [Judul topik]
Hook: [Hook pembuka]
Outline: [3-5 poin utama]
CTA: [Call to action]
Best Time: [Waktu posting optimal]
---END---

Buat variasi konten yang engaging dan tidak monoton.`;

        return await PollinationsAI.generateText(prompt);
    },

    // Generate batch content
    async generateBatchContent(options = {}) {
        const {
            pillar = 'General',
            count = 7,
            includeText = true,
            includeImagePrompts = true,
            includeVideoScripts = false
        } = options;

        const strategy = DB.strategy.get();
        
        const prompt = `Generate ${count} konten lengkap untuk social media:
- Pillar: ${pillar}
- Niche: ${strategy.niche || 'General'}

Untuk setiap konten, berikan:
${includeText ? '- Caption lengkap dengan hook dan CTA' : ''}
${includeImagePrompts ? '- Image prompt untuk AI generator (dalam Bahasa Inggris)' : ''}
${includeVideoScripts ? '- Script video singkat (30 detik)' : ''}
- Hashtags (5-10)
- Best posting time

Format:
---KONTEN 1---
[Semua elemen di atas]
---END---

Buat konten yang bervariasi dan engaging.`;

        return await PollinationsAI.generateText(prompt);
    }
};

// Test function to verify API is working
async function testPollinationsAPI() {
    try {
        console.log('Testing Pollinations API...');
        const result = await PollinationsAI.generateTextSimple('Say hello in Indonesian');
        console.log('API Test Result:', result);
        return true;
    } catch (error) {
        console.error('API Test Failed:', error);
        return false;
    }
}
