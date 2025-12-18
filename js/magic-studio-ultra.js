// ==================== MAGIC STUDIO ULTRA - 100+ AI WORKFLOWS ====================
// The Most Comprehensive Content Creation Suite for Creators & Marketers
// Version 2.0 - Ultimate Edition

const MagicStudioUltra = {
    currentCategory: 'all',
    currentWorkflow: null,
    generatedPrompt: '',
    loadedContent: null,
    favorites: JSON.parse(localStorage.getItem('magicStudioFavorites') || '[]'),
    recentlyUsed: JSON.parse(localStorage.getItem('magicStudioRecent') || '[]'),
    searchQuery: '',

    // ==================== 100+ WORKFLOWS ====================
    workflows: {
        
        // ═══════════════════════════════════════════════════════════════
        // 📝 TEXT GENERATION (20 Workflows)
        // ═══════════════════════════════════════════════════════════════
        
        'seo-article-pro': {
            name: 'SEO Article Generator Pro',
            icon: '📝',
            category: 'text',
            description: 'Generate 10 SEO-optimized articles with E-E-A-T compliance and schema markup',
            output: '10 articles + 7 platform versions',
            models: 'Gemini 2.5 Pro + Deep Research',
            difficulty: 'advanced',
            estimatedTime: '15-20 min',
            popular: true,
            fields: [
                { id: 'topic', type: 'text', label: 'Article Topic', placeholder: 'e.g., Best AI Tools 2024', required: true },
                { id: 'keywords', type: 'textarea', label: 'Target Keywords', placeholder: 'One keyword per line', required: true },
                { id: 'tone', type: 'select', label: 'Tone', options: ['Professional', 'Casual', 'Educational', 'Inspirational', 'Authoritative'], required: true },
                { id: 'length', type: 'select', label: 'Length', options: ['Short (800)', 'Medium (1500)', 'Long (2500)', 'Comprehensive (4000+)'], required: true },
                { id: 'language', type: 'select', label: 'Language', options: ['Indonesian', 'English', 'Both'], required: true }
            ]
        },

        'viral-thread': {
            name: 'Viral Thread Master',
            icon: '🐦',
            category: 'text',
            description: 'Generate 15 viral Twitter/X threads with psychological hooks',
            output: '15 threads + reply templates',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '8-12 min',
            popular: true,
            fields: [
                { id: 'topic', type: 'text', label: 'Thread Topic', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Educational', 'Story', 'Listicle', 'Controversial', 'Case Study', 'Myth-Busting'], required: true },
                { id: 'tweet_count', type: 'select', label: 'Tweets/Thread', options: ['5', '7', '10', '15', '20'], required: true },
                { id: 'hook_style', type: 'select', label: 'Hook Style', options: ['Question', 'Bold Statement', 'Statistics', 'Story Opening'], required: true }
            ]
        },

        'script-writer': {
            name: 'Script Writer Pro',
            icon: '📜',
            category: 'text',
            description: 'Professional scripts for video/audio with timing and B-roll suggestions',
            output: '5 script variations',
            models: 'Gemini 3 Pro',
            difficulty: 'advanced',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'type', type: 'select', label: 'Script Type', options: ['YouTube', 'TikTok/Reels', 'Podcast', 'Voiceover', 'Documentary', 'Commercial', 'Tutorial'], required: true },
                { id: 'topic', type: 'text', label: 'Topic', required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['15 sec', '30 sec', '60 sec', '3 min', '5 min', '10+ min'], required: true },
                { id: 'style', type: 'select', label: 'Delivery', options: ['Energetic', 'Calm', 'Professional', 'Humorous', 'Dramatic'], required: true }
            ]
        },

        'hook-generator': {
            name: 'Hook Generator Ultra',
            icon: '🎣',
            category: 'text',
            description: 'Generate 50 viral hooks using AIDA, PAS, 4U frameworks',
            output: '50 hooks + A/B variants',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '3-5 min',
            popular: true,
            fields: [
                { id: 'topic', type: 'text', label: 'Content Topic', required: true },
                { id: 'type', type: 'select', label: 'Hook Type', options: ['Video Hook', 'Caption', 'Email Subject', 'Headline', 'Ad Copy', 'Thumbnail Text'], required: true },
                { id: 'emotion', type: 'select', label: 'Target Emotion', options: ['Curiosity', 'Fear', 'Excitement', 'Urgency', 'FOMO', 'Desire'], required: true },
                { id: 'framework', type: 'select', label: 'Framework', options: ['AIDA', 'PAS', '4U', 'Before-After-Bridge', 'All'], required: true }
            ]
        },

        'caption-generator': {
            name: 'Caption Generator Pro',
            icon: '💬',
            category: 'text',
            description: 'Generate 30 engaging captions for all social platforms',
            output: '30 captions + hashtags',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '3-5 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Post Topic', required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'Twitter', 'All'], required: true },
                { id: 'tone', type: 'select', label: 'Tone', options: ['Professional', 'Casual', 'Funny', 'Inspirational', 'Educational'], required: true },
                { id: 'length', type: 'select', label: 'Length', options: ['Short', 'Medium', 'Long (storytelling)'], required: true }
            ]
        },

        'blog-post': {
            name: 'Blog Post Generator',
            icon: '📰',
            category: 'text',
            description: 'Complete blog posts with meta descriptions and internal linking',
            output: '5 blog posts + SEO meta',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Blog Topic', required: true },
                { id: 'niche', type: 'text', label: 'Blog Niche', required: true },
                { id: 'word_count', type: 'select', label: 'Word Count', options: ['500-800', '1000-1500', '2000-2500', '3000+'], required: true },
                { id: 'format', type: 'select', label: 'Format', options: ['How-To', 'Listicle', 'Review', 'Comparison', 'Case Study'], required: true }
            ]
        },

        'newsletter': {
            name: 'Newsletter Writer',
            icon: '📧',
            category: 'text',
            description: 'Engaging newsletter content with subject lines and preview text',
            output: '5 newsletters + 20 subjects',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '8-12 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Newsletter Topic', required: true },
                { id: 'type', type: 'select', label: 'Type', options: ['Weekly Digest', 'Product Update', 'Educational', 'Promotional', 'Personal'], required: true },
                { id: 'audience', type: 'select', label: 'Audience', options: ['New Subscribers', 'Engaged Users', 'Inactive', 'VIP', 'All'], required: true }
            ]
        },

        'product-description': {
            name: 'Product Description Writer',
            icon: '🏷️',
            category: 'text',
            description: 'Compelling e-commerce product descriptions with SEO',
            output: '10 descriptions + bullets',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'product_name', type: 'text', label: 'Product Name', required: true },
                { id: 'category', type: 'select', label: 'Category', options: ['Fashion', 'Electronics', 'Beauty', 'Home', 'Food', 'Health', 'Sports'], required: true },
                { id: 'features', type: 'textarea', label: 'Key Features', required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Shopify', 'Amazon', 'Tokopedia', 'Shopee', 'General'], required: true }
            ]
        },

        'copywriting': {
            name: 'Copywriting Formula Generator',
            icon: '✍️',
            category: 'text',
            description: 'Copy using AIDA, PAS, FAB, 4Ps formulas',
            output: '20 copy variations',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'target_audience', type: 'text', label: 'Target Audience', required: true },
                { id: 'formula', type: 'select', label: 'Formula', options: ['AIDA', 'PAS', 'FAB', '4Ps', 'Before-After-Bridge', 'All'], required: true },
                { id: 'use_case', type: 'select', label: 'Use Case', options: ['Landing Page', 'Ad Copy', 'Email', 'Social Post', 'Sales Page'], required: true }
            ]
        },

        'story-generator': {
            name: 'Story Generator',
            icon: '📖',
            category: 'text',
            description: 'Brand stories, customer success stories, and narratives',
            output: '5 stories + variations',
            models: 'Gemini 3 Pro',
            difficulty: 'intermediate',
            estimatedTime: '8-12 min',
            fields: [
                { id: 'story_type', type: 'select', label: 'Story Type', options: ['Brand Origin', 'Customer Success', 'Behind-the-Scenes', 'Transformation', 'Journey'], required: true },
                { id: 'protagonist', type: 'text', label: 'Main Character', required: true },
                { id: 'conflict', type: 'text', label: 'Challenge/Problem', required: true },
                { id: 'tone', type: 'select', label: 'Tone', options: ['Inspirational', 'Emotional', 'Humorous', 'Professional', 'Dramatic'], required: true }
            ]
        },

        'linkedin-content': {
            name: 'LinkedIn Content Creator',
            icon: '💼',
            category: 'text',
            description: 'Professional LinkedIn posts and articles',
            output: '20 posts + 5 articles',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '8-12 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Topic/Industry', required: true },
                { id: 'content_type', type: 'select', label: 'Type', options: ['Thought Leadership', 'Industry Insights', 'Personal Story', 'Tips', 'Announcement'], required: true },
                { id: 'goal', type: 'select', label: 'Goal', options: ['Build Authority', 'Generate Leads', 'Network', 'Recruit', 'Brand Awareness'], required: true }
            ]
        },

        'youtube-seo': {
            name: 'YouTube SEO Optimizer',
            icon: '🎬',
            category: 'text',
            description: 'Optimized titles, descriptions, tags, and timestamps',
            output: '10 titles + full SEO package',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'video_topic', type: 'text', label: 'Video Topic', required: true },
                { id: 'niche', type: 'text', label: 'Channel Niche', required: true },
                { id: 'video_length', type: 'select', label: 'Video Length', options: ['Short (<5 min)', 'Medium (5-15)', 'Long (15-30)', 'Very Long (30+)'], required: true },
                { id: 'style', type: 'select', label: 'Title Style', options: ['How-To', 'Listicle', 'Question', 'Shocking', 'Tutorial'], required: true }
            ]
        },

        'press-release': {
            name: 'Press Release Generator',
            icon: '📰',
            category: 'text',
            description: 'Professional press releases with AP style formatting',
            output: '3 press releases + media kit',
            models: 'Gemini 2.5 Pro',
            difficulty: 'advanced',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'announcement', type: 'text', label: 'Announcement', required: true },
                { id: 'company', type: 'text', label: 'Company Name', required: true },
                { id: 'type', type: 'select', label: 'Type', options: ['Product Launch', 'Company News', 'Event', 'Partnership', 'Award'], required: true }
            ]
        },

        'faq-generator': {
            name: 'FAQ Generator',
            icon: '❓',
            category: 'text',
            description: 'Comprehensive FAQ sections with SEO-optimized answers',
            output: '30 FAQs + schema',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Product/Service', required: true },
                { id: 'audience', type: 'text', label: 'Target Audience', required: true },
                { id: 'categories', type: 'select', label: 'Categories', options: ['General', 'Pricing', 'Technical', 'Support', 'All'], required: true }
            ]
        },

        'testimonial': {
            name: 'Testimonial Generator',
            icon: '⭐',
            category: 'text',
            description: 'Realistic testimonial templates and review responses',
            output: '20 testimonials + responses',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '3-5 min',
            fields: [
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'industry', type: 'text', label: 'Industry', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Short Quote', 'Detailed Review', 'Case Study', 'Video Script'], required: true }
            ]
        },

        'quiz-poll': {
            name: 'Quiz & Poll Generator',
            icon: '🎯',
            category: 'text',
            description: 'Engaging quizzes, polls, and interactive content',
            output: '10 quizzes + 20 polls',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Quiz Topic', required: true },
                { id: 'type', type: 'select', label: 'Type', options: ['Personality Quiz', 'Knowledge Test', 'Product Finder', 'Assessment', 'Fun Quiz'], required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Instagram Stories', 'Twitter', 'Website', 'Email', 'All'], required: true }
            ]
        },

        'ebook-outline': {
            name: 'eBook Outline Generator',
            icon: '📚',
            category: 'text',
            description: 'Complete eBook outlines with chapter summaries',
            output: 'Full outline + briefs',
            models: 'Gemini 2.5 Pro',
            difficulty: 'advanced',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'title', type: 'text', label: 'eBook Title', required: true },
                { id: 'topic', type: 'text', label: 'Main Topic', required: true },
                { id: 'chapters', type: 'select', label: 'Chapters', options: ['5', '7', '10', '12', '15'], required: true },
                { id: 'goal', type: 'select', label: 'Goal', options: ['Lead Magnet', 'Authority', 'Course Companion', 'Product Guide'], required: true }
            ]
        },

        'webinar-content': {
            name: 'Webinar Content Creator',
            icon: '🎥',
            category: 'text',
            description: 'Complete webinar: script, slides, Q&A, follow-up emails',
            output: 'Full webinar package',
            models: 'Gemini 2.5 Pro',
            difficulty: 'advanced',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Webinar Topic', required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['30 min', '45 min', '60 min', '90 min'], required: true },
                { id: 'type', type: 'select', label: 'Type', options: ['Educational', 'Product Demo', 'Interview', 'Workshop', 'Panel'], required: true }
            ]
        },

        'chatbot-script': {
            name: 'Chatbot Script Generator',
            icon: '🤖',
            category: 'text',
            description: 'Conversational chatbot scripts and response flows',
            output: '50 conversation flows',
            models: 'Gemini 2.5 Pro',
            difficulty: 'advanced',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'business', type: 'text', label: 'Business Type', required: true },
                { id: 'use_case', type: 'select', label: 'Use Case', options: ['Customer Support', 'Sales', 'Lead Qualification', 'FAQ Bot', 'Booking'], required: true },
                { id: 'tone', type: 'select', label: 'Personality', options: ['Professional', 'Friendly', 'Casual', 'Formal', 'Playful'], required: true }
            ]
        },

        'sop-generator': {
            name: 'SOP & Documentation',
            icon: '📋',
            category: 'text',
            description: 'Standard Operating Procedures and documentation',
            output: '5 SOPs + templates',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'process', type: 'text', label: 'Process Name', required: true },
                { id: 'department', type: 'select', label: 'Department', options: ['Marketing', 'Sales', 'Operations', 'HR', 'Finance', 'IT', 'Customer Service'], required: true },
                { id: 'detail_level', type: 'select', label: 'Detail Level', options: ['Overview', 'Detailed', 'Step-by-Step', 'Comprehensive'], required: true }
            ]
        },


        // ═══════════════════════════════════════════════════════════════
        // 🖼️ IMAGE GENERATION (25 Workflows)
        // ═══════════════════════════════════════════════════════════════

        'carousel-master': {
            name: 'Carousel Master',
            icon: '🎨',
            category: 'image',
            description: 'Complete carousel sets with 5 style variations',
            output: '50 images (10×5 styles)',
            models: 'Imagen 4 + Gemini',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            popular: true,
            fields: [
                { id: 'topic', type: 'text', label: 'Carousel Topic', required: true },
                { id: 'slide_count', type: 'select', label: 'Slides', options: ['5', '7', '10', '12', '15'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Minimalist', 'Bold', 'Professional', 'Gradient', 'Photo-based', 'Illustrated'], required: true },
                { id: 'brand_colors', type: 'text', label: 'Brand Colors (hex)', placeholder: '#FF5733, #3498DB', required: false }
            ]
        },

        'product-photoshoot': {
            name: 'Product Photoshoot Pro',
            icon: '📸',
            category: 'image',
            description: 'Professional product photos with multiple angles and lighting',
            output: '30+ product photos',
            models: 'Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            popular: true,
            fields: [
                { id: 'product_name', type: 'text', label: 'Product Name', required: true },
                { id: 'product_description', type: 'textarea', label: 'Description', required: true },
                { id: 'category', type: 'select', label: 'Category', options: ['Fashion', 'Beauty', 'Electronics', 'Food', 'Jewelry', 'Home', 'Sports'], required: true },
                { id: 'background', type: 'select', label: 'Background', options: ['White Studio', 'Lifestyle', 'Natural', 'Gradient', 'Textured'], required: true },
                { id: 'lighting', type: 'select', label: 'Lighting', options: ['Soft Studio', 'Hard Light', 'Natural', 'Dramatic'], required: true }
            ]
        },

        'social-templates': {
            name: 'Social Media Template Pack',
            icon: '📱',
            category: 'image',
            description: 'Branded templates for all platforms (posts, stories, covers)',
            output: '50+ templates',
            models: 'Imagen 4 + Gemini',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'industry', type: 'select', label: 'Industry', options: ['Fashion', 'Food', 'Tech', 'Health', 'Education', 'Finance', 'Travel'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Modern', 'Minimalist', 'Bold', 'Elegant', 'Playful', 'Corporate'], required: true },
                { id: 'platforms', type: 'select', label: 'Platforms', options: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok', 'All'], required: true }
            ]
        },

        'thumbnail-generator': {
            name: 'Thumbnail Generator Pro',
            icon: '🖼️',
            category: 'image',
            description: 'Click-worthy thumbnails for YouTube, blogs, courses',
            output: '20 thumbnail variations',
            models: 'Imagen 4',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            popular: true,
            fields: [
                { id: 'title', type: 'text', label: 'Video/Content Title', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Face + Text', 'Product Focus', 'Before/After', 'Listicle', 'Dramatic', 'Minimalist'], required: true },
                { id: 'emotion', type: 'select', label: 'Emotion', options: ['Excitement', 'Curiosity', 'Shock', 'Trust', 'Urgency', 'Joy'], required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['YouTube', 'Blog', 'Course', 'Podcast', 'All'], required: true }
            ]
        },

        'infographic': {
            name: 'Infographic Generator',
            icon: '📊',
            category: 'image',
            description: 'Data-driven infographics with charts and statistics',
            output: '10 infographic designs',
            models: 'Imagen 4 + Gemini',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Infographic Topic', required: true },
                { id: 'data_points', type: 'textarea', label: 'Key Data/Statistics', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Modern', 'Corporate', 'Playful', 'Minimalist', 'Data-Heavy', 'Timeline'], required: true },
                { id: 'orientation', type: 'select', label: 'Orientation', options: ['Vertical (Pinterest)', 'Horizontal', 'Square', 'Multi-page'], required: true }
            ]
        },

        'meme-generator': {
            name: 'Meme Generator Pro',
            icon: '😂',
            category: 'image',
            description: 'Trending memes and relatable content for engagement',
            output: '30 memes',
            models: 'Imagen 4 + Gemini',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Meme Topic/Niche', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Classic Format', 'Reaction', 'Relatable', 'Industry-Specific', 'Trending', 'Original'], required: true },
                { id: 'humor_level', type: 'select', label: 'Humor Level', options: ['Subtle', 'Moderate', 'Bold', 'Edgy'], required: true }
            ]
        },

        'quote-graphics': {
            name: 'Quote Graphics Generator',
            icon: '💭',
            category: 'image',
            description: 'Beautiful quote graphics with typography and backgrounds',
            output: '30 quote graphics',
            models: 'Imagen 4',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'quotes', type: 'textarea', label: 'Quotes (one per line)', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Minimalist', 'Nature', 'Gradient', 'Photo Overlay', 'Abstract', 'Vintage'], required: true },
                { id: 'typography', type: 'select', label: 'Typography', options: ['Modern Sans', 'Elegant Serif', 'Handwritten', 'Bold Display', 'Mixed'], required: true }
            ]
        },

        'ad-creative': {
            name: 'Ad Creative Generator',
            icon: '📢',
            category: 'image',
            description: 'High-converting ad creatives for all platforms',
            output: '40 ad creatives',
            models: 'Imagen 4 + Gemini',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            popular: true,
            fields: [
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'offer', type: 'text', label: 'Offer/Promotion', placeholder: '50% OFF, Free Trial', required: false },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Facebook/Instagram', 'Google Display', 'TikTok', 'LinkedIn', 'Pinterest', 'All'], required: true },
                { id: 'objective', type: 'select', label: 'Objective', options: ['Awareness', 'Consideration', 'Conversion', 'Retargeting'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Product Focus', 'Lifestyle', 'UGC Style', 'Testimonial', 'Before/After'], required: true }
            ]
        },

        'logo-suite': {
            name: 'Logo Suite Generator',
            icon: '🎯',
            category: 'image',
            description: 'Complete logo suite with variations and social icons',
            output: '20 logo variations',
            models: 'Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'tagline', type: 'text', label: 'Tagline (optional)', required: false },
                { id: 'industry', type: 'select', label: 'Industry', options: ['Technology', 'Fashion', 'Food', 'Health', 'Finance', 'Education', 'Creative'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Modern', 'Classic', 'Playful', 'Minimalist', 'Vintage', 'Geometric'], required: true }
            ]
        },

        'banner-generator': {
            name: 'Banner Generator Pro',
            icon: '🏷️',
            category: 'image',
            description: 'Web banners, hero images, and promotional graphics',
            output: '30 banners (all sizes)',
            models: 'Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'purpose', type: 'text', label: 'Banner Purpose', required: true },
                { id: 'type', type: 'select', label: 'Type', options: ['Website Hero', 'Email Header', 'Social Cover', 'Ad Banner', 'Event', 'Sale'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Modern', 'Corporate', 'Creative', 'Minimalist', 'Bold', 'Elegant'], required: true },
                { id: 'cta', type: 'text', label: 'CTA Text', placeholder: 'Shop Now, Learn More', required: false }
            ]
        },

        'avatar-generator': {
            name: 'Avatar & Profile Generator',
            icon: '👤',
            category: 'image',
            description: 'Professional avatars and profile pictures',
            output: '20 avatar variations',
            models: 'Imagen 4',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'style', type: 'select', label: 'Style', options: ['Professional Photo', 'Illustrated', '3D Character', 'Cartoon', 'Abstract', 'AI Portrait'], required: true },
                { id: 'gender', type: 'select', label: 'Gender', options: ['Male', 'Female', 'Non-binary', 'Abstract'], required: true },
                { id: 'mood', type: 'select', label: 'Mood', options: ['Professional', 'Friendly', 'Confident', 'Creative', 'Approachable'], required: true }
            ]
        },

        'mockup-master': {
            name: 'Mockup Master',
            icon: '📦',
            category: 'image',
            description: 'Realistic mockups for products, apparel, packaging',
            output: '25 mockup variations',
            models: 'Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'mockup_type', type: 'select', label: 'Type', options: ['T-Shirt/Apparel', 'Phone/Device', 'Packaging/Box', 'Book/Magazine', 'Mug/Merch', 'Business Card', 'Website/App'], required: true },
                { id: 'style', type: 'select', label: 'Scene', options: ['Clean Studio', 'Lifestyle', 'Flat Lay', 'In-Context', 'Floating', 'Hand-Held'], required: true },
                { id: 'angle', type: 'select', label: 'Angle', options: ['Front', 'Angled', 'Top-Down', 'Multiple', 'All'], required: true }
            ]
        },

        'pattern-generator': {
            name: 'Pattern & Texture Generator',
            icon: '🔲',
            category: 'image',
            description: 'Seamless patterns and textures for backgrounds',
            output: '30 patterns',
            models: 'Imagen 4',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'style', type: 'select', label: 'Style', options: ['Geometric', 'Floral', 'Abstract', 'Minimal', 'Vintage', 'Modern', 'Organic'], required: true },
                { id: 'colors', type: 'text', label: 'Colors', placeholder: '#FF5733, #3498DB', required: false },
                { id: 'use_case', type: 'select', label: 'Use Case', options: ['Background', 'Fabric', 'Packaging', 'Social Media', 'Website', 'All'], required: true }
            ]
        },

        'icon-set': {
            name: 'Icon Set Generator',
            icon: '🎨',
            category: 'image',
            description: 'Custom icon sets for websites and apps',
            output: '50 icons',
            models: 'Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'theme', type: 'text', label: 'Icon Theme', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Line/Outline', 'Filled', 'Duotone', '3D', 'Flat', 'Gradient', 'Hand-drawn'], required: true },
                { id: 'count', type: 'select', label: 'Count', options: ['20', '30', '50', '100'], required: true }
            ]
        },

        'story-template': {
            name: 'Story Template Generator',
            icon: '📱',
            category: 'image',
            description: 'Instagram/TikTok story templates',
            output: '30 story templates',
            models: 'Imagen 4',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'purpose', type: 'select', label: 'Purpose', options: ['Promotion', 'Engagement', 'Behind-the-Scenes', 'Tutorial', 'Announcement', 'Q&A', 'Poll'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Modern', 'Playful', 'Elegant', 'Bold', 'Minimalist', 'Trendy'], required: true },
                { id: 'elements', type: 'select', label: 'Elements', options: ['Poll', 'Quiz', 'Slider', 'Question Box', 'Countdown', 'All'], required: true }
            ]
        },

        'magic-background': {
            name: 'Magic Background Pro',
            icon: '🌄',
            category: 'image',
            description: 'AI background removal and replacement',
            output: '20 background variations',
            models: 'Imagen 4',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'subject', type: 'text', label: 'Subject Description', required: true },
                { id: 'bg_type', type: 'select', label: 'Background', options: ['Studio White', 'Gradient', 'Nature', 'Urban', 'Abstract', 'Lifestyle', 'Seasonal'], required: true },
                { id: 'mood', type: 'select', label: 'Mood', options: ['Professional', 'Casual', 'Luxury', 'Playful', 'Dramatic', 'Serene'], required: true }
            ]
        },

        'magic-enhance': {
            name: 'Magic Enhance Pro',
            icon: '✨',
            category: 'image',
            description: 'AI upscaling and enhancement up to 8x',
            output: 'Enhanced images (8x)',
            models: 'Imagen 4',
            difficulty: 'beginner',
            estimatedTime: '3-5 min',
            fields: [
                { id: 'upscale', type: 'select', label: 'Upscale', options: ['2x', '4x', '8x'], required: true },
                { id: 'enhance_type', type: 'select', label: 'Type', options: ['General', 'Portrait', 'Product', 'Landscape', 'Old Photo', 'Noise Reduction'], required: true },
                { id: 'sharpness', type: 'select', label: 'Sharpness', options: ['Subtle', 'Medium', 'High'], required: true }
            ]
        },

        'magic-variation': {
            name: 'Magic Variation Pro',
            icon: '🔄',
            category: 'image',
            description: 'Generate 30 style variations of any image',
            output: '30 variations',
            models: 'Imagen 4',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'variation_type', type: 'select', label: 'Type', options: ['Style Transfer', 'Color', 'Mood', 'Artistic Filters', 'Season', 'Time of Day', 'All'], required: true },
                { id: 'intensity', type: 'select', label: 'Intensity', options: ['Subtle', 'Moderate', 'Dramatic'], required: true },
                { id: 'count', type: 'select', label: 'Count', options: ['10', '20', '30'], required: true }
            ]
        },

        'magic-composite': {
            name: 'Magic Composite Pro',
            icon: '🖼️',
            category: 'image',
            description: 'Seamlessly combine multiple images with AI',
            output: '10 composite images',
            models: 'Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '8-12 min',
            fields: [
                { id: 'composite_type', type: 'select', label: 'Type', options: ['Subject on Background', 'Double Exposure', 'Collage', 'Blend/Morph', 'Surreal', 'Product in Scene'], required: true },
                { id: 'blend_mode', type: 'select', label: 'Blend', options: ['Natural', 'Artistic', 'Dramatic', 'Subtle', 'Surreal'], required: true }
            ]
        },

        'magic-relight': {
            name: 'Magic Relight Pro',
            icon: '💡',
            category: 'image',
            description: 'AI-powered relighting with studio quality',
            output: '10 lighting variations',
            models: 'Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'lighting_style', type: 'select', label: 'Lighting', options: ['Studio Soft', 'Studio Hard', 'Natural Window', 'Golden Hour', 'Blue Hour', 'Dramatic', 'Rim Light'], required: true },
                { id: 'direction', type: 'select', label: 'Direction', options: ['Front', 'Side Left', 'Side Right', 'Back', 'Top', '45° Key'], required: true },
                { id: 'color_temp', type: 'select', label: 'Temperature', options: ['Warm', 'Neutral', 'Cool', 'Mixed'], required: true }
            ]
        },

        'magic-resize': {
            name: 'Magic Resize Pro',
            icon: '📐',
            category: 'image',
            description: 'Smart resize with AI content-aware scaling',
            output: '15 platform sizes',
            models: 'Imagen 4',
            difficulty: 'beginner',
            estimatedTime: '3-5 min',
            fields: [
                { id: 'platforms', type: 'select', label: 'Platforms', options: ['Instagram (All)', 'Facebook (All)', 'Twitter', 'LinkedIn', 'Pinterest', 'YouTube', 'TikTok', 'All'], required: true },
                { id: 'method', type: 'select', label: 'Method', options: ['Smart Crop', 'Content-Aware Extend', 'Scale', 'Outpaint'], required: true }
            ]
        },

        'fashion-photoshoot': {
            name: 'Fashion Photoshoot AI',
            icon: '👗',
            category: 'image',
            description: 'Fashion photography with AI models',
            output: '20 fashion photos',
            models: 'Imagen 4',
            difficulty: 'advanced',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'garment_type', type: 'select', label: 'Garment', options: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Full Outfit', 'Swimwear'], required: true },
                { id: 'model_type', type: 'select', label: 'Model', options: ['AI Human', 'Mannequin', 'Flat Lay', 'Ghost/Invisible', 'Hanger'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Editorial', 'E-commerce', 'Lifestyle', 'Street Style', 'Studio', 'Lookbook'], required: true }
            ]
        },

        'food-photography': {
            name: 'Food Photography AI',
            icon: '🍕',
            category: 'image',
            description: 'Mouth-watering food photography',
            output: '20 food photos',
            models: 'Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'food_type', type: 'text', label: 'Food/Dish Name', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Overhead/Flat Lay', 'Hero Shot', 'Action Shot', 'Lifestyle', 'Dark & Moody', 'Bright & Airy'], required: true },
                { id: 'props', type: 'select', label: 'Props', options: ['Minimal', 'Rustic', 'Modern', 'Elegant', 'Casual', 'Restaurant'], required: true }
            ]
        },

        'real-estate': {
            name: 'Real Estate Visuals',
            icon: '🏠',
            category: 'image',
            description: 'Property photos and virtual staging',
            output: '20 property images',
            models: 'Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'property_type', type: 'select', label: 'Property', options: ['House', 'Apartment', 'Commercial', 'Land', 'Luxury', 'Vacation Rental'], required: true },
                { id: 'visual_type', type: 'select', label: 'Visual', options: ['Interior', 'Exterior', 'Aerial', 'Virtual Staging', 'Renovation Preview', 'All'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Modern', 'Traditional', 'Minimalist', 'Luxury', 'Scandinavian', 'Industrial'], required: true }
            ]
        },

        'event-graphics': {
            name: 'Event Graphics Generator',
            icon: '🎉',
            category: 'image',
            description: 'Complete event visual packages',
            output: '30 event graphics',
            models: 'Imagen 4 + Gemini',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'event_name', type: 'text', label: 'Event Name', required: true },
                { id: 'event_type', type: 'select', label: 'Type', options: ['Conference', 'Wedding', 'Birthday', 'Corporate', 'Concert', 'Workshop', 'Launch Party', 'Webinar'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Elegant', 'Modern', 'Fun', 'Corporate', 'Vintage', 'Minimalist'], required: true }
            ]
        },


        // ═══════════════════════════════════════════════════════════════
        // 🎬 VIDEO GENERATION (15 Workflows)
        // ═══════════════════════════════════════════════════════════════

        'short-video': {
            name: 'Short-Form Video Generator',
            icon: '📱',
            category: 'video',
            description: 'Generate 10 short videos with music and voiceover',
            output: '10 videos + music + VO',
            models: 'Veo + Lyria 2 + AudioLM',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            popular: true,
            fields: [
                { id: 'concept', type: 'textarea', label: 'Video Concept', required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['15 sec', '30 sec', '60 sec', '90 sec'], required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'All'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Trendy', 'Educational', 'Entertainment', 'Product Showcase', 'Behind-the-Scenes'], required: true }
            ]
        },

        'youtube-video': {
            name: 'YouTube Video Package',
            icon: '📺',
            category: 'video',
            description: 'Complete YouTube video: script, thumbnails, B-roll',
            output: 'Script + thumbnails + B-roll',
            models: 'All Models',
            difficulty: 'advanced',
            estimatedTime: '20-30 min',
            popular: true,
            fields: [
                { id: 'topic', type: 'text', label: 'Video Topic', required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['5 min', '10 min', '15 min', '20+ min'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Educational', 'Entertainment', 'Review', 'Tutorial', 'Vlog', 'Documentary'], required: true },
                { id: 'niche', type: 'text', label: 'Channel Niche', required: true }
            ]
        },

        'magic-video': {
            name: 'Magic Video (Image to Video)',
            icon: '🎬',
            category: 'video',
            description: 'Animate static images into videos',
            output: '5 animated videos',
            models: 'Veo',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'motion_type', type: 'select', label: 'Motion', options: ['Subtle', 'Dynamic', 'Cinematic', 'Parallax', 'Zoom', 'Pan'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['3 sec', '5 sec', '10 sec', '15 sec'], required: true },
                { id: 'loop', type: 'select', label: 'Loop', options: ['Yes', 'No'], required: true }
            ]
        },

        'product-video': {
            name: 'Product Video Generator',
            icon: '🛍️',
            category: 'video',
            description: 'Professional product showcase videos',
            output: '10 product videos',
            models: 'Veo + Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'product_name', type: 'text', label: 'Product Name', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['360° Spin', 'Lifestyle', 'Unboxing', 'Feature Highlight', 'Comparison', 'Demo'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['15 sec', '30 sec', '60 sec'], required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Instagram', 'TikTok', 'Website', 'Amazon', 'All'], required: true }
            ]
        },

        'explainer-video': {
            name: 'Explainer Video Creator',
            icon: '📖',
            category: 'video',
            description: 'Animated explainer videos for products/services',
            output: '3 explainer videos',
            models: 'Veo + Gemini',
            difficulty: 'advanced',
            estimatedTime: '20-30 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Topic to Explain', required: true },
                { id: 'style', type: 'select', label: 'Animation Style', options: ['2D Animation', 'Motion Graphics', 'Whiteboard', 'Kinetic Typography', 'Mixed'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['60 sec', '90 sec', '2 min', '3 min'], required: true },
                { id: 'tone', type: 'select', label: 'Tone', options: ['Professional', 'Friendly', 'Fun', 'Serious', 'Inspirational'], required: true }
            ]
        },

        'testimonial-video': {
            name: 'Testimonial Video Creator',
            icon: '⭐',
            category: 'video',
            description: 'Customer testimonial video templates',
            output: '5 testimonial videos',
            models: 'Veo + AudioLM',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Interview', 'Story-based', 'Before/After', 'Quote Highlight', 'Case Study'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['30 sec', '60 sec', '90 sec'], required: true }
            ]
        },

        'social-video-ads': {
            name: 'Social Video Ads',
            icon: '📢',
            category: 'video',
            description: 'High-converting video ads for all platforms',
            output: '15 video ads',
            models: 'Veo + Gemini',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            popular: true,
            fields: [
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Facebook/Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'All'], required: true },
                { id: 'objective', type: 'select', label: 'Objective', options: ['Awareness', 'Consideration', 'Conversion', 'App Install'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['6 sec', '15 sec', '30 sec', '60 sec'], required: true },
                { id: 'hook_style', type: 'select', label: 'Hook Style', options: ['Question', 'Problem', 'Shocking Stat', 'Testimonial', 'Demo'], required: true }
            ]
        },

        'ugc-video': {
            name: 'UGC Video Generator',
            icon: '🎭',
            category: 'video',
            description: 'User-generated content style videos',
            output: '10 UGC videos',
            models: 'Veo',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'style', type: 'select', label: 'UGC Style', options: ['Review', 'Unboxing', 'Day in Life', 'Get Ready With Me', 'Tutorial', 'Reaction'], required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['TikTok', 'Instagram', 'YouTube Shorts', 'All'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['15 sec', '30 sec', '60 sec'], required: true }
            ]
        },

        'slideshow-video': {
            name: 'Slideshow Video Creator',
            icon: '🖼️',
            category: 'video',
            description: 'Photo slideshow videos with transitions and music',
            output: '5 slideshow videos',
            models: 'Veo + Lyria 2',
            difficulty: 'beginner',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'theme', type: 'text', label: 'Slideshow Theme', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Elegant', 'Dynamic', 'Minimal', 'Cinematic', 'Fun', 'Corporate'], required: true },
                { id: 'transition', type: 'select', label: 'Transitions', options: ['Fade', 'Slide', 'Zoom', 'Creative', 'Mixed'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['30 sec', '60 sec', '90 sec', '2 min'], required: true }
            ]
        },

        'intro-outro': {
            name: 'Intro/Outro Generator',
            icon: '🎬',
            category: 'video',
            description: 'Professional video intros and outros',
            output: '10 intro/outro sets',
            models: 'Veo',
            difficulty: 'beginner',
            estimatedTime: '8-12 min',
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand/Channel Name', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Modern', 'Minimal', 'Energetic', 'Elegant', 'Tech', 'Gaming', 'Vlog'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['3 sec', '5 sec', '7 sec', '10 sec'], required: true },
                { id: 'type', type: 'select', label: 'Type', options: ['Intro Only', 'Outro Only', 'Both'], required: true }
            ]
        },

        'tutorial-video': {
            name: 'Tutorial Video Creator',
            icon: '📚',
            category: 'video',
            description: 'Step-by-step tutorial videos',
            output: '3 tutorial videos',
            models: 'Veo + Gemini',
            difficulty: 'advanced',
            estimatedTime: '20-30 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Tutorial Topic', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Screen Recording', 'Live Demo', 'Animated', 'Mixed', 'Talking Head'], required: true },
                { id: 'steps', type: 'select', label: 'Number of Steps', options: ['3-5', '6-10', '10+'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['3 min', '5 min', '10 min', '15+ min'], required: true }
            ]
        },

        'promo-video': {
            name: 'Promo Video Generator',
            icon: '🎯',
            category: 'video',
            description: 'Promotional videos for launches and campaigns',
            output: '5 promo videos',
            models: 'Veo + Lyria 2',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'campaign', type: 'text', label: 'Campaign/Product', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Cinematic', 'Fast-paced', 'Elegant', 'Fun', 'Dramatic', 'Minimal'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['15 sec', '30 sec', '60 sec', '90 sec'], required: true },
                { id: 'cta', type: 'text', label: 'Call-to-Action', required: true }
            ]
        },

        'story-video': {
            name: 'Story Video Creator',
            icon: '📱',
            category: 'video',
            description: 'Vertical story videos for Instagram/TikTok',
            output: '15 story videos',
            models: 'Veo',
            difficulty: 'beginner',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'content', type: 'text', label: 'Story Content', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Trendy', 'Minimal', 'Bold', 'Elegant', 'Fun', 'Professional'], required: true },
                { id: 'elements', type: 'select', label: 'Elements', options: ['Text Animation', 'Stickers', 'Music', 'Effects', 'All'], required: true }
            ]
        },

        'gif-creator': {
            name: 'GIF Creator Pro',
            icon: '🎞️',
            category: 'video',
            description: 'Animated GIFs for social media and marketing',
            output: '20 GIFs',
            models: 'Veo',
            difficulty: 'beginner',
            estimatedTime: '8-12 min',
            fields: [
                { id: 'concept', type: 'text', label: 'GIF Concept', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Reaction', 'Product', 'Text Animation', 'Illustration', 'Meme', 'Logo Animation'], required: true },
                { id: 'loop', type: 'select', label: 'Loop Style', options: ['Perfect Loop', 'Bounce', 'Standard'], required: true }
            ]
        },

        'live-stream-assets': {
            name: 'Live Stream Assets',
            icon: '🔴',
            category: 'video',
            description: 'Overlays, alerts, and assets for live streaming',
            output: '20 stream assets',
            models: 'Veo + Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'channel_name', type: 'text', label: 'Channel Name', required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Twitch', 'YouTube Live', 'TikTok Live', 'Instagram Live', 'All'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Gaming', 'Professional', 'Minimal', 'Neon', 'Cute', 'Tech'], required: true },
                { id: 'assets', type: 'select', label: 'Assets', options: ['Overlays', 'Alerts', 'Panels', 'Transitions', 'All'], required: true }
            ]
        },


        // ═══════════════════════════════════════════════════════════════
        // 🎙️ AUDIO GENERATION (10 Workflows)
        // ═══════════════════════════════════════════════════════════════

        'podcast-creator': {
            name: 'Podcast Creator Pro',
            icon: '🎙️',
            category: 'audio',
            description: 'Complete podcast episode: script, music, voiceover',
            output: 'Script + music + VO',
            models: 'AudioLM + Lyria 2',
            difficulty: 'advanced',
            estimatedTime: '20-30 min',
            popular: true,
            fields: [
                { id: 'topic', type: 'text', label: 'Episode Topic', required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['15 min', '30 min', '45 min', '60 min'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Solo', 'Interview', 'Panel', 'Storytelling', 'Educational'], required: true },
                { id: 'tone', type: 'select', label: 'Tone', options: ['Professional', 'Casual', 'Entertaining', 'Serious', 'Inspirational'], required: true }
            ]
        },

        'voiceover-generator': {
            name: 'Voiceover Generator',
            icon: '🗣️',
            category: 'audio',
            description: 'AI voiceovers in multiple languages and styles',
            output: '10 voiceover variations',
            models: 'AudioLM',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'script', type: 'textarea', label: 'Script', required: true },
                { id: 'voice_type', type: 'select', label: 'Voice Type', options: ['Male', 'Female', 'Neutral', 'Child', 'Elderly'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Professional', 'Friendly', 'Energetic', 'Calm', 'Dramatic', 'Conversational'], required: true },
                { id: 'language', type: 'select', label: 'Language', options: ['Indonesian', 'English (US)', 'English (UK)', 'Multi-language'], required: true }
            ]
        },

        'music-generator': {
            name: 'Music Generator Pro',
            icon: '🎵',
            category: 'audio',
            description: 'Custom background music and jingles',
            output: '10 music tracks',
            models: 'Lyria 2',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'mood', type: 'select', label: 'Mood', options: ['Happy', 'Sad', 'Energetic', 'Calm', 'Dramatic', 'Inspiring', 'Mysterious', 'Romantic'], required: true },
                { id: 'genre', type: 'select', label: 'Genre', options: ['Pop', 'Electronic', 'Acoustic', 'Cinematic', 'Lo-Fi', 'Corporate', 'Hip-Hop', 'Classical'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['15 sec', '30 sec', '60 sec', '2 min', '3 min'], required: true },
                { id: 'tempo', type: 'select', label: 'Tempo', options: ['Slow', 'Medium', 'Fast', 'Variable'], required: true }
            ]
        },

        'sound-effects': {
            name: 'Sound Effects Generator',
            icon: '🔊',
            category: 'audio',
            description: 'Custom sound effects for videos and content',
            output: '30 sound effects',
            models: 'AudioLM',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'category', type: 'select', label: 'Category', options: ['UI/App', 'Nature', 'Urban', 'Transitions', 'Notifications', 'Gaming', 'Cinematic', 'Comedy'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Realistic', 'Stylized', 'Retro', 'Futuristic', 'Cartoon'], required: true },
                { id: 'count', type: 'select', label: 'Count', options: ['10', '20', '30', '50'], required: true }
            ]
        },

        'jingle-creator': {
            name: 'Jingle Creator',
            icon: '🎶',
            category: 'audio',
            description: 'Catchy brand jingles and audio logos',
            output: '5 jingle variations',
            models: 'Lyria 2 + AudioLM',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'tagline', type: 'text', label: 'Tagline (optional)', required: false },
                { id: 'style', type: 'select', label: 'Style', options: ['Catchy Pop', 'Corporate', 'Fun', 'Elegant', 'Energetic', 'Minimal'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['3 sec', '5 sec', '10 sec', '15 sec'], required: true }
            ]
        },

        'audiobook-narrator': {
            name: 'Audiobook Narrator',
            icon: '📖',
            category: 'audio',
            description: 'AI narration for audiobooks and long-form content',
            output: 'Full narration',
            models: 'AudioLM',
            difficulty: 'advanced',
            estimatedTime: '30+ min',
            fields: [
                { id: 'content', type: 'textarea', label: 'Content to Narrate', required: true },
                { id: 'voice_type', type: 'select', label: 'Voice', options: ['Male Narrator', 'Female Narrator', 'Multiple Voices'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Storytelling', 'Educational', 'Documentary', 'Dramatic', 'Conversational'], required: true },
                { id: 'pace', type: 'select', label: 'Pace', options: ['Slow', 'Normal', 'Fast'], required: true }
            ]
        },

        'meditation-audio': {
            name: 'Meditation Audio Creator',
            icon: '🧘',
            category: 'audio',
            description: 'Guided meditation and relaxation audio',
            output: '5 meditation tracks',
            models: 'AudioLM + Lyria 2',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'type', type: 'select', label: 'Type', options: ['Guided Meditation', 'Sleep Story', 'Breathing Exercise', 'Body Scan', 'Affirmations', 'Nature Sounds'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['5 min', '10 min', '15 min', '30 min'], required: true },
                { id: 'voice', type: 'select', label: 'Voice', options: ['Calm Female', 'Calm Male', 'No Voice (Music Only)'], required: true },
                { id: 'background', type: 'select', label: 'Background', options: ['Nature', 'Ambient', 'Binaural', 'Silence', 'Rain', 'Ocean'], required: true }
            ]
        },

        'ad-audio': {
            name: 'Ad Audio Creator',
            icon: '📻',
            category: 'audio',
            description: 'Radio and podcast ad audio',
            output: '10 ad audio variations',
            models: 'AudioLM + Lyria 2',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['15 sec', '30 sec', '60 sec'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Professional', 'Conversational', 'Energetic', 'Dramatic', 'Humorous'], required: true },
                { id: 'voice', type: 'select', label: 'Voice', options: ['Male', 'Female', 'Duo', 'Multiple'], required: true }
            ]
        },

        'ringtone-creator': {
            name: 'Ringtone & Notification Creator',
            icon: '📱',
            category: 'audio',
            description: 'Custom ringtones and notification sounds',
            output: '20 audio clips',
            models: 'Lyria 2',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'type', type: 'select', label: 'Type', options: ['Ringtone', 'Notification', 'Alarm', 'Message Tone', 'All'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Modern', 'Classic', 'Fun', 'Professional', 'Nature', 'Retro'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['3 sec', '5 sec', '10 sec', '30 sec'], required: true }
            ]
        },

        'asmr-creator': {
            name: 'ASMR Content Creator',
            icon: '🎧',
            category: 'audio',
            description: 'ASMR audio content for relaxation',
            output: '10 ASMR tracks',
            models: 'AudioLM',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'type', type: 'select', label: 'ASMR Type', options: ['Whispering', 'Tapping', 'Scratching', 'Crinkling', 'Typing', 'Nature', 'Eating', 'Mixed'], required: true },
                { id: 'duration', type: 'select', label: 'Duration', options: ['5 min', '10 min', '30 min', '60 min'], required: true },
                { id: 'intensity', type: 'select', label: 'Intensity', options: ['Gentle', 'Medium', 'Intense'], required: true }
            ]
        },

        // ═══════════════════════════════════════════════════════════════
        // 📢 MARKETING TOOLS (15 Workflows)
        // ═══════════════════════════════════════════════════════════════

        'social-media-kit': {
            name: 'Social Media Kit Complete',
            icon: '📱',
            category: 'marketing',
            description: 'Complete social media package for all platforms',
            output: '100+ assets',
            models: 'All Models',
            difficulty: 'advanced',
            estimatedTime: '30-45 min',
            popular: true,
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'campaign', type: 'text', label: 'Campaign/Topic', required: true },
                { id: 'platforms', type: 'select', label: 'Platforms', options: ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter', 'All'], required: true },
                { id: 'tone', type: 'select', label: 'Brand Tone', options: ['Professional', 'Casual', 'Fun', 'Luxury', 'Edgy'], required: true },
                { id: 'duration', type: 'select', label: 'Campaign Duration', options: ['1 Week', '2 Weeks', '1 Month', '3 Months'], required: true }
            ]
        },

        'content-calendar': {
            name: 'Content Calendar Generator',
            icon: '📅',
            category: 'marketing',
            description: 'Generate 30-90 day content calendar with ideas',
            output: '30-90 day calendar',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            popular: true,
            fields: [
                { id: 'niche', type: 'text', label: 'Business Niche', required: true },
                { id: 'frequency', type: 'select', label: 'Posting Frequency', options: ['Daily', '5x/week', '3x/week', 'Weekly'], required: true },
                { id: 'platforms', type: 'select', label: 'Platforms', options: ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'All'], required: true },
                { id: 'duration', type: 'select', label: 'Calendar Duration', options: ['30 days', '60 days', '90 days'], required: true },
                { id: 'pillars', type: 'textarea', label: 'Content Pillars', placeholder: 'Education, Entertainment, Promotion...', required: false }
            ]
        },

        'email-campaign': {
            name: 'Email Campaign Creator',
            icon: '📧',
            category: 'marketing',
            description: 'Complete email marketing campaign',
            output: '10 emails + automation',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'campaign_type', type: 'select', label: 'Campaign Type', options: ['Welcome Series', 'Promotional', 'Newsletter', 'Abandoned Cart', 'Re-engagement', 'Product Launch', 'Nurture Sequence'], required: true },
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'emails', type: 'select', label: 'Number of Emails', options: ['3', '5', '7', '10'], required: true },
                { id: 'tone', type: 'select', label: 'Tone', options: ['Professional', 'Friendly', 'Urgent', 'Casual', 'Luxury'], required: true }
            ]
        },

        'landing-page': {
            name: 'Landing Page Content',
            icon: '🖥️',
            category: 'marketing',
            description: 'High-converting landing page copy and structure',
            output: 'Complete landing page',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'goal', type: 'select', label: 'Goal', options: ['Lead Generation', 'Sales', 'Webinar Registration', 'App Download', 'Free Trial'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Long-form Sales', 'Short & Direct', 'Story-based', 'Feature-focused', 'Testimonial-heavy'], required: true },
                { id: 'sections', type: 'select', label: 'Sections', options: ['Standard', 'Comprehensive', 'Minimal'], required: true }
            ]
        },

        'funnel-creator': {
            name: 'Sales Funnel Creator',
            icon: '🎯',
            category: 'marketing',
            description: 'Complete sales funnel content and strategy',
            output: 'Full funnel content',
            models: 'Gemini 2.5 Pro',
            difficulty: 'advanced',
            estimatedTime: '30-45 min',
            fields: [
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'price', type: 'text', label: 'Price Point', required: true },
                { id: 'funnel_type', type: 'select', label: 'Funnel Type', options: ['Lead Magnet', 'Webinar', 'Product Launch', 'Tripwire', 'High-Ticket', 'Membership'], required: true },
                { id: 'stages', type: 'select', label: 'Stages', options: ['3-Step', '5-Step', '7-Step', 'Custom'], required: true }
            ]
        },

        'competitor-analysis': {
            name: 'Competitor Analysis',
            icon: '🔍',
            category: 'marketing',
            description: 'AI-powered competitor content analysis',
            output: 'Analysis report + strategy',
            models: 'Gemini 2.5 Pro + Deep Research',
            difficulty: 'advanced',
            estimatedTime: '20-30 min',
            fields: [
                { id: 'your_brand', type: 'text', label: 'Your Brand', required: true },
                { id: 'competitors', type: 'textarea', label: 'Competitors (one per line)', required: true },
                { id: 'focus', type: 'select', label: 'Analysis Focus', options: ['Content Strategy', 'Social Media', 'SEO', 'Ads', 'All'], required: true },
                { id: 'platforms', type: 'select', label: 'Platforms', options: ['Instagram', 'TikTok', 'YouTube', 'Website', 'All'], required: true }
            ]
        },

        'trend-content': {
            name: 'Trend Content Generator',
            icon: '📈',
            category: 'marketing',
            description: 'Content based on current trends',
            output: '20 trend-based ideas',
            models: 'Gemini + Web Search',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'niche', type: 'text', label: 'Your Niche', required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['TikTok', 'Instagram', 'YouTube', 'Twitter', 'LinkedIn'], required: true },
                { id: 'trend_type', type: 'select', label: 'Trend Type', options: ['Audio/Sound', 'Challenge', 'Format', 'Topic', 'Hashtag', 'All'], required: true }
            ]
        },

        'influencer-brief': {
            name: 'Influencer Brief Generator',
            icon: '🤝',
            category: 'marketing',
            description: 'Professional influencer collaboration briefs',
            output: '5 brief templates',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'campaign', type: 'text', label: 'Campaign Name', required: true },
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'influencer_type', type: 'select', label: 'Influencer Type', options: ['Nano', 'Micro', 'Mid-tier', 'Macro', 'Mega', 'All'], required: true },
                { id: 'deliverables', type: 'select', label: 'Deliverables', options: ['Posts', 'Stories', 'Reels', 'YouTube', 'All'], required: true }
            ]
        },

        'affiliate-content': {
            name: 'Affiliate Content Creator',
            icon: '💰',
            category: 'marketing',
            description: 'Affiliate marketing content and reviews',
            output: '10 affiliate contents',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'product', type: 'text', label: 'Affiliate Product', required: true },
                { id: 'content_type', type: 'select', label: 'Content Type', options: ['Review', 'Comparison', 'Tutorial', 'Listicle', 'Case Study', 'All'], required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Blog', 'YouTube', 'Instagram', 'TikTok', 'Email', 'All'], required: true }
            ]
        },

        'launch-campaign': {
            name: 'Product Launch Campaign',
            icon: '🚀',
            category: 'marketing',
            description: 'Complete product launch campaign',
            output: 'Full launch package',
            models: 'All Models',
            difficulty: 'advanced',
            estimatedTime: '45-60 min',
            popular: true,
            fields: [
                { id: 'product', type: 'text', label: 'Product Name', required: true },
                { id: 'launch_date', type: 'text', label: 'Launch Date', required: true },
                { id: 'phase', type: 'select', label: 'Launch Phase', options: ['Pre-launch', 'Launch', 'Post-launch', 'All Phases'], required: true },
                { id: 'channels', type: 'select', label: 'Channels', options: ['Social Media', 'Email', 'Ads', 'PR', 'All'], required: true }
            ]
        },

        'seasonal-campaign': {
            name: 'Seasonal Campaign Creator',
            icon: '🎄',
            category: 'marketing',
            description: 'Holiday and seasonal marketing campaigns',
            output: 'Complete seasonal package',
            models: 'All Models',
            difficulty: 'intermediate',
            estimatedTime: '20-30 min',
            fields: [
                { id: 'season', type: 'select', label: 'Season/Holiday', options: ['New Year', 'Valentine', 'Ramadan', 'Eid', 'Independence Day', 'Christmas', 'Black Friday', 'Year End', 'Custom'], required: true },
                { id: 'brand', type: 'text', label: 'Brand Name', required: true },
                { id: 'offer', type: 'text', label: 'Offer/Promotion', required: true },
                { id: 'platforms', type: 'select', label: 'Platforms', options: ['Social Media', 'Email', 'Ads', 'All'], required: true }
            ]
        },

        'referral-program': {
            name: 'Referral Program Content',
            icon: '🎁',
            category: 'marketing',
            description: 'Referral program content and materials',
            output: 'Complete referral kit',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'reward', type: 'text', label: 'Referral Reward', required: true },
                { id: 'channels', type: 'select', label: 'Channels', options: ['Email', 'Social Media', 'In-App', 'All'], required: true }
            ]
        },

        'retargeting-content': {
            name: 'Retargeting Content Creator',
            icon: '🎯',
            category: 'marketing',
            description: 'Retargeting ads and content',
            output: '20 retargeting assets',
            models: 'Gemini + Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'audience', type: 'select', label: 'Audience', options: ['Cart Abandoners', 'Page Visitors', 'Past Customers', 'Email Subscribers', 'All'], required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Facebook', 'Google', 'TikTok', 'All'], required: true }
            ]
        },

        'ab-test-creator': {
            name: 'A/B Test Creator',
            icon: '🔬',
            category: 'marketing',
            description: 'A/B test variations for ads and content',
            output: '10 test variations',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '10-15 min',
            fields: [
                { id: 'original', type: 'textarea', label: 'Original Content', required: true },
                { id: 'element', type: 'select', label: 'Element to Test', options: ['Headline', 'CTA', 'Image', 'Copy', 'Layout', 'All'], required: true },
                { id: 'variations', type: 'select', label: 'Variations', options: ['3', '5', '10'], required: true }
            ]
        },

        'crisis-response': {
            name: 'Crisis Response Content',
            icon: '🚨',
            category: 'marketing',
            description: 'Crisis communication templates',
            output: 'Crisis response kit',
            models: 'Gemini 2.5 Pro',
            difficulty: 'advanced',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'crisis_type', type: 'select', label: 'Crisis Type', options: ['Product Issue', 'PR Crisis', 'Service Outage', 'Negative Reviews', 'Social Media Backlash', 'General'], required: true },
                { id: 'brand', type: 'text', label: 'Brand Name', required: true },
                { id: 'channels', type: 'select', label: 'Channels', options: ['Social Media', 'Email', 'Press', 'Website', 'All'], required: true }
            ]
        },


        // ═══════════════════════════════════════════════════════════════
        // 🎨 BRANDING (10 Workflows)
        // ═══════════════════════════════════════════════════════════════

        'brand-kit': {
            name: 'Brand Kit Generator',
            icon: '🎨',
            category: 'branding',
            description: 'Complete brand identity package',
            output: 'Full brand identity',
            models: 'Imagen 4 + Gemini',
            difficulty: 'advanced',
            estimatedTime: '30-45 min',
            popular: true,
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'industry', type: 'select', label: 'Industry', options: ['Technology', 'Fashion', 'Food', 'Health', 'Finance', 'Education', 'Creative', 'Sports', 'Travel'], required: true },
                { id: 'personality', type: 'select', label: 'Personality', options: ['Professional', 'Playful', 'Luxurious', 'Minimalist', 'Bold', 'Friendly', 'Innovative'], required: true },
                { id: 'target_audience', type: 'text', label: 'Target Audience', required: true }
            ]
        },

        'brand-guidelines': {
            name: 'Brand Guidelines Creator',
            icon: '📖',
            category: 'branding',
            description: 'Professional brand guidelines document',
            output: 'Complete brand guide',
            models: 'Gemini 2.5 Pro + Imagen 4',
            difficulty: 'advanced',
            estimatedTime: '30-45 min',
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'logo_description', type: 'textarea', label: 'Logo Description', required: true },
                { id: 'colors', type: 'text', label: 'Brand Colors', placeholder: '#FF5733, #3498DB', required: true },
                { id: 'sections', type: 'select', label: 'Sections', options: ['Basic', 'Standard', 'Comprehensive'], required: true }
            ]
        },

        'presentation': {
            name: 'Presentation Generator',
            icon: '📊',
            category: 'branding',
            description: 'Complete presentations and pitch decks',
            output: '10-30 slides',
            models: 'Gemini + Imagen',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Presentation Topic', required: true },
                { id: 'type', type: 'select', label: 'Type', options: ['Business Pitch', 'Educational', 'Sales', 'Report', 'Keynote', 'Proposal'], required: true },
                { id: 'slide_count', type: 'select', label: 'Slides', options: ['10', '15', '20', '30'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Modern', 'Corporate', 'Creative', 'Minimal', 'Bold'], required: true }
            ]
        },

        'pitch-deck': {
            name: 'Pitch Deck Creator',
            icon: '💼',
            category: 'branding',
            description: 'Investor-ready pitch deck',
            output: 'Complete pitch deck',
            models: 'Gemini 2.5 Pro + Imagen 4',
            difficulty: 'advanced',
            estimatedTime: '30-45 min',
            fields: [
                { id: 'company', type: 'text', label: 'Company Name', required: true },
                { id: 'industry', type: 'text', label: 'Industry', required: true },
                { id: 'stage', type: 'select', label: 'Funding Stage', options: ['Pre-seed', 'Seed', 'Series A', 'Series B+', 'Not Fundraising'], required: true },
                { id: 'ask', type: 'text', label: 'Funding Ask (optional)', required: false }
            ]
        },

        'brand-voice': {
            name: 'Brand Voice Generator',
            icon: '🗣️',
            category: 'branding',
            description: 'Define and document brand voice',
            output: 'Brand voice guide',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'personality', type: 'select', label: 'Personality', options: ['Professional', 'Friendly', 'Authoritative', 'Playful', 'Inspirational', 'Edgy'], required: true },
                { id: 'audience', type: 'text', label: 'Target Audience', required: true },
                { id: 'competitors', type: 'text', label: 'Competitors (optional)', required: false }
            ]
        },

        'tagline-generator': {
            name: 'Tagline & Slogan Generator',
            icon: '💬',
            category: 'branding',
            description: 'Memorable taglines and slogans',
            output: '50 tagline options',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'industry', type: 'text', label: 'Industry', required: true },
                { id: 'usp', type: 'text', label: 'Unique Selling Point', required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Catchy', 'Professional', 'Inspirational', 'Funny', 'Descriptive', 'Abstract'], required: true }
            ]
        },

        'brand-story': {
            name: 'Brand Story Creator',
            icon: '📖',
            category: 'branding',
            description: 'Compelling brand origin story',
            output: '5 story versions',
            models: 'Gemini 3 Pro',
            difficulty: 'intermediate',
            estimatedTime: '15-20 min',
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'founder', type: 'text', label: 'Founder Name', required: true },
                { id: 'origin', type: 'textarea', label: 'Origin/Background', required: true },
                { id: 'mission', type: 'text', label: 'Mission', required: true },
                { id: 'tone', type: 'select', label: 'Tone', options: ['Inspirational', 'Personal', 'Professional', 'Emotional', 'Humorous'], required: true }
            ]
        },

        'brand-naming': {
            name: 'Brand Naming Generator',
            icon: '✨',
            category: 'branding',
            description: 'Creative brand name suggestions',
            output: '100 name options',
            models: 'Gemini 2.5 Pro',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'industry', type: 'text', label: 'Industry', required: true },
                { id: 'keywords', type: 'text', label: 'Keywords', required: true },
                { id: 'style', type: 'select', label: 'Name Style', options: ['Modern', 'Classic', 'Abstract', 'Descriptive', 'Compound', 'Invented'], required: true },
                { id: 'length', type: 'select', label: 'Length', options: ['Short (1 word)', 'Medium (2 words)', 'Any'], required: true }
            ]
        },

        'media-kit': {
            name: 'Media Kit Creator',
            icon: '📰',
            category: 'branding',
            description: 'Professional media kit for press',
            output: 'Complete media kit',
            models: 'Gemini + Imagen 4',
            difficulty: 'intermediate',
            estimatedTime: '20-30 min',
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'type', type: 'select', label: 'Type', options: ['Company', 'Personal Brand', 'Influencer', 'Product'], required: true },
                { id: 'sections', type: 'select', label: 'Sections', options: ['Basic', 'Standard', 'Comprehensive'], required: true }
            ]
        },

        'brand-audit': {
            name: 'Brand Audit Generator',
            icon: '🔍',
            category: 'branding',
            description: 'Comprehensive brand audit report',
            output: 'Audit report + recommendations',
            models: 'Gemini 2.5 Pro',
            difficulty: 'advanced',
            estimatedTime: '30-45 min',
            fields: [
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'website', type: 'text', label: 'Website URL', required: true },
                { id: 'social_handles', type: 'text', label: 'Social Media Handles', required: true },
                { id: 'focus', type: 'select', label: 'Audit Focus', options: ['Visual Identity', 'Messaging', 'Digital Presence', 'Competitor Position', 'All'], required: true }
            ]
        },

        // ═══════════════════════════════════════════════════════════════
        // 🔧 UTILITY TOOLS (10 Workflows)
        // ═══════════════════════════════════════════════════════════════

        'hashtag-generator': {
            name: 'Hashtag Generator Pro',
            icon: '#️⃣',
            category: 'utility',
            description: 'Optimized hashtag sets with analytics',
            output: '150 hashtags (5 sets)',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '3-5 min',
            popular: true,
            fields: [
                { id: 'topic', type: 'text', label: 'Content Topic', required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube'], required: true },
                { id: 'reach', type: 'select', label: 'Target Reach', options: ['Local', 'National', 'Global', 'Niche'], required: true },
                { id: 'mix', type: 'select', label: 'Hashtag Mix', options: ['High Competition', 'Low Competition', 'Balanced', 'Trending'], required: true }
            ]
        },

        'bio-generator': {
            name: 'Bio & Profile Generator',
            icon: '👤',
            category: 'utility',
            description: 'Bios for all platforms',
            output: '20 bio variations',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '3-5 min',
            fields: [
                { id: 'name', type: 'text', label: 'Name/Brand', required: true },
                { id: 'profession', type: 'text', label: 'Profession/Niche', required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'All'], required: true },
                { id: 'tone', type: 'select', label: 'Tone', options: ['Professional', 'Casual', 'Fun', 'Inspirational', 'Mysterious'], required: true }
            ]
        },

        'cta-generator': {
            name: 'CTA Generator',
            icon: '🎯',
            category: 'utility',
            description: 'High-converting call-to-action phrases',
            output: '50 CTAs',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '3-5 min',
            fields: [
                { id: 'action', type: 'text', label: 'Desired Action', required: true },
                { id: 'context', type: 'select', label: 'Context', options: ['Button', 'Email', 'Social Post', 'Ad', 'Landing Page', 'Video'], required: true },
                { id: 'urgency', type: 'select', label: 'Urgency Level', options: ['Low', 'Medium', 'High', 'Extreme'], required: true }
            ]
        },

        'content-repurposer': {
            name: 'Content Repurposer',
            icon: '♻️',
            category: 'utility',
            description: 'Repurpose content for multiple platforms',
            output: '10 platform versions',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '8-12 min',
            popular: true,
            fields: [
                { id: 'original', type: 'textarea', label: 'Original Content', required: true },
                { id: 'source_type', type: 'select', label: 'Source Type', options: ['Blog Post', 'Video Script', 'Podcast', 'Social Post', 'Email'], required: true },
                { id: 'target_platforms', type: 'select', label: 'Target Platforms', options: ['Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'YouTube', 'All'], required: true }
            ]
        },

        'translator': {
            name: 'Content Translator',
            icon: '🌐',
            category: 'utility',
            description: 'Translate and localize content',
            output: 'Translated content',
            models: 'Gemini 2.5 Pro',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            fields: [
                { id: 'content', type: 'textarea', label: 'Content to Translate', required: true },
                { id: 'source_lang', type: 'select', label: 'Source Language', options: ['Indonesian', 'English', 'Auto-detect'], required: true },
                { id: 'target_lang', type: 'select', label: 'Target Language', options: ['Indonesian', 'English', 'Malay', 'Chinese', 'Japanese', 'Korean', 'Spanish', 'French', 'Arabic'], required: true },
                { id: 'style', type: 'select', label: 'Translation Style', options: ['Literal', 'Localized', 'Creative', 'Formal'], required: true }
            ]
        },

        'grammar-checker': {
            name: 'Grammar & Style Checker',
            icon: '✅',
            category: 'utility',
            description: 'Check and improve writing quality',
            output: 'Corrected content + suggestions',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '3-5 min',
            fields: [
                { id: 'content', type: 'textarea', label: 'Content to Check', required: true },
                { id: 'language', type: 'select', label: 'Language', options: ['Indonesian', 'English'], required: true },
                { id: 'style', type: 'select', label: 'Writing Style', options: ['Formal', 'Casual', 'Academic', 'Business', 'Creative'], required: true }
            ]
        },

        'content-summarizer': {
            name: 'Content Summarizer',
            icon: '📝',
            category: 'utility',
            description: 'Summarize long content into key points',
            output: 'Summary + key points',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '3-5 min',
            fields: [
                { id: 'content', type: 'textarea', label: 'Content to Summarize', required: true },
                { id: 'length', type: 'select', label: 'Summary Length', options: ['1 Paragraph', '3 Bullet Points', '5 Bullet Points', '10 Bullet Points'], required: true },
                { id: 'style', type: 'select', label: 'Style', options: ['Executive Summary', 'Key Takeaways', 'TL;DR', 'Detailed'], required: true }
            ]
        },

        'keyword-research': {
            name: 'Keyword Research Tool',
            icon: '🔑',
            category: 'utility',
            description: 'SEO keyword research and suggestions',
            output: '100 keywords + analysis',
            models: 'Gemini 2.5 Pro',
            difficulty: 'intermediate',
            estimatedTime: '8-12 min',
            fields: [
                { id: 'topic', type: 'text', label: 'Main Topic', required: true },
                { id: 'niche', type: 'text', label: 'Niche/Industry', required: true },
                { id: 'intent', type: 'select', label: 'Search Intent', options: ['Informational', 'Commercial', 'Transactional', 'Navigational', 'All'], required: true },
                { id: 'competition', type: 'select', label: 'Competition Level', options: ['Low', 'Medium', 'High', 'All'], required: true }
            ]
        },

        'content-ideas': {
            name: 'Content Ideas Generator',
            icon: '💡',
            category: 'utility',
            description: 'Generate content ideas for any niche',
            output: '100 content ideas',
            models: 'Gemini 2.5 Pro',
            difficulty: 'beginner',
            estimatedTime: '5-8 min',
            popular: true,
            fields: [
                { id: 'niche', type: 'text', label: 'Niche/Industry', required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Instagram', 'TikTok', 'YouTube', 'Blog', 'LinkedIn', 'All'], required: true },
                { id: 'content_type', type: 'select', label: 'Content Type', options: ['Educational', 'Entertainment', 'Inspirational', 'Promotional', 'All'], required: true },
                { id: 'count', type: 'select', label: 'Ideas Count', options: ['25', '50', '100'], required: true }
            ]
        },

        'engagement-booster': {
            name: 'Engagement Booster',
            icon: '🚀',
            category: 'utility',
            description: 'Questions, polls, and engagement content',
            output: '50 engagement prompts',
            models: 'Gemini 2.5 Flash',
            difficulty: 'beginner',
            estimatedTime: '3-5 min',
            fields: [
                { id: 'niche', type: 'text', label: 'Niche/Industry', required: true },
                { id: 'type', type: 'select', label: 'Engagement Type', options: ['Questions', 'Polls', 'This or That', 'Fill in Blank', 'Challenges', 'All'], required: true },
                { id: 'platform', type: 'select', label: 'Platform', options: ['Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'All'], required: true }
            ]
        },

        // ═══════════════════════════════════════════════════════════════
        // 📦 COMPLETE PACKAGES (5 Workflows)
        // ═══════════════════════════════════════════════════════════════

        'complete-package': {
            name: 'Complete Content Package',
            icon: '📦',
            category: 'complete',
            description: 'Generate ALL content types from 1 topic',
            output: 'Everything (Text + Image + Video + Audio)',
            models: 'All Models',
            difficulty: 'advanced',
            estimatedTime: '60+ min',
            isPro: true,
            popular: true,
            fields: [
                { id: 'topic', type: 'text', label: 'Main Topic/Campaign', required: true },
                { id: 'brand_name', type: 'text', label: 'Brand Name', required: true },
                { id: 'platforms', type: 'select', label: 'Platforms', options: ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'All'], required: true },
                { id: 'quantity', type: 'select', label: 'Output Quantity', options: ['Standard (5 each)', 'Pro (10 each)', 'Enterprise (20 each)'], required: true }
            ]
        },

        'startup-kit': {
            name: 'Startup Launch Kit',
            icon: '🚀',
            category: 'complete',
            description: 'Everything a startup needs to launch',
            output: 'Complete startup package',
            models: 'All Models',
            difficulty: 'advanced',
            estimatedTime: '90+ min',
            isPro: true,
            fields: [
                { id: 'startup_name', type: 'text', label: 'Startup Name', required: true },
                { id: 'industry', type: 'text', label: 'Industry', required: true },
                { id: 'product', type: 'text', label: 'Product/Service', required: true },
                { id: 'target_audience', type: 'text', label: 'Target Audience', required: true }
            ]
        },

        'influencer-kit': {
            name: 'Influencer Starter Kit',
            icon: '⭐',
            category: 'complete',
            description: 'Everything to start as an influencer',
            output: 'Complete influencer package',
            models: 'All Models',
            difficulty: 'intermediate',
            estimatedTime: '45-60 min',
            isPro: true,
            fields: [
                { id: 'name', type: 'text', label: 'Your Name/Brand', required: true },
                { id: 'niche', type: 'text', label: 'Niche', required: true },
                { id: 'platforms', type: 'select', label: 'Main Platforms', options: ['Instagram', 'TikTok', 'YouTube', 'All'], required: true },
                { id: 'style', type: 'select', label: 'Content Style', options: ['Educational', 'Entertainment', 'Lifestyle', 'Review', 'Mixed'], required: true }
            ]
        },

        'ecommerce-kit': {
            name: 'E-commerce Launch Kit',
            icon: '🛒',
            category: 'complete',
            description: 'Complete e-commerce content package',
            output: 'Full e-commerce package',
            models: 'All Models',
            difficulty: 'advanced',
            estimatedTime: '60+ min',
            isPro: true,
            fields: [
                { id: 'store_name', type: 'text', label: 'Store Name', required: true },
                { id: 'category', type: 'select', label: 'Product Category', options: ['Fashion', 'Beauty', 'Electronics', 'Home', 'Food', 'Health', 'Other'], required: true },
                { id: 'products', type: 'text', label: 'Main Products', required: true },
                { id: 'platforms', type: 'select', label: 'Sales Platforms', options: ['Shopify', 'Tokopedia', 'Shopee', 'Amazon', 'All'], required: true }
            ]
        },

        'agency-kit': {
            name: 'Agency Client Kit',
            icon: '🏢',
            category: 'complete',
            description: 'Complete client deliverable package',
            output: 'Full agency deliverables',
            models: 'All Models',
            difficulty: 'advanced',
            estimatedTime: '90+ min',
            isPro: true,
            fields: [
                { id: 'client_name', type: 'text', label: 'Client Name', required: true },
                { id: 'industry', type: 'text', label: 'Client Industry', required: true },
                { id: 'services', type: 'select', label: 'Services', options: ['Social Media', 'Content Marketing', 'Branding', 'Ads', 'Full Service'], required: true },
                { id: 'duration', type: 'select', label: 'Contract Duration', options: ['1 Month', '3 Months', '6 Months', '12 Months'], required: true }
            ]
        }
    },


    // ==================== CATEGORIES ====================
    categories: [
        { id: 'all', name: 'All Tools', icon: '🌟', color: '#6366f1' },
        { id: 'popular', name: 'Popular', icon: '🔥', color: '#ef4444' },
        { id: 'text', name: 'Text', icon: '📝', color: '#3b82f6' },
        { id: 'image', name: 'Image', icon: '🖼️', color: '#8b5cf6' },
        { id: 'video', name: 'Video', icon: '🎬', color: '#ec4899' },
        { id: 'audio', name: 'Audio', icon: '🎙️', color: '#f59e0b' },
        { id: 'marketing', name: 'Marketing', icon: '📢', color: '#10b981' },
        { id: 'branding', name: 'Branding', icon: '🎨', color: '#6366f1' },
        { id: 'utility', name: 'Utility', icon: '🔧', color: '#64748b' },
        { id: 'complete', name: 'Complete', icon: '📦', color: '#f97316' }
    ],

    // ==================== INITIALIZATION ====================
    init() {
        this.renderCategories();
        this.renderWorkflows();
        this.refreshContentList();
        this.setupSearch();
        this.loadFavorites();
    },

    // ==================== SEARCH FUNCTIONALITY ====================
    setupSearch() {
        const searchInput = document.getElementById('magic-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderWorkflows();
            });
        }
    },

    // ==================== FAVORITES ====================
    loadFavorites() {
        this.favorites = JSON.parse(localStorage.getItem('magicStudioFavorites') || '[]');
    },

    toggleFavorite(workflowId) {
        const index = this.favorites.indexOf(workflowId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(workflowId);
        }
        localStorage.setItem('magicStudioFavorites', JSON.stringify(this.favorites));
        this.renderWorkflows();
        if (typeof showToast !== 'undefined') {
            showToast(index > -1 ? 'Removed from favorites' : 'Added to favorites', 'success');
        }
    },

    // ==================== RECENTLY USED ====================
    addToRecent(workflowId) {
        this.recentlyUsed = this.recentlyUsed.filter(id => id !== workflowId);
        this.recentlyUsed.unshift(workflowId);
        if (this.recentlyUsed.length > 10) this.recentlyUsed.pop();
        localStorage.setItem('magicStudioRecent', JSON.stringify(this.recentlyUsed));
    },

    // ==================== CONTENT HUB INTEGRATION ====================
    refreshContentList() {
        const select = document.getElementById('magic-content-select');
        if (!select || typeof DB === 'undefined') return;
        
        const contents = DB.content.getAll();
        select.innerHTML = '<option value="">Select existing content to enhance...</option>' + 
            contents.map(c => {
                const type = typeof Config !== 'undefined' ? Config.getType(c.contentType) : { name: c.contentType, icon: '📄' };
                return `<option value="${c.id}">${c.title || 'Untitled'} (${type.name})</option>`;
            }).join('');
    },

    loadFromHub(contentId) {
        if (!contentId || typeof DB === 'undefined') {
            this.loadedContent = null;
            const loadedDiv = document.getElementById('magic-loaded-content');
            if (loadedDiv) loadedDiv.style.display = 'none';
            return;
        }
        
        const content = DB.content.getById(contentId);
        if (!content) return;
        
        this.loadedContent = content;
        const loadedDiv = document.getElementById('magic-loaded-content');
        if (loadedDiv) {
            loadedDiv.style.display = 'block';
            document.getElementById('magic-loaded-title').textContent = content.title || 'Untitled';
        }
        
        if (typeof showToast !== 'undefined') {
            showToast(`Loaded: ${content.title}. Select a workflow to enhance it.`, 'success');
        }
    },

    // ==================== RENDER CATEGORIES ====================
    renderCategories() {
        const container = document.getElementById('magic-studio-categories');
        if (!container) return;

        const counts = {};
        this.categories.forEach(cat => {
            if (cat.id === 'all') {
                counts[cat.id] = Object.keys(this.workflows).length;
            } else if (cat.id === 'popular') {
                counts[cat.id] = Object.values(this.workflows).filter(w => w.popular).length;
            } else {
                counts[cat.id] = Object.values(this.workflows).filter(w => w.category === cat.id).length;
            }
        });

        container.innerHTML = this.categories.map(cat => `
            <button class="category-btn ${this.currentCategory === cat.id ? 'active' : ''}" 
                    data-category="${cat.id}"
                    onclick="MagicStudioUltra.filterCategory('${cat.id}')"
                    style="padding:10px 18px;border-radius:25px;border:2px solid ${this.currentCategory === cat.id ? cat.color : 'var(--border)'};background:${this.currentCategory === cat.id ? cat.color : 'var(--bg-card)'};color:${this.currentCategory === cat.id ? 'white' : 'var(--text-primary)'};cursor:pointer;font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;transition:all 0.3s ease;box-shadow:${this.currentCategory === cat.id ? '0 4px 12px ' + cat.color + '40' : 'none'};"
                    onmouseover="if('${this.currentCategory}' !== '${cat.id}') { this.style.borderColor='${cat.color}'; this.style.transform='translateY(-2px)'; }"
                    onmouseout="if('${this.currentCategory}' !== '${cat.id}') { this.style.borderColor='var(--border)'; this.style.transform='none'; }">
                <span style="font-size:16px;">${cat.icon}</span>
                <span>${cat.name}</span>
                <span style="background:${this.currentCategory === cat.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-muted)'};padding:3px 8px;border-radius:12px;font-size:11px;font-weight:600;">${counts[cat.id]}</span>
            </button>
        `).join('');
    },

    // ==================== FILTER CATEGORY ====================
    filterCategory(categoryId) {
        this.currentCategory = categoryId;
        this.renderCategories();
        this.renderWorkflows();
    },

    // ==================== RENDER WORKFLOWS ====================
    renderWorkflows() {
        const container = document.getElementById('magic-studio-grid');
        if (!container) return;

        let filteredWorkflows = Object.entries(this.workflows);

        // Filter by category
        if (this.currentCategory === 'popular') {
            filteredWorkflows = filteredWorkflows.filter(([id, w]) => w.popular);
        } else if (this.currentCategory !== 'all') {
            filteredWorkflows = filteredWorkflows.filter(([id, w]) => w.category === this.currentCategory);
        }

        // Filter by search
        if (this.searchQuery) {
            filteredWorkflows = filteredWorkflows.filter(([id, w]) => 
                w.name.toLowerCase().includes(this.searchQuery) ||
                w.description.toLowerCase().includes(this.searchQuery) ||
                w.category.toLowerCase().includes(this.searchQuery)
            );
        }

        if (filteredWorkflows.length === 0) {
            container.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
                    <div style="font-size:48px;margin-bottom:16px;">🔍</div>
                    <h3 style="font-size:18px;margin-bottom:8px;color:var(--text-primary);">No workflows found</h3>
                    <p>Try a different search term or category</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredWorkflows.map(([id, workflow]) => {
            const isFavorite = this.favorites.includes(id);
            const difficultyColors = {
                beginner: '#10b981',
                intermediate: '#f59e0b',
                advanced: '#ef4444'
            };
            const difficultyColor = difficultyColors[workflow.difficulty] || '#64748b';

            return `
                <div class="workflow-card ${workflow.isPro ? 'pro-workflow' : ''}" 
                     style="background:var(--bg-card);padding:20px;border-radius:16px;cursor:pointer;border:2px solid var(--border);transition:all 0.3s ease;position:relative;display:flex;flex-direction:column;"
                     onmouseover="this.style.borderColor='var(--primary)';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,0.15)'" 
                     onmouseout="this.style.borderColor='var(--border)';this.style.transform='none';this.style.boxShadow='none'">
                    
                    <!-- Top badges -->
                    <div style="position:absolute;top:12px;right:12px;display:flex;gap:6px;">
                        ${workflow.isPro ? '<span style="background:linear-gradient(135deg,#FFD700,#FFA500);color:#000;padding:4px 10px;border-radius:6px;font-size:10px;font-weight:bold;">PRO</span>' : ''}
                        ${workflow.popular ? '<span style="background:#ef4444;color:white;padding:4px 10px;border-radius:6px;font-size:10px;font-weight:bold;">🔥 HOT</span>' : ''}
                    </div>
                    
                    <!-- Favorite button -->
                    <button onclick="event.stopPropagation();MagicStudioUltra.toggleFavorite('${id}')" 
                            style="position:absolute;top:12px;left:12px;background:none;border:none;cursor:pointer;font-size:18px;opacity:${isFavorite ? '1' : '0.3'};transition:opacity 0.2s;"
                            onmouseover="this.style.opacity='1'" 
                            onmouseout="this.style.opacity='${isFavorite ? '1' : '0.3'}'">
                        ${isFavorite ? '⭐' : '☆'}
                    </button>
                    
                    <!-- Icon -->
                    <div style="font-size:42px;margin:20px 0 16px;text-align:center;">${workflow.icon}</div>
                    
                    <!-- Name -->
                    <h3 style="font-size:15px;font-weight:600;color:var(--text-primary);margin-bottom:8px;text-align:center;">${workflow.name}</h3>
                    
                    <!-- Description -->
                    <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;line-height:1.5;text-align:center;flex-grow:1;">${workflow.description}</p>
                    
                    <!-- Output badge -->
                    <div style="background:var(--bg-muted);padding:8px 12px;border-radius:8px;margin-bottom:12px;">
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:2px;">Output:</div>
                        <div style="font-size:12px;font-weight:600;color:var(--primary);">${workflow.output}</div>
                    </div>
                    
                    <!-- Meta info -->
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;color:var(--text-muted);padding-top:12px;border-top:1px solid var(--border);">
                        <span style="display:flex;align-items:center;gap:4px;">
                            <span style="width:8px;height:8px;border-radius:50%;background:${difficultyColor};"></span>
                            ${workflow.difficulty}
                        </span>
                        <span>⏱️ ${workflow.estimatedTime}</span>
                    </div>
                    
                    <!-- Click overlay -->
                    <div onclick="MagicStudioUltra.openWorkflow('${id}')" style="position:absolute;inset:0;cursor:pointer;"></div>
                </div>
            `;
        }).join('');
    },

    // ==================== OPEN WORKFLOW ====================
    openWorkflow(workflowId) {
        const workflow = this.workflows[workflowId];
        if (!workflow) return;

        this.currentWorkflow = workflowId;
        this.addToRecent(workflowId);

        const modal = document.getElementById('magic-workflow-modal');
        if (!modal) return;

        const difficultyColors = {
            beginner: '#10b981',
            intermediate: '#f59e0b',
            advanced: '#ef4444'
        };

        modal.innerHTML = `
            <div style="background:var(--bg-card);border-radius:20px;max-width:700px;width:95%;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 25px 50px rgba(0,0,0,0.25);">
                <!-- Header -->
                <div style="background:linear-gradient(135deg,var(--primary),var(--primary-dark,#4f46e5));padding:28px;border-radius:20px 20px 0 0;color:white;">
                    <button onclick="MagicStudioUltra.closeWorkflow()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.2);border:none;color:white;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">&times;</button>
                    
                    <div style="display:flex;align-items:center;gap:16px;">
                        <div style="font-size:52px;">${workflow.icon}</div>
                        <div>
                            <h2 style="font-size:22px;font-weight:700;margin-bottom:6px;">${workflow.name}</h2>
                            <p style="font-size:14px;opacity:0.9;">${workflow.description}</p>
                        </div>
                    </div>
                    
                    <!-- Meta badges -->
                    <div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap;">
                        <span style="background:rgba(255,255,255,0.2);padding:6px 14px;border-radius:20px;font-size:12px;">
                            📦 ${workflow.output}
                        </span>
                        <span style="background:rgba(255,255,255,0.2);padding:6px 14px;border-radius:20px;font-size:12px;">
                            🤖 ${workflow.models}
                        </span>
                        <span style="background:rgba(255,255,255,0.2);padding:6px 14px;border-radius:20px;font-size:12px;">
                            ⏱️ ${workflow.estimatedTime}
                        </span>
                        <span style="background:${difficultyColors[workflow.difficulty]};padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;">
                            ${workflow.difficulty.toUpperCase()}
                        </span>
                    </div>
                </div>
                
                <!-- Form -->
                <div style="padding:28px;">
                    <form id="magic-workflow-form" onsubmit="event.preventDefault();MagicStudioUltra.generatePrompt();">
                        ${workflow.fields.map(field => this.renderField(field)).join('')}
                        
                        <!-- Generate Button -->
                        <button type="submit" style="width:100%;padding:16px;background:linear-gradient(135deg,var(--primary),var(--primary-dark,#4f46e5));color:white;border:none;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;margin-top:20px;display:flex;align-items:center;justify-content:center;gap:10px;transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 20px rgba(99,102,241,0.4)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">
                            <span style="font-size:20px;">✨</span>
                            Generate AI Prompt
                        </button>
                    </form>
                    
                    <!-- Generated Prompt Output -->
                    <div id="magic-prompt-output" style="display:none;margin-top:24px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                            <h3 style="font-size:16px;font-weight:600;color:var(--text-primary);">📋 Generated Prompt</h3>
                            <div style="display:flex;gap:8px;">
                                <button onclick="MagicStudioUltra.copyPrompt()" style="padding:8px 16px;background:var(--bg-muted);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:6px;transition:all 0.2s;" onmouseover="this.style.background='var(--primary)';this.style.color='white'" onmouseout="this.style.background='var(--bg-muted)';this.style.color='inherit'">
                                    📋 Copy
                                </button>
                                <button onclick="MagicStudioUltra.openInOpal()" style="padding:8px 16px;background:linear-gradient(135deg,#4285f4,#34a853);color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:6px;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='none'">
                                    🚀 Open in Google Opal
                                </button>
                            </div>
                        </div>
                        <div id="magic-prompt-text" style="background:var(--bg-muted);padding:20px;border-radius:12px;font-family:monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;max-height:400px;overflow-y:auto;border:1px solid var(--border);"></div>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        document.body.style.overflow = 'hidden';
    },

    // ==================== RENDER FORM FIELD ====================
    renderField(field) {
        const baseStyle = `
            width:100%;
            padding:14px 16px;
            border:2px solid var(--border);
            border-radius:10px;
            font-size:14px;
            background:var(--bg-input);
            color:var(--text-primary);
            transition:border-color 0.2s,box-shadow 0.2s;
        `;
        const focusStyle = `onfocus="this.style.borderColor='var(--primary)';this.style.boxShadow='0 0 0 3px rgba(99,102,241,0.1)'" onblur="this.style.borderColor='var(--border)';this.style.boxShadow='none'"`;

        let input = '';
        
        switch (field.type) {
            case 'text':
                input = `<input type="text" id="${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} style="${baseStyle}" ${focusStyle}>`;
                break;
            case 'textarea':
                input = `<textarea id="${field.id}" name="${field.id}" rows="4" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} style="${baseStyle}resize:vertical;min-height:100px;" ${focusStyle}></textarea>`;
                break;
            case 'select':
                input = `
                    <select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} style="${baseStyle}cursor:pointer;" ${focusStyle}>
                        <option value="">Select ${field.label}...</option>
                        ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                `;
                break;
            case 'checkbox':
                input = `
                    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                        <input type="checkbox" id="${field.id}" name="${field.id}" ${field.default ? 'checked' : ''} style="width:20px;height:20px;cursor:pointer;">
                        <span style="font-size:14px;color:var(--text-primary);">${field.label}</span>
                    </label>
                `;
                return `<div style="margin-bottom:16px;">${input}</div>`;
        }

        return `
            <div style="margin-bottom:20px;">
                <label style="display:block;font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:8px;">
                    ${field.label} ${field.required ? '<span style="color:#ef4444;">*</span>' : ''}
                </label>
                ${input}
            </div>
        `;
    },

    // ==================== CLOSE WORKFLOW ====================
    closeWorkflow() {
        const modal = document.getElementById('magic-workflow-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        this.currentWorkflow = null;
        this.generatedPrompt = '';
    },

    // ==================== GENERATE PROMPT ====================
    generatePrompt() {
        const workflow = this.workflows[this.currentWorkflow];
        if (!workflow) return;

        const form = document.getElementById('magic-workflow-form');
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Check checkboxes manually
        workflow.fields.filter(f => f.type === 'checkbox').forEach(field => {
            data[field.id] = document.getElementById(field.id)?.checked || false;
        });

        // Generate the prompt based on workflow
        this.generatedPrompt = this.buildPrompt(workflow, data);

        // Show output
        const outputDiv = document.getElementById('magic-prompt-output');
        const promptText = document.getElementById('magic-prompt-text');
        
        if (outputDiv && promptText) {
            promptText.textContent = this.generatedPrompt;
            outputDiv.style.display = 'block';
            outputDiv.scrollIntoView({ behavior: 'smooth' });
        }

        if (typeof showToast !== 'undefined') {
            showToast('Prompt generated successfully! 🎉', 'success');
        }
    },


    // ==================== BUILD PROMPT ====================
    buildPrompt(workflow, data) {
        const workflowId = this.currentWorkflow;
        
        // Base context
        let prompt = `# ${workflow.name}\n\n`;
        prompt += `## Context\n`;
        prompt += `You are an expert AI assistant specialized in ${workflow.category} content creation.\n`;
        prompt += `Your task is to generate high-quality, professional content based on the following specifications.\n\n`;
        
        // User inputs
        prompt += `## Input Parameters\n`;
        workflow.fields.forEach(field => {
            if (data[field.id]) {
                prompt += `- **${field.label}**: ${data[field.id]}\n`;
            }
        });
        prompt += `\n`;

        // Loaded content from Hub
        if (this.loadedContent) {
            prompt += `## Reference Content (from Content Hub)\n`;
            prompt += `Title: ${this.loadedContent.title || 'Untitled'}\n`;
            prompt += `Type: ${this.loadedContent.contentType}\n`;
            if (this.loadedContent.content) {
                prompt += `Content:\n${this.loadedContent.content.substring(0, 500)}${this.loadedContent.content.length > 500 ? '...' : ''}\n`;
            }
            prompt += `\n`;
        }

        // Workflow-specific instructions
        prompt += `## Output Requirements\n`;
        prompt += `Expected Output: ${workflow.output}\n\n`;

        // Category-specific prompts
        switch (workflow.category) {
            case 'text':
                prompt += this.getTextPromptInstructions(workflowId, data);
                break;
            case 'image':
                prompt += this.getImagePromptInstructions(workflowId, data);
                break;
            case 'video':
                prompt += this.getVideoPromptInstructions(workflowId, data);
                break;
            case 'audio':
                prompt += this.getAudioPromptInstructions(workflowId, data);
                break;
            case 'marketing':
                prompt += this.getMarketingPromptInstructions(workflowId, data);
                break;
            case 'branding':
                prompt += this.getBrandingPromptInstructions(workflowId, data);
                break;
            case 'utility':
                prompt += this.getUtilityPromptInstructions(workflowId, data);
                break;
            case 'complete':
                prompt += this.getCompletePromptInstructions(workflowId, data);
                break;
        }

        // Quality guidelines
        prompt += `\n## Quality Guidelines\n`;
        prompt += `1. Ensure all content is original and plagiarism-free\n`;
        prompt += `2. Maintain consistent tone and style throughout\n`;
        prompt += `3. Optimize for the target platform and audience\n`;
        prompt += `4. Include actionable and engaging elements\n`;
        prompt += `5. Follow best practices for ${workflow.category} content\n`;

        return prompt;
    },

    // ==================== TEXT PROMPT INSTRUCTIONS ====================
    getTextPromptInstructions(workflowId, data) {
        let instructions = `## Detailed Instructions\n\n`;
        
        switch (workflowId) {
            case 'seo-article-pro':
                instructions += `### SEO Article Generation\n`;
                instructions += `Generate 10 unique, SEO-optimized articles following these guidelines:\n\n`;
                instructions += `**For each article:**\n`;
                instructions += `1. Create a compelling, keyword-rich title (60 characters max)\n`;
                instructions += `2. Write a meta description (155 characters max)\n`;
                instructions += `3. Structure with H2 and H3 headings\n`;
                instructions += `4. Include the target keywords naturally (2-3% density)\n`;
                instructions += `5. Add internal linking suggestions\n`;
                instructions += `6. Include a FAQ section with 5 questions\n`;
                instructions += `7. Generate schema markup (Article schema)\n\n`;
                instructions += `**E-E-A-T Compliance:**\n`;
                instructions += `- Demonstrate Experience with real examples\n`;
                instructions += `- Show Expertise through detailed explanations\n`;
                instructions += `- Build Authoritativeness with data and sources\n`;
                instructions += `- Establish Trustworthiness with accurate information\n\n`;
                instructions += `**Platform Adaptations:**\n`;
                instructions += `Create versions for: LinkedIn Article, Medium, Blog, Newsletter, Twitter Thread, Instagram Carousel, Facebook Post\n`;
                break;

            case 'viral-thread':
                instructions += `### Viral Thread Generation\n`;
                instructions += `Generate 15 viral Twitter/X threads with these elements:\n\n`;
                instructions += `**Thread Structure:**\n`;
                instructions += `1. Hook tweet (stop the scroll)\n`;
                instructions += `2. Context/setup tweet\n`;
                instructions += `3. Main content tweets (${data.tweet_count || '10'} tweets)\n`;
                instructions += `4. Summary/takeaway tweet\n`;
                instructions += `5. CTA tweet with engagement prompt\n\n`;
                instructions += `**Hook Formulas to Use:**\n`;
                instructions += `- "I spent X hours/days/years studying Y. Here's what I learned:"\n`;
                instructions += `- "Most people don't know this about X:"\n`;
                instructions += `- "X changed my life. Here's how:"\n`;
                instructions += `- "Stop doing X. Do Y instead:"\n`;
                instructions += `- "The truth about X that nobody talks about:"\n\n`;
                instructions += `**Engagement Elements:**\n`;
                instructions += `- Use numbers and statistics\n`;
                instructions += `- Include contrarian takes\n`;
                instructions += `- Add visual breaks (emojis, line breaks)\n`;
                instructions += `- End with questions or polls\n\n`;
                instructions += `**Reply Templates:**\n`;
                instructions += `Generate 50 reply templates for common responses\n`;
                break;

            case 'script-writer':
                instructions += `### Script Writing\n`;
                instructions += `Generate 5 professional scripts with:\n\n`;
                instructions += `**Script Format:**\n`;
                instructions += `- Timestamp markers\n`;
                instructions += `- Speaker/narrator cues\n`;
                instructions += `- Tone/emotion directions\n`;
                instructions += `- Pause indicators\n`;
                instructions += `- Emphasis markers\n\n`;
                instructions += `**Production Notes:**\n`;
                instructions += `- B-roll suggestions with timestamps\n`;
                instructions += `- Music cue recommendations\n`;
                instructions += `- Sound effect placements\n`;
                instructions += `- Visual transition suggestions\n`;
                instructions += `- Lower third text suggestions\n\n`;
                instructions += `**Structure:**\n`;
                instructions += `1. Hook (first 3-5 seconds)\n`;
                instructions += `2. Introduction\n`;
                instructions += `3. Main content sections\n`;
                instructions += `4. Recap/summary\n`;
                instructions += `5. Call-to-action\n`;
                break;

            case 'hook-generator':
                instructions += `### Hook Generation\n`;
                instructions += `Generate 50 viral hooks using proven frameworks:\n\n`;
                instructions += `**AIDA Framework (10 hooks):**\n`;
                instructions += `- Attention: Grab with bold statement\n`;
                instructions += `- Interest: Build curiosity\n`;
                instructions += `- Desire: Create want\n`;
                instructions += `- Action: Drive behavior\n\n`;
                instructions += `**PAS Framework (10 hooks):**\n`;
                instructions += `- Problem: Identify pain point\n`;
                instructions += `- Agitate: Amplify the problem\n`;
                instructions += `- Solution: Present the answer\n\n`;
                instructions += `**4U Framework (10 hooks):**\n`;
                instructions += `- Useful: Provide value\n`;
                instructions += `- Urgent: Create time pressure\n`;
                instructions += `- Unique: Stand out\n`;
                instructions += `- Ultra-specific: Be precise\n\n`;
                instructions += `**Additional Hooks (20):**\n`;
                instructions += `- Question hooks\n`;
                instructions += `- Statistic hooks\n`;
                instructions += `- Story hooks\n`;
                instructions += `- Controversy hooks\n`;
                instructions += `- Curiosity gap hooks\n\n`;
                instructions += `**A/B Test Variants:**\n`;
                instructions += `For each hook, provide 2 alternative versions for testing\n`;
                break;

            default:
                instructions += `Generate high-quality ${data.type || 'text'} content following best practices.\n`;
                instructions += `Ensure the content is engaging, well-structured, and optimized for the target platform.\n`;
        }

        return instructions;
    },

    // ==================== IMAGE PROMPT INSTRUCTIONS ====================
    getImagePromptInstructions(workflowId, data) {
        let instructions = `## Image Generation Instructions\n\n`;
        instructions += `**Model**: Imagen 4 (Google's latest image generation model)\n\n`;
        
        switch (workflowId) {
            case 'carousel-master':
                instructions += `### Carousel Image Generation\n`;
                instructions += `Generate ${data.slide_count || '10'} carousel slides with 5 style variations each.\n\n`;
                instructions += `**Slide Structure:**\n`;
                instructions += `1. Cover slide (attention-grabbing)\n`;
                instructions += `2-${(parseInt(data.slide_count) || 10) - 1}. Content slides\n`;
                instructions += `${data.slide_count || '10'}. CTA slide\n\n`;
                instructions += `**Style Variations:**\n`;
                instructions += `1. Minimalist (clean, lots of white space)\n`;
                instructions += `2. Bold & Colorful (vibrant, high contrast)\n`;
                instructions += `3. Professional (corporate, trustworthy)\n`;
                instructions += `4. Gradient (modern, trendy)\n`;
                instructions += `5. Photo-based (real imagery with overlays)\n\n`;
                instructions += `**Technical Specs:**\n`;
                instructions += `- Size: 1080x1350px (4:5 ratio for Instagram)\n`;
                instructions += `- Format: PNG with transparency support\n`;
                instructions += `- Text: Clear, readable typography\n`;
                instructions += `- Brand colors: ${data.brand_colors || 'Use complementary colors'}\n`;
                break;

            case 'product-photoshoot':
                instructions += `### Product Photography Generation\n`;
                instructions += `Generate 30+ professional product photos.\n\n`;
                instructions += `**Shot Types:**\n`;
                instructions += `1. Hero shot (main product image)\n`;
                instructions += `2. Detail shots (close-ups of features)\n`;
                instructions += `3. Lifestyle shots (product in use)\n`;
                instructions += `4. Scale shots (size reference)\n`;
                instructions += `5. Group shots (multiple angles)\n`;
                instructions += `6. Packaging shots\n\n`;
                instructions += `**Lighting Setup:**\n`;
                instructions += `- ${data.lighting || 'Soft studio'} lighting\n`;
                instructions += `- Consistent shadows\n`;
                instructions += `- Highlight product features\n\n`;
                instructions += `**Background:**\n`;
                instructions += `- ${data.background || 'White studio'}\n`;
                instructions += `- Clean, distraction-free\n`;
                instructions += `- Consistent across all shots\n\n`;
                instructions += `**Technical Specs:**\n`;
                instructions += `- Resolution: 4K (3840x2160) minimum\n`;
                instructions += `- Format: PNG/JPEG high quality\n`;
                instructions += `- Color profile: sRGB for web\n`;
                break;

            case 'thumbnail-generator':
                instructions += `### Thumbnail Generation\n`;
                instructions += `Generate 20 click-worthy thumbnails.\n\n`;
                instructions += `**Thumbnail Elements:**\n`;
                instructions += `1. Bold, readable text (3-5 words max)\n`;
                instructions += `2. High contrast colors\n`;
                instructions += `3. Emotional expression (if face included)\n`;
                instructions += `4. Clear focal point\n`;
                instructions += `5. Brand consistency\n\n`;
                instructions += `**Style: ${data.style || 'Face + Text'}**\n\n`;
                instructions += `**Emotion: ${data.emotion || 'Curiosity'}**\n\n`;
                instructions += `**Technical Specs:**\n`;
                instructions += `- YouTube: 1280x720px\n`;
                instructions += `- Blog: 1200x630px\n`;
                instructions += `- Course: 1920x1080px\n`;
                break;

            default:
                instructions += `Generate high-quality images following the specified style and requirements.\n`;
                instructions += `Ensure images are:\n`;
                instructions += `- High resolution (minimum 1080p)\n`;
                instructions += `- Properly composed\n`;
                instructions += `- Color-corrected\n`;
                instructions += `- Ready for immediate use\n`;
        }

        return instructions;
    },

    // ==================== VIDEO PROMPT INSTRUCTIONS ====================
    getVideoPromptInstructions(workflowId, data) {
        let instructions = `## Video Generation Instructions\n\n`;
        instructions += `**Model**: Veo (Google's video generation model)\n\n`;
        
        switch (workflowId) {
            case 'short-video':
                instructions += `### Short-Form Video Generation\n`;
                instructions += `Generate 10 short videos optimized for ${data.platform || 'all platforms'}.\n\n`;
                instructions += `**Video Structure:**\n`;
                instructions += `1. Hook (0-3 seconds) - Stop the scroll\n`;
                instructions += `2. Content (main message)\n`;
                instructions += `3. CTA (final seconds)\n\n`;
                instructions += `**Technical Specs:**\n`;
                instructions += `- Duration: ${data.duration || '30 sec'}\n`;
                instructions += `- Aspect ratio: 9:16 (vertical)\n`;
                instructions += `- Resolution: 1080x1920\n`;
                instructions += `- Frame rate: 30fps\n\n`;
                instructions += `**Audio:**\n`;
                instructions += `- Background music (trending sounds)\n`;
                instructions += `- Voiceover script\n`;
                instructions += `- Sound effects\n\n`;
                instructions += `**Platform Optimization:**\n`;
                instructions += `- TikTok: Trendy, fast-paced\n`;
                instructions += `- Reels: Polished, aesthetic\n`;
                instructions += `- Shorts: Educational, value-driven\n`;
                break;

            case 'youtube-video':
                instructions += `### YouTube Video Package\n`;
                instructions += `Generate complete YouTube video assets.\n\n`;
                instructions += `**Deliverables:**\n`;
                instructions += `1. Full script with timestamps\n`;
                instructions += `2. 10 thumbnail variations\n`;
                instructions += `3. B-roll shot list\n`;
                instructions += `4. Music recommendations\n`;
                instructions += `5. SEO package (title, description, tags)\n\n`;
                instructions += `**Script Structure:**\n`;
                instructions += `- Hook (0-30 sec)\n`;
                instructions += `- Intro (30 sec - 1 min)\n`;
                instructions += `- Main content (segmented)\n`;
                instructions += `- Recap\n`;
                instructions += `- CTA + End screen\n\n`;
                instructions += `**Duration: ${data.duration || '10 min'}**\n`;
                break;

            default:
                instructions += `Generate professional video content with:\n`;
                instructions += `- Clear narrative structure\n`;
                instructions += `- Engaging visuals\n`;
                instructions += `- Appropriate pacing\n`;
                instructions += `- Platform-optimized format\n`;
        }

        return instructions;
    },

    // ==================== AUDIO PROMPT INSTRUCTIONS ====================
    getAudioPromptInstructions(workflowId, data) {
        let instructions = `## Audio Generation Instructions\n\n`;
        instructions += `**Models**: AudioLM + Lyria 2\n\n`;
        
        switch (workflowId) {
            case 'podcast-creator':
                instructions += `### Podcast Episode Creation\n`;
                instructions += `Generate complete podcast episode package.\n\n`;
                instructions += `**Deliverables:**\n`;
                instructions += `1. Full episode script\n`;
                instructions += `2. Intro music (15-30 sec)\n`;
                instructions += `3. Outro music (15-30 sec)\n`;
                instructions += `4. Transition sounds\n`;
                instructions += `5. AI voiceover\n\n`;
                instructions += `**Episode Structure:**\n`;
                instructions += `- Cold open/teaser\n`;
                instructions += `- Intro + music\n`;
                instructions += `- Main content segments\n`;
                instructions += `- Ad break markers\n`;
                instructions += `- Outro + CTA\n\n`;
                instructions += `**Duration: ${data.duration || '30 min'}**\n`;
                instructions += `**Style: ${data.style || 'Solo'}**\n`;
                break;

            case 'music-generator':
                instructions += `### Music Generation\n`;
                instructions += `Generate 10 custom music tracks.\n\n`;
                instructions += `**Specifications:**\n`;
                instructions += `- Mood: ${data.mood || 'Happy'}\n`;
                instructions += `- Genre: ${data.genre || 'Pop'}\n`;
                instructions += `- Duration: ${data.duration || '60 sec'}\n`;
                instructions += `- Tempo: ${data.tempo || 'Medium'}\n\n`;
                instructions += `**Track Variations:**\n`;
                instructions += `- Full version\n`;
                instructions += `- Loop version\n`;
                instructions += `- Stems (drums, melody, bass)\n`;
                instructions += `- Short version (15 sec)\n`;
                break;

            default:
                instructions += `Generate high-quality audio content with:\n`;
                instructions += `- Clear audio quality\n`;
                instructions += `- Appropriate volume levels\n`;
                instructions += `- Professional mixing\n`;
                instructions += `- Format: MP3/WAV\n`;
        }

        return instructions;
    },

    // ==================== MARKETING PROMPT INSTRUCTIONS ====================
    getMarketingPromptInstructions(workflowId, data) {
        let instructions = `## Marketing Content Instructions\n\n`;
        
        switch (workflowId) {
            case 'social-media-kit':
                instructions += `### Complete Social Media Kit\n`;
                instructions += `Generate 100+ assets for ${data.platforms || 'all platforms'}.\n\n`;
                instructions += `**Content Types:**\n`;
                instructions += `1. Feed posts (20)\n`;
                instructions += `2. Stories (20)\n`;
                instructions += `3. Reels/TikToks scripts (10)\n`;
                instructions += `4. Carousels (10)\n`;
                instructions += `5. Captions (50)\n`;
                instructions += `6. Hashtag sets (10)\n`;
                instructions += `7. Bio variations (5)\n`;
                instructions += `8. Highlight covers (10)\n\n`;
                instructions += `**Brand Guidelines:**\n`;
                instructions += `- Tone: ${data.tone || 'Professional'}\n`;
                instructions += `- Campaign: ${data.campaign || 'General'}\n`;
                instructions += `- Duration: ${data.duration || '1 Month'}\n`;
                break;

            case 'content-calendar':
                instructions += `### Content Calendar Generation\n`;
                instructions += `Generate ${data.duration || '30'}-day content calendar.\n\n`;
                instructions += `**Calendar Structure:**\n`;
                instructions += `For each day include:\n`;
                instructions += `- Content type\n`;
                instructions += `- Topic/theme\n`;
                instructions += `- Caption draft\n`;
                instructions += `- Hashtags\n`;
                instructions += `- Best posting time\n`;
                instructions += `- Visual direction\n\n`;
                instructions += `**Content Mix:**\n`;
                instructions += `- Educational: 40%\n`;
                instructions += `- Entertainment: 20%\n`;
                instructions += `- Promotional: 20%\n`;
                instructions += `- Engagement: 20%\n\n`;
                instructions += `**Posting Frequency: ${data.frequency || 'Daily'}**\n`;
                break;

            case 'launch-campaign':
                instructions += `### Product Launch Campaign\n`;
                instructions += `Generate complete launch campaign for ${data.product || 'product'}.\n\n`;
                instructions += `**Campaign Phases:**\n`;
                instructions += `1. Pre-launch (teaser content)\n`;
                instructions += `2. Launch day (announcement)\n`;
                instructions += `3. Post-launch (social proof)\n\n`;
                instructions += `**Deliverables per Phase:**\n`;
                instructions += `- Email sequences\n`;
                instructions += `- Social media posts\n`;
                instructions += `- Ad creatives\n`;
                instructions += `- Landing page copy\n`;
                instructions += `- Press release\n`;
                instructions += `- Influencer briefs\n`;
                break;

            default:
                instructions += `Generate comprehensive marketing content with:\n`;
                instructions += `- Clear messaging\n`;
                instructions += `- Strong CTAs\n`;
                instructions += `- Platform optimization\n`;
                instructions += `- Conversion focus\n`;
        }

        return instructions;
    },

    // ==================== BRANDING PROMPT INSTRUCTIONS ====================
    getBrandingPromptInstructions(workflowId, data) {
        let instructions = `## Branding Instructions\n\n`;
        
        switch (workflowId) {
            case 'brand-kit':
                instructions += `### Complete Brand Kit\n`;
                instructions += `Generate full brand identity for ${data.brand_name || 'brand'}.\n\n`;
                instructions += `**Deliverables:**\n`;
                instructions += `1. Logo suite (10 variations)\n`;
                instructions += `2. Color palette (primary, secondary, accent)\n`;
                instructions += `3. Typography system\n`;
                instructions += `4. Brand patterns\n`;
                instructions += `5. Social media templates\n`;
                instructions += `6. Business card design\n`;
                instructions += `7. Email signature\n`;
                instructions += `8. Presentation template\n\n`;
                instructions += `**Brand Personality: ${data.personality || 'Professional'}**\n`;
                instructions += `**Industry: ${data.industry || 'General'}**\n`;
                break;

            case 'pitch-deck':
                instructions += `### Investor Pitch Deck\n`;
                instructions += `Generate investor-ready pitch deck.\n\n`;
                instructions += `**Slide Structure:**\n`;
                instructions += `1. Title/Hook\n`;
                instructions += `2. Problem\n`;
                instructions += `3. Solution\n`;
                instructions += `4. Market Size\n`;
                instructions += `5. Business Model\n`;
                instructions += `6. Traction\n`;
                instructions += `7. Competition\n`;
                instructions += `8. Team\n`;
                instructions += `9. Financials\n`;
                instructions += `10. Ask\n\n`;
                instructions += `**Stage: ${data.stage || 'Seed'}**\n`;
                break;

            default:
                instructions += `Generate professional branding assets with:\n`;
                instructions += `- Consistent visual identity\n`;
                instructions += `- Clear brand messaging\n`;
                instructions += `- Versatile applications\n`;
                instructions += `- Industry-appropriate design\n`;
        }

        return instructions;
    },

    // ==================== UTILITY PROMPT INSTRUCTIONS ====================
    getUtilityPromptInstructions(workflowId, data) {
        let instructions = `## Utility Tool Instructions\n\n`;
        
        switch (workflowId) {
            case 'hashtag-generator':
                instructions += `### Hashtag Generation\n`;
                instructions += `Generate 150 hashtags in 5 strategic sets.\n\n`;
                instructions += `**Set Structure:**\n`;
                instructions += `1. High competition (500K+ posts)\n`;
                instructions += `2. Medium competition (100K-500K)\n`;
                instructions += `3. Low competition (10K-100K)\n`;
                instructions += `4. Niche specific\n`;
                instructions += `5. Trending/seasonal\n\n`;
                instructions += `**Platform: ${data.platform || 'Instagram'}**\n`;
                instructions += `**Reach: ${data.reach || 'Global'}**\n`;
                break;

            case 'content-repurposer':
                instructions += `### Content Repurposing\n`;
                instructions += `Transform content for multiple platforms.\n\n`;
                instructions += `**Output Formats:**\n`;
                instructions += `1. Twitter thread\n`;
                instructions += `2. LinkedIn post\n`;
                instructions += `3. Instagram carousel\n`;
                instructions += `4. TikTok script\n`;
                instructions += `5. Email newsletter\n`;
                instructions += `6. Blog post\n`;
                instructions += `7. YouTube script\n`;
                instructions += `8. Podcast talking points\n`;
                instructions += `9. Infographic outline\n`;
                instructions += `10. Quote graphics\n`;
                break;

            default:
                instructions += `Generate optimized content with:\n`;
                instructions += `- Platform best practices\n`;
                instructions += `- SEO optimization\n`;
                instructions += `- Engagement focus\n`;
                instructions += `- Clear formatting\n`;
        }

        return instructions;
    },

    // ==================== COMPLETE PACKAGE INSTRUCTIONS ====================
    getCompletePromptInstructions(workflowId, data) {
        let instructions = `## Complete Package Instructions\n\n`;
        instructions += `Generate comprehensive content package including ALL content types.\n\n`;
        
        instructions += `**Text Content:**\n`;
        instructions += `- 10 blog posts/articles\n`;
        instructions += `- 50 social media captions\n`;
        instructions += `- 20 email templates\n`;
        instructions += `- 10 ad copy variations\n\n`;
        
        instructions += `**Image Content:**\n`;
        instructions += `- 30 social media graphics\n`;
        instructions += `- 10 carousel sets\n`;
        instructions += `- 20 story templates\n`;
        instructions += `- 10 ad creatives\n\n`;
        
        instructions += `**Video Content:**\n`;
        instructions += `- 10 short-form video scripts\n`;
        instructions += `- 5 long-form video outlines\n`;
        instructions += `- 20 thumbnail designs\n\n`;
        
        instructions += `**Audio Content:**\n`;
        instructions += `- 5 podcast episode outlines\n`;
        instructions += `- 10 voiceover scripts\n`;
        instructions += `- Music recommendations\n\n`;
        
        instructions += `**Quantity: ${data.quantity || 'Standard (5 each)'}**\n`;
        instructions += `**Platforms: ${data.platforms || 'All'}**\n`;

        return instructions;
    },

    // ==================== COPY PROMPT ====================
    copyPrompt() {
        if (!this.generatedPrompt) return;
        
        navigator.clipboard.writeText(this.generatedPrompt).then(() => {
            if (typeof showToast !== 'undefined') {
                showToast('Prompt copied to clipboard! 📋', 'success');
            }
        }).catch(err => {
            console.error('Failed to copy:', err);
            if (typeof showToast !== 'undefined') {
                showToast('Failed to copy prompt', 'error');
            }
        });
    },

    // ==================== OPEN IN GOOGLE OPAL ====================
    openInOpal() {
        if (!this.generatedPrompt) return;
        
        // Encode the prompt for URL
        const encodedPrompt = encodeURIComponent(this.generatedPrompt);
        
        // Open Google AI Studio (Opal)
        const opalUrl = `https://aistudio.google.com/app/prompts/new_chat?prompt=${encodedPrompt}`;
        window.open(opalUrl, '_blank');
        
        if (typeof showToast !== 'undefined') {
            showToast('Opening in Google AI Studio... 🚀', 'success');
        }
    },

    // ==================== SAVE TO CONTENT HUB ====================
    saveToHub() {
        if (!this.generatedPrompt || typeof DB === 'undefined') return;
        
        const workflow = this.workflows[this.currentWorkflow];
        const newContent = {
            id: Date.now().toString(),
            title: `${workflow.name} - Generated Prompt`,
            contentType: 'prompt',
            content: this.generatedPrompt,
            status: 'draft',
            createdAt: new Date().toISOString(),
            source: 'magic-studio'
        };
        
        DB.content.add(newContent);
        
        if (typeof showToast !== 'undefined') {
            showToast('Saved to Content Hub! 💾', 'success');
        }
    },

    // ==================== LOAD FROM TEMP (Content Hub Integration) ====================
    loadFromTemp() {
        const tempData = localStorage.getItem('magicStudioTempContent');
        if (!tempData) return;
        
        try {
            const data = JSON.parse(tempData);
            this.loadedContent = {
                title: data.title || '',
                content: data.content || '',
                contentType: data.contentType || 'text_article'
            };
            
            // Show loaded content indicator
            const loadedDiv = document.getElementById('magic-loaded-content');
            if (loadedDiv) {
                loadedDiv.style.display = 'block';
                document.getElementById('magic-loaded-title').textContent = data.title || 'Content from Generator';
            }
            
            // Clear temp storage
            localStorage.removeItem('magicStudioTempContent');
            
            if (typeof showToast !== 'undefined') {
                showToast('Content loaded from Generator! Select a workflow to enhance it.', 'success');
            }
        } catch (e) {
            console.error('Failed to load temp content:', e);
        }
    },

    // ==================== SEND TO CONTENT HUB ====================
    sendToContentHub(workflowId) {
        const workflow = this.workflows[workflowId];
        if (!workflow || !this.generatedPrompt) return;
        
        // Open Content Hub editor with pre-filled data
        if (typeof ContentHubUltra !== 'undefined') {
            ContentHubUltra.openFullEditor(null);
            
            setTimeout(() => {
                const titleInput = document.getElementById('editor-title');
                const contentInput = document.getElementById('editor-content');
                
                if (titleInput) titleInput.value = `${workflow.name} - Generated`;
                if (contentInput) contentInput.value = this.generatedPrompt;
            }, 100);
        }
        
        this.closeWorkflow();
        navigateTo('content-hub');
    },

    // ==================== GET STATS ====================
    getStats() {
        return {
            totalWorkflows: Object.keys(this.workflows).length,
            categories: this.categories.length,
            textWorkflows: Object.values(this.workflows).filter(w => w.category === 'text').length,
            imageWorkflows: Object.values(this.workflows).filter(w => w.category === 'image').length,
            videoWorkflows: Object.values(this.workflows).filter(w => w.category === 'video').length,
            audioWorkflows: Object.values(this.workflows).filter(w => w.category === 'audio').length,
            marketingWorkflows: Object.values(this.workflows).filter(w => w.category === 'marketing').length,
            brandingWorkflows: Object.values(this.workflows).filter(w => w.category === 'branding').length,
            utilityWorkflows: Object.values(this.workflows).filter(w => w.category === 'utility').length,
            completeWorkflows: Object.values(this.workflows).filter(w => w.category === 'complete').length,
            popularWorkflows: Object.values(this.workflows).filter(w => w.popular).length,
            proWorkflows: Object.values(this.workflows).filter(w => w.isPro).length
        };
    }
};

// ==================== ALIAS FOR BACKWARD COMPATIBILITY ====================
const MagicStudio = MagicStudioUltra;

// ==================== AUTO-INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('magic-studio-grid')) {
        MagicStudioUltra.init();
    }
});

// Log stats on load
console.log('🎨 Magic Studio Ultra Loaded!');
console.log('📊 Stats:', MagicStudioUltra.getStats());
