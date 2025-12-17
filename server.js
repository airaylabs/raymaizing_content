/**
 * Social Media AI Framework - Local Server
 * Run: node server.js
 * Access: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Parse URL
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found - serve index.html for SPA routing
                fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Server Error');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content);
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log('');
    console.log('🚀 ═══════════════════════════════════════════════════════════');
    console.log('   SOCIAL MEDIA AI FRAMEWORK');
    console.log('   All-in-One Viral Content System');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log(`   🌐 Server running at: http://localhost:${PORT}`);
    console.log('');
    console.log('   📱 Supported Platforms:');
    console.log('      • Instagram (Feed, Reels, Story)');
    console.log('      • TikTok');
    console.log('      • Twitter/X');
    console.log('      • LinkedIn');
    console.log('      • Facebook');
    console.log('      • Blog/Article');
    console.log('      • YouTube Shorts');
    console.log('');
    console.log('   ⚡ Features:');
    console.log('      • One Input → All Platforms');
    console.log('      • AI Content Generation (Pollinations)');
    console.log('      • Viral Optimization');
    console.log('      • Content Calendar');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('   Press Ctrl+C to stop the server');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
});
