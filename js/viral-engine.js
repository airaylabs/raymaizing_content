/**
 * Viral Engine Module
 * Handles viral content analysis, hooks, and engagement optimization
 */

const ViralEngine = {
    // Viral formulas database
    formulas: {
        pov: {
            name: 'POV Formula',
            template: 'POV: [situasi relatable yang dialami target audience]',
            examples: [
                'POV: Kamu baru tau kalau [fakta mengejutkan]',
                'POV: Ketika [situasi awkward/lucu]',
                'POV: Kamu finally [achievement]'
            ],
            bestFor: ['Reels', 'TikTok', 'Story']
        },
        listicle: {
            name: 'Listicle Formula',
            template: '[Angka] [hal/tips/cara] yang [benefit/hasil]',
            examples: [
                '5 aplikasi gratis yang bikin kerjaan lebih cepat',
                '3 kesalahan yang bikin konten kamu gak viral',
                '7 habit orang sukses yang jarang dibahas'
            ],
            bestFor: ['Carousel', 'Thread', 'Reels']
        },
        'before-after': {
            name: 'Before-After Formula',
            template: 'Dulu [problem/keadaan lama], sekarang [solution/keadaan baru]',
            examples: [
                'Dulu bikin konten 3 jam, sekarang 30 menit',
                'Dulu followers stuck, sekarang naik 10k/bulan',
                'Dulu bingung mau post apa, sekarang konten ready 1 bulan'
            ],
            bestFor: ['Carousel', 'Reels', 'Testimonial']
        },
        secret: {
            name: 'Secret/Hack Formula',
            template: 'Rahasia [topic] yang [qualifier]',
            examples: [
                'Rahasia algoritma yang creator pro gak mau share',
                'Hack editing yang bikin video kamu cinematic',
                'Secret sauce konten viral yang jarang dibahas'
            ],
            bestFor: ['Reels', 'Thread', 'Single Post']
        },
        challenge: {
            name: 'Challenge Formula',
            template: 'Coba [action] selama [waktu] dan lihat [hasil]',
            examples: [
                'Coba posting setiap hari selama 30 hari',
                'Challenge: reply semua comment selama 1 minggu',
                'Eksperimen: pakai hook ini di 10 konten'
            ],
            bestFor: ['Reels', 'Series Content', 'Story']
        },
        story: {
            name: 'Story Hook Formula',
            template: '[Pembuka dramatis] yang mengubah [aspect]',
            examples: [
                'Cerita ini mengubah cara aku lihat bisnis...',
                'Satu keputusan yang bikin hidupku 180 derajat berbeda',
                'Aku hampir menyerah, sampai...'
            ],
            bestFor: ['Reels', 'Carousel', 'Long Caption']
        }
    },

    // Hook categories
    hookCategories: {
        curiosity: {
            name: 'Curiosity Gap',
            description: 'Membuat penasaran dengan informasi yang belum lengkap',
            hooks: [
                'Ini yang mereka gak mau kamu tau...',
                'Ternyata selama ini kita salah tentang...',
                'Cuma 1% orang yang paham ini...',
                'Rahasia di balik [topic]...',
                'Yang bikin [result] bukan [expected], tapi...'
            ]
        },
        controversy: {
            name: 'Controversial',
            description: 'Pendapat berbeda yang memicu diskusi',
            hooks: [
                'Unpopular opinion: [statement]',
                'Maaf, tapi [common belief] itu salah',
                'Aku bakal di-cancel karena ini, tapi...',
                'Hot take: [controversial statement]',
                'Ini mungkin bikin kamu marah, tapi...'
            ]
        },
        story: {
            name: 'Storytelling',
            description: 'Membuka dengan cerita personal',
            hooks: [
                'Cerita ini mengubah hidup aku...',
                '3 tahun lalu, aku [situation]...',
                'Aku hampir menyerah sampai...',
                'Ini kisah nyata yang jarang aku ceritain...',
                'Plot twist: ternyata...'
            ]
        },
        question: {
            name: 'Question-based',
            description: 'Pertanyaan yang relate dengan audience',
            hooks: [
                'Pernah ngerasa [relatable feeling]?',
                'Kenapa [common problem] selalu terjadi?',
                'Gimana kalau aku bilang [surprising fact]?',
                'Kamu tim [option A] atau [option B]?',
                'Siapa lagi yang [relatable situation]?'
            ]
        },
        shock: {
            name: 'Shock Value',
            description: 'Fakta mengejutkan atau unexpected',
            hooks: [
                'STOP! Jangan [action] sebelum baca ini',
                'Fakta: [shocking statistic]',
                'Ini yang terjadi kalau kamu [action]...',
                'Warning: [topic] bisa [negative outcome]',
                'Aku shock pas tau [revelation]...'
            ]
        },
        relatable: {
            name: 'Relatable',
            description: 'Situasi yang sangat relate dengan audience',
            hooks: [
                'POV: [relatable situation]',
                'Me trying to [relatable struggle]',
                'Ketika [common experience]...',
                'Nobody: ... Me: [relatable behavior]',
                'Raise your hand kalau kamu juga [experience]'
            ]
        }
    },

    // Best posting times (Indonesia timezone)
    postingTimes: {
        instagram: {
            weekday: ['07:00', '12:00', '19:00', '21:00'],
            weekend: ['09:00', '14:00', '20:00'],
            peak: ['19:00-21:00']
        },
        tiktok: {
            weekday: ['07:00', '12:00', '19:00', '22:00'],
            weekend: ['10:00', '14:00', '21:00'],
            peak: ['19:00-22:00']
        },
        twitter: {
            weekday: ['08:00', '12:00', '17:00', '21:00'],
            weekend: ['10:00', '20:00'],
            peak: ['12:00-13:00', '20:00-22:00']
        },
        youtube: {
            weekday: ['14:00', '17:00', '21:00'],
            weekend: ['10:00', '14:00', '20:00'],
            peak: ['17:00-21:00']
        }
    },

    // Viral score calculation
    calculateViralScore(content) {
        let score = 0;
        const text = content.toLowerCase();

        // Check for hook presence (20 points)
        const hookPatterns = [
            /^(pov|stop|rahasia|ternyata|cuma|ini yang|kenapa|gimana)/i,
            /\?$/,
            /^[0-9]+ (tips|cara|hal|kesalahan)/i
        ];
        if (hookPatterns.some(p => p.test(text))) score += 20;

        // Check for emotional triggers (15 points)
        const emotionalWords = ['shock', 'amazing', 'gila', 'keren', 'sedih', 'bahagia', 'marah', 'takut', 'excited'];
        if (emotionalWords.some(w => text.includes(w))) score += 15;

        // Check for CTA presence (15 points)
        const ctaPatterns = ['save', 'share', 'comment', 'follow', 'like', 'tag', 'dm'];
        if (ctaPatterns.some(c => text.includes(c))) score += 15;

        // Check for hashtags (10 points)
        const hashtagCount = (text.match(/#\w+/g) || []).length;
        if (hashtagCount >= 5 && hashtagCount <= 15) score += 10;
        else if (hashtagCount > 0) score += 5;

        // Check for emoji usage (10 points)
        const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
        const emojiCount = (text.match(emojiRegex) || []).length;
        if (emojiCount >= 3 && emojiCount <= 10) score += 10;
        else if (emojiCount > 0) score += 5;

        // Check for line breaks/formatting (10 points)
        const lineBreaks = (content.match(/\n/g) || []).length;
        if (lineBreaks >= 3) score += 10;

        // Check for numbers/statistics (10 points)
        if (/\d+%|\d+x|\d+ (juta|ribu|k|m)/i.test(text)) score += 10;

        // Check for question engagement (10 points)
        if (text.includes('?') && (text.includes('kamu') || text.includes('kalian'))) score += 10;

        return Math.min(score, 100);
    },

    // Get viral score breakdown
    getViralScoreBreakdown(content) {
        const text = content.toLowerCase();
        const breakdown = [];

        // Hook analysis
        const hookPatterns = [
            /^(pov|stop|rahasia|ternyata|cuma|ini yang|kenapa|gimana)/i,
            /\?$/,
            /^[0-9]+ (tips|cara|hal|kesalahan)/i
        ];
        const hasHook = hookPatterns.some(p => p.test(text));
        breakdown.push({
            category: 'Hook',
            score: hasHook ? 20 : 0,
            maxScore: 20,
            feedback: hasHook ? '✅ Hook yang menarik!' : '❌ Tambahkan hook di awal'
        });

        // Emotional triggers
        const emotionalWords = ['shock', 'amazing', 'gila', 'keren', 'sedih', 'bahagia', 'marah', 'takut', 'excited'];
        const hasEmotion = emotionalWords.some(w => text.includes(w));
        breakdown.push({
            category: 'Emotional Trigger',
            score: hasEmotion ? 15 : 0,
            maxScore: 15,
            feedback: hasEmotion ? '✅ Ada emotional trigger' : '❌ Tambahkan kata-kata emosional'
        });

        // CTA
        const ctaPatterns = ['save', 'share', 'comment', 'follow', 'like', 'tag', 'dm'];
        const hasCta = ctaPatterns.some(c => text.includes(c));
        breakdown.push({
            category: 'Call to Action',
            score: hasCta ? 15 : 0,
            maxScore: 15,
            feedback: hasCta ? '✅ CTA ada!' : '❌ Tambahkan CTA di akhir'
        });

        // Hashtags
        const hashtagCount = (text.match(/#\w+/g) || []).length;
        let hashtagScore = 0;
        let hashtagFeedback = '';
        if (hashtagCount >= 5 && hashtagCount <= 15) {
            hashtagScore = 10;
            hashtagFeedback = `✅ ${hashtagCount} hashtag (optimal)`;
        } else if (hashtagCount > 15) {
            hashtagScore = 5;
            hashtagFeedback = `⚠️ ${hashtagCount} hashtag (terlalu banyak)`;
        } else if (hashtagCount > 0) {
            hashtagScore = 5;
            hashtagFeedback = `⚠️ ${hashtagCount} hashtag (kurang)`;
        } else {
            hashtagFeedback = '❌ Tidak ada hashtag';
        }
        breakdown.push({
            category: 'Hashtags',
            score: hashtagScore,
            maxScore: 10,
            feedback: hashtagFeedback
        });

        return breakdown;
    },

    // Get formula by key
    getFormula(key) {
        return this.formulas[key] || null;
    },

    // Get hooks by category
    getHooks(category) {
        return this.hookCategories[category]?.hooks || [];
    },

    // Get best posting time
    getBestPostingTime(platform, isWeekend = false) {
        const times = this.postingTimes[platform];
        if (!times) return this.postingTimes.instagram;
        return isWeekend ? times.weekend : times.weekday;
    },

    // Generate content ideas based on trending
    async getTrendingIdeas(niche) {
        return await ContentTemplates.generateTrendingTopics(niche);
    },

    // Generate viral hooks
    async generateHooks(category, niche) {
        return await ContentTemplates.generateViralHooks(category, niche);
    },

    // Analyze and improve content
    async analyzeAndImprove(content) {
        const score = this.calculateViralScore(content);
        const breakdown = this.getViralScoreBreakdown(content);
        const aiAnalysis = await ContentTemplates.analyzeViralPotential(content);

        return {
            score,
            breakdown,
            aiAnalysis
        };
    }
};
