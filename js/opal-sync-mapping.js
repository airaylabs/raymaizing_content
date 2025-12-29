/**
 * Google Opal Sync Mapping
 * Maps Magic Studio workflows to Google Opal workflow files
 * 
 * Workflow files location: T:\Second Brain\business space\raycorp\creative raycorp\google opal\workflows\
 * Total workflows: 133
 */

const OpalSyncMapping = {
    // Base path to workflow files (relative from google opal folder)
    workflowsPath: '../google opal/workflows/',
    
    // Mapping: Magic Studio ID -> Opal Workflow File
    mapping: {
        // ═══════════════════════════════════════════════════════════════
        // 📝 TEXT GENERATION (01-35)
        // ═══════════════════════════════════════════════════════════════
        'seo-article-pro': '01-seo-article-generator.txt',
        'viral-thread': '02-viral-thread-generator.txt',
        'script-writer': '31-script-writer.txt',
        'hook-generator': '34-hook-generator.txt',
        'caption-generator': '51-caption-generator.txt',
        'blog-post': '52-blog-post-generator.txt',
        'newsletter': '53-newsletter-writer.txt',
        'product-description': '54-product-description-writer.txt',
        'copywriting': '55-copywriting-formula.txt',
        'story-generator': '56-story-generator.txt',
        'linkedin-content': '57-linkedin-content.txt',
        'youtube-seo': '58-youtube-seo.txt',
        'press-release': '59-press-release.txt',
        'faq-generator': '60-faq-generator.txt',
        'testimonial': '47-testimonial-social-proof.txt',
        'quiz-poll': '61-quiz-poll-generator.txt',
        'ebook-outline': '62-ebook-outline.txt',
        'webinar-content': '63-webinar-content.txt',
        'chatbot-script': '64-chatbot-script.txt',
        'sop-generator': '65-sop-documentation.txt',
        'hashtag-generator': '32-hashtag-generator.txt',
        'bio-generator': '33-bio-generator.txt',
        'trend-content': '35-trend-content-generator.txt',
        
        // ═══════════════════════════════════════════════════════════════
        // 🖼️ IMAGE GENERATION (03-24, 66-77)
        // ═══════════════════════════════════════════════════════════════
        'carousel-master': '03-carousel-image-generator.txt',
        'single-image': '04-single-image-10-variations.txt',
        'product-photoshoot': '09-product-photoshoot.txt',
        'social-templates': '66-social-templates.txt',
        'thumbnail-generator': '67-thumbnail-generator.txt',
        'infographic': '68-infographic-generator.txt',
        'meme-generator': '69-meme-generator.txt',
        'quote-graphics': '70-quote-graphics.txt',
        'ad-creative': '26-ad-creative-generator.txt',
        'logo-suite': '29-logo-generator.txt',
        'banner-generator': '71-banner-generator.txt',
        'avatar-generator': '72-avatar-generator.txt',
        'mockup-master': '20-magic-mockup.txt',
        'pattern-generator': '73-pattern-texture.txt',
        'icon-set': '74-icon-set-generator.txt',
        'story-template': '75-story-template.txt',
        'magic-background': '13-magic-background.txt',
        'magic-enhance': '18-magic-enhance.txt',
        'magic-variation': '16-magic-variation.txt',
        'magic-composite': '24-magic-composite.txt',
        'magic-remove': '17-magic-remove.txt',
        'magic-scene': '19-magic-scene.txt',
        'magic-color': '23-magic-color.txt',
        'face-swap': '11-face-swap-creator.txt',
        'magic-model': '14-magic-model-virtual-tryon.txt',
        'magic-relight': '22-magic-relight.txt',
        'magic-resize': '21-magic-resize.txt',
        'fashion-photoshoot': '10-magic-fashion.txt',
        'food-photography': '76-food-photography.txt',
        'real-estate': '77-real-estate-visuals.txt',
        'event-graphics': '102-event-graphics.txt',
        
        // ═══════════════════════════════════════════════════════════════
        // 🎬 VIDEO GENERATION (05-06, 15, 103-133)
        // ═══════════════════════════════════════════════════════════════
        'short-video': '05-short-video-generator.txt',
        'youtube-video': '06-youtube-video-generator.txt',
        'magic-video': '15-magic-video-image-to-video.txt',
        'product-video': '119-product-video.txt',
        'explainer-video': '103-explainer-video.txt',
        'testimonial-video': '130-testimonial-video.txt',
        'social-video-ads': '126-social-video-ads.txt',
        'ugc-video': '133-ugc-video.txt',
        'slideshow-video': '125-slideshow-video.txt',
        'intro-outro': '108-intro-outro.txt',
        'tutorial-video': '132-tutorial-video.txt',
        'promo-video': '120-promo-video.txt',
        'story-video': '128-story-video.txt',
        'gif-creator': '105-gif-creator.txt',
        'live-stream-assets': '113-live-stream-assets.txt',
        
        // ═══════════════════════════════════════════════════════════════
        // 🎙️ AUDIO GENERATION (08, 78-80, 82-86, 109, 115, 123)
        // ═══════════════════════════════════════════════════════════════
        'podcast-creator': '117-podcast-creator.txt',
        'voiceover-generator': '78-voiceover-generator.txt',
        'music-generator': '79-music-generator.txt',
        'sound-effects': '80-sound-effects.txt',
        'jingle-creator': '109-jingle-creator.txt',
        'audiobook-narrator': '86-audiobook-narrator.txt',
        'meditation-audio': '115-meditation-audio.txt',
        'ad-audio': '82-ad-audio.txt',
        'ringtone-creator': '123-ringtone-creator.txt',
        'asmr-creator': '85-asmr-creator.txt',
        
        // ═══════════════════════════════════════════════════════════════
        // 📢 MARKETING TOOLS (25-30, 100-101, 104, 111-112, 121-122, 124)
        // ═══════════════════════════════════════════════════════════════
        'social-media-kit': '25-social-media-kit.txt',
        'content-calendar': '30-content-calendar.txt',
        'email-campaign': '100-email-campaign.txt',
        'landing-page': '111-landing-page.txt',
        'funnel-creator': '104-funnel-creator.txt',
        'competitor-analysis': '41-competitor-analysis-generator.txt',
        'engagement-booster': '101-engagement-booster.txt',
        'launch-campaign': '112-launch-campaign.txt',
        'referral-program': '121-referral-program.txt',
        'retargeting-content': '122-retargeting-content.txt',
        'seasonal-campaign': '124-seasonal-campaign.txt',
        'email-marketing-kit': '27-email-marketing-kit.txt',
        
        // ═══════════════════════════════════════════════════════════════
        // 🎨 BRANDING (12, 36-40, 48, 87-92, 114, 116, 127, 129)
        // ═══════════════════════════════════════════════════════════════
        'brand-kit': '12-brand-kit-generator.txt',
        'brand-strategy': '36-brand-strategy-generator.txt',
        'product-launch': '37-product-launch-campaign.txt',
        'ecommerce-content-kit': '38-ecommerce-content-kit.txt',
        'packaging-design': '39-packaging-design-generator.txt',
        'product-catalog': '40-product-catalog-generator.txt',
        'business-stationery': '48-business-card-stationery.txt',
        'brand-audit': '87-brand-audit.txt',
        'brand-guidelines': '88-brand-guidelines.txt',
        'brand-naming': '90-brand-naming.txt',
        'brand-story': '91-brand-story.txt',
        'brand-voice': '92-brand-voice.txt',
        'media-kit': '114-media-kit.txt',
        'pitch-deck': '116-pitch-deck.txt',
        'startup-kit': '127-startup-kit.txt',
        'tagline-generator': '129-tagline-generator.txt',
        'presentation-generator': '28-presentation-generator.txt',
        
        // ═══════════════════════════════════════════════════════════════
        // 🏭 INDUSTRY-SPECIFIC (42-50)
        // ═══════════════════════════════════════════════════════════════
        'influencer-brief': '42-influencer-brief-generator.txt',
        'umkm-starter-kit': '43-umkm-starter-kit.txt',
        'food-beverage-kit': '44-food-beverage-content-kit.txt',
        'fashion-lookbook': '45-fashion-lookbook-generator.txt',
        'skincare-cosmetic-kit': '46-skincare-cosmetic-kit.txt',
        'testimonial-social-proof': '47-testimonial-social-proof.txt',
        'event-promotion-kit': '49-event-promotion-kit.txt',
        'reseller-dropship-kit': '50-reseller-dropship-kit.txt',
        
        // ═══════════════════════════════════════════════════════════════
        // 📦 COMPLETE PACKAGES (07, 93, 99)
        // ═══════════════════════════════════════════════════════════════
        'complete-content-package': '07-complete-content-package.txt',
        'complete-package': '93-complete-package.txt',
        'ecommerce-kit': '99-ecommerce-kit.txt',
        
        // ═══════════════════════════════════════════════════════════════
        // 🔧 UTILITY TOOLS (81, 83-84, 94-98, 106-107, 110, 118, 131)
        // ═══════════════════════════════════════════════════════════════
        'ab-test-creator': '81-ab-test-creator.txt',
        'affiliate-content': '83-affiliate-content.txt',
        'agency-kit': '84-agency-kit.txt',
        'content-ideas': '94-content-ideas.txt',
        'content-repurposer': '95-content-repurposer.txt',
        'content-summarizer': '96-content-summarizer.txt',
        'crisis-response': '97-crisis-response.txt',
        'cta-generator': '98-cta-generator.txt',
        'grammar-checker': '106-grammar-checker.txt',
        'influencer-kit': '107-influencer-kit.txt',
        'keyword-research': '110-keyword-research.txt',
        'presentation': '118-presentation.txt',
        'translator': '131-translator.txt'
    },

    /**
     * Get workflow file path for a Magic Studio workflow ID
     */
    getWorkflowFile(workflowId) {
        return this.mapping[workflowId] || null;
    },

    /**
     * Get all workflow files that are mapped
     */
    getMappedWorkflows() {
        return Object.entries(this.mapping).map(([studioId, file]) => ({
            studioId,
            file,
            fullPath: this.workflowsPath + file
        }));
    },

    /**
     * Get unmapped workflow files (exist in folder but not in Magic Studio)
     */
    getUnmappedFiles() {
        const mappedFiles = Object.values(this.mapping);
        // These are files that exist but aren't mapped yet
        return [
            '08-podcast-audio-generator.txt', // Mapped to podcast-creator differently
            '89-brand-colors.txt' // Missing file number
        ];
    },

    /**
     * Get sync status
     */
    getSyncStatus() {
        const totalOpalFiles = 133; // Total files in google opal/workflows
        const mappedCount = Object.keys(this.mapping).length;
        
        return {
            totalOpalFiles,
            mappedCount,
            syncPercentage: Math.round((mappedCount / totalOpalFiles) * 100),
            status: mappedCount >= totalOpalFiles * 0.9 ? 'synced' : 'partial'
        };
    },

    /**
     * Generate Opal URL with workflow prompt
     */
    getOpalUrl(workflowId, formData = {}) {
        const baseUrl = 'https://opal.google/';
        const workflowFile = this.getWorkflowFile(workflowId);
        
        if (!workflowFile) {
            return baseUrl;
        }

        // Generate prompt from form data
        const prompt = this.generatePrompt(workflowId, formData);
        if (prompt) {
            return `${baseUrl}?prompt=${encodeURIComponent(prompt)}`;
        }
        
        return baseUrl;
    },

    /**
     * Generate master prompt from form data
     */
    generatePrompt(workflowId, formData) {
        if (!MagicStudioUltra || !MagicStudioUltra.workflows) return null;
        
        const workflow = MagicStudioUltra.workflows[workflowId];
        if (!workflow) return null;

        let prompt = `=== ${workflow.name.toUpperCase()} REQUEST ===\n\n`;

        // Add all field values
        if (workflow.fields) {
            workflow.fields.forEach(field => {
                const value = formData[field.id];
                if (value) {
                    prompt += `${field.label.toUpperCase()}: ${value}\n`;
                }
            });
        }

        prompt += `\nOUTPUT: ${workflow.output || 'Complete package'}\n`;

        return prompt;
    }
};

// Export
if (typeof window !== 'undefined') {
    window.OpalSyncMapping = OpalSyncMapping;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpalSyncMapping;
}
