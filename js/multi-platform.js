/**
 * Multi-Platform Content Generator
 * One input → Content for all platforms
 */

const MultiPlatform = {
    // Platform configurations
    platforms: {
        instagram: {
            name: 'Instagram',
            icon: '📸',
            types: ['feed', 'reels', 'story', 'carousel'],
            maxLength: { feed: 2200, reels: 2200, story: 500 },
            hashtagLimit: 30
        },
        tiktok: {
            name: 'TikTok',
            icon: '🎵',
            types: ['script', 'caption'],
            maxLength: { caption: 2200 },
            hashtagLimit: 5
        },
        twitter: {
            name: 'Twitter/X',
            icon: '🐦',
            types: ['tweet', 'thread'],
            maxLength: { tweet: 280, thread: 280 },
            hashtagLimit: 3
        },
        linkedin: {
            name: 'LinkedIn',
            icon: '💼',
            types: ['post', 'article'],
            maxLength: { post: 3000, article: 10000 },
            hashtagLimit: 5
        },
        facebook: {
            name: 'Facebook',
            icon: '👥',
            types: ['post', 'story'],
            maxLength: { post: 63206, story: 500 },
            hashtagLimit: 10
        },
        blog: {
            name: 'Blog',
            icon: '📝',
            types: ['article', 'seo'],
            maxLength: { article: 50000 },
            hashtagLimit: 0
        },
        youtube: {
            name: 'YouTube',
            icon: '▶️',
            types: ['shorts', 'description', 'tags'],
            maxLength: { description: 5000 },
            hashtagLimit: 15
        }
    },

    // Store generated results
    results: {},

    // Get selected platforms
    getSelectedPlatforms() {
        const selected = [];
        document.querySelectorAll('.platform-toggle input:checked').forEach(cb => {
            const platform = cb.closest('.platform-toggle').dataset.platform;
            if (platform) selected.push(platform);
        });
        return selected.length > 0 ? selected : ['instagram', 'tiktok', 'twitter', 'linkedin'];
    },

    // Get generation options
    getOptions() {
        return {
            hooks: document.getElementById('opt-hooks')?.checked ?? true,
            hashtags: document.getElementById('opt-hashtags')?.checked ?? true,
            cta: document.getElementById('opt-cta')?.checked ?? true,
            emoji: document.getElementById('opt-emoji')?.checked ?? true,
            imagePrompts: document.getElementById('opt-image')?.checked ?? true,
            videoScripts: document.getElementById('opt-video')?.checked ?? false
        };
    },

    // Main generate function
    async generateAll(topic, niche, tone, keywords) {
        const platforms = this.getSelectedPlatforms();
        const options = this.getOptions();
        this.results = {};

        showLoading('Generating content untuk semua platform...');

        try {
            // Generate for each platform in parallel where possible
            const promises = platforms.map(platform => 
                this.generateForPlatform(platform, topic, niche, tone, keywords, options)
            );

            await Promise.all(promises);

            hideLoading();
            this.displayResults(platforms);
            showToast(`✅ Berhasil generate untuk ${platforms.length} platform!`, 'success');

        } catch (error) {
            hideLoading();
            showToast('Gagal generate content', 'error');
            console.error(error);
        }
    },

    // Generate for specific platform
    async generateForPlatform(platform, topic, niche, tone, keywords, options) {
        const config = this.platforms[platform];
        if (!config) return;

        this.results[platform] = {};

        switch (platform) {
            case 'instagram':
                await this.generateInstagram(topic, niche, tone, keywords, options);
                break;
            case 'tiktok':
                await this.generateTikTok(topic, niche, tone, keywords, options);
                break;
            case 'twitter':
                await this.generateTwitter(topic, niche, tone, keywords, options);
                break;
            case 'linkedin':
                await this.generateLinkedIn(topic, niche, tone, keywords, options);
                break;
            case 'facebook':
                await this.generateFacebook(topic, niche, tone, keywords, options);
                break;
            case 'blog':
                await this.generateBlog(topic, niche, tone, keywords, options);
                break;
            case 'youtube':
                await this.generateYouTube(topic, niche, tone, keywords, options);
                break;
        }
    },

    // Instagram content generation
    async generateInstagram(topic, niche, tone, keywords, options) {
        const prompt = `Kamu adalah content creator Instagram profesional. Buatkan konten lengkap untuk Instagram dengan topik: "${topic}"

Niche: ${niche}
Tone: ${tone}
Keywords: ${keywords || 'tidak ada'}

Buatkan dalam format berikut:

===FEED CAPTION===
${options.hooks ? '[Mulai dengan hook yang menarik]' : ''}
[Caption engaging 150-200 kata]
${options.cta ? '[Call to action]' : ''}
${options.hashtags ? '[15-20 hashtag relevan]' : ''}

===REELS SCRIPT===
[HOOK - 3 detik pertama yang bikin stop scroll]
[SCENE 1] Visual: ... | Narasi: ...
[SCENE 2] Visual: ... | Narasi: ...
[SCENE 3] Visual: ... | Narasi: ...
[CTA - ajakan action]
Durasi total: 30 detik
Musik: [rekomendasi musik/sound]

===STORY IDEAS===
Story 1: [ide story dengan poll/question]
Story 2: [behind the scenes]
Story 3: [tips singkat]

===CAROUSEL (5 SLIDES)===
Slide 1 (Cover): [judul menarik]
Slide 2: [poin 1]
Slide 3: [poin 2]
Slide 4: [poin 3]
Slide 5 (CTA): [ajakan save/share/follow]

${options.imagePrompts ? `===IMAGE PROMPTS===
1. [prompt untuk gambar feed dalam bahasa Inggris, detail dan spesifik]
2. [prompt alternatif]` : ''}

Gunakan bahasa Indonesia yang casual dan engaging. ${options.emoji ? 'Tambahkan emoji yang relevan.' : ''}`;

        try {
            const result = await PollinationsAI.generateText(prompt);
            this.results.instagram = this.parseInstagramResult(result);
        } catch (error) {
            console.error('Instagram generation error:', error);
            this.results.instagram = { feed: 'Error generating content. Please try again.', reels: '', story: '', carousel: '', imagePrompts: '' };
        }
    },

    // TikTok content generation
    async generateTikTok(topic, niche, tone, keywords, options) {
        const prompt = `Kamu adalah TikTok content creator viral. Buatkan konten TikTok untuk topik: "${topic}"

Niche: ${niche}
Tone: ${tone}

===VIDEO SCRIPT (30 detik)===
[HOOK - 3 detik, harus bikin stop scroll!]
"..."

[CONTENT - 20 detik]
Scene 1: [visual] + [narasi]
Scene 2: [visual] + [narasi]
Scene 3: [visual] + [narasi]

[CTA - 7 detik]
"..."

===CAPTION===
[Caption singkat dan catchy, max 150 karakter]
${options.hashtags ? '[3-5 hashtag trending]' : ''}

===SOUND/MUSIC===
Rekomendasi: [jenis musik/sound yang cocok]
Trending sounds: [2-3 sound yang bisa dipakai]

===TIPS EDITING===
- Transisi: [rekomendasi]
- Text overlay: [apa yang perlu ditampilkan]
- Effects: [filter/effect yang cocok]

Buat script yang engaging dan mudah diikuti. Bahasa casual ala TikTok Indonesia.`;

        try {
            const result = await PollinationsAI.generateText(prompt);
            this.results.tiktok = this.parseTikTokResult(result);
        } catch (error) {
            console.error('TikTok generation error:', error);
            this.results.tiktok = { script: 'Error generating content.', caption: '', music: '', tips: '' };
        }
    },

    // Twitter content generation
    async generateTwitter(topic, niche, tone, keywords, options) {
        const prompt = `Kamu adalah Twitter/X strategist. Buatkan konten Twitter untuk topik: "${topic}"

Niche: ${niche}
Tone: ${tone}

===SINGLE TWEET===
[Tweet engaging max 280 karakter, bisa dengan hook atau pertanyaan]

===TWITTER THREAD (5-7 tweets)===
1/ [Hook tweet - harus bikin orang mau baca lanjut]
2/ [Poin pertama]
3/ [Poin kedua]
4/ [Poin ketiga]
5/ [Poin keempat]
6/ [Summary/insight]
7/ [CTA - ajakan RT/follow/reply]

===ENGAGEMENT TWEET===
[Tweet yang mengundang diskusi/reply]

Gunakan bahasa yang concise dan impactful. ${options.hashtags ? 'Max 2-3 hashtag.' : 'Tanpa hashtag.'}`;

        try {
            const result = await PollinationsAI.generateText(prompt);
            this.results.twitter = this.parseTwitterResult(result);
        } catch (error) {
            console.error('Twitter generation error:', error);
            this.results.twitter = { tweet: 'Error generating content.', thread: '', engagement: '' };
        }
    },

    // LinkedIn content generation
    async generateLinkedIn(topic, niche, tone, keywords, options) {
        const prompt = `Kamu adalah LinkedIn content strategist. Buatkan konten LinkedIn untuk topik: "${topic}"

Niche: ${niche}
Tone: professional tapi tetap engaging

===LINKEDIN POST===
${options.hooks ? '[Hook pembuka yang menarik - bisa cerita singkat atau statement bold]' : ''}
[Isi post 200-300 kata, dengan line breaks untuk readability]
[Insight atau pembelajaran]
${options.cta ? '[Call to action - ajak diskusi atau share pengalaman]' : ''}
${options.hashtags ? '[3-5 hashtag profesional]' : ''}

===LINKEDIN ARTICLE OUTLINE===
Title: [judul artikel yang SEO-friendly]
Introduction: [hook dan konteks]
Section 1: [subtopic dan poin utama]
Section 2: [subtopic dan poin utama]
Section 3: [subtopic dan poin utama]
Conclusion: [key takeaway dan CTA]

Gunakan bahasa profesional tapi tetap approachable.`;

        try {
            const result = await PollinationsAI.generateText(prompt);
            this.results.linkedin = this.parseLinkedInResult(result);
        } catch (error) {
            console.error('LinkedIn generation error:', error);
            this.results.linkedin = { post: 'Error generating content.', article: '' };
        }
    },

    // Facebook content generation
    async generateFacebook(topic, niche, tone, keywords, options) {
        const prompt = `Buatkan konten Facebook untuk topik: "${topic}"

Niche: ${niche}
Tone: ${tone}

===FACEBOOK POST===
${options.hooks ? '[Pembuka yang engaging]' : ''}
[Isi post 150-250 kata, conversational]
${options.cta ? '[Ajakan untuk like/comment/share]' : ''}
${options.hashtags ? '[5-7 hashtag]' : ''}

===FACEBOOK STORY===
[3 ide story dengan text overlay singkat]

Bahasa casual dan friendly, cocok untuk audience Facebook Indonesia.`;

        try {
            const result = await PollinationsAI.generateText(prompt);
            this.results.facebook = this.parseFacebookResult(result);
        } catch (error) {
            console.error('Facebook generation error:', error);
            this.results.facebook = { post: 'Error generating content.', story: '' };
        }
    },

    // Blog content generation
    async generateBlog(topic, niche, tone, keywords, options) {
        const prompt = `Kamu adalah SEO content writer profesional. Buatkan artikel blog untuk topik: "${topic}"

Niche: ${niche}
Keywords: ${keywords || topic}

===BLOG ARTICLE===
# [Judul Artikel yang SEO-Friendly dan Menarik]

## Introduction
[Paragraf pembuka yang engaging, 100-150 kata]

## [Heading 1]
[Konten 150-200 kata]

## [Heading 2]
[Konten 150-200 kata]

## [Heading 3]
[Konten 150-200 kata]

## Kesimpulan
[Summary dan CTA, 100 kata]

===SEO META===
Title Tag: [max 60 karakter]
Meta Description: [max 160 karakter]
Focus Keyword: [keyword utama]
Secondary Keywords: [3-5 keyword]
Slug: [url-friendly-slug]

Artikel harus informatif, well-structured, dan SEO-optimized.`;

        try {
            const result = await PollinationsAI.generateText(prompt);
            this.results.blog = this.parseBlogResult(result);
        } catch (error) {
            console.error('Blog generation error:', error);
            this.results.blog = { article: 'Error generating content.', seo: '' };
        }
    },

    // YouTube content generation
    async generateYouTube(topic, niche, tone, keywords, options) {
        const prompt = `Buatkan konten YouTube untuk topik: "${topic}"

Niche: ${niche}

===YOUTUBE SHORTS SCRIPT (60 detik)===
[HOOK - 3 detik]
"..."

[CONTENT - 50 detik]
[Scene by scene dengan narasi]

[CTA - 7 detik]
"..."

===VIDEO DESCRIPTION===
[Deskripsi 200-300 kata dengan timestamps jika perlu]
🔔 Subscribe: [CTA subscribe]
📱 Follow social media: [placeholder]

===TAGS===
[15-20 tags relevan, dipisah koma]

===THUMBNAIL IDEAS===
1. [Ide thumbnail dengan text overlay]
2. [Ide alternatif]

Bahasa engaging dan cocok untuk YouTube Indonesia.`;

        try {
            const result = await PollinationsAI.generateText(prompt);
            this.results.youtube = this.parseYouTubeResult(result);
        } catch (error) {
            console.error('YouTube generation error:', error);
            this.results.youtube = { shorts: 'Error generating content.', description: '', tags: '' };
        }
    },

    // Parse results helpers
    parseInstagramResult(text) {
        return {
            feed: this.extractSection(text, 'FEED CAPTION', 'REELS SCRIPT'),
            reels: this.extractSection(text, 'REELS SCRIPT', 'STORY IDEAS'),
            story: this.extractSection(text, 'STORY IDEAS', 'CAROUSEL'),
            carousel: this.extractSection(text, 'CAROUSEL', 'IMAGE PROMPTS'),
            imagePrompts: this.extractSection(text, 'IMAGE PROMPTS', '===END') || this.extractSection(text, 'IMAGE PROMPTS', null)
        };
    },

    parseTikTokResult(text) {
        return {
            script: this.extractSection(text, 'VIDEO SCRIPT', 'CAPTION'),
            caption: this.extractSection(text, 'CAPTION', 'SOUND'),
            music: this.extractSection(text, 'SOUND/MUSIC', 'TIPS EDITING'),
            tips: this.extractSection(text, 'TIPS EDITING', null)
        };
    },

    parseTwitterResult(text) {
        return {
            tweet: this.extractSection(text, 'SINGLE TWEET', 'TWITTER THREAD'),
            thread: this.extractSection(text, 'TWITTER THREAD', 'ENGAGEMENT TWEET'),
            engagement: this.extractSection(text, 'ENGAGEMENT TWEET', null)
        };
    },

    parseLinkedInResult(text) {
        return {
            post: this.extractSection(text, 'LINKEDIN POST', 'LINKEDIN ARTICLE'),
            article: this.extractSection(text, 'LINKEDIN ARTICLE OUTLINE', null)
        };
    },

    parseFacebookResult(text) {
        return {
            post: this.extractSection(text, 'FACEBOOK POST', 'FACEBOOK STORY'),
            story: this.extractSection(text, 'FACEBOOK STORY', null)
        };
    },

    parseBlogResult(text) {
        return {
            article: this.extractSection(text, 'BLOG ARTICLE', 'SEO META'),
            seo: this.extractSection(text, 'SEO META', null)
        };
    },

    parseYouTubeResult(text) {
        return {
            shorts: this.extractSection(text, 'YOUTUBE SHORTS SCRIPT', 'VIDEO DESCRIPTION'),
            description: this.extractSection(text, 'VIDEO DESCRIPTION', 'TAGS'),
            tags: this.extractSection(text, 'TAGS', 'THUMBNAIL')
        };
    },

    extractSection(text, startMarker, endMarker) {
        try {
            const startIdx = text.indexOf(startMarker);
            if (startIdx === -1) return text;
            
            let content = text.substring(startIdx + startMarker.length);
            
            if (endMarker) {
                const endIdx = content.indexOf(endMarker);
                if (endIdx !== -1) {
                    content = content.substring(0, endIdx);
                }
            }
            
            return content.replace(/^===+|===+$/g, '').trim();
        } catch (e) {
            return text;
        }
    },

    // Display results in UI
    displayResults(platforms) {
        const resultsContainer = document.getElementById('generation-results');
        resultsContainer.style.display = 'block';

        // Update tabs visibility
        document.querySelectorAll('.result-tab').forEach(tab => {
            const platform = tab.dataset.result;
            tab.style.display = platforms.includes(platform) ? 'inline-block' : 'none';
        });

        // Populate results
        if (this.results.instagram) {
            document.getElementById('ig-feed-result').innerHTML = this.formatResult(this.results.instagram.feed);
            document.getElementById('ig-reels-result').innerHTML = this.formatResult(this.results.instagram.reels);
            document.getElementById('ig-story-result').innerHTML = this.formatResult(this.results.instagram.story);
            document.getElementById('ig-carousel-result').innerHTML = this.formatResult(this.results.instagram.carousel);
            document.getElementById('ig-image-result').innerHTML = this.formatResult(this.results.instagram.imagePrompts);
        }

        if (this.results.tiktok) {
            document.getElementById('tt-script-result').innerHTML = this.formatResult(this.results.tiktok.script);
            document.getElementById('tt-caption-result').innerHTML = this.formatResult(this.results.tiktok.caption);
            document.getElementById('tt-music-result').innerHTML = this.formatResult(this.results.tiktok.music);
        }

        if (this.results.twitter) {
            document.getElementById('tw-tweet-result').innerHTML = this.formatResult(this.results.twitter.tweet);
            document.getElementById('tw-thread-result').innerHTML = this.formatResult(this.results.twitter.thread);
        }

        if (this.results.linkedin) {
            document.getElementById('li-post-result').innerHTML = this.formatResult(this.results.linkedin.post);
            document.getElementById('li-article-result').innerHTML = this.formatResult(this.results.linkedin.article);
        }

        if (this.results.facebook) {
            document.getElementById('fb-post-result').innerHTML = this.formatResult(this.results.facebook.post);
            document.getElementById('fb-story-result').innerHTML = this.formatResult(this.results.facebook.story);
        }

        if (this.results.blog) {
            document.getElementById('blog-article-result').innerHTML = this.formatResult(this.results.blog.article);
            document.getElementById('blog-seo-result').innerHTML = this.formatResult(this.results.blog.seo);
        }

        if (this.results.youtube) {
            document.getElementById('yt-shorts-result').innerHTML = this.formatResult(this.results.youtube.shorts);
            document.getElementById('yt-desc-result').innerHTML = this.formatResult(this.results.youtube.description);
            document.getElementById('yt-tags-result').innerHTML = this.formatResult(this.results.youtube.tags);
        }

        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    },

    formatResult(text) {
        if (!text) return '<p class="no-result">Tidak ada hasil</p>';
        return `<pre>${text}</pre>`;
    },

    // Save all results to database
    saveAll(topic) {
        const platforms = Object.keys(this.results);
        let savedCount = 0;

        platforms.forEach(platform => {
            const platformResults = this.results[platform];
            Object.keys(platformResults).forEach(type => {
                if (platformResults[type]) {
                    DB.content.add({
                        type: type,
                        platform: platform,
                        topic: topic,
                        content: platformResults[type],
                        status: 'draft',
                        viralScore: ViralEngine.calculateViralScore(platformResults[type])
                    });
                    savedCount++;
                }
            });
        });

        return savedCount;
    },

    // Export all results
    exportAll(topic) {
        const exportData = {
            topic,
            generatedAt: new Date().toISOString(),
            platforms: this.results
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `content-${topic.substring(0, 20).replace(/\s+/g, '-')}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// Global functions
async function generateAllPlatforms() {
    const topic = document.getElementById('main-topic').value;
    if (!topic) {
        showToast('Masukkan topik/ide konten terlebih dahulu', 'warning');
        return;
    }

    const niche = document.getElementById('content-niche').value;
    const tone = document.getElementById('content-tone').value;
    const keywords = document.getElementById('content-keywords').value;

    await MultiPlatform.generateAll(topic, niche, tone, keywords);
}

async function quickGenerateAll() {
    const topic = document.getElementById('quick-idea').value;
    if (!topic) {
        showToast('Masukkan ide konten', 'warning');
        return;
    }

    // Navigate to one-click section
    navigateTo('one-click');
    document.getElementById('main-topic').value = topic;
    
    await MultiPlatform.generateAll(topic, 'general', 'casual', '');
}

function saveAllResults() {
    const topic = document.getElementById('main-topic').value || 'Untitled';
    const count = MultiPlatform.saveAll(topic);
    showToast(`${count} konten berhasil disimpan!`, 'success');
    loadDatabaseContent();
    loadDashboardStats();
}

function exportAllResults() {
    const topic = document.getElementById('main-topic').value || 'content';
    MultiPlatform.exportAll(topic);
    showToast('Export berhasil!', 'success');
}

function scheduleAllResults() {
    showToast('Fitur schedule coming soon!', 'info');
}

function copyResult(elementId) {
    const element = document.getElementById(elementId);
    const text = element.innerText || element.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied!', 'success');
    });
}

function saveResult(platform, type) {
    const topic = document.getElementById('main-topic').value || 'Untitled';
    const content = MultiPlatform.results[platform]?.[type];
    
    if (content) {
        DB.content.add({
            type,
            platform,
            topic,
            content,
            status: 'draft',
            viralScore: ViralEngine.calculateViralScore(content)
        });
        showToast('Konten disimpan!', 'success');
        loadDatabaseContent();
    }
}

// Setup result tabs
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.result-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const platform = tab.dataset.result;
            
            document.querySelectorAll('.result-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.result-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`result-${platform}`)?.classList.add('active');
        });
    });

    // Platform toggle handlers
    document.querySelectorAll('.platform-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const checkbox = toggle.querySelector('input');
            checkbox.checked = !checkbox.checked;
            toggle.classList.toggle('active', checkbox.checked);
        });
    });
});
