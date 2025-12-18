/**
 * Google Opal Workflow Generator
 * Creates detailed prompts for Google Opal visual workflow builder
 * 
 * Google Opal Models:
 * - Gemini 2.5 Flash/Pro - Text generation
 * - Gemini 3 Pro - Latest text model
 * - Imagen 4 - Image generation
 * - Gemini 2.5 Flash Image - Fast image generation
 * - Gemini 3 Pro Image - Professional images
 * - Veo - Video generation
 * - Lyria 2 - Music generation
 * - AudioLM - Speech synthesis
 */

const OpalWorkflows = {
    // Base Opal URL
    baseUrl: 'https://opal.google/',

    // ==================== TEXT GENERATION WORKFLOWS ====================
    
    textArticle: {
        name: 'Text Article Generator',
        description: 'Generate SEO-optimized articles for Blog, Medium, LinkedIn',
        models: ['Gemini 2.5 Pro', 'Gemini 3 Pro'],
        opalPrompt: `Build an app that generates SEO-optimized articles for multiple platforms.

WORKFLOW STEPS:

STEP 1: User Input
- Add "User Input" component
- Create text input field: "topic" (label: "Article Topic")
- Create text input field: "keywords" (label: "Target Keywords, comma separated")
- Create dropdown: "tone" with options: Professional, Casual, Educational, Inspirational
- Create dropdown: "length" with options: Short (800 words), Medium (1500 words), Long (2500 words)
- Create text area: "brand_context" (label: "Brand/Company Context - optional")

STEP 2: Generate with Gemini 2.5 Pro
- Add "Generate" component
- Select model: Gemini 2.5 Pro
- Prompt template:
"""
You are an expert SEO content writer. Create a comprehensive article.

TOPIC: {{topic}}
TARGET KEYWORDS: {{keywords}}
TONE: {{tone}}
LENGTH: {{length}}
BRAND CONTEXT: {{brand_context}}

REQUIREMENTS:
1. SEO-optimized title with primary keyword (max 60 chars)
2. Meta description (150-160 chars)
3. Introduction with hook and keyword in first 100 words
4. 4-6 H2 sections with keywords naturally integrated
5. Bullet points for key takeaways
6. Internal linking suggestions [LINK: topic]
7. Conclusion with clear CTA
8. FAQ section (3-5 questions)

OUTPUT FORMAT:
---TITLE---
[SEO title]

---META---
[Meta description]

---ARTICLE---
[Full article in markdown]

---FAQ---
[FAQ section]

---KEYWORDS_USED---
[List of keywords and their frequency]
"""

STEP 3: Generate Variations
- Add another "Generate" component
- Select model: Gemini 2.5 Flash
- Prompt:
"""
Based on this article, create 3 alternative versions:

ORIGINAL: {{step2_output}}

Generate:
1. LINKEDIN VERSION - Professional tone, 1500 chars max, with engagement hooks
2. MEDIUM VERSION - Storytelling approach, personal anecdotes
3. BLOG SNIPPET - 300 word summary for homepage

Format each clearly with headers.
"""

STEP 4: Output
- Add "Output" component
- Display: Main Article, LinkedIn Version, Medium Version, Blog Snippet
- Add "Copy" buttons for each section
- Add "Download as Markdown" button`,

        outputFormat: {
            mainArticle: 'Full SEO article',
            linkedinVersion: 'LinkedIn-optimized',
            mediumVersion: 'Medium storytelling style',
            blogSnippet: 'Short summary'
        }
    },

    textThread: {
        name: 'Viral Thread Generator',
        description: 'Generate viral Twitter/X threads with multiple variations',
        models: ['Gemini 2.5 Flash', 'Gemini 3 Pro'],
        opalPrompt: `Build an app that generates viral Twitter/X threads.

WORKFLOW STEPS:

STEP 1: User Input
- Add "User Input" component
- Text input: "topic" (label: "Thread Topic")
- Dropdown: "thread_style" with options:
  * Educational (teach something)
  * Story (narrative arc)
  * Listicle (numbered tips)
  * Controversial (hot take)
  * Behind-the-scenes
- Number input: "tweet_count" (min: 5, max: 15, default: 10)
- Text area: "key_points" (label: "Key points to cover - one per line")
- Checkbox: "include_cta" (default: true)

STEP 2: Research & Hooks (Gemini 2.5 Pro)
- Add "Generate" component
- Model: Gemini 2.5 Pro
- Prompt:
"""
You are a viral content strategist. Analyze this topic and create hooks.

TOPIC: {{topic}}
STYLE: {{thread_style}}

Generate:
1. 5 different hook options (first tweet) - each must stop scrolling
2. Key statistics or facts to include
3. Emotional triggers to use
4. Potential objections to address
5. Best CTA options

Format:
---HOOKS---
1. [Hook 1 - Question style]
2. [Hook 2 - Bold statement]
3. [Hook 3 - Story opener]
4. [Hook 4 - Statistic]
5. [Hook 5 - Controversial]

---RESEARCH---
[Key facts and stats]

---EMOTIONAL_TRIGGERS---
[List of triggers]

---CTAS---
[5 CTA options]
"""

STEP 3: Generate Main Thread (Gemini 3 Pro)
- Add "Generate" component
- Model: Gemini 3 Pro
- Prompt:
"""
Create a viral Twitter thread using this research:

RESEARCH: {{step2_output}}
TOPIC: {{topic}}
STYLE: {{thread_style}}
TWEET COUNT: {{tweet_count}}
KEY POINTS: {{key_points}}
INCLUDE CTA: {{include_cta}}

RULES:
- Each tweet MUST be under 280 characters
- Tweet 1: Use the best hook from research
- Use line breaks for readability
- Include relevant emojis (not excessive)
- Build tension/curiosity throughout
- Last tweet: Strong CTA if enabled

FORMAT:
1/ [First tweet - HOOK]

2/ [Second tweet]

3/ [Third tweet]

... continue for all tweets

[FINAL]/ [CTA tweet]
"""

STEP 4: Generate 5 Alternative Versions
- Add "Generate" component
- Model: Gemini 2.5 Flash
- Prompt:
"""
Create 5 completely different versions of this thread:

ORIGINAL: {{step3_output}}
TOPIC: {{topic}}

VERSION 1: More controversial/edgy tone
VERSION 2: Data-heavy with statistics
VERSION 3: Personal story format
VERSION 4: Minimalist (fewer words per tweet)
VERSION 5: Maximum engagement (questions in each tweet)

Each version must be complete with all tweets.
"""

STEP 5: Output
- Display all 6 versions (original + 5 alternatives)
- Add "Copy Thread" button for each
- Add character count per tweet
- Add "Export to Thread format" button`,

        outputFormat: {
            mainThread: 'Primary thread',
            alternatives: '5 alternative versions',
            hooks: 'Hook options',
            ctas: 'CTA options'
        }
    },

    // ==================== IMAGE GENERATION WORKFLOWS ====================

    imageCarousel: {
        name: 'Carousel Image Generator',
        description: 'Generate 10 carousel slide images with Imagen 4',
        models: ['Gemini 2.5 Pro', 'Imagen 4', 'Gemini 3 Pro Image'],
        opalPrompt: `Build an app that generates complete carousel posts with images.

WORKFLOW STEPS:

STEP 1: User Input
- Add "User Input" component
- Text input: "topic" (label: "Carousel Topic")
- Dropdown: "slide_count" with options: 5, 7, 10
- Dropdown: "style" with options:
  * Minimalist Modern
  * Bold & Colorful
  * Professional Corporate
  * Aesthetic Soft
  * Dark Mode
- Color picker: "primary_color"
- Color picker: "secondary_color"
- Text input: "brand_name" (optional)
- Dropdown: "aspect_ratio": 1:1 (Instagram), 4:5 (Portrait)

STEP 2: Generate Slide Content (Gemini 2.5 Pro)
- Add "Generate" component
- Model: Gemini 2.5 Pro
- Prompt:
"""
Create carousel slide content for {{slide_count}} slides.

TOPIC: {{topic}}
STYLE: {{style}}
BRAND: {{brand_name}}

For each slide, provide:
1. HEADLINE (max 8 words)
2. SUBTEXT (max 15 words)
3. VISUAL DESCRIPTION (for image generation)
4. ICON/ELEMENT suggestion

FORMAT:
---SLIDE 1 (COVER)---
HEADLINE: [Attention-grabbing title]
SUBTEXT: [Value promise]
VISUAL: [Detailed image description]
ELEMENT: [Icon or graphic element]

---SLIDE 2---
... continue for all slides

---SLIDE [LAST] (CTA)---
HEADLINE: [Action prompt]
SUBTEXT: [What to do next]
VISUAL: [CTA visual description]
ELEMENT: [Arrow or action icon]
"""

STEP 3: Generate Images with Imagen 4
- Add "Generate" component FOR EACH SLIDE
- Model: Imagen 4
- For Slide 1:
"""
Create a social media carousel cover image.

STYLE: {{style}}
COLORS: Primary {{primary_color}}, Secondary {{secondary_color}}
ASPECT RATIO: {{aspect_ratio}}

VISUAL DESCRIPTION: {{slide1_visual}}

Requirements:
- Clean, modern design
- Space for text overlay at top/center
- Professional quality
- Consistent with brand colors
- No text in image (will be added as overlay)
"""

- Repeat for each slide with respective visual descriptions

STEP 4: Generate Alternative Image Styles
- Add "Generate" component
- Model: Gemini 3 Pro Image
- Generate 3 alternative versions of each slide:
  * Version A: Photo-realistic
  * Version B: Illustrated/Graphic
  * Version C: Abstract/Artistic

STEP 5: Generate Caption
- Add "Generate" component
- Model: Gemini 2.5 Flash
- Prompt:
"""
Create an engaging Instagram caption for this carousel:

TOPIC: {{topic}}
SLIDES: {{step2_output}}

Include:
- Hook (first line that shows in preview)
- Value summary
- Engagement question
- CTA (save, share, follow)
- 15-20 relevant hashtags

Format:
---CAPTION---
[Caption text]

---HASHTAGS---
[Hashtags]
"""

STEP 6: Output
- Display all slide images in carousel preview
- Show alternative versions for each slide
- Display caption with copy button
- Add "Download All Images" as ZIP
- Add "Download with Text Overlays" option`,

        outputFormat: {
            slides: '5-10 slide images',
            alternatives: '3 versions per slide',
            caption: 'Optimized caption',
            hashtags: 'Relevant hashtags'
        }
    },

    imageSingle: {
        name: 'Single Image Generator (10 Variations)',
        description: 'Generate 10 alternative images for single posts',
        models: ['Imagen 4', 'Gemini 2.5 Flash Image', 'Gemini 3 Pro Image'],
        opalPrompt: `Build an app that generates 10 image variations for social media posts.

WORKFLOW STEPS:

STEP 1: User Input
- Add "User Input" component
- Text area: "concept" (label: "Describe your image concept")
- Dropdown: "platform" with options: Instagram, Facebook, LinkedIn, Twitter
- Dropdown: "image_type":
  * Quote Graphic
  * Product Shot
  * Lifestyle Photo
  * Infographic
  * Behind-the-scenes
  * Announcement
- Dropdown: "mood":
  * Professional
  * Playful
  * Inspirational
  * Minimalist
  * Bold
  * Warm & Cozy
- Text input: "text_overlay" (optional - text to appear on image)
- Color picker: "brand_color"

STEP 2: Enhance Prompt (Gemini 2.5 Flash)
- Add "Generate" component
- Model: Gemini 2.5 Flash
- Prompt:
"""
You are an expert at creating image generation prompts.

USER CONCEPT: {{concept}}
PLATFORM: {{platform}}
TYPE: {{image_type}}
MOOD: {{mood}}
BRAND COLOR: {{brand_color}}

Create 10 detailed, unique image prompts. Each should be:
- Highly detailed (50-100 words)
- Specify lighting, composition, style
- Include color palette
- Mention camera angle/perspective
- Different enough to provide real variety

FORMAT:
---PROMPT 1: [Style Name]---
[Detailed prompt]

---PROMPT 2: [Style Name]---
[Detailed prompt]

... continue for all 10
"""

STEP 3: Generate Images with Imagen 4 (Primary)
- Add 5 "Generate" components in parallel
- Model: Imagen 4
- Use prompts 1-5 from step 2
- Settings: High quality, {{platform}} dimensions

STEP 4: Generate Images with Gemini 3 Pro Image (Alternative)
- Add 5 "Generate" components in parallel
- Model: Gemini 3 Pro Image
- Use prompts 6-10 from step 2
- Settings: Professional quality

STEP 5: Generate Captions for Each Image
- Add "Generate" component
- Model: Gemini 2.5 Flash
- Prompt:
"""
Create unique captions for each of these 10 images:

IMAGE CONCEPTS:
{{step2_output}}

For each image, create:
- Short caption (under 150 chars)
- Long caption (300-500 chars)
- 10 relevant hashtags

Format clearly for each image.
"""

STEP 6: Output
- Display all 10 images in grid
- Allow selection/favoriting
- Show captions for each
- Add "Download Selected" button
- Add "Download All" as ZIP
- Add "Regenerate Single" button for each`,

        outputFormat: {
            images: '10 unique variations',
            captions: 'Short and long for each',
            hashtags: 'Platform-specific'
        }
    },

    // ==================== VIDEO GENERATION WORKFLOWS ====================

    videoShort: {
        name: 'Short-Form Video Generator',
        description: 'Generate video scripts and 5-10 video variations with Veo',
        models: ['Gemini 2.5 Pro', 'Veo', 'Lyria 2'],
        opalPrompt: `Build an app that generates short-form videos for TikTok/Reels/Shorts.

WORKFLOW STEPS:

STEP 1: User Input
- Add "User Input" component
- Text area: "concept" (label: "Video Concept/Idea")
- Dropdown: "duration": 15s, 30s, 60s
- Dropdown: "style":
  * Talking Head
  * B-Roll Montage
  * Text on Screen
  * Product Demo
  * Tutorial/How-to
  * Story/Narrative
- Dropdown: "energy": High Energy, Medium, Calm/ASMR
- Text input: "key_message" (label: "Main message to convey")
- Checkbox: "include_music" (default: true)
- Checkbox: "include_captions" (default: true)

STEP 2: Generate Script (Gemini 2.5 Pro)
- Add "Generate" component
- Model: Gemini 2.5 Pro
- Prompt:
"""
Create a viral short-form video script.

CONCEPT: {{concept}}
DURATION: {{duration}}
STYLE: {{style}}
ENERGY: {{energy}}
KEY MESSAGE: {{key_message}}

SCRIPT FORMAT:
---HOOK (0-3 seconds)---
VISUAL: [What's on screen]
AUDIO: "[Exact words to say]"
TEXT OVERLAY: [If any]
TRANSITION: [Cut type]

---SETUP (3-10 seconds)---
VISUAL: [Description]
AUDIO: "[Words]"
TEXT OVERLAY: [If any]
TRANSITION: [Type]

---MAIN CONTENT (10-{{duration-10}} seconds)---
[Break into 3-5 scenes]

SCENE 1:
VISUAL: [Description]
AUDIO: "[Words]"
TEXT OVERLAY: [If any]
B-ROLL: [Suggestion]

... continue for all scenes

---CTA (Last 5 seconds)---
VISUAL: [Description]
AUDIO: "[Words]"
TEXT OVERLAY: [CTA text]
END CARD: [What to show]

---MUSIC SUGGESTION---
Genre: [Type]
Energy: [Level]
Examples: [Similar songs/sounds]

---CAPTION---
[Video caption with hashtags]
"""

STEP 3: Generate 5 Script Variations
- Add "Generate" component
- Model: Gemini 2.5 Flash
- Prompt:
"""
Create 5 alternative versions of this video script:

ORIGINAL: {{step2_output}}

VERSION 1: Different hook (question-based)
VERSION 2: Different hook (shocking statement)
VERSION 3: Faster pacing (more cuts)
VERSION 4: Story-driven approach
VERSION 5: Trend-based format (duet style, green screen, etc.)

Each must be complete with all sections.
"""

STEP 4: Generate Video Clips with Veo
- Add "Generate" component
- Model: Veo
- For each scene in the script:
"""
Generate a {{duration}} second video clip.

SCENE DESCRIPTION: {{scene_visual}}
STYLE: {{style}}
ENERGY: {{energy}}
ASPECT RATIO: 9:16 (vertical)

Requirements:
- Smooth motion
- Professional quality
- Match the energy level
- Suitable for social media
"""

STEP 5: Generate Background Music with Lyria 2
- Add "Generate" component (if include_music)
- Model: Lyria 2
- Prompt:
"""
Create background music for a short-form video.

DURATION: {{duration}}
ENERGY: {{energy}}
GENRE: {{music_genre from step2}}
MOOD: Match the video style

Requirements:
- Catchy and engaging
- Build-up to hook moment
- Suitable for social media (no copyright issues)
- Include beat drops at key moments
"""

STEP 6: Generate Voiceover with AudioLM
- Add "Generate" component
- Model: AudioLM
- Use the AUDIO sections from script
- Settings: Natural voice, match energy level

STEP 7: Output
- Display all 5 video variations
- Show script for each
- Audio preview (music + voiceover)
- Add "Download Video" for each
- Add "Download All Assets" (videos, audio, scripts)
- Add "Export to CapCut/Premiere format"`,

        outputFormat: {
            videos: '5-10 video variations',
            scripts: 'Detailed scripts for each',
            music: 'Background music options',
            voiceover: 'AI voiceover',
            captions: 'Auto-generated captions'
        }
    },

    videoLong: {
        name: 'Long-Form Video Generator',
        description: 'Generate YouTube video scripts with multi-angle shots',
        models: ['Gemini 3 Pro', 'Veo', 'Imagen 4', 'Lyria 2'],
        opalPrompt: `Build an app that generates complete YouTube video packages.

WORKFLOW STEPS:

STEP 1: User Input
- Add "User Input" component
- Text area: "topic" (label: "Video Topic")
- Dropdown: "video_type":
  * Educational/Tutorial
  * Vlog
  * Review
  * Documentary Style
  * Interview Format
  * List Video (Top 10, etc.)
- Number input: "duration_minutes" (min: 5, max: 30, default: 10)
- Text area: "key_points" (label: "Main points to cover")
- Text input: "target_audience"
- Checkbox: "include_intro_animation"
- Checkbox: "include_end_screen"

STEP 2: Research & Outline (Gemini 3 Pro)
- Add "Generate" component
- Model: Gemini 3 Pro
- Prompt:
"""
Create a comprehensive YouTube video outline.

TOPIC: {{topic}}
TYPE: {{video_type}}
DURATION: {{duration_minutes}} minutes
KEY POINTS: {{key_points}}
AUDIENCE: {{target_audience}}

Generate:
1. SEO-optimized title (5 options)
2. Thumbnail concepts (5 ideas)
3. Detailed outline with timestamps
4. Hook options (first 30 seconds)
5. Key talking points per section
6. B-roll suggestions
7. Graphics/animations needed
8. Music mood per section
9. End screen CTA

FORMAT:
---TITLES---
1. [Title option 1]
... 5 titles

---THUMBNAIL_CONCEPTS---
1. [Concept 1 with visual description]
... 5 concepts

---OUTLINE---
[0:00] HOOK
- Option A: [Hook script]
- Option B: [Hook script]
- Visual: [What to show]

[0:30] INTRO
- Script: [Intro script]
- Animation: [If enabled]

[1:00] SECTION 1: [Title]
- Key points: [List]
- Script: [Full script]
- B-roll: [Suggestions]
- Graphics: [Needed graphics]

... continue for all sections

[{{duration-1}}:00] CONCLUSION
- Summary points
- CTA script

[{{duration}}:00] END SCREEN
- Subscribe reminder
- Video suggestions

---DESCRIPTION---
[Full YouTube description with timestamps, links, keywords]

---TAGS---
[30 relevant tags]
"""

STEP 3: Generate Full Script (Gemini 3 Pro)
- Add "Generate" component
- Model: Gemini 3 Pro
- Prompt:
"""
Write the complete video script based on this outline:

OUTLINE: {{step2_output}}

Write in conversational, engaging style.
Include:
- Exact words to say
- [PAUSE] markers
- [EMPHASIS] markers
- [SHOW GRAPHIC: description] markers
- [B-ROLL: description] markers
- [TRANSITION] markers

Make it sound natural, not scripted.
"""

STEP 4: Generate Thumbnail Images (Imagen 4)
- Add 5 "Generate" components
- Model: Imagen 4
- Use thumbnail concepts from step 2
- Settings: 1280x720, high contrast, YouTube optimized

STEP 5: Generate B-Roll Clips (Veo)
- Add "Generate" components for each B-roll suggestion
- Model: Veo
- Generate 5-10 second clips for each B-roll moment
- Multiple angles where applicable

STEP 6: Generate Background Music (Lyria 2)
- Add "Generate" component
- Model: Lyria 2
- Create music that matches the video mood
- Include variations for different sections

STEP 7: Output
- Complete script with timestamps
- 5 thumbnail options
- All B-roll clips organized by section
- Background music tracks
- YouTube description ready to paste
- Tags list
- Add "Download Complete Package" button`,

        outputFormat: {
            script: 'Full timestamped script',
            thumbnails: '5 thumbnail options',
            broll: 'B-roll clips per section',
            music: 'Section-specific music',
            description: 'YouTube description',
            tags: 'SEO tags'
        }
    },

    videoStory: {
        name: 'Story Video Generator',
        description: 'Generate Instagram/Facebook story sequences',
        models: ['Gemini 2.5 Flash', 'Veo', 'Imagen 4'],
        opalPrompt: `Build an app that generates story video sequences.

WORKFLOW STEPS:

STEP 1: User Input
- Add "User Input" component
- Text input: "story_topic"
- Number input: "story_count" (min: 3, max: 10, default: 5)
- Dropdown: "story_type":
  * Day in the Life
  * Product Showcase
  * Behind the Scenes
  * Q&A Response
  * Announcement
  * Tutorial Steps
- Checkbox: "include_polls"
- Checkbox: "include_questions"
- Checkbox: "include_countdown"

STEP 2: Generate Story Sequence (Gemini 2.5 Flash)
- Add "Generate" component
- Model: Gemini 2.5 Flash
- Prompt:
"""
Create a {{story_count}}-part story sequence.

TOPIC: {{story_topic}}
TYPE: {{story_type}}
INTERACTIVE: Polls={{include_polls}}, Questions={{include_questions}}, Countdown={{include_countdown}}

For each story (15 seconds max):
---STORY 1---
TYPE: Video/Image/Text
VISUAL: [Description]
TEXT_OVERLAY: [Text on screen]
STICKER: [Poll/Question/Countdown/None]
STICKER_CONTENT: [If applicable]
MUSIC: [Suggestion]
TRANSITION_TO_NEXT: [Swipe hint or continuation]

... continue for all stories

Build narrative arc: Hook → Build → Peak → Resolution → CTA
"""

STEP 3: Generate Story Videos (Veo)
- For each video story:
- Model: Veo
- 15 second vertical video (9:16)
- Match the visual description

STEP 4: Generate Story Images (Imagen 4)
- For each image story:
- Model: Imagen 4
- Vertical format (1080x1920)
- Space for text overlays and stickers

STEP 5: Output
- All story assets in sequence
- Preview as story flow
- Interactive element suggestions
- Add "Download Story Pack" button`,

        outputFormat: {
            stories: '3-10 story slides',
            videos: 'Video stories',
            images: 'Image stories',
            stickers: 'Interactive elements'
        }
    }
};

// Function to generate Opal workflow URL with pre-filled prompt
OpalWorkflows.getOpalUrl = function(workflowType) {
    const workflow = this[workflowType];
    if (!workflow) return this.baseUrl;
    
    // Opal uses URL parameters for pre-filling
    const encodedPrompt = encodeURIComponent(workflow.opalPrompt);
    return `${this.baseUrl}?prompt=${encodedPrompt}`;
};

// Function to get workflow prompt for copy-paste
OpalWorkflows.getWorkflowPrompt = function(workflowType, userInputs = {}) {
    const workflow = this[workflowType];
    if (!workflow) return '';
    
    let prompt = workflow.opalPrompt;
    
    // Replace placeholders with user inputs
    Object.keys(userInputs).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        prompt = prompt.replace(regex, userInputs[key]);
    });
    
    return prompt;
};

// Export
window.OpalWorkflows = OpalWorkflows;
