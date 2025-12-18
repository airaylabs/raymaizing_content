/**
 * Bulk Create Module
 * Canvas-based template editor with data-driven bulk generation
 */

const BulkCreate = {
    // State
    canvas: null,
    previewCanvas: null,
    currentStep: 1,
    data: [],
    headers: [],
    mappings: {},
    previewIndex: 0,
    generatedImages: [],
    canvasSize: { width: 1080, height: 1080 },
    _clipboard: null,

    // Initialize
    init() {
        this.initCanvas();
        this.setupEventListeners();
        console.log('🎨 Bulk Create initialized');
    },

    // Initialize Fabric.js Canvas
    initCanvas() {
        const canvasEl = document.getElementById('template-canvas');
        if (!canvasEl) return;

        this.canvas = new fabric.Canvas('template-canvas', {
            width: 540,
            height: 540,
            backgroundColor: '#ffffff',
            preserveObjectStacking: true
        });

        this.canvasSize = { width: 1080, height: 1080 };

        this.canvas.on('selection:created', (e) => this.onObjectSelected(e.selected[0]));
        this.canvas.on('selection:updated', (e) => this.onObjectSelected(e.selected[0]));
        this.canvas.on('selection:cleared', () => this.onSelectionCleared());
        this.canvas.on('object:modified', () => this.updateLayers());
        this.canvas.on('object:added', () => this.updateLayers());
        this.canvas.on('object:removed', () => this.updateLayers());

        this.addDefaultTemplate();
    },

    addDefaultTemplate() {
        const bg = new fabric.Rect({
            left: 0, top: 0, width: 540, height: 540,
            fill: '#f8f9fa', selectable: false, evented: false, name: 'Background'
        });
        this.canvas.add(bg);

        const title = new fabric.IText('Your Title Here', {
            left: 270, top: 200, fontSize: 36, fontFamily: 'Inter',
            fontWeight: 'bold', fill: '#2D3748', originX: 'center', originY: 'center', name: 'Title'
        });
        this.canvas.add(title);

        const subtitle = new fabric.IText('Subtitle or description', {
            left: 270, top: 260, fontSize: 18, fontFamily: 'Inter',
            fill: '#718096', originX: 'center', originY: 'center', name: 'Subtitle'
        });
        this.canvas.add(subtitle);

        this.canvas.renderAll();
        this.updateLayers();
    },

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.canvas) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'Delete' || e.key === 'Backspace') this.deleteSelected();
            if (e.ctrlKey && e.key === 'c') this.copySelected();
            if (e.ctrlKey && e.key === 'v') this.pasteSelected();
        });
    },

    // ==================== ELEMENT OPERATIONS ====================
    addText() {
        const text = new fabric.IText('New Text', {
            left: 270, top: 270, fontSize: 24, fontFamily: 'Inter',
            fill: '#2D3748', originX: 'center', originY: 'center', name: `Text_${Date.now()}`
        });
        this.canvas.add(text);
        this.canvas.setActiveObject(text);
        this.canvas.renderAll();
    },

    changeBackground(type) {
        if (type === 'color') {
            const color = prompt('Enter background color (hex or name):', '#ffffff');
            if (color) {
                const bg = this.canvas.getObjects().find(o => o.name === 'Background');
                if (bg) {
                    bg.set('fill', color);
                    this.canvas.renderAll();
                }
            }
        } else if (type === 'image') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    fabric.Image.fromURL(event.target.result, (img) => {
                        // Remove old background
                        const oldBg = this.canvas.getObjects().find(o => o.name === 'Background');
                        if (oldBg) this.canvas.remove(oldBg);
                        
                        // Scale image to fit canvas
                        const scaleX = this.canvas.width / img.width;
                        const scaleY = this.canvas.height / img.height;
                        img.scale(Math.max(scaleX, scaleY));
                        img.set({
                            left: 0, top: 0,
                            originX: 'left', originY: 'top',
                            selectable: false, evented: false, name: 'Background'
                        });
                        this.canvas.insertAt(img, 0);
                        this.canvas.renderAll();
                    });
                };
                reader.readAsDataURL(file);
            };
            input.click();
        }
    },

    addImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                fabric.Image.fromURL(event.target.result, (img) => {
                    const scale = Math.min(200 / img.width, 200 / img.height);
                    img.scale(scale);
                    img.set({ left: 270, top: 270, originX: 'center', originY: 'center', name: `Image_${Date.now()}` });
                    this.canvas.add(img);
                    this.canvas.setActiveObject(img);
                    this.canvas.renderAll();
                });
            };
            reader.readAsDataURL(file);
        };
        input.click();
    },

    addShape(type) {
        let shape;
        const props = { left: 270, top: 270, fill: '#5B9A94', originX: 'center', originY: 'center' };
        
        if (type === 'rect') shape = new fabric.Rect({ ...props, width: 100, height: 100, name: `Rect_${Date.now()}` });
        else if (type === 'circle') shape = new fabric.Circle({ ...props, radius: 50, name: `Circle_${Date.now()}` });
        else if (type === 'triangle') shape = new fabric.Triangle({ ...props, width: 100, height: 100, name: `Triangle_${Date.now()}` });
        
        if (shape) {
            this.canvas.add(shape);
            this.canvas.setActiveObject(shape);
            this.canvas.renderAll();
        }
    },

    bringForward() {
        const obj = this.canvas.getActiveObject();
        if (obj) { this.canvas.bringForward(obj); this.updateLayers(); }
    },

    sendBackward() {
        const obj = this.canvas.getActiveObject();
        if (obj) { this.canvas.sendBackwards(obj); this.updateLayers(); }
    },

    deleteSelected() {
        const obj = this.canvas.getActiveObject();
        if (obj && obj.name !== 'Background') {
            delete this.mappings[obj.name];
            this.canvas.remove(obj);
            this.canvas.renderAll();
        }
    },

    copySelected() {
        const obj = this.canvas.getActiveObject();
        if (obj) obj.clone((cloned) => { this._clipboard = cloned; });
    },

    pasteSelected() {
        if (!this._clipboard) return;
        this._clipboard.clone((cloned) => {
            cloned.set({ left: cloned.left + 20, top: cloned.top + 20, name: `${cloned.name}_copy` });
            this.canvas.add(cloned);
            this.canvas.setActiveObject(cloned);
            this.canvas.renderAll();
        });
    },

    // ==================== CANVAS SIZE ====================
    changeCanvasSize(value) {
        let width, height;
        if (value === 'custom') {
            width = parseInt(prompt('Width (px):', '1080')) || 1080;
            height = parseInt(prompt('Height (px):', '1080')) || 1080;
        } else {
            [width, height] = value.split('x').map(Number);
        }
        this.canvasSize = { width, height };
        const scale = Math.min(540 / width, 540 / height);
        this.canvas.setDimensions({ width: width * scale, height: height * scale });
        const bg = this.canvas.getObjects().find(o => o.name === 'Background');
        if (bg) bg.set({ width: width * scale, height: height * scale });
        this.canvas.renderAll();
        showToast(`Canvas: ${width}×${height}`, 'success');
    },

    // ==================== PROPERTIES PANEL ====================
    onObjectSelected(obj) {
        if (!obj) return;
        this.renderProperties(obj);
        this.highlightLayer(obj.name);
    },

    onSelectionCleared() {
        const el = document.getElementById('properties-content');
        if (el) el.innerHTML = '<p class="placeholder-text">Select an element to edit</p>';
        this.highlightLayer(null);
    },


    renderProperties(obj) {
        const container = document.getElementById('properties-content');
        if (!container) return;
        const isText = obj.type === 'i-text' || obj.type === 'text';
        const mapping = this.mappings[obj.name];

        let html = `
            <div class="property-group">
                <label>Name</label>
                <input type="text" value="${obj.name || ''}" onchange="BulkCreate.updateProperty('name', this.value)">
            </div>
            <div class="property-group">
                <label>Position (X, Y)</label>
                <div class="property-row">
                    <input type="number" value="${Math.round(obj.left)}" onchange="BulkCreate.updateProperty('left', parseFloat(this.value))">
                    <input type="number" value="${Math.round(obj.top)}" onchange="BulkCreate.updateProperty('top', parseFloat(this.value))">
                </div>
            </div>`;

        if (isText) {
            html += `
                <div class="property-group">
                    <label>Font Size</label>
                    <input type="number" value="${obj.fontSize}" onchange="BulkCreate.updateProperty('fontSize', parseFloat(this.value))">
                </div>
                <div class="property-group">
                    <label>Font Family</label>
                    <select onchange="BulkCreate.updateProperty('fontFamily', this.value)">
                        ${['Inter','Arial','Helvetica','Georgia','Verdana'].map(f => 
                            `<option value="${f}" ${obj.fontFamily===f?'selected':''}>${f}</option>`).join('')}
                    </select>
                </div>
                <div class="property-group">
                    <label>Text Color</label>
                    <input type="color" value="${obj.fill || '#000000'}" onchange="BulkCreate.updateProperty('fill', this.value)">
                </div>`;
        } else if (obj.type !== 'image') {
            html += `
                <div class="property-group">
                    <label>Fill Color</label>
                    <input type="color" value="${obj.fill || '#5B9A94'}" onchange="BulkCreate.updateProperty('fill', this.value)">
                </div>`;
        }

        if (this.headers.length > 0) {
            html += `
                <div class="property-group">
                    <label>Connect to Data</label>
                    <select onchange="BulkCreate.connectData('${obj.name}', this.value)">
                        <option value="">-- Not connected --</option>
                        ${this.headers.map(h => `<option value="${h}" ${mapping===h?'selected':''}>${h}</option>`).join('')}
                    </select>
                </div>`;
        }

        html += `<button class="btn-connect-data" onclick="BulkCreate.goToStep(2)">📊 Setup Data</button>`;
        container.innerHTML = html;
    },

    updateProperty(prop, value) {
        const obj = this.canvas.getActiveObject();
        if (!obj) return;
        obj.set(prop, value);
        this.canvas.renderAll();
        if (prop === 'name') this.updateLayers();
    },

    // ==================== LAYERS ====================
    updateLayers() {
        const container = document.getElementById('layers-list');
        if (!container) return;
        const objects = this.canvas.getObjects().filter(o => o.name !== 'Background').reverse();
        container.innerHTML = objects.map(obj => {
            const icon = { 'i-text': 'T', 'text': 'T', 'image': '🖼', 'rect': '▢', 'circle': '○', 'triangle': '△' }[obj.type] || '◇';
            const connected = this.mappings[obj.name];
            return `<div class="layer-item ${connected ? 'connected' : ''}" onclick="BulkCreate.selectLayer('${obj.name}')">
                <span class="layer-icon">${icon}</span>
                <span class="layer-name">${obj.name}</span>
                ${connected ? `<span class="layer-connected">${connected}</span>` : ''}
            </div>`;
        }).join('');
    },

    selectLayer(name) {
        const obj = this.canvas.getObjects().find(o => o.name === name);
        if (obj) { this.canvas.setActiveObject(obj); this.canvas.renderAll(); }
    },

    highlightLayer(name) {
        document.querySelectorAll('.layer-item').forEach(el => {
            el.classList.toggle('selected', el.textContent.includes(name));
        });
    },

    // ==================== TEMPLATE SAVE/LOAD ====================
    saveTemplate() {
        const data = { canvasSize: this.canvasSize, template: this.canvas.toJSON(['name']), mappings: this.mappings };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        saveAs(blob, `template_${Date.now()}.json`);
        showToast('Template saved!', 'success');
    },

    loadTemplate() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.canvasSize) this.canvasSize = data.canvasSize;
                    if (data.template) this.canvas.loadFromJSON(data.template, () => { this.canvas.renderAll(); this.updateLayers(); });
                    if (data.mappings) this.mappings = data.mappings;
                    showToast('Template loaded!', 'success');
                } catch (err) { showToast('Invalid template file', 'error'); }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    // ==================== STEP NAVIGATION ====================
    goToStep(step) {
        this.currentStep = step;
        document.querySelectorAll('.bulk-step').forEach((el, i) => {
            el.classList.toggle('active', i + 1 === step);
            el.classList.toggle('completed', i + 1 < step);
        });
        document.querySelectorAll('.bulk-step-content').forEach((el, i) => {
            el.classList.toggle('active', i + 1 === step);
        });

        if (step === 3) this.initMappingStep();
        if (step === 4) this.initGenerateStep();
    },

    // ==================== DATA SOURCE ====================
    selectDataSource(type) {
        document.querySelectorAll('.data-option').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.data-input-area').forEach(el => el.style.display = 'none');
        
        event.currentTarget.classList.add('active');
        const area = document.getElementById(`data-${type}`);
        if (area) area.style.display = 'block';
    },

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const ext = file.name.split('.').pop().toLowerCase();
        
        if (ext === 'csv') {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    this.headers = results.meta.fields || [];
                    this.data = results.data.filter(row => Object.values(row).some(v => v));
                    this.showDataPreview();
                }
            });
        } else if (['xlsx', 'xls'].includes(ext)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(sheet);
                if (json.length > 0) {
                    this.headers = Object.keys(json[0]);
                    this.data = json;
                    this.showDataPreview();
                }
            };
            reader.readAsBinaryString(file);
        }
    },

    addColumn() {
        const header = document.getElementById('manual-table-header');
        const th = document.createElement('th');
        th.innerHTML = `<input type="text" value="column${header.children.length + 1}" placeholder="Header">`;
        header.appendChild(th);
        
        document.querySelectorAll('#manual-table-body tr').forEach(row => {
            const td = document.createElement('td');
            td.innerHTML = '<input type="text" placeholder="Value">';
            row.appendChild(td);
        });
    },

    addRow() {
        const tbody = document.getElementById('manual-table-body');
        const colCount = document.getElementById('manual-table-header').children.length;
        const tr = document.createElement('tr');
        for (let i = 0; i < colCount; i++) {
            tr.innerHTML += '<td><input type="text" placeholder="Value"></td>';
        }
        tbody.appendChild(tr);
    },

    clearTable() {
        document.getElementById('manual-table-body').innerHTML = '<tr><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td></tr>';
    },

    applyManualData() {
        this.getManualData();
        showToast('Manual data applied!', 'success');
    },

    getManualData() {
        const headers = Array.from(document.querySelectorAll('#manual-table-header input')).map(i => i.value.trim());
        const rows = Array.from(document.querySelectorAll('#manual-table-body tr')).map(tr => {
            const cells = Array.from(tr.querySelectorAll('input')).map(i => i.value.trim());
            const obj = {};
            headers.forEach((h, i) => obj[h] = cells[i] || '');
            return obj;
        }).filter(row => Object.values(row).some(v => v));
        
        this.headers = headers;
        this.data = rows;
        this.showDataPreview();
    },


    async generateAIData() {
        const prompt = document.getElementById('ai-data-prompt').value;
        const rows = parseInt(document.getElementById('ai-data-rows').value) || 10;
        const columns = document.getElementById('ai-data-columns').value.split(',').map(c => c.trim()).filter(c => c);

        if (!prompt || columns.length === 0) {
            showToast('Please enter prompt and columns', 'warning');
            return;
        }

        showLoading('Generating data with AI...');

        try {
            const aiPrompt = `Generate ${rows} rows of data in JSON array format.
Columns: ${columns.join(', ')}
Context: ${prompt}

Return ONLY a valid JSON array like:
[{"${columns[0]}": "value1", "${columns[1]}": "value2"}, ...]

Generate realistic, varied data. No explanations, just JSON.`;

            const response = await PollinationsAI.generateText(aiPrompt);
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            
            if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0]);
                this.headers = columns;
                this.data = data;
                this.showDataPreview();
                showToast(`Generated ${data.length} rows!`, 'success');
            } else {
                throw new Error('Invalid response');
            }
        } catch (err) {
            console.error(err);
            showToast('Failed to generate data', 'error');
        }

        hideLoading();
    },

    showDataPreview() {
        const preview = document.getElementById('data-preview');
        const table = document.getElementById('data-preview-table');
        const count = document.getElementById('data-row-count');

        if (!this.data.length) {
            preview.style.display = 'none';
            return;
        }

        preview.style.display = 'block';
        count.textContent = `(${this.data.length} rows)`;

        let html = '<thead><tr>' + this.headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
        html += this.data.slice(0, 10).map(row => 
            '<tr>' + this.headers.map(h => `<td>${row[h] || ''}</td>`).join('') + '</tr>'
        ).join('');
        if (this.data.length > 10) html += `<tr><td colspan="${this.headers.length}" style="text-align:center;color:var(--text-muted);">... and ${this.data.length - 10} more rows</td></tr>`;
        html += '</tbody>';

        table.innerHTML = html;
        showToast(`Loaded ${this.data.length} rows with ${this.headers.length} columns`, 'success');
    },

    // ==================== DATA MAPPING ====================
    connectData(elementName, headerName) {
        if (headerName) {
            this.mappings[elementName] = headerName;
        } else {
            delete this.mappings[elementName];
        }
        this.updateLayers();
    },

    initMappingStep() {
        // Initialize preview canvas
        const previewEl = document.getElementById('mapping-preview-canvas');
        if (previewEl && !this.previewCanvas) {
            this.previewCanvas = new fabric.StaticCanvas('mapping-preview-canvas', {
                width: 400,
                height: 400
            });
        }

        this.previewIndex = 0;
        this.renderMappingList();
        this.updatePreview();
    },

    renderMappingList() {
        const container = document.getElementById('mapping-list');
        if (!container) return;

        const objects = this.canvas.getObjects().filter(o => o.name !== 'Background');
        
        container.innerHTML = objects.map(obj => {
            const icon = { 'i-text': 'T', 'text': 'T', 'image': '🖼', 'rect': '▢', 'circle': '○' }[obj.type] || '◇';
            const mapping = this.mappings[obj.name] || '';
            const isConnected = !!mapping;

            return `
                <div class="mapping-item ${isConnected ? 'connected' : ''}">
                    <span class="mapping-item-icon">${icon}</span>
                    <span class="mapping-item-name">${obj.name}</span>
                    <select onchange="BulkCreate.connectData('${obj.name}', this.value); BulkCreate.updatePreview();">
                        <option value="">-- Select --</option>
                        ${this.headers.map(h => `<option value="${h}" ${mapping === h ? 'selected' : ''}>${h}</option>`).join('')}
                    </select>
                </div>
            `;
        }).join('');
    },

    updatePreview() {
        if (!this.previewCanvas || !this.data.length) return;

        const row = this.data[this.previewIndex];
        document.getElementById('preview-index').textContent = `Row ${this.previewIndex + 1} of ${this.data.length}`;

        // Clone main canvas to preview
        const json = this.canvas.toJSON(['name']);
        this.previewCanvas.loadFromJSON(json, () => {
            // Apply data mappings
            this.previewCanvas.getObjects().forEach(obj => {
                const header = this.mappings[obj.name];
                if (header && row[header] !== undefined) {
                    if (obj.type === 'i-text' || obj.type === 'text') {
                        obj.set('text', String(row[header]));
                    }
                }
            });

            // Scale to fit preview
            const scale = Math.min(400 / this.canvasSize.width, 400 / this.canvasSize.height);
            this.previewCanvas.setDimensions({
                width: this.canvasSize.width * scale * 0.5,
                height: this.canvasSize.height * scale * 0.5
            });
            this.previewCanvas.setZoom(scale * 0.5);
            this.previewCanvas.renderAll();
        });
    },

    previewPrev() {
        if (this.previewIndex > 0) {
            this.previewIndex--;
            this.updatePreview();
        }
    },

    previewNext() {
        if (this.previewIndex < this.data.length - 1) {
            this.previewIndex++;
            this.updatePreview();
        }
    },

    // ==================== GENERATION ====================
    initGenerateStep() {
        document.getElementById('summary-total').textContent = this.data.length;
        document.getElementById('summary-size').textContent = `${this.canvasSize.width}×${this.canvasSize.height}`;
        document.getElementById('summary-fields').textContent = Object.keys(this.mappings).length;
    },

    async startGeneration() {
        const batchSize = parseInt(document.getElementById('batch-size').value);
        const format = document.getElementById('output-format').value;
        const genCaption = document.getElementById('gen-caption').checked;
        const saveToHub = document.getElementById('save-to-hub').checked;

        const itemsToGenerate = this.data.slice(0, batchSize);
        this.generatedImages = [];

        const progressEl = document.getElementById('generate-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        progressEl.style.display = 'block';
        document.getElementById('btn-download-zip').style.display = 'none';

        for (let i = 0; i < itemsToGenerate.length; i++) {
            const row = itemsToGenerate[i];
            progressText.textContent = `Generating... ${i + 1}/${itemsToGenerate.length}`;
            progressFill.style.width = `${((i + 1) / itemsToGenerate.length) * 100}%`;

            try {
                const imageData = await this.generateSingleImage(row, format);
                let caption = '';

                if (genCaption) {
                    caption = await this.generateCaption(row);
                }

                this.generatedImages.push({
                    data: imageData,
                    row: row,
                    caption: caption,
                    filename: `design_${i + 1}.${format}`
                });

                if (saveToHub) {
                    this.saveToContentHub(row, imageData, caption, i);
                }
            } catch (err) {
                console.error(`Error generating item ${i + 1}:`, err);
            }

            // Small delay to prevent overwhelming
            await new Promise(r => setTimeout(r, 100));
        }

        progressText.textContent = `Complete! Generated ${this.generatedImages.length} designs`;
        document.getElementById('btn-download-zip').style.display = 'inline-flex';
        showToast(`Generated ${this.generatedImages.length} designs!`, 'success');
    },

    async generateSingleImage(row, format) {
        return new Promise((resolve) => {
            const json = this.canvas.toJSON(['name']);
            
            // Create temp canvas at full resolution
            const tempCanvas = new fabric.StaticCanvas(null, {
                width: this.canvasSize.width,
                height: this.canvasSize.height
            });

            // Calculate scale factor
            const displayScale = this.canvas.width / this.canvasSize.width;
            const exportScale = 1 / displayScale;

            tempCanvas.loadFromJSON(json, () => {
                // Scale all objects to full size
                tempCanvas.getObjects().forEach(obj => {
                    obj.scaleX = (obj.scaleX || 1) * exportScale;
                    obj.scaleY = (obj.scaleY || 1) * exportScale;
                    obj.left = obj.left * exportScale;
                    obj.top = obj.top * exportScale;
                    if (obj.fontSize) obj.fontSize = obj.fontSize * exportScale;

                    // Apply data
                    const header = this.mappings[obj.name];
                    if (header && row[header] !== undefined) {
                        if (obj.type === 'i-text' || obj.type === 'text') {
                            obj.set('text', String(row[header]));
                        }
                    }
                });

                tempCanvas.renderAll();
                const dataUrl = tempCanvas.toDataURL({ format: format, quality: 0.9 });
                resolve(dataUrl);
            });
        });
    },

    async generateCaption(row) {
        try {
            const context = DB.knowledgeBase ? DB.knowledgeBase.getContextString() : '';
            const dataStr = Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(', ');
            
            const prompt = `${context}

Generate a short, engaging social media caption for content with this data:
${dataStr}

Keep it under 150 characters. Include 3-5 relevant hashtags.`;

            return await PollinationsAI.generateText(prompt);
        } catch (err) {
            return '';
        }
    },

    saveToContentHub(row, imageData, caption, index) {
        if (!DB || !DB.content) return;

        const title = Object.values(row)[0] || `Bulk Design ${index + 1}`;
        
        DB.content.add({
            title: title,
            caption: caption,
            platform: 'instagram',
            type: 'post',
            status: 'draft',
            imageUrl: imageData,
            scheduledDate: new Date().toISOString().split('T')[0],
            pillar: '',
            hashtags: ''
        });
    },

    async downloadZip() {
        if (!this.generatedImages.length) {
            showToast('No images to download', 'warning');
            return;
        }

        showLoading('Creating ZIP file...');

        const zip = new JSZip();
        const folder = zip.folder('bulk-designs');

        for (const item of this.generatedImages) {
            const base64 = item.data.split(',')[1];
            folder.file(item.filename, base64, { base64: true });

            if (item.caption) {
                folder.file(item.filename.replace(/\.(png|jpg)$/, '.txt'), item.caption);
            }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `bulk-designs_${Date.now()}.zip`);

        hideLoading();
        showToast('ZIP downloaded!', 'success');
    }
};

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Delay init to ensure canvas element exists
    setTimeout(() => {
        if (document.getElementById('template-canvas')) {
            BulkCreate.init();
        }
    }, 500);
});

// Also init when navigating to bulk-create section
const originalNavigateTo = window.navigateTo;
if (typeof originalNavigateTo === 'function') {
    window.navigateTo = function(section) {
        originalNavigateTo(section);
        if (section === 'bulk-create' && !BulkCreate.canvas) {
            setTimeout(() => BulkCreate.init(), 100);
        }
    };
}
