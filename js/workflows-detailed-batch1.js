// ==================== WORKFLOWS DETAILED - BATCH 1 (WF-001 to WF-030) ====================
// Complete form fields for comprehensive Google Opal output
// Version 3.0 - December 2025

const WorkflowsDetailedBatch1 = {

    // ═══════════════════════════════════════════════════════════════
    // WF-001: SEO Article Generator Pro
    // ═══════════════════════════════════════════════════════════════
    'seo-article-pro': {
        id: 'WF-001',
        file: '01-seo-article-generator.txt',
        name: 'SEO Article Generator Pro',
        icon: '📝',
        category: 'text',
        tags: ['text', 'popular', 'marketing'],
        description: 'Generate 10 SEO-optimized articles with E-E-A-T compliance, schema markup, and multi-platform adaptations',
        output: '10 articles + 7 platform versions',
        models: 'Gemini 2.5 Pro + Deep Research',
        difficulty: 'advanced',
        estimatedTime: '15-20 min',
        popular: true,
        opalLink: 'https://opal.google/?flow=drive:/1iKKJXtwA00RfHlHI5IC12-Pq_1aUYLac&shared&mode=app',
        fields: [
            { id: 'article_topic', type: 'text', label: 'Topik Artikel', placeholder: 'e.g., Cara Memulai Bisnis Online 2025', required: true, helpText: 'Topik utama yang akan dibahas dalam artikel' },
            { id: 'target_keywords', type: 'textarea', label: 'Target Keywords', placeholder: 'bisnis online\ncara jualan online\nusaha rumahan\n(satu keyword per baris)', required: true, helpText: 'Masukkan 3-10 keywords yang ingin ditarget' },
            { id: 'tone', type: 'select', label: 'Tone/Gaya Penulisan', options: ['Professional - Formal dan kredibel', 'Casual - Santai dan friendly', 'Educational - Informatif dan mengajar', 'Inspirational - Memotivasi dan menginspirasi', 'Authoritative - Expert dan berwibawa', 'Conversational - Seperti ngobrol'], required: true },
            { id: 'article_length', type: 'select', label: 'Panjang Artikel', options: ['Short (800 kata) - Quick read', 'Medium (1500 kata) - Standard blog', 'Long (2500 kata) - Comprehensive', 'Pillar (4000+ kata) - Ultimate guide'], required: true },
            { id: 'language', type: 'select', label: 'Bahasa', options: ['Indonesian', 'English', 'Both (ID + EN)'], required: true },
            { id: 'brand_name', type: 'text', label: 'Nama Brand/Perusahaan', placeholder: 'e.g., raycorp', required: false, helpText: 'Untuk personalisasi konten' },
            { id: 'brand_description', type: 'textarea', label: 'Deskripsi Brand', placeholder: 'Jelaskan bisnis/brand Anda secara singkat...', required: false },
            { id: 'target_audience', type: 'text', label: 'Target Audience', placeholder: 'e.g., Entrepreneur muda usia 25-35 tahun', required: true },
            { id: 'content_goal', type: 'select', label: 'Tujuan Konten', options: ['Awareness - Memperkenalkan brand/topik', 'Traffic - Mendatangkan pengunjung', 'Conversion - Menghasilkan leads/sales', 'Education - Mengedukasi audience', 'Authority - Membangun kredibilitas'], required: true },
            { id: 'industry', type: 'text', label: 'Industri/Niche', placeholder: 'e.g., Digital Marketing, Fashion, F&B', required: true },
            { id: 'competitors', type: 'textarea', label: 'Kompetitor (Opsional)', placeholder: 'Sebutkan 2-3 kompetitor untuk analisis...', required: false },
            { id: 'unique_angle', type: 'textarea', label: 'Sudut Pandang Unik', placeholder: 'Apa yang membuat artikel ini berbeda dari yang lain?', required: false }
        ],
        promptTemplate: `=== SEO ARTICLE GENERATION REQUEST ===

TOPIC: {article_topic}
KEYWORDS: {target_keywords}
TONE: {tone}
LENGTH: {article_length}
LANGUAGE: {language}

BRAND CONTEXT:
- Brand Name: {brand_name}
- Description: {brand_description}
- Industry: {industry}

TARGET AUDIENCE: {target_audience}
CONTENT GOAL: {content_goal}
COMPETITORS: {competitors}
UNIQUE ANGLE: {unique_angle}

INSTRUCTIONS:
1. Research topic thoroughly using web search
2. Generate 10 unique SEO-optimized article variations:
   - Variation 1: Listicle format
   - Variation 2: How-to guide
   - Variation 3: Case study style
   - Variation 4: Storytelling approach
   - Variation 5: Expert roundup
   - Variation 6: Comparison/VS format
   - Variation 7: Beginner's guide
   - Variation 8: Advanced deep-dive
   - Variation 9: News/trend angle
   - Variation 10: Controversial/hot take

3. Each article must include:
   - SEO title (max 60 chars)
   - Meta description (150-160 chars)
   - Full article with H2/H3 structure
   - FAQ section (5 questions)
   - Internal linking suggestions

4. Create platform adaptations:
   - LinkedIn article
   - Medium post
   - Blog excerpt
   - Email newsletter
   - Twitter thread
   - Instagram caption
   - Facebook post

OUTPUT: Complete multi-format content package.`
    },

    // ═══════════════════════════════════════════════════════════════
    // WF-002: Viral Thread Generator
    // ═══════════════════════════════════════════════════════════════
    'viral-thread': {
        id: 'WF-002',
        file: '02-viral-thread-generator.txt',
        name: 'Viral Thread Master',
        icon: '🐦',
        category: 'text',
        tags: ['text', 'popular', 'marketing'],
        description: 'Generate 15 viral Twitter/X threads with psychological hooks and engagement optimization',
        output: '15 threads + reply templates',
        models: 'Gemini 2.5 Pro',
        difficulty: 'intermediate',
        estimatedTime: '8-12 min',
        popular: true,
        opalLink: 'https://opal.google/?flow=drive:/1z7y4Y7xRAKBDWN0-nuBVt1FysTUO-BoG&shared&mode=app',
        fields: [
            { id: 'thread_topic', type: 'text', label: 'Topik Thread', placeholder: 'e.g., 10 Kesalahan Fatal Entrepreneur Pemula', required: true },
            { id: 'thread_style', type: 'select', label: 'Gaya Thread', options: ['Educational - Mengajarkan sesuatu', 'Story - Cerita dengan narrative arc', 'Listicle - Tips/list format', 'Controversial - Hot take yang memancing diskusi', 'Case Study - Analisis mendalam', 'Myth-Busting - Membongkar mitos', 'Behind-the-Scenes - Rahasia/proses', 'Prediction - Prediksi masa depan'], required: true },
            { id: 'tweet_count', type: 'select', label: 'Jumlah Tweet per Thread', options: ['5 tweets - Quick thread', '7 tweets - Standard', '10 tweets - Comprehensive', '15 tweets - Deep dive', '20 tweets - Ultimate thread'], required: true },
            { id: 'hook_style', type: 'select', label: 'Gaya Hook (Tweet Pertama)', options: ['Question - Pertanyaan yang memancing', 'Bold Statement - Pernyataan berani', 'Statistics - Data mengejutkan', 'Story Opening - Pembuka cerita', 'Controversy - Pendapat kontroversial', 'Promise - Janji value yang akan didapat'], required: true },
            { id: 'target_audience', type: 'text', label: 'Target Audience', placeholder: 'e.g., Startup founders, Content creators', required: true },
            { id: 'key_points', type: 'textarea', label: 'Poin-Poin Utama', placeholder: 'Masukkan poin-poin yang ingin dibahas (satu per baris)...', required: true, helpText: 'Minimal 3 poin utama' },
            { id: 'include_cta', type: 'select', label: 'Include CTA?', options: ['Yes - Dengan call-to-action', 'No - Tanpa CTA'], required: true },
            { id: 'cta_type', type: 'select', label: 'Tipe CTA', options: ['Follow for more', 'Retweet to share', 'Comment your thoughts', 'Check link in bio', 'DM for details', 'Custom CTA'], required: false },
            { id: 'brand_voice', type: 'select', label: 'Brand Voice', options: ['Professional', 'Casual/Friendly', 'Witty/Humorous', 'Inspirational', 'Direct/No-nonsense'], required: true },
            { id: 'include_emojis', type: 'select', label: 'Penggunaan Emoji', options: ['Minimal - 1-2 per tweet', 'Moderate - 2-3 per tweet', 'Heavy - 3-5 per tweet', 'None - Tanpa emoji'], required: true }
        ],
        promptTemplate: `=== VIRAL THREAD GENERATION REQUEST ===

TOPIC: {thread_topic}
STYLE: {thread_style}
TWEETS PER THREAD: {tweet_count}
HOOK STYLE: {hook_style}

TARGET AUDIENCE: {target_audience}
BRAND VOICE: {brand_voice}
EMOJI USAGE: {include_emojis}

KEY POINTS TO COVER:
{key_points}

CTA: {include_cta}
CTA TYPE: {cta_type}

INSTRUCTIONS:
1. Generate 15 UNIQUE thread variations on this topic
2. Each thread must have:
   - Killer hook (first tweet) using {hook_style} style
   - {tweet_count} tweets total
   - Each tweet under 280 characters
   - Logical flow and narrative arc
   - Engagement triggers (questions, bold statements)
   - Final tweet with CTA (if enabled)

3. For each thread, provide:
   - Complete thread text
   - Best posting time suggestion
   - Reply templates for common responses
   - Quote tweet suggestions

4. Include 5 different hook variations for A/B testing

OUTPUT: 15 complete threads ready to post.`
    },

    // ═══════════════════════════════════════════════════════════════
    // WF-003: Carousel Image Generator
    // ═══════════════════════════════════════════════════════════════
    'carousel-master': {
        id: 'WF-003',
        file: '03-carousel-image-generator.txt',
        name: 'Carousel Master',
        icon: '🎨',
        category: 'image',
        tags: ['image', 'popular', 'marketing'],
        description: 'Generate complete carousel sets with 3 style variations (Photo-realistic, Illustrated, Abstract)',
        output: '30 images (10 slides × 3 styles)',
        models: 'Imagen 4 + Gemini',
        difficulty: 'intermediate',
        estimatedTime: '10-15 min',
        popular: true,
        opalLink: 'https://opal.google/?flow=drive:/1DylGNfxIAapiiOl_2TleOPS3oElZITgi&shared&mode=app',
        fields: [
            { id: 'carousel_topic', type: 'text', label: 'Topik Carousel', placeholder: 'e.g., 10 Tips Produktivitas untuk WFH', required: true },
            { id: 'slide_count', type: 'select', label: 'Jumlah Slide', options: ['5 slides - Quick tips', '7 slides - Standard', '10 slides - Comprehensive', '12 slides - Extended', '15 slides - Ultimate guide'], required: true },
            { id: 'visual_style', type: 'select', label: 'Gaya Visual Utama', options: ['Minimalist Modern - Clean dan simple', 'Bold & Colorful - Vibrant dan eye-catching', 'Professional Corporate - Formal dan kredibel', 'Aesthetic Soft - Pastel dan lembut', 'Dark Mode - Gelap dan premium', 'Neon Futuristic - Glow dan modern', 'Vintage Retro - Klasik dan nostalgic', 'Gradient Mesh - Gradasi modern'], required: true },
            { id: 'primary_color', type: 'color', label: 'Warna Utama Brand', placeholder: '#6366F1', required: true, helpText: 'Pilih warna utama brand Anda' },
            { id: 'secondary_color', type: 'color', label: 'Warna Sekunder', placeholder: '#EC4899', required: true },
            { id: 'brand_name', type: 'text', label: 'Nama Brand', placeholder: 'e.g., raycorp', required: false },
            { id: 'aspect_ratio', type: 'select', label: 'Aspect Ratio', options: ['1:1 (Instagram Square) - 1080×1080', '4:5 (Instagram Portrait) - 1080×1350', '9:16 (Stories/Reels) - 1080×1920', '16:9 (LinkedIn/Twitter) - 1200×675'], required: true },
            { id: 'content_goal', type: 'select', label: 'Tujuan Konten', options: ['Educate - Mengajarkan sesuatu', 'Inspire - Memotivasi audience', 'Sell - Mempromosikan produk/jasa', 'Entertain - Menghibur', 'Inform - Memberikan informasi'], required: true },
            { id: 'target_audience', type: 'text', label: 'Target Audience', placeholder: 'e.g., Profesional muda 25-35 tahun', required: true },
            { id: 'key_message', type: 'textarea', label: 'Pesan Utama', placeholder: 'Apa pesan utama yang ingin disampaikan melalui carousel ini?', required: true },
            { id: 'slide_structure', type: 'select', label: 'Struktur Slide', options: ['Hook → Problem → Solution → CTA', 'Hook → Tips 1-8 → CTA', 'Hook → Story → Lesson → CTA', 'Hook → Before/After → How → CTA', 'Custom structure'], required: true },
            { id: 'text_position', type: 'select', label: 'Posisi Teks', options: ['Center - Tengah', 'Top - Atas', 'Bottom - Bawah', 'Mixed - Bervariasi'], required: true },
            { id: 'include_icons', type: 'select', label: 'Include Icons/Graphics?', options: ['Yes - Dengan icons', 'No - Tanpa icons', 'Minimal - Sedikit icons'], required: true }
        ],
        promptTemplate: `=== CAROUSEL IMAGE GENERATION REQUEST ===

TOPIC: {carousel_topic}
SLIDES: {slide_count}
VISUAL STYLE: {visual_style}

BRAND:
- Name: {brand_name}
- Primary Color: {primary_color}
- Secondary Color: {secondary_color}

ASPECT RATIO: {aspect_ratio}
CONTENT GOAL: {content_goal}
TARGET AUDIENCE: {target_audience}
TEXT POSITION: {text_position}
INCLUDE ICONS: {include_icons}

SLIDE STRUCTURE: {slide_structure}

KEY MESSAGE:
{key_message}

INSTRUCTIONS:
1. Create content for {slide_count} slides following {slide_structure}
2. For each slide, generate:
   - Headline (max 6 words)
   - Subtext (max 15 words)
   - Visual concept description
   - Icon/graphic suggestion

3. Generate 3 style variations for each slide:
   - Style A: Photo-realistic (Imagen 4)
   - Style B: Illustrated/Graphic (flat design)
   - Style C: Abstract/Artistic (gradient-based)

4. Create Instagram caption:
   - Hook line (shows in preview)
   - Full caption (500-800 chars)
   - 25 hashtags (10 high-volume + 10 niche + 5 branded)
   - Alt text for accessibility

5. Total output: {slide_count} × 3 = images

OUTPUT: Complete carousel package with all variations.`
    },

    // ═══════════════════════════════════════════════════════════════
    // WF-004: Single Image 10 Variations
    // ═══════════════════════════════════════════════════════════════
    'magic-variation': {
        id: 'WF-004',
        file: '04-single-image-10-variations.txt',
        name: 'Single Image 10 Variations',
        icon: '🎭',
        category: 'image',
        tags: ['image', 'utility'],
        description: 'Generate 10 unique image variations from a single concept for A/B testing',
        output: '10 image variations',
        models: 'Imagen 4',
        difficulty: 'beginner',
        estimatedTime: '5-8 min',
        opalLink: 'https://opal.google/?flow=drive:/1vzX3JmhII1j6olnWgYSvTxGVPYcF_LuS&shared&mode=app',
        fields: [
            { id: 'image_concept', type: 'textarea', label: 'Konsep Gambar', placeholder: 'Deskripsikan gambar yang ingin dibuat secara detail...\n\nContoh: Foto produk skincare dengan background marble putih, pencahayaan soft studio, angle 45 derajat', required: true, helpText: 'Semakin detail deskripsi, semakin akurat hasilnya' },
            { id: 'image_type', type: 'select', label: 'Tipe Gambar', options: ['Product Shot - Foto produk', 'Lifestyle - Gaya hidup', 'Portrait - Potret/wajah', 'Landscape - Pemandangan', 'Abstract - Abstrak', 'Food - Makanan', 'Fashion - Mode/pakaian', 'Interior - Ruangan', 'Flat Lay - Tampak atas'], required: true },
            { id: 'style_preference', type: 'select', label: 'Gaya Visual', options: ['Realistic - Foto realistis', 'Artistic - Artistik', 'Minimalist - Minimalis', 'Vibrant - Warna cerah', 'Moody/Dark - Gelap dramatis', 'Pastel - Warna lembut', 'High Contrast - Kontras tinggi', 'Vintage - Retro/klasik'], required: true },
            { id: 'color_palette', type: 'text', label: 'Palet Warna', placeholder: 'e.g., Biru navy, putih, gold', required: false },
            { id: 'mood', type: 'select', label: 'Mood/Suasana', options: ['Professional - Profesional', 'Playful - Ceria', 'Elegant - Elegan', 'Cozy - Nyaman', 'Energetic - Energik', 'Calm - Tenang', 'Luxurious - Mewah', 'Natural - Alami'], required: true },
            { id: 'aspect_ratio', type: 'select', label: 'Aspect Ratio', options: ['1:1 Square', '4:5 Portrait', '16:9 Landscape', '9:16 Vertical', '3:4 Portrait', '4:3 Landscape'], required: true },
            { id: 'variation_focus', type: 'select', label: 'Fokus Variasi', options: ['Color variations - Variasi warna', 'Angle variations - Variasi sudut', 'Lighting variations - Variasi pencahayaan', 'Style variations - Variasi gaya', 'Composition variations - Variasi komposisi', 'All - Semua variasi'], required: true },
            { id: 'use_case', type: 'select', label: 'Penggunaan', options: ['Social Media Post', 'Ad Creative', 'Website Banner', 'Product Catalog', 'Email Marketing', 'Print Material'], required: true }
        ],
        promptTemplate: `=== SINGLE IMAGE 10 VARIATIONS REQUEST ===

IMAGE CONCEPT:
{image_concept}

IMAGE TYPE: {image_type}
STYLE: {style_preference}
COLOR PALETTE: {color_palette}
MOOD: {mood}
ASPECT RATIO: {aspect_ratio}
VARIATION FOCUS: {variation_focus}
USE CASE: {use_case}

INSTRUCTIONS:
Generate 10 UNIQUE variations of this image concept:

VARIATION 1: Original concept - baseline
VARIATION 2: Different color temperature (warmer)
VARIATION 3: Different color temperature (cooler)
VARIATION 4: Different angle/perspective
VARIATION 5: Different lighting (dramatic)
VARIATION 6: Different lighting (soft/diffused)
VARIATION 7: Different composition (closer)
VARIATION 8: Different composition (wider)
VARIATION 9: Different style interpretation
VARIATION 10: Creative/artistic interpretation

Each variation must:
- Maintain core concept
- Be distinct enough for A/B testing
- Match the specified mood and style
- Be suitable for {use_case}

OUTPUT: 10 high-quality images ready for use.`
    },

    // ═══════════════════════════════════════════════════════════════
    // WF-005: Short Video Generator
    // ═══════════════════════════════════════════════════════════════
    'short-video': {
        id: 'WF-005',
        file: '05-short-video-generator.txt',
        name: 'Short Video Generator',
        icon: '📱',
        category: 'video',
        tags: ['video', 'popular', 'marketing'],
        description: 'Generate TikTok/Reels/Shorts with complete scripts, visuals, and music suggestions',
        output: '5-10 video variations',
        models: 'Veo + Gemini + Lyria 2',
        difficulty: 'intermediate',
        estimatedTime: '10-15 min',
        popular: true,
        opalLink: 'https://opal.google/?flow=drive:/1hfHwKTdLdQChI2CNPffGJQdwITZnrlB5&shared&mode=app',
        fields: [
            { id: 'video_concept', type: 'textarea', label: 'Konsep Video', placeholder: 'Deskripsikan ide video Anda...\n\nContoh: Tutorial singkat cara membuat kopi latte art di rumah dengan alat sederhana', required: true },
            { id: 'video_duration', type: 'select', label: 'Durasi Video', options: ['15 detik - Ultra short', '30 detik - Short', '60 detik - Standard', '90 detik - Extended'], required: true },
            { id: 'video_style', type: 'select', label: 'Gaya Video', options: ['Talking Head - Berbicara ke kamera', 'B-Roll Montage - Kumpulan footage', 'Text on Screen - Teks dengan visual', 'Product Demo - Demo produk', 'Tutorial/How-to - Langkah-langkah', 'Story/Narrative - Bercerita', 'Before/After - Transformasi', 'POV Style - Sudut pandang pertama', 'Vlog Style - Gaya vlog casual'], required: true },
            { id: 'energy_level', type: 'select', label: 'Level Energi', options: ['High Energy - Cepat dan energik', 'Medium - Seimbang', 'Calm/ASMR - Tenang dan soothing', 'Dramatic - Dramatis dan intens'], required: true },
            { id: 'platform', type: 'select', label: 'Platform Utama', options: ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'All Platforms'], required: true },
            { id: 'hook_type', type: 'select', label: 'Tipe Hook (3 detik pertama)', options: ['Question - Pertanyaan', 'Bold Statement - Pernyataan berani', 'Visual Shock - Visual mengejutkan', 'Promise - Janji value', 'Controversy - Kontroversial', 'Curiosity Gap - Membuat penasaran'], required: true },
            { id: 'key_message', type: 'text', label: 'Pesan Utama', placeholder: 'Apa yang ingin penonton ingat setelah menonton?', required: true },
            { id: 'target_audience', type: 'text', label: 'Target Audience', placeholder: 'e.g., Gen Z yang tertarik dengan coffee culture', required: true },
            { id: 'include_music', type: 'select', label: 'Include Music?', options: ['Yes - Dengan musik background', 'No - Tanpa musik', 'Trending Sound - Gunakan sound viral'], required: true },
            { id: 'music_mood', type: 'select', label: 'Mood Musik', options: ['Upbeat/Energetic', 'Chill/Relaxed', 'Dramatic/Cinematic', 'Funny/Quirky', 'Inspirational', 'Trending/Viral'], required: false },
            { id: 'include_captions', type: 'select', label: 'Include Captions?', options: ['Yes - Auto captions', 'No - Tanpa caption'], required: true },
            { id: 'cta_type', type: 'select', label: 'Call-to-Action', options: ['Follow for more', 'Like & Share', 'Comment below', 'Check link in bio', 'Save this video', 'Try it yourself', 'No CTA'], required: true },
            { id: 'brand_name', type: 'text', label: 'Nama Brand (Opsional)', placeholder: 'Untuk watermark/mention', required: false }
        ],
        promptTemplate: `=== SHORT VIDEO GENERATION REQUEST ===

VIDEO CONCEPT:
{video_concept}

DURATION: {video_duration}
STYLE: {video_style}
ENERGY: {energy_level}
PLATFORM: {platform}

HOOK TYPE: {hook_type}
KEY MESSAGE: {key_message}
TARGET AUDIENCE: {target_audience}

AUDIO:
- Include Music: {include_music}
- Music Mood: {music_mood}
- Include Captions: {include_captions}

CTA: {cta_type}
BRAND: {brand_name}

INSTRUCTIONS:
1. Create detailed video script with:
   - HOOK (0-3 seconds): {hook_type} style
   - SETUP (3-10 seconds): Context/problem
   - MAIN CONTENT: Value delivery
   - CTA (last 3-5 seconds): {cta_type}

2. For each scene, specify:
   - VISUAL: What's on screen
   - AUDIO: Voiceover/dialogue
   - TEXT OVERLAY: On-screen text
   - TRANSITION: Cut type
   - B-ROLL: Supporting footage

3. Generate 5 script variations:
   - Version 1: Original concept
   - Version 2: Different hook
   - Version 3: Faster pacing
   - Version 4: Story-driven
   - Version 5: Trend-based format

4. Include:
   - Music suggestions (trending sounds)
   - Caption/subtitle text
   - Hashtag recommendations
   - Best posting time

OUTPUT: 5 complete video packages ready for production.`
    },

    // ═══════════════════════════════════════════════════════════════
    // WF-006: YouTube Video Generator
    // ═══════════════════════════════════════════════════════════════
    'youtube-video': {
        id: 'WF-006',
        file: '06-youtube-video-generator.txt',
        name: 'YouTube Video Generator',
        icon: '🎬',
        category: 'video',
        tags: ['video', 'marketing'],
        description: 'Complete YouTube video package with script, thumbnail, SEO, and chapter markers',
        output: 'Full video package',
        models: 'Gemini 3 Pro + Veo + Imagen 4',
        difficulty: 'advanced',
        estimatedTime: '20-30 min',
        opalLink: 'https://opal.google/?flow=drive:/1uKIlsTBDZsVEfcWalIORj_e2gvEfH27j&shared&mode=app',
        fields: [
            { id: 'video_topic', type: 'text', label: 'Topik Video', placeholder: 'e.g., Complete Guide to Starting a YouTube Channel in 2025', required: true },
            { id: 'video_type', type: 'select', label: 'Tipe Video', options: ['Tutorial/How-to - Langkah-langkah', 'Vlog - Video blog personal', 'Review - Ulasan produk/jasa', 'Documentary - Dokumenter', 'List Video - Top 10, Best of', 'Interview - Wawancara', 'Reaction - Video reaksi', 'Educational - Edukasi mendalam', 'Entertainment - Hiburan'], required: true },
            { id: 'video_duration', type: 'select', label: 'Target Durasi', options: ['5 minutes - Quick video', '10 minutes - Standard', '15 minutes - Comprehensive', '20 minutes - Deep dive', '30+ minutes - Ultimate guide'], required: true },
            { id: 'target_audience', type: 'text', label: 'Target Audience', placeholder: 'e.g., Beginner content creators aged 18-35', required: true },
            { id: 'channel_niche', type: 'text', label: 'Niche Channel', placeholder: 'e.g., Tech, Business, Lifestyle', required: true },
            { id: 'tone', type: 'select', label: 'Tone Video', options: ['Professional - Formal dan kredibel', 'Casual/Friendly - Santai dan ramah', 'Energetic - Penuh semangat', 'Educational - Informatif', 'Entertaining - Menghibur', 'Inspirational - Memotivasi'], required: true },
            { id: 'key_points', type: 'textarea', label: 'Poin-Poin Utama', placeholder: 'Masukkan poin-poin yang harus dibahas (satu per baris)...', required: true },
            { id: 'include_intro', type: 'select', label: 'Include Intro Animation?', options: ['Yes - Dengan intro', 'No - Langsung ke konten'], required: true },
            { id: 'include_endscreen', type: 'select', label: 'Include End Screen?', options: ['Yes - Dengan end screen', 'No - Tanpa end screen'], required: true },
            { id: 'thumbnail_style', type: 'select', label: 'Gaya Thumbnail', options: ['Face + Text - Wajah dengan teks', 'Product Focus - Fokus produk', 'Before/After - Transformasi', 'Listicle - Angka besar', 'Dramatic - Ekspresi dramatis', 'Minimalist - Simple dan clean'], required: true },
            { id: 'competitor_channels', type: 'textarea', label: 'Channel Kompetitor (Opsional)', placeholder: 'Sebutkan channel serupa untuk referensi...', required: false },
            { id: 'monetization_goal', type: 'select', label: 'Tujuan Monetisasi', options: ['Ad Revenue - Pendapatan iklan', 'Affiliate - Link afiliasi', 'Sponsorship - Sponsor', 'Product Sales - Jualan produk', 'Lead Generation - Dapat leads', 'Brand Awareness - Awareness saja'], required: true }
        ],
        promptTemplate: `=== YOUTUBE VIDEO GENERATION REQUEST ===

VIDEO TOPIC: {video_topic}
VIDEO TYPE: {video_type}
DURATION: {video_duration}
CHANNEL NICHE: {channel_niche}
TONE: {tone}

TARGET AUDIENCE: {target_audience}
MONETIZATION GOAL: {monetization_goal}

KEY POINTS TO COVER:
{key_points}

PRODUCTION:
- Include Intro: {include_intro}
- Include End Screen: {include_endscreen}
- Thumbnail Style: {thumbnail_style}

COMPETITORS: {competitor_channels}

INSTRUCTIONS:
1. Research topic and create comprehensive outline
2. Generate complete video script with:
   - Hook (first 30 seconds)
   - Intro (if enabled)
   - Main content with chapters
   - Conclusion
   - CTA and end screen

3. For each section, include:
   - Exact script/dialogue
   - [PAUSE] markers
   - [EMPHASIS] markers
   - [SHOW GRAPHIC: description]
   - [B-ROLL: description]
   - [TRANSITION] markers

4. Create SEO package:
   - 5 title options (optimized)
   - Description with timestamps
   - 30 tags
   - Chapter markers

5. Generate 5 thumbnail concepts:
   - {thumbnail_style} style
   - High contrast
   - Click-worthy

6. Include:
   - B-roll shot list
   - Music suggestions per section
   - Equipment recommendations

OUTPUT: Complete YouTube video production package.`
    },

    // ═══════════════════════════════════════════════════════════════
    // WF-007: Complete Content Package
    // ═══════════════════════════════════════════════════════════════
    'complete-package': {
        id: 'WF-007',
        file: '07-complete-content-package.txt',
        name: 'Complete Content Package',
        icon: '📦',
        category: 'complete',
        tags: ['complete', 'popular'],
        description: 'All-in-one content package: article, video script, carousel, audio, and social posts',
        output: 'Multi-format content suite',
        models: 'All Models',
        difficulty: 'advanced',
        estimatedTime: '30-45 min',
        popular: true,
        opalLink: 'https://opal.google/?flow=drive:/12ke0c7sqsi48D0O6u-bx10XH6Bhv8A3_&shared&mode=app',
        fields: [
            { id: 'content_topic', type: 'text', label: 'Topik Konten', placeholder: 'e.g., Panduan Lengkap Digital Marketing untuk UMKM', required: true },
            { id: 'brand_name', type: 'text', label: 'Nama Brand', placeholder: 'e.g., raycorp', required: true },
            { id: 'brand_description', type: 'textarea', label: 'Deskripsi Brand', placeholder: 'Jelaskan bisnis/brand Anda...', required: true },
            { id: 'target_audience', type: 'text', label: 'Target Audience', placeholder: 'e.g., Pemilik UMKM usia 30-50 tahun', required: true },
            { id: 'content_goal', type: 'select', label: 'Tujuan Utama', options: ['Brand Awareness', 'Lead Generation', 'Sales/Conversion', 'Education', 'Community Building'], required: true },
            { id: 'platforms', type: 'select', label: 'Platform Target', options: ['All Platforms', 'Social Only (IG, TikTok, Twitter)', 'Blog + Social', 'Video + Social', 'Professional (LinkedIn, Medium)'], required: true },
            { id: 'tone', type: 'select', label: 'Tone Keseluruhan', options: ['Professional', 'Casual/Friendly', 'Educational', 'Inspirational', 'Entertaining'], required: true },
            { id: 'primary_color', type: 'color', label: 'Warna Utama Brand', placeholder: '#6366F1', required: true },
            { id: 'secondary_color', type: 'color', label: 'Warna Sekunder', placeholder: '#EC4899', required: true },
            { id: 'key_messages', type: 'textarea', label: 'Pesan Kunci (3-5 poin)', placeholder: 'Masukkan pesan-pesan utama yang ingin disampaikan...', required: true },
            { id: 'cta_primary', type: 'text', label: 'CTA Utama', placeholder: 'e.g., Daftar sekarang, Hubungi kami', required: true },
            { id: 'campaign_duration', type: 'select', label: 'Durasi Campaign', options: ['1 Week', '2 Weeks', '1 Month', 'Ongoing'], required: true }
        ],
        promptTemplate: `=== COMPLETE CONTENT PACKAGE REQUEST ===

TOPIC: {content_topic}

BRAND:
- Name: {brand_name}
- Description: {brand_description}
- Primary Color: {primary_color}
- Secondary Color: {secondary_color}

TARGET AUDIENCE: {target_audience}
CONTENT GOAL: {content_goal}
PLATFORMS: {platforms}
TONE: {tone}
CAMPAIGN DURATION: {campaign_duration}

KEY MESSAGES:
{key_messages}

PRIMARY CTA: {cta_primary}

INSTRUCTIONS:
Generate COMPLETE content package including:

1. BLOG/ARTICLE CONTENT:
   - 1 pillar article (2500+ words)
   - 5 supporting articles (1000 words each)
   - All SEO optimized

2. VIDEO CONTENT:
   - 1 long-form video script (10-15 min)
   - 5 short-form video scripts (30-60 sec)
   - Thumbnail concepts for each

3. CAROUSEL CONTENT:
   - 5 carousel sets (10 slides each)
   - 3 style variations per carousel

4. SOCIAL MEDIA POSTS:
   - 20 Instagram posts with captions
   - 10 Twitter threads
   - 10 LinkedIn posts
   - 10 Facebook posts

5. AUDIO CONTENT:
   - 1 podcast episode script
   - 5 audio snippet scripts

6. EMAIL CONTENT:
   - 5-email nurture sequence
   - Subject lines and preview text

7. CONTENT CALENDAR:
   - {campaign_duration} posting schedule
   - Platform-specific timing

OUTPUT: Complete multi-channel content suite.`
    },

    // ═══════════════════════════════════════════════════════════════
    // WF-008: Podcast Audio Generator
    // ═══════════════════════════════════════════════════════════════
    'podcast-creator': {
        id: 'WF-008',
        file: '08-podcast-audio-generator.txt',
        name: 'Podcast Audio Generator',
        icon: '🎙️',
        category: 'audio',
        tags: ['audio', 'marketing'],
        description: 'Generate complete podcast package with script, intro/outro, and show notes',
        output: 'Complete podcast package',
        models: 'Gemini + Lyria 2 + AudioLM',
        difficulty: 'intermediate',
        estimatedTime: '15-20 min',
        opalLink: 'https://opal.google/?flow=drive:/12Km455ZMiBA_j7L-DrFO-pi2S318Guwe&shared&mode=app',
        fields: [
            { id: 'episode_topic', type: 'text', label: 'Topik Episode', placeholder: 'e.g., Cara Membangun Personal Brand di Era Digital', required: true },
            { id: 'podcast_name', type: 'text', label: 'Nama Podcast', placeholder: 'e.g., The Business Growth Show', required: true },
            { id: 'host_name', type: 'text', label: 'Nama Host', placeholder: 'e.g., John Doe', required: true },
            { id: 'episode_duration', type: 'select', label: 'Target Durasi', options: ['15 minutes - Quick episode', '30 minutes - Standard', '45 minutes - Extended', '60 minutes - Deep dive', '90+ minutes - Long-form'], required: true },
            { id: 'podcast_style', type: 'select', label: 'Gaya Podcast', options: ['Solo - Monolog sendiri', 'Interview - Wawancara tamu', 'Co-hosted - Dengan co-host', 'Panel - Diskusi beberapa orang', 'Storytelling - Bercerita', 'Educational - Edukasi'], required: true },
            { id: 'guest_name', type: 'text', label: 'Nama Tamu (jika ada)', placeholder: 'e.g., Jane Smith, CEO of XYZ', required: false },
            { id: 'target_audience', type: 'text', label: 'Target Pendengar', placeholder: 'e.g., Entrepreneur dan profesional muda', required: true },
            { id: 'key_takeaways', type: 'textarea', label: 'Key Takeaways (3-5 poin)', placeholder: 'Apa yang pendengar akan pelajari dari episode ini?', required: true },
            { id: 'tone', type: 'select', label: 'Tone Podcast', options: ['Professional', 'Casual/Conversational', 'Inspirational', 'Educational', 'Entertaining/Fun'], required: true },
            { id: 'include_intro', type: 'select', label: 'Generate Intro Music?', options: ['Yes - Buat intro musik', 'No - Sudah punya'], required: true },
            { id: 'include_outro', type: 'select', label: 'Generate Outro Music?', options: ['Yes - Buat outro musik', 'No - Sudah punya'], required: true },
            { id: 'music_style', type: 'select', label: 'Gaya Musik', options: ['Upbeat/Energetic', 'Calm/Relaxed', 'Corporate/Professional', 'Indie/Creative', 'Cinematic'], required: false },
            { id: 'cta', type: 'text', label: 'Call-to-Action', placeholder: 'e.g., Subscribe, leave a review, visit website', required: true }
        ],
        promptTemplate: `=== PODCAST GENERATION REQUEST ===

EPISODE TOPIC: {episode_topic}
PODCAST NAME: {podcast_name}
HOST: {host_name}
GUEST: {guest_name}

DURATION: {episode_duration}
STYLE: {podcast_style}
TONE: {tone}
TARGET AUDIENCE: {target_audience}

KEY TAKEAWAYS:
{key_takeaways}

AUDIO PRODUCTION:
- Generate Intro: {include_intro}
- Generate Outro: {include_outro}
- Music Style: {music_style}

CTA: {cta}

INSTRUCTIONS:
1. Create complete episode script:
   - Intro (hook + episode preview)
   - Main content with segments
   - Transitions between topics
   - Outro with CTA

2. For {podcast_style} format, include:
   - Opening remarks
   - Topic introduction
   - Main discussion points
   - Audience engagement moments
   - Summary and takeaways
   - Closing and CTA

3. Generate show notes:
   - Episode summary (150 words)
   - Timestamps for each segment
   - Key quotes
   - Resources mentioned
   - Guest bio (if applicable)

4. Create promotional content:
   - Episode title options (5)
   - Social media teasers
   - Audiogram scripts (3)
   - Email announcement

5. If enabled, generate:
   - Intro music ({music_style})
   - Outro music
   - Transition sounds

OUTPUT: Complete podcast production package.`
    },

    // ═══════════════════════════════════════════════════════════════
    // WF-009: Product Photoshoot Pro
    // ═══════════════════════════════════════════════════════════════
    'product-photoshoot': {
        id: 'WF-009',
        file: '09-product-photoshoot.txt',
        name: 'Product Photoshoot Pro',
        icon: '📸',
        category: 'image',
        tags: ['image', 'ecommerce', 'popular'],
        description: 'Professional product photos with multiple angles, lighting, and lifestyle shots',
        output: '30+ product photos',
        models: 'Imagen 4',
        difficulty: 'intermediate',
        estimatedTime: '15-20 min',
        popular: true,
        opalLink: 'https://opal.google/?flow=drive:/166NBLB_fdhJ5Q3XzVg4gKT5sm3EmAjNR&shared&mode=app',
        fields: [
            { id: 'product_name', type: 'text', label: 'Nama Produk', placeholder: 'e.g., raycorp Premium Face Serum', required: true },
            { id: 'product_description', type: 'textarea', label: 'Deskripsi Produk', placeholder: 'Deskripsikan produk secara detail: ukuran, warna, material, fitur unik...', required: true },
            { id: 'product_category', type: 'select', label: 'Kategori Produk', options: ['Fashion/Clothing', 'Beauty/Skincare', 'Electronics/Gadget', 'Food/Beverage', 'Jewelry/Accessories', 'Home/Furniture', 'Sports/Fitness', 'Toys/Kids', 'Health/Wellness', 'Art/Craft'], required: true },
            { id: 'background_style', type: 'select', label: 'Gaya Background', options: ['White Studio - Clean e-commerce', 'Lifestyle - In-context usage', 'Natural - Outdoor/nature', 'Gradient - Modern gradient', 'Textured - Marble, wood, fabric', 'Colored - Solid color', 'Transparent - PNG cutout'], required: true },
            { id: 'lighting_style', type: 'select', label: 'Gaya Pencahayaan', options: ['Soft Studio - Even, no harsh shadows', 'Hard Light - Dramatic shadows', 'Natural Light - Window/outdoor', 'Dramatic - High contrast', 'Flat - Minimal shadows', 'Rim Light - Edge highlighting'], required: true },
            { id: 'shot_angles', type: 'select', label: 'Sudut Pengambilan', options: ['All Angles - Front, back, side, 45°, top', 'Front Only', 'Hero Shot - Best angle only', 'Detail Shots - Close-ups', 'Custom Selection'], required: true },
            { id: 'include_lifestyle', type: 'select', label: 'Include Lifestyle Shots?', options: ['Yes - Dengan foto lifestyle', 'No - Studio only'], required: true },
            { id: 'lifestyle_context', type: 'text', label: 'Konteks Lifestyle', placeholder: 'e.g., Wanita menggunakan serum di kamar mandi modern', required: false },
            { id: 'include_scale', type: 'select', label: 'Include Scale Reference?', options: ['Yes - Dengan referensi ukuran', 'No - Tanpa referensi'], required: true },
            { id: 'color_accuracy', type: 'select', label: 'Akurasi Warna', options: ['Exact Match - Warna persis', 'Enhanced - Sedikit lebih vibrant', 'Artistic - Interpretasi kreatif'], required: true },
            { id: 'output_format', type: 'select', label: 'Format Output', options: ['Square 1:1 - E-commerce', 'Portrait 4:5 - Instagram', 'Landscape 16:9 - Website banner', 'All Formats'], required: true },
            { id: 'brand_colors', type: 'text', label: 'Warna Brand (untuk props)', placeholder: 'e.g., #6366F1, #EC4899', required: false }
        ],
        promptTemplate: `=== PRODUCT PHOTOSHOOT REQUEST ===

PRODUCT:
- Name: {product_name}
- Category: {product_category}
- Description: {product_description}

PHOTOGRAPHY SETTINGS:
- Background: {background_style}
- Lighting: {lighting_style}
- Angles: {shot_angles}
- Color Accuracy: {color_accuracy}
- Output Format: {output_format}

LIFESTYLE:
- Include Lifestyle: {include_lifestyle}
- Context: {lifestyle_context}
- Include Scale Reference: {include_scale}

BRAND COLORS: {brand_colors}

INSTRUCTIONS:
Generate comprehensive product photo set:

1. HERO SHOTS (5 images):
   - Main product shot - best angle
   - Alternative hero angles
   - Premium quality, magazine-worthy

2. ANGLE SHOTS (10 images):
   - Front view
   - Back view
   - Left side
   - Right side
   - 45° angle (both sides)
   - Top view
   - Bottom view (if relevant)
   - Detail close-ups

3. LIFESTYLE SHOTS (if enabled, 10 images):
   - Product in use
   - Context shots
   - Aspirational imagery
   - {lifestyle_context}

4. E-COMMERCE SHOTS (5 images):
   - Clean white background
   - Multiple products together
   - Size comparison
   - Packaging shots

5. DETAIL SHOTS (5 images):
   - Texture close-ups
   - Feature highlights
   - Material details
   - Unique selling points

OUTPUT: 30+ professional product images.`
    },

    // ═══════════════════════════════════════════════════════════════
    // WF-010: Magic Fashion Photoshoot
    // ═══════════════════════════════════════════════════════════════
    'fashion-photoshoot': {
        id: 'WF-010',
        file: '10-magic-fashion.txt',
        name: 'Magic Fashion Photoshoot',
        icon: '👗',
        category: 'image',
        tags: ['image', 'ecommerce'],
        description: 'AI fashion photoshoot with virtual models and multiple styling options',
        output: '20+ fashion photos',
        models: 'Imagen 4',
        difficulty: 'intermediate',
        estimatedTime: '15-20 min',
        opalLink: 'https://opal.google/?flow=drive:/1LXQPuP7eD_IEk7yOUI_cLTKXdHFUQcRm&shared&mode=app',
        fields: [
            { id: 'clothing_description', type: 'textarea', label: 'Deskripsi Pakaian', placeholder: 'Deskripsikan pakaian secara detail: jenis, warna, material, detail desain...', required: true },
            { id: 'clothing_type', type: 'select', label: 'Tipe Pakaian', options: ['Dress/Gaun', 'Top/Atasan', 'Bottom/Bawahan', 'Outerwear/Jaket', 'Full Outfit', 'Swimwear', 'Activewear', 'Formal Wear', 'Casual Wear', 'Traditional/Ethnic'], required: true },
            { id: 'fashion_style', type: 'select', label: 'Gaya Fashion', options: ['Casual - Santai sehari-hari', 'Formal - Profesional/kantor', 'Streetwear - Urban style', 'Elegant - Mewah dan elegan', 'Sporty - Atletik', 'Bohemian - Boho chic', 'Minimalist - Simple dan clean', 'Vintage - Retro style'], required: true },
            { id: 'model_type', type: 'select', label: 'Tipe Model', options: ['Female - Wanita', 'Male - Pria', 'Non-binary - Androgynous', 'Diverse - Berbagai tipe'], required: true },
            { id: 'model_ethnicity', type: 'select', label: 'Etnisitas Model', options: ['Asian', 'Caucasian', 'African', 'Hispanic/Latino', 'Middle Eastern', 'Mixed/Diverse', 'No Preference'], required: true },
            { id: 'model_age_range', type: 'select', label: 'Rentang Usia Model', options: ['Young Adult (18-25)', 'Adult (25-35)', 'Mature (35-45)', 'Senior (45+)', 'Mixed Ages'], required: true },
            { id: 'body_type', type: 'select', label: 'Tipe Tubuh', options: ['Slim', 'Athletic', 'Average', 'Plus Size', 'Diverse/Mixed'], required: true },
            { id: 'pose_style', type: 'select', label: 'Gaya Pose', options: ['Editorial - High fashion poses', 'Commercial - Natural dan approachable', 'Lifestyle - Candid dan natural', 'Dynamic - Movement dan action', 'Static - Diam dan formal'], required: true },
            { id: 'background_setting', type: 'select', label: 'Setting Background', options: ['Studio White', 'Studio Colored', 'Urban/Street', 'Nature/Outdoor', 'Interior/Indoor', 'Abstract/Artistic'], required: true },
            { id: 'lighting_mood', type: 'select', label: 'Mood Pencahayaan', options: ['Bright & Airy', 'Soft & Romantic', 'Dramatic & Moody', 'Natural Daylight', 'Golden Hour', 'Studio Professional'], required: true },
            { id: 'accessories', type: 'text', label: 'Aksesoris (Opsional)', placeholder: 'e.g., Tas, sepatu, perhiasan yang ingin ditampilkan', required: false },
            { id: 'hair_makeup', type: 'select', label: 'Gaya Hair & Makeup', options: ['Natural/Minimal', 'Glamorous', 'Editorial/Artistic', 'Professional', 'Casual'], required: true }
        ],
        promptTemplate: `=== FASHION PHOTOSHOOT REQUEST ===

CLOTHING:
- Description: {clothing_description}
- Type: {clothing_type}
- Style: {fashion_style}

MODEL SPECIFICATIONS:
- Type: {model_type}
- Ethnicity: {model_ethnicity}
- Age Range: {model_age_range}
- Body Type: {body_type}

PHOTOGRAPHY:
- Pose Style: {pose_style}
- Background: {background_setting}
- Lighting: {lighting_mood}
- Hair & Makeup: {hair_makeup}

ACCESSORIES: {accessories}

INSTRUCTIONS:
Generate fashion photoshoot set:

1. HERO SHOTS (5 images):
   - Full body front view
   - Full body back view
   - 3/4 angle shots
   - Best selling angle

2. DETAIL SHOTS (5 images):
   - Fabric texture close-up
   - Design details
   - Stitching/construction
   - Label/branding

3. LIFESTYLE SHOTS (5 images):
   - Model in natural setting
   - Movement shots
   - Candid moments
   - Context usage

4. E-COMMERCE SHOTS (5 images):
   - Clean product shots
   - Flat lay
   - On hanger
   - Folded presentation

5. STYLING VARIATIONS (5 images):
   - Different styling options
   - With/without accessories
   - Day to night looks

OUTPUT: 20+ professional fashion images.`
    },

    // ═══════════════════════════════════════════════════════════════
    // WF-011 to WF-020: Magic Tools
    // ═══════════════════════════════════════════════════════════════

    'face-swap': {
        id: 'WF-011',
        file: '11-face-swap-creator.txt',
        name: 'Face Swap Creator',
        icon: '🎭',
        category: 'image',
        tags: ['image', 'utility'],
        description: 'Professional face swap for marketing materials and creative content',
        output: '10 face swap variations',
        models: 'Imagen 4',
        difficulty: 'beginner',
        estimatedTime: '5-8 min',
        opalLink: 'https://opal.google/?flow=drive:/1uSVJw8phf6IwF6lxrBn9e_nRrM5-xb1z&shared&mode=app',
        fields: [
            { id: 'swap_purpose', type: 'select', label: 'Tujuan Face Swap', options: ['Marketing Material', 'Creative Content', 'Product Visualization', 'Entertainment', 'Before/After'], required: true },
            { id: 'source_description', type: 'textarea', label: 'Deskripsi Wajah Sumber', placeholder: 'Deskripsikan wajah yang akan di-swap...', required: true },
            { id: 'target_description', type: 'textarea', label: 'Deskripsi Target', placeholder: 'Deskripsikan gambar target...', required: true },
            { id: 'blend_quality', type: 'select', label: 'Kualitas Blending', options: ['Natural - Seamless blend', 'Artistic - Creative interpretation', 'Exact - Precise match'], required: true },
            { id: 'lighting_match', type: 'select', label: 'Match Lighting?', options: ['Yes - Sesuaikan pencahayaan', 'No - Pertahankan original'], required: true },
            { id: 'skin_tone_match', type: 'select', label: 'Match Skin Tone?', options: ['Yes - Sesuaikan warna kulit', 'No - Pertahankan original'], required: true },
            { id: 'output_variations', type: 'select', label: 'Jumlah Variasi', options: ['5 variations', '10 variations', '15 variations'], required: true }
        ],
        promptTemplate: `=== FACE SWAP REQUEST ===

PURPOSE: {swap_purpose}
SOURCE FACE: {source_description}
TARGET IMAGE: {target_description}

SETTINGS:
- Blend Quality: {blend_quality}
- Match Lighting: {lighting_match}
- Match Skin Tone: {skin_tone_match}
- Variations: {output_variations}

INSTRUCTIONS:
Generate professional face swap with:
1. Natural blending
2. Lighting consistency
3. Expression preservation
4. Multiple angle variations

OUTPUT: {output_variations} face swap images.`
    },

    'brand-kit': {
        id: 'WF-012',
        file: '12-brand-kit-generator.txt',
        name: 'Brand Kit Generator',
        icon: '🎨',
        category: 'branding',
        tags: ['branding', 'popular', 'business'],
        description: 'Complete brand identity kit with logo, colors, fonts, and brand guidelines',
        output: 'Full brand kit',
        models: 'Imagen 4 + Gemini',
        difficulty: 'advanced',
        estimatedTime: '20-30 min',
        popular: true,
        opalLink: 'https://opal.google/?flow=drive:/134_LdKrqDb9Fsg1jVRFxMoNghLkzlmKt&shared&mode=app',
        fields: [
            { id: 'brand_name', type: 'text', label: 'Nama Brand', placeholder: 'e.g., raycorp', required: true },
            { id: 'tagline', type: 'text', label: 'Tagline (Opsional)', placeholder: 'e.g., Empowering Your Digital Journey', required: false },
            { id: 'industry', type: 'select', label: 'Industri', options: ['Technology/SaaS', 'Fashion/Apparel', 'Food & Beverage', 'Health/Wellness', 'Finance/Fintech', 'Education', 'Creative/Agency', 'E-commerce/Retail', 'Real Estate', 'Travel/Hospitality', 'Beauty/Cosmetics', 'Sports/Fitness'], required: true },
            { id: 'brand_personality', type: 'select', label: 'Kepribadian Brand', options: ['Professional & Trustworthy', 'Creative & Innovative', 'Friendly & Approachable', 'Luxurious & Premium', 'Fun & Playful', 'Bold & Confident', 'Calm & Peaceful', 'Energetic & Dynamic'], required: true },
            { id: 'target_audience', type: 'textarea', label: 'Target Audience', placeholder: 'Deskripsikan target market Anda...', required: true },
            { id: 'brand_values', type: 'textarea', label: 'Nilai-Nilai Brand', placeholder: 'Masukkan 3-5 nilai utama brand (satu per baris)...', required: true },
            { id: 'logo_style', type: 'select', label: 'Gaya Logo', options: ['Wordmark - Teks saja', 'Lettermark - Inisial', 'Symbol/Icon - Simbol saja', 'Combination - Simbol + teks', 'Emblem - Badge style', 'Abstract - Bentuk abstrak'], required: true },
            { id: 'color_preference', type: 'select', label: 'Preferensi Warna', options: ['Let AI decide', 'Blue tones - Trust & Professional', 'Green tones - Growth & Nature', 'Red/Orange - Energy & Passion', 'Purple - Luxury & Creative', 'Black/Gold - Premium & Elegant', 'Pastel - Soft & Friendly', 'Vibrant - Bold & Modern'], required: true },
            { id: 'competitors', type: 'textarea', label: 'Kompetitor (untuk diferensiasi)', placeholder: 'Sebutkan 2-3 kompetitor...', required: false },
            { id: 'existing_assets', type: 'textarea', label: 'Aset yang Sudah Ada', placeholder: 'Apakah ada warna/font/elemen yang harus dipertahankan?', required: false }
        ],
        promptTemplate: `=== BRAND KIT GENERATION REQUEST ===

BRAND:
- Name: {brand_name}
- Tagline: {tagline}
- Industry: {industry}
- Personality: {brand_personality}

TARGET AUDIENCE:
{target_audience}

BRAND VALUES:
{brand_values}

DESIGN PREFERENCES:
- Logo Style: {logo_style}
- Color Preference: {color_preference}

COMPETITORS: {competitors}
EXISTING ASSETS: {existing_assets}

INSTRUCTIONS:
Generate complete brand kit:

1. LOGO SUITE (20 variations):
   - Primary logo
   - Secondary logo
   - Icon/favicon
   - Horizontal version
   - Vertical version
   - Monochrome versions
   - Reversed versions

2. COLOR PALETTE:
   - Primary colors (2-3)
   - Secondary colors (2-3)
   - Accent colors
   - Neutral colors
   - Color codes (HEX, RGB, CMYK)
   - Usage guidelines

3. TYPOGRAPHY:
   - Primary font (headings)
   - Secondary font (body)
   - Font pairings
   - Size hierarchy

4. BRAND ELEMENTS:
   - Patterns
   - Icons set
   - Graphic elements
   - Photography style guide

5. BRAND GUIDELINES:
   - Logo usage rules
   - Color applications
   - Typography rules
   - Do's and Don'ts

6. SOCIAL MEDIA KIT:
   - Profile pictures
   - Cover images
   - Post templates

OUTPUT: Complete brand identity package.`
    },

    'magic-background': {
        id: 'WF-013',
        file: '13-magic-background.txt',
        name: 'Magic Background',
        icon: '🌄',
        category: 'image',
        tags: ['image', 'utility'],
        description: 'AI background replacement and generation for any image',
        output: '10 background variations',
        models: 'Imagen 4',
        difficulty: 'beginner',
        estimatedTime: '3-5 min',
        opalLink: 'https://opal.google/?flow=drive:/10k7fRZ41G8JF1OlKHzUUoMLxGLpiMfbe&shared&mode=app',
        fields: [
            { id: 'subject_description', type: 'textarea', label: 'Deskripsi Subjek', placeholder: 'Deskripsikan objek/orang yang akan dipertahankan...', required: true },
            { id: 'background_type', type: 'select', label: 'Tipe Background Baru', options: ['Studio White - Clean e-commerce', 'Studio Colored - Warna solid', 'Nature - Outdoor/alam', 'Urban - Kota/jalanan', 'Abstract - Abstrak/artistik', 'Gradient - Gradasi warna', 'Office - Kantor/profesional', 'Home - Rumah/interior', 'Custom - Deskripsi sendiri'], required: true },
            { id: 'custom_background', type: 'textarea', label: 'Deskripsi Background Custom', placeholder: 'Jika pilih Custom, deskripsikan background yang diinginkan...', required: false },
            { id: 'lighting_match', type: 'select', label: 'Sesuaikan Pencahayaan?', options: ['Yes - Auto match lighting', 'No - Keep original'], required: true },
            { id: 'shadow_generation', type: 'select', label: 'Generate Shadow?', options: ['Yes - Natural shadow', 'No - No shadow', 'Soft - Subtle shadow'], required: true },
            { id: 'color_harmony', type: 'select', label: 'Color Harmony', options: ['Complementary - Warna kontras', 'Analogous - Warna serupa', 'Neutral - Netral', 'Brand Colors - Sesuai brand'], required: true },
            { id: 'brand_colors', type: 'text', label: 'Warna Brand (jika ada)', placeholder: '#6366F1, #EC4899', required: false }
        ],
        promptTemplate: `=== MAGIC BACKGROUND REQUEST ===

SUBJECT: {subject_description}
NEW BACKGROUND: {background_type}
CUSTOM DESCRIPTION: {custom_background}

SETTINGS:
- Match Lighting: {lighting_match}
- Shadow: {shadow_generation}
- Color Harmony: {color_harmony}
- Brand Colors: {brand_colors}

INSTRUCTIONS:
Generate 10 background variations:
1. Clean studio backgrounds
2. Lifestyle/contextual backgrounds
3. Abstract/artistic backgrounds
4. Brand-aligned backgrounds
5. Seasonal/thematic backgrounds

Each with proper lighting and shadow integration.

OUTPUT: 10 professional background replacements.`
    },

    'magic-model': {
        id: 'WF-014',
        file: '14-magic-model-virtual-tryon.txt',
        name: 'Magic Model Virtual Try-On',
        icon: '👔',
        category: 'image',
        tags: ['image', 'ecommerce'],
        description: 'Virtual try-on for fashion products with AI models',
        output: '10 try-on images',
        models: 'Imagen 4',
        difficulty: 'intermediate',
        estimatedTime: '10-15 min',
        opalLink: 'https://opal.google/?flow=drive:/1rrr1MwrihwbEAV2DJeNIby13UuyNNHz4&shared&mode=app',
        fields: [
            { id: 'clothing_description', type: 'textarea', label: 'Deskripsi Pakaian', placeholder: 'Deskripsikan pakaian yang akan di-try on...', required: true },
            { id: 'clothing_type', type: 'select', label: 'Tipe Pakaian', options: ['Top/Atasan', 'Bottom/Bawahan', 'Dress/Gaun', 'Outerwear', 'Full Outfit', 'Accessories'], required: true },
            { id: 'model_gender', type: 'select', label: 'Gender Model', options: ['Female', 'Male', 'Unisex/Both'], required: true },
            { id: 'model_diversity', type: 'select', label: 'Keragaman Model', options: ['Single ethnicity', 'Diverse - Multiple ethnicities', 'Specific - Asian', 'Specific - Caucasian', 'Specific - African', 'Specific - Hispanic'], required: true },
            { id: 'body_types', type: 'select', label: 'Tipe Tubuh', options: ['Standard', 'Plus Size', 'Petite', 'Athletic', 'Diverse - All types'], required: true },
            { id: 'pose_variety', type: 'select', label: 'Variasi Pose', options: ['Standing front', 'Multiple angles', 'Dynamic poses', 'Lifestyle poses', 'All varieties'], required: true },
            { id: 'background_style', type: 'select', label: 'Background', options: ['White studio', 'Lifestyle setting', 'Urban', 'Nature', 'Mixed'], required: true }
        ],
        promptTemplate: `=== VIRTUAL TRY-ON REQUEST ===

CLOTHING:
- Description: {clothing_description}
- Type: {clothing_type}

MODEL SPECS:
- Gender: {model_gender}
- Diversity: {model_diversity}
- Body Types: {body_types}

PHOTOGRAPHY:
- Poses: {pose_variety}
- Background: {background_style}

INSTRUCTIONS:
Generate virtual try-on images showing:
1. Front view - standard pose
2. Back view
3. Side views
4. 3/4 angles
5. Detail shots
6. Lifestyle context
7. Different model variations

OUTPUT: 10 professional try-on images.`
    },

    'magic-video': {
        id: 'WF-015',
        file: '15-magic-video-image-to-video.txt',
        name: 'Magic Video (Image to Video)',
        icon: '🎥',
        category: 'video',
        tags: ['video', 'utility'],
        description: 'Transform static images into dynamic videos with motion',
        output: '5 video variations',
        models: 'Veo',
        difficulty: 'intermediate',
        estimatedTime: '10-15 min',
        opalLink: 'https://opal.google/?flow=drive:/11DWB41C7B2utO1bSyNO9bA0oTwRZvrey&shared&mode=app',
        fields: [
            { id: 'image_description', type: 'textarea', label: 'Deskripsi Gambar', placeholder: 'Deskripsikan gambar yang akan dianimasikan...', required: true },
            { id: 'motion_type', type: 'select', label: 'Tipe Gerakan', options: ['Zoom In - Mendekat', 'Zoom Out - Menjauh', 'Pan Left/Right - Geser horizontal', 'Pan Up/Down - Geser vertikal', 'Parallax - Efek kedalaman', 'Morph - Transformasi', 'Cinemagraph - Gerakan subtle', 'Dynamic - Gerakan penuh'], required: true },
            { id: 'motion_speed', type: 'select', label: 'Kecepatan Gerakan', options: ['Slow - Lambat dan dramatis', 'Medium - Normal', 'Fast - Cepat dan energik'], required: true },
            { id: 'video_duration', type: 'select', label: 'Durasi Video', options: ['3 seconds', '5 seconds', '10 seconds', '15 seconds'], required: true },
            { id: 'loop_style', type: 'select', label: 'Loop Style', options: ['No loop - Sekali putar', 'Seamless loop - Loop mulus', 'Bounce - Bolak-balik'], required: true },
            { id: 'add_effects', type: 'select', label: 'Tambah Efek?', options: ['None - Tanpa efek', 'Particles - Partikel', 'Light rays - Sinar cahaya', 'Bokeh - Blur artistik', 'Glitch - Efek glitch'], required: false },
            { id: 'output_format', type: 'select', label: 'Format Output', options: ['MP4 - Standard', 'GIF - Animated', 'Both - MP4 + GIF'], required: true }
        ],
        promptTemplate: `=== IMAGE TO VIDEO REQUEST ===

IMAGE: {image_description}

MOTION:
- Type: {motion_type}
- Speed: {motion_speed}
- Duration: {video_duration}
- Loop: {loop_style}

EFFECTS: {add_effects}
OUTPUT FORMAT: {output_format}

INSTRUCTIONS:
Transform image into video with:
1. Smooth motion animation
2. Natural movement flow
3. Professional quality
4. Multiple variations

OUTPUT: 5 video variations.`
    },

    'magic-variation-tool': {
        id: 'WF-016',
        file: '16-magic-variation.txt',
        name: 'Magic Variation',
        icon: '🔄',
        category: 'image',
        tags: ['image', 'utility'],
        description: 'Generate creative variations of existing images',
        output: '10 variations',
        models: 'Imagen 4',
        difficulty: 'beginner',
        estimatedTime: '3-5 min',
        opalLink: 'https://opal.google/?flow=drive:/1PIOjSHSZazeeAZm4EntyjDdNlfAhN4M1&shared&mode=app',
        fields: [
            { id: 'image_description', type: 'textarea', label: 'Deskripsi Gambar Original', placeholder: 'Deskripsikan gambar yang ingin divariasikan...', required: true },
            { id: 'variation_type', type: 'select', label: 'Tipe Variasi', options: ['Color - Variasi warna', 'Style - Variasi gaya', 'Composition - Variasi komposisi', 'Mood - Variasi suasana', 'All - Semua variasi'], required: true },
            { id: 'variation_intensity', type: 'select', label: 'Intensitas Variasi', options: ['Subtle - Perubahan halus', 'Moderate - Perubahan sedang', 'Dramatic - Perubahan drastis'], required: true },
            { id: 'maintain_elements', type: 'textarea', label: 'Elemen yang Dipertahankan', placeholder: 'Elemen apa yang harus tetap sama?', required: false },
            { id: 'variation_count', type: 'select', label: 'Jumlah Variasi', options: ['5 variations', '10 variations', '15 variations', '20 variations'], required: true }
        ],
        promptTemplate: `=== MAGIC VARIATION REQUEST ===

ORIGINAL IMAGE: {image_description}
VARIATION TYPE: {variation_type}
INTENSITY: {variation_intensity}
MAINTAIN: {maintain_elements}
COUNT: {variation_count}

INSTRUCTIONS:
Generate {variation_count} unique variations while maintaining core elements.

OUTPUT: {variation_count} image variations.`
    },

    'magic-remove': {
        id: 'WF-017',
        file: '17-magic-remove.txt',
        name: 'Magic Remove',
        icon: '✂️',
        category: 'image',
        tags: ['image', 'utility'],
        description: 'Remove objects, backgrounds, or unwanted elements from images',
        output: 'Cleaned image',
        models: 'Imagen 4',
        difficulty: 'beginner',
        estimatedTime: '2-3 min',
        opalLink: 'https://opal.google/?flow=drive:/1vqKqEpi1GB_Cj5lLgSCmpBg0abaWMhYG&shared&mode=app',
        fields: [
            { id: 'image_description', type: 'textarea', label: 'Deskripsi Gambar', placeholder: 'Deskripsikan gambar...', required: true },
            { id: 'remove_type', type: 'select', label: 'Yang Akan Dihapus', options: ['Background - Hapus background', 'Object - Hapus objek tertentu', 'Person - Hapus orang', 'Text/Watermark - Hapus teks', 'Blemish - Hapus noda/cacat', 'Multiple - Beberapa elemen'], required: true },
            { id: 'remove_description', type: 'textarea', label: 'Deskripsi yang Dihapus', placeholder: 'Jelaskan secara spesifik apa yang ingin dihapus...', required: true },
            { id: 'fill_method', type: 'select', label: 'Metode Pengisian', options: ['Content-aware - Isi otomatis', 'Transparent - Transparan', 'Solid color - Warna solid', 'Blur - Blur area'], required: true },
            { id: 'output_format', type: 'select', label: 'Format Output', options: ['PNG - Dengan transparansi', 'JPG - Tanpa transparansi', 'Both - PNG + JPG'], required: true }
        ],
        promptTemplate: `=== MAGIC REMOVE REQUEST ===

IMAGE: {image_description}
REMOVE: {remove_type}
SPECIFIC: {remove_description}
FILL METHOD: {fill_method}
OUTPUT: {output_format}

INSTRUCTIONS:
Remove specified elements cleanly with natural fill.

OUTPUT: Cleaned image in {output_format} format.`
    },

    'magic-enhance': {
        id: 'WF-018',
        file: '18-magic-enhance.txt',
        name: 'Magic Enhance',
        icon: '✨',
        category: 'image',
        tags: ['image', 'utility'],
        description: 'Enhance image quality, resolution, and details with AI',
        output: 'Enhanced image',
        models: 'Imagen 4',
        difficulty: 'beginner',
        estimatedTime: '2-3 min',
        opalLink: 'https://opal.google/?flow=drive:/1pXXOtmxmqcHAu3qrwhNpGI4mN-QYfbeM&shared&mode=app',
        fields: [
            { id: 'image_description', type: 'textarea', label: 'Deskripsi Gambar', placeholder: 'Deskripsikan gambar yang akan di-enhance...', required: true },
            { id: 'enhance_type', type: 'select', label: 'Tipe Enhancement', options: ['Resolution - Tingkatkan resolusi', 'Color - Perbaiki warna', 'Sharpness - Tingkatkan ketajaman', 'Noise Reduction - Kurangi noise', 'Light/Exposure - Perbaiki pencahayaan', 'All - Semua enhancement'], required: true },
            { id: 'upscale_factor', type: 'select', label: 'Faktor Upscale', options: ['2x - Double resolution', '4x - Quadruple resolution', '8x - Maximum quality'], required: true },
            { id: 'preserve_style', type: 'select', label: 'Pertahankan Gaya?', options: ['Yes - Keep original style', 'No - Allow AI interpretation'], required: true },
            { id: 'output_quality', type: 'select', label: 'Kualitas Output', options: ['High - Standard quality', 'Ultra - Maximum quality', 'Print-ready - For printing'], required: true }
        ],
        promptTemplate: `=== MAGIC ENHANCE REQUEST ===

IMAGE: {image_description}
ENHANCE: {enhance_type}
UPSCALE: {upscale_factor}
PRESERVE STYLE: {preserve_style}
QUALITY: {output_quality}

INSTRUCTIONS:
Enhance image with AI while maintaining natural look.

OUTPUT: Enhanced {output_quality} image.`
    },

    'magic-scene': {
        id: 'WF-019',
        file: '19-magic-scene.txt',
        name: 'Magic Scene',
        icon: '🎬',
        category: 'image',
        tags: ['image', 'utility'],
        description: 'Generate scene backgrounds and environments for products or subjects',
        output: '10 scene variations',
        models: 'Imagen 4',
        difficulty: 'intermediate',
        estimatedTime: '5-8 min',
        opalLink: 'https://opal.google/?flow=drive:/1iQiUGvX6qQQwFmFhHf5LAGF1vpYnmcE1&shared&mode=app',
        fields: [
            { id: 'subject_description', type: 'textarea', label: 'Deskripsi Subjek', placeholder: 'Deskripsikan objek/produk yang akan ditempatkan di scene...', required: true },
            { id: 'scene_type', type: 'select', label: 'Tipe Scene', options: ['Indoor - Dalam ruangan', 'Outdoor - Luar ruangan', 'Studio - Setting studio', 'Fantasy - Fantasi/imajinatif', 'Urban - Perkotaan', 'Nature - Alam', 'Abstract - Abstrak'], required: true },
            { id: 'scene_description', type: 'textarea', label: 'Deskripsi Scene Detail', placeholder: 'Deskripsikan scene yang diinginkan secara detail...', required: true },
            { id: 'mood', type: 'select', label: 'Mood Scene', options: ['Bright & Cheerful', 'Dark & Moody', 'Warm & Cozy', 'Cool & Professional', 'Dramatic', 'Natural', 'Luxurious'], required: true },
            { id: 'time_of_day', type: 'select', label: 'Waktu', options: ['Morning - Pagi', 'Afternoon - Siang', 'Golden Hour - Sore', 'Night - Malam', 'Any - Tidak spesifik'], required: true },
            { id: 'perspective', type: 'select', label: 'Perspektif', options: ['Eye level - Sejajar mata', 'Low angle - Dari bawah', 'High angle - Dari atas', 'Bird eye - Tampak atas', 'Worm eye - Dari tanah'], required: true }
        ],
        promptTemplate: `=== MAGIC SCENE REQUEST ===

SUBJECT: {subject_description}
SCENE TYPE: {scene_type}
SCENE DETAIL: {scene_description}
MOOD: {mood}
TIME: {time_of_day}
PERSPECTIVE: {perspective}

INSTRUCTIONS:
Generate 10 scene variations with subject properly integrated.

OUTPUT: 10 professional scene images.`
    },

    'mockup-master': {
        id: 'WF-020',
        file: '20-magic-mockup.txt',
        name: 'Magic Mockup',
        icon: '📱',
        category: 'image',
        tags: ['image', 'marketing', 'ecommerce'],
        description: 'Generate product mockups for various devices and surfaces',
        output: '20 mockup variations',
        models: 'Imagen 4',
        difficulty: 'intermediate',
        estimatedTime: '8-12 min',
        opalLink: 'https://opal.google/?flow=drive:/1eboZv7U8MJs_XvraoVQWAbUF2KFe0tJB&shared&mode=app',
        fields: [
            { id: 'design_description', type: 'textarea', label: 'Deskripsi Desain', placeholder: 'Deskripsikan desain yang akan di-mockup...', required: true },
            { id: 'mockup_type', type: 'select', label: 'Tipe Mockup', options: ['Phone/Mobile - Smartphone', 'Laptop/Desktop - Komputer', 'Tablet - iPad/tablet', 'T-Shirt - Kaos', 'Mug/Cup - Gelas/mug', 'Poster/Frame - Poster bingkai', 'Business Card - Kartu nama', 'Packaging/Box - Kemasan', 'Book/Magazine - Buku/majalah', 'Billboard - Papan iklan', 'Social Media - Frame sosmed'], required: true },
            { id: 'mockup_style', type: 'select', label: 'Gaya Mockup', options: ['Clean/Minimal - Bersih minimalis', 'Lifestyle - Konteks penggunaan', 'Flat Lay - Tampak atas', 'Floating - Melayang', 'Hand Holding - Dipegang tangan', 'On Desk - Di atas meja'], required: true },
            { id: 'background_style', type: 'select', label: 'Background', options: ['White/Clean', 'Colored', 'Gradient', 'Lifestyle/Context', 'Transparent'], required: true },
            { id: 'angle_variety', type: 'select', label: 'Variasi Sudut', options: ['Front only', 'Multiple angles', 'Isometric', 'Perspective'], required: true },
            { id: 'brand_colors', type: 'text', label: 'Warna Brand', placeholder: '#6366F1, #EC4899', required: false }
        ],
        promptTemplate: `=== MAGIC MOCKUP REQUEST ===

DESIGN: {design_description}
MOCKUP TYPE: {mockup_type}
STYLE: {mockup_style}
BACKGROUND: {background_style}
ANGLES: {angle_variety}
BRAND COLORS: {brand_colors}

INSTRUCTIONS:
Generate 20 professional mockup variations showing design in context.

OUTPUT: 20 mockup images.`
    },

    // ═══════════════════════════════════════════════════════════════
    // WF-021 to WF-030: Marketing & Utility Tools
    // ═══════════════════════════════════════════════════════════════

    'magic-resize': {
        id: 'WF-021', file: '21-magic-resize.txt', name: 'Magic Resize', icon: '📐', category: 'image', tags: ['image', 'utility'],
        description: 'Smart resize for all social media platforms with content-aware scaling',
        output: 'All platform sizes', models: 'Imagen 4', difficulty: 'beginner', estimatedTime: '2-3 min',
        opalLink: 'https://opal.google/?flow=drive:/1ClbeOy0sMPff_kZ2F1omJIKxGStgHPpD&shared&mode=app',
        fields: [
            { id: 'image_description', type: 'textarea', label: 'Deskripsi Gambar', required: true },
            { id: 'platforms', type: 'select', label: 'Platform Target', options: ['All Platforms', 'Instagram Only', 'Facebook Only', 'LinkedIn Only', 'Twitter Only', 'YouTube Only', 'TikTok Only'], required: true },
            { id: 'content_focus', type: 'select', label: 'Fokus Konten', options: ['Center - Tengah', 'Subject - Subjek utama', 'Full - Seluruh gambar'], required: true }
        ],
        promptTemplate: `=== MAGIC RESIZE REQUEST ===\n\nIMAGE: {image_description}\nPLATFORMS: {platforms}\nFOCUS: {content_focus}\n\nGenerate all platform sizes with smart cropping.`
    },

    'magic-relight': {
        id: 'WF-022', file: '22-magic-relight.txt', name: 'Magic Relight', icon: '💡', category: 'image', tags: ['image', 'utility'],
        description: 'AI relighting for professional photo quality',
        output: '5 lighting variations', models: 'Imagen 4', difficulty: 'intermediate', estimatedTime: '5-8 min',
        opalLink: 'https://opal.google/?flow=drive:/1CcfLIUUGMkEcZy3XcmpqB__MEyKsSzmx&shared&mode=app',
        fields: [
            { id: 'image_description', type: 'textarea', label: 'Deskripsi Gambar', required: true },
            { id: 'lighting_style', type: 'select', label: 'Gaya Pencahayaan', options: ['Studio Soft', 'Natural Window', 'Dramatic Side', 'Golden Hour', 'Blue Hour', 'Rim Light', 'Flat Even'], required: true },
            { id: 'light_direction', type: 'select', label: 'Arah Cahaya', options: ['Front', 'Left Side', 'Right Side', 'Back', 'Top', 'Bottom'], required: true },
            { id: 'intensity', type: 'select', label: 'Intensitas', options: ['Soft', 'Medium', 'Strong'], required: true }
        ],
        promptTemplate: `=== MAGIC RELIGHT REQUEST ===\n\nIMAGE: {image_description}\nLIGHTING: {lighting_style}\nDIRECTION: {light_direction}\nINTENSITY: {intensity}\n\nGenerate 5 lighting variations.`
    },

    'magic-color': {
        id: 'WF-023', file: '23-magic-color.txt', name: 'Magic Color', icon: '🎨', category: 'image', tags: ['image', 'utility'],
        description: 'AI color grading and palette adjustment',
        output: '10 color variations', models: 'Imagen 4', difficulty: 'beginner', estimatedTime: '3-5 min',
        opalLink: 'https://opal.google/?flow=drive:/16G2bdFFXxPu44z6G9dHMKXHlBtcqB4aS&shared&mode=app',
        fields: [
            { id: 'image_description', type: 'textarea', label: 'Deskripsi Gambar', required: true },
            { id: 'color_style', type: 'select', label: 'Gaya Warna', options: ['Vibrant', 'Muted/Pastel', 'Warm', 'Cool', 'Vintage', 'Modern', 'Cinematic', 'Black & White'], required: true },
            { id: 'brand_colors', type: 'text', label: 'Warna Brand (opsional)', placeholder: '#6366F1', required: false },
            { id: 'mood', type: 'select', label: 'Mood', options: ['Cheerful', 'Professional', 'Moody', 'Romantic', 'Energetic'], required: true }
        ],
        promptTemplate: `=== MAGIC COLOR REQUEST ===\n\nIMAGE: {image_description}\nSTYLE: {color_style}\nBRAND: {brand_colors}\nMOOD: {mood}\n\nGenerate 10 color variations.`
    },

    'magic-composite': {
        id: 'WF-024', file: '24-magic-composite.txt', name: 'Magic Composite', icon: '🖼️', category: 'image', tags: ['image', 'utility'],
        description: 'AI image compositing and blending multiple elements',
        output: '5 composite variations', models: 'Imagen 4', difficulty: 'advanced', estimatedTime: '10-15 min',
        opalLink: 'https://opal.google/?flow=drive:/1hdQedMKMTvluvsbyrrKuaWOaHaCX_GAK&shared&mode=app',
        fields: [
            { id: 'foreground_desc', type: 'textarea', label: 'Deskripsi Foreground', required: true },
            { id: 'background_desc', type: 'textarea', label: 'Deskripsi Background', required: true },
            { id: 'blend_mode', type: 'select', label: 'Mode Blending', options: ['Natural', 'Artistic', 'Seamless', 'Creative'], required: true },
            { id: 'lighting_match', type: 'select', label: 'Match Lighting?', options: ['Yes', 'No'], required: true },
            { id: 'color_harmony', type: 'select', label: 'Color Harmony', options: ['Match background', 'Match foreground', 'Blend both'], required: true }
        ],
        promptTemplate: `=== MAGIC COMPOSITE REQUEST ===\n\nFOREGROUND: {foreground_desc}\nBACKGROUND: {background_desc}\nBLEND: {blend_mode}\nLIGHTING: {lighting_match}\nCOLOR: {color_harmony}\n\nGenerate 5 composite variations.`
    },

    'social-media-kit': {
        id: 'WF-025', file: '25-social-media-kit.txt', name: 'Social Media Kit', icon: '📱', category: 'marketing',
        tags: ['marketing', 'image', 'popular'],
        description: 'Complete social media template pack for all platforms',
        output: '50+ templates', models: 'Imagen 4 + Gemini', difficulty: 'intermediate', estimatedTime: '15-20 min', popular: true,
        opalLink: 'https://opal.google/?flow=drive:/1QNi_QiWLJKF1RXuVpSb2SxnrR3UYyguB&shared&mode=app',
        fields: [
            { id: 'brand_name', type: 'text', label: 'Nama Brand', required: true },
            { id: 'industry', type: 'select', label: 'Industri', options: ['Fashion', 'Food & Beverage', 'Technology', 'Health & Wellness', 'Education', 'Finance', 'Travel', 'Beauty', 'Real Estate', 'Entertainment'], required: true },
            { id: 'visual_style', type: 'select', label: 'Gaya Visual', options: ['Modern Minimalist', 'Bold & Colorful', 'Elegant & Luxury', 'Playful & Fun', 'Professional Corporate', 'Artistic & Creative'], required: true },
            { id: 'primary_color', type: 'color', label: 'Warna Utama', required: true },
            { id: 'secondary_color', type: 'color', label: 'Warna Sekunder', required: true },
            { id: 'platforms', type: 'select', label: 'Platform', options: ['All Platforms', 'Instagram Only', 'LinkedIn Only', 'Facebook Only', 'Twitter Only'], required: true },
            { id: 'content_types', type: 'select', label: 'Tipe Konten', options: ['All Types', 'Posts Only', 'Stories Only', 'Covers Only'], required: true }
        ],
        promptTemplate: `=== SOCIAL MEDIA KIT REQUEST ===\n\nBRAND: {brand_name}\nINDUSTRY: {industry}\nSTYLE: {visual_style}\nCOLORS: {primary_color}, {secondary_color}\nPLATFORMS: {platforms}\nCONTENT: {content_types}\n\nGenerate 50+ social media templates.`
    },

    'ad-creative': {
        id: 'WF-026', file: '26-ad-creative-generator.txt', name: 'Ad Creative Generator', icon: '📢', category: 'marketing',
        tags: ['marketing', 'image', 'popular'],
        description: 'High-converting ad creatives for all advertising platforms',
        output: '40 ad creatives', models: 'Imagen 4 + Gemini', difficulty: 'intermediate', estimatedTime: '10-15 min', popular: true,
        opalLink: 'https://opal.google/?flow=drive:/1_ESbS5nXil_m8AIQc8zaJCrlxBZe_3c3&shared&mode=app',
        fields: [
            { id: 'product_name', type: 'text', label: 'Nama Produk/Jasa', required: true },
            { id: 'product_description', type: 'textarea', label: 'Deskripsi Produk', required: true },
            { id: 'offer', type: 'text', label: 'Penawaran/Promo', placeholder: '50% OFF, Free Trial, dll', required: false },
            { id: 'platform', type: 'select', label: 'Platform Iklan', options: ['Facebook/Instagram Ads', 'Google Display', 'TikTok Ads', 'LinkedIn Ads', 'Pinterest Ads', 'All Platforms'], required: true },
            { id: 'objective', type: 'select', label: 'Objective', options: ['Awareness', 'Consideration', 'Conversion', 'Retargeting'], required: true },
            { id: 'ad_style', type: 'select', label: 'Gaya Iklan', options: ['Product Focus', 'Lifestyle', 'UGC Style', 'Testimonial', 'Before/After', 'Comparison'], required: true },
            { id: 'target_audience', type: 'text', label: 'Target Audience', required: true },
            { id: 'cta', type: 'select', label: 'Call-to-Action', options: ['Shop Now', 'Learn More', 'Sign Up', 'Get Started', 'Book Now', 'Download', 'Contact Us'], required: true },
            { id: 'brand_colors', type: 'text', label: 'Warna Brand', placeholder: '#6366F1, #EC4899', required: false }
        ],
        promptTemplate: `=== AD CREATIVE REQUEST ===\n\nPRODUCT: {product_name}\nDESCRIPTION: {product_description}\nOFFER: {offer}\nPLATFORM: {platform}\nOBJECTIVE: {objective}\nSTYLE: {ad_style}\nAUDIENCE: {target_audience}\nCTA: {cta}\nCOLORS: {brand_colors}\n\nGenerate 40 high-converting ad creatives.`
    },

    'email-campaign': {
        id: 'WF-027', file: '27-email-marketing-kit.txt', name: 'Email Marketing Kit', icon: '📧', category: 'marketing',
        tags: ['marketing', 'text'],
        description: 'Complete email marketing templates and sequences',
        output: '20 email templates', models: 'Gemini 2.5 Pro', difficulty: 'intermediate', estimatedTime: '10-15 min',
        opalLink: 'https://opal.google/?flow=drive:/1HNPPModVsvXJER-YcrH6CxLhV2VFjzjD&shared&mode=app',
        fields: [
            { id: 'campaign_type', type: 'select', label: 'Tipe Campaign', options: ['Welcome Series', 'Product Launch', 'Newsletter', 'Promotional/Sale', 'Re-engagement', 'Abandoned Cart', 'Post-Purchase', 'Educational'], required: true },
            { id: 'brand_name', type: 'text', label: 'Nama Brand', required: true },
            { id: 'product_service', type: 'text', label: 'Produk/Jasa', required: true },
            { id: 'tone', type: 'select', label: 'Tone', options: ['Professional', 'Friendly', 'Urgent', 'Casual', 'Luxurious'], required: true },
            { id: 'target_audience', type: 'text', label: 'Target Audience', required: true },
            { id: 'email_count', type: 'select', label: 'Jumlah Email', options: ['3 emails', '5 emails', '7 emails', '10 emails'], required: true },
            { id: 'primary_cta', type: 'text', label: 'CTA Utama', placeholder: 'Shop Now, Learn More, dll', required: true }
        ],
        promptTemplate: `=== EMAIL MARKETING REQUEST ===\n\nCAMPAIGN: {campaign_type}\nBRAND: {brand_name}\nPRODUCT: {product_service}\nTONE: {tone}\nAUDIENCE: {target_audience}\nEMAILS: {email_count}\nCTA: {primary_cta}\n\nGenerate complete email sequence with subject lines, preview text, and body.`
    },

    'presentation': {
        id: 'WF-028', file: '28-presentation-generator.txt', name: 'Presentation Generator', icon: '📊', category: 'business',
        tags: ['business', 'marketing'],
        description: 'Professional presentation slides with content and visuals',
        output: '20-30 slides', models: 'Gemini + Imagen 4', difficulty: 'intermediate', estimatedTime: '15-20 min',
        opalLink: 'https://opal.google/?flow=drive:/1E8cBE2Dc6rVZHCJXKxP81_wh9h6fRWiF&shared&mode=app',
        fields: [
            { id: 'presentation_topic', type: 'text', label: 'Topik Presentasi', required: true },
            { id: 'presentation_type', type: 'select', label: 'Tipe Presentasi', options: ['Pitch Deck', 'Sales Presentation', 'Educational/Training', 'Report/Analysis', 'Proposal', 'Company Profile', 'Product Demo'], required: true },
            { id: 'slide_count', type: 'select', label: 'Jumlah Slide', options: ['10 slides', '15 slides', '20 slides', '30 slides'], required: true },
            { id: 'audience', type: 'text', label: 'Audience', placeholder: 'Investor, Client, Team, dll', required: true },
            { id: 'key_points', type: 'textarea', label: 'Poin-Poin Utama', required: true },
            { id: 'visual_style', type: 'select', label: 'Gaya Visual', options: ['Modern Minimal', 'Corporate Professional', 'Creative Bold', 'Elegant', 'Data-Heavy'], required: true },
            { id: 'brand_colors', type: 'text', label: 'Warna Brand', placeholder: '#6366F1, #EC4899', required: false }
        ],
        promptTemplate: `=== PRESENTATION REQUEST ===\n\nTOPIC: {presentation_topic}\nTYPE: {presentation_type}\nSLIDES: {slide_count}\nAUDIENCE: {audience}\nKEY POINTS:\n{key_points}\nSTYLE: {visual_style}\nCOLORS: {brand_colors}\n\nGenerate complete presentation with content and visual suggestions.`
    },

    'logo-suite': {
        id: 'WF-029', file: '29-logo-generator.txt', name: 'Logo Suite Generator', icon: '🎯', category: 'branding',
        tags: ['branding', 'image'],
        description: 'Complete logo suite with variations and social icons',
        output: '20 logo variations', models: 'Imagen 4', difficulty: 'intermediate', estimatedTime: '10-15 min',
        opalLink: 'https://opal.google/?flow=drive:/16-KzM7lkxWFB3_XHbMuKTY7AXNSX-kv4&shared&mode=app',
        fields: [
            { id: 'brand_name', type: 'text', label: 'Nama Brand', required: true },
            { id: 'tagline', type: 'text', label: 'Tagline (opsional)', required: false },
            { id: 'industry', type: 'select', label: 'Industri', options: ['Technology', 'Fashion', 'Food & Beverage', 'Health', 'Finance', 'Education', 'Creative/Agency', 'E-commerce', 'Real Estate', 'Sports'], required: true },
            { id: 'logo_style', type: 'select', label: 'Gaya Logo', options: ['Modern Minimal', 'Classic/Traditional', 'Playful/Fun', 'Geometric', 'Vintage/Retro', 'Luxury/Elegant', 'Tech/Futuristic'], required: true },
            { id: 'icon_preference', type: 'select', label: 'Preferensi Icon', options: ['Abstract shape', 'Letter-based', 'Symbol/Object', 'Mascot', 'No icon (wordmark only)'], required: true },
            { id: 'color_preference', type: 'select', label: 'Preferensi Warna', options: ['Let AI decide', 'Blue tones', 'Green tones', 'Red/Orange tones', 'Purple tones', 'Black/Gold', 'Multicolor'], required: true }
        ],
        promptTemplate: `=== LOGO SUITE REQUEST ===\n\nBRAND: {brand_name}\nTAGLINE: {tagline}\nINDUSTRY: {industry}\nSTYLE: {logo_style}\nICON: {icon_preference}\nCOLOR: {color_preference}\n\nGenerate 20 logo variations including primary, secondary, icon, and social versions.`
    },

    'content-calendar': {
        id: 'WF-030', file: '30-content-calendar.txt', name: 'Content Calendar Generator', icon: '📅', category: 'marketing',
        tags: ['marketing', 'text', 'business'],
        description: 'Monthly content calendar with ideas and posting schedule',
        output: '30-day content plan', models: 'Gemini 2.5 Pro', difficulty: 'intermediate', estimatedTime: '10-15 min',
        opalLink: 'https://opal.google/?flow=drive:/1xi5DEJLG_GpRFzK6YpG8rxJMTJSrgAuY&shared&mode=app',
        fields: [
            { id: 'niche', type: 'text', label: 'Niche/Industri', required: true },
            { id: 'brand_name', type: 'text', label: 'Nama Brand', required: true },
            { id: 'platforms', type: 'select', label: 'Platform', options: ['All Platforms', 'Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'Twitter', 'Facebook'], required: true },
            { id: 'posting_frequency', type: 'select', label: 'Frekuensi Posting', options: ['Daily', '5x/week', '3x/week', '2x/week', 'Weekly'], required: true },
            { id: 'content_pillars', type: 'textarea', label: 'Content Pillars', placeholder: 'Masukkan 3-5 pilar konten (satu per baris)...', required: true },
            { id: 'goals', type: 'select', label: 'Tujuan Utama', options: ['Brand Awareness', 'Engagement', 'Lead Generation', 'Sales', 'Community Building'], required: true },
            { id: 'target_audience', type: 'text', label: 'Target Audience', required: true },
            { id: 'month', type: 'select', label: 'Bulan', options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], required: true }
        ],
        promptTemplate: `=== CONTENT CALENDAR REQUEST ===\n\nNICHE: {niche}\nBRAND: {brand_name}\nPLATFORMS: {platforms}\nFREQUENCY: {posting_frequency}\nPILLARS:\n{content_pillars}\nGOALS: {goals}\nAUDIENCE: {target_audience}\nMONTH: {month}\n\nGenerate 30-day content calendar with specific post ideas, captions, and optimal posting times.`
    }
};

// Export Batch 1
window.WorkflowsDetailedBatch1 = WorkflowsDetailedBatch1;
