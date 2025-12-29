/**
 * MAGIC STUDIO FORMS - Complete Workflow Form System
 */

const WorkflowForms = {
    history: JSON.parse(localStorage.getItem('raymAIzing_workflow_history') || '{}'),
    currentWorkflow: null,
    generatedPrompt: '',

    formTemplates: {
        text: {
            fields: [
                { id: 'topic', label: '📝 Topic', type: 'textarea', placeholder: 'What do you want to write about?', required: true },
                { id: 'tone', label: '🎭 Tone', type: 'select', options: ['Professional', 'Casual', 'Educational', 'Inspirational', 'Humorous'] },
                { id: 'audience', label: '👥 Target Audience', type: 'text', placeholder: 'e.g., Young entrepreneurs' },
                { id: 'language', label: '🌐 Language', type: 'select', options: ['Indonesian', 'English', 'Both'] },
                { id: 'length', label: '📏 Length', type: 'select', options: ['Short', 'Medium', 'Long'] }
            ]
        },
        image: {
            fields: [
                { id: 'subject', label: '🎨 Subject', type: 'textarea', placeholder: 'Describe what you want', required: true },
                { id: 'style', label: '🖼️ Style', type: 'select', options: ['Photorealistic', 'Illustration', 'Minimalist', '3D', 'Anime'] },
                { id: 'mood', label: '💫 Mood', type: 'select', options: ['Bright', 'Dark', 'Professional', 'Playful', 'Elegant'] },
                { id: 'colors', label: '🎨 Colors', type: 'text', placeholder: 'e.g., Blue and gold' }
            ]
        },
        video: {
            fields: [
                { id: 'concept', label: '🎬 Concept', type: 'textarea', placeholder: 'Describe your video idea', required: true },
                { id: 'duration', label: '⏱️ Duration', type: 'select', options: ['15s', '30s', '60s', '3-5min', '10+min'] },
                { id: 'format', label: '📱 Format', type: 'select', options: ['Vertical 9:16', 'Square 1:1', 'Horizontal 16:9'] },
                { id: 'hook', label: '🎣 Hook', type: 'text', placeholder: 'Attention grabber' }
            ]
        },
        audio: {
            fields: [
                { id: 'content', label: '🎙️ Content', type: 'textarea', placeholder: 'Describe audio content', required: true },
                { id: 'type', label: '🎵 Type', type: 'select', options: ['Voiceover', 'Podcast', 'Music', 'Sound Effects'] },
                { id: 'mood', label: '💫 Mood', type: 'select', options: ['Upbeat', 'Relaxing', 'Dramatic', 'Inspiring'] }
            ]
        },
        marketing: {
            fields: [
                { id: 'product', label: '📦 Product/Service', type: 'textarea', placeholder: 'Describe your product', required: true },
                { id: 'goal', label: '🎯 Goal', type: 'select', options: ['Awareness', 'Leads', 'Sales', 'Engagement'] },
                { id: 'audience', label: '👥 Audience', type: 'text', placeholder: 'Target audience', required: true },
                { id: 'usp', label: '✨ USP', type: 'text', placeholder: 'What makes you different?' }
            ]
        },
        branding: {
            fields: [
                { id: 'brand_name', label: '🏷️ Brand Name', type: 'text', placeholder: 'Your brand', required: true },
                { id: 'industry', label: '🏢 Industry', type: 'select', options: ['Fashion', 'Food', 'Tech', 'Beauty', 'Health', 'Education'] },
                { id: 'values', label: '💎 Values', type: 'text', placeholder: 'e.g., Innovation, Trust' },
                { id: 'personality', label: '🎭 Personality', type: 'select', options: ['Professional', 'Playful', 'Luxurious', 'Friendly'] }
            ]
        },
        business: {
            fields: [
                { id: 'business_name', label: '🏢 Business', type: 'text', placeholder: 'Business name', required: true },
                { id: 'type', label: '📊 Type', type: 'select', options: ['Startup', 'SME', 'Enterprise', 'Freelancer'] },
                { id: 'objective', label: '🎯 Objective', type: 'textarea', placeholder: 'What do you want to achieve?' }
            ]
        },
        ecommerce: {
            fields: [
                { id: 'product_name', label: '📦 Product', type: 'text', placeholder: 'Product name', required: true },
                { id: 'category', label: '🏷️ Category', type: 'select', options: ['Fashion', 'Electronics', 'Beauty', 'Food', 'Home'] },
                { id: 'features', label: '✨ Features', type: 'textarea', placeholder: 'Key features' },
                { id: 'target', label: '👥 Target', type: 'text', placeholder: 'Target customer' }
            ]
        },
        magic: {
            fields: [
                { id: 'input_desc', label: '📥 Input', type: 'textarea', placeholder: 'Describe your input', required: true },
                { id: 'output_desc', label: '📤 Output', type: 'textarea', placeholder: 'Desired result' },
                { id: 'quality', label: '⭐ Quality', type: 'select', options: ['Standard', 'High', 'Ultra'] }
            ]
        },
        complete: {
            fields: [
                { id: 'project', label: '📁 Project', type: 'text', placeholder: 'Project name', required: true },
                { id: 'description', label: '📝 Description', type: 'textarea', placeholder: 'Project needs', required: true },
                { id: 'timeline', label: '⏰ Timeline', type: 'select', options: ['ASAP', '1 Week', '2 Weeks', '1 Month'] }
            ]
        }
    },

    getFormTemplate(wf) {
        return this.formTemplates[wf.category] || this.formTemplates.text;
    },


    renderForm(wf) {
        this.currentWorkflow = wf;
        const tpl = this.getFormTemplate(wf);
        const hist = this.getWorkflowHistory(wf.id);
        
        return `
            <div class="wf-form-container">
                <p style="color:var(--text-secondary);line-height:1.6;margin-bottom:16px;">${wf.description}</p>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
                    ${wf.tags.map(t => `<span style="padding:6px 14px;background:var(--bg-glass);border-radius:20px;font-size:12px;">${t}</span>`).join('')}
                </div>
                
                <div style="display:grid;gap:16px;">
                    ${tpl.fields.map(f => this.renderField(f)).join('')}
                </div>

                <div style="margin-top:24px;">
                    <button class="btn-generate-main" onclick="WorkflowForms.generatePrompt()" style="width:100%;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        <span>Generate & Enhance Prompt</span>
                    </button>
                </div>

                <div id="wf-prompt-result" style="display:none;margin-top:20px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <label style="font-weight:600;">✨ Generated Prompt</label>
                        <div style="display:flex;gap:8px;">
                            <button class="btn-ghost" onclick="WorkflowForms.copyPrompt()">📋 Copy</button>
                            <button class="btn-ghost" onclick="WorkflowForms.regeneratePrompt()">🔄 Regenerate</button>
                        </div>
                    </div>
                    <textarea id="wf-generated-prompt" style="width:100%;min-height:150px;padding:16px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-primary);font-family:monospace;font-size:13px;"></textarea>
                    
                    <div style="margin-top:16px;padding:16px;background:linear-gradient(135deg,rgba(6,182,212,0.1),rgba(139,92,246,0.1));border-radius:var(--radius-md);border:1px solid var(--border);">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <span style="font-size:20px;">🔗</span>
                            <span style="font-weight:600;">Next: Launch in Google Opal</span>
                        </div>
                        <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Copy the prompt, then click below to open Opal and paste it.</p>
                        <button class="btn-glow" onclick="WorkflowForms.launchOpal()" style="width:100%;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            Launch in Google Opal
                        </button>
                    </div>
                </div>

                ${hist.length > 0 ? `
                <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);">
                    <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
                        <label style="font-weight:600;">📜 History</label>
                        <button class="btn-ghost" onclick="WorkflowForms.clearHistory('${wf.id}')" style="font-size:12px;">Clear</button>
                    </div>
                    <div style="max-height:150px;overflow-y:auto;">
                        ${hist.slice(0,5).map((h,i) => `
                            <div style="padding:10px;background:var(--bg-glass);border-radius:8px;margin-bottom:8px;cursor:pointer;" onclick="WorkflowForms.loadHistory('${wf.id}',${i})">
                                <div style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${h.prompt.substring(0,50)}...</div>
                                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${new Date(h.timestamp).toLocaleDateString('id-ID')}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    },

    renderField(f) {
        const style = 'width:100%;padding:12px;background:var(--bg-glass);border:1px solid var(--border);border-radius:8px;color:var(--text-primary);font-size:14px;';
        if (f.type === 'textarea') {
            return `<div><label style="display:block;margin-bottom:8px;font-weight:500;">${f.label}${f.required ? ' *' : ''}</label><textarea id="wf-${f.id}" placeholder="${f.placeholder||''}" style="${style}min-height:80px;" ${f.required?'required':''}></textarea></div>`;
        } else if (f.type === 'select') {
            return `<div><label style="display:block;margin-bottom:8px;font-weight:500;">${f.label}</label><select id="wf-${f.id}" style="${style}">${f.options.map(o=>`<option value="${o}">${o}</option>`).join('')}</select></div>`;
        }
        return `<div><label style="display:block;margin-bottom:8px;font-weight:500;">${f.label}${f.required ? ' *' : ''}</label><input type="text" id="wf-${f.id}" placeholder="${f.placeholder||''}" style="${style}" ${f.required?'required':''}></div>`;
    },

    collectFormData() {
        const tpl = this.getFormTemplate(this.currentWorkflow);
        const data = {};
        tpl.fields.forEach(f => {
            const el = document.getElementById(`wf-${f.id}`);
            if (el) data[f.id] = el.value;
        });
        return data;
    },

    async generatePrompt() {
        const data = this.collectFormData();
        const wf = this.currentWorkflow;
        const tpl = this.getFormTemplate(wf);
        
        for (const f of tpl.fields) {
            if (f.required && !data[f.id]) {
                showToast(`Please fill ${f.label}`, 'error');
                return;
            }
        }

        const resultDiv = document.getElementById('wf-prompt-result');
        const promptArea = document.getElementById('wf-generated-prompt');
        resultDiv.style.display = 'block';
        promptArea.value = '⏳ Generating...';

        let basePrompt = this.buildPrompt(wf, data);
        
        try {
            const enhanced = await this.enhanceWithAI(basePrompt, wf);
            this.generatedPrompt = enhanced;
            promptArea.value = enhanced;
            this.saveToHistory(wf.id, enhanced, data);
            showToast('Prompt ready! Copy and paste to Opal', 'success');
        } catch (e) {
            promptArea.value = basePrompt;
            this.generatedPrompt = basePrompt;
            showToast('Using basic prompt', 'warning');
        }
    },

    buildPrompt(wf, data) {
        let lines = [`=== ${wf.name.toUpperCase()} ===\n`];
        Object.entries(data).forEach(([k, v]) => {
            if (v && v.trim()) {
                lines.push(`${k.replace(/_/g,' ').toUpperCase()}: ${v}`);
            }
        });
        lines.push(`\n---\nWorkflow: ${wf.name}\nCategory: ${wf.category}`);
        return lines.join('\n');
    },

    async enhanceWithAI(prompt, wf) {
        const res = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: `Enhance this prompt for "${wf.name}" workflow. Make it detailed and professional. Return only the enhanced prompt.` },
                    { role: 'user', content: prompt }
                ],
                model: 'openai',
                temperature: 0.7
            })
        });
        if (!res.ok) throw new Error('AI unavailable');
        return await res.text();
    },

    copyPrompt() {
        const el = document.getElementById('wf-generated-prompt');
        navigator.clipboard.writeText(el.value);
        showToast('Copied!', 'success');
    },

    regeneratePrompt() { this.generatePrompt(); },

    launchOpal() {
        if (this.currentWorkflow?.opalLink) {
            this.copyPrompt();
            window.open(this.currentWorkflow.opalLink, '_blank');
            showToast('Opening Opal... Paste your prompt!', 'success');
        } else {
            showToast('Opal link not available', 'error');
        }
    },

    getWorkflowHistory(id) { return this.history[id] || []; },

    saveToHistory(id, prompt, data) {
        if (!this.history[id]) this.history[id] = [];
        this.history[id].unshift({ prompt, formData: data, timestamp: new Date().toISOString() });
        this.history[id] = this.history[id].slice(0, 10);
        localStorage.setItem('raymAIzing_workflow_history', JSON.stringify(this.history));
    },

    loadHistory(id, idx) {
        const h = this.history[id]?.[idx];
        if (!h) return;
        Object.entries(h.formData).forEach(([k, v]) => {
            const el = document.getElementById(`wf-${k}`);
            if (el) el.value = v;
        });
        document.getElementById('wf-prompt-result').style.display = 'block';
        document.getElementById('wf-generated-prompt').value = h.prompt;
        showToast('History loaded!', 'success');
    },

    clearHistory(id) {
        delete this.history[id];
        localStorage.setItem('raymAIzing_workflow_history', JSON.stringify(this.history));
        showToast('History cleared', 'success');
        if (this.currentWorkflow) MagicStudio.openWorkflow(this.currentWorkflow.id);
    }
};

console.log('✨ Magic Studio Forms loaded');
