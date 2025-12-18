/**
 * n8n Workflow Generator
 * Creates complete n8n workflow JSON for automation
 */

const N8NWorkflows = {
    // Base workflow structure
    baseWorkflow: {
        name: '',
        nodes: [],
        connections: {},
        active: false,
        settings: {
            executionOrder: 'v1'
        }
    },

    // ==================== CONTENT GENERATION WORKFLOW ====================
    contentGeneration: {
        name: 'Omnichannel Content Generation Pipeline',
        description: 'Automated content generation with multiple AI providers',
        workflow: {
            "name": "Omnichannel Content Generation",
            "nodes": [
                {
                    "parameters": {},
                    "id": "trigger",
                    "name": "Manual Trigger",
                    "type": "n8n-nodes-base.manualTrigger",
                    "typeVersion": 1,
                    "position": [250, 300]
                },
                {
                    "parameters": {
                        "values": {
                            "string": [
                                { "name": "topic", "value": "={{$json.topic}}" },
                                { "name": "contentType", "value": "={{$json.contentType}}" },
                                { "name": "brandContext", "value": "={{$json.brandContext}}" }
                            ]
                        }
                    },
                    "id": "setInputs",
                    "name": "Set Inputs",
                    "type": "n8n-nodes-base.set",
                    "typeVersion": 2,
                    "position": [450, 300]
                },
                {
                    "parameters": {
                        "url": "https://text.pollinations.ai/",
                        "method": "POST",
                        "sendBody": true,
                        "bodyParameters": {
                            "parameters": [
                                {
                                    "name": "messages",
                                    "value": "=[{\"role\":\"system\",\"content\":\"You are a professional content creator.\"},{\"role\":\"user\",\"content\":\"Create {{$json.contentType}} content about: {{$json.topic}}\\n\\nContext: {{$json.brandContext}}\"}]"
                                }
                            ]
                        }
                    },
                    "id": "generateText",
                    "name": "Generate Text (Pollinations)",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 4,
                    "position": [650, 200]
                },
                {
                    "parameters": {
                        "url": "=https://image.pollinations.ai/prompt/{{encodeURIComponent($json.topic + ' professional social media image')}}?width=1024&height=1024&nologo=true",
                        "method": "GET"
                    },
                    "id": "generateImage",
                    "name": "Generate Image (Pollinations)",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 4,
                    "position": [650, 400]
                },
                {
                    "parameters": {
                        "values": {
                            "string": [
                                { "name": "text", "value": "={{$node['generateText'].json.body}}" },
                                { "name": "imageUrl", "value": "={{$node['generateImage'].json.url}}" },
                                { "name": "contentType", "value": "={{$node['setInputs'].json.contentType}}" },
                                { "name": "createdAt", "value": "={{new Date().toISOString()}}" }
                            ]
                        }
                    },
                    "id": "combineResults",
                    "name": "Combine Results",
                    "type": "n8n-nodes-base.set",
                    "typeVersion": 2,
                    "position": [850, 300]
                },
                {
                    "parameters": {
                        "operation": "append",
                        "sheetId": "YOUR_GOOGLE_SHEET_ID",
                        "range": "Content!A:E",
                        "columns": {
                            "mappingMode": "defineBelow",
                            "value": {
                                "Topic": "={{$json.topic}}",
                                "Content Type": "={{$json.contentType}}",
                                "Generated Text": "={{$json.text}}",
                                "Image URL": "={{$json.imageUrl}}",
                                "Created At": "={{$json.createdAt}}"
                            }
                        }
                    },
                    "id": "saveToSheets",
                    "name": "Save to Google Sheets",
                    "type": "n8n-nodes-base.googleSheets",
                    "typeVersion": 4,
                    "position": [1050, 300]
                }
            ],
            "connections": {
                "Manual Trigger": { "main": [[{ "node": "Set Inputs", "type": "main", "index": 0 }]] },
                "Set Inputs": { "main": [[{ "node": "Generate Text (Pollinations)", "type": "main", "index": 0 }, { "node": "Generate Image (Pollinations)", "type": "main", "index": 0 }]] },
                "Generate Text (Pollinations)": { "main": [[{ "node": "Combine Results", "type": "main", "index": 0 }]] },
                "Generate Image (Pollinations)": { "main": [[{ "node": "Combine Results", "type": "main", "index": 0 }]] },
                "Combine Results": { "main": [[{ "node": "Save to Google Sheets", "type": "main", "index": 0 }]] }
            }
        }
    },

    // ==================== BULK CONTENT WORKFLOW ====================
    bulkContent: {
        name: 'Bulk Content Generation from CSV',
        description: 'Generate content for multiple topics from CSV',
        workflow: {
            "name": "Bulk Content from CSV",
            "nodes": [
                {
                    "parameters": { "path": "bulk-generate", "httpMethod": "POST" },
                    "id": "webhook",
                    "name": "Webhook Trigger",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 1,
                    "position": [250, 300]
                },
                {
                    "parameters": {
                        "operation": "read",
                        "fileId": "={{$json.csvFileId}}"
                    },
                    "id": "readCSV",
                    "name": "Read CSV from Drive",
                    "type": "n8n-nodes-base.googleDrive",
                    "typeVersion": 3,
                    "position": [450, 300]
                },
                {
                    "parameters": {},
                    "id": "splitRows",
                    "name": "Split Into Batches",
                    "type": "n8n-nodes-base.splitInBatches",
                    "typeVersion": 2,
                    "position": [650, 300]
                },
                {
                    "parameters": {
                        "url": "https://text.pollinations.ai/",
                        "method": "POST",
                        "sendBody": true,
                        "bodyParameters": {
                            "parameters": [
                                {
                                    "name": "messages",
                                    "value": "=[{\"role\":\"user\",\"content\":\"Create social media content about: {{$json.topic}}\"}]"
                                }
                            ]
                        }
                    },
                    "id": "generateForEach",
                    "name": "Generate Content",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 4,
                    "position": [850, 300]
                },
                {
                    "parameters": { "batchSize": 10, "options": {} },
                    "id": "waitBatch",
                    "name": "Wait Between Batches",
                    "type": "n8n-nodes-base.wait",
                    "typeVersion": 1,
                    "position": [1050, 300]
                },
                {
                    "parameters": {
                        "operation": "append",
                        "sheetId": "YOUR_SHEET_ID",
                        "range": "Generated!A:D"
                    },
                    "id": "saveResults",
                    "name": "Save All Results",
                    "type": "n8n-nodes-base.googleSheets",
                    "typeVersion": 4,
                    "position": [1250, 300]
                }
            ],
            "connections": {
                "Webhook Trigger": { "main": [[{ "node": "Read CSV from Drive", "type": "main", "index": 0 }]] },
                "Read CSV from Drive": { "main": [[{ "node": "Split Into Batches", "type": "main", "index": 0 }]] },
                "Split Into Batches": { "main": [[{ "node": "Generate Content", "type": "main", "index": 0 }]] },
                "Generate Content": { "main": [[{ "node": "Wait Between Batches", "type": "main", "index": 0 }]] },
                "Wait Between Batches": { "main": [[{ "node": "Save All Results", "type": "main", "index": 0 }]] }
            }
        }
    },

    // ==================== SCHEDULED POSTING WORKFLOW ====================
    scheduledPosting: {
        name: 'Scheduled Social Media Posting',
        description: 'Auto-post content at scheduled times',
        workflow: {
            "name": "Scheduled Social Media Posting",
            "nodes": [
                {
                    "parameters": { "rule": { "interval": [{ "field": "hours", "hoursInterval": 1 }] } },
                    "id": "schedule",
                    "name": "Every Hour Check",
                    "type": "n8n-nodes-base.scheduleTrigger",
                    "typeVersion": 1,
                    "position": [250, 300]
                },
                {
                    "parameters": {
                        "operation": "read",
                        "sheetId": "YOUR_SHEET_ID",
                        "range": "Schedule!A:G",
                        "filters": {
                            "conditions": [
                                { "field": "status", "condition": "equals", "value": "scheduled" },
                                { "field": "scheduledTime", "condition": "lessThanOrEqual", "value": "={{new Date().toISOString()}}" }
                            ]
                        }
                    },
                    "id": "getScheduled",
                    "name": "Get Scheduled Posts",
                    "type": "n8n-nodes-base.googleSheets",
                    "typeVersion": 4,
                    "position": [450, 300]
                },
                {
                    "parameters": { "conditions": { "boolean": [{ "value1": "={{$json.length > 0}}", "value2": true }] } },
                    "id": "checkPosts",
                    "name": "Has Posts?",
                    "type": "n8n-nodes-base.if",
                    "typeVersion": 1,
                    "position": [650, 300]
                },
                {
                    "parameters": {},
                    "id": "splitPosts",
                    "name": "Split Posts",
                    "type": "n8n-nodes-base.splitInBatches",
                    "typeVersion": 2,
                    "position": [850, 200]
                },
                {
                    "parameters": {
                        "conditions": {
                            "string": [
                                { "value1": "={{$json.platform}}", "operation": "equals", "value2": "twitter" }
                            ]
                        }
                    },
                    "id": "routePlatform",
                    "name": "Route by Platform",
                    "type": "n8n-nodes-base.switch",
                    "typeVersion": 2,
                    "position": [1050, 200]
                },
                {
                    "parameters": {
                        "text": "={{$json.caption}}",
                        "additionalFields": {}
                    },
                    "id": "postTwitter",
                    "name": "Post to Twitter",
                    "type": "n8n-nodes-base.twitter",
                    "typeVersion": 2,
                    "position": [1250, 100]
                },
                {
                    "parameters": {
                        "operation": "update",
                        "sheetId": "YOUR_SHEET_ID",
                        "range": "Schedule!A:G",
                        "columns": { "value": { "status": "published", "publishedAt": "={{new Date().toISOString()}}" } }
                    },
                    "id": "updateStatus",
                    "name": "Update Status",
                    "type": "n8n-nodes-base.googleSheets",
                    "typeVersion": 4,
                    "position": [1450, 200]
                }
            ],
            "connections": {
                "Every Hour Check": { "main": [[{ "node": "Get Scheduled Posts", "type": "main", "index": 0 }]] },
                "Get Scheduled Posts": { "main": [[{ "node": "Has Posts?", "type": "main", "index": 0 }]] },
                "Has Posts?": { "main": [[{ "node": "Split Posts", "type": "main", "index": 0 }], []] },
                "Split Posts": { "main": [[{ "node": "Route by Platform", "type": "main", "index": 0 }]] },
                "Route by Platform": { "main": [[{ "node": "Post to Twitter", "type": "main", "index": 0 }]] },
                "Post to Twitter": { "main": [[{ "node": "Update Status", "type": "main", "index": 0 }]] }
            }
        }
    },

    // ==================== MULTI-AI GENERATION WORKFLOW ====================
    multiAIGeneration: {
        name: 'Multi-AI Content Generation',
        description: 'Generate content using multiple AI providers for comparison',
        workflow: {
            "name": "Multi-AI Content Generation",
            "nodes": [
                {
                    "parameters": {},
                    "id": "trigger",
                    "name": "Start",
                    "type": "n8n-nodes-base.manualTrigger",
                    "typeVersion": 1,
                    "position": [250, 300]
                },
                {
                    "parameters": {
                        "url": "https://text.pollinations.ai/",
                        "method": "POST",
                        "sendBody": true,
                        "bodyParameters": {
                            "parameters": [{ "name": "messages", "value": "=[{\"role\":\"user\",\"content\":\"{{$json.prompt}}\"}]" }]
                        }
                    },
                    "id": "pollinations",
                    "name": "Pollinations AI",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 4,
                    "position": [500, 150]
                },
                {
                    "parameters": {
                        "model": "gpt-4",
                        "messages": { "values": [{ "content": "={{$json.prompt}}" }] }
                    },
                    "id": "openai",
                    "name": "OpenAI GPT-4",
                    "type": "@n8n/n8n-nodes-langchain.openAi",
                    "typeVersion": 1,
                    "position": [500, 300]
                },
                {
                    "parameters": {
                        "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "sendBody": true,
                        "bodyParameters": {
                            "parameters": [{ "name": "contents", "value": "=[{\"parts\":[{\"text\":\"{{$json.prompt}}\"}]}]" }]
                        }
                    },
                    "id": "gemini",
                    "name": "Google Gemini",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 4,
                    "position": [500, 450]
                },
                {
                    "parameters": {
                        "url": "https://api.anthropic.com/v1/messages",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "sendBody": true,
                        "bodyParameters": {
                            "parameters": [
                                { "name": "model", "value": "claude-3-sonnet-20240229" },
                                { "name": "messages", "value": "=[{\"role\":\"user\",\"content\":\"{{$json.prompt}}\"}]" }
                            ]
                        }
                    },
                    "id": "claude",
                    "name": "Anthropic Claude",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 4,
                    "position": [500, 600]
                },
                {
                    "parameters": {
                        "values": {
                            "string": [
                                { "name": "pollinations_result", "value": "={{$node['pollinations'].json.body}}" },
                                { "name": "openai_result", "value": "={{$node['openai'].json.text}}" },
                                { "name": "gemini_result", "value": "={{$node['gemini'].json.candidates[0].content.parts[0].text}}" },
                                { "name": "claude_result", "value": "={{$node['claude'].json.content[0].text}}" }
                            ]
                        }
                    },
                    "id": "combine",
                    "name": "Combine All Results",
                    "type": "n8n-nodes-base.set",
                    "typeVersion": 2,
                    "position": [750, 300]
                },
                {
                    "parameters": {
                        "operation": "append",
                        "sheetId": "YOUR_SHEET_ID",
                        "range": "AI_Comparison!A:E"
                    },
                    "id": "save",
                    "name": "Save Comparison",
                    "type": "n8n-nodes-base.googleSheets",
                    "typeVersion": 4,
                    "position": [950, 300]
                }
            ],
            "connections": {
                "Start": { "main": [[{ "node": "Pollinations AI", "type": "main", "index": 0 }, { "node": "OpenAI GPT-4", "type": "main", "index": 0 }, { "node": "Google Gemini", "type": "main", "index": 0 }, { "node": "Anthropic Claude", "type": "main", "index": 0 }]] },
                "Pollinations AI": { "main": [[{ "node": "Combine All Results", "type": "main", "index": 0 }]] },
                "OpenAI GPT-4": { "main": [[{ "node": "Combine All Results", "type": "main", "index": 0 }]] },
                "Google Gemini": { "main": [[{ "node": "Combine All Results", "type": "main", "index": 0 }]] },
                "Anthropic Claude": { "main": [[{ "node": "Combine All Results", "type": "main", "index": 0 }]] },
                "Combine All Results": { "main": [[{ "node": "Save Comparison", "type": "main", "index": 0 }]] }
            }
        }
    }
};

// Function to get workflow JSON
N8NWorkflows.getWorkflowJSON = function(workflowType) {
    const workflow = this[workflowType];
    if (!workflow) return null;
    return JSON.stringify(workflow.workflow, null, 2);
};

// Function to download workflow as JSON file
N8NWorkflows.downloadWorkflow = function(workflowType) {
    const json = this.getWorkflowJSON(workflowType);
    if (!json) return;
    
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `n8n_${workflowType}_workflow.json`;
    a.click();
    URL.revokeObjectURL(url);
};

// Function to copy workflow to clipboard
N8NWorkflows.copyWorkflow = function(workflowType) {
    const json = this.getWorkflowJSON(workflowType);
    if (!json) return;
    
    navigator.clipboard.writeText(json).then(() => {
        if (typeof showToast === 'function') {
            showToast('Workflow JSON copied!', 'success');
        }
    });
};

// Get all workflow names
N8NWorkflows.getAllWorkflowNames = function() {
    return Object.keys(this).filter(key => 
        typeof this[key] === 'object' && 
        this[key].workflow !== undefined
    );
};

// Export
window.N8NWorkflows = N8NWorkflows;
