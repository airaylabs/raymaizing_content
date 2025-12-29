// ==================== ULTRA SMART CONTENT STUDIO ====================
// One Input → Complete Multi-Format Output via Google Opal
// All AI Models: Gemini Pro, Deep Research, Imagen 4, Veo, AudioLM, Lyria 2

const UltraStudio = {
    results: { text: [], images: [], video: [], audio: [] },
    opalWorkflow: '',
    
    // Complete Opal Workflows - Optimized for 1-Click Generation
    opalWorkflows: [
        { id: 'complete_content', name: '📦 Complete Content Package', desc: 'Article + Thread + Carousel + Video + Audio', models: 'All Models', color: '#5B9A94', premium: true },
        { id: 'seo_article', name: '📝 SEO Article (10 Variations)', desc: 'Research + 10 article styles + platform adaptations', models: 'Deep Research + Gemini 3 Pro', color: '#8B9A7A' },
        { id: 'viral_thread', name: '🐦 Viral Thread (10 Hooks)', desc: '10 different viral hooks + complete threads', models: 'Gemini 2.5 Pro', color: '#6A9AB0' },
        { id: 'carousel_complete', name: '🎨 Carousel + 30 Images', desc: '10 slides × 3 styles = 30 images', models: 'Gemini + Imagen 4', color: '#C4A574' },
        { id: 'video_complete', name: '🎬 Video Package', desc: 'Script + Video clips + Music + Voiceover', models: 'Gemini + Veo + Lyria + AudioLM', color: '#9A7A8B' },
        { id: 'short_video', name: '📱 Short-Form (TikTok/Reels)', desc: '10 scripts + clips + trending music', models: 'Veo + Lyria 2', color: '#E07A9A' },
        { id: 'podcast_audio', name: '🎙️ Podcast/Audio Content', desc: 'Script + Voiceover + Background music', models: 'AudioLM + Lyria 2', color: '#7A9A8B' },
        { id: 'deep_research', name: '🔍 Deep Research Report', desc: 'Comprehensive research + insights + data', models: 'Deep Research', color: '#8690A6' },
        { id: 'product_launch', name: '🚀 Product Launch Kit', desc: 'All assets for product launch', models: 'All Models', color: '#9A8B7A' },
        { id: 'brand_kit', name: '🎨 Brand Visual Kit', desc: 'Logo concepts + brand images + style guide', models: 'Imagen 4 + Gemini 3 Pro Image', color: '#7A8B9A' }
    ],

    init() {
        this.renderWorkflowGrid();
    },

    renderWorkflowGrid() {
        const container = document.getElementById('opal-workflow-grid');
        if (!container) return;
        
        container.innerHTML = this.opalWorkflows.map(w => `
            <div class="opal-workflow-card" onclick="UltraStudio.generateWorkflow('${w.id}')" 
                 style="background:var(--bg-muted);padding:16px;border-radius:12px;cursor:pointer;border:2px solid transparent;transition:all 0.2s;position:relative;"
                 onmouseover="this.style.borderColor='${w.color}';this.style.transform='translateY(-2px)'" 
                 onmouseout="this.style.borderColor='transparent';this.style.transform='none'">
                ${w.premium ? '<span style="position:absolute;top:8px;right:8px;background:gold;color:#000;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:bold;">PRO</span>' : ''}
                <div style="font-size:28px;margin-bottom:8px;">${w.name.split(' ')[0]}</div>
                <div style="font-weight:600;color:var(--text-primary);font-size:12px;margin-bottom:4px;">${w.name.substring(w.name.indexOf(' ')+1)}</div>
                <div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;">${w.desc}</div>
                <div style="font-size:9px;color:${w.color};background:${w.color}15;padding:4px 8px;border-radius:6px;">${w.models}</div>
            </div>
        `).join('');
    },

    // Main function to generate workflow
    generateWorkflow(workflowId) {
        const topic = document.getElementById('ultra-topic')?.value;
        if (!topic) {
            showToast('Masukkan topic/ide terlebih dahulu!', 'warning');
            return;
        }
        
        const kb = typeof KnowledgeBaseData !== 'undefined' ? KnowledgeBaseData : this.getDefaultKB();
        const language = document.getElementById('ultra-language')?.value || 'id';
        const langText = language === 'id' ? 'Bahasa Indonesia' : 'English';
        
        const workflows = {
            complete_content: () => this.getCompleteContentWorkflow(topic, kb, langText),
            seo_article: () => this.getSEOArticleWorkflow(topic, kb, langText),
            viral_thread: () => this.getViralThreadWorkflow(topic, kb, langText),
            carousel_complete: () => this.getCarouselWorkflow(topic, kb, langText),
            video_complete: () => this.getVideoCompleteWorkflow(topic, kb, langText),
            short_video: () => this.getShortVideoWorkflow(topic, kb, langText),
            podcast_audio: () => this.getPodcastWorkflow(topic, kb, langText),
            deep_research: () => this.getDeepResearchWorkflow(topic, kb, langText),
            product_launch: () => this.getProductLaunchWorkflow(topic, kb, langText),
            brand_kit: () => this.getBrandKitWorkflow(topic, kb, langText)
        };
        
        this.opalWorkflow = workflows[workflowId]?.() || workflows.complete_content();
        
        document.getElementById('opal-workflow-output').textContent = this.opalWorkflow;
        document.getElementById('ultra-output-section').style.display = 'block';
        this.switchOutputTab('opal');
        showToast('Workflow generated! Copy dan paste ke Google Opal', 'success');
    },

    getDefaultKB() {
        return {
            brandIdentity: { name: 'Your Brand', tagline: 'Your Tagline', philosophy: 'Your Philosophy' },
            targetAudience: { primary: { name: 'Your Audience', age: '25-40', painPoints: ['Pain point 1', 'Pain point 2'] } },
            toneOfVoice: { primary: 'Professional yet Friendly' },
            visualIdentity: { essence: 'Modern & Clean', colors: { primary: [{ hex: '#5B9A94' }], secondary: [{ hex: '#8B9A7A' }] } }
        };
    },

    // ==================== COMPLETE CONTENT PACKAGE ====================
    getCompleteContentWorkflow(topic, kb, lang) {
        return `Build a COMPLETE content generation app. User inputs topic ONCE, app generates ALL content types automatically.

TOPIC: "${topic}"
LANGUAGE: ${lang}
BRAND: ${kb.brandIdentity.name}
AUDIENCE: ${kb.targetAudience.primary.name}
TONE: ${kb.toneOfVoice.primary}

=== STEP 1: USER INPUT (SINGLE INPUT) ===
Add "User Input":
- Text area: "topic" (pre-filled: "${topic}")
- That's it! One input only.

=== STEP 2: DEEP RESEARCH ===
Model: Deep Research with Gemini 2.5 Flash
Enable: Web Search

"""
Research "${topic}" comprehensively:
1. Market trends & statistics (with sources)
2. Top 10 questions people ask
3. Competitor content analysis
4. Viral content patterns
5. Target audience insights for ${kb.targetAudience.primary.name}
6. Content gaps & opportunities
7. Trending hashtags & keywords
8. Best posting times
"""

=== STEP 3: SEO ARTICLE (Gemini 3 Pro) ===
"""
Using @Step2 research, create SEO article about "${topic}":

OUTPUT:
---TITLE--- (60 chars, keyword-rich)
---META--- (155 chars)
---ARTICLE--- (1500 words, H2/H3 structure)
---FAQ--- (5 questions with schema markup)
---KEYWORDS--- (primary + secondary)
"""

=== STEP 4: 5 ARTICLE VARIATIONS (Gemini 2.5 Flash) ===
"""
Create 5 different versions of @Step3:
1. LISTICLE: "X Ways to..."
2. HOW-TO: Step-by-step guide
3. STORY: Personal narrative
4. EXPERT: Data-driven analysis
5. BEGINNER: Simple explanation

Each complete with title, meta, full article.
"""

=== STEP 5: TWITTER THREAD (Gemini 2.5 Pro) ===
"""
Create viral Twitter thread about "${topic}":
- 10 tweets, each under 280 chars
- Hook tweet that stops scroll
- Value-packed middle tweets
- CTA tweet at end
- Include relevant emojis
- 5 hashtags

Output format:
1/ [Hook tweet]
2/ [Tweet 2]
...
10/ [CTA tweet]
"""

=== STEP 6: LINKEDIN POST (Gemini 2.5 Flash) ===
"""
Create LinkedIn post about "${topic}":
- Professional hook
- Story/insight (3 paragraphs)
- Key takeaways (bullet points)
- Engagement question
- 5 hashtags
"""

=== STEP 7: CAROUSEL CONTENT (Gemini 2.5 Pro) ===
"""
Create 10-slide carousel about "${topic}":

For each slide:
SLIDE [N]:
- Headline: (max 6 words)
- Body: (max 20 words)
- Visual: (detailed image description)
- Layout: (text position)

Narrative: Hook → Context → Value → Proof → CTA
"""

=== STEP 8: CAROUSEL IMAGES - STYLE A (Imagen 4) ===
Generate 10 images using @Step7 visual descriptions.
Style: Professional, clean, brand colors ${kb.visualIdentity.colors.primary[0]?.hex || '#5B9A94'}
Aspect: 1:1 (Instagram square)
NO TEXT in images.

=== STEP 9: CAROUSEL IMAGES - STYLE B (Gemini 2.5 Flash Image) ===
Generate 10 images, illustrated/vector style.
Same descriptions as @Step7.

=== STEP 10: VIDEO SCRIPT (Gemini 3 Pro) ===
"""
Create 60-second video script about "${topic}":

[0-3s] HOOK:
- Visual: [description]
- Audio: "[exact words]"
- Text overlay: [text]

[3-10s] PROBLEM:
- Visual: [description]
- Audio: "[words]"

[10-45s] SOLUTION:
- Scene 1: [visual + audio]
- Scene 2: [visual + audio]
- Scene 3: [visual + audio]

[45-60s] CTA:
- Visual: [description]
- Audio: "[CTA words]"
- End card: [description]

MUSIC: [genre + mood suggestion]
"""

=== STEP 11: VIDEO CLIPS (Veo) ===
Generate 4 video clips based on @Step10:
1. Hook scene (3 seconds)
2. Problem scene (7 seconds)
3. Solution montage (35 seconds)
4. CTA scene (15 seconds)

Style: ${kb.visualIdentity.essence || 'Modern, professional'}
Aspect: 9:16 (vertical)

=== STEP 12: BACKGROUND MUSIC (Lyria 2) ===
Generate 60-second background music:
- Genre: Modern, upbeat
- Mood: Inspiring, professional
- Build-up at 10s, peak at 30s
- Fade out at 55s

=== STEP 13: VOICEOVER (AudioLM) ===
Generate voiceover for @Step10 script.
Voice: Professional, warm, ${lang}
Pace: Medium, clear enunciation

=== STEP 14: INSTAGRAM CAPTION (Gemini 2.5 Flash) ===
"""
Create Instagram caption for "${topic}":
- Hook line (shows in preview)
- Value summary
- Engagement question
- CTA
- 30 hashtags (10 high, 10 medium, 10 niche volume)
"""

=== STEP 15: EMAIL NEWSLETTER (Gemini 2.5 Flash) ===
"""
Create email newsletter about "${topic}":
- 5 subject line options
- Preview text
- Newsletter body (500 words)
- CTA button text
"""

=== OUTPUT ===
Display as tabbed dashboard:
- Tab 1: Articles (main + 5 variations)
- Tab 2: Social (Thread + LinkedIn + Caption)
- Tab 3: Carousel (content + 20 images)
- Tab 4: Video (script + clips + music + voiceover)
- Tab 5: Email Newsletter
- Download All as ZIP`;
    },

    // ==================== SEO ARTICLE WORKFLOW ====================
    getSEOArticleWorkflow(topic, kb, lang) {
        return `Build SEO article generator. ONE input → 10 complete article variations.

TOPIC: "${topic}"
LANGUAGE: ${lang}

=== STEP 1: INPUT ===
Text area: "topic" (value: "${topic}")

=== STEP 2: DEEP RESEARCH ===
Model: Deep Research with Gemini 2.5 Flash
Enable: Web Search

"""
Research "${topic}":
1. Top 10 search queries
2. Featured snippet opportunities
3. Competitor top-ranking articles
4. Statistics & data points
5. Expert quotes
6. Common questions (for FAQ)
7. Related keywords (LSI)
8. Content gaps
"""

=== STEP 3: MAIN ARTICLE (Gemini 3 Pro) ===
"""
Create comprehensive SEO article:

RESEARCH: @Step2
TOPIC: "${topic}"
AUDIENCE: ${kb.targetAudience.primary.name}
TONE: ${kb.toneOfVoice.primary}

OUTPUT FORMAT:
===TITLE=== (60 chars, primary keyword)
===META=== (155 chars, compelling)
===ARTICLE===
[Introduction - hook + keyword in first 100 words]
[H2: Section 1]
[H2: Section 2]
[H2: Section 3]
[H2: Section 4]
[H2: Section 5]
[Conclusion with CTA]
===FAQ=== (5 questions, schema-ready)
===INTERNAL_LINKS=== (5 suggested topics)
===WORD_COUNT===
"""

=== STEP 4: 10 VARIATIONS (Gemini 2.5 Flash) ===
"""
Create 10 COMPLETELY DIFFERENT article versions:

ORIGINAL: @Step3

1. LISTICLE: "X Ways/Tips/Reasons..."
2. HOW-TO GUIDE: Step-by-step tutorial
3. CASE STUDY: Real examples + data
4. STORYTELLING: Personal narrative
5. EXPERT ROUNDUP: Multiple perspectives
6. COMPARISON: X vs Y format
7. BEGINNER'S GUIDE: Simple language
8. ADVANCED DEEP-DIVE: Technical
9. NEWS ANGLE: Current events tie-in
10. CONTROVERSIAL: Bold opinions

Each MUST include:
- Unique title (60 chars)
- Unique meta (155 chars)
- Complete article (1500+ words)
- Unique FAQ (5 questions)
"""

=== STEP 5: PLATFORM ADAPTATIONS (Gemini 2.5 Flash) ===
"""
Adapt @Step3 for:
1. LinkedIn Article (professional tone)
2. Medium Post (storytelling)
3. Blog excerpt (300 words teaser)
4. Twitter thread (10 tweets)
5. Instagram caption (with hashtags)
"""

=== OUTPUT ===
Tabs: Main Article | 10 Variations | Platform Versions
Each with copy button + download option`;
    },

    // ==================== VIRAL THREAD WORKFLOW ====================
    getViralThreadWorkflow(topic, kb, lang) {
        return `Build viral thread generator. ONE input → 10 complete threads with different hooks.

TOPIC: "${topic}"
LANGUAGE: ${lang}

=== STEP 1: INPUT ===
Text area: "topic" (value: "${topic}")

=== STEP 2: VIRAL RESEARCH (Gemini 2.5 Pro + Web) ===
"""
Research viral thread patterns for "${topic}":
1. Top 10 viral threads on this topic
2. Hook patterns that work
3. Engagement triggers
4. Optimal thread length
5. Best posting times
6. Trending hashtags
"""

=== STEP 3: 10 COMPLETE THREADS (Gemini 2.5 Pro) ===
"""
Create 10 COMPLETE Twitter threads, each with DIFFERENT hook:

TOPIC: "${topic}"
RESEARCH: @Step2

===THREAD 1: SHOCKING STATISTIC===
1/ [Number]% of people don't know this about ${topic}...

Here's what I discovered: 🧵

2/ [Value tweet]
3/ [Value tweet]
...
10/ [CTA] Follow for more insights on ${topic}

#hashtag1 #hashtag2

===THREAD 2: BOLD CLAIM===
1/ ${topic} is broken. Here's why (and how to fix it):

===THREAD 3: PERSONAL STORY===
1/ I spent 100 hours studying ${topic}. Here's everything I learned:

===THREAD 4: QUESTION===
1/ Why do 90% of people fail at ${topic}? (It's not what you think)

===THREAD 5: CONTRARIAN===
1/ Unpopular opinion: Everything you know about ${topic} is wrong.

===THREAD 6: CURIOSITY GAP===
1/ The secret about ${topic} that experts don't share publicly:

===THREAD 7: SOCIAL PROOF===
1/ After [achievement], here are my biggest lessons about ${topic}:

===THREAD 8: URGENCY===
1/ ${topic} is changing fast. If you're not doing this, you're falling behind:

===THREAD 9: PROMISE===
1/ This thread will save you 100 hours on ${topic}. Bookmark it.

===THREAD 10: PATTERN INTERRUPT===
1/ Stop scrolling. This is important.

${topic} thread: 🧵

Each thread: 10 tweets, under 280 chars each, with emojis and hashtags.
"""

=== OUTPUT ===
10 threads in tabs, each with:
- Copy full thread button
- Copy individual tweets
- Character count per tweet`;
    },

    // ==================== CAROUSEL + IMAGES WORKFLOW ====================
    getCarouselWorkflow(topic, kb, lang) {
        return `Build carousel generator with 30 images (10 slides × 3 styles).

TOPIC: "${topic}"
LANGUAGE: ${lang}
BRAND COLORS: ${kb.visualIdentity.colors.primary[0]?.hex || '#5B9A94'}, ${kb.visualIdentity.colors.secondary[0]?.hex || '#8B9A7A'}

=== STEP 1: INPUT ===
Text area: "topic" (value: "${topic}")

=== STEP 2: CAROUSEL CONTENT (Gemini 2.5 Pro) ===
"""
Create 10-slide carousel content for "${topic}":

SLIDE 1 (HOOK):
- Headline: [max 6 words - attention grabbing]
- Subtext: [max 15 words]
- Visual: [50-word detailed description for image generation]
- Color emphasis: Primary

SLIDE 2-3 (CONTEXT):
[Same format - explain the problem/why it matters]

SLIDE 4-7 (VALUE):
[Same format - main content/tips/steps]

SLIDE 8-9 (PROOF):
[Same format - examples/results/testimonials]

SLIDE 10 (CTA):
- Headline: [action prompt]
- Subtext: [what to do next]
- Visual: [CTA visual with arrow/button]
"""

=== STEP 3: STYLE A - PHOTO REALISTIC (Imagen 4) ===
Generate 10 images for @Step2.

For each slide:
"""
Create professional social media image.
Description: [Visual from Step 2]
Style: Photo-realistic, professional lighting
Colors: ${kb.visualIdentity.colors.primary[0]?.hex || '#5B9A94'} accent
Aspect: 1:1 (1024x1024)
Requirements:
- Clean composition
- Space for text overlay at [position]
- NO TEXT in image
- High contrast
- Premium feel
"""

=== STEP 4: STYLE B - ILLUSTRATED (Gemini 3 Pro Image) ===
Generate 10 images, same content, illustrated style.
"""
Style: Modern flat illustration, vector-like
Colors: Brand palette
Clean, minimal, Dribbble-worthy
"""

=== STEP 5: STYLE C - ABSTRACT (Gemini 2.5 Flash Image) ===
Generate 10 images, abstract/artistic style.
"""
Style: Abstract, gradient backgrounds
Artistic interpretation
Mood-focused
"""

=== STEP 6: CAPTION + HASHTAGS (Gemini 2.5 Flash) ===
"""
Create Instagram caption for this carousel:

SHORT (150 chars): [Hook for preview]

FULL (500 chars):
[Hook]
[Value summary]
[Engagement question]
[CTA: Save & Share]

HASHTAGS:
High volume (10): [1M+ posts]
Medium (10): [100K-1M posts]
Niche (10): [<100K posts]
"""

=== OUTPUT ===
Grid gallery:
- Tab A: Photo-realistic (10 images)
- Tab B: Illustrated (10 images)
- Tab C: Abstract (10 images)
- Slide content overlay preview
- Caption with copy
- Download all as ZIP`;
    },

    // ==================== VIDEO COMPLETE WORKFLOW ====================
    getVideoCompleteWorkflow(topic, kb, lang) {
        return `Build complete video package generator: Script + Clips + Music + Voiceover.

TOPIC: "${topic}"
LANGUAGE: ${lang}

=== STEP 1: INPUT ===
Text area: "topic" (value: "${topic}")
Optional: Image upload for "reference_style"

=== STEP 2: VIDEO RESEARCH (Gemini 2.5 Pro + Web) ===
"""
Research video content for "${topic}":
1. Viral video patterns
2. Trending sounds/music
3. Optimal video structure
4. Hook techniques
5. Engagement triggers
"""

=== STEP 3: MAIN SCRIPT (Gemini 3 Pro) ===
"""
Create 60-second video script for "${topic}":

===HOOK (0-3 seconds)===
VISUAL: [Exact description - what viewer sees]
AUDIO: "[Exact words to say]"
TEXT_OVERLAY: [Text on screen]
CAMERA: [Close-up/Wide/POV]
TRANSITION: [Cut type]

===BUILD-UP (3-10 seconds)===
VISUAL: [Description]
AUDIO: "[Words]"
B-ROLL: [Suggestion]

===MAIN CONTENT (10-45 seconds)===
SCENE 1 (10-20s):
- VISUAL: [Description]
- AUDIO: "[Words]"
- CAMERA_ANGLE_1: [Main]
- CAMERA_ANGLE_2: [Alternative]

SCENE 2 (20-30s):
[Same format]

SCENE 3 (30-45s):
[Same format]

===CTA (45-60 seconds)===
VISUAL: [Description]
AUDIO: "[CTA words]"
END_CARD: [What to show]

===MUSIC===
Genre: [Type]
Mood: [Description]
Key moments: [Beat drops at X seconds]
"""

=== STEP 4: 5 SCRIPT VARIATIONS (Gemini 2.5 Flash) ===
"""
Create 5 different script styles:
1. TALKING HEAD - Direct to camera
2. B-ROLL MONTAGE - Visual storytelling
3. TEXT ON SCREEN - Minimal talking
4. TUTORIAL - Step-by-step demo
5. STORY/NARRATIVE - Emotional journey
"""

=== STEP 5: VIDEO CLIPS (Veo) ===
Generate video clips for @Step3:

CLIP 1 - HOOK (3 seconds):
"""
[Hook visual description]
Style: Attention-grabbing, dynamic
Aspect: 9:16 vertical
"""

CLIP 2 - BUILD-UP (7 seconds):
"""
[Build-up visual]
"""

CLIP 3 - MAIN CONTENT (35 seconds):
"""
[Main content montage]
Multiple scenes, smooth transitions
"""

CLIP 4 - CTA (15 seconds):
"""
[CTA visual with end card]
"""

=== STEP 6: ALTERNATIVE ANGLES (Veo) ===
Generate 2 alternative angles for key scenes.

=== STEP 7: BACKGROUND MUSIC (Lyria 2) ===
"""
Create 60-second background music:
Genre: ${lang === 'Bahasa Indonesia' ? 'Modern Indonesian pop' : 'Modern pop'}
Mood: Inspiring, energetic
Structure:
- 0-3s: Attention intro
- 3-10s: Build-up
- 10-45s: Main groove with peaks
- 45-60s: Fade out
BPM: 120-130
"""

=== STEP 8: VOICEOVER (AudioLM) ===
"""
Generate voiceover for @Step3 script.
Voice: Professional, warm
Language: ${lang}
Pace: Medium, clear
Duration: 60 seconds
Sync with music beats
"""

=== OUTPUT ===
Complete video package:
- Script (main + 5 variations)
- Video clips (4 main + alternatives)
- Background music
- Voiceover audio
- Download all`;
    },

    // ==================== SHORT VIDEO (TIKTOK/REELS) ====================
    getShortVideoWorkflow(topic, kb, lang) {
        return `Build short-form video generator for TikTok/Reels/Shorts.

TOPIC: "${topic}"
LANGUAGE: ${lang}

=== STEP 1: INPUT ===
Text area: "topic" (value: "${topic}")

=== STEP 2: TREND RESEARCH (Gemini 2.5 Pro + Web) ===
"""
Research TikTok/Reels trends for "${topic}":
1. Trending sounds
2. Viral formats
3. Hook patterns
4. Hashtag challenges
5. Best posting times
"""

=== STEP 3: 10 SHORT SCRIPTS (Gemini 2.5 Flash) ===
"""
Create 10 different 15-30 second scripts:

===SCRIPT 1: HOOK & REVEAL===
[0-3s] HOOK: "[Shocking statement]"
[3-15s] REVEAL: [Quick explanation]
[15-20s] CTA: "Follow for more!"

===SCRIPT 2: POV FORMAT===
"POV: You just discovered ${topic}..."

===SCRIPT 3: BEFORE/AFTER===
[Show transformation]

===SCRIPT 4: 3 TIPS FORMAT===
"3 things about ${topic} you need to know:"

===SCRIPT 5: STORYTIME===
"Storytime: How ${topic} changed everything..."

===SCRIPT 6: TREND REMIX===
[Use trending format/sound]

===SCRIPT 7: DUET/STITCH STYLE===
[Response format]

===SCRIPT 8: TUTORIAL QUICK===
"How to [topic] in 15 seconds:"

===SCRIPT 9: MYTH BUSTING===
"Stop believing this about ${topic}..."

===SCRIPT 10: CONTROVERSIAL===
"Unpopular opinion about ${topic}:"

Each with: Visual, Audio, Text overlay, Music suggestion
"""

=== STEP 4: VIDEO CLIPS (Veo) ===
Generate 10 short video clips (15-30s each).
Aspect: 9:16 vertical
Style: TikTok-native, fast-paced

=== STEP 5: TRENDING MUSIC (Lyria 2) ===
Generate 3 music options:
1. Upbeat/energetic (15s)
2. Chill/aesthetic (15s)
3. Dramatic/cinematic (15s)

=== STEP 6: CAPTIONS + HASHTAGS ===
"""
For each video:
- Caption (150 chars)
- 10 hashtags (mix trending + niche)
- Best posting time
"""

=== OUTPUT ===
10 complete short videos ready to post`;
    },

    // ==================== PODCAST/AUDIO WORKFLOW ====================
    getPodcastWorkflow(topic, kb, lang) {
        return `Build podcast/audio content generator.

TOPIC: "${topic}"
LANGUAGE: ${lang}

=== STEP 1: INPUT ===
Text area: "topic" (value: "${topic}")

=== STEP 2: PODCAST SCRIPT (Gemini 3 Pro) ===
"""
Create 10-minute podcast script about "${topic}":

===INTRO (0-1 min)===
[Hook + episode overview]

===SEGMENT 1 (1-3 min)===
[Main point 1 with examples]

===SEGMENT 2 (3-5 min)===
[Main point 2 with stories]

===SEGMENT 3 (5-7 min)===
[Main point 3 with actionable tips]

===LISTENER Q&A (7-9 min)===
[Address common questions]

===OUTRO (9-10 min)===
[Summary + CTA + next episode teaser]

Include: Transitions, emphasis markers, pause points
"""

=== STEP 3: VOICEOVER (AudioLM) ===
Generate full podcast voiceover.
Voice: Warm, conversational, ${lang}
Duration: 10 minutes
Natural pacing with pauses

=== STEP 4: INTRO MUSIC (Lyria 2) ===
Generate podcast intro jingle (15 seconds).
Style: Professional, memorable

=== STEP 5: BACKGROUND MUSIC (Lyria 2) ===
Generate subtle background music (10 minutes).
Style: Ambient, non-distracting

=== STEP 6: OUTRO MUSIC (Lyria 2) ===
Generate podcast outro (15 seconds).
Style: Uplifting, memorable

=== OUTPUT ===
Complete podcast episode:
- Full script
- Voiceover audio
- Intro/outro music
- Background music
- Show notes`;
    },

    // ==================== DEEP RESEARCH WORKFLOW ====================
    getDeepResearchWorkflow(topic, kb, lang) {
        return `Build comprehensive research report generator.

TOPIC: "${topic}"
LANGUAGE: ${lang}

=== STEP 1: INPUT ===
Text area: "topic" (value: "${topic}")

=== STEP 2: DEEP RESEARCH ===
Model: Deep Research with Gemini 2.5 Flash
Enable: Web Search (comprehensive)

"""
Conduct exhaustive research on "${topic}":

1. MARKET OVERVIEW
- Industry size & growth
- Key players
- Market trends

2. DATA & STATISTICS
- Recent studies
- Survey results
- Performance metrics
(Include sources)

3. EXPERT INSIGHTS
- Thought leader opinions
- Academic research
- Industry reports

4. COMPETITOR ANALYSIS
- Top competitors
- Their strategies
- Gaps & opportunities

5. AUDIENCE INSIGHTS
- Demographics
- Behavior patterns
- Pain points
- Desires

6. CONTENT LANDSCAPE
- Top-performing content
- Content gaps
- Viral patterns

7. FUTURE TRENDS
- Predictions
- Emerging technologies
- Opportunities

8. ACTIONABLE RECOMMENDATIONS
- Quick wins
- Long-term strategies
- Resource allocation
"""

=== STEP 3: EXECUTIVE SUMMARY (Gemini 3 Pro) ===
"""
Create executive summary of @Step2:
- Key findings (5 bullet points)
- Critical insights
- Recommended actions
- Risk factors
"""

=== STEP 4: VISUAL DATA (Gemini 2.5 Flash) ===
"""
Create data visualization descriptions:
- Chart 1: [Market size over time]
- Chart 2: [Competitor comparison]
- Chart 3: [Audience demographics]
- Chart 4: [Content performance]
"""

=== OUTPUT ===
Complete research report:
- Executive summary
- Full research (8 sections)
- Data visualizations
- Sources & citations
- Export as PDF`;
    },

    // ==================== PRODUCT LAUNCH KIT ====================
    getProductLaunchWorkflow(topic, kb, lang) {
        return `Build complete product launch kit generator.

PRODUCT/TOPIC: "${topic}"
LANGUAGE: ${lang}
BRAND: ${kb.brandIdentity.name}

=== STEP 1: INPUT ===
Text area: "product" (value: "${topic}")
Optional: Image upload "product_image"

=== STEP 2: LAUNCH STRATEGY (Gemini 3 Pro) ===
"""
Create launch strategy for "${topic}":
1. Value proposition
2. Target audience segments
3. Key messages
4. Launch timeline
5. Channel strategy
"""

=== STEP 3: LANDING PAGE COPY (Gemini 3 Pro) ===
"""
Create landing page copy:
- Hero headline
- Subheadline
- 3 benefit sections
- Social proof section
- FAQ (5 questions)
- CTA variations (3)
"""

=== STEP 4: EMAIL SEQUENCE (Gemini 2.5 Flash) ===
"""
Create 5-email launch sequence:
1. Teaser email
2. Announcement email
3. Benefits deep-dive
4. Social proof email
5. Last chance email

Each with: Subject, preview, body, CTA
"""

=== STEP 5: SOCIAL MEDIA KIT (Gemini 2.5 Flash) ===
"""
Create social posts for launch:
- 5 Instagram posts + captions
- 5 Twitter posts
- 3 LinkedIn posts
- 1 launch thread (10 tweets)
"""

=== STEP 6: PRODUCT IMAGES (Imagen 4) ===
Generate 5 product showcase images.
Style: Professional, clean background
If @product_image provided, use as reference.

=== STEP 7: PROMO VIDEO SCRIPT (Gemini 3 Pro) ===
"""
Create 30-second promo video script:
- Hook (3s)
- Problem (5s)
- Solution/Product (15s)
- CTA (7s)
"""

=== STEP 8: PROMO VIDEO (Veo) ===
Generate promo video based on @Step7.

=== STEP 9: LAUNCH MUSIC (Lyria 2) ===
Generate upbeat launch music (30s).

=== OUTPUT ===
Complete launch kit:
- Strategy document
- Landing page copy
- Email sequence
- Social media kit
- Product images
- Promo video + music`;
    },

    // ==================== BRAND VISUAL KIT ====================
    getBrandKitWorkflow(topic, kb, lang) {
        return `Build brand visual kit generator.

BRAND/TOPIC: "${topic}"
STYLE: ${kb.visualIdentity.essence || 'Modern & Professional'}
COLORS: ${kb.visualIdentity.colors.primary[0]?.hex || '#5B9A94'}

=== STEP 1: INPUT ===
Text area: "brand_name" (value: "${topic}")
Optional: Image upload "style_reference"
Optional: Image upload "existing_logo"

=== STEP 2: BRAND STRATEGY (Gemini 3 Pro) ===
"""
Create brand strategy for "${topic}":
1. Brand personality
2. Visual direction
3. Color psychology
4. Typography recommendations
5. Imagery style
"""

=== STEP 3: LOGO CONCEPTS (Imagen 4) ===
Generate 5 logo concept variations:
"""
Create minimalist logo for "${topic}".
Style 1: Wordmark
Style 2: Lettermark
Style 3: Icon + text
Style 4: Abstract symbol
Style 5: Mascot/character

Clean, scalable, professional.
Primary color: ${kb.visualIdentity.colors.primary[0]?.hex || '#5B9A94'}
"""

=== STEP 4: BRAND IMAGES (Gemini 3 Pro Image) ===
Generate 10 brand images:
- 3 hero images
- 3 social media backgrounds
- 2 pattern/texture
- 2 lifestyle shots

=== STEP 5: SOCIAL TEMPLATES (Imagen 4) ===
Generate social media templates:
- Instagram post template
- Instagram story template
- LinkedIn banner
- Twitter header
- Facebook cover

=== STEP 6: BRAND GUIDELINES (Gemini 3 Pro) ===
"""
Create brand guidelines document:
1. Logo usage rules
2. Color palette (primary, secondary, accent)
3. Typography system
4. Imagery guidelines
5. Tone of voice
6. Do's and Don'ts
"""

=== OUTPUT ===
Complete brand kit:
- 5 logo concepts
- 10 brand images
- Social templates
- Brand guidelines PDF`;
    },

    // ==================== UTILITY FUNCTIONS ====================
    switchOutputTab(tab) {
        document.querySelectorAll('.output-panel').forEach(p => p.style.display = 'none');
        document.querySelectorAll('[data-output]').forEach(t => t.classList.remove('active'));
        
        const panel = document.getElementById(`output-${tab}`);
        if (panel) panel.style.display = 'block';
        document.querySelector(`[data-output="${tab}"]`)?.classList.add('active');
    },

    copyOpalWorkflow() {
        navigator.clipboard.writeText(this.opalWorkflow).then(() => {
            showToast('Workflow copied! Paste ke Google Opal', 'success');
        });
    },

    // Direct AI Generation (using Pollinations)
    async generateDirect() {
        const topic = document.getElementById('ultra-topic')?.value;
        if (!topic) { showToast('Masukkan topic terlebih dahulu', 'warning'); return; }
        
        showLoading('Generating content...');
        
        try {
            const kb = typeof KnowledgeBaseData !== 'undefined' ? KnowledgeBaseData : this.getDefaultKB();
            
            // Generate text
            const textPrompt = `${kb.brandIdentity ? `Brand: ${kb.brandIdentity.name}\nTone: ${kb.toneOfVoice?.primary || 'Professional'}\n` : ''}
Create comprehensive content about: "${topic}"

Include:
1. SEO Article (500 words)
2. Twitter Thread (5 tweets)
3. Instagram Caption
4. LinkedIn Post

Format clearly with headers.`;

            const response = await fetch('https://text.pollinations.ai/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'user', content: textPrompt }], model: 'openai' })
            });
            
            const text = await response.text();
            this.results.text = [{ id: 1, title: topic, content: text, type: 'Complete Package' }];
            
            // Generate image
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(topic + ', professional, modern, clean design')}?width=1024&height=1024&nologo=true&seed=${Date.now()}`;
            this.results.images = [{ id: 1, url: imageUrl, style: 'Professional', prompt: topic }];
            
            this.renderResults();
            document.getElementById('ultra-output-section').style.display = 'block';
            this.switchOutputTab('text');
            
            hideLoading();
            showToast('Content generated!', 'success');
        } catch (e) {
            hideLoading();
            showToast('Generation failed: ' + e.message, 'error');
        }
    },

    renderResults() {
        // Render text results
        const textBody = document.getElementById('text-results-body');
        if (textBody && this.results.text.length > 0) {
            textBody.innerHTML = this.results.text.map((item, idx) => `
                <tr>
                    <td><input type="checkbox"></td>
                    <td>${idx + 1}</td>
                    <td style="font-weight:600;color:var(--text-primary);">${item.title || 'Generated Content'}</td>
                    <td><span style="background:var(--primary);color:white;padding:2px 8px;border-radius:12px;font-size:10px;">${item.type || 'Article'}</span></td>
                    <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-secondary);">${(item.content || '').substring(0, 100)}...</td>
                    <td>
                        <button class="btn-ghost" onclick="navigator.clipboard.writeText(\`${(item.content || '').replace(/`/g, "'")}\`); showToast('Copied!', 'success');">📋</button>
                        <button class="btn-ghost" onclick="UltraStudio.saveToHub(${idx})">💾</button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Render images
        const imageGrid = document.getElementById('image-results-grid');
        if (imageGrid && this.results.images.length > 0) {
            imageGrid.innerHTML = this.results.images.map((img, idx) => `
                <div style="background:var(--bg-muted);border-radius:12px;overflow:hidden;">
                    <img src="${img.url}" style="width:100%;height:200px;object-fit:cover;" onerror="this.src='https://via.placeholder.com/400?text=Loading...'">
                    <div style="padding:12px;">
                        <div style="font-size:11px;color:var(--text-muted);">${img.style}</div>
                        <button class="btn-ghost" style="width:100%;margin-top:8px;" onclick="window.open('${img.url}', '_blank')">📥 Download</button>
                    </div>
                </div>
            `).join('');
        }
    },

    saveToHub(idx) {
        const item = this.results.text[idx];
        if (!item) return;
        
        if (typeof DB !== 'undefined') {
            DB.content.add({
                title: item.title || 'Generated Content',
                contentType: 'text_article',
                caption: item.content,
                status: 'draft',
                generatedWithKB: true
            });
            showToast('Saved to Content Hub!', 'success');
            if (typeof App !== 'undefined') App.updateStats();
        }
    },

    selectAllResults(checkbox) {
        document.querySelectorAll('#text-results-body input[type="checkbox"]').forEach(cb => cb.checked = checkbox.checked);
    },

    copyAll() {
        const allContent = this.results.text.map(t => t.content).join('\n\n---\n\n');
        navigator.clipboard.writeText(allContent).then(() => showToast('All content copied!', 'success'));
    },

    exportResults() {
        const data = JSON.stringify(this.results, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        if (typeof saveAs !== 'undefined') {
            saveAs(blob, `raycorp-content-${Date.now()}.json`);
        } else {
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        }
        showToast('Exported!', 'success');
    },

    saveAllToHub() {
        this.results.text.forEach((item, idx) => this.saveToHub(idx));
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (typeof UltraStudio !== 'undefined') UltraStudio.init();
        }, 500);
    });
}
