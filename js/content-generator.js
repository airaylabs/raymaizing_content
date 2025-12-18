/**
 * Content Generator Module
 * Omnichannel content generation with AI
 */

const ContentGenerator = {
    // Generate content based on type
    async generateContent(topic, options = {}) {
        const context = DB.knowledgeBase.getContextString();
        const contentType = OmnichannelConfig.getContentType(options.contentType || 'video_short');
        
        const prompt = OmnichannelConfig.generatePrompt(options.contentType, topic, context);
        
        const response = await PollinationsAI.generateText(prompt);
        
        return {
            raw: response,
            hook: this.extractHook(response),
            caption: response,
            cta: this.extractCTA(response),
            hashtags: this.extractHashtags(response)
        };
    },
    
    // Generate monthly content plan
    async generateMonthlyPlan(year, month) {
        const project = DB.projects.getActive();
        if (!project) return [];
        
        const pillars = DB.knowledgeBase.getPillars();
        if (pillars.length === 0) return [];
        
        const context = DB.knowledgeBase.getContextString();
        const contentTypes = OmnichannelConfig.getAllContentTypes();
        
        // Get posting days (default: Mon, Wed, Fri)
        const postingDays = [1, 3, 5]; // 0=Sun, 1=Mon, etc.
        const postsPerDay = 2;
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const posts = [];
        
        // Generate content ideas
        const prompt = `Generate ${pillars.length * 4} content ideas for a ${project.niche} brand.

Brand Context:
${context}

Content Pillars: ${pillars.join(', ')}

For each pillar, generate 4 unique content ideas.
Format each idea as:
PILLAR: [pillar name]
TITLE: [catchy title]
TYPE: [one of: video_short, image_carousel, text_thread, image_single]
HOOK: [attention-grabbing first line]

Generate diverse content types across all pillars.`;

        try {
            const response = await PollinationsAI.generateText(prompt);
            const ideas = this.parseContentIdeas(response, pillars);
            
            // Distribute ideas across the month
            let ideaIndex = 0;
            for (let day = 1; day <= daysInMonth && ideaIndex < ideas.length; day++) {
                const date = new Date(year, month, day);
                const dayOfWeek = date.getDay();
                
                if (postingDays.includes(dayOfWeek)) {
                    for (let i = 0; i < postsPerDay && ideaIndex < ideas.length; i++) {
                        const idea = ideas[ideaIndex];
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        
                        posts.push({
                            title: idea.title,
                            contentType: idea.type,
                            platforms: OmnichannelConfig.getContentType(idea.type)?.platforms || [],
                            pillar: idea.pillar,
                            caption: idea.hook,
                            status: 'idea',
                            scheduledDate: dateStr
                        });
                        
                        ideaIndex++;
                    }
                }
            }
            
            return posts;
        } catch (error) {
            console.error('Monthly plan generation error:', error);
            return [];
        }
    },
    
    // Parse content ideas from AI response
    parseContentIdeas(response, pillars) {
        const ideas = [];
        const lines = response.split('\n');
        
        let currentIdea = {};
        
        for (const line of lines) {
            if (line.startsWith('PILLAR:')) {
                if (currentIdea.title) ideas.push(currentIdea);
                currentIdea = { pillar: line.replace('PILLAR:', '').trim() };
            } else if (line.startsWith('TITLE:')) {
                currentIdea.title = line.replace('TITLE:', '').trim();
            } else if (line.startsWith('TYPE:')) {
                const type = line.replace('TYPE:', '').trim().toLowerCase().replace(/[^a-z_]/g, '');
                currentIdea.type = ['video_short', 'image_carousel', 'text_thread', 'image_single', 'text_article', 'video_long', 'video_story'].includes(type) ? type : 'video_short';
            } else if (line.startsWith('HOOK:')) {
                currentIdea.hook = line.replace('HOOK:', '').trim();
            }
        }
        
        if (currentIdea.title) ideas.push(currentIdea);
        
        // Fill in missing pillars
        return ideas.map(idea => ({
            ...idea,
            pillar: idea.pillar || pillars[Math.floor(Math.random() * pillars.length)],
            type: idea.type || 'video_short',
            hook: idea.hook || idea.title
        }));
    },
    
    // Extract hook from content
    extractHook(text) {
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length > 0) {
            // Look for hook markers
            for (const line of lines) {
                if (line.toLowerCase().includes('hook') || line.startsWith('[HOOK')) {
                    return line.replace(/\[?HOOK[:\]]/gi, '').trim();
                }
            }
            return lines[0].substring(0, 150);
        }
        return '';
    },
    
    // Extract CTA from content
    extractCTA(text) {
        const ctaPatterns = [
            /CTA[:\s]+(.+)/i,
            /call to action[:\s]+(.+)/i,
            /follow|subscribe|like|comment|share|click|swipe/i
        ];
        
        for (const pattern of ctaPatterns) {
            const match = text.match(pattern);
            if (match) return match[1] || match[0];
        }
        return '';
    },
    
    // Extract hashtags from content
    extractHashtags(text) {
        const matches = text.match(/#\w+/g);
        return matches ? [...new Set(matches)].slice(0, 15) : [];
    },
    
    // Generate image prompt
    async generateImagePrompt(topic, contentType) {
        const type = OmnichannelConfig.getContentType(contentType);
        const prompt = `Generate a detailed image prompt for a ${type?.name || 'social media'} post about: ${topic}

The image should be:
- Professional and modern
- Suitable for ${type?.platforms?.join(', ') || 'social media'}
- Eye-catching and scroll-stopping
- Clean composition

Provide only the image generation prompt, no explanations.`;

        return await PollinationsAI.generateText(prompt);
    }
};

// Export
window.ContentGenerator = ContentGenerator;
