/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POLLINATIONS AI - Free AI Integration for Lumaverse
 * Text Generation, Image Generation, and more
 * ═══════════════════════════════════════════════════════════════════════════
 */

const PollinationsAI = {
    // API Endpoints
    endpoints: {
        text: 'https://text.pollinations.ai/',
        image: 'https://image.pollinations.ai/prompt/',
        imageModels: ['flux', 'turbo', 'flux-realism', 'flux-anime', 'flux-3d']
    },

    // Generate text with Pollinations AI
    async generateText(prompt, options = {}) {
        const {
            model = 'openai',
            systemPrompt = 'You are a helpful AI assistant for content creation.',
            temperature = 0.7,
            maxTokens = 2000
        } = options;

        try {
            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ];

            const response = await fetch(this.endpoints.text, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages,
                    model,
                    temperature,
                    max_tokens: maxTokens
                })
            });

            if (!response.ok) throw new Error('Text generation failed');
            
            const text = await response.text();
            return { success: true, text };
        } catch (error) {
            console.error('Pollinations Text Error:', error);
            return { success: false, error: error.message };
        }
    },

    // Generate image with Pollinations AI
    generateImageUrl(prompt, options = {}) {
        const {
            width = 1024,
            height = 1024,
            model = 'flux',
            seed = Math.floor(Math.random() * 999999),
            nologo = true,
            enhance = true
        } = options;

        const encodedPrompt = encodeURIComponent(prompt);
        const params = new URLSearchParams({
            width: width.toString(),
            height: height.toString(),
            model,
            seed: seed.toString(),
            nologo: nologo.toString(),
            enhance: enhance.toString()
        });

        return `${this.endpoints.image}${encodedPrompt}?${params.toString()}`;
    },

    // Generate multiple images
    generateMultipleImages(prompt, count = 4, options = {}) {
        const images = [];
        for (let i = 0; i < count; i++) {
            const seed = Math.floor(Math.random() * 999999);
            images.push({
                url: this.generateImageUrl(prompt, { ...options, seed }),
                seed
            });
        }
        return images;
    },

    // AI Content Generation Prompts
    contentPrompts: {
        article: (topic, tone, pillar) => `
Write a comprehensive article about: ${topic}

Requirements:
- Tone: ${tone}
- Content Pillar: ${pillar}
- Include an engaging headline
- Write a compelling introduction
- Include 3-5 main sections with subheadings
- Add practical tips or actionable advice
- Write a strong conclusion with call-to-action
- Suggest 5-10 relevant hashtags
- Keep it SEO-friendly

Write in Indonesian language.`,

        thread: (topic, tone, pillar) => `
Create a viral Twitter/X thread about: ${topic}

Requirements:
- Tone: ${tone}
- Content Pillar: ${pillar}
- Start with a powerful hook (Tweet 1)
- Include 5-8 value-packed tweets
- Each tweet should be under 280 characters
- End with a summary and CTA
- Include relevant hashtags

Format each tweet as:
🧵 1/X: [Hook tweet]
2/X: [Content]
...

Write in Indonesian language.`,

        shortVideo: (topic, tone, pillar) => `
Create a short-form video script (15-60 seconds) about: ${topic}

Requirements:
- Tone: ${tone}
- Content Pillar: ${pillar}
- Hook (first 3 seconds) - must grab attention
- Main content (body)
- Call-to-action
- Suggested visuals/B-roll
- Caption for posting
- Relevant hashtags

Format:
🎬 HOOK (0-3s): [Attention grabber]
📱 BODY (3-50s): [Main content with timestamps]
🎯 CTA (50-60s): [Call to action]
📝 CAPTION: [Post caption]
#️⃣ HASHTAGS: [Relevant hashtags]

Write in Indonesian language.`,

        carousel: (topic, tone, pillar) => `
Create an Instagram carousel post about: ${topic}

Requirements:
- Tone: ${tone}
- Content Pillar: ${pillar}
- Cover slide (hook/title)
- 5-8 content slides
- Each slide: headline + brief explanation
- CTA slide at the end
- Caption with hashtags

Format:
📱 SLIDE 1 (Cover): [Hook/Title]
📱 SLIDE 2: [Content]
...
📱 SLIDE X (CTA): [Call to action]
📝 CAPTION: [Full caption]
#️⃣ HASHTAGS: [Relevant hashtags]

Write in Indonesian language.`,

        story: (topic, tone, pillar) => `
Create an Instagram/TikTok Story sequence about: ${topic}

Requirements:
- Tone: ${tone}
- Content Pillar: ${pillar}
- 3-5 story slides
- Text overlays for each
- Sticker/poll suggestions
- Music mood recommendation

Format each story:
📱 STORY 1: [Content + text overlay]
🎵 Music: [Mood/genre]
🔘 Interactive: [Poll/quiz/sticker suggestion]

Write in Indonesian language.`,

        longVideo: (topic, tone, pillar) => `
Create a long-form video script (5-15 minutes) about: ${topic}

Requirements:
- Tone: ${tone}
- Content Pillar: ${pillar}
- Hook intro (first 30 seconds)
- Chapter breakdown with timestamps
- Key talking points for each section
- B-roll suggestions
- Outro with CTA
- Video description for YouTube
- Tags/keywords

Format:
🎬 INTRO (0:00-0:30): [Hook]
📚 CHAPTER 1 (0:30-3:00): [Title + talking points]
📚 CHAPTER 2 (3:00-6:00): [Title + talking points]
...
🎯 OUTRO: [CTA]
📝 DESCRIPTION: [YouTube description]
🏷️ TAGS: [Keywords]

Write in Indonesian language.`
    },

    // Generate content based on type
    async generateContent(topic, type, tone = 'professional', pillar = 'Education') {
        const promptGenerator = this.contentPrompts[type.replace('text_', '').replace('video_', '').replace('image_', '')];
        
        if (!promptGenerator) {
            return { success: false, error: 'Unknown content type' };
        }

        const prompt = promptGenerator(topic, tone, pillar);
        return await this.generateText(prompt, {
            systemPrompt: 'You are an expert content creator and social media strategist. Create engaging, viral-worthy content.',
            temperature: 0.8
        });
    },

    // AI Chat - Super Intelligent Assistant
    async chat(message, conversationHistory = []) {
        const workflowsList = typeof WORKFLOWS_DATABASE !== 'undefined' ? 
            WORKFLOWS_DATABASE.slice(0, 50).map(w => `${w.id}: ${w.name} (${w.category})`).join(', ') : '';
        
        const systemPrompt = `You are Lumaverse AI, an ultra-intelligent AI assistant combining the best of Claude, GPT-4, Gemini, and Perplexity. You are:

🧠 CAPABILITIES:
- Expert content strategist & creator
- Marketing & branding specialist  
- SEO & social media expert
- Creative writing master
- Data analyst & researcher
- Code & technical assistant
- Business consultant

🎯 YOUR ROLE:
1. RECOMMEND TOOLS: When user needs help, suggest relevant workflows from: ${workflowsList}
2. GENERATE CONTENT: Create articles, scripts, captions, hooks, threads instantly
3. ANALYZE & OPTIMIZE: Review content and suggest improvements
4. BRAINSTORM: Generate creative ideas, strategies, campaigns
5. RESEARCH: Provide insights on trends, competitors, markets
6. ASSIST: Help with any task - writing, planning, problem-solving

📋 RESPONSE STYLE:
- Be conversational but professional
- Use emojis sparingly for clarity
- Provide actionable, specific advice
- When recommending workflows, mention the workflow ID (e.g., WF-001)
- Format responses with clear structure
- Respond in the same language as the user (Indonesian/English)

🔥 SPECIAL ABILITIES:
- Can generate full content pieces on request
- Can create marketing strategies
- Can analyze and improve existing content
- Can recommend the perfect workflow for any task
- Can help with technical and creative challenges

Always be helpful, creative, and solution-oriented!`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: message }
        ];

        try {
            const response = await fetch(this.endpoints.text, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages, model: 'openai', temperature: 0.8, max_tokens: 2000 })
            });

            if (!response.ok) throw new Error('Chat failed');
            
            const text = await response.text();
            return { success: true, text };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Suggest topics based on industry
    async suggestTopics(industry = 'general', count = 5) {
        const prompt = `Generate ${count} viral content ideas for ${industry} industry. 
Each idea should be:
- Trending and relevant
- Engaging and shareable
- Suitable for social media

Format as numbered list with brief description.`;

        return await this.generateText(prompt, {
            systemPrompt: 'You are a trend analyst and content strategist.',
            temperature: 0.9
        });
    }
};

console.log('🤖 Pollinations AI loaded');
