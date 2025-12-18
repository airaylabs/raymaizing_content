/**
 * Omnichannel Content Distribution System
 * Defines content types and their platform distributions
 */

const OmnichannelConfig = {
    // Content Types with Platform Distribution
    contentTypes: {
        text_article: {
            id: 'text_article',
            name: 'Text Article',
            icon: '📝',
            description: 'Long-form SEO-optimized articles',
            color: '#8B9A7A',
            platforms: ['blog', 'medium', 'wordpress', 'linkedin_article', 'blogger'],
            specs: {
                minWords: 800,
                maxWords: 3000,
                format: 'markdown',
                seoOptimized: true,
                includeHeadings: true,
                includeMeta: true
            },
            aiPromptTemplate: `Create a comprehensive, SEO-optimized article about: {topic}

Requirements:
- Title with primary keyword
- Meta description (150-160 chars)
- Introduction with hook
- 3-5 main sections with H2 headings
- Bullet points for key takeaways
- Conclusion with CTA
- Word count: 1000-1500 words

Format: Markdown with proper headings`
        },

        text_thread: {
            id: 'text_thread',
            name: 'Text Thread',
            icon: '🐦',
            description: 'Viral thread format for Twitter/X and Threads',
            color: '#6A9AB0',
            platforms: ['twitter', 'threads'],
            specs: {
                tweetCount: '5-15',
                maxCharsPerTweet: 280,
                format: 'numbered',
                includeHook: true,
                includeCTA: true
            },
            aiPromptTemplate: `Create a viral Twitter/X thread about: {topic}

Requirements:
- Tweet 1: Powerful hook that stops scrolling
- Tweets 2-8: Key insights (one per tweet)
- Each tweet under 280 characters
- Use line breaks for readability
- Last tweet: Strong CTA + engagement question
- Include relevant emojis

Format:
1/ [Hook tweet]
2/ [Point 1]
...
[n]/ [CTA]`
        },

        video_long: {
            id: 'video_long',
            name: 'Video Long-Form',
            icon: '🎬',
            description: 'YouTube videos with full scripts',
            color: '#9A7A8B',
            platforms: ['youtube'],
            specs: {
                duration: '8-15 minutes',
                format: 'script',
                includeTimestamps: true,
                includeBRoll: true,
                includeThumbnailIdea: true
            },
            aiPromptTemplate: `Create a YouTube video script about: {topic}

Requirements:
- Attention-grabbing title (60 chars max)
- Thumbnail concept description
- Hook (first 30 seconds) - pattern interrupt
- Introduction with value promise
- Main content with timestamps:
  [0:00] Hook
  [0:30] Introduction
  [2:00] Point 1
  [5:00] Point 2
  [8:00] Point 3
  [11:00] Summary
  [12:00] CTA
- B-roll suggestions for each section
- End screen CTA
- Description with keywords
- 10 relevant tags

Duration target: 10-12 minutes`
        },

        video_short: {
            id: 'video_short',
            name: 'Video Short-Form',
            icon: '📱',
            description: 'Vertical videos for TikTok, Reels, Shorts',
            color: '#E07A9A',
            platforms: ['tiktok', 'youtube_shorts', 'instagram_reels', 'facebook_reels'],
            specs: {
                duration: '15-60 seconds',
                aspectRatio: '9:16',
                format: 'script',
                hookTime: '0-3 seconds',
                trendingAudio: true
            },
            aiPromptTemplate: `Create a viral short-form video script about: {topic}

Requirements:
- HOOK (0-3s): Pattern interrupt, question, or bold statement
- SETUP (3-10s): Context or problem
- CONTENT (10-45s): Main value/entertainment
- CTA (45-60s): Follow, like, comment prompt

Format:
[HOOK - 0:00-0:03]
Visual: [describe what's on screen]
Audio: "[exact words to say]"

[SETUP - 0:03-0:10]
Visual: [describe]
Audio: "[words]"

[CONTENT - 0:10-0:45]
Visual: [describe]
Audio: "[words]"

[CTA - 0:45-0:60]
Visual: [describe]
Audio: "[words]"

Trending audio suggestion: [suggest type of audio]
Caption: [engaging caption with hashtags]`
        },

        video_story: {
            id: 'video_story',
            name: 'Video Story',
            icon: '⏱️',
            description: '24-hour ephemeral content',
            color: '#E8C468',
            platforms: ['instagram_story', 'facebook_story'],
            specs: {
                duration: '15 seconds per slide',
                slides: '3-7',
                aspectRatio: '9:16',
                interactive: true
            },
            aiPromptTemplate: `Create a story sequence about: {topic}

Requirements:
- 5 story slides
- Each slide: 15 seconds max
- Include interactive elements (polls, questions, sliders)
- Build narrative arc across slides

Format:
SLIDE 1 - HOOK
Visual: [describe]
Text overlay: "[text]"
Sticker: [poll/question/none]

SLIDE 2 - CONTEXT
Visual: [describe]
Text overlay: "[text]"
Sticker: [type]

[Continue for all slides...]

SLIDE 5 - CTA
Visual: [describe]
Text overlay: "[text]"
Sticker: [link/swipe up suggestion]`
        },

        image_carousel: {
            id: 'image_carousel',
            name: 'Image Carousel',
            icon: '🎠',
            description: 'Swipeable educational content',
            color: '#C4A574',
            platforms: ['instagram_carousel', 'linkedin_carousel'],
            specs: {
                slides: '5-10',
                aspectRatio: '1:1 or 4:5',
                format: 'educational',
                saveWorthy: true
            },
            aiPromptTemplate: `Create a carousel post about: {topic}

Requirements:
- Slide 1: Hook/Title (stop the scroll)
- Slides 2-8: One key point per slide
- Last slide: Summary + CTA
- Design notes for each slide

Format:
SLIDE 1 - COVER
Headline: "[catchy title]"
Subheadline: "[value promise]"
Design: [color scheme, style notes]

SLIDE 2
Headline: "[point 1 title]"
Body: "[explanation - 2-3 lines max]"
Visual element: [icon/illustration suggestion]

[Continue for all slides...]

FINAL SLIDE - CTA
Headline: "[summary]"
CTA: "[action to take]"
Design: [include profile mention]

Caption: [engaging caption with hashtags]`
        },

        image_single: {
            id: 'image_single',
            name: 'Image Single',
            icon: '🖼️',
            description: 'Single image posts',
            color: '#7A9A8B',
            platforms: ['instagram_post', 'facebook_post', 'twitter_image', 'linkedin_post'],
            specs: {
                aspectRatio: '1:1 or 4:5',
                format: 'quote/infographic/photo',
                shareable: true
            },
            aiPromptTemplate: `Create a single image post about: {topic}

Requirements:
- Eye-catching visual concept
- Minimal text on image (if any)
- Strong caption with storytelling
- Hashtag strategy

Format:
IMAGE CONCEPT:
Style: [photo/illustration/quote graphic/infographic]
Main visual: [describe the image]
Text overlay: "[if any - keep minimal]"
Color palette: [suggest colors]

CAPTION:
Hook: [first line that stops scroll]
Story/Value: [2-3 paragraphs]
CTA: [engagement prompt]
Hashtags: [10-15 relevant hashtags]`
        }
    },

    // Platform Specifications
    platforms: {
        // Text Platforms
        blog: { name: 'Blog', icon: '📝', type: 'text', maxLength: null },
        medium: { name: 'Medium', icon: '📰', type: 'text', maxLength: null },
        wordpress: { name: 'WordPress', icon: '🌐', type: 'text', maxLength: null },
        blogger: { name: 'Blogger', icon: '📓', type: 'text', maxLength: null },
        linkedin_article: { name: 'LinkedIn Article', icon: '💼', type: 'text', maxLength: 125000 },
        
        // Thread Platforms
        twitter: { name: 'Twitter/X', icon: '🐦', type: 'thread', maxLength: 280 },
        threads: { name: 'Threads', icon: '🧵', type: 'thread', maxLength: 500 },
        
        // Video Long
        youtube: { name: 'YouTube', icon: '▶️', type: 'video', maxDuration: '12 hours' },
        
        // Video Short
        tiktok: { name: 'TikTok', icon: '🎵', type: 'video', maxDuration: '10 min', aspectRatio: '9:16' },
        youtube_shorts: { name: 'YT Shorts', icon: '📺', type: 'video', maxDuration: '60s', aspectRatio: '9:16' },
        instagram_reels: { name: 'IG Reels', icon: '🎬', type: 'video', maxDuration: '90s', aspectRatio: '9:16' },
        facebook_reels: { name: 'FB Reels', icon: '📹', type: 'video', maxDuration: '90s', aspectRatio: '9:16' },
        
        // Story
        instagram_story: { name: 'IG Story', icon: '📱', type: 'story', maxDuration: '60s', aspectRatio: '9:16' },
        facebook_story: { name: 'FB Story', icon: '📲', type: 'story', maxDuration: '20s', aspectRatio: '9:16' },
        
        // Image
        instagram_post: { name: 'IG Post', icon: '📷', type: 'image', aspectRatio: '1:1' },
        instagram_carousel: { name: 'IG Carousel', icon: '🎠', type: 'carousel', maxSlides: 10 },
        linkedin_carousel: { name: 'LI Carousel', icon: '📊', type: 'carousel', maxSlides: 20 },
        facebook_post: { name: 'FB Post', icon: '👍', type: 'image' },
        twitter_image: { name: 'X Image', icon: '🖼️', type: 'image' },
        linkedin_post: { name: 'LI Post', icon: '💼', type: 'image' }
    },

    // Get content type by ID
    getContentType(typeId) {
        return this.contentTypes[typeId] || null;
    },

    // Get platforms for content type
    getPlatformsForType(typeId) {
        const type = this.contentTypes[typeId];
        if (!type) return [];
        return type.platforms.map(p => ({
            id: p,
            ...this.platforms[p]
        }));
    },

    // Get all content types as array
    getAllContentTypes() {
        return Object.values(this.contentTypes);
    },

    // Generate AI prompt for content type
    generatePrompt(typeId, topic, context = '') {
        const type = this.contentTypes[typeId];
        if (!type) return '';
        
        let prompt = type.aiPromptTemplate.replace('{topic}', topic);
        
        if (context) {
            prompt = `BRAND CONTEXT:\n${context}\n\n${prompt}`;
        }
        
        return prompt;
    }
};

// Export for use
window.OmnichannelConfig = OmnichannelConfig;
